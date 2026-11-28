import { z } from "zod";

/**
 * 잼공 2단계 「가리기」 — 숫자 읽기(기술 A3). docs/jamgong-roadmap.md §3·R2.
 *
 * 업적의 핵심 숫자 하나를 보고, 이미 확정된 실적인지 / 잠정·누적 집계인지 / 전망·추정인지 / 목표·계획인지 고른다.
 * 숫자를 맞히게 하지 않는다. 숫자의 **성격**을 묻는다 — 전망을 실적처럼 말하는 것이 가장 흔한 비약이다.
 *
 * ★ kind는 근거 claim의 문장으로 가려져야 한다. clue는 그 문장 속 단서 낱말을 인용한다.
 *   validate.ts가 kind와 claim 문장의 단서 낱말(전망·잠정·목표…)이 어긋나지 않는지 본다.
 * ★ 초안은 GPT(Codex)가 claim만 보고 썼고, 문항마다 원본 claim과 대조해 고쳤다(2026-11-28, docs/jamgong-r2-review.md).
 */
export const NumberKind = z.enum(["actual", "provisional", "forecast", "target"]);
export type NumberKind = z.infer<typeof NumberKind>;

export const NUMBER_KIND_LABEL: Record<NumberKind, string> = {
  actual: "이미 확정된 실적",
  provisional: "잠정·누적 집계",
  forecast: "전망·추정",
  target: "목표·계획",
};

export const numberItemSchema = z.object({
  id: z.string().regex(/^n[0-9]+$/),
  unit: z.string().regex(/^a:[a-z0-9-]+$/),
  keyNumberId: z.string(),
  claimId: z.string(),
  kind: NumberKind,
  question: z.string().min(15).max(90),
  clue: z.string().min(10),
});
export type NumberItem = z.infer<typeof numberItemSchema>;

export const NUMBER_ITEMS: NumberItem[] = [
  { id: "n1", unit: "a:export-surplus", keyNumberId: "es-q2-surplus", claimId: "es-q2", kind: "actual", question: "「2026년 2분기 경상수지 흑자 1,166억 3,000만 달러」는 어떤 숫자일까요?", clue: "근거에 해당 분기 흑자가 이 금액이었다고 적혀 있어요. 국제통화기금 통계를 인용한 수치예요." },
  { id: "n2", unit: "a:arctic-route", keyNumberId: "kn-trial", claimId: "claim-trial-voyage", kind: "actual", question: "「부산에서 펠릭스토우까지 시범운항 20일 5시간」은 어떤 숫자일까요?", clue: "근거에 '실제 수출 컨테이너 화물을 싣고' 출항해 '도착했고'라고 적혀 있어요. 실제 운항에 걸린 시간이에요." },
  { id: "n3", unit: "a:stock-market", keyNumberId: "kn-peak", claimId: "claim-index-series", kind: "actual", question: "「2026년 6월 18일 코스피 사상 첫 9,000선 돌파」는 어떤 숫자일까요?", clue: "근거에 '2026년 6월 18일 종가'로 처음 넘었다고 적혀 있어요. 그날 기록된 지수예요." },
  { id: "n4", unit: "a:stock-market", keyNumberId: "kn-drawdown", claimId: "claim-drawdown", kind: "actual", question: "「2026년 7월 29일 코스피 고점 대비 약 37.5% 하락」은 어떤 숫자일까요?", clue: "근거에 고점 대비 그날 종가까지 '약 37.5% 하락했다'고 적혀 있어요. 이미 기록된 두 종가를 비교한 값이에요." },
  { id: "n5", unit: "a:stock-market", keyNumberId: "kn-marketcap", claimId: "claim-marketcap", kind: "actual", question: "「2025년 말 유가증권시장 시가총액 3,476조 8,000억 원」은 어떤 숫자일까요?", clue: "근거에 '2025년 말' 시가총액이 이 금액으로 늘었다고 적혀 있어요. 연말에 기록된 규모예요." },
  { id: "n6", unit: "a:seongnam-welfare", keyNumberId: "kn-uniform", claimId: "claim-uniform-universal", kind: "actual", question: "「2021년 성남시 무상교복 지원 인원 1만7,928명」은 어떤 숫자일까요?", clue: "근거에 '2021년에는' 이 인원에게 '지원했고'라고 적혀 있어요. 실제 지원받은 학생 수예요." },
  { id: "n7", unit: "a:seongnam-debt", keyNumberId: "kn-zero", claimId: "claim-zero", kind: "actual", question: "「2018년 성남시 일반회계 채무 상환 뒤 남은 특별회계 채무 9억 원」은 어떤 숫자일까요?", clue: "근거에 '2018년 1월 29일' 일반회계 채무를 전액 상환했다고 적혀 있어요. 그때 제외하고 남은 특별회계 채무예요." },
  { id: "n8", unit: "a:gyeonggi-or-cctv", keyNumberId: "kn-consent", claimId: "claim-consent", kind: "actual", question: "「경기도의료원 수술 촬영·녹화 환자 동의율 67%」는 어떤 숫자일까요?", clue: "근거에 '2018년 10월부터 2019년 12월까지' 이뤄진 수술 중 '촬영·녹화됐다'고 적혀 있어요. 완료된 수술 기록의 비율이에요." },
  { id: "n9", unit: "a:gyeonggi-ilsan-bridge", keyNumberId: "kn-days", claimId: "claim-back", kind: "actual", question: "「2021년 일산대교에서 통행료를 받지 않은 22일」은 어떤 숫자일까요?", clue: "근거에 '2021년 11월 18일 0시부터' 징수가 '재개됐다'고 적혀 있어요. 무료 통행 시작부터 재개까지 실제 지난 기간이에요." },
  { id: "n10", unit: "a:rail-merger", keyNumberId: "kn-fare", claimId: "claim-fare", kind: "actual", question: "「고속철도 통합에 따른 운임 평균 10% 인하」는 어떤 숫자일까요?", clue: "근거에 운임이 '조정돼' 구간에 따라 평균 10% '낮아졌다'고 적혀 있어요. 실제 조정된 운임의 변화예요." },
  { id: "n11", unit: "a:oil-supply", keyNumberId: "kn-gas", claimId: "claim-price", kind: "actual", question: "「2026년 9월 6~10일 휘발유 리터당 평균 1,859.1원」은 어떤 숫자일까요?", clue: "근거의 '2026년 9월 6~10일' 전국 주유소 평균 판매가는 해당 기간에 기록된 가격이에요." },
  { id: "n12", unit: "a:export-surplus", keyNumberId: "es-1t", claimId: "es-1t", kind: "provisional", question: "「2026년 11월 19일 연간 누적 수출 1조 달러 돌파」는 어떤 숫자일까요?", clue: "근거에 '잠정 집계'와 '연간 누적'이라고 적혀 있어요. 연간 확정치가 아니라고도 명시돼 있어요." },
  { id: "n13", unit: "a:export-surplus", keyNumberId: "es-sep", claimId: "es-sep", kind: "provisional", question: "「2026년 9월 경상수지 흑자 614억 6,000만 달러」는 어떤 숫자일까요?", clue: "근거 자료 제목에 '국제수지(잠정)'이라고 적혀 있어요. 해당 발표는 잠정 통계예요." },
  { id: "n14", unit: "a:birth-rebound", keyNumberId: "br-cum-n", claimId: "br-cum", kind: "provisional", question: "「2026년 1~8월 누적 출생아 증가율 14.5%」는 어떤 숫자일까요?", clue: "근거에 '1~8월 누적 출생아'라고 적혀 있어요. 한 해 전체가 아니라 그 기간까지 쌓인 출생아의 증가율이에요." },
  { id: "n15", unit: "a:youth-future-savings", keyNumberId: "ys-applications", claimId: "ys-demand", kind: "provisional", question: "「2026년 7월 2일 13시 적금 누적 가입 신청 201.2만 명」은 어떤 숫자일까요?", clue: "근거에 '13시 누적 가입 신청자'라고 적혀 있어요. 자격심사와 계좌 개설은 별도로 진행돼요." },
  { id: "n16", unit: "a:gyeonggi-valley", keyNumberId: "kn-removed", claimId: "claim-2021", kind: "provisional", question: "「2021년 6월 30일 기준 경기도 불법시설 정비 1,576개」는 어떤 숫자일까요?", clue: "근거에 '2021년 6월 30일 기준'이라고 적혀 있어요. 그날까지 정비된 수이고 남은 시설도 있어요." },
  { id: "n17", unit: "a:prosecution-reform", keyNumberId: "kn-staff", claimId: "claim-staffing", kind: "provisional", question: "「2026년 9월 16일 기준 중대범죄수사청 지원율 61.3%」는 어떤 숫자일까요?", clue: "근거에 '2026년 9월 16일 기준' 지원자 수라고 적혀 있어요. 기준일 현재의 지원 현황이에요." },
  { id: "n18", unit: "a:arctic-route", keyNumberId: "kn-days", claimId: "claim-route-comparison", kind: "forecast", question: "「북극항로 부산항~로테르담 운항 기간 20~24일」은 어떤 숫자일까요?", clue: "근거에 특정 선박과 '7~10월 기준 분석한 결과'라고 적혀 있어요. 조건을 정해 분석한 운항 기간이에요." },
  { id: "n19", unit: "a:daejangdong", keyNumberId: "kn-recovery", claimId: "claim-recovery-total", kind: "forecast", question: "「성남시가 계산한 대장동 공공 환수 약 5,503억 원」은 어떤 숫자일까요?", clue: "근거에 '성남시의 계산'이며 '환수 범위를 어디까지로 볼지에 따라 셈이 달라'진다고 적혀 있어요. 확정 실적이 아니라 계산 범위에 따른 추정 규모예요." },
  { id: "n20", unit: "a:inbound-tourism", keyNumberId: "tr-target", claimId: "tr-forecast", kind: "target", question: "「연말 방한 외국인 관광객 정부 목표 2,300만 명」은 어떤 숫자일까요?", clue: "근거에 '정부 목표치'라고 적혀 있어요. 기준일 현재 달성 전인 목표 인원이에요." },
  { id: "n21", unit: "a:seongnam-welfare", keyNumberId: "kn-budget", claimId: "claim-budget-2016", kind: "target", question: "「2016년 성남시 세 가지 복지사업 예산 194억 원」은 어떤 숫자일까요?", clue: "근거에 세 사업의 금액이 '2016년 예산안'에 담겼다고 적혀 있어요. 실제 지출액이 아니라 예산안의 금액을 묻는 문장이에요." },
  { id: "n22", unit: "a:gyeonggi-basic-income", keyNumberId: "kn-second-budget", claimId: "claim-second", kind: "target", question: "「2021년 경기도 2차 재난기본소득 소요 예산 1조 4,035억 원」은 어떤 숫자일까요?", clue: "근거에 '소요 예산'이라고 적혀 있어요. 지급액과 부대경비를 포함해 마련한 예산 규모예요." },
  { id: "n23", unit: "a:gyeonggi-or-cctv", keyNumberId: "kn-support", claimId: "claim-private", kind: "target", question: "「경기도 민간병원 수술실 촬영장비 설치비 지원 3천만 원씩」은 어떤 숫자일까요?", clue: "근거에 설치비를 '지원하기로 했다'고 적혀 있어요. 병원별로 지원하기로 정한 금액이에요." },
  { id: "n24", unit: "a:nuclear-submarine", keyNumberId: "kn-launch", claimId: "claim-plan", kind: "target", question: "「핵추진잠수함 1번함 진수 시점 2030년대 중반」은 어떤 숫자일까요?", clue: "근거에 사업이 '윤곽으로 제시됐다'고 적혀 있어요. 1번함 진수는 실제 진수 기록이 아니라 사업에서 제시한 일정이에요." },
  { id: "n25", unit: "a:housing-stabilization", keyNumberId: "hs-supply", claimId: "hs-supply", kind: "target", question: "「2026~2030년 수도권 주택 착공 135만 호」는 어떤 숫자일까요?", clue: "근거에 '착공 기준 계획이며 실적은 아니다'라고 적혀 있어요. 공급 확대방안이 제시한 계획 물량이에요." },
];
