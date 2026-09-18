import {
  achievementSchema,
  claimSchema,
  type AchievementCollection,
  type AchievementInput,
  type Claim,
} from "@/content/schema";
import { MOF_2026 } from "@/content/sources";

/**
 * 해양수산 분야 성과 카드 — 전부 「2026년도 해양수산부 업무계획」 보도자료 하나에서 나왔다.
 *
 * 1차 자료 한 건으로 열다섯 장을 채울 수 있다는 점이 이 레이어의 요지다.
 * 스토리는 한 건에 몇 주가 들지만, 카드는 자료를 읽고 옮기면 된다.
 * 그래도 근거 원칙은 그대로다 — 카드마다 claim이 있고, claim마다 source가 있다.
 *
 * 상태 구분에 주의한다. 계획을 성과처럼 보이게 하면 이 레이어 전체가 신뢰를 잃는다.
 *   done    실제로 일어난 일 / 확정된 실적
 *   ongoing 추진 중
 *   planned 2026년에 하겠다고 밝힌 계획
 */

const claim = (
  id: string,
  text: string,
  extra: Partial<Claim> = {},
): Claim =>
  claimSchema.parse({
    id,
    text,
    assertionType: "FACT",
    sourceIds: [MOF_2026.id],
    verified: true,
    ...extra,
  });

const claims: Claim[] = [
  claim(
    "ac-relocation",
    "새 정부 출범 후 해양수산부는 부산 이전을 완료하고 북극항로추진본부를 새롭게 출범시켜 해양수도권 조성 기반을 마련하였다.",
  ),
  claim(
    "ac-arctic-trial",
    "2026년 하반기에 국내 민간 선사가 컨테이너선을 이용해 부산에서 로테르담까지 북극항로 시범운항을 추진한다.",
  ),
  claim(
    "ac-arctic-support",
    "쇄빙선 등 극지항해 선박을 건조하는 경우 최대 110억 원까지 지원하고, 항만시설사용료 50~100% 감면, 선박금융 투자금리 1%p 인하, 담보인정비율 최대 70%에서 90%로 상향 등의 혜택을 제공한다.",
  ),
  claim(
    "ac-arctic-risk",
    "러시아 제재가 해제되는 경우 북동항로를 통한 컨테이너·LNG 수송 확대를 추진하고, 제재가 지속될 경우 북서항로 시범운항 등 대안을 검토한다.",
  ),
  claim(
    "ac-capital",
    "2026년 상반기 중 '해양수도권 육성 전략(안)'을 제시하며, 동남권 투자공사 설립을 지원하고 해양진흥공사 자본금을 확충한다.",
  ),
  claim(
    "ac-green-ship",
    "국제해사기구는 2023년 국제운항선박의 온실가스 배출량을 2050년까지 영점화하기로 합의했으나, 우리 선박 중 친환경 선박은 11.9%에 불과하다. 정책자금 확대, 조각투자, 세제혜택과 입출항료 일부 감면으로 전환을 지원한다.",
  ),
  claim(
    "ac-autonomous",
    "2032년까지 1,805억 달러(약 250조 원)로 성장이 전망되는 자율운항선박 시장을 선점하기 위해 완전자율운항선박 핵심기술 연구개발에 2032년까지 총 6천억 원을 투자하고, 울산항 일대 실증해역에서 실증을 진행한다.",
  ),
  claim(
    "ac-smart-port",
    "2045년까지 부산항 진해신항을 세계 최대 규모의 컨테이너 항만으로 개발하고 모든 부두에 스마트 항만을 적용한다. 부산항 신항 제7부두 완전자동화 운영과 광양항 시범항만 조성 경험을 토대로 전국 항만까지 확대한다.",
  ),
  claim(
    "ac-uae",
    "2025년 11월 대통령의 UAE 순방을 계기로 UAE와 공동으로 스마트 항만 기술을 개발하고 부산항, 칼리파항 등 양국 항만에서 실증·검증할 예정이다.",
  ),
  claim(
    "ac-fleet",
    "국내 어선의 노후화(선령 21년 이상) 비율은 41%, 5톤 미만 소형어선 비율은 79%다. 노후어선 집중감척과 대체건조로 생산성을 높인다.",
  ),
  claim(
    "ac-dereg",
    "총허용어획량(TAC) 제도 확대에 맞춰 기존 규제 760여 건(전체의 50% 수준)을 조정 또는 철폐할 예정이다. 2025년 4월 시범적으로 삼치 금어기 규제를 완화한 결과 해당 지역 삼치 어획량이 3배 이상 증가했다.",
  ),
  claim(
    "ac-heatwave",
    "고수온 기간과 피해액은 2023년 57일 438억 원, 2024년 71일 1,430억 원, 2025년 85일 180억 원이다. 긴급방류 제도 활성화와 대응장비 추가 보급으로 전년보다 피해를 줄였다.",
  ),
  claim(
    "ac-seafood",
    "2025년 11월까지 식품 수출액 130억 달러 중 수산식품은 24%인 30억 달러를 차지했다. 김은 10.4억 달러로 라면(13.8억 달러)에 이어 2위, 참치는 5.0억 달러로 4위를 기록했다. 2030년 수출액 40억 달러 달성을 목표로 한다.",
  ),
  claim(
    "ac-illegal",
    "중국 불법어업 대응방식을 '퇴거'에서 '나포'로 변경하고, 국내 처벌 후 중국에 인계해 이중처벌 되도록 한다. 불법조업 벌금한도를 3억 원에서 10억 원으로 상향하고 수입수산물 어획증명제를 도입한다.",
  ),
  claim(
    "ac-wind",
    "해상풍력 확산을 위해 입지 정보망을 고도화하고 2026년 상반기 중 기후부와 함께 1단계 예비지구를 지정한다. 해저 송전망 유지관리 기술 등에 2030년까지 총 222억 원을 투자한다.",
  ),
  claim(
    "ac-tourism",
    "지역별 해양관광거점을 조성하고 1조 원 규모의 복합해양레저관광도시를 조성할 계획이다.",
  ),
  claim(
    "ac-safety",
    "지난 5년간 발생한 해양사고 중 인적 과실로 인한 사고가 84%를 차지했다. 여객선 항해당직 중 불필요한 스마트기기 사용을 금지하고 선교 내 CCTV를 설치하며, 통항속력제한을 신설한다.",
  ),
  claim(
    "ac-un-ocean",
    "2028년에 개최하는 제4차 UN 해양총회를 준비하며, 10월에는 국제해사기구와 공동으로 세계 해사의 날 기념행사를 개최한다.",
  ),
];

const raw: AchievementInput[] = [
  {
    id: "ach-mof-relocation",
    title: "해양수산부 부산 이전 · 북극항로추진본부 출범",
    summary:
      "해양수산부가 부산청사로 이전을 완료하고 북극항로추진본부를 새로 출범시켰다. 해양수도권 조성의 기반 단계다.",
    categories: ["region", "economy"],
    audiences: ["부산·동남권"],
    status: "done",
    date: "2025",
    datePrecision: "year",
    claimIds: ["ac-relocation"],
  },
  {
    id: "ach-arctic-trial",
    title: "부산 → 로테르담 북극항로 시범운항",
    summary:
      "국내 민간 선사가 컨테이너선으로 유럽까지 북극을 가로지르는 항로를 시험한다. 극지 운항 경험과 정보를 축적하는 것이 목적이다.",
    categories: ["economy", "diplomacy"],
    audiences: ["해운기업", "부산·동남권"],
    status: "planned",
    date: "2026-07",
    datePrecision: "month",
    claimIds: ["ac-arctic-trial"],
    highlight: { value: "13,000km", label: "수에즈 대비 약 36% 단축" },
    storySlug: "arctic-route",
  },
  {
    id: "ach-arctic-support",
    title: "극지항해 선박 건조 지원과 선사 혜택",
    summary:
      "쇄빙선 등 극지항해 선박 건조를 지원하고, 항만시설사용료 감면과 선박금융 조건 완화를 함께 제공한다.",
    categories: ["economy"],
    audiences: ["해운기업", "중소선사"],
    status: "planned",
    date: "2026",
    datePrecision: "year",
    claimIds: ["ac-arctic-support"],
    highlight: { value: "최대 110억 원", label: "선박 1척당 건조 지원" },
    storySlug: "arctic-route",
  },
  {
    id: "ach-arctic-risk",
    title: "북극항로 대외변수 대응 시나리오",
    summary:
      "러시아 제재 해제 시 북동항로로 컨테이너·LNG 수송을 확대하고, 제재가 지속되면 북서항로 시범운항 등 대안을 검토한다.",
    categories: ["diplomacy", "economy"],
    audiences: ["해운기업"],
    status: "planned",
    date: "2026",
    datePrecision: "year",
    claimIds: ["ac-arctic-risk"],
  },
  {
    id: "ach-maritime-capital",
    title: "해양수도권 육성 전략",
    summary:
      "동남권에 행정·사법·금융·기업 인프라를 집적시켜 수도권에 필적하는 해양수도권을 조성한다. 동남권 투자공사 설립을 지원한다.",
    categories: ["region", "economy"],
    audiences: ["부산·동남권", "해운기업"],
    status: "planned",
    date: "2026-06",
    datePrecision: "month",
    claimIds: ["ac-capital"],
  },
  {
    id: "ach-green-ship",
    title: "친환경 선박 전환 가속",
    summary:
      "IMO가 2050년까지 국제운항선박 온실가스 영점화를 합의했지만 우리 친환경 선박 비율은 아직 낮다. 정책자금·세제·입출항료 감면으로 전환을 지원한다.",
    categories: ["environment", "economy"],
    audiences: ["해운기업", "중소선사"],
    status: "ongoing",
    date: "2026",
    datePrecision: "year",
    claimIds: ["ac-green-ship"],
    highlight: { value: "11.9%", label: "현재 친환경 선박 비율" },
  },
  {
    id: "ach-autonomous",
    title: "완전자율운항선박 기술 개발",
    summary:
      "2032년 250조 원 규모로 전망되는 시장을 선점하기 위해 핵심기술 연구개발에 투자하고 울산항 실증해역에서 직접 실증한다.",
    categories: ["science", "economy"],
    audiences: ["조선업", "해운기업"],
    status: "ongoing",
    date: "2026",
    datePrecision: "year",
    claimIds: ["ac-autonomous"],
    highlight: { value: "6,000억 원", label: "2032년까지 R&D 투자" },
  },
  {
    id: "ach-smart-port",
    title: "진해신항 스마트 항만 개발",
    summary:
      "2045년까지 부산항 진해신항을 세계 최대 규모 컨테이너 항만으로 개발하고 전 부두에 스마트 항만을 적용한다.",
    categories: ["economy", "science", "region"],
    audiences: ["부산·동남권", "항만종사자"],
    status: "ongoing",
    date: "2026",
    datePrecision: "year",
    claimIds: ["ac-smart-port"],
  },
  {
    id: "ach-uae-port",
    title: "UAE와 스마트 항만 기술 공동개발",
    summary:
      "대통령 UAE 순방을 계기로 양국이 함께 스마트 항만 기술을 개발하고 부산항·칼리파항에서 실증한다.",
    categories: ["diplomacy", "science"],
    audiences: ["항만종사자"],
    status: "ongoing",
    date: "2025-11",
    datePrecision: "month",
    claimIds: ["ac-uae"],
  },
  {
    id: "ach-fleet",
    title: "노후어선 집중감척과 대체건조",
    summary:
      "선령 21년 이상 어선이 41%, 5톤 미만 소형어선이 79%다. 어선을 대형화·현대화해 기후변화에도 안정적으로 수산물을 공급한다.",
    categories: ["fisheries"],
    audiences: ["어업인"],
    status: "planned",
    date: "2026",
    datePrecision: "year",
    claimIds: ["ac-fleet"],
    highlight: { value: "41%", label: "선령 21년 이상 어선 비율" },
  },
  {
    id: "ach-dereg",
    title: "어업 규제 760여 건 조정·철폐",
    summary:
      "총허용어획량 제도 확대에 맞춰 기존 규제의 절반가량을 손본다. 삼치 금어기를 시범 완화한 결과 해당 지역 어획량이 3배 이상 늘었다.",
    categories: ["fisheries", "economy"],
    audiences: ["어업인"],
    status: "ongoing",
    date: "2025-04",
    datePrecision: "month",
    claimIds: ["ac-dereg"],
    highlight: { value: "3배 이상", label: "삼치 어획량 증가 (시범 완화 결과)" },
  },
  {
    id: "ach-heatwave",
    title: "고수온 피해 최소화와 양식업 혁신",
    summary:
      "긴급방류 제도 활성화와 대응장비 보급으로 전년보다 피해를 줄였다. 수심이 깊은 양식가능해역을 새로 발굴하고 품종을 특화한다.",
    categories: ["fisheries", "environment"],
    audiences: ["양식어가", "어업인"],
    status: "ongoing",
    date: "2025",
    datePrecision: "year",
    claimIds: ["ac-heatwave"],
    highlight: { value: "1,430억 → 180억 원", label: "고수온 피해액 (2024 → 2025)" },
  },
  {
    id: "ach-seafood",
    title: "수산식품 수출 30억 달러, 김 수출 2위",
    summary:
      "식품 수출액 130억 달러 중 수산식품이 24%를 차지했다. 김은 라면에 이어 두 번째로 높은 수출 실적을 냈다.",
    categories: ["fisheries", "economy"],
    audiences: ["어업인", "수출기업"],
    status: "done",
    date: "2025-11",
    datePrecision: "month",
    claimIds: ["ac-seafood"],
    highlight: { value: "10.4억 달러", label: "김 수출액 (품목 2위)" },
  },
  {
    id: "ach-illegal-fishing",
    title: "불법조업 대응 '퇴거'에서 '나포'로",
    summary:
      "중국 불법어업에 대한 대응을 강화하고 벌금한도를 상향한다. 수입수산물 어획증명제로 불법어업 수산물 수입을 사전 차단한다.",
    categories: ["diplomacy", "fisheries"],
    audiences: ["어업인"],
    status: "planned",
    date: "2026",
    datePrecision: "year",
    claimIds: ["ac-illegal"],
    highlight: { value: "3억 → 10억 원", label: "불법조업 벌금한도" },
  },
  {
    id: "ach-offshore-wind",
    title: "해상풍력 예비지구 지정과 해저 송전망",
    summary:
      "입지 정보망을 고도화하고 1단계 예비지구를 지정한다. 어업인·생산자단체 중심의 이익공유 모델도 개발한다.",
    categories: ["environment", "science"],
    audiences: ["어업인", "연안주민"],
    status: "planned",
    date: "2026-06",
    datePrecision: "month",
    claimIds: ["ac-wind"],
  },
  {
    id: "ach-marine-tourism",
    title: "복합해양레저관광도시 조성",
    summary:
      "어촌을 지역 관광자원으로 활용하고 지역별 해양관광거점을 조성해 연안 지역의 소득을 올린다.",
    categories: ["region", "culture"],
    audiences: ["연안주민", "어업인"],
    status: "planned",
    date: "2026",
    datePrecision: "year",
    claimIds: ["ac-tourism"],
    highlight: { value: "1조 원", label: "복합해양레저관광도시 규모" },
  },
  {
    id: "ach-marine-safety",
    title: "해양사고 안전관리 체계 혁신",
    summary:
      "지난 5년 해양사고의 84%가 인적 과실이었다. 선박·시설 중심 관리를 넘어 인적 과실까지 관리 범위를 넓힌다.",
    categories: ["environment"],
    audiences: ["어업인", "항만종사자", "여객선 이용자"],
    status: "planned",
    date: "2026",
    datePrecision: "year",
    claimIds: ["ac-safety"],
    highlight: { value: "84%", label: "인적 과실로 인한 해양사고 비율" },
  },
  {
    id: "ach-un-ocean",
    title: "제4차 UN 해양총회 개최 준비",
    summary:
      "경주 APEC 사례를 참고해 2028년 UN 해양총회를 준비하고, 국제해사기구와 세계 해사의 날 기념행사를 공동 개최한다.",
    categories: ["diplomacy"],
    audiences: [],
    status: "planned",
    date: "2028",
    datePrecision: "year",
    claimIds: ["ac-un-ocean"],
  },
];

export const maritime2026: AchievementCollection = {
  achievements: raw.map((item) => achievementSchema.parse(item)),
  claims,
  sources: [MOF_2026],
};
