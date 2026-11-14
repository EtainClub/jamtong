"use client";

import { useEffect, useRef } from "react";

import { track } from "@/lib/analytics";

import { COACH_DOTS, coachCard, coachDot, coachStep, TIPS, type TipTab } from "./coach";
import type { Place } from "./nav";
import { gardenFeedback } from "./feedback";
import { useGarden, type GardenData } from "./store";

/**
 * 첫 한 바퀴 퀘스트 카드. 단계는 정원 상태로 정해진다(coach.ts).
 * 화면을 덮지 않는다 — 텃밭 위에 한 장 놓일 뿐이고, 언제든 건너뛸 수 있다.
 */
export function CoachQuest({
  data,
  now,
  tab,
  onGo,
  onGuide,
}: {
  data: GardenData;
  now: number;
  /** 지금 보고 있는 자리(nav.ts의 칸). 같은 자리로 보내는 단추는 그리지 않는다. */
  tab: string;
  onGo: (place: Place) => void;
  onGuide: () => void;
}) {
  const step = coachStep(data, now);
  const seen = useRef<string | null>(null);

  // 단계에 처음 닿을 때 한 번 센다. 어디서 멈추는지 보려고.
  useEffect(() => {
    if (!step || seen.current === step) return;
    seen.current = step;
    track("garden_coach", { step });
  }, [step]);

  if (!step) return null;
  const card = coachCard(step, { now, beds: data.beds, hasSeeds: Object.keys(data.seeds).length > 0 });
  const index = coachDot(step);
  const total = COACH_DOTS.length;
  const { endCoach } = useGarden.getState();
  const finish = (skipped: boolean) => {
    gardenFeedback("tap");
    if (skipped) track("garden_coach", { step, skipped: true });
    endCoach();
  };

  return (
    <section aria-label="처음 한 바퀴" aria-live="polite" className="garden-coach mt-4 rounded-2xl px-4 py-3.5">
      <div className="flex items-center justify-between gap-2">
        <p className="garden-coach-eyebrow">
          {step === "done" ? "처음 한 바퀴 완료" : `처음 한 바퀴 · ${index + 1}/${total}`}
        </p>
        {step !== "done" && (
          <span className="flex gap-3">
            <button type="button" onClick={onGuide} className="text-[11.5px] font-semibold text-[#4d8c50] underline underline-offset-2">
              🖼 그림으로 보기
            </button>
            <button type="button" onClick={() => finish(true)} className="text-[11.5px] text-smoke underline underline-offset-2">
              건너뛰기
            </button>
          </span>
        )}
      </div>
      <ol className="garden-coach-dots mt-1.5" aria-hidden="true">
        {COACH_DOTS.map((s, i) => (
          <li key={s} className={i < index || step === "done" ? "is-done" : i === index ? "is-now" : ""} />
        ))}
      </ol>
      <h2 className="mt-2 text-[15px] font-bold">{card.title}</h2>
      <p className="mt-1 text-[12.5px] leading-relaxed">{card.body}</p>
      {(card.go && card.go.tab !== tab) || step === "done" ? (
        <div className="mt-2.5 flex flex-wrap gap-2">
          {card.go && card.go.tab !== tab && (
            <button type="button" onClick={() => { gardenFeedback("tap"); onGo(card.go!.tab); }} className="garden-coach-go">
              {card.go.label} →
            </button>
          )}
          {step === "done" && (
            <>
              <button type="button" onClick={onGuide} className="garden-coach-go">
                🖼 그림 안내 보기
              </button>
              <button type="button" onClick={() => finish(false)} className="garden-coach-go is-quiet">
                닫기
              </button>
            </>
          )}
        </div>
      ) : null}
    </section>
  );
}

/** 자리(nav.ts의 칸)에 처음 들어왔을 때 한 번 보이는 팁. 닫으면 다시 뜨지 않는다. */
export function TabTip({ tab, data, onGuide }: { tab: string; data: GardenData; onGuide: (section: string) => void }) {
  if (!(tab in TIPS) || data.coach.tips.includes(tab)) return null;
  const tip = TIPS[tab as TipTab];
  return (
    <aside aria-label={`${tip.title} 안내`} className="garden-tip mb-4 rounded-2xl px-4 py-3">
      <p className="text-[13px] font-bold">💡 {tip.title}</p>
      <p className="mt-1 text-[12.5px] leading-relaxed">{tip.body}</p>
      <div className="mt-2 flex gap-3 text-[12px]">
        <button
          type="button"
          onClick={() => { gardenFeedback("tap"); useGarden.getState().seeTip(tab as TipTab); }}
          className="garden-coach-go"
        >
          알겠어요
        </button>
        <button type="button" onClick={() => onGuide(tip.section)} className="min-h-[44px] text-smoke underline underline-offset-2">
          자세히
        </button>
      </div>
    </aside>
  );
}
