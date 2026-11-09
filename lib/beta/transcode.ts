"use client";

/**
 * Turns a picked video into a beta clip in the browser, to the app's share
 * spec (`SHARE_VIDEO`): long edge 1280, 2 Mbps, H.264, at most 60 s. Supabase
 * Edge Functions can't run ffmpeg (2 s of CPU), so the device does it, with
 * its hardware encoder through WebCodecs (Mediabunny).
 *
 * Where the browser can't encode H.264, an MP4 or MOV that already fits
 * (≤ 60 s, ≤ 50 MB, no trim needed) goes up as it is; anything else asks for
 * the app or another browser rather than hanging on a progress bar.
 */

export const CLIP_MAX_S = 60;
export const MAX_UPLOAD_BYTES = 50 * 1024 * 1024;
const LONG_EDGE = 1280;
const BITRATE = 2_000_000;

export interface Clip {
  video: Blob;
  poster: Blob;
  width: number;
  height: number;
  durationMs: number;
  /** False when the original went up untouched. */
  transcoded: boolean;
}

export class ClipError extends Error {
  constructor(
    readonly code: "unsupported" | "too_big" | "unreadable" | "canceled",
    message?: string,
  ) {
    super(message ?? code);
  }
}

/** A frame at `at` seconds as a JPEG, plus the video's real size and length. */
export async function probe(
  blob: Blob,
  at = 0.1,
): Promise<{ poster: Blob; width: number; height: number; duration: number }> {
  const url = URL.createObjectURL(blob);
  const video = document.createElement("video");

  try {
    video.muted = true;
    video.playsInline = true;
    video.preload = "auto";
    // In the page (out of sight) and load() called: iOS webviews such as
    // Instagram's otherwise may never load a detached video, and the pick
    // would wait forever.
    video.setAttribute("aria-hidden", "true");
    video.style.cssText =
      "position:fixed;left:-9999px;top:0;width:2px;height:2px;opacity:0;pointer-events:none";
    document.body.appendChild(video);
    video.src = url;
    video.load();
    await whenVideo(video, "loadedmetadata");
    const duration = video.duration;

    // iOS loads no frames without a gesture, so a seek never lands; a muted
    // inline play (allowed) makes it load them.
    // Bounded: a play() WebKit leaves pending must not hang the upload.
    await Promise.race([
      video.play().catch(() => undefined),
      new Promise((resolve) => setTimeout(resolve, 3000)),
    ]);
    video.pause();
    video.currentTime = Math.min(at, Math.max(0, duration - 0.05));
    await whenVideo(video, "seeked");
    const w = video.videoWidth;
    const h = video.videoHeight;
    const scale = Math.min(1, 720 / Math.max(w, h));
    const canvas = document.createElement("canvas");

    canvas.width = Math.round(w * scale);
    canvas.height = Math.round(h * scale);
    canvas
      .getContext("2d")!
      .drawImage(video, 0, 0, canvas.width, canvas.height);
    const poster = await new Promise<Blob>((resolve, reject) =>
      canvas.toBlob(
        (b) => (b ? resolve(b) : reject(new ClipError("unreadable"))),
        "image/jpeg",
        0.82,
      ),
    );

    return { poster, width: w, height: h, duration };
  } finally {
    video.pause();
    video.removeAttribute("src");
    video.load();
    video.remove();
    URL.revokeObjectURL(url);
  }
}

/**
 * Just a video's size and length, from its metadata: what picking needs for
 * the trim step. No frame is decoded, so it works where seeking doesn't
 * (iOS before any playback).
 */
export async function videoInfo(
  blob: Blob,
): Promise<{ width: number; height: number; duration: number }> {
  const url = URL.createObjectURL(blob);
  const video = document.createElement("video");

  try {
    video.muted = true;
    video.playsInline = true;
    video.preload = "metadata";
    video.setAttribute("aria-hidden", "true");
    video.style.cssText =
      "position:fixed;left:-9999px;top:0;width:2px;height:2px;opacity:0;pointer-events:none";
    document.body.appendChild(video);
    video.src = url;
    video.load();
    await whenVideo(video, "loadedmetadata");
    if (!Number.isFinite(video.duration) || video.duration <= 0) {
      throw new ClipError("unreadable");
    }

    return {
      width: video.videoWidth,
      height: video.videoHeight,
      duration: video.duration,
    };
  } finally {
    video.remove();
    URL.revokeObjectURL(url);
  }
}

/** How long reading a picked video may take before we say it can't be read. */
const READ_TIMEOUT_MS = 15_000;

/** The video fires `event`, or it errors or takes too long: then it's unreadable. */
function whenVideo(
  video: HTMLVideoElement,
  event: "loadedmetadata" | "seeked",
) {
  return new Promise<void>((resolve, reject) => {
    const done = (ok: boolean) => {
      clearTimeout(timer);
      video.removeEventListener(event, onEvent);
      video.removeEventListener("error", onError);
      if (ok) resolve();
      else reject(new ClipError("unreadable"));
    };
    const onEvent = () => done(true);
    const onError = () => done(false);
    const timer = setTimeout(() => done(false), READ_TIMEOUT_MS);

    video.addEventListener(event, onEvent);
    video.addEventListener("error", onError);
  });
}

/** Can this browser make the clip itself? Checked before the person trims. */
export async function canTranscode() {
  if (typeof VideoEncoder === "undefined") return false;
  try {
    const { canEncodeVideo } = await import("mediabunny");

    return await canEncodeVideo("avc", {
      width: 720,
      height: LONG_EDGE,
      bitrate: BITRATE,
    });
  } catch {
    return false;
  }
}

export async function makeClip(
  file: File,
  range: { start: number; end: number },
  onProgress: (p: number) => void,
  signal: AbortSignal,
): Promise<Clip> {
  const length = range.end - range.start;
  // Cancel can land during any await, not only the encode itself.
  const check = () => {
    if (signal.aborted) throw new ClipError("canceled");
  };

  const encodable = await canTranscode();

  check();
  if (encodable) {
    const mb = await import("mediabunny");
    const input = new mb.Input({
      source: new mb.BlobSource(file),
      formats: mb.ALL_FORMATS,
    });
    const track = await input.getPrimaryVideoTrack();

    if (!track) throw new ClipError("unreadable");
    const portrait = track.displayHeight > track.displayWidth;
    const longEdge = Math.max(track.displayWidth, track.displayHeight);
    const size = Math.min(LONG_EDGE, longEdge);
    const target = new mb.BufferTarget();
    const output = new mb.Output({
      format: new mb.Mp4OutputFormat({ fastStart: "in-memory" }),
      target,
    });
    const audioOk = await mb.canEncodeAudio("aac").catch(() => false);
    const conversion = await mb.Conversion.init({
      input,
      output,
      tracks: "primary",
      trim: { start: range.start, end: range.end },
      video: {
        ...(portrait ? { height: size } : { width: size }),
        codec: "avc",
        bitrate: BITRATE,
        forceTranscode: true,
      },
      // Climbing beta reads fine without sound where AAC can't be made.
      audio: audioOk ? { codec: "aac", bitrate: 96_000 } : { discard: true },
    });

    check();
    if (!conversion.isValid) throw new ClipError("unsupported");
    conversion.onProgress = (p) => onProgress(p);
    const abort = () => void conversion.cancel();

    signal.addEventListener("abort", abort);
    try {
      await conversion.execute();
    } catch (e) {
      if (signal.aborted) throw new ClipError("canceled");
      throw e instanceof ClipError ? e : new ClipError("unsupported");
    } finally {
      signal.removeEventListener("abort", abort);
    }
    if (!target.buffer) throw new ClipError("unsupported");
    const video = new Blob([target.buffer], { type: "video/mp4" });
    const p = await probe(video);

    check();

    return {
      video,
      poster: p.poster,
      width: p.width,
      height: p.height,
      durationMs: Math.round(p.duration * 1000),
      transcoded: true,
    };
  }

  // No encoder: only a file that already fits, untrimmed, can go as it is.
  const p = await probe(file, range.start + 0.1);
  const whole = range.start < 0.25 && p.duration - range.end < 0.25;

  if (
    !whole ||
    p.duration > CLIP_MAX_S + 0.5 ||
    !/^video\/(mp4|quicktime)$/.test(file.type)
  ) {
    throw new ClipError("unsupported");
  }
  if (file.size > MAX_UPLOAD_BYTES) throw new ClipError("too_big");
  // Passed through unchanged, so it must already play everywhere: H.264
  // video (an iPhone's HEVC would not play in many browsers).
  const mb = await import("mediabunny");
  const input = new mb.Input({
    source: new mb.BlobSource(file),
    formats: mb.ALL_FORMATS,
  });
  const track = await input.getPrimaryVideoTrack().catch(() => null);

  if (!track || track.codec !== "avc") throw new ClipError("unsupported");
  check();
  onProgress(1);

  return {
    video: new Blob([file], { type: "video/mp4" }),
    poster: p.poster,
    width: p.width,
    height: p.height,
    durationMs: Math.round(Math.min(length, p.duration) * 1000),
    transcoded: false,
  };
}
