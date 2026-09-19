import { achievementSchema, type AchievementInput } from "@/content/schema";

/**
 * 주식시장 개선 — Sprint 3. 세 번째 스토리.
 *
 * 출처
 *   출발점은 나무위키였지만 그건 사용자 편집 위키라 우리 근거 체계에 들어갈 수 없다.
 *   단서 목록으로만 쓰고, 항목마다 1차 자료를 찾아 붙였다.
 *   - 제도: 국가법령정보센터(상법 개정이유), 금융위원회 보도자료 5건, 기획재정부
 *   - 지수: 한국거래소 정보데이터시스템. 다만 조회 화면이라 특정 시점을 고정 인용할 수
 *     없어, 날짜별 수치는 같은 날 보도로 대조했다. 이 스토리에서 press를 쓴 곳은
 *     지수 종가뿐이고 제도 서술에는 쓰지 않았다.
 *
 * 이 스토리를 고른 이유는 두 가지다.
 *
 * 1. 전용 개념이 새롭다. 항로(공간)도 자금·면적(몫)도 아닌 시계열이다.
 *    확장 지점이 제대로 설계됐는지 시험한다.
 *
 * 2. 정직성을 시험한다. 지수는 올랐다가 되밀렸다. 고점에서 끊은 차트를 그리면
 *    그건 자료가 아니라 선전물이고, 이 제품의 전제가 무너진다.
 *    그래서 하락 구간까지 전부 싣고, 쟁점 섹션에서 정면으로 다룬다.
 */

const raw: AchievementInput = {
  id: "stock-market",
  slug: "stock-market",
  title: "주식시장 개선",
  subtitle: "코리아 디스카운트를 줄이려는 제도 개편",
  kicker: "주요 정책",
  summary:
    "한국 주식시장은 오래 '코리아 디스카운트'라 불리는 저평가를 겪었다. " +
    "이사의 충실의무 확대와 자사주 소각 의무화는 상법 개정으로 이미 시행됐고, 상장폐지 제도와 " +
    "불공정거래 제재도 개편됐다. " +
    "지수는 크게 올랐다가 2026년 7월 이후 되밀렸다. 오른 구간과 내린 구간을 함께 본다.",
  type: "event",
  publishStatus: "published",

  scenes: [
    {
      id: "index-series",
      kind: "index-series",
      heading: "지수는 오르고, 또 내렸습니다",
      lede:
        "오른 구간만 보여주면 자료가 아니라 선전물입니다. 고점 이후 되밀린 구간까지 함께 싣습니다. 아래 연표에서 시점을 옮기면 차트에도 그 시점이 찍힙니다.",
      claimIds: ["claim-index-series", "claim-drawdown"],
      series: {
        name: "코스피",
        unit: "포인트",
        claimId: "claim-index-series",
        note:
          "돌파·붕괴가 보도된 날의 지수대만 표시한 개략 시계열이다. 일별 종가 전체가 아니며, " +
          "마지막 점(2026년 7월 29일) 이후 구간은 아직 반영하지 않았다. " +
          "한국거래소 일별 종가로 대조한 뒤 확정한다.",
        points: [
          { date: "2025-06-11", value: 2900, milestone: true, label: "2,900선" },
          { date: "2025-06-20", value: 3000, milestone: true, label: "3,000선 회복" },
          { date: "2025-06-24", value: 3100, milestone: false },
          { date: "2025-10-27", value: 4000, milestone: true, label: "4,000선" },
          { date: "2026-01-22", value: 5000, milestone: true, label: "5,000선" },
          { date: "2026-02-25", value: 6000, milestone: false },
          { date: "2026-05-06", value: 7000, milestone: false },
          { date: "2026-05-15", value: 8000, milestone: false },
          { date: "2026-06-18", value: 9000, milestone: true, label: "9,000선 · 고점" },
          { date: "2026-07-13", value: 7000, milestone: true, label: "7,000선 하회" },
          { date: "2026-07-29", value: 6000, milestone: true, label: "6,000선 하회" },
        ],
      },

    },
  ],

  keyNumbers: [
    {
      id: "kn-peak",
      label: "코스피 고점",
      value: "9,000",
      unit: "선",
      caption: "2026년 6월 18일",
      claimId: "claim-index-series",
    },
    {
      id: "kn-drawdown",
      label: "고점 대비 하락",
      prefix: "약",
      value: "37.5",
      unit: "%",
      caption: "9,063.84 → 5,663.24 (2026년 7월 29일 종가)",
      claimId: "claim-drawdown",
    },
    {
      id: "kn-marketcap",
      label: "유가증권시장 시가총액",
      value: "3,476.8",
      unit: "조 원",
      caption: "2025년 말 · 전년 말 대비 77.2% 증가",
      claimId: "claim-marketcap",
    },
  ],

  timeline: [
    {
      id: "sm-3000",
      date: "2025-06-20",
      displayDate: "2025년 6월",
      datePrecision: "day",
      title: "코스피 3,000선 회복",
      summary: "새 정부 출범 직후 지수가 3,000선을 회복했다.",
      claimIds: ["claim-index-series"],
    },
    {
      id: "sm-taskforce",
      date: "2025-07",
      displayDate: "2025년 7월",
      datePrecision: "month",
      title: "주가조작 대응 체계 출범",
      summary:
        "부당이득 대비 과징금과 자본시장 퇴출을 포함한 제재 체계가 가동되기 시작했다.",
      claimIds: ["claim-manipulation"],
    },
    {
      id: "sm-withdraw",
      date: "2025-09-15",
      displayDate: "2025년 9월",
      datePrecision: "day",
      title: "대주주 양도세 기준 하향 철회",
      summary:
        "50억 원에서 10억 원으로 낮추려던 안을 철회하고 현행 기준을 유지하기로 했다.",
      claimIds: ["claim-capgains"],
    },
    {
      id: "sm-delisting",
      date: "2026-02-12",
      displayDate: "2026년 2월",
      datePrecision: "day",
      title: "상장폐지 제도 개편 발표",
      summary: "집중관리기간 운영과 상장폐지 요건 강화, 절차 효율화가 포함됐다.",
      claimIds: ["claim-delisting"],
    },
    {
      id: "sm-reform",
      date: "2026-03-18",
      displayDate: "2026년 3월",
      datePrecision: "day",
      title: "자본시장 체질개선 방안 발표",
      summary:
        "신뢰·주주보호·혁신·시장접근성을 축으로 불공정거래 제재, 중복상장 제한, 결제주기 단축 등이 제시됐다.",
      claimIds: ["claim-reform"],
    },
    {
      id: "sm-mto",
      date: "2026-09",
      displayDate: "2026년 9월",
      datePrecision: "month",
      title: "의무공개매수 도입 추진",
      summary:
        "경영권이 바뀔 때 일반주주도 경영권 프리미엄을 나눠 받도록 하는 자본시장법 개정이 논의되고 있다.",
      claimIds: ["claim-mto"],
    },
    {
      id: "sm-peak",
      date: "2026-06-18",
      displayDate: "2026년 6월",
      datePrecision: "day",
      title: "코스피 9,000선 — 고점",
      summary: "지수가 9,000선에 닿았다. 이후 하락이 시작된다.",
      claimIds: ["claim-index-series"],
    },
    {
      id: "sm-fall",
      date: "2026-07-29",
      displayDate: "2026년 7월",
      datePrecision: "day",
      title: "6,000선 하회",
      summary:
        "7월 13일 7,000선이 무너졌고, 29일 종가 5,663.24로 6,000선도 내줬다. 고점 대비 약 37.5% 하락이다.",
      claimIds: ["claim-drawdown"],
    },
  ],

  counterpoints: [
    {
      id: "sm-cp-fall",
      question: "지수가 결국 되밀렸는데 개선이라고 할 수 있나?",
      response:
        "지수와 제도는 분리해서 봐야 한다. 지수는 금리·환율·해외 증시 등 정책 밖 요인에 크게 좌우되고, 실제로 고점 대비 약 37.5% 하락했다. 반면 이사 충실의무 확대, 자사주 소각, 상장폐지 요건 강화 같은 제도 변화는 지수와 무관하게 남는다. 이 스토리가 다루는 것은 후자이며, 지수는 그 배경으로만 싣는다.",
      claimIds: ["claim-drawdown", "claim-reform"],
    },
    {
      id: "sm-cp-tax",
      question: "증권거래세를 올리면 투자자 부담이 늘지 않나?",
      response:
        "인상안은 폐지된 금융투자소득세를 되돌리는 취지로 제시됐다. 다만 거래세는 손익과 무관하게 부과되므로 손실을 본 투자자에게도 걸린다는 비판이 있다. 이 항목은 세제개편안 단계이며 확정 내용은 국회 논의 결과에 달려 있다.",
      claimIds: ["claim-transactiontax"],
    },
    {
      id: "sm-cp-causal",
      question: "지수 상승이 정부 정책 때문인가?",
      response:
        "인과를 단정할 수 없다. 같은 기간 글로벌 증시도 올랐고, 반도체 업황과 환율이 함께 움직였다. 이 스토리는 제도 변화의 내용과 시점을 기록할 뿐, 지수 변동의 원인을 정책으로 돌리지 않는다.",
      claimIds: ["claim-index-series"],
    },
  ],

  claims: [
    {
      id: "claim-index-series",
      text:
        "코스피는 2025년 6월 20일 종가 3,021.84로 3년 6개월 만에 3,000선을 회복했고, " +
        "2026년 6월 18일 종가 9,063.84로 사상 처음 9,000선을 넘었다. " +
        "이후 하락해 2026년 7월 29일 종가 5,663.24로 6,000선을 내주었다.",
      assertionType: "FACT",
      sourceIds: ["src-krx-index", "src-kospi-3000", "src-kospi-9000", "src-kospi-5663"],
      verified: true,
    },
    {
      id: "claim-drawdown",
      text:
        "코스피는 고점(2026년 6월 18일 종가 9,063.84) 대비 2026년 7월 29일 종가 5,663.24까지 " +
        "약 37.5% 하락했다. 같은 날 유가증권·코스닥 두 시장에 이틀 연속 서킷브레이커가 발동했다.",
      assertionType: "FACT",
      sourceIds: ["src-krx-index", "src-kospi-9000", "src-kospi-5663"],
      verified: true,
    },
    {
      id: "claim-marketcap",
      text:
        "유가증권시장 시가총액은 2024년 말 1,962조 1,000억 원에서 2025년 말 3,476조 8,000억 원으로 " +
        "77.2% 늘어 사상 처음 3,000조 원을 넘었다.",
      assertionType: "FACT",
      sourceIds: ["src-krx-index", "src-marketcap-2025"],
      verified: true,
    },
    {
      id: "claim-duty",
      text:
        "2025년 7월 22일 법률 제20991호로 상법이 개정되어, 이사가 직무를 수행할 때 회사뿐 아니라 " +
        "총주주의 이익을 보호하고 전체 주주의 이익을 공평하게 대우하도록 하는 조항이 신설되었다.",
      assertionType: "FACT",
      sourceIds: ["src-law-commercial"],
      verified: true,
    },
    {
      id: "claim-buyback",
      text:
        "2026년 3월 6일 법률 제21448호로 상법이 개정되어, 회사가 자기주식을 취득한 경우 " +
        "1년 이내에 소각할 의무가 부과되었다. 임직원 보상 등의 경우에는 주주총회 승인에 따라 " +
        "예외적인 보유와 처분이 허용된다.",
      assertionType: "FACT",
      sourceIds: ["src-law-commercial"],
      verified: true,
    },
    {
      id: "claim-mto",
      text:
        "경영권 변경 시 일반주주도 경영권 프리미엄을 나눠 받도록 하는 의무공개매수 제도가 " +
        "자본시장법 개정으로 추진되고 있다. 정부는 매수 의무 범위를 경영권 지분을 포함해 " +
        "총 50%+1주 이상으로 하는 안을 제시했다.",
      assertionType: "FACT",
      sourceIds: ["src-fsc-mto"],
      verified: true,
    },
    {
      id: "claim-manipulation",
      text:
        "불공정거래 행위자에게 부당이득의 최대 2배까지 과징금을 부과할 수 있고, " +
        "2025년 4월 23일부터는 금융투자상품 거래와 상장사 임원 선임·재임을 최대 5년까지 " +
        "제한하는 명령이 시행되었다. 2025년 7월 9일에는 주가조작 근절 합동대응단 설치를 담은 " +
        "「자본시장 불공정거래 근절 실천방안」이 발표되었다.",
      assertionType: "FACT",
      sourceIds: ["src-fsc-sanction", "src-fsc-unfair"],
      verified: true,
    },
    {
      id: "claim-capgains",
      text:
        "정부는 2025년 9월 15일 주식 양도소득세 과세 대상 대주주 기준을 현행 종목당 50억 원으로 " +
        "유지한다고 밝혔다. 7월 세제개편안 발표 이후 이어진 논의 끝에 나온 결정이다.",
      assertionType: "FACT",
      sourceIds: ["src-korea-capgains"],
      verified: true,
    },
    {
      id: "claim-transactiontax",
      text:
        "2025년 7월 31일 발표된 2025년 세제개편안에 증권거래세율 환원이 포함되었다.",
      assertionType: "FACT",
      sourceIds: ["src-moef-tax-2025"],
      verified: true,
    },
    {
      id: "claim-delisting",
      text:
        "2026년 2월 12일 금융위원회와 한국거래소가 「부실기업 신속·엄정 퇴출을 위한 상장폐지 개혁 방안」을 " +
        "발표했다. 2026년 2월부터 2027년 6월까지 상장폐지 집중관리기간을 운영하고, " +
        "시가총액 기준을 2026년 7월 150억 원에서 200억 원으로, 2027년 1월 300억 원으로 강화한다.",
      assertionType: "FACT",
      sourceIds: ["src-fsc-delisting"],
      verified: true,
    },
    {
      id: "claim-reform",
      text:
        "2026년 3월 18일 금융위원회가 신뢰·주주보호·혁신·시장접근성 제고의 4대 정책방향을 담은 " +
        "자본시장 체질개선 방안을 발표했다.",
      assertionType: "FACT",
      sourceIds: ["src-fsc-reform"],
      verified: true,
    },
  ],

  sources: [
    {
      id: "src-krx-index",
      title: "주가지수·시가총액 통계 — KRX 정보데이터시스템",
      url: "https://data.krx.co.kr/contents/MDC/MDI/mdiLoader/index.cmd?menuId=MDC03010202",
      publisher: "한국거래소",
      type: "statistics",
      // 조회 화면이라 특정 시점을 고정 인용할 수 없다. 숫자의 출처는 여기이고,
      // 날짜별 확인은 아래 보도자료로 대조한다.
      license: "link-only",
    },
    {
      id: "src-kospi-3000",
      title: "코스피, 3000선 돌파…3년 6개월만",
      url: "https://www.seoul.co.kr/news/economy/securities/2025/06/20/20250620800005",
      publisher: "서울신문",
      publishedAt: "2025-06-20",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-kospi-9000",
      title: "코스피 '9000' 시대 개막…종가 9063.84 마감",
      url: "https://www.asiae.co.kr/article/2026061816204217852",
      publisher: "아시아경제",
      publishedAt: "2026-06-18",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-kospi-5663",
      title: "[속보] 코스피 5.9%↓ 5663 마감…'6000피' 밑으로",
      url: "https://www.kmib.co.kr/article/view.asp?arcid=9000000244&code=61141211&sid1=eco",
      publisher: "국민일보",
      publishedAt: "2026-07-29",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-marketcap-2025",
      title: "올해 76% 뛴 코스피, G20·OECD 1위…시총 첫 3000조 돌파",
      url: "https://www.hankyung.com/article/2025123033346",
      publisher: "한국경제",
      publishedAt: "2025-12-30",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-law-commercial",
      title: "상법 — 전체 제정·개정이유 (법률 제20991호·제21448호)",
      url: "https://www.law.go.kr/LSW/lsRvsRsnListP.do?lsId=001702&chrClsCd=010202&lsRvsGubun=all",
      publisher: "법제처 국가법령정보센터",
      type: "legislative",
      license: "public",
      quote:
        "이사는 그 직무를 수행함에 있어 회사뿐만 아니라 총주주의 이익을 보호하고 전체 주주의 이익을 공평하게 대우하도록 (…) " +
        "회사가 자기주식을 취득한 경우 1년 이내에 소각할 의무를 부과하고, 임직원 보상 등의 경우 주주총회의 승인에 따라 " +
        "자기주식의 예외적인 보유 또는 처분을 허용",
    },
    {
      id: "src-fsc-sanction",
      title: "불법공매도 제재수단이 도입됩니다 — 「자본시장과 금융투자업에 관한 법률」 하위규정 개정",
      url: "https://www.fsc.go.kr/po010101/84365",
      publisher: "금융위원회",
      type: "official",
      license: "public",
      quote:
        "불공정거래·불법공매도 행위를 한 자의 상장사등 임원으로서의 선임·재임을 위반행위의 내용·정도, 기간·횟수, " +
        "취득한 이익 규모를 고려하여 최대 5년의 범위에서 제한할 수 있도록 규정",
    },
    {
      id: "src-fsc-unfair",
      title: "불공정거래를 신속적발, 엄정제재하여 주가조작의 유인을 근본적으로 차단하겠습니다",
      url: "https://www.fsc.go.kr/no010101/84892",
      publisher: "금융위원회·금융감독원·한국거래소",
      publishedAt: "2025-07-09",
      type: "official",
      license: "public",
      quote: "과징금(최대 부당이득의 2배)",
    },
    {
      id: "src-fsc-mto",
      title: "신주우선배정 및 의무공개매수 제도와 관련한 정부입장 설명",
      url: "https://fsc.go.kr/no010102/86503",
      publisher: "금융위원회",
      type: "official",
      license: "public",
      quote:
        "경영권 지분을 포함하여 총 50%+1주 이상을 매수하도록 의무를 부과",
    },
    {
      id: "src-moef-tax-2025",
      title: "2025년 세제개편안 발표",
      url: "https://mofe.go.kr/nw/nes/detailNesDtaView.do?menuNo=4010100&searchNttId1=MOSF_000000000074687",
      publisher: "기획재정부",
      publishedAt: "2025-07-31",
      type: "official",
      // 본문은 첨부 PDF에 있다. 페이지 자체에는 인용할 문장이 없다.
      license: "link-only",
    },
    {
      id: "src-korea-capgains",
      title: "주식 양도세 대주주 기준, 현행 '종목당 50억 원 이상' 유지",
      url: "https://www.korea.kr/news/policyNewsView.do?newsId=148949309",
      publisher: "기획재정부 (대한민국 정책브리핑)",
      publishedAt: "2025-09-15",
      type: "official",
      license: "public",
      quote: "주식 양도세 대주주 기준, 현행 '종목당 50억 원 이상' 유지",
    },
    {
      id: "src-fsc-delisting",
      title: "부실기업 신속·엄정 퇴출을 위한 상장폐지 개혁 방안",
      url: "https://www.fsc.go.kr/no010101/86273",
      publisher: "금융위원회·한국거래소",
      publishedAt: "2026-02-12",
      type: "official",
      license: "public",
      quote:
        "'26.2월~'27.6월 상장폐지 집중관리기간 운영 (…) 시가총액 기준을 '26.7월 150억원 → 200억원, " +
        "'27.1월 200억원 → 300억원으로 강화",
    },
    {
      id: "src-fsc-reform",
      title: "위기에 강한, 국민이 믿는 자본시장 — 자본시장 체질개선을 일관되게 추진합니다",
      url: "https://fsc.go.kr/no010101/86493",
      publisher: "금융위원회",
      publishedAt: "2026-03-18",
      type: "official",
      license: "public",
      quote: "신뢰, 주주보호, 혁신, 시장접근성 제고의 4대 정책방향",
    },
  ],
};

export const stockMarket = achievementSchema.parse(raw);
