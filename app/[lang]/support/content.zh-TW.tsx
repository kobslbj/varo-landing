import type { ReactNode } from "react";

import Link from "next/link";

import { LegalPage, Section } from "@/components/landing/legal-page";
import { siteConfig } from "@/config/site";

export const meta = {
  title: "支援｜VARO",
  description: "VARO 的常見問題與聯絡方式。",
};

const email = siteConfig.contactEmail;

/** Each entry is a section on the page and a Question in the FAQPage structured data. */
export const faq: { q: string; a: ReactNode }[] = [
  {
    q: "在 App 內回報問題或提供意見",
    a: (
      <p>
        前往 <strong>「我」→「設定」</strong>
        ，選擇「意見回饋」或「回報問題」。App
        會一併附上版本資訊，方便我們更快找到原因。
      </p>
    ),
  },
  {
    q: "怎麼登入？",
    a: (
      <p>
        VARO 使用「以 Apple 登入」。你可以選擇隱藏電子郵件，我們只會收到 Apple
        的轉寄地址。
      </p>
    ),
  },
  {
    q: "我的紀錄別人看得到嗎？",
    a: (
      <p>
        預設只有你自己看得到。照片存放在私人空間，影片只存在你的手機，只有你分享出去的內容才會被別人看見。詳細內容請見
        <Link href="/privacy">隱私權政策</Link>。
      </p>
    ),
  },
  {
    q: "影片存在哪裡？換手機會不見嗎？",
    a: (
      <p>
        影片只存在你的手機，不會上傳到雲端，VARO
        只保存縮圖與影片長度等資訊。刪除 App 後影片就無法再播放；換手機時，用
        iCloud
        備份或「快速開始」搬移資料，影片通常會一起搬過去。雲端備份功能規劃中。
      </p>
    ),
  },
  {
    q: "照片上傳失敗怎麼辦？",
    a: (
      <p>
        上傳失敗的路線會出現紅色的重試標示，點一下就會重新上傳。檔案會先保存在手機上，網路恢復或重新登入後也會自動繼續上傳。
      </p>
    ),
  },
  {
    q: "找不到我的岩館？",
    a: (
      <p>
        選擇岩館時如果搜尋不到，可以直接新增成只有你看得到的地點。也歡迎寫信告訴我們岩館名稱與地址，我們會儘快加入。
      </p>
    ),
  },
  {
    q: "如何刪除帳號？",
    a: (
      <p>
        在 App 內前往 <strong>「我」→「設定」→「刪除帳號」</strong>
        。你的個人檔案、紀錄、照片，以及這支手機上 VARO
        保存的影片會永久刪除，無法復原，並會撤銷 VARO 的 Apple
        登入授權。如果無法登入，請寫信到 <a href={`mailto:${email}`}>
          {email}
        </a>{" "}
        協助處理。
      </p>
    ),
  },
  {
    q: "岩館合作",
    a: (
      <p>
        如果你經營岩館，想討論路線資訊或合作，歡迎寫信到{" "}
        <a href={`mailto:${email}`}>{email}</a>。
      </p>
    ),
  },
];

export default function SupportZh() {
  return (
    <LegalPage
      eyebrow="SUPPORT · 支援"
      intro={
        <>
          <p>遇到問題或有想法？最快的方式是在 App 內回報，或直接寫信給我們。</p>
          <a
            className="mt-6 inline-flex h-12 items-center rounded-lg bg-lime px-6 text-[16px] font-semibold text-night transition-colors hover:bg-lime-deep"
            href={`mailto:${email}?subject=${encodeURIComponent("VARO 支援")}`}
          >
            寫信給 {email}
          </a>
        </>
      }
      path="/support"
      title="需要幫忙嗎？"
    >
      {faq.map(({ q, a }) => (
        <Section key={q} title={q}>
          {a}
        </Section>
      ))}
    </LegalPage>
  );
}
