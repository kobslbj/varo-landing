"use client";

import { Modal } from "@heroui/react";
import { track } from "@vercel/analytics";
import clsx from "clsx";
import { useEffect, useState } from "react";

import { siteConfig } from "@/config/site";
import { supabaseBrowser } from "@/lib/supabase/browser";

type Kind = "bug" | "idea";

const COPY = {
  "zh-TW": {
    open: "意見 / 回報問題",
    title: "跟 VARO 說",
    lead: "每一則我們都會看。",
    kinds: {
      bug: { label: "回報問題", hint: "哪裡壞了、看起來怪怪的" },
      idea: { label: "給意見", hint: "想要的功能、哪裡可以更好" },
    },
    placeholder: {
      bug: "例如：在 Slab 選了 2 號牆，下面的路線沒有變。",
      idea: "例如：希望能存下想爬的路線。",
    },
    contact: "想收到回覆？留 email 或 IG（選填）",
    page: "會一起附上你正在看的這一頁",
    as: (name: string) => `以 ${name} 送出`,
    send: "送出",
    sending: "送出中…",
    doneTitle: "收到了，謝謝！",
    doneBody: "我們會盡快看。有留聯絡方式的話，回覆會寄給你。",
    close: "關閉",
    tooMany: "現在送不出去，過一會兒再試，或直接寄信到",
    failed: "沒有送出去。再試一次，或直接寄信到",
  },
  en: {
    open: "Feedback / report a bug",
    title: "Tell VARO",
    lead: "We read every one.",
    kinds: {
      bug: { label: "Report a bug", hint: "Something broken or odd" },
      idea: {
        label: "Share an idea",
        hint: "A feature, or what could be better",
      },
    },
    placeholder: {
      bug: "e.g. I picked wall 2 on Slab and the routes didn't change.",
      idea: "e.g. I'd like to save routes I want to try.",
    },
    contact: "Want a reply? Leave an email or IG (optional)",
    page: "The page you're on is attached",
    as: (name: string) => `Sending as ${name}`,
    send: "Send",
    sending: "Sending…",
    doneTitle: "Got it, thank you!",
    doneBody: "We'll read it soon. If you left a contact, we'll reply there.",
    close: "Close",
    tooMany: "Can't send right now. Try again in a bit, or email",
    failed: "That didn't send. Try again, or email",
  },
};

const MAX = 2000;

/**
 * A floating button on the beta pages that opens a feedback sheet. Reports go
 * to the app's `app_feedback` table (`submit_web_feedback`), signed in or not,
 * with the page attached, so they land in the same inbox and Telegram feed as
 * the app's.
 */
export function FeedbackButton({ zh }: { zh: boolean }) {
  const c = COPY[zh ? "zh-TW" : "en"];
  const [open, setOpen] = useState(false);
  const [kind, setKind] = useState<Kind>("bug");
  const [message, setMessage] = useState("");
  const [contact, setContact] = useState("");
  const [me, setMe] = useState<string | null>(null);
  const [state, setState] = useState<
    "idle" | "sending" | "done" | "error" | "limited"
  >("idle");

  // Who they are, if signed in on the site (web beta upload uses the same session).
  useEffect(() => {
    if (!open) return;
    let alive = true;

    try {
      supabaseBrowser()
        .auth.getUser()
        .then(
          ({
            data,
          }: {
            data: {
              user: {
                email?: string;
                user_metadata?: Record<string, unknown>;
              } | null;
            };
          }) => {
            const u = data.user;
            const name =
              (u?.user_metadata?.full_name as string | undefined) ??
              u?.email ??
              null;

            if (alive) setMe(u ? name : null);
          },
        )
        .catch(() => alive && setMe(null));
    } catch {
      setMe(null);
    }

    return () => {
      alive = false;
    };
  }, [open]);

  const show = (next: boolean) => {
    setOpen(next);
    if (next) track("beta_feedback_opened");
    // Start fresh after a report went through; keep a draft otherwise.
    if (!next && state === "done") {
      setMessage("");
      setContact("");
      setState("idle");
    }
  };

  const send = async () => {
    const text = message.trim();

    if (!text || state === "sending") return;
    setState("sending");
    try {
      const { error } = await supabaseBrowser().rpc("submit_web_feedback", {
        p_kind: kind,
        p_message: text,
        p_page: `${document.title}\n${window.location.href}`.slice(0, 300),
        p_contact: me ? null : contact.trim() || null,
      });

      if (error) {
        setState(error.message.includes("rate_limited") ? "limited" : "error");

        return;
      }
      track("beta_feedback_sent", { kind });
      setState("done");
    } catch {
      setState("error");
    }
  };

  const email = siteConfig.contactEmail ?? "support@getvaro.app";

  return (
    <>
      <button
        aria-label={c.open}
        className="fixed bottom-4 right-4 z-30 inline-flex size-12 items-center justify-center gap-2 rounded-full border border-line bg-ink-2/95 text-[14px] font-bold sm:h-11 sm:w-auto sm:pl-3.5 sm:pr-4 shadow-[0_6px_24px_rgb(0_0_0/0.14)] backdrop-blur transition-transform hover:-translate-y-0.5 active:translate-y-0 sm:bottom-6 sm:right-6"
        type="button"
        onClick={() => show(true)}
      >
        <ChatGlyph />
        {/* Phones: icon only, so it never covers the page's own buttons. */}
        <span className="hidden sm:inline">{c.open}</span>
      </button>

      <Modal.Backdrop isOpen={open} onOpenChange={show}>
        <Modal.Container placement="auto">
          <Modal.Dialog className="w-full rounded-t-[28px] bg-ink-2 text-cream sm:max-w-[460px] sm:rounded-[28px]">
            <Modal.CloseTrigger aria-label={c.close} />
            {state === "done" ? (
              <div className="flex flex-col items-center px-2 pb-2 pt-6 text-center">
                {/* eslint-disable-next-line @next/next/no-img-element -- the mascot, a small static PNG */}
                <img
                  alt=""
                  className="size-16"
                  height={64}
                  src="/mascot/sloper-lime.png"
                  width={64}
                />
                <Modal.Heading className="mt-4 text-[22px] font-black">
                  {c.doneTitle}
                </Modal.Heading>
                <p className="mt-2 max-w-[22rem] text-[15px] leading-[1.7] text-mute">
                  {c.doneBody}
                </p>
                <button
                  className="mt-6 h-12 w-full rounded-full bg-night text-[15px] font-bold text-day"
                  slot="close"
                  type="button"
                  onClick={() => show(false)}
                >
                  {c.close}
                </button>
              </div>
            ) : (
              <>
                <Modal.Header className="pr-10">
                  <Modal.Heading className="text-[22px] font-black">
                    {c.title}
                  </Modal.Heading>
                  <p className="text-[14px] text-mute">{c.lead}</p>
                </Modal.Header>
                <Modal.Body className="space-y-4">
                  {/* Bug or idea: two big choices, one tap. */}
                  <div className="grid grid-cols-2 gap-2.5" role="radiogroup">
                    {(["bug", "idea"] as const).map((k) => {
                      const on = kind === k;

                      return (
                        <button
                          key={k}
                          aria-checked={on}
                          className={clsx(
                            "relative rounded-2xl border-2 p-3.5 text-left transition-colors",
                            on
                              ? "border-night bg-lime/25"
                              : "border-line bg-ink hover:border-cream/30",
                          )}
                          role="radio"
                          type="button"
                          onClick={() => setKind(k)}
                        >
                          <span aria-hidden className="text-[22px]">
                            {k === "bug" ? "🐞" : "💡"}
                          </span>
                          <span className="mt-1 block text-[15px] font-extrabold">
                            {c.kinds[k].label}
                          </span>
                          <span className="block text-[12px] leading-snug text-mute">
                            {c.kinds[k].hint}
                          </span>
                          {on ? (
                            <span className="absolute right-2.5 top-2.5 grid size-5 place-items-center rounded-full bg-night text-[11px] font-black text-lime">
                              ✓
                            </span>
                          ) : null}
                        </button>
                      );
                    })}
                  </div>

                  <div>
                    <textarea
                      aria-label={c.title}
                      className="block min-h-[132px] w-full resize-y rounded-2xl border border-line bg-ink px-4 py-3 text-[16px] leading-[1.6] outline-none transition-colors placeholder:text-mute/70 focus:border-night"
                      maxLength={MAX}
                      placeholder={c.placeholder[kind]}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                    />
                    <span className="mt-1 flex justify-between px-1 text-[12px] text-mute">
                      <span>{c.page}</span>
                      <span className="tabular">
                        {message.length}/{MAX}
                      </span>
                    </span>
                  </div>

                  {me ? (
                    <p className="flex items-center gap-2 text-[13px] text-mute">
                      <span
                        aria-hidden
                        className="size-2 rounded-full bg-lime-deep"
                      />
                      {c.as(me)}
                    </p>
                  ) : (
                    <input
                      aria-label={c.contact}
                      autoComplete="email"
                      className="block h-12 w-full rounded-2xl border border-line bg-ink px-4 text-[16px] outline-none transition-colors placeholder:text-mute/70 focus:border-night"
                      maxLength={200}
                      placeholder={c.contact}
                      value={contact}
                      onChange={(e) => setContact(e.target.value)}
                    />
                  )}

                  {state === "limited" || state === "error" ? (
                    <p
                      className="rounded-xl bg-hold-red/10 px-3 py-2 text-[13px] font-semibold text-[#b4232a]"
                      role="alert"
                    >
                      {state === "limited" ? (
                        <>
                          {c.tooMany}{" "}
                          <a className="underline" href={`mailto:${email}`}>
                            {email}
                          </a>
                        </>
                      ) : (
                        <>
                          {c.failed}{" "}
                          <a className="underline" href={`mailto:${email}`}>
                            {email}
                          </a>
                        </>
                      )}
                    </p>
                  ) : null}
                </Modal.Body>
                <Modal.Footer>
                  <button
                    className="h-12 w-full rounded-full bg-night text-[15px] font-bold text-day transition-opacity disabled:opacity-40"
                    disabled={!message.trim() || state === "sending"}
                    type="button"
                    onClick={send}
                  >
                    {state === "sending" ? c.sending : c.send}
                  </button>
                </Modal.Footer>
              </>
            )}
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </>
  );
}

function ChatGlyph() {
  return (
    <svg aria-hidden className="size-4" fill="none" viewBox="0 0 16 16">
      <path
        d="M2.5 4.5A1.5 1.5 0 0 1 4 3h8a1.5 1.5 0 0 1 1.5 1.5v5A1.5 1.5 0 0 1 12 11H7l-3 2.5V11a1.5 1.5 0 0 1-1.5-1.5v-5Z"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </svg>
  );
}
