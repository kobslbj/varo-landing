import type { ReactNode } from "react";

export type ArticleCategory = "basics" | "routes";

export type CoverArtKind = "routes" | "grades" | "terms" | "holds";

export type ArticleCover =
  | { src: string; alt: string; width: number; height: number }
  | { art: CoverArtKind; alt: string };

export interface ArticleSection {
  /** Anchor for the table of contents, e.g. "before-you-go". */
  id: string;
  /** The H2. Also the TOC label. */
  title: string;
  body: ReactNode;
}

/** A long-form guide. Articles are written in Traditional Chinese only. */
export interface Article {
  slug: string;
  category: ArticleCategory;
  /** The H1. */
  title: string;
  /** The <title>, keyword first; "｜VARO" is appended. */
  seoTitle: string;
  /** Meta description and the lede under the H1, 80–120 characters. */
  description: string;
  keywords: string[];
  /** A photo from /public, or one of the drawn covers in components/articles/cover-art.tsx. */
  cover: ArticleCover;
  /** ISO dates. */
  publishedAt: string;
  updatedAt: string;
  /** "重點整理": the answer in a few lines, shown before the body. */
  summary: string[];
  sections: ArticleSection[];
  faq: { q: string; a: ReactNode }[];
  sources: { label: string; url: string }[];
  /** For glossary articles: every term, published as a schema.org DefinedTermSet. */
  glossary?: { term: string; zh: string; def: string }[];
  /** Slugs of articles to suggest at the end. */
  related: string[];
}
