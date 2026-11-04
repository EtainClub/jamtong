"use client";

import { useEffect, useRef } from "react";

import { firebaseConfigured } from "@/lib/firebase/client";
import { publishGarden, unpublishGarden, watchWaters, type PublicGarden } from "@/lib/firebase/gardens";

import { kstDayNumber } from "./rules";
import { useGarden, type GardenData } from "./store";

/**
 * 정원 공개 — 주인이 켜면 정원의 모습을 gardens/{공개id}로 올리고, 받은 물을 쓴다.
 * 설계는 docs/garden-game.md §3.10.
 */

/** 공개할 모습. 화면에 그릴 것만 담는다 — 잼·씨앗·쪽지는 담지 않는다. */
export function publicSnapshot(data: GardenData): PublicGarden {
  const seen = Object.values(data.dex);
  return {
    nick: data.nick,
    beds: data.beds.map((p) => (p ? { s: p.speciesId, p: p.plantedAt, r: p.ripeAt } : null)),
    dex: Object.keys(data.dex).length,
    golden: seen.filter((m) => m.includes("golden")).length,
    rainbow: seen.filter((m) => m.includes("rainbow")).length,
  };
}

export function gardenLink(id: string): string {
  return `${window.location.origin}/garden?visit=${id}`;
}

/** 공개를 켠 동안 바뀔 때마다 늦춰 올린다. 너무 자주 쓰지 않게 길게 늦춘다. */
const PUBLISH_DELAY = 5_000;

export function useShare(uid: string | null, synced: boolean, now: number, say: (text: string) => void) {
  const data = useGarden((s) => s.data);
  const on = Boolean(data?.share.on);
  const id = data?.share.id ?? null;
  const snapshot = data ? JSON.stringify(publicSnapshot(data)) : null;

  // 올리기와 내리기. 계정과 맞춘 뒤에만 한다 — 맞추기 전 정원은 남의 것일 수 있다.
  const published = useRef<string | null>(null);
  useEffect(() => {
    if (!firebaseConfigured || !uid || !synced || !id || !snapshot) return;
    if (!on) {
      if (published.current === null) return;
      published.current = null;
      unpublishGarden(id).catch((error) => {
        console.error("[gardens] 정원 공개를 끄지 못했다", error);
        say("정원 공개를 끄지 못했어요. 잠시 뒤 다시 해 보세요");
      });
      return;
    }
    if (published.current === snapshot) return;
    const first = published.current === null;
    const timer = setTimeout(
      () => {
        published.current = snapshot;
        publishGarden(id, uid, JSON.parse(snapshot) as PublicGarden).catch((error) => {
          published.current = null;
          console.error("[gardens] 정원을 공개하지 못했다", error);
          say("정원을 공개하지 못했어요. 잠시 뒤 다시 해 보세요");
        });
      },
      first ? 0 : PUBLISH_DELAY,
    );
    return () => clearTimeout(timer);
  }, [uid, synced, id, on, snapshot, say]);

  // 받은 물. 공개한 동안 오늘 물을 준 사람을 보고, 처음 보는 사람의 물을 쓴다.
  const day = kstDayNumber(now);
  useEffect(() => {
    if (!firebaseConfigured || !uid || !synced || !id || !on) return;
    return watchWaters(id, day, (visitors) => {
      const used = useGarden.getState().receiveWaters(visitors);
      if (used.length === 0) return;
      const names = used.map((v) => v.nick).slice(0, 2).join(", ");
      const more = used.length > 2 ? ` 외 ${used.length - 2}명` : "";
      say(`🚿 ${names}${more}님이 물을 줬어요 · 텃밭이 빨리 자라요`);
    });
  }, [uid, synced, id, on, day, say]);
}
