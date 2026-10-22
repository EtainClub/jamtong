import type { PolicyInput } from "./schema";

/**
 * 국가보안법 폐지법률안 (2025년 12월 발의).
 *
 * "국가보안법 폐지안이 발의되었다"는 게시물이 돈다. 사실이다. 다만 정부가 낸 법안이
 * 아니라 범여권 의원 31명이 낸 의원 발의안이고, 더불어민주당 지도부가 당론으로 다룬 적이
 * 없으며, 법제사법위원회에 회부된 채 심사가 진행되지 않았다.
 *
 * ★ 발의 사실과 심사 상태만 적는다. 폐지가 옳은지는 평가라서 판정하지 않는다.
 * ★ 2026-10-23 처음 등록 — 신통 factbot-gap 이슈 #61.
 */
export const NATIONAL_SECURITY_ACT_REPEAL: PolicyInput = {
  slug: "national-security-act-repeal",
  title: "국가보안법 폐지법률안 (2025년 발의)",
  scope:
    "2025년 12월 2일 발의된 국가보안법 폐지법률안(의안번호 2214785)의 발의자·취지·심사 상태, 여야 반응, " +
    "발의 의원 고발 사건과 과거 폐지 시도",
  ministries: ["국회"],
  categories: ["institution"],
  asOf: "2026-10-23",
  rumors: [
    {
      id: "rumor-proposed",
      text: "국가보안법 폐지안이 발의되었다",
      claimIds: ["claim-bill", "claim-sponsors", "claim-committee", "claim-party-line"],
    },
  ],
  claims: [
    {
      id: "claim-bill",
      text:
        "국가보안법 폐지법률안(의안번호 2214785)은 2025년 12월 2일 민형배(더불어민주당)·김준형(조국혁신당)·" +
        "윤종오(진보당) 의원 등 31명이 발의했다. 정부가 낸 법안이 아니라 의원 발의안이다.",
      assertionType: "FACT",
      sourceIds: ["src-lawmaking-2214785", "src-nocut-20251208"],
      verified: true,
    },
    {
      id: "claim-sponsors",
      text:
        "발의에는 더불어민주당·조국혁신당·진보당·기본소득당·사회민주당 의원이 참여했다. 더불어민주당 의원은 " +
        "15명이었다.",
      assertionType: "FACT",
      sourceIds: ["src-tf-20251218"],
      verified: true,
    },
    {
      id: "claim-purpose",
      text:
        "발의자들은 제7조(찬양·고무)와 제10조(불고지)가 표현과 양심의 자유를 침해하고, 나머지 조항 대부분은 형법과 " +
        "남북교류협력법 등으로 규율할 수 있다고 제안 이유를 밝혔다.",
      assertionType: "CLAIM",
      assertedBy: "법안 발의 의원",
      sourceIds: ["src-lawmaking-2214785", "src-nocut-20251208"],
      verified: true,
    },
    {
      id: "claim-committee",
      text:
        "법안은 2025년 12월 3일 법제사법위원회에 회부됐고, 소관위원회 심사 단계에 머물러 있다.",
      assertionType: "FACT",
      sourceIds: ["src-lawmaking-2214785"],
      verified: true,
    },
    {
      id: "claim-party-line",
      text:
        "더불어민주당 원내 지도부 관계자는 \"원내지도부에서 국보법 폐지안이 정식으로 다뤄진 적은 없다\"고 말했다. " +
        "당 안팎에서는 여당 내 신중론 때문에 본회의를 넘기 어렵다는 전망이 나왔다.",
      assertionType: "FACT",
      sourceIds: ["src-tf-20251218"],
      verified: true,
    },
    {
      id: "claim-opposition",
      text:
        "국민의힘은 \"사회적 합의도 없이 국보법 폐지를 강행하면 강한 반발과 후폭풍이 뒤따를 것\"(조용술 대변인)이라며 " +
        "반대했다. 송언석 원내대표는 국가보안법을 안보의 최소한의 안전장치라고 했다.",
      assertionType: "CLAIM",
      assertedBy: "국민의힘",
      sourceIds: ["src-nocut-20251208", "src-tf-20251218"],
      verified: true,
    },
    {
      id: "claim-complaint",
      text:
        "시민단체가 발의 의원 31명을 내란 등 혐의로 고발했으나, 서울경찰청은 2026년 4월 28일 불송치 결정을 했다. " +
        "국회의원의 법안 발의는 헌법이 보장한 권한이라는 이유였다.",
      assertionType: "FACT",
      sourceIds: ["src-ajunews-20251211", "src-nate-20260507"],
      verified: true,
    },
    {
      id: "claim-history",
      text:
        "전면 폐지안은 2004년 열린우리당이 발의했으나 법사위에 상정되지 못하고 폐기됐고, 이후에도 여러 차례 발의돼 " +
        "임기 만료로 폐기됐다. 헌법재판소는 1990년대 헌법소원에서 국가보안법에 합헌 결정을 했다.",
      assertionType: "FACT",
      sourceIds: ["src-nocut-20251208"],
      verified: true,
    },
  ],
  critiqueIds: ["claim-opposition"],
  timeline: [
    {
      id: "t-2004",
      date: "2004",
      datePrecision: "year",
      title: "열린우리당 폐지안 발의, 폐기",
      summary: "법사위에 상정되지 못했다.",
      claimIds: ["claim-history"],
    },
    {
      id: "t-bill",
      date: "2025-12-02",
      datePrecision: "day",
      title: "범여권 의원 31명 폐지안 발의",
      summary: "이튿날 법사위 회부.",
      claimIds: ["claim-bill", "claim-committee"],
    },
    {
      id: "t-no-referral",
      date: "2026-04-28",
      datePrecision: "day",
      title: "발의 의원 고발 사건 불송치",
      summary: "법안 발의는 헌법상 권한.",
      claimIds: ["claim-complaint"],
    },
  ],
  gaps: [
    "법사위 소위원회 상정 여부 등 2026년 10월 기준 심사 진행 상황은 의안정보시스템 화면으로만 확인했다. 상정·심사 기록은 찾지 못했다.",
    "이재명 정부(법무부)가 이 법안에 대해 공식 의견을 냈는지 확인하지 못했다.",
  ],
  sources: [
    {
      id: "src-lawmaking-2214785",
      title: "국가보안법 폐지법률안(민형배의원 등 31인, 의안번호 2214785)",
      publisher: "국회입법예고",
      url: "https://opinion.lawmaking.go.kr/gcom/nsmLmSts/out/2214785/detailRP",
      publishedAt: "2025-12-02",
      type: "legislative",
      license: "public",
    },
    {
      id: "src-nocut-20251208",
      title: "범여권 의원 31명 '국보법 폐지' 발의…20년 전 좌절 딛고 폐지할 수 있을까",
      publisher: "노컷뉴스",
      url: "https://www.nocutnews.co.kr/news/6439504",
      publishedAt: "2025-12-08",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-ajunews-20251211",
      title: "[와글와글] \"명백한 내란\"... '국보법 폐지' 31인, 고발당했다",
      publisher: "아주경제",
      url: "https://www.ajunews.com/view/20251211080956362",
      publishedAt: "2025-12-11",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-tf-20251218",
      title: "'또' 벌어진 국가보안법 폐지 논쟁…與도 떨떠름?",
      publisher: "더팩트",
      url: "https://news.tf.co.kr/read/ptoday/2273730.htm",
      publishedAt: "2025-12-18",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-nate-20260507",
      title: "경찰, '국가보안법 폐지' 발의 범여권 국회의원 31명 불송치 결정",
      publisher: "YTN(네이트 뉴스)",
      url: "https://m.news.nate.com/view/20260507n33734",
      publishedAt: "2026-05-07",
      type: "press",
      license: "link-only",
    },
  ],
};
