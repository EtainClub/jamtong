import type { PolicyInput } from "./schema";

/**
 * HMM 정부 측 지분 매각(민영화) 논의 (2026년).
 *
 * 11월 대통령 X 게시물 답글에 "HMM 주가가 눌려 있으니 정부 지분을 매각해 민영화해 달라"는 요청이 달렸다(잼통 Voice).
 * 산업은행·한국해양진흥공사의 지분과 매각 논의 경과를 보도 기준으로 적는다.
 *
 * ★ 11월 15일까지 매각 공고나 거래 구조 확정은 나오지 않았다. '추진 중'이지 '결정'이 아니다.
 * ★ 2026-11-15 처음 등록 — 잼통 Voice 이슈 #296.
 */
export const HMM_SALE: PolicyInput = {
  slug: "hmm-sale",
  title: "HMM 지분 매각과 민영화 논의 (2026년)",
  scope: "산업은행·한국해양진흥공사가 보유한 HMM 지분의 매각 논의 — 단독 매각 검토, 본사 부산 이전, 거래 구조와 절차",
  ministries: ["금융위원회", "해양수산부", "한국산업은행", "한국해양진흥공사"],
  categories: ["economy"],
  asOf: "2026-11-15",
  rumors: [
    {
      id: "rumor-privatize",
      text: "HMM 주가가 눌려 있으니 정부 지분을 매각해 민영화해 달라",
      claimIds: ["claim-stakes", "claim-kdb-sale", "claim-chairman", "claim-status"],
    },
  ],
  claims: [
    {
      id: "claim-stakes",
      text: "HMM의 최대주주는 한국산업은행(약 35.4%)과 한국해양진흥공사(약 35.1%)로, 두 기관의 합산 지분율은 약 70.5%다.",
      assertionType: "FACT",
      sourceIds: ["src-dealsite-20260904", "src-seoulfn-20260218"],
      verified: true,
    },
    {
      id: "claim-kdb-sale",
      text:
        "산업은행은 2026년 2월 국회 정무위원회에 낸 업무현황 자료에서 \"HMM 주식 보유에 따르는 산은의 재무 부담 등으로 신속한 매각 추진이 필요하다\"고 밝혔다. " +
        "같은 달 강준현 더불어민주당 의원에게 낸 답변서에서는 산은 지분만 따로 파는 '단독 매각'도 방안 가운데 하나로 고려한다고 밝힌 것으로 전해졌다.",
      assertionType: "CLAIM",
      assertedBy: "한국산업은행",
      sourceIds: ["src-seoulfn-20260218"],
      verified: true,
    },
    {
      id: "claim-kobc",
      text: "보도에 따르면 해양진흥공사는 국내 사실상 유일한 대형 컨테이너선사인 HMM에 대한 지배력을 중시해 매각에 산은보다 보수적인 입장이다.",
      assertionType: "INTERPRETATION",
      assertedBy: "서울파이낸스",
      sourceIds: ["src-seoulfn-20260218"],
      verified: false,
      limit: "해진공의 공식 입장문은 확인하지 못했다.",
    },
    {
      id: "claim-chairman",
      text:
        "박상진 산은 회장은 2026년 2월 취임 후 첫 기자간담회에서 \"원론적으로 HMM을 매각해서 주인을 찾아주는 것은 바람직한 추진 방향\"이라며 " +
        "\"부산 이전이 완료된 다음에 추진하도록 하겠다\"고 말했다.",
      assertionType: "CLAIM",
      assertedBy: "박상진 한국산업은행 회장",
      sourceIds: ["src-dealsite-20260904"],
      verified: true,
    },
    {
      id: "claim-status",
      text:
        "HMM은 2026년 5월 임시주주총회에서 본점을 부산으로 옮기는 정관 개정을 의결하고 같은 달 이전 등기를 마쳤다. " +
        "9월 보도는 산은이 하반기에 구체적인 거래 구조 검토에 들어갈 계획이며, 경영권 확보를 위해 해진공 지분 일부를 함께 파는 방안이 검토된다고 전했다. " +
        "정부 지분 매각은 국가계약법에 따라 공개 경쟁입찰로 진행돼 최소 1년 이상 걸린다는 분석이 있다.",
      assertionType: "FACT",
      sourceIds: ["src-dealsite-20260904", "src-seoulfn-20260218"],
      verified: true,
    },
  ],
  timeline: [
    {
      id: "t-kdb",
      date: "2026-02",
      datePrecision: "month",
      title: "산은, 단독 매각 검토 밝혀",
      summary: "재무 부담으로 신속한 매각 필요.",
      claimIds: ["claim-kdb-sale", "claim-chairman"],
    },
    {
      id: "t-busan",
      date: "2026-05",
      datePrecision: "month",
      title: "HMM 본점 부산 이전",
      summary: "매각의 선결 과제 해소.",
      claimIds: ["claim-status"],
    },
  ],
  gaps: [
    "11월 15일까지 매각 공고, 매각 주관사 선정, 거래 구조 확정 여부는 확인하지 못했다.",
    "정부 지분 매각이 HMM 주가에 미치는 영향에 대한 정부 분석은 찾지 못했다.",
    "2023년 매각 무산의 경위는 이 페이지에 담지 않았다.",
  ],
  sources: [
    {
      id: "src-seoulfn-20260218",
      title: "산은, 'HMM 단독 매각' 카드 만지작···민영화 급물살 탈까?",
      publisher: "서울파이낸스",
      url: "https://www.seoulfn.com/news/articleView.html?idxno=621390",
      publishedAt: "2026-02-18",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-dealsite-20260904",
      title: "거침없는 박상진호…KDB생명 이어 HMM 매각 재시동",
      publisher: "딜사이트",
      url: "https://dealsite.co.kr/articles/168121",
      publishedAt: "2026-09-04",
      type: "press",
      license: "link-only",
    },
  ],
};
