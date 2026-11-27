import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { GardenLanding } from "@/features/garden/GardenLanding";
import { INVITE_CODE } from "@/features/garden/rules";
import { loadPhotoAnchor, photoCaption } from "@/lib/og/album-photo";
import { loadGardenCard } from "@/lib/og/garden-state";

/**
 * 사진첩 사진 한 장의 링크 — /g/<공개id>/p/<사진id>.
 *
 * /g/[gid]와 같은 까닭으로 따로 둔다. 크롤러는 여기 머물러 그 사진의 미리보기를 읽고,
 * 사람은 곧장 그 방의 그 사진(/garden?visit=<공개id>&photo=<사진id>)으로 간다.
 * 사진첩 전체가 아니라 이 한 장을 연다. 전체는 그 화면의 "사진첩 전체 보기"로.
 *
 * 미리보기 글은 앵커의 제목(콘텐츠)뿐이다. 주인의 한 줄·닉네임은 싣지 않는다(lib/og/album-photo.ts).
 */
export const dynamic = "force-dynamic";

type Params = Promise<{ gid: string; pid: string }>;

async function load(gid: string, pid: string) {
  const [card, a] = await Promise.all([loadGardenCard(gid), loadPhotoAnchor(gid, pid)]);
  return card && a ? { card, caption: photoCaption(a) } : null;
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { gid, pid } = await params;
  const got = await load(gid, pid);
  if (!got) return { robots: { index: false, follow: false } };
  const image = `/api/garden-card?gid=${gid}&v=room2`;
  const title = `친구의 사진첩 · ${got.caption} · 잼통 정원`;
  const description = "친구가 사진첩에 담은 한 장이에요. 출처와 근거가 사진에 그대로 붙어 있어요.";
  return {
    title,
    description,
    // 색인하지 않는다. 링크를 건네받은 사람이 지나가는 자리다.
    robots: { index: false, follow: true },
    openGraph: {
      type: "website",
      title,
      description,
      images: [{ url: image, width: 1200, height: 630, alt: "친구가 꾸민 잼통 정원의 방" }],
    },
    twitter: { card: "summary_large_image", images: [image] },
  };
}

export default async function PhotoLinkPage({ params, searchParams }: { params: Params; searchParams: Promise<{ i?: string }> }) {
  const [{ gid, pid }, { i }] = await Promise.all([params, searchParams]);
  const got = await load(gid, pid);
  if (!got) notFound();
  // 보낸 사람의 초대 코드(?i=)를 정원으로 건넨다(/g/[gid]와 같다).
  const href = `/garden?visit=${gid}&photo=${pid}${i && INVITE_CODE.test(i) ? `&invite=${i}` : ""}`;

  return (
    <main className="mx-auto flex min-h-dvh max-w-[560px] flex-col justify-center px-4 py-16">
      <GardenLanding href={href} />
      <p className="text-[12px] font-semibold text-ash">잼통 정원 · 사진첩</p>
      <h1 className="mt-2 text-2xl font-light tracking-tight text-ink">{got.caption}</h1>
      <p className="mt-3 text-[14px] leading-relaxed text-smoke">친구가 사진첩에 담은 한 장이에요. 출처와 근거가 사진에 그대로 붙어 있어요.</p>
      <Link
        href={href}
        className="mt-6 inline-flex w-fit items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-eggshell"
      >
        사진 보러 가기
      </Link>
    </main>
  );
}
