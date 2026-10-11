import type { Metadata } from "next";

import { LegalPage, Section } from "@/components/landing/legal-page";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "隱私權政策｜VARO",
  description: "VARO 會蒐集哪些資料、如何使用與保護，以及你可以怎麼刪除它們。",
  alternates: { canonical: "/privacy" },
};

const email = siteConfig.contactEmail;

export default function PrivacyPage() {
  return (
    <LegalPage
      eyebrow="PRIVACY · 隱私權政策"
      intro={
        <p>
          VARO 是一個抱石紀錄 App。我們只蒐集讓 App 運作所需要的資料，
          <strong>不放廣告、不追蹤你、也不販售任何資料</strong>
          。這份政策說明我們蒐集什麼、為什麼、存在哪裡，以及你可以如何刪除。
        </p>
      }
      title="隱私權政策"
      updated="2026.10.11"
    >
      <Section title="1. 我們蒐集的資料">
        <ul>
          <li>
            <strong>帳號資料：</strong>使用「以 Apple 登入」時，Apple
            提供的使用者識別碼與電子郵件（若你選擇「隱藏我的電子郵件」，我們只會收到
            Apple 的轉寄地址）。我們不會取得你的 Apple 密碼。
          </li>
          <li>
            <strong>個人檔案：</strong>
            暱稱、系統產生的使用者名稱、你上傳的頭貼，以及你自行填寫的主場岩館。
          </li>
          <li>
            <strong>開始使用時的問卷：</strong>攀岩資歷、使用目標、得知 VARO
            的管道。用來讓 App 的內容更適合你，以及了解大家怎麼認識 VARO。
          </li>
          <li>
            <strong>攀岩紀錄：</strong>
            你建立的訓練紀錄、路線（難度、顏色、牆面角度、嘗試次數、結果、備註）、Project
            與收藏的岩館，以及你新增的私人地點。
          </li>
          <li>
            <strong>照片與影片：</strong>
            只有你主動從相簿選取、加入紀錄或設為頭貼的檔案才會上傳。VARO
            不會讀取或上傳你相簿中其他的內容。
          </li>
          <li>
            <strong>意見回饋：</strong>你在 App
            內送出的意見或問題回報，以及當時的 App
            版本、平台與系統版本，方便我們排查問題。
          </li>
        </ul>
        <p>
          我們<strong>不會</strong>
          蒐集你的位置、聯絡人、廣告識別碼或瀏覽紀錄，App
          內也沒有第三方分析或廣告工具。
        </p>
      </Section>

      <Section title="2. 我們如何使用這些資料">
        <ul>
          <li>
            提供 App 的核心功能：登入、儲存與同步你的紀錄、顯示統計與進度。
          </li>
          <li>處理你送出的意見回饋與問題回報，並改善 App。</li>
          <li>維護服務安全，例如防止濫用。</li>
        </ul>
        <p>我們不會把你的資料用於廣告，也不會出售或出租給任何人。</p>
      </Section>

      <Section title="3. 誰看得到你的資料">
        <p>
          你的紀錄、照片與影片<strong>預設只有你自己看得到</strong>
          。照片與影片存放在私人儲存空間，只能透過短時效的授權連結讀取。你的頭貼與暱稱可能會被其他使用者看到。
        </p>
        <p>
          當你使用分享功能時，分享的圖片會由你透過系統的分享選單送出，送到哪裡、給誰，由你決定。
        </p>
      </Section>

      <Section title="4. 資料儲存與第三方服務">
        <p>我們透過以下服務提供 VARO，它們僅依我們的指示處理資料：</p>
        <ul>
          <li>
            <strong>Supabase：</strong>帳號驗證、資料庫與檔案儲存。資料存放在
            Supabase 的雲端伺服器上，可能位於台灣境外。
          </li>
          <li>
            <strong>Apple：</strong>「以 Apple 登入」與 App 的發佈。
          </li>
        </ul>
        <p>
          傳輸過程皆經過加密（HTTPS），資料庫以存取權限規則確保每位使用者只能讀寫自己的資料。
        </p>
      </Section>

      <Section title="5. 保存期間與刪除帳號">
        <p>
          只要你的帳號存在，我們就會保存你的資料。你可以隨時在 App 內前往
          <strong>「我」→「設定」→「刪除帳號」</strong>
          永久刪除帳號。刪除後，你的個人檔案、紀錄、照片與影片會一併刪除且無法復原，我們也會撤銷
          VARO 的 Apple
          登入授權。你送出的意見回饋會保留內容，但不再與你的帳號連結。
        </p>
        <p>
          如果無法登入 App，也可以寫信到 <a href={`mailto:${email}`}>{email}</a>{" "}
          請我們協助刪除。
        </p>
      </Section>

      <Section title="6. 你的權利">
        <p>
          依據中華民國《個人資料保護法》，你可以請求查詢、閱覽、複製、補充或更正、停止蒐集處理利用，或刪除你的個人資料。請寫信到{" "}
          <a href={`mailto:${email}`}>{email}</a>，我們會儘快回覆。
        </p>
      </Section>

      <Section title="7. 兒童">
        <p>
          VARO 並非針對 13
          歲以下兒童設計，我們也不會在知情的情況下蒐集兒童的個人資料。如果你發現有這樣的情況，請與我們聯絡，我們會刪除相關資料。
        </p>
      </Section>

      <Section title="8. 政策更新">
        <p>
          如果這份政策有重要變更，我們會更新本頁的「最後更新」日期，必要時也會在
          App 內通知你。
        </p>
      </Section>

      <Section title="9. 聯絡我們">
        <p>
          對隱私有任何問題，歡迎來信 <a href={`mailto:${email}`}>{email}</a>。
        </p>
      </Section>
    </LegalPage>
  );
}
