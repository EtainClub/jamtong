import type { PolicyInput } from "./schema";

/**
 * 차별금지법 추진 현황과 대통령의 입장.
 *
 * 10월 말 X 게시물 답글에 "혐오 표현 처벌을 포함한 차별금지법을 정부 입법으로 만들어 달라",
 * "인권위가 시정을 권고한 지역 방송사의 학력별 임금 차별이 남아 있다"는 말이 달렸다(잼통 Voice).
 * 22대 국회의 법안과 대통령의 공개 발언을 적는다.
 *
 * ★ 정부 입법 계획은 찾지 못했다. 국회 법안은 의원 발의다.
 * ★ 2026-10-31 처음 등록 — 잼통 Voice 이슈 #131, #186.
 */
export const ANTI_DISCRIMINATION_LAW: PolicyInput = {
  slug: "anti-discrimination-law",
  title: "차별금지법 추진 현황과 대통령의 입장",
  scope:
    "22대 국회에 발의된 차별금지법안(2026년 1~2월)의 내용과 심사 상황, 대통령의 취임 첫 달 발언, 국가인권위원회 권고의 효력 한계",
  ministries: ["법무부", "국가인권위원회"],
  categories: ["institution"],
  asOf: "2026-10-31",
  rumors: [
    {
      id: "rumor-gov-bill",
      text: "혐오 표현 처벌을 포함한 차별금지법을 정부 입법으로 서둘러 만들어 달라",
      claimIds: ["claim-bills", "claim-bill-content", "claim-president"],
    },
    {
      id: "rumor-education-wage",
      text: "인권위가 시정을 권고한 지역 방송사의 학력별 임금 차별이 기존 직원에게 여전히 남아 있으니 바로잡아 달라",
      claimIds: ["claim-andong-mbc", "claim-bill-content"],
    },
  ],
  claims: [
    {
      id: "claim-bills",
      text:
        "22대 국회에서는 2026년 1월 9일 진보당 손솔 의원, 2월 5일 조국혁신당 정춘생 의원(13인, 의안번호 2216610)이 차별금지법안을 " +
        "대표 발의했다. 정춘생 안은 법제사법위원회에 회부됐다.",
      assertionType: "FACT",
      sourceIds: ["src-lawmaking-2216610", "src-peoplepower-2008481"],
      verified: true,
    },
    {
      id: "claim-bill-content",
      text:
        "정춘생 안은 성별·장애·병력·나이·인종 등을 이유로 한 고용·교육·재화 이용 등의 차별을 금지한다. 인권위 권고를 따르지 않으면 " +
        "법무부가 시정명령과 이행강제금(3천만 원 이하)을 부과할 수 있고, 악의적 차별에는 손해액의 3~5배 배상을 정할 수 있다.",
      assertionType: "FACT",
      sourceIds: ["src-lawmaking-2216610"],
      verified: true,
    },
    {
      id: "claim-president",
      text:
        "대통령은 취임 한 달 기자회견(2025년 7월 3일)에서 차별금지법에 대해 \"중요한 우리 사회의 과제 중 하나긴 한데 민생과 경제가 " +
        "더 시급하다\"고 말했다.",
      assertionType: "FACT",
      sourceIds: ["src-khan-20250706"],
      verified: true,
    },
    {
      id: "claim-andong-mbc",
      text:
        "국가인권위원회는 블라인드 채용으로 뽑은 직원에게 학력에 따라 다른 호봉·기본급을 적용한 안동MBC에 호봉을 다시 매기라고 권고했지만, " +
        "회사는 내부 규정상 문제가 없다며 거부했다(2026년 1월 보도). 인권위 권고는 법적 강제력이 없다.",
      assertionType: "FACT",
      sourceIds: ["src-nate-20260128"],
      verified: false,
    },
  ],
  critiqueIds: [],
  timeline: [
    {
      id: "t-son",
      date: "2026-01-09",
      datePrecision: "day",
      title: "손솔 의원 차별금지법안 발의",
      summary: "22대 국회 첫 법안.",
      claimIds: ["claim-bills"],
    },
    {
      id: "t-jung",
      date: "2026-02-05",
      datePrecision: "day",
      title: "정춘생 의원 차별금지법안 발의",
      summary: "법사위 회부.",
      claimIds: ["claim-bills", "claim-bill-content"],
    },
  ],
  gaps: [
    "두 법안의 상임위 심사 진행 상황과 정부 의견서는 확인하지 못했다.",
    "법안이 혐오 표현을 형사처벌하는지, 학력을 차별 사유에 넣었는지는 법안 원문 전체로 확인하지 못했다.",
    "안동MBC 사건의 인권위 권고 날짜와 회사 거부 경위는 인권위 결정문 원문으로 대조하지 못했다.",
    "대통령이 2026년에 차별금지법에 대해 밝힌 입장은 찾지 못했다.",
  ],
  sources: [
    {
      id: "src-lawmaking-2216610",
      title: "차별금지법안(정춘생의원 등 13인, 제2216610호)",
      publisher: "국민참여입법센터(국회 입법현황)",
      url: "https://opinion.lawmaking.go.kr/gcom/nsmLmSts/out/2216610/detailRP",
      publishedAt: "2026-02-05",
      type: "legislative",
      license: "public",
    },
    {
      id: "src-peoplepower-2008481",
      title: "[논평] 차별금지법 제정의 역사, 22대 국회가 그 마지막이어야 한다",
      publisher: "참여연대(차별금지법제정연대)",
      url: "https://peoplepower21.org/solidarity/2008481",
      publishedAt: "2026-01-12",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-khan-20250706",
      title: "강선우 여가부 장관 후보자는 '차별금지법 제정' 동의할까요? [뉴스 물음표]",
      publisher: "경향신문",
      url: "https://www.khan.co.kr/article/202507060700001",
      publishedAt: "2025-07-06",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-nate-20260128",
      title: "안동MBC, 前 '학력 임금 차별' 사건 인권위 권고 거부",
      publisher: "네이트뉴스",
      url: "https://m.news.nate.com/view/20260128n36123",
      publishedAt: "2026-01-28",
      type: "press",
      license: "link-only",
    },
  ],
};
