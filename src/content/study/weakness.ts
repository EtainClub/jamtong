import { z } from "zod";

/**
 * 잼공 4단계 「답하기」 — 약점 먼저 말하기(기술 C3). docs/jamgong-roadmap.md §3·R3.
 *
 * 정부 정책에 제기된 비판·한계(critiqueIds) 하나를, 같은 정책의 다른 사실 둘과 섞어 보여 주고 "비판·한계로 나온 것"을 고른다.
 * 상대가 꺼내기 전에 약점을 먼저 인정하면 나머지 말이 믿음을 얻는다 — 그 약점을 알고 있어야 먼저 말할 수 있다.
 *
 * ★ critique는 그 정책의 critiqueIds 가운데 하나, decoys는 critiqueIds가 아닌 사실이다. 모두 확인된(verified) claim.
 * ★ 비판이 누군가의 주장·의견이면 label에 그 사람을 남긴다.
 * ★ 초안은 GPT(Codex)가 claim만 보고 썼고, 문항마다 원본과 대조해 고쳤다(docs/jamgong-r3-review.md).
 */
const pick = z.object({ claimId: z.string(), label: z.string().min(8).max(70) });

export const weaknessItemSchema = z.object({
  id: z.string().regex(/^w[0-9]+$/),
  unit: z.string().regex(/^p:[a-z0-9-]+$/),
  critique: pick,
  decoys: z.array(pick).length(2),
  /** 이 한계를 먼저 인정하면 왜 좋은가. */
  why: z.string().min(10),
});
export type WeaknessItem = z.infer<typeof weaknessItemSchema>;

export const WEAKNESS_ITEMS: WeaknessItem[] = [
  {
    id: "w1",
    unit: "p:retirement-pension",
    critique: { claimId: "claim-severance-decline", label: "노동부 관계자는 퇴직금 제도 비중이 줄 것으로 전망" },
    decoys: [{ claimId: "claim-tripartite", label: "2026년 2월 6일 퇴직연금 노사정 공동선언 발표" }, { claimId: "claim-fund-type", label: "기금형 퇴직연금은 기존 계약형과 병행 도입" }],
    why: "퇴직금 제도의 비중이 줄어든다는 전망을 먼저 짚으면, 일시금 수령 보장과 제도 변화의 의미를 구분해 설명할 수 있어요.",
  },
  {
    id: "w2",
    unit: "p:national-debt",
    critique: { claimId: "claim-debt-growth", label: "2026~2030년 계획상 국가채무 약 320조 원 증가" },
    decoys: [{ claimId: "claim-2026-final", label: "국회는 2026년 총지출을 728조 원으로 확정" }, { claimId: "claim-2026-issuance", label: "2026년 국고채 총발행 한도는 225.7조 원" }],
    why: "계획대로여도 채무가 늘어난다는 점을 먼저 말하면, 한 해 예산 규모와 중기 채무 전망을 함께 살필 수 있어요.",
  },
  {
    id: "w3",
    unit: "p:unemployment-benefits",
    critique: { claimId: "claim-no-repeat-limit", label: "현행 제도에는 실업급여 반복 수급 자체의 제한 없음" },
    decoys: [{ claimId: "claim-voluntary-rule", label: "정당한 이직 사유가 있으면 자진 퇴사도 수급 가능" }, { claimId: "claim-judgement", label: "정당한 이직 사유 인정은 고용센터가 판단" }],
    why: "반복 수급 자체의 제한이 없음을 먼저 인정하면, 부정수급 처벌과 반복 수급의 제도 문제를 구분해 설명할 수 있어요.",
  },
  {
    id: "w4",
    unit: "p:honam-chip-cluster",
    critique: { claimId: "claim-airport-relocation", label: "광주 군공항 이전 절차가 멈춰 클러스터 입지에 제약" },
    decoys: [{ claimId: "claim-site-decision", label: "2026년 7월 6일 클러스터 부지를 광주 군공항으로 결정" }, { claimId: "claim-site-reason", label: "청와대는 평탄화된 국유지 등을 부지 선정 이유로 제시" }],
    why: "군공항이 옮겨야 한다는 조건을 먼저 말하면, 부지 선정과 실제 클러스터 조성 가능성을 나눠 설명할 수 있어요.",
  },
  {
    id: "w5",
    unit: "p:child-benefits-total",
    critique: { claimId: "claim-fund-status", label: "우리아이자립펀드는 2026년 10월 현재 가입 불가" },
    decoys: [{ claimId: "claim-first-voucher", label: "첫만남이용권은 첫째 200만 원·둘째 이상 300만 원" }, { claimId: "claim-fund-plan", label: "자립펀드 계획의 부모·정부 합산 납입 한도는 연 200만 원" }],
    why: "아직 가입할 수 없다는 점을 먼저 말하면, 지금 쓰는 출산 지원과 앞으로 출시할 펀드를 구분해 설명할 수 있어요.",
  },
  {
    id: "w6",
    unit: "p:housing-loan-budget",
    critique: { claimId: "claim-fund-shortage", label: "주택도시기금의 2025년 말 여유자금은 최대치의 30% 수준" },
    decoys: [{ claimId: "claim-2026-interest-subsidy", label: "2026년 정책대출 이차보전 예산은 1.97조 원" }, { claimId: "claim-molit-2026", label: "국토부는 이차보전 우선 활용으로 대출 공급 가능 설명" }],
    why: "기금 여유자금 감소를 먼저 인정하면, 기금 재원과 은행 재원을 활용한 이차보전 방식을 나눠 설명할 수 있어요.",
  },
  {
    id: "w7",
    unit: "p:labor-union-policy",
    critique: { claimId: "claim-linkage", label: "상급단체가 미공시하면 산하 조합원도 세액공제 제외" },
    decoys: [{ claimId: "claim-yellow-enacted", label: "노란봉투법은 2026년 3월 10일 시행" }, { claimId: "claim-2026-change", label: "2025년 기준 노조 회계공시 참여율은 89.1%" }],
    why: "상급단체 미공시가 산하 조합원에게도 영향을 준다는 점을 먼저 말하면, 공시 제도와 연동 규정을 구분해 설명할 수 있어요.",
  },
  {
    id: "w8",
    unit: "p:consumption-coupon",
    critique: { claimId: "claim-govt-limits", label: "소비쿠폰 효과 분석에서 지역사랑상품권 지급분 제외" },
    decoys: [{ claimId: "claim-scheme", label: "1차 소비쿠폰 기본 지급액은 1인당 15만 원" }, { claimId: "claim-kdi-govt", label: "기재부는 쿠폰 사용 업종 매출 평균 4.93% 증가 발표" }],
    why: "분석에서 빠진 지급 방식이 있음을 먼저 밝히면, 발표된 효과 수치가 다루는 범위를 분명히 설명할 수 있어요.",
  },
  {
    id: "w9",
    unit: "p:oil-price-cap",
    critique: { claimId: "claim-who-pays", label: "정유사 손실 보전은 운전하지 않는 납세자도 부담" },
    decoys: [{ claimId: "claim-launch", label: "석유제품 최고가격제는 2026년 3월 13일 시행" }, { claimId: "claim-current", label: "11차 휘발유 최고가격은 리터당 1,784원" }],
    why: "일반 재정으로 부담한다는 점을 먼저 인정하면, 공급가격 상한의 혜택과 비용을 함께 설명할 수 있어요.",
  },
  {
    id: "w10",
    unit: "p:humidifier-disinfectant-decree",
    critique: { claimId: "claim-victims-causation", label: "피해자단체는 시행령이 인과관계 추정을 약화한다고 비판" },
    decoys: [{ claimId: "claim-law", label: "가습기살균제 특별법 전부개정은 2026년 10월 8일 시행" }, { claimId: "claim-decree", label: "배상금은 치료비·간병비·위자료 등 항목별로 결정" }],
    why: "피해자단체의 입증 부담 우려를 먼저 소개하면, 배상 체계 전환과 피해 인정 기준의 논란을 함께 설명할 수 있어요.",
  },
  {
    id: "w11",
    unit: "p:nps-fund-2026",
    critique: { claimId: "claim-july-fund", label: "국민연금 기금은 2026년 7월 한 달간 181조 4천억 원 감소" },
    decoys: [{ claimId: "claim-swap", label: "국민연금 외환스와프 650억 달러 한도는 2026년 말까지" }, { claimId: "claim-hedge", label: "2026년 4월 전략적 환헤지 비율을 15%로 상향" }],
    why: "기금 평가액 감소를 먼저 인정하면, 운용 조치의 내용과 실제 평가액 변화를 함께 놓고 설명할 수 있어요.",
  },
  {
    id: "w12",
    unit: "p:china-group-visa-free",
    critique: { claimId: "claim-petition", label: "중국인 무비자 폐지 청원 7만 8,800명 동의로 상임위 심사" },
    decoys: [{ claimId: "claim-conditions", label: "한시 무비자는 지정 여행사가 모집한 3인 이상 단체 대상" }, { claimId: "claim-extension", label: "중국 단체 무비자 기간은 2026년 12월 31일까지 연장" }],
    why: "폐지 요구가 상임위 심사 대상이 된 점을 먼저 말하면, 반대 의견의 존재와 제도가 폐지됐는지를 구분할 수 있어요.",
  },
  {
    id: "w13",
    unit: "p:supplementary-budget",
    critique: { claimId: "claim-election-critique", label: "국민의힘은 2026년 추경을 선거용이라고 비판" },
    decoys: [{ claimId: "claim-2026-proposal", label: "2026년 1차 추경안은 3월 31일 국무회의 의결" }, { claimId: "claim-2026-items", label: "2026년 1차 추경안에 국채 상환 1조 원 포함" }],
    why: "선거용이라는 야당의 비판을 먼저 소개하면, 추경의 명칭과 실제 편성 항목을 함께 살필 수 있어요.",
  },
  {
    id: "w14",
    unit: "p:nk-medical-aid",
    critique: { claimId: "claim-north-response", label: "정부는 북한의 의료장비 수령 의사를 확인하지 못함" },
    decoys: [{ claimId: "claim-plan", label: "북한 병원 의료장비 지원 계획은 166종 1,431개" }, { claimId: "claim-sanctions", label: "제재 대상 41개 품목은 2026년 5월 22일 면제 승인" }],
    why: "북한의 수령 의사가 확인되지 않았음을 먼저 밝히면, 지원 계획과 실제 성사를 구분해 설명할 수 있어요.",
  },
  {
    id: "w15",
    unit: "p:english-conversation-instructors",
    critique: { claimId: "claim-law-debate", label: "노동계·강사들은 계약 기간 연장만으로 고용 불안 미해결 지적" },
    decoys: [{ claimId: "claim-structure", label: "영어회화전문강사는 2009년 도입된 교원 정원 외 계약직" }, { claimId: "claim-court", label: "대법원은 실질 근무 4년 초과 시 무기계약 인정 가능 판단" }],
    why: "계약 기간 연장만으로 고용 불안이 풀리지 않는다는 지적을 먼저 말하면, 기간 조정과 구조 개선 요구를 구분할 수 있어요.",
  },
  {
    id: "w16",
    unit: "p:daycare-priority",
    critique: { claimId: "claim-reverse-critique", label: "윤인진 교수 등은 다문화가족 1순위에 소득 기준이 없다고 지적" },
    decoys: [{ claimId: "claim-first-rank", label: "맞벌이·다자녀·한부모 가정 등도 어린이집 입소 1순위" }, { claimId: "claim-definition", label: "다문화가족은 결혼이민자·귀화자와 한국 국적자 등으로 구성" }],
    why: "소득 심사가 없다는 점을 먼저 말하면, 우선순위에 대한 문제 제기와 다문화가족만 우선이라는 해석을 나눠 설명할 수 있어요.",
  },
  {
    id: "w17",
    unit: "p:population-strategy",
    critique: { claimId: "claim-plan-critique", label: "조영태 교수는 인구 변화에 맞춘 개별 정책이 안 보인다고 지적" },
    decoys: [{ claimId: "claim-births-2025", label: "2025년 출생아는 전년보다 6.7% 증가" }, { claimId: "claim-plan", label: "국가인구전략 기본계획은 2026년 10월 14일 발표" }],
    why: "인구 변화에 맞춘 개별 정책이 보이지 않는다는 지적을 먼저 말하면, 삶의 질 지표 채택과 정책의 구체성을 함께 살필 수 있어요.",
  },
  {
    id: "w18",
    unit: "p:pension-reform-2025",
    critique: { claimId: "claim-youth-critique", label: "일부 청년층은 기금 소진이 9년 늦춰질 뿐이라며 비판" },
    decoys: [{ claimId: "claim-passed", label: "국민연금 개정법은 2026년 1월 1일 시행" }, { claimId: "claim-credits", label: "출산 크레딧은 첫째 자녀부터 12개월 인정" }],
    why: "청년층의 비판을 먼저 소개하면, 정부 전망과 다른 가정이 무엇인지는 보도에 없다는 한계도 함께 설명할 수 있어요.",
  },
  {
    id: "w19",
    unit: "p:firefighter-finance",
    critique: { claimId: "claim-share", label: "소방 예산 국비 비중은 2021년 14.9%에서 2025년 10.7%로 하락" },
    decoys: [{ claimId: "claim-nfa-budget", label: "2027년 정부안의 중앙 소방청 예산은 3,713억 원" }, { claimId: "claim-gov-response", label: "기획예산처 장관은 국회 심의에서 소방 재정 보완 논의 방침" }],
    why: "국비 비중 하락을 먼저 인정하면, 국가직 전환과 실제 재정 분담의 차이를 설명할 수 있어요.",
  },
  {
    id: "w20",
    unit: "p:disinformation-response",
    critique: { claimId: "claim-critique", label: "업계·전문가들은 의혹이나 공인 비판까지 과잉 삭제될 우려 제기" },
    decoys: [{ claimId: "claim-law", label: "개정 정보통신망법은 2026년 7월 7일 시행" }, { claimId: "claim-exceptions", label: "풍자·패러디와 공익 목적 정보는 규율 대상 제외" }],
    why: "과잉 삭제 우려를 먼저 소개하면, 허위조작정보 대응 요건과 표현의 자유 논란을 함께 설명할 수 있어요.",
  },
  {
    id: "w21",
    unit: "p:farmland-survey-2026",
    critique: { claimId: "claim-trade", label: "2026년 6~9월 농지 거래는 전년보다 약 1만 건 감소" },
    decoys: [{ claimId: "claim-plan", label: "전국 농지조사 계획은 조사 인력 5천 명 신규 채용" }, { claimId: "claim-no-disposal", label: "농식품부는 투기와 무관한 관행적 위반은 처분 제외 방침" }],
    why: "농지 거래 감소를 먼저 인정하면, 조사 계획과 같은 시기 거래 변화를 함께 살피되 인과를 단정하지 않을 수 있어요.",
  },
  {
    id: "w22",
    unit: "p:out-of-school-youth",
    critique: { claimId: "cp-reach", label: "학교 밖 청소년 기관 자료는 전체의 약 22%만 포착" },
    decoys: [{ claimId: "who", label: "학교 밖 청소년 지원의 연령 범위는 9~24세" }, { claimId: "mock-exam", label: "2026년 모의평가 응시료는 최대 2만 4천 원 지원" }],
    why: "실태 파악 범위가 제한된 점을 먼저 말하면, 지원 내용과 지원이 닿는 범위를 함께 설명할 수 있어요.",
  },
  {
    id: "w23",
    unit: "p:jobs-wages-2026",
    critique: { claimId: "claim-youth", label: "청년 취업자는 47개월 연속 감소하고 고용률은 44.0%" },
    decoys: [{ claimId: "claim-total", label: "2026년 9월 전체 취업자는 전년보다 11만 3천 명 증가" }, { claimId: "claim-ai-plan", label: "정부는 2030년까지 100만 명 이상에게 인공지능 직업훈련 계획" }],
    why: "청년 취업자 감소를 먼저 말하면, 전체 취업자 증가와 연령별 고용 상황을 구분해 설명할 수 있어요.",
  },
  {
    id: "w24",
    unit: "p:apartment-guards",
    critique: { claimId: "claim-limits", label: "경비원·전문가들은 단기 계약 탓에 업무 제한의 실효성 우려" },
    decoys: [{ claimId: "claim-scope", label: "경비원은 낙엽 청소·제설·택배 보관 등 수행 가능" }, { claimId: "claim-banned", label: "개인 차량 대리주차와 택배 세대별 배달은 원칙적 금지" }],
    why: "문제 제기가 해고로 이어질 수 있다는 우려를 먼저 소개하면, 업무 범위 규정과 현장 이행의 차이를 설명할 수 있어요.",
  },
  {
    id: "w25",
    unit: "p:local-unsold-housing",
    critique: { claimId: "claim-critique-metro", label: "권대중 교수는 특례 지역과 미분양 집중 지역의 불일치 지적" },
    decoys: [{ claimId: "claim-lh-purchase-2", label: "매입 주택은 시세 90% 전세로 6년 거주 뒤 분양전환 가능" }, { claimId: "claim-lh-purchase-3", label: "국토부·한국토지주택공사는 2026년 4월 5천 가구 매입 공고" }],
    why: "특례 지역과 미분양이 몰린 곳의 차이를 먼저 짚으면, 지원 내용과 실제 적용 범위를 함께 설명할 수 있어요.",
  },
  {
    id: "w26",
    unit: "p:corporate-rental-housing",
    critique: { claimId: "claim-ccej", label: "경실련은 기업이 지원받아 임대 뒤 분양수익을 얻는 구조 비판" },
    decoys: [{ claimId: "claim-2024-plan", label: "2024년 계획은 법인이 100세대 이상을 20년 이상 임대" }, { claimId: "claim-813-rental", label: "정부는 임대주택 담보 장기 모기지 상품 도입 계획" }],
    why: "기업의 분양수익에 대한 비판을 먼저 소개하면, 장기임대 유도와 기업 지원 구조를 함께 살필 수 있어요.",
  },
  {
    id: "w27",
    unit: "p:multi-child-housing",
    critique: { claimId: "claim-critique-small", label: "최은영 소장은 중형 임대 확대 때 청년용 소형 감소 지적" },
    decoys: [{ claimId: "claim-two-children", label: "2024년 3월부터 다자녀 특별공급 기준은 자녀 2명 이상" }, { claimId: "claim-mid-size-2026", label: "2026년 7월 공공임대 중형 비율 상한은 40% 이하" }],
    why: "중형 확대와 소형 감소의 관계를 먼저 말하면, 다자녀 가구 면적 수요와 한정된 공급 물량을 함께 설명할 수 있어요.",
  },
  {
    id: "w28",
    unit: "p:west-sea-structures",
    critique: { claimId: "claim-remaining", label: "서해 잠정조치수역에는 선란 1·2호 구조물이 남음" },
    decoys: [{ claimId: "claim-removal", label: "2026년 1월 중국 관리시설 1기를 수역 밖으로 이동" }, { claimId: "claim-summit", label: "2026년 1월 베이징 정상회담에서 서해 구조물 의제 논의" }],
    why: "두 구조물이 남았다는 점을 먼저 밝히면, 관리시설 한 기 이동과 전체 구조물 문제 해결을 구분할 수 있어요.",
  },
  {
    id: "w29",
    unit: "p:credit-recovery",
    critique: { claimId: "claim-relapse", label: "김상훈 의원실은 신용회복 수혜자 5.8%가 재연체했다고 분석" },
    decoys: [{ claimId: "claim-scheme", label: "5천만 원 이하 연체액을 기한 내 모두 갚으면 이력 삭제" }, { claimId: "claim-result", label: "금융위는 2026년 1월 신용회복 지원 292만 8천 명 발표" }],
    why: "재연체 분석을 먼저 소개하면, 연체이력 삭제라는 지원과 이후 상환 상태를 나눠 설명할 수 있어요.",
  },
  {
    id: "w30",
    unit: "p:wage-income-tax",
    critique: { claimId: "claim-bracket", label: "근로소득세 과표 8,800만 원 초과 구간은 2008년 이후 동일" },
    decoys: [{ claimId: "claim-2025", label: "2025년 근로소득세 수입은 68조 4천억 원" }, { claimId: "claim-2026", label: "2026년 1~9월 전체 소득세 수입은 111조 원" }],
    why: "과표 구간이 오래 유지된 점을 먼저 말하면, 명목 급여 상승과 세 부담 증가의 관계를 설명할 수 있어요.",
  },
  {
    id: "w31",
    unit: "p:care-workers",
    critique: { claimId: "claim-no-base", label: "2027년 결정에는 전체 요양보호사 기본급 인상 확정 수치 없음" },
    decoys: [{ claimId: "claim-2027", label: "2027년 장기요양보험료율은 소득 대비 0.9994%" }, { claimId: "claim-2027-workers", label: "2027년 섬·벽지 방문요양·방문간호 교통비 30% 인상" }],
    why: "기본급 인상 확정 수치가 없음을 먼저 말하면, 보험료율 인상과 종사자 임금 인상을 구분해 설명할 수 있어요.",
  },
  {
    id: "w32",
    unit: "p:imported-food-safety",
    critique: { claimId: "claim-onsite", label: "중국 제조업소 현지실사 부적합은 2025년 105곳 중 13곳" },
    decoys: [{ claimId: "claim-volume", label: "중국산 식품 수입 건수는 2025년 31만 2,432건" }, { claimId: "claim-kimjang", label: "식약처는 김장철 수입 배추·고춧가루 검사 강화 방침" }],
    why: "현지실사의 부적합 현황을 먼저 말하면, 수입 규모와 안전관리 조치를 함께 살필 수 있어요.",
  },
  {
    id: "w33",
    unit: "p:young-future-savings",
    critique: { claimId: "cp-low-deposit", label: "8월 말 청년미래적금 가입자 12.2%는 월 10만 원 이하 납입" },
    decoys: [{ claimId: "deposit", label: "청년미래적금은 3년간 월 최대 50만 원 자유 납입" }, { claimId: "match-rate", label: "2026년 2차 기여율은 일반형 6%·우대형 12%" }],
    why: "소액 납입자의 비중을 먼저 말하면, 최대 납입액과 가입자의 실제 저축 규모를 구분해 설명할 수 있어요.",
  },
  {
    id: "w34",
    unit: "p:electronic-monitoring",
    critique: { claimId: "claim-scale", label: "전자감독 대상자는 늘었지만 전담 인력은 255명에서 234명 감소" },
    decoys: [{ claimId: "claim-budget", label: "2026년 전자감독 예산은 373억 원" }, { claimId: "claim-response", label: "법무부는 인천 사건 뒤 감독 체계 전면 재점검 방침" }],
    why: "대상자 증가와 전담 인력 감소를 먼저 인정하면, 예산 규모와 실제 관리 부담을 구분해 설명할 수 있어요.",
  },
  {
    id: "w35",
    unit: "p:wildfire-causes",
    critique: { claimId: "claim-other", label: "2026년 산불 원인 중 기타 234건의 상세 구성은 확인 불가" },
    decoys: [{ claimId: "claim-law", label: "개정법은 실수로 낸 산불 법정형을 5년 이하 징역으로 상향" }, { claimId: "claim-forensic", label: "산림당국은 과학 수사로 산불 원인 제공자 추적 방침" }],
    why: "기타 항목의 구성을 알 수 없다는 점을 먼저 밝히면, 원인 통계와 조사·예방 대책을 구분해 설명할 수 있어요.",
  },
  {
    id: "w36",
    unit: "p:ai-learning-materials",
    critique: { claimId: "cp-usage", label: "고민정 의원은 인공지능 디지털교과서 실제 사용률 10% 미만 지적" },
    decoys: [{ claimId: "introduced", label: "인공지능 디지털교과서는 2025년 1학기 도입" }, { claimId: "law-change", label: "2025년 8월 법 개정으로 교과서에서 교육자료로 변경" }],
    why: "실제 사용률에 대한 지적을 먼저 소개하면, 학교의 채택과 실제 활용을 구분해 설명할 수 있어요.",
  },
  {
    id: "w37",
    unit: "p:high-school-credit",
    critique: { claimId: "cp-unions", label: "교원단체들은 공통과목 성취율 유지가 보장지도 형식화 우려" },
    decoys: [{ claimId: "elective-rule", label: "2026학년도 선택과목은 출석률만으로 학점 인정" }, { claimId: "common-rule", label: "공통과목은 출석률과 학업성취율을 모두 적용" }],
    why: "보장지도가 형식화될 수 있다는 우려를 먼저 말하면, 선택과목 완화와 공통과목 기준 유지의 차이를 설명할 수 있어요.",
  },
  {
    id: "w38",
    unit: "p:youth-monthly-rent",
    critique: { claimId: "cp-strict-income", label: "2023년 청년월세 지원은 소득 기준 탈락이 많아 예산 집행 부진" },
    decoys: [{ claimId: "target", label: "부모와 별도 거주하는 19~34세 무주택 청년 대상" }, { claimId: "amount", label: "실제 월세 중 최대 월 20만 원을 24개월 지원" }],
    why: "소득 기준으로 탈락한 사례를 먼저 말하면, 최대 지원액과 실제로 받을 수 있는 대상 범위를 함께 설명할 수 있어요.",
  },
];
