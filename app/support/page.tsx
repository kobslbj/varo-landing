import type { Metadata } from "next";

import Link from "next/link";

import { LegalPage, Section } from "@/components/landing/legal-page";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "支援｜VARO",
  description: "VARO 的常見問題與聯絡方式。",
  alternates: { canonical: "/support" },
};

const email = siteConfig.contactEmail;

export default function SupportPage() {
  return (
    <LegalPage
      eyebrow="SUPPORT · 支援"
      intro={
        <>
          <p>遇到問題或有想法？最快的方式是在 App 內回報，或直接寫信給我們。</p>
          <a
            className="mt-6 inline-flex h-12 items-center rounded-lg bg-lime px-6 text-[16px] font-semibold text-ink transition-colors hover:bg-lime-deep"
            href={`mailto:${email}?subject=${encodeURIComponent("VARO 支援")}`}
          >
            寫信給 {email}
          </a>
        </>
      }
      title="需要幫忙嗎？"
    >
      <Section title="在 App 內回報問題或提供意見">
        <p>
          前往 <strong>「我」→「設定」</strong>
          ，選擇「意見回饋」或「回報問題」。App
          會一併附上版本資訊，方便我們更快找到原因。
        </p>
      </Section>

      <Section title="怎麼登入？">
        <p>
          VARO 使用「以 Apple 登入」。你可以選擇隱藏電子郵件，我們只會收到 Apple
          的轉寄地址。
        </p>
      </Section>

      <Section title="我的紀錄別人看得到嗎？">
        <p>
          預設只有你自己看得到。照片與影片存放在私人空間，只有你分享出去的內容才會被別人看見。詳細內容請見
          <Link href="/privacy">隱私權政策</Link>。
        </p>
      </Section>

      <Section title="照片或影片上傳失敗怎麼辦？">
        <p>
          上傳失敗的路線會出現紅色的重試標示，點一下就會重新上傳。檔案會先保存在手機上，網路恢復或重新登入後也會自動繼續上傳。
        </p>
      </Section>

      <Section title="找不到我的岩館？">
        <p>
          選擇岩館時如果搜尋不到，可以直接新增成只有你看得到的地點。也歡迎寫信告訴我們岩館名稱與地址，我們會儘快加入。
        </p>
      </Section>

      <Section title="如何刪除帳號？">
        <p>
          在 App 內前往 <strong>「我」→「設定」→「刪除帳號」</strong>
          。你的個人檔案、紀錄、照片與影片會永久刪除，無法復原，並會撤銷 VARO 的
          Apple 登入授權。如果無法登入，請寫信到{" "}
          <a href={`mailto:${email}`}>{email}</a> 協助處理。
        </p>
      </Section>

      <Section title="岩館合作">
        <p>
          如果你經營岩館，想討論路線資訊或合作，歡迎寫信到{" "}
          <a href={`mailto:${email}`}>{email}</a>。
        </p>
      </Section>
    </LegalPage>
  );
}
