import type { PolicyInput } from "./schema";

/**
 * 전국 농지조사(2026~2027): 추진 경위, 처분 기준, 농촌 영향 논란, 외국인 농지 취득.
 *
 * 대통령의 「"짜장면 좋다는 건 짬뽕 폄훼" 시대가 도래하고 있습니다」(10월 28일) 등에 "장관이
 * 제안했다고 밝힌 건 책임 전가", "농지값이 떨어지고 농협 대출이 막혔다", "시골 자경 농지까지
 * 다 조사해 뭘 하려나", "임야까지 넓히고 투기자는 처벌하라", "중국인 농지 매입을 막아라"는
 * 답글이 많이 달렸다(잼통 Voice). 누가 언제 무엇을 지시했는지, 무엇을 조사하고 무엇은 처분하지
 * 않는지, 거래·대출 영향을 두고 양쪽이 무엇을 말하는지, 외국인 농지 취득이 실제로 얼마인지 적는다.
 *
 * ★ 대통령 글 원문은 words:farmland-survey에 있다.
 * ★ 2026-10-30 처음 등록 — 잼통 Voice 이슈 #106, #109.
 */
export const FARMLAND_SURVEY_2026: PolicyInput = {
  slug: "farmland-survey-2026",
  title: "전국 농지조사(2026~2027): 추진 경위, 처분 기준, 농촌 영향 논란",
  scope:
    "대통령의 2026년 2월 국무회의 지시와 4월 당정 방안, 조사 대상·일정, 투기 외 위반을 처분하지 않는다는 기준, 10월 '장관 제안' 발언 논란, 농지 거래·농협 농지담보대출 변화를 둘러싼 주장과 정부 해명, 외국인 농지 취득 현황",
  ministries: ["농림축산식품부"],
  categories: ["region", "institution"],
  asOf: "2026-10-30",
  rumors: [
    {
      id: "rumor-blame",
      text: "국무회의에서 장관이 제안했다고 밝힌 것은 칭찬이 아니라 책임 전가였다",
      claimIds: ["claim-order", "claim-minister-proposal", "claim-president-post"],
    },
    {
      id: "rumor-price-loan",
      text: "농지조사 발언으로 농지값이 떨어지고 단위농협 대출이 막히는 혼란이 생겼다",
      claimIds: ["claim-trade", "claim-loan", "claim-mafra-rebut"],
    },
    {
      id: "rumor-why",
      text: "전국 시골의 자경 농지까지 모두 조사해서 무엇을 하려는가",
      claimIds: ["claim-plan", "claim-no-disposal"],
    },
    {
      id: "rumor-extend",
      text: "농지조사를 임야까지 넓히고, 불법 취득한 투기 소유자는 처벌하고 세금을 제대로 물려 달라",
      claimIds: ["claim-plan", "claim-followup"],
    },
    {
      id: "rumor-clan",
      text: "경자유전 조항 때문에 문중 소유 농지를 개인 명의로 등기해야 해 분쟁과 위장 등기가 생기니 고쳐 달라",
      claimIds: ["claim-followup"],
    },
    {
      id: "rumor-foreign",
      text: "외국인, 특히 중국 국적자의 농지 매입이 늘어 식량안보가 위협받는데 정부는 이를 방치한다",
      claimIds: ["claim-foreign", "claim-foreign-trend"],
    },
  ],
  claims: [
    {
      id: "claim-order",
      text:
        "이재명 대통령은 2026년 2월 24일 국무회의에서 대규모 인력을 동원한 농지 전수조사와 농지를 방치한 소유자에 대한 " +
        "매각명령 방안을 검토하라고 지시했다. 5월 6일에는 \"농사 짓지 않는 사람은 농지를 갖지 못하게 해야 한다\"고 했다.",
      assertionType: "FACT",
      sourceIds: ["src-koreancenter-1430607", "src-hankyung-20260506"],
      verified: true,
    },
    {
      id: "claim-plan",
      text:
        "당정은 4월 1일 5월부터 1996년 이후 취득 농지(약 115만 ha)를, 2027년에는 1996년 이전 취득 농지(약 80만 ha)를 " +
        "조사한다고 발표했다. 지방정부와 국립농산물품질관리원이 조사 인력 5,000명을 새로 뽑고, 기본조사 뒤 8월부터 " +
        "투기·불법 의심 농지를 현장 점검했다. 투기 목적이 적발되면 처분 의무를 공고하고, 이행하지 않으면 6개월 안에 " +
        "매각하라는 처분명령을 내린다.",
      assertionType: "FACT",
      sourceIds: ["src-mt-20260401", "src-dailian-1667636"],
      verified: true,
    },
    {
      id: "claim-no-disposal",
      text:
        "농식품부는 상속농지·고령농 보유 농지·관행적 임대차처럼 투기와 무관한 위반은 처분 대상에서 빼겠다고 했다. 송미령 " +
        "장관은 10월 7일 국정감사에서 일반적·관행적 위반과 투기성 위반을 구분해 대응한다며 관행적 위반은 처분하지 " +
        "않는다고 했다. 국민의힘 이상휘 의원은 위반 의심으로 분류된 농지가 284만 필지라고 지적했다.",
      assertionType: "CLAIM",
      assertedBy: "농림축산식품부",
      sourceIds: ["src-dailian-1698860", "src-imaeil-20261011"],
      verified: true,
    },
    {
      id: "claim-minister-proposal",
      text:
        "대통령은 10월 26일 '농어민과의 대화'에서 원래 수도권 인근 투기 목적 농지를 확인하려 했는데 송 장관이 전수조사를 " +
        "제안했다고 말했다. 국민의힘 장동혁 대표는 \"일이 잘못되자 인제 와서 장관 탓을 한다\"고 비판했다. 송 장관은 27일 X에 " +
        "대통령이 2월 국무회의에서 근본 대책을 고민하라고 했고, 농식품부가 2025년 12월 업무보고와 2026년 5월 국무회의 " +
        "보고로 조사 계획을 구체화했다고 썼다.",
      assertionType: "FACT",
      sourceIds: ["src-koreancenter-1430607", "src-x-nongmiryung-1027"],
      verified: true,
    },
    {
      id: "claim-president-post",
      text:
        "대통령은 10월 28일 X에, 장관 이름을 밝힌 것은 \"칭찬 삼아\" 한 말이고 \"대통령이 공개회의에서 직접 조사를 지시한 " +
        "것은 세상이 다 아는 사실\"이라 제안자가 따로 있다 한들 책임이 줄어들 리 없다고 썼다.",
      assertionType: "CLAIM",
      assertedBy: "이재명 대통령",
      sourceIds: ["src-farm-x-1028"],
      verified: true,
    },
    {
      id: "claim-trade",
      text:
        "국토교통부 실거래가 기준으로 2026년 6~9월 농지 거래는 약 4만 8천 건으로 1년 전(약 5만 8천 건)보다 1만 건 " +
        "줄었고, 거래 금액은 약 69조 원에서 52조 원으로 줄었다고 매일신문이 보도했다.",
      assertionType: "FACT",
      sourceIds: ["src-imaeil-20261011"],
      verified: true,
    },
    {
      id: "claim-loan",
      text:
        "국민의힘 김용태 의원실이 받은 농협중앙회 자료에 따르면 2026년 3~8월 지역 농·축협의 농지담보대출 부실채권 매각 " +
        "손실은 226억 원으로 1년 전(99억 원)의 2.3배였고, 신규 농지담보대출은 3조 2,344억 원으로 1조 7천억 원 넘게 줄었다. " +
        "농협이 대출 취급을 제한했다는 공식 발표는 찾지 못했다.",
      assertionType: "FACT",
      sourceIds: ["src-imaeil-20261011", "src-farm-mtn-20261007"],
      verified: true,
    },
    {
      id: "claim-mafra-rebut",
      text:
        "농식품부는 전·답 거래량과 지가지수로 볼 때 전수조사 때문에 농지 거래와 가격이 전반적으로 급락했다는 \"통계적 " +
        "근거는 찾기 어렵다\"고 했다.",
      assertionType: "CLAIM",
      assertedBy: "농림축산식품부",
      sourceIds: ["src-imaeil-20261011"],
      verified: true,
    },
    {
      id: "claim-followup",
      text:
        "당정은 조사 결과로 농지관리체계 개선, 농지보전부담금 정상화, 농지보전총량제 등 제도 개선안을 마련하겠다고 했다. " +
        "임야로 조사를 넓히거나 문중 농지 등기 문제를 따로 다루겠다는 발표는 찾지 못했다.",
      assertionType: "FACT",
      sourceIds: ["src-mt-20260401"],
      verified: false,
    },
    {
      id: "claim-foreign",
      text:
        "김선교 의원실이 받은 농식품부 자료에 따르면 2022년~2026년 8월 외국인이 취득한 국내 농지는 207만 368㎡(약 207ha)다. " +
        "국적별로 중국 68만 2,948㎡(33.0%), 미국 51만 2,253㎡(24.7%), 캐나다 20만 8,190㎡(10.1%) 순이었다.",
      assertionType: "FACT",
      sourceIds: ["src-srtimes-214710", "src-obs-1540421"],
      verified: true,
    },
    {
      id: "claim-foreign-trend",
      text:
        "외국인 전체 취득 면적은 2022년 56만 9,634㎡에서 2025년 41만 913㎡로 27.9% 줄었지만, 중국인 취득 면적은 15만 " +
        "2,785㎡에서 19만 9,534㎡로 30.6% 늘어 비중이 26.8%에서 48.6%로 커졌다.",
      assertionType: "FACT",
      sourceIds: ["src-srtimes-214710"],
      verified: true,
    },
    {
      id: "claim-critique",
      text:
        "국민의힘은 농지 전수조사가 농촌 경제를 파탄냈다며 준비 부족을 비판했고, 송 장관은 대통령 지시 전 대통령실과 " +
        "사전 협의가 \"많이 없었다\"고 답했다. 김선교 의원은 외국인 농지의 사후관리 강화를 요구했다.",
      assertionType: "OPINION",
      sourceIds: ["src-dailian-1698860", "src-kbmaeil-20261022", "src-newstomato-1317652", "src-srtimes-214710"],
      verified: true,
    },
  ],
  critiqueIds: ["claim-trade", "claim-loan", "claim-critique"],
  timeline: [
    {
      id: "t-order",
      date: "2026-02-24",
      datePrecision: "day",
      title: "대통령, 농지 전수조사·매각명령 검토 지시",
      summary: "국무회의.",
      claimIds: ["claim-order"],
    },
    {
      id: "t-plan",
      date: "2026-04-01",
      datePrecision: "day",
      title: "당정 농지 전수조사 방안",
      summary: "5월부터 1996년 이후 취득 농지.",
      claimIds: ["claim-plan"],
    },
    {
      id: "t-audit",
      date: "2026-10-07",
      datePrecision: "day",
      title: "농식품부 국정감사, \"관행적 위반 처분 안 해\"",
      summary: "위반 의심 284만 필지.",
      claimIds: ["claim-no-disposal"],
    },
    {
      id: "t-talk",
      date: "2026-10-26",
      datePrecision: "day",
      title: "대통령 '장관 제안' 발언",
      summary: "국민의힘 '책임 떠넘기기' 비판.",
      claimIds: ["claim-minister-proposal"],
    },
    {
      id: "t-post",
      date: "2026-10-28",
      datePrecision: "day",
      title: "대통령 \"칭찬 삼아 밝힌 것\"",
      summary: "장관 X 글 인용.",
      claimIds: ["claim-president-post"],
    },
  ],
  gaps: [
    "답글에 나온 특정 국회의원의 농지 매입 의혹은 조사 대상 여부를 확인할 수 없어 다루지 않는다.",
    "외국인의 농지 취득을 국적별로 제한하는 법 개정 논의는 찾지 못했다.",
    "농지 태양광과 패널 원산지 문제는 이 페이지에서 다루지 않았다.",
    "농식품부의 10월 12일 해명 보도자료 원문은 대조하지 못했다.",
  ],
  sources: [
    {
      id: "src-koreancenter-1430607",
      title: "이 대통령 '장관 제안' 발언 논란에 추진 경위 설명",
      publisher: "연합뉴스",
      url: "https://www.koreancenter.or.kr/news/articleView.html?idxno=1430607",
      publishedAt: "2026-10-27",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-hankyung-20260506",
      title: "李 대통령 \"농사 짓지 않는 사람은 농지 못 갖게 해야\"",
      publisher: "한국경제",
      url: "https://www.hankyung.com/amp/2026050686757",
      publishedAt: "2026-05-06",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-mt-20260401",
      title: "당정 \"5월부터 농지 전수조사 실시...'투기' 적발시 매각 처분명령\"",
      publisher: "머니투데이",
      url: "https://www.mt.co.kr/politics/2026/04/01/2026040107493157990",
      publishedAt: "2026-04-01",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-dailian-1667636",
      title: "농지 27.6% 무단 휴경·불법 전용 의심…8월 심층조사",
      publisher: "데일리안",
      url: "https://www.dailian.co.kr/news/view/1667636/",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-dailian-1698860",
      title: "[2026 국감] 농식품부 국감 초반부터 '농지' 충돌…송미령 농식품부 장관 \"관행적 위반 처분 안 해\"",
      publisher: "데일리안",
      url: "https://www.dailian.co.kr/news/view/1698860",
      publishedAt: "2026-10-07",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-x-nongmiryung-1027",
      title: "농지조사, 농정의 미래를 위해 선택한 길입니다",
      publisher: "송미령 농림축산식품부 장관 X (@nongmiryung)",
      url: "https://x.com/nongmiryung/status/2115019332208201860",
      publishedAt: "2026-10-27",
      type: "interview",
      license: "quotable",
    },
    {
      id: "src-farm-x-1028",
      title: "\"짜장면 좋다는 건 짬뽕 폄훼\" 시대가 도래하고 있습니다",
      publisher: "이재명 X (@Jaemyung_Lee)",
      url: "https://x.com/Jaemyung_Lee/status/2115215294881018252",
      publishedAt: "2026-10-28",
      type: "interview",
      license: "quotable",
    },
    {
      id: "src-imaeil-20261011",
      title: "농지 전수조사 뒤 농지담보대출 부실채권 손실 2.3배…신규 대출도 1조원 넘게 감소",
      publisher: "매일신문",
      url: "https://www.imaeil.com/page/view/2026101119123348536",
      publishedAt: "2026-10-11",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-farm-mtn-20261007",
      title: "\"10년 후 알거지 될 판\" 농지조사에 농협 부실론 대두",
      publisher: "머니투데이방송",
      url: "https://news.mtn.co.kr/news-detail/2026100717305298147",
      publishedAt: "2026-10-07",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-kbmaeil-20261022",
      title: "이상휘 등 국힘 농해수위 의원들 “대통령, 농민에 석고대죄해야” 농지 전수조사 비판",
      publisher: "경북매일",
      url: "https://kbmaeil.com/article/20261022500462",
      publishedAt: "2026-10-22",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-srtimes-214710",
      title: "[2026국감] 국내 농지 취득 외국인 절반이 중국인…식량안보 위협 지적",
      publisher: "SR타임스",
      url: "http://www.srtimes.kr/news/articleView.html?idxno=214710",
      publishedAt: "2026-10-14",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-obs-1540421",
      title: "[단독] 우리나라 농지 취득 외국인 33%가 중국인…지난해엔 '절반'",
      publisher: "OBS경인TV",
      url: "https://www.obsnews.co.kr/news/articleView.html?idxno=1540421",
      publishedAt: "2026-10-14",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-newstomato-1317652",
      title: "농지조사 '준비 부족' 도마…송미령 \"현실과 제도 간극 해소\"",
      publisher: "뉴스토마토",
      url: "https://newstomato.com/ReadNews.aspx?no=1317652",
      type: "press",
      license: "link-only",
    },
  ],
};
