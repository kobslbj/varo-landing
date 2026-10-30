import Link from "next/link";

import { GymRegions, type Region } from "./gym-regions";
import { Card, Container, Tag } from "./ui";

import {
  abroadCountries,
  abroadHubs,
  cities,
  cityPath,
  gymPath,
  gymsIn,
} from "@/lib/gyms/cities";
import { localizeGym } from "@/lib/gyms/localize";
import { gyms } from "@/lib/gyms/data";
import { getI18n } from "@/lib/i18n";
import { productFaq } from "@/lib/product-faq";

export async function Discover() {
  const { locale, t, href } = await getI18n();
  const en = locale === "en";
  const name = (city: string) => t.gyms.cities[city] ?? city;
  const pad = (n: number) => String(n).padStart(2, "0");

  // Taiwan first, then the app's other regions.
  const regions: Region[] = [
    {
      key: "TW",
      label: t.gyms.countries.TW,
      n: gyms.length,
      caption: en ? "climbing gyms across Taiwan" : "間全台岩館",
      listTitle: en ? "By city" : "依城市",
      items: cities.map((c) => ({
        label: name(c.name),
        href: href(cityPath(c.name)),
        meta: pad(gymsIn(c.name).length),
      })),
      cta: {
        label: en ? "Explore the gym map →" : "打開全台岩館地圖 →",
        href: href("/gyms"),
      },
    },
    ...abroadCountries.map(({ country, cities: list, n }) => {
      const countryName = t.gyms.countries[country];
      const single = list.length === 1 ? list[0] : null;
      // A country page if it has one, else the directory's overseas section.
      const hub = abroadHubs.find((h) => h.country === country);

      return {
        key: country,
        label: countryName,
        n,
        caption: en
          ? `climbing gyms in ${countryName}`
          : `間${countryName}岩館`,
        listTitle: single ? (en ? "Gyms" : "岩館") : en ? "By city" : "依城市",
        // One city (Hong Kong, Singapore): list its gyms instead.
        items: single
          ? gymsIn(single.name).map((g) => ({
              label: g.name,
              href: href(gymPath(g)),
              meta: localizeGym(g, locale).district,
            }))
          : list.map((c) => ({
              label: name(c.name),
              href: href(cityPath(c.name)),
              meta: pad(gymsIn(c.name).length),
            })),
        gymList: Boolean(single),
        cta: {
          label: en
            ? `${countryName} gym map →`
            : `打開${countryName}岩館地圖 →`,
          href: single
            ? href(cityPath(single.name))
            : hub
              ? href(`/gyms/${hub.slug}`)
              : `${href("/gyms")}#abroad`,
        },
      };
    }),
  ];

  return (
    <section>
      <Container className="grid gap-3 pb-20 sm:pb-28 lg:grid-cols-12">
        <GymRegions
          body={
            en
              ? "Compare recorded hours, prices and courses, then check the latest details with the gym. No account needed."
              : "查看已收錄的營業時間、價格與體驗課程，再向場館確認最新資訊。不用下載 App，現在就能找館。"
          }
          regions={regions}
          tag={en ? "Gym map" : "岩館地圖"}
          title={en ? "Find your next climbing spot." : "下一次，想去哪裡爬？"}
        />

        {/* FAQ */}
        <Card className="reveal grid gap-8 p-6 sm:p-8 lg:col-span-12 lg:grid-cols-[1fr_2fr] lg:gap-16">
          <div>
            <Tag>FAQ</Tag>
            <h2 className="mt-6 text-[28px] font-bold leading-tight sm:text-[36px]">
              {en ? "Before your first session" : "開始之前，你可能想知道"}
            </h2>
            <Link
              className="mt-6 inline-block text-[15px] text-mute underline decoration-line underline-offset-4 hover:text-lime-ink hover:decoration-lime"
              href={href("/support")}
            >
              {en ? "More help & contact" : "更多問題與聯絡方式"}
            </Link>
          </div>
          <dl className="divide-y divide-line">
            {productFaq(locale).map(({ q, a }) => (
              <div key={q} className="py-5 first:pt-0 last:pb-0">
                <dt className="text-[17px] font-semibold">{q}</dt>
                <dd className="mt-2 text-[15px] leading-[1.85] text-mute">
                  {a}
                </dd>
              </div>
            ))}
          </dl>
        </Card>
      </Container>
    </section>
  );
}
