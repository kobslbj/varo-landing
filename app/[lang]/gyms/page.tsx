import type { Metadata } from "next";

import clsx from "clsx";

import {
  GymsCaveat,
  GymsClosing,
  GymsMap,
  gymsHeading,
  VisitorFaq,
} from "@/components/gyms/sections";
import { SiteFooter } from "@/components/landing/site-footer";
import { SiteHeader } from "@/components/landing/site-header";
import { Container } from "@/components/landing/ui";
import { cityOrder, gymPath } from "@/lib/gyms/cities";
import { checkedAt, gyms } from "@/lib/gyms/data";
import { visitorFaq } from "@/lib/gyms/visitor-faq";
import { getI18n } from "@/lib/i18n";
import {
  absoluteUrl,
  faqQuestions,
  JsonLd,
  pageMetadata,
  webPage,
} from "@/lib/seo";

const CITY_ORDER = cityOrder;

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n();
  const { meta } = t.gyms;

  return pageMetadata("/gyms", {
    title: meta.title(gyms.length, Number(checkedAt.slice(0, 4))),
    description: meta.description(gyms.length),
  });
}

export default async function GymsPage() {
  const { locale, t, href } = await getI18n();
  const copy = t.gyms;
  const heading = gymsHeading(locale);
  const visitors =
    locale === "en" ? visitorFaq((city) => copy.cities[city] ?? city) : [];

  return (
    <>
      <JsonLd
        graph={[
          webPage(locale, "/gyms", {
            name: copy.meta.title(gyms.length, Number(checkedAt.slice(0, 4))),
            description: copy.meta.description(gyms.length),
            dateModified: checkedAt,
            mainEntity: {
              "@type": "ItemList",
              numberOfItems: gyms.length,
              itemListElement: gyms.map((g, i) => ({
                "@type": "ListItem",
                position: i + 1,
                item: {
                  "@type": "ExerciseGym",
                  "@id": `${absoluteUrl(href(gymPath(g)))}#gym`,
                  url: absoluteUrl(href(gymPath(g))),
                  name: g.name,
                  ...(g.address
                    ? {
                        address: {
                          "@type": "PostalAddress",
                          streetAddress: g.address,
                          addressLocality: g.city,
                          addressCountry: "TW",
                        },
                      }
                    : {}),
                  ...(g.lat != null && g.lng != null
                    ? {
                        geo: {
                          "@type": "GeoCoordinates",
                          latitude: g.lat,
                          longitude: g.lng,
                        },
                      }
                    : {}),
                  ...(g.phone ? { telephone: g.phone } : {}),
                  ...(g.website ? { sameAs: [g.website] } : {}),
                },
              })),
            },
          }),
          ...(visitors.length
            ? [
                {
                  "@type": "FAQPage",
                  "@id": `${absoluteUrl(href("/gyms"))}#visitors`,
                  mainEntity: faqQuestions(visitors),
                },
              ]
            : []),
        ]}
      />
      <SiteHeader path="/gyms" />
      <main className="relative">
        {/* Bolt-hole grid */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-[900px] opacity-[0.25] [background-image:radial-gradient(#2c2f33_1.2px,transparent_1.2px)] [background-size:30px_30px] [mask-image:linear-gradient(to_bottom,black,transparent)]"
        />

        <Container className="relative pb-10 pt-32 sm:pt-40">
          <h1 className={clsx("rise text-[44px] sm:text-[64px]", heading)}>
            {copy.title}
          </h1>
          <p
            className="rise mt-6 max-w-[38rem] text-[17px] leading-[1.8] text-mute [text-wrap:pretty] sm:text-[19px]"
            style={{ ["--rise-delay" as string]: "80ms" }}
          >
            {copy.lead(gyms.length, CITY_ORDER.length)}
          </p>
        </Container>

        <Container className="relative pb-20">
          <GymsMap cityOrder={CITY_ORDER} gyms={gyms} />
        </Container>

        {visitors.length ? <VisitorFaq items={visitors} /> : null}
        <GymsCaveat />
        <GymsClosing />
      </main>
      <SiteFooter />
    </>
  );
}
