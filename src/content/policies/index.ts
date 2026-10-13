import { CASH_SUPPORT_WELFARE_FRAUD } from "./cash-support-welfare-fraud";
import { CHILD_ALLOWANCE } from "./child-allowance";
import { CHILD_BENEFITS_TOTAL } from "./child-benefits-total";
import { DELISTING_REFORM } from "./delisting-reform";
import { EGG_IMPORTS } from "./egg-imports";
import { FOREIGNER_HEALTH_VOTE } from "./foreigner-health-vote";
import { HONAM_CHIP_CLUSTER } from "./honam-chip-cluster";
import { HOUSING_LOAN_BUDGET } from "./housing-loan-budget";
import { HOUSING_MEASURES } from "./housing-measures";
import { KRW_EXCHANGE_RATE } from "./krw-exchange-rate";
import { MIDEAST_RUMORS } from "./mideast-rumors";
import { NATIONAL_DEBT } from "./national-debt";
import { NEW_LEAP_FUND } from "./new-leap-fund";
import { OIL_RELIEF_FUND } from "./oil-relief-fund";
import { PLEDGE_CHECK_2026 } from "./pledge-check-2026";
import { PROSECUTION_LAUNCH } from "./prosecution-launch";
import { RETIREMENT_PENSION } from "./retirement-pension";
import { SMALL_BUSINESS_SUPPORT } from "./small-business-support";
import { policySchema, type Policy } from "./schema";
import { TASKS_CHECK_2026 } from "./tasks-check-2026";
import { TEEN_SUPPORT } from "./teen-support";
import { TONGTONG_POLICIES } from "./tongtong";
import { TRIAL_POLICIES } from "./trials";
import { UNEMPLOYMENT_BENEFITS } from "./unemployment-benefits";
import { US_INTEL_STANDARDS } from "./us-intel-standards";
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
  RETIREMENT_PENSION,
  NATIONAL_DEBT,
  UNEMPLOYMENT_BENEFITS,
  CASH_SUPPORT_WELFARE_FRAUD,
  US_INTEL_STANDARDS,
  HONAM_CHIP_CLUSTER,
  KRW_EXCHANGE_RATE,
  DELISTING_REFORM,
  SMALL_BUSINESS_SUPPORT,
  CHILD_BENEFITS_TOTAL,
  HOUSING_LOAN_BUDGET,
  PLEDGE_CHECK_2026,
  TASKS_CHECK_2026,
  // 이재명 대통령 형사재판 다섯 건과 재판 중단 배경 — /trials 허브가 묶어 보인다
  ...TRIAL_POLICIES,
  // 통통(tt.jamtong.kr)에서 가져온 청소년·청년 정책 — pnpm policies:tongtong
  ...TONGTONG_POLICIES,
].map((policy) => policySchema.parse(policy));

export function getPolicy(slug: string): Policy | undefined {
  return POLICIES.find((policy) => policy.slug === slug);
}
