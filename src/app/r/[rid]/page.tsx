import Link from "next/link";
import type { Metadata } from "next";

import { formatClock, formatLeft, INVITE_CODE } from "@/features/garden/rules";
import { GardenLanding } from "@/features/garden/GardenLanding";
import { loadRaidCard, raidTitle, type RaidCard } from "@/lib/og/raid-state";

/**
 * "같이 잡자" 링크 — /r/<물결id>?i=<초대 코드> (docs/garden-game.md §3.8).
 *
 * /g/[gid]와 같은 까닭으로 따로 둔다. 크롤러는 여기 머물러 남은 체력이 그려진 카드를 읽고,
 * 사람은 곧장 광장(/garden?tab=plaza)으로 간다. 초대 코드는 그대로 건넨다.
 * 물결이 없거나 읽지 못해도 광장으로 보낸다 — 링크가 막다른 길이 되지 않게.
 */
export const dynamic = "force-dynamic";

type Props = { params: Promise<{ rid: string }>; searchParams: Promise<{ i?: string }> };

async function load(rid: string): Promise<RaidCard | null> {
  try {
    return await loadRaidCard(rid);
  } catch (error) {
    console.error("[raid-card] 거대 잡초를 읽지 못했다", error);
    return null;
  }
}

function describe(card: RaidCard | null): string {
  if (!card) return "잼통 정원 광장에 거대 잡초가 나타나요. 혼자서는 못 잡아요 — 여럿이 모여 쓰러뜨리고 희귀 씨앗을 받아요.";
  if (card.phase === "defeated") return `${card.fighters}명이 함께 쓰러뜨렸어요. 다음 거대 잡초는 광장이 다시 무성해지면 나타나요.`;
  if (card.phase === "escaped") return `${card.fighters}명이 모였지만 놓쳤어요. 다음 거대 잡초는 ${card.need}명이 모여 잡아요.`;
  return `체력 ${card.left}/${card.hp} 남음 · 함께 ${card.fighters}명 · ${formatLeft(card.escapeIn)} 뒤 도망가요. ${
    card.gapAt !== null ? `빈틈(${formatClock(card.gapAt, Date.now())}부터 3분)에 모이면 ${card.needLeast}명, 아니면 ${card.need}명이면 잡아요.` : `${card.need}명이 모이면 잡아요.`
  }`;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { rid } = await params;
  const card = await load(rid);
  const title = raidTitle(card);
  const description = describe(card);
  // 분 단위로 주소를 바꾼다. 미리보기가 그림을 오래 붙들어 지난 체력을 보여 주지 않게.
  const image = `/api/raid-card?rid=${encodeURIComponent(rid)}&t=${Math.floor(Date.now() / 60_000)}`;
  return {
    title,
    description,
    robots: { index: false, follow: true },
    openGraph: {
      type: "website",
      title,
      description,
      images: [{ url: image, width: 1200, height: 630, alt: "잼통 정원 거대 잡초 카드" }],
    },
    twitter: { card: "summary_large_image", title, description, images: [image] },
  };
}

export default async function RaidLinkPage({ params, searchParams }: Props) {
  const [{ rid }, { i }] = await Promise.all([params, searchParams]);
  const card = await load(rid);
  const href = `/garden?tab=plaza${i && INVITE_CODE.test(i) ? `&invite=${i}` : ""}`;

  return (
    <main className="mx-auto flex min-h-dvh max-w-[560px] flex-col justify-center px-4 py-16">
      <GardenLanding href={href} />
      <p className="text-[12px] font-semibold text-ash">잼통 정원 · 광장</p>
      <h1 className="mt-2 text-2xl font-light tracking-tight text-ink">{raidTitle(card)}</h1>
      <p className="mt-3 text-[14px] leading-relaxed text-smoke">{describe(card)}</p>
      <Link
        href={href}
        className="mt-6 inline-flex w-fit items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-eggshell"
      >
        광장으로 가기
      </Link>
    </main>
  );
}
