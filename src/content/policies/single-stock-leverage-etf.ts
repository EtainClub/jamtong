import type { PolicyInput } from "./schema";

/**
 * 단일종목 레버리지 ETF 도입 경위와 책임 공방.
 *
 * "대통령이 '모든 일에 최종 책임'을 말하면서 레버리지 ETF 결정에서는 책임 있는
 * 조치를 보이지 않는다"는 답글이 돈다(2026년 10월). 도입은 시행령 개정으로
 * 국무회의를 거쳤고, 과열 뒤 신규 상장을 멈췄다. 누가 결정했는지는 국정감사에서
 * 다퉜다 — 야당은 청와대 지시를 주장하고, 금융위원장은 부인하며 사과했다.
 * 대통령 본인이 이 건으로 낸 입장은 찾지 못했다.
 *
 * ★ 손실 규모는 '54조원'(야당 주장)과 '2조 3,242억원'(금감원 집계, 10개
 *   증권사·개인 확정손실)이 범위부터 다르다. 둘을 나란히 적는다.
 * ★ 2026-10-17 처음 등록 — 잼통 Voice voice-gap 이슈 #38.
 */
export const SINGLE_STOCK_LEVERAGE_ETF: PolicyInput = {
  slug: "single-stock-leverage-etf",
  title: "단일종목 레버리지 ETF 도입 경위와 책임 공방",
  scope:
    "삼성전자·SK하이닉스 단일종목 레버리지 ETF의 도입(시행령 개정)·상장·추가 상장 중단, " +
    "2026년 국정감사의 결정 경위·책임·손실 규모 공방",
  ministries: ["금융위원회", "금융감독원", "재정경제부"],
  categories: ["economy"],
  asOf: "2026-10-17",
  rumors: [
    {
      id: "rumor-no-responsibility",
      text: "'모든 일에 최종 책임'을 말하면서 레버리지 ETF 결정 등에서는 책임 있는 조치를 보이지 않는다",
      claimIds: ["claim-halt", "claim-fsc-apology", "claim-final-decision", "claim-president-gap"],
    },
  ],
  claims: [
    {
      id: "claim-decree",
      text:
        "국내 우량주 하나를 기초로 하는 레버리지(±2배 이내) ETF·ETN을 허용하는 자본시장법 시행령 " +
        "개정안이 2026년 4월 21일 국무회의에서 의결돼 4월 28일 공포·시행됐다. 금융위원회는 4월 15일 " +
        "먼저 의결했다. 기초 종목은 시가총액·거래량·파생시장 안정성 기준을 채운 국내 우량주로 한정되며, " +
        "2026년 1분기 기준 삼성전자와 SK하이닉스 두 종목이다.",
      assertionType: "FACT",
      sourceIds: ["src-fsc-20260421", "src-korea-20260421"],
      verified: true,
    },
    {
      id: "claim-reason",
      text:
        "금융위원회는 미국·홍콩에는 단일종목 ETF가 상장돼 국내 투자자가 해외 상품에 투자하는데 국내는 " +
        "분산투자 요건 때문에 출시가 막혀 있어, 규제 차이를 없애고 자금 유출을 줄이려 개정한다고 밝혔다.",
      assertionType: "CLAIM",
      assertedBy: "금융위원회",
      sourceIds: ["src-fsc-20260421"],
      verified: true,
    },
    {
      id: "claim-safeguards",
      text:
        "도입과 함께 1시간 심화 사전교육을 새로 만들고, 해외 상장 단일종목 레버리지 상품에도 기본예탁금 " +
        "1,000만원을 적용하며, 상품 이름에 'ETF' 대신 '단일종목'·'레버리지·인버스'를 표기하게 했다.",
      assertionType: "FACT",
      sourceIds: ["src-fsc-20260421", "src-korea-20260421"],
      verified: true,
    },
    {
      id: "claim-listing",
      text: "단일종목 레버리지 ETF·ETN은 2026년 5월 27일 국내 시장에 처음 상장됐다.",
      assertionType: "FACT",
      sourceIds: ["src-fntimes-20261008"],
      verified: true,
    },
    {
      id: "claim-halt",
      text:
        "관계기관은 2026년 7월 16일 이미 상장된 것 말고는 단일종목 상품(레버리지·인버스·커버드콜)의 추가 " +
        "상장을 시장이 안정될 때까지 즉시 멈추고, 개인 기본예탁금을 1,000만원에서 3,000만원으로 올리며, " +
        "광고·이벤트성 마케팅을 금지했다. 당시 전체 ETF 거래대금의 38.2%가 단일종목 상품에 몰려 있었다.",
      assertionType: "FACT",
      sourceIds: ["src-investchosun-20260716"],
      verified: true,
    },
    {
      id: "claim-loss-fss",
      text:
        "금융감독원 자료에 따르면 2026년 5월 27일부터 8월 14일까지 주요 증권사 10곳에서 개인투자자가 " +
        "확정한 손실은 2조 3,242억원이다. 이 자료는 최은석 국민의힘 의원실에 제출됐다.",
      assertionType: "FACT",
      sourceIds: ["src-fntimes-20261008"],
      verified: true,
    },
    {
      id: "claim-loss-54",
      text:
        "박성훈 국민의힘 의원은 지방선거 일주일 전 졸속 출시로 국민 피해가 54조원에 이른다고 주장했다. " +
        "이억원 금융위원장은 이 수치가 공식 분석이 아닌 시장 논평 수준의 추산이고 산정 범위가 레버리지 " +
        "상품 전체로 넓다며 \"굉장히 부정확하다\"고 답했다.",
      assertionType: "CLAIM",
      assertedBy: "박성훈 국민의힘 의원",
      sourceIds: ["src-ajunews-20261008", "src-fntimes-20261008"],
      verified: true,
    },
    {
      id: "claim-bluehouse-alleged",
      text:
        "국민의힘 박준태 의원은 2026년 1월 13일 김용범 당시 청와대 정책실장 주재 비공개 회의에서 도입이 " +
        "사실상 결정됐다고 주장했고, 송언석 의원은 1월 28일 금융위 보고자료에 하반기였던 출시 시점이 " +
        "3월 18일 관계기관 회의에서 2분기로 당겨진 배경을 따졌다.",
      assertionType: "CLAIM",
      assertedBy: "국민의힘 박준태·송언석 의원",
      sourceIds: ["src-ajunews-20261008"],
      verified: true,
    },
    {
      id: "claim-fsc-denial",
      text:
        "이억원 금융위원장은 2026년 10월 8일 정무위원회 국정감사에서 청와대 지시가 아니라 관계부처 협의로 " +
        "결정했다고 답했다. 3월 11일까지 40일간 입법예고에서 특별한 의견이 없어 일정을 당겼고, 2025년 " +
        "11월 한 달 해외 유출액이 60억 달러로 전년 같은 달(10억 달러)보다 크게 늘어 경제장관들이 우려했다고 " +
        "설명했다.",
      assertionType: "CLAIM",
      assertedBy: "이억원 금융위원장",
      sourceIds: ["src-ajunews-20261008", "src-hankook-20261008-etf"],
      verified: true,
    },
    {
      id: "claim-fsc-apology",
      text:
        "이억원 위원장은 같은 국정감사에서 손실과 피해 우려에 대해 송구하다며 일어서서 사과했다. 같은 " +
        "결정을 다시 하겠느냐는 질문에는 즉답을 피했다. 김용범 전 정책실장 등의 증인 채택은 여야 이견으로 " +
        "불발됐다.",
      assertionType: "FACT",
      sourceIds: ["src-ajunews-20261008", "src-hankook-20261008-etf"],
      verified: true,
    },
    {
      id: "claim-final-decision",
      text:
        "권대영 재정경제부 1차관은 2026년 10월 6일 재정경제위원회 국정감사에서 \"금융위가 최종 의사결정을 " +
        "내렸다\"고 답했다.",
      assertionType: "FACT",
      sourceIds: ["src-fnnews-20261007-etf"],
      verified: true,
    },
    {
      id: "claim-president-gap",
      text:
        "2026년 10월 17일까지 이재명 대통령이 이 건의 책임에 대해 직접 낸 입장이나 문책 조치는 찾지 못했다. " +
        "국정감사의 책임 공방은 금융위원장과 청와대 정책실 사이에서 오갔다.",
      assertionType: "INTERPRETATION",
      sourceIds: ["src-ajunews-20261008", "src-fnnews-20261007-etf"],
      verified: true,
    },
  ],
  critiqueIds: ["claim-loss-fss", "claim-loss-54", "claim-bluehouse-alleged"],
  timeline: [
    {
      id: "t-meeting",
      date: "2026-01-13",
      datePrecision: "day",
      title: "청와대 정책실장 주재 비공개 회의",
      summary: "야당은 이때 도입이 결정됐다고 주장. 금융위는 부인.",
      claimIds: ["claim-bluehouse-alleged", "claim-fsc-denial"],
    },
    {
      id: "t-decree",
      date: "2026-04-21",
      datePrecision: "day",
      title: "시행령 개정안 국무회의 의결",
      summary: "삼성전자·SK하이닉스 ±2배 상품 허용. 4월 28일 시행.",
      claimIds: ["claim-decree"],
    },
    {
      id: "t-listing",
      date: "2026-05-27",
      datePrecision: "day",
      title: "첫 상장",
      summary: "단일종목 레버리지 ETF·ETN 국내 첫 상장.",
      claimIds: ["claim-listing"],
    },
    {
      id: "t-halt",
      date: "2026-07-16",
      datePrecision: "day",
      title: "추가 상장 중단·예탁금 상향",
      summary: "기본예탁금 3,000만원, 광고 금지.",
      claimIds: ["claim-halt"],
    },
    {
      id: "t-audit",
      date: "2026-10-08",
      datePrecision: "day",
      title: "금융위 국정감사",
      summary: "이억원 위원장 사과, 청와대 지시는 부인.",
      claimIds: ["claim-fsc-apology", "claim-fsc-denial"],
    },
  ],
  gaps: [
    "2026년 1월 13일 청와대 회의의 회의록·참석자 발언은 공개되지 않아 확인하지 못했다.",
    "금감원 손실 집계(10개 증권사)가 전체 투자자 손실의 몇 할인지, 같은 기간 이익을 본 투자자는 얼마인지 확인하지 못했다.",
    "추가 상장 재개 여부와 금융위·청와대 인사의 거취는 2026년 10월 17일 현재 확인하지 못했다.",
  ],
  sources: [
    {
      id: "src-fsc-20260421",
      title: "국내-해외상장 ETF 간 비대칭 규제 해소를 위한 자본시장법 시행령 개정안 국무회의 의결",
      publisher: "금융위원회",
      url: "https://www.fsc.go.kr/po010101/86751",
      publishedAt: "2026-04-21",
      type: "official",
      license: "public",
    },
    {
      id: "src-korea-20260421",
      title: "내달 국내 우량종목 레버리지 ETF 첫 상장…투자자 보호도 강화",
      publisher: "대한민국 정책브리핑",
      url: "https://www.korea.kr/news/policyNewsView.do?newsId=148963133",
      publishedAt: "2026-04-21",
      type: "official",
      license: "public",
    },
    {
      id: "src-investchosun-20260716",
      title: "단일종목 레버리지 ETF 신규 출시 중단…예탁금 3000만원으로 상향",
      publisher: "인베스트조선",
      url: "https://www.investchosun.com/site/data/html_dir/2026/07/16/2026071680181.html",
      publishedAt: "2026-07-16",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-fnnews-20261007-etf",
      title: "'레버리지 사태' 두고 불거지는 금융위 책임론",
      publisher: "파이낸셜뉴스",
      url: "https://www.fnnews.com/news/202610071829222736",
      publishedAt: "2026-10-07",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-ajunews-20261008",
      title: "단일종목 레버리지 ETF 책임론 국감서 충돌…이억원 \"국민께 송구\"·靑 개입 부인",
      publisher: "아주경제",
      url: "https://www.ajunews.com/view/20261008130901374",
      publishedAt: "2026-10-08",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-hankook-20261008-etf",
      title: "'단일 레버리지'에 고개 숙인 이억원… \"돌아가도 같은 결정\" 질문에 즉답 피해",
      publisher: "한국일보",
      url: "https://www.hankookilbo.com/news/article/A2026100811500002469",
      publishedAt: "2026-10-08",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-fntimes-20261008",
      title: "[2026 국감]단일종목 레버리지 ETF 후폭풍…도입 필요성 인정한 금융위, 출시·시장감시는 '숙제'",
      publisher: "한국금융신문",
      url: "https://www.fntimes.com/html/view.php?ud=2026100816034972192a735e27af_18",
      publishedAt: "2026-10-08",
      type: "press",
      license: "link-only",
    },
  ],
};
