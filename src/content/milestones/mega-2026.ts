import {
  milestoneSchema,
  claimSchema,
  type MilestoneCollection,
  type MilestoneInput,
  type Claim,
} from "@/content/schema";
import { MOTIR_MEGA_2026 } from "@/content/sources";

/**
 * 3대 메가프로젝트 성과 카드 — 전부 2026년 6월 29일 국민보고회 참고자료 하나에서 나왔다.
 *
 * ★ 이 묶음은 거의 전부 `planned`다. 그게 이 자료의 실제 모습이다.
 *   보고회에서 밝힌 것은 "이렇게 하겠다"이고, 800조·550조·18.4GW는 전부
 *   앞으로의 투자 계획이다. 숫자가 크다고 성과 칸으로 올리면 이 레이어가
 *   지켜 온 것이 무너진다 — 계획을 성과처럼 보이게 하지 않는 것이 여기
 *   신뢰의 전부다.
 *
 *   docs/achievements/president.md가 'AI 3대 메가 프로젝트'를 업적 보류로
 *   분류한 것과 같은 판단이다. 업적으로는 올리지 않고, 계획으로 표시한
 *   성과 카드로만 남긴다.
 *
 * ★ 민간 투자액은 정부가 쓸 돈이 아니다.
 *   550조원은 SK·GS·네이버 세 기업이 투자하겠다고 한 금액이다. 정부 예산과
 *   섞어 읽히지 않게 요약에 주체를 적는다.
 *
 * ★ 단축 연수는 목표치다.
 *   "7년 단축", "12년 단축"은 기존 절차 대비 얼마나 줄이겠다는 목표이지
 *   줄인 실적이 아니다.
 */

const claim = (id: string, text: string, extra: Partial<Claim> = {}): Claim =>
  claimSchema.parse({
    id,
    text,
    assertionType: "FACT",
    sourceIds: [MOTIR_MEGA_2026.id],
    verified: true,
    ...extra,
  });

const claims: Claim[] = [
  claim(
    "mg-report",
    "2026년 6월 29일 청와대 영빈관에서 정부·기업·학계·연구계 약 90명이 참석한 가운데 ‘대한민국 대도약 3대 메가프로젝트 국민보고회’가 열렸다. 반도체, 피지컬AI, AI 데이터센터 세 갈래의 추진 계획이 발표됐다.",
  ),
  claim(
    "mg-fab-southwest",
    "서남권에 총 800조원 규모의 반도체 팹 4기를 구축하고, 충청권은 81조원을 투자해 패키징 거점으로 육성한다는 계획이 제시됐다. 온양·천안에 신규 HBM 팹을 건설하고 청주에 HBM 패키징 투자를 하는 내용도 함께 담겼다.",
  ),
  claim(
    "mg-speed",
    "용인 국가산단의 최종 팹 완공 기간을 7년, 일반산단은 12년 단축해 5년 내 메모리 생산 능력을 2배로 확대한다는 목표가 제시됐다.",
  ),
  claim(
    "mg-next-memory",
    "차세대 메모리, 엣지용 AI 반도체, 국방반도체에 향후 15년간 30조원 이상을 투입한다는 계획이 제시됐다.",
  ),
  claim(
    "mg-semi-gov",
    "반도체 특별법이 이미 시행 중인 가운데, 대통령이 주재하는 ‘반도체 경쟁력 강화 특별위원회’를 구성하고 산업통상부 안에 ‘반도체 혁신지원단’을 신설한다는 계획이 제시됐다.",
  ),
  claim(
    "mg-max",
    "제조업 AI 전환을 위해 1,500여개 기관이 참여하는 M.AX 얼라이언스를 꾸리고, 매년 1천대 이상의 AI 로봇을 현장에 보급한다는 계획이 제시됐다.",
  ),
  claim(
    "mg-robot-people",
    "향후 5년간 AI 로봇 전문인력 1만명을 양성하고, 10대 업종별 데이터팩토리를 구축하며, 액츄에이터·로봇손·센서 등 3대 취약부품 연구개발 투자를 확대한다는 계획이 제시됐다. 로봇 특성화대학원도 선정한다.",
  ),
  claim(
    "mg-robot-factory",
    "새만금에 로봇 파운드리와 부품 클러스터를 조성하고, 정부가 먼저 사들여 초기 시장을 만들며, 국민성장펀드로 신증설 투자자금을 지원한다는 계획이 제시됐다.",
  ),
  claim(
    "mg-foundation",
    "향후 3년 내에 세계 최고 수준의 독자적인 피지컬AI 파운데이션 모델을 개발하고, 2030년 글로벌 1강으로 도약한다는 목표가 제시됐다.",
  ),
  claim(
    "mg-datacenter",
    "1단계로 총 8.4GW 규모의 AI 데이터센터를 구축한다는 계획이 제시됐다. SK 5GW, GS 2.4GW, 네이버 1GW이며 세 기업이 약 550조원을 투자한다. 2단계로 SK의 5GW를 2035년까지 15GW로 확장해 최종 18.4GW를 구축한다.",
  ),
  claim(
    "mg-npu",
    "NPU 등 국산 AI 반도체를 앞세워 AI 추론 시장을 선점하고, AI 데이터센터 클러스터를 조성하며, 국산 전력·냉각 솔루션의 해외 진출을 지원한다는 계획이 제시됐다.",
  ),
  claim(
    "mg-power",
    "2030년까지 재생에너지 100GW를 조기 달성하고, 지역별 전기요금제와 AI 데이터센터 전용 요금제를 도입하며, 345kV 계통에 여유가 있는 변전소 정보를 공개한다는 계획이 제시됐다.",
  ),
  claim(
    "mg-city",
    "기업형 첨단도시를 조성해 정주지까지 30분 이내, 공항·항만 등 물류거점까지 1시간 이내 이동권을 목표로 하고, 산단 기획부터 공장 가동까지 10년 이상 걸리던 기간을 절반 이상 단축한다는 계획이 제시됐다. 초저리 장기 임대의 공공지원 임대전용산단 지정도 검토한다.",
  ),
];

const raw: MilestoneInput[] = [
  {
    id: "mg-report",
    title: "3대 메가프로젝트 국민보고회 개최",
    summary:
      "반도체·피지컬AI·AI 데이터센터 세 갈래의 추진 계획을 한자리에서 발표했다. 정부·기업·학계 약 90명이 참석했다.",
    categories: ["science", "economy"],
    audiences: [],
    status: "done",
    date: "2026-06-29",
    datePrecision: "day",
    claimIds: ["mg-report"],
    highlight: { value: "3대", label: "묶어서 발표한 프로젝트" },
  },
  {
    id: "mg-fab-southwest",
    title: "서남권 반도체 팹 4기 · 충청권 패키징 거점",
    summary:
      "서남권에 800조원 규모의 팹 4기를, 충청권에 81조원을 들여 패키징 거점을 만들겠다는 계획이다. 온양·천안 HBM 팹과 청주 패키징 투자도 함께 담겼다.",
    categories: ["science", "region"],
    audiences: ["반도체 업계"],
    status: "planned",
    date: "2026-06-29",
    datePrecision: "day",
    claimIds: ["mg-fab-southwest"],
    highlight: { value: "800조원", label: "서남권 팹 4기 투자 계획" },
  },
  {
    id: "mg-speed",
    title: "반도체 팹 완공 기간 단축 목표",
    summary:
      "용인 국가산단은 7년, 일반산단은 12년을 줄여 5년 안에 메모리 생산 능력을 두 배로 늘리겠다는 목표다. 줄인 실적이 아니라 줄이겠다는 목표다.",
    categories: ["science"],
    audiences: ["반도체 업계"],
    status: "planned",
    date: "2026-06-29",
    datePrecision: "day",
    claimIds: ["mg-speed"],
    highlight: { value: "7년", label: "용인 국가산단 단축 목표" },
  },
  {
    id: "mg-next-memory",
    title: "차세대 메모리·AI 반도체·국방반도체 투자",
    summary: "차세대 메모리와 엣지용 AI 반도체, 국방반도체에 15년간 30조원 이상을 넣겠다는 계획이다.",
    categories: ["science"],
    audiences: [],
    status: "planned",
    date: "2026-06-29",
    datePrecision: "day",
    claimIds: ["mg-next-memory"],
    highlight: { value: "30조원", label: "15년간 투입 계획" },
  },
  {
    id: "mg-semi-gov",
    title: "반도체 특별법 시행과 지원 조직 신설",
    summary:
      "반도체 특별법은 이미 시행 중이다. 여기에 대통령 주재 특별위원회를 만들고 산업통상부에 혁신지원단을 새로 두겠다는 계획이 더해졌다.",
    categories: ["science"],
    audiences: [],
    status: "ongoing",
    date: "2026-06-29",
    datePrecision: "day",
    claimIds: ["mg-semi-gov"],
  },
  {
    id: "mg-max",
    title: "제조업 AI 전환 — M.AX 얼라이언스",
    summary:
      "1,500여개 기관이 참여하는 연합을 꾸리고 해마다 AI 로봇 1천대 이상을 공장 현장에 보급하겠다는 계획이다.",
    categories: ["science", "economy"],
    audiences: ["제조업체"],
    status: "planned",
    date: "2026-06-29",
    datePrecision: "day",
    claimIds: ["mg-max"],
    highlight: { value: "1,500여개", label: "참여 목표 기관" },
  },
  {
    id: "mg-robot-people",
    title: "AI 로봇 전문인력 1만명 양성",
    summary:
      "5년간 1만명을 키우고, 10대 업종별 데이터팩토리를 짓고, 액츄에이터·로봇손·센서 같은 약한 부품의 연구개발을 늘리겠다는 계획이다.",
    categories: ["science", "education"],
    audiences: ["청년", "로봇 업계"],
    status: "planned",
    date: "2026-06-29",
    datePrecision: "day",
    claimIds: ["mg-robot-people"],
    highlight: { value: "1만명", label: "5년간 양성 목표" },
  },
  {
    id: "mg-robot-factory",
    title: "새만금 로봇 파운드리·부품 클러스터",
    summary:
      "로봇을 대량으로 만들 기반을 새만금에 조성하고, 정부가 먼저 사들여 초기 시장을 만들겠다는 계획이다.",
    categories: ["science", "region"],
    audiences: ["로봇 업계"],
    status: "planned",
    date: "2026-06-29",
    datePrecision: "day",
    claimIds: ["mg-robot-factory"],
  },
  {
    id: "mg-foundation",
    title: "피지컬AI 파운데이션 모델 독자 개발",
    summary:
      "3년 안에 세계 최고 수준의 독자 모델을 만들고 2030년 글로벌 1강으로 가겠다는 목표다.",
    categories: ["science"],
    audiences: [],
    status: "planned",
    date: "2030",
    datePrecision: "year",
    claimIds: ["mg-foundation"],
    highlight: { value: "3년 내", label: "독자 모델 개발 목표" },
  },
  {
    id: "mg-datacenter",
    title: "AI 데이터센터 18.4GW 구축 계획",
    summary:
      "1단계 8.4GW(SK 5, GS 2.4, 네이버 1)를 짓고 2035년까지 18.4GW로 넓히겠다는 계획이다. 550조원은 정부 예산이 아니라 세 기업이 투자하겠다고 밝힌 금액이다.",
    categories: ["science", "economy"],
    audiences: [],
    status: "planned",
    date: "2035",
    datePrecision: "year",
    claimIds: ["mg-datacenter"],
    highlight: { value: "18.4GW", label: "최종 구축 목표" },
  },
  {
    id: "mg-npu",
    title: "국산 AI 반도체로 추론 시장 선점",
    summary:
      "NPU 등 국산 칩을 앞세워 AI 추론 시장을 잡고, 국산 전력·냉각 기술의 해외 진출을 돕겠다는 계획이다.",
    categories: ["science", "economy"],
    audiences: [],
    status: "planned",
    date: "2026-06-29",
    datePrecision: "day",
    claimIds: ["mg-npu"],
  },
  {
    id: "mg-power",
    title: "재생에너지 100GW 조기 달성 목표",
    summary:
      "2030년까지 재생에너지 100GW를 앞당겨 채우고, 지역별 전기요금제와 데이터센터 전용 요금제를 두겠다는 계획이다. 계통에 여유가 있는 변전소 정보도 공개한다.",
    categories: ["environment", "science"],
    audiences: [],
    status: "planned",
    date: "2030",
    datePrecision: "year",
    claimIds: ["mg-power"],
    highlight: { value: "100GW", label: "2030년 재생에너지 목표" },
  },
  {
    id: "mg-city",
    title: "기업형 첨단도시 조성",
    summary:
      "일터에서 사는 곳까지 30분, 공항·항만까지 1시간을 목표로 하고, 산단을 기획해 공장이 돌기까지 10년 넘게 걸리던 것을 절반 이하로 줄이겠다는 계획이다.",
    categories: ["region", "economy"],
    audiences: ["산업단지 입주기업"],
    status: "planned",
    date: "2026-06-29",
    datePrecision: "day",
    claimIds: ["mg-city"],
    highlight: { value: "30분", label: "정주지까지 이동권 목표" },
  },
];

export const mega2026: MilestoneCollection = {
  milestones: raw.map((item) => milestoneSchema.parse(item)),
  claims,
  sources: [MOTIR_MEGA_2026],
};
