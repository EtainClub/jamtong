import type { Metadata } from "next";

import { AppTopBar } from "@/features/app/AppTopBar";
import { buildCatalog, buildLeaves } from "@/features/garden/catalog";
import { GardenApp } from "@/features/garden/GardenApp";

const TITLE = "잼통 정원";
const DESCRIPTION = "업적 씨앗을 심고, 키우고, 거둬서 잼을 만드는 정원. 열매마다 근거가 붙은 쪽지가 들어 있어요.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  /*
   * 미리보기 글을 정원 것으로. 이것이 없으면 사이트 기본 openGraph를 물려받아 정원 링크에
   * 잼통 위키 소개가 붙는다. 그림은 같은 폴더의 opengraph-image.tsx가 건다.
   * 내 정원 링크(/g/<공개id>)는 거기서 자랑 카드를 따로 건다.
   */
  openGraph: { type: "website", title: TITLE, description: DESCRIPTION, url: "/garden" },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
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

      {/*
       * 사이트 하단 탭(BottomNav)은 두지 않는다. 정원은 제 하단 탭(방·텃밭·광장·상점·1촌)을
       * GardenApp 안에서 그리고, 위쪽 바의 "← 잼통"이 정보 페이지로 돌아가는 길이다
       * (docs/garden-miniroom.md §3.1). 하단 바를 둘 겹치지 않는다.
       */}
    </>
  );
}
