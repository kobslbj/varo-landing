import { Features, Closing } from "@/components/landing/features";
import { Discover } from "@/components/landing/discover";
import { Hero } from "@/components/landing/hero";
import { SiteFooter } from "@/components/landing/site-footer";
import { SiteHeader } from "@/components/landing/site-header";
import { getI18n } from "@/lib/i18n";
import {
  appEntity,
  JsonLd,
  webPage,
  faqQuestions,
  absoluteUrl,
} from "@/lib/seo";
import { productFaq } from "@/lib/product-faq";

export default async function Home() {
  const { locale, t, href } = await getI18n();

  return (
    <>
      <JsonLd
        graph={[
          webPage(locale, "/", {
            name: t.meta.title,
            description: t.meta.description,
          }),
          appEntity(locale, t.meta.description),
          {
            "@type": "FAQPage",
            "@id": `${absoluteUrl(href("/"))}#faq`,
            mainEntity: faqQuestions(productFaq(locale)),
          },
        ]}
      />
      <SiteHeader path="/" />
      <main>
        <Hero />
        <Features />
        <Discover />
        <Closing />
      </main>
      <SiteFooter />
    </>
  );
}
