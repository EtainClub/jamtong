import { achievementSchema, type AchievementInput } from "@/content/schema";

/**
 * 실노동시간 단축과 주 4.5일제 지원 — 2030년 연 1,700시간대를 목표로 한 노사정 로드맵.
 *
 * ★ 2026-11-28 작성. 초안은 Codex(GPT)가 실시간 검색으로 1차 자료(법령·정책브리핑·부처 보도자료)와 보도를 모아 썼고,
 *   에이전트가 출처 페이지를 직접 받아 인용문이 그대로 있는지, claim의 숫자가 그 출처에 있는지 대조한 뒤 내용을 읽어 고쳤다
 *   (docs/gov-achievements-p1-review.md).
 * ★ 계획·추진과 시행·완료를 구분했다. 부처의 계획·평가와 비판은 CLAIM(주장한 쪽)으로 적었다.
 */
const raw: AchievementInput = {
  id: "working-hours",
  slug: "working-hours",
  title: "실노동시간 단축과 주 4.5일제 지원",
  subtitle: "2030년 연 1,700시간대를 목표로 한 노사정 로드맵",
  lifeQuestion: "노동시간을 줄이려는 기업과 노동자에게 어떤 지원이 생겼고, 실제로 얼마나 참여했나?",
  kicker: "주요 정책",
  categories: ["economy", "welfare", "institution"],
  summary: "노사정은 2025년 12월 30일 실노동시간을 2030년까지 OECD 평균 수준인 연 1,700시간대로 줄이겠다는 공동선언과 로드맵 추진과제를 발표했다. 고용노동부는 2026년 1월 14일 이행점검단을 출범시키고, 주 4.5일제 도입 지원 등을 포함한 9,363억 원 규모의 범정부 지원사업을 발표했다. 임금 감소 없이 노동시간을 줄이는 기업을 지원하는 워라밸+4.5 프로젝트의 2026년 예산은 276억 원이며, 노동부가 발표한 참여 기업은 7월 말 기준 293곳이다. 경영계에서는 생산성 저하와 비용 증가를 우려하며, 영세기업의 도입 어려움과 기업 간 격차 확대 가능성도 비판으로 제기됐다.",
  type: "policy",
  publishStatus: "published",
  sourceNote: "고용노동부의 공동선언·이행점검단·사업 예산·참여 현황 발표와 정책브리핑, 연합뉴스·한국경제 보도에 근거했다. 로드맵 추진과제 발표는 2025년 12월 30일이며 2026년 1월 14일은 이행점검단 출범일이다. 2026년 11월 28일 현재 이번 조사에서 확인한 참여 집계는 7월 말 기준으로, 연말 최종 참여·지원금 집행 실적은 확인하지 못했다. 전국 노동시간 감소에 대한 사업의 인과효과, 지원 종료 후 지속성, 생산성·임금·고용의 전체 참여기업 평가 결과도 확인하지 못했다. 로드맵에 담긴 입법 추진과제의 최종 제정·시행 여부는 이 페이지에서 확정하지 않는다.",
  headlineKeyNumberId: "wh-kn-target",
  keyNumbers: [
    {"id": "wh-kn-target", "label": "2030년 실노동시간 목표", "prefix": "연", "value": "1,700", "unit": "시간대", "caption": "노사정 공동선언의 목표", "claimId": "wh-target"},
    {"id": "wh-kn-support", "label": "기업에 대한 단축 지원", "prefix": "최대", "value": "720", "unit": "만 원", "caption": "해당 노동자 1인당 연간 지원 상한", "claimId": "wh-support"},
    {"id": "wh-kn-budget", "label": "워라밸+4.5 프로젝트 예산", "value": "276", "unit": "억 원", "caption": "2026년 사업 예산", "claimId": "wh-budget"},
    {"id": "wh-kn-companies", "label": "노동시간 단축 참여 기업", "value": "293", "unit": "곳", "caption": "노동부 발표, 2026년 7월 말 기준", "claimId": "wh-july-status"},
  ],
  timeline: [
    {"id": "wh-t-launch", "date": "2025-09-24", "datePrecision": "day", "title": "로드맵 추진단 출범", "summary": "노사정이 참여하는 추진단이 노동시간 단축 과제를 논의하기 시작했다.", "claimIds": ["wh-dialogue"]},
    {"id": "wh-t-budget", "date": "2025-12-05", "datePrecision": "day", "title": "2026년 사업 예산 공개", "summary": "고용노동부 예산 안내에 워라밸+4.5 프로젝트 276억 원이 명시됐다.", "claimIds": ["wh-budget"]},
    {"id": "wh-t-roadmap", "date": "2025-12-30", "datePrecision": "day", "title": "노사정 공동선언과 추진과제 발표", "summary": "2030년 연 1,700시간대 목표와 포괄임금 오남용 방지·휴식 보장·지원법 제정 등의 추진과제를 제시했다.", "claimIds": ["wh-dialogue", "wh-target"]},
    {"id": "wh-t-check", "date": "2026-01-14", "datePrecision": "day", "title": "이행점검단 출범과 지원사업 발표", "summary": "로드맵 이행을 점검할 조직을 출범시키고 범정부 지원사업과 기업 지원 방안을 발표했다.", "claimIds": ["wh-check", "wh-package", "wh-support"]},
    {"id": "wh-t-june-status", "date": "2026-07-14", "datePrecision": "day", "title": "6월 말 참여 현황 발표", "summary": "노동부는 참여 기업 224곳으로 연간 목표 220곳을 넘었다고 발표했다.", "claimIds": ["wh-june-status"]},
    {"id": "wh-t-july-status", "date": "2026-08-12", "datePrecision": "day", "title": "7월 말 293곳 참여와 확산 방안 논의", "summary": "이행점검단 회의에서 참여 집계와 기업 사례를 공유하고 지속 가능한 단축 방안을 논의했다.", "claimIds": ["wh-july-status", "wh-sustainability"]},
  ],
  counterpoints: [
    {"id": "wh-cp-cost", "question": "노동시간을 줄이면 생산성과 서비스가 떨어지고 기업 비용이 늘지 않나?", "response": "전주상공회의소 조사에서는 생산 일정 지연과 서비스 공백 등을 걱정하는 응답이 나왔고, 회장도 비용 증가 우려를 밝혔다. 정부는 기업 지원과 생산성 향상 지원을 발표했으며, 이행점검단 공동단장도 업무 과정 개선과 생산성 향상이 병행돼야 지속할 수 있다고 말했다. 이러한 지원이 모든 업종의 비용과 공백을 해소했는지는 확인되지 않았다.", "claimIds": ["wh-business-concern", "wh-package", "wh-sustainability"]},
    {"id": "wh-cp-gap", "question": "여유 있는 기업만 도입하고 영세기업과의 격차가 더 커지는 것 아닌가?", "response": "한국경제는 인력난을 겪는 영세기업과 자동화가 어려운 서비스업체의 도입이 어렵다는 비판을 보도했다. 노동부의 6월 말 참여 집계에서는 50인 미만 기업이 67.9%였지만, 이는 참여 기업 안의 구성비다. 이 수치만으로 영세기업 전반의 접근성이나 기업 간 격차 문제가 해결됐다고 판단할 수 없다.", "claimIds": ["wh-access-concern", "wh-june-status"]},
    {"id": "wh-cp-results", "question": "참여 기업이 늘었다는 것만으로 주 4.5일제가 정착했다고 볼 수 있나?", "response": "7월 말 집계는 293곳이며 주 4.5일제 도입 등을 통한 실노동시간 단축 기업을 센 것이다. 6월 발표에는 주 38시간제와 주 35시간제 등 다양한 방식도 포함됐다. 참여 확대는 확인되지만, 전국 노동시간 감소 효과와 지원 종료 후 유지 여부는 이번 자료로 확인되지 않는다.", "claimIds": ["wh-june-status", "wh-july-status", "wh-sustainability"]},
  ],
  claims: [
    { id: "wh-dialogue", text: "노사정이 참여하는 실노동시간 단축 로드맵 추진단은 2025년 9월 24일 출범했다. 고용노동부는 2025년 12월 30일 대국민 보고회에서 노사정 공동선언과 로드맵 추진과제를 발표했다.", assertionType: "FACT", sourceIds: ["src-roadmap", "src-check"], verified: true },
    { id: "wh-target", text: "노사정은 2030년까지 실노동시간을 OECD 평균 수준인 연 1,700시간대로 단축하기 위해 노력하기로 했다. 포괄임금 오남용 방지, 근무시간 외 불필요한 업무지시로부터의 휴식 보장, 실근로시간단축지원법 제정, 야간노동자 건강보호와 연차휴가 활성화 등을 추진과제로 제시했다.", assertionType: "CLAIM", assertedBy: "실노동시간 단축 로드맵 추진단의 노사정", sourceIds: ["src-roadmap"], verified: true },
    { id: "wh-check", text: "고용노동부는 2026년 1월 14일 기존 추진단을 이행점검단으로 재편해 출범시켰다. 이날은 로드맵 추진과제를 처음 발표한 날이 아니라 후속 이행점검 조직이 출범한 날이다.", assertionType: "FACT", sourceIds: ["src-check"], verified: true },
    { id: "wh-package", text: "고용노동부는 2026년 로드맵 후속 범정부 지원사업을 총 9,363억 원 규모로 발표했다. 일·생활 균형 지원 4,624억 원, 생산성 향상 지원 4,630억 원, 소상공인·지역경제 활성화 지원 109억 원으로 구성돼 주 4.5일제 기업 장려금 외의 사업도 포함한다.", assertionType: "CLAIM", assertedBy: "고용노동부", sourceIds: ["src-check"], verified: true },
    { id: "wh-budget", text: "고용노동부가 2025년 12월 5일 공개한 2026년 예산 안내에는 워라밸+4.5 프로젝트 예산이 276억 원으로 명시돼 있다.", assertionType: "FACT", sourceIds: ["src-budget"], verified: true },
    { id: "wh-support", text: "고용노동부는 2026년 신설한 워라밸+4.5 프로젝트를 통해 노사 합의로 임금 감소 없이 실노동시간을 단축하는 기업에 해당 노동자 1인당 연간 최대 720만 원을 지원한다고 발표했다. 생명·안전 관련 업종, 교대제 개편 추진 기업, 비수도권 사업장에는 월 10만 원을 우대 지원하고, 신규 채용을 확대하면 1인당 연간 최대 960만 원을 추가 지원한다고 밝혔다.", assertionType: "CLAIM", assertedBy: "고용노동부", sourceIds: ["src-support"], verified: true },
    { id: "wh-june-status", text: "고용노동부의 2026년 7월 14일 발표에 따르면 워라밸+4.5 프로젝트 참여 기업은 6월 말 224곳으로 연간 목표 220곳을 넘었고, 참여 기업 중 50인 미만 기업은 67.9%였다. 참여 방식에는 금요일 오후 휴무나 격주 휴무 외에 주 38시간제와 주 35시간제 등도 포함됐다.", assertionType: "FACT", sourceIds: ["src-june-status"], verified: true },
    { id: "wh-july-status", text: "고용노동부는 2026년 8월 12일 이행점검단 제8차 회의 자료에서 7월 말 현재 293개 기업이 워라밸+4.5 프로젝트를 통해 주 4.5일제 도입 등 실노동시간을 단축했다고 밝혔다.", assertionType: "FACT", sourceIds: ["src-july-status"], verified: true },
    { id: "wh-sustainability", text: "배규식 이행점검단 공동단장은 노동시간 단축이 지속되려면 불필요한 일을 줄이고 업무 과정을 개선하며 생산성을 높이는 변화가 병행돼야 한다고 밝혔다. 고용노동부는 성과평가 연구용역을 진행 중이라고 설명했다.", assertionType: "CLAIM", assertedBy: "배규식 실노동시간 단축 로드맵 이행점검단 공동단장 및 고용노동부", sourceIds: ["src-july-status"], verified: true },
    { id: "wh-business-concern", text: "전주상공회의소의 회원기업 조사에서 제조업체는 생산 일정 지연과 작업 효율 저하를, 비제조업체는 서비스 공백과 운영 부담 증가를 부정적 이유로 꼽았다. 김정태 전주상공회의소 회장은 비용 증가 우려를 전하면서 충분한 준비 기간과 사회적 합의, 보완 대책이 필요하다고 말했다.", assertionType: "CLAIM", assertedBy: "전주상공회의소 조사 응답 기업 및 김정태 회장", sourceIds: ["src-business-concern"], verified: true },
    { id: "wh-access-concern", text: "한국경제는 주 6일 근무와 인력난을 겪는 영세 중소기업에는 지원이 닿기 어렵고 기업 간 양극화를 심화할 수 있다는 우려를 보도했다. 기사에 등장한 공인노무사는 영세 사업장과 자동화가 어려운 서비스업체가 채택하기 어렵다고 지적했다.", assertionType: "CLAIM", assertedBy: "한국경제가 보도한 산업계 및 익명의 공인노무사", sourceIds: ["src-access-concern"], verified: true },
  ],
  sources: [
    { id: "src-roadmap", title: "국민주권정부, 실노동시간 단축 노사정 첫 공동 선언", url: "https://www.moel.go.kr/news/enews/report/enewsView.do?news_seq=18805", publisher: "고용노동부", publishedAt: "2025-12-30", type: "official", license: "public", quote: "이에 따라 노사정은 2030년까지 실노동시간을 경제협력개발기구(OECD) 평균 수준(1,700시간대)으로 단축하기 위해 노력하고, 효율적으로 일하는 문화로 전환하기로 했다." },
    { id: "src-budget", title: "2026년 고용노동부 예산", url: "https://www.korea.kr/news/policyFocusView.do?newsId=148955957&pkgId=49500823", publisher: "고용노동부·대한민국 정책브리핑", publishedAt: "2025-12-05", type: "official", license: "public", quote: "워라밸+4.5 프로젝트 276억 원, 육아기 10시 출근제 31억 원 등" },
    { id: "src-check", title: "노사정, 국민주권정부 첫 공동선언 착실히 이행하기로 뜻 모아", url: "https://moel.go.kr/news/enews/report/enewsView.do?news_seq=18852", publisher: "고용노동부", publishedAt: "2026-01-14", type: "official", license: "public", quote: "고용노동부(장관 김영훈)는 1.14.(수) 지난해 활동을 마무리한 「실노동시간 단축 로드맵 추진단(이하, ‘추진단’)」을 「실노동시간 단축 로드맵 이행점검단(이하, ‘점검단’)」으로 재편해 새롭게 출범했다고 밝혔다." },
    { id: "src-support", title: "'실노동시간 단축' 이행 착수…주4.5일제 도입 등에 9363억 지원", url: "https://m.korea.kr/news/policyNewsView.do?newsId=148957963&pWise=mSub&pWiseSub=C2", publisher: "고용노동부·대한민국 정책브리핑", publishedAt: "2026-01-14", type: "official", license: "public", quote: "대표적으로 올해 신설한 '워라밸+4.5 프로젝트'를 통해 노사 합의로 임금 감소 없이 주4.5일제 도입 등 실노동시간을 단축하는 기업을 대상으로, 해당 노동자 1인당 연간 최대 720만 원을 지원한다." },
    { id: "src-june-status", title: "노사가 함께 만든 자율적 노동시간 단축 모델, 기업의 성장과 일자리 창출로 이어집니다", url: "https://www.moel.go.kr/news/enews/report/enewsView.do?news_seq=19658", publisher: "고용노동부", publishedAt: "2026-07-14", type: "official", license: "public", quote: "「워라밸+4.5 프로젝트」는 노사 합의로 임금 감소 없이 주 4.5일제 등 실노동시간을 단축하여 운영하는 기업을 지원하는 사업으로, 6월 말 기준 총 224개 기업이 참여해 목표치(220개소)를 조기 달성(101.8%)했다." },
    { id: "src-july-status", title: "실노동시간 단축, 이제는 ‘지속·확산’ 현장의 경험을 통해 안착 방안 모색", url: "https://moel.go.kr/news/enews/report/enewsView.do?news_seq=19777", publisher: "고용노동부", publishedAt: "2026-08-12", type: "official", license: "public", quote: "’26.7월말 현재, 293개 기업(올해 목표 220개소, 7.22. 기준 목표 달성률 133.2%)" },
    { id: "src-business-concern", title: "전북 기업 62%, 주 4.5일제 '부정적'…\"생산성 저하 우려\"", url: "https://www.yna.co.kr/view/AKR20251202107900055", publisher: "연합뉴스", publishedAt: "2025-12-02", type: "press", license: "quotable", quote: "부정적인 이유로는 제조업체는 생산 일정 지연과 작업 효율 저하를, 비제조업체는 서비스 공백과 운영 부담 증가를 꼽았다." },
    { id: "src-access-concern", title: "주4.5일제 도입 땐 1인당 720만원 지원…中企 \"우리에겐 그림의 떡\"", url: "https://www.hankyung.com/article/2026011409321", publisher: "한국경제", publishedAt: "2026-01-14", type: "press", license: "quotable", quote: "영세 사업장과 자동화가 어려운 서비스업체 등은 채택하기 어려운 제도" },
  ],
};

export const workingHours = achievementSchema.parse(raw);
