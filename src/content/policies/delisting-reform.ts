import type { PolicyInput } from "./schema";

/**
 * 상장폐지 개혁 — 동전주·시가총액 요건과 집중관리기간.
 *
 * "관리종목이 된 뒤 90일 중 연속 45일 시가총액 기준에 미달하면 즉시 상장폐지된다",
 * "금융위가 2027년 6월까지 집중관리기간을 둔다"는 글이 돈다. 큰 줄기는 맞지만 두 군데가
 * 어긋난다. 45일 요건은 '연속 45거래일 미달'이 아니라 '90거래일 안에 연속 45거래일
 * 기준을 넘지 못하면'이고, 날수는 달력일이 아니라 거래일이다. 집중관리기간 끝은
 * 보도마다 2027년 7월로 적혀 있다.
 *
 * ★ 2026-10-12 처음 등록 — 잼통 신고 센터 factbot-gap 이슈 #13.
 */
export const DELISTING_REFORM: PolicyInput = {
  slug: "delisting-reform",
  title: "상장폐지 개혁 — 동전주·시가총액 요건과 집중관리기간",
  scope: "2026년 2월 발표된 상장폐지 개혁방안의 요건(동전주·시가총액·자본잠식·공시위반), 시행일, 집중관리기간과 첫 적용",
  ministries: ["금융위원회", "한국거래소"],
  categories: ["economy", "institution"],
  asOf: "2026-10-12",
  rumors: [
    {
      id: "rumor-45-days",
      text: "관리종목 지정 후 90일 중 연속 45일 동안 시가총액 기준에 미달하면 즉시 상장폐지된다",
      claimIds: ["claim-market-cap", "claim-penny-stock"],
    },
    {
      id: "rumor-task-force",
      text: "금융위원회는 상장폐지 집중관리단을 구성해 2027년 6월까지 집중 관리 기간을 운영하고, 동전주 상장폐지 요건을 새로 도입한다",
      claimIds: ["claim-announcement", "claim-task-force", "claim-penny-stock"],
    },
  ],
  claims: [
    {
      id: "claim-announcement",
      text:
        "금융위원회와 한국거래소는 2026년 2월 12일 '부실기업 신속·엄정 퇴출을 위한 상장폐지 " +
        "개혁방안'을 발표했다. 집중관리기간 운영, 4대 상장폐지 요건(시가총액·동전주·완전자본잠식·" +
        "공시위반) 강화, 절차 효율화가 세 축이다.",
      assertionType: "FACT",
      sourceIds: ["src-hellot-20260218"],
      verified: true,
    },
    {
      id: "claim-penny-stock",
      text:
        "주가 1,000원 미만 '동전주'가 상장폐지 요건으로 새로 생겼다. 30거래일 연속 1,000원 미만이면 " +
        "관리종목으로 지정되고, 그 뒤 90거래일 안에 연속 45거래일 동안 1,000원 이상을 유지하지 " +
        "못하면 상장폐지된다. 관리종목 지정 뒤 10:1을 넘는 주식병합·감자로 피해 가는 것도 막았다.",
      assertionType: "FACT",
      sourceIds: ["src-fsc-20260513", "src-hellot-20260218"],
      verified: true,
    },
    {
      id: "claim-market-cap",
      text:
        "시가총액 요건도 같은 방식이다. 기준에 미달해 관리종목이 된 뒤 90거래일 안에 연속 45거래일 " +
        "동안 기준을 넘지 못하면 상장폐지된다. 기준 금액은 코스닥이 2026년 7월 1일 200억 원, 2027년 " +
        "1월 1일 300억 원, 코스피가 같은 날짜에 300억 원, 500억 원으로 오른다.",
      assertionType: "FACT",
      sourceIds: ["src-fsc-20260513"],
      verified: true,
    },
    {
      id: "claim-effective",
      text:
        "시가총액·동전주·공시위반 요건은 거래소 상장규정 개정(5월 13일 금융위 승인)을 거쳐 2026년 " +
        "7월 1일 시행됐다. 반기 기준 완전자본잠식 요건은 2026년 6월 말 반기보고서부터 적용된다.",
      assertionType: "FACT",
      sourceIds: ["src-fsc-20260513"],
      verified: true,
    },
    {
      id: "claim-task-force",
      text:
        "거래소에 상장폐지 심사 4개 팀, 20명 규모의 상장폐지 집중관리단을 두고 '내년 7월까지' " +
        "집중관리기간을 운영한다고 보도됐다(2026년 2월 보도 기준, 2027년 7월).",
      assertionType: "FACT",
      sourceIds: ["src-hellot-20260218"],
      verified: false,
    },
    {
      id: "claim-first-designation",
      text:
        "한국거래소는 8월 12일 주가 1,000원 미만이 30거래일 이어진 21개사를 새 요건에 따른 첫 " +
        "관리종목으로 지정한다고 밝혔다. 거래소는 개혁으로 2026년 코스닥 상장폐지 대상이 당초 50개 " +
        "안팎에서 약 150개(100~220여 개)로 늘 것으로 추산했다.",
      assertionType: "FACT",
      sourceIds: ["src-newspim-20260813", "src-hellot-20260218"],
      verified: true,
    },
  ],
  timeline: [
    {
      id: "t-announce",
      date: "2026-02-12",
      datePrecision: "day",
      title: "상장폐지 개혁방안 발표",
      summary: "금융위·거래소.",
      claimIds: ["claim-announcement", "claim-task-force"],
    },
    {
      id: "t-rules",
      date: "2026-05-13",
      datePrecision: "day",
      title: "거래소 상장규정 개정 승인",
      summary: "금융위.",
      claimIds: ["claim-effective"],
    },
    {
      id: "t-effective",
      date: "2026-07-01",
      datePrecision: "day",
      title: "새 요건 시행",
      summary: "동전주·시총·공시위반.",
      claimIds: ["claim-effective", "claim-penny-stock", "claim-market-cap"],
    },
    {
      id: "t-first",
      date: "2026-08-12",
      datePrecision: "day",
      title: "첫 동전주 관리종목 지정",
      summary: "21개사.",
      claimIds: ["claim-first-designation"],
    },
  ],
  gaps: [
    "2월 12일 금융위 보도자료 원문을 직접 확인하지 못했다. 집중관리기간 끝(2027년 7월)과 집중관리단 규모는 보도로 확인했다. 게시물의 '2027년 6월'과 어느 쪽이 맞는지 원문으로 대조하지 못했다.",
    "상장폐지 요건에 걸린 뒤 이의신청·정리매매 등 남은 절차와 기간은 다루지 않았다. '즉시 상장폐지'인지는 이 절차에 달려 있다.",
    "첫 관리종목 수는 보도마다 21개·23개·36개로 다르다. 본문의 21개를 적었다.",
  ],
  sources: [
    {
      id: "src-fsc-20260513",
      title: "상장폐지 개혁방안(2.12일발표) 시행을 위한 한국거래소 상장규정 개정 승인",
      publisher: "금융위원회",
      url: "https://www.fsc.go.kr/no010101/86875",
      publishedAt: "2026-05-13",
      type: "official",
      license: "public",
    },
    {
      id: "src-hellot-20260218",
      title: "상장폐지 개혁방안 (금융위원회·한국거래소 2월 12일 발표)",
      publisher: "헬로티",
      url: "https://www.hellot.net/news/article.html?no=110452",
      publishedAt: "2026-02-18",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-newspim-20260813",
      title: "동전주 첫 관리종목 지정…'150곳 퇴출' 코스닥 구조조정 본궤도",
      publisher: "뉴스핌",
      url: "https://www.newspim.com/news/view/20260813000785",
      publishedAt: "2026-08-13",
      type: "press",
      license: "link-only",
    },
  ],
};
