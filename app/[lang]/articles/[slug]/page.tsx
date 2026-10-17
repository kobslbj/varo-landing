import type { Metadata } from "next";

import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ArticleCard } from "@/components/articles/article-card";
import { ArticleCover } from "@/components/articles/cover-art";
import { GymMapThumb } from "@/components/gyms/map-thumb";
import { HoldMark, termId, TitleLines } from "@/components/articles/blocks";
import { Toc } from "@/components/articles/toc";
import { DownloadCta } from "@/components/landing/download-cta";
import { SiteFooter } from "@/components/landing/site-footer";
import { SiteHeader } from "@/components/landing/site-header";
import { Container, holdColors } from "@/components/landing/ui";
import { siteConfig } from "@/config/site";
import {
  articleBySlug,
  articleLength,
  articlePath,
  articles,
  readingMinutes,
} from "@/lib/articles";
import { gyms } from "@/lib/gyms/data";
import { getI18n } from "@/lib/i18n";
import {
  absoluteUrl,
  faqQuestions,
  JsonLd,
  organizationId,
  webPage,
} from "@/lib/seo";

export const dynamicParams = false;

/**
 * Every locale lists every slug: returning [] for one locale stops the route
 * prerendering at all. Articles are Chinese only, so `load` 404s the English URLs.
 */
export function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}

type Props = { params: Promise<{ slug: string }> };

async function load(params: Props["params"]) {
  const { slug } = await params;
  const article = articleBySlug(slug);
  const i18n = await getI18n();

  if (!article || i18n.locale !== "zh-TW") notFound();

  return { ...i18n, article, path: articlePath(article) };
}

/** Summary bullets climb a little route of hold colours. */
const summaryHolds = [
  holdColors.red,
  holdColors.orange,
  holdColors.blue,
  holdColors.green,
];

const author = {
  "@type": "Person",
  name: "Justin Li",
  url: "https://www.justinli.blog/",
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { article: a, path, t } = await load(params);
  const title = `${a.seoTitle}｜VARO`;

  // og:image comes from ./opengraph-image.tsx, which overrides anything set here.
  return {
    title,
    description: a.description,
    keywords: a.keywords,
    authors: [{ name: author.name, url: author.url }],
    alternates: { canonical: path, languages: { "zh-TW": path } },
    openGraph: {
      type: "article",
      locale: t.ogLocale,
      siteName: siteConfig.name,
      title,
      description: a.description,
      url: path,
      publishedTime: a.publishedAt,
      modifiedTime: a.updatedAt,
      authors: [author.url],
      section: t.articles.categories[a.category],
      tags: a.keywords,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: a.description,
    },
  };
}

const date = (iso: string) =>
  new Intl.DateTimeFormat("zh-TW", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(iso));

export default async function ArticlePage({ params }: Props) {
  const { article: a, path, locale, t, href } = await load(params);
  const copy = t.articles;
  const url = absoluteUrl(href(path));
  const category = copy.categories[a.category];
  const minutes = readingMinutes(a);
  const toc = [
    ...a.sections.map(({ id, title }) => ({ id, title })),
    { id: "faq", title: "常見問題" },
  ];
  const related = a.related
    .map(articleBySlug)
    .filter((r): r is NonNullable<typeof r> => Boolean(r));

  return (
    <>
      <JsonLd
        graph={[
          webPage(locale, path, {
            name: a.title,
            description: a.description,
            mainEntity: { "@id": `${url}#article` },
            breadcrumb: {
              "@type": "BreadcrumbList",
              itemListElement: [
                {
                  "@type": "ListItem",
                  position: 1,
                  name: copy.eyebrow,
                  item: absoluteUrl(href("/articles")),
                },
                { "@type": "ListItem", position: 2, name: a.title, item: url },
              ],
            },
          }),
          {
            "@type": "BlogPosting",
            "@id": `${url}#article`,
            headline: a.title,
            description: a.description,
            url,
            mainEntityOfPage: { "@id": url },
            image: [
              ...("src" in a.cover ? [absoluteUrl(a.cover.src)] : []),
              absoluteUrl(`${path}/opengraph-image`),
            ],
            datePublished: a.publishedAt,
            dateModified: a.updatedAt,
            inLanguage: "zh-Hant-TW",
            articleSection: category,
            keywords: a.keywords.join(", "),
            wordCount: articleLength(a),
            timeRequired: `PT${minutes}M`,
            author,
            publisher: { "@id": organizationId },
          },
          ...(a.glossary
            ? [
                {
                  "@type": "DefinedTermSet",
                  "@id": `${url}#terms`,
                  name: a.title,
                  inLanguage: "zh-Hant-TW",
                  hasDefinedTerm: a.glossary.map((g) => ({
                    "@type": "DefinedTerm",
                    name: g.term,
                    alternateName: g.zh,
                    description: g.def,
                    url: `${url}#${termId(g.term)}`,
                    inDefinedTermSet: { "@id": `${url}#terms` },
                  })),
                },
              ]
            : []),
          {
            "@type": "FAQPage",
            "@id": `${url}#faq`,
            url: `${url}#faq`,
            inLanguage: "zh-Hant-TW",
            mainEntity: faqQuestions(a.faq),
          },
        ]}
      />
      {/* The language switch goes to the English guides index: articles are Chinese only. */}
      <SiteHeader path="/articles" />
      <div
        aria-hidden
        className="read-progress fixed inset-x-0 top-0 z-[60] h-[3px] bg-lime"
      />
      <main className="relative">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-[520px] opacity-[0.25] [background-image:radial-gradient(#2c2f33_1.2px,transparent_1.2px)] [background-size:30px_30px] [mask-image:linear-gradient(to_bottom,black,transparent)]"
        />
        <Container className="relative pt-28 sm:pt-36">
          <nav
            aria-label="麵包屑導覽"
            className="flex flex-wrap items-center gap-2 text-[14px] text-mute"
          >
            <Link
              className="underline-offset-4 hover:text-lime hover:underline"
              href={href("/articles")}
            >
              {copy.eyebrow}
            </Link>
            <span aria-hidden>/</span>
            <span>{category}</span>
          </nav>

          <header className="mt-6 grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-16 xl:grid-cols-[minmax(0,1fr)_22rem]">
            <div className="max-w-[48rem]">
              <h1 className="display-zh text-[32px] sm:text-[48px] lg:text-[54px]">
                <TitleLines title={a.title} />
              </h1>
              <p className="mt-6 text-[18px] leading-[1.8] text-mute [text-wrap:pretty] sm:text-[20px]">
                {a.description}
              </p>
              <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-2 text-[14px] text-mute">
                <span className="flex items-center gap-2.5">
                  <Image
                    alt=""
                    className="size-8 rounded-full bg-ink-3 p-1"
                    height={512}
                    sizes="32px"
                    src="/mascot/jug-lime.png"
                    width={512}
                  />
                  <span>
                    <a
                      className="font-semibold text-cream hover:text-lime"
                      href={author.url}
                      rel="author noopener noreferrer"
                      target="_blank"
                    >
                      {author.name}
                    </a>
                    ・VARO
                  </span>
                </span>
                <span>
                  {copy.updated}{" "}
                  <time dateTime={a.updatedAt}>{date(a.updatedAt)}</time>
                </span>
                <span>{copy.readMinutes(minutes)}</span>
              </div>
            </div>
            <div className="relative aspect-[16/10] overflow-hidden rounded-[28px] bg-ink-2 lg:aspect-[4/5] lg:rotate-[2deg]">
              <ArticleCover
                priority
                cover={a.cover}
                sizes="(min-width: 1280px) 352px, (min-width: 1024px) 320px, 100vw"
              />
            </div>
          </header>
        </Container>

        <Container className="relative mt-14 grid items-start gap-14 pb-20 lg:grid-cols-[minmax(0,44rem)_15rem] lg:justify-between">
          <article className="min-w-0">
            <section
              aria-labelledby="summary"
              className="on-paper rounded-[28px] bg-paper px-6 py-7 text-ink sm:px-9 sm:py-9"
            >
              <h2
                className="text-[22px] font-black tracking-[-0.01em] sm:text-[24px]"
                id="summary"
              >
                重點整理
              </h2>
              <ul className="mt-5 space-y-4">
                {a.summary.map((line, i) => (
                  <li
                    key={line}
                    className="flex gap-3.5 text-[16px] font-medium leading-[1.75] sm:text-[17px]"
                  >
                    <HoldMark
                      className="mt-[5px] size-[18px]"
                      color={summaryHolds[i % summaryHolds.length]}
                      shape={i}
                    />
                    {line}
                  </li>
                ))}
              </ul>
            </section>

            <details className="group mt-6 rounded-xl border border-line lg:hidden">
              <summary className="flex cursor-pointer list-none items-center justify-between px-5 py-4 text-[15px] font-semibold [&::-webkit-details-marker]:hidden">
                本文目錄
                <svg
                  aria-hidden
                  className="size-4 text-mute transition-transform group-open:rotate-180"
                  fill="none"
                  viewBox="0 0 16 16"
                >
                  <path
                    d="m4 6 4 4 4-4"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.6"
                  />
                </svg>
              </summary>
              <ol className="space-y-1 border-t border-line px-5 py-4 text-[15px]">
                {toc.map(({ id, title }, i) => (
                  <li key={id}>
                    <a
                      className="flex gap-3 py-1.5 text-mute hover:text-cream"
                      href={`#${id}`}
                    >
                      <span className="tabular w-5 shrink-0 text-line">
                        {i + 1}
                      </span>
                      {title}
                    </a>
                  </li>
                ))}
              </ol>
            </details>

            <div className="article-body">
              {a.sections.map((s) => (
                <section key={s.id} aria-labelledby={s.id}>
                  <h2 id={s.id}>{s.title}</h2>
                  {s.body}
                </section>
              ))}

              <section aria-labelledby="faq">
                <h2 id="faq">常見問題</h2>
                <div className="not-prose mt-6 divide-y divide-line border-y border-line">
                  {a.faq.map(({ q, a: answer }) => (
                    <details key={q} className="group py-1">
                      <summary className="flex cursor-pointer list-none items-start justify-between gap-4 py-4 text-[17px] font-bold leading-snug text-cream [&::-webkit-details-marker]:hidden">
                        {q}
                        <span
                          aria-hidden
                          className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full border border-line text-[15px] text-mute transition-transform group-open:rotate-45"
                        >
                          +
                        </span>
                      </summary>
                      <div className="callout-body pb-5 pr-10 text-[16px] leading-[1.85] text-cream/80">
                        {answer}
                      </div>
                    </details>
                  ))}
                </div>
              </section>
            </div>

            {a.sources.length > 0 && (
              <section
                aria-labelledby="sources"
                className="mt-16 border-t border-line pt-6"
              >
                <h2 className="text-[15px] font-bold" id="sources">
                  參考資料
                </h2>
                <ul className="mt-3 space-y-2 text-[14px] text-mute">
                  {a.sources.map((s) => (
                    <li key={s.url}>
                      <a
                        className="underline decoration-line underline-offset-4 hover:text-lime"
                        href={s.url}
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        {s.label}
                      </a>
                    </li>
                  ))}
                </ul>
                <p className="mt-4 text-[14px] leading-[1.7] text-mute">
                  價格、規定與課程因館而異，請以各岩館最新公告為準。內容有誤或想補充，歡迎寄信到{" "}
                  <a
                    className="underline decoration-line underline-offset-4 hover:text-lime"
                    href={`mailto:${siteConfig.contactEmail}?subject=${encodeURIComponent(`文章回饋：${a.title}`)}`}
                  >
                    {siteConfig.contactEmail}
                  </a>
                  。
                </p>
              </section>
            )}
          </article>

          <aside className="sticky top-8 hidden max-h-[calc(100dvh-4rem)] overflow-y-auto lg:block">
            <Toc items={toc} label="本文目錄" />
            <div className="mt-10 border-t-2 border-lime pt-5">
              <p className="text-[15px] font-bold leading-snug">
                準備好去爬了？
              </p>
              <p className="mt-2 text-[14px] leading-[1.7] text-mute">
                全台抱石館的地址、營業時間與價格，一張地圖看完。
              </p>
              <Link
                className="mt-4 inline-flex h-10 items-center rounded-lg bg-lime px-4 text-[14px] font-semibold text-ink transition-colors hover:bg-lime-deep"
                href={href("/gyms")}
              >
                找附近的岩館
              </Link>
            </div>
          </aside>
        </Container>

        {related.length > 0 && (
          <Container className="relative pb-20">
            <h2 className="scroll-mt-8 text-[22px] font-bold" id="related">
              接著讀
            </h2>
            <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((r) => (
                <li key={r.slug}>
                  <ArticleCard article={r} href={href(articlePath(r))} />
                </li>
              ))}
              <li>
                {/* Same frame as the article cards: picture on top, sticker, then text. */}
                <Link
                  className="group grid h-full grid-rows-[auto_1fr] overflow-hidden rounded-[28px] border border-line bg-ink-2 transition-colors hover:border-lime/60"
                  href={href("/gyms")}
                >
                  <div className="relative flex aspect-[4/3] justify-center overflow-hidden bg-ink pt-6 [background-image:radial-gradient(#2c2f33_1.2px,transparent_1.2px)] [background-size:22px_22px]">
                    <GymMapThumb className="h-[115%] transition-transform duration-500 group-hover:scale-[1.04] motion-reduce:transition-none" />
                    <span className="absolute left-4 top-4 -rotate-[4deg] rounded-full bg-lime px-3.5 py-1.5 text-[13px] font-extrabold text-ink">
                      岩館地圖
                    </span>
                  </div>
                  <div className="flex flex-col p-6">
                    <h3 className="text-[20px] font-extrabold leading-[1.3] text-cream">
                      全台抱石館：地址、營業時間與價格
                    </h3>
                    <p className="mt-4 text-[15px] leading-[1.75] text-mute">
                      {gyms.length}{" "}
                      間可以抱石的岩館，地圖上每顆岩點都是一間館，點進去就能看營業時間和價格。
                    </p>
                    <p className="mt-auto flex items-center justify-between pt-6 text-[14px] text-mute">
                      {gyms.length} 間岩館
                      <span className="font-semibold text-cream transition-colors group-hover:text-lime">
                        打開地圖
                      </span>
                    </p>
                  </div>
                </Link>
              </li>
            </ul>
          </Container>
        )}

        <Container className="relative flex flex-col items-center border-t border-line pb-28 pt-20 text-center">
          <h2 className="display-zh text-[30px] sm:text-[42px]">
            每一次嘗試，
            <br />
            <span className="text-lime">都值得被記下來。</span>
          </h2>
          <p className="mt-5 max-w-[32rem] text-[16px] leading-[1.8] text-mute">
            VARO
            幫你記下每條路線的嘗試、完攀與影片，回頭看見自己從第一次上牆到現在的進步。
          </p>
          <div className="mt-9 flex w-full justify-center">
            <DownloadCta className="text-left" source="articles" />
          </div>
        </Container>
      </main>
      <SiteFooter />
    </>
  );
}
