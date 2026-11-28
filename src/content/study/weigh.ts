import { z } from "zod";

/**
 * 잼공 3단계 「따지기」 — docs/jamgong-roadmap.md §3·R4.
 *
 *   확인 수준(A2)  이 말이 확인된 사실인가, 아직 확인되지 않은 말인가.
 *   자료의 무게(A4) 이 말을 가장 단단히 확정해 주는 자료는 무엇인가(법령·통계·판결·공식 발표, 기사는 2차).
 *   비약 찾기(B1)  이 말은 어디서 근거보다 더 나갔나(계획→완료, 전망→확정, 일부→전체, 한쪽 말→사실, 함께→원인).
 *   제목과 근거(B2) 기사 제목이 근거와 같은 말을 하나, 더 세게 말하나, 다른 말을 하나.
 *
 * ★ 정답은 근거로 가려져야 한다. 확인 수준은 claim의 verified·정책의 gaps에서, 자료의 무게는 그 claim의 출처 종류에서 온다(validate.ts가 본다).
 * ★ "아직 확인되지 않았어요"는 "틀렸어요"가 아니다. gap 문장은 사실이 아니라고 말하지 않는다.
 * ★ 비약·제목 문항은 사람이 읽어 정답을 정한다. 초안은 GPT(Codex), 문항마다 원본과 대조했다(docs/jamgong-r4-review.md).
 */

export const checkItemSchema = z.object({
  id: z.string().regex(/^k[0-9]+$/),
  /** verified = 확인된 사실, unverified = 검증 한계가 있는 claim, gap = 정책이 "확인하지 못했다"고 적은 것. */
  kind: z.enum(["verified", "unverified", "gap"]),
  unit: z.string().regex(/^p:[a-z0-9-]+$/),
  claimId: z.string().optional(),
  gapIndex: z.number().int().min(0).optional(),
  statement: z.string().min(15).max(90),
  answer: z.enum(["confirmed", "unconfirmed"]),
  clue: z.string().min(10),
});
export type CheckItem = z.infer<typeof checkItemSchema>;

export const WeightAnswer = z.enum(["legislative", "statistics", "judicial", "official"]);
export type WeightAnswer = z.infer<typeof WeightAnswer>;

export const weightItemSchema = z.object({
  id: z.string().regex(/^g[0-9]+$/),
  unit: z.string().regex(/^[ap]:[a-z0-9-]+$/),
  claimId: z.string(),
  statement: z.string().min(15).max(90),
  answer: WeightAnswer,
  clue: z.string().min(10),
});
export type WeightItem = z.infer<typeof weightItemSchema>;

export const Leap = z.enum(["plan-as-done", "forecast-as-fact", "part-as-whole", "claim-as-fact", "cause"]);
export type Leap = z.infer<typeof Leap>;

export const leapItemSchema = z.object({
  id: z.string().regex(/^l[0-9]+$/),
  /** caveat = 언행 쉽게 보기의 "오해하기 쉬운 대목", x = 알기 단계의 헷갈리기 쉬운 문장(X 문항). */
  source: z.enum(["caveat", "x"]),
  slug: z.string().optional(),
  unit: z.string().regex(/^a:[a-z0-9-]+$/).optional(),
  oxId: z.string().optional(),
  overreach: z.string().min(12).max(90),
  leap: Leap,
  clue: z.string().min(10),
});
export type LeapItem = z.infer<typeof leapItemSchema>;

export const headlineItemSchema = z.object({
  id: z.string().regex(/^h[0-9]+$/),
  unit: z.string().regex(/^[ap]:[a-z0-9-]+$/),
  sourceId: z.string(),
  claimId: z.string(),
  verdict: z.enum(["same", "stronger", "different"]),
  clue: z.string().min(10),
});
export type HeadlineItem = z.infer<typeof headlineItemSchema>;

export const CHECK_ITEMS: CheckItem[] = [
  { id: "k1", kind: "verified", unit: "p:oil-relief-fund", claimId: "claim-budget", statement: "고유가 피해지원금은 2026년 3월 추경안에 4조 8천억 원으로 편성됐다.", answer: "confirmed", clue: "3월 31일 국무회의가 의결한 추경안에서 피해지원금 편성액 4조 8천억 원을 확인할 수 있어요." },
  { id: "k2", kind: "verified", unit: "p:foreigner-health-vote", claimId: "claim-foreign-surplus", statement: "2024년 재외국민을 뺀 외국인 건강보험 재정 흑자는 9,439억 원이다.", answer: "confirmed", clue: "외국인 건강보험의 2024년 재정수지 수치가 9,439억 원 흑자로 제시돼 있어요. 재외국민은 제외한 수치예요." },
  { id: "k3", kind: "verified", unit: "p:prosecution-launch", claimId: "claim-launch", statement: "2026년 10월 2일 검찰청이 폐지되고 중수청과 공소청이 출범했다.", answer: "confirmed", clue: "출범 날짜는 2026년 10월 2일이에요. 중수청 개청식과 공소청 출범식이 열린 사실도 제시돼 있어요." },
  { id: "k4", kind: "verified", unit: "p:new-leap-fund", claimId: "claim-eligibility", statement: "새도약기금은 2025년 10월 1일에 출범했다.", answer: "confirmed", clue: "새도약기금의 출범일이 2025년 10월 1일로 명시돼 있어요." },
  { id: "k5", kind: "verified", unit: "p:child-allowance", claimId: "claim-law", statement: "아동수당법 개정법은 2026년 3월 20일에 공포됐다.", answer: "confirmed", clue: "아동수당법 개정법의 공포일은 3월 20일로 제시돼 있어요. 확대 지급 시작일인 4월 24일과는 달라요." },
  { id: "k6", kind: "verified", unit: "p:teen-support", claimId: "claim-carers", statement: "청년미래센터는 2026년 9월부터 전국 4곳에서 17곳으로 늘었다.", answer: "confirmed", clue: "2026년 9월 지원 내용에 센터 수가 전국 4곳에서 17곳으로 늘었다고 제시돼 있어요." },
  { id: "k7", kind: "verified", unit: "p:national-debt", claimId: "claim-2026-deficit-bond", statement: "2026년 정부 예산안의 적자국채 규모는 110조 원이다.", answer: "confirmed", clue: "2025년 8월 발표된 2026년 예산안이 근거예요. 110조 원은 그 예산안의 적자국채 규모예요." },
  { id: "k8", kind: "verified", unit: "p:krw-exchange-rate", claimId: "claim-june-high", statement: "원·달러 환율은 2026년 6월 6일 장중 1,561.5원까지 올랐다.", answer: "confirmed", clue: "6월 6일 야간거래의 장중 환율 1,561.5원이 제시돼 있어요." },
  { id: "k9", kind: "verified", unit: "p:small-business-support", claimId: "claim-credit", statement: "2025년 소상공인 부담경감 크레딧은 최대 50만 원의 디지털 포인트다.", answer: "confirmed", clue: "부담경감 크레딧의 지급 형태와 한도가 디지털 포인트, 최대 50만 원으로 제시돼 있어요." },
  { id: "k10", kind: "verified", unit: "p:housing-loan-budget", claimId: "claim-2026-fund-cut", statement: "2026년 정책대출용 주택도시기금 재원은 10.3조 원으로 줄었다.", answer: "confirmed", clue: "2025년 14조 원과 2026년 예산의 10.3조 원을 비교하면 감소를 확인할 수 있어요." },
  { id: "k11", kind: "verified", unit: "p:tasks-check-2026", claimId: "claim-referendum-act", statement: "국민투표법 개정안은 2026년 3월 1일 국회 본회의를 통과했다.", answer: "confirmed", clue: "본회의 표결에서 재석 176명 전원이 찬성했다는 날짜와 표결 수치가 제시돼 있어요." },
  { id: "k12", kind: "verified", unit: "p:single-stock-leverage-etf", claimId: "claim-decree", statement: "단일 우량주 레버리지 상품을 허용하는 시행령은 2026년 4월 28일 시행됐다.", answer: "confirmed", clue: "자본시장법 시행령 개정안의 공포·시행일이 4월 28일로 제시돼 있어요." },
  { id: "k13", kind: "unverified", unit: "p:capital-market-meeting-2026", claimId: "claim-followup", statement: "대통령은 자본시장 간담회에서 금융·자본시장 단속 인력을 늘리라고 지시했다.", answer: "unconfirmed", clue: "청와대 공식 브리핑 원문과 대조하지 못했어요. 보도 한 건에 기댄 내용이에요." },
  { id: "k14", kind: "unverified", unit: "p:duplicate-listing-rules", claimId: "claim-limits", statement: "중복상장 제한으로 기업공개 시장이 위축될 것이라는 지적이 나왔다.", answer: "unconfirmed", clue: "평가를 전한 보도를 요약한 내용이에요. 해당 주장을 한 사람의 원문은 확인하지 못했어요." },
  { id: "k15", kind: "unverified", unit: "p:hmm-sale", claimId: "claim-kobc", statement: "해양진흥공사는 HMM 매각에 산업은행보다 보수적인 입장이다.", answer: "unconfirmed", clue: "해양진흥공사의 공식 입장문을 확인하지 못했어요." },
  { id: "k16", kind: "unverified", unit: "p:tbs-funding-2027", claimId: "claim-restriction", statement: "TBS 지원 예산은 교통방송과 외국어방송 용도로만 쓸 수 있다.", answer: "unconfirmed", clue: "의원의 설명을 옮긴 내용이에요. 예산안 부대의견 원문과는 대조하지 못했어요." },
  { id: "k17", kind: "unverified", unit: "p:public-housing-240k", claimId: "claim-modular-fire", statement: "13층 이상 건축물에서 철골 모듈러는 내화 3시간 기준을 충족해야 한다.", answer: "unconfirmed", clue: "건축물의 피난·방화구조 기준에 관한 규칙 원문과 대조하지 못했어요. 보도의 설명이에요." },
  { id: "k18", kind: "unverified", unit: "p:public-rental-rules", claimId: "claim-happy-housing", statement: "행복주택 보증금은 수도권 단지에서 주거급여 수급자에게도 부담이 클 수 있다.", answer: "unconfirmed", clue: "단지별 실제 보증금은 모집공고로 확인하지 못했어요. 부담이 클 수 있다는 말은 임대 조건 구조에서 나온 추론이에요." },
  { id: "k19", kind: "unverified", unit: "p:trial-suspension", claimId: "claim-no-volunteer", statement: "2026년 11월 15일까지 대통령 재판의 재개 기일을 알리는 보도는 없었다.", answer: "unconfirmed", clue: "그날까지의 언론 검색에서 찾지 못했다는 뜻이에요. 법원이 기일 지정을 따로 발표하지 않을 수도 있어요." },
  { id: "k20", kind: "unverified", unit: "p:trial-suspension", claimId: "claim-committee-scope", statement: "2026년 10월 13일 현재 위원회의 조사 결과는 나오지 않았다.", answer: "unconfirmed", clue: "조사 결과 발표 보도를 찾지 못했다는 뜻이에요. 법무부 보도자료 첨부파일의 상세 문구와도 대조하지 못했어요." },
  { id: "k21", kind: "gap", unit: "p:housing-measures", gapIndex: 0, statement: "2025년 부동산 대책들은 현재도 같은 내용으로 적용되고 있다.", answer: "unconfirmed", clue: "이 위키는 2025년 대책들이 현재도 같은 내용으로 적용되는지 확인하지 못했어요." },
  { id: "k22", kind: "gap", unit: "p:mideast-rumors", gapIndex: 1, statement: "중동 위기 소문과 관련한 한국석유공사의 감사 결과가 나왔다.", answer: "unconfirmed", clue: "이 위키는 한국석유공사 감사 결과를 확인하지 못했어요." },
  { id: "k23", kind: "gap", unit: "p:prosecution-launch", gapIndex: 1, statement: "출범한 공소청의 사건 처리 현황은 집계돼 있다.", answer: "unconfirmed", clue: "이 위키는 공소청의 인력과 사건 처리 현황을 확인하지 못했어요." },
  { id: "k24", kind: "gap", unit: "p:youth-jobs", gapIndex: 1, statement: "청년 구직촉진수당 인상에 필요한 예산은 국회 예산에 반영됐다.", answer: "unconfirmed", clue: "이 위키는 수당 인상의 시행일과 국회 예산 반영 여부를 확인하지 못했어요." },
  { id: "k25", kind: "gap", unit: "p:child-allowance", gapIndex: 1, statement: "아동수당 확대에 2030년까지 필요한 연도별 재정 규모가 산출돼 있다.", answer: "unconfirmed", clue: "이 위키는 2030년까지 필요한 연도별 재정 규모를 확인하지 못했어요." },
  { id: "k26", kind: "gap", unit: "p:retirement-pension", gapIndex: 1, statement: "퇴직연금 의무화를 위한 정부 법안은 국회에 제출됐다.", answer: "unconfirmed", clue: "이 위키는 정부 법안 제출 여부와 일시금 선택권 조문을 의안정보시스템으로 확인하지 못했어요." },
  { id: "k27", kind: "gap", unit: "p:unemployment-benefits", gapIndex: 4, statement: "실업급여 개편 법안은 국회에 제출돼 통과됐다.", answer: "unconfirmed", clue: "이 위키는 개편 법안의 국회 제출·통과 여부를 확인하지 못했어요." },
];
export const WEIGHT_ITEMS: WeightItem[] = [
  { id: "g1", unit: "a:stock-market", claimId: "claim-duty", statement: "2025년 개정 상법에는 전체 주주의 이익을 공평하게 대우하는 조항이 신설됐다.", answer: "legislative", clue: "이사의 의무를 정한 조항은 개정 상법 원문으로 확인해요. 기사는 해당 법령을 옮겨 전하는 자료예요." },
  { id: "g2", unit: "a:stock-market", claimId: "claim-buyback", statement: "개정 상법은 자기주식 취득 후 1년 이내 소각을 원칙으로 정했다.", answer: "legislative", clue: "소각 의무와 예외는 법률 제21448호의 조문으로 확인해요. 기사는 해당 법령을 옮겨 전하는 자료예요." },
  { id: "g3", unit: "a:prosecution-reform", claimId: "claim-law", statement: "중대범죄수사청법과 공소청법은 2026년 3월 24일 공포됐다.", answer: "legislative", clue: "두 법의 공포 날짜는 관보와 법령 기록으로 확인해요. 기사는 해당 법령을 옮겨 전하는 자료예요." },
  { id: "g4", unit: "a:judicial-reform", claimId: "claim-pass", statement: "사법개혁 3법은 2026년 3월 12일에 공포됐다.", answer: "legislative", clue: "형법·법원조직법·헌법재판소법 개정의 공포일은 관보에 실린 법률 기록으로 확인해요. 기사는 해당 법령을 옮겨 전하는 자료예요." },
  { id: "g5", unit: "p:unemployment-benefits", claimId: "claim-voluntary-rule", statement: "법령이 정한 정당한 이직 사유가 있으면 자진 퇴사자도 구직급여를 받을 수 있다.", answer: "legislative", clue: "고용보험법 시행규칙 제101조 제2항과 별표 2가 인정 사유를 정해요. 기사는 해당 법령을 옮겨 전하는 자료예요." },
  { id: "g6", unit: "p:unemployment-benefits", claimId: "claim-judgement", statement: "사업주와 짜고 실업급여를 거짓으로 받으면 양쪽 모두 처벌 대상이다.", answer: "legislative", clue: "처벌 대상과 형량은 고용보험법 제116조의 조문으로 확인해요. 기사는 해당 법령을 옮겨 전하는 자료예요." },
  { id: "g7", unit: "p:labor-union-policy", claimId: "claim-linkage", statement: "상급단체의 결산결과도 공표돼야 산하 노조 조합비의 세액공제가 인정된다.", answer: "legislative", clue: "세액공제 요건은 소득세법 시행령 제80조에서 확인해요. 기사는 해당 법령을 옮겨 전하는 자료예요." },
  { id: "g8", unit: "p:labor-union-policy", claimId: "claim-yellow-enacted", statement: "노동조합법 2·3조 개정법은 2026년 3월 10일부터 시행됐다.", answer: "legislative", clue: "개정 노동조합법의 공포·시행 기록으로 시행일을 확인해요. 기사는 해당 법령을 옮겨 전하는 자료예요." },
  { id: "g9", unit: "a:birth-rebound", claimId: "br-2025", statement: "2025년 출생아는 25만 4,341명으로 전년보다 6.7% 늘었다.", answer: "statistics", clue: "출생아 수와 증감률은 국가데이터처의 공식 통계로 확인해요. 기사는 집계 결과를 전하는 자료여서 통계 원표와 대조해야 해요." },
  { id: "g10", unit: "a:stock-market", claimId: "claim-index-series", statement: "코스피는 2026년 6월 18일 종가로 처음 9,000선을 넘었다.", answer: "statistics", clue: "해당 날짜의 지수 종가와 과거 기록은 공식 시계열로 비교해요. 기사는 집계 결과를 전하는 자료여서 통계 원표와 대조해야 해요." },
  { id: "g11", unit: "a:stock-market", claimId: "claim-drawdown", statement: "코스피는 2026년 6월 18일 종가에서 7월 29일 종가까지 약 37.5% 내렸다.", answer: "statistics", clue: "두 날짜의 공식 종가를 비교하면 하락률을 확인할 수 있어요. 기사는 집계 결과를 전하는 자료여서 통계 원표와 대조해야 해요." },
  { id: "g12", unit: "a:stock-market", claimId: "claim-marketcap", statement: "2025년 말 유가증권시장 시가총액은 3,476조 8,000억 원이다.", answer: "statistics", clue: "시장 전체 시가총액은 기준일의 공식 집계로 확인해요. 기사는 집계 결과를 전하는 자료여서 통계 원표와 대조해야 해요." },
  { id: "g13", unit: "p:livelihood-indicators-2026", claimId: "claim-cpi", statement: "2026년 9월 소비자물가는 전년 같은 달보다 2.9% 올랐다.", answer: "statistics", clue: "소비자물가의 기간별 변동률은 국가데이터처 통계로 확인해요. 기사는 집계 결과를 전하는 자료여서 통계 원표와 대조해야 해요." },
  { id: "g14", unit: "p:wildfire-causes", claimId: "claim-stats-2026", statement: "산림청 산불발생현황 표에서 2026년 산불은 457건이다.", answer: "statistics", clue: "산불 발생 건수는 산림청의 산불발생현황 표에서 확인해요. 기사는 집계 결과를 전하는 자료여서 통계 원표와 대조해야 해요." },
  { id: "g15", unit: "p:wildfire-causes", claimId: "claim-other", statement: "2026년 산불발생현황 표에서 원인이 기타로 분류된 산불은 234건이다.", answer: "statistics", clue: "원인별 건수는 공식 통계표의 분류와 수치를 함께 확인해요. 기사는 집계 결과를 전하는 자료여서 통계 원표와 대조해야 해요." },
  { id: "g16", unit: "p:auction-capital-gains", claimId: "claim-taxable", statement: "대법원은 1986년 임의경매도 양도소득세 과세대상인 양도라고 판단했다.", answer: "judicial", clue: "법원의 과세대상 판단은 85누968 판결문으로 확인해요. 기사는 기록 내용을 요약해 전하는 자료예요." },
  { id: "g17", unit: "p:trial-election-law", claimId: "claim-first", statement: "대통령 선거법 사건 1심은 징역 1년에 집행유예 2년을 선고했다.", answer: "judicial", clue: "1심이 선고한 형은 해당 심급의 판결문으로 확인해요. 기사는 기록 내용을 요약해 전하는 자료예요." },
  { id: "g18", unit: "p:trial-election-law", claimId: "claim-appeal", statement: "대통령 선거법 사건 2심은 1심을 파기하고 공소사실 전부를 무죄로 판단했다.", answer: "judicial", clue: "2심의 주문과 무죄 판단 범위는 항소심 판결문으로 확인해요. 기사는 기록 내용을 요약해 전하는 자료예요." },
  { id: "g19", unit: "p:trial-north-remittance", claimId: "claim-lee-final", statement: "대법원은 2025년 6월 5일 이화영 사건에서 피고인과 검사의 상고를 모두 기각했다.", answer: "judicial", clue: "상고 기각과 확정 여부는 2025도810 판결 기록으로 확인해요. 기사는 기록 내용을 요약해 전하는 자료예요." },
  { id: "g20", unit: "p:trial-suspension", claimId: "claim-remand-assigned", statement: "서울고법은 2025년 5월 2일 선거법 파기환송 사건을 형사7부에 배당했다.", answer: "judicial", clue: "사건을 어느 재판부에 맡겼는지는 법원의 배당 기록으로 확인해요. 기사는 기록 내용을 요약해 전하는 자료예요." },
  { id: "g21", unit: "a:inbound-tourism", claimId: "tr-visa-sea", statement: "동남아 11개국 대상 복수사증 발급 요건은 2026년 3월 30일부터 완화됐다.", answer: "official", clue: "정부가 정한 사증 발급 요건과 적용일은 공식 발표 자료로 확인해요. 기사는 그 발표 내용을 옮기는 자료예요." },
  { id: "g22", unit: "a:inbound-tourism", claimId: "tr-china-visa", statement: "중국 단체관광객 한시 무비자 시행 기간은 2026년 12월 31일까지 연장됐다.", answer: "official", clue: "시행 기간 연장 내용은 법무부의 공식 안내로 확인해요. 기사는 그 발표 내용을 옮기는 자료예요." },
  { id: "g23", unit: "a:youth-future-savings", claimId: "ys-launch-fact", statement: "청년미래적금은 2026년 6월 22일 가입 신청을 시작했다.", answer: "official", clue: "상품 신청 시작일은 담당 기관의 공식 안내로 확인해요. 기사는 그 발표 내용을 옮기는 자료예요." },
  { id: "g24", unit: "a:youth-future-savings", claimId: "ys-product", statement: "청년미래적금은 월 최대 50만 원을 자유 납입하는 3년 만기 상품이다.", answer: "official", clue: "상품의 납입 한도와 만기는 담당 기관의 공식 상품 안내로 확인해요. 기사는 그 발표 내용을 옮기는 자료예요." },
];
export const LEAP_ITEMS: LeapItem[] = [
  { id: "l1", source: "caveat", slug: "comics-day", overreach: "정부는 만화 작가들을 위한 지역별 창작 거점을 이미 만들었다.", leap: "plan-as-done", clue: "원문은 내년에 지역별 창작 거점을 만들겠다는 계획이에요. 이미 조성했다는 말은 없어요." },
  { id: "l2", source: "caveat", slug: "housing-myth", overreach: "서울의 주택 공급 부족은 2028년 무렵부터 확실히 해소된다.", leap: "forecast-as-fact", clue: "2028년 무렵 공급 부족이 풀릴 것이라는 대통령의 전망이에요. 확정된 결과로 볼 수 없어요." },
  { id: "l3", source: "caveat", slug: "budget-post-2027", overreach: "2027년 예산안은 국회에서 이미 확정된 예산이다.", leap: "plan-as-done", clue: "글을 올린 때는 예산안을 국회에 설명한 단계예요. 국회 확정까지 끝난 것이 아니에요." },
  { id: "l4", source: "caveat", slug: "budget-speech-2027", overreach: "외환위기 공적자금 상환은 예산 연설 당시 이미 모두 끝났다.", leap: "plan-as-done", clue: "대통령은 내년이면 상환이 끝난다고 했어요. 연설 당시 상환을 마쳤다는 뜻이 아니에요." },
  { id: "l5", source: "caveat", slug: "local-corruption", overreach: "지역 공직사회 전체로 넓힌 2차 특별단속은 이미 끝났다.", leap: "plan-as-done", clue: "2차 특별단속은 11월부터 이어가겠다는 일이에요. 그 결과는 이 글에 없어요." },
  { id: "l6", source: "caveat", slug: "itaewon-4th", overreach: "이태원 참사의 진실 규명과 재발 방지 조치는 이미 모두 이뤄졌다.", leap: "plan-as-done", clue: "원문은 의문이 남지 않게 진실을 밝히고 재발 방지로 이어가겠다는 다짐이에요." },
  { id: "l7", source: "caveat", slug: "hybrid-policy", overreach: "시제품 선도구매에 나선 공무원을 위한 감사면책 제도는 이미 마련됐다.", leap: "plan-as-done", clue: "감사면책 같은 보호 장치는 앞으로 준비하겠다고 했어요. 이 글 시점에 마련된 것은 아니에요." },
  { id: "l8", source: "caveat", slug: "firefighter-sacrifice", overreach: "소방대원의 안전대책 점검과 처우 개선은 이미 완료됐다.", leap: "plan-as-done", clue: "안전대책을 점검하고 처우를 살피겠다는 약속이에요. 구체적으로 바꾼 내용은 이 글에 없어요." },
  { id: "l9", source: "caveat", slug: "regional-balance-year", overreach: "지방 국립대 지원자 증가는 지역균형발전 정책 때문에 일어났다.", leap: "cause", clue: "지원자 변화가 정책 때문이라는 말은 대통령의 평가예요. 이 위키가 정책의 인과 효과를 따로 확인한 것은 아니에요." },
  { id: "l10", source: "caveat", slug: "green-transition", overreach: "녹색 대전환 전략에 따른 지역의 새 일거리는 이미 만들어졌다.", leap: "plan-as-done", clue: "이날은 전략을 논의한 날이에요. 지역 일거리를 만들겠다는 내용이지 실제 성과를 확인한 내용은 아니에요." },
  { id: "l11", source: "caveat", slug: "ex-prosecutor-nominee", overreach: "논란이 된 검사 출신 후보자의 임명은 이미 끝났다.", leap: "plan-as-done", clue: "임명을 끝냈다는 글이 아니에요. 후보를 바꿀지 아직 고민하고 판단하는 중이라고 했어요." },
  { id: "l12", source: "caveat", slug: "youth-day", overreach: "청년 문제를 한곳에서 맡는 전담 조직은 이미 신설됐다.", leap: "plan-as-done", clue: "전담 조직은 고민하고 있다는 단계예요. 언제 어떻게 만들지는 정해지지 않았어요." },
  { id: "l13", source: "caveat", slug: "chuseok-press-conference", overreach: "추석 기자회견 당시 행정수도 세종은 이미 완성됐다.", leap: "plan-as-done", clue: "회견에서는 행정수도 세종을 빨리 완성하겠다고 했어요. 이미 완성했다는 내용은 아니에요." },
  { id: "l14", source: "caveat", slug: "oil-price", overreach: "한국의 중동 원유 수입 비중이 50%대로 낮아진 사실은 확인됐다.", leap: "claim-as-fact", clue: "50%대로 낮췄다는 것은 대통령의 말이에요. 이 위키가 찾은 정부 통계는 2026년 1~5월의 62.8%까지예요." },
  { id: "l15", source: "caveat", slug: "developmental-care", overreach: "발달장애인을 위한 24시간 돌봄과 낮 활동 지원 확대는 이미 끝났다.", leap: "plan-as-done", clue: "일어난 일은 대책 발표까지예요. 24시간 돌봄과 낮 활동 지원 확대는 앞으로 하겠다는 내용이에요." },
  { id: "l16", source: "caveat", slug: "housing-supply", overreach: "내년 1분기의 금리는 반드시 3.5%가 된다.", leap: "forecast-as-fact", clue: "3.5%는 기사에 실린 전망이에요. 같은 글에서 금리는 정부가 정하는 것이 아니라고 밝혀요." },
  { id: "l17", source: "caveat", slug: "bent-arm-tax", overreach: "2017년 책에 담긴 법인세 새 구간 도입은 이미 실행됐다.", leap: "plan-as-done", clue: "책에는 새 법인세 구간을 만들자는 제안을 추진하겠다고 적혀 있어요. 실제 세율 변화는 이 글로 알 수 없어요." },
  { id: "l18", source: "x", unit: "a:export-surplus", oxId: "ox4", overreach: "IMF가 내놓은 한국의 연간 경상흑자 예상은 전망이 아니라 이미 확정된 통계다.", leap: "forecast-as-fact", clue: "제시된 연간 경상흑자는 국제통화기금의 세계경제전망에 담긴 예상치예요. 확정 통계가 아니에요." },
  { id: "l19", source: "x", unit: "a:inbound-tourism", oxId: "ox4", overreach: "문화체육관광부는 자료 기준일에 연말 관광객 목표를 이미 달성했다고 발표했다.", leap: "forecast-as-fact", clue: "문화체육관광부는 연말까지 목표를 달성할 수 있다고 전망했어요. 자료 기준일에는 아직 달성 전이에요." },
  { id: "l20", source: "x", unit: "a:birth-rebound", oxId: "ox4", overreach: "국가데이터처는 2025년 출생아 증가가 정부 정책의 효과라고 통계 발표에서 밝혔다.", leap: "cause", clue: "국가데이터처 발표는 2025년 출생아 증가 원인을 따로 밝히지 않았어요. 증가 수치만으로 정책 효과를 단정할 수 없어요." },
  { id: "l21", source: "x", unit: "a:daejangdong", oxId: "ox3", overreach: "성남시는 대장동 개발이익 환수액 전체를 현금 배당으로 받았다고 설명했다.", leap: "part-as-whole", clue: "현금 배당은 확정이익 1,822억 원이에요. 공원과 기반시설 등 현물 환수도 포함돼 있어요." },
  { id: "l22", source: "x", unit: "a:stock-market", oxId: "ox3", overreach: "개정 상법에 따르면 회사가 사들인 자기주식은 용도와 관계없이 예외 없이 소각해야 한다.", leap: "part-as-whole", clue: "소각은 원칙이지만 임직원 보상 등에는 주주총회 승인을 통한 예외가 있어요. 예외 없는 전체 의무는 아니에요." },
  { id: "l23", source: "x", unit: "a:stock-market", oxId: "ox4", overreach: "일반주주도 경영권 프리미엄을 나누는 의무공개매수 제도는 이미 시행된 제도다.", leap: "plan-as-done", clue: "의무공개매수 제도는 자본시장법 개정으로 추진 중이에요. 이미 시행 중인 제도는 아니에요." },
  { id: "l24", source: "x", unit: "a:seongnam-meals", oxId: "ox3", overreach: "성남시 무상급식은 사업을 시작할 때부터 고등학생까지 모두 지원하는 방식이었다.", leap: "part-as-whole", clue: "무상급식은 2007년 초등학교 1학년부터 시작됐어요. 고등학교 전면 시행은 2018년 2학기부터예요." },
  { id: "l25", source: "x", unit: "a:gyeonggi-valley", oxId: "ox4", overreach: "경기도의 2021년 중간 집계에서는 계곡 불법시설이 모두 정비돼 소송 중인 시설도 남지 않았다.", leap: "part-as-whole", clue: "2021년 6월 말 정비율은 98.7%예요. 실제 주거시설과 소송 중인 시설 25개가 남아 있었어요." },
  { id: "l26", source: "x", unit: "a:gyeonggi-basic-income", oxId: "ox4", overreach: "3차 재난기본소득도 정부 지원금 수령 여부와 관계없이 모든 경기도민에게 지급됐다.", leap: "part-as-whole", clue: "3차 지급 대상은 정부 상생 국민지원금에서 제외된 소득상위 12%예요. 모든 도민을 대상으로 한 지급은 아니에요." },
  { id: "l27", source: "x", unit: "a:nuclear-submarine", oxId: "ox3", overreach: "핵추진잠수함 건조 승인은 정부가 계획한 잠수함의 건조와 전력 배치까지 끝났다는 뜻이다.", leap: "plan-as-done", clue: "제시된 것은 앞으로의 건조·전력화 계획이에요. 착공은 2031년 이후, 전력화는 2030년대 후반이 목표예요." },
  { id: "l28", source: "x", unit: "a:resource-diplomacy", oxId: "ox4", overreach: "과거 이명박 정부의 자원외교에서는 체결한 양해각서가 모두 본계약으로 이어졌다.", leap: "part-as-whole", clue: "당시 체결한 양해각서 96건 가운데 본계약으로 이어진 것은 16건이에요. 일부 성사를 전체 성사로 넓혔어요." },
  { id: "l29", source: "x", unit: "a:mexico-visit", oxId: "ox4", overreach: "한·멕시코는 이번 정상회담에서 무역협정 체결까지 마쳤다.", leap: "plan-as-done", clue: "양국은 무역협정 체결을 위한 공동 이익 연구에 착수하기로 합의했어요. 무역협정 체결을 마친 단계가 아니에요." },
];
export const HEADLINE_ITEMS: HeadlineItem[] = [
  { id: "h1", unit: "a:export-surplus", sourceId: "src-es-chosun-1025", claimId: "es-q2-rank", verdict: "stronger", clue: "제목은 세계 2위라고 하지만 근거의 비교 범위는 같은 분기 수치가 확인되는 주요 36개국이에요. 비교 범위를 세계 전체로 넓혔어요." },
  { id: "h2", unit: "p:new-leap-fund", sourceId: "src-newsis-launch-1001", claimId: "claim-screening", verdict: "stronger", clue: "제목은 113만 명의 빚 16.4조 원 탕감을 내세우지만 근거는 사들인 채권을 모두 소각하지 않는다고 해요. 전액 소각은 소득·재산 요건을 충족할 때만 이뤄져요." },
  { id: "h3", unit: "p:youth-jobs", sourceId: "src-sbs-moel-0804", claimId: "claim-voluntary-quit", verdict: "stronger", clue: "제목은 자발적 이직 청년도 실업급여를 받는다고 읽히지만 근거는 법 개정 전 추진 단계라 현재는 받을 수 없다고 해요." },
  { id: "h4", unit: "p:labor-union-policy", sourceId: "src-sbsbiz-20260727", claimId: "claim-2026-change", verdict: "stronger", clue: "제목은 연동 폐지라고 하지만 근거는 시행령 개정안을 입법예고할 계획이라고 해요. 앞으로의 절차를 끝난 변경처럼 표현했어요." },
  { id: "h5", unit: "p:nk-medical-aid", sourceId: "src-wikitree-20261007", claimId: "claim-tentative", verdict: "stronger", clue: "제목은 지원 확정이라고 하지만 근거는 북측 협의가 필요한 잠정안이라고 해요. 규격과 단가도 바뀔 수 있어요." },
  { id: "h6", unit: "p:illegal-sports-betting", sourceId: "src-segye-20260815", claimId: "claim-reward", verdict: "stronger", clue: "제목은 신고하면 최대 2억 원이라고 하지만 근거에서 그 한도는 운영자 신고에 적용돼요. 사이트 신고는 1건 1만 5천 원으로, 신고 종류에 따라 달라요." },
  { id: "h7", unit: "p:livelihood-indicators-2026", sourceId: "src-inews24-2010236", claimId: "claim-tax", verdict: "stronger", clue: "제목은 올해 국세 478.6조 원을 기록한 것처럼 말하지만 근거는 국세수입을 다시 추계한 내용이에요. 실제로 걷힌 확정액보다 확실하게 표현했어요." },
  { id: "h8", unit: "a:export-surplus", sourceId: "src-es-jkn-1025", claimId: "es-q2-dejp", verdict: "same", clue: "제목의 독일·일본 합계 추월과 근거의 두 나라 합계보다 한국이 137억 4,000만 달러 많다는 내용은 같아요. 비교 시점도 2026년 2분기예요." },
  { id: "h9", unit: "a:export-surplus", sourceId: "src-es-fn-1119", claimId: "es-fourth", verdict: "same", clue: "제목의 세계 네 번째는 근거의 독일·미국·중국에 이은 한국의 순서와 같아요. 수출 1조 달러를 넘긴 국가 순서를 말해요." },
  { id: "h10", unit: "a:inbound-tourism", sourceId: "src-tr-khan-1027", claimId: "tr-record", verdict: "same", clue: "제목의 역대 최고치 기록을 두 달 앞당겨 경신했다는 말과 근거의 종전 기록을 두 달가량 빨리 넘었다는 말은 같아요." },
  { id: "h11", unit: "a:inbound-tourism", sourceId: "src-tr-newsis-visa-0907", claimId: "tr-china-visa", verdict: "same", clue: "제목의 중국 단체관광객 15일 내 무비자 관광은 근거의 단체관광객 한시 무비자와 15일 이내 체류 조건에 맞아요." },
  { id: "h12", unit: "a:seongnam-meals", sourceId: "src-press-2018", claimId: "claim-highschool", verdict: "same", clue: "제목의 고등학교 무상급식 전면 시행은 근거의 2018년 2학기 고등학교 전면 시행과 같아요." },
  { id: "h13", unit: "a:gyeonggi-child-meal", sourceId: "src-safetimes-2020", claimId: "claim-card", verdict: "same", clue: "제목의 모든 일반음식점 사용 가능과 국내 최초는 근거에도 그대로 들어 있어요. 적용 지역도 경기도로 같아요." },
  { id: "h14", unit: "a:judicial-reform", sourceId: "src-nate-jr-2026", claimId: "claim-pass", verdict: "same", clue: "제목의 사법개혁 3법 완성은 국회 통과를 말해요. 근거도 세 개정안이 모두 국회를 지났다고 해요." },
  { id: "h15", unit: "a:rail-merger", sourceId: "src-koreadaily-rm", claimId: "claim-merge", verdict: "same", clue: "제목의 통합 완료와 9월 1일 통합 운행은 근거의 8월 말 법정·행정 절차 완료와 9월 1일 운행 시작에 맞아요." },
  { id: "h16", unit: "p:tasks-check-2026", sourceId: "src-hellodd-rnd", claimId: "claim-rnd-budget", verdict: "same", clue: "제목의 정부 연구개발 예산 35조 5천억 원 확정과 근거의 국회 확정 금액이 같아요." },
  { id: "h17", unit: "p:oda-budget", sourceId: "src-newsis-20260226", claimId: "claim-2026", verdict: "same", clue: "제목의 5조 4,372억 원 확정과 전년 대비 약 1조 원 감소는 근거의 확정액과 1조 655억 원 감소에 맞아요." },
];
