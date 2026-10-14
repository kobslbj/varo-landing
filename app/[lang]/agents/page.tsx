import Link from "next/link";

import { LegalPage, Section } from "@/components/landing/legal-page";
import { cities, gymPath, gymsIn } from "@/lib/gyms/cities";
import { checkedAt } from "@/lib/gyms/data";
import { getI18n } from "@/lib/i18n";
import { productFaq } from "@/lib/product-faq";
import { JsonLd, pageMetadata, webPage } from "@/lib/seo";

const copy = {
  "zh-TW": {
    title: "給 AI 助理的 Varo 與岩館資料索引",
    description:
      "Varo 的產品摘要、台灣岩館資料索引與引用方式。查閱固定網址、資料來源說明與尚待確認的資訊。",
    intro:
      "協助使用者認識 Varo，或找到下一次想去的岩館。這裡整理可直接閱讀與引用的公開頁面，不需登入。",
    brief: "讀取純文字摘要（llms.txt）",
    product: "Varo 的功能與目前狀態",
    directory: "台灣岩館資料索引",
    directoryBody:
      "依城市瀏覽岩館。每間都有固定網址與獨立頁面；場館名稱與原始資料保留繁體中文，方便核對官方資訊。",
    freshness: "資料來源與引用方式",
    rules: [
      "以下日期是整份名錄的查核日期，不代表每間岩館或每個欄位都已向場館確認。個別價格與營業時間的來源說明，請以岩館頁面為準。",
      "引用特定岩館資訊時，請連結該館的獨立頁面，並保留原有的未確認、資訊衝突與營運狀態說明。官方聯絡入口供查詢最新公告，不代表所有欄位都來自官方。",
      "缺少價格、租鞋或課程資訊，表示尚未收錄，不能解讀成免費或沒有提供。未列出的營業日也不等於休館。",
      "這份資料不能確認即時營業狀態、當日名額或預約是否成功。規劃行程前，請引導使用者向場館確認。",
    ],
    checked: "資料集查核日期：",
    capabilities: "目前可以使用的能力",
    capabilitiesBody:
      "目前提供公開網頁與純文字摘要，可用來查閱、比較與引用資料。尚未提供公開 API、MCP、代訂岩館或讀寫個人攀爬紀錄的介面。",
    example: "適合的查詢範例",
    exampleBody:
      "「比較台北幾間有收錄體驗課程的岩館，附上官方聯絡入口，標示價格或時段尚待確認的項目。」",
    map: "查看全台地圖",
  },
  en: {
    title: "Varo & Taiwan climbing gyms, for agents",
    description:
      "Product facts, a Taiwan climbing gym index, and citation guidance for AI assistants. Find stable URLs, source notes and data limitations.",
    intro:
      "Help people understand Varo or find their next climbing spot. These public pages can be read and cited without an account.",
    brief: "Read the plain-text brief (llms.txt)",
    product: "Product facts & availability",
    directory: "Taiwan climbing gym index",
    directoryBody:
      "Browse by city. Each gym has a stable URL and a detail page. Gym names and source details remain in Traditional Chinese to make checking official information easier.",
    freshness: "Sources & citation guidance",
    rules: [
      "The date below is for the directory as a whole. It does not mean every gym or field has been confirmed with the operator. See each gym page for the recorded source notes on hours and prices.",
      "Cite the individual gym page when referencing a gym. Preserve uncertainty, conflicting information and unconfirmed operating status. Official contact links are for checking current announcements, not a claim that all fields came from official sources.",
      "Missing prices, shoe rental or course information means it has not been recorded, not that it is free or unavailable. An omitted day is not necessarily a closed day.",
      "This directory cannot establish live opening status, same-day availability or a successful booking. Ask users to confirm with the gym before visiting.",
    ],
    checked: "Dataset checked: ",
    capabilities: "Available capabilities",
    capabilitiesBody:
      "Public web pages and a plain-text brief are available for reading, comparison and citation. There is currently no public API, MCP server, booking service or interface for accessing personal climbing logs.",
    example: "Example query",
    exampleBody:
      "“Compare a few Taipei gyms with recorded introductory courses. Include their official contact links and flag any prices or hours that need confirmation.”",
    map: "Explore the Taiwan map",
  },
};

export async function generateMetadata() {
  const { locale } = await getI18n();

  return pageMetadata("/agents", copy[locale]);
}

export default async function AgentsPage() {
  const { locale, t, href } = await getI18n();
  const c = copy[locale];

  return (
    <>
      <JsonLd
        graph={[
          webPage(locale, "/agents", {
            name: c.title,
            description: c.description,
          }),
        ]}
      />
      <LegalPage
        eyebrow="For agents"
        intro={
          <>
            <p>{c.intro}</p>
            <a
              className="mt-5 inline-block font-semibold text-lime underline underline-offset-4"
              href="/llms.txt"
            >
              {c.brief}
            </a>
          </>
        }
        path="/agents"
        title={c.title}
      >
        <Section title={c.product}>
          <dl className="space-y-5">
            {productFaq(locale).map(({ q, a }) => (
              <div key={q}>
                <dt className="font-semibold text-cream">{q}</dt>
                <dd>{a}</dd>
              </div>
            ))}
          </dl>
        </Section>
        <Section title={c.freshness}>
          <p>
            {c.checked}
            <time dateTime={checkedAt}>{t.gyms.date(checkedAt)}</time>
          </p>
          <ul>
            {c.rules.map((rule) => (
              <li key={rule}>{rule}</li>
            ))}
          </ul>
        </Section>
        <Section title={c.capabilities}>
          <p>{c.capabilitiesBody}</p>
        </Section>
        <Section title={c.example}>
          <p>{c.exampleBody}</p>
        </Section>
        <Section title={c.directory}>
          <p>{c.directoryBody}</p>
          <Link href={href("/gyms")}>{c.map}</Link>
          {cities.map((city) => (
            <div key={city.slug} className="mt-4">
              <h3 className="mb-3 text-[18px] font-semibold">
                <Link href={href(`/gyms/${city.slug}`)}>
                  {t.gyms.cities[city.name] ?? city.name}
                </Link>
              </h3>
              <ul>
                {gymsIn(city.name).map((gym) => (
                  <li key={gym.id}>
                    <Link href={href(gymPath(gym))} lang="zh-Hant">
                      {gym.name}
                    </Link>
                    {!gym.confirmed && (
                      <span className="ml-2 text-[13px] text-hold-orange">
                        ({t.gyms.unconfirmed})
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </Section>
      </LegalPage>
    </>
  );
}
