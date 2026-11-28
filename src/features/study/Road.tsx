"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { ERAS } from "./eras";
import { courseUnits, currentUnit, STAGE_ICON, STAGE_LABEL, stepDone, unitOpen, unitStage, withoutSkipped, type Box } from "./rules";
import { useStudy } from "./store";
import { LEVEL_OF, STEPS, type StudyBank } from "./types";

/** 길. minLevel = 그 길이 열리는 단계. 정책 팩트의 길은 2단계 「가리기」 문항으로 시작한다(docs/jamgong-roadmap.md R2). */
const COURSES = [
  { id: "achievement", label: "업적의 길", minLevel: 1 },
  { id: "policy", label: "정책 팩트의 길", minLevel: 1 },
  { id: "words", label: "말과 연설의 길", minLevel: 3 },
] as const;

/**
 * 배움길 › 길 — 단원이 이어진 오솔길. 지나온 단원은 새싹·꽃·열매, 지금 단원은 반짝인다(docs/daily-study.md §6.3).
 * 단원 = 원본 페이지 하나. 누르면 다섯 단계 시트가 열린다.
 */
export function Road({
  bank,
  boxes,
  level,
  skip,
  onUnit,
}: {
  bank: StudyBank;
  boxes: Record<string, Box>;
  level: number;
  /** 건너뛴 시기(store.ts skipEras). */
  skip: string[];
  onUnit: (unitId: string) => void;
}) {
  const setSkipEras = useStudy((s) => s.setSkipEras);
  // 지금 단원과 열린 단원은 건너뛴 시기를 뺀 길에서 센다 — 이재명 정부부터 걸으면 그 첫 단원이 열린다.
  const scoped = withoutSkipped(bank, skip);
  const cur = currentUnit(scoped, boxes);
  const courses = COURSES.filter((c) => c.minLevel <= level);
  const [course, setCourse] = useState<(typeof COURSES)[number]["id"]>("achievement");
  const roadUnits = bank.units.filter((u) => u.course === "achievement");
  return (
    <div className="grid gap-3">
      {courses.length > 1 && (
        <div className="st-chips" role="group" aria-label="길 고르기">
          {courses.map((c) => (
            <button key={c.id} type="button" aria-pressed={course === c.id} onClick={() => setCourse(c.id)}>
              {c.label}
            </button>
          ))}
        </div>
      )}
      {course !== "achievement" ? (
        <CourseList bank={bank} boxes={boxes} course={course} level={level} onUnit={onUnit} />
      ) : (
        <>
      <p className="st-small">업적의 길 · {roadUnits.length}단원 · 앞 단원을 풀기 시작하면 다음 단원이 열려요 · 관심 없는 시기는 건너뛰어도 돼요</p>
      {ERAS.map((era) => {
        const units = roadUnits.filter((u) => u.era === era.id);
        if (units.length === 0) return null;
        const skipped = skip.includes(era.id);
        // 시기를 모두 건너뛰지는 못한다 — 남은 시기가 하나면 그 시기의 「건너뛰기」는 없다.
        const left = ERAS.filter((e) => !skip.includes(e.id) && roadUnits.some((u) => u.era === e.id)).length;
        return (
          <section key={era.id} aria-label={era.label}>
            <div className="flex items-center justify-between gap-2 pt-3">
              <p className="st-eyebrow">
                {era.label} · {units.length}단원{skipped ? " · 건너뜀" : ""}
              </p>
              {(skipped || left > 1) && (
                <button
                  type="button"
                  className="st-link text-[12.5px]"
                  onClick={() => setSkipEras(skipped ? skip.filter((x) => x !== era.id) : [...skip, era.id])}
                >
                  {skipped ? "다시 넣기" : "건너뛰기"}
                </button>
              )}
            </div>
            {skipped ? (
              <p className="st-small pt-1">이 시기의 업적은 오늘의 한 판에 나오지 않아요. 언제든 다시 넣을 수 있어요.</p>
            ) : (
            <ol className="pt-1">
              {units.map((u) => {
                const items = bank.items.filter((i) => i.unit === u.id);
                const stage = unitStage(items, boxes);
                const open = unitOpen(scoped, boxes, u.id);
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
            )}
          </section>
        );
      })}
        </>
      )}
    </div>
  );
}

/**
 * 정책 팩트의 길(2단계부터)·말과 연설의 길(3단계부터) — 단원 목록.
 * 업적의 길처럼 잠그지 않는다 — 관심 있는 것부터 골라 푼다.
 * ★ 내 단계까지의 문항이 있는 단원만 보인다. 예전에는 위 단계 문항만 있는 단원도 보여, 누르면 빈 판이 열렸다
 *   (2단계에서 정책 단원 143개 가운데 113개).
 */
const COURSE_NOTE: Record<string, string> = {
  policy: "뉴스에서 듣는 문장이 사실인지 누구의 주장인지 가려 봐요",
  words: "연설 요약만 보면 어디서 오해하기 쉬운지 따져 봐요",
};

function CourseList({ bank, boxes, course, level, onUnit }: { bank: StudyBank; boxes: Record<string, Box>; course: string; level: number; onUnit: (unitId: string) => void }) {
  const mine = bank.items.filter((i) => LEVEL_OF[i.step] <= level);
  const units = courseUnits(bank, course, level);
  const label = COURSES.find((c) => c.id === course)?.label ?? "";
  return (
    <div className="grid gap-2">
      <p className="st-small">
        {label} · {units.length}단원 · {COURSE_NOTE[course]}
      </p>
      {units.map((u) => {
        const items = mine.filter((i) => i.unit === u.id);
        const learned = items.filter((i) => (boxes[i.id]?.[0] ?? 0) >= 2).length;
        return (
          <button key={u.id} type="button" className="st-card flex items-center gap-3 text-left" onClick={() => onUnit(u.id)}>
            <span className="text-[22px]" aria-hidden="true">
              {learned === 0 ? "🫘" : learned < items.length ? "🌿" : "🌸"}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[14px] font-bold leading-snug">{u.title}</span>
              <span className="st-small block">
                익힘 {learned}/{items.length}
              </span>
            </span>
            <span aria-hidden="true">→</span>
          </button>
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
  level,
  onStart,
  onClose,
}: {
  bank: StudyBank;
  boxes: Record<string, Box>;
  unitId: string;
  level: number;
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
  // 내 단계까지의 단계마다 문항 수와 익힌 수. 문항이 없는 단계는 "아직 문항 없음".
  const steps = STEPS.filter((s) => s.level <= level).map((s) => {
    const mine = items.filter((i) => i.step === s.id);
    return { ...s, total: mine.length, learned: mine.filter((i) => (boxes[i.id]?.[0] ?? 0) >= 2).length, done: stepDone(items, boxes, s.id) };
  });
  const allDone = steps.filter((s) => s.total > 0).every((s) => s.done);
  const playable = steps.some((s) => s.total > 0);
  const isPolicy = unit.course === "policy";

  return (
    <div className="st-sheet-wrap" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div ref={ref} tabIndex={-1} role="dialog" aria-modal="true" aria-label={unit.title} className="st-sheet">
        <p className="st-eyebrow">{unit.course === "words" ? "말과 연설의 길" : isPolicy ? "정책 팩트의 길" : `업적의 길 · ${unit.eraLabel} · ${unit.kicker}`}</p>
        <p className="st-h">{unit.title}</p>
        <div className="st-steps">
          {/* 내 단계까지만 보인다 — 1단계 사람은 아직 오지 않은 단계(가리기…)를 보지 않는다(docs/jamgong-roadmap.md §3.3). */}
          {steps.map((s) => (
            <div key={s.id} className={s.done ? "done" : s.total > 0 ? "next" : ""}>
              <span aria-hidden="true">{s.icon}</span> {s.label}
              <span className="st">{s.total === 0 ? "아직 문항 없음" : s.done ? "마침" : `${s.learned}/${s.total}`}</span>
            </div>
          ))}
        </div>
        <Link className="st-link w-fit" href={unit.href}>
          {unit.course === "words" ? "원문 보기" : isPolicy ? "위키 정책 페이지 보기" : "원본 업적 페이지 보기"}
        </Link>
        <div className="flex gap-2">
          <button type="button" className="st-btn st-btn-line flex-1" onClick={onClose}>
            닫기
          </button>
          <button type="button" className="st-btn st-btn-jam flex-1" onClick={onStart} disabled={!playable}>
            {!playable ? "다음 단계에서 열려요" : allDone ? "다시 풀기" : "풀기"}
          </button>
        </div>
      </div>
    </div>
  );
}
