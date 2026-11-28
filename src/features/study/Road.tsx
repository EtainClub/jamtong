"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";

import { ERAS } from "./eras";
import { currentUnit, STAGE_ICON, STAGE_LABEL, stepDone, unitOpen, unitStage, type Box } from "./rules";
import { STEPS, type StudyBank } from "./types";

const COURSES = [
  { id: "achievement", label: "업적의 길", ready: true },
  { id: "policy", label: "정책 팩트의 길", ready: false },
  { id: "words", label: "말과 연설의 길", ready: false },
  { id: "cartel", label: "카르텔의 길", ready: false },
] as const;

/**
 * 배움길 › 길 — 단원이 이어진 오솔길. 지나온 단원은 새싹·꽃·열매, 지금 단원은 반짝인다(docs/daily-study.md §6.3).
 * 단원 = 원본 페이지 하나. 누르면 다섯 단계 시트가 열린다.
 */
export function Road({ bank, boxes, onUnit }: { bank: StudyBank; boxes: Record<string, Box>; onUnit: (unitId: string) => void }) {
  const cur = currentUnit(bank, boxes);
  return (
    <div className="grid gap-3">
      <div className="st-chips" role="group" aria-label="길 고르기">
        {COURSES.map((c) => (
          <button key={c.id} type="button" aria-pressed={c.id === "achievement"} disabled={!c.ready}>
            {c.label}
            {!c.ready && <span className="ml-1 text-[10px]">준비 중</span>}
          </button>
        ))}
      </div>
      <p className="st-small">업적의 길 · {bank.units.length}단원 · 성남시장 시절부터 이재명 정부까지 · 앞 단원을 풀기 시작하면 다음 단원이 열려요</p>
      {ERAS.map((era) => {
        const units = bank.units.filter((u) => u.era === era.id);
        if (units.length === 0) return null;
        return (
          <section key={era.id} aria-label={era.label}>
            <p className="st-eyebrow pt-3">{era.label}</p>
            <ol className="pt-1">
              {units.map((u) => {
                const items = bank.items.filter((i) => i.unit === u.id);
                const stage = unitStage(items, boxes);
                const open = unitOpen(bank, boxes, u.id);
                const now = u.id === cur;
                const cls = now ? "now" : !open ? "locked" : stage;
                const icon = now ? "📍" : !open ? "🔒" : STAGE_ICON[stage];
                const sub = now ? "지금 할 단원" : !open ? "앞 단원을 풀면 열려요" : `${STAGE_LABEL[stage]}${stepDone(items, boxes, "know") ? " · 알기 마침" : ""}`;
                return (
                  <li key={u.id} className={`st-node ${cls}`}>
                    <button type="button" disabled={!open} aria-label={`${u.title} — ${sub}`} onClick={() => onUnit(u.id)}>
                      {icon}
                    </button>
                    <span className="lbl">
                      {u.title}
                      <small>{sub}</small>
                    </span>
                  </li>
                );
              })}
            </ol>
          </section>
        );
      })}
    </div>
  );
}

/** 단원 시트 — 다섯 단계와 원본 페이지 링크. 지금 문항이 있는 것은 알기뿐이라 나머지는 "준비 중". */
export function UnitSheet({
  bank,
  boxes,
  unitId,
  onStart,
  onClose,
}: {
  bank: StudyBank;
  boxes: Record<string, Box>;
  unitId: string;
  onStart: () => void;
  onClose: () => void;
}) {
  const unit = bank.units.find((u) => u.id === unitId);
  const items = bank.items.filter((i) => i.unit === unitId);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    ref.current?.focus();
    const key = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, [onClose]);
  if (!unit) return null;
  const knowDone = stepDone(items, boxes, "know");
  const learned = items.filter((i) => (boxes[i.id]?.[0] ?? 0) >= 2).length;

  return (
    <div className="st-sheet-wrap" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div ref={ref} tabIndex={-1} role="dialog" aria-modal="true" aria-label={unit.title} className="st-sheet">
        <p className="st-eyebrow">업적의 길 · {unit.eraLabel} · {unit.kicker}</p>
        <p className="st-h">{unit.title}</p>
        <div className="st-steps">
          {STEPS.map((s) => {
            const ready = s.id === "know";
            const done = ready && knowDone;
            return (
              <div key={s.id} className={done ? "done" : ready ? "next" : ""}>
                <span aria-hidden="true">{s.icon}</span> {s.label}
                <span className="st">{!ready ? "준비 중" : done ? "마침" : `${learned}/${items.length}`}</span>
              </div>
            );
          })}
        </div>
        <Link className="st-link w-fit" href={unit.href}>
          원본 업적 페이지 보기
        </Link>
        <div className="flex gap-2">
          <button type="button" className="st-btn st-btn-line flex-1" onClick={onClose}>
            닫기
          </button>
          <button type="button" className="st-btn st-btn-jam flex-1" onClick={onStart}>
            {knowDone ? "알기 다시 풀기" : "알기 시작"}
          </button>
        </div>
      </div>
    </div>
  );
}
