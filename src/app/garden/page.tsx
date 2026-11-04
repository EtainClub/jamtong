import type { Metadata } from "next";

import { AppTopBar } from "@/features/app/AppTopBar";
import { BottomNav } from "@/features/app/BottomNav";
import { buildCatalog, buildLeaves } from "@/features/garden/catalog";
import { GardenApp } from "@/features/garden/GardenApp";

export const metadata: Metadata = {
  title: "잼통 정원",
  description: "업적 씨앗을 심고, 키우고, 거둬서 잼을 만드는 정원. 열매마다 근거가 붙은 쪽지가 들어 있다.",
  /*
   * 색인하지 않는다. 정원은 게임 레이어이고, 검색으로 닿아야 할 것은 원본
   * 정보 페이지다(docs/garden-game.md §1). 크롤링은 막지 않아야 noindex를 읽는다.
   */
  robots: { index: false, follow: true },
};

export default function GardenPage() {
  // 품종표는 빌드 때 콘텐츠에서 만든다. 콘텐츠 전체는 클라이언트로 보내지 않는다.
  const catalog = buildCatalog();
  // 시든 잎(원문 링크가 열리지 않았던 출처)도 빌드 때 링크 확인 표에서 만든다.
  const leaves = buildLeaves();

  return (
    <>
      <AppTopBar />

      <main id="main" className="mx-auto w-full max-w-[560px] flex-1 px-4 pt-6">
        <GardenApp catalog={catalog} leaves={leaves} />
      </main>

      <BottomNav />
    </>
  );
}
