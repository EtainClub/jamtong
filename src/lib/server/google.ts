import { createSign } from "node:crypto";
import { readFile } from "node:fs/promises";

/**
 * 구글 API를 서버 계정으로 부를 때 쓰는 토큰.
 *
 * firebase-admin은 이 저장소에서 런타임 의존성이 아니다(스크립트용). 그래서 SDK 없이 받는다.
 *   배포본: App Hosting(Cloud Run)의 실행 계정 — 메타데이터 서버가 토큰을 준다. 열쇠 파일이 없다.
 *   손에서: GOOGLE_APPLICATION_CREDENTIALS가 가리키는 서비스 계정 파일로 서명해 받는다.
 * 둘 다 없으면 null이다. 부르는 쪽은 "이 환경에는 없는 기능"으로 다룬다.
 *
 * ★ 이 토큰은 규칙을 건너뛴다. 라우트는 받은 값을 그대로 경로에 넣지 않는다 — 형식을 먼저 본다.
 */

const SCOPE = "https://www.googleapis.com/auth/cloud-platform";
const METADATA = "http://metadata.google.internal/computeMetadata/v1/instance/service-accounts/default/token";

let cached: { token: string; until: number } | null = null;

export async function googleToken(): Promise<string | null> {
  if (cached && Date.now() < cached.until) return cached.token;
  const got = process.env.GOOGLE_APPLICATION_CREDENTIALS ? await fromFile(process.env.GOOGLE_APPLICATION_CREDENTIALS) : await fromMetadata();
  if (!got) return null;
  // 만료 1분 전까지만 쓴다.
  cached = { token: got.access_token, until: Date.now() + (got.expires_in - 60) * 1000 };
  return cached.token;
}

interface Granted {
  access_token: string;
  expires_in: number;
}

async function fromMetadata(): Promise<Granted | null> {
  try {
    const res = await fetch(METADATA, { headers: { "metadata-flavor": "Google" }, cache: "no-store", signal: AbortSignal.timeout(2_000) });
    return res.ok ? ((await res.json()) as Granted) : null;
  } catch {
    // 구글 클라우드 밖이다(손에서 도는 dev). 없는 기능으로 둔다.
    return null;
  }
}

async function fromFile(path: string): Promise<Granted | null> {
  const key = JSON.parse(await readFile(path, "utf8")) as { client_email: string; private_key: string; token_uri: string };
  const now = Math.floor(Date.now() / 1000);
  const part = (value: object) => Buffer.from(JSON.stringify(value)).toString("base64url");
  const body = `${part({ alg: "RS256", typ: "JWT" })}.${part({ iss: key.client_email, scope: SCOPE, aud: key.token_uri, iat: now, exp: now + 3600 })}`;
  const jwt = `${body}.${createSign("RSA-SHA256").update(body).sign(key.private_key, "base64url")}`;
  const res = await fetch(key.token_uri, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer", assertion: jwt }),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`서비스 계정 토큰을 받지 못했다: ${res.status} ${await res.text()}`);
  return (await res.json()) as Granted;
}
