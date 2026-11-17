import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";

import { BOOK_ASK_JAM, BOOK_ASK_MAX_CHARS, BOOK_ASK_PER_DAY, bookIdOf, roomBookOf } from "@/features/garden/room/library";
import { checkDailyBudget, checkOrigin, checkRate } from "@/lib/agent/guard";
import { answerFromBook, citedChapters, type BookModelAnswer } from "@/lib/books/ask";
import { bookPack } from "@/lib/books/pack";
import { getDoc, setDocIfUnchanged } from "@/lib/server/firestore";

/**
 * 책에게 묻기 — 특별한 책(한 권 100,000잼)을 방에 놓은 사람만, 책마다 하루 BOOK_ASK_PER_DAY번, 한 번에 잼 BOOK_ASK_JAM.
 * 설계는 docs/garden-miniroom.md "특별한 책 혜택".
 *
 * ★ 답은 그 책의 장별 요약 안에서만 한다. 문장마다 〔N장〕을 달고, 펴 준 장에 없는 것은 "책에 없다"고 답한다.
 *   요약은 잼통이 쓴 글이다(원문이 아니다) — 그것도 답에 밝힌다. /api/wiki-ask와 같은 규율이다.
 * ★ 서버가 지키는 것: 로그인(익명도 된다 — 정원이 익명 계정으로 돈다), 내 정원 장부(users/{uid}/garden/state)에
 *   그 책이 **놓여** 있고 잼이 BOOK_ASK_JAM 이상인지, 오늘 그 책에 물은 수(bookAsks/{uid}, 서버 계정만 쓴다).
 *   잼은 답을 받은 화면이 치른다(정원 장부는 화면이 쓴다 — 다른 잼과 같다).
 * ★ 모델 비용: 책 하나의 요약(최대 4만여 자)을 시스템 프롬프트에 실어 캐시한다. 사는 사람·책·하루 수가 모두 묶여 있어 상한이 있다.
 */

export const runtime = "nodejs";

const requestSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]{1,40}$/),
  question: z.string().trim().min(2).max(BOOK_ASK_MAX_CHARS),
});

async function accountOf(request: Request): Promise<{ ok: true; uid: string } | { ok: false; status: number; error: string }> {
  const key = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  if (!key) return { ok: false, status: 503, error: "이 환경에는 로그인이 설정되어 있지 않아요." };
  const header = request.headers.get("authorization") ?? "";
  const idToken = header.startsWith("Bearer ") ? header.slice(7).trim() : "";
  if (!idToken) return { ok: false, status: 401, error: "정원을 연 뒤에 다시 물어 주세요." };
  try {
    // firebase-admin 없이 Identity Toolkit에 되물어 본다(api/wiki-ask와 같은 길). 익명 계정도 받는다.
    const res = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${key}`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ idToken }),
      cache: "no-store",
    });
    if (!res.ok) return { ok: false, status: 401, error: "로그인이 만료되었어요. 정원을 다시 열어 주세요." };
    const uid = ((await res.json()) as { users?: Array<{ localId?: string }> }).users?.[0]?.localId;
    return uid ? { ok: true, uid } : { ok: false, status: 401, error: "정원을 연 뒤에 다시 물어 주세요." };
  } catch {
    return { ok: false, status: 503, error: "로그인을 확인하지 못했어요." };
  }
}

const todayNumber = () => Math.floor((Date.now() + 9 * 3_600_000) / 86_400_000);

/** 오늘 이 책에 물은 수를 하나 올린다(남은 수가 있을 때만). 올렸으면 올린 뒤의 수, 다 썼으면 null. */
async function reserve(uid: string, slug: string, delta: 1 | -1): Promise<number | null | "unavailable"> {
  for (let attempt = 0; attempt < 3; attempt++) {
    const doc = await getDoc(`bookAsks/${uid}`);
    if (doc === "unavailable") return "unavailable";
    const day = todayNumber();
    const n = doc && doc.data.day === day && doc.data.n && typeof doc.data.n === "object" ? { ...(doc.data.n as Record<string, number>) } : {};
    const next = Math.max(0, (n[slug] ?? 0) + delta);
    if (delta > 0 && next > BOOK_ASK_PER_DAY) return null;
    n[slug] = next;
    if (await setDocIfUnchanged(`bookAsks/${uid}`, { day, n }, doc ? doc.updateTime : null)) return next;
  }
  throw new Error("질문 수를 적지 못했다(겹치는 요청)");
}

export async function POST(request: Request) {
  const origin = checkOrigin(request);
  if (!origin.ok) return Response.json({ error: origin.error }, { status: origin.status });

  const account = await accountOf(request);
  if (!account.ok) return Response.json({ error: account.error }, { status: account.status });

  const parsed = requestSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return Response.json({ error: `질문은 2–${BOOK_ASK_MAX_CHARS}자로 적어 주세요.` }, { status: 400 });
  const { slug, question } = parsed.data;
  const book = roomBookOf(bookIdOf(slug));
  const pack = book ? bookPack(slug) : null;
  if (!book || !pack) return Response.json({ error: "없는 책이에요." }, { status: 404 });

  try {
    // 내 정원 장부 — 이 책이 방에 놓여 있고 잼이 있는가.
    const garden = await getDoc(`users/${account.uid}/garden/state`, ["jam", "room"]);
    if (garden === "unavailable") return Response.json({ error: "이 환경에는 책에게 묻기가 없어요." }, { status: 503 });
    const jam = typeof garden?.data.jam === "number" ? garden.data.jam : 0;
    const placed = (garden?.data.room as { placed?: Array<{ it?: unknown }> } | undefined)?.placed ?? [];
    if (!placed.some((p) => p.it === bookIdOf(slug))) {
      return Response.json({ error: "방에 이 책을 놓아야 물을 수 있어요." }, { status: 403 });
    }
    if (jam < BOOK_ASK_JAM) return Response.json({ error: `잼이 ${BOOK_ASK_JAM} 있어야 물을 수 있어요.` }, { status: 402 });

    const rate = checkRate(`book:${account.uid}`);
    if (!rate.ok) return Response.json({ error: rate.error }, { status: rate.status });
    const budget = checkDailyBudget();
    if (!budget.ok) return Response.json({ error: budget.error }, { status: budget.status });

    const used = await reserve(account.uid, slug, 1);
    if (used === "unavailable") return Response.json({ error: "이 환경에는 책에게 묻기가 없어요." }, { status: 503 });
    if (used === null) return Response.json({ error: `오늘은 이 책에 ${BOOK_ASK_PER_DAY}번 다 물었어요. 내일 다시 물어 주세요.`, left: 0 }, { status: 429 });

    let answer: BookModelAnswer | null = null;
    try {
      answer = await answerFromBook(pack, question);
    } catch (error) {
      await reserve(account.uid, slug, -1).catch(() => null);
      if (error instanceof Anthropic.RateLimitError) return Response.json({ error: "요청이 몰리고 있어요. 잠시 뒤 다시 물어 주세요." }, { status: 429 });
      console.error("[book-ask] 모델 호출 실패", error);
      return Response.json({ error: "답을 불러오지 못했어요. 잼은 쓰지 않았어요." }, { status: 502 });
    }
    if (!answer) {
      await reserve(account.uid, slug, -1).catch(() => null);
      return Response.json({ error: "답을 이해하지 못했어요. 잼은 쓰지 않았어요." }, { status: 502 });
    }

    const chapters = citedChapters(pack, answer);
    return Response.json({
      grounded: answer.grounded && chapters.length > 0,
      message: answer.message,
      chapters,
      left: BOOK_ASK_PER_DAY - used,
    });
  } catch (error) {
    console.error("[book-ask] 묻지 못했다", error);
    return Response.json({ error: "답을 불러오지 못했어요. 잼은 쓰지 않았어요." }, { status: 502 });
  }
}
