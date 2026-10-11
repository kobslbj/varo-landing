/**
 * Tells IndexNow engines (Bing, Yandex, Naver, Seznam…) that every URL in the
 * live sitemap may have changed. Run after a production deploy:
 * `pnpm indexnow` (CI does this automatically, see .github/workflows/indexnow.yml).
 */
const SITE = process.env.SITE_URL ?? "https://getvaro.app";
// Public by design: engines verify it at `${SITE}/${KEY}.txt` (public/).
const KEY = "d6f6381652fcb8956fa5cd52c80e7e0f";

const sitemap = await fetch(`${SITE}/sitemap.xml`).then((res) => {
  if (!res.ok) throw new Error(`sitemap.xml: HTTP ${res.status}`);

  return res.text();
});
const urlList = [...sitemap.matchAll(/<loc>(.+?)<\/loc>/g)].map((m) => m[1]);

const res = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({
    host: new URL(SITE).host,
    key: KEY,
    keyLocation: `${SITE}/${KEY}.txt`,
    urlList,
  }),
});

// 200 = submitted, 202 = accepted while the key is being verified.
if (res.status !== 200 && res.status !== 202) {
  throw new Error(`IndexNow: HTTP ${res.status} ${await res.text()}`);
}
console.log(`IndexNow: submitted ${urlList.length} URLs (HTTP ${res.status})`);
