import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";

import { TitleLines } from "./blocks";

import { type Article, readingMinutes } from "@/lib/articles";
import { getI18n } from "@/lib/i18n";

/**
 * An article with its cover photo. `featured` lays the photo beside the text
 * on wider screens and makes the title larger.
 */
export async function ArticleCard({
  article: a,
  href,
  featured = false,
  label,
}: {
  article: Article;
  href: string;
  featured?: boolean;
  /** Sticker on the photo; defaults to the category. */
  label?: string;
}) {
  const { t } = await getI18n();
  const copy = t.articles;

  return (
    <Link
      className={clsx(
        "group grid h-full overflow-hidden rounded-[28px] border border-line bg-ink-2 transition-colors hover:border-lime/60",
        featured && "md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]",
      )}
      href={href}
      lang="zh-Hant"
    >
      <div
        className={clsx(
          "relative overflow-hidden",
          featured
            ? "aspect-[4/3] md:aspect-auto md:min-h-[440px]"
            : "aspect-[4/3]",
        )}
      >
        <Image
          fill
          alt={a.cover.alt}
          className="object-cover transition-transform duration-500 group-hover:scale-[1.04] motion-reduce:transition-none"
          sizes={
            featured
              ? "(min-width: 768px) 520px, 100vw"
              : "(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw"
          }
          src={a.cover.src}
        />
        <span className="absolute left-4 top-4 -rotate-[4deg] rounded-full bg-lime px-3.5 py-1.5 text-[13px] font-extrabold text-ink">
          {label ?? copy.categories[a.category]}
        </span>
      </div>
      <div
        className={clsx(
          "flex flex-col",
          featured ? "p-7 sm:p-10 md:justify-center" : "p-6",
        )}
      >
        <h3
          className={clsx(
            "font-extrabold leading-[1.3] text-cream [text-wrap:balance]",
            featured ? "text-[26px] sm:text-[30px]" : "text-[20px]",
          )}
        >
          <TitleLines title={a.title} />
        </h3>
        <p
          className={clsx(
            "mt-4 text-mute",
            featured
              ? "text-[16px] leading-[1.8] sm:text-[17px]"
              : "line-clamp-3 text-[15px] leading-[1.75]",
          )}
        >
          {a.description}
        </p>
        <p
          className={clsx(
            "flex items-center justify-between gap-4 pt-6 text-[14px] text-mute",
            !featured && "mt-auto",
          )}
        >
          {copy.readMinutes(readingMinutes(a))}
          <span
            className={clsx(
              "font-semibold transition-colors",
              featured
                ? "rounded-full bg-cream px-5 py-2.5 text-ink group-hover:bg-lime"
                : "text-cream group-hover:text-lime",
            )}
          >
            {copy.readMore}
          </span>
        </p>
      </div>
    </Link>
  );
}
