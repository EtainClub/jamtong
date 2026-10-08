import type { PolicyInput } from "./schema";

/**
 * 중동 위기 때 퍼진 소문과 정부 해명.
 *
 * 2026년 3월 말 중동 전쟁이 길어지자 "정부가 달러를 강제로 팔게 한다",
 * "울산 비축유가 북한으로 갔다"는 글이 돌았다. 정부는 둘 다 가짜뉴스라고
 * 밝혔고, 달러 소문은 경찰 수사로 이어졌다.
 *
 * ★ 해명은 부처의 주장이다. CLAIM + assertedBy로 적는다.
 * ★ 입건·송치 인원은 보도 시점마다 다르다. 날짜를 붙여 각각 적고 합치지 않는다.
 * ★ 원유 수급 대책 자체는 업적 `oil-supply`가 다룬다. 여기는 소문만 다룬다.
 */
export const MIDEAST_RUMORS: PolicyInput = {
  slug: "mideast-rumors",
  title: "중동 위기 때 퍼진 소문과 정부 해명",
  scope: "2026년 중동 전쟁 중 퍼진 '달러 강제 매각'·'비축유 북한 유입' 주장과 정부 대응",
  ministries: ["재정경제부", "산업통상부"],
  categories: ["economy", "diplomacy"],
  asOf: "2026-10-08",
  rumors: [
    {
      id: "rumor-dollar",
      text: "정부가 긴급재정경제명령으로 개인 달러를 강제로 팔게 하고 환전을 막는다",
      claimIds: ["claim-dollar-denial", "claim-emergency-order", "claim-dollar-police"],
    },
    {
      id: "rumor-oil-nk",
      text: "울산 석유비축기지 원유 90만 배럴이 북한으로 흘러갔다",
      claimIds: ["claim-oil-nk-denial", "claim-oil-sale"],
    },
  ],
  claims: [
    {
      id: "claim-emergency-order",
      text:
        "이 대통령은 4월 1일 비상경제점검회의에서, 필요하면 긴급재정경제명령을 활용할 수 " +
        "있다고 한 국무회의 발언을 '달러를 강제 매각한다'는 가짜뉴스로 만들어 퍼뜨리는 것은 " +
        "위기 시국에 매우 유해하다며 엄정 처리를 지시했다.",
      assertionType: "CLAIM",
      assertedBy: "이재명 대통령",
      sourceIds: ["src-sbsbiz-dollar", "src-nate-dollar-0401"],
      verified: true,
    },
    {
      id: "claim-dollar-denial",
      text:
        "재정경제부는 2026년 4월 1일 보도설명자료에서 정부가 달러를 강제 매각하게 한다는 " +
        "주장이 논의된 바 없는 명백한 가짜뉴스라고 밝히고 경찰에 수사를 의뢰했다.",
      assertionType: "CLAIM",
      assertedBy: "재정경제부",
      sourceIds: ["src-sbsbiz-dollar", "src-nate-dollar-0401"],
      verified: true,
    },
    {
      id: "claim-dollar-police",
      text:
        "경찰은 달러 강제 매각·환전 규제 글을 쓰거나 퍼뜨린 사람들을 수사했다. 5월 11일 " +
        "기자간담회 기준 8명을 적발했다고 보도됐고, 이후 보도에서는 11명을 특정해 5명을 " +
        "검찰에 송치했다고 전해졌다.",
      assertionType: "FACT",
      sourceIds: ["src-nate-dollar-0511", "src-nocut-dollar"],
      verified: true,
    },
    {
      id: "claim-oil-sale",
      text:
        "논란의 출발은 해외 기업이 울산 석유비축기지에 국제공동비축으로 맡겨 둔 원유 " +
        "90만 배럴을 다른 해외 기업에 판 일이다. 산업통상부는 이와 별도로 한국석유공사가 " +
        "우선 구매권을 바로 행사하지 않은 경위를 감사했다.",
      assertionType: "FACT",
      sourceIds: ["src-seoul-oil-nk", "src-joongang-oil-nk"],
      verified: true,
    },
    {
      id: "claim-oil-nk-denial",
      text:
        "산업통상부는 2026년 3월 30일 보도참고자료에서 이 원유가 중국 등 제3국을 거쳐 " +
        "북한으로 들어갔다는 의혹이 사실이 아니라고 밝히고 엄정 대응하겠다고 했다.",
      assertionType: "CLAIM",
      assertedBy: "산업통상부",
      sourceIds: ["src-seoul-oil-nk", "src-joongang-oil-nk"],
      verified: true,
    },
  ],
  timeline: [
    {
      id: "t-oil-nk",
      date: "2026-03-30",
      datePrecision: "day",
      title: "산업통상부, 비축유 북한 유입설 부인",
      summary: "보도참고자료로 의혹을 부인하고 엄정 대응을 예고했다.",
      claimIds: ["claim-oil-nk-denial"],
    },
    {
      id: "t-dollar",
      date: "2026-04-01",
      datePrecision: "day",
      title: "재정경제부, 달러 강제 매각설 수사 의뢰",
      summary: "명백한 가짜뉴스라고 밝히고 경찰에 수사를 의뢰했다.",
      claimIds: ["claim-dollar-denial"],
    },
    {
      id: "t-police",
      date: "2026-05-11",
      datePrecision: "day",
      title: "경찰, 유포자 8명 적발 발표",
      summary: "이후 보도에서는 11명 특정, 5명 송치로 늘었다.",
      claimIds: ["claim-dollar-police"],
    },
  ],
  gaps: [
    "경찰·검찰의 최종 처분 결과는 공식 발표로 확인하지 못했다. 보도마다 인원이 다르다.",
    "한국석유공사 감사 결과는 확인하지 못했다.",
  ],
  sources: [
    {
      id: "src-sbsbiz-dollar",
      title: "정부가 달러 강제 매각?…재정부 \"명백한 가짜뉴스, 수사의뢰\"",
      publisher: "SBS Biz",
      publishedAt: "2026-04-01",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-nate-dollar-0401",
      title: "재경부 \"달러 강제매각 조치? 명백한 가짜뉴스…수사 의뢰\"",
      publisher: "네이트 뉴스",
      url: "https://m.news.nate.com/view/20260401n42926",
      publishedAt: "2026-04-01",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-nate-dollar-0511",
      title: "\"정부가 달러 매각 강제\"…가짜뉴스 퍼뜨린 8명 적발",
      publisher: "네이트 뉴스",
      url: "https://m.news.nate.com/view/20260511n27009",
      publishedAt: "2026-05-11",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-nocut-dollar",
      title: "경찰, '정부 달러 환전 규제설' 최초 작성자 30대 남성 수사",
      publisher: "노컷뉴스",
      url: "https://nocutnews.co.kr/news/6588050",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-seoul-oil-nk",
      title: "정부 \"울산 비축유 90만 배럴 북한 유입? 가짜뉴스… 엄정 대응\"",
      publisher: "서울신문",
      url: "https://www.seoul.co.kr/news/economy/2026/03/30/20260330500302",
      publishedAt: "2026-03-30",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-joongang-oil-nk",
      title: "산업부 \"울산 비축유 90만배럴 北유입설 가짜뉴스… 엄정 대응\"",
      publisher: "중앙이코노미뉴스",
      url: "https://www.joongangenews.com/news/articleView.html?idxno=507344",
      publishedAt: "2026-03-30",
      type: "press",
      license: "link-only",
    },
  ],
};
