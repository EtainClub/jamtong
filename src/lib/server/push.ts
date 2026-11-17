import { PUSH_TOPIC, PUSH_TTL_SECONDS, type PushCopy } from "@/features/garden/raid/push";

import { googleToken } from "./google";

/**
 * 거대 잡초 등장 알림의 서버 쪽 — FCM 주제에 넣고 빼기, 주제로 보내기, "보냈다" 표식.
 * 설계는 docs/garden-raid-boss.md §8. 라우트(api/push/topic, api/raid-notify)만 부른다.
 *
 * 모두 서버 계정 토큰으로 REST를 부른다(google.ts). 토큰이 없는 환경이면 "unavailable"이다.
 */

const project = () => process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? "";

async function auth(): Promise<Record<string, string> | null> {
  const token = project() ? await googleToken() : null;
  return token ? { authorization: `Bearer ${token}`, "content-type": "application/json" } : null;
}

export type TopicResult = "ok" | "bad-token" | "unavailable" | "error";

/** 기기 토큰 하나를 주제에 넣거나 뺀다. */
export async function setTopic(token: string, on: boolean): Promise<TopicResult> {
  const headers = await auth();
  if (!headers) return "unavailable";
  const res = await fetch(`https://iid.googleapis.com/iid/v1:${on ? "batchAdd" : "batchRemove"}`, {
    method: "POST",
    // access_token_auth: 서버 키가 아니라 OAuth 토큰으로 부른다는 표시(firebase-admin이 쓰는 길과 같다).
    headers: { ...headers, access_token_auth: "true" },
    body: JSON.stringify({ to: `/topics/${PUSH_TOPIC}`, registration_tokens: [token] }),
    cache: "no-store",
  });
  if (!res.ok) {
    console.error(`[push] 주제를 바꾸지 못했다: ${res.status} ${await res.text()}`);
    return "error";
  }
  const result = ((await res.json()) as { results?: Array<{ error?: string }> }).results?.[0];
  if (!result?.error) return "ok";
  // 지워진 토큰을 빼는 것은 이미 된 일이다.
  if (!on) return "ok";
  console.warn(`[push] 주제에 넣지 못한 토큰: ${result.error}`);
  return result.error === "INVALID_ARGUMENT" || result.error === "NOT_FOUND" ? "bad-token" : "error";
}

/** 주제로 한 번 보낸다. dryRun이면 FCM이 받아 보기만 하고 보내지 않는다. */
export async function sendToTopic(copy: PushCopy, dryRun = false): Promise<"ok" | "unavailable" | "error"> {
  const headers = await auth();
  if (!headers) return "unavailable";
  const res = await fetch(`https://fcm.googleapis.com/v1/projects/${project()}/messages:send`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      validate_only: dryRun,
      message: {
        topic: PUSH_TOPIC,
        // 글은 data로 싣고 서비스 워커(public/push-sw.js)가 그린다 — 누름을 우리가 다루려면 그래야 한다.
        data: { title: copy.title, body: copy.body, url: copy.url, tag: copy.tag },
        webpush: { headers: { TTL: String(PUSH_TTL_SECONDS), Urgency: "high" } },
      },
    }),
    cache: "no-store",
  });
  if (res.ok) return "ok";
  console.error(`[push] 알림을 보내지 못했다: ${res.status} ${await res.text()}`);
  return "error";
}

type Value = { timestampValue?: string; nullValue?: null; integerValue?: string };

const docs = () => `https://firestore.googleapis.com/v1/projects/${project()}/databases/(default)/documents`;

export interface RaidTimes {
  spawnedAt: number | null;
  defeatedAt: number | null;
  /** 지금 형태(1–3). 2.0 물결은 1. */
  form: 1 | 2 | 3;
  /** 지금 형태가 시작한 때. 1형이면 태어난 때와 같다. */
  formAt: number | null;
}

/** 물결의 시각과 형태. 없는 물결이면 null. id는 부르는 쪽이 형식을 본 것이다. */
export async function readRaidTimes(id: string): Promise<RaidTimes | null | "unavailable"> {
  const headers = await auth();
  if (!headers) return "unavailable";
  const mask = ["spawnedAt", "defeatedAt", "form", "formAt"].map((k) => `mask.fieldPaths=${k}`).join("&");
  const res = await fetch(`${docs()}/plazaRaids/${id}?${mask}`, { headers, cache: "no-store" });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`물결을 읽지 못했다: ${res.status} ${await res.text()}`);
  const f = ((await res.json()) as { fields?: Record<string, Value> }).fields ?? {};
  const time = (v?: Value) => (v?.timestampValue ? Date.parse(v.timestampValue) : null);
  const form = Number(f.form?.integerValue ?? 1);
  return {
    spawnedAt: time(f.spawnedAt),
    defeatedAt: time(f.defeatedAt),
    form: form === 2 || form === 3 ? form : 1,
    formAt: time(f.formAt) ?? time(f.spawnedAt),
  };
}

/**
 * "이 물결(형태)은 알렸다" 표식 — plazaRaids/{id}/push/sent(1형), sent-2·sent-3(변신). 없을 때만 만들어지므로
 * 먼저 온 요청 하나만 true다. 규칙은 이 경로를 열지 않는다(firestore.rules의 맨 끝 "그 밖의 모든 것은 닫는다").
 */
const marker = (form: number) => (form > 1 ? `sent-${form}` : "sent");

export async function claimPush(id: string, form = 1): Promise<boolean> {
  const headers = await auth();
  if (!headers) return false;
  const res = await fetch(`${docs()}/plazaRaids/${id}/push?documentId=${marker(form)}`, {
    method: "POST",
    headers,
    body: JSON.stringify({ fields: { at: { timestampValue: new Date().toISOString() } } }),
    cache: "no-store",
  });
  if (res.ok) return true;
  if (res.status === 409) return false;
  throw new Error(`알림 표식을 만들지 못했다: ${res.status} ${await res.text()}`);
}

/** 보내지 못했을 때 표식을 거둔다 — 다음 요청이 다시 보낼 수 있게. */
export async function releasePush(id: string, form = 1): Promise<void> {
  const headers = await auth();
  if (!headers) return;
  const res = await fetch(`${docs()}/plazaRaids/${id}/push/${marker(form)}`, { method: "DELETE", headers, cache: "no-store" });
  if (!res.ok) console.error(`[push] 알림 표식을 거두지 못했다: ${res.status}`);
}
