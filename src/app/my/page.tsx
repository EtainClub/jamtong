import type { Metadata } from "next";

import { AppTopBar } from "@/features/app/AppTopBar";
import { BottomNav } from "@/features/app/BottomNav";
import { MyPanel } from "@/features/my/MyPanel";

export const metadata: Metadata = {
  title: "MY",
  description: "내 계정과 AI에게 물어본 이력.",
  /*
   * 색인하지 않는다. 남이 검색으로 닿을 화면이 아니고, 로그인 전에는 빈
   * 껍데기로 보인다. robots.txt도 같은 곳을 막는다 — 둘 다 둔다.
   */
  robots: { index: false, follow: false },
};

export default function MyPage() {
  return (
    <>
      <AppTopBar />

      <main id="main" className="mx-auto w-full max-w-[560px] flex-1 px-4 pb-10 pt-6">
        <h1 className="text-2xl font-light tracking-[-0.02em] text-ink">MY</h1>
        <p className="mt-2 text-[13px] leading-relaxed text-smoke">
          내 계정과, AI 안내에 물어본 것들입니다.
        </p>
        <MyPanel />
      </main>

      <BottomNav />
    </>
  );
}
