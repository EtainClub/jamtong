import type { PolicyInput } from "./schema";

/**
 * 무기수 가석방과 대통령 조카 사건 의혹 (2026년 10월).
 *
 * 대통령 X 게시물 여럿에 "대통령 조카(암사동 모녀 살인범)가 가석방됐다는데 사실인가",
 * "무기수를 가석방하면서 명단도 공개하지 않는다"는 답글이 달렸다(잼통 Voice). 10월 19일
 * 국정감사에서 나온 말이 무엇이었는지, 무기수 가석방의 법적 요건과 공개 범위를 적는다.
 *
 * ★ 이 페이지는 조카가 가석방됐다고도, 되지 않았다고도 단정하지 않는다. 10월 30일까지
 *   가석방 결정을 알린 법무부 발표나 보도는 찾지 못했다(gaps).
 * ★ 2026-10-30 처음 등록 — 잼통 Voice 이슈 #83.
 */
export const PAROLE_2026: PolicyInput = {
  slug: "parole-2026",
  title: "무기수 가석방과 대통령 조카 사건 의혹 (2026년 10월)",
  scope:
    "2026년 10월 국정감사의 무기수 가석방 질의, 대통령 조카 사건의 경과, 무기형 가석방 요건, 가석방 심사 자료의 공개 범위, 측근 가석방 요청 의혹에 대한 법무부 답변",
  ministries: ["법무부"],
  categories: ["institution"],
  asOf: "2026-10-30",
  rumors: [
    {
      id: "rumor-nephew",
      text: "암사동 모녀 살인범인 대통령 조카가 가석방됐다는 소문이 사실인가",
      claimIds: ["claim-jjw", "claim-case", "claim-law"],
    },
    {
      id: "rumor-lifer",
      text: "무기징역을 받은 범죄자를 가석방한다는 소식이 사실인가",
      claimIds: ["claim-law", "claim-count"],
    },
    {
      id: "rumor-list",
      text: "무기수를 가석방하면서 명단도 공개하지 않아 피해자를 외면한다",
      claimIds: ["claim-disclosure"],
    },
    {
      id: "rumor-relative",
      text: "이번 가석방 대상 강력범 가운데 대통령 친인척이 포함됐다는 의혹이 돈다",
      claimIds: ["claim-jjw", "claim-moj-request"],
    },
  ],
  claims: [
    {
      id: "claim-jjw",
      text:
        "국민의힘 주진우 의원은 2026년 10월 19일 국회 법제사법위원회 국정감사에서 암사동 모녀 살인 사건을 들어 " +
        "무기징역수도 법률상 20년을 복역하면 가석방될 수 있다며 무기수 가석방을 자제해야 한다고 했다. 대통령 조카가 " +
        "가석방될 수 있다는 가능성을 제기한 것이고, 가석방이 결정됐다는 말은 아니었다.",
      assertionType: "CLAIM",
      assertedBy: "주진우 의원",
      sourceIds: ["src-tf-20261019"],
      verified: true,
    },
    {
      id: "claim-case",
      text:
        "이재명 대통령의 조카 김모 씨는 2006년 5월 서울 강동구 암사동에서 헤어지자는 여성과 그 어머니를 살해했고, " +
        "2007년 2월 대법원에서 무기징역이 확정됐다. 변호사였던 이 대통령이 1·2심 변호를 맡아 심신미약을 주장했지만 " +
        "받아들여지지 않았다.",
      assertionType: "FACT",
      sourceIds: ["src-tf-20261019", "src-dailian-2021"],
      verified: true,
    },
    {
      id: "claim-law",
      text:
        "형법 제72조는 무기형은 20년, 유기형은 형기의 3분의 1이 지난 뒤 행상이 양호해 뉘우침이 뚜렷하면 가석방할 " +
        "수 있다고 정한다. 요건을 채웠다고 저절로 풀려나는 것이 아니라 법무부 가석방심사위원회의 심사와 법무부 " +
        "장관의 허가를 거친다.",
      assertionType: "FACT",
      sourceIds: ["src-law-criminal-72"],
      verified: true,
    },
    {
      id: "claim-count",
      text:
        "주진우 의원은 최근 10년간 무기징역수 151명이 가석방됐고, 2024년 1명, 2025년 9명, 2026년 들어 13명이라고 " +
        "밝혔다. 2024년에 줄어든 것은 가석방된 무기수가 살인을 다시 저지른 사건의 영향이라고 했다.",
      assertionType: "CLAIM",
      assertedBy: "주진우 의원",
      sourceIds: ["src-tf-20261019"],
      verified: true,
    },
    {
      id: "claim-disclosure",
      text:
        "가석방심사위원회 회의록은 법무부 예규(가석방심사위원회 운영지침)에 따라 결정 후 5년이 지나면 법무부 " +
        "누리집에 공개되고, 실제로 연도별 회의록이 게시돼 있다. 개별 가석방자의 이름을 결정 때마다 공개하는 제도는 " +
        "없다.",
      assertionType: "FACT",
      sourceIds: ["src-cpmadang", "src-moj-minutes"],
      verified: false,
    },
    {
      id: "claim-moj-request",
      text:
        "이진수 법무부 차관은 10월 8일 이화영 전 경기도 평화부지사의 가석방 문제에 대해 법적 요건을 갖추지 못해 " +
        "심사 대상이 아니라고 했고, 대통령실이나 여권으로부터 가석방 관련 문의나 요청을 받은 적이 없다고 답했다.",
      assertionType: "CLAIM",
      assertedBy: "법무부",
      sourceIds: ["src-ytn-20261008"],
      verified: true,
    },
    {
      id: "claim-critique",
      text:
        "주진우 의원은 가석방 인원이 늘어난 배경이 교도소 과밀이라며 '교도소 편의주의'라고 비판했다. 박철우 " +
        "서울중앙공소청장은 무기수가 가석방되면 국민과 유족이 수긍하기 어려울 것이라고 답했다.",
      assertionType: "OPINION",
      sourceIds: ["src-tf-20261019"],
      verified: true,
    },
  ],
  critiqueIds: ["claim-critique"],
  timeline: [
    {
      id: "t-case",
      date: "2007-02",
      datePrecision: "month",
      title: "조카 김모 씨 무기징역 확정",
      summary: "2006년 5월 사건.",
      claimIds: ["claim-case"],
    },
    {
      id: "t-moj",
      date: "2026-10-08",
      datePrecision: "day",
      title: "법무부 차관 \"대통령실·여권 가석방 요청 없었다\"",
      summary: "이화영 전 부지사 관련 질의.",
      claimIds: ["claim-moj-request"],
    },
    {
      id: "t-audit",
      date: "2026-10-19",
      datePrecision: "day",
      title: "국정감사 무기수 가석방 질의",
      summary: "조카가 가석방될 수 있다는 가능성 제기.",
      claimIds: ["claim-jjw", "claim-count"],
    },
  ],
  gaps: [
    "2026년 10월 30일까지 대통령 조카의 가석방 결정을 알린 법무부 발표나 보도는 찾지 못했다. 가석방 심사가 진행 중인지도 확인하지 못했다.",
    "주진우 의원이 밝힌 연도별 무기수 가석방 인원은 법무부 통계 원자료와 대조하지 못했다.",
    "가석방 심사 결과(심사서)를 언제 어디까지 공개하는지 정한 법령 조문은 원문으로 확인하지 못했다.",
  ],
  sources: [
    {
      id: "src-tf-20261019",
      title: "[2026 국감] 주진우 \"무기징역 받은 이 대통령 조카 가석방 가능…국민 불안\"",
      publisher: "더팩트",
      url: "https://news.tf.co.kr/read/life/2378078.htm",
      publishedAt: "2026-10-19",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-dailian-2021",
      title: "국민의힘 이재명특위, 李 조카 살인사건 유족 손배소 무료변론 추진",
      publisher: "데일리안",
      url: "https://www.dailian.co.kr/news/view/1059094/",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-law-criminal-72",
      title: "형법 제72조(가석방의 요건)",
      publisher: "국가법령정보센터",
      url: "https://www.law.go.kr/%EB%B2%95%EB%A0%B9/%ED%98%95%EB%B2%95/%EC%A0%9C72%EC%A1%B0",
      type: "legislative",
      license: "public",
    },
    {
      id: "src-cpmadang",
      title: "가석방심사위원회 회의록 공개 실태",
      publisher: "시민정치마당",
      url: "https://cpmadang.org/collection/279128",
      type: "research",
      license: "link-only",
    },
    {
      id: "src-moj-minutes",
      title: "가석방심사위원회 회의록",
      publisher: "법무부",
      url: "https://www.moj.go.kr/bbs/moj/93/562168/artclView.do",
      type: "official",
      license: "public",
    },
    {
      id: "src-ytn-20261008",
      title: "이화영 측 \"대통령에 화났다\"...법무부 \"가석방 심사 대상 아냐\"",
      publisher: "YTN",
      url: "https://www.ytn.co.kr/_ln/0101_202610081823101535",
      publishedAt: "2026-10-08",
      type: "press",
      license: "link-only",
    },
  ],
};
