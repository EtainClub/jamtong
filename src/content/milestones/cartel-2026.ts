import {
  milestoneSchema,
  claimSchema,
  type Claim,
  type MilestoneCollection,
  type MilestoneInput,
} from "@/content/schema";
import {
  EX_RESTAREA_2026,
  FTC_BIDDING_2026,
  FTC_H2_2026,
  KOREA_MED_QUOTA_2026,
  LAW_REGIONAL_DOCTOR_2025,
  MOHW_REGIONAL_PICK_2026,
  MSIT_QOS_2026,
} from "@/content/sources";

/**
 * 카르텔 성과 카드 — 2026년.
 *
 * ★ 아홉 중 `done`은 하나뿐이다. 그게 이 자료의 실제 모습이다.
 *   지역의사법만 이미 효력이 있다 — 2026년 2월 24일 시행됐다. 나머지 여덟은
 *   공정위의 셋이 법과 고시를 고치겠다는 **계획**이고(하나는 2027년 1월 시행
 *   예정), 의대 증원은 2027학년도부터 일어날 **의결**이며, 통신 둘은 부처와
 *   사업자의 **합의**, 휴게소 하나는 여덟 곳에서 도는 **시범**, 지역의사 첫
 *   선발은 아직 **진행 중**이다. 수가 크다고 성과 칸으로 올리면 이 레이어가
 *   지켜 온 것이 무너진다 — 3대 메가프로젝트에서 지킨 선과 같다.
 *
 * ★ 절감액은 추산이지 측정값이 아니다.
 *   717만 명·3,221억 원은 통신 3사의 추산이고, 휴게소 값이 내렸는지는
 *   아무도 아직 재지 않았다. 카드의 highlight에 "추산"을 적어 둔다.
 *
 * ★ 증원을 성과로 적지 않는다.
 *   3,342명은 5년에 걸쳐 일어날 일이고 2026년 9월 현재 늘어난 정원은 없다.
 *   490명도 선발이 끝나지 않았다. 제도가 섰다는 것과 사람이 갔다는 것은
 *   다른 일이며, 후자는 10년 복무가 끝나는 2040년대에야 말할 수 있다.
 *
 * ★ 1차 자료가 아닌 것이 섞여 있다.
 *   공정위 업무계획과 도로공사 발표의 원문을 찾지 못해 보도로 대신했다.
 *   의료 쪽은 법률 원문과 정책브리핑이 있고 첫 선발만 보도다.
 *   근거 서랍이 1차 자료와 보도를 갈라 보이므로 화면에서 그 차이가 드러난다.
 */

const claim = (id: string, text: string, source: string | string[]): Claim =>
  claimSchema.parse({
    id,
    text,
    assertionType: "FACT",
    sourceIds: Array.isArray(source) ? source : [source],
    verified: true,
  });

const claims: Claim[] = [
  claim(
    "ct-ftc-repeat",
    "공정거래위원회는 2026년 8월 4일 발표한 2026년 하반기 주요 업무 추진계획에서, 반복적으로 담합한 사업자에게 등록 취소나 일정 기간 영업정지 처분을 내릴 수 있는 근거를 마련하겠다고 밝혔다. 법 개정이 필요한 사항으로 아직 시행되지 않았다.",
    FTC_H2_2026.id,
  ),
  claim(
    "ct-ftc-structural",
    "공정거래위원회는 같은 계획에서 시장지배적 지위 남용이나 중대한 담합에 대해 지분 매각과 영업 양도 등 구조적 조치를 적용할 수 있도록 제도를 정비하겠다고 밝혔다. 구조적 조치는 예외적인 상황에서만 보충적으로 쓰겠다고 함께 밝혔다.",
    FTC_H2_2026.id,
  ),
  claim(
    "ct-ftc-bidding",
    "공정거래위원회는 입찰참가자격 제한 요청 기준을 바꾸는 고시 개정안을 행정예고했다. 벌점 산정 기간을 최근 5년에서 10년으로 늘리고, 요청 기준을 누계 5점 초과에서 4점 이상으로 낮추며, 대상을 입찰담합에서 모든 유형의 담합으로 넓히는 내용이다. 의견 제출 기한은 2026년 10월 12일이고 시행 예정일은 2027년 1월 1일이다.",
    FTC_BIDDING_2026.id,
  ),
  claim(
    "ct-telecom-qos",
    "과학기술정보통신부와 이동통신 3사는 2026년 4월 모든 데이터 요금제에 데이터 안심옵션(QoS)을 도입하기로 합의했다. 월 제공 데이터를 다 쓴 뒤에도 400Kbps로 데이터를 계속 쓸 수 있게 하는 것이며, 상반기에 개편을 마무리하기로 했다. 통신 3사 추산으로 약 717만 명이 연 3,221억 원을 절감할 것으로 예상된다.",
    MSIT_QOS_2026.id,
  ),
  claim(
    "ct-telecom-senior",
    "같은 개편에서 65세 이상 이용자에게 음성·문자를 무제한으로 제공하기로 했다. 약 140만 명이 연 590억 원을 절감할 것으로 추산된다. QoS 도입과 합치면 약 850만 명, 연 3,800억 원이다.",
    MSIT_QOS_2026.id,
  ),
  claim(
    "ct-restarea-direct",
    "한국도로공사는 고속도로 휴게소의 다단계 임대 구조를 줄이려고 공사가 입점매장과 직접 계약하는 방식을 여덟 곳에서 시범 운영한다. 여주(인천 방향)·대천(양방향)·군위(부산 방향)·장유(부산 방향)가 운영 중이고 합천호(양방향)·월출산(통합)이 개장을 준비하고 있다. 수수료 부담이 줄어 음식 판매가격이 낮아질 것으로 기대한다고 밝혔다.",
    EX_RESTAREA_2026.id,
  ),
  claim(
    "ct-medical-law",
    "「지역의사의 양성 및 지원 등에 관한 법률」이 법률 제21239호로 2025년 12월 23일 공포돼 2026년 2월 24일 시행됐다. 복무형 지역의사로 선발되면 학비·교재비·기숙사비 등을 지원받는 대신, 의사면허를 취득한 뒤 선발 당시 공고된 의무복무지역에서 10년간 일해야 한다.",
    [LAW_REGIONAL_DOCTOR_2025.id, MOHW_REGIONAL_PICK_2026.id],
  ),
  claim(
    "ct-medical-quota",
    "보건복지부는 2026년 2월 10일 제7차 보건의료정책심의위원회에서 2027학년도부터 2031학년도까지 의과대학 정원을 연평균 668명씩 5년간 모두 3,342명 늘리기로 의결했다. 2027학년도 이후 증원 인력 중 2024학년도 정원 3,058명을 초과하는 인원은 모두 지역의사로 선발한다. 의결이 끝났을 뿐 증원은 2027학년도부터 단계적으로 일어난다.",
    KOREA_MED_QUOTA_2026.id,
  ),
  claim(
    "ct-medical-first",
    "2027학년도에 서울을 제외한 32개 의과대학·의학전문대학원에서 지역의사 490명을 처음 선발한다. 진료권 단위 359명, 광역권 단위 131명이다. 차의과학대학교 의학전문대학원은 2026년 8월 4~6일에 원서를 받았고, 나머지 31개 대학은 9월 7일 시작된 수시모집으로 받았다.",
    MOHW_REGIONAL_PICK_2026.id,
  ),
];

const raw: MilestoneInput[] = [
  {
    id: "ct-ftc-repeat",
    title: "반복 담합에 등록취소·영업정지 근거 마련",
    summary:
      "여러 번 담합한 사업자를 시장에서 물러나게 할 수 있는 근거를 두겠다는 계획이다. 법을 고쳐야 하는 일이라 아직 시행되지 않았다.",
    categories: ["economy"],
    audiences: ["담합 사업자"],
    status: "planned",
    date: "2026-08-04",
    datePrecision: "day",
    claimIds: ["ct-ftc-repeat"],
  },
  {
    id: "ct-ftc-structural",
    title: "중대 담합에 지분매각·영업양도 등 구조적 조치",
    summary:
      "과징금 대신 회사의 구조 자체를 바꾸게 하는 조치를 쓸 수 있게 제도를 정비하겠다는 계획이다. 예외적인 상황에서만 보충적으로 쓰겠다고 함께 밝혔다.",
    categories: ["economy"],
    audiences: ["시장지배적 사업자"],
    status: "planned",
    date: "2026-08-04",
    datePrecision: "day",
    claimIds: ["ct-ftc-structural"],
  },
  {
    id: "ct-ftc-bidding",
    title: "담합 두 번이면 공공입찰 제한",
    summary:
      "벌점 산정 기간을 5년에서 10년으로 늘리고 기준을 낮추며, 입찰담합만이 아니라 모든 담합을 대상으로 넓힌다. 행정예고 단계이고 시행 예정일은 2027년 1월 1일이다.",
    categories: ["economy"],
    audiences: ["공공입찰 참여 기업"],
    status: "planned",
    date: "2026-09-21",
    datePrecision: "day",
    claimIds: ["ct-ftc-bidding"],
    highlight: { value: "10년", label: "벌점 산정 기간 (현행 5년)" },
  },
  {
    id: "ct-telecom-qos",
    title: "모든 데이터 요금제에 QoS 도입 합의",
    summary:
      "월 데이터를 다 써도 400Kbps로 계속 쓸 수 있게 한다. 부처와 사업자의 합의이고 상반기 중 마무리하기로 했다. 아래 금액은 통신 3사의 추산이지 측정값이 아니다.",
    categories: ["economy"],
    audiences: ["이동통신 이용자"],
    status: "ongoing",
    date: "2026-04-09",
    datePrecision: "day",
    claimIds: ["ct-telecom-qos"],
    highlight: { value: "연 3,221억 원", label: "717만 명 절감 추산" },
  },
  {
    id: "ct-telecom-senior",
    title: "65세 이상 음성·문자 무제한",
    summary:
      "같은 개편에 들어 있다. 금액은 추산이다.",
    categories: ["economy", "welfare"],
    audiences: ["65세 이상 이용자"],
    status: "ongoing",
    date: "2026-04-09",
    datePrecision: "day",
    claimIds: ["ct-telecom-senior"],
    highlight: { value: "연 590억 원", label: "140만 명 절감 추산" },
  },
  {
    id: "ct-restarea-direct",
    title: "휴게소 여덟 곳 공사 직계약 시범",
    summary:
      "도로공사가 입점매장과 직접 계약해 중간 단계를 줄인다. 값이 실제로 내렸는지는 아직 재지 않았다.",
    categories: ["economy"],
    audiences: ["고속도로 이용자", "휴게소 입점매장"],
    status: "ongoing",
    date: "2026-09-21",
    datePrecision: "day",
    claimIds: ["ct-restarea-direct"],
    highlight: { value: "8곳", label: "시범 운영 휴게소" },
  },
  {
    id: "ct-medical-law",
    title: "지역의사법 시행 — 10년 의무복무",
    summary:
      "지역의사를 따로 뽑아 학비를 대신 내 주고, 면허를 딴 뒤 정해진 지역에서 10년을 일하게 하는 법이다. 2025년 12월 23일 공포돼 2026년 2월 24일부터 시행 중이다. 이 묶음에서 유일하게 이미 효력이 있는 항목이다.",
    categories: ["health", "region"],
    audiences: ["비수도권 주민", "의대 지원자"],
    status: "done",
    date: "2026-02-24",
    datePrecision: "day",
    claimIds: ["ct-medical-law"],
    highlight: { value: "10년", label: "복무형 지역의사 의무복무" },
  },
  {
    id: "ct-medical-quota",
    title: "의대 증원분 전원을 지역의사로",
    summary:
      "보건의료정책심의위원회가 2027~2031학년도에 의대 정원을 5년간 3,342명 늘리고, 2024학년도 정원 3,058명을 넘는 인원은 모두 지역의사로 뽑기로 의결했다. 의결이 끝났을 뿐 증원 자체는 2027학년도부터 단계적으로 일어난다.",
    categories: ["health", "region"],
    audiences: ["비수도권 주민", "의대 지원자"],
    status: "planned",
    date: "2026-02-10",
    datePrecision: "day",
    claimIds: ["ct-medical-quota"],
    highlight: { value: "3,342명", label: "5년간 증원 계획 (연평균 668명)" },
  },
  {
    id: "ct-medical-first",
    title: "2027학년도 지역의사 490명 첫 선발",
    summary:
      "서울을 뺀 32개 의대·의전원이 처음으로 지역의사를 뽑는다. 31개 대학이 9월 7일 수시모집으로 원서를 받았다. 선발이 아직 끝나지 않았고, 이들이 실제로 지역에 남는지는 10년 복무가 끝나는 2040년대에야 알 수 있다.",
    categories: ["health", "region"],
    audiences: ["비수도권 주민", "의대 지원자"],
    status: "ongoing",
    date: "2026-09-07",
    datePrecision: "day",
    claimIds: ["ct-medical-first"],
    highlight: { value: "490명", label: "진료권 359명 · 광역권 131명" },
  },
];

export const cartel2026: MilestoneCollection = {
  milestones: raw.map((item) => milestoneSchema.parse(item)),
  claims,
  sources: [
    FTC_H2_2026,
    FTC_BIDDING_2026,
    MSIT_QOS_2026,
    EX_RESTAREA_2026,
    LAW_REGIONAL_DOCTOR_2025,
    KOREA_MED_QUOTA_2026,
    MOHW_REGIONAL_PICK_2026,
  ],
};
