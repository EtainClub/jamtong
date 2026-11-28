"use client";

import { Say } from "./Jamtongi";
import { learned, type Box } from "./rules";
import type { StudyBank } from "./types";

/**
 * 말하기 › 도는 말 — 사람이 승인한 판정이 있는 도는 말만 모은다(docs/jamgong-roadmap.md R5·R6).
 * 하나를 누르면 「이 말, 맞을까?」와 (있으면) 그 말을 지인이 보냈을 때의 대화 답장을 이어서 푼다.
 *
 * ★ 도는 말 문장은 문제 화면에서만, 늘 판정·근거와 함께 보인다(§8). 목록에는 판정을 미리 적지 않는다 — 풀기 전에 답을 보지 않게.
 */
export function Rumors({ bank, boxes, onItems }: { bank: StudyBank; boxes: Record<string, Box>; onItems: (ids: string[]) => void }) {
  const checks = bank.items.filter((i) => i.skill === "C2" && i.kind === "choice");
  if (checks.length === 0) return <Say mood="think">판정이 승인된 도는 말이 아직 없어요.</Say>;

  const replyOf = (id: string) => {
    const r = id.replace(/\/v-/, "/r-");
    return bank.items.some((i) => i.id === r) ? r : null;
  };
  const run = (id: string) => onItems([id, ...(replyOf(id) ? [replyOf(id)!] : [])]);
  const done = (id: string) => learned(boxes[id]);
  const nextOne = checks.find((i) => !boxes[i.id]) ?? checks.find((i) => !done(i.id));
  const units = bank.units.filter((u) => checks.some((i) => i.unit === u.id));

  return (
    <div className="grid gap-3">
      <Say mood="smile">
        SNS에서 도는 말이에요. <b>맞는지, 일부만 맞는지, 아직 모르는지</b> 근거로 가려 봐요.
      </Say>
      {nextOne && (
        <button type="button" className="st-btn st-btn-jam w-full text-[16px]" onClick={() => run(nextOne.id)}>
          오늘의 도는 말 하나
        </button>
      )}
      <p className="st-small">
        도는 말 {checks.length}개 · 가려낸 것 {checks.filter((i) => done(i.id)).length} · 판정은 사람이 근거를 확인하고 승인한 것만 실어요
      </p>
      {units.map((u) => (
        <section key={u.id} aria-label={u.title} className="grid gap-1.5">
          <p className="st-eyebrow pt-2">{u.title}</p>
          {checks
            .filter((i) => i.unit === u.id)
            .map((i) => (
              <button key={i.id} type="button" className="st-card flex items-start gap-2 text-left" onClick={() => run(i.id)}>
                <span aria-hidden="true">{done(i.id) ? "✅" : "🗯️"}</span>
                <span className="min-w-0 text-[13.5px]">{i.statement}</span>
              </button>
            ))}
        </section>
      ))}
    </div>
  );
}
