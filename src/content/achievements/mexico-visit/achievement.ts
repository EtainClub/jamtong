import { achievementSchema, type AchievementInput } from "@/content/schema";

/**
 * 멕시코 국빈방문 — 16년 만에 간 자리에서 무엇을 타결했고 무엇을 약속했나.
 *
 * 2026년 9월 23~26일 국빈방문과 24일 셰인바움 대통령과의 정상회담이 이 업적이다.
 *
 * ★ 이 업적을 처음 가져온 자료는 유튜브 숏츠 대본이었다. 대본은 출처가 아니다.
 *   대본의 문장을 하나씩 보도에 대 보고, 보도가 말하는 데까지만 적었다.
 *   대본과 달라진 곳이 셋이다.
 *
 *   1. "원유·배터리 원자재를 확보할 직통 통로를 열었다" →
 *      보도는 "원유와 핵심자원을 논의할 양국 부처 간 대화 채널을 출범하기로 했다"다.
 *      출범하기로 한 것은 논의 창구이고, 들어오기로 한 물량은 없다.
 *   2. "K-방산 멕시코 현지 생산·중남미 공동 진출" →
 *      이것은 합의가 아니라 이 대통령이 셰인바움 대통령에게 한 **요청**이다.
 *      실제로 맺은 것은 국방협력 양해각서와, KAI가 FA-50 등의 운영·유지보수
 *      협력과 현지 공급망 구축 가능성을 **검토**하기로 한 양해각서다.
 *   3. "합의 문건 17건" →
 *      17건은 양해각서·선언·의향서를 합한 수다. 계약이 아니다.
 *
 * ★ 투자보장협정은 '타결'이지 '발효'가 아니다.
 *   서명과 국회 비준동의가 남아 있다. 이 업적에서 무게가 가장 큰 것이 이
 *   협정이므로, 남은 절차를 연표와 반론에 같이 적는다.
 */

const raw: AchievementInput = {
  id: "mexico-visit",
  slug: "mexico-visit",
  title: "멕시코 국빈방문",
  subtitle: "16년 만의 국빈방문, 7년 끈 투자보장협정 개정을 타결했다",
  kicker: "외교·경제",
  categories: ["diplomacy", "economy"],
  summary:
    "2026년 9월 이재명 대통령이 한국 대통령으로서는 16년 만에 멕시코를 국빈방문했다. " +
    "24일 셰인바움 대통령과의 정상회담에서 7년간 이어진 투자보장협정 개정 협상을 " +
    "타결하고, 양국 수출입은행의 1억 달러 전대금융 신설과 원유·핵심자원 대화 채널 " +
    "출범, 무역협정 공동 이익 연구 착수에 합의했다. 양해각서·선언·의향서 17건을 " +
    "맺었다. 다만 협정은 서명과 국회 비준동의가 남았고, 17건은 대부분 양해각서다.",
  type: "policy",
  publishStatus: "published",
  featured: true,
  coverage: [
    {
      title: "이재명 대통령 유엔총회 참석·멕시코 국빈방문 일정 발표",
      date: "2026-09-21",
      url: "https://news.jamtong.kr/e/2026-09-21-cb89af/",
    },
    {
      title: "이재명 대통령, 미국·멕시코 순방 마치고 귀국길",
      date: "2026-09-27",
      url: "https://news.jamtong.kr/e/2026-09-27-0635e3/",
    },
  ],
  sourceNote:
    "정상회담 결과는 공동언론발표를 전한 보도로 확인했습니다. 17건의 문건 원문과 " +
    "공동행동계획 원문은 아직 대조하지 못했습니다. 투자보장협정은 이 업적 기준일인 " +
    "2026년 9월 27일 현재 타결 단계이며 서명·비준·발효 전입니다. 방산 분야의 " +
    "‘현지 생산·제3국 공동 진출’은 합의가 아니라 대통령의 요청으로 적었습니다.",

  headlineKeyNumberId: "kn-bit",

  scenes: [
    {
      id: "mx-motion",
      kind: "explainer",
      heading: "무엇을 맺었고, 무엇이 남았나",
      lede:
        "정상회담 결과를 네 장으로 나눴습니다. 단계를 넘기면 그림이 바뀌고, 둘째 장에서는 문서의 성격을 직접 골라 볼 수 있습니다.",
      claimIds: ["claim-bit", "claim-docs", "claim-channel", "claim-defense"],
      explainer: {
        note:
          "각 장의 문장은 보도로 확인한 데까지만 적었습니다. ‘타결’과 ‘발효’, ‘양해각서’와 ‘계약’, " +
          "‘창구’와 ‘물량’, ‘요청’과 ‘합의’를 서로 다른 칸에 둡니다.",
        chapters: [
          {
            id: "ch-bit",
            question: "투자보장협정은 지금 어디까지 왔나?",
            heading: "협정의 관문",
            steps: [
              {
                id: "s-negotiate",
                label: "7년의 협상",
                caption: "양국은 투자보장협정을 고치는 협상을 7년간 이어 왔다.",
                readout: { value: "7", unit: "년", note: "개정 협상 기간" },
              },
              {
                id: "s-settle",
                label: "타결",
                caption:
                  "2026년 9월 24일(현지시간) 정상회담 뒤 공동언론발표에서 이 대통령이 개정 협상 타결을 밝혔다.",
              },
              {
                id: "s-left",
                label: "남은 관문",
                caption:
                  "타결은 내용에 합의했다는 뜻이다. 서명과 국회 비준동의를 거쳐야 발효된다. 이 위키 기준일까지 서명은 확인되지 않았다.",
                readout: { value: "3", unit: "개 관문", note: "서명 · 국회 비준동의 · 발효" },
              },
            ],
            visual: {
              kind: "stage-gates",
              stages: [
                { id: "negotiate", label: "개정 협상", note: "7년간", status: "done" },
                { id: "settle", label: "타결", note: "2026.9.24", status: "done" },
                { id: "sign", label: "서명", status: "pending" },
                { id: "consent", label: "국회 비준동의", status: "pending" },
                { id: "effect", label: "발효", status: "pending" },
              ],
              asOfLabel: "2026년 9월 27일 기준",
              pendingLabel: "남은 관문",
            },
            takeaway: "타결은 끝이 아니다. 서명·비준동의·발효, 세 관문이 남았다.",
            claimId: "claim-bit",
          },
          {
            id: "ch-docs",
            question: "17건은 어떤 문서인가?",
            heading: "17건의 성격",
            steps: [
              {
                id: "s-heap",
                label: "한 묶음",
                caption: "정상회담을 계기로 양국이 맺은 문서는 모두 17건이다.",
                readout: { value: "17", unit: "건" },
              },
              {
                id: "s-sort",
                label: "성격별로",
                caption:
                  "성격별로 나누면 양해각서가 14건이고, 경제 및 산업·자원 협력 이니셔티브와 경제과학기술공동위 재개 의향서, AI 협력 선언이 1건씩이다.",
                readout: { value: "14", unit: "건", note: "양해각서" },
              },
              {
                id: "s-empty",
                label: "계약 칸",
                caption:
                  "17건 목록에 계약은 없다. 양해각서는 협력하자는 합의문이지 계약이 아니다.",
                readout: { value: "0", unit: "건", note: "계약" },
              },
            ],
            visual: {
              kind: "doc-sort",
              totalLabel: "정상회담 계기 체결 문건",
              types: [
                { id: "mou", label: "양해각서" },
                { id: "initiative", label: "이니셔티브" },
                { id: "intent", label: "의향서" },
                { id: "declaration", label: "선언" },
              ],
              items: [
                { id: "d-scholar", label: "장학금 및 학술교류", typeId: "mou" },
                { id: "d-forum", label: "국제개발협력포럼 신설", typeId: "mou" },
                { id: "d-culture", label: "문화협력", typeId: "mou" },
                { id: "d-tour", label: "관광협력", typeId: "mou" },
                { id: "d-economy", label: "경제 및 산업·자원 협력", typeId: "initiative" },
                { id: "d-customs", label: "세관협력", typeId: "mou" },
                { id: "d-finance", label: "전대금융", typeId: "mou" },
                { id: "d-agri", label: "농업기술 협력", typeId: "mou" },
                { id: "d-sci", label: "경제과학기술공동위 재개", typeId: "intent" },
                { id: "d-ai", label: "AI 협력", typeId: "declaration" },
                { id: "d-defense", label: "국방협력", typeId: "mou" },
                { id: "d-anticorr", label: "반부패 상호협력", typeId: "mou" },
                { id: "d-livestock", label: "수입 축산물 전자증명", typeId: "mou" },
                { id: "d-ip", label: "지식재산 심화 협력", typeId: "mou" },
                { id: "d-space", label: "우주협력", typeId: "mou" },
                { id: "d-police", label: "치안협력", typeId: "mou" },
                { id: "d-aero", label: "항공우주 산업 협력", typeId: "mou" },
              ],
              emptyBin: {
                label: "계약",
                note: "보도된 17건 목록에 계약은 들어 있지 않습니다.",
              },
            },
            takeaway:
              "17건은 대부분 양해각서다. 이 방문에서 협정으로 타결된 것은 투자보장협정 하나다.",
            claimId: "claim-docs",
          },
          {
            id: "ch-channel",
            question: "멕시코 원유를 들여오기로 했나?",
            heading: "대화 채널",
            steps: [
              {
                id: "s-two",
                label: "공급망 분야",
                caption: "정상회담에서 두 나라는 공급망 분야도 다뤘다.",
              },
              {
                id: "s-open",
                label: "채널 출범",
                caption: "양국은 원유와 핵심자원을 논의할 부처 간 대화 채널을 출범하기로 했다.",
              },
              {
                id: "s-cargo",
                label: "물량 칸",
                caption:
                  "그 채널로 얼마를 들여오기로 했는지는 보도되지 않았다. 창구가 생긴 것과 물량이 오는 것은 다른 일이다.",
              },
            ],
            visual: {
              kind: "channel-open",
              left: "한국",
              right: "멕시코",
              channelLabel: "원유·핵심자원 부처 간 대화 채널",
              cargoLabel: "들여오기로 한 물량",
              emptyLabel: "보도된 것 없음",
            },
            takeaway: "열린 것은 논의 창구다. 확보했다는 물량은 보도되지 않았다.",
            claimId: "claim-channel",
          },
          {
            id: "ch-defense",
            question: "방산 협력은 어디까지 합의됐나?",
            heading: "맺은 것과 요청한 것",
            steps: [
              {
                id: "s-pool",
                label: "방산 협력",
                caption: "방산 분야에서 나온 이야기를 한데 모으면 다섯 가지다.",
              },
              {
                id: "s-signed",
                label: "문서로 맺은 것",
                caption:
                  "문서로 맺은 것은 국방협력 양해각서, 그리고 KAI가 FA-50 등의 운영·유지보수 기술 협력과 멕시코 현지 공급망 구축 가능성을 검토하기로 한 항공우주 산업 협력 양해각서다.",
              },
              {
                id: "s-asked",
                label: "요청한 것",
                caption:
                  "멕시코 현지 생산과 제3국 시장 공동 진출은 이 대통령이 셰인바움 대통령에게 관심과 지원을 요청한 내용이다. 합의가 아니다.",
              },
            ],
            visual: {
              kind: "ask-vs-signed",
              poolLabel: "방산 협력",
              signedLabel: "문서로 맺은 것",
              askedLabel: "요청한 것",
              items: [
                { id: "sig-defense", label: "국방협력 양해각서", side: "signed" },
                {
                  id: "sig-om",
                  label: "FA-50·무인항공기·위성 운영·유지보수 기술 협력 검토",
                  side: "signed",
                },
                { id: "sig-supply", label: "멕시코 현지 공급망 구축 가능성 검토", side: "signed" },
                { id: "ask-local", label: "멕시코 현지 생산", side: "asked" },
                { id: "ask-third", label: "제3국 시장 공동 진출", side: "asked" },
              ],
            },
            takeaway: "현지 생산은 요청이고, 문서로 합의한 것은 ‘검토’까지다.",
            claimId: "claim-defense",
          },
        ],
      },
    },
  ],

  /**
   * ⑦ 쇼츠. 유튜브에 올린 뒤 id만 적는다. 비어 있으면 화면과 탭에서 빠진다.
   *
   *   youtube.com/shorts/AbCdEfGhIjK  →  youtubeId: "AbCdEfGhIjK"
   *
   * ★ 영상이 이 업적보다 앞서 나가면 안 된다.
   *   원유는 '확보'가 아니라 '대화 채널 출범', 방산 현지 생산은 '합의'가 아니라
   *   '요청', 투자보장협정은 '발효'가 아니라 '타결'이다. 영상에서 말한 내용의
   *   근거를 claimIds에 단다.
   *
   *   shorts: [
   *     {
   *       id: "short-mexico-01",
   *       title: "16년 만의 멕시코 국빈방문, 무엇을 맺었나",
   *       summary: "타결된 협정과 아직 남은 절차를 1분 안에 봅니다.",
   *       youtubeId: "AbCdEfGhIjK",
   *       claimIds: ["claim-visit", "claim-bit", "claim-docs"],
   *       publishedAt: "2026-09-27",
   *     },
   *   ],
   */
  shorts: [
    {
      id: "short-mexico-01",
      title: "멕시코에서 챙겨온 이재명 정부의 핵심 외교 실적",
      summary:
        "16년 만의 국빈방문에서 맺은 것들을 짧게 봅니다. 무엇이 타결이고 무엇이 요청인지는 아래 근거에서 확인할 수 있습니다.",
      youtubeId: "lstcFrcrC9Q",
      durationSec: 93,
      claimIds: [
        "claim-visit",
        "claim-bit",
        "claim-finance",
        "claim-channel",
        "claim-docs",
        "claim-defense-ask",
      ],
      publishedAt: "2026-09-26",
    },
  ],

  eli5: {
    intro:
      "한국 대통령이 멕시코에 가서 무엇을 약속하고 왔는지, 그리고 무엇이 아직 남았는지 봐요.",
    scenes: [
      {
        id: "e-mx-visit",
        title: "16년 만에 갔어요",
        say: "한국 대통령이 멕시코에 정식 손님(국빈)으로 간 건 16년 만이에요. 멕시코 대통령이 초대했어요.",
        art: "mx-visit",
        fact: { value: "16년 만", tone: "ice" },
        claimIds: ["claim-visit"],
      },
      {
        id: "e-mx-treaty",
        title: "7년 걸린 약속을 마무리했어요",
        say: "서로의 나라에 투자한 회사를 지켜 주는 약속(투자보장협정)을 고치는 협상이 7년 걸렸는데, 이번에 타결됐어요.",
        art: "mx-treaty",
        fact: { value: "7년", tone: "ice" },
        claimIds: ["claim-bit"],
      },
      {
        id: "e-mx-steps",
        title: "아직 효력은 없어요",
        say: "타결은 '내용에 합의했다'는 뜻이에요. 서명하고 국회가 동의해야 비로소 효력이 생겨요.",
        art: "mx-steps",
        claimIds: ["claim-bit"],
      },
      {
        id: "e-mx-bank",
        title: "물건 살 돈을 빌려줘요",
        say: "두 나라 수출입은행이 1억 달러를 마련해서, 한국 물건을 사려는 쪽이 돈을 빌릴 수 있게 했어요.",
        art: "mx-bank",
        fact: { value: "1억 달러", tone: "ice" },
        claimIds: ["claim-finance"],
      },
      {
        id: "e-mx-channel",
        title: "기름 이야기할 창구를 열어요",
        say: "원유와 핵심자원을 이야기할 정부 창구를 만들기로 했어요. 기름을 얼마나 들여오기로 했다는 소식은 아직 없어요.",
        art: "mx-channel",
        claimIds: ["claim-channel"],
      },
      {
        id: "e-mx-docs",
        title: "문서 17건, 대부분 약속문이에요",
        say: "17건 가운데 14건은 '같이 해 보자'는 양해각서예요. 계약서는 들어 있지 않아요.",
        art: "mx-docs",
        fact: { value: "17건", tone: "ice" },
        claimIds: ["claim-docs"],
      },
      {
        id: "e-mx-jet",
        title: "전투기는 부탁한 단계예요",
        say: "대통령은 한국 무기를 멕시코에서 만들자고 부탁했어요. 문서로 합의한 건 '같이 검토해 보자'까지예요.",
        art: "mx-jet",
        claimIds: ["claim-defense", "claim-defense-ask"],
      },
    ],
    caveat: {
      text:
        "지금 확인된 건 '합의했다'와 '약속했다'까지예요. 협정은 서명과 국회 동의가 남았고, 기름이나 무기 생산은 아직 정해진 게 없어요.",
      claimIds: ["claim-bit", "claim-channel", "claim-defense-ask"],
    },
  },

  keyNumbers: [
    {
      id: "kn-bit",
      label: "투자보장협정 개정 협상",
      value: "7",
      unit: "년 만에 타결",
      caption: "서명과 국회 비준동의가 남았다",
      claimId: "claim-bit",
    },
    {
      id: "kn-docs",
      label: "정상회담 계기 체결 문건",
      value: "17",
      unit: "건",
      caption: "양해각서·선언·의향서를 합한 수 · 계약이 아니다",
      claimId: "claim-docs",
    },
    {
      id: "kn-finance",
      label: "수출입은행 전대금융 신설",
      value: "1억",
      unit: "달러",
      caption: "약 1,400억 원 · 한국산 물품·서비스 구매 자금",
      claimId: "claim-finance",
    },
    {
      id: "kn-visit",
      label: "한국 대통령의 멕시코 국빈방문",
      value: "16",
      unit: "년 만",
      caption: "셰인바움 대통령 초청",
      claimId: "claim-visit",
    },
  ],

  timeline: [
    {
      id: "mx-arrive",
      date: "2026-09-23",
      displayDate: "2026년 9월 23일 (현지시간)",
      datePrecision: "day",
      title: "멕시코시티 도착",
      summary:
        "뉴욕 유엔총회 일정을 마치고 멕시코시티에 도착했다. 셰인바움 대통령의 초청으로 성사된, 한국 대통령으로서 16년 만의 국빈방문이다.",
      claimIds: ["claim-visit"],
    },
    {
      id: "mx-summit",
      date: "2026-09-24",
      displayDate: "2026년 9월 24일 (현지시간)",
      datePrecision: "day",
      title: "한-멕시코 정상회담",
      summary:
        "투자보장협정 개정 협상 타결을 발표하고, 1억 달러 전대금융 신설, 원유·핵심자원 부처 간 대화 채널 출범, 무역협정 공동 이익 연구 착수에 합의했다. ‘2026-2030 공동행동계획’과 ‘AI 협력 선언’을 채택하는 등 17건의 문건을 맺었다. 개정 협정은 서명과 국회 비준동의를 거쳐야 발효된다.",
      claimIds: ["claim-bit", "claim-finance", "claim-channel", "claim-trade", "claim-docs"],
    },
  ],

  graph: {
    note:
      "정상회담에서 누가 누구와 무엇을 맺었는지를 그렸다. 타결·신설처럼 정해진 것과 " +
      "검토·요청 단계인 것을 선 위의 설명에 나눠 적었다.",
    entities: [
      { id: "kr-gov", name: "대한민국 정부", kind: "government", isFocus: true,
        description: "국빈방문과 정상회담으로 협정을 타결한 쪽" },
      { id: "mx-gov", name: "멕시코 정부", kind: "government",
        description: "셰인바움 대통령. 국빈방문을 초청했다" },
      { id: "kexim", name: "한국수출입은행", kind: "organization",
        description: "1억 달러 전대금융을 신설하는 쪽" },
      { id: "kai", name: "한국항공우주산업(KAI)", kind: "company",
        description: "FA-50 등 플랫폼의 운영·유지보수 협력을 검토한다" },
    ],
    relations: [
      {
        id: "mx-r-bit",
        fromId: "kr-gov",
        toId: "mx-gov",
        label: "투자보장협정 개정 협상을 7년 만에 타결했다. 서명과 비준이 남았다.",
        startDate: "2026-09-24",
        startPrecision: "day",
        assertionType: "FACT",
        claimIds: ["claim-bit"],
        bidirectional: true,
      },
      {
        id: "mx-r-channel",
        fromId: "kr-gov",
        toId: "mx-gov",
        label: "원유·핵심자원을 논의할 부처 간 대화 채널을 출범하기로 했다.",
        startDate: "2026-09-24",
        startPrecision: "day",
        assertionType: "FACT",
        claimIds: ["claim-channel"],
        bidirectional: true,
      },
      {
        id: "mx-r-finance",
        fromId: "kexim",
        toId: "mx-gov",
        label: "1억 달러 규모 전대금융을 신설한다.",
        startDate: "2026-09-24",
        startPrecision: "day",
        assertionType: "FACT",
        claimIds: ["claim-finance"],
      },
      {
        id: "mx-r-kai",
        fromId: "kai",
        toId: "mx-gov",
        label: "FA-50 등의 운영·유지보수 협력과 현지 공급망 구축 가능성을 검토하기로 한 양해각서.",
        startDate: "2026-09-24",
        startPrecision: "day",
        assertionType: "FACT",
        claimIds: ["claim-defense"],
      },
    ],
  },

  counterpoints: [
    {
      id: "mx-cp-docs",
      question: "17건이면 큰 성과 아닌가?",
      response:
        "17건은 양해각서·선언·의향서를 합한 수다. 장학·관광·세관·치안·우주 협력처럼 분야는 넓지만, 양해각서는 ‘같이 해 보자’는 합의문이지 계약이 아니다. 이 방문에서 협정으로 타결된 것은 투자보장협정 개정 하나이고, 그것도 서명과 국회 비준동의를 거쳐야 효력이 생긴다.",
      claimIds: ["claim-docs", "claim-bit"],
    },
    {
      id: "mx-cp-oil",
      question: "멕시코 원유와 핵심광물을 확보했나?",
      response:
        "아니다. 합의한 것은 원유와 핵심자원을 ‘논의할’ 양국 부처 간 대화 채널을 출범하는 것이다. 들여오기로 한 물량이나 계약은 보도되지 않았다. 창구가 생긴 것과 물량이 들어오는 것은 다른 일이다.",
      claimIds: ["claim-channel"],
    },
    {
      id: "mx-cp-defense",
      question: "K-방산이 멕시코에서 현지 생산하게 됐나?",
      response:
        "아직 아니다. 현지 생산과 제3국 시장 공동 진출은 이 대통령이 셰인바움 대통령에게 관심과 지원을 ‘요청’한 내용이다. 실제로 맺은 것은 국방협력 양해각서와, KAI가 FA-50·무인항공기·위성 등의 운영·유지보수 기술 협력과 멕시코 현지 공급망 구축 ‘가능성을 검토’하기로 한 항공우주 산업 협력 양해각서다.",
      claimIds: ["claim-defense", "claim-defense-ask"],
    },
  ],

  claims: [
    {
      id: "claim-visit",
      text:
        "이재명 대통령은 2026년 9월 23일(현지시간) 뉴욕 유엔총회 일정을 마치고 멕시코시티에 도착해 국빈방문 일정에 들어갔다. 셰인바움 대통령의 초청으로 성사됐고, 한국 대통령의 멕시코 국빈방문은 16년 만이다.",
      assertionType: "FACT",
      sourceIds: ["src-asiae-mx"],
      verified: true,
    },
    {
      id: "claim-bit",
      text:
        "2026년 9월 24일(현지시간) 한-멕시코 정상회담 뒤 공동언론발표에서 이 대통령은 “양국은 7년간 진행된 투자보장협정 개정 협상을 드디어 성공적으로 타결했다”며 “서명과 국회 비준 동의 등 필요한 절차를 거쳐 협정이 조속히 발효되도록 함께 노력하기로 했다”고 밝혔다.",
      assertionType: "FACT",
      sourceIds: ["src-newspim-mx"],
      verified: true,
    },
    {
      id: "claim-finance",
      text:
        "양국 수출입은행은 1억 달러(약 1,400억 원) 규모의 전대금융을 신설한다. 현지 은행에 신용한도를 설정해 한국산 물품·서비스 구매자에게 자금을 빌려주는 방식이다. 정상회담 계기 체결 문건에 전대금융 양해각서가 포함됐다.",
      assertionType: "FACT",
      sourceIds: ["src-newspim-mx", "src-mt-mx"],
      verified: true,
    },
    {
      id: "claim-channel",
      text:
        "양국은 공급망 분야에서 원유와 핵심자원을 논의할 양국 부처 간 대화 채널을 출범하기로 했다.",
      assertionType: "FACT",
      sourceIds: ["src-newspim-mx"],
      verified: true,
    },
    {
      id: "claim-trade",
      text:
        "양국은 무역협정 체결에 필요한 공동 이익 연구에 착수하기로 합의했다.",
      assertionType: "FACT",
      sourceIds: ["src-newspim-mx"],
      verified: true,
    },
    {
      id: "claim-docs",
      text:
        "정상회담을 계기로 양국은 17건의 양해각서와 선언·의향서 등을 체결했다. 장학금·학술교류, 문화·관광·세관·농업기술·국방·반부패·지식재산·우주·치안·항공우주 산업 협력 양해각서, 경제 및 산업·자원 협력 이니셔티브, 경제과학기술공동위 재개 의향서, AI 협력 선언 등이다. 보도된 목록으로 세면 양해각서가 14건이고, 이니셔티브·의향서·선언이 1건씩이다. 두 정상은 ‘2026-2030 한·멕시코 공동 행동 계획’도 채택했다.",
      assertionType: "FACT",
      sourceIds: ["src-mt-mx", "src-etoday-mx", "src-newspim-mx"],
      verified: true,
    },
    {
      id: "claim-defense",
      text:
        "항공우주 산업 협력 양해각서에 따라 한국항공우주산업(KAI) 등은 FA-50과 무인항공기, 위성 등 KAI 플랫폼의 운영·유지보수 기술 협력과 멕시코 현지 공급망 구축 가능성을 검토하기로 했다. 국방협력 양해각서도 체결됐다.",
      assertionType: "FACT",
      sourceIds: ["src-etoday-mx", "src-mt-mx"],
      verified: true,
    },
    {
      id: "claim-defense-ask",
      text:
        "이 대통령은 “한국의 우수한 방산 기술이 멕시코 현지 생산으로 이어져 멕시코 방위산업 역량 강화에 기여하고 양국이 제3국 시장에 공동 진출할 수 있도록 셰인바움 대통령의 특별한 관심과 지원을 요청했다”고 밝혔다.",
      assertionType: "CLAIM",
      assertedBy: "이재명 대통령",
      sourceIds: ["src-newspim-mx"],
      verified: true,
    },
  ],

  sources: [
    {
      id: "src-newspim-mx",
      title: "李대통령 \"한·멕시코 무역협정 체결 필요\"…투자보장협정 7년 만에 타결",
      url: "https://www.newspim.com/news/view/20260925000021",
      publisher: "뉴스핌",
      publishedAt: "2026-09-25",
      type: "press",
      license: "quotable",
      quote:
        "양국은 7년간 진행된 투자보장협정 개정 협상을 드디어 성공적으로 타결했다. " +
        "양국 수출입은행은 1억 달러(1400억원) 규모의 전대금융을 신설한다. " +
        "공급망 분야에서는 원유와 핵심자원을 논의할 양국 부처 간 대화 채널을 " +
        "출범하기로 했다.",
    },
    {
      id: "src-mt-mx",
      title: "FA-50 등 방산협력 강화…한-멕시코, 17개 문건 체결",
      url: "https://www.mt.co.kr/politics/2026/09/25/2026092505143596847",
      publisher: "머니투데이",
      publishedAt: "2026-09-25",
      type: "press",
      license: "quotable",
      quote:
        "이재명 대통령의 멕시코 국빈방문을 계기로 한국과 멕시코 간 항공우주 산업 " +
        "협력 양해각서(MOU) 등 17개 문건이 체결됐다.",
    },
    {
      id: "src-etoday-mx",
      title: "한·멕시코, 무역협정·방산·공급망 협력 가속…17개 문건 체결",
      url: "https://www.etoday.co.kr/news/view/2629339",
      publisher: "이투데이",
      publishedAt: "2026-09-25",
      type: "press",
      license: "quotable",
      quote:
        "17건의 양해각서(MOU)와 선언·의향서 등을 체결했다. FA-50과 무인항공기, " +
        "위성 등 KAI 플랫폼의 운영·유지보수 기술 협력과 멕시코 현지 공급망 구축 " +
        "가능성을 검토하고",
    },
    {
      id: "src-asiae-mx",
      title: "李대통령, 멕시코 도착…16년 만의 국빈방문 일정 돌입",
      url: "https://view.asiae.co.kr/article/2026092411115761696",
      publisher: "아시아경제",
      publishedAt: "2026-09-24",
      type: "press",
      license: "quotable",
      quote: "한국 대통령의 멕시코 국빈방문은 16년 만이다.",
    },
  ],
};

export const mexicoVisit = achievementSchema.parse(raw);
