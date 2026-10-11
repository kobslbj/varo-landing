import type { MetadataRoute } from "next";

import { absoluteUrl } from "@/lib/seo";

/**
 * Everything is public to every crawler. That covers AI search crawlers
 * (OAI-SearchBot, Claude-SearchBot, PerplexityBot; Google AI Overviews follow
 * Googlebot) as well as training crawlers (GPTBot, ClaudeBot, Google-Extended).
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
