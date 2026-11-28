"use client";

import { Say } from "./Jamtongi";
import type { Box } from "./rules";
import type { StudyBank } from "./types";

/**
 * 말하기 › 쟁점 연습 — 4단계 「답하기」(docs/jamgong-roadmap.md R3).
 * 업적마다 실제로 제기된 쟁점 질문을 지인 메시지로 받아, 답의 뼈대와 근거를 고르고 모범 답변을 본다.
 *
 * ★ 목록은 업적별로, 이미 익힌 것은 ✅. 「오늘의 연습 하나」는 아직 안 했거나 다시 볼 때가 된 것부터 하나.
 * ★ 반론은 "물리칠 대상"이 아니다 — 인정할 것은 인정하는 답이 모범 답인 경우가 많다.
 */
export function Debates({ bank, boxes, onItems }: { bank: StudyBank; boxes: Record<string, Box>; onItems: (ids: string[]) => void }) {
  // 도는 말 대화 답장(C2)은 「도는 말」 칸에 있다. 여기는 업적 쟁점만.
  const items = bank.items.filter((i) => i.kind === "debate" && i.skill !== "C2");
  const units = bank.units.filter((u) => items.some((i) => i.unit === u.id));
  const learned = (id: string) => (boxes[id]?.[0] ?? 0) >= 2;
  const nextOne = items.find((i) => !boxes[i.id]) ?? items.find((i) => !learned(i.id)) ?? items[0];

  if (items.length === 0) return <Say mood="think">쟁점 연습 문항을 준비하고 있어요.</Say>;

  return (
    <div className="grid gap-3">
      <Say mood="smile">
        누가 업적을 따져 물으면 어떻게 답할까요? <b>맞는 부분은 인정하고 근거로 답하는 것</b>이 가장 강한 답이에요.
      </Say>
      {nextOne && (
        <button type="button" className="st-btn st-btn-jam w-full text-[16px]" onClick={() => onItems([nextOne.id])}>
          오늘의 연습 하나
        </button>
      )}
      <p className="st-small">
        쟁점 {items.length}개 · 익힘 {items.filter((i) => learned(i.id)).length}
      </p>
      {units.map((u) => (
        <section key={u.id} aria-label={u.title} className="grid gap-1.5">
          <p className="st-eyebrow pt-2">{u.title}</p>
          {items
            .filter((i) => i.unit === u.id)
            .map((i) => (
              <button key={i.id} type="button" className="st-card flex items-start gap-2 text-left" onClick={() => onItems([i.id])}>
                <span aria-hidden="true">{learned(i.id) ? "✅" : "💬"}</span>
                <span className="min-w-0 text-[13.5px]">{i.debate?.message}</span>
              </button>
            ))}
        </section>
      ))}
    </div>
  );
}
