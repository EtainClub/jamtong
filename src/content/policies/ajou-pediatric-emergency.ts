import type { PolicyInput } from "./schema";

/**
 * 아주대병원 소아응급센터 영아 사망 수사와 소아응급 인력 이탈.
 *
 * 10월 말 X 게시물 답글에 "우즈베키스탄 영아 사망 뒤 소아응급 전문의 사직과 경찰 수사로
 * 응급체계가 흔들리니 정부가 바로잡아야 한다"는 말이 달렸다(잼통 Voice). 사건 경위, 압수수색을
 * 둘러싼 의료계와 경찰의 주장, 사직 규모를 적는다.
 *
 * ★ 의료과실 여부는 수사 중이다. 판정하지 않는다.
 * ★ 사직 인원은 보도 시점마다 다르다. 날짜와 함께 적는다.
 * ★ 2026-10-31 처음 등록 — 잼통 Voice 이슈 #116.
 */
export const AJOU_PEDIATRIC_EMERGENCY: PolicyInput = {
  slug: "ajou-pediatric-emergency",
  title: "아주대병원 소아응급센터 영아 사망 수사와 소아응급 인력 이탈",
  scope:
    "2026년 7월 아주대병원 소아전문응급의료센터의 외국 국적 영아 사망, 부모 고소와 9월 30일 경찰 압수수색, 의료계와 경찰의 상반된 설명, 전문의 사직과 소아응급 인력 현황",
  ministries: ["경찰청", "보건복지부"],
  categories: ["welfare", "institution"],
  asOf: "2026-10-31",
  rumors: [
    {
      id: "rumor-system",
      text: "우즈베키스탄 영아 사망 뒤 아주대병원 소아응급 전문의 사직과 경찰 수사로 응급체계가 흔들리니 정부가 바로잡아야 한다",
      claimIds: ["claim-case", "claim-search", "claim-dispute", "claim-resign", "claim-workforce"],
    },
  ],
  claims: [
    {
      id: "claim-case",
      text:
        "2026년 7월 생후 4개월 우즈베키스탄 국적 영아가 심정지 상태로 아주대병원 소아전문응급의료센터에 이송됐고, 1시간 넘는 " +
        "심폐소생술에도 숨졌다. 부모는 의료과실을 주장하며 의료진을 고소했다.",
      assertionType: "FACT",
      sourceIds: ["src-dailymedi-941651"],
      verified: true,
    },
    {
      id: "claim-search",
      text: "경기남부경찰청은 9월 30일 이 사건 수사를 위해 아주대병원 소아전문응급의료센터를 압수수색했다.",
      assertionType: "FACT",
      sourceIds: ["src-mt-20261018"],
      verified: true,
    },
    {
      id: "claim-dispute",
      text:
        "경찰은 진료가 끝난 뒤 17분 동안 최소한으로 확인했다는 입장이고, 센터장과 소아응급의학회는 진료 중에 자리를 비우라는 " +
        "요구를 받는 등 범죄자 취급을 당했으며 공권력 남용이라고 반발했다.",
      assertionType: "CLAIM",
      assertedBy: "경찰 / 아주대병원 소아응급센터장·대한소아응급의학회",
      sourceIds: ["src-dailymedi-941651", "src-mt-20261018"],
      verified: true,
    },
    {
      id: "claim-resign",
      text:
        "10월 18일 보도 기준으로 아주대병원 센터 전문의 1명이 사직서를 냈고 다른 소아응급센터에서도 2명이 사직서를 냈다. " +
        "소아응급의학회는 병원들이 소아응급센터 지정 반납을 논의하고 있다고 밝혔다. 이후 '아주대 소아응급 교수 7명 사직' 보도도 나왔다.",
      assertionType: "FACT",
      sourceIds: ["src-mt-20261018", "src-dailymedi-941651"],
      verified: true,
    },
    {
      id: "claim-workforce",
      text:
        "전국 소아청소년과 전공의는 9월 말 113명이고 78.8%가 서울에 있다. 2027년 1년 차 모집에서 수련병원 61곳 가운데 52곳이 " +
        "한 명도 뽑지 못했다.",
      assertionType: "FACT",
      sourceIds: ["src-mt-20261018"],
      verified: true,
    },
  ],
  critiqueIds: ["claim-dispute"],
  timeline: [
    {
      id: "t-death",
      date: "2026-07",
      datePrecision: "month",
      title: "영아 사망",
      summary: "심정지 이송 뒤 사망, 부모 고소.",
      claimIds: ["claim-case"],
    },
    {
      id: "t-search",
      date: "2026-09-30",
      datePrecision: "day",
      title: "경찰 압수수색",
      summary: "경기남부경찰청.",
      claimIds: ["claim-search", "claim-dispute"],
    },
    {
      id: "t-resign",
      date: "2026-10-18",
      datePrecision: "day",
      title: "전문의 사직 보도",
      summary: "센터 지정 반납 논의.",
      claimIds: ["claim-resign"],
    },
  ],
  gaps: [
    "보건복지부가 응급 현장 수사 가이드라인 요구에 어떻게 답했는지는 확인하지 못했다.",
    "의료과실 여부와 수사 결과는 아직 나오지 않았다.",
    "사직서 수리 여부와 센터 운영 차질의 실제 규모는 확인하지 못했다.",
  ],
  sources: [
    {
      id: "src-dailymedi-941651",
      title: "아주대병원 소아응급 의료진 고소 '우즈벡 부모'",
      publisher: "데일리메디",
      url: "https://dailymedi.com/news/news_view.php?wr_id=941651",
      publishedAt: "2026-10-21",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-mt-20261018",
      title: "\"소아응급 현장 떠나겠다\" 전문의 줄줄이 퇴사…압수수색 파장 현실로",
      publisher: "머니투데이",
      url: "https://www.mt.co.kr/article/2026101810254714918",
      publishedAt: "2026-10-18",
      type: "press",
      license: "link-only",
    },
  ],
};
