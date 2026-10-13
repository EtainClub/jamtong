import type { PolicyInput } from "./schema";

/**
 * 쿠팡 개인정보 유출 수사와 미국의 통상 압박.
 *
 * "쿠팡 대표가 한국 경찰에 26시간 조사를 받았다", "며칠 뒤 미국 의회에서 쿠팡
 * 청문회가 열린다", "미국 관세법 338조로 한국산 제품에 최대 50% 보복 관세가
 * 붙을 수 있고 이 조항에는 기한이 없다"는 글이 돈다(2026년 2월 게시물).
 * 숫자 대부분은 보도와 맞는다. 다만 26시간은 두 번 조사를 합친 것이고, 미국
 * 의회 일정은 공개 청문회가 아니라 비공개 증언청취였다. 338조를 쿠팡 문제로
 * 한국에 발동한 일은 확인되지 않는다.
 *
 * ★ 수사의 출발점은 쿠팡 전직 직원의 대규모 정보 유출이다. 정부는 차별이 아니라
 *   유출 대응이라고 밝혔고, 미국 하원 법사위는 차별이라고 주장한다. 둘 다 주장이다.
 * ★ 2026-10-13 처음 등록 — 잼통 신고 센터 factbot-gap 이슈 #27·#29.
 */
export const COUPANG_DISPUTE: PolicyInput = {
  slug: "coupang-dispute",
  title: "쿠팡 개인정보 유출 수사와 미국의 통상 압박",
  scope:
    "쿠팡 정보 유출에 대한 정부 조사·경찰 수사, 미국 하원 법사위의 조사와 한국 정부의 반박, " +
    "미국 관세법 338조",
  ministries: ["과학기술정보통신부", "경찰청", "외교부", "산업통상부"],
  categories: ["economy", "diplomacy"],
  asOf: "2026-10-13",
  rumors: [
    {
      id: "rumor-26h",
      text: "쿠팡 대표가 한국 경찰로부터 총 26시간 조사를 받았고 추가 소환 가능성이 제기된 상태다",
      claimIds: ["claim-police-first", "claim-police-second", "claim-police-total"],
    },
    {
      id: "rumor-hearing",
      text: "며칠 뒤 미국 의회에서 쿠팡 관련 청문회가 열리고 쿠팡 대표가 참석한다",
      claimIds: ["claim-house-deposition"],
    },
    {
      id: "rumor-338",
      text: "미국 무역법 338조에 따라 미국 기업이 차별받는다고 판단되면 한국산 제품에 최대 50% 보복 관세가 부과될 수 있고, 이 조항에는 종료 기한이 없다",
      claimIds: ["claim-338", "claim-338-korea"],
    },
  ],
  claims: [
    {
      id: "claim-breach",
      text:
        "과학기술정보통신부 민관합동조사단은 2026년 2월 10일 쿠팡에서 성명·이메일 등 3,367만 3,817건이 " +
        "유출됐고, 성명·전화번호·주소가 담긴 배송지 목록 페이지가 1억 4,805만여 회 무단 조회됐다고 " +
        "발표했다. 공격자는 인증 시스템을 설계·개발했던 쿠팡 전직 직원으로, 퇴사 뒤에도 서명키가 " +
        "바뀌지 않았다.",
      assertionType: "FACT",
      sourceIds: ["src-newsis-20260210"],
      verified: true,
    },
    {
      id: "claim-police-first",
      text:
        "해롤드 로저스 쿠팡 임시대표는 2026년 1월 30일 오후 2시께 서울경찰청 쿠팡 수사 TF에 처음 출석해 " +
        "1월 31일 오전 2시 22분께까지 약 12시간 조사를 받았다. 증거 인멸 혐의가 집중적으로 다뤄졌다. " +
        "그 전에 경찰의 출석 요구 두 차례에 응하지 않았다.",
      assertionType: "FACT",
      sourceIds: ["src-newsis-20260131", "src-hankook-20260130"],
      verified: true,
    },
    {
      id: "claim-police-second",
      text:
        "로저스 대표는 2026년 2월 6일 오후 1시 30분께 다시 출석해 7일 오전 3시 25분께까지 약 14시간 " +
        "국회 청문회 위증 혐의 등을 조사받았다. 산업재해 은폐 의혹으로 추가 소환될 수 있다는 보도가 " +
        "나왔다.",
      assertionType: "FACT",
      sourceIds: ["src-herald-20260206"],
      verified: true,
    },
    {
      id: "claim-police-total",
      text: "두 차례 조사 시간을 더하면 약 26시간이다. 한 번에 26시간을 조사받은 것은 아니다.",
      assertionType: "INTERPRETATION",
      sourceIds: ["src-newsis-20260131", "src-herald-20260206"],
      verified: true,
    },
    {
      id: "claim-house-deposition",
      text:
        "미국 하원 법사위원회는 2026년 2월 5일 로저스 대표에게 소환장을 보내고 한국 정부와의 소통 기록을 " +
        "요구했다. 2월 23일 워싱턴에서 열린 것은 공개 청문회가 아니라 비공개 증언청취였다. 의원들은 " +
        "나오지 않았고 법사위 변호사와 보좌관이 오전 10시부터 오후 5시께까지 약 7시간 질의했다. " +
        "법사위는 한국이 미국 기업 쿠팡을 차별하는지 조사한다고 밝혔다.",
      assertionType: "FACT",
      sourceIds: ["src-newsis-20260224"],
      verified: true,
    },
    {
      id: "claim-house-view",
      text:
        "미국 하원 법사위 측은 한국 정부가 쿠팡에 '차별적 대우와 불공정한 집행 관행'을 보여 왔다고 " +
        "주장한다. 한국 정부는 이를 부인한다.",
      assertionType: "CLAIM",
      assertedBy: "미국 하원 법사위원회",
      sourceIds: ["src-newsis-20260224", "src-sbsbiz-20260724"],
      verified: true,
    },
    {
      id: "claim-govt-rebuttal",
      text:
        "미국 하원 법사위가 2026년 7월 1일 '경쟁 차단: 미국인 소유 기업에 대한 한국의 차별적 공격' 임시 보고서를 내자, 주미대사관은 " +
        "법사위에 입장문을 보내 한국 디지털 규제의 비차별성, 유출 사건의 사실관계, 개인정보보호위원회 " +
        "처분과 정부 조치의 적법성을 설명했다. 외교부는 보고서가 확인되지 않은 주장에 기반했다며 깊은 " +
        "유감을 표했다.",
      assertionType: "CLAIM",
      assertedBy: "외교부",
      sourceIds: ["src-sbsbiz-20260724"],
      verified: true,
    },
    {
      id: "claim-338",
      text:
        "미국 1930년 관세법 338조는 미국에 차별적 무역 행위를 하는 나라의 수입품에 대통령이 최대 50% " +
        "관세를 매길 수 있게 한다. 실제 차별을 뒷받침하는 근거가 있어야 하지만, 150일 기한이 있는 " +
        "122조와 달리 기한 제한이 없고 의회 동의도 필요 없다. 트럼프 대통령은 2026년 7월 20일 캐나다산 " +
        "일부 제품에 이 조항으로 50% 관세를 매기는 포고령에 서명했다. 사실상 처음 발동한 것이다.",
      assertionType: "FACT",
      sourceIds: ["src-khan-20260721"],
      verified: true,
    },
    {
      id: "claim-338-korea",
      text:
        "2026년 10월 현재 미국이 쿠팡 문제를 이유로 한국에 338조를 발동했다는 발표는 찾지 못했다. " +
        "338조 설명 자체는 맞지만, 한국에 적용될 수 있다는 것은 가능성이다.",
      assertionType: "INTERPRETATION",
      sourceIds: ["src-khan-20260721"],
      verified: true,
    },
  ],
  critiqueIds: ["claim-house-view"],
  timeline: [
    {
      id: "t-police-1",
      date: "2026-01-30",
      datePrecision: "day",
      title: "로저스 대표 첫 경찰 조사",
      summary: "약 12시간. 증거 인멸 혐의 등.",
      claimIds: ["claim-police-first"],
    },
    {
      id: "t-house-subpoena",
      date: "2026-02-05",
      datePrecision: "day",
      title: "미 하원 법사위 소환장",
      summary: "증언과 한국 정부 소통 기록 요구.",
      claimIds: ["claim-house-deposition"],
    },
    {
      id: "t-police-2",
      date: "2026-02-06",
      datePrecision: "day",
      title: "두 번째 경찰 조사",
      summary: "약 14시간. 국회 위증 혐의 등.",
      claimIds: ["claim-police-second"],
    },
    {
      id: "t-breach-result",
      date: "2026-02-10",
      datePrecision: "day",
      title: "민관합동조사단 결과 발표",
      summary: "3,367만여 건 유출, 배송지 목록 1억 4,805만여 회 조회.",
      claimIds: ["claim-breach"],
    },
    {
      id: "t-deposition",
      date: "2026-02-23",
      datePrecision: "day",
      title: "미 하원 비공개 증언청취",
      summary: "공개 청문회가 아니었다. 약 7시간.",
      claimIds: ["claim-house-deposition"],
    },
    {
      id: "t-338-canada",
      date: "2026-07-20",
      datePrecision: "day",
      title: "캐나다에 338조 첫 발동",
      summary: "일부 제품 50% 관세 포고령.",
      claimIds: ["claim-338"],
    },
    {
      id: "t-rebuttal",
      date: "2026-07-24",
      datePrecision: "day",
      title: "정부, 법사위 보고서 반박 입장문",
      summary: "주미대사관이 전달. 외교부 '깊은 유감'.",
      claimIds: ["claim-govt-rebuttal"],
    },
  ],
  gaps: [
    "로저스 대표의 세 번째 경찰 조사 여부와 수사 결과는 확인하지 못했다.",
    "쿠팡 투자사의 미국 무역법 301조 청원과 USTR의 조사 개시 여부는 원문을 확인하지 못했다.",
    "개인정보보호위원회의 최종 과징금 처분 원문은 확인하지 못했다.",
  ],
  sources: [
    {
      id: "src-newsis-20260210",
      title: "쿠팡 합동조사단, 정보유출 3367만건, 정보 무단조회 1.4억회 확인",
      publisher: "뉴시스",
      url: "https://www.newsis.com/view/NISX20260210_0003510149",
      publishedAt: "2026-02-10",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-newsis-20260131",
      title: "'셀프조사' 로저스 쿠팡 대표, 첫 경찰 조사 마쳐…약 12시간 만에 종료(종합)",
      publisher: "뉴시스",
      url: "https://www.newsis.com/view/NISX20260130_0003497318",
      publishedAt: "2026-01-31",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-hankook-20260130",
      title: "'셀프 조사 논란' 로저스 쿠팡 대표, 경찰 첫 출석… '증거인멸' 질문엔 침묵",
      publisher: "한국일보",
      url: "https://www.hankookilbo.com/news/article/amp/A2026012918580005243",
      publishedAt: "2026-01-30",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-herald-20260206",
      title: "쿠팡 로저스 청문회 위증 혐의 14시간 조사…재소환 가능성",
      publisher: "헤럴드경제",
      url: "https://www.heraldk.com/article/2026020615110417104",
      publishedAt: "2026-02-06",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-newsis-20260224",
      title: "법사위, 韓쿠팡 불공정대우 관련 비공개 증언청취",
      publisher: "뉴시스",
      url: "https://www.newsis.com/view/NISX20260224_0003523434",
      publishedAt: "2026-02-24",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-sbsbiz-20260724",
      title: "정부, 美법사위에 '쿠팡 보고서' 반박 입장 전달…\"유감 표명\"",
      publisher: "SBS Biz",
      url: "https://biz.sbs.co.kr/amp/article/20000324523",
      publishedAt: "2026-07-24",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-khan-20260721",
      title: "트럼프, 캐나다에 관세법 338조 첫 발동",
      publisher: "경향신문",
      url: "https://www.khan.co.kr/article/202607212052005/",
      publishedAt: "2026-07-21",
      type: "press",
      license: "link-only",
    },
  ],
};
