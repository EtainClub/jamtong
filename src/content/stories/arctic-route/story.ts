import { storySchema, type Story } from "@/content/schema";

/**
 * 북극항로 — Sprint 1 검증용 스토리.
 *
 * 출처 상태
 *  - `src-mof-2026`: 해양수산부 2026년도 업무계획 보도자료. 실제 1차 자료다.
 *    이 자료가 직접 뒷받침하는 claim만 verified: true로 둔다.
 *  - `src-pending-distance`: 거리·운항일수 수치의 출처는 아직 없다.
 *    해수부 자료는 "아시아와 유럽을 연결하는 최단거리 항로"라고만 서술하고
 *    구체적 수치를 제시하지 않으므로, 그 자료를 거리 claim에 붙이면 허위 인용이 된다.
 *    지도 위 경로 기하도 같은 이유로 잠정값이다.
 *
 * 이 파일은 데이터만 담는다. 화면 구성은 features/ 아래 컴포넌트가 하드코딩으로 갖는다.
 */

const raw: Story = {
  id: "arctic-route",
  slug: "arctic-route",
  title: "북극항로",
  subtitle: "새로운 길이 대한민국의 미래를 넓힙니다",
  kicker: "주요 정책",
  summary:
    "부산에서 유럽으로 가는 뱃길은 지금까지 수에즈 운하를 지나 남쪽으로 크게 돌아갔다. " +
    "정부는 2026년 하반기에 부산에서 로테르담까지 컨테이너선 북극항로 시범운항을 추진한다. " +
    "배를 직접 움직여 두 항로가 어떻게 다른지 확인해 보라.",
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
        {
          id: "busan",
          name: "부산",
          lon: 129.04,
          lat: 35.1,
          cumulativeKm: 0,
          note: "출발. 2026년 하반기 시범운항이 예정된 기점이다.",
        },
        {
          id: "laperouse",
          name: "라페루즈 해협",
          lon: 142.0,
          lat: 45.8,
          cumulativeKm: 1400,
          note: "동해를 빠져나와 오호츠크해로 들어선다.",
        },
        {
          id: "bering",
          name: "베링 해협",
          lon: -169.0,
          lat: 65.8,
          cumulativeKm: 4700,
          note: "태평양을 벗어나 북극해로 진입하는 관문.",
        },
        {
          id: "east-siberian",
          name: "동시베리아해",
          lon: 165.0,
          lat: 71.0,
          cumulativeKm: 5600,
          note: "여기부터 결빙 구간이다. 쇄빙 능력과 극지 운항 경험이 필요해진다.",
        },
        {
          id: "laptev",
          name: "랍테프해",
          lon: 130.0,
          lat: 76.0,
          cumulativeKm: 7000,
          note: "북위 76도. 항로에서 북극점에 가장 가까워지는 구간.",
        },
        {
          id: "kara",
          name: "카라해",
          lon: 80.0,
          lat: 77.0,
          cumulativeKm: 9000,
          note: "러시아 북극권 연안. 제재 상황에 따라 운항 가능 여부가 갈리는 구간이다.",
        },
        {
          id: "barents",
          name: "바렌츠해",
          lon: 40.0,
          lat: 73.0,
          cumulativeKm: 10600,
          note: "난류의 영향으로 연중 결빙이 적다. 사실상 북극 구간의 출구다.",
        },
        {
          id: "norwegian",
          name: "노르웨이해",
          lon: 5.0,
          lat: 66.0,
          cumulativeKm: 12800,
          note: "북극해를 벗어나 유럽 항로로 합류한다.",
        },
        {
          id: "rotterdam",
          name: "로테르담",
          lon: 4.48,
          lat: 51.92,
          cumulativeKm: 15000,
          note: "도착. 유럽 최대 컨테이너 항만이자 시범운항의 종점이다.",
        },
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
        { id: "busan-s", name: "부산", lon: 129.04, lat: 35.1, cumulativeKm: 0, note: "출발." },
        {
          id: "taiwan",
          name: "대만 해협",
          lon: 120.0,
          lat: 24.0,
          cumulativeKm: 1500,
          note: "동중국해를 따라 남하한다.",
        },
        {
          id: "malacca",
          name: "말라카 해협",
          lon: 100.3,
          lat: 2.0,
          cumulativeKm: 4200,
          note: "세계 물동량이 집중되는 병목 구간.",
        },
        { id: "indian", name: "인도양", lon: 70.0, lat: 8.0, cumulativeKm: 7500, note: "적도 부근을 가로지른다." },
        {
          id: "aden",
          name: "아덴만",
          lon: 45.0,
          lat: 12.5,
          cumulativeKm: 10500,
          note: "해적 위험 구간으로 별도의 보안 비용이 든다.",
        },
        { id: "redsea", name: "홍해", lon: 38.0, lat: 22.0, cumulativeKm: 11800, note: "좁고 긴 내해를 북상한다." },
        {
          id: "suez-canal",
          name: "수에즈 운하",
          lon: 32.5,
          lat: 30.5,
          cumulativeKm: 12800,
          note: "통항료가 발생하고, 정체 시 전 구간이 지연된다.",
        },
        { id: "med", name: "지중해", lon: 15.0, lat: 36.0, cumulativeKm: 14500, note: "지중해를 서쪽으로 횡단한다." },
        { id: "gibraltar", name: "지브롤터", lon: -5.6, lat: 36.0, cumulativeKm: 16400, note: "대서양으로 나선다." },
        { id: "biscay", name: "비스케이만", lon: -8.0, lat: 46.0, cumulativeKm: 17700, note: "이베리아 반도를 돌아 북상." },
        { id: "rotterdam-s", name: "로테르담", lon: 4.48, lat: 51.92, cumulativeKm: 22000, note: "도착." },
      ],
    },
  ],

  keyNumbers: [
    {
      id: "kn-icebreaker",
      label: "극지항해 선박 건조 지원",
      prefix: "최대",
      value: "110",
      unit: "억 원",
      caption: "쇄빙선 등 1척당",
      claimId: "claim-icebreaker-support",
    },
    {
      id: "kn-portfee",
      label: "항만시설사용료 감면",
      value: "50~100",
      unit: "%",
      caption: "북극 운항 선사 대상",
      claimId: "claim-incentives",
    },
    {
      id: "kn-ltv",
      label: "선박금융 담보인정비율",
      value: "70 → 90",
      unit: "%",
      caption: "투자금리도 1%p 인하",
      claimId: "claim-incentives",
    },
    {
      id: "kn-distance",
      label: "운항 거리 단축",
      prefix: "약",
      value: "32",
      unit: "%",
      caption: "부산 → 로테르담 기준",
      claimId: "claim-reduction",
    },
  ],

  timeline: [
    {
      id: "ev-relocation",
      date: "2025",
      datePrecision: "year",
      title: "해양수산부 부산 이전, 북극항로추진본부 출범",
      summary:
        "새 정부 출범 후 해양수산부가 부산청사로 이전을 완료하고 북극항로추진본부를 새로 출범시켰다. 해양수도권 조성의 기반을 마련한 단계다.",
      claimIds: ["claim-hq-relocation"],
    },
    {
      id: "ev-strategy",
      date: "2026 상반기",
      datePrecision: "month",
      title: "해양수도권 육성 전략(안) 제시",
      summary:
        "동남권에 행정·사법·금융·기업 인프라를 집적시켜 수도권에 필적하는 해양수도권을 조성하는 전략안을 제시한다. 동남권 투자공사 설립 지원과 해양진흥공사 자본금 확충이 함께 추진된다.",
      claimIds: ["claim-maritime-capital"],
    },
    {
      id: "ev-trial",
      date: "2026 하반기",
      datePrecision: "month",
      title: "부산 → 로테르담 컨테이너선 시범운항",
      summary:
        "국내 민간 선사가 컨테이너선으로 부산에서 로테르담까지 북극항로 시범운항을 추진한다. 극지 운항 경험과 정보를 축적하는 것이 목적이다.",
      claimIds: ["claim-trial-voyage"],
    },
    {
      id: "ev-2030",
      date: "2030",
      datePrecision: "year",
      title: "쇄빙 컨테이너선 건조기술 개발 · 극지 해기사 양성",
      summary:
        "2030년까지 쇄빙 컨테이너선 건조기술 등을 개발하고 전문인력인 극지 해기사를 본격 양성한다.",
      claimIds: ["claim-2030-tech"],
    },
  ],

  claims: [
    {
      id: "claim-shortest-route",
      text:
        "북극항로는 아시아와 유럽을 연결하는 최단거리 항로로서, 물류비용을 절감하고 조선·금융 등 전후방 산업이 동반 성장할 수 있는 기회로 여겨진다.",
      assertionType: "FACT",
      sourceIds: ["src-mof-2026"],
      verified: true,
    },
    {
      id: "claim-trial-voyage",
      text:
        "2026년 하반기에 국내 민간 선사가 컨테이너선을 이용해 부산에서 로테르담까지 북극항로 시범운항을 추진한다.",
      assertionType: "FACT",
      sourceIds: ["src-mof-2026"],
      verified: true,
    },
    {
      id: "claim-icebreaker-support",
      text: "쇄빙선 등 극지항해 선박을 건조하는 경우 최대 110억 원까지 지원한다.",
      assertionType: "FACT",
      sourceIds: ["src-mof-2026"],
      verified: true,
    },
    {
      id: "claim-incentives",
      text:
        "북극 운항 선사에 항만시설사용료 50~100% 감면, 선박금융 투자금리 1%p 인하, 담보인정비율(LTV) 최대 70%에서 90%로 상향 등의 혜택을 제공한다.",
      assertionType: "FACT",
      sourceIds: ["src-mof-2026"],
      verified: true,
    },
    {
      id: "claim-hq-relocation",
      text:
        "새 정부 출범 후 해양수산부는 부산 이전을 완료하고 북극항로추진본부를 새롭게 출범시켜 해양수도권 조성 기반을 마련하였다.",
      assertionType: "FACT",
      sourceIds: ["src-mof-2026"],
      verified: true,
    },
    {
      id: "claim-maritime-capital",
      text: "2026년 상반기 중 '해양수도권 육성 전략(안)'을 제시할 예정이다.",
      assertionType: "FACT",
      sourceIds: ["src-mof-2026"],
      verified: true,
    },
    {
      id: "claim-2030-tech",
      text: "2030년까지 쇄빙 컨테이너선 건조기술 등을 개발하고 극지 해기사를 본격적으로 양성한다.",
      assertionType: "FACT",
      sourceIds: ["src-mof-2026"],
      verified: true,
    },
    {
      id: "claim-russia",
      text:
        "러시아 제재가 해제되는 경우 북동항로를 통한 컨테이너·LNG 수송 확대를 추진하고, 제재가 지속될 경우 북서항로 시범운항 등 대안을 검토한다.",
      assertionType: "FACT",
      sourceIds: ["src-mof-2026"],
      verified: true,
    },

    // ── 아래부터는 출처 미확정 ──────────────────────────────
    {
      id: "claim-nsr-distance",
      text: "부산에서 로테르담까지 북극항로 경유 거리는 약 15,000km다.",
      assertionType: "FACT",
      sourceIds: ["src-pending-distance"],
      verified: false,
    },
    {
      id: "claim-suez-distance",
      text: "부산에서 로테르담까지 수에즈 운하 경유 거리는 약 22,000km다.",
      assertionType: "FACT",
      sourceIds: ["src-pending-distance"],
      verified: false,
    },
    {
      id: "claim-reduction",
      text: "북극항로 이용 시 운항 거리가 약 7,000km, 약 32% 줄어든다.",
      assertionType: "FACT",
      sourceIds: ["src-pending-distance"],
      verified: false,
    },
  ],

  sources: [
    {
      id: "src-mof-2026",
      title:
        "북극항로 시대로의 대도약, 민생경제 활력, 대한민국 균형성장 실현 — 「2026년도 해양수산부 업무계획」 보고",
      url: "https://www.mof.go.kr/doc/ko/selectDoc.do?docSeq=64262&listUpdtDt=2025-11-07++10%3A00&menuSeq=971&bbsSeq=10",
      publisher: "해양수산부",
      publishedAt: "2025-12-23",
      type: "official",
      license: "public",
      quote:
        "북극항로는 아시아와 유럽을 연결하는 최단거리 항로로서, 물류비용을 절감하고 조선·금융 등 전후방 산업이 동반 성장할 수 있는 기회로 여겨진다. (…) 하반기에 국내 민간 선사는 컨테이너선을 이용하여 부산에서 로테르담까지 북극항로 시범운항을 추진하여 극지운항 경험과 정보를 축적한다.",
    },
    {
      id: "src-pending-distance",
      title: "[출처 확정 필요] 부산–로테르담 항로별 거리·운항일수 비교 자료",
      publisher: "미정",
      type: "statistics",
      license: "link-only",
      archivedUrl: "https://example.invalid/pending-distance",
    },
  ],
};

export const arcticRoute = storySchema.parse(raw);
