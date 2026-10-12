import type { PolicyInput } from "./schema";

/**
 * 123대 국정과제 이행 점검 (2026년 10월).
 *
 * `/tasks`의 주요내용에 "시행"·"추진 중"을 달기 위해, 공약 점검(pledge-check-2026)에
 * 없던 사실을 모았다. 같은 규칙을 따른다 — 법은 통과·공포·시행을 갈라 적고,
 * 정부의 계획은 "밝혔다"로 적는다.
 *
 * ★ 2026-10-12 처음 등록, 같은 날 각 출처 원문과 대조했다.
 */
export const TASKS_CHECK_2026: PolicyInput = {
  slug: "tasks-check-2026",
  title: "123대 국정과제 이행 점검 (2026년 10월)",
  scope:
    "123대 국정과제 가운데 법 개정·조직 개편·정부 발표로 진행을 확인할 수 있는 항목의 사실관계",
  ministries: [],
  categories: ["institution", "diplomacy", "welfare"],
  asOf: "2026-10-12",
  claims: [
    // ── 국정목표 1 ──
    {
      id: "claim-referendum-act",
      text:
        "국민투표법 개정안이 2026년 3월 1일 국회 본회의에서 재석 176명 전원 찬성으로 통과했다. 재외투표인명부에 " +
        "오른 사람도 투표할 수 있게 하고, 투표 연령을 19세에서 18세로 낮추고, 사전·거소·선상투표를 도입했다.",
      assertionType: "FACT",
      sourceIds: ["src-khan-referendum"],
      verified: true,
    },
    {
      id: "claim-amendment-failed",
      text:
        "개헌안이 2026년 5월 7일 국회 본회의에 상정됐지만 국민의힘 의원들이 불참해 의결 정족수에 못 미쳐 투표가 " +
        "성립하지 않았다. 5월 8일 우원식 국회의장이 6월 3일 개헌 국민투표를 위한 절차가 중단됐다고 선언했다.",
      assertionType: "FACT",
      sourceIds: ["src-fn-amendment"],
      verified: true,
    },
    {
      id: "claim-counterintel",
      text:
        "안규백 국방부 장관은 2026년 6월 10일 국군방첩사령부를 해체한다고 발표했다. 방첩·방산 정보활동과 사이버보안은 " +
        "새로 만드는 국방방첩본부가, 군내 보안업무는 국방보안지원단이, 안보수사와 계엄 시 합동수사권은 " +
        "국방부조사본부가 맡고, 동향조사·인사첩보·세평수집 같은 권력형 기능은 폐지한다. 국방부는 7월 말까지 " +
        "창설을 마칠 계획이라고 밝혔다.",
      assertionType: "FACT",
      sourceIds: ["src-korea-counterintel"],
      verified: true,
    },
    {
      id: "claim-police-bureau",
      text:
        "행정안전부 경찰국을 없애는 직제 개정령이 2025년 8월 18일 국무회의에서 의결되고 8월 26일 공포·시행됐다. " +
        "자치경찰 지원 등 업무는 경찰국 신설 이전의 소관 부서로 옮겼다.",
      assertionType: "FACT",
      sourceIds: ["src-korea-police-bureau"],
      verified: true,
    },
    // ── 국정목표 2 ──
    {
      id: "claim-ai-committee",
      text: "이재명 대통령이 위원장을 맡는 국가인공지능전략위원회가 2025년 9월 8일 공식 출범했다.",
      assertionType: "FACT",
      sourceIds: ["src-korea-ai-committee"],
      verified: true,
    },
    {
      id: "claim-ai-model",
      text:
        "과학기술정보통신부는 2025년 12월 30일 독자 AI 파운데이션 모델 프로젝트 1차 발표회를 열고 결과를 공개했다. " +
        "정예팀은 네이버클라우드·업스테이지·SKT·NC AI·LG AI연구원 5곳이다.",
      assertionType: "FACT",
      sourceIds: ["src-dailian-ai-model"],
      verified: true,
    },
    {
      id: "claim-rnd-budget",
      text:
        "국회는 2025년 12월 2일 본회의에서 2026년도 정부 R&D 예산을 35조 5,000억 원으로 확정했다. " +
        "2025년 29조 6,000억 원보다 5조 9,000억 원(19.9%) 늘었다.",
      assertionType: "FACT",
      sourceIds: ["src-hellodd-rnd"],
      verified: true,
    },
    {
      id: "claim-one-strike",
      text:
        "금융위원회·금융감독원·한국거래소는 2025년 7월 9일 주가조작 근절 합동대응단을 가동하고 불공정거래에 " +
        "'원스트라이크 아웃'을 적용한다고 발표했다. 불법이익이 남은 계좌는 지급정지로 동결하고 최대 부당이득 2배의 " +
        "과징금을 부과하며, 상장폐지 요건을 강화한 거래소 상장규정 개정은 7월 10일 시행했다.",
      assertionType: "FACT",
      sourceIds: ["src-korea-one-strike"],
      verified: true,
    },
    // ── 국정목표 3 ──
    {
      id: "claim-offshore-wind",
      text:
        "해상풍력특별법이 2026년 3월 26일 시행됐다. 정부가 적합 입지를 먼저 발굴하는 계획입지 방식으로 바뀌고, " +
        "국무총리 소속 해상풍력발전위원회가 예비지구·발전지구 지정을 심의·의결한다. 정부는 연내 1차 예비지구 " +
        "후보지를 발굴하겠다고 밝혔다.",
      assertionType: "FACT",
      sourceIds: ["src-korea-offshore-wind"],
      verified: true,
    },
    // ── 국정목표 4 ──
    {
      id: "claim-care-integration",
      text:
        "통합돌봄 본사업이 2026년 3월 27일부터 전국 229개 모든 시·군·구에서 시행됐다. 대상은 노쇠·장애·질병으로 " +
        "일상생활이 어려운 65세 이상 노인과 중증 장애인이고, 중증 장애인 통합돌봄은 102개 지자체에서 먼저 시행한다.",
      assertionType: "FACT",
      sourceIds: ["src-etoday-care"],
      verified: true,
    },
    {
      id: "claim-dev-disability",
      text:
        "보건복지부는 2026년 9월 10일 발달장애인 주간활동서비스 대상을 현재 1만 5,000명에서 2027년 2만 명, " +
        "2030년 3만 명으로 단계적으로 늘리겠다고 밝혔다. 2027년 범부처 발달장애인 예산은 약 2조 8,000억 원으로 " +
        "정부안에 반영됐다.",
      assertionType: "CLAIM",
      assertedBy: "보건복지부",
      sourceIds: ["src-ngo-dev-disability"],
      verified: true,
    },
    {
      id: "claim-labor-day",
      text:
        "5월 1일 '근로자의 날'을 '노동절'로 바꾸는 법률이 2025년 10월 국회 본회의를 통과했다. 2026년부터 적용된다.",
      assertionType: "FACT",
      sourceIds: ["src-hankyung-labor-day"],
      verified: true,
    },
    {
      id: "claim-gender-ministry",
      text:
        "정부조직법 개정에 따라 여성가족부가 2025년 10월 1일 성평등가족부로 확대 개편됐다. 성평등정책실을 새로 두고 " +
        "노동부에서 넘어온 업무를 맡는 고용평등정책관을 신설했으며, 기준 정원은 277명에서 294명으로 늘었다.",
      assertionType: "FACT",
      sourceIds: ["src-dailian-gender"],
      verified: true,
    },
    // ── 국정목표 5 ──
    {
      id: "claim-opcon",
      text:
        "2025년 11월 한미 안보협의회의(SCM)에서 양국은 전시작전통제권 전환 로드맵을 발전시키고 2026년 미래연합사의 " +
        "완전운용능력(FOC) 검증을 추진하기로 했다.",
      assertionType: "FACT",
      sourceIds: ["src-newsis-opcon"],
      verified: true,
    },
    {
      id: "claim-unification-org",
      text:
        "통일부 직제 개편이 2025년 11월 4일 시행돼 남북회담본부와 평화협력지구추진단이 복원되고 평화교류실이 " +
        "신설됐다. 정원은 533명에서 600명으로 늘었다.",
      assertionType: "FACT",
      sourceIds: ["src-tongil-org", "src-khan-unification"],
      verified: true,
    },
    {
      id: "claim-japan-shuttle",
      text:
        "2025년 9월 30일 부산에서 이재명 대통령과 이시바 시게루 일본 총리가 정상회담을 했다. 두 정상은 8월 이 대통령의 " +
        "방일에 이어 한 달 만에 이시바 총리가 방한하면서 셔틀외교가 완성된 것을 환영했다.",
      assertionType: "FACT",
      sourceIds: ["src-korea-japan"],
      verified: true,
    },
    {
      id: "claim-china-summit",
      text:
        "2025년 11월 1일 경주에서 한중 정상회담이 열렸다. 양 정상은 한중 전략적 협력 동반자 관계의 성숙한 발전을 " +
        "추진하기로 했고, 5년 만기 70조 원 규모의 원-위안 통화스왑 계약과 경제협력 공동계획(2026~30) MOU 등을 체결했다.",
      assertionType: "FACT",
      sourceIds: ["src-mofa-china"],
      verified: true,
    },
  ],
  timeline: [
    { id: "t-police", date: "2025-08-26", datePrecision: "day", title: "행안부 경찰국 폐지", summary: "직제 개정령 공포·시행.", claimIds: ["claim-police-bureau"] },
    { id: "t-ai", date: "2025-09-08", datePrecision: "day", title: "국가인공지능전략위원회 출범", summary: "대통령이 위원장.", claimIds: ["claim-ai-committee"] },
    { id: "t-japan", date: "2025-09-30", datePrecision: "day", title: "부산 한일 정상회담", summary: "셔틀외교 완성 환영.", claimIds: ["claim-japan-shuttle"] },
    { id: "t-gender", date: "2025-10-01", datePrecision: "day", title: "성평등가족부 출범", summary: "여성가족부 확대 개편.", claimIds: ["claim-gender-ministry"] },
    { id: "t-china", date: "2025-11-01", datePrecision: "day", title: "경주 한중 정상회담", summary: "원-위안 통화스왑 70조 원 등.", claimIds: ["claim-china-summit"] },
    { id: "t-unification", date: "2025-11-04", datePrecision: "day", title: "통일부 남북회담본부 복원", summary: "직제 개편 시행.", claimIds: ["claim-unification-org"] },
    { id: "t-referendum", date: "2026-03-01", datePrecision: "day", title: "국민투표법 개정안 통과", summary: "재외국민 투표·18세 투표권.", claimIds: ["claim-referendum-act"] },
    { id: "t-wind", date: "2026-03-26", datePrecision: "day", title: "해상풍력특별법 시행", summary: "계획입지 방식으로 전환.", claimIds: ["claim-offshore-wind"] },
    { id: "t-care", date: "2026-03-27", datePrecision: "day", title: "통합돌봄 전국 시행", summary: "229개 시·군·구.", claimIds: ["claim-care-integration"] },
    { id: "t-amendment", date: "2026-05-08", datePrecision: "day", title: "6·3 개헌 국민투표 무산", summary: "개헌안 표결 불성립.", claimIds: ["claim-amendment-failed"] },
    { id: "t-counterintel", date: "2026-06-10", datePrecision: "day", title: "방첩사 해체 발표", summary: "기능을 세 기관으로 분산.", claimIds: ["claim-counterintel"] },
  ],
  gaps: [
    "국민투표법 개정안의 공포·시행일을 확인하지 못했다.",
    "국방방첩본부·국방보안지원단이 예정대로 2026년 7월 말 창설됐는지 확인하지 못했다.",
    "독자 AI 파운데이션 모델은 이후 단계평가로 정예팀 구성이 바뀌었다는 보도가 있으나 원문으로 대조하지 못했다.",
    "R&D 예산이 정부 총지출 대비 5% 수준에 이르렀는지 확인하지 못했다.",
    "해상풍력 1차 예비지구가 지정됐는지 확인하지 못했다.",
    "노동절 공휴일 지정 여부는 확인하지 못했다.",
    "전작권 전환의 FOC 검증 완료 여부와 전환 목표연도는 2026년 10월 현재 공식 발표를 찾지 못했다.",
    "디지털자산기본법, 감사원법 개정(정책감사 폐지 법제화), 정년 연장은 2026년 10월 현재 국회 통과를 확인하지 못해 국정과제 화면에서 '확인 전'으로 둔다.",
  ],
  sources: [
    { id: "src-khan-referendum", title: "[속보]'개헌 선결조건' 국민투표법 개정안, 국회 본회의 통과", publisher: "경향신문", url: "https://www.khan.co.kr/article/202603012053001", publishedAt: "2026-03-01", type: "press", license: "link-only" },
    { id: "src-fn-amendment", title: "6·3 지선 개헌 동시 투표 무산…우원식 \"국힘에 강력 유감\"", publisher: "파이낸셜뉴스(뉴시스)", url: "https://www.fnnews.com/news/202605081713412007", publishedAt: "2026-05-08", type: "press", license: "link-only" },
    { id: "src-korea-counterintel", title: "국방부, 국군방첩사령부 해체…방첩·보안·안보수사 기능 분산", publisher: "대한민국 정책브리핑(국방부)", url: "https://www.korea.kr/news/policyNewsView.do?newsId=148966271", publishedAt: "2026-06-10", type: "official", license: "public" },
    { id: "src-korea-police-bureau", title: "'경찰국' 폐지 완료…자치경찰 지원 등 차질 없이 이행", publisher: "대한민국 정책브리핑(행정안전부)", url: "https://www.korea.kr/news/policyNewsView.do?newsId=148948108", publishedAt: "2025-08-25", type: "official", license: "public" },
    { id: "src-korea-ai-committee", title: "'국가AI전략위원회' 출범…이 대통령 \"AI 기술은 국력이자 경제력\"", publisher: "대한민국 정책브리핑", url: "https://www.korea.kr/news/policyNewsView.do?newsId=148948859", publishedAt: "2025-09-08", type: "official", license: "public" },
    { id: "src-dailian-ai-model", title: "과기정통부, 독자 AI 파운데이션 모델 '5개 정예팀' 1차 선정", publisher: "데일리안", url: "https://www.dailian.co.kr/news/view/1592254", publishedAt: "2025-12-30", type: "press", license: "link-only" },
    { id: "src-hellodd-rnd", title: "내년 정부 R&D 예산 35조5천억원 확정···과기정통부 23조7천억원", publisher: "헬로디디", url: "https://www.hellodd.com/news/articleView.html?idxno=110127", publishedAt: "2025-12-03", type: "press", license: "link-only" },
    { id: "src-korea-one-strike", title: "금융당국, 주가조작 근절 '합동대응단' 가동…불공정거래 '원스트라이크 아웃'", publisher: "대한민국 정책브리핑(금융위원회)", url: "https://www.korea.kr/news/policyNewsView.do?newsId=148945721", publishedAt: "2025-07-09", type: "official", license: "public" },
    { id: "src-korea-offshore-wind", title: "해상풍력 개발, 국가 주도 '계획입지'로 전환…이달 26일 시행", publisher: "대한민국 정책브리핑(기후에너지환경부)", url: "https://www.korea.kr/news/policyNewsView.do?newsId=148960952", publishedAt: "2026-03-17", type: "official", license: "public" },
    { id: "src-etoday-care", title: "요양병원 아닌 살던 곳에서 돌봄⋯통합돌봄 본사업 시행", publisher: "이투데이", url: "https://www.etoday.co.kr/news/view/2569515", publishedAt: "2026-03-26", type: "press", license: "link-only" },
    { id: "src-ngo-dev-disability", title: "발달장애인 돌봄 국가책임 강화…내년 예산 2조8천억원·주간활동 2030년 3만명 확대", publisher: "한국NGO신문", url: "https://www.ngonews.kr/news/articleView.html?idxno=237760", publishedAt: "2026-09-10", type: "press", license: "link-only" },
    { id: "src-hankyung-labor-day", title: "'근로자의 날' 이름 바뀐다…내년부터 5월 1일은 '노동절'", publisher: "한국경제", url: "https://www.hankyung.com/amp/2025102629357", publishedAt: "2025-10-26", type: "press", license: "link-only" },
    { id: "src-dailian-gender", title: "여성가족부, 내일(1일)부터 '성평등가족부'로 확대 개편", publisher: "데일리안", url: "https://www.dailian.co.kr/news/view/1555908/", publishedAt: "2025-09-30", type: "press", license: "link-only" },
    { id: "src-newsis-opcon", title: "한미 SCM 공동성명 발표…내년 전작권 전환 2단계 '완전운용능력' 검증 추진", publisher: "뉴시스", url: "https://www.newsis.com/view/NISX20251114_0003403691", publishedAt: "2025-11-14", type: "press", license: "link-only" },
    { id: "src-tongil-org", title: "통일부, 직제 개편 4일부터 시행...고위공무원(11명), 과장급(51명) 인사 단행", publisher: "통일뉴스", url: "https://www.tongilnews.com/news/articleView.html?idxno=214965", publishedAt: "2025-11-04", type: "press", license: "link-only" },
    { id: "src-khan-unification", title: "통일부, 윤석열 정부 때 없앤 '남북회담본부' 부활", publisher: "경향신문", url: "https://www.khan.co.kr/article/202510142119005", publishedAt: "2025-10-14", type: "press", license: "link-only" },
    { id: "src-korea-japan", title: "부산서 한일 정상회담…양국 간 셔틀외교 완성 환영", publisher: "대한민국 정책브리핑", url: "https://www.korea.kr/news/policyNewsView.do?newsId=148950177", publishedAt: "2025-09-30", type: "official", license: "public" },
    { id: "src-mofa-china", title: "한·중 정상회담 (2025년 정상 외교활동)", publisher: "외교부", url: "https://www.mofa.go.kr/www/brd/m_28650/view.do?seq=62", publishedAt: "2025-11-01", type: "official", license: "public" },
  ],
};
