import type { PolicyInput } from "./schema";

/**
 * 금융투자소득세와 상속세 개편에 대한 정부 입장.
 *
 * 10월 X 게시물 답글에 "증시 정상화를 위해 금투세를 지금 시행해야 한다", "성장률은 반도체 착시이니
 * 상속·증여세율을 낮춰 젊은 층의 소비를 늘려야 한다"는 말이 달렸다(잼통 Voice). 두 세금에 대해
 * 확인되는 경과와 정부 입장을 적는다.
 *
 * ★ 2026-10-31 처음 등록 — 잼통 Voice 이슈 #152, #168.
 *   2026-11-10 factbot-gap #279('금투세는 폐지하면서 코인 과세는 추진한다')를 더했다. 금투세 폐지는
 *   2024년 12월(윤석열 정부안에 민주당 동의) 일이고, 가상자산 과세는 같은 법으로 2027년까지 미뤄졌다.
 *   이재명 정부는 8월 예정대로 과세한다고 했다가 11월 5일 2년 더 미루는 방안을 냈다.
 */
export const CAPITAL_TAXES: PolicyInput = {
  slug: "capital-taxes",
  title: "금융투자소득세와 상속세 개편에 대한 정부 입장",
  scope:
    "2024년 금투세 폐지·가상자산 과세 유예 경과, 2026년 가상자산 과세 시행 방침과 11월 2년 추가 유예 방안, 대통령의 거래세·양도세 개편 발언, " +
    "2026년 세제개편안의 가업상속공제 개편과 상속세 최고세율 논의",
  ministries: ["재정경제부"],
  categories: ["economy"],
  asOf: "2026-11-10",
  rumors: [
    {
      id: "rumor-crypto",
      text: "정부가 금융투자소득세(금투세)를 폐지하면서 코인(가상자산) 과세는 추진한다",
      claimIds: ["claim-fit-repeal-law", "claim-crypto-structure", "claim-crypto-august", "claim-crypto-deferral", "claim-crypto-reading", "claim-crypto-critique"],
    },
    {
      id: "rumor-fit",
      text: "증시 정상화를 위해 금융투자소득세를 지금 시행해야 한다",
      claimIds: ["claim-fit-repeal", "claim-fit-2026"],
    },
    {
      id: "rumor-inheritance",
      text: "성장률은 반도체 착시이니 상속세·증여세율을 낮춰 젊은 층의 소비를 늘려야 한다",
      claimIds: ["claim-inheritance-2026", "claim-inheritance-rate"],
    },
  ],
  claims: [
    {
      id: "claim-fit-repeal",
      text:
        "금융투자소득세는 2024년 11월 4일 이재명 당시 민주당 대표가 정부·여당의 폐지안에 동의한다고 밝힌 뒤, 2024년 말 국회에서 " +
        "폐지됐다.",
      assertionType: "FACT",
      sourceIds: ["src-weeklykhan-20241115"],
      verified: false,
    },
    {
      id: "claim-fit-2026",
      text:
        "대통령은 2026년 4월 9일 국민경제자문회의에서 손익과 무관하게 걷는 거래세의 역진성을 지적하며 \"거래세와 양도소득세를 바꿔야 " +
        "한다\"고 말했다. 국민의힘은 금투세 부활 신호라고 반발했지만, 정부는 금투세 재도입을 공식화하지 않았다.",
      assertionType: "FACT",
      sourceIds: ["src-dailian-1639888"],
      verified: true,
    },
    {
      id: "claim-inheritance-2026",
      text: "정부의 2026년 세제개편안(8월 3일)은 가업상속공제 한도를 600억 원에서 1천억 원으로 올리고 사후관리 기간을 5년에서 10년으로 늘리는 내용을 담았다.",
      assertionType: "FACT",
      sourceIds: ["src-nate-20260803"],
      verified: false,
    },
    {
      id: "claim-inheritance-rate",
      text: "상속·증여세 최고세율을 50%에서 40%로 낮추는 안은 국민의힘 김상훈 의원이 대표 발의한 법안에 들어 있다.",
      assertionType: "FACT",
      sourceIds: ["src-taxtimes-277236"],
      verified: false,
    },
    {
      id: "claim-fit-repeal-law",
      text:
        "국회는 2024년 12월 10일 본회의에서 금융투자소득세를 폐지하고 가상자산 소득 과세 시행일을 2025년 1월 1일에서 2027년 1월 1일로 2년 미루는 소득세법 개정안을 " +
        "재석 275명 중 찬성 204명으로 가결했다. 금투세 폐지는 윤석열 정부가 추진했고 당시 민주당이 동의했다.",
      assertionType: "FACT",
      sourceIds: ["src-sbsbiz-20241210"],
      verified: true,
    },
    {
      id: "claim-crypto-structure",
      text:
        "가상자산 과세는 2020년 소득세법 개정으로 근거가 생겼다. 가상자산 양도·대여 소득을 기타소득으로 분리과세하며, 연 250만 원을 넘는 소득에 20%(지방소득세 포함 22%)를 매긴다. " +
        "시행은 2022년 예정에서 2023년, 2025년, 2027년으로 세 차례 미뤄졌다.",
      assertionType: "FACT",
      sourceIds: ["src-bloter-669414", "src-nate-20260803-crypto", "src-hankyung-20261105"],
      verified: true,
    },
    {
      id: "claim-crypto-august",
      text:
        "구윤철 부총리 겸 재정경제부 장관은 2026년 7월 29일 국회에서 \"현재로서는 예정대로 내년부터 과세가 되는 것으로 추진하고 있다\"고 답했고, " +
        "8월 3일 2026년 세제개편안에도 유예안을 넣지 않았다. 국민의힘은 금투세 폐지와의 형평성을 들어 가상자산 과세를 없애는 개정안을 내 둔 상태였다.",
      assertionType: "FACT",
      sourceIds: ["src-bloter-669414", "src-nate-20260803-crypto"],
      verified: true,
    },
    {
      id: "claim-crypto-deferral",
      text:
        "이형일 부총리 겸 재정경제부 장관은 2026년 11월 5일 브리핑에서 2027년 1월 시행 예정이던 가상자산 과세를 2년 미뤄 2029년부터 시행하는 방안을 국회와 협의해 추진한다고 발표했다. " +
        "확정되면 네 번째 유예다. 정부는 미국이 국제 가상자산 정보교환(CARF)에 2029년부터 참여해 그 전에는 해외 거래 정보를 확보하기 어렵다는 점을 이유로 들었고, " +
        "손실을 3년간 이월공제하는 방안도 함께 협의하겠다고 했다.",
      assertionType: "CLAIM",
      assertedBy: "재정경제부",
      sourceIds: ["src-hankyung-20261105"],
      verified: true,
    },
    {
      id: "claim-crypto-reading",
      text:
        "'금투세는 폐지하면서 코인 과세는 추진한다'는 말은 시점이 섞여 있다. 금투세 폐지와 코인 과세 유예는 이재명 정부 출범 전인 2024년 12월 같은 법 개정에서 함께 이뤄졌다. " +
        "이재명 정부는 2026년 8월까지 2027년 과세 방침을 유지했지만, 11월 5일 2029년으로 미루는 방안을 냈다. 유예는 국회가 소득세법을 고쳐야 확정된다.",
      assertionType: "INTERPRETATION",
      sourceIds: ["src-sbsbiz-20241210", "src-bloter-669414", "src-hankyung-20261105"],
      verified: true,
    },
    {
      id: "claim-crypto-critique",
      text:
        "경향신문은 사설에서 8월과 여건이 달라지지 않았는데 입장을 바꿨다며 정치적 계산을 의심했고, 미국·영국·일본은 CARF 이전부터 과세해 왔다고 반박했다. " +
        "반복된 유예와 2024년 금투세 폐지가 조세 정의를 무너뜨린다며 유예 철회를 요구했다.",
      assertionType: "CLAIM",
      assertedBy: "경향신문 사설",
      sourceIds: ["src-khan-20261105-editorial"],
      verified: true,
    },
  ],
  critiqueIds: ["claim-crypto-critique"],
  timeline: [
    {
      id: "t-fit-repeal-law",
      date: "2024-12-10",
      datePrecision: "day",
      title: "금투세 폐지·코인 과세 2년 유예 의결",
      summary: "가상자산 과세 2027년 1월로.",
      claimIds: ["claim-fit-repeal-law"],
    },
    {
      id: "t-fit-repeal",
      date: "2024-11-04",
      datePrecision: "day",
      title: "민주당, 금투세 폐지 동의",
      summary: "2024년 말 폐지.",
      claimIds: ["claim-fit-repeal"],
    },
    {
      id: "t-council",
      date: "2026-04-09",
      datePrecision: "day",
      title: "국민경제자문회의 거래세 발언",
      summary: "거래세·양도세 개편 필요성.",
      claimIds: ["claim-fit-2026"],
    },
    {
      id: "t-tax-reform",
      date: "2026-08-03",
      datePrecision: "day",
      title: "2026년 세제개편안",
      summary: "가업상속공제 개편.",
      claimIds: ["claim-inheritance-2026", "claim-crypto-august"],
    },
    {
      id: "t-crypto-deferral",
      date: "2026-11-05",
      datePrecision: "day",
      title: "가상자산 과세 2년 추가 유예 방안",
      summary: "2029년 시행, 국회와 협의.",
      claimIds: ["claim-crypto-deferral"],
    },
  ],
  gaps: [
    "2026년 세제개편안에 상속세 최고세율 인하나 유산취득세 전환이 들어 있는지는 재정경제부 원문으로 확인하지 못했다.",
    "주식 양도소득 과세 체계 개편을 정부가 구체적으로 검토하고 있는지는 공식 발표를 찾지 못했다.",
    "상속·증여세 인하가 청년 소비에 미치는 효과에 대한 공식 분석은 찾지 못했다.",
    "가상자산 과세 2년 유예를 담은 소득세법 개정안의 국회 처리 결과는 11월 10일 현재 나오지 않았다.",
    "재정경제부의 11월 5일 브리핑 자료 원문은 대조하지 못했다. 유예 방안은 보도로 확인했다.",
  ],
  sources: [
    {
      id: "src-weeklykhan-20241115",
      title: "(32) 이재명 대표의 금투세 폐지 결정, 즉각 철회해야",
      publisher: "주간경향",
      url: "https://weekly.khan.co.kr/article/202411151530041",
      publishedAt: "2024-11-15",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-dailian-1639888",
      title: "증시 살아나자 과세 논쟁도 꿈틀…금투세 부활론 다시 수면 위",
      publisher: "데일리안",
      url: "https://www.dailian.co.kr/news/view/1639888/",
      publishedAt: "2026-05-02",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-nate-20260803",
      title: "[2026 세제개편] 가업상속공제 '한도 1000억' 늘리고 '경영요건 30년' 조인다",
      publisher: "네이트뉴스(비바100)",
      url: "https://m.news.nate.com/view/20260803n28652",
      publishedAt: "2026-08-03",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-taxtimes-277236",
      title: "\"상속세 최고세율 40%로…할증평가 폐지\"",
      publisher: "한국세정신문",
      url: "https://www.taxtimes.co.kr/news/article.html?no=277236",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-sbsbiz-20241210",
      title: "금투세 폐지·가상자산 과세 유예법안 국회 본회의 통과",
      publisher: "SBS Biz",
      url: "https://biz.sbs.co.kr/article/20000206343",
      publishedAt: "2024-12-10",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-bloter-669414",
      title: "더는 안 미룬다…정부, 2027년 '가상자산 과세' 시행 재확인",
      publisher: "블로터",
      url: "https://www.bloter.net/news/articleView.html?idxno=669414",
      publishedAt: "2026-07-29",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-nate-20260803-crypto",
      title: "가상자산 과세 유예안 빠져…내년부터 코인 차익땐 22% 분리과세[2026 세제개편]",
      publisher: "네이트뉴스(아시아경제)",
      url: "https://m.news.nate.com/view/20260803n28191",
      publishedAt: "2026-08-03",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-hankyung-20261105",
      title: "가상자산 과세 4번째 유예…2029년부터 시행",
      publisher: "한국경제",
      url: "https://www.hankyung.com/article/2026110590561",
      publishedAt: "2026-11-05",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-khan-20261105-editorial",
      title: "[사설]가상자산 과세 또 유예, ‘표퓰리즘’ 아닌 조세 정의 우선하길",
      publisher: "경향신문",
      url: "https://www.khan.co.kr/article/202611051850001/",
      publishedAt: "2026-11-05",
      type: "press",
      license: "link-only",
    },
  ],
};
