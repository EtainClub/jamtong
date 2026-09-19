import type { Metadata } from "next";

import { AppTopBar } from "@/features/app/AppTopBar";
import { BottomNav } from "@/features/app/BottomNav";
import { MyPanel } from "@/features/my/MyPanel";

export const metadata: Metadata = {
  title: "MY",
  description: "내 계정과 AI에게 물어본 이력.",
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
