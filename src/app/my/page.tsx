import type { Metadata } from "next";

import { AppTopBar } from "@/features/app/AppTopBar";
import { BottomNav } from "@/features/app/BottomNav";
import { buildCatalog } from "@/features/garden/catalog";
import { MyPanel } from "@/features/my/MyPanel";

export const metadata: Metadata = {
  title: "MY",
  description: "내 정원, AI에게 물어본 이력, 내가 남긴 것, 계정과 데이터.",
  /*
   * 색인하지 않는다. 남이 검색으로 닿을 화면이 아니고, 로그인 전에는 빈
   * 껍데기로 보인다. 크롤링은 허용해야 검색엔진이 이 noindex를 읽을 수 있다.
   * 개인 이력의 접근 제어는 기존 인증과 Firestore 보안 규칙이 맡는다.
   */
  robots: { index: false, follow: false },
};

export default function MyPage() {
  // 도감의 전체 칸 수. 품종표는 서버에서만 만든다 — 콘텐츠 전체를 클라이언트로 보내지 않는다.
  const speciesTotal = buildCatalog().length;
  return (
    <>
      <AppTopBar />

      <main id="main" className="mx-auto w-full max-w-[560px] flex-1 px-4 pb-10 pt-6">
        <h1 className="text-2xl font-light tracking-[-0.02em] text-ink">MY</h1>
        <p className="mt-2 text-[13px] leading-relaxed text-smoke">
          내 정원, AI에게 물어본 것, 내가 남긴 것, 그리고 무엇이 어디에 남는지.
        </p>
        <MyPanel speciesTotal={speciesTotal} />
      </main>

      <BottomNav />
    </>
  );
}
