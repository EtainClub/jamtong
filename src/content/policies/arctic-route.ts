import type { PolicyInput } from "./schema";

/**
 * 북극항로 컨테이너선 시범운항(2026년)과 대러 제재·안전 과제.
 *
 * 10월 X 게시물 답글에 "북극항로는 큰 성과인데 홍보가 부족하다", "러시아가 전쟁 중이라 북극항로를
 * 지나는 우리 선박이 드론 공격 같은 위험에 노출된다"는 말이 달렸다(잼통 Voice). 시범운항 결과와
 * 정부 계획, 지적된 과제를 적는다.
 *
 * ★ 2026-10-31 처음 등록 — 잼통 Voice 이슈 #124, #166.
 */
export const ARCTIC_ROUTE: PolicyInput = {
  slug: "arctic-route",
  title: "북극항로 컨테이너선 시범운항(2026년)과 남은 과제",
  scope:
    "2026년 8~10월 국내 컨테이너선의 북극항로 첫 왕복 시범운항, 정부의 운항 손실 지원과 정기항로 목표, 대통령 발언, 대러 제재·안전 등 지적된 과제",
  ministries: ["해양수산부"],
  categories: ["economy", "diplomacy"],
  asOf: "2026-10-31",
  rumors: [
    {
      id: "rumor-pr",
      text: "북극항로는 국정과제의 큰 성과인데 정부 홍보가 부족하니 제때 적극적으로 알려야 한다",
      claimIds: ["claim-voyage", "claim-president"],
    },
    {
      id: "rumor-security",
      text: "러시아가 전쟁 중이라 북극항로를 지나는 우리 선박이 드론 공격 같은 안보 위험에 노출된다",
      claimIds: ["claim-challenges"],
    },
  ],
  claims: [
    {
      id: "claim-voyage",
      text:
        "팬스타그룹의 2,800TEU급 컨테이너선이 2026년 8월 부산을 떠나 북극항로를 왕복하고 50일 만에 부산으로 돌아왔다. 국내 " +
        "컨테이너선의 첫 북극항로 왕복이다.",
      assertionType: "FACT",
      sourceIds: ["src-mtn-20261011-voyage"],
      verified: false,
    },
    {
      id: "claim-support",
      text: "정부는 시범운항의 운항 손실을 최대 40억 원까지 보조하기로 했고, 2030년 정기항로 개설을 목표로 하고 있다.",
      assertionType: "FACT",
      sourceIds: ["src-newstomato-1310896"],
      verified: false,
    },
    {
      id: "claim-president",
      text:
        "대통령은 10월 11일과 13일 북극항로 시대를 착실히 준비해야 하며 대비가 늦어서는 안 된다고 말하고, 해양수산부 기능 강화를 " +
        "언급했다.",
      assertionType: "FACT",
      sourceIds: ["src-mtn-20261013", "src-mtn-20261011-president"],
      verified: false,
    },
    {
      id: "claim-challenges",
      text:
        "북극항로는 러시아 북극해 연안을 지나 서방의 대러 제재, 여름철에만 가능한 계절 운항, 쇄빙 지원과 보험, 경제성이 과제로 " +
        "꼽힌다.",
      assertionType: "FACT",
      sourceIds: ["src-newstomato-1310896"],
      verified: false,
    },
  ],
  critiqueIds: ["claim-challenges"],
  timeline: [
    {
      id: "t-depart",
      date: "2026-08",
      datePrecision: "month",
      title: "시범운항 출항",
      summary: "부산항 출발.",
      claimIds: ["claim-voyage"],
    },
    {
      id: "t-return",
      date: "2026-10-11",
      datePrecision: "day",
      title: "왕복 운항 마치고 귀항",
      summary: "50일 만에 부산.",
      claimIds: ["claim-voyage", "claim-president"],
    },
  ],
  gaps: [
    "북극항로 운항 선박을 노린 드론 공격 등 군사적 위협 사례나 정부의 안보 대응 계획은 찾지 못했다.",
    "시범운항의 실제 운송 물량·비용과 수에즈 항로 대비 절감 효과는 해양수산부 자료로 확인하지 못했다.",
    "해양수산부의 후속 행사·홍보 계획은 확인하지 못했다.",
  ],
  sources: [
    {
      id: "src-mtn-20261011-voyage",
      title: "국내 컨테이너선 첫 북극항로 왕복 성공…50일 만에 부산 귀항",
      publisher: "MTN",
      url: "https://news.mtn.co.kr/news-detail/2026101109545880460",
      publishedAt: "2026-10-11",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-mtn-20261011-president",
      title: "李 대통령 \"북극항로 시대 착실히 준비...새로운 바닷길로 성장\"",
      publisher: "MTN",
      url: "https://news.mtn.co.kr/news-detail/2026101113144470653",
      publishedAt: "2026-10-11",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-mtn-20261013",
      title: "李 대통령 \"북극항로 대비 늦으면 안 돼…해수부 기능 강화\"",
      publisher: "MTN",
      url: "https://news.mtn.co.kr/news-detail/2026101316461921473",
      publishedAt: "2026-10-13",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-newstomato-1310896",
      title: "'첫 닻' 북극항로, 기대·걱정 교차…화물·안전·실증 이정표",
      publisher: "뉴스토마토",
      url: "https://newstomato.com/ReadNews.aspx?no=1310896",
      type: "press",
      license: "link-only",
    },
  ],
};
