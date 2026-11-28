"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { track } from "@/lib/analytics";

import Link from "next/link";

import { EvidenceCardView } from "./EvidenceCardView";
import { Jamtongi } from "./Jamtongi";
import { kstDay, stepDone } from "./rules";
import { useStudy } from "./store";
import type { StudyBank, StudyItem } from "./types";

/**
 * 한 판 — 문항을 하나씩 풀고, 바로 풀이(근거 claim으로 쓴 것)와 원문 링크를 본다. 설계는 docs/daily-study.md §4.3·§8.6.
 *
 * ★ 틀려도 막히지 않는다(목숨 없음). 틀린 문항은 판 끝에 한 번 더 나오되, 그 두 번째 답은 상자에 적지 않는다 —
 *   방금 본 풀이를 맞힌 것이지 익힌 것이 아니다.
 * ★ 틀리면 붉게 혼내지 않는다. 호박색으로 "같이 볼까요?" — 풀이가 주인공이다.
 */

interface Turn {
  id: string;
  retry: boolean;
}

export function Lesson({
  bank,
  ids,
  mode,
  onClose,
}: {
  bank: StudyBank;
  ids: string[];
  mode: "daily" | "unit" | "intro";
  onClose: () => void;
}) {
  const byId = useMemo(() => new Map(bank.items.map((i) => [i.id, i])), [bank]);
  const unitOf = useMemo(() => new Map(bank.units.map((u) => [u.id, u])), [bank]);
  const [queue, setQueue] = useState<Turn[]>(() => ids.filter((id) => byId.has(id)).map((id) => ({ id, retry: false })));
  const [at, setAt] = useState(0);
  const [picked, setPicked] = useState<boolean | null>(null);
  const [checked, setChecked] = useState(false);
  const [right, setRight] = useState(0);
  const [combo, setCombo] = useState(0);
  const [earned, setEarned] = useState<StudyItem[]>([]);
  const [doneToday, setDoneToday] = useState<number | null>(null);
  const goal = useStudy((s) => s.data?.goal ?? 1);
  const walletBefore = useRef(new Set(useStudy.getState().data?.wallet ?? []));
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    root.current?.focus();
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  const firstTurns = ids.length;
  const finished = at >= queue.length;
  const turn = queue[at];
  const item = turn ? byId.get(turn.id)! : null;
  const ok = item !== null && checked && picked === item.answer;

  const check = () => {
    if (!item || picked === null) return;
    setChecked(true);
    const correct = picked === item.answer;
    if (!turn.retry) {
      useStudy.getState().answer(item.id, correct, item.card !== null);
      if (correct) {
        setRight((n) => n + 1);
        if (item.card && !walletBefore.current.has(item.id)) setEarned((e) => [...e, item]);
      }
    }
    setCombo((c) => (correct ? c + 1 : 0));
    if (!correct && !turn.retry) setQueue((q) => [...q, { id: item.id, retry: true }]);
  };

  const next = () => {
    if (at + 1 >= queue.length && doneToday === null) {
      setDoneToday(useStudy.getState().finish());
      track("study_finish", { size: firstTurns, right, mode });
    }
    setAt((n) => n + 1);
    setPicked(null);
    setChecked(false);
  };

  const pct = Math.round(((at + (checked ? 1 : 0)) / Math.max(1, queue.length)) * 100);

  return (
    <div ref={root} tabIndex={-1} role="dialog" aria-modal="true" aria-label="잼공 한 판" className="st-lesson">
      <div className="st-lesson-col">
        <div className="st-lesson-top">
          <button type="button" className="x" onClick={onClose} aria-label={finished ? "닫기" : "그만두기"}>
            ✕
          </button>
          <div className="st-progress" role="progressbar" aria-valuenow={finished ? 100 : pct} aria-valuemin={0} aria-valuemax={100}>
            <i style={{ width: `${finished ? 100 : pct}%` }} />
          </div>
          <span className="st-combo" aria-live="polite">{combo >= 2 && !finished ? `🔥${combo}` : ""}</span>
        </div>

        {finished ? (
          <>
            <div className="st-lesson-body items-center text-center">
              <Jamtongi mood="cheer" size={92} hop />
              <p className="st-h text-[22px]">{mode === "intro" ? "오늘은 여기까지! 잘했어요" : "한 판 끝!"}</p>
              <p className="st-small">
                {firstTurns}문제 가운데 {right}개를 바로 맞혔어요.
                {right < firstTurns ? " 틀린 건 「근거노트 › 다시 볼 것」에 들어갔어요." : ""}
              </p>
              <div className="st-reward">
                <span>🫙 오늘 도장</span>
                {mode !== "intro" && doneToday !== null && <span>{doneToday >= goal ? "🎯 오늘 목표 채움" : `오늘 ${doneToday}/${goal}판`}</span>}
              </div>
              {mode === "intro" ? (
                // 첫날에는 정원·목표 이야기를 꺼내지 않는다(docs/jamgong-roadmap.md §4). 모은 카드와 "내일"만.
                <p className="st-small">모은 근거 카드는 「근거노트」에 있어요. 내일 또 와요 — 잊을 때쯤 다시 물어볼게요.</p>
              ) : (
                <GardenPerks bank={bank} ids={ids} goalMet={doneToday !== null && doneToday >= goal} />
              )}
              {earned.length > 0 && (
                <div className="grid w-full gap-2 text-left">
                  <p className="st-eyebrow">근거노트에 새로 들어간 카드</p>
                  {earned.map((i) => (
                    <EvidenceCardView key={i.id} item={i} unitTitle={unitOf.get(i.unit)?.title ?? ""} />
                  ))}
                </div>
              )}
            </div>
            <div className="st-foot">
              <button type="button" className="st-btn st-btn-jam" onClick={onClose}>
                좋아요
              </button>
            </div>
          </>
        ) : item ? (
          <>
            <div className="st-lesson-body">
              <p className="st-small font-bold">
                O/X · 알기 · {unitOf.get(item.unit)?.title}
                {turn.retry ? " · 한 번 더" : ""}
              </p>
              <p className="st-q">{item.statement}</p>
              <div className="st-ox" role="group" aria-label="답 고르기">
                {[true, false].map((yes) => {
                  const cls = checked ? (yes === item.answer ? "right" : yes === picked ? "wrong" : "") : "";
                  return (
                    <button
                      key={String(yes)}
                      type="button"
                      className={cls}
                      disabled={checked}
                      aria-pressed={picked === yes}
                      aria-label={yes ? "맞다(O)" : "아니다(X)"}
                      onClick={() => setPicked(yes)}
                    >
                      {yes ? "⭕" : "❌"}
                    </button>
                  );
                })}
              </div>
              {!checked && (
                <div className="mt-auto flex items-end gap-2.5">
                  <Jamtongi mood="think" size={44} />
                  <div className="st-bubble">근거는 언제나 원본 자료에서 와요. 틀려도 괜찮아요, 풀이를 같이 봐요.</div>
                </div>
              )}
            </div>
            <div className={`st-foot ${checked ? (ok ? "good" : "hint") : ""}`} aria-live="polite">
              {checked ? (
                <>
                  <p className="st-fb-title">
                    <Jamtongi mood={ok ? "cheer" : "smile"} size={30} hop={ok} />
                    {ok ? "맞았어요!" : `같이 볼까요? 정답은 ${item.answer ? "⭕" : "❌"}`}
                  </p>
                  <p className="text-[13.5px] leading-relaxed">{item.explain}</p>
                  <a className="st-link w-fit" href={unitOf.get(item.unit)?.href} target="_blank" rel="noopener">
                    원문 보기 — {unitOf.get(item.unit)?.title}
                  </a>
                  <button type="button" className={`st-btn ${ok ? "st-btn-ok" : "st-btn-jam"}`} onClick={next}>
                    계속
                  </button>
                </>
              ) : (
                <button type="button" className="st-btn st-btn-jam" disabled={picked === null} onClick={check}>
                  확인
                </button>
              )}
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}

/**
 * 판 끝의 정원 선물(docs/daily-study.md §7) — 하루 목표를 채운 날의 잼과 고른 슬롯머신 무료 한 번, 알기를 마친 단원의 그 업적 씨앗.
 * 선물은 정원에서 받는다(/garden?study=오늘&spin=seed|room · ?gift=a:<slug>). 잼·무료 한 번은 하루 한 번, 씨앗은 품종마다 한 번 — 정원이 센다.
 * 정원은 받은 뒤 그 슬롯을 바로 연다.
 */
function GardenPerks({ bank, ids, goalMet }: { bank: StudyBank; ids: string[]; goalMet: boolean }) {
  // 선택자는 값 하나 — `?? {}`를 안에서 만들면 렌더마다 바뀐 것으로 본다.
  const saved = useStudy((s) => s.data?.boxes);
  const boxes = saved ?? {};
  const [today] = useState(() => kstDay(Date.now()));
  const unitIds = [...new Set(ids.map((id) => bank.items.find((i) => i.id === id)?.unit).filter((u): u is string => Boolean(u)))];
  const known = bank.units.filter((u) => unitIds.includes(u.id) && stepDone(bank.items.filter((i) => i.unit === u.id), boxes, "know")).slice(0, 2);
  if (!goalMet && known.length === 0) return null;
  return (
    <div className="grid w-full gap-1.5 text-left">
      <p className="st-eyebrow">잼통 정원 선물</p>
      {goalMet && (
        <>
          <p className="st-small">🎯 오늘 목표 채움 — 잼 30과 슬롯머신 무료 한 번(하루 한 번). 어느 슬롯을 돌릴까요?</p>
          <Link className="st-link" href={`/garden?study=${today}&spin=seed`} onClick={() => track("study_perk", { kind: "seed-slot" })}>
            🌱 텃밭 씨앗 슬롯 돌리기 — 씨앗·희귀 씨앗 →
          </Link>
          <Link className="st-link" href={`/garden?study=${today}&spin=room`} onClick={() => track("study_perk", { kind: "room-slot" })}>
            🛋 방 꾸미기 슬롯 돌리기 — 가구·벽지·음원·카르텔 카드 →
          </Link>
        </>
      )}
      {known.map((u) => (
        <Link key={u.id} className="st-link" href={`/garden?gift=${encodeURIComponent(u.id)}`} onClick={() => track("study_perk", { kind: "seed" })}>
          🌱 「{u.title}」 알기 마침 — 정원에서 그 씨앗 받기(품종마다 한 번) →
        </Link>
      ))}
    </div>
  );
}
