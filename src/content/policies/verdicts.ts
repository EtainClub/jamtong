import { z } from "zod";

import type { Claim } from "../schema";
import type { Policy } from "./schema";

/**
 * 도는 말 판정 — 정책의 `rumors`(SNS에서 도는 주장)마다 하나. docs/jamgong-roadmap.md R5.
 *
 * ★ **사람이 승인한 판정만 밖으로 나간다.** 위키 정책 페이지와 잼공은 `approved`가 있는 판정만 보인다.
 *   에이전트는 `value`·`note` 초안만 쓰고 `approved`는 비워 둔다 — AGENTS.md "정부 정책 팩트". 승인은 운영자가
 *   `pnpm study:verdicts --approve <열쇠…>`로 하거나 PR에서 날짜를 적는다.
 * ★ **판정은 근거보다 세게 말하지 않는다.** 판정은 그 도는 말에 이어진 claim만으로 설명한다.
 *   - 「사실·일부 사실·사실과 다름」은 이어진 근거에 확인된 FACT가 하나는 있어야 한다.
 *   - 근거가 부처 해명(CLAIM)뿐이면 「정부 해명만 있음」이다. 부처가 "아니다"라고 한 것은 "사실 아님"의 근거가 아니다.
 *   - 근거에 확인 전(verified: false) claim이 섞이면 「확인 불가」다. 다시 확인해서 검증되면 올린다.
 *   validateVerdicts가 이 규칙을 본다.
 * ★ **사실을 말하는 주장에만 판정한다.** rumors에는 요청("~해 달라")·의견("~해야 한다", "한심하다")·질문도 섞여 있다.
 *   그런 것은 맞다·틀리다가 없으니 판정을 두지 않는다. 질문이라도 주장을 품은 것("~가석방됐다는 소문이 사실인가")은 판정한다.
 * ★ 판정을 정책 파일의 rumors에 두지 않고 여기 모은다 — 통통에서 가져온 정책은 스냅샷이라 손으로 고칠 수 없고,
 *   운영자가 한곳에서 읽고 승인하기 쉽다.
 */
export const VerdictValue = z.enum(["true", "partly", "false", "official-only", "unknown"]);
export type VerdictValue = z.infer<typeof VerdictValue>;

export const VERDICT_LABEL: Record<VerdictValue, string> = {
  true: "사실이에요",
  partly: "일부만 맞아요",
  false: "사실과 달라요",
  "official-only": "정부 해명만 있어요",
  unknown: "아직 확인할 수 없어요",
};

export const verdictSchema = z.object({
  value: VerdictValue,
  /** 이어진 claim만으로 쓴 한두 문장. 화면에 판정 옆에 붙는다. */
  note: z.string().min(10).max(220),
  /** 초안을 쓴 날. */
  drafted: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  /** 사람이 승인한 날. 없으면 밖에 나가지 않는다. **에이전트는 이 칸을 쓰지 않는다.** */
  approved: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
});
export type Verdict = z.infer<typeof verdictSchema>;

/** 열쇠 `<정책 slug>#<도는 말 id>` → 판정. */
export const VERDICTS: Record<string, Verdict> = {
  "oil-relief-fund#rumor-everyone": { value: "false", note: "대상은 소득 하위 70%이며 재산·금융소득에 따른 제외 기준도 있다. 지급액도 지역과 계층에 따라 달라 전 국민에게 같은 금액을 주는 제도가 아니다.", drafted: "2026-11-28", approved: "2026-11-28" },
  "oil-relief-fund#rumor-still-usable": { value: "false", note: "신청은 2026년 7월 3일, 이의신청은 7월 17일에 마감됐고 행정안전부는 기한 안에 신청하지 않으면 받을 수 없다고 안내했다. 사용기한도 8월 31일로 끝나 남은 금액은 소멸됐다.", drafted: "2026-11-28", approved: "2026-11-28" },
  "oil-relief-fund#rumor-newborn": { value: "partly", note: "미성년 자녀 몫도 지급됐지만, 기준일 뒤 출생했다고 자동으로 제외되는 것은 아니다. 3월 30일 이후 출생 등 가족관계 변동은 이의신청으로 반영을 요청하는 구조였다.", drafted: "2026-11-28", approved: "2026-11-28" },
  "housing-measures#rumor-secret-plan": { value: "official-only", note: "국토교통부·재정경제부·금융위원회는 인터넷에 도는 부동산 종합대책이 사실무근이라고 밝혔다. 제시된 근거는 관계 부처의 해명이다.", drafted: "2026-11-28", approved: "2026-11-28" },
  "housing-measures#rumor-renewal": { value: "official-only", note: "대통령은 세입자의 계약갱신청구권이 그대로 유지된다고 말했다. 국토교통부 제1차관도 해당 보도가 사실이 아니며 세입자는 법으로 보호된다고 설명했다.", drafted: "2026-11-28", approved: "2026-11-28" },
  "mideast-rumors#rumor-dollar": { value: "official-only", note: "재정경제부는 달러 강제 매각 주장이 논의된 바 없다고 밝혔다. 관련 글에 대한 수사 사실은 확인되지만, 정책 내용에 대한 반박은 정부 설명이다.", drafted: "2026-11-28", approved: "2026-11-28" },
  "mideast-rumors#rumor-oil-nk": { value: "official-only", note: "산업통상부는 원유의 북한 유입 의혹이 사실이 아니라고 밝혔다. 해외 기업 사이의 원유 매매는 확인되지만 북한 유입 여부에 대한 반박은 부처 해명이다.", drafted: "2026-11-28", approved: "2026-11-28" },
  "foreigner-health-vote#rumor-health-freeride": { value: "partly", note: "중국 국적 가입자는 2025년 낸 보험료보다 받은 급여가 많아 409억 원 적자였다. 그러나 외국인 가입자 전체는 같은 해 1조 128억 원 흑자였고, 중국인 때문에 건보 재정이 적자라는 근거는 없다.", drafted: "2026-11-28", approved: "2026-11-28" },
  "foreigner-health-vote#rumor-vote-visa": { value: "false", note: "외국인은 영주권 취득 후 3년이 지난 만 18세 이상에게 지방선거 투표권만 주어진다. 제시된 중국 국적 유권자 수 역시 80만 명에 미치지 못한다.", drafted: "2026-11-28", approved: "2026-11-28" },
  "prosecution-launch#rumor-not-launched": { value: "false", note: "2026년 10월 2일 검찰청이 폐지되고 중수청과 공소청이 출범했다. 두 기관의 출범식도 열려 설치가 무산됐다는 주장과 다르다.", drafted: "2026-11-28", approved: "2026-11-28" },
  "prosecution-launch#rumor-fully-running": { value: "false", note: "중수청 출범일까지 임용된 인원은 정원의 66.1%였다. 청장 없이 출범한 사실도 확인돼 정원을 모두 갖추고 출범했다는 주장과 다르다.", drafted: "2026-11-28", approved: "2026-11-28" },
  "egg-imports#rumor-39000-to-4980": { value: "partly", note: "한 판 4,980원 판매와 국고 투입은 확인된다. 다만 국감 자료 분석에서 제시한 39,000원은 브라질산 원가이며, 물량 대부분은 미국산이라고 제시돼 있다.", drafted: "2026-11-28", approved: "2026-11-28" },
  "egg-imports#rumor-diplomacy": { value: "official-only", note: "김용태 의원은 외교 성과를 위한 수입 의혹을 제기했다. 농식품부는 외교 일정과 무관한 공급선 다변화였다고 설명했으며, 동기를 독립적으로 확인한 근거는 없다.", drafted: "2026-11-28", approved: "2026-11-28" },
  "egg-imports#rumor-44000": { value: "true", note: "aT 정산 자료와 농식품부 설명자료의 브라질산 계란 최종 수입단가는 30개 기준 4만 3,923원이다. 이를 반올림한 약 44,000원은 제시된 근거와 맞는다.", drafted: "2026-11-28", approved: "2026-11-28" },
  "new-leap-fund#rumor-all-forgiven": { value: "false", note: "새도약기금은 장기 연체기간과 채권 금액에 따른 매입 조건이 있다. 매입 채권도 소득·재산 조건에 따라 소각하거나 채무조정하므로 모든 빚을 탕감하는 제도가 아니다.", drafted: "2026-11-28", approved: "2026-11-28" },
  "new-leap-fund#rumor-foreigners": { value: "false", note: "외국인 채권은 새도약기금의 매입 대상에서 제외된다. 정부와 금융권이 재원을 내지만 외국인 빚까지 탕감한다는 내용은 근거와 다르다.", drafted: "2026-11-28", approved: "2026-11-28" },
  "new-leap-fund#rumor-rich": { value: "official-only", note: "금융위원회는 소득을 절대 기준으로 심사해 고소득자가 원천 배제되고, 가상자산 보유를 확인하려고 고친 신용정보법이 2026년 8월 13일 시행됐다고 설명했다. 실제 수혜자를 따로 검증한 자료는 없다.", drafted: "2026-11-28", approved: "2026-11-28" },
  "us-investment#rumor-per-capita": { value: "partly", note: "대미투자 합의는 현금 투자와 기업 주도 조선 협력으로 나뉜다. 구윤철 부총리는 원리금을 회수하는 투자이며 운용 수익 등을 재원으로 쓴다고 설명해, 전액을 국민 세금으로 준다는 설명은 과장됐다.", drafted: "2026-11-28", approved: "2026-11-28" },
  "us-investment#rumor-no-return": { value: "false", note: "합의에는 원리금 회수가 보장되는 사업과 수익 배분 조건이 있다. 예외적 투자 허용 조항은 있지만 아무것도 돌려받지 못하도록 정한 합의는 아니다.", drafted: "2026-11-28", approved: "2026-11-28" },
  "youth-jobs#rumor-paid-to-rest": { value: "false", note: "청년 구직촉진수당은 소득 기준과 교육 수료 등 구직 과제 이행이 필요하다. 일 경험 요건 폐지 발표가 쉬기만 해도 수당을 받는다는 뜻은 아니다.", drafted: "2026-11-28", approved: "2026-11-28" },
  "youth-jobs#rumor-quit-benefit": { value: "false", note: "자발적 이직 청년에게 구직급여를 주는 방안은 법 개정 전 추진 단계다. 제시된 근거는 현재 그 방안으로 급여를 받을 수 없다고 명시한다.", drafted: "2026-11-28", approved: "2026-11-28" },
  "child-allowance#rumor-13-now": { value: "false", note: "2026년 아동수당 지급 대상은 만 9세 미만이다. 만 13세 미만으로 확대되는 시점은 2030년이므로 올해부터 모두 지급한다는 주장과 다르다.", drafted: "2026-11-28", approved: "2026-11-28" },
  "retirement-pension#rumor-lump-sum-abolished": { value: "official-only", note: "고용노동부는 퇴직연금 의무화 뒤에도 기존 일시금 수령이 보장된다고 밝혔다. 법안은 논의 중이며 일시금 수령 보장에 대한 근거는 부처 설명이다.", drafted: "2026-11-28", approved: "2026-11-28" },
  "retirement-pension#rumor-government-holds": { value: "official-only", note: "고용노동부는 일시금 수령 방식이 유지된다고 설명했다. 기금형과 기존 계약형을 병행하기로 했고 운용 주체도 여러 의원안에서 달라 정부가 일괄 관리한다고 확정된 상황은 아니다.", drafted: "2026-11-28", approved: "2026-11-28" },
  "national-debt#rumor-spend-all": { value: "unknown", note: "적자국채 편성과 국가채무 증가 전망은 제시돼 있다. 그러나 세금을 모두 소진하고 빚만 늘린다는 포괄적 평가는 이 자료만으로 확인할 수 없다.", drafted: "2026-11-28", approved: "2026-11-28" },
  "national-debt#rumor-110-every-year": { value: "partly", note: "110조 원은 2026년 예산안의 적자국채 규모다. 과거 중기계획에 채무 증가 전망이 있었지만 매년 똑같이 110조 원을 빌리겠다는 확정 선언으로 볼 근거는 없다.", drafted: "2026-11-28", approved: "2026-11-28" },
  "national-debt#rumor-2000": { value: "unknown", note: "정부 국가재정운용계획은 2030년 국가채무를 1,734.1조 원으로 전망했다. 임기 말 채무가 2,000조 원이 될지는 추계의 문제라 지금 확정할 수 없다.", drafted: "2026-11-28", approved: "2026-11-28" },
  "national-debt#rumor-per-capita": { value: "unknown", note: "제시된 계산은 정부 채무와 정부·가계·기업을 합친 총부채를 구분한다. 국민 1인당 1억 3,000만 원이 정부의 국가부채라는 주장은 확인되지 않는다.", drafted: "2026-11-28", approved: "2026-11-28" },
  "national-debt#rumor-imf-warning": { value: "unknown", note: "IMF 이사회는 2025년 11월 연례협의에서 당시의 확장 재정을 환영하면서, 성장이 잠재 수준으로 돌아오면 재정 건전화를 재개하라고 권고했다. '2030년부터 반드시 중단하라'는 시한은 발표문에서 찾지 못했다.", drafted: "2026-11-28", approved: "2026-11-28" },
  "national-debt#rumor-hidden-181": { value: "unknown", note: "정부가 국가채무·일반정부부채·공공부문 부채를 매년 공개한 사실은 확인된다. 181%는 박수영 의원의 별도 합산 주장으로, 숨겨진 정부 부채라는 점은 확인되지 않는다.", drafted: "2026-11-28", approved: "2026-11-28" },
  "national-debt#rumor-imf-63": { value: "unknown", note: "IMF는 2026년 4월 재정모니터에서 한국의 2031년 일반정부부채 비율을 63.1%로 전망했다. 10월에는 51.3%로 낮췄고 이어 낸 수정치는 49.7%이며, 모두 전망치다.", drafted: "2026-11-28", approved: "2026-11-28" },
  "unemployment-benefits#rumor-voluntary": { value: "true", note: "근로조건 저하 등이 이직 전 1년 안에 2개월 이상 발생해 정당한 이직 사유로 인정되면 자진 퇴사도 수급할 수 있다. 단순히 임금이 한 번 깎였다고 자동으로 해당하지는 않는다.", drafted: "2026-11-28", approved: "2026-11-28" },
  "unemployment-benefits#rumor-repeat-tripled": { value: "true", note: "고용노동부 제출 자료의 반복 수급자 지급액은 2016년 2,179억 원에서 2025년 5,998억 원으로 늘었다. 소문에 제시된 금액과 증가 규모가 근거와 맞는다.", drafted: "2026-11-28", approved: "2026-11-28" },
  "unemployment-benefits#rumor-overhaul": { value: "true", note: "고용노동부는 고용보험위원회에서 제도 개편 방안을 확정했다. 다만 제시된 근거상 법 개정 전이어서 확정안이 곧바로 시행된 것은 아니다.", drafted: "2026-11-28", approved: "2026-11-28" },
  "cash-support-welfare-fraud#rumor-vote-buying": { value: "unknown", note: "소비쿠폰 지급과 추경 재원, 국가채무 증가 수치는 확인된다. 그러나 표를 얻으려는 목적이었는지와 지출이 과도했는지는 제시된 사실만으로 확인되지 않는다.", drafted: "2026-11-28", approved: "2026-11-28" },
  "cash-support-welfare-fraud#rumor-tax-workers": { value: "unknown", note: "소비쿠폰은 취업 여부와 무관하게 지급됐고 생계급여에는 소득 기준과 근로 유인 장치가 있다. 일하는 사람에게만 걷어 일하지 않는 사람에게만 준다는 구조는 확인되지 않는다.", drafted: "2026-11-28", approved: "2026-11-28" },
  "cash-support-welfare-fraud#rumor-fraud-many": { value: "unknown", note: "생계급여 부정수급 환수 결정액이 증가한 사실은 확인된다. 그러나 급여 때문에 일을 더 하지 않게 됐는지와 그런 부정수급자의 규모는 확인되지 않는다.", drafted: "2026-11-28", approved: "2026-11-28" },
  "us-intel-standards#rumor-ultimatum": { value: "false", note: "발언은 익명의 미국 행정부 당국자가 언론 질의에 답한 것으로 백악관의 공식 서한이나 성명이 아니었다. 기한이나 불이행 시 조치도 제시되지 않았다.", drafted: "2026-11-28", approved: "2026-11-28" },
  "us-intel-standards#rumor-nis-excluded": { value: "partly", note: "국정원이 해당 한미일 회의에 불참한 사실은 확인된다. 다만 미국 요구에 따른 배제라는 설명은 소식통 인용 보도이며 미국 정부가 요청 여부를 확인하지 않았다.", drafted: "2026-11-28", approved: "2026-11-28" },
  "us-intel-standards#rumor-congress-warning": { value: "partly", note: "물레나르 위원장이 한국의 대중국 입장 변화를 비판한 서한을 보냈다는 내용이다. 위원회나 하원 전체의 결의가 아니라 위원장 개인 명의의 서한이다.", drafted: "2026-11-28", approved: "2026-11-28" },
  "honam-chip-cluster#rumor-pressure": { value: "unknown", note: "광주 군공항을 부지로 정한 사실은 확인된다. 산업통상부는 기업의 자발적 결정이라고 설명하고 의원 측은 의혹을 제기했지만, 압박 여부는 확인되지 않는다.", drafted: "2026-11-28", approved: "2026-11-28" },
  "krw-exchange-rate#rumor-fiscal-crash": { value: "unknown", note: "원화 약세와 이후 환율 하락은 확인된다. 다만 제시된 근거에는 확장재정이 환율 급등을 일으켰다는 인과관계를 확인한 분석이 없다.", drafted: "2026-11-28", approved: "2026-11-28" },
  "delisting-reform#rumor-45-days": { value: "partly", note: "상장폐지 요건은 관리종목 지정 뒤 90거래일 안에 연속 45거래일 동안 시가총액 기준을 회복·유지하지 못하는 경우다. 연속 45일 미달이면 즉시 폐지된다는 설명은 정확하지 않다.", drafted: "2026-11-28", approved: "2026-11-28" },
  "delisting-reform#rumor-task-force": { value: "true", note: "권대영 금융위원회 부위원장은 2026년 2월 12일 상장폐지 집중관리단을 꾸려 2027년 6월까지 집중관리기간을 운영한다고 밝혔다. 주가 1,000원 미만 동전주 상장폐지 요건도 새로 생겼다.", drafted: "2026-11-28", approved: "2026-11-28" },
  "small-business-support#rumor-30": { value: "partly", note: "배달·택배비 지원은 최대 30만 원이지만 카드 사용 실적이 조건은 아니다. 카드 소비 증가분을 환급하는 상생페이백과 자영업자 지원을 섞은 주장이다.", drafted: "2026-11-28", approved: "2026-11-28" },
  "small-business-support#rumor-2600": { value: "unknown", note: "제시된 근거에서 소상공인에게 2,600만 원을 지원금으로 지급하는 사업은 확인되지 않는다. 비즈플러스카드 한도는 갚아야 하는 신용 이용액이다.", drafted: "2026-11-28", approved: "2026-11-28" },
  "small-business-support#rumor-record": { value: "unknown", note: "부담경감 크레딧 등 관련 지원의 예산 규모는 제시돼 있다. 그러나 과거 정부 지원과 같은 기준으로 비교한 자료가 없어 역대 최대인지는 확인되지 않는다.", drafted: "2026-11-28", approved: "2026-11-28" },
  "child-benefits-total#rumor-renewed": { value: "partly", note: "우리아이자립펀드는 현 정부가 발표한 새 제도다. 그러나 육아휴직급여·배우자 출산휴가 개편과 첫만남이용권 확대는 이전 정부 때 추진되거나 시행됐다.", drafted: "2026-11-28", approved: "2026-11-28" },
  "child-benefits-total#rumor-voucher-local": { value: "unknown", note: "첫만남이용권은 첫째 200만 원, 둘째 이상 300만 원의 카드 바우처다. 지역화폐 50만 원을 추가하는 전국 공통 증액은 제시된 공식 안내에서 확인되지 않는다.", drafted: "2026-11-28", approved: "2026-11-28" },
  "child-benefits-total#rumor-60m": { value: "unknown", note: "자립펀드 만기 추정액에는 부모 납입금과 가정한 투자수익이 포함된다. 제시된 제도만으로 모든 자녀의 체감 혜택이 6,000만 원 이상이라는 합계는 확인되지 않는다.", drafted: "2026-11-28", approved: "2026-11-28" },
  "child-benefits-total#rumor-300m": { value: "unknown", note: "제시된 지원 합산 설명에서 한 자녀당 최대 3억 원이라는 정부 발표는 확인되지 않는다. 기존 제도와 국회 확정 전 예산안이 함께 제시돼 있어 일괄 수령액으로 볼 수 없다.", drafted: "2026-11-28", approved: "2026-11-28" },
  "housing-loan-budget#rumor-cut-3tn": { value: "partly", note: "디딤돌·버팀목 등에 쓰는 주택도시기금 재원은 14조 원에서 10.3조 원으로 줄었다. 다만 은행 재원을 쓰는 이차보전 예산은 늘어, 대출 자체가 3조 원 넘게 줄었다고 볼 수는 없다.", drafted: "2026-11-28", approved: "2026-11-28" },
  "housing-loan-budget#rumor-almost-all": { value: "partly", note: "기금 재원 감소는 확인되지만 이를 정책대출 전체의 삭감과 같게 볼 수 없다. 국토교통부는 은행 재원과 이차보전 방식으로 대출 공급이 가능하다고 설명했다.", drafted: "2026-11-28", approved: "2026-11-28" },
  "korea-japan-evacuation#rumor-mou-signed": { value: "partly", note: "윤석열 정부 때인 2024년 9월 6일 한일은 제3국 재외국민보호 협력 각서를 교환했고 같은 날 발효됐다. 다만 서명한 사람은 대통령이 아니라 양국 외교장관이다.", drafted: "2026-11-28", approved: "2026-11-28" },
  "korea-japan-evacuation#rumor-joint": { value: "partly", note: "한국 군 수송기에 일본인이, 일본 전세기에 한국인이 탑승한 사실은 확인된다. 다만 일본 측 항공편은 군 수송기가 아니라 전세기였다.", drafted: "2026-11-28", approved: "2026-11-28" },
  "korea-japan-evacuation#rumor-thanks-to-mou": { value: "partly", note: "한일 각서는 대피 협력의 근거로 활용됐다. 그러나 한국인 204명은 한국 공군 수송기로 귀국했고 각서 이전에도 상호 대피 지원이 있어 각서만의 성과로 볼 수 없다.", drafted: "2026-11-28", approved: "2026-11-28" },
  "coupang-dispute#rumor-26h": { value: "true", note: "쿠팡 임시대표는 두 차례 각각 약 12시간과 14시간 조사를 받았다. 합계 약 26시간이며 산업재해 은폐 의혹으로 추가 소환될 수 있다는 보도도 제시돼 있다.", drafted: "2026-11-28", approved: "2026-11-28" },
  "coupang-dispute#rumor-hearing": { value: "partly", note: "로저스 대표가 미국 하원 법사위의 증언청취에 참여한 사실은 확인된다. 다만 공개 청문회가 아니라 의원 없이 변호사와 보좌관이 진행한 비공개 절차였다.", drafted: "2026-11-28", approved: "2026-11-28" },
  "coupang-dispute#rumor-338": { value: "true", note: "제시된 근거에 따르면 338조는 차별적 무역 행위를 근거로 최대 50% 관세를 허용하며 기한 제한이 없다. 한국에 실제 발동했다는 발표와는 구분해야 한다.", drafted: "2026-11-28", approved: "2026-11-28" },
  "labor-union-policy#rumor-disclosure-what": { value: "true", note: "노조 회계공시는 직전 회계연도의 결산결과를 정부 공시시스템에 공개하는 제도다. 해당 노조의 미공시는 조합비 세액공제 제한으로 연결된다.", drafted: "2026-11-28", approved: "2026-11-28" },
  "labor-union-policy#rumor-tax-credit": { value: "true", note: "미공시 시 조합비 세액공제를 받지 못하게 한 뒤 한국노총과 민주노총이 공시에 응하기로 했다. 다만 상급단체 미공시와 산하 조합원 공제를 연동하는 규정은 개정이 추진됐다.", drafted: "2026-11-28", approved: "2026-11-28" },
  "labor-union-policy#rumor-no-sanction": { value: "partly", note: "노란봉투법 공포·시행은 확인된다. 그러나 폭력·파괴 쟁의행위를 금지하고 처벌하는 조항은 유지됐으므로 국가가 제지할 법적 수단을 없앴다는 내용은 다르다.", drafted: "2026-11-28", approved: "2026-11-28" },
  "labor-union-policy#rumor-decree": { value: "unknown", note: "시행령은 교섭창구 단일화를 유지하면서 교섭단위 분리 장치를 뒀다. 노동계는 교섭권 제약을 우려하고 노동부 장관은 분쟁 예방 장치라고 설명해, 법을 무력화했다는 결론은 확인되지 않는다.", drafted: "2026-11-28", approved: "2026-11-28" },
  "consumption-coupon#rumor-admitted-low": { value: "official-only", note: "기획재정부는 KDI 분석을 공개하며 소비쿠폰 효과가 있었다고 설명했다. 분석의 한계를 밝힌 사실은 있으나 낮은 효과를 인정했다는 내용은 제시된 정부 설명에서 확인되지 않는다.", drafted: "2026-11-28", approved: "2026-11-28" },
  "single-stock-leverage-etf#rumor-no-responsibility": { value: "unknown", note: "추가 상장 중단과 예탁금 인상, 금융위원장 사과는 확인된다. 그 조치가 책임을 다한 것인지는 이 사실만으로 판정할 수 없다.", drafted: "2026-11-28", approved: "2026-11-28" },
  "hybe-investigation#rumor-leniency": { value: "unknown", note: "방시혁 의장에 대한 불구속 송치와 추징보전 결정은 확인된다. 정부 인사의 하이브 방문이나 수사 봐주기를 입증하는 근거는 제시되지 않았다.", drafted: "2026-11-28", approved: "2026-11-28" },
  "oil-price-cap#rumor-taxpayers": { value: "partly", note: "손실 보전에는 일반 재정이 투입돼 비운전자도 부담을 나눈다. 다만 상한 대상에는 화물·버스용 경유와 난방용 등유도 있어 혜택이 자가용 운전자에게만 가는 것은 아니다.", drafted: "2026-11-28", approved: "2026-11-28" },
  "housing-pledge-vs-policy#rumor-reversed": { value: "partly", note: "후보 시절 세금으로 집값을 잡지 않겠다는 발언과 고가·비거주 주택 세제 인상안 사이에는 방향 차이가 있다. 다만 공급·공공임대 확대는 이어져 정책 전체가 반대로 바뀐 것은 아니다.", drafted: "2026-11-28", approved: "2026-11-28" },
  "supporter-conflict#rumor-changed": { value: "unknown", note: "지지율 하락과 정책 관련 부정 평가 이유는 확인된다. 그러나 초심을 잃었다는 평가는 이 자료로 확인할 수 없으며 개인별 지지 철회 이유도 단정할 수 없다.", drafted: "2026-11-28", approved: "2026-11-28" },
  "humidifier-disinfectant-decree#rumor-burden": { value: "unknown", note: "피해자단체는 시행령이 인과관계 추정을 약화하고 입증 부담을 키운다고 비판했다. 시행령 시행 사실은 확인되지만 실제로 법 조항을 무력화했는지는 제시된 근거만으로 확인되지 않는다.", drafted: "2026-11-28", approved: "2026-11-28" },
  "prosecution-reform-statements#rumor-inconsistent": { value: "partly", note: "보완수사권에 관한 대통령 발언에는 시기별 차이가 있다. 그러나 중수청을 행안부에 둔다는 설명은 국정과제와 이후 발언에서 일관돼 그 부분까지 어긋난다는 주장은 다르다.", drafted: "2026-11-28", approved: "2026-11-28" },
  "ktv-video-reuse#rumor-music": { value: "partly", note: "대통령은 저작권 음원이 든 영상을 민간이 재게시하면 수익이 권리자에게 갈 수 있다고 설명했다. 다만 나누리 포털에는 재가공 가능한 클린본도 제공된다.", drafted: "2026-11-28", approved: "2026-11-28" },
  "nps-fund-2026#rumor-fx-defense": { value: "true", note: "외환당국과 국민연금은 외환스와프를 연장했고 전략적 환헤지 한도도 높였다. 환율 급등기에 국민연금이 선물환 매도에 나선 사실도 제시돼 있다.", drafted: "2026-11-28", approved: "2026-11-28" },
  "nps-fund-2026#rumor-rebalancing": { value: "partly", note: "기금운용위원회가 국내주식 리밸런싱을 한시 유예한 사실은 확인된다. 다만 김성주 이사장은 정부 주문이 그대로 통과된 적 없다고 설명해, 정부의 증시 부양 지시가 원인이었는지는 확인되지 않는다.", drafted: "2026-11-28", approved: "2026-11-28" },
  "nps-fund-2026#rumor-182": { value: "partly", note: "182조 원·35.3% 감소는 국민연금이 지분 5% 이상을 공시한 상장사 주식 평가액의 변화다. 기금 전체가 그 비율로 줄거나 같은 액수의 매각 손실이 확정됐다는 뜻은 아니다.", drafted: "2026-11-28", approved: "2026-11-28" },
  "nps-fund-2026#rumor-minutes": { value: "true", note: "국민연금법은 시장 안정에 영향을 줄 우려가 있는 안건의 회의록을 의결로 4년 뒤 공개할 수 있게 한다. 국내주식 목표비중 관련 회의록은 이 예외로 2030년 공개하기로 했다.", drafted: "2026-11-28", approved: "2026-11-28" },
  "nps-fund-2026#rumor-pension-risk": { value: "partly", note: "국민연금의 외환스와프와 환헤지 확대, 선물환 매도는 확인된다. 그러나 비용·손익이 공개되지 않아 그 조치로 장래 연금 지급이 위험해졌는지는 확인되지 않는다.", drafted: "2026-11-28", approved: "2026-11-28" },
  "ukraine-pow-dispute#rumor-ignore-pow": { value: "false", note: "북한군 포로 문제를 외교 회담에서 다룬 사실과 포로들이 한국에 온 사실이 확인된다. 포로 문제를 외면했다는 주장은 이 사실들과 다르다.", drafted: "2026-11-28", approved: "2026-11-28" },
  "ukraine-pow-dispute#rumor-recall": { value: "partly", note: "주우크라이나 대사 소환과 외교 갈등은 확인된다. 다만 정부는 비공개 합의 위반을 이유로 들었고 야권은 북한 눈치를 비판해, 북한을 의식한 동기까지 확인된 것은 아니다.", drafted: "2026-11-28", approved: "2026-11-28" },
  "pyongyang-drone-trial#rumor-treason": { value: "true", note: "평양 무인기 작전에 대해 1심에서 일반이적죄 관련 유죄 판단과 형 선고가 있었다. 항소심이 진행 중이어서 확정판결과는 구분해야 한다.", drafted: "2026-11-28", approved: "2026-11-28" },
  "dmz-mine-2026#rumor-no-action": { value: "false", note: "군은 현장조사와 감정을 거쳐 지뢰지대를 제거하고 북한에 사과와 제거를 요구했다. 국회 결의안도 채택돼 아무 조치도 없었다는 주장과 다르다.", drafted: "2026-11-28", approved: "2026-11-28" },
  "dmz-mine-2026#rumor-compensation": { value: "partly", note: "제시된 보상 분석은 전상 인정과 특정 장애등급을 전제로 약 8,925만 원 등을 계산했다. 다만 실제 등급·금액은 심사에 달렸고 장애보상금과 상이연금은 퇴직 이후 지급된다.", drafted: "2026-11-28", approved: "2026-11-28" },
  "china-group-visa-free#rumor-discussing": { value: "partly", note: "중국 단체관광객 무비자 제도는 논의를 넘어 시행됐고 연장됐다. 지정 여행사가 모집한 단체가 대상이므로 중국인 전체에 대한 일반적 무비자 입국과는 다르다.", drafted: "2026-11-28", approved: "2026-11-28" },
  "china-group-visa-free#rumor-crime": { value: "unknown", note: "대상 단체와 사전 명단 점검, 여행사 제재 기준은 확인된다. 제주 불법체류 수치만으로 별도 단체관광 무비자 제도가 범죄 증가를 일으켰는지는 확인되지 않는다.", drafted: "2026-11-28", approved: "2026-11-28" },
  "supplementary-budget#rumor-again": { value: "partly", note: "정부 추경이 국회에서 처리된 사실은 확인된다. 다만 추가 추경에 대해서는 검토 단계가 아니라고 밝혔고 초과세수 활용처도 미확정이라, 새 추경 추진이 확정된 것은 아니다.", drafted: "2026-11-28", approved: "2026-11-28" },
  "supplementary-budget#rumor-election": { value: "partly", note: "지방선거 전에 지원금을 포함한 추경안이 의결된 것은 확인된다. 정부·여당은 전쟁 대응이라고 설명하고 야당은 선거용이라고 비판해 선거 목적까지 확인된 것은 아니다.", drafted: "2026-11-28", approved: "2026-11-28" },
  "nk-medical-aid#rumor-93": { value: "partly", note: "정부가 약 93억 원 규모 의료장비 지원 계획을 세운 사실은 확인된다. 현금 지급이 아니며 북측 수령 의사와 실제 발송이 확인된 집행 완료 사업도 아니다.", drafted: "2026-11-28", approved: "2026-11-28" },
  "nk-medical-aid#rumor-russia-nk": { value: "unknown", note: "북한 병원 의료장비 지원 계획은 제시됐지만 실제 발송 여부는 확인되지 않는다. 대통령이 러시아와 북한에 돈을 보냈다는 송금 사실은 근거에 없다.", drafted: "2026-11-28", approved: "2026-11-28" },
  "national-security-act-repeal#rumor-proposed": { value: "true", note: "국가보안법 폐지법률안은 의원들이 발의해 법제사법위원회에 회부됐다. 정부 제출안이나 폐지 확정이 아니라 위원회 심사 단계의 의원안이다.", drafted: "2026-11-28", approved: "2026-11-28" },
  "fishermen-repatriation-2019#rumor-repatriation": { value: "true", note: "문재인 정부는 보호를 서면 요청한 북한 어민들을 북한으로 돌려보냈다. 항소심 재판부도 귀순 의사에 반한 강제북송이 위법하다고 판단했다.", drafted: "2026-11-28", approved: "2026-11-28" },
  "president-field-visits#rumor-showing-off": { value: "unknown", note: "대통령의 시장 방문뿐 아니라 주택 공급 현장 점검도 확인된다. 행사만 다녔는지, 방문이 보여 주기였는지와 투입 비용의 적정성은 자료만으로 확인되지 않는다.", drafted: "2026-11-28", approved: "2026-11-28" },
  "president-field-visits#rumor-security": { value: "unknown", note: "대통령이 초등학교 운동회 경기와 급식에 참여한 사실은 확인된다. 그러나 경호 방식 때문에 행사가 방해됐다는 구체적 사실은 제시되지 않았다.", drafted: "2026-11-28", approved: "2026-11-28" },
  "daycare-priority#rumor-pushed-back": { value: "partly", note: "다문화가족은 어린이집 입소 1순위 중 하나지만 맞벌이·다자녀 등도 같은 순위다. 다문화 자녀도 한국 국적인 경우가 많아 한국 아이 전체와 대립시키는 설명은 부정확하다.", drafted: "2026-11-28", approved: "2026-11-28" },
  "stock-stabilization-fund#rumor-no-action": { value: "partly", note: "증시 급락은 확인되지만 증안펀드 가동 준비, 자사주 매수 한도 완화와 공매도 감시도 이뤄졌다. 실제 펀드 매입은 시작되지 않았어도 대책 없이 방문만 했다는 설명은 과장됐다.", drafted: "2026-11-28", approved: "2026-11-28" },
  "pension-reform-2025#rumor-no-pension": { value: "unknown", note: "개정법은 국가의 연금 지급보장을 명문화했다. 기금 소진 전망만으로 지금 태어난 아이들이 연금을 받지 못한다고 확인할 수 없으며 장래 재원 마련은 별도 과제다.", drafted: "2026-11-28", approved: "2026-11-28" },
  "may18-merit-list#rumor-riot": { value: "false", note: "대법원은 1997년 전원합의체 판결(96도3376)에서 광주 시민들의 시위를 국헌을 어지럽힌 내란 행위가 아니라 헌정 질서를 지키기 위한 정당한 행위로 보았다. 폭동이었다는 말은 이 확정 판결과 다르다.", drafted: "2026-11-28", approved: "2026-11-28" },
  "president-korean-war-remarks#rumor-silent": { value: "partly", note: "일부 기념사에 자유민주주의라는 단어가 없었던 것은 확인된다. 그러나 대통령은 6·25 관련 글과 기념사에서 참전용사의 희생을 기려 6·25를 말하지 않는다는 주장은 다르다.", drafted: "2026-11-28", approved: "2026-11-28" },
  "potential-growth-2026#rumor-credit": { value: "unknown", note: "언론은 반도체·AI를 반등 요인으로 분석했다. 대통령 글에는 반등 원인이 정부 정책이라는 표현이 없어 기업 성과를 자기 공으로 돌렸다는 의도는 확인되지 않는다.", drafted: "2026-11-28", approved: "2026-11-28" },
  "potential-growth-2026#rumor-exaggerated": { value: "partly", note: "해당 수치는 언론이 IMF 전망을 역산한 추정이며 OECD 전망은 반대 방향이다. 다만 약 40년 만이라는 비교도 보도에 근거하므로 표현 전체가 과장이라고 단정하기는 어렵다.", drafted: "2026-11-28", approved: "2026-11-28" },
  "potential-growth-2026#rumor-cherry": { value: "unknown", note: "대통령이 상승 전망을 인용하면서 OECD 하락 전망을 언급하지 않은 사실은 확인된다. 다만 입맛에 맞춰 골랐다는 동기와 정부 정책 성과라고 주장했는지는 확인되지 않는다.", drafted: "2026-11-28", approved: "2026-11-28" },
  "potential-growth-2026#rumor-macro": { value: "unknown", note: "반등 수치는 IMF 자료를 바탕으로 언론이 역산한 전망이다. 전문가 신중론은 있지만 제시된 자료만으로 고유가·고금리·고달러 상황의 전망 신뢰도를 확정할 수 없다.", drafted: "2026-11-28", approved: "2026-11-28" },
  "parole-2026#rumor-nephew": { value: "unknown", note: "주진우 의원은 대통령 조카의 가석방 가능성을 제기했다. 무기형 가석방의 법적 요건은 있지만 실제 심사 통과나 석방 결정·집행 사실은 확인되지 않는다.", drafted: "2026-11-28", approved: "2026-11-28" },
  "parole-2026#rumor-lifer": { value: "partly", note: "법은 무기형도 일정 복역기간 이후 심사와 허가를 거쳐 가석방할 수 있게 한다. 주진우 의원은 실제 가석방 인원을 제시했지만 특정 대상자의 이번 석방 결정까지 확인되는 것은 아니다.", drafted: "2026-11-28", approved: "2026-11-28" },
  "parole-2026#rumor-list": { value: "unknown", note: "개별 가석방자의 이름을 결정 때마다 공개하는 제도는 없고 회의록은 5년 뒤 공개된다. 이 비공개 방식이 피해자를 외면한 결과인지는 제시된 자료로 확인되지 않는다.", drafted: "2026-11-28", approved: "2026-11-28" },
  "parole-2026#rumor-relative": { value: "unknown", note: "주진우 의원의 발언은 대통령 조카의 가석방 가능성 제기였다. 법무부 차관의 이화영 관련 답변도 친인척의 실제 가석방 대상 포함 여부를 확인한 근거는 아니다.", drafted: "2026-11-28", approved: "2026-11-28" },
  "multicultural-review#rumor-farright": { value: "unknown", note: "대통령은 차별 방지 지원을 계속하되 과잉은 시정하겠다고 설명했다. 그 입장을 극우 정치와 동일시할 수 있는지는 제시된 설명과 비판만으로 확인되지 않는다.", drafted: "2026-11-28", approved: "2026-11-28" },
  "firefighter-finance#rumor-grant-cut": { value: "partly", note: "정부 예산안에서 소방안전교부세가 줄어드는 것은 확인된다. 다만 기획예산처는 담배 세입과 정산분 변화를 설명했으며 특정 도지사 비판의 주된 원인까지는 확인되지 않는다.", drafted: "2026-11-28", approved: "2026-11-28" },
  "firefighter-finance#rumor-2897": { value: "partly", note: "2,897억 원 감소는 예산안의 소방안전교부세 수치다. 중앙 소방청 예산은 오히려 늘어 소방 예산 전체를 같은 액수만큼 삭감했다는 설명은 부정확하다.", drafted: "2026-11-28", approved: "2026-11-28" },
  "cabinet-meeting-broadcast#rumor-chilling": { value: "unknown", note: "한국일보는 장관들의 생중계 축소 건의를 보도했지만 대통령은 해당 보도를 부인하며 비공개 논의도 있다고 설명했다. 자유로운 논의가 실제로 차단됐는지는 확인되지 않는다.", drafted: "2026-11-28", approved: "2026-11-28" },
  "cabinet-meeting-broadcast#rumor-show": { value: "unknown", note: "부처 보고·토론 생중계와 이에 대한 우려 보도는 확인된다. 그러나 국정 논의보다 대통령 홍보가 주목적이 됐다는 평가는 제시된 자료만으로 확인되지 않는다.", drafted: "2026-11-28", approved: "2026-11-28" },
  "cabinet-meeting-broadcast#rumor-dictator": { value: "unknown", note: "대통령은 비공개 회의와 개별 연락으로 다른 의견을 내도록 독려한다고 설명했다. 모든 국무위원에게 같은 생각을 강요했다는 사실이나 독재라는 평가는 확인되지 않는다.", drafted: "2026-11-28", approved: "2026-11-28" },
  "cabinet-meeting-broadcast#rumor-friend": { value: "unknown", note: "제시된 글에서 쓴소리 비유는 대통령이 장관에게 문제를 지적하는 맥락이었다. 지지층을 겨냥했다는 내용이나 지지자들의 실제 감정은 확인되지 않는다.", drafted: "2026-11-28", approved: "2026-11-28" },
  "national-proposal#rumor-mail": { value: "unknown", note: "민원 장기 미처리와 반복 이송 통계는 확인된다. 그러나 특정 우편 정책제안의 접수·진행 상황과 안내 기관의 전화 응대 여부는 제시된 자료에 없다.", drafted: "2026-11-28", approved: "2026-11-28" },
  "president-sns#rumor-all-day": { value: "unknown", note: "대통령의 SNS 게시물 증가 집계는 확인된다. 그러나 게시물 수만으로 하루 종일 SNS만 하거나 모든 댓글에 대응하며 국정을 수행하지 않는다고 확인할 수 없다.", drafted: "2026-11-28", approved: "2026-11-28" },
  "president-sns#rumor-echo": { value: "unknown", note: "대통령은 SNS 직접 소통을 책무라고 설명했다. 그러나 실제 도달 대상이 주로 지지자인지에 관한 자료는 없고 공개 질책의 적절성도 사실로 확정할 수 없다.", drafted: "2026-11-28", approved: "2026-11-28" },
  "president-sns#rumor-fmkorea": { value: "partly", note: "대통령이 에펨코리아 게시물을 공유하며 우대 제도 검토를 밝힌 사실은 확인된다. 다만 커뮤니티 전체의 여성혐오·극우 성향은 이 근거에서 확인되지 않는다.", drafted: "2026-11-28", approved: "2026-11-28" },
  "president-sns#rumor-mental": { value: "unknown", note: "대통령은 방송에서 평정심을 잃지 않았다고 말했고 청와대 관계자는 절박함을 설명했다. 심리 상태가 불안정하다는 진단이나 SNS가 그 징후라는 근거는 없다.", drafted: "2026-11-28", approved: "2026-11-28" },
  "president-sns#rumor-views": { value: "unknown", note: "주간경향 팩트체크는 유튜브가 조회수와 좋아요를 다른 검증 과정으로 집계해 일시적으로 차이가 날 수 있다며 조작 주장을 '거짓'으로 판정했다. 화면의 수치 차이만으로 구매 조작을 단정할 수 없다.", drafted: "2026-11-28", approved: "2026-11-28" },
  "president-sns#rumor-delete": { value: "unknown", note: "방송 댓글을 분석한 보도에는 비판 댓글도 포함돼 있다. 다만 댓글 삭제 여부와 선거 조작 해명 회피를 확인하는 자료는 제시되지 않았다.", drafted: "2026-11-28", approved: "2026-11-28" },
  "chief-justice-conflict#rumor-separation": { value: "unknown", note: "대법관 제청 반려와 여당 등의 탄핵 언급은 확인된다. 다만 대통령·청와대의 탄핵 입장은 없고 이런 행위가 삼권분립을 무너뜨렸다는 결론도 확인되지 않는다.", drafted: "2026-11-28", approved: "2026-11-28" },
  "chief-justice-conflict#rumor-capture": { value: "unknown", note: "탄핵 논의와 대법관 증원 법률은 확인된다. 그러나 대통령이 사법부 장악과 본인 사건 공소 취소를 목적으로 추진한다는 의도는 제시된 근거에서 확인되지 않는다.", drafted: "2026-11-28", approved: "2026-11-28" },
  "disinformation-response#rumor-press-fear": { value: "unknown", note: "언론자유지수 상승과 정부 조치에 대한 비판은 함께 제시돼 있다. 이 지표만으로 언론인들이 대통령의 불이익을 두려워하는지와 이전 정부 대비 차이는 확인되지 않는다.", drafted: "2026-11-28", approved: "2026-11-28" },
  "president-disaster-response#rumor-golf-always": { value: "unknown", note: "청와대는 대구 사고 때 대통령이 골프장에서 보고받았다고 밝혔다. 다른 사고 때의 골프 의혹은 확인되지 않아 참사 때마다 골프만 쳤다는 일반화는 확인되지 않는다.", drafted: "2026-11-28", approved: "2026-11-28" },
  "president-disaster-response#rumor-daegu-navy": { value: "partly", note: "청와대는 대구 천장 붕괴 사고 당일 대통령이 가족과 태릉 골프장을 찾았고 현장에서 보고를 받았다고 밝혔다. 해군 장병 실종 당일 대통령 일정은 청와대가 따로 밝히지 않아 확인되지 않는다.", drafted: "2026-11-28", approved: "2026-11-28" },
  "president-disaster-response#rumor-firefighter": { value: "unknown", note: "소방관 사망 당일 대통령이 별도 추모 글을 올리고 빈소를 찾은 사실은 확인된다. 앞서 다른 글에 덧붙였는지와 비판 때문에 별도 글을 썼는지는 확인되지 않는다.", drafted: "2026-11-28", approved: "2026-11-28" },
  "president-disaster-response#rumor-muan-cheonan": { value: "false", note: "대통령은 무안 참사 유가족을 초청해 사과했고 영상 추모사도 냈다. 서해수호의 날 기념식에서도 희생자를 추모해 이들을 외면했다는 주장과 다르다.", drafted: "2026-11-28", approved: "2026-11-28" },
  "president-disaster-response#rumor-golf-tf": { value: "unknown", note: "한미 정상의 골프 회동 준비를 위한 실무 TF 구성은 확인된다. 별도 예산 편성은 제시되지 않았고 TF 운영이 대통령답지 못하다는 평가는 사실로 확인할 수 없다.", drafted: "2026-11-28", approved: "2026-11-28" },
  "appointments-lawyers#rumor-lawyers": { value: "unknown", note: "대통령 사건 변호인 출신의 공직 기용 사례는 확인된다. 다만 그 인선이 개혁인지 여부나 보은 목적이었는지는 제시된 경력과 평가만으로 확정할 수 없다.", drafted: "2026-11-28", approved: "2026-11-28" },
  "appointments-lawyers#rumor-board": { value: "unknown", note: "변호인 출신 기용과 관련 가족관계는 확인된다. 그러나 보은 목적이라는 설명은 비판적 의견이며 사외이사 인선까지 입증하는 자료도 제시되지 않았다.", drafted: "2026-11-28", approved: "2026-11-28" },
  "appointments-lawyers#rumor-principle": { value: "partly", note: "대통령 사건 변호인 출신의 기관장 기용은 확인된다. 다만 대통령실과 외교부는 경험·전문성을 인선 이유로 설명했으며 친분 때문에 임명했다는 점은 확인되지 않는다.", drafted: "2026-11-28", approved: "2026-11-28" },
  "ballot-shortage-2026#rumor-ballot": { value: "partly", note: "투표용지 부족으로 일부 투표소의 투표가 일시 중단된 사실은 확인된다. 다만 재개됐고 선관위는 행정부 소속이 아닌 독립 헌법기관이므로 정부 책임과 동일시할 수 없다.", drafted: "2026-11-28", approved: "2026-11-28" },
  "ballot-shortage-2026#rumor-fraud": { value: "unknown", note: "투표용지 부족과 대응 매뉴얼 부재는 확인되지만 조작 정황 발표는 없다. 제시된 선거소송 결과도 부정선거 실행을 입증하지 못해 선관위의 조작은 확인되지 않는다.", drafted: "2026-11-28", approved: "2026-11-28" },
  "illegal-sports-betting#rumor-23": { value: "unknown", note: "불법도박 규모 추산과 사이트 감시·차단 의뢰 실적은 확인된다. 다만 불법 스포츠도박 23조 원이라는 수치와 정부가 개선을 전혀 하지 않는다는 주장은 확인되지 않는다.", drafted: "2026-11-28", approved: "2026-11-28" },
  "jungsucheong-chief#rumor-pressure": { value: "unknown", note: "행안부 장관의 감찰 지시와 중수청의 감찰 착수는 확인된다. 다만 청장 후보의 수사 지시나 편파 수사 목적의 압박이었다는 점은 확인되지 않는다.", drafted: "2026-11-28", approved: "2026-11-28" },
  "jungsucheong-chief#rumor-pc": { value: "partly", note: "중수청 감찰관실은 2026년 10월 19일 임은정 청장의 업무용 PC를 포렌식했다. 다만 쓴소리한 사람을 찾으려는 목적이었다는 사실은 확인되지 않는다.", drafted: "2026-11-28", approved: "2026-11-28" },
  "jungsucheong-chief#rumor-seat": { value: "unknown", note: "수사기관장의 국무회의 배석 관례가 바뀐 사실과 중립성 우려는 제시돼 있다. 다만 배석의 법적 의무 여부와 실제 수사 중립성 침해까지 확인한 근거는 없다.", drafted: "2026-11-28", approved: "2026-11-28" },
  "jungsucheong-chief#rumor-own-trial": { value: "unknown", note: "대통령과 청와대는 개별 사건 수사·공소 지휘를 하지 않겠다고 밝혔다. 정치적 부담 우려는 있지만 대통령 본인 사건에 실제 개입했는지는 확인되지 않는다.", drafted: "2026-11-28", approved: "2026-11-28" },
  "farmland-survey-2026#rumor-blame": { value: "official-only", note: "대통령은 장관의 제안을 언급한 것이 칭찬이며 공개 지시를 한 자신의 책임은 줄지 않는다고 설명했다. 책임 전가였다는 동기를 독립적으로 확인한 근거는 없다.", drafted: "2026-11-28", approved: "2026-11-28" },
  "farmland-survey-2026#rumor-price-loan": { value: "partly", note: "농지 거래와 신규 담보대출 감소, 부실채권 매각 손실 증가는 확인된다. 다만 농지조사 발언 때문이라는 인과나 농협의 공식 대출 제한은 확인되지 않았다.", drafted: "2026-11-28", approved: "2026-11-28" },
  "farmland-survey-2026#rumor-foreign": { value: "partly", note: "제시된 자료에서 중국 국적자의 농지 취득은 늘었지만 외국인 전체 취득은 줄었다. 식량안보 위협의 정도와 정부가 방치했다는 사실은 이 수치만으로 확인되지 않는다.", drafted: "2026-11-28", approved: "2026-11-28" },
  "bonghwa-vietnam-valley#rumor-village": { value: "false", note: "K-베트남 밸리는 베트남이 아니라 경북 봉화군에 조성하는 지역특구다. 한·베 역사와 문화를 관광·국제교류 자원으로 활용하는 국내 사업이다.", drafted: "2026-11-28", approved: "2026-11-28" },
  "livelihood-indicators-2026#rumor-no-better": { value: "unknown", note: "실질임금 감소와 서울 일반 상가 공실률 상승은 확인된다. 그러나 이 자료만으로 서민 전체의 삶에 개선이 전혀 없었다고 일반화하거나 투자 손실까지 확인할 수 없다.", drafted: "2026-11-28", approved: "2026-11-28" },
  "livelihood-indicators-2026#rumor-wage-price": { value: "partly", note: "제시된 분기의 명목임금 상승률은 물가상승률보다 낮았고 실질임금은 줄었다. 다만 SNS에서 칭찬만 오갔다는 내용은 이 통계로 확인되지 않는다.", drafted: "2026-11-28", approved: "2026-11-28" },
  "livelihood-indicators-2026#rumor-tax": { value: "unknown", note: "재정경제부는 올해 국세가 추경 때 예상보다 더 걷힐 것으로 전망했다. 세수 증가의 혜택이 서민에게 돌아가는지는 이어진 자료로 확인되지 않는다.", drafted: "2026-11-28", approved: "2026-11-28" },
  "foreign-workers-remark#rumor-gaffe": { value: "unknown", note: "대통령의 외국인 노동자 송금 관련 발언과 내국인 인건비 지원 검토 지시는 확인된다. 비판과 청와대 설명이 함께 제시돼 있으나 실언이라는 평가는 사실로 확정할 수 없다.", drafted: "2026-11-28", approved: "2026-11-28" },
  "foreign-workers-remark#rumor-construction": { value: "unknown", note: "고용허가제 도입 규모와 외국인주민 증가는 확인된다. 다만 건설업의 고령 내국인 일자리 감소가 외국인 노동자 때문이라는 인과와 대체 규모는 제시되지 않았다.", drafted: "2026-11-28", approved: "2026-11-28" },
  "foreign-crime-drugs#rumor-inflate": { value: "unknown", note: "외국인 범죄 검거 인원과 과거 범죄율 비교는 제시돼 있다. 인권단체가 외국인 피해를 부풀리거나 자국민을 가해자로 몰았다는 행동은 확인되지 않는다.", drafted: "2026-11-28", approved: "2026-11-28" },
  "foreign-crime-drugs#rumor-overstay-drugs": { value: "unknown", note: "불법체류 합동단속과 외국인 마약사범 검거는 확인된다. 다만 불법체류자가 마약 문제의 근원이라는 인과나 마약사범의 체류 자격은 제시되지 않았다.", drafted: "2026-11-28", approved: "2026-11-28" },
  "foreign-crime-drugs#rumor-tourist": { value: "unknown", note: "외국인 강력범죄·마약사범 검거 인원 증가는 제시돼 있다. 그러나 중국 관광객이나 무비자 제도 때문에 범죄율이 올랐다는 인과는 확인되지 않는다.", drafted: "2026-11-28", approved: "2026-11-28" },
  "base-rate-2026#rumor-burden": { value: "unknown", note: "금융통화위원회가 기준금리를 다시 올린 사실은 확인된다. 한은은 성장·물가와 금융불균형을 이유로 설명했지만 서민 부담만 커진다는 전체 효과는 확인되지 않는다.", drafted: "2026-11-28", approved: "2026-11-28" },
  "president-assets-salary#rumor-tax": { value: "unknown", note: "대통령 부부 아파트의 매매와 근저당 설정은 등기로 확인된다. 다만 편법 거래나 특정 세제 혜택을 악용했다는 내용은 제시된 근거에서 확인되지 않는다.", drafted: "2026-11-28", approved: "2026-11-28" },
  "presidential-office-budget#rumor-special": { value: "true", note: "민주당은 야당 때 대통령실 특활비를 전액 삭감했고 집권 뒤 추경으로 재편성했다. 2026년 예산에도 특활비가 반영돼 삭감 뒤 예산이 늘어난 사실은 확인된다.", drafted: "2026-11-28", approved: "2026-11-28" },
  "presidential-office-budget#rumor-budget": { value: "true", note: "2026년 대통령실 예산은 전년보다 95억 2천만 원 늘었다. 특수활동비 82억 1,500만 원 반영이 증가의 주된 원인으로 제시돼 있다.", drafted: "2026-11-28", approved: "2026-11-28" },
  "presidential-office-budget#rumor-audit": { value: "unknown", note: "일부 전임 참모 등이 국감 증인 명단에 포함되지 않은 사실은 확인된다. 다만 명단은 국회 표결로 정해졌고 대통령이 출석을 막았다는 근거는 없다.", drafted: "2026-11-28", approved: "2026-11-28" },
  "welfare-outreach#rumor-application": { value: "unknown", note: "정부의 직권 신청·자동 지급 강화안과 관련 법률의 국회 통과는 확인된다. 다만 정보 취약 고령자가 실제 얼마나 배제됐는지와 법 개정 뒤 효과는 확인되지 않는다.", drafted: "2026-11-28", approved: "2026-11-28" },
  "welfare-outreach#rumor-selective": { value: "unknown", note: "제시된 해석은 대통령의 최근 차등·타깃 지원 표현을 과거 보편 지급 주장과 대비한다. 다만 선별 복지 전반에 반대했던 구체적 입장과 현재의 모순은 확인되지 않는다.", drafted: "2026-11-28", approved: "2026-11-28" },
  "arctic-route#rumor-security": { value: "unknown", note: "북극항로에 대러 제재·계절 운항·보험 등 과제가 있다는 근거는 있다. 그러나 우리 선박의 구체적 드론 공격 위험이나 발생 사실은 제시되지 않았다.", drafted: "2026-11-28", approved: "2026-11-28" },
  "nk-drones#rumor-hands-off": { value: "unknown", note: "북한 드론 개발 동향과 러시아 기술 이전 주장은 제시돼 있다. 국방부의 드론·대드론 정책 발표도 있어 정부가 안보에 손을 놓았다는 설명은 확인되지 않는다.", drafted: "2026-11-28", approved: "2026-11-28" },
  "seoul-housing-supply#rumor-2018": { value: "partly", note: "재건축 안전진단 강화와 이후 완화는 확인된다. 서울시는 과거 정비구역 해제 등의 누적 영향을 설명했으나 공급 감소의 시작과 원인을 그것만으로 확정할 수는 없다.", drafted: "2026-11-28", approved: "2026-11-28" },
  "party-merger#rumor-president-line": { value: "unknown", note: "합당 논의 중단과 재추진 움직임, 정당 내부 의결 요건은 확인된다. 그러나 대통령이 선을 그으면 지지자 혼란이 멈춘다는 효과는 확인되지 않는다.", drafted: "2026-11-28", approved: "2026-11-28" },
  "capital-taxes#rumor-crypto": { value: "partly", note: "금투세 폐지는 현 정부 출범 전 이뤄졌고 가상자산 과세는 이후에도 추진 방침이 있었다. 다만 정부는 11월에 추가 유예를 추진한다고 밝혀 현재 시행 일정은 입법에 달렸다.", drafted: "2026-11-28", approved: "2026-11-28" },
  "insurrection-officials-tf#rumor-embrace": { value: "unknown", note: "내란 참여·협조 공직자 조사와 징계·수사의뢰 조치는 확인된다. 그러나 관련 세력을 포용해 핵심 지지층이 이탈했다는 인과와 이탈 규모는 제시되지 않았다.", drafted: "2026-11-28", approved: "2026-11-28" },
  "lh-speculation#rumor-blind-eye": { value: "unknown", note: "2021년 LH 직원 투기 의혹은 경찰 수사와 송치, 대법원 징역형과 토지 몰수 확정으로 이어졌다. 지금 정부가 LH 관련 투기에 어떻게 대응하는지는 이어진 자료로 확인되지 않는다.", drafted: "2026-11-28", approved: "2026-11-28" },
  "daejang-recovery#rumor-7800": { value: "partly", note: "형사재판 추징액이 검찰이 본 범죄수익보다 적고 검찰이 항소하지 않은 사실은 확인된다. 다만 추징이 전혀 없었던 것은 아니며 민사 환수 가능성과 최종 결과는 별도다.", drafted: "2026-11-28", approved: "2026-11-28" },
  "president-power-remarks#rumor-order": { value: "unknown", note: "대통령이 여야를 가리지 않는 엄정 수사를 지시한 것은 공개 브리핑된 사실이다. 별도의 비공개 수사 지시나 공개 발언과 다른 개입은 제시된 근거에 없다.", drafted: "2026-11-28", approved: "2026-11-28" },
  "jointstem-review#rumor-blocked": { value: "unknown", note: "1심은 허가 반려 처분을 취소했지만 허가를 명한 판결은 아니다. 국내 치료가 해외로 내몰린 원인과 허가 방해가 부당했는지는 확인되지 않는다.", drafted: "2026-11-28", approved: "2026-11-28" },
  "security-appointments#rumor-dismiss": { value: "unknown", note: "국민의힘은 한미 신뢰 문제를 들어 경질을 요구했고 통일부 장관은 동맹에 문제가 없다고 반박했다. 경질하지 않으면 관계가 악화된다는 전망을 확인할 근거는 없다.", drafted: "2026-11-28", approved: "2026-11-28" },
  "enemy-cemetery-unclaimed#rumor-cemetery": { value: "partly", note: "북한군 묘지 운영과 무연고 장례의 지역 격차는 확인된다. 다만 무연고 사망자 장례도 지자체가 맡고 있어 자국민에게 장례 지원이 전혀 없다는 설명은 과장됐다.", drafted: "2026-11-28", approved: "2026-11-28" },
  "mental-illness-industrial#rumor-mental": { value: "unknown", note: "정신질환 산재 인정률 하락과 장기 처리기간은 확인된다. 그러나 상병 축소 승인이나 병세 악화에도 기계적으로 요양을 끝냈다는 구체적 사례·판단은 없다.", drafted: "2026-11-28", approved: "2026-11-28" },
  "suicide-statistics-2025#rumor-youth": { value: "unknown", note: "제시된 자료는 2025년 사망 통계이며 10대 자살률 증가 등을 보여 준다. 그러나 올해 청년 사망 규모나 현 정부 출범 뒤의 별도 변화는 확인되지 않는다.", drafted: "2026-11-28", approved: "2026-11-28" },
  "japan-agreements-pardons#rumor-follow-yoon": { value: "partly", note: "위안부 합의·강제징용 제3자 변제 유지 입장과 경제인 특별사면은 확인된다. 다만 이 사례들만으로 정부 정책 전체가 전임 정부를 답습한다고 일반화할 수는 없다.", drafted: "2026-11-28", approved: "2026-11-28" },
  "japan-agreements-pardons#rumor-chaebol-deal": { value: "unknown", note: "경제인 등을 포함한 특별사면은 확인된다. 그러나 재벌과 검찰이 특혜를 주고받았다는 거래나 그로 인한 국민 피해의 인과는 제시되지 않았다.", drafted: "2026-11-28", approved: "2026-11-28" },
  "overseas-trips-2026#rumor-benefit": { value: "unknown", note: "멕시코 투자보장협정 개정 협상 타결 등 구체적 순방 결과는 확인된다. 그러나 예산 증가와 순방 비용을 연결한 전체 손익·경제적 이득은 제시되지 않았다.", drafted: "2026-11-28", approved: "2026-11-28" },
  "local-unsold-housing#rumor-local-permits": { value: "partly", note: "지방 준공 후 미분양 누적과 신규 인허가는 확인된다. 다만 인허가와 준공 물량은 전년보다 크게 줄었고 지방 집값 폭락 자체의 수치는 제시되지 않았다.", drafted: "2026-11-28", approved: "2026-11-28" },
  "home-price-drop-plan#rumor-owners": { value: "unknown", note: "대통령은 집값 급락 시 정부 대량 매입 등 대비책을 강구 중이라고 밝혔다. 다만 구체적 매입 기준과 재원은 공개되지 않아 자산 피해 대응이 충분한지는 확인되지 않는다.", drafted: "2026-11-28", approved: "2026-11-28" },
  "housing-supply-bills#rumor-none-passed": { value: "false", note: "주택법·공공주택특별법 등 주택공급 관련 법률이 국회에서 처리됐다. 일부 후속 법안이 계류돼 있어도 하나도 통과되지 않았다는 주장은 사실과 다르다.", drafted: "2026-11-28", approved: "2026-11-28" },
  "overseas-trips-dispute#rumor-double-standard": { value: "unknown", note: "야당 시절 순방 실익을 비판한 발언과 현재 여야의 상반된 평가는 확인된다. 다만 놀러 간다는 직접 발언과 양측 순방의 동등한 조건은 제시되지 않아 이중잣대인지 확정할 수 없다.", drafted: "2026-11-28", approved: "2026-11-28" },
  "west-sea-structures#rumor-no-response": { value: "partly", note: "서해 구조물에 대한 정상회담 논의와 관리시설 이전은 확인된다. 다만 어선 방어벽이라는 구체적 상황은 근거에 없고 대통령이 전혀 대응하지 않았다는 설명도 다르다.", drafted: "2026-11-28", approved: "2026-11-28" },
  "youth-2030-jobs-loans#rumor-blocked": { value: "unknown", note: "주택담보대출 한도·비율 강화는 확인된다. 다만 청년 대상 대출 확대 발표도 있어 청년층이 이용하던 금융수단을 전부 막았다는 주장은 확인되지 않는다.", drafted: "2026-11-28", approved: "2026-11-28" },
  "youth-2030-jobs-loans#rumor-140k": { value: "unknown", note: "15~29세 취업자는 14만 7천 명 줄었지만 새 15~34세 기준 감소폭은 9만 8천 명이다. 연령과 비교 시점을 특정하지 않은 청년 일자리 14만 감소라는 표현은 그대로 확인하기 어렵다.", drafted: "2026-11-28", approved: "2026-11-28" },
  "manipulated-indictment-counsel#rumor-105": { value: "true", note: "대통령 사건 공소취소와 국정조사 추진 의원모임은 민주당 의원 105명 참여로 출범했다. 다만 이는 출범 당일 수치이며 이후 탈퇴와 당 기구 흡수 논의가 있었다.", drafted: "2026-11-28", approved: "2026-11-28" },
  "manipulated-indictment-counsel#rumor-eight-of-twelve": { value: "partly", note: "원안에 대해서는 수사 대상 12개 중 대통령 관련 사건을 8개로 센 보도가 있다. 수정안은 범위와 묶음이 달라져 같은 분류·개수를 그대로 적용하기 어렵다.", drafted: "2026-11-28", approved: "2026-11-28" },
  "manipulated-indictment-counsel#rumor-clause-removed": { value: "true", note: "대통령은 기존 기소 사건의 이송·처분 조항 삭제를 요청했다. 이후 소위 수정안에서 공소유지 여부 결정과 재판 중 사건 이첩 요구 조항이 실제로 삭제됐다.", drafted: "2026-11-28", approved: "2026-11-28" },
  "manipulated-indictment-counsel#rumor-self-judge": { value: "false", note: "특검의 수사와 공소 활동은 법원의 판결 권한과 다르다. 특검 임명에 관한 이해충돌 논란은 있지만 대통령 본인 재판의 유무죄·공소기각은 여전히 재판부가 정한다.", drafted: "2026-11-28", approved: "2026-11-28" },
  "manipulated-indictment-counsel#rumor-prosecutors": { value: "unknown", note: "특검법은 수사·기소 과정의 권한 남용 의혹을 조사하도록 한다. 특정 검사의 조작을 확정한 결과는 없고 검사들을 사기꾼으로 만들려는 의도도 확인되지 않는다.", drafted: "2026-11-28", approved: "2026-11-28" },
  "manipulated-indictment-counsel#rumor-gov-stance": { value: "unknown", note: "민주당은 조작기소 의혹 조사와 고발을 추진했고 대통령은 기존 사건 처분 조항 삭제를 요청했다. 검사들을 사기꾼으로 만든다는 포괄적 주장은 제시된 사실로 확인되지 않는다.", drafted: "2026-11-28", approved: "2026-11-28" },
  "hinzpeter-award#rumor-absence": { value: "unknown", note: "대통령이 시상식에 직접 참석하지 않고 축전을 보낸 사실은 확인된다. 불참이 5·18을 가볍게 여긴다는 뜻이라는 동기는 확인되지 않는다.", drafted: "2026-11-28", approved: "2026-11-28" },
  "special-forces-walking#rumor-runway": { value: "partly", note: "특전여단 장병의 워킹 교육과 영문 매체의 논란 보도는 확인된다. 육군도 부적절함을 인정했지만 해외에서 비웃음을 샀다는 구체적 반응까지는 제시되지 않았다.", drafted: "2026-11-28", approved: "2026-11-28" },
  "taekwondo-unesco#rumor-rights": { value: "false", note: "한국도 2026년 3월 별도 등재 신청서를 냈고 공동 등재를 추진해 왔다. 국가유산청장은 북한이 단독 등재돼도 태권도에 대한 배타적 권리가 생기지 않는다고 설명했다.", drafted: "2026-11-28", approved: "2026-11-28" },
  "park-respect-remark#rumor-respect": { value: "true", note: "후보 시절 박근혜 전 대통령에게 존경한다는 표현을 쓴 뒤 진짜 존경한다는 의미로 해석하는 것을 반박한 사실이 확인된다. 대통령 재임 중이 아닌 대선 후보 때의 발언이다.", drafted: "2026-11-28", approved: "2026-11-28" },
  "park-respect-remark#rumor-flip": { value: "partly", note: "불체포특권 포기 뒤 부결 호소, 위성정당 금지 약속 미이행 등 입장 변화 사례는 있다. 다만 맥락 해명이나 조건부 정책도 함께 있어 모든 발언을 번번이 뒤집었다고 일반화할 수 없다.", drafted: "2026-11-28", approved: "2026-11-28" },
  "wage-income-tax#rumor-wage-tax-up": { value: "true", note: "근로소득세 수입은 전년보다 늘었고 장기 증가율도 전체 국세보다 높았다. 다만 근거는 최근 세율 인상이 아니라 근로자·급여 증가와 고정된 과표 구조를 설명한다.", drafted: "2026-11-28", approved: "2026-11-28" },
  "tax-reform-2026#rumor-vat-500": { value: "partly", note: "정부안은 카드·현금영수증 매출 세액공제 한도를 낮춰 일부 사업자의 공제액을 최대 500만 원 줄일 수 있다. 신고 방식 변경은 아니며 국회 심의 전의 개정안이다.", drafted: "2026-11-28", approved: "2026-11-28" },
  "president-son-allegations#rumor-gamble": { value: "unknown", note: "1,000만 원 이내라는 발언은 손실액이고 약 2억 3,200만 원은 게임머니 충전 총액이다. 실제 손실액은 제시되지 않아 두 수치만으로 거짓말이었다고 확인할 수 없다.", drafted: "2026-11-28", approved: "2026-11-28" },
  "president-son-allegations#rumor-wedding": { value: "unknown", note: "장남이 삼청각에서 결혼한 사실은 확인된다. 다만 비용·하객 수는 전언과 보도에 머물며 비판 국민을 극우로 몰았다는 발언은 제시되지 않았다.", drafted: "2026-11-28", approved: "2026-11-28" },
  "president-family-dispute#rumor-nephew": { value: "unknown", note: "제시된 녹음 보도는 형·형수와의 통화이며 후보가 그 일에 사과한 사실도 있다. 아버지를 잃은 조카에 대한 입원 협박과 사과 부재라는 구체적 주장은 확인되지 않는다.", drafted: "2026-11-28", approved: "2026-11-28" },
  "decision-records#rumor-no-minutes": { value: "partly", note: "레버리지 ETF 비공개 간담회 회의록 미작성과 일부 지방 사업 보고서 부재는 확인된다. 다만 광주·전남 통합과 클러스터 결정 전체에 기록이 없다는 주장은 이 자료로 확인되지 않는다.", drafted: "2026-11-28", approved: "2026-11-28" },
  "insurrection-warrants#rumor-warrants": { value: "partly", note: "특검 구속영장 기각 사례와 비율은 확인된다. 다만 법원은 도주·증거인멸 우려와 혐의 소명 등을 이유로 들어 기각만으로 사법 불신이나 개혁 지연의 인과를 확정할 수 없다.", drafted: "2026-11-28", approved: "2026-11-28" },
  "rent-shift-2026#rumor-monthly-rent": { value: "partly", note: "월세 비중 상승과 전세의 월세 전환, 전세 매물 감소는 확인된다. 다만 서민 거주 지역 집값 급등과 주거난의 구체적 변화까지 보여 주는 자료는 없다.", drafted: "2026-11-28", approved: "2026-11-28" },
  "cheorwon-howitzer-crash#rumor-no-escort": { value: "partly", note: "사고 장비는 K9이 아니라 K55A1이다. 대열이 나뉘면서 앞선 대열 후미에 호위 차량이 없었다고 보도됐지만, 경찰이 군사경찰과 함께 안전조치가 규정에 맞았는지 조사하고 있어 정부 대응이 없다는 말과는 다르다.", drafted: "2026-11-28", approved: "2026-11-28" },
  "capital-market-meeting-2026#rumor-empty-meeting": { value: "partly", note: "간담회 당일 코스피는 하락했지만 코스닥은 상승했다. 간담회가 형식적이어서 신뢰를 잃고 주가가 내렸다는 인과를 별도로 확인한 분석은 없다.", drafted: "2026-11-28", approved: "2026-11-28" },
  "duplicate-listing-rules#rumor-chaebol": { value: "unknown", note: "중복상장 규정의 예외와 유상증자 신고서 정정 요구는 확인된다. 그러나 이를 통해 재벌이 소액주주 손실을 떠넘겼다는 구체적 거래와 손실 인과는 확인되지 않는다.", drafted: "2026-11-28", approved: "2026-11-28" },
  "kosdaq-segment-2026#rumor-kosdaq": { value: "false", note: "정부는 코스닥 세그먼트 개편, 기술특례 확대와 모험자본 공급 계획을 발표했다. 실행 효과와는 별개로 아무 대책도 없다는 주장과 다르다.", drafted: "2026-11-28", approved: "2026-11-28" },
  "tbs-funding-2027#rumor-tbs": { value: "unknown", note: "국회 상임위가 의결한 지원안은 약 73억 5천만 원이다. 김종철 위원장은 국회 증액이라고 답했고 이진숙 의원은 시사·유튜브 사용이 제한된다고 설명해, 편향 시사방송 지원 목적은 확인되지 않는다.", drafted: "2026-11-28", approved: "2026-11-28" },
  "health-checkup-tax#rumor-vat": { value: "unknown", note: "제시된 과세 사례는 회사 지원 건강검진비를 근로소득으로 본 소득세 문제다. 건강검진비에 부가가치세를 새로 매기는 조치는 확인되지 않는다.", drafted: "2026-11-28", approved: "2026-11-28" },
  "health-checkup-tax#rumor-bomb": { value: "partly", note: "한 회사의 직원 건강검진비 지원에 근로소득세 과세 통보가 있었던 것은 확인된다. 다만 다툼이 진행 중이고 일반 기준도 없어 모든 검진비에 일괄 부과한 것으로 볼 수 없다.", drafted: "2026-11-28", approved: "2026-11-28" },
  "csat-ai-cheating-2027#rumor-alert": { value: "unknown", note: "시험 중 위급재난문자 발송 계획과 집중력·형평성 우려는 확인된다. 다만 실제 집중력 피해와 스피커 제거·설정 변경에 따른 무력화 효과는 제시되지 않았다.", drafted: "2026-11-28", approved: "2026-11-28" },
  "csat-ai-cheating-2027#rumor-reward-abuse": { value: "unknown", note: "고액 포상금 추진과 상호 감시·허위 신고 우려는 제시돼 있다. 다만 지급에는 부정행위 확인이 필요하며 실제 함정·무고 피해가 생겼다는 근거는 없다.", drafted: "2026-11-28", approved: "2026-11-28" },
  "csat-ai-cheating-2027#rumor-ai-records": { value: "partly", note: "과기정통부는 글로벌 AI 기업의 협조 방침을 설명했다. 다만 제출 의무화 법률은 없고 개인정보 절차와 이용자 특정의 한계가 있어 실제 자료 확보·활용은 아직 확인되지 않는다.", drafted: "2026-11-28", approved: "2026-11-28" },
  "csat-ai-cheating-2027#rumor-items": { value: "partly", note: "시험 하루 전 개인 필기구 제한이 바뀌고 공용 물품 제공이 발표된 사실은 확인된다. 혼란 지적은 있지만 성실한 수험생에게 실제 불공정 결과가 생겼는지는 확인되지 않는다.", drafted: "2026-11-28", approved: "2026-11-28" },
  "csat-ai-cheating-2027#rumor-criminal": { value: "false", note: "제시된 근거는 국가 시행 시험의 부정행위에 위계공무집행방해가 적용되는 구조라고 설명한다. 민간 업무방해와 구분되며 다만 시험 중 적발 시 미수 처벌 가능성은 쟁점이다.", drafted: "2026-11-28", approved: "2026-11-28" },
  "csat-ai-cheating-2027#rumor-tone": { value: "unknown", note: "대통령 글에 해당 표현이 있으며 마지막 문장은 부정행위를 하려는 사람을 향한 것이었다. 표현이 위협적·조롱조라는 평가는 제시된 사실만으로 확인할 수 없다.", drafted: "2026-11-28", approved: "2026-11-28" },
  "choi-kyo-jin-resignation#rumor-minister": { value: "partly", note: "최교진 장관은 AI 부정행위를 100% 적발할 수 있느냐는 질문에 \"전 못할 것 같다\"고 답해 사퇴 요구를 받았고, 11월 22일 사의를 밝혀 면직됐다. 임명한 대통령의 책임은 이 사실만으로 판정할 수 없다.", drafted: "2026-11-28", approved: "2026-11-28" },
  "public-housing-240k#rumor-modular": { value: "unknown", note: "제시된 근거는 모듈러도 일반 건축물과 같은 내화 기준을 지켜야 한다고 설명한다. 모듈러라는 이유만으로 공적주택이 더 위험하다는 사고·성능 비교는 확인되지 않는다.", drafted: "2026-11-28" },
  "public-rental-rules#rumor-deposit": { value: "unknown", note: "행복주택 임대조건과 더 저렴한 영구임대 제도는 확인된다. 다만 단지별 수급자 보증금이나 서민 전체가 공공임대에 입주할 수 없다는 주장은 확인되지 않는다.", drafted: "2026-11-28", approved: "2026-11-28" },
  "trial-suspension#rumor-six-trials": { value: "false", note: "취임 전 기소된 사건은 8개지만 병합 심리로 형사재판은 5개였다. 특검법 보도에서 대통령 관련 수사 대상을 6개로 나눈 셈법은 재판 수와 다르다.", drafted: "2026-11-28", approved: "2026-11-28" },
  "trial-suspension#rumor-when-trial": { value: "unknown", note: "다섯 형사재판이 기일 추후 지정으로 멈춘 사실은 확인된다. 재판중지법 추진도 중단됐으며 재개 시점은 각 재판부가 정해 구체적 일정은 확인되지 않는다.", drafted: "2026-11-28", approved: "2026-11-28" },
  "trial-suspension#rumor-judges-volunteer": { value: "unknown", note: "선거법 파기환송심은 법원의 사건 배당으로 정해졌다. 판사들이 정치적 부담 때문에 피했다거나 다시 맡겠다고 자원했다는 사실은 확인되지 않는다.", drafted: "2026-11-28", approved: "2026-11-28" },
  "trial-suspension#rumor-resume-early": { value: "unknown", note: "제시된 기준 시점까지 재판 기일이 다시 잡혔거나 법원이 내년 초 순차 재개를 발표한 근거는 없다. 법원장도 재개 일정은 재판부가 결정할 일이라고 답했다.", drafted: "2026-11-28", approved: "2026-11-28" },
  "trial-past-convictions#rumor-four": { value: "true", note: "공개된 범죄·수사경력 회보서에는 공무원 자격 사칭·음주운전·특수공무집행방해·선거법 위반 네 건이 기재돼 있다. 네 건 모두 벌금형이다.", drafted: "2026-11-28", approved: "2026-11-28" },
  "youth-monthly-rent#rumor-everyone": { value: "false", note: "나이 외에 부모와 별도 거주·무주택 요건과 본인·원가구 소득 기준이 있다. 모집 인원도 정해져 있어 만 19~34세 누구나 월세 지원을 받는 것은 아니다.", drafted: "2026-11-28", approved: "2026-11-28" },
};

/**
 * 승인 날짜를 그 판정의 줄에 적은 파일 내용(scripts/study-verdicts.ts --approve가 쓴다).
 * 판정은 한 줄에 하나 — `  "<열쇠>": { value: …, drafted: "…" },`. 줄을 못 찾거나 이미 승인됐으면 null.
 */
export function approveInSource(text: string, key: string, date: string): string | null {
  const escaped = JSON.stringify(key).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const line = new RegExp(`(\n  ${escaped}: \\{[^\\n]*drafted: "\\d{4}-\\d{2}-\\d{2}")( \\},)`);
  return line.test(text) ? text.replace(line, `$1, approved: "${date}"$2`) : null;
}

/** 질문 꼴 문장 — 잼공의 「이 말, 맞을까?」에는 내지 않는다(질문에 "맞다"라고 답하면 어색하다). */
export function isQuestion(text: string): boolean {
  return /(\?|？|는가|인가|됐나|었나|했나|일까|나요)\s*$/.test(text.trim());
}

export function verdictKey(slug: string, rumorId: string): string {
  return `${slug}#${rumorId}`;
}

/** 승인된 판정. 승인 전이면 null — 밖에 보이지 않는다. */
export function approvedVerdict(slug: string, rumorId: string, verdicts: Record<string, Verdict> = VERDICTS): Verdict | null {
  const v = verdicts[verdictKey(slug, rumorId)];
  return v?.approved ? v : null;
}

/** 이어진 근거로 허락되는 판정. */
export function allowedValues(claims: Claim[]): VerdictValue[] {
  if (claims.length === 0 || claims.some((c) => !c.verified)) return ["unknown"];
  if (claims.some((c) => c.assertionType === "FACT")) return ["true", "partly", "false", "official-only", "unknown"];
  if (claims.some((c) => c.assertionType === "CLAIM")) return ["official-only", "unknown"];
  return ["unknown"];
}

/**
 * 판정 검사 — `pnpm validate`가 부른다.
 *   1. 모양, 열쇠가 실재하는 도는 말을 가리킨다.
 *   2. 판정이 이어진 근거로 허락되는 것이다(allowedValues).
 */
export function validateVerdicts(policies: Policy[], verdicts: Record<string, Verdict> = VERDICTS): string[] {
  const errors: string[] = [];
  for (const [key, v] of Object.entries(verdicts)) {
    const where = `도는 말 판정 ${key}`;
    const parsed = verdictSchema.safeParse(v);
    if (!parsed.success) {
      errors.push(`${where}: 모양 — ${parsed.error.issues.map((i) => i.path.join(".") + " " + i.message).join(", ")}`);
      continue;
    }
    const [slug, rumorId] = key.split("#");
    const policy = policies.find((p) => p.slug === slug);
    const rumor = policy?.rumors.find((r) => r.id === rumorId);
    if (!policy || !rumor) {
      errors.push(`${where}: 없는 도는 말`);
      continue;
    }
    const claims = rumor.claimIds.map((id) => policy.claims.find((c) => c.id === id)).filter((c): c is Claim => Boolean(c));
    const allowed = allowedValues(claims);
    if (!allowed.includes(v.value)) errors.push(`${where}: 근거로는 「${VERDICT_LABEL[v.value]}」라고 할 수 없다 — 허락되는 판정: ${allowed.map((a) => VERDICT_LABEL[a]).join(", ")}`);
    if (v.approved && v.approved < v.drafted) errors.push(`${where}: 승인일이 초안일보다 앞선다`);
  }
  return errors;
}
