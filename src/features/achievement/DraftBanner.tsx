import type { Achievement } from "@/content/schema";

/**
 * 초안임을 숨기지 않는다.
 *
 * draft 업적은 피드에 오르지 않고 noindex이며, published로 올리는 순간
 * validateAchievement가 미검증 claim을 이유로 빌드를 깬다.
 *
 * 미검증이 0인데도 draft로 남는 경우가 있다. 근거는 다 붙었지만 자료의 무게가
 * 고르지 않을 때다 — 대장동이 그렇다. 면적·절차는 1차 자료인데 금액은 보도뿐이다.
 * 그때는 "몇 건이 미검증"이 아니라 왜 아직 초안인지를 적어야 한다.
 */
export function DraftBanner({ achievement }: { achievement: Achievement }) {
  if (achievement.publishStatus !== "draft") return null;

  const pending = achievement.claims.filter((c) => !c.verified);
  const needed = achievement.sources.filter((s) => s.publisher === "미정");

  return (
    <aside
      role="note"
      className="mx-auto mt-10 max-w-5xl px-5"
      aria-label="검증 상태"
    >
      <div className="rounded-card border border-pending/30 bg-pending-tint px-5 py-5">
        <p className="text-sm font-semibold text-pending">
          검증 전 골격입니다 — 공개 전 단계
        </p>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-smoke">
          {pending.length > 0 ? (
            <>
              화면 구성과 흐름을 검토하기 위한 초안입니다. 수치·연표·구조 설명{" "}
              {pending.length}건이 아직 1차 자료로 대조되지 않았고, 이 상태로는 공개
              목록에 오르지 않습니다.
            </>
          ) : (
            <>
              모든 주장에 근거가 붙었지만 자료의 무게가 고르지 않습니다. 면적과 절차는
              공공기관이 낸 1차 자료인데, 금액은 공개된 공식 자료가 없어 보도에 기대고
              있습니다. 그래서 아직 공개 목록에 올리지 않았습니다.
            </>
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
