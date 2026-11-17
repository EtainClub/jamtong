"use client";

import { gardenFeedback } from "../feedback";
import { useGarden } from "../store";
import { RAID_JAM, RAID_JAM_MAX, raidJamLines } from "./rules";

/**
 * 거대 잡초 잼 사다리 — 참여 300 · 1형 700 · 2형 1,500 · 3형 2,500(raid/rules.ts의 RAID_JAM).
 * 싸우는 동안에도, 끝난 뒤에도 같은 것을 보인다. 형태가 넘어가는 즉시 그 몫을 받을 수 있다.
 *
 * ★ 형태 보상은 그 형태에 든(쳤거나 지원한) 사람만 받는다. 든 형태는 내 장부(loot.parts)와 서버 표식의 마지막 형태(lastForm)로 안다.
 */
export function RaidJam({
  raidKey,
  cleared,
  ended,
  lastForm,
  say,
}: {
  raidKey: number;
  /** 넘어간 형태 수(0–3). */
  cleared: number;
  ended: boolean;
  /** 서버 표식에 적힌 내 마지막 형태(다른 기기에서 들었을 때). 없으면 0. */
  lastForm: number;
  say: (text: string) => void;
}) {
  const k = String(raidKey);
  const logged = useGarden((s) => s.data?.loot.parts[k]);
  const paidRaw = useGarden((s) => s.data?.loot.paid[k]);
  const paid = paidRaw ?? [];
  const parts = [...new Set([...(logged ?? []), ...(lastForm > 0 ? [lastForm] : [])])];
  const lines = raidJamLines(cleared, ended, parts, paid);
  const total = lines.reduce((n, l) => n + l.jam, 0);

  const steps = [
    { id: 0, label: "참여", jam: RAID_JAM.base, done: parts.length > 0 && (ended || cleared >= 1) },
    ...RAID_JAM.forms.map((jam, i) => ({ id: i + 1, label: `${i + 1}형`, jam, done: cleared >= i + 1 })),
  ];

  const claim = () => {
    const got = useGarden.getState().claimRaidJam(raidKey, lines.map((l) => l.id));
    if (got <= 0) return;
    gardenFeedback("reward");
    say(`🍯 잼 +${got.toLocaleString()} · ${lines.map((l) => l.label).join(" · ")}`);
  };

  return (
    <div className="raid-jam mt-2 rounded-xl px-2.5 py-2 text-[11.5px]">
      <p className="flex items-center justify-between font-bold">
        <span>🍯 잼 보상 — 끝까지 함께하면 {RAID_JAM_MAX.toLocaleString()}</span>
      </p>
      <ol className="mt-1 grid grid-cols-4 gap-1 text-center">
        {steps.map((step) => {
          const isPaid = paid.includes(step.id);
          const mine = step.id === 0 || parts.includes(step.id);
          return (
            <li key={step.id} className={`rounded-lg px-1 py-1 ${step.done ? "is-done" : ""} ${isPaid ? "is-paid" : ""}`}>
              <span className="block font-black tabular-nums">{step.jam.toLocaleString()}</span>
              <span className="block text-[10px] opacity-85">
                {step.label}
                {isPaid ? " ✓" : step.done && !mine ? " · 안 듦" : ""}
              </span>
            </li>
          );
        })}
      </ol>
      {total > 0 && (
        <button type="button" onClick={claim} className="raid-jam-claim mt-2 min-h-[44px] w-full rounded-full px-4 py-2 text-[14px] font-black">
          🍯 잼 {total.toLocaleString()} 받기 · {lines.map((l) => l.label).join(" + ")}
        </button>
      )}
    </div>
  );
}
