import type { PolicyInput } from "./schema";

/**
 * 포괄임금 오남용 감독과 포괄임금 금지 입법.
 *
 * 10월 말 X 게시물 답글에 "공짜 야근 적발 사업장 대부분이 입건되지 않으니 포괄임금 금지법을 연내
 * 통과시켜 달라"는 요청이 달렸다(잼통 Voice). 2026년 고용노동부 지침과 감독 결과, 국회 법안을 적는다.
 *
 * ★ 2026-10-31 처음 등록 — 잼통 Voice 이슈 #185.
 */
export const INCLUSIVE_WAGE_BAN: PolicyInput = {
  slug: "inclusive-wage-ban",
  title: "포괄임금 오남용 감독과 포괄임금 금지 입법",
  scope:
    "2026년 4월 시행된 고용노동부 포괄임금 오남용 방지 지도지침, 1차 기획감독 결과(5월)와 권역별 릴레이 감독, 국회에 계류된 포괄임금 금지 법안",
  ministries: ["고용노동부"],
  categories: ["welfare", "institution"],
  asOf: "2026-10-31",
  rumors: [
    {
      id: "rumor-prosecution",
      text: "공짜 야근 적발 사업장 대부분이 입건되지 않으니 포괄임금 금지법을 연내 통과시켜 달라",
      claimIds: ["claim-guideline", "claim-first-result", "claim-follow-up", "claim-bills"],
    },
  ],
  claims: [
    {
      id: "claim-guideline",
      text:
        "고용노동부는 2026년 4월 9일 「공짜노동 근절을 위한 포괄임금 오남용 방지 지도 지침」을 시행했다. 법 개정 전에 적용되는 " +
        "행정지침으로, 실제 근로시간에 따라 연장·야간·휴일수당을 따로 계산해 지급하도록 했다.",
      assertionType: "FACT",
      sourceIds: ["src-newsseoul-guideline"],
      verified: false,
    },
    {
      id: "claim-first-result",
      text:
        "5월 28일 발표된 1차 기획감독(2월 26일부터 약 두 달, 의심 사업장 101곳) 결과, 포괄임금 활용 의심 사업장 79곳 가운데 34곳(43%)에서 " +
        "연장·휴일·야간수당 미지급이 확인됐고 체불액은 4억 4,800만 원이었다. 연장근로 한도 위반도 34곳이었다.",
      assertionType: "FACT",
      sourceIds: ["src-moel-19447"],
      verified: true,
    },
    {
      id: "claim-follow-up",
      text:
        "노동부는 위반 사업장에 시정지시와 체불금 전액 지급을 명하고 따르지 않으면 사법처리하겠다고 했다. 5월 구로·가산, 6월 판교 등 " +
        "매달 한 권역씩 익명 제보를 바탕으로 연말까지 릴레이 감독을 이어간다.",
      assertionType: "FACT",
      sourceIds: ["src-moel-19447", "src-moel-19540"],
      verified: true,
    },
    {
      id: "claim-bills",
      text:
        "국회에는 포괄임금 계약을 원칙적으로 금지하는 근로기준법 개정안이 여러 건 계류돼 있다. 2025년 7월 천하람 개혁신당 의원, " +
        "2026년 2월 김주영 민주당 의원이 대표 발의했다.",
      assertionType: "FACT",
      sourceIds: ["src-heraldk-20250723"],
      verified: false,
    },
  ],
  critiqueIds: [],
  timeline: [
    {
      id: "t-guideline",
      date: "2026-04-09",
      datePrecision: "day",
      title: "포괄임금 오남용 방지 지도지침 시행",
      summary: "실근로시간 기준 수당 지급.",
      claimIds: ["claim-guideline"],
    },
    {
      id: "t-first",
      date: "2026-05-28",
      datePrecision: "day",
      title: "1차 기획감독 결과",
      summary: "79곳 중 34곳 수당 미지급.",
      claimIds: ["claim-first-result"],
    },
    {
      id: "t-pangyo",
      date: "2026-06-17",
      datePrecision: "day",
      title: "판교테크노밸리 감독",
      summary: "권역별 릴레이 감독 확대.",
      claimIds: ["claim-follow-up"],
    },
  ],
  gaps: [
    "감독에서 적발된 사업장 가운데 실제 입건·사법처리된 건수는 보도자료에 나오지 않아 확인하지 못했다.",
    "포괄임금 금지 법안의 환경노동위원회 심사 일정과 연내 처리 여부는 확인하지 못했다.",
    "9월 시작된 하반기 기획감독의 결과는 아직 발표되지 않았다.",
  ],
  sources: [
    {
      id: "src-newsseoul-guideline",
      title: "고용노동부, '공짜노동 근절을 위한포괄임금 오남용 방지 지도 지침' 4월 9일부터 시행",
      publisher: "뉴스서울",
      url: "https://newsseoul.co.kr/news/view/1065600614747278",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-moel-19447",
      title: "공짜 노동 근절을 위한 포괄임금 오남용 1차 기획감독 결과 발표",
      publisher: "고용노동부",
      url: "https://moel.go.kr/news/enews/report/enewsView.do?news_seq=19447",
      publishedAt: "2026-05-28",
      type: "official",
      license: "public",
    },
    {
      id: "src-moel-19540",
      title: "포괄임금 오남용 근절 권역별 릴레이 감독, 구로·가산 이어 '판교테크노밸리'로 확대",
      publisher: "고용노동부",
      url: "https://www.moel.go.kr/news/enews/report/enewsView.do?news_seq=19540",
      publishedAt: "2026-06-17",
      type: "official",
      license: "public",
    },
    {
      id: "src-heraldk-20250723",
      title: "천하람, '포괄임금제 폐지법' 대표발의…\"'공짜 야근' 그만\"[이런정치]",
      publisher: "헤럴드경제",
      url: "https://www.heraldk.com/article/2025072315573590422",
      publishedAt: "2025-07-23",
      type: "press",
      license: "link-only",
    },
  ],
};
