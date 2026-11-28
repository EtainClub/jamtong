import type { PolicyInput } from "./schema";

/**
 * 공적주택 연 24만 호 공급 계획과 재원·LH 부채, 공공분양 분양가, 모듈러 공법.
 *
 * 2026년 11월 25일 대통령 X 게시물(공적주택 현장간담회) 답글에 "연 24만 호라는 숫자보다 재정 투입, LH 부채,
 * 장기 유지관리 비용 대책이 먼저"(이슈 #314), "공공분양은 시세를 따라가지 말고 시세의 절반 수준으로"(이슈 #315),
 * "공적주택을 모듈러로 짓는 것은 안전에 위험하다"(이슈 #321)는 말이 달렸다(잼통 Voice).
 *
 * ★ 24만 호·투자액은 정부 계획이다. 실적이 아니다.
 * ★ 공적임대의 면적·매입·보증금·불법전대·원주민 재정착 규칙은 policy:public-rental-rules에 있다.
 * ★ 보편형 공공임대는 policy:universal-public-rental, 공공주택 품질은 policy:public-housing-quality에 있다.
 * ★ 2026-11-28 처음 등록 — 잼통 Voice 이슈 #314, #315, #321.
 */
export const PUBLIC_HOUSING_240K: PolicyInput = {
  slug: "public-housing-240k",
  title: "공적주택 연 24만 호 공급 계획과 재원·LH 부채",
  scope:
    "2026년 11월 25일 공적주택 현장간담회에서 밝힌 2030년까지 연평균 24만 호 공급 계획과 투자 규모, LH의 부채 현황과 전망, 공공택지 공공분양의 분양가 산정 방식과 새 분양 모델, 모듈러 공법의 내화 기준 논란",
  ministries: ["국토교통부", "한국토지주택공사", "재정경제부"],
  categories: ["welfare", "region", "economy"],
  asOf: "2026-11-28",
  rumors: [
    {
      id: "rumor-finance",
      text: "연 24만 호라는 숫자보다 재정 투입, LH 부채, 장기 유지관리 비용 대책이 먼저다",
      claimIds: ["claim-investment", "claim-lh-debt", "claim-lh-forecast", "claim-lh-answer", "claim-financing-critique"],
    },
    {
      id: "rumor-half-price",
      text: "공공분양은 주변 시세를 따라가지 말고 시세의 절반 수준처럼 서민이 살 수 있는 가격으로 공급해야 한다",
      claimIds: ["claim-price-cap", "claim-sale-models", "claim-2027-recruit"],
    },
    {
      id: "rumor-modular",
      text: "공적주택을 모듈러 주택으로 짓는 것은 안전에 위험하다",
      claimIds: ["claim-modular-fire", "claim-modular-bill"],
    },
  ],
  claims: [
    {
      id: "claim-plan",
      text:
        "이재명 대통령은 2026년 11월 25일 서울 은평구청에서 열린 공적주택 현장간담회에서 \"올해부터 2030년까지 매년 평균 24만호 정도의 공적주택을 공급할 예정\"이라며 " +
        "\"지난 10년 평균과 비교해도 50%가 확대된 수준\"이라고 말했다. 정부는 공공임대주택의 이름을 '공적임대주택'으로 바꾸고, 공공임대 재고를 2024년 193만 호에서 2030년 250만 호 이상으로 늘리겠다고 밝혔다.",
      assertionType: "CLAIM",
      assertedBy: "이재명 대통령·국토교통부",
      sourceIds: ["src-asiae-20261125", "src-ntoday-20261126"],
      verified: true,
    },
    {
      id: "claim-speculation",
      text:
        "대통령은 같은 자리에서 \"새로운 주택공급이 새로운 주택 투기의 진원지 역할을 하는 사례들이 없지 않은데, 그렇게 되지 않도록 대비도 중요할 것 같다\"고 말했다. 구체적인 대책은 밝히지 않았다.",
      assertionType: "CLAIM",
      assertedBy: "이재명 대통령",
      sourceIds: ["src-asiae-20261125", "src-pointdaily-20261126"],
      verified: true,
    },
    {
      id: "claim-investment",
      text:
        "정부는 공적주택 투자 규모를 올해 21조 원에서 내년 30조 원으로 늘리고, 2028년 이후 대규모 주택공급에 필요한 범정부 재정지원 방안을 마련하겠다고 밝혔다. " +
        "LH는 2030년까지 수도권 건설형 공공주택 등 49만 7천 호를 착공하고, 민간참여 공공주택을 30만 호(잠정)로 늘리며, 아파트 공사 발주를 직전 5년의 6배인 182조 원으로 늘린다는 계획이다.",
      assertionType: "CLAIM",
      assertedBy: "국토교통부·한국토지주택공사",
      sourceIds: ["src-asiae-20261125"],
      verified: true,
    },
    {
      id: "claim-lh-debt",
      text:
        "LH의 2026년 상반기 연결 결산(6월 30일 기준) 부채는 185조 7,048억 원으로 1년 전보다 20조 6,842억 원 늘었고, 자본 대비 부채비율은 237.5%로 2025년 말(230.8%)보다 올랐다. " +
        "같은 기간 공공임대 부문의 매출총손실은 1조 4,652억 원이었다.",
      assertionType: "FACT",
      sourceIds: ["src-herald-20261116"],
      verified: true,
    },
    {
      id: "claim-lh-forecast",
      text:
        "재정경제부의 중장기 재무관리계획은 LH 부채가 2030년 약 372조 8천억 원에 이를 것으로 내다봤다. 2026년 10월 12일 국회 국토교통위원회 국정감사에서 유상범 의원(국민의힘)은 이 계획을 들어 " +
        "LH 부채가 2026년 197조 원에서 2030년 372조 원으로 늘어난다고 지적하고, 지난해 이자보상배율이 마이너스 2.83이었다고 밝혔다.",
      assertionType: "FACT",
      sourceIds: ["src-herald-20261116", "src-metro-20261012-lh"],
      verified: true,
    },
    {
      id: "claim-lh-answer",
      text:
        "이성훈 LH 사장은 국정감사에서 부채 증가가 \"3기 신도시와 그 이후 지정된 신도시의 보상 물량과 공사 물량이 증가하기 때문\"이라며 \"부채 증가가 예상되고 상당 부분 공감한다\", " +
        "\"예산 당국과 적극적으로 협의하고 있다\"고 답했다. 공사비가 크게 올라 개발 부문에서 수익이 나지 않는다고도 했다.",
      assertionType: "CLAIM",
      assertedBy: "이성훈 한국토지주택공사 사장",
      sourceIds: ["src-metro-20261012-lh", "src-mi-20261012"],
      verified: true,
    },
    {
      id: "claim-financing-critique",
      text:
        "헤럴드경제는 2030년까지 공공주택 119만 가구 목표의 구체적 재원 방안이 아직 제시되지 않았다고 보도했다. 이 기사에서 고준석 교수는 \"채권 발행이나 세금 투입 외에는 사실상 방법이 없는 상황\"이라고 했다. " +
        "국정감사에서는 임대주택 사업 손실이 세금으로 메워지는 구조가 굳어질 수 있다는 우려가 나왔다.",
      assertionType: "INTERPRETATION",
      assertedBy: "헤럴드경제·고준석 교수·국회 국토교통위원",
      sourceIds: ["src-herald-20261116", "src-metro-20261012-lh"],
      verified: true,
    },
    {
      id: "claim-price-cap",
      text:
        "공공택지에서 일반에 공급하는 공동주택은 주택법 제57조에 따라 분양가상한제 적용주택이다. 분양가격은 택지비와 건축비로 구성된다. 공공택지의 택지비는 택지 공급가격에 관련 비용을 더한 금액이고, " +
        "건축비는 국토교통부장관이 고시하는 기본형건축비에 국토교통부령으로 정하는 금액을 더한 금액이다. 법은 분양가를 주변 시세의 일정 비율로 정하지 않는다.",
      assertionType: "FACT",
      sourceIds: ["src-law-housing-act"],
      verified: true,
    },
    {
      id: "claim-sale-models",
      text:
        "기존 나눔형(이익공유형) 공공분양은 주변 시세의 70% 이하로 공급된다. 국토교통부는 11월 4일 '부담가능한 공공분양' 모델을 내놓았다. 지분적립형은 분양가의 25% 수준으로 입주한 뒤 지분을 나눠 사는 방식이며, " +
        "예로 든 55㎡(분양가 5억 1천만 원)는 1억 2,800만 원으로 입주할 수 있다. 첫 공급은 12월 고양창릉 S-2BL 284가구 계획이다. 분양가의 70%(한도 5억 원)를 주택도시기금에서 저리로 빌려 주는 " +
        "이익공유형Ⅱ는 아직 법에 없어 공공주택특별법령 개정이 필요하다.",
      assertionType: "CLAIM",
      assertedBy: "국토교통부",
      sourceIds: ["src-herald-20261104"],
      verified: true,
    },
    {
      id: "claim-2027-recruit",
      text:
        "국토교통부는 11월 26일 2027년 수도권 공공주택 입주자 모집 계획을 5만 6천 가구(공공분양 3만 5천, 공공임대 2만 1천)로 밝혔다. 최근 5년 연평균(2만 8천 가구)의 약 2배다. " +
        "이 가운데 지분적립형 공공분양이 약 2,700가구, 이익공유형Ⅱ가 법제화를 전제로 약 1,000가구다.",
      assertionType: "CLAIM",
      assertedBy: "국토교통부",
      sourceIds: ["src-newspim-20261126"],
      verified: true,
    },
    {
      id: "claim-modular-fire",
      text:
        "아시아경제 보도에 따르면 현행 건축법상 13층 이상 고층 건축물에서 콘크리트 모듈러는 벽체 두께 10㎝ 이상이면 내화 성능이 인정되지만, 주류인 철골 모듈러는 내화 3시간 기준을 충족해야 한다. " +
        "그래서 기둥과 보에 방화 석고보드를 3~4겹 덧대고, 그만큼 실내 면적이 줄어든다. 모듈러라고 화재 안전 기준이 낮아지는 것이 아니라 일반 건축물과 같은 내화 기준을 지키느라 비용과 면적이 드는 구조다.",
      assertionType: "FACT",
      sourceIds: ["src-asiae-20261127"],
      verified: false,
      limit: "건축법령(건축물의 피난·방화구조 등의 기준에 관한 규칙) 원문과는 대조하지 못했다. 보도의 설명이다.",
    },
    {
      id: "claim-modular-bill",
      text:
        "업계는 같은 수준의 화재 안전 성능을 유지하면서 모듈러 구조에 맞는 내화 기준을 따로 마련해 달라고 요구한다. 국회에는 모듈러 건축 특별법안 3건이 발의돼 있으나(기본계획, 지원센터, 인증제, 용적률·건폐율 특례), " +
        "연내 통과는 어려울 것으로 보도됐다.",
      assertionType: "FACT",
      sourceIds: ["src-asiae-20261127"],
      verified: true,
    },
  ],
  critiqueIds: ["claim-financing-critique", "claim-lh-forecast"],
  timeline: [
    {
      id: "t-audit",
      date: "2026-10-12",
      datePrecision: "day",
      title: "LH 국정감사, 부채 질타",
      summary: "2030년 372조 원 전망.",
      claimIds: ["claim-lh-forecast", "claim-lh-answer"],
    },
    {
      id: "t-sale-model",
      date: "2026-11-04",
      datePrecision: "day",
      title: "'부담가능한 공공분양' 모델 발표",
      summary: "지분적립형·이익공유형Ⅱ.",
      claimIds: ["claim-sale-models"],
    },
    {
      id: "t-meeting",
      date: "2026-11-25",
      datePrecision: "day",
      title: "공적주택 현장간담회",
      summary: "2030년까지 연평균 24만 호.",
      claimIds: ["claim-plan", "claim-investment", "claim-speculation"],
    },
    {
      id: "t-recruit",
      date: "2026-11-26",
      datePrecision: "day",
      title: "2027년 공공주택 입주자 모집 계획",
      summary: "수도권 5만 6천 가구.",
      claimIds: ["claim-2027-recruit"],
    },
  ],
  gaps: [
    "공공임대 장기 유지관리 비용(수선·재건축)을 정부가 따로 추계해 발표한 자료는 찾지 못했다.",
    "답글이 언급한 영국 공공주택 재고 감소 사례와 한국을 비교한 정부·연구 자료는 이 페이지에 담지 못했다.",
    "공공분양 분양가를 주변 시세의 절반 수준으로 정하자는 제안에 대한 정부의 공식 입장은 찾지 못했다.",
    "21조→30조 원 투자의 재원 구성(재정·주택도시기금·LH 채권)은 보도에서 확인하지 못했다.",
    "모듈러 공법으로 지은 공공주택의 화재·구조 사고 통계는 찾지 못했다.",
  ],
  sources: [
    {
      id: "src-asiae-20261125",
      title: "李대통령 \"공적주택 年 24만호 공급 속도…투기 진원지 안 되도록\"(종합)",
      publisher: "아시아경제",
      url: "https://view.asiae.co.kr/article/2026112516334172550",
      publishedAt: "2026-11-25",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-ntoday-20261126",
      title: "李 대통령, 공적주택 연 24만호 공급…중산층까지 주거 사다리 넓힌다",
      publisher: "투데이신문",
      url: "https://www.ntoday.co.kr/news/articleView.html?idxno=131145",
      publishedAt: "2026-11-26",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-pointdaily-20261126",
      title: "이 대통령 \"중산층도 선택할 공적임대\"…2030년까지 공적주택 연 24만호",
      publisher: "포인트데일리",
      url: "https://www.pointdaily.co.kr/news/articleView.html?idxno=327458",
      publishedAt: "2026-11-26",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-herald-20261116",
      title: "[단독] LH 부채 1년 새 20조 늘어 185.7조…공공주택 확대 재원은 [부동산360]",
      publisher: "헤럴드경제",
      url: "https://biz.heraldcorp.com/article/10938274",
      publishedAt: "2026-11-16",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-metro-20261012-lh",
      title: "[2026 국정감사] \"LH 부채 2030년 372조원 전망\"",
      publisher: "메트로신문",
      url: "https://www.metroseoul.co.kr/article/20261012500290",
      publishedAt: "2026-10-12",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-mi-20261012",
      title: "[2026 국감] 여야, LH 부채·분사·공급지연 질타…이성훈 사장, '집값 급락 가능성' 언급",
      publisher: "매일일보",
      url: "https://www.m-i.kr/news/articleView.html?idxno=2004864",
      publishedAt: "2026-10-12",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-law-housing-act",
      title: "주택법 제57조(주택의 분양가격 제한 등)",
      publisher: "국가법령정보센터",
      url: "https://www.law.go.kr/법령/주택법",
      type: "legislative",
      license: "public",
    },
    {
      id: "src-herald-20261104",
      title: "\"1억2800만원이면 내 집\"…'부담가능한 공공분양' 모델 나왔다",
      publisher: "헤럴드경제",
      url: "https://biz.heraldcorp.com/article/10925084",
      publishedAt: "2026-11-04",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-newspim-20261126",
      title: "국토부, 내년 공공주택 5만6천가구 입주자모집…공공임대 신속공급 추진",
      publisher: "뉴스핌",
      url: "https://www.newspim.com/news/view/20261126000803",
      publishedAt: "2026-11-26",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-asiae-20261127",
      title: "화재 막으려 철골에 3중 석고보드…모듈러 고층화, 현행 건축법에 발목[닥공 첨병된 모듈러주택]③",
      publisher: "아시아경제",
      url: "https://view.asiae.co.kr/article/2026112609382778006",
      publishedAt: "2026-11-27",
      type: "press",
      license: "link-only",
    },
  ],
};
