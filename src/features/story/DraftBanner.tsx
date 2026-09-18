import type { Story } from "@/content/schema";

/**
 * 검증 전 골격임을 숨기지 않는다.
 *
 * draft 스토리는 피드에 오르지 않고 noindex이며, publishStatus를 published로
 * 올리는 순간 validateStory가 미검증 claim을 이유로 빌드를 깬다.
 * 즉 이 배너가 붙은 화면은 구조상 공개 경로에 들어갈 수 없다.
 */
export function DraftBanner({ story }: { story: Story }) {
  if (story.publishStatus !== "draft") return null;

  const pending = story.claims.filter((c) => !c.verified);
  const needed = story.sources.filter((s) => s.publisher === "미정");

  return (
    <aside
      role="note"
      className="mx-auto mt-10 max-w-5xl px-5"
      aria-label="검증 상태"
    >
      <div className="rounded-xl border border-warm-400/30 bg-warm-400/[0.07] px-5 py-5">
        <p className="text-sm font-semibold text-warm-400">
          검증 전 골격입니다 — 공개 전 단계
        </p>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-text-secondary">
          화면 구성과 흐름을 검토하기 위한 초안입니다. 수치·연표·구조 설명
          {pending.length}건이 아직 1차 자료로 대조되지 않았고, 이 상태로는
          공개 목록에 오르지 않습니다.
        </p>

        {needed.length > 0 && (
          <div className="mt-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-text-muted">
              필요한 자료
            </p>
            <ul className="mt-2 space-y-1.5">
              {needed.map((source) => (
                <li key={source.id} className="text-sm leading-relaxed text-text-secondary">
                  <span aria-hidden="true" className="mr-2 text-warm-400">
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
