import { ACHIEVEMENTS } from "@/content/achievements";
import { POLICIES } from "@/content/policies";
import type { Claim, Source } from "@/content/schema";

import { COMMON_FUNDING, COMMON_SCHEDULE, PLEDGE_SOURCE, PLEDGES_21 } from "./presidential-21";
import { pledgeSchema, type Pledge, type PledgeLine, type PledgeTrackStatus } from "./schema";

export { COMMON_FUNDING, COMMON_SCHEDULE, PLEDGE_SOURCE };
export type { Pledge, PledgeLine, PledgeTrackStatus };

/**
 * 공약 이행 추적.
 *
 * 공약 문장 하나를 셈의 단위로 삼는다. 원문의 ○ 줄 아래에 - 줄이 있으면 - 줄이
 * 단위이고, 없으면 ○ 줄 자체가 단위다. ○ 하나에 여러 약속이 들어 있는데 그중
 * 하나에 근거가 있다고 ○ 전체를 이행으로 세면 부풀린 셈이 된다.
 */

export type LineStatus = PledgeTrackStatus | "untracked";

export interface ResolvedEvidence {
  ref: string;
  /** 근거가 실린 사이트 안의 자리. */
  href: string;
  /** 「청년미래적금」처럼 근거가 실린 업적·정책의 이름. */
  label: string;
  claim: Claim;
  sources: Source[];
}

interface Bundle {
  title: string;
  href: string;
  claims: Claim[];
  sources: Source[];
}

const bundles = new Map<string, Bundle>();
for (const a of ACHIEVEMENTS) {
  bundles.set(a.slug, {
    title: a.title,
    href: `/achievement/${a.slug}`,
    claims: a.claims,
    sources: a.sources,
  });
}
for (const p of POLICIES) {
  bundles.set(`policy:${p.slug}`, {
    title: p.title,
    href: `/wiki/policy/${p.slug}`,
    claims: p.claims,
    sources: p.sources,
  });
}

/**
 * 앵커를 claim과 출처로 푼다. 없으면 던진다 — 근거를 가리킨다고 적어 놓고
 * 실제로는 아무것도 가리키지 않는 이행 표시는 화면에 오를 수 없다.
 */
export function resolveEvidence(ref: string): ResolvedEvidence {
  const [owner, claimId] = ref.split("#");
  const bundle = bundles.get(owner);
  if (!bundle) throw new Error(`공약 근거 ${ref}: 없는 업적·정책 ${owner}`);
  const claim = bundle.claims.find((c) => c.id === claimId);
  if (!claim) throw new Error(`공약 근거 ${ref}: 없는 claim ${claimId}`);
  const sourceById = new Map(bundle.sources.map((s) => [s.id, s]));
  const sources = claim.sourceIds
    .map((id) => sourceById.get(id))
    .filter((s): s is Source => Boolean(s));
  if (sources.length === 0) throw new Error(`공약 근거 ${ref}: 출처가 없다`);
  return { ref, href: bundle.href, label: `「${bundle.title}」`, claim, sources };
}

export interface ResolvedLine {
  text: string;
  status: LineStatus;
  note?: string;
  evidence?: ResolvedEvidence;
}

export interface ResolvedItem {
  text: string;
  /** subs가 비어 있으면 self가 셈의 단위다. */
  self?: ResolvedLine;
  subs: ResolvedLine[];
}

export interface StatusCount {
  done: number;
  underway: number;
  untracked: number;
  total: number;
}

export interface ResolvedPledge extends Omit<Pledge, "items"> {
  items: ResolvedItem[];
  count: StatusCount;
}

function resolveLine(line: PledgeLine): ResolvedLine {
  if (!line.track) return { text: line.text, status: "untracked" };
  return {
    text: line.text,
    status: line.track.status,
    note: line.track.note,
    evidence: resolveEvidence(line.track.ref),
  };
}

export function countLines(lines: ResolvedLine[]): StatusCount {
  const count: StatusCount = { done: 0, underway: 0, untracked: 0, total: lines.length };
  for (const line of lines) count[line.status] += 1;
  return count;
}

export function unitsOf(item: ResolvedItem): ResolvedLine[] {
  return item.self ? [item.self] : item.subs;
}

export const PLEDGES: ResolvedPledge[] = PLEDGES_21.map((input) => {
  const pledge = pledgeSchema.parse(input);
  const items: ResolvedItem[] = pledge.items.map((item) =>
    item.subs.length > 0
      ? { text: item.text, subs: item.subs.map(resolveLine) }
      : { text: item.text, self: resolveLine(item), subs: [] },
  );
  return { ...pledge, items, count: countLines(items.flatMap(unitsOf)) };
});

export function totalCount(pledges: ResolvedPledge[] = PLEDGES): StatusCount {
  return pledges.reduce<StatusCount>(
    (acc, p) => ({
      done: acc.done + p.count.done,
      underway: acc.underway + p.count.underway,
      untracked: acc.untracked + p.count.untracked,
      total: acc.total + p.count.total,
    }),
    { done: 0, underway: 0, untracked: 0, total: 0 },
  );
}

/**
 * 근거의 기준일. 이행 상태가 언제 기준인지 밝힌다 — 연결한 정책 페이지의
 * asOf 가운데 가장 늦은 날. 업적에는 asOf가 없으므로 정책만 본다.
 */
export function pledgesAsOf(): string {
  const used = new Set(
    PLEDGES.flatMap((p) => p.items.flatMap(unitsOf))
      .map((l) => l.evidence?.ref.split("#")[0])
      .filter((owner): owner is string => Boolean(owner?.startsWith("policy:"))),
  );
  return POLICIES.filter((p) => used.has(`policy:${p.slug}`))
    .map((p) => p.asOf)
    .sort()
    .at(-1) ?? "";
}
