import type { PolicyInput } from "./schema";

/**
 * 불법 스포츠도박 규모·단속과 합법 시장 구조.
 *
 * 「당장 먹을 쌀조차 없는 국민이 있다면」(10월 19일) 답글에 "불법 스포츠도박에 23조 원이
 * 오가는데 정부는 단속과 합법 독점 구조 개선에 손을 놓고 있다"는 말이 달렸다(잼통 Voice).
 * 불법도박 시장 규모 추정, 2026년 단속, 합법 스포츠토토 구조와 그에 대한 지적을 적는다.
 *
 * ★ '23조 원'의 출처는 찾지 못했다. 사감위의 최신 추정은 불법도박 전체 95조 9천억 원이고,
 *   스포츠도박만의 최신 규모는 확인하지 못했다(gaps).
 * ★ 2026-10-30 처음 등록 — 잼통 Voice 이슈 #99.
 */
export const ILLEGAL_SPORTS_BETTING: PolicyInput = {
  slug: "illegal-sports-betting",
  title: "불법 스포츠도박 규모·단속과 합법 시장 구조",
  scope:
    "사행산업통합감독위원회의 불법도박 실태조사 추정, 2026년 월드컵 기간 집중 신고·차단, 청소년 도박 입건 추이, 합법 스포츠토토의 구조와 환급률 격차",
  ministries: ["사행산업통합감독위원회", "문화체육관광부", "경찰청"],
  categories: ["institution"],
  asOf: "2026-10-30",
  rumors: [
    {
      id: "rumor-23",
      text: "불법 스포츠 도박에 23조 원이 오가는데 정부는 단속과 합법 독점 구조 개선에 손을 놓고 있다",
      claimIds: ["claim-size", "claim-sports-size", "claim-crackdown", "claim-reward", "claim-structure"],
    },
  ],
  claims: [
    {
      id: "claim-size",
      text:
        "사행산업통합감독위원회(사감위)의 제6차 불법도박 실태조사는 2025년 기준 국내 불법도박 시장 규모를 약 95조 " +
        "9천억 원으로 추산했다. 스포츠도박만이 아니라 불법 카지노·온라인도박·경주류를 모두 합친 값이다.",
      assertionType: "FACT",
      sourceIds: ["src-segye-20260815"],
      verified: true,
    },
    {
      id: "claim-sports-size",
      text:
        "앞선 조사에서 불법 스포츠도박 규모는 2011년 약 7조 원에서 2019년 약 20조 원으로 커진 것으로 추산됐다. 같은 " +
        "기간 합법 스포츠토토 매출은 2조 원에서 5조 원이었다.",
      assertionType: "FACT",
      sourceIds: ["src-dailian-1032903"],
      verified: false,
    },
    {
      id: "claim-crackdown",
      text:
        "사감위는 2026년 6월 8일~7월 31일 월드컵 기간에 불법도박 사이트 집중 신고기간을 운영해 1만 4,190건을 감시했다. " +
        "불법 스포츠도박이 1만 1,087건(78.1%)으로 가장 많았고, 1만 4,182건을 방송통신심의위원회에 접속 차단 심의를 " +
        "의뢰했으며 8건은 경찰에 수사를 의뢰했다.",
      assertionType: "FACT",
      sourceIds: ["src-segye-20260815"],
      verified: true,
    },
    {
      id: "claim-reward",
      text:
        "국민체육진흥공단 불법스포츠토토신고센터는 사이트 신고 1건에 1만 5천 원, 계좌정보를 함께 내면 10만 원, 운영자 " +
        "신고에는 최대 2억 원의 포상금을 준다. 도박 범죄로 입건된 소년범은 2021년 50명에서 2025년 337명으로 늘었다.",
      assertionType: "FACT",
      sourceIds: ["src-segye-20260815"],
      verified: true,
    },
    {
      id: "claim-structure",
      text:
        "합법 스포츠 베팅은 국민체육진흥공단이 발행하는 스포츠토토 하나다. 불법 사이트의 환급률은 90~95%로 추정되는 " +
        "반면 스포츠토토는 60~65% 수준이어서, 전문가들은 단속과 함께 매출총량제 완화 등으로 합법 시장의 경쟁력을 " +
        "높여야 한다고 주장한다.",
      assertionType: "INTERPRETATION",
      sourceIds: ["src-dailian-1032903", "src-etoday-1189082"],
      verified: false,
    },
  ],
  critiqueIds: ["claim-structure"],
  timeline: [
    {
      id: "t-worldcup",
      date: "2026-06-08",
      datePrecision: "day",
      title: "월드컵 불법도박 집중 신고기간",
      summary: "7월 31일까지 1만 4,190건 감시.",
      claimIds: ["claim-crackdown"],
    },
    {
      id: "t-survey",
      date: "2026-08",
      datePrecision: "month",
      title: "제6차 실태조사 결과 보도",
      summary: "불법도박 전체 95조 9천억 원 추정.",
      claimIds: ["claim-size"],
    },
  ],
  gaps: [
    "'불법 스포츠도박 23조 원'이 어느 조사의 값인지 찾지 못했다.",
    "제6차 실태조사의 불법 스포츠도박 단독 규모는 확인하지 못했다.",
    "합법 스포츠토토의 독점·매출총량제를 바꾸려는 정부 계획은 찾지 못했다.",
  ],
  sources: [
    {
      id: "src-segye-20260815",
      title: "신고하면 최대 2억 '역대급' 포상에도…하루 263건 쏟아진 '95.9조 베팅판' [권준영의 머니볼]",
      publisher: "세계일보",
      url: "https://www.segye.com/newsView/20260814518612",
      publishedAt: "2026-08-15",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-dailian-1032903",
      title: "[문정부 4년 DATA] 불법스포츠토토 '썩은 뿌리' 여전했다",
      publisher: "데일리안",
      url: "https://www.dailian.co.kr/news/view/1032903/",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-etoday-1189082",
      title: "과세 당국, 불법 사행산업은 모르쇠…풍선효과 우려도",
      publisher: "이투데이",
      url: "https://www.etoday.co.kr/news/view/1189082",
      type: "press",
      license: "link-only",
    },
  ],
};
