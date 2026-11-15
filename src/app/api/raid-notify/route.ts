import { PUSH_RAID_ID, pushCopy, pushDue } from "@/features/garden/raid/push";
import { checkOrigin } from "@/lib/agent/guard";
import { claimPush, readRaidTimes, releasePush, sendToTopic } from "@/lib/server/push";

/**
 * 거대 잡초가 나타났다고 알린다 — 갓 태어난 물결을 본 화면이 부른다(features/garden/useRaid.ts).
 * 설계는 docs/garden-raid-boss.md §8.2.
 *
 * ★ 받는 것은 물결 id뿐이다. 정말 갓 태어났는지는 여기서 문서를 읽어 본다.
 * ★ 한 물결에 한 번만 보낸다. "보냈다" 표식을 먼저 만든 요청만 보내므로, 이 라우트를 아무리 두드려도
 *   알림은 물결 수(하루 다섯)를 넘지 못한다.
 */

/** 이 인스턴스가 이미 끝낸 물결. 같은 물결의 뒤따르는 요청이 Firestore까지 가지 않게. */
const done = new Set<string>();

export async function POST(request: Request) {
  const origin = checkOrigin(request);
  if (!origin.ok) return Response.json({ error: origin.error }, { status: origin.status });

  let id: unknown;
  try {
    id = ((await request.json()) as { id?: unknown }).id;
  } catch {
    return Response.json({ error: "요청을 읽지 못했어요." }, { status: 400 });
  }
  if (typeof id !== "string" || !PUSH_RAID_ID.test(id)) return Response.json({ error: "물결이 맞지 않아요." }, { status: 400 });
  if (done.has(id)) return Response.json({ sent: false });

  try {
    const raid = await readRaidTimes(id);
    if (raid === "unavailable") return Response.json({ error: "이 환경에는 알림이 없어요." }, { status: 503 });
    if (!raid || !pushDue(raid.spawnedAt, raid.defeatedAt, Date.now())) return Response.json({ sent: false });
    if (!(await claimPush(id))) {
      done.add(id);
      return Response.json({ sent: false });
    }
    if ((await sendToTopic(pushCopy(id))) !== "ok") {
      await releasePush(id);
      return Response.json({ error: "알림을 보내지 못했어요." }, { status: 502 });
    }
    done.add(id);
    return Response.json({ sent: true });
  } catch (error) {
    console.error("[raid-notify] 알리지 못했다", error);
    return Response.json({ error: "알림을 보내지 못했어요." }, { status: 502 });
  }
}
