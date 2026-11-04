import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { GardenLanding } from "@/features/garden/GardenLanding";
import { gardenSummary, loadGardenCard } from "@/lib/og/garden-state";

/**
 * 정원 자랑 링크 — /g/<공개id> (docs/garden-game.md §3.10).
 *
 * /s/[slug]와 같은 까닭으로 따로 둔다. 정원(/garden)은 정적 페이지라 쿼리를 읽어
 * 카드를 바꿀 수 없다. 크롤러는 여기 머물러 카드를 읽고, 사람은 곧장 친구 정원
 * (/garden?visit=<공개id>)으로 간다. 자바스크립트가 꺼진 사람에게는 링크가 보인다.
 *
 * 미리보기 글에는 정원 이름(사람이 지은 글)을 싣지 않는다(lib/og/garden-state.ts).
 */
export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ gid: string }> }): Promise<Metadata> {
  const { gid } = await params;
  const card = await loadGardenCard(gid);
  if (!card) return { robots: { index: false, follow: false } };
  const image = `/api/garden-card?gid=${gid}`;
  const title = "친구가 잼통 정원에 초대했어요";
  const description = gardenSummary(card);
  return {
    title,
    description,
    // 색인하지 않는다. 링크를 건네받은 사람이 지나가는 자리다.
    robots: { index: false, follow: true },
    openGraph: {
      type: "website",
      title,
      description,
      images: [{ url: image, width: 1200, height: 630, alt: "잼통 정원 자랑 카드" }],
    },
    twitter: { card: "summary_large_image", images: [image] },
  };
}

export default async function GardenLinkPage({ params }: { params: Promise<{ gid: string }> }) {
  const { gid } = await params;
  const card = await loadGardenCard(gid);
  if (!card) notFound();
  const href = `/garden?visit=${gid}`;

  return (
    <main className="mx-auto flex min-h-dvh max-w-[560px] flex-col justify-center px-4 py-16">
      <GardenLanding href={href} />
      <p className="text-[12px] font-semibold text-ash">잼통 정원</p>
      <h1 className="mt-2 text-2xl font-light tracking-tight text-ink">친구가 정원에 초대했어요</h1>
      <p className="mt-3 text-[14px] leading-relaxed text-smoke">{gardenSummary(card)}</p>
      <Link
        href={href}
        className="mt-6 inline-flex w-fit items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-eggshell"
      >
        친구 정원으로 가기
      </Link>
    </main>
  );
}
