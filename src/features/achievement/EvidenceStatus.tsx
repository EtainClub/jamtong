import type { Achievement } from "@/content/schema";

/**
 * 근거의 상태를 숨기지 않는다.
 *
 * 초안이면 배너로 크게, 공개된 뒤에는 조용한 한 줄로 남는다.
 * 공개했다고 자료의 한계가 사라지는 것이 아니므로 문장은 그대로 간다.
 * 스스로 밝히면 방어가 되고, 지우면 공격거리가 된다.
 */
export function EvidenceStatus({ achievement }: { achievement: Achievement }) {
  const isDraft = achievement.publishStatus === "draft";
  const pending = achievement.claims.filter((c) => !c.verified);
  const needed = achievement.sources.filter((s) => s.publisher === "미정");

  if (!isDraft) {
    if (!achievement.sourceNote) return null;
    return (
      <aside
        role="note"
        aria-label="근거의 한계"
        className="mx-auto mt-8 max-w-5xl px-5"
      >
        <p className="border-l-2 border-stone pl-4 text-[13px] leading-relaxed text-ash">
          {achievement.sourceNote}
        </p>
      </aside>
    );
  }

  return (
    <aside role="note" className="mx-auto mt-10 max-w-5xl px-5" aria-label="검증 상태">
      <div className="rounded-card border border-pending/30 bg-pending-tint px-5 py-5">
        <p className="text-sm font-semibold text-pending">검증 전 골격입니다 — 공개 전 단계</p>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-smoke">
          {pending.length > 0 ? (
            <>
              화면 구성과 흐름을 검토하기 위한 초안입니다. 수치·연표·구조 설명{" "}
              {pending.length}건이 아직 1차 자료로 대조되지 않았고, 이 상태로는 공개
              목록에 오르지 않습니다.
            </>
          ) : (
            achievement.sourceNote ??
            "모든 주장에 근거가 붙었지만 아직 편집 검토가 끝나지 않아 공개 목록에 올리지 않았습니다."
          )}
        </p>

        {needed.length > 0 && (
          <div className="mt-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-ash">
              필요한 자료
            </p>
            <ul className="mt-2 space-y-1.5">
              {needed.map((source) => (
                <li key={source.id} className="text-sm leading-relaxed text-smoke">
                  <span aria-hidden="true" className="mr-2 text-pending">
                    ·
                  </span>
                  {source.title.replace(/^\[필요\]\s*/, "")}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </aside>
  );
}
