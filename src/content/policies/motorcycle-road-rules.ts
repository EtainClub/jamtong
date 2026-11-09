import type { PolicyInput } from "./schema";

/**
 * 이륜차 통행 규제: 고속도로 통행 금지와 보도(인도) 주행 단속.
 *
 * 대통령 유튜브 영상 답글에 "OECD에서 유일하게 막힌 이륜차 고속도로 통행을 배기량별로라도 단계적으로 허용해 달라"(이슈 #260)와
 * "인도로 달리는 오토바이가 위험하니 강하게 단속해 달라"(이슈 #261)는 요청이 달렸다(잼통 Voice). 두 규제의 현재 상태를 함께 적는다.
 *
 * ★ 이륜차 주정차 과태료 개선 주문은 policy:traffic-enforcement에 있다.
 * ★ 2026-11-09 처음 등록 — 잼통 Voice 이슈 #260, #261.
 */
export const MOTORCYCLE_ROAD_RULES: PolicyInput = {
  slug: "motorcycle-road-rules",
  title: "이륜차 고속도로 통행 금지와 보도 주행 단속",
  scope:
    "도로교통법의 이륜차 고속도로·자동차전용도로 통행 금지와 헌법재판소 합헌 결정, 2026년 3월 경찰청의 보도 통행 무인 단속장비 시범운영",
  ministries: ["경찰청"],
  categories: ["institution", "region"],
  asOf: "2026-11-09",
  rumors: [
    {
      id: "rumor-highway",
      text: "OECD에서 유일하게 막힌 이륜차 고속도로 통행을 배기량별로라도 단계적으로 허용해 달라",
      claimIds: ["claim-ban", "claim-court", "claim-oecd"],
    },
    {
      id: "rumor-sidewalk",
      text: "인도로 달리는 오토바이가 위험하니 강하게 단속해 달라",
      claimIds: ["claim-sidewalk-camera", "claim-sidewalk-plan"],
    },
  ],
  claims: [
    {
      id: "claim-ban",
      text: "도로교통법 제63조는 이륜자동차의 고속도로·자동차전용도로 통행을 원칙적으로 금지한다.",
      assertionType: "FACT",
      sourceIds: ["src-lawtimes-160125"],
      verified: true,
    },
    {
      id: "claim-court",
      text:
        "헌법재판소는 이 금지 조항에 대한 헌법소원(2019헌마203)을 재판관 전원일치로 기각해 합헌으로 봤다. 이륜차의 구조적 사고 위험성과 사고 결과의 중대성을 근거로 들었다. " +
        "다만 안전한 교통문화가 정착되면 일정 배기량 이상 이륜차의 고속도로 통행을 허용하는 등 입법 개선이 필요하다는 보충의견이 붙었다.",
      assertionType: "FACT",
      sourceIds: ["src-lawtimes-160125"],
      verified: true,
    },
    {
      id: "claim-oecd",
      text: "OECD 회원국 가운데 이륜차의 고속도로 진입을 전면 금지하는 나라는 한국뿐이라는 주장은 헌법소원 청구인과 이륜차 단체가 펴 온 것이다.",
      assertionType: "CLAIM",
      assertedBy: "헌법소원 청구인·이륜차 단체",
      sourceIds: ["src-lawtimes-160125", "src-kmnews-18942825"],
      verified: false,
    },
    {
      id: "claim-sidewalk-camera",
      text:
        "경찰청은 이륜차의 보도 통행을 잡는 무인 '보도 통행 단속장비'를 개발해 2026년 3월부터 서울 영등포시장 교차로·상봉역 앞 교차로, 울산 병영사거리, 수원시청 앞·수원 KCC 앞 교차로 5곳에서 시범운영했다. " +
        "보도나 통행금지 장소를 지나는 차량의 번호판을 인식해 동선을 추적·단속하는 방식이다.",
      assertionType: "FACT",
      sourceIds: ["src-khan-20260315", "src-asiae-20260314"],
      verified: true,
    },
    {
      id: "claim-sidewalk-plan",
      text:
        "새 장비는 무인 단속장비가 늘어나지 않도록 기존 신호·과속 단속카메라에 기능을 더하는 형태로 설치한다. 경찰청은 시범운영 효과를 분석한 뒤 설치·운영 기준을 만들어 배포하겠다고 밝혔다.",
      assertionType: "FACT",
      sourceIds: ["src-khan-20260315"],
      verified: true,
    },
  ],
  critiqueIds: [],
  timeline: [
    {
      id: "t-camera",
      date: "2026-03-15",
      datePrecision: "day",
      title: "보도 통행 단속장비 시범운영",
      summary: "전국 5곳.",
      claimIds: ["claim-sidewalk-camera", "claim-sidewalk-plan"],
    },
  ],
  gaps: [
    "보도 통행 단속장비 시범운영의 효과 분석과 전국 확대 시기는 11월 9일까지 발표되지 않았다.",
    "헌재 결정의 선고일은 보도 기사로만 확인했다.",
    "이륜차 고속도로 통행을 단계적으로 허용하는 법 개정을 정부나 국회가 추진한다는 2026년 자료는 찾지 못했다.",
  ],
  sources: [
    {
      id: "src-lawtimes-160125",
      title: "'오토바이 고속도로 통행금지' 합헌",
      publisher: "법률신문",
      url: "https://www.lawtimes.co.kr/news/articleView.html?idxno=160125",
      publishedAt: "2020",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-kmnews-18942825",
      title: "이륜차, '자동차전용도로에서 달리자'에 한 표, 국민권익위원회에서 의견 수렴 중",
      publisher: "한국이륜차신문",
      url: "https://www.kmnews.net/NEWS/?bmode=view&idx=18942825",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-khan-20260315",
      title: "인도 위 오토바이, 무인 장비로 단속···전국 5곳서 시범운영",
      publisher: "경향신문",
      url: "https://www.khan.co.kr/article/202603151027001/",
      publishedAt: "2026-03-15",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-asiae-20260314",
      title: "'오토바이 인도 주행' 잡는다…경찰, 단속장비 시범운영",
      publisher: "아시아경제",
      url: "https://view.asiae.co.kr/article/2026031421234535635",
      publishedAt: "2026-03-14",
      type: "press",
      license: "link-only",
    },
  ],
};
