import type { Metadata } from "next";

import { AppTopBar } from "@/features/app/AppTopBar";
import { buildStudyBank } from "@/features/study/build";
import { StudyApp } from "@/features/study/StudyApp";

const TITLE = "잼공";
const DESCRIPTION = "재밌는 공부, 잼통 공부. 하루 몇 분씩 업적의 근거를 익혀서 누가 물어도 자신 있게 답해요.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  openGraph: { type: "website", title: TITLE, description: DESCRIPTION, url: "/study" },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
  /*
   * 색인하지 않는다. 잼공은 공부 레이어이고, 검색으로 닿아야 할 것은 원본 정보 페이지다
   * (docs/daily-study.md §8.3, docs/garden-game.md §1). 크롤링은 막지 않아야 noindex를 읽는다.
   */
  robots: { index: false, follow: true },
};

export default function StudyPage() {
  // 문항 은행은 빌드 때 콘텐츠에서 만든다. 콘텐츠 전체는 클라이언트로 보내지 않는다.
  const bank = buildStudyBank();

  return (
    <>
      <AppTopBar />
      <main id="main" className="mx-auto w-full max-w-[560px] flex-1 px-4">
        <StudyApp bank={bank} />
      </main>
      {/* 사이트 하단 탭(BottomNav)은 두지 않는다. 잼공은 제 하단 탭을 StudyApp 안에서 그린다(정원과 같다). */}
    </>
  );
}
