"use client";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <main className="grid min-h-dvh place-items-center px-6 text-center">
      <div>
        <h1 className="display-zh text-[32px]">頁面暫時無法載入</h1>
        <button
          className="mt-6 h-11 rounded-lg bg-lime px-5 font-semibold text-ink"
          type="button"
          onClick={() => reset()}
        >
          重新整理
        </button>
      </div>
    </main>
  );
}
