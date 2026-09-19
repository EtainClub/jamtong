import Image from "next/image";
import Link from "next/link";

import { AppMenu } from "@/features/app/AppMenu";
import { UpdateNotice } from "@/features/app/UpdateNotice";

/** 상단 바. 로고와 메뉴만 둔다. 모바일에서 세로 공간은 가장 비싼 자원이다. */
export function AppTopBar() {
  return (
    <>
    <header className="sticky top-0 z-40 border-b border-stone bg-canvas/95 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-[560px] items-center justify-between gap-3 px-4">
        <Link href="/" className="flex items-center gap-2.5">
          <Image
            src="/images/jamtong-icon-sm.png"
            alt=""
            aria-hidden="true"
            width={28}
            height={28}
            priority
            className="h-7 w-7"
          />
          <span className="text-[15px] font-bold tracking-tight text-ink">
            이재명 업적 위키
          </span>
        </Link>

        <AppMenu />
      </div>
    </header>
    <UpdateNotice />
    </>
  );
}
