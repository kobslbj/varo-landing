"use client";

import { useParams } from "next/navigation";

// Client component: can't read the server dictionaries, so its two strings live here.
const copy = {
  "zh-TW": { title: "頁面暫時無法載入", retry: "重新整理" },
  en: { title: "This page couldn't load", retry: "Try again" },
  ja: { title: "ページを読み込めませんでした", retry: "再読み込み" },
  ko: { title: "페이지를 불러오지 못했어요", retry: "다시 시도" },
};

export default function Error({ reset }: { error: Error; reset: () => void }) {
  const { lang } = useParams<{ lang: string }>();
  const t = copy[lang as keyof typeof copy] ?? copy["zh-TW"];

  return (
    <main className="grid min-h-dvh place-items-center px-6 text-center">
      <div>
        <h1 className="display-zh text-[32px]">{t.title}</h1>
        <button
          className="mt-6 h-11 rounded-lg bg-lime px-5 font-semibold text-ink"
          type="button"
          onClick={() => reset()}
        >
          {t.retry}
        </button>
      </div>
    </main>
  );
}
