import Image from "next/image";
import Link from "next/link";

import { AppMenu } from "@/features/app/AppMenu";
import { ShareLinkButton } from "@/features/app/ShareLinkButton";
import { MyButton } from "@/features/app/MyButton";
import { UpdateNotice } from "@/features/app/UpdateNotice";

/** 공유할 만한 화면이 넘기는 것. 주면 오른쪽 위에 공유 버튼이 선다(언행·카르텔 상세와 같은 자리). */
export interface TopBarShare {
  title: string;
  surface: "trials" | "wiki" | "task";
  /** 스크린리더가 읽는 말. 예: "이 재판 화면 공유" */
  aria: string;
  /** 복사했을 때 스크린리더가 읽는 말. */
  copied: string;
}

/** 상단 바. 로고와 메뉴, 공유할 화면이면 공유 버튼. 모바일에서 세로 공간은 가장 비싼 자원이다. */
export function AppTopBar({ share }: { share?: TopBarShare } = {}) {
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

        <div className="flex items-center gap-2">
          {share && (
            <ShareLinkButton
              title={share.title}
              surface={share.surface}
              label={{ text: "공유", aria: share.aria, copied: share.copied }}
              compact
            />
          )}
          <MyButton />
          <AppMenu />
        </div>
      </div>
    </header>
    <UpdateNotice />
    </>
  );
}
