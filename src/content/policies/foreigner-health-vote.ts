import type { PolicyInput } from "./schema";

/**
 * 외국인 건강보험과 지방선거 투표권.
 *
 * "중국인이 건보 혜택을 가로챈다", "중국인이 무더기로 투표한다"는 말이 혐오
 * 정서와 맞물려 자주 돈다. 숫자로 확인할 수 있는 것만 적는다.
 *
 * ★ 수치는 건강보험공단이 국회의원실에 낸 자료를 보도가 옮긴 것이다. 편집팀이
 *   2026-10-08 1차 자료와 대조했다.
 * ★ 공단은 2025년 3월 중국인 재정수지 통계를 고쳤다. 고치기 전 숫자로 "적자"를
 *   말하는 글이 있으므로 정정 사실을 함께 적는다.
 * ★ 지방선거 외국인 투표권은 2005년 공직선거법 개정으로 생긴 제도다. 이재명 정부가
 *   만든 정책이 아니지만, 정부를 겨냥한 소문의 단골 주제라 함께 둔다.
 * ★ 외국인 주택 거래 규제는 `housing-measures`에 있다.
 */
export const FOREIGNER_HEALTH_VOTE: PolicyInput = {
  slug: "foreigner-health-vote",
  title: "외국인 건강보험과 투표권",
  scope: "외국인·중국인 건강보험 재정수지와 지방선거 외국인 투표권에 관한 숫자",
  ministries: ["보건복지부", "국민건강보험공단", "중앙선거관리위원회"],
  categories: ["welfare", "institution"],
  asOf: "2026-10-08",
  rumors: [
    {
      id: "rumor-health-freeride",
      text: "중국인이 건강보험 혜택을 가로채 건보 재정이 적자다",
      claimIds: ["claim-foreign-surplus", "claim-china-2024", "claim-stat-fix"],
    },
    {
      id: "rumor-vote-visa",
      text: "중국인은 무비자로 들어와도 투표할 수 있고, 투표권 가진 중국인이 80만 명이 넘는다",
      claimIds: ["claim-vote-rule", "claim-vote-2026", "claim-vote-china"],
    },
  ],
  claims: [
    {
      id: "claim-foreign-surplus",
      text:
        "재외국민을 뺀 외국인 건강보험 가입자는 2017년부터 2024년까지 8년 내리 낸 " +
        "보험료가 받은 급여보다 많았다. 2024년 흑자는 9,439억 원이다.",
      assertionType: "FACT",
      sourceIds: ["src-asiae-health", "src-ytn-health"],
      verified: true,
    },
    {
      id: "claim-china-2024",
      text:
        "중국 국적 가입자의 건강보험 재정수지는 2022년 229억 원 적자, 2023년 27억 원 " +
        "적자였다가 2024년 55억 원 흑자가 됐다. 같은 해 중국인이 낸 보험료는 9,369억 " +
        "원이다.",
      assertionType: "FACT",
      sourceIds: ["src-medipana-health", "src-ytn-health"],
      verified: true,
    },
    {
      id: "claim-dependent-rule",
      text:
        "2024년 4월부터 외국인은 국내에 6개월 이상 살아야 건강보험 피부양자가 될 수 있다.",
      assertionType: "FACT",
      sourceIds: ["src-ytn-health"],
      verified: true,
    },
    {
      id: "claim-stat-fix",
      text:
        "건강보험공단은 2025년 3월 중국인 재정수지 통계의 오류를 고쳤다. 2020년은 " +
        "239억 원 적자에서 365억 원 흑자로, 2023년은 640억 원 적자에서 27억 원 적자로 " +
        "바뀌었다. 외국인 전체 재정수지는 바뀌지 않았다.",
      assertionType: "FACT",
      sourceIds: ["src-sbs-stat-fix", "src-hankyung-stat-fix"],
      verified: true,
    },
    {
      id: "claim-minister-fraud",
      text:
        "정은경 보건복지부 장관은 2025년 국정감사에서 지적된 외국인 부정수급의 99.5%는 " +
        "퇴사 뒤 사업주의 신고가 늦어 생긴 것이고 이용자의 부정수급이 아니라고 말했다.",
      assertionType: "FACT",
      assertedBy: "보건복지부 장관",
      sourceIds: ["src-asiae-health"],
      verified: true,
    },
    {
      id: "claim-vote-rule",
      text:
        "외국인은 영주권(F-5)을 받은 지 3년이 지나고 만 18세 이상이면 지방선거에서만 " +
        "투표할 수 있다. 대통령선거와 국회의원선거에는 투표할 수 없고 피선거권도 없다.",
      assertionType: "FACT",
      sourceIds: ["src-newsc-vote"],
      verified: true,
    },
    {
      id: "claim-vote-2026",
      text:
        "2026년 6월 3일 지방선거의 외국인 유권자는 약 15만 명으로 전체 유권자의 " +
        "0.34%였다.",
      assertionType: "FACT",
      sourceIds: ["src-imbc-vote"],
      verified: true,
    },
    {
      id: "claim-vote-china",
      text:
        "2025년 4월 재·보궐선거 때 외국인 선거권자는 약 14만 명이고 그 가운데 중국 " +
        "국적은 약 11만 3,500명이었다. '중국인 유권자 80만 명' 주장은 이 수치와 맞지 " +
        "않는다.",
      assertionType: "FACT",
      sourceIds: ["src-newstop-vote"],
      verified: true,
    },
  ],
  gaps: [
    "2026년 지방선거 외국인 유권자의 국적별 공식 집계는 확인하지 못했다.",
  ],
  sources: [
    {
      id: "src-asiae-health",
      title: "[2025국감]\"중국인 건보 무임승차\" 주장에 \"흑자 상태\" 반박",
      publisher: "아시아경제",
      url: "https://www.asiae.co.kr/article/2025101413555629565",
      publishedAt: "2025-10-14",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-ytn-health",
      title: "중국인 '건강보험 무임승차' 손 보자...벌어진 대반전",
      publisher: "YTN",
      url: "https://m.ytn.co.kr/news_view.php?key=202506081605587730&s_mcd=0134",
      publishedAt: "2025-06-08",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-medipana-health",
      title: "중국인 대상 건강보험 재정수지, 첫 흑자 전환",
      publisher: "메디파나뉴스",
      url: "https://www.medipana.com/news/articleView.html?idxno=342498",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-sbs-stat-fix",
      title: "건보공단 외국인 통계 구멍…중국 재정수지 최대 613억 오차",
      publisher: "SBS",
      url: "https://news.sbs.co.kr/news/endPage.do?news_id=N1008004219",
      publishedAt: "2025-03-02",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-hankyung-stat-fix",
      title: "중국인 건보 먹튀?…사실은 '통계 오류'였다",
      publisher: "한국경제",
      url: "https://www.hankyung.com/article/2025030283341",
      publishedAt: "2025-03-02",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-newsc-vote",
      title: "“20년 전 만든 제도, 2026 선거의 쟁점 되다”… 외국인 지방선거권 논란의 현재",
      publisher: "뉴스C",
      url: "http://www.news-c.co.kr/bbs/board.php?bo_table=news&wr_id=3751",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-imbc-vote",
      title: "6.3 지방선거 외국인 유권자 15만 명‥역대 최다",
      publisher: "MBC",
      url: "https://imnews.imbc.com/replay/2026/nwtoday/article/6826093_37012.html",
      publishedAt: "2026-06",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-newstop-vote",
      title: "[팩트체크] 투표권 가진 중국인 80만 명 넘는다?",
      publisher: "뉴스톱",
      url: "https://www.newstopkorea.com/news/articleView.html?idxno=40523",
      type: "press",
      license: "link-only",
    },
  ],
};
