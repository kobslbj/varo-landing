import clsx from "clsx";
import Image from "next/image";

import { ScaledScreen } from "@/components/landing/scaled-screen";

/**
 * A real app screenshot in an iPhone frame. The screenshots are 1206×2622
 * (iPhone 17 Pro), scaled down to 720 wide in /public/shots/app.
 *
 * "orange" is a Cosmic Orange titanium rim with an optional 3D tilt, for
 * the feature sections; "black" is a plain flat frame.
 */
export function PhoneShot({
  src,
  alt,
  className,
  priority,
  tone = "black",
  tilt,
}: {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  tone?: "black" | "orange";
  tilt?: "left" | "right";
}) {
  const screen = (
    <div className="relative overflow-hidden rounded-[12%/5.6%] bg-black">
      <Image
        alt={alt}
        className="block h-auto w-full"
        height={1565}
        priority={priority}
        sizes="(min-width: 1024px) 300px, 60vw"
        src={src}
        width={720}
      />
    </div>
  );

  if (tone === "black")
    return (
      <div
        className={clsx(
          "relative rounded-[15%/7%] bg-night p-[3.2%] shadow-[0_40px_80px_-30px_rgb(0_0_0/0.45),inset_0_0_0_1.5px_#2a2a2a]",
          className,
        )}
      >
        {screen}
      </div>
    );

  return (
    <OrangeFrame className={className} tilt={tilt}>
      {screen}
    </OrangeFrame>
  );
}

/**
 * The Cosmic Orange titanium iPhone around any screen (a screenshot or one
 * of the drawn mock screens), tilted in 3D when `tilt` is set.
 */
export function OrangeFrame({
  children,
  className,
  tilt,
  label,
}: {
  children: React.ReactNode;
  className?: string;
  tilt?: "left" | "right";
  /** Accessible description when the screen inside is decorative. */
  label?: string;
}) {
  return (
    <figure
      aria-label={label}
      className={clsx("m-0 [perspective:1600px]", className)}
    >
      <div
        className={clsx(
          "phone-orange relative rounded-[15.5%/7.2%] p-[1.6%]",
          tilt === "left" &&
            "[transform:rotateY(-14deg)_rotateX(6deg)_rotateZ(1.5deg)]",
          tilt === "right" &&
            "[transform:rotateY(14deg)_rotateX(6deg)_rotateZ(-1.5deg)]",
        )}
      >
        {/* The rim's thickness, seen past the tilt. */}
        <span
          aria-hidden
          className={clsx(
            "phone-orange__edge absolute inset-0 rounded-[inherit]",
            tilt === "right" ? "-translate-x-[7px]" : "translate-x-[7px]",
          )}
        />
        <span
          aria-hidden
          className="phone-orange__btn left-[-2px] top-[18%] h-[5%]"
        />
        <span
          aria-hidden
          className="phone-orange__btn left-[-2px] top-[26%] h-[8%]"
        />
        <span
          aria-hidden
          className="phone-orange__btn right-[-2px] top-[24%] h-[11%]"
        />
        <div className="relative rounded-[14%/6.5%] bg-black p-[2.2%]">
          {children}
          <span
            aria-hidden
            className="absolute left-1/2 top-[2.1%] h-[3.1%] w-[30%] -translate-x-1/2 rounded-full bg-black"
          />
          <span
            aria-hidden
            className="pointer-events-none absolute inset-[2.2%] rounded-[12%/5.6%] bg-[linear-gradient(115deg,rgb(255_255_255/0.14),rgb(255_255_255/0.03)_28%,transparent_46%)]"
          />
        </div>
      </div>
    </figure>
  );
}

/** One of the drawn mock screens (268px design width), for `OrangeFrame`. */
export function MockScreen({ children }: { children: React.ReactNode }) {
  return (
    <div className="theme-dark relative aspect-[9/19.5] overflow-hidden rounded-[12%/5.6%] bg-black">
      <ScaledScreen>{children}</ScaledScreen>
    </div>
  );
}

/**
 * The hero: a hand holding an iPhone (Mockuuups Studio, free for commercial
 * use, https://mockuuups.studio/license) with a real screenshot laid over
 * its screen. The screen box was measured on the 1412×2006 source:
 * x 147–736, y 31–1309; no finger covers it.
 */
export function HandShot({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  return (
    <div
      className={clsx(
        // The arm fades out below the phone instead of ending at an edge.
        "relative aspect-[1412/2006] [mask-image:linear-gradient(to_bottom,black_62%,transparent_80%)]",
        className,
      )}
    >
      <Image
        fill
        priority
        alt=""
        className="object-contain"
        sizes="(min-width: 1024px) 660px, 520px"
        src="/shots/hand-iphone.png"
      />
      <div
        className="absolute overflow-hidden rounded-[12.5%/5.8%] bg-black"
        style={{
          left: `${(147 / 1412) * 100}%`,
          top: `${(31 / 2006) * 100}%`,
          width: `${(590 / 1412) * 100}%`,
          height: `${(1279 / 2006) * 100}%`,
        }}
      >
        <Image
          fill
          priority
          alt={alt}
          className="object-cover object-top"
          sizes="(min-width: 1024px) 280px, 220px"
          src={src}
        />
        {/* The Dynamic Island, back on top of the screenshot. */}
        <span
          aria-hidden
          className="absolute left-1/2 top-[1.4%] h-[4.3%] w-[31%] -translate-x-1/2 rounded-full bg-black"
        />
      </div>
    </div>
  );
}

/** A lock-screen style notification with the real app icon, beside the phone. */
export function NotifyCard({
  title,
  body,
  className,
  style,
}: {
  title: string;
  body: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={clsx(
        "flex w-[min(17.5rem,76vw)] items-center gap-3 rounded-[20px] border border-line/70 bg-ink-2/90 p-3 pr-4 shadow-[0_18px_40px_-18px_rgb(0_0_0/0.35)] backdrop-blur",
        className,
      )}
      style={style}
    >
      <Image
        alt=""
        className="size-10 shrink-0 rounded-[10px]"
        height={80}
        src="/apple-icon.png"
        width={80}
      />
      <span className="min-w-0 flex-1">
        <span className="flex items-baseline justify-between gap-2">
          <span className="truncate text-[14px] font-bold">{title}</span>
          <span className="shrink-0 text-[11px] text-mute">VARO</span>
        </span>
        <span className="block truncate text-[13px] text-mute">{body}</span>
      </span>
    </div>
  );
}
