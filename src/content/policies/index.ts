import { CHILD_ALLOWANCE } from "./child-allowance";
import { EGG_IMPORTS } from "./egg-imports";
import { FOREIGNER_HEALTH_VOTE } from "./foreigner-health-vote";
import { HOUSING_MEASURES } from "./housing-measures";
import { MIDEAST_RUMORS } from "./mideast-rumors";
import { NEW_LEAP_FUND } from "./new-leap-fund";
import { OIL_RELIEF_FUND } from "./oil-relief-fund";
import { PROSECUTION_LAUNCH } from "./prosecution-launch";
import { policySchema, type Policy } from "./schema";
import { TEEN_SUPPORT } from "./teen-support";
import { TONGTONG_POLICIES } from "./tongtong";
import { US_INVESTMENT } from "./us-investment";
import { YOUTH_JOBS } from "./youth-jobs";

/**
 * 정부 정책 팩트 목록. 새 정책은 파일을 하나 만들고 여기에 더한다.
 *
 * 위키(`/wiki/policy/<slug>`), 검색, 사이트맵, factbase가 모두 이 목록을 읽는다.
 * 스키마 검사는 모듈을 불러올 때 한 번 한다 — 틀린 정책이 있으면 빌드가 멈춘다.
 */
export const POLICIES: Policy[] = [
  OIL_RELIEF_FUND,
  HOUSING_MEASURES,
  MIDEAST_RUMORS,
  FOREIGNER_HEALTH_VOTE,
  PROSECUTION_LAUNCH,
  EGG_IMPORTS,
  NEW_LEAP_FUND,
  US_INVESTMENT,
  YOUTH_JOBS,
  CHILD_ALLOWANCE,
  TEEN_SUPPORT,
  // 통통(tt.jamtong.kr)에서 가져온 청소년·청년 정책 — pnpm policies:tongtong
  ...TONGTONG_POLICIES,
].map((policy) => policySchema.parse(policy));

export function getPolicy(slug: string): Policy | undefined {
  return POLICIES.find((policy) => policy.slug === slug);
}
