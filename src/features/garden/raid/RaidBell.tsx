"use client";

import { useEffect, useState, useSyncExternalStore } from "react";

import { track } from "@/lib/analytics";
import { disablePush, enablePush, pushOn, pushSupport, refreshPush, type PushSupport } from "@/lib/firebase/push";

import { gardenFeedback } from "../feedback";
import { PUSH_HOURS, PUSH_RAID_ID } from "./push";
import { RAID_PER_DAY } from "../rules";

/**
 * 거대 잡초 등장 알림을 켜고 끄는 줄 — 광장의 거대 잡초 칸 아래(docs/garden-raid-boss.md §8.3).
 *
 * ★ 권한 창을 띄우기 전에 무엇이 오는지 먼저 말한다. 창은 사람이 "알림 켜기"를 누른 뒤에만 뜬다.
 * ★ 못 받는 환경은 숨기지 않고 까닭과 길을 적는다. 알림 자체가 없는 환경(설정 없음)에서만 그리지 않는다.
 * ★ 켜진 상태는 이 기기의 것이다.
 */

const listeners = new Set<() => void>();
const subscribe = (fn: () => void) => {
  listeners.add(fn);
  return () => listeners.delete(fn);
};
/** 화면이 읽는 값. 문자열 하나라 바뀌지 않으면 다시 그리지 않는다. */
const snapshot = () => `${pushSupport()}:${pushOn() ? 1 : 0}`;
const serverSnapshot = () => "none:0";

const BLOCKED: Record<Exclude<PushSupport, "ok" | "none">, string> = {
  "ios-home": "아이폰·아이패드는 홈 화면에 추가한 잼통에서만 알림을 받을 수 있어요. 사파리의 공유 단추 → ‘홈 화면에 추가’ 뒤, 그 아이콘으로 열어 다시 눌러 주세요.",
  "in-app": "이 앱 안의 브라우저는 알림을 받을 수 없어요. 오른쪽 위 메뉴에서 ‘다른 브라우저로 열기’를 눌러 크롬이나 사파리로 열어 주세요.",
  denied: "이 기기에서 알림을 막아 두었어요. 브라우저 주소창의 자물쇠(사이트 설정)에서 알림을 ‘허용’으로 바꾸면 켤 수 있어요.",
};

export function RaidBell({ say }: { say: (text: string) => void }) {
  const [support, on] = useSyncExternalStore(subscribe, snapshot, serverSnapshot).split(":") as [PushSupport, "0" | "1"];
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    // 켜 둔 기기는 하루에 한 번 푸시 주소를 다시 맞춘다.
    void refreshPush(Date.now());
    // 알림을 눌러 들어왔으면 한 번 세고 주소에서 지운다.
    const url = new URL(window.location.href);
    const raid = url.searchParams.get("push");
    if (raid === null) return;
    if (PUSH_RAID_ID.test(raid)) track("raid_push_open", { raid });
    url.searchParams.delete("push");
    window.history.replaceState(window.history.state, "", url);
  }, []);

  if (support === "none") return null;

  const toggle = async () => {
    gardenFeedback("tap");
    setBusy(true);
    const result = on === "1" ? await disablePush() : await enablePush();
    setBusy(false);
    listeners.forEach((fn) => fn());
    if (result.ok) {
      track(on === "1" ? "push_off" : "push_on", { from: "plaza" });
      say(on === "1" ? "🔕 거대 잡초 알림을 껐어요" : "🔔 거대 잡초가 나타나면 이 기기로 알려 드려요");
      return;
    }
    if (result.reason === "denied") track("push_denied");
    say(result.error);
  };

  return (
    <div className="mt-3 rounded-2xl bg-white/70 px-4 py-3 text-[13px]">
      <div className="flex items-center justify-between gap-3">
        <p className="font-semibold">{on === "1" ? "🔔 거대 잡초 알림이 켜져 있어요" : "🔔 거대 잡초가 나타나면 알려 드릴까요?"}</p>
        {support === "ok" && (
          <button
            type="button"
            disabled={busy}
            aria-pressed={on === "1"}
            onClick={() => void toggle()}
            className={`min-h-[44px] shrink-0 rounded-full px-4 py-2 text-[13px] font-semibold disabled:opacity-50 ${on === "1" ? "bg-black/10 text-ink" : "bg-[var(--g-jam)] text-white"}`}
          >
            {busy ? "잠시만요…" : on === "1" ? "끄기" : "알림 켜기"}
          </button>
        )}
      </div>
      <p className="mt-1 text-[12px] opacity-85">
        {support === "ok"
          ? `하루 ${RAID_PER_DAY}번까지, 낮(${PUSH_HOURS.from}–${PUSH_HOURS.to}시)에만, 거대 잡초가 나타날 때 이 기기로 와요.`
          : BLOCKED[support]}
      </p>
    </div>
  );
}
