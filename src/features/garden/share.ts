"use client";

import { useEffect, useRef, useState } from "react";

import { track } from "@/lib/analytics";
import { firebaseConfigured } from "@/lib/firebase/client";
import { gardenOwnedByOther, publishGarden, unpublishGarden, watchWaters, type PublicGarden } from "@/lib/firebase/gardens";

import { ILCHON_MAX } from "./ilchon/rules";

import { publicRoom } from "./room/rules";
import { kstDayNumber, titleLevels } from "./rules";
import { useGarden, type GardenData } from "./store";

/**
 * 정원 공개 — 주인이 켜면 정원의 모습을 gardens/{공개id}로 올리고, 받은 물을 쓴다.
 * 설계는 docs/garden-game.md §3.10.
 */

/**
 * 공개할 모습. 화면에 그릴 것만 담는다 — 잼·씨앗·쪽지는 담지 않는다.
 * 방은 배치만 싣는다. 액자는 쪽지 id뿐이고 글은 보는 화면이 품종표에서 읽는다(room/rules.ts).
 */
export function publicSnapshot(data: GardenData): PublicGarden {
  const seen = Object.values(data.dex);
  const il = data.ilchon;
  return {
    nick: data.nick,
    beds: data.beds.map((p) => (p ? { s: p.speciesId, p: p.plantedAt, r: p.ripeAt } : null)),
    dex: Object.keys(data.dex).length,
    golden: seen.filter((m) => m.includes("golden")).length,
    rainbow: seen.filter((m) => m.includes("rainbow")).length,
    titles: titleLevels(data),
    room: publicRoom(data.room),
    // 1촌(docs/garden-miniroom.md §5.5). 소식은 종류 번호와 품종 id뿐이다. 1촌 목록은 주인이 보이기를 켰을 때만.
    news: data.news,
    accept: il.accept,
    showIlchon: il.show,
    guestbook: il.guestbook,
    ...(il.show ? { ilchonList: il.friends.slice(0, ILCHON_MAX).map((f) => ({ g: f.g, n: f.n })) } : {}),
  };
}

/** 자랑 링크. /g/<id>는 미리보기 카드를 보여 주고 사람을 /garden?visit=<id>로 보낸다. */
export function gardenLink(id: string): string {
  return `${window.location.origin}/g/${id}`;
}

/**
 * 정원 링크를 건넨다. 공유 시트가 있으면 그것을, 없으면 클립보드를 쓴다.
 * shared=시트로 보냈거나 사람이 시트를 닫았다, copied=복사했다, failed=둘 다 못 했다.
 */
export async function sendGardenLink(
  url: string,
  title: string,
  text: string,
  /** 어디서 보냈는지. raid=거대 잡초 "같이 잡자". 보낸 횟수에는 아무 보상도 없다(§1). */
  from: "garden" | "raid" = "garden",
): Promise<"shared" | "copied" | "failed"> {
  track("share_create", { surface: "garden", from });
  if (navigator.share) {
    try {
      await navigator.share({ title, text, url });
      return "shared";
    } catch (error) {
      // 사람이 시트를 닫은 것은 실패가 아니다.
      if ((error as { name?: string }).name === "AbortError") return "shared";
    }
  }
  try {
    await navigator.clipboard.writeText(url);
    return "copied";
  } catch (error) {
    console.error("[gardens] 링크를 나누지 못했다", error);
    return "failed";
  }
}

/** 공개를 켠 동안 바뀔 때마다 늦춰 올린다. 너무 자주 쓰지 않게 길게 늦춘다. */
const PUBLISH_DELAY = 5_000;
/** 올리기에 실패하면 1·2·4·8분 뒤에 다시 한다(invite.ts와 같다). */
const RETRY_BASE = 60_000;
const RETRY_MAX = 4;

/**
 * ★ 올리기가 실패한 채 남던 두 길(docs/garden-miniroom.md §8의 2, 2026-11-14).
 *   1. 한 번 실패하면 공개 모습이 바뀔 때까지 다시 하지 않았다. 그 사이 탭을 닫으면 다음에 열 때까지
 *      공개 문서가 없다. → 늦춰서 다시 한다.
 *   2. 로그아웃하거나 다른 구글 계정으로 바꾸면 이 기기의 정원(공개 id 포함)이 새 계정의 정원이 된다
 *      (store.link). 그 공개 id의 문서는 옛 계정 것이라 규칙이 고치기를 영영 거절한다.
 *      → 거절이 그 까닭이면 새 공개 id를 만든다. 옛 링크는 옛 계정의 방으로 남는다.
 */

export function useShare(uid: string | null, synced: boolean, now: number, say: (text: string) => void) {
  const data = useGarden((s) => s.data);
  const on = Boolean(data?.share.on);
  const id = data?.share.id ?? null;
  const snapshot = data ? JSON.stringify(publicSnapshot(data)) : null;

  // 올리기와 내리기. 계정과 맞춘 뒤에만 한다 — 맞추기 전 정원은 남의 것일 수 있다.
  const published = useRef<string | null>(null);
  const [retry, setRetry] = useState(0);
  useEffect(() => {
    if (!firebaseConfigured || !uid || !synced || !id || !snapshot) return;
    if (!on) {
      if (published.current === null) return;
      published.current = null;
      // 1촌이 있으면 지우지 않고 가린다(gardens.ts의 unpublishGarden).
      unpublishGarden(id, uid).catch((error) => {
        console.error("[gardens] 정원 공개를 끄지 못했다", error);
        say("정원 공개를 끄지 못했어요. 잠시 뒤 다시 해 보세요");
      });
      return;
    }
    if (published.current === snapshot) return;
    const first = published.current === null;
    let retryTimer: ReturnType<typeof setTimeout> | undefined;
    const timer = setTimeout(
      () => {
        published.current = snapshot;
        publishGarden(id, uid, JSON.parse(snapshot) as PublicGarden)
          .then(() => setRetry(0))
          .catch(async (error) => {
            published.current = null;
            console.error("[gardens] 정원을 공개하지 못했다", error);
            if ((error as { code?: string }).code === "permission-denied" && (await gardenOwnedByOther(id, uid).catch(() => false))) {
              useGarden.getState().renewShareId();
              say("이 계정의 새 정원 링크를 만들었어요");
              return;
            }
            if (retry === 0) say("정원을 공개하지 못했어요. 잠시 뒤 다시 해 볼게요");
            if (retry < RETRY_MAX) retryTimer = setTimeout(() => setRetry((n) => n + 1), RETRY_BASE * 2 ** retry);
          });
      },
      first ? 0 : PUBLISH_DELAY,
    );
    return () => {
      clearTimeout(timer);
      clearTimeout(retryTimer);
    };
  }, [uid, synced, id, on, snapshot, say, retry]);

  // 받은 물. 공개한 동안 오늘 물을 준 사람을 보고, 처음 보는 사람의 물을 쓴다. 1촌의 물은 더 줄인다.
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
