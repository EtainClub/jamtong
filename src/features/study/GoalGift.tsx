"use client";

import Link from "next/link";

import { track } from "@/lib/analytics";

import { flushStudy } from "./flush";
import { markFromStudy } from "./fromStudy";
import { useStudy } from "./store";

/**
 * 하루 목표 선물 — 잼 30과 고른 슬롯머신 무료 한 번(docs/daily-study.md §7, 운영자 결정으로 유지).
 *
 * ★ 크게 보인다. 작은 링크로 두었더니 그냥 지나쳤다(2026-11-28). 두 슬롯을 큰 버튼으로 놓는다.
 * ★ 누르면 미뤄 둔 계정 저장을 먼저 하고(flush.ts) 정원으로 간다. 넘어간 표시(fromStudy.ts)를 남겨 정원이 「잼공으로 돌아가기」를 띄운다.
 * ★ 받으러 간 날(perkDay)을 적어 둔다 — 그날은 판 끝에서 "아직 안 받았어요"를 다시 묻지 않는다.
 *   실제 지급(하루 한 번)은 정원이 센다(store.claimStudyJam).
 */
export function slotHref(day: string, spin: "seed" | "room"): string {
  return `/garden?study=${day}&spin=${spin}`;
}

export function GoalGift({ today, compact = false }: { today: string; compact?: boolean }) {
  const perkDay = useStudy((s) => s.data?.perkDay);
  const markPerk = useStudy((s) => s.markPerk);
  if (perkDay === today) {
    return compact ? null : <p className="st-small">🎁 오늘 정원 선물은 받으러 갔어요. 정원에서 확인해 보세요.</p>;
  }
  const go = (spin: "seed" | "room") => {
    markPerk(today);
    flushStudy();
    markFromStudy();
    track("study_perk", { kind: spin === "seed" ? "seed-slot" : "room-slot" });
  };
  return (
    <div className="st-gift">
      <p className="st-gift-title">🎁 오늘 목표 선물</p>
      <p className="st-small">잼 30과 슬롯머신 무료 한 번. 어느 슬롯을 돌릴까요? 오늘 안에 받아요.</p>
      <div className="grid grid-cols-2 gap-2">
        <Link href={slotHref(today, "seed")} className="st-gift-tile" onClick={() => go("seed")}>
          <span className="text-[30px]" aria-hidden="true">🌱</span>
          <b>텃밭 씨앗 슬롯</b>
          <span className="st-small">씨앗·희귀 씨앗</span>
        </Link>
        <Link href={slotHref(today, "room")} className="st-gift-tile" onClick={() => go("room")}>
          <span className="text-[30px]" aria-hidden="true">🛋</span>
          <b>방 꾸미기 슬롯</b>
          <span className="st-small">가구·벽지·음원·카르텔 카드</span>
        </Link>
      </div>
    </div>
  );
}
