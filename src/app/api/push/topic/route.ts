import { checkOrigin } from "@/lib/agent/guard";
import { setTopic } from "@/lib/server/push";

/**
 * 거대 잡초 등장 알림을 켜고 끈다 — 이 기기의 FCM 토큰을 주제에 넣거나 뺀다.
 * 설계는 docs/garden-raid-boss.md §8.2. 화면은 lib/firebase/push.ts.
 *
 * ★ 토큰은 저장하지 않는다. 주제에 넣고 잊는다.
 * ★ 정원에 든 계정(익명 포함)만 부를 수 있다. 익명은 누구나 만들 수 있지만, 여기서 할 수 있는 일은
 *   제 기기를 주제에 넣는 것뿐이다 — 남의 토큰은 알 길이 없다.
 */

/** FCM 등록 토큰의 생김새. 길이는 넉넉히 본다. */
const TOKEN = /^[A-Za-z0-9_:-]{60,4096}$/;

async function signedIn(request: Request): Promise<boolean> {
  const key = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  const header = request.headers.get("authorization") ?? "";
  const idToken = header.startsWith("Bearer ") ? header.slice(7).trim() : "";
  if (!key || !idToken) return false;
  // firebase-admin 없이 Identity Toolkit에 되물어 본다(api/wiki-ask와 같은 길).
  const res = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${key}`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ idToken }),
    cache: "no-store",
  });
  if (!res.ok) return false;
  return Boolean(((await res.json()) as { users?: Array<{ localId?: string }> }).users?.[0]?.localId);
}

export async function POST(request: Request) {
  const origin = checkOrigin(request);
  if (!origin.ok) return Response.json({ error: origin.error }, { status: origin.status });

  let body: { token?: unknown; on?: unknown };
  try {
    body = (await request.json()) as { token?: unknown; on?: unknown };
  } catch {
    return Response.json({ error: "요청을 읽지 못했어요." }, { status: 400 });
  }
  if (typeof body.token !== "string" || !TOKEN.test(body.token) || typeof body.on !== "boolean") {
    return Response.json({ error: "요청이 맞지 않아요." }, { status: 400 });
  }

  try {
    if (!(await signedIn(request))) return Response.json({ error: "정원을 연 뒤에 다시 눌러 주세요." }, { status: 401 });
    const result = await setTopic(body.token, body.on);
    if (result === "ok") return Response.json({ on: body.on });
    if (result === "unavailable") return Response.json({ error: "이 환경에는 알림이 없어요." }, { status: 503 });
    if (result === "bad-token") return Response.json({ error: "이 기기의 알림 주소가 맞지 않아요. 다시 켜 주세요." }, { status: 400 });
    return Response.json({ error: "알림을 바꾸지 못했어요. 잠시 뒤 다시 눌러 주세요." }, { status: 502 });
  } catch (error) {
    console.error("[push] 알림 설정을 바꾸지 못했다", error);
    return Response.json({ error: "알림을 바꾸지 못했어요. 잠시 뒤 다시 눌러 주세요." }, { status: 502 });
  }
}
