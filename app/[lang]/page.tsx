import { Features, Closing } from "@/components/landing/features";
import { Discover } from "@/components/landing/discover";
import { Hero } from "@/components/landing/hero";
import { Marquee } from "@/components/landing/marquee";
import { Spread } from "@/components/landing/spread";
import { SiteFooter } from "@/components/landing/site-footer";
import { SiteHeader } from "@/components/landing/site-header";
import { Sides } from "@/components/landing/sides";
import { Steps } from "@/components/landing/steps";
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
      <SiteHeader overPhoto path="/" />
      <main>
        <Hero />
        <Marquee />
        <Steps />
        <Spread />
        <Features />
        <Sides />
        <Discover />
        <Closing />
      </main>
      <SiteFooter />
    </>
  );
}
