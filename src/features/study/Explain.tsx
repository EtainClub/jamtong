"use client";

import { useEffect, useState } from "react";

import { track } from "@/lib/analytics";

import { Say } from "./Jamtongi";
import { unitStage, type Box } from "./rules";
import type { StudyBank, StudyUnit } from "./types";

/** 설명 시간(초). */
const SECONDS = 30;
/** 빠뜨린 것 점검표에 올리는 근거 카드 수. */
const POINTS = 4;

/**
 * 말하기 › 30초 설명 — 5단계(docs/jamgong-roadmap.md R6).
 * 꽃이 핀 단원(알기 문항을 모두 두 번 넘게 맞힌 단원)을 골라, 소리 내어 30초 동안 설명한다.
 * 끝나면 그 단원의 근거 카드를 점검표로 보고 말한 것에 스스로 체크한다.
 *
 * ★ 녹음하지 않는다. AI가 듣거나 채점하지 않는다(§8). 상자에 적지 않는 연습이다.
 * ★ 분석에는 짚은 수와 점검표 수만 보낸다. 어느 단원인지, 무엇을 말했는지는 보내지 않는다.
 */
export function Explain({ bank, boxes }: { bank: StudyBank; boxes: Record<string, Box> }) {
  const ready = bank.units.filter((u) => {
    const items = bank.items.filter((i) => i.unit === u.id);
    const stage = unitStage(items, boxes);
    return (stage === "bloom" || stage === "fruit") && items.some((i) => i.card);
  });
  const [unit, setUnit] = useState<StudyUnit | null>(null);

  if (unit) return <Practice key={unit.id} bank={bank} unit={unit} onBack={() => setUnit(null)} />;

  if (ready.length === 0) {
    return (
      <Say mood="think">
        알기 문제를 모두 두 번 넘게 맞힌 단원(🌸 꽃)이 생기면 여기서 30초 설명을 연습할 수 있어요. 오늘의 한 판으로 꽃을 피워요.
      </Say>
    );
  }
  return (
    <div className="grid gap-3">
      <Say mood="smile">
        익힌 단원을 <b>소리 내어 30초 동안</b> 설명해 봐요. 무엇을, 왜, 어떻게 됐는지 — 근거 하나를 꼭 붙여서요.
      </Say>
      {ready.map((u) => (
        <button key={u.id} type="button" className="st-card flex items-start gap-2 text-left" onClick={() => setUnit(u)}>
          <span aria-hidden="true">🌸</span>
          <span className="min-w-0">
            <b className="block text-[14px]">{u.title}</b>
            <span className="st-small">{u.kicker}</span>
          </span>
        </button>
      ))}
    </div>
  );
}

function Practice({ bank, unit, onBack }: { bank: StudyBank; unit: StudyUnit; onBack: () => void }) {
  const cards = bank.items.filter((i) => i.unit === unit.id && i.card).slice(0, POINTS);
  const [phase, setPhase] = useState<"ready" | "talk" | "check" | "done">("ready");
  const [left, setLeft] = useState(SECONDS);
  const [ticks, setTicks] = useState<boolean[]>(() => cards.map(() => false));

  useEffect(() => {
    if (phase !== "talk") return;
    const t = setInterval(() => {
      setLeft((n) => {
        if (n <= 1) {
          clearInterval(t);
          setPhase("check");
          return 0;
        }
        return n - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [phase]);

  const finish = () => {
    track("study_explain", { got: ticks.filter(Boolean).length, total: cards.length });
    setPhase("done");
  };

  return (
    <div className="grid gap-3">
      <button type="button" className="st-link w-fit" onClick={onBack}>
        ← 단원 고르기
      </button>
      <div className="st-card grid gap-1">
        <span className="st-eyebrow">30초 설명</span>
        <b className="text-[17px]">{unit.title}</b>
        <span className="st-small">무엇을 · 왜 · 어떻게 됐는지, 근거 하나를 붙여서.</span>
      </div>
      {phase === "ready" && (
        <button type="button" className="st-btn st-btn-jam w-full" onClick={() => setPhase("talk")}>
          시작 — 소리 내어 말해요
        </button>
      )}
      {phase === "talk" && (
        <>
          <p className="st-h text-center text-[40px]" aria-live="polite" aria-label={`${left}초 남음`}>
            {left}
          </p>
          <button type="button" className="st-btn st-btn-line w-full" onClick={() => setPhase("check")}>
            다 말했어요
          </button>
        </>
      )}
      {(phase === "check" || phase === "done") && (
        <>
          <p className="st-small font-bold">빠뜨린 건 없나요? 말한 것에 체크해요.</p>
          <div className="grid gap-1.5" role="group" aria-label="말한 것 점검">
            {cards.map((c, k) => (
              <button
                key={c.id}
                type="button"
                className="st-opt text-left"
                disabled={phase === "done"}
                aria-pressed={ticks[k]}
                onClick={() => setTicks((t) => t.map((v, i) => (i === k ? !v : v)))}
              >
                <b className="text-[13.5px]">
                  {ticks[k] ? "☑️" : "⬜"} {c.card!.text}
                </b>
              </button>
            ))}
          </div>
          {phase === "check" ? (
            <button type="button" className="st-btn st-btn-jam w-full" onClick={finish}>
              점검 마치기
            </button>
          ) : (
            <Say mood="cheer">
              {ticks.filter(Boolean).length}가지를 짚었어요. 빠진 건 다음에 하나만 더 넣어 봐요.{" "}
              <a className="st-link" href={unit.href} target="_blank" rel="noopener">
                원문 다시 보기
              </a>
            </Say>
          )}
        </>
      )}
    </div>
  );
}
