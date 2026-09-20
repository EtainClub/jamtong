import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { BackButton } from "@/features/app/BackButton";
import { ShareLanding } from "@/features/achievement/ShareLanding";
import { isStateful, resolveShare, shareSummary } from "@/lib/og/share-state";

/**
 * 공유된 화면 (설계서 36·37장).
 *
 * ★ 왜 주소가 따로 있는가.
 *   업적 페이지는 빌드 때 통째로 구워 둔다. 인스턴스를 띄워 두지 않으므로
 *   (apphosting.yaml `minInstances: 0`) 정적으로 내보내는 것이 첫 화면의
 *   속도다. 그런데 Next의 `opengraph-image.tsx`는 `params`만 받고 쿼리는
 *   받지 않는다 — 공유된 상태는 전부 쿼리에 있다.
 *
 *   업적 페이지가 쿼리를 읽게 만들면 22장이 전부 매 요청 렌더링으로 넘어가고,
 *   아무도 공유하지 않은 방문까지 콜드 스타트를 문다. 그래서 **공유 링크만**
 *   이 가벼운 주소를 지난다. 업적 페이지는 그대로 정적이다.
 *
 * 사람은 곧장 원래 주소로 간다. 크롤러는 자바스크립트를 돌리지 않으므로
 * 여기 머물러 카드를 읽는다. 자바스크립트가 꺼진 사람에게는 아래 링크가
 * 그대로 보인다 — 막다른 길로 두지 않는다.
 */
export const dynamic = "force-dynamic";

/** 시각 상태에 쓰이는 키만 넘긴다. 모르는 쿼리는 버린다. */
const STATE_KEYS = ["view", "scene", "t", "route", "at", "sc", "focus", "panel", "claim"];

function stateQuery(searchParams: Record<string, string | string[] | undefined>): string {
  const p = new URLSearchParams();
  for (const key of STATE_KEYS) {
    const value = searchParams[key];
    const one = Array.isArray(value) ? value[0] : value;
    if (one) p.set(key, one);
  }
  return p.toString();
}

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}): Promise<Metadata> {
  const [{ slug }, query] = await Promise.all([params, searchParams]);
  const state = resolveShare(slug, query);
  if (!state) return {};

  const summary = shareSummary(state);
  const qs = stateQuery(query);
  const card = `/api/share-card?slug=${encodeURIComponent(slug)}${qs ? `&${qs}` : ""}`;

  return {
    title: state.achievement.title,
    description: summary,
    /*
     * 색인하지 않는다. 같은 내용이 업적 주소로 이미 색인돼 있고, 이 주소는
     * 링크를 건네받은 사람이 지나가는 자리다.
     */
    robots: { index: false, follow: true },
    alternates: { canonical: `/achievement/${slug}` },
    openGraph: {
      type: "article",
      title: isStateful(state)
        ? `${state.achievement.title} — ${state.sceneLabel ?? "공유된 화면"}`
        : `${state.achievement.title} — ${state.achievement.subtitle}`,
      description: summary,
      images: [{ url: card, width: 1200, height: 630, alt: "잼통 공유 카드" }],
    },
    twitter: { card: "summary_large_image", images: [card] },
  };
}

export default async function SharedPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const [{ slug }, query] = await Promise.all([params, searchParams]);
  const state = resolveShare(slug, query);
  if (!state) notFound();

  const qs = stateQuery(query);
  const href = `/achievement/${slug}${qs ? `?${qs}` : ""}`;

  return (
    <main className="mx-auto flex min-h-dvh max-w-[560px] flex-col justify-center px-4 py-16">
      <ShareLanding href={href} />

      <p className="text-[12px] font-semibold text-ash">공유된 화면</p>
      <h1 className="mt-2 text-2xl font-light tracking-tight text-ink">
        {state.achievement.title}
      </h1>
      <p className="mt-3 text-[14px] leading-relaxed text-smoke">{shareSummary(state)}</p>

      <Link
        href={href}
        className="mt-6 inline-flex w-fit items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-eggshell"
      >
        이 화면으로 이동
      </Link>

      <div className="mt-8">
        <BackButton />
      </div>
    </main>
  );
}
