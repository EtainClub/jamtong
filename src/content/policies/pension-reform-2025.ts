import type { PolicyInput } from "./schema";

/**
 * 2025년 국민연금 개혁과 미래 세대 수급.
 *
 * 대통령 X 게시물 답글에 "지금 태어난 아이들은 세금만 내고 국민연금은 받지 못할 것"이라는
 * 말이 달렸다(잼통 Voice). 2025년 3월 국회를 통과해 2026년부터 시행된 국민연금법 개정의
 * 내용과, 기금 소진 전망이 어떤 가정에 기대는지를 적는다.
 *
 * ★ 기금 소진 시점은 수익률·인구 가정에 따른 추계라서 CLAIM이다. 국가 지급보장은 법 조문
 *   이라 FACT다. 기금이 소진되면 미래 세대 부담이 커진다는 우려는 비판으로 함께 싣는다.
 * ★ 국민연금 기금 운용(리밸런싱·환헤지)은 `nps-fund-2026`에 따로 있다.
 * ★ 2026-10-24 처음 등록 — 잼통 Voice 이슈 #77.
 */
export const PENSION_REFORM_2025: PolicyInput = {
  slug: "pension-reform-2025",
  title: "2025년 국민연금 개혁과 미래 세대 수급",
  scope:
    "2025년 3월 국민연금법 개정(보험료율·소득대체율·국가 지급보장·크레딧), 기금 소진 전망과 그 가정, 미래 세대 부담에 대한 우려",
  ministries: ["보건복지부", "국민연금공단"],
  categories: ["welfare", "economy"],
  asOf: "2026-10-24",
  rumors: [
    {
      id: "rumor-no-pension",
      text: "지금 태어난 아이들은 세금만 내고 국민연금은 받지 못할 것이다",
      claimIds: ["claim-guarantee", "claim-depletion", "claim-reading", "claim-youth-critique"],
    },
  ],
  claims: [
    {
      id: "claim-passed",
      text:
        "국민연금법 개정안은 2025년 3월 20일 국회 본회의에서 여야 합의로 통과돼 2026년 1월 1일 시행됐다. 18년 만의 " +
        "보험료율 조정이다.",
      assertionType: "FACT",
      sourceIds: ["src-tf-20250320"],
      verified: true,
    },
    {
      id: "claim-rates",
      text:
        "보험료율은 9%에서 2026년부터 해마다 0.5%포인트씩 올라 2033년 13%가 된다. 소득대체율은 2026년부터 43%로 " +
        "고정했다. 개정 전에는 2028년까지 40%로 낮아질 예정이었다. 43%는 2026년 이후 보험료를 내는 기간에 적용되고, " +
        "이미 연금을 받는 사람의 연금액이 다 같이 오르는 것은 아니다.",
      assertionType: "FACT",
      sourceIds: ["src-tf-20250320", "src-gonggam-20250424"],
      verified: true,
    },
    {
      id: "claim-guarantee",
      text:
        "개정법은 국가가 \"연금급여 지급을 보장하고, 이에 필요한 시책을 수립·시행\"하도록 국가 지급보장을 명문화했다. " +
        "이전에는 연금급여가 \"안정적·지속적으로 지급되도록\" 시책을 세우라고만 되어 있었다.",
      assertionType: "FACT",
      sourceIds: ["src-tf-20250320"],
      verified: true,
    },
    {
      id: "claim-credits",
      text:
        "출산 크레딧은 첫째 자녀부터 12개월을 인정하도록 넓혔고(이전에는 둘째부터), 군복무 크레딧은 최대 6개월에서 " +
        "12개월로 늘렸다. 저소득 지역가입자 보험료 지원 대상도 넓혔다.",
      assertionType: "FACT",
      sourceIds: ["src-tf-20250320"],
      verified: true,
    },
    {
      id: "claim-depletion",
      text:
        "보건복지부는 개혁으로 기금 소진 시점이 2056년에서 2071년으로 15년 늦춰진다고 전망했다. 이는 기금 수익률을 " +
        "4.5%에서 5.5%로 1%포인트 높인다는 가정을 함께 넣은 추계다.",
      assertionType: "CLAIM",
      assertedBy: "보건복지부",
      sourceIds: ["src-tf-20250320", "src-gonggam-20250424"],
      verified: true,
    },
    {
      id: "claim-reading",
      text:
        "'연금을 못 받는다'는 말과 달리, 지금 개정법은 국가가 연금 지급을 보장한다고 정하고 있다. 기금 소진은 쌓아 둔 " +
        "기금이 바닥난다는 뜻이지 지급 의무가 사라진다는 뜻이 아니다. 다만 소진 시점 연장은 수익률 가정에 기대고 있어, " +
        "그 뒤 연금을 어떻게 마련할지와 그때 일하는 세대의 부담은 여전히 풀어야 할 문제다.",
      assertionType: "INTERPRETATION",
      sourceIds: ["src-tf-20250320", "src-gonggam-20250424"],
      verified: true,
    },
    {
      id: "claim-youth-critique",
      text:
        "청년층 일부는 기금 소진이 9년 늦춰지는 데 그친다고 주장하며 개혁안을 비판했다. 정부 전망(15년)과 어떤 " +
        "가정이 다른지는 보도에 나오지 않는다.",
      assertionType: "OPINION",
      sourceIds: ["src-gonggam-20250424"],
      verified: true,
    },
  ],
  critiqueIds: ["claim-youth-critique"],
  timeline: [
    {
      id: "t-passed",
      date: "2025-03-20",
      datePrecision: "day",
      title: "국민연금법 개정안 국회 통과",
      summary: "보험료율 13%, 소득대체율 43%, 국가 지급보장.",
      claimIds: ["claim-passed", "claim-rates", "claim-guarantee"],
    },
    {
      id: "t-effective",
      date: "2026-01-01",
      datePrecision: "day",
      title: "개정 국민연금법 시행",
      summary: "보험료율 인상 시작.",
      claimIds: ["claim-passed", "claim-rates"],
    },
  ],
  gaps: [
    "개정 국민연금법 제3조의2 조문 원문은 국가법령정보센터에서 직접 대조하지 못했다. 문구는 보도로 확인했다.",
    "수익률 4.5%를 그대로 둘 때의 소진 시점(2064년이라는 보도가 있다)은 정부 추계 원문으로 확인하지 못했다.",
    "다음 재정추계(2028년 예정 여부)와 구조개혁 논의 일정은 확인하지 못했다.",
  ],
  sources: [
    {
      id: "src-tf-20250320",
      title: "국민연금 소진시점 2056년서 2071년으로 연장",
      publisher: "더팩트",
      url: "https://news.tf.co.kr/read/life/2189431.htm",
      publishedAt: "2025-03-20",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-gonggam-20250424",
      title: "내는 돈은 9%→13%로, 받는 돈은 40%→43%로…기금 소진 시기 15년 늦춰",
      publisher: "K-공감(대한민국 정부 정책주간지)",
      url: "https://gonggam.korea.kr/newsContentView.es?mid=a12603000000&section_id=NCCD_PUBLISH&content=NC002&news_id=b2ffa9d2-6f8d-4cb4-8dcb-6b365d2e307f",
      publishedAt: "2025-04-24",
      type: "official",
      license: "public",
    },
  ],
};
