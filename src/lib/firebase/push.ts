"use client";

import { PUSH_REFRESH } from "@/features/garden/raid/push";

import { firebaseApp, firebaseAuth } from "./client";

/**
 * 거대 잡초 등장 알림 — 이 기기에서 켜고 끈다. 설계는 docs/garden-raid-boss.md §8.
 *
 * ★ 켜진 상태는 기기의 것이다(푸시 주소가 기기마다 다르다). 이 기기의 장부(localStorage)에 적는다.
 * ★ firebase/messaging은 켤 때만 읽는다. 켜지 않은 사람의 묶음에 들어가지 않는다.
 * ★ 서버는 토큰을 저장하지 않는다. 주제에 넣고 빼기만 한다(api/push/topic).
 */

const KEY = "jamtong-raid-push-v1";
const SW_URL = "/push-sw.js";
/** 실제 화면이 없는 범위 — 이 워커가 사이트의 어느 화면도 맡지 않게(public/push-sw.js). */
const SW_SCOPE = "/firebase-cloud-messaging-push-scope";
const VAPID = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;

interface Ledger {
  token: string;
  /** 주제에 마지막으로 넣은 때. */
  at: number;
}

/**
 * 이 기기에서 알림을 쓸 수 있는가.
 * ok=된다, ios-home=iOS에서 홈 화면에 추가해야 된다, in-app=앱 속 브라우저라 안 된다,
 * denied=권한을 거절했다, none=이 브라우저나 이 환경에는 없다.
 */
export type PushSupport = "ok" | "ios-home" | "in-app" | "denied" | "none";

export function pushSupport(): PushSupport {
  if (typeof window === "undefined" || !VAPID || !firebaseApp()) return "none";
  const ua = navigator.userAgent;
  const has = "serviceWorker" in navigator && "PushManager" in window && "Notification" in window;
  if (!has) {
    if (/KAKAOTALK|NAVER\(inapp|Instagram|FBAN|FBAV|Line\//i.test(ua)) return "in-app";
    // iOS는 홈 화면에 추가한 앱에서만 푸시를 준다(16.4부터). 사파리 탭에는 PushManager가 없다.
    const ios = /iPhone|iPad|iPod/.test(ua) || (ua.includes("Macintosh") && navigator.maxTouchPoints > 1);
    return ios ? "ios-home" : "none";
  }
  return Notification.permission === "denied" ? "denied" : "ok";
}

function readLedger(): Ledger | null {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) ?? "null") as Ledger | null;
    return raw && typeof raw.token === "string" && typeof raw.at === "number" ? raw : null;
  } catch {
    return null;
  }
}

/** 이 기기에서 켜 두었는가. 권한이 거둬졌으면 꺼진 것으로 본다. */
export function pushOn(): boolean {
  return pushSupport() === "ok" && Notification.permission === "granted" && readLedger() !== null;
}

async function messaging() {
  const app = firebaseApp();
  if (!app) throw new Error("파이어베이스 설정이 없다");
  const { getMessaging, getToken, deleteToken } = await import("firebase/messaging");
  const registration = await navigator.serviceWorker.register(SW_URL, { scope: SW_SCOPE });
  return {
    token: () => getToken(getMessaging(app), { vapidKey: VAPID, serviceWorkerRegistration: registration }),
    forget: () => deleteToken(getMessaging(app)),
  };
}

async function setTopic(token: string, on: boolean): Promise<string | null> {
  const idToken = await firebaseAuth()?.currentUser?.getIdToken();
  if (!idToken) return "정원을 연 뒤에 다시 눌러 주세요.";
  const res = await fetch("/api/push/topic", {
    method: "POST",
    headers: { "content-type": "application/json", authorization: `Bearer ${idToken}` },
    body: JSON.stringify({ token, on }),
  });
  if (res.ok) return null;
  const body = (await res.json().catch(() => null)) as { error?: string } | null;
  return body?.error ?? "알림을 바꾸지 못했어요. 잠시 뒤 다시 눌러 주세요.";
}

export type PushResult = { ok: true } | { ok: false; reason: "denied" | "failed"; error: string };

/** 켠다. 사람이 누른 자리에서만 부른다 — 권한 창이 뜬다. */
export async function enablePush(): Promise<PushResult> {
  try {
    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      return { ok: false, reason: "denied", error: "알림 권한이 꺼져 있어요. 브라우저의 사이트 설정에서 알림을 허용해 주세요." };
    }
    const token = await (await messaging()).token();
    const error = await setTopic(token, true);
    if (error) return { ok: false, reason: "failed", error };
    localStorage.setItem(KEY, JSON.stringify({ token, at: Date.now() } satisfies Ledger));
    return { ok: true };
  } catch (error) {
    console.error("[push] 알림을 켜지 못했다", error);
    return { ok: false, reason: "failed", error: "알림을 켜지 못했어요. 잠시 뒤 다시 눌러 주세요." };
  }
}

/** 끈다. 주제에서 빼고 이 기기의 푸시 주소를 지운다. */
export async function disablePush(): Promise<PushResult> {
  const ledger = readLedger();
  try {
    if (ledger) {
      const error = await setTopic(ledger.token, false);
      if (error) return { ok: false, reason: "failed", error };
    }
    localStorage.removeItem(KEY);
    await (await messaging()).forget();
    return { ok: true };
  } catch (error) {
    console.error("[push] 알림을 끄지 못했다", error);
    return { ok: false, reason: "failed", error: "알림을 끄지 못했어요. 잠시 뒤 다시 눌러 주세요." };
  }
}

/**
 * 켜 둔 기기의 토큰을 다시 맞춘다 — 하루에 한 번까지. 브라우저가 푸시 주소를 바꾸면 토큰이 달라지고,
 * 주제에는 옛 토큰만 남아 알림이 끊긴다. 화면이 열릴 때 조용히 부른다.
 */
export async function refreshPush(now: number): Promise<void> {
  const ledger = readLedger();
  if (!ledger || !pushOn() || now - ledger.at < PUSH_REFRESH) return;
  try {
    const token = await (await messaging()).token();
    const error = await setTopic(token, true);
    if (error) return;
    localStorage.setItem(KEY, JSON.stringify({ token, at: now } satisfies Ledger));
  } catch (error) {
    // 다음에 열 때 다시 한다. 켜진 상태는 그대로 둔다.
    console.error("[push] 알림 주소를 맞추지 못했다", error);
  }
}

const PINGED_KEY = "jamtong-raid-pinged";

/**
 * 갓 태어난 물결을 봤다고 서버에 알린다(api/raid-notify) — 기기마다 물결당 한 번.
 * 알릴지는 서버가 정한다. 여기서는 같은 물결로 두 번 부르지 않게만 한다.
 */
export function pingRaidSpawn(id: string): void {
  try {
    const seen = JSON.parse(localStorage.getItem(PINGED_KEY) ?? "[]") as string[];
    if (seen.includes(id)) return;
    localStorage.setItem(PINGED_KEY, JSON.stringify([...seen, id].slice(-10)));
  } catch {
    // 적지 못하면 부르지 않는다. 화면이 다시 그려질 때마다 부르는 것보다 낫다.
    return;
  }
  void fetch("/api/raid-notify", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ id }) }).catch((error) =>
    console.error("[push] 등장을 알리지 못했다", error),
  );
}
