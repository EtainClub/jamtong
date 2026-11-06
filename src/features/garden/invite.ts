"use client";

import { useEffect, useRef } from "react";

import { track } from "@/lib/analytics";
import { firebaseConfigured } from "@/lib/firebase/client";
import { joinInvite, registerInvite, watchInvite } from "@/lib/firebase/invites";

import { INVITE_CODE } from "./rules";
import { useGarden } from "./store";
import type { Species } from "./types";

/**
 * 초대 씨앗 — 내가 보내는 정원 링크에는 내 초대 코드가 붙는다(?invite=, /g·/r은 ?i=).
 * 그 링크로 온 새 정원이 첫 열매를 거두면 둘 다 희귀 씨앗 상자를 받는다. 규칙은 rules.ts.
 */

/** 보내는 링크에 내 초대 코드를 붙인다. 파이어베이스가 없는 환경에서는 그대로. */
export function withInvite(url: string, key = "invite"): string {
  if (!firebaseConfigured) return url;
  const code = useGarden.getState().inviteCode();
  if (!code) return url;
  const u = new URL(url);
  u.searchParams.set(key, code);
  return u.toString();
}

/** 주소의 초대 코드를 읽고 지운다. 정원을 처음 그릴 때 한 번. */
export function takeInviteParam(): string | null {
  const url = new URL(window.location.href);
  const code = url.searchParams.get("invite");
  if (code === null) return null;
  url.searchParams.delete("invite");
  window.history.replaceState(null, "", url.pathname + url.search);
  return INVITE_CODE.test(code) ? code : null;
}

export function useInvite(
  uid: string | null,
  synced: boolean,
  incomingRef: { current: string | null },
  catalog: Species[],
  say: (text: string) => void,
) {
  const invite = useGarden((s) => s.data?.invite);
  const harvested = useGarden((s) => (s.data ? Object.keys(s.data.dex).length > 0 : false));

  // 초대 링크로 왔다. 계정과 맞춘 뒤에 받는다 — 먼저 받으면 계정 정원에 덮인다.
  useEffect(() => {
    const code = incomingRef.current;
    if (!code || !synced || !firebaseConfigured) return;
    incomingRef.current = null;
    if (!useGarden.getState().acceptInvite(code)) return;
    track("invite_accept");
    say("💌 친구의 초대로 왔어요 · 첫 열매를 거두면 둘 다 희귀 씨앗을 받아요");
  }, [synced, incomingRef, say]);

  // 내 코드를 서버에 등록한다. 처음 링크를 보낼 때 코드가 생기고, 그 뒤 한 번.
  const code = invite?.code ?? null;
  const registered = invite?.registered ?? false;
  useEffect(() => {
    if (!uid || !synced || !code || registered) return;
    registerInvite(code, uid)
      .then(() => useGarden.getState().inviteRegistered())
      .catch((error) => console.error("[invites] 초대 코드를 등록하지 못했다", error));
  }, [uid, synced, code, registered]);

  // 초대받은 사람: 첫 열매를 거두면 센다. 세어졌을 때만 상자를 받는다 — 둘의 장부가 어긋나지 않게.
  const by = invite?.by ?? null;
  const done = invite?.done ?? false;
  const joining = useRef(false);
  useEffect(() => {
    if (!uid || !synced || !by || done || !harvested || joining.current) return;
    joining.current = true;
    void joinInvite(uid, by).then((result) => {
      joining.current = false;
      if (result === "error") return; // 닿지 못했다. 다음에 다시.
      const species = useGarden.getState().finishInvite(result === "ok" ? { key: `${by}:${uid}`, catalog } : null);
      if (result !== "ok") return;
      track("invite_join");
      say(`🎁 초대 선물 · 🌱 ${species?.title ?? "희귀 씨앗"}`);
    });
  }, [uid, synced, by, done, harvested, catalog, say]);

  // 초대한 사람: 첫 열매를 거둔 친구 수를 보고 아직 받지 않은 상자를 연다.
  useEffect(() => {
    if (!uid || !synced || !code || !registered) return;
    return watchInvite(code, (joined) => {
      const boxes = useGarden.getState().claimInvites(joined, catalog);
      if (boxes.length === 0) return;
      const names = boxes.map((b) => b?.title).filter(Boolean).slice(0, 2).join(", ");
      say(`🎁 초대한 친구가 첫 열매를 거뒀어요 · 희귀 씨앗 ${boxes.length}개${names ? ` (${names})` : ""}`);
    });
  }, [uid, synced, code, registered, catalog, say]);
}
