import type { PolicyInput } from "./schema";

/**
 * 한국거래소 '자본시장 정책 간담회'(2026년 11월 13일)의 안건·대통령 발언과 그날 시장.
 *
 * 11월 대통령 X 게시물 답글에 "간담회는 형식적이었고 간담회 뒤 주가는 오히려 떨어졌다",
 * "금융 관료와 거래소가 그대로인 채 대통령 의지만으로는 제대로 된 정책이 나오지 않는다"는
 * 지적이 달렸다(잼통 Voice).
 *
 * ★ 그날 코스피가 하락 마감한 것은 사실이다. 하락을 간담회 탓으로 돌리는 것은 보도의 평가이고,
 *   보도는 유가·미국 국채금리 같은 다른 원인도 함께 든다. 둘을 나눠 적는다.
 * ★ 2026-11-15 처음 등록 — 잼통 Voice 이슈 #293.
 */
export const CAPITAL_MARKET_MEETING_2026: PolicyInput = {
  slug: "capital-market-meeting-2026",
  title: "자본시장 정책 간담회 (2026년 11월 13일)",
  scope: "11월 13일 한국거래소에서 대통령 주재로 열린 자본시장 정책 간담회의 안건, 대통령 발언, 같은 날 증시 흐름과 평가",
  ministries: ["금융위원회", "한국거래소"],
  categories: ["economy"],
  asOf: "2026-11-15",
  rumors: [
    {
      id: "rumor-empty-meeting",
      text: "자본시장 간담회는 형식적인 자리였고, 간담회 뒤 주가는 오히려 떨어져 투자자 신뢰를 얻지 못했다",
      claimIds: ["claim-agenda", "claim-market", "claim-critique"],
    },
  ],
  claims: [
    {
      id: "claim-agenda",
      text:
        "2026년 11월 13일 한국거래소에서 이재명 대통령 주재로 '자본시장 정책 간담회'가 열렸고 KTV와 유튜브로 생중계됐다. " +
        "발제는 세 가지였다. 이효섭 자본시장연구원 연구위원의 '주주중심 경영확산과 기업가치 제고', 임형준 한국금융연구원 연구위원의 " +
        "'벤처 생태계와 코스닥 재설계', 김학균 신영증권 리서치센터장의 '증시의 장기·기관 중심 수요기반 확충'이다. " +
        "자유토론에서는 의무공개매수 제도, 베어허그, 상장폐지 강화, 코스닥 세그먼트 분리가 다뤄졌다.",
      assertionType: "FACT",
      sourceIds: ["src-etnews-20261113"],
      verified: true,
    },
    {
      id: "claim-pbr",
      text: "이효섭 연구위원은 PBR 1 미만 기업이 코스피 560개사, 코스닥 877개사에 이른다며 저PBR 기업 명단 공표의 실효성 강화를 제안했다.",
      assertionType: "CLAIM",
      assertedBy: "이효섭 자본시장연구원 연구위원",
      sourceIds: ["src-etnews-20261113"],
      verified: true,
    },
    {
      id: "claim-president",
      text:
        "대통령은 \"자본시장 개혁에 대한 정부의 의지와 정책이 다시 한번 시험대에 올랐다고 생각한다\"고 했고, " +
        "\"정부가 할 일은 공정하고, 투명한 시장 규칙을 만들고, 또 그 규칙이 누구에게나 예외 없이 제대로 적용되도록 하는 것\"이라고 말했다. " +
        "\"일부러 상속받을 때 세금 덜 내려고 주가를 관리하고 있는 것 아니냐는 의심도 생기는 중\"이라며 주가 누르기 문제도 거론했다.",
      assertionType: "CLAIM",
      assertedBy: "이재명 대통령",
      sourceIds: ["src-ohmynews-20261113"],
      verified: true,
    },
    {
      id: "claim-followup",
      text:
        "보도에 따르면 대통령은 이 자리에서 주가조작과 불공정거래에 범정부 차원으로 엄정 대응하고 금융·자본시장 단속 인력을 늘리라고 했으며, " +
        "중대범죄수사청에 금융·자본시장 불공정 행위를 엄정 단속하라고 따로 지시했다. 의무공개매수 제도는 소액주주 보호와 인수합병 위축 우려를 함께 " +
        "고려해야 한다며 현장 의견을 듣겠다고 했다.",
      assertionType: "FACT",
      sourceIds: ["src-ohmynews-20261113"],
      verified: false,
      limit: "청와대 공식 브리핑 원문과 대조하지 못했다. 보도 한 건에 기댄다.",
    },
    {
      id: "claim-market",
      text:
        "같은 날 코스피는 장 초반 5,500선을 넘었다가 오후에 하락으로 돌아서 전 거래일보다 52.20포인트(0.98%) 내린 5,290.53에 마감했다. " +
        "외국인이 순매도로 돌아섰고, 코스닥은 0.45% 오른 699.66에 마감했다. 보도는 유가와 미국 국채금리 부담, 삼성전자·SK하이닉스 약세를 함께 원인으로 들었다.",
      assertionType: "FACT",
      sourceIds: ["src-news1-20261113", "src-ntoday-20261113"],
      verified: true,
    },
    {
      id: "claim-critique",
      text:
        "투데이신문은 이날을 '빈손 간담회'라고 부르며 뚜렷한 정책 결과가 나오지 않아 실망 매물이 나왔다고 평가했다. " +
        "이 평가와 별개로, 간담회 발표와 그날 지수 하락 사이의 인과를 따로 분석한 자료는 찾지 못했다.",
      assertionType: "OPINION",
      assertedBy: "투데이신문",
      sourceIds: ["src-ntoday-20261113"],
      verified: true,
    },
  ],
  critiqueIds: ["claim-critique"],
  timeline: [
    {
      id: "t-meeting",
      date: "2026-11-13",
      datePrecision: "day",
      title: "한국거래소 자본시장 정책 간담회",
      summary: "발제 세 건, 자유토론. 코스피는 0.98% 하락 마감.",
      claimIds: ["claim-agenda", "claim-market"],
    },
  ],
  gaps: [
    "간담회 참석자 전체 명단과 청와대 공식 브리핑 원문은 확인하지 못했다.",
    "간담회에서 나온 제안이 어떤 후속 조치(법령 개정, 금융위 발표)로 이어지는지는 11월 15일까지 나오지 않았다.",
    "금융당국·거래소 인사 교체를 둘러싼 정부 방침은 자료에서 확인되지 않았다.",
  ],
  sources: [
    {
      id: "src-etnews-20261113",
      title: "李 대통령 주재 '자본시장 정책 간담회' 개최",
      publisher: "전자신문",
      url: "https://www.etnews.com/20261113000053",
      publishedAt: "2026-11-13",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-ohmynews-20261113",
      title: "주식시장 찾은 이 대통령 \"신뢰 회복이 가장 핵심\"",
      publisher: "오마이뉴스",
      url: "https://www.ohmynews.com/NWS_Web/View/at_pg.aspx?CNTN_CD=A0003284691",
      publishedAt: "2026-11-13",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-news1-20261113",
      title: "李 대통령 자본시장 간담회에도…코스피 5500 찍고 하락 반전[시황종합]",
      publisher: "뉴스1",
      url: "https://www.news1.kr/finance/market-exr/6353553",
      publishedAt: "2026-11-13",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-ntoday-20261113",
      title: "[마켓펄스] 증시 반등 못 지킨 '빈손 간담회'...외국인 매도에 코스피 하락 전환",
      publisher: "투데이신문",
      url: "https://www.ntoday.co.kr/news/articleView.html?idxno=130859",
      publishedAt: "2026-11-13",
      type: "press",
      license: "link-only",
    },
  ],
};
