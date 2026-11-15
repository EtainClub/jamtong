import type { PolicyInput } from "./schema";

/**
 * '존경하는 박근혜 대통령' 발언(2021년 12월)과 해명, 그리고 '말 바꾸기' 비판이 가리키는 입장 변화들.
 *
 * 2026년 11월 인스타그램 게시물이 "박근혜를 '존경하는 대통령'이라고 직접 표현했다가 논란이 되자 '진짜
 * 존경한다는 뜻이 아니다'라고 해명했다", "자기가 한 말을 번번이 뒤집어 왔다"고 올렸다(신고 센터
 * factbot-gap #286·#288·#289).
 *
 * ★ 발언은 대통령 재임 중이 아니라 2021년 대선 후보 때다. 시점을 밝힌다.
 * ★ '번번이 뒤집었다'는 평가다. 평가 자체를 판정하지 않고, 입장이 실제로 바뀐 기록이 있는 사례와 그때
 *   본인이 든 이유, 비판을 함께 적는다. 사례 목록은 다 모은 것이 아니다(gaps).
 * ★ 국토보유세의 그 뒤는 policy:land-holding-tax, 금투세는 policy:capital-taxes에 더 있다.
 * ★ 2026-11-15 처음 등록 — factbot-gap #286·#288·#289.
 */
export const PARK_RESPECT_REMARK: PolicyInput = {
  slug: "park-respect-remark",
  title: "'존경하는 박근혜' 발언과 '말 바꾸기' 비판",
  scope:
    "2021년 12월 3일 전주 간담회의 '존경하는 박근혜 전 대통령' 발언과 12월 7일 서울대 강연의 해명, 선거캠프 설명, " +
    "그리고 '말 바꾸기' 비판이 가리키는 국토보유세·기본소득(2021)과 금투세(2024) 입장 변화",
  ministries: [],
  categories: ["institution"],
  asOf: "2026-11-15",
  rumors: [
    {
      id: "rumor-respect",
      text: "이재명 대통령이 박근혜를 '존경하는 대통령'이라고 직접 표현했다가 논란이 되자 '진짜 존경한다는 뜻이 아니다'라고 해명했다",
      claimIds: ["claim-remark", "claim-explanation", "claim-camp", "claim-reaction"],
    },
    {
      id: "rumor-flip",
      text: "이재명 대통령이 자기가 한 말을 번번이 뒤집어 왔다",
      claimIds: ["claim-explanation", "claim-land-tax-2021", "claim-land-tax-2025", "claim-fit", "claim-fit-critique"],
    },
  ],
  claims: [
    {
      id: "claim-remark",
      text:
        "이재명 당시 더불어민주당 대선 후보는 2021년 12월 3일 전북 전주의 한 '가맥집'에서 청년들과 한 간담회에서 지지자 응원의 " +
        "효과를 설명하며 \"우리 존경하는 박근혜 전 대통령께서, 대통령 하시다가 힘들 때 대구 서문시장을 갔다는 거 아닙니까. " +
        "거기 가면 힘이 쫙 나지\"라고 말했다. 대통령 재임 중이 아니라 대선 후보 때의 발언이다.",
      assertionType: "FACT",
      sourceIds: ["src-dt-20211207"],
      verified: true,
    },
    {
      id: "claim-explanation",
      text:
        "나흘 뒤인 12월 7일 서울대 강연에서 그는 \"존경하는 박 전 대통령이라고 말하니 진짜 존경한다고 알고 '표 얻으려고 존경하는 " +
        "척하는 것 아니냐' 하는데 전혀 아니다. 이는 우리 국민들의 집단 지성 수준을 무시하는 일\"이라고 했다. 학생이 다른 발언을 " +
        "지적하자 \"말이라는 것은 맥락이 있는데 맥락을 무시한 것이 진짜 문제\"라고도 했다.",
      assertionType: "FACT",
      sourceIds: ["src-asiae-20211207", "src-dt-20211207"],
      verified: true,
    },
    {
      id: "claim-camp",
      text: "선거캠프는 \"전직 대통령에 대한 의례적인 표현에 대한 지나친 확대해석\"이라고 설명했다.",
      assertionType: "CLAIM",
      assertedBy: "이재명 후보 선거캠프(2021년)",
      sourceIds: ["src-dt-20211207"],
      verified: true,
    },
    {
      id: "claim-reaction",
      text:
        "당시 발언을 두고 대선을 앞두고 중도·보수층 표를 의식한 것 아니냐는 해석이 나왔다. 해명의 '표 얻으려고 존경하는 척하는 것 " +
        "아니냐'는 말은 이 후보가 그런 의심을 소개하며 반박한 것이다.",
      assertionType: "FACT",
      sourceIds: ["src-asiae-20211207", "src-dt-20211207"],
      verified: true,
    },
    {
      id: "claim-land-tax-2021",
      text:
        "국토보유세와 기본소득은 2021년 대선 때 증세 논란이 일자 '국민이 반대하면 안 한다'는 쪽으로 물러섰다는 보도가 나왔다. 이 후보는 " +
        "12월 7일 \"정책 철회한 적 없다. 최대한 설득해 동의 받을 것\"이라며, 기본소득위원회 같은 것을 만들어 충분히 논의한 뒤 국민이 " +
        "동의하면 시행하겠다고 했다. 같은 날 전국민재난지원금은 \"정책 자체를 포기한 것이 아니라 이번 본예산에 넣는 것을 양보한다는 " +
        "뜻\"이라고 했다.",
      assertionType: "FACT",
      sourceIds: ["src-newspim-20211207"],
      verified: true,
    },
    {
      id: "claim-land-tax-2025",
      text:
        "2025년 21대 대선에서는 국토보유세를 공약으로 내지 않았다. 당시 그는 \"경제 상황이 어려운 만큼 국민에게 부담을 전가하는 증세는 " +
        "바람직하지 않다\"며 국토보유세·탄소세 같은 새 세금은 도입하지 않겠다고 했다.",
      assertionType: "FACT",
      sourceIds: ["src-taxwatch-20250514-flip"],
      verified: true,
    },
    {
      id: "claim-fit",
      text:
        "금융투자소득세는 2024년 8월 전당대회 때 사견을 전제로 시행 유예 필요성을 꺼냈고, 11월 4일 최고위원회의에서 \"정부와 여당이 " +
        "밀어붙이는 금투세 폐지에 동의하기로 했다\"고 밝혔다. 이유로는 \"현재 주식 시장이 너무 어렵다\"는 점을 들었다.",
      assertionType: "FACT",
      sourceIds: ["src-segye-20241105", "src-weeklykhan-20241104-flip"],
      verified: true,
    },
    {
      id: "claim-fit-critique",
      text:
        "이 대표는 금투세 폐지 동의에 대해 \"원칙과 가치를 져버렸다고 하는 개혁·진보 진영의 비난을 아프게 받아들인다\"고 했다. " +
        "참여연대·경실련·민주노총 등은 11월 7일 국회 앞 기자회견에서 민주당에 금투세 폐지 입장 철회를 요구했고, 이 자리에서 \"금투세 폐지는 대표적인 부자감세\"라는 발언이 나왔다.",
      assertionType: "FACT",
      sourceIds: ["src-segye-20241105", "src-pspd-20241107"],
      verified: true,
    },
  ],
  critiqueIds: ["claim-reaction", "claim-fit-critique"],
  timeline: [
    {
      id: "t-remark",
      date: "2021-12-03",
      datePrecision: "day",
      title: "전주 간담회 '존경하는 박근혜' 발언",
      summary: "대구 서문시장 일화를 들며 한 말.",
      claimIds: ["claim-remark"],
    },
    {
      id: "t-explanation",
      date: "2021-12-07",
      datePrecision: "day",
      title: "서울대 강연에서 해명",
      summary: "같은 날 국토보유세 \"철회한 적 없다\".",
      claimIds: ["claim-explanation", "claim-land-tax-2021"],
    },
    {
      id: "t-fit",
      date: "2024-11-04",
      datePrecision: "day",
      title: "금투세 폐지 동의",
      summary: "8월에는 유예를 꺼냈다.",
      claimIds: ["claim-fit"],
    },
    {
      id: "t-pledge-2025",
      date: "2025-05-14",
      datePrecision: "day",
      title: "21대 대선, 국토보유세 공약 제외",
      summary: "새 세금은 도입하지 않겠다고 했다.",
      claimIds: ["claim-land-tax-2025"],
    },
  ],
  gaps: [
    "전주 간담회 발언의 전체 녹취는 확인하지 못했다. 발언은 디지털타임스가 옮긴 문장이다.",
    "'말 바꾸기'로 지목되는 사례를 모두 모은 것은 아니다. 공개 기록으로 입장 변화와 본인 설명이 확인되는 국토보유세·기본소득·금투세만 적었다.",
  ],
  sources: [
    {
      id: "src-dt-20211207",
      title: "이재명, '존경하는 박근혜 대통령' 발언 해명…\"맥락 무시한 게 진짜 문제\"",
      publisher: "디지털타임스",
      url: "https://www.dt.co.kr/article/11421403",
      publishedAt: "2021-12-07",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-asiae-20211207",
      title: "이재명 \"'존경하는 박근혜'라 하니 진짜 존경하는 줄 알아\"",
      publisher: "아시아경제",
      url: "https://view.asiae.co.kr/article/2021120714364756856",
      publishedAt: "2021-12-07",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-newspim-20211207",
      title: "이재명 \"국토보유세 포기? 위원회 만들어 논의 후 동의되면 시행\"",
      publisher: "뉴스핌",
      url: "https://newspim.com/news/view/20211207000855",
      publishedAt: "2021-12-07",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-taxwatch-20250514-flip",
      title: "\"증세 없다\" 외친 여야…세금 공약, 어떻게 다를까?",
      publisher: "택스워치",
      url: "https://www.taxwatch.co.kr/article/tax/2025/05/12/0001",
      publishedAt: "2025-05-14",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-segye-20241105",
      title: "'코스피 5000' 말했던 이재명의 금투세 폐지…지지자들은 \"혜안에 감탄\"",
      publisher: "세계일보",
      url: "https://www.segye.com/view/20241105502445",
      publishedAt: "2024-11-05",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-weeklykhan-20241104-flip",
      title: "민주당 \"금투세 폐지\"···이재명 \"주식시장 너무 어렵다\"",
      publisher: "주간경향",
      url: "https://weekly.khan.co.kr/article/202411041009001",
      publishedAt: "2024-11-04",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-pspd-20241107",
      title: "「부자감세 편승 금융투자소득세 폐지」 더불어민주당 규탄 기자회견",
      publisher: "참여연대",
      url: "https://peoplepower21.org/?p=1979637",
      publishedAt: "2024-11-07",
      type: "research",
      license: "link-only",
    },
  ],
};
