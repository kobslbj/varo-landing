import type { Article } from "./types";

import { boulderingBenefits } from "./content/bouldering-benefits";
import { boulderingGrades } from "./content/bouldering-grades";
import { boulderingHolds } from "./content/bouldering-holds";
import { boulderingTerms } from "./content/bouldering-terms";
import { boulderingVsRopeClimbing } from "./content/bouldering-vs-rope-climbing";
import { boulderingWallAngles } from "./content/bouldering-wall-angles";
import { firstTimeBouldering } from "./content/first-time-bouldering";
import { howToReadBoulderingRoutes } from "./content/how-to-read-bouldering-routes";

import { nodeText } from "@/lib/node-text";

export type { Article } from "./types";

/** Newest first. */
export const articles: Article[] = [
  firstTimeBouldering,
  boulderingVsRopeClimbing,
  howToReadBoulderingRoutes,
  boulderingGrades,
  boulderingWallAngles,
  boulderingTerms,
  boulderingHolds,
  boulderingBenefits,
].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));

export const articleBySlug = (slug: string) =>
  articles.find((a) => a.slug === slug);

/** Unprefixed path; articles only exist in Traditional Chinese. */
export const articlePath = (a: Pick<Article, "slug">) => `/articles/${a.slug}`;

/** All the words a reader reads, for reading time and wordCount. */
export function articleText(a: Article) {
  return [
    ...a.summary,
    ...a.sections.flatMap((s) => [s.title, nodeText(s.body)]),
    ...a.faq.flatMap((f) => [f.q, nodeText(f.a)]),
  ].join("\n");
}

/** Characters, not words: Chinese has no spaces. */
export const articleLength = (a: Article) =>
  articleText(a).replace(/\s/g, "").length;

/** About 450 Chinese characters a minute. */
export const readingMinutes = (a: Article) =>
  Math.max(1, Math.round(articleLength(a) / 450));
