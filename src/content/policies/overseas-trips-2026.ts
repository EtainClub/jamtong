import type { PolicyInput } from "./schema";

/**
 * 대통령 해외 순방 일정과 성과 (2025~2026년).
 *
 * 「극단적 진영주의는 경계해야」 답글에 "잦은 해외 순방은 무슨 이득이 있나"라는 물음이 달렸고, Voice
 * 방문자들이 "대통령 해외 순방의 일정과 성과", "멕시코 순방 성과" 자료를 요청했다(잼통 Voice).
 * 확인되는 순방 일정과 합의 내용을 적는다.
 *
 * ★ 성과의 경제적 효과는 아직 평가 자료가 없다. 합의·체결된 문서만 적는다.
 * ★ 대통령실 예산은 policy:presidential-office-budget, 대미 투자는 policy:us-investment에 있다.
 * ★ 2026-10-31 처음 등록 — 잼통 Voice 이슈 #183, #194, #195.
 */
export const OVERSEAS_TRIPS_2026: PolicyInput = {
  slug: "overseas-trips-2026",
  title: "대통령 해외 순방 일정과 성과 (2025~2026년)",
  scope:
    "2025년 다자 정상회의·중동 순방, 2026년 중국·일본·동남아·인도·베트남·유럽·미주 순방 일정, 2026년 9월 미국·멕시코 순방의 합의 내용",
  ministries: ["외교부", "청와대"],
  categories: ["diplomacy"],
  asOf: "2026-10-31",
  rumors: [
    {
      id: "rumor-benefit",
      text: "청와대 예산이 크게 늘었다는데, 잦은 해외 순방은 무슨 이득이 있나",
      claimIds: ["claim-2025", "claim-2026", "claim-mexico", "claim-us-2026-09"],
    },
  ],
  claims: [
    {
      id: "claim-2025",
      text:
        "대통령은 2025년 G7, 유엔총회, APEC, G20 등 다자 정상회의 네 곳에 참석했고, 11월에는 UAE·이집트·튀르키예 등을 순방해 UAE와 방산 협력을 " +
        "포함한 전략적 협력 공동선언을 냈다.",
      assertionType: "FACT",
      sourceIds: ["src-heraldk-20251220"],
      verified: true,
    },
    {
      id: "claim-2026",
      text:
        "2026년에는 1월 중국 국빈방문을 시작으로 일본, 3월 싱가포르·필리핀, 4월 19~24일 인도·베트남 국빈방문, 6월 G7 정상회의와 유럽, 7월 미국·" +
        "남미·독일을 순방했다.",
      assertionType: "FACT",
      sourceIds: ["src-newsis-20260416", "src-mtn-20260724"],
      verified: false,
    },
    {
      id: "claim-mexico",
      text:
        "9월 21~27일 미국·멕시코 순방 가운데 멕시코 국빈방문에서 두 나라는 7년을 끈 투자보장협정 개정 협상을 타결하고 '2026-2030 한-멕시코 " +
        "공동행동 계획'을 채택해 고위급 교류와 외교차관급 정책협의회 정례화에 합의했다. 대통령은 무역협정 논의에 속도를 내겠다고 했다.",
      assertionType: "FACT",
      sourceIds: ["src-sbsbiz-20000336826"],
      verified: true,
    },
    {
      id: "claim-us-2026-09",
      text:
        "같은 순방에서 대통령은 유엔총회 연설로 한반도 평화 구상을 밝혔고, 트럼프 대통령과의 회담에서 핵추진잠수함 협력, 원자력협정, 전시작전통제권 " +
        "전환을 논의했다. 청와대는 정상 차원에서 전작권 전환을 논의한 것은 처음이라고 설명했다.",
      assertionType: "FACT",
      sourceIds: ["src-sbsbiz-20000336826"],
      verified: true,
    },
  ],
  critiqueIds: [],
  timeline: [
    {
      id: "t-india-vietnam",
      date: "2026-04-19",
      datePrecision: "day",
      title: "인도·베트남 국빈방문",
      summary: "4월 19~24일.",
      claimIds: ["claim-2026"],
    },
    {
      id: "t-mexico",
      date: "2026-09-21",
      datePrecision: "day",
      title: "미국·멕시코 순방",
      summary: "투자보장협정 개정 타결.",
      claimIds: ["claim-mexico", "claim-us-2026-09"],
    },
  ],
  gaps: [
    "순방별 체결 MOU 수와 투자 유치액을 정부 발표 원문으로 정리하지 못했다.",
    "순방 비용(예비비 등)은 공개 자료로 확인하지 못했다.",
    "순방 합의가 실제 교역·투자 증가로 이어졌는지에 대한 평가는 아직 없다.",
  ],
  sources: [
    {
      id: "src-heraldk-20251220",
      title: "2026년 李대통령 순방 더 많아진다…'종횡무진' 정상외교",
      publisher: "헤럴드경제",
      url: "https://www.heraldk.com/article/2025122014000358547",
      publishedAt: "2025-12-20",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-newsis-20260416",
      title: "이 대통령, 19~24일 인도·베트남 국빈 방문…조선·방산 등 협력 논의",
      publisher: "뉴시스",
      url: "https://www.newsis.com/view/NISX20260416_0003594292",
      publishedAt: "2026-04-16",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-mtn-20260724",
      title: "李 대통령, 미국·남미·독일 릴레이 순방...총 7박 11일",
      publisher: "MTN",
      url: "https://news.mtn.co.kr/news-detail/2026072416563038111",
      publishedAt: "2026-07-24",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-sbsbiz-20000336826",
      title: "李대통령, 美·멕시코 순방 마치고 귀국길…경제·안보협력 '성과'",
      publisher: "SBS Biz",
      url: "https://biz.sbs.co.kr/amp/article/20000336826",
      publishedAt: "2026-09-27",
      type: "press",
      license: "link-only",
    },
  ],
};
