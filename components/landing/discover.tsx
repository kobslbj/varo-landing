import Link from "next/link";

import { Container } from "./ui";

import { cities, gymsIn } from "@/lib/gyms/cities";
import { gyms } from "@/lib/gyms/data";
import { getI18n } from "@/lib/i18n";
import { productFaq } from "@/lib/product-faq";

export async function Discover() {
  const { locale, t, href } = await getI18n();
  const en = locale === "en";

  return (
    <>
      <section>
        <Container className="py-16 sm:py-20">
          <div className="grid gap-10 border-y border-line py-10 lg:grid-cols-[1fr_1fr] lg:gap-20">
            <div>
              <h2 className="text-[32px] font-bold leading-tight sm:text-[42px]">
                {en ? "Find your next climbing spot." : "下一次，想去哪裡爬？"}
              </h2>
              <p className="mt-5 max-w-[32rem] text-[17px] leading-[1.8] text-mute">
                {en
                  ? `Explore ${gyms.length} climbing gyms across Taiwan. Compare recorded hours, prices and courses, then check the latest details with the gym. No account needed.`
                  : `探索全台 ${gyms.length} 間岩館，查看已收錄的營業時間、價格與體驗課程，再向場館確認最新資訊。不用等 App 上架，現在就能找館。`}
              </p>
              <Link
                className="mt-7 inline-flex rounded-lg bg-lime px-6 py-3 font-semibold text-ink hover:bg-lime-deep"
                href={href("/gyms")}
              >
                {en ? "Explore the gym map" : "打開全台岩館地圖"}
              </Link>
            </div>
            <ul className="grid content-start grid-cols-2 gap-x-6">
              {cities.map((city) => (
                <li key={city.slug} className="border-b border-line">
                  <Link
                    className="flex items-center justify-between gap-2 py-3 text-[15px] hover:text-lime"
                    href={href(`/gyms/${city.slug}`)}
                  >
                    <span>{t.gyms.cities[city.name] ?? city.name}</span>
                    <span className="text-[13px] text-mute">
                      {gymsIn(city.name).length}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>
      <section>
        <Container className="pb-20">
          <h2 className="text-[30px] font-bold sm:text-[38px]">
            {en ? "Before your first session" : "開始之前，你可能想知道"}
          </h2>
          <dl className="mt-8 max-w-[48rem] divide-y divide-line">
            {productFaq(locale).map(({ q, a }) => (
              <div key={q} className="py-5">
                <dt className="text-[18px] font-semibold">{q}</dt>
                <dd className="mt-2 text-[16px] leading-[1.85] text-mute">
                  {a}
                </dd>
              </div>
            ))}
          </dl>
          <Link
            className="mt-5 inline-block text-[15px] underline decoration-line underline-offset-4 hover:text-lime"
            href={href("/support")}
          >
            {en ? "More help & contact" : "更多問題與聯絡方式"}
          </Link>
        </Container>
      </section>
    </>
  );
}
