import type { PolicyInput } from "./schema";

/**
 * 국가폭력 범죄의 공소시효·소멸시효 배제 입법 (2024~2026).
 *
 * 대통령 유튜브 영상 답글에 "국가폭력 사건을 특별법으로 다뤄 피해자들의 고통을 보듬어 달라"는 제안이 달렸다(잼통 Voice).
 * 국가폭력 피해 구제의 핵심 입법인 '반인권적 국가범죄 시효 특례법'의 경과와 대통령 발언을 적는다.
 *
 * ★ 과거사 조사(3기 진실화해위원회)는 policy:democracy-history-records·pledge-check-2026에도 있다.
 * ★ 2026-11-09 처음 등록 — 잼통 Voice 이슈 #238.
 */
export const STATE_VIOLENCE_STATUTE: PolicyInput = {
  slug: "state-violence-statute",
  title: "국가폭력 범죄 공소시효·소멸시효 배제 입법",
  scope:
    "2024년 12월 국회를 통과한 반인권적 국가범죄 시효 특례법과 2025년 1월 거부권, 2026년 대통령의 재입법 촉구(3월 제주 4·3, 5월 국무회의), 2026년 다시 발의된 법안의 처리 상황",
  ministries: ["법무부", "국회"],
  categories: ["institution"],
  asOf: "2026-11-09",
  rumors: [
    {
      id: "rumor-special-law",
      text: "국가폭력 사건을 특별법으로 다뤄 피해자들의 고통을 보듬어 달라",
      claimIds: ["claim-2024", "claim-veto", "claim-president", "claim-2026-bills"],
    },
  ],
  claims: [
    {
      id: "claim-2024",
      text:
        "국가가 저지른 반인권적 범죄(정당한 이유 없는 공무원의 살인, 고문·불법구금 등)의 공소시효를 없애고 피해자의 국가배상청구권에 소멸시효를 적용하지 않는 '반인권적 국가범죄 시효 특례법'이 " +
        "2024년 12월 31일 국회 본회의를 재석 289명 중 찬성 179명으로 통과했다.",
      assertionType: "FACT",
      sourceIds: ["src-etoday-2433801", "src-herald-10380372"],
      verified: true,
    },
    {
      id: "claim-veto",
      text:
        "최상목 대통령 권한대행은 2025년 1월 21일 과잉금지 원칙에 어긋나고 민생범죄 대응에 공백이 생길 우려가 있다며 재의를 요구했고, 법안은 폐기됐다.",
      assertionType: "FACT",
      sourceIds: ["src-khan-20250121"],
      verified: true,
    },
    {
      id: "claim-president",
      text:
        "이 대통령은 2026년 3월 29일 제주 4·3 행사에서 국가폭력 범죄의 공소시효와 민사 소멸시효를 완전히 배제해 \"살아있는 한\" 형사책임을 지게 하고 상속재산이 있으면 자손까지 책임지게 하겠다며 " +
        "거부권으로 무산된 법을 빨리 재입법하겠다고 했다. 5월 20일 국무회의에서도 시효를 원천 배제하는 입법을 조속히 매듭지으라고 주문했다.",
      assertionType: "FACT",
      sourceIds: ["src-khan-20260329", "src-asiae-20260521"],
      verified: true,
    },
    {
      id: "claim-2026-bills",
      text:
        "2026년 3월 말 기준 국가폭력 범죄 시효 배제 법안 5건이 법제사법위원회에 계류돼 있었다. 김기표 의원 안(4월 3일 발의)은 4월 6일 법사위에 회부됐고, 박지원 의원 안(9월 18일 발의)은 " +
        "진실화해위원회 결정을 받은 사건의 손해배상청구권에 소멸시효를 적용하지 않는 내용을 담았다.",
      assertionType: "FACT",
      sourceIds: ["src-nate-20260329", "src-lawmaking-2218090", "src-daenews-26609"],
      verified: true,
    },
    {
      id: "claim-critique",
      text:
        "법조계에서는 국가의 과오를 시간이 덮어서는 안 된다는 찬성론과, 이미 시효가 지난 사건까지 되살리면 법적 안정성과 신뢰보호 원칙을 해쳐 위헌 소지가 있다는 반대론이 맞선다.",
      assertionType: "FACT",
      sourceIds: ["src-fnnews-20260528", "src-mt-20260330"],
      verified: true,
    },
  ],
  critiqueIds: ["claim-critique"],
  timeline: [
    {
      id: "t-pass",
      date: "2024-12-31",
      datePrecision: "day",
      title: "시효 특례법 국회 통과",
      summary: "야당 주도.",
      claimIds: ["claim-2024"],
    },
    {
      id: "t-veto",
      date: "2025-01-21",
      datePrecision: "day",
      title: "권한대행 거부권",
      summary: "폐기.",
      claimIds: ["claim-veto"],
    },
    {
      id: "t-jeju",
      date: "2026-03-29",
      datePrecision: "day",
      title: "대통령 \"시효 완전 배제 재입법\"",
      summary: "제주 4·3 행사.",
      claimIds: ["claim-president"],
    },
    {
      id: "t-cabinet",
      date: "2026-05-20",
      datePrecision: "day",
      title: "국무회의 \"입법 조속히 매듭\"",
      summary: "국무회의 겸 비상경제점검회의.",
      claimIds: ["claim-president"],
    },
  ],
  gaps: [
    "2026년에 다시 발의된 법안들의 법사위 심사 결과는 11월 9일까지 확인되지 않았다.",
  ],
  sources: [
    {
      id: "src-etoday-2433801",
      title: "'국가범죄 공소시효 배제법' 본회의 통과…與 \"수사공무원 탄압\"",
      publisher: "이투데이",
      url: "https://www.etoday.co.kr/news/view/2433801",
      publishedAt: "2024-12-31",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-herald-10380372",
      title: "국가범죄 공소시효 배제 특례법, 野 주도 국회 통과",
      publisher: "헤럴드경제",
      url: "https://biz.heraldcorp.com/article/10380372",
      publishedAt: "2024-12-31",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-khan-20250121",
      title: "최상목 대행, '국가범죄 시효 특례법' 등 3개 법안 거부권 행사",
      publisher: "경향신문",
      url: "https://www.khan.co.kr/article/202501211030031",
      publishedAt: "2025-01-21",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-khan-20260329",
      title: "이 대통령 \"국가폭력 범죄 시효 없애 책임 물을 것\"",
      publisher: "경향신문",
      url: "https://www.khan.co.kr/article/202603292029005/",
      publishedAt: "2026-03-29",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-asiae-20260521",
      title: "李대통령 \"국가폭력범죄 공소시효 배제 조속 입법…5·18 가짜뉴스 강력 응징\"",
      publisher: "아시아경제",
      url: "https://view.asiae.co.kr/article/2026052114402152018",
      publishedAt: "2026-05-21",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-nate-20260329",
      title: "반인권적 국가범죄 시효 배제 법안 5건 법사위 계류",
      publisher: "네이트 뉴스",
      url: "https://m.news.nate.com/view/20260329n18232",
      publishedAt: "2026-03-29",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-lawmaking-2218090",
      title: "반인권적 국가범죄의 시효 등에 관한 특례법안(의안번호 2218090)",
      publisher: "국민참여입법센터",
      url: "https://opinion.lawmaking.go.kr/gcom/nsmLmSts/out/2218090/detailRP",
      publishedAt: "2026-04-03",
      type: "legislative",
      license: "public",
    },
    {
      id: "src-daenews-26609",
      title: "\"반인권적 국가범죄, 공소시효·소멸시효 전면 배제한다\"…'반인권적 국가범죄 시효 특례법안' 발의",
      publisher: "동아경제신문",
      url: "https://www.daenews.co.kr/26609",
      publishedAt: "2026-09",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-fnnews-20260528",
      title: "국가폭력에 영구적 책임… 사법 정의 vs 법적 안정성 충돌",
      publisher: "파이낸셜뉴스",
      url: "https://www.fnnews.com/news/202605281821240143",
      publishedAt: "2026-05-28",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-mt-20260330",
      title: "국가폭력범죄 시효 배제, 이번엔 위헌 논란 넘을까",
      publisher: "머니투데이(네이트 게재)",
      url: "https://m.news.nate.com/view/20260330n26270",
      publishedAt: "2026-03-30",
      type: "press",
      license: "link-only",
    },
  ],
};
