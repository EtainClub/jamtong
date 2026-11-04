"use client";

import { useState } from "react";

import { track } from "@/lib/analytics";

import { gardenFeedback } from "./feedback";
import { WATER_CUT, WATER_PER_DAY, kstDayNumber } from "./rules";
import { gardenLink } from "./share";
import { useGarden, type GardenData } from "./store";

/**
 * 내 정원 공개와 자랑 링크 (docs/garden-game.md §3.10).
 *
 * ★ 공개는 직접 켠다. 켜기 전에는 무엇이 보이는지 먼저 적는다.
 * ★ 링크를 보낸 횟수에는 아무 보상도 없다 — 홍보량을 보상하지 않는다(§1).
 *   보상은 친구가 와서 물을 줄 때 둘 다 받는 성장뿐이다.
 */
export function ShareCard({ data, now, say }: { data: GardenData; now: number; say: (text: string) => void }) {
  const [copied, setCopied] = useState(false);
  const { on, id } = data.share;
  const today = kstDayNumber(now);
  const received = data.waters.day === today ? data.waters.received.length : 0;
  const given = data.waters.day === today ? data.waters.given.length : 0;

  const share = async () => {
    if (!id) return;
    const url = gardenLink(id);
    track("share_create", { surface: "garden" });
    try {
      if (navigator.share) {
        await navigator.share({ title: `${data.nick}의 잼통 정원`, text: "내 정원에 물 주러 와요 🌱", url });
        return;
      }
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      // 사용자가 공유 창을 닫은 것은 실패가 아니다.
      if ((error as { name?: string }).name === "AbortError") return;
      console.error("[gardens] 링크를 나누지 못했다", error);
      say("링크를 복사하지 못했어요");
    }
  };

  return (
    <section aria-labelledby="garden-share" className="mt-3 rounded-2xl bg-[var(--g-panel)] px-3.5 py-3">
      <div className="flex items-center justify-between gap-3">
        <h2 id="garden-share" className="text-[13.5px] font-bold">
          🔗 내 정원 자랑하기
        </h2>
        <label className="flex shrink-0 items-center gap-1.5 text-[12px] font-semibold">
          <input
            type="checkbox"
            checked={on}
            onChange={(e) => {
              gardenFeedback("tap");
              useGarden.getState().setShare(e.target.checked);
              say(e.target.checked ? "정원을 공개했어요" : "정원 공개를 껐어요");
            }}
            className="h-4 w-4 accent-[var(--g-leaf)]"
          />
          공개
        </label>
      </div>
      <p className="mt-1 text-[11.5px] leading-relaxed text-smoke">
        공개하면 링크를 받은 사람이 정원 이름 「{data.nick}」, 텃밭, 도감 수를 볼 수 있어요. 잼·씨앗·쪽지는 보이지
        않아요. 친구가 물을 주면 둘 다 자라는 중인 포기의 남은 시간이 {Math.round(WATER_CUT * 100)}% 줄어요 (하루{" "}
        {WATER_PER_DAY}번까지).
      </p>

      {on && id && (
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => void share()}
            className="rounded-full bg-[var(--g-leaf)] px-3.5 py-1.5 text-[12.5px] font-semibold text-white"
          >
            {copied ? "링크를 복사했어요" : "링크 보내기"}
          </button>
          <p className="text-[11.5px] tabular-nums text-graphite">
            오늘 받은 물 {received}/{WATER_PER_DAY} · 준 물 {given}/{WATER_PER_DAY}
          </p>
        </div>
      )}
    </section>
  );
}
