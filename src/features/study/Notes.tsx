"use client";

import { useMemo, useState } from "react";

import { EvidenceCardView } from "./EvidenceCardView";
import { Say } from "./Jamtongi";
import type { Box } from "./rules";
import type { AssertionKind, StudyBank } from "./types";

const FILTERS: Array<{ id: "all" | "fact" | "claim"; label: string; match: (t: AssertionKind) => boolean }> = [
  { id: "all", label: "전체", match: () => true },
  { id: "fact", label: "확인된 사실", match: (t) => t === "FACT" },
  { id: "claim", label: "주장·해석·의견", match: (t) => t !== "FACT" },
];

/**
 * 근거노트 › 근거 카드 — 익힌 근거가 모인다. 논쟁 직전에 꺼내 보는 곳(docs/daily-study.md §6.2).
 * O 문항을 맞혔을 때만 들어온다. X 문항(헷갈리기 쉬운 문장)은 담지 않는다.
 */
export function Cards({ bank, wallet }: { bank: StudyBank; wallet: string[] }) {
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<(typeof FILTERS)[number]["id"]>("all");
  const units = useMemo(() => new Map(bank.units.map((u) => [u.id, u])), [bank]);
  const items = useMemo(
    () => wallet.map((id) => bank.items.find((i) => i.id === id)).filter((i): i is NonNullable<typeof i> => Boolean(i?.card)).reverse(),
    [bank, wallet],
  );
  const match = FILTERS.find((f) => f.id === filter)!.match;
  const shown = items.filter((i) => match(i.card!.type) && (!q.trim() || `${i.card!.text} ${units.get(i.unit)?.title}`.includes(q.trim())));

  if (items.length === 0) {
    return (
      <Say mood="think">
        아직 카드가 없어요. 오늘의 한 판에서 <b>⭕ 문제를 맞히면</b> 그 근거가 카드로 여기 모여요. 논쟁 전에 꺼내 보세요!
      </Say>
    );
  }
  return (
    <div className="grid gap-3">
      <input className="st-input" type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="근거 찾기 · 예) 무상급식, 수출" aria-label="근거 찾기" />
      <div className="st-chips" role="group" aria-label="층으로 거르기">
        {FILTERS.map((f) => (
          <button key={f.id} type="button" aria-pressed={filter === f.id} onClick={() => setFilter(f.id)}>
            {f.label}
            {f.id === "all" ? ` ${items.length}` : ""}
          </button>
        ))}
      </div>
      <div className="grid gap-2">
        {shown.map((i) => (
          <EvidenceCardView key={i.id} item={i} unitTitle={units.get(i.unit)?.title ?? ""} href={units.get(i.unit)?.href} copy />
        ))}
        {shown.length === 0 && <p className="st-small">맞는 카드가 없어요.</p>}
      </div>
      <p className="st-small">카드는 원본 자료를 가리켜요. 원본이 고쳐지면 카드도 따라 바뀌어요.</p>
    </div>
  );
}

/**
 * 근거노트 › 다시 볼 것 — 푼 문항과 다음에 물을 날. 틀린 것(1칸)이 위에 온다.
 * X 문항은 문장 바로 아래에 풀이가 붙는다 — 틀린 문장만 따로 보이지 않게.
 */
export function Review({ bank, boxes, today }: { bank: StudyBank; boxes: Record<string, Box>; today: string }) {
  const units = useMemo(() => new Map(bank.units.map((u) => [u.id, u])), [bank]);
  const rows = bank.items
    .filter((i) => boxes[i.id])
    .sort((a, b) => boxes[a.id][0] - boxes[b.id][0] || boxes[a.id][1].localeCompare(boxes[b.id][1]));
  if (rows.length === 0) return <Say mood="smile">아직 푼 문제가 없어요. 푼 문제는 잊을 때쯤 오늘의 한 판에 다시 나와요.</Say>;
  const when = (d: string) => (d <= today ? "오늘" : `${Number(d.slice(5, 7))}월 ${Number(d.slice(8))}일`);
  return (
    <div className="grid gap-2">
      <p className="st-small">잊을 때쯤 오늘의 한 판에 저절로 섞여 나와요. 맞힐수록 간격이 길어져요(1·3·7·16·35일).</p>
      {rows.map((i) => (
        <div key={i.id} className="st-card grid gap-1">
          <p className="st-eyebrow">
            {when(boxes[i.id][1])} · {boxes[i.id][0]}번 상자{boxes[i.id][0] === 1 ? " · 틀린 문제" : ""}
          </p>
          <p className="text-[13.5px] font-semibold">
            {i.answer ? "⭕" : "❌"} {i.statement}
          </p>
          <p className="st-small">{i.explain}</p>
          <p className="st-small">{units.get(i.unit)?.title}</p>
        </div>
      ))}
    </div>
  );
}
