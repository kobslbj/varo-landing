import clsx from "clsx";
import Image from "next/image";

/**
 * The /articles hero: two climbing photos framed like stories, hold-shaped
 * hashtag stickers, and a friend talking another into a first session.
 * Purely decorative; the page's real content is the article list.
 */
export function StoryCollage({
  chat,
  tags,
  handle,
}: {
  /** `me` messages sit on the right, in lime. */
  chat: { me: boolean; text: string }[];
  tags: [string, string];
  handle: string;
}) {
  return (
    <div
      aria-hidden
      className="relative mx-auto h-[480px] w-full max-w-[560px] select-none sm:h-[600px]"
    >
      <Story
        className="left-[2%] top-2 w-[54%] -rotate-[5deg]"
        delay={80}
        handle={handle}
        src="/shots/climb-3.jpg"
      />
      <Story
        className="right-[2%] top-[12%] w-[46%] rotate-[6deg]"
        delay={220}
        handle={handle}
        src="/shots/climb-5.jpg"
      />

      {/* Hashtag stickers, shaped like holds */}
      <span
        className="pop absolute right-[6%] top-0 z-20 rotate-[8deg] rounded-[46%_54%_42%_58%/58%_44%_56%_42%] bg-hold-yellow px-5 py-3 text-[15px] font-extrabold text-ink shadow-[0_10px_30px_-10px_rgba(0,0,0,.8)] sm:text-[17px]"
        style={{ ["--rise-delay" as string]: "520ms" }}
      >
        {tags[0]}
      </span>
      <span
        className="pop absolute left-[-3%] top-[46%] z-20 -rotate-[7deg] rounded-[58%_42%_50%_50%/44%_58%_42%_56%] bg-hold-blue px-5 py-3 text-[15px] font-extrabold text-white shadow-[0_10px_30px_-10px_rgba(0,0,0,.8)] sm:text-[17px]"
        style={{ ["--rise-delay" as string]: "600ms" }}
      >
        {tags[1]}
      </span>
      <Image
        alt=""
        className="pop absolute left-[44%] top-[-4%] z-20 w-[18%] -rotate-[10deg] drop-shadow-[0_12px_20px_rgba(0,0,0,.6)]"
        height={512}
        sizes="120px"
        src="/mascot/sloper-lime.png"
        style={{ ["--rise-delay" as string]: "680ms" }}
        width={512}
      />

      {/* The conversation */}
      <ol className="absolute inset-x-[2%] bottom-0 z-30 flex flex-col gap-2 sm:inset-x-[6%]">
        {chat.map((m, i) => (
          <li
            key={m.text}
            className={clsx(
              "pop max-w-[78%] rounded-[22px] px-4 py-2.5 text-[15px] font-semibold leading-snug shadow-[0_12px_30px_-12px_rgba(0,0,0,.9)] sm:text-[16px]",
              m.me
                ? "self-end rounded-br-md bg-lime text-ink"
                : "self-start rounded-bl-md bg-[#2b2e31] text-cream",
            )}
            style={{ ["--rise-delay" as string]: `${820 + i * 380}ms` }}
          >
            {m.text}
          </li>
        ))}
      </ol>
    </div>
  );
}

/** A photo framed like a story: progress bars and a handle across the top. */
function Story({
  src,
  handle,
  className,
  delay,
}: {
  src: string;
  handle: string;
  className: string;
  delay: number;
}) {
  return (
    <div
      className={clsx(
        "drop absolute aspect-[4/5] overflow-hidden rounded-[26px] border border-white/10 bg-ink-2 shadow-[0_30px_60px_-24px_rgba(0,0,0,.95)]",
        className,
      )}
      style={{ ["--rise-delay" as string]: `${delay}ms` }}
    >
      <Image
        fill
        alt=""
        className="object-cover"
        sizes="(min-width: 1024px) 320px, 60vw"
        src={src}
      />
      <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/55 to-transparent" />
      <div className="absolute inset-x-3 top-3 flex gap-1">
        <span className="h-[3px] flex-1 rounded-full bg-white" />
        <span className="h-[3px] flex-1 rounded-full bg-white/40" />
        <span className="h-[3px] flex-1 rounded-full bg-white/40" />
      </div>
      <div className="absolute left-3 top-6 flex items-center gap-2">
        <span className="grid size-7 place-items-center rounded-full bg-lime">
          <Image
            alt=""
            className="size-5"
            height={512}
            sizes="20px"
            src="/mascot/jug-lime.png"
            width={512}
          />
        </span>
        <span className="text-[13px] font-semibold text-white">{handle}</span>
      </div>
    </div>
  );
}
