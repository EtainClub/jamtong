import { achievementSchema, type AchievementInput } from "@/content/schema";

/**
 * 통합돌봄 전국 시행 — 의료·요양·돌봄을 사는 곳에서 한 번에 연계.
 *
 * ★ 2026-11-28 작성. 초안은 Codex(GPT)가 실시간 검색으로 1차 자료(법령·정책브리핑·부처 보도자료)와 보도를 모아 썼고,
 *   에이전트가 출처 페이지를 직접 받아 인용문이 그대로 있는지, claim의 숫자가 그 출처에 있는지 대조한 뒤 내용을 읽어 고쳤다
 *   (docs/gov-achievements-p1-review.md).
 * ★ 계획·추진과 시행·완료를 구분했다. 부처의 계획·평가와 비판은 CLAIM(주장한 쪽)으로 적었다.
 */
const raw: AchievementInput = {
  id: "integrated-care",
  slug: "integrated-care",
  title: "통합돌봄 전국 시행",
  subtitle: "의료·요양·돌봄을 사는 곳에서 한 번에 연계",
  lifeQuestion: "집에서 의료·요양·돌봄이 함께 필요할 때, 통합돌봄으로 무엇이 달라졌나?",
  kicker: "주요 정책",
  categories: ["welfare", "region", "institution"],
  summary: "2024년에 제정된 돌봄통합지원법이 2026년 3월 27일 시행되면서 이재명 정부 시기에 전국 229개 시군구에서 통합돌봄 본사업이 시작됐다. 복합적인 지원이 필요한 65세 이상 노인과 의료 필요도가 높은 중증 장애인을 대상으로 조사와 개인별 계획을 거쳐 의료·요양·돌봄 서비스를 연계한다. 보건복지부가 발표한 8월 31일 기준 신청자는 93,136명, 서비스 연계자는 78,677명이다. 지역별 공급기반 차이가 확인됐으며, 전문가와 노동·시민사회에서는 인력 구축 지연과 재정 부족을 지적했다.",
  type: "policy",
  publishStatus: "published",
  sourceNote: "2026년 11월 28일을 기준으로 직접 열람한 법령, 보건복지부 발표 및 이를 수록한 정책브리핑·KDI 자료, 경향신문·연합뉴스 보도에 근거한다. 법 제정과 초기 시범사업은 현 정부 출범 이전의 경과로 구분한다. 전국 이용 수치는 확인한 10월 13일 발표의 8월 31일 누계이며 11월 말 현재 이용자 수를 뜻하지 않는다. 서비스 연계 인원은 모든 서비스의 지속 이용이나 필요 충족을 입증하는 수치가 아니다. 예산 확보액은 집행액이 아니며 기존 건강보험·장기요양 등 연계 서비스 전체 재정과도 구분한다. 본사업 이후 입원·시설입소 감소의 인과효과, 가족 부담 변화, 지자체별 최종 집행액과 적정 인력 충족 여부는 이 자료들만으로 확인되지 않는다.",
  headlineKeyNumberId: "ic-kn-local",
  keyNumbers: [
    {"id": "ic-kn-local", "label": "본사업 시행 지역", "value": "229", "unit": "개 시군구", "caption": "2026년 3월 27일 전국 시행", "claimId": "ic-launch"},
    {"id": "ic-kn-budget", "label": "사업 시행을 위한 확보 예산", "value": "914", "unit": "억 원", "caption": "2026년 발표액·집행액 아님", "claimId": "ic-budget"},
    {"id": "ic-kn-applicants", "label": "통합돌봄 신청자", "value": "93,136", "unit": "명", "caption": "시행 이후 2026년 8월 31일까지", "claimId": "ic-use"},
    {"id": "ic-kn-linked", "label": "서비스 연계자", "value": "78,677", "unit": "명", "caption": "2026년 8월 31일 기준", "claimId": "ic-use"},
  ],
  timeline: [
    {"id": "ic-t-law", "date": "2024-03-26", "datePrecision": "day", "title": "돌봄통합지원법 제정", "summary": "현 정부 출범 이전에 법률이 제정됐으며 시행일은 2026년 3월 27일로 정해졌다.", "claimIds": ["ic-law"]},
    {"id": "ic-t-pilot", "date": "2025-09-02", "datePrecision": "day", "title": "전국 시범사업 참여를 위한 추가 선정", "summary": "복지부는 98개 시군구를 추가 선정했다. 기존 131개와 합쳐 전국 229개 시군구가 참여할 예정이라고 발표한 단계다.", "claimIds": ["ic-pilot"]},
    {"id": "ic-t-launch", "date": "2026-03-27", "datePrecision": "day", "title": "전국 통합돌봄 본사업 시행", "summary": "전국 229개 시군구에서 의료·요양·돌봄을 지역에서 연계하는 본사업이 시작됐다.", "claimIds": ["ic-law", "ic-launch", "ic-access"]},
    {"id": "ic-t-survey", "date": "2026-10-13", "datePrecision": "day", "title": "첫 실태조사 결과 발표", "summary": "8월 말까지 신청·연계 현황과 서비스 공급기반의 지역별 차이가 공개됐다.", "claimIds": ["ic-use", "ic-gap", "ic-indicator"]},
    {"id": "ic-t-staff", "date": "2026-11-04", "datePrecision": "day", "title": "전담인력 배치 점검 논의", "summary": "복지부는 지자체 신규채용·배치가 진행 중이라고 밝히고 행안부와 11~12월 합동 현장점검을 실시할 계획이라고 안내했다.", "claimIds": ["ic-staff"]},
    {"id": "ic-t-hearing", "date": "2026-11-19", "datePrecision": "day", "title": "기본계획 연구 공청회에서 운영 한계 지적", "summary": "보사연 연구책임자는 낮은 인지도와 인력·조직 구축 지연, 공급 부족과 지역 격차를 한계로 지적했다.", "claimIds": ["ic-staff-criticism"]},
  ],
  counterpoints: [
    {"id": "ic-cp-finance", "question": "예산이 부족해 무늬만 통합돌봄에 그치는 것 아닌가?", "response": "사업 시행을 위한 확보 예산은 914억 원이며, 경향신문은 서비스 확충 몫을 620억 원 수준으로 보도했다. 남우근 한국비정규노동센터 소장은 이 규모가 본사업에 충분한지 의문을 제기했다. 복지부는 기존 여러 제도의 서비스를 묶는 구조라고 설명하지만, 이것만으로 추가 서비스 확충 재원이 충분하다고 확인되지는 않는다.", "claimIds": ["ic-budget", "ic-finance-criticism", "ic-finance-response"]},
    {"id": "ic-cp-staff", "question": "전담인력을 확보했다는데 현장에서는 왜 인력이 부족하다고 하나?", "response": "기준인건비에 인력을 반영하는 것과 실제 채용·배치는 구분해야 한다. 11월 4일에도 복지부는 지자체 신규채용과 배치가 진행 중이라고 밝혔고, 기본계획 연구책임자는 인력·조직 구축 지연이 대상자 발굴·확대를 제한했다고 지적했다. 배정·지원 규모만으로 각 지역의 적정 인력이 충족됐다고 판단할 수 없다.", "claimIds": ["ic-staff", "ic-staff-criticism"]},
    {"id": "ic-cp-region", "question": "전국 시행이어도 사는 지역에 따라 받을 수 있는 서비스가 다르지 않나?", "response": "실태조사에서 방문진료 충족률은 일반지역 25.5%, 인구감소지역 10.7%로 차이가 확인됐다. 다만 노인맞춤돌봄 등 일부 서비스는 인구감소지역의 충족률이 더 높아 모든 서비스의 격차 방향이 같은 것은 아니다. 복지부는 충족률을 향후 공급 확충의 잠재적 목표를 진단하는 지표로 설명하므로, 이 수치를 신청자의 실제 서비스 수령률로 해석해서는 안 된다.", "claimIds": ["ic-gap", "ic-indicator"]},
  ],
  claims: [
    { id: "ic-law", text: "「의료·요양 등 지역 돌봄의 통합지원에 관한 법률」은 2024년 3월 26일 법률 제20415호로 제정됐고 2026년 3월 27일부터 시행됐다. 법 제정은 이재명 정부 출범 이전의 일이다.", assertionType: "FACT", sourceIds: ["src-ic-law"], verified: true },
    { id: "ic-pilot", text: "보건복지부는 2025년 9월 2일 통합지원 시범사업 공모에서 98개 시군구를 추가 선정했다고 발표했다. 기존 131개를 포함해 전국 229개 시군구가 참여할 예정이라고 안내했으며, 당시 발표는 본사업 시행 완료를 뜻하지 않는다.", assertionType: "CLAIM", assertedBy: "보건복지부", sourceIds: ["src-ic-pilot"], verified: true },
    { id: "ic-launch", text: "2026년 3월 27일부터 전국 229개 시군구에서 지역사회 통합돌봄 본사업이 시행됐다. 거주지에서 의료·요양·돌봄 서비스를 통합적으로 설계하고 연계하는 제도다.", assertionType: "FACT", sourceIds: ["src-ic-launch", "src-ic-survey"], verified: true },
    { id: "ic-access", text: "본사업 대상은 노쇠·장애·질병 등으로 일상생활이 어려워 복합적 지원이 필요한 65세 이상 노인과 의료 필요도가 높은 중증 장애인(지체·뇌병변 등)이다. 주소지 읍면동 행정복지센터나 국민건강보험공단 지사에 신청하면 조사와 통합지원회의를 거쳐 개인별 서비스 계획을 수립하고 연계한다.", assertionType: "FACT", sourceIds: ["src-ic-launch"], verified: true },
    { id: "ic-budget", text: "보건복지부는 2026년 본사업 시행을 위해 914억 원 규모의 예산을 추가 확보했다고 밝혔다. 경향신문은 이 가운데 실제 돌봄 서비스 확충에 쓸 수 있는 예산을 620억 원 수준으로 보도했다.", assertionType: "FACT", sourceIds: ["src-ic-launch", "src-ic-finance"], verified: true },
    { id: "ic-use", text: "보건복지부의 10월 13일 발표에 따르면 시행 이후 2026년 8월 31일까지 통합돌봄 신청자는 93,136명이고, 서비스를 연계받은 사람은 78,677명이다. 신청자 중 노인은 91,952명, 65세 미만 장애인은 1,184명이며, 연계자 1인당 평균 3.5건의 서비스가 연계됐다.", assertionType: "FACT", sourceIds: ["src-ic-survey"], verified: true },
    { id: "ic-gap", text: "첫 실태조사에서 방문진료 충족률은 일반지역 25.5%, 인구감소지역 10.7%였고, 재택의료센터는 각각 20.6%, 8.3%였다. 반면 지역사회중심재활·치매예방 및 관리·방문목욕·노인맞춤돌봄은 인구감소지역의 충족률이 더 높았다.", assertionType: "FACT", sourceIds: ["src-ic-survey"], verified: true },
    { id: "ic-indicator", text: "보건복지부는 실태조사의 서비스 충족률이 사업 초기 향후 확대해야 할 공급의 잠재적 목표치를 진단한 지표이며, 현재 서비스 미흡을 뜻하기보다 재원을 집중할 우선순위를 뜻한다고 설명했다.", assertionType: "CLAIM", assertedBy: "보건복지부", sourceIds: ["src-ic-survey"], verified: true },
    { id: "ic-staff", text: "복지부의 11월 4일 발표에 따르면 중앙정부는 2026년 기준인건비에 통합돌봄 전담인력 5,346명을 반영하고 신규인력 확충 예산 192억 원(2,400명)을 지원했으며, 지자체에서는 신규채용·배치가 진행 중이다. 복지부는 행안부와 11~12월 합동 현장점검을 실시할 계획이라고 안내했다.", assertionType: "CLAIM", assertedBy: "보건복지부", sourceIds: ["src-ic-staff"], verified: true },
    { id: "ic-staff-criticism", text: "이윤경 한국보건사회연구원 선임연구위원은 11월 19일 기본계획 연구 공청회에서 국민 인지도가 낮고 지자체 인력·조직 구축이 늦어져 대상자 발굴과 확대에 한계가 있었다고 지적했다. 서비스 공급 부족과 지역 간 격차도 한계로 제시했다.", assertionType: "CLAIM", assertedBy: "이윤경 한국보건사회연구원 선임연구위원", sourceIds: ["src-ic-hearing"], verified: true },
    { id: "ic-finance-criticism", text: "남우근 한국비정규노동센터 소장은 서비스 확충 예산 620억 원을 두고 본사업인지 시범사업 연장인지 구분하기 어려울 만큼 부족하다고 비판했다. 김창보 건강돌봄시민행동 운영위원은 중앙정부의 예측 가능하고 안정적인 기금 투입으로 지역 간 인프라 격차부터 해소해야 한다고 주장했다.", assertionType: "CLAIM", assertedBy: "남우근 한국비정규노동센터 소장·김창보 건강돌봄시민행동 운영위원", sourceIds: ["src-ic-finance"], verified: true },
    { id: "ic-finance-response", text: "장영진 보건복지부 통합돌봄정책과장은 돌봄통합지원법이 기존 의료·요양·돌봄 서비스를 묶어 전달하는 플랫폼에 관한 법이므로 일반회계·특별회계·건강보험 등 다양한 예산이 연결되는 구조라고 설명했다.", assertionType: "CLAIM", assertedBy: "장영진 보건복지부 통합돌봄정책과장", sourceIds: ["src-ic-finance"], verified: true },
  ],
  sources: [
    { id: "src-ic-law", title: "의료ㆍ요양 등 지역 돌봄의 통합지원에 관한 법률", url: "https://www.law.go.kr/lsInfoP.do?+efYd=20260327&lsiSeq=261447", publisher: "국가법령정보센터", publishedAt: "2024-03-26", type: "legislative", license: "public", quote: "[시행 2026. 3. 27.] [법률 제20415호, 2024. 3. 26., 제정]" },
    { id: "src-ic-pilot", title: "전국 229개 지자체 시범사업 참여 내년 통합돌봄 성공적 실행 준비 박차", url: "https://eiec.kdi.re.kr/policy/materialView.do?depth1=&depth2=&device=&num=270556&pg=1&pp=20&search_txt=&topic=&type=", publisher: "보건복지부·KDI 경제교육·정보센터", publishedAt: "2025-09-02", type: "official", license: "public", quote: "보건복지부는「2025년 제3차 의료·요양·돌봄 통합지원 시범사업 공모」를 통해, 98개 시·군·구를 추가 선정했다고 9.2.(화) 밝혔다." },
    { id: "src-ic-launch", title: "27일부터 '통합돌봄' 전국 시행…집에서 받는 의료·돌봄 본격화", url: "https://m.korea.kr/news/policyNewsView.do?newsId=148961536", publisher: "보건복지부·대한민국 정책브리핑", publishedAt: "2026-03-26", type: "official", license: "public", quote: "통합돌봄 대상은 노쇠·장애·질병 등으로 일상생활이 어려워 의료·요양·돌봄 등의 복합적 지원이 필요한 65세 이상 노인과 의료 필요도가 높은 중증 장애인(지체·뇌병변 등)이다." },
    { id: "src-ic-survey", title: "어디가 부족한 지 정밀하게 찾았다데이터 기반 지역맞춤형 통합돌봄 본격 가동", url: "https://m.korea.kr/briefing/pressReleaseView.do?newsId=156784964&pWise=mMain&pWiseMain=L1", publisher: "보건복지부·대한민국 정책브리핑", publishedAt: "2026-10-13", type: "official", license: "public", quote: "제도 시행 이후 8월 31일까지 통합돌봄 신청자는 총 93,136명으로 하루 평균 약 870명이 신청하였다. 이 중 노인 91,952명(98.7%), 65세 미만 장애인 1,184명(1.3%)이다. 통합돌봄을 통해 서비스를 연계받은 사람은 78,677명으로, 1인당 평균 3.5건의 서비스가 연계되었다." },
    { id: "src-ic-staff", title: "첫 통합돌봄 지역계획 수립 위한 중앙-지방 협력방안 논의", url: "https://m.korea.kr/briefing/pressReleaseView.do?newsId=156787928&pWise=mSub&pWiseSub=C1", publisher: "보건복지부·대한민국 정책브리핑", publishedAt: "2026-11-04", type: "official", license: "public", quote: "중앙정부가 2026년 기준인건비에 통합돌봄 전담인력 총 5,346명을 반영하고 신규인력 확충 예산 192억 원(2,400명)을 지원함에 따라, 현재 각 지방정부에서는 전담인력 확보를 위한 신규채용 및 배치가 진행 중이다." },
    { id: "src-ic-hearing", title: "방문요양 97%·단기보호 2%…통합돌봄 서비스 충족률 '격차'", url: "https://www.yna.co.kr/view/AKR20261119118800530", publisher: "연합뉴스", publishedAt: "2026-11-19", type: "press", license: "quotable", quote: "지역사회 통합돌봄은 국민 인지도가 낮은 데다 지방자치단체의 인력·조직 구축이 늦어져 돌봄 대상자 발굴과 확대에 한계가 있었다" },
    { id: "src-ic-finance", title: "지자체당 예산 3억?…무늬만 ‘통합돌봄’", url: "https://www.khan.co.kr/article/202603182041005", publisher: "경향신문", publishedAt: "2026-03-18", type: "press", license: "quotable", quote: "일정 기간 중앙정부 차원의 예측 가능하고 안정적인 기금을 투입해 지역 간 인프라 격차부터 해소해야 한다" },
  ],
};

export const integratedCare = achievementSchema.parse(raw);
