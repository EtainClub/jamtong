"use client";

import type { Claim, Eli5 } from "@/content/schema";
import { EvidenceButton } from "@/features/evidence/EvidenceButton";
import { CardCarousel } from "@/features/carousel/CardCarousel";
import { ELI5_ART } from "./art";

/**
 * 쉬운 설명 캐러셀.
 *
 * 넘기는 방식은 CardCarousel이 갖고, 여기는 카드 속만 그린다. 언행의
 * 쉽게 보기가 같은 껍데기를 쓴다 — 두 벌로 두면 한쪽에서 스냅을 고치고
 * 다른 쪽을 잊는다.
 *
 * 마지막 장면 다음에는 원문으로 넘어가는 문을 둔다. 쉬운 설명은 입구이지
 * 종착지가 아니다.
 */
export function Eli5Carousel({
  eli5,
  claims,
  onOpenFull,
  below,
}: {
  eli5: Eli5;
  claims: Claim[];
  onOpenFull: () => void;
  /**
   * 쉬운 카드와 “직접 움직여보기” 사이에 끼울 것. 쇼츠가 여기 들어간다.
   *
   * 마지막 버튼은 원문으로 넘어가는 문이므로 늘 맨 아래여야 한다. 쇼츠를
   * 그 아래 두면 문을 지나친 뒤에 영상이 나온다.
   */
  below?: React.ReactNode;
}) {
  return (
    <section aria-labelledby="eli5-heading">
      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ash">
        쉬운 설명 · 큰 그림으로 읽기
      </p>
      <p id="eli5-heading" className="mt-2.5 text-[15px] leading-relaxed text-smoke">
        {eli5.intro}
      </p>

      <div className="mt-5">
        <CardCarousel
          items={eli5.scenes}
          label={`장면 ${eli5.scenes.length}개. 좌우 화살표 키로 넘길 수 있어요.`}
          itemLabel={(i) => `${i + 1}번 장면`}
        >
          {(scene, i, total) => {
            const Art = ELI5_ART[scene.art];
            const supporting = scene.claimIds
              .map((id) => claims.find((c) => c.id === id))
              .filter((c): c is Claim => Boolean(c));

            return (
              <>
                <div className="aspect-[4/3] w-full">
                  <Art />
                </div>

                <p className="tabular mt-4 font-mono text-[11px] tracking-[0.1em] text-ash">
                  {String(i + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
                </p>
                <h3 className="mt-1.5 text-[21px] font-light leading-snug tracking-[-0.02em] text-ink">
                  {scene.title}
                </h3>
                <p className="mt-2.5 text-[14.5px] leading-relaxed text-smoke">
                  {scene.say}
                </p>

                <div className="mt-3.5 flex flex-wrap items-center gap-2">
                  {scene.fact && (
                    <span
                      className={`tabular rounded-full px-3 py-1.5 text-xs font-semibold ${
                        scene.fact.tone === "warm"
                          ? "bg-burgundy-tint text-burgundy"
                          : "bg-ink/15 text-navy"
                      }`}
                    >
                      {scene.fact.value}
                    </span>
                  )}
                  {supporting[0] && (
                    <EvidenceButton
                      claimId={supporting[0].id}
                      count={new Set(supporting.flatMap((c) => c.sourceIds)).size}
                    />
                  )}
                </div>
              </>
            );
          }}
        </CardCarousel>
      </div>

      {eli5.caveat && (
        <Caveat text={eli5.caveat.text} claimIds={eli5.caveat.claimIds} claims={claims} />
      )}

      {below}

      <button
        type="button"
        onClick={onOpenFull}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-card border border-stone bg-taupe px-5 py-3.5 text-sm font-semibold text-navy transition-colors hover:border-graphite"
      >
        직접 움직여보기
        <span aria-hidden="true">→</span>
      </button>
    </section>
  );
}

function Caveat({
  text,
  claimIds,
  claims,
}: {
  text: string;
  claimIds: string[];
  claims: Claim[];
}) {
  const claim = claims.find((c) => c.id === claimIds[0]);
  return (
    <div
      role="note"
      className="mt-5 rounded-[20px] border border-pending bg-pending-tint px-5 py-4"
    >
      <p className="text-[13px] leading-relaxed text-smoke">{text}</p>
      {claim && (
        <div className="mt-2.5">
          <EvidenceButton claimId={claim.id} count={claim.sourceIds.length} />
        </div>
      )}
    </div>
  );
}
