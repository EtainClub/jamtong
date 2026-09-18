import type { Story } from "@/content/schema";

/**
 * AI 안내 남용 방지 (설계서 43장).
 *
 * 공개된 엔드포인트는 누구나 운영자 돈으로 호출할 수 있다. 한 번에 4원이라는
 * 점이 오히려 위험하다 — 눈치채기 전에 쌓인다.
 *
 * 네 겹으로 막는다. 어느 하나도 완벽하지 않지만 겹치면 실질적인 방어가 된다.
 *   1. Origin  다른 사이트에서 부르는 스크립트를 걸러낸다
 *   2. 주제 선별  스토리와 무관한 질문은 모델을 부르지 않는다 (비용 0)
 *   3. IP 한도  한 사람이 연달아 긁는 것을 막는다
 *   4. 일일 총량  전체 지출에 천장을 둔다
 *
 * ⚠ 마지막 방어선은 코드가 아니다. Anthropic Console에서 API 키에
 *   월 지출 한도를 걸어 두는 것이 유일하게 확실한 상한이다.
 */

const IP_LIMIT = Number(process.env.ASK_IP_LIMIT ?? 20); // 1시간당
const IP_WINDOW_MS = 60 * 60 * 1000;
const DAILY_LIMIT = Number(process.env.ASK_DAILY_LIMIT ?? 500);

/**
 * 프로세스 메모리에 센다.
 *
 * 인스턴스가 여럿이면 인스턴스마다 따로 세므로 실제 한도는 배수가 된다.
 * 트래픽이 커지면 Redis 같은 공유 저장소로 바꿔야 한다 — 그때 이 파일만
 * 고치면 되도록 호출부에서 분리해 뒀다.
 */
const hits = new Map<string, number[]>();
let daily = { day: today(), count: 0 };

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

export type GuardVerdict =
  | { ok: true }
  | { ok: false; status: number; error: string; reason: string };

/** 브라우저가 우리 페이지에서 부른 요청인지 본다. */
export function checkOrigin(request: Request): GuardVerdict {
  if (process.env.NODE_ENV !== "production") return { ok: true };

  const host = request.headers.get("host");
  const source = request.headers.get("origin") ?? request.headers.get("referer");

  if (!source || !host) {
    return {
      ok: false,
      status: 403,
      error: "이 요청은 처리할 수 없습니다.",
      reason: "origin 헤더 없음",
    };
  }

  try {
    if (new URL(source).host !== host) {
      return {
        ok: false,
        status: 403,
        error: "이 요청은 처리할 수 없습니다.",
        reason: `origin 불일치 (${new URL(source).host})`,
      };
    }
  } catch {
    return {
      ok: false,
      status: 403,
      error: "이 요청은 처리할 수 없습니다.",
      reason: "origin 파싱 실패",
    };
  }

  return { ok: true };
}

export function clientKey(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  return (
    forwarded?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "unknown"
  );
}

export function checkRate(key: string): GuardVerdict {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < IP_WINDOW_MS);

  if (recent.length >= IP_LIMIT) {
    return {
      ok: false,
      status: 429,
      error: "질문이 너무 많습니다. 잠시 후 다시 시도해 주세요.",
      reason: `IP 한도 초과 (${key})`,
    };
  }

  recent.push(now);
  hits.set(key, recent);

  // 오래된 항목을 흘려보낸다. 안 그러면 Map이 계속 자란다.
  if (hits.size > 5000) {
    for (const [k, times] of hits) {
      if (times.every((t) => now - t >= IP_WINDOW_MS)) hits.delete(k);
    }
  }

  return { ok: true };
}

export function checkDailyBudget(): GuardVerdict {
  if (daily.day !== today()) daily = { day: today(), count: 0 };

  if (daily.count >= DAILY_LIMIT) {
    return {
      ok: false,
      status: 503,
      error: "오늘은 AI 안내 이용량을 모두 사용했습니다. 내일 다시 이용해 주세요.",
      reason: `일일 한도 ${DAILY_LIMIT}회 소진`,
    };
  }

  daily.count += 1;
  return { ok: true };
}

/**
 * 주제 선별 — 모델을 부르기 전에 거른다.
 *
 * 스토리에 등장하지 않는 말로만 이루어진 질문은 어차피 답할 수 없다.
 * 모델에게 물어 "모릅니다"를 받아오는 대신 여기서 끝내면 비용이 0이고,
 * 저비용 모델이 엉뚱하게 지어낼 여지도 함께 사라진다.
 *
 * 한국어는 조사가 붙으므로 어미를 조금씩 떼어 보며 맞춰 본다.
 * 느슨하게 잡는다 — 하나도 겹치지 않을 때만 막는다. 잘못 막는 쪽이
 * 잘못 통과시키는 쪽보다 사용자에게 더 나쁘다.
 */
export function buildTopicIndex(story: Story, sceneLabels: string[]): string {
  return [
    story.title,
    story.subtitle,
    story.summary,
    ...sceneLabels,
    ...story.timeline.flatMap((e) => [e.title, e.summary, e.date]),
    ...story.claims.map((c) => c.text),
    ...(story.graph?.entities.map((e) => e.name) ?? []),
    ...(story.graph?.relations.map((r) => r.label) ?? []),
    // 씬 종류마다 이름이 있는 자리가 다르다. 색인은 느슨해도 되므로 있는 것만 모은다.
    ...story.scenes.flatMap((scene) => [
      scene.heading,
      scene.lede ?? "",
      ...(scene.kind === "route-map" ? scene.routes.map((r) => r.name) : []),
      ...(scene.kind === "route-compare" ? scene.comparisons.map((c) => c.name) : []),
      ...(scene.kind === "land-use"
        ? scene.landUse.groups.map((g) => g.label)
        : []),
      ...(scene.kind === "money-flow"
        ? scene.flow.scenarios.map((sc) => `${sc.name} ${sc.summary}`)
        : []),
      ...(scene.kind === "index-series" ? [scene.series.name] : []),
    ]),
    ...story.keyNumbers.map((n) => `${n.label} ${n.caption ?? ""}`),
    ...(story.eli5?.scenes.flatMap((s) => [s.title, s.say]) ?? []),
    ...story.counterpoints.flatMap((c) => [c.question, c.response]),
  ]
    .join(" ")
    .toLowerCase();
}

/**
 * "이거 설명해줘"처럼 지금 화면을 가리키는 말.
 *
 * 스토리 본문에는 없지만 사용자가 이 화면에 대해 묻고 있다는 신호다.
 * 이걸 막으면 가장 자연스러운 질문이 거절당한다.
 */
const GENERIC_ASK = [
  "이거", "이게", "이건", "이것", "여기",
  "요약", "설명", "알려", "보여", "정리",
  "뭐야", "뭔데", "무엇", "어떻게", "왜",
];

export function isOnTopic(question: string, index: string): boolean {
  const lowered = question.toLowerCase();
  if (GENERIC_ASK.some((word) => lowered.includes(word))) return true;

  const tokens = question.toLowerCase().match(/[\p{Script=Hangul}a-z0-9]{2,}/gu) ?? [];

  for (const token of tokens) {
    // 조사·어미를 한두 글자씩 떼어 보며 맞춰 본다. ("북극항로가" → "북극항로")
    for (let cut = 0; cut <= 2 && token.length - cut >= 2; cut++) {
      if (index.includes(token.slice(0, token.length - cut))) return true;
    }
  }

  return false;
}
