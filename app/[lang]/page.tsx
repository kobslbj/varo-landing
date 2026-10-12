import { Features } from "@/components/landing/features";
import { Hero } from "@/components/landing/hero";
import { SiteFooter } from "@/components/landing/site-footer";
import { SiteHeader } from "@/components/landing/site-header";
import { getI18n } from "@/lib/i18n";
import { appEntity, JsonLd, webPage } from "@/lib/seo";

export default async function Home() {
  const { locale, t } = await getI18n();

  return (
    <>
      <JsonLd
        graph={[
          webPage(locale, "/", {
            name: t.meta.title,
            description: t.meta.description,
          }),
          appEntity(locale, t.meta.description),
        ]}
      />
      <SiteHeader path="/" />
      <main>
        <Hero />
        <Features />
      </main>
      <SiteFooter />
    </>
  );
}
