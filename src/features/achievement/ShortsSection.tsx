import type { Claim, Short } from "@/content/schema";
import { EvidenceButton } from "@/features/evidence/EvidenceButton";

/**
 * ⑦ 쇼츠.
 *
 * 영상은 유튜브에 있고 여기서는 틀기만 한다. 저장소에 영상을 두면 몇 편 만에
 * 무거워지고, 유튜브에 원본이 있으면 그쪽 유입도 생긴다.
 *
 * `youtube-nocookie.com`을 쓴다. 재생 전에는 추적 쿠키를 심지 않는다.
 * 그리고 iframe을 즉시 붙이지 않는다 — 쇼츠가 화면 아래쪽에 있는데 스토리를
 * 열자마자 유튜브 플레이어를 통째로 받으면, 지도와 차트가 밀린다.
 */

function Frame({ short, claims }: { short: Short; claims: Claim[] }) {
  // 영상 하나가 여러 주장을 건드리면 그 전부에 근거가 붙어야 한다.
  const cited = short.claimIds
    .map((id) => claims.find((c) => c.id === id))
    .filter((c): c is Claim => Boolean(c));

  return (
    <figure className="m-0">
      <div className="mx-auto w-full max-w-[300px]">
        <div className="relative aspect-[9/16] overflow-hidden rounded-card border border-stone bg-taupe">
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${short.youtubeId}?rel=0&modestbranding=1`}
            title={short.title}
            loading="lazy"
            allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="absolute inset-0 h-full w-full"
          />
        </div>
      </div>

      <figcaption className="mx-auto mt-4 w-full max-w-[300px]">
        <p className="text-sm font-semibold leading-snug text-ink">{short.title}</p>
        {short.summary && (
          <p className="mt-1.5 text-[13px] leading-relaxed text-smoke">{short.summary}</p>
        )}
        {/* 짧을수록 맥락이 잘린다. 근거는 영상 옆에 늘 붙어 있어야 한다. */}
        {cited.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {cited.map((claim) => (
              <EvidenceButton
                key={claim.id}
                claimId={claim.id}
                count={claim.sourceIds.length}
              />
            ))}
          </div>
        )}
      </figcaption>
    </figure>
  );
}

export function ShortsSection({ shorts, claims }: { shorts: Short[]; claims: Claim[] }) {
  if (shorts.length === 0) return null;

  return (
    <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
      {shorts.map((short) => (
        <Frame key={short.id} short={short} claims={claims} />
      ))}
    </div>
  );
}
