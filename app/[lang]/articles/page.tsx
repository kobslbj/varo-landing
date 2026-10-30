import type { ArticleCategory } from "@/lib/articles/types";
import type { Metadata } from "next";

import Link from "next/link";

import { ArticleCard } from "@/components/articles/article-card";
import { StoryCollage } from "@/components/articles/story-collage";
import { SiteFooter } from "@/components/landing/site-footer";
import { SiteHeader } from "@/components/landing/site-header";
import { Container } from "@/components/landing/ui";
import { articlePath, articles } from "@/lib/articles";
import { getI18n } from "@/lib/i18n";
import { absoluteUrl, JsonLd, pageMetadata, webPage } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n();

  return pageMetadata("/articles", t.articles.meta);
}

/** Section order below the featured article. */
const CATEGORIES: ArticleCategory[] = ["basics", "routes"];

/** The guide everyone should read first leads the page. */
const FEATURED = "first-time-bouldering-guide";

export default async function ArticlesPage() {
  const { locale, t, href } = await getI18n();
  const copy = t.articles;
  const en = locale === "en";
  const featured = articles.find((a) => a.slug === FEATURED) ?? articles[0];
  const rest = articles.filter((a) => a !== featured);

  return (
    <>
      <JsonLd
        graph={[
          webPage(locale, "/articles", {
            type: "CollectionPage",
            name: copy.meta.title,
            description: copy.meta.description,
            mainEntity: {
              "@type": "ItemList",
              itemListElement: articles.map((a, i) => ({
                "@type": "ListItem",
                position: i + 1,
                name: a.title,
                url: absoluteUrl(articlePath(a)),
                image: absoluteUrl(
                  "src" in a.cover
                    ? a.cover.src
                    : `${articlePath(a)}/opengraph-image`,
                ),
              })),
            },
          }),
        ]}
      />
      <SiteHeader path="/articles" />
      <main className="relative overflow-hidden">
        {/* Bolt-hole grid, as on the rest of the site */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-[900px] opacity-[0.25] [background-image:radial-gradient(#2e2e2e_1.2px,transparent_1.2px)] [background-size:30px_30px] [mask-image:linear-gradient(to_bottom,black,transparent)]"
        />

        <Container className="relative grid items-center gap-12 pb-20 pt-28 sm:pt-36 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-8 lg:pb-28">
          <div>
            <h1>
              <span className="block text-[17px] font-bold text-mute sm:text-[19px]">
                {copy.heading}
              </span>
              <span
                className={
                  en
                    ? "mt-5 block font-display text-[52px] leading-[1.02] sm:text-[76px]"
                    : "mt-5 block text-[54px] font-black leading-[1.08] tracking-[-0.03em] sm:text-[80px] lg:text-[88px]"
                }
              >
                <span className="block">{copy.slogan[0]}</span>
                <span className="block text-lime-ink">{copy.slogan[1]}</span>
              </span>
            </h1>
            <p className="mt-7 max-w-[30rem] text-[18px] leading-[1.8] text-mute sm:text-[20px]">
              {copy.lead}
            </p>
            {copy.onlyChinese && (
              <p className="mt-6 max-w-[30rem] text-[15px] leading-[1.7] text-mute/80">
                {copy.onlyChinese}
              </p>
            )}
          </div>
          <StoryCollage chat={copy.chat} handle="varo.climb" tags={copy.tags} />
        </Container>

        <Container className="relative pb-20">
          <h2 className="mb-5 text-[15px] font-bold text-mute">
            {copy.featured}
          </h2>
          <ArticleCard
            featured
            article={featured}
            href={articlePath(featured)}
          />

          {CATEGORIES.map((category) => {
            const list = rest.filter((a) => a.category === category);

            return list.length > 0 ? (
              <section key={category} aria-labelledby={`cat-${category}`}>
                <h2
                  className="mb-5 mt-16 text-[15px] font-bold text-mute"
                  id={`cat-${category}`}
                >
                  {copy.categories[category]}
                </h2>
                <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {list.map((a) => (
                    <li key={a.slug}>
                      {/* Articles are Chinese only: every locale links to the unprefixed URL. */}
                      <ArticleCard article={a} href={articlePath(a)} />
                    </li>
                  ))}
                </ul>
              </section>
            ) : null;
          })}
        </Container>

        <Container className="relative pb-28">
          <div className="relative overflow-hidden rounded-[32px] bg-lime px-7 py-12 text-night sm:px-14 sm:py-16">
            {/* A few holds bolted to the panel */}
            <span
              aria-hidden
              className="absolute -right-6 -top-8 size-32 rotate-12 rounded-[46%_54%_42%_58%/58%_44%_56%_42%] bg-hold-red sm:size-40"
            />
            <span
              aria-hidden
              className="absolute bottom-6 right-24 hidden size-14 -rotate-6 rounded-[58%_42%_50%_50%/44%_58%_42%_56%] bg-hold-blue sm:block"
            />
            <span
              aria-hidden
              className="absolute bottom-[-18px] right-[-10px] size-20 rounded-[40%_60%_56%_44%/56%_46%_54%_44%] bg-ink"
            />
            <h2
              className={`relative max-w-[38rem] text-[32px] sm:text-[44px] ${en ? "font-display leading-[1.05]" : "font-black leading-[1.2] tracking-[-0.02em]"}`}
            >
              {copy.closing.title}
            </h2>
            <p className="relative mt-4 max-w-[28rem] text-[17px] leading-[1.7] text-night/75">
              {copy.closing.body}
            </p>
            <Link
              className="relative mt-8 inline-flex h-12 items-center rounded-full bg-ink px-7 text-[16px] font-semibold text-cream transition-colors hover:bg-ink-3 focus-visible:outline-night"
              href={href("/gyms")}
            >
              {copy.closing.cta}
            </Link>
          </div>
        </Container>
      </main>
      <SiteFooter />
    </>
  );
}
