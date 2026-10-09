import generated from "./tongtong.generated.json";
import type { PolicyInput } from "./schema";
import type { Rumor } from "./schema";

/**
 * 통통(tt.jamtong.kr)에서 가져온 청소년·청년 정책 항목.
 *
 * 사실(claim·출처·verified)은 `tongtong.generated.json` 그대로다 — 고칠 것은 통통에서 고치고
 * `pnpm policies:tongtong`으로 다시 가져온다. 여기서는 잼통에서만 필요한 두 가지를 더한다.
 *
 * 1. 기한 지난 사실 빼기. 통통 claim의 `validUntil`이 지나면 더는 사실이 아니다
 *    ("9월 이용분까지"). 빌드하는 날 기준으로 뺀다 — factbot이 지난 사실을 인용하지 않게.
 * 2. 도는 주장. 인스타그램에서 도는 말과 통통 claim을 잇는다. 규칙은 다른 정책과 같다 —
 *    대응하는 claim이 없는 소문은 싣지 않는다.
 */

type GeneratedClaim = PolicyInput["claims"][number] & { validUntil?: string };
type GeneratedPolicy = Omit<PolicyInput, "claims"> & { claims: GeneratedClaim[] };

const RUMORS: Record<string, Rumor[]> = {
  "youth-monthly-rent": [
    {
      id: "rumor-everyone",
      text: "만 19~34세 청년이면 누구나 월세 20만 원을 받는다",
      claimIds: ["target", "income", "quota", "cp-strict-income"],
    },
  ],
};

function today(): string {
  return new Date().toLocaleDateString("sv-SE", { timeZone: "Asia/Seoul" });
}

function withoutExpired(policy: GeneratedPolicy, now: string): PolicyInput {
  const expired = policy.claims.filter((c) => c.validUntil && c.validUntil < now);
  const gone = new Set(expired.map((c) => c.id));
  const claims = policy.claims
    .filter((c) => !gone.has(c.id))
    .map((c) => {
      const claim = { ...c };
      delete claim.validUntil;
      return claim;
    });
  return {
    ...policy,
    claims,
    critiqueIds: (policy.critiqueIds ?? []).filter((id) => !gone.has(id)),
    timeline: (policy.timeline ?? []).map((e) => ({ ...e, claimIds: (e.claimIds ?? []).filter((id) => !gone.has(id)) })),
    rumors: RUMORS[policy.slug] ?? [],
  };
}

export const TONGTONG_POLICIES: PolicyInput[] = (generated as GeneratedPolicy[]).map((policy) =>
  withoutExpired(policy, today()),
);
