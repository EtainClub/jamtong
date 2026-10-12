import type { PolicyInput } from "./schema";

/**
 * 소상공인·자영업자 지원금 — 실제로 있는 것과 도는 말.
 *
 * "자영업자 지원금 30만 원, 작년에 카드만 썼으면 100% 신청 가능"(2025년 9월),
 * "소상공인에게 2,600만 원을 또 지급한다, 역대급"(2025년 11월) 같은 글이 돈다.
 * 대개 '댓글 남기면 정리본을 보내 준다'는 홍보 게시물이라 제도 이름을 밝히지 않는다.
 * 그래서 그 시기 실제로 있었던 사업을 적고, 게시물의 숫자와 맞춰 본다.
 *
 * ★ '작년 카드 사용 실적으로 최대 30만 원'은 소상공인 지원금이 아니라 소비자 누구나
 *   신청하는 상생페이백의 조건과 같다. 다만 게시물이 어느 사업을 가리켰는지는 확인하지
 *   못했으므로 단정하지 않는다.
 * ★ 2026-10-12 처음 등록 — 잼통 신고 센터 factbot-gap 이슈 #16·#17·#20.
 */
export const SMALL_BUSINESS_SUPPORT: PolicyInput = {
  slug: "small-business-support",
  title: "소상공인·자영업자 지원금 — 실제로 있는 것과 도는 말",
  scope: "2025년 부담경감 크레딧·배달비 지원·비즈플러스카드·상생페이백의 대상과 금액, 도는 금액과의 대조",
  ministries: ["중소벤처기업부"],
  categories: ["economy", "welfare"],
  asOf: "2026-10-12",
  rumors: [
    {
      id: "rumor-30",
      text: "정부가 자영업자에게 30만 원의 지원금을 준다. 작년에 카드만 썼으면 자영업자도 100% 신청할 수 있다",
      claimIds: ["claim-delivery", "claim-payback", "claim-credit"],
    },
    {
      id: "rumor-2600",
      text: "이재명 정부가 소상공인에게 2,600만 원을 지원금으로 또 지급한다",
      claimIds: ["claim-no-2600", "claim-credit", "claim-bizplus"],
    },
    {
      id: "rumor-record",
      text: "이번 정부 소상공인 지원금 규모가 역대급이다",
      claimIds: ["claim-credit-budget", "claim-no-2600"],
    },
  ],
  claims: [
    {
      id: "claim-credit",
      text:
        "2025년 '소상공인 부담경감 크레딧'은 연 매출 3억 원 이하 소상공인에게 최대 50만 원을 " +
        "디지털 포인트로 준다. 공과금(전기·가스·수도)과 4대 보험료를 등록한 카드로 결제하면 한도 " +
        "안에서 자동 차감된다. 현금 지급이 아니다. 신청은 7월 14일 시작했다.",
      assertionType: "FACT",
      sourceIds: ["src-khan-20250624", "src-korea-credit"],
      verified: true,
    },
    {
      id: "claim-credit-budget",
      text:
        "부담경감 크레딧 예산은 1차 추가경정예산의 1조 5,660억 원이고, 관련 지원에 추경 약 1조 7,000억 " +
        "원과 본예산 2,000억 원 등 약 2조 원이 들어간다. 대상은 약 311만 명으로 추산됐다.",
      assertionType: "FACT",
      sourceIds: ["src-khan-20250624"],
      verified: true,
    },
    {
      id: "claim-delivery",
      text:
        "같은 시기 배달·택배비 지원은 본예산 2,037억 원으로 1인당 최대 30만 원이다. 소상공인 대상 " +
        "'30만 원' 지원은 이것이다. 카드 사용 실적이 조건은 아니다.",
      assertionType: "FACT",
      sourceIds: ["src-khan-20250624"],
      verified: true,
    },
    {
      id: "claim-payback",
      text:
        "'작년 카드 사용 실적'이 조건인 30만 원은 상생페이백이다. 2025년 9~11월 카드 사용액이 2024년 " +
        "월평균보다 늘면 증가분의 20%를 디지털 온누리상품권으로 돌려주며, 월 최대 10만 원, 3개월 합쳐 " +
        "최대 30만 원이다. 자영업자 지원금이 아니라 소비자 누구나 신청하는 환급이다.",
      assertionType: "FACT",
      sourceIds: ["src-sbsbiz-20250916"],
      verified: true,
    },
    {
      id: "claim-bizplus",
      text:
        "중·저신용 소상공인 약 7만 명에게는 이용 한도 최대 1,000만 원의 비즈플러스카드를 발급한다. " +
        "보증을 담보로 한 신용카드라 갚아야 하는 돈이지 지원금이 아니다.",
      assertionType: "FACT",
      sourceIds: ["src-khan-20250624"],
      verified: true,
    },
    {
      id: "claim-no-2600",
      text:
        "이 위키가 확인한 2025~2026년 정부 소상공인 지원 사업 가운데 2,600만 원을 지원금으로 주는 " +
        "사업은 찾지 못했다. 크레딧은 최대 50만 원, 배달비는 최대 30만 원이고, 금액이 큰 것은 대출·" +
        "보증·카드 한도처럼 갚아야 하는 돈이다.",
      assertionType: "INTERPRETATION",
      sourceIds: ["src-khan-20250624"],
      verified: false,
    },
  ],
  critiqueIds: ["claim-no-2600"],
  timeline: [
    {
      id: "t-credit",
      date: "2025-07-14",
      datePrecision: "day",
      title: "부담경감 크레딧 신청 시작",
      summary: "최대 50만 원, 연 매출 3억 원 이하.",
      claimIds: ["claim-credit", "claim-credit-budget"],
    },
    {
      id: "t-payback",
      date: "2025-09-15",
      datePrecision: "day",
      title: "상생페이백 신청 시작",
      summary: "카드 사용 증가분 20%, 최대 30만 원.",
      claimIds: ["claim-payback"],
    },
  ],
  gaps: [
    "게시물들이 가리킨 사업의 이름을 확인하지 못했다. '2,600만 원'이 여러 지원을 합친 숫자인지, 대출·보증 한도를 포함한 숫자인지 알 수 없다.",
    "역대 정부의 소상공인 지원 규모를 같은 기준으로 비교한 자료를 찾지 못했다. 코로나19 시기 손실보상·재난지원금과 견주면 '역대급'인지 판단할 수 없다.",
    "2026년에도 부담경감 크레딧이 이어지는지 공식 공고를 확인하지 못했다.",
    "중소벤처기업부 공고 원문과 대조하지 못했다. 사업 내용은 보도와 정책브리핑으로 확인했다.",
  ],
  sources: [
    {
      id: "src-khan-20250624",
      title: "공과금 50만원, 천만원 한도 신용카드···정부, 소상공인 지원 본격 추진",
      publisher: "경향신문",
      url: "https://www.khan.co.kr/article/202506241459001",
      publishedAt: "2025-06-24",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-korea-credit",
      title: "나의 '부담경감 크레딧' 신청기",
      publisher: "대한민국 정책브리핑",
      url: "https://www.korea.kr/news/policyNewsView.do?newsId=148947139",
      type: "official",
      license: "public",
    },
    {
      id: "src-sbsbiz-20250916",
      title: "30만원 받는데 신청 아직?…상생페이백 첫날 79만명 몰렸다",
      publisher: "SBS Biz",
      url: "https://biz.sbs.co.kr/amp/article/20000259969",
      publishedAt: "2025-09-16",
      type: "press",
      license: "link-only",
    },
  ],
};
