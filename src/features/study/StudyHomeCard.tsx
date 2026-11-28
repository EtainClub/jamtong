import Link from "next/link";

import { Jamtongi } from "./Jamtongi";

/**
 * 홈에서 잼공으로 가는 문(docs/daily-study.md §8.4). 정원 문 바로 위에 둔다.
 * 정보 화면에는 작은 진입로만 — 잼공 번들은 여기서 내려받지 않는다.
 */
export function StudyHomeCard() {
  return (
    <Link
      href="/study"
      className="mt-9 flex items-center gap-3 rounded-card border border-stone bg-canvas px-4 py-3.5 transition-colors hover:border-graphite"
    >
      <Jamtongi mood="cheer" size={44} />
      <span className="min-w-0 flex-1">
        <span className="block text-[15px] font-semibold leading-snug text-ink">잼공 · 오늘의 한 판</span>
        <span className="mt-1 block text-[12px] leading-relaxed text-smoke">
          재밌는 공부, 잼통 공부. 하루 4분, O/X로 업적의 근거를 익혀서 누가 물어도 자신 있게 답해요.
        </span>
      </span>
      <span aria-hidden="true" className="shrink-0 text-[13px] text-ash">
        →
      </span>
    </Link>
  );
}
