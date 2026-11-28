import { achievementSchema, type AchievementInput } from "@/content/schema";

/**
 * 지역사랑상품권 국비 지원 의무화 — 발행·운영 지원을 법적 의무로, 인구감소지역 추가 지원 근거.
 *
 * ★ 2026-11-28 작성. 초안은 Codex(GPT)가 실시간 검색으로 1차 자료(법령·정책브리핑·부처 보도자료)와 보도를 모아 썼고,
 *   에이전트가 출처 페이지를 직접 받아 인용문이 그대로 있는지, claim의 숫자가 그 출처에 있는지 대조한 뒤 내용을 읽어 고쳤다
 *   (docs/gov-achievements-p1-review.md).
 * ★ 계획·추진과 시행·완료를 구분했다. 부처의 계획·평가와 비판은 CLAIM(주장한 쪽)으로 적었다.
 */
const raw: AchievementInput = {
  id: "local-currency",
  slug: "local-currency",
  title: "지역사랑상품권 국비 지원 의무화",
  subtitle: "발행·운영 지원을 법적 의무로, 인구감소지역 추가 지원 근거",
  lifeQuestion: "지역사랑상품권법 개정으로 지원과 발행은 무엇이 달라졌나?",
  kicker: "주요 정책",
  categories: ["institution", "economy", "region"],
  summary: "지역사랑상품권법 개정안은 2025년 8월 4일 국회를 통과하고 8월 26일 공포됐다. 국가·지자체의 행정·재정 지원 의무화와 인구감소지역 추가 보조금 근거는 2026년 1월 1일부터, 기본계획·실태조사 규정은 2월 27일부터 시행됐다. 지자체의 상품권 발행 자체는 의무가 아니다. 행정안전부가 공개한 2025년 일반 발행 규모는 22조 4천억 원이다.",
  type: "policy",
  publishStatus: "published",
  sourceNote: "2026년 11월 28일 기준 행정안전부 자료, 국가법령정보센터의 법률 제21030호 개정문·부칙과 제4조, 국회 찬반 토론을 보도한 뉴시스에 근거한다. 국회 통과·공포·조항별 시행일을 구분했다. 2025년 발행 규모에는 현 정부 출범 전 기간과 지원 의무화 시행 전 실적이 포함되므로 개정법의 효과로 귀속하지 않는다. 국비 집행·지자체 실집행 실적(국회예산정책처 결산 분석)은 원문을 대조하지 못해 싣지 않았다. 2026년 연간 발행·집행 확정치, 개정법의 독립적인 순소비·고용 효과와 장기 재정 순편익은 확인하지 못했다.",
  headlineKeyNumberId: "lc-kn-volume",
  keyNumbers: [
    {"id": "lc-kn-volume", "label": "2025년 일반 발행 규모", "value": "22조 4천억", "unit": "원", "caption": "행정안전부 실태조사 결과. 지원 의무화 시행 전 실적", "claimId": "lc-volume"},
  ],
  timeline: [
    {"id": "lc-t-pass", "date": "2025-08-04", "datePrecision": "day", "title": "개정안 국회 통과", "summary": "지역사랑상품권 국가지원 의무화 등을 담은 개정안이 본회의를 통과했다.", "claimIds": ["lc-pass"]},
    {"id": "lc-t-promulgation", "date": "2025-08-26", "datePrecision": "day", "title": "개정법 공포", "summary": "법률 제21030호가 공포됐고, 목적 조문의 지방소멸 완화·지역균형발전 추가가 시행됐다.", "claimIds": ["lc-dates"]},
    {"id": "lc-t-support", "date": "2026-01-01", "datePrecision": "day", "title": "지원 의무화 시행", "summary": "행정·재정 지원 의무화와 인구감소지역 추가 보조금 근거가 시행됐다.", "claimIds": ["lc-dates", "lc-support", "lc-depopulation"]},
    {"id": "lc-t-planning", "date": "2026-02-27", "datePrecision": "day", "title": "기본계획·실태조사 규정 시행", "summary": "기본계획과 세부시행계획 수립, 정기 실태조사·결과 공표 의무가 시행됐다.", "claimIds": ["lc-dates", "lc-planning"]},
    {"id": "lc-t-plan", "date": "2026-08-31", "datePrecision": "day", "title": "최초 법정 기본계획 발표", "summary": "행정안전부가 기본계획 수립과 함께 2025년 일반 발행 실적을 공개했다.", "claimIds": ["lc-first-plan", "lc-volume"]},
    {"id": "lc-t-explanation", "date": "2026-10-06", "datePrecision": "day", "title": "국비 미소진 보도에 대한 설명", "summary": "행정안전부는 선할인·후캐시백 방식에 따라 국비 집행 시점이 다르다고 설명했다.", "claimIds": ["lc-execution-limit"]},
  ],
  counterpoints: [
    {"id": "lc-cp-budget", "question": "국비 지원을 의무화하면 재정 부담과 경직성이 커지는 것 아닌가?", "response": "서범수 의원은 재정 경직성과 다른 민생사업 기회 감소를 우려했다. 법은 지원을 의무화하지만 지자체의 재정부담 능력 등을 고려해 예산 신청을 조정할 수 있도록 했다. 이 페이지가 확인한 자료만으로 장기 재정 부담의 순증 규모나 다른 사업의 감소 여부는 확정할 수 없다.", "claimIds": ["lc-fiscal-criticism", "lc-support"]},
    {"id": "lc-cp-effect", "question": "기존 소비의 결제수단만 바꾸고 실제 소비는 늘리지 못하는 것 아닌가?", "response": "고동진 의원은 소비 대체를, 박정현 의원은 소상공인 매출과 지역경제 회복 효과를 주장했다. 확인된 발행액은 유통 규모를 보여주지만 그 자체로 신규 소비나 순편익을 입증하지 않는다. 개정법 시행의 독립적인 소비 효과는 이 페이지에서 확인하지 못했다.", "claimIds": ["lc-effect-debate", "lc-volume"]},
    {"id": "lc-cp-mandatory", "question": "모든 지자체가 상품권을 발행해야 하고 인구감소지역은 정해진 추가 지원을 받는가?", "response": "제4조는 지자체장이 상품권을 발행할 수 있다고 규정해 발행 자체를 의무화하지 않는다. 인구감소지역 추가 보조금은 반영할 수 있다는 근거이며 법 조항 자체가 일정 금액이나 비율을 보장하지 않는다.", "claimIds": ["lc-optional", "lc-depopulation"]},
  ],
  claims: [
    { id: "lc-pass", text: "지역사랑상품권 이용 활성화에 관한 법률 개정안이 2025년 8월 4일 국회 본회의를 통과했다.", assertionType: "FACT", sourceIds: ["src-lc-pass"], verified: true },
    { id: "lc-dates", text: "개정법은 2025년 8월 26일 법률 제21030호로 공포됐다. 목적 조문은 공포일부터, 지원 의무화 등은 2026년 1월 1일부터, 기본계획·실태조사 규정은 2026년 2월 27일부터 시행됐다.", assertionType: "FACT", sourceIds: ["src-lc-amendment", "src-lc-plan"], verified: true },
    { id: "lc-support", text: "국가와 지방자치단체의 상품권 발행·판매·환전 등 운영에 필요한 행정적·재정적 지원이 의무화됐다. 행정안전부장관은 매년 지자체의 보조금 예산 신청을 받아 예산요구서에 반영하되 재정부담 능력 등을 고려해 조정할 수 있다.", assertionType: "FACT", sourceIds: ["src-lc-support", "src-lc-amendment"], verified: true },
    { id: "lc-depopulation", text: "인구감소지역에 대해서는 보조금 예산을 추가로 반영할 수 있는 근거가 신설됐다. 추가 지원의 구체적 금액이나 비율을 이 조항 자체가 확정한 것은 아니다.", assertionType: "FACT", sourceIds: ["src-lc-amendment"], verified: true },
    { id: "lc-optional", text: "제4조제1항은 지자체장이 지역사랑상품권을 발행할 수 있다고 규정한다. 이번 지원 의무화를 모든 지자체의 상품권 발행 의무화로 볼 수는 없다.", assertionType: "FACT", sourceIds: ["src-lc-issuance"], verified: true },
    { id: "lc-planning", text: "행정안전부장관은 기본계획을 5년 단위로, 세부시행계획을 매년 수립·시행해야 한다. 이용 현황과 사업 효과 등에 관한 실태조사를 3년 이내 범위의 정해진 기간마다 실시하고 결과를 공표해야 한다.", assertionType: "FACT", sourceIds: ["src-lc-amendment", "src-lc-support"], verified: true },
    { id: "lc-volume", text: "행정안전부가 2026년 8월 발표한 실태조사 결과에 따르면 2025년 일반 발행 규모는 22조 4천억 원이다. 이는 개정법의 지원 의무화 시행 전 연간 실적이다.", assertionType: "FACT", sourceIds: ["src-lc-plan", "src-lc-amendment"], verified: true },
    { id: "lc-first-plan", text: "행정안전부는 2026년 8월 31일 최초의 법정 기본계획인 지역사랑상품권 활성화 기본계획(2026~2030)을 수립했다고 발표했다.", assertionType: "FACT", sourceIds: ["src-lc-plan"], verified: true },
    { id: "lc-fiscal-criticism", text: "국민의힘 서범수 의원은 지원을 법률로 강제하면 재정 경직성이 커지고 다른 민생사업의 기회를 줄일 수 있으며 행정부의 예산편성권을 침해한다고 주장했다.", assertionType: "CLAIM", assertedBy: "서범수 국민의힘 의원", sourceIds: ["src-lc-debate"], verified: true },
    { id: "lc-effect-debate", text: "국민의힘 고동진 의원은 기존 소비를 대체할 뿐 신규 소비를 유발하지 못한다는 비판을 제기했다. 더불어민주당 박정현 의원은 국비 지원으로 발행 규모를 안정적으로 유지하면 소상공인 매출과 지역경제 회복에 도움이 된다고 주장했다.", assertionType: "CLAIM", assertedBy: "고동진 국민의힘 의원·박정현 더불어민주당 의원", sourceIds: ["src-lc-debate"], verified: true },
    { id: "lc-execution-limit", text: "행정안전부는 국비의 완전 소진 여부만으로 집행을 판단하면 오해가 생길 수 있다고 설명했다. 후캐시백 방식은 판매 이후 실제 결제 때 국비가 집행되므로 해당 연도 안에 모두 소진하기 어려울 수 있다는 입장이다.", assertionType: "CLAIM", assertedBy: "행정안전부", sourceIds: ["src-lc-explanation"], verified: true },
  ],
  sources: [
    { id: "src-lc-pass", title: "‘지역사랑상품권 발행 국가지원 의무화’ 「지역사랑상품권법」 개정안 국회 통과", url: "https://www.mois.go.kr/frt/bbs/type010/commonSelectBoardArticle.do?bbsId=BBSMSTR_000000000008&nttId=119521", publisher: "행정안전부", publishedAt: "2025-08-04", type: "official", license: "public", quote: "행정안전부(장관 윤호중)는 지역사랑상품권 발행 국가지원 의무화 등을 담은 「지역사랑상품권 이용 활성화에 관한 법률(이하 지역사랑상품권법)」 개정안이 국회 본회의에서 의결되었다고 밝혔다." },
    { id: "src-lc-support", title: "지역사랑상품권법 개정안 국회 통과 — 행정안전부 보도자료 전재", url: "https://www.nabis.go.kr/policyDetailView.do?gbnCode=P50&menucd=20&poIdx=19623&refCode=20", publisher: "행정안전부·NABIS", publishedAt: "2025-08-04", type: "official", license: "public", quote: "○ 또한, 국가와 지방자치단체의 지역사랑상품권 발행·운영에 필요한 행정적·재정적 지원이 의무화된다." },
    { id: "src-lc-amendment", title: "지역사랑상품권 이용 활성화에 관한 법률 — 법률 제21030호 제정·개정문 및 부칙", url: "https://law.go.kr/LSW/lsRvsDocListP.do?chrClsCd=010202&lsId=013749&lsRvsGubun=all", publisher: "국가법령정보센터", publishedAt: "2025-08-26", type: "legislative", license: "public", quote: "제1조(시행일) 이 법은 2026년 1월 1일부터 시행한다. 다만, 다음 각 호의 개정규정은 해당 호에서 정하는 날부터 시행한다.\n1. 제1조의 개정규정: 공포한 날\n2. 제3조의2 및 제15조의2의 개정규정: 공포 후 6개월이 경과한 날" },
    { id: "src-lc-issuance", title: "지역사랑상품권 이용 활성화에 관한 법률 제4조", url: "https://www.law.go.kr/lsLinkCommonInfo.do?lsJoLnkSeq=1028906683", publisher: "국가법령정보센터", publishedAt: "2025-08-26", type: "legislative", license: "public", quote: "제4조(지역사랑상품권의 발행) ① 지방자치단체의 장은 지역경제 활성화 및 지역공동체 강화를 위하여 지역사랑상품권을 발행할 수 있다." },
    { id: "src-lc-plan", title: "지역사랑상품권 5개년 법정 기본계획최초 수립, 지역경제 선순환 이끈다", url: "https://mois.go.kr/frt/bbs/type010/commonSelectBoardArticle.do?bbsId=BBSMSTR_000000000008&nttId=129103", publisher: "행정안전부", publishedAt: "2026-08-31", type: "official", license: "public", quote: "발행 규모(일반 발행 기준) 역시 2022 년 정점 이후 일시적으로 감소했으나, 2025 년 22 조 4 천억 원 규모로 다시 반등하며 증가세로 전환됐다." },
    { id: "src-lc-debate", title: "국가 재정지원 의무화 '지역사랑상품권법', 與 주도로 본회의 통과", url: "https://www.newsis.com/view/NISX20250804_0003278009", publisher: "뉴시스", publishedAt: "2025-08-04", type: "press", license: "quotable", quote: "국민의힘은 '불투명한 경제 효과', '국가 재정 부담' 등을 이유로 개정안에 반대했지만" },
    { id: "src-lc-explanation", title: "(설명) 지방정부 45%, 지역사랑상품권 국비 남겼다(내일)", url: "https://www.mois.go.kr/frt/bbs/type001/commonSelectBoardArticle.do?bbsId=BBSMSTR_000000000009&nttId=130015", publisher: "행정안전부", publishedAt: "2026-10-06", type: "official", license: "public", quote: "후캐시백은 판매가 되었어도 이용자가 상품권(유효기간 5년)으로 결제하여야 집행되므로 지방정부의 노력과 관계없이 해당연도 내 완전 소진이 어려울 수 있습니다." },
  ],
};

export const localCurrency = achievementSchema.parse(raw);
