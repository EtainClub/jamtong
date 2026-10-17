import type { PolicyInput } from "./schema";

/**
 * 대선 부동산 공약과 현재 정책.
 *
 * "대선 때 부동산 공약과 지금 정책이 거꾸로 가는 이유는 무엇인가"라는 답글이
 * 돈다(2026년 10월). 선거공약서의 주거 항목은 공공임대·전월세·청년 주거였고
 * 세금 공약은 없었다. 후보는 "세금으로 집값 잡지 않겠다"고 말했다. 집권 뒤에는
 * 공급 계획과 함께 대출 규제·규제지역·양도세 중과가 시행됐고, 2026년 세제개편안은
 * 초고가·비거주 주택 종부세를 올린다. 공약서 문장과 후보 발언, 지금 정책을
 * 나란히 놓는다 — '거꾸로'인지는 읽는 사람이 판단할 몫이다.
 *
 * ★ 공약서 원문은 `src/content/pledges/presidential-21.ts`가 옮겨 두었다.
 * ★ 정책 세부와 시장 통계는 업적 `housing-stabilization`이 다룬다.
 * ★ 2026-10-17 처음 등록 — 잼통 Voice voice-gap 이슈 #42.
 */
export const HOUSING_PLEDGE_VS_POLICY: PolicyInput = {
  slug: "housing-pledge-vs-policy",
  title: "대선 부동산 공약과 현재 정책",
  scope:
    "제21대 대선 이재명 후보의 주거 공약·세금 발언과, 집권 뒤 대출·규제지역·양도세·종부세 정책의 비교",
  ministries: ["국토교통부", "금융위원회", "재정경제부"],
  categories: ["economy", "region"],
  asOf: "2026-10-17",
  rumors: [
    {
      id: "rumor-reversed",
      text: "대선 때 부동산 공약과 지금 정책이 거꾸로 간다",
      claimIds: ["claim-pledge-book", "claim-no-tax", "claim-tax-shift", "claim-tax-reform", "claim-compare"],
    },
  ],
  claims: [
    {
      id: "claim-pledge-book",
      text:
        "제21대 대선 선거공약서의 주거 항목은 고품질 공공임대주택과 공공임대 비율의 단계적 확대, 전세사기 " +
        "걱정 없는 보증제도 개선, 월세 세액공제 확대, 청년 맞춤형 공공분양·월세지원 확대, 신혼부부 공공임대 " +
        "공급 확대 등이다. 부동산 세금을 올리거나 내리는 공약은 없다.",
      assertionType: "FACT",
      sourceIds: ["src-pledge-21-housing"],
      verified: true,
    },
    {
      id: "claim-campaign-supply",
      text:
        "선거 기간 이 후보는 서울 노후 도심 재개발·재건축의 용적률 상향과 분담금 완화, 1기 신도시 인프라 " +
        "재정비, 4기 신도시 준비를 내세웠다. 2025년 5월 8일 유튜버 대담에서는 \"집을 사겠다는 사람들에게 " +
        "굳이 막 세금을 때려가지고 억누르지 말자\"고 말했다.",
      assertionType: "FACT",
      sourceIds: ["src-bizhankook-20250527"],
      verified: true,
    },
    {
      id: "claim-no-tax",
      text:
        "이 후보는 2025년 5월 28일 MBC 라디오 인터뷰에서 세금으로 집값을 잡는 일은 하지 않겠다며 목표는 " +
        "집값 안정이라고 말했다. 같은 날 낸 공약집에는 \"초고가 아파트 가격 상승 억제 중심에서 중산층, " +
        "저소득층을 위한 주택공급 중심의 주거정책에 집중하겠다\"고 적었다.",
      assertionType: "FACT",
      sourceIds: ["src-hankook-20250528"],
      verified: true,
    },
    {
      id: "claim-ccej",
      text:
        "경실련은 이 후보의 공약이 개발과 민간시장 확대 중심이고 종부세·재산세 정상화, 공시가격 현실화, " +
        "다주택자 과세 강화 공약은 없다고 비판했다.",
      assertionType: "CLAIM",
      assertedBy: "경제정의실천시민연합",
      sourceIds: ["src-bizhankook-20250527"],
      verified: true,
    },
    {
      id: "claim-demand-rules",
      text:
        "집권 뒤 정부는 2025년 6월 28일부터 수도권·규제지역 주택 구입 대출을 최대 6억 원으로 묶었고, " +
        "10월 15일 서울 전역과 경기 12곳을 규제지역·토지거래허가구역으로 지정해 LTV를 40%로 낮췄다. " +
        "2026년 2월 12일에는 다주택자 양도세 중과 유예를 5월 9일 끝낸다고 발표했다.",
      assertionType: "FACT",
      sourceIds: ["src-hpv-fsc-0627", "src-hpv-newsis-1015", "src-hpv-khan-0212"],
      verified: true,
    },
    {
      id: "claim-supply-plan",
      text:
        "정부는 2025년 9월 7일 2026~2030년 수도권 주택 135만 호 착공 계획을 발표했다. 착공 기준 계획이며 " +
        "실적은 아니다.",
      assertionType: "FACT",
      sourceIds: ["src-hpv-newsis-0907"],
      verified: true,
    },
    {
      id: "claim-tax-shift",
      text:
        "이재명 대통령은 2026년 3월 17일 국무회의에서 부동산 세금을 \"전쟁으로 치면 핵폭탄 같은 것\"이라고 " +
        "말했고, 3월 24일 X에 선진국 도시와 한국의 보유세를 비교한 기사를 공유하며 \"저도 궁금했다\"고 " +
        "썼다. 강유정 청와대 대변인은 초고가 아파트 보유세는 \"가장 최종적으로 검토할 정책 사안\"이라고 했다.",
      assertionType: "FACT",
      sourceIds: ["src-khan-20260324"],
      verified: true,
    },
    {
      id: "claim-tax-reform",
      text:
        "정부는 2026년 8월 3일 세제개편안에서 종부세를 주택 수가 아닌 가격 기준으로 바꾸고, 실거주 1주택 " +
        "기본공제를 12억 원에서 14억 원으로 늘리는 대신 비거주 1주택은 9억 원으로 줄이며, 고가 구간 세율을 " +
        "2028년까지 단계적으로 올리기로 했다. 정부는 3년간 종부세가 2조 1,815억 원 더 걷힐 것으로 봤다. " +
        "같은 안에는 규제지역 다주택자 양도세 중과를 2028년까지 한시 완화하는 내용도 들어 있다.",
      assertionType: "FACT",
      sourceIds: ["src-khan-20260803", "src-imbc-20260803"],
      verified: true,
    },
    {
      id: "claim-compare",
      text:
        "공약서에 세금 공약이 없었고 후보가 세금으로 집값을 잡지 않겠다고 했던 것과 비교하면, 양도세 중과 " +
        "재개와 초고가·비거주 종부세 인상안은 방향이 바뀐 부분이다. 반면 공급 확대와 공공임대·전월세 공약은 " +
        "계획으로 이어지고 있고, 세제개편안은 실거주 1주택 부담을 줄이는 쪽도 함께 담았다.",
      assertionType: "INTERPRETATION",
      sourceIds: ["src-pledge-21-housing", "src-hankook-20250528", "src-khan-20260803"],
      verified: true,
    },
  ],
  critiqueIds: ["claim-ccej", "claim-compare"],
  timeline: [
    {
      id: "t-radio",
      date: "2025-05-28",
      datePrecision: "day",
      title: "\"세금으로 집값 잡지 않겠다\"",
      summary: "MBC 라디오 인터뷰, 공약집 발간.",
      claimIds: ["claim-no-tax"],
    },
    {
      id: "t-loan",
      date: "2025-06-27",
      datePrecision: "day",
      title: "주택 구입 대출 6억 원 상한",
      summary: "6월 28일 시행.",
      claimIds: ["claim-demand-rules"],
    },
    {
      id: "t-supply",
      date: "2025-09-07",
      datePrecision: "day",
      title: "수도권 135만 호 착공 계획",
      summary: "2026~2030년.",
      claimIds: ["claim-supply-plan"],
    },
    {
      id: "t-1015",
      date: "2025-10-15",
      datePrecision: "day",
      title: "서울 전역 규제지역·토허구역",
      summary: "LTV 40%.",
      claimIds: ["claim-demand-rules"],
    },
    {
      id: "t-cgt",
      date: "2026-02-12",
      datePrecision: "day",
      title: "양도세 중과 유예 종료 발표",
      summary: "5월 10일부터 중과.",
      claimIds: ["claim-demand-rules"],
    },
    {
      id: "t-nuke",
      date: "2026-03-17",
      datePrecision: "day",
      title: "\"세금은 핵폭탄\"",
      summary: "국무회의 발언.",
      claimIds: ["claim-tax-shift"],
    },
    {
      id: "t-reform",
      date: "2026-08-03",
      datePrecision: "day",
      title: "2026년 세제개편안",
      summary: "초고가·비거주 종부세 인상, 실거주 공제 확대.",
      claimIds: ["claim-tax-reform"],
    },
  ],
  gaps: [
    "2026년 세제개편안이 국회를 통과했는지, 원안대로인지는 확인하지 못했다.",
    "세제개편안의 '양도세 중과 2028년까지 한시 완화'가 5월 10일부터 시행된 중과와 어떻게 맞물리는지 정부 원문으로 확인하지 못했다.",
    "1기 신도시 재정비·4기 신도시 공약의 진행 상황은 확인하지 못했다.",
  ],
  sources: [
    {
      id: "src-pledge-21-housing",
      title: "제21대 대통령선거 선거공약서 — 이재명(기호 1, 더불어민주당) 10대 공약",
      publisher: "더불어민주당 이재명 후보",
      url: "https://www.yeollimkorea.net/upload/new_board/B1747900260176.pdf",
      type: "official",
      license: "public",
    },
    {
      id: "src-bizhankook-20250527",
      title: "'공급 확대' 한목소리, 구체적 방안은 없어…대선 후보 부동산 공약 살펴보니",
      publisher: "비즈한국",
      url: "http://bizhankook.com/articles/29678.html",
      publishedAt: "2025-05-27",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-hankook-20250528",
      title: "이재명 \"세금으로 집값 잡지 않겠다...목표는 집값 안정\"",
      publisher: "한국일보",
      url: "https://www.hankookilbo.com/news/article/A2025052822320005424",
      publishedAt: "2025-05-28",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-hpv-fsc-0627",
      title: "가계부채 관리 방안 (보도자료)",
      publisher: "금융위원회",
      url: encodeURI("https://files-scs.pstatic.net/2025/06/27/6yDjjGw0Ji/250627(보도자료)가계부채 관리 방안.pdf"),
      publishedAt: "2025-06-27",
      type: "official",
      license: "public",
    },
    {
      id: "src-hpv-newsis-0907",
      title: "李정부 첫 주택공급 대책…5년간 수도권 135만호 착공 [9·7 주택공급 확대]",
      publisher: "뉴시스",
      url: "https://mobile.newsis.com/view/NISX20250907_0003318892",
      publishedAt: "2025-09-07",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-hpv-newsis-1015",
      title: "서울, 경기 12곳 LTV 70%→40% 축소",
      publisher: "뉴시스",
      url: "https://mobile.newsis.com/view/NISX20251016_0003365057",
      publishedAt: "2025-10-16",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-hpv-khan-0212",
      title: "다주택자 양도세 중과 유예 종료 Q&A",
      publisher: "경향신문",
      url: "https://www.khan.co.kr/article/202602121659001",
      publishedAt: "2026-02-12",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-khan-20260324",
      title: "이 대통령, 부동산 보유세 기사 소개…세제 개편 '빌드업'일까",
      publisher: "경향신문",
      url: "https://www.khan.co.kr/article/202603242019005/",
      publishedAt: "2026-03-24",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-khan-20260803",
      title: "[2026 세제개편안]초고가·비거주 종부세만 '핀셋 인상'",
      publisher: "경향신문",
      url: "https://www.khan.co.kr/article/202608032138005",
      publishedAt: "2026-08-03",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-imbc-20260803",
      title: "40억대 고가 주택 종부세 오르고, 32억 이하 주택은 부담 줄어든다",
      publisher: "MBC",
      url: "https://imnews.imbc.com/news/2026/econo/article/6842081_36932.html",
      publishedAt: "2026-08-03",
      type: "press",
      license: "link-only",
    },
  ],
};
