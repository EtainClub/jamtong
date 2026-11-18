import type { PolicyInput } from "./schema";

/**
 * 코스닥 시장 재편(프리미엄·스탠다드 승강제)과 벤처·모험자본 공급 계획 (2026년 3월 발표).
 *
 * 11월 대통령 X 게시물 답글에 "코스닥 기업과 스타트업·중소기업이 생존을 걱정하는 처지이니 대책을 마련해 달라"는
 * 요청이 달렸다(잼통 Voice). 정부가 발표한 코스닥·벤처 대책을 적는다.
 *
 * ★ 3월 발표는 방향이다. 승강제는 하반기 의견수렴 뒤 이듬해 초 도입을 목표로 했고, 11월 15일까지 확정 여부는 확인하지 못했다.
 * ★ 상장폐지 요건 강화는 policy:delisting-reform에 따로 있다.
 * ★ 2026-11-15 처음 등록 — 잼통 Voice 이슈 #295.
 */
export const KOSDAQ_SEGMENT_2026: PolicyInput = {
  slug: "kosdaq-segment-2026",
  title: "코스닥 승강제와 벤처·모험자본 공급 계획 (2026년)",
  scope: "2026년 3월 18일 금융위원회가 발표한 코스닥 프리미엄·스탠다드 세그먼트 승강제, 기술특례상장 확대, 코넥스 지원, 모험자본 공급 계획",
  ministries: ["금융위원회", "한국거래소"],
  categories: ["economy"],
  asOf: "2026-11-15",
  rumors: [
    {
      id: "rumor-kosdaq",
      text: "코스닥 기업과 스타트업·중소기업이 생존을 걱정하는 처지인데 정부 대책이 없다",
      claimIds: ["claim-segment", "claim-tech-listing", "claim-venture", "claim-schedule"],
    },
  ],
  claims: [
    {
      id: "claim-segment",
      text:
        "금융위원회는 2026년 3월 18일 청와대 '자본시장 안정과 정상화 간담회'에서 코스닥을 프리미엄·스탠다드(가칭) 세그먼트로 나누고 승강제를 운영하겠다고 발표했다. " +
        "프리미엄에는 더 엄격한 진입·유지 요건과 지배구조·영문공시 요건을 두고, 대표기업 중심의 새 지수와 연계 ETF를 도입한다는 계획이다.",
      assertionType: "FACT",
      sourceIds: ["src-korea-kr-20260318"],
      verified: true,
    },
    {
      id: "claim-tech-listing",
      text:
        "맞춤형 기술특례상장은 바이오에 이어 2025년 말 AI·우주·에너지를 추가했고, 2026년 중 6개 분야(잠정)를 순차로 더할 계획이다. " +
        "코넥스 상장 때 지정자문인·외부감사인 수수료 일부를 지원하고, 1,000억 원 규모인 유관기관 코넥스 투자펀드를 늘린다.",
      assertionType: "FACT",
      sourceIds: ["src-korea-kr-20260318"],
      verified: true,
    },
    {
      id: "claim-venture",
      text:
        "모험자본 공급으로는 국민성장펀드를 2026년에 30조 원 이상 집행하고, 대형 IB의 모험자본 공급 의무로 2028년까지 20조 원 이상을 새로 공급한다는 계획이 담겼다. " +
        "딥테크 같은 장기투자 분야는 모태펀드 투자 때 장기만기 펀드를 우대한다.",
      assertionType: "FACT",
      sourceIds: ["src-korea-kr-20260318"],
      verified: true,
    },
    {
      id: "claim-schedule",
      text:
        "금융위는 승강제를 하반기 의견수렴을 거쳐 이듬해 초 도입하는 것을 목표로 하고, 의견수렴이 순조로우면 2026년 안에도 가능하다고 설명했다.",
      assertionType: "CLAIM",
      assertedBy: "금융위원회",
      sourceIds: ["src-asiae-20260318"],
      verified: true,
    },
    {
      id: "claim-nov-meeting",
      text:
        "11월 13일 자본시장 정책 간담회에서도 '벤처 생태계와 코스닥 재설계'가 발제됐다. 발제자는 세그먼트 분리가 코스닥에 장기·기관 자금을 들이고 " +
        "대표기업의 코스피 이전 유인을 낮출 수 있다고 보면서도, 하위 세그먼트 기업의 낙인효과가 있어 운영이 중요하다고 했다.",
      assertionType: "CLAIM",
      assertedBy: "임형준 한국금융연구원 연구위원",
      sourceIds: ["src-etnews-20261113-kosdaq"],
      verified: true,
    },
  ],
  critiqueIds: ["claim-nov-meeting"],
  timeline: [
    {
      id: "t-announce",
      date: "2026-03-18",
      datePrecision: "day",
      title: "코스닥 승강제 발표",
      summary: "프리미엄·스탠다드 세그먼트, 모험자본 공급 계획.",
      claimIds: ["claim-segment", "claim-venture"],
    },
    {
      id: "t-nov",
      date: "2026-11-13",
      datePrecision: "day",
      title: "자본시장 정책 간담회에서 재논의",
      summary: "코스닥 재설계 발제.",
      claimIds: ["claim-nov-meeting"],
    },
  ],
  gaps: [
    "승강제의 세부 기준(세그먼트 편입 요건)과 도입 확정 여부는 11월 15일까지 확인하지 못했다.",
    "국민성장펀드 30조 원의 실제 집행 실적은 확인하지 못했다.",
    "코스닥 상장 중소·벤처기업의 경영난에 대한 직접 지원(유동성·자금 지원) 대책은 자료에서 찾지 못했다.",
  ],
  sources: [
    {
      id: "src-korea-kr-20260318",
      title: "코스닥 시장에 승강제 도입…기업 성장 자극, 시장 역동성 제고",
      publisher: "대한민국 정책브리핑(금융위원회)",
      url: "https://www.korea.kr/news/policyNewsView.do?newsId=148961063",
      publishedAt: "2026-03-18",
      type: "official",
      license: "public",
    },
    {
      id: "src-asiae-20260318",
      title: "코스닥 2부리그 승강제로…저PBR기업은 명단공개(종합)",
      publisher: "아시아경제",
      url: "https://view.asiae.co.kr/article/2026031818511126420",
      publishedAt: "2026-03-18",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-etnews-20261113-kosdaq",
      title: "李 대통령 주재 '자본시장 정책 간담회' 개최",
      publisher: "전자신문",
      url: "https://www.etnews.com/20261113000053",
      publishedAt: "2026-11-13",
      type: "press",
      license: "link-only",
    },
  ],
};
