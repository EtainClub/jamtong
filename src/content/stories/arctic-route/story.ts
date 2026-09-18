import { storySchema, type Story } from "@/content/schema";

/**
 * 북극항로 — Sprint 1 검증용 스토리.
 *
 * ⚠ 데이터 상태: 아래 수치·경유지·연표는 모두 `verified: false`다.
 *   널리 인용되는 개략치를 골격으로 넣어 둔 것이며, 편집팀이 1차 자료로
 *   대조하기 전까지는 UI에 "검증 전" 표식이 붙는다.
 *   sources[]의 url이 비어 있는 항목은 출처 확정이 필요한 자리다.
 *
 * 이 파일은 데이터만 담는다. 화면 구성은 features/story 아래 컴포넌트가
 * 하드코딩으로 갖는다. (설계 검토 5.1)
 */

const raw: Story = {
  id: "arctic-route",
  slug: "arctic-route",
  title: "북극항로",
  subtitle: "새로운 길이 대한민국의 미래를 넓힙니다",
  kicker: "주요 정책",
  summary:
    "부산에서 유럽으로 가는 뱃길은 지금까지 수에즈 운하를 지나 남쪽으로 크게 돌아갔다. " +
    "북극 항로가 열리면 같은 목적지까지의 거리가 크게 줄어든다. " +
    "배를 직접 움직여 두 항로의 차이를 확인해 보라.",
  type: "achievement",

  routes: [
    {
      id: "nsr",
      name: "북극항로",
      isBaseline: false,
      totalKm: 15000,
      totalDays: 30,
      claimId: "claim-nsr-distance",
      waypoints: [
        { id: "busan", name: "부산", lon: 129.04, lat: 35.1, cumulativeKm: 0 },
        { id: "laperouse", name: "라페루즈 해협", lon: 142.0, lat: 45.8, cumulativeKm: 1400 },
        { id: "bering", name: "베링 해협", lon: -169.0, lat: 65.8, cumulativeKm: 4700 },
        { id: "east-siberian", name: "동시베리아해", lon: 165.0, lat: 71.0, cumulativeKm: 5600 },
        { id: "laptev", name: "랍테프해", lon: 130.0, lat: 76.0, cumulativeKm: 7000 },
        { id: "kara", name: "카라해", lon: 80.0, lat: 77.0, cumulativeKm: 9000 },
        { id: "barents", name: "바렌츠해", lon: 40.0, lat: 73.0, cumulativeKm: 10600 },
        { id: "norwegian", name: "노르웨이해", lon: 5.0, lat: 66.0, cumulativeKm: 12800 },
        { id: "rotterdam", name: "로테르담", lon: 4.48, lat: 51.92, cumulativeKm: 15000 },
      ],
    },
    {
      id: "suez",
      name: "수에즈 항로",
      isBaseline: true,
      totalKm: 22000,
      totalDays: 40,
      claimId: "claim-suez-distance",
      waypoints: [
        { id: "busan-s", name: "부산", lon: 129.04, lat: 35.1, cumulativeKm: 0 },
        { id: "taiwan", name: "대만 해협", lon: 120.0, lat: 24.0, cumulativeKm: 1500 },
        { id: "malacca", name: "말라카 해협", lon: 100.3, lat: 2.0, cumulativeKm: 4200 },
        { id: "indian", name: "인도양", lon: 70.0, lat: 8.0, cumulativeKm: 7500 },
        { id: "aden", name: "아덴만", lon: 45.0, lat: 12.5, cumulativeKm: 10500 },
        { id: "redsea", name: "홍해", lon: 38.0, lat: 22.0, cumulativeKm: 11800 },
        { id: "suez-canal", name: "수에즈 운하", lon: 32.5, lat: 30.5, cumulativeKm: 12800 },
        { id: "med", name: "지중해", lon: 15.0, lat: 36.0, cumulativeKm: 14500 },
        { id: "gibraltar", name: "지브롤터", lon: -5.6, lat: 36.0, cumulativeKm: 16400 },
        { id: "biscay", name: "비스케이만", lon: -8.0, lat: 46.0, cumulativeKm: 17700 },
        { id: "rotterdam-s", name: "로테르담", lon: 4.48, lat: 51.92, cumulativeKm: 22000 },
      ],
    },
  ],

  keyNumbers: [
    {
      id: "kn-distance",
      label: "운항 거리 단축",
      prefix: "약",
      value: "32",
      unit: "%",
      caption: "부산 → 로테르담 기준",
      claimId: "claim-reduction",
    },
    {
      id: "kn-days",
      label: "운항 일수",
      value: "40 → 30",
      unit: "일",
      caption: "평균 항속 기준 개략치",
      claimId: "claim-days",
    },
    {
      id: "kn-km",
      label: "단축 거리",
      prefix: "약",
      value: "7,000",
      unit: "km",
      caption: "두 항로의 차이",
      claimId: "claim-reduction",
    },
  ],

  timeline: [
    {
      id: "ev-1",
      date: "2018",
      datePrecision: "year",
      title: "북극항로 통항 여건 변화",
      summary: "여름철 통항 가능 기간이 늘어나며 상업적 이용 논의가 시작된다.",
      claimIds: ["claim-timeline-placeholder"],
    },
    {
      id: "ev-2",
      date: "2021",
      datePrecision: "year",
      title: "항로 이용 확대 논의",
      summary: "국제 물류 경로 다변화 필요성이 제기된다.",
      claimIds: ["claim-timeline-placeholder"],
    },
    {
      id: "ev-3",
      date: "2024",
      datePrecision: "year",
      title: "정책 과제로의 부상",
      summary: "북극항로가 국가 물류 전략의 논의 대상이 된다.",
      claimIds: ["claim-timeline-placeholder"],
    },
    {
      id: "ev-4",
      date: "2026",
      datePrecision: "year",
      title: "추진 단계",
      summary: "편집팀 확인 후 내용을 채운다.",
      claimIds: ["claim-timeline-placeholder"],
    },
  ],

  claims: [
    {
      id: "claim-nsr-distance",
      text: "부산에서 로테르담까지 북극항로 경유 거리는 약 15,000km다.",
      assertionType: "FACT",
      sourceIds: ["src-placeholder-route"],
      verified: false,
    },
    {
      id: "claim-suez-distance",
      text: "부산에서 로테르담까지 수에즈 운하 경유 거리는 약 22,000km다.",
      assertionType: "FACT",
      sourceIds: ["src-placeholder-route"],
      verified: false,
    },
    {
      id: "claim-reduction",
      text: "북극항로 이용 시 운항 거리가 약 7,000km, 약 32% 줄어든다.",
      assertionType: "FACT",
      sourceIds: ["src-placeholder-route"],
      verified: false,
    },
    {
      id: "claim-days",
      text: "운항 일수는 약 40일에서 약 30일로 줄어든다.",
      assertionType: "FACT",
      sourceIds: ["src-placeholder-route"],
      verified: false,
    },
    {
      id: "claim-timeline-placeholder",
      text: "연표 항목은 편집팀 검증 전 골격이다.",
      assertionType: "INTERPRETATION",
      sourceIds: ["src-placeholder-timeline"],
      verified: false,
    },
  ],

  sources: [
    {
      id: "src-placeholder-route",
      title: "[출처 확정 필요] 북극항로·수에즈항로 거리 비교 자료",
      publisher: "미정",
      type: "official",
      license: "link-only",
      archivedUrl: "https://example.invalid/pending",
    },
    {
      id: "src-placeholder-timeline",
      title: "[출처 확정 필요] 북극항로 정책 연표",
      publisher: "미정",
      type: "official",
      license: "link-only",
      archivedUrl: "https://example.invalid/pending",
    },
  ],
};

export const arcticRoute = storySchema.parse(raw);
