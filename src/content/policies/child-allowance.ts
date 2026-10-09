import type { PolicyInput } from "./schema";

/**
 * 아동수당 연령 확대 (2026~2030).
 *
 * 개정 아동수당법은 지급 연령을 매년 한 살씩 올려 2030년에 만 13세 미만까지 넓힌다.
 * "이제 초등학생·중학생도 다 받는다"처럼 최종 단계만 떼어 퍼지는 경우가 있어,
 * 연도별 단계를 함께 적는다.
 *
 * ★ 2026-10-09 처음 등록, 같은 날 편집팀이 원자료와 대조했다.
 */
export const CHILD_ALLOWANCE: PolicyInput = {
  slug: "child-allowance",
  title: "아동수당 연령 확대 (2026~2030)",
  scope: "아동수당 지급 연령의 단계적 확대, 지역별 추가 지급, 2026년 소급 지급",
  ministries: ["보건복지부"],
  categories: ["welfare"],
  asOf: "2026-10-09",
  rumors: [
    {
      id: "rumor-13-now",
      text: "올해부터 만 13세(초등학생)까지 아동수당을 다 준다",
      claimIds: ["claim-age-schedule"],
    },
  ],
  claims: [
    {
      id: "claim-law",
      text:
        "아동수당법 개정안은 2026년 1월 7일 국회 보건복지위원회에서 여야 합의로 의결됐고, " +
        "개정법은 3월 20일 공포됐다. 확대 지급은 4월 24일 시작했다.",
      assertionType: "FACT",
      sourceIds: ["src-bokjiro-0424", "src-twig-0107"],
      verified: true,
    },
    {
      id: "claim-age-schedule",
      text:
        "지급 연령은 2026년 만 9세 미만(기존 8세 미만)으로 올랐고, 매년 한 살씩 늘어 " +
        "2027년 10세 미만, 2028년 11세 미만, 2029년 12세 미만, 2030년 13세 미만이 된다. " +
        "2026년 현재 만 9세 이상은 받지 못한다.",
      assertionType: "FACT",
      sourceIds: ["src-bokjiro-0424", "src-womennews-0424"],
      verified: true,
    },
    {
      id: "claim-amount",
      text:
        "기본 금액은 월 10만 원이다. 비수도권과 인구감소지역 아동은 " +
        "월 5,000원~2만 원을 더 받고, 인구감소지역에서 지역사랑상품권으로 받으면 월 1만 원이 " +
        "더 붙는다.",
      assertionType: "FACT",
      sourceIds: ["src-bokjiro-0424", "src-womennews-0424"],
      verified: true,
    },
    {
      id: "claim-retroactive",
      text:
        "생일이 지나 지급이 끊겼던 2017년 1월~2018년 3월생에게 2026년 1~3월분을 소급 " +
        "지급했다. 대상 45만 명 중 해외 장기체류 아동 등을 뺀 약 43만 명에게 1,687억 원이 " +
        "나갔다. 4월 전체 지급은 약 255만 명, 3,892억 원이었다.",
      assertionType: "FACT",
      sourceIds: ["src-bokjiro-0424"],
      verified: true,
    },
  ],
  timeline: [
    {
      id: "t-committee",
      date: "2026-01-07",
      datePrecision: "day",
      title: "국회 보건복지위 의결",
      summary: "여야 합의.",
      claimIds: ["claim-law"],
    },
    {
      id: "t-paid",
      date: "2026-04-24",
      datePrecision: "day",
      title: "만 9세 미만으로 확대 지급",
      summary: "1~3월분 소급 포함 약 255만 명.",
      claimIds: ["claim-age-schedule", "claim-retroactive"],
    },
    {
      id: "t-2030",
      date: "2030",
      datePrecision: "year",
      title: "만 13세 미만까지 확대 (예정)",
      summary: "매년 한 살씩.",
      claimIds: ["claim-age-schedule"],
    },
  ],
  gaps: [
    "국회 본회의 표결 날짜와 결과를 의안정보시스템으로 확인하지 못했다.",
    "2030년까지 필요한 연도별 재정 규모를 확인하지 못했다.",
    "인구감소지역 우대·특별지역 구분별 추가액(1만 원·2만 원)은 보도로만 확인했다.",
    "복지위 의결 때는 지역사랑상품권 1만 원 추가 지급안이 국민의힘 반대(수도권 역차별)로 빠졌다고 보도됐는데, 4월 복지부 발표에는 들어 있다. 어느 단계에서 다시 들어갔는지 확인하지 못했다.",
  ],
  sources: [
    {
      id: "src-bokjiro-0424",
      title: "아동수당 9세 미만으로 확대…1~3월분 소급해 24일 지급",
      publisher: "보건복지부 · 정책브리핑",
      url: "https://www.bokjiro.go.kr/ssis-tbu/cms/pc/news/news/1309692_1114.html",
      publishedAt: "2026-04-24",
      type: "official",
      license: "public",
    },
    {
      id: "src-womennews-0424",
      title: "오늘부터 아동수당 지급 9세 미만으로 확대...43만명 혜택",
      publisher: "여성신문",
      url: "https://www.womennews.co.kr/news/articleViewAmp.html?idxno=276695",
      publishedAt: "2026-04-24",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-twig-0107",
      title: "아동수당 확대 복지위 통과…2월 소급 지급 가능성",
      publisher: "트윅(TWIG24)",
      url: "https://www.twig24.com/news/2026/01/07/20260107500208",
      publishedAt: "2026-01-07",
      type: "press",
      license: "link-only",
    },
  ],
};
