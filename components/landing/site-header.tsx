import Image from "next/image";
import Link from "next/link";

import { partnerHref } from "@/config/site";

/** Wordmark on the left; 理念 and (when an inbox is set) 場館合作 on the right. */
export function SiteHeader() {
  return (
    <header className="absolute inset-x-0 top-0 z-50">
      <div className="mx-auto flex h-16 w-full max-w-[1240px] items-center justify-between px-4 sm:h-20 sm:px-6 lg:px-8">
        <Link aria-label="VARO" className="flex h-11 items-center" href="/">
          <Image
            priority
            alt="VARO"
            className="h-[20px] w-auto sm:h-[22px]"
            height={172}
            src="/brand/varo-wordmark-white.png"
            width={1000}
          />
        </Link>
        <nav className="flex items-center gap-1">
          <Link
            className="flex h-11 items-center rounded-lg px-3.5 text-[15px] font-medium text-mute transition-colors hover:text-cream"
            href="/philosophy"
          >
            理念
          </Link>
          {partnerHref ? (
            <a
              className="flex h-11 items-center rounded-lg px-3.5 text-[15px] font-medium text-mute transition-colors hover:text-cream"
              href={partnerHref}
            >
              場館合作
            </a>
          ) : null}
        </nav>
      </div>
    </header>
  );
}
