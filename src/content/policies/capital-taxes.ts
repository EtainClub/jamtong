import type { PolicyInput } from "./schema";

/**
 * 금융투자소득세와 상속세 개편에 대한 정부 입장.
 *
 * 10월 X 게시물 답글에 "증시 정상화를 위해 금투세를 지금 시행해야 한다", "성장률은 반도체 착시이니
 * 상속·증여세율을 낮춰 젊은 층의 소비를 늘려야 한다"는 말이 달렸다(잼통 Voice). 두 세금에 대해
 * 확인되는 경과와 정부 입장을 적는다.
 *
 * ★ 2026-10-31 처음 등록 — 잼통 Voice 이슈 #152, #168.
 */
export const CAPITAL_TAXES: PolicyInput = {
  slug: "capital-taxes",
  title: "금융투자소득세와 상속세 개편에 대한 정부 입장",
  scope:
    "2024년 금투세 폐지 경과와 2026년 대통령의 거래세·양도세 개편 발언, 2026년 세제개편안의 가업상속공제 개편과 상속세 최고세율 논의",
  ministries: ["재정경제부"],
  categories: ["economy"],
  asOf: "2026-10-31",
  rumors: [
    {
      id: "rumor-fit",
      text: "증시 정상화를 위해 금융투자소득세를 지금 시행해야 한다",
      claimIds: ["claim-fit-repeal", "claim-fit-2026"],
    },
    {
      id: "rumor-inheritance",
      text: "성장률은 반도체 착시이니 상속세·증여세율을 낮춰 젊은 층의 소비를 늘려야 한다",
      claimIds: ["claim-inheritance-2026", "claim-inheritance-rate"],
    },
  ],
  claims: [
    {
      id: "claim-fit-repeal",
      text:
        "금융투자소득세는 2024년 11월 4일 이재명 당시 민주당 대표가 정부·여당의 폐지안에 동의한다고 밝힌 뒤, 2024년 말 국회에서 " +
        "폐지됐다.",
      assertionType: "FACT",
      sourceIds: ["src-weeklykhan-20241115"],
      verified: false,
    },
    {
      id: "claim-fit-2026",
      text:
        "대통령은 2026년 4월 9일 국민경제자문회의에서 손익과 무관하게 걷는 거래세의 역진성을 지적하며 \"거래세와 양도소득세를 바꿔야 " +
        "한다\"고 말했다. 국민의힘은 금투세 부활 신호라고 반발했지만, 정부는 금투세 재도입을 공식화하지 않았다.",
      assertionType: "FACT",
      sourceIds: ["src-dailian-1639888"],
      verified: true,
    },
    {
      id: "claim-inheritance-2026",
      text: "정부의 2026년 세제개편안(8월 3일)은 가업상속공제 한도를 600억 원에서 1천억 원으로 올리고 사후관리 기간을 5년에서 10년으로 늘리는 내용을 담았다.",
      assertionType: "FACT",
      sourceIds: ["src-nate-20260803"],
      verified: false,
    },
    {
      id: "claim-inheritance-rate",
      text: "상속·증여세 최고세율을 50%에서 40%로 낮추는 안은 국민의힘 김상훈 의원이 대표 발의한 법안에 들어 있다.",
      assertionType: "FACT",
      sourceIds: ["src-taxtimes-277236"],
      verified: false,
    },
  ],
  critiqueIds: [],
  timeline: [
    {
      id: "t-fit-repeal",
      date: "2024-11-04",
      datePrecision: "day",
      title: "민주당, 금투세 폐지 동의",
      summary: "2024년 말 폐지.",
      claimIds: ["claim-fit-repeal"],
    },
    {
      id: "t-council",
      date: "2026-04-09",
      datePrecision: "day",
      title: "국민경제자문회의 거래세 발언",
      summary: "거래세·양도세 개편 필요성.",
      claimIds: ["claim-fit-2026"],
    },
    {
      id: "t-tax-reform",
      date: "2026-08-03",
      datePrecision: "day",
      title: "2026년 세제개편안",
      summary: "가업상속공제 개편.",
      claimIds: ["claim-inheritance-2026"],
    },
  ],
  gaps: [
    "2026년 세제개편안에 상속세 최고세율 인하나 유산취득세 전환이 들어 있는지는 재정경제부 원문으로 확인하지 못했다.",
    "주식 양도소득 과세 체계 개편을 정부가 구체적으로 검토하고 있는지는 공식 발표를 찾지 못했다.",
    "상속·증여세 인하가 청년 소비에 미치는 효과에 대한 공식 분석은 찾지 못했다.",
  ],
  sources: [
    {
      id: "src-weeklykhan-20241115",
      title: "(32) 이재명 대표의 금투세 폐지 결정, 즉각 철회해야",
      publisher: "주간경향",
      url: "https://weekly.khan.co.kr/article/202411151530041",
      publishedAt: "2024-11-15",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-dailian-1639888",
      title: "증시 살아나자 과세 논쟁도 꿈틀…금투세 부활론 다시 수면 위",
      publisher: "데일리안",
      url: "https://www.dailian.co.kr/news/view/1639888/",
      publishedAt: "2026-05-02",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-nate-20260803",
      title: "[2026 세제개편] 가업상속공제 '한도 1000억' 늘리고 '경영요건 30년' 조인다",
      publisher: "네이트뉴스(비바100)",
      url: "https://m.news.nate.com/view/20260803n28652",
      publishedAt: "2026-08-03",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-taxtimes-277236",
      title: "\"상속세 최고세율 40%로…할증평가 폐지\"",
      publisher: "한국세정신문",
      url: "https://www.taxtimes.co.kr/news/article.html?no=277236",
      type: "press",
      license: "link-only",
    },
  ],
};
