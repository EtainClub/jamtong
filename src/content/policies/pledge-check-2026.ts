import type { PolicyInput } from "./schema";

/**
 * 21대 대선 공약 이행 점검 (2026년 10월).
 *
 * `/pledges`의 공약 항목에 "시행"·"추진 중"을 달려면 근거 claim이 있어야 한다.
 * 기존 업적·정책 페이지에 없던 사실을 여기 모았다. 공약 하나하나를 따로
 * 정책 페이지로 만들기에는 사실이 한두 문장씩이라, 점검 기준일을 밝힌 한 장으로 둔다.
 *
 * ★ 법은 통과·공포·시행을 구분해 적는다. 통과만 확인한 것은 통과라고만 쓴다.
 * ★ 정부의 계획·목표는 "밝혔다"로 적는다. 이뤄진 것처럼 쓰지 않는다.
 *
 * ★ 2026-10-12 처음 등록, 같은 날 각 출처 원문과 대조했다.
 */
export const PLEDGE_CHECK_2026: PolicyInput = {
  slug: "pledge-check-2026",
  title: "21대 대선 공약 이행 점검 (2026년 10월)",
  scope:
    "21대 대선 10대 공약 가운데 법 개정·제도 시행·정부 발표로 진행을 확인할 수 있는 항목의 사실관계",
  ministries: [],
  categories: ["institution", "economy", "welfare"],
  asOf: "2026-10-12",
  claims: [
    // ── 공약 1 경제·산업 ──
    {
      id: "claim-growth-fund",
      text:
        "금융위원회는 2025년 12월 국민성장펀드 출범을 알렸다. 5년간 150조 원 이상 규모로 운용할 " +
        "예정이고, 직접투자 15조 원·간접투자 35조 원·인프라투융자 50조 원·초저리대출 50조 원으로 나뉜다. " +
        "재원은 기금과 민간 자금이 함께 낸다.",
      assertionType: "FACT",
      sourceIds: ["src-korea-growth-fund"],
      verified: true,
    },
    {
      id: "claim-gpu",
      text:
        "2025년 10월 31일 경주 APEC 계기 이재명 대통령과 젠슨 황 엔비디아 CEO의 만남 뒤, 엔비디아가 " +
        "2030년까지 GPU 26만 장 이상을 한국에 공급하기로 했다고 보도됐다. 이 가운데 5만 장은 정부가 " +
        "구입하고 나머지 20만 장은 민간 기업이 쓴다.",
      assertionType: "FACT",
      sourceIds: ["src-etnews-gpu"],
      verified: true,
    },
    // ── 공약 2 정치·사법 ──
    {
      id: "claim-martial-law",
      text:
        "계엄법 개정안이 2025년 7월 3일 국회를 통과해 7월 시행됐다. 계엄 선포 이후 국회의원과 국회 " +
        "소속 공무원의 국회 출입·회의를 방해하면 5년 이하의 징역이나 금고에 처하고, 계엄을 선포·변경할 " +
        "때 국무회의 회의록을 즉시 작성해 국회에 내야 한다.",
      assertionType: "FACT",
      sourceIds: ["src-korea-martial-law", "src-herald-martial-law"],
      verified: true,
    },
    {
      id: "claim-broadcasting-act",
      text:
        "공영방송 지배구조를 바꾼 개정 방송법이 2025년 8월 26일 시행됐다. KBS 이사는 11명에서 15명으로 " +
        "늘고 추천 주체가 국회 교섭단체·시청자위원회·임직원·학회·변호사 단체로 나뉜다. 사장은 " +
        "사장후보국민추천위원회가 추천한 후보 가운데 이사회가 재적 5분의 3 이상 찬성으로 제청한다. " +
        "지상파·종편·보도채널은 사업자 추천 5명과 종사자 대표 추천 5명으로 편성위원회를 둔다.",
      assertionType: "FACT",
      sourceIds: ["src-newstomato-broadcasting"],
      verified: true,
    },
    {
      id: "claim-kmcc",
      text:
        "방송미디어통신위원회 설치법이 2025년 9월 27일 국회를 통과해 10월 1일 공포·시행되면서 " +
        "방송통신위원회가 17년 만에 폐지되고 방송미디어통신위원회가 출범했다. 위원은 위원장·부위원장을 " +
        "포함해 7명이다.",
      assertionType: "FACT",
      sourceIds: ["src-kyungje-kmcc"],
      verified: true,
    },
    {
      id: "claim-truth-commission",
      text:
        "개정 과거사정리기본법이 시행된 2026년 2월 26일 3기 진실·화해를위한과거사정리위원회가 출범했다. " +
        "인권침해 사건의 조사 시기가 국가인권위원회 설립 이전인 2001년 11월까지로 넓어졌고, 국가 감독 아래 " +
        "운영된 사회복지기관·입양기관·집단수용시설도 조사 대상에 들어갔다.",
      assertionType: "FACT",
      sourceIds: ["src-newsis-truth"],
      verified: true,
    },
    // ── 공약 3 가계·소상공인 ──
    {
      id: "claim-fresh-start",
      text:
        "금융위원회는 2025년 9월 22일부터 코로나 피해 소상공인 채무조정 프로그램인 새출발기금의 지원을 " +
        "넓혔다. 대상 사업 기간을 2025년 6월까지로 늘리고, 저소득 부실차주의 무담보 채무 원금 감면율을 " +
        "최대 80%에서 90%로 높였다. 2차 추경 7,000억 원을 새출발기금에 출자했다.",
      assertionType: "FACT",
      sourceIds: ["src-korea-fresh-start"],
      verified: true,
    },
    {
      id: "claim-sick-pay",
      text:
        "보건복지부는 시범사업으로 운영해 온 상병수당을 2027년 하반기부터 전국 단위 본사업으로 바꾸고 " +
        "지급 대상을 전 국민으로 넓히는 방안을 추진한다고 2026년 7월 밝혔다. 시범사업은 2026년 5월 말까지 " +
        "1만 4,141명에게 203억 6,700만 원을 지급했다.",
      assertionType: "CLAIM",
      assertedBy: "보건복지부",
      sourceIds: ["src-asiae-sick-pay"],
      verified: true,
    },
    // ── 공약 4 외교·통상 ──
    {
      id: "claim-apec",
      text:
        "2025년 APEC 정상회의가 경주에서 열렸고, 11월 1일 폐막일에 정상들이 '경주선언'을 만장일치로 채택했다.",
      assertionType: "FACT",
      sourceIds: ["src-korea-apec"],
      verified: true,
    },
    // ── 공약 5 안전·의료 ──
    {
      id: "claim-regional-doctor",
      text:
        "「지역의사의 양성 및 지원 등에 관한 법률」이 2025년 12월 2일 국회를 통과해 12월 23일 공포됐다. " +
        "의대 신입생 일부를 지역의사선발전형으로 뽑아 졸업 후 10년간 특정 지역에서 의무복무하게 하는 " +
        "복무형과, 전문의가 5~10년 지역 근무를 계약하는 계약형을 둔다. 공포 후 2개월이 지나 시행된다.",
      assertionType: "FACT",
      sourceIds: ["src-korea-regional-doctor", "src-doctors-promulgation"],
      verified: true,
    },
    {
      id: "claim-telemedicine",
      text:
        "비대면진료를 제도화한 의료법 개정법이 2025년 12월 23일 공포됐다. 공포 후 1년이 지난 날부터 시행된다.",
      assertionType: "FACT",
      sourceIds: ["src-doctors-promulgation"],
      verified: true,
    },
    // ── 공약 6 균형발전 ──
    {
      id: "claim-sejong-office",
      text:
        "대통령 세종집무실은 2027년 8월 착공, 2029년 8월 입주를 목표로 설계와 부지 조성 절차가 추진 중이다. " +
        "국회 세종의사당은 국회사무처가 2026년 1월 마스터플랜 공모를 실시해 5월 당선작을 선정했다.",
      assertionType: "FACT",
      sourceIds: ["src-hankyung-sejong"],
      verified: true,
    },
    {
      id: "claim-local-voucher",
      text:
        "지역사랑상품권법 개정안이 2025년 8월 4일 국회를 통과했다. 지역사랑상품권을 발행·운영할 때 국가와 " +
        "지자체가 의무적으로 행정적·재정적 지원을 하도록 했고, 인구감소지역에 보조금을 더 줄 근거도 만들었다. " +
        "발행 자체를 의무로 정한 것은 아니다.",
      assertionType: "FACT",
      sourceIds: ["src-khan-local-voucher"],
      verified: true,
    },
    // ── 공약 7 노동 ──
    {
      id: "claim-yellow-envelope",
      text:
        "노동조합법 2·3조 개정안이 2025년 8월 24일 국회를 통과해 9월 9일 공포됐고, 공포 후 6개월이 지난 " +
        "2026년 3월 10일부터 시행됐다. 사용자성 확대, 노동쟁의 범위 확대, 손해배상 책임비율 제한이 주요 내용이다.",
      assertionType: "FACT",
      sourceIds: ["src-korea-yellow-envelope"],
      verified: true,
    },
    {
      id: "claim-working-hours",
      text:
        "고용노동부는 2026년 1월 14일 실노동시간 단축 로드맵을 발표했다. 2030년까지 실노동시간을 OECD " +
        "평균 수준인 연 1,700시간대로 줄이는 것이 목표다. 주 4.5일제를 도입하는 기업에는 근로자 1인당 " +
        "최대 720만 원을 지원하고, 노동시간 단축 관련 예산으로 9,363억 원이 편성됐다.",
      assertionType: "FACT",
      sourceIds: ["src-tf-working-hours", "src-herald-working-hours"],
      verified: true,
    },
    // ── 공약 8·9 생활안정·돌봄 ──
    {
      id: "claim-grain-act",
      text:
        "양곡관리법·농안법 개정안이 2025년 8월 4일 국회를 통과했다. 쌀이 과잉 생산되면 생산자단체가 참여하는 " +
        "양곡수급관리위원회가 대책을 심의하고 정부가 이를 의무적으로 추진하며, 농산물 평균가격이 기준가격보다 " +
        "낮으면 차액의 전부 또는 일부를 지급하는 제도를 새로 둔다. 농식품부는 두 법이 2026년 8월 시행된다고 밝혔다.",
      assertionType: "FACT",
      sourceIds: ["src-korea-grain-act"],
      verified: true,
    },
    {
      id: "claim-care-cost",
      text:
        "보건복지부는 2026년 7월 28일 토론회에서 의료중심 요양병원 500곳 안팎의 간병비 본인부담률을 " +
        "100%에서 30% 안팎으로 낮추는 방안을 논의하고 있으며, 2027년 상반기 요양병원 간병 급여화 " +
        "시범사업을 시행할 계획이라고 밝혔다.",
      assertionType: "CLAIM",
      assertedBy: "보건복지부",
      sourceIds: ["src-khan-care-cost"],
      verified: true,
    },
    // ── 공약 10 기후 ──
    {
      id: "claim-ndc-2035",
      text:
        "정부는 2025년 11월 11일 국무회의에서 2035년 국가 온실가스 감축목표를 2018년 순배출량 대비 53~61% " +
        "감축으로 확정했다. 같은 날 제4차 계획기간(2026~2030) 배출권 할당계획도 의결해, 발전 부문 유상할당 " +
        "비율을 2030년 50%까지 단계적으로 올리기로 했다.",
      assertionType: "FACT",
      sourceIds: ["src-korea-ndc"],
      verified: true,
    },
    {
      id: "claim-coal-exit",
      text:
        "한국은 2025년 11월 17일 COP30에서 탈석탄동맹(PPCA)에 가입했다. 석탄발전소 61기 가운데 40기를 " +
        "2040년까지 폐쇄하는 계획을 확정했고, 나머지 21기는 평가와 공론화를 거쳐 2026년 중 폐지 일정을 정한다.",
      assertionType: "FACT",
      sourceIds: ["src-impacton-coal"],
      verified: true,
    },
    {
      id: "claim-grid-act",
      text:
        "국가기간 전력망 확충 특별법이 2025년 9월 26일 시행됐고, 10월 1일 첫 국가기간 전력망 확충위원회가 " +
        "송전선로·변전소 사업 99개를 지정했다. 정부는 2030년대 서해안, 2040년대 U자형 에너지고속도로 " +
        "구축을 목표로 밝혔다.",
      assertionType: "FACT",
      sourceIds: ["src-etnews-grid"],
      verified: true,
    },
  ],
  timeline: [
    { id: "t-martial-law", date: "2025-07", datePrecision: "month", title: "개정 계엄법 시행", summary: "계엄 중 국회 출입·회의 방해 금지.", claimIds: ["claim-martial-law"] },
    { id: "t-broadcasting", date: "2025-08-26", datePrecision: "day", title: "개정 방송법 시행", summary: "공영방송 이사회·사장 선임 구조 변경.", claimIds: ["claim-broadcasting-act"] },
    { id: "t-kmcc", date: "2025-10-01", datePrecision: "day", title: "방송미디어통신위원회 출범", summary: "방송통신위원회 폐지.", claimIds: ["claim-kmcc"] },
    { id: "t-apec", date: "2025-11-01", datePrecision: "day", title: "경주 APEC 폐막, 경주선언 채택", summary: "정상들이 만장일치로 채택.", claimIds: ["claim-apec"] },
    { id: "t-ndc", date: "2025-11-11", datePrecision: "day", title: "2035 감축목표 확정", summary: "2018년 대비 53~61%.", claimIds: ["claim-ndc-2035"] },
    { id: "t-ppca", date: "2025-11-17", datePrecision: "day", title: "탈석탄동맹 가입", summary: "석탄발전 40기 2040년까지 폐쇄.", claimIds: ["claim-coal-exit"] },
    { id: "t-doctor-law", date: "2025-12-23", datePrecision: "day", title: "지역의사법·비대면진료법 공포", summary: "지역의사법은 2개월 뒤, 비대면진료는 1년 뒤 시행.", claimIds: ["claim-regional-doctor", "claim-telemedicine"] },
    { id: "t-hours", date: "2026-01-14", datePrecision: "day", title: "실노동시간 단축 로드맵 발표", summary: "2030년 연 1,700시간대 목표.", claimIds: ["claim-working-hours"] },
    { id: "t-truth", date: "2026-02-26", datePrecision: "day", title: "3기 진실화해위 출범", summary: "조사 시기 2001년 11월까지 확대.", claimIds: ["claim-truth-commission"] },
    { id: "t-union", date: "2026-03-10", datePrecision: "day", title: "개정 노동조합법 2·3조 시행", summary: "사용자성·노동쟁의 범위 확대, 손배 책임 제한.", claimIds: ["claim-yellow-envelope"] },
  ],
  gaps: [
    "계엄법 개정의 정확한 공포·시행일을 법제처 공포문으로 대조하지 못했다. 정책브리핑은 '2025년 7월 중 시행'으로만 적었다.",
    "양곡관리법·농안법이 예고대로 2026년 8월 시행됐는지 확인하지 못했다.",
    "엔비디아 GPU 공급 물량은 언론 보도 기준이다. 정부·엔비디아의 공식 발표문으로 대조하지 못했다. 실제 도입된 수량도 확인하지 못했다.",
    "지역의사제로 실제 선발이 시작됐는지, 지역의대·공공의료사관학교 신설이 추진되는지는 확인하지 못했다.",
    "국회 세종의사당의 착공·준공 일정은 확정 발표를 찾지 못했다.",
    "주 4.5일제 지원 예산(9,363억 원)은 예산안 편성 기준 보도이며 집행 실적은 확인하지 못했다.",
    "배달앱 수수료 상한제, 공공기관장 임기 일치, 정년 연장, 2차 공공기관 이전은 2026년 10월 현재 법 통과·확정 발표를 찾지 못해 공약 화면에서 '확인 전'으로 둔다.",
  ],
  sources: [
    { id: "src-korea-growth-fund", title: "150조 원 규모 국민성장펀드 출범", publisher: "대한민국 정책브리핑(금융위원회)", url: "https://www.korea.kr/multi/visualNewsView.do?newsId=148956487", publishedAt: "2025-12-16", type: "official", license: "public" },
    { id: "src-etnews-gpu", title: "[APEC 2025] 韓·엔비디아 AI 동맹...GPU 26만장 확보, 피지컬 AI 가속", publisher: "전자신문", url: "https://www.etnews.com/20251031000349", publishedAt: "2025-10-31", type: "press", license: "link-only" },
    { id: "src-korea-martial-law", title: "계엄 선포해도 '국회 출입 방해' 금지…이달 계엄법 개정안 시행", publisher: "대한민국 정책브리핑(법제처)", url: "https://www.korea.kr/news/policyNewsView.do?newsId=148946023", publishedAt: "2025-07-15", type: "official", license: "public" },
    { id: "src-herald-martial-law", title: "'계엄법 개정안' 국회 본회의 통과…계엄시 군·경 국회 출입 못한다", publisher: "헤럴드경제", url: "https://biz.heraldcorp.com/article/10523960", publishedAt: "2025-07-03", type: "press", license: "link-only" },
    { id: "src-newstomato-broadcasting", title: "방송법 개정 26일부터 시행…공영방송 지배구조 바뀐다", publisher: "뉴스토마토", url: "https://www.newstomato.com/ReadNews.aspx?no=1272636", publishedAt: "2025-08-25", type: "press", license: "link-only" },
    { id: "src-kyungje-kmcc", title: "방송미디어통신위원회 공식 출범…17년 만에 방통위 폐지", publisher: "경제일보", url: "https://www.kyungjeilbo.com/view/20251001171106535", publishedAt: "2025-10-01", type: "press", license: "link-only" },
    { id: "src-newsis-truth", title: "3기 진실화해위원회 출범…인권침해 조사 범위 확대", publisher: "뉴시스", url: "https://www.newsis.com/view/NISX20260225_0003525401", publishedAt: "2026-02-25", type: "press", license: "link-only" },
    { id: "src-korea-fresh-start", title: "새출발기금 22일부터 지원 확대…원금 감면율 최대 90%까지", publisher: "대한민국 정책브리핑(금융위원회)", url: "https://www.korea.kr/news/policyNewsView.do?newsId=148949556", publishedAt: "2025-09-18", type: "official", license: "public" },
    { id: "src-asiae-sick-pay", title: "아프면 쉬고 돈 받는다…'상병수당' 내년 하반기 전국 확대 추진", publisher: "아시아경제", url: "https://view.asiae.co.kr/article/2026071216553435336", publishedAt: "2026-07-12", type: "press", license: "link-only" },
    { id: "src-korea-apec", title: "\"한국, 실용적 중견국 리더십 발휘\"…외신이 본 '경주 APEC'", publisher: "대한민국 정책브리핑", url: "https://www.korea.kr/news/policyNewsView.do?newsId=148953808", publishedAt: "2025-11-03", type: "official", license: "public" },
    { id: "src-korea-regional-doctor", title: "'지역의사제' 법률안 국회 통과…의료 불균형 해소 기대", publisher: "대한민국 정책브리핑(보건복지부)", url: "https://www.korea.kr/news/policyNewsView.do?newsId=148955787", publishedAt: "2025-12-03", type: "official", license: "public" },
    { id: "src-doctors-promulgation", title: "대통령 '지역의사제·비대면진료·김진주법' 공포…시행일 '확정'", publisher: "의협신문", url: "https://www.doctorsnews.co.kr/news/articleView.html?idxno=162695", publishedAt: "2025-12-23", type: "press", license: "link-only" },
    { id: "src-hankyung-sejong", title: "李정부, 행정수도 세종 본궤도…대통령 집무실·국회의사당 속도낸다", publisher: "한국경제", url: "https://www.hankyung.com/article/2026052717877", publishedAt: "2026-05-27", type: "press", license: "link-only" },
    { id: "src-khan-local-voucher", title: "지역사랑상품권 발행 국가지원 의무화···상품권법 개정안 국회 통과", publisher: "경향신문", url: "https://www.khan.co.kr/article/202508041654001", publishedAt: "2025-08-04", type: "press", license: "link-only" },
    { id: "src-korea-yellow-envelope", title: "'개정 노동조합법 2·3조' 국무회의 의결…내년 3월 10일 시행", publisher: "대한민국 정책브리핑(고용노동부)", url: "https://www.korea.kr/news/policyNewsView.do?newsId=148948875", publishedAt: "2025-09-09", type: "official", license: "public" },
    { id: "src-tf-working-hours", title: "'4.5일제' 도입 시 1인당 최대 720만원…노동시간 단축 예산 9363억 편성", publisher: "더팩트", url: "https://m.news.nate.com/view/20260114n30443", publishedAt: "2026-01-14", type: "press", license: "link-only" },
    { id: "src-herald-working-hours", title: "'주 4.5일제' 현실화에 진짜 속도?…\"실노동시간, 2030년 1천739시간 전망\"", publisher: "헤럴드경제", url: "https://biz.heraldcorp.com/article/10731281", publishedAt: "2026-05-05", type: "press", license: "link-only" },
    { id: "src-korea-grain-act", title: "'양곡법·농안법' 개정안 국회 통과…농산물 수급조절 선제적 강화", publisher: "대한민국 정책브리핑(농림축산식품부)", url: "https://www.korea.kr/news/policyNewsView.do?newsId=148947077", publishedAt: "2025-08-04", type: "official", license: "public" },
    { id: "src-khan-care-cost", title: "내년부터 요양병원 간병비 건보 적용…환자 부담 30%로 준다", publisher: "경향신문", url: "https://www.khan.co.kr/article/202607282123005/", publishedAt: "2026-07-28", type: "press", license: "link-only" },
    { id: "src-korea-ndc", title: "정부, '2035년 온실가스 감축 목표' 확정…기존 대비 53~61%↓", publisher: "대한민국 정책브리핑(기후에너지환경부)", url: "https://www.korea.kr/news/policyNewsView.do?newsId=148954548", publishedAt: "2025-11-11", type: "official", license: "public" },
    { id: "src-impacton-coal", title: "한국, '탈석탄동맹' 공식 합류…신규 석탄발전 중단·40기 폐쇄 확정", publisher: "임팩트온", url: "http://www.impacton.net/news/articleView.html?idxno=17093", publishedAt: "2025-11-17", type: "press", license: "link-only" },
    { id: "src-etnews-grid", title: "'에너지고속도로' 본격화…金총리 \"첨단산업·재생e 연계 송전선로 구축\"", publisher: "전자신문", url: "https://www.etnews.com/20251001000544", publishedAt: "2025-10-01", type: "press", license: "link-only" },
  ],
};
