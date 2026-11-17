import { googleToken } from "./google";

/**
 * Firestore REST — 서버 계정으로 읽고 쓴다(규칙을 건너뛴다). firebase-admin 없이(google.ts).
 * 라우트는 받은 값을 그대로 경로에 넣지 않는다 — 형식을 먼저 본다.
 */

type Value =
  | { nullValue: null }
  | { booleanValue: boolean }
  | { integerValue: string }
  | { doubleValue: number }
  | { stringValue: string }
  | { timestampValue: string }
  | { arrayValue: { values?: Value[] } }
  | { mapValue: { fields?: Record<string, Value> } };

/** REST의 값 → 보통 값. */
export function decode(v: Value | undefined): unknown {
  if (!v) return undefined;
  if ("nullValue" in v) return null;
  if ("booleanValue" in v) return v.booleanValue;
  if ("integerValue" in v) return Number(v.integerValue);
  if ("doubleValue" in v) return v.doubleValue;
  if ("stringValue" in v) return v.stringValue;
  if ("timestampValue" in v) return Date.parse(v.timestampValue);
  if ("arrayValue" in v) return (v.arrayValue.values ?? []).map(decode);
  if ("mapValue" in v) return Object.fromEntries(Object.entries(v.mapValue.fields ?? {}).map(([k, x]) => [k, decode(x)]));
  return undefined;
}

/** 보통 값 → REST의 값. 정수는 integerValue로 싣는다. */
export function encode(v: unknown): Value {
  if (v === null || v === undefined) return { nullValue: null };
  if (typeof v === "boolean") return { booleanValue: v };
  if (typeof v === "number") return Number.isInteger(v) ? { integerValue: String(v) } : { doubleValue: v };
  if (typeof v === "string") return { stringValue: v };
  if (Array.isArray(v)) return { arrayValue: { values: v.map(encode) } };
  return { mapValue: { fields: Object.fromEntries(Object.entries(v as Record<string, unknown>).map(([k, x]) => [k, encode(x)])) } };
}

const base = () => `https://firestore.googleapis.com/v1/projects/${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? ""}/databases/(default)/documents`;

async function headers(): Promise<Record<string, string> | null> {
  const token = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ? await googleToken() : null;
  return token ? { authorization: `Bearer ${token}`, "content-type": "application/json" } : null;
}

export interface Doc {
  data: Record<string, unknown>;
  updateTime: string;
}

/** 문서 하나. 없으면 null, 서버 계정이 없는 환경이면 "unavailable". mask를 주면 그 필드만. */
export async function getDoc(path: string, mask: string[] = []): Promise<Doc | null | "unavailable"> {
  const h = await headers();
  if (!h) return "unavailable";
  const q = mask.map((m) => `mask.fieldPaths=${encodeURIComponent(m)}`).join("&");
  const res = await fetch(`${base()}/${path}${q ? `?${q}` : ""}`, { headers: h, cache: "no-store" });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`문서를 읽지 못했다(${path}): ${res.status} ${await res.text()}`);
  const json = (await res.json()) as { fields?: Record<string, Value>; updateTime: string };
  return { data: decode({ mapValue: { fields: json.fields ?? {} } }) as Record<string, unknown>, updateTime: json.updateTime };
}

/**
 * 문서를 통째로 쓴다. 앞서 읽은 updateTime(없던 문서면 null)이 그대로일 때만 — 사이에 다른 요청이 썼으면 false.
 */
export async function setDocIfUnchanged(path: string, data: Record<string, unknown>, updateTime: string | null): Promise<boolean> {
  const h = await headers();
  if (!h) return false;
  const pre = updateTime ? `currentDocument.updateTime=${encodeURIComponent(updateTime)}` : "currentDocument.exists=false";
  const res = await fetch(`${base()}/${path}?${pre}`, {
    method: "PATCH",
    headers: h,
    body: JSON.stringify({ fields: (encode(data) as { mapValue: { fields: Record<string, Value> } }).mapValue.fields }),
    cache: "no-store",
  });
  if (res.ok) return true;
  if (res.status === 409 || res.status === 400 || res.status === 404) return false;
  throw new Error(`문서를 쓰지 못했다(${path}): ${res.status} ${await res.text()}`);
}
