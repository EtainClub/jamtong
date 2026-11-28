/**
 * 잼공 기록 합치기 — 이 기기의 기록과 계정(Firestore users/{uid}/study/state)의 기록을 하나로. 순수 함수(study.test.ts).
 *
 * ★ 정원은 "늦게 고친 쪽이 이긴다"지만, 잼공 기록은 합칠 수 있다. 공부한 날·근거 카드·문항 상자는 어느 기기에서 했든 모두 내 것이다.
 *   두 기기에서 따로 공부해도 아무것도 사라지지 않는다.
 * ★ 상자는 "더 늦게 답한 쪽"을 고른다. 답한 날 = 다음에 물을 날 − 그 칸의 간격. 같은 날이면 낮은 칸(조심스러운 쪽).
 * ★ 설정(목표·단계·머물기)은 늦게 고친 쪽(updatedAt)을 따른다. 단계는 내려가지 않으므로 큰 쪽.
 */
import { addDays, BOX_DAYS, learned, type Box } from "./rules";
import type { StudyData } from "./store";

export function answeredOn(box: Box): string {
  return addDays(box[1], -BOX_DAYS[Math.max(1, Math.min(BOX_DAYS.length, box[0])) - 1]);
}

export function mergeBox(a: Box | undefined, b: Box | undefined): Box | undefined {
  if (!a) return b;
  if (!b) return a;
  const da = answeredOn(a);
  const db = answeredOn(b);
  if (da !== db) return da > db ? a : b;
  return a[0] <= b[0] ? a : b;
}

export function mergeStudy(local: StudyData, remote: StudyData | null): StudyData {
  if (!remote) return local;
  const newer = (remote.updatedAt ?? 0) > (local.updatedAt ?? 0) ? remote : local;
  const days: Record<string, number> = { ...remote.days };
  for (const [d, n] of Object.entries(local.days)) days[d] = Math.max(days[d] ?? 0, n);
  const boxes: Record<string, Box> = {};
  for (const id of new Set([...Object.keys(local.boxes), ...Object.keys(remote.boxes)])) {
    const box = mergeBox(local.boxes[id], remote.boxes[id]);
    if (box) boxes[id] = box;
  }
  const wallet = [...remote.wallet];
  for (const id of local.wallet) if (!wallet.includes(id)) wallet.push(id);
  return {
    ...newer,
    days,
    boxes,
    wallet,
    intro: local.intro || remote.intro,
    goalAsked: Boolean(local.goalAsked || remote.goalAsked),
    eraAsked: Boolean(local.eraAsked || remote.eraAsked),
    level: Math.max(local.level ?? 1, remote.level ?? 1) as StudyData["level"],
    // 점검 기록은 날짜로 합친다(같은 날 두 번이면 둘 다 남는다 — 드물다).
    checks: [...(remote.checks ?? []), ...(local.checks ?? []).filter((c) => !(remote.checks ?? []).some((r) => r.day === c.day && r.right === c.right && r.total === c.total))]
      .sort((a, b) => a.day.localeCompare(b.day))
      .slice(-24),
    checked: [...new Set([...(remote.checked ?? []), ...(local.checked ?? [])])],
    // 「확신했는데 틀림」은 다음에 맞히면 지운다 — 한 기기에서 지운 것을 다른 기기의 옛 표시가 되살리지 않게,
    // 합친 상자가 그날이나 그 뒤에 맞힌 것이면 뺀다.
    sureMisses: Object.fromEntries(
      Object.entries({ ...(remote.sureMisses ?? {}), ...(local.sureMisses ?? {}) }).filter(([id, day]) => !(learned(boxes[id]) && answeredOn(boxes[id]) >= day)),
    ),
    updatedAt: Math.max(local.updatedAt ?? 0, remote.updatedAt ?? 0),
  };
}

/** 키 순서와 상관없이 같은 값이면 같은 문자열. Firestore는 칸 순서를 지키지 않는다. undefined 칸은 뺀다(저장할 때처럼). */
function stable(v: unknown): string {
  if (Array.isArray(v)) return `[${v.map(stable).join(",")}]`;
  if (v && typeof v === "object")
    return `{${Object.keys(v)
      .filter((k) => (v as Record<string, unknown>)[k] !== undefined)
      .sort()
      .map((k) => `${JSON.stringify(k)}:${stable((v as Record<string, unknown>)[k])}`)
      .join(",")}}`;
  return JSON.stringify(v) ?? "null";
}

/** 두 기록이 같은가 — 합친 결과가 계정 것과 같으면 다시 쓰지 않는다. */
export function sameStudy(a: StudyData | null, b: StudyData | null): boolean {
  return stable(a) === stable(b);
}
