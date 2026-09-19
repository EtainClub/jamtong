import { storySchema, type StoryInput } from "@/content/schema";
import { MOF_2026, NANET_2025 } from "@/content/sources";

/**
 * 북극항로 — Sprint 1 검증용 스토리.
 *
 * 출처
 *  - `src-mof-2026`: 해양수산부 2026년도 업무계획 보도자료. 정책·일정·지원 규모.
 *  - `src-nanet-2025`: 국회도서관 Data&Law 2025-9호. 항로별 거리·운항일수.
 *
 * 거리 수치의 전제 조건에 주의한다. 부산 출발 로테르담행 78,000톤 선박,
 * 7~10월 기준 분석값이다. 북극항로는 연중 통항이 아니므로 이 조건을 빼고
 * 숫자만 보여주면 오도가 된다. `comparisonNote`로 항상 함께 표시한다.
 *
 * 이 파일은 데이터만 담는다. 화면 구성은 features/ 아래 컴포넌트가 하드코딩으로 갖는다.
 */

const raw: StoryInput = {
  id: "arctic-route",
  slug: "arctic-route",
  title: "북극항로",
  subtitle: "새로운 길이 대한민국의 미래를 넓힙니다",
  kicker: "주요 정책",
  summary:
    "부산에서 유럽으로 가는 뱃길은 지금까지 수에즈 운하나 희망봉을 지나 남쪽으로 크게 돌아갔다. " +
    "북극을 가로지르면 로테르담까지 거리는 20,400km에서 13,000km로 줄어든다. " +
    "정부는 2026년 하반기에 부산에서 로테르담까지 컨테이너선 시범운항을 추진한다. " +
    "배를 직접 움직여 두 항로가 어떻게 다른지 확인해 보라.",
  type: "achievement",
  publishStatus: "published",

  scenes: [
    {
      id: "route-map",
      kind: "route-map",
      heading: "부산에서 로테르담까지",
      lede:
        "북극 중심 지도입니다. 중심에서 멀어질수록 실제 거리도 멀어지므로, 두 항로의 길이를 눈으로 직접 비교할 수 있습니다. 스크롤하면 배가 항로를 따라 나아갑니다.",
      claimIds: ["claim-nsr-distance", "claim-suez-distance"],
      routes: [
        {
          id: "nsr",
          name: "북극항로",
          isBaseline: false,
          totalKm: 13000,
          totalDaysMin: 20,
          totalDaysMax: 24,
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
              cumulativeKm: 1200,
              note: "동해를 빠져나와 오호츠크해로 들어선다.",
            },
            {
              id: "bering",
              name: "베링 해협",
              lon: -169.0,
              lat: 65.8,
              cumulativeKm: 4100,
              note: "태평양을 벗어나 북극해로 진입하는 관문.",
            },
            {
              id: "east-siberian",
              name: "동시베리아해",
              lon: 165.0,
              lat: 71.0,
              cumulativeKm: 4850,
              note: "여기부터 결빙 구간이다. 쇄빙 능력과 극지 운항 경험이 필요해진다.",
            },
            {
              id: "laptev",
              name: "랍테프해",
              lon: 130.0,
              lat: 76.0,
              cumulativeKm: 6050,
              note: "북위 76도. 항로에서 북극점에 가장 가까워지는 구간.",
            },
            {
              id: "kara",
              name: "카라해",
              lon: 80.0,
              lat: 77.0,
              cumulativeKm: 7800,
              note: "러시아 북극권 연안. 제재 상황에 따라 운항 가능 여부가 갈리는 구간이다.",
            },
            {
              id: "barents",
              name: "바렌츠해",
              lon: 40.0,
              lat: 73.0,
              cumulativeKm: 9200,
              note: "난류의 영향으로 연중 결빙이 적다. 사실상 북극 구간의 출구다.",
            },
            {
              id: "norwegian",
              name: "노르웨이해",
              lon: 5.0,
              lat: 66.0,
              cumulativeKm: 11100,
              note: "북극해를 벗어나 유럽 항로로 합류한다.",
            },
            {
              id: "rotterdam",
              name: "로테르담",
              lon: 4.48,
              lat: 51.92,
              cumulativeKm: 13000,
              note: "도착. 유럽 최대 컨테이너 항만이자 시범운항의 종점이다.",
            },
          ],
        },
        {
          id: "suez",
          name: "수에즈 항로",
          isBaseline: true,
          totalKm: 20400,
          totalDaysMin: 30,
          totalDaysMax: 34,
          claimId: "claim-suez-distance",
          waypoints: [
            { id: "busan-s", name: "부산", lon: 129.04, lat: 35.1, cumulativeKm: 0, note: "출발." },
            {
              id: "taiwan",
              name: "대만 해협",
              lon: 120.0,
              lat: 24.0,
              cumulativeKm: 1400,
              note: "동중국해를 따라 남하한다.",
            },
            {
              id: "malacca",
              name: "말라카 해협",
              lon: 100.3,
              lat: 2.0,
              cumulativeKm: 3900,
              note: "세계 물동량이 집중되는 병목 구간.",
            },
            { id: "indian", name: "인도양", lon: 70.0, lat: 8.0, cumulativeKm: 7000, note: "적도 부근을 가로지른다." },
            {
              id: "aden",
              name: "아덴만",
              lon: 45.0,
              lat: 12.5,
              cumulativeKm: 9750,
              note: "해적 위험 구간으로 별도의 보안 비용이 든다.",
            },
            { id: "redsea", name: "홍해", lon: 38.0, lat: 22.0, cumulativeKm: 10950, note: "좁고 긴 내해를 북상한다." },
            {
              id: "suez-canal",
              name: "수에즈 운하",
              lon: 32.5,
              lat: 30.5,
              cumulativeKm: 11850,
              note: "통항료가 발생하고, 정체 시 전 구간이 지연된다.",
            },
            { id: "med", name: "지중해", lon: 15.0, lat: 36.0, cumulativeKm: 13450, note: "지중해를 서쪽으로 횡단한다." },
            { id: "gibraltar", name: "지브롤터", lon: -5.6, lat: 36.0, cumulativeKm: 15200, note: "대서양으로 나선다." },
            { id: "biscay", name: "비스케이만", lon: -8.0, lat: 46.0, cumulativeKm: 16400, note: "이베리아 반도를 돌아 북상." },
            { id: "rotterdam-s", name: "로테르담", lon: 4.48, lat: 51.92, cumulativeKm: 20400, note: "도착." },
          ],
        },
      ],

    },
    {
      id: "route-compare",
      kind: "route-compare",
      heading: "세 갈래 길",
      lede:
        "같은 목적지에 닿는 세 항로를 나란히 놓으면 차이가 분명해집니다. 막대 길이는 거리에 정비례합니다.",
      claimIds: ["claim-route-comparison"],
      comparisons: [
        {
          id: "cmp-nsr",
          name: "북극항로 (북동항로)",
          km: 13000,
          daysMin: 20,
          daysMax: 24,
          highlight: true,
          claimId: "claim-route-comparison",
        },
        {
          id: "cmp-suez",
          name: "수에즈 운하",
          km: 20400,
          daysMin: 30,
          daysMax: 34,
          highlight: false,
          claimId: "claim-route-comparison",
        },
        {
          id: "cmp-cape",
          name: "희망봉",
          km: 24000,
          daysMin: 36,
          daysMax: 40,
          highlight: false,
          claimId: "claim-route-comparison",
        },
      ],

    note:
    "부산항에서 출발한 로테르담행 78,000톤 선박을 대상으로 7~10월 기준으로 분석한 값이다. " +
    "북극항로는 결빙으로 연중 통항이 어려우므로, 이 수치는 통항 가능 기간의 조건부 비교다.",
    },
  ],

  /**
   * ⑦ 쇼츠. 유튜브에 올린 뒤 id만 적는다.
   *
   *   youtube.com/shorts/AbCdEfGhIjK  →  youtubeId: "AbCdEfGhIjK"
   *
   * claimIds는 영상에서 말한 내용의 근거다. 짧을수록 맥락이 잘리므로
   * 근거 없는 쇼츠는 스키마가 거부한다.
   *
   *   shorts: [
   *     {
   *       id: "short-arctic-01",
   *       title: "부산에서 유럽까지, 7,400km를 줄인다",
   *       summary: "수에즈 항로와 나란히 놓고 봅니다.",
   *       youtubeId: "AbCdEfGhIjK",
   *       durationSec: 42,
   *       claimIds: ["claim-reduction"],
   *       publishedAt: "2026-09-19",
   *     },
   *   ],
   */
  shorts: [],

  // 카드에 실을 한 숫자. 화면 순서상 첫 항목은 건조 지원금이지만,
  // 이 스토리를 한 줄로 말하면 "얼마나 짧아지나"다.
  headlineKeyNumberId: "kn-distance",

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
      value: "36",
      unit: "%",
      caption: "20,400km → 13,000km",
      claimId: "claim-reduction",
    },
    {
      id: "kn-km",
      label: "단축 거리",
      prefix: "약",
      value: "7,400",
      unit: "km",
      caption: "수에즈 항로 대비",
      claimId: "claim-reduction",
    },
    {
      id: "kn-days",
      label: "운항 일수",
      value: "30~34 → 20~24",
      unit: "일",
      caption: "7~10월 기준",
      claimId: "claim-route-comparison",
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
      date: "2026-06",
      displayDate: "2026 상반기",
      datePrecision: "month",
      title: "해양수도권 육성 전략(안) 제시",
      summary:
        "동남권에 행정·사법·금융·기업 인프라를 집적시켜 수도권에 필적하는 해양수도권을 조성하는 전략안을 제시한다. 동남권 투자공사 설립 지원과 해양진흥공사 자본금 확충이 함께 추진된다.",
      claimIds: ["claim-maritime-capital"],
    },
    {
      id: "ev-trial",
      date: "2026-07",
      displayDate: "2026 하반기",
      datePrecision: "month",
      title: "부산 → 로테르담 컨테이너선 시범운항",
      summary:
        "국내 민간 선사가 컨테이너선으로 부산에서 로테르담까지 북극항로 시범운항을 추진한다. 극지 운항 경험과 정보를 축적하는 것이 목적이다.",
      claimIds: ["claim-trial-voyage", "claim-nsr-distance"],
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

  /**
   * 관계도 — 기관과 사업만으로 구성한다. 실존 개인은 올리지 않는다.
   * 모든 Edge는 이 스토리의 claim을 근거로 갖는다.
   */
  /**
   * 쉬운 설명. 장면마다 근거를 따로 매단다 — 쉽게 쓸수록 한 문장이 감당하는
   * 주장이 커지기 때문이다.
   */
  eli5: {
    intro:
      "부산에서 유럽까지 배로 짐을 보내는 길이 바뀌려고 해요. 여섯 장면으로 나눠서 볼게요.",
    scenes: [
      {
        id: "e-suez",
        title: "지금은 아래로 크게 돌아가요",
        say: "배가 남쪽으로 내려갔다가 수에즈 운하를 지나 유럽으로 올라가요. 길이 아주 길어요.",
        art: "suez-long",
        fact: { value: "20,400 km · 30~34일", tone: "warm" },
        claimIds: ["claim-suez-distance"],
      },
      {
        id: "e-arctic",
        title: "북극 위로 가면 가까워요",
        say: "지구 꼭대기를 가로지르면 훨씬 빨리 도착해요. 위로 넘어가는 게 지름길이에요.",
        art: "arctic-short",
        fact: { value: "13,000 km · 20~24일", tone: "ice" },
        claimIds: ["claim-nsr-distance"],
      },
      {
        id: "e-compare",
        title: "얼마나 줄어드냐면요",
        say: "길이는 7,400km, 시간은 열흘쯤 줄어요. 기름값도 그만큼 아껴요.",
        art: "compare-bars",
        fact: { value: "약 36% 단축", tone: "ice" },
        claimIds: ["claim-reduction"],
      },
      {
        id: "e-season",
        title: "그런데 바다가 얼어요",
        say: "북극 바다는 대부분 얼어 있어요. 얼음이 녹는 여름에만 배가 지나갈 수 있어요.",
        art: "season",
        fact: { value: "7월 ~ 10월", tone: "ice" },
        claimIds: ["claim-route-comparison"],
      },
      {
        id: "e-icebreaker",
        title: "얼음 깨는 배가 필요해요",
        say: "두꺼운 얼음을 밀고 갈 수 있는 특별한 배를 쇄빙선이라고 해요. 정부가 만드는 값을 도와줘요.",
        art: "icebreaker",
        fact: { value: "배 한 척당 최대 110억 원", tone: "ice" },
        claimIds: ["claim-icebreaker-support"],
      },
      {
        id: "e-trial",
        title: "2026년에 한번 가봐요",
        say: "우리나라 회사 배가 짐을 싣고 부산에서 로테르담까지 시험 삼아 가볼 예정이에요.",
        art: "trial-voyage",
        fact: { value: "하반기 시범운항", tone: "ice" },
        claimIds: ["claim-trial-voyage"],
      },
    ],
    caveat: {
      text:
        "아직 정해지지 않은 것도 있어요. 북극 바다의 일부는 러시아를 지나가야 해서, 러시아에 대한 제재가 어떻게 되느냐에 따라 이 길을 쓸 수 있을지가 달라져요.",
      claimIds: ["claim-russia"],
    },
  },

  graph: {
    note:
      "해양수산부 「2026년도 업무계획」과 국회도서관 『Data&Law』에서 확인된 관계만 그렸다. " +
      "연표를 움직이면 그 시점까지 성립한 관계만 남는다.",
    entities: [
      { id: "mof", name: "해양수산부", kind: "government", isFocus: true },
      { id: "arctic-hq", name: "북극항로추진본부", kind: "organization" },
      { id: "nsr", name: "북극항로", kind: "project" },
      { id: "shipper", name: "국내 민간 선사", kind: "company" },
      { id: "busan", name: "부산항", kind: "place" },
      { id: "rotterdam", name: "로테르담항", kind: "place" },
      { id: "russia", name: "러시아", kind: "country" },
      { id: "kmi", name: "해양수산개발원", kind: "organization" },
      { id: "tech2030", name: "쇄빙선 기술 · 해기사", kind: "project" },
      { id: "capital", name: "해양수도권", kind: "project" },
    ],
    relations: [
      {
        id: "r-hq",
        fromId: "mof",
        toId: "arctic-hq",
        label: "북극항로추진본부를 새로 출범시켰다.",
        startDate: "2025",
        startPrecision: "year",
        assertionType: "FACT",
        claimIds: ["claim-hq-relocation"],
      },
      {
        id: "r-busan-move",
        fromId: "mof",
        toId: "busan",
        label: "부산청사로 이전을 완료했다.",
        startDate: "2025",
        startPrecision: "year",
        assertionType: "FACT",
        claimIds: ["claim-hq-relocation"],
      },
      {
        id: "r-kmi",
        fromId: "kmi",
        toId: "nsr",
        label: "부산–로테르담 항로별 거리·운항일수를 분석했다. 북극항로 약 13,000km, 20~24일.",
        startDate: "2025-08",
        startPrecision: "month",
        assertionType: "FACT",
        claimIds: ["claim-route-comparison"],
      },
      {
        id: "r-capital",
        fromId: "mof",
        toId: "capital",
        label: "해양수도권 육성 전략(안)을 제시한다.",
        startDate: "2026-06",
        startPrecision: "month",
        assertionType: "FACT",
        claimIds: ["claim-maritime-capital"],
      },
      {
        id: "r-capital-busan",
        fromId: "capital",
        toId: "busan",
        label: "동남권에 행정·사법·금융·기업 인프라를 집적시킨다.",
        startDate: "2026-06",
        startPrecision: "month",
        assertionType: "FACT",
        claimIds: ["claim-maritime-capital"],
      },
      {
        id: "r-support",
        fromId: "mof",
        toId: "shipper",
        label: "극지항해 선박 건조를 최대 110억 원까지 지원한다.",
        startDate: "2026",
        startPrecision: "year",
        assertionType: "FACT",
        claimIds: ["claim-icebreaker-support"],
      },
      {
        id: "r-incentive",
        fromId: "mof",
        toId: "shipper",
        label: "항만시설사용료 50~100% 감면, 선박금융 금리 1%p 인하, LTV 70→90% 상향.",
        startDate: "2026",
        startPrecision: "year",
        assertionType: "FACT",
        claimIds: ["claim-incentives"],
      },
      {
        id: "r-russia",
        fromId: "russia",
        toId: "nsr",
        label:
          "제재가 해제되면 러시아를 경유하는 북동항로로 수송을 확대하고, 지속되면 북서항로 등 대안을 검토한다.",
        startDate: "2026",
        startPrecision: "year",
        assertionType: "FACT",
        claimIds: ["claim-russia"],
      },
      {
        id: "r-trial",
        fromId: "shipper",
        toId: "nsr",
        label: "컨테이너선으로 북극항로 시범운항을 추진한다.",
        startDate: "2026-07",
        startPrecision: "month",
        assertionType: "FACT",
        claimIds: ["claim-trial-voyage"],
      },
      {
        id: "r-origin",
        fromId: "busan",
        toId: "nsr",
        label: "시범운항의 기점.",
        startDate: "2026-07",
        startPrecision: "month",
        assertionType: "FACT",
        claimIds: ["claim-trial-voyage"],
      },
      {
        id: "r-dest",
        fromId: "nsr",
        toId: "rotterdam",
        label: "시범운항의 종점. 아시아와 유럽을 잇는 최단거리 항로다.",
        startDate: "2026-07",
        startPrecision: "month",
        assertionType: "FACT",
        claimIds: ["claim-trial-voyage", "claim-shortest-route"],
      },
      {
        id: "r-tech",
        fromId: "mof",
        toId: "tech2030",
        label: "2030년까지 쇄빙 컨테이너선 건조기술을 개발하고 극지 해기사를 양성한다.",
        startDate: "2030",
        startPrecision: "year",
        assertionType: "FACT",
        claimIds: ["claim-2030-tech"],
      },
      {
        id: "r-tech-shipper",
        fromId: "tech2030",
        toId: "shipper",
        label: "확보된 기술과 인력이 선사의 극지 운항 역량으로 이어진다.",
        startDate: "2030",
        startPrecision: "year",
        assertionType: "INTERPRETATION",
        claimIds: ["claim-2030-tech"],
      },
    ],
  },

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

    {
      id: "claim-route-comparison",
      text:
        "한국해양수산개발원이 부산항에서 출발한 로테르담행 78,000톤 선박을 대상으로 7~10월 기준 분석한 결과, 북극항로(북동항로)는 약 13,000km·20~24일, 수에즈 운하 경유는 약 20,400km·30~34일, 희망봉 경유는 약 24,000km·36~40일로 나타났다.",
      assertionType: "FACT",
      sourceIds: ["src-nanet-2025"],
      verified: true,
    },
    {
      id: "claim-nsr-distance",
      text: "부산에서 로테르담까지 북극항로(북동항로) 경유 거리는 약 13,000km, 소요 시간은 약 20~24일이다.",
      assertionType: "FACT",
      sourceIds: ["src-nanet-2025"],
      verified: true,
    },
    {
      id: "claim-suez-distance",
      text: "부산에서 로테르담까지 수에즈 운하 경유 거리는 약 20,400km, 소요 시간은 약 30~34일이다.",
      assertionType: "FACT",
      sourceIds: ["src-nanet-2025"],
      verified: true,
    },
    {
      id: "claim-reduction",
      text:
        "북극항로를 이용하면 수에즈 운하 경유 대비 운항 거리가 약 7,400km, 약 36% 줄어든다. (20,400km → 13,000km)",
      assertionType: "FACT",
      sourceIds: ["src-nanet-2025"],
      verified: true,
    },
  ],

  sources: [MOF_2026, NANET_2025],
};

export const arcticRoute = storySchema.parse(raw);
