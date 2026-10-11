import type { PolicyInput } from "./schema";

/**
 * 호남 반도체 클러스터와 광주 군공항 부지.
 *
 * "정부가 기업들을 압박해 호남 반도체 클러스터를 광주 군공항에 짓게 한다"는 글이 돈다.
 * 부지가 광주 군공항으로 정해진 것은 사실이다. 쟁점은 '누가 골랐나'다. 정부는 기업이
 * 먼저 호남 투자 의사를 냈고 최종 결정도 기업이 했다고 하고, 야당은 기업이 먼저 제안한
 * 적이 없다는 설명을 들었다며 압박을 의심한다. 둘 다 주장이고, 결정 과정의 기록은
 * 공개되지 않았다.
 *
 * ★ 압박이 있었다고도, 없었다고도 단정하지 않는다. 양쪽 주장을 CLAIM으로 나란히 적는다.
 * ★ 2026-10-11 처음 등록 — 잼통 신고 센터 factbot-gap 이슈 #10.
 */
export const HONAM_CHIP_CLUSTER: PolicyInput = {
  slug: "honam-chip-cluster",
  title: "호남 반도체 클러스터와 광주 군공항 부지",
  scope: "호남권 반도체 클러스터의 광주 군공항 부지 결정 경위, 투자 계획, 기업 압박 논란과 남은 절차",
  ministries: ["산업통상부", "국토교통부", "국방부"],
  categories: ["economy", "region"],
  asOf: "2026-10-11",
  rumors: [
    {
      id: "rumor-pressure",
      text: "정부가 기업들을 압박해 호남 반도체 클러스터를 광주 군공항에 짓게 한다",
      claimIds: [
        "claim-site-decision",
        "claim-site-reason",
        "claim-ministry-position",
        "claim-opposition-pressure",
        "claim-sk-chairman",
      ],
    },
  ],
  claims: [
    {
      id: "claim-site-decision",
      text:
        "정부는 2026년 7월 6일 이재명 대통령이 주재한 메가프로젝트 민관합동점검회의에서 " +
        "호남권 반도체 클러스터 부지를 광주 군공항으로 정했다. 결과는 강훈식 대통령비서실장이 " +
        "브리핑했다.",
      assertionType: "FACT",
      sourceIds: ["src-khan-20260706"],
      verified: true,
    },
    {
      id: "claim-site-reason",
      text:
        "청와대는 기업들이 호남권 후보지 가운데 광주 군공항이 가장 적합하다는 의견을 냈다고 " +
        "밝혔다. 약 250만 평을 확보할 수 있고 이미 평탄화돼 공기를 줄일 수 있으며, 도심·KTX역과 " +
        "가깝고 국유지라 보상 위험이 적다는 이유를 들었다.",
      assertionType: "CLAIM",
      assertedBy: "청와대(대통령비서실)",
      sourceIds: ["src-khan-20260706"],
      verified: true,
    },
    {
      id: "claim-investment-plan",
      text:
        "6월 30일 발표된 '서남권 첨단산업 발전 비전'에는 SK 470조 원, 삼성 425조 원 등 총 896조 원 " +
        "투자 계획이 담겼다. 이는 기업의 투자 수요를 반영한 계획이며, 8월 보도 기준으로 최종 " +
        "투자 결정이 확정됐다는 내용은 없었다.",
      assertionType: "FACT",
      sourceIds: ["src-kwangju-20260810"],
      verified: true,
    },
    {
      id: "claim-ministry-position",
      text:
        "산업통상부는 기업이 여러 후보지 가운데 호남권 투자 의사를 먼저 전달했고 정부는 호남권 " +
        "부지 정보를 제공했으며, 최종 투자 결정은 기업이 내렸다고 설명했다.",
      assertionType: "CLAIM",
      assertedBy: "산업통상부",
      sourceIds: ["src-fnnews-20261011"],
      verified: true,
    },
    {
      id: "claim-opposition-pressure",
      text:
        "국민의힘 조지연 의원 측은 SK하이닉스의 비공개 보고에서 기업이 먼저 호남을 제안한 적이 " +
        "없다는 취지의 설명을 들었다며 부지 선정 과정과 예산 편성 기준을 공개하라고 요구했다. " +
        "앞서 6월에는 고동진 의원(전 삼성전자 IM부문장)이 '강제거나 압박했다는 의구심을 가질 수밖에 " +
        "없다'고 했다.",
      assertionType: "CLAIM",
      assertedBy: "국민의힘(조지연·고동진 의원)",
      sourceIds: ["src-fnnews-20261011", "src-fnnews-20260625"],
      verified: true,
    },
    {
      id: "claim-sk-chairman",
      text:
        "최태원 SK 회장은 10월 9일 광주 군공항 부지를 찾아 '전력과 용수가 늦어도 우리가 타이밍을 " +
        "맞출 수 있다면 먼저 들어가겠다'며 조기 착공 의지를 밝혔다. 호남 클러스터를 용인의 3분의 2 " +
        "규모로 계획하고 있다고 했다.",
      assertionType: "CLAIM",
      assertedBy: "최태원 SK 회장",
      sourceIds: ["src-fnnews-20261011"],
      verified: true,
    },
    {
      id: "claim-fast-track",
      text:
        "대통령은 환경영향평가 기간 단축, 행정절차 동시 진행, 협의 취득과 강제 수용 절차의 동시 " +
        "착수를 지시했다. 7월 9일 군공항 주변 364.19㎢가 토지거래허가구역으로, 7월 29일 군공항 " +
        "일원 826만㎡가 국가산업단지 후보지로 지정됐다.",
      assertionType: "FACT",
      sourceIds: ["src-khan-20260706", "src-kwangju-20260810"],
      verified: true,
    },
    {
      id: "claim-airport-relocation",
      text:
        "클러스터는 군공항이 옮겨 가야 들어설 수 있다. 무안군 망운면이 4월 예비 이전 후보지로 " +
        "선정됐지만, 7월 28일 예정이던 이전부지 선정위원회가 무안군 불참으로 연기되는 등 절차가 " +
        "멈췄다(8월 보도 기준). 팹 가동 목표는 2030년이다.",
      assertionType: "FACT",
      sourceIds: ["src-kwangju-20260810"],
      verified: true,
    },
    {
      id: "claim-infra-doubt",
      text:
        "야당과 업계 일부는 인력·용수·전력이 함께 갖춰져야 하는데 전력 공급 구체안이 부족하다고 " +
        "지적했다. 산업통상부는 투자 계획이 있어야 공급 계획을 세울 수 있다고 반박했다.",
      assertionType: "CLAIM",
      assertedBy: "국민의힘·업계 일부 / 산업통상부",
      sourceIds: ["src-herald-20260718"],
      verified: false,
    },
  ],
  critiqueIds: ["claim-opposition-pressure", "claim-airport-relocation", "claim-infra-doubt"],
  timeline: [
    {
      id: "t-vision",
      date: "2026-06-30",
      datePrecision: "day",
      title: "서남권 첨단산업 발전 비전",
      summary: "투자 계획 896조 원.",
      claimIds: ["claim-investment-plan"],
    },
    {
      id: "t-site",
      date: "2026-07-06",
      datePrecision: "day",
      title: "광주 군공항 부지 결정",
      summary: "민관합동점검회의.",
      claimIds: ["claim-site-decision", "claim-site-reason"],
    },
    {
      id: "t-industrial-complex",
      date: "2026-07-29",
      datePrecision: "day",
      title: "국가산단 후보지 지정",
      summary: "군공항 일원 826만㎡.",
      claimIds: ["claim-fast-track"],
    },
    {
      id: "t-dispute",
      date: "2026-10-08",
      datePrecision: "day",
      title: "'부지 누가 골랐나' 공방",
      summary: "야당 자료 공개, 산업부 반박.",
      claimIds: ["claim-opposition-pressure", "claim-ministry-position"],
    },
  ],
  gaps: [
    "기업과 정부 사이에 누가 먼저 호남·광주 군공항을 제안했는지 보여 주는 회의록이나 공문은 공개되지 않아 확인하지 못했다.",
    "삼성전자·SK하이닉스의 이사회 투자 결정 같은 공식 공시를 확인하지 못했다.",
    "8월 이후 군공항 이전부지 선정 절차가 재개됐는지 확인하지 못했다.",
    "전력·용수 공급 계획의 확정 내용은 확인하지 못했다.",
  ],
  sources: [
    {
      id: "src-khan-20260706",
      title: "호남 반도체 클러스터, 광주 군 공항 부지에 짓는다···\"250만평 부지, 도심·KTX역 인접\"",
      publisher: "경향신문",
      url: "https://www.khan.co.kr/article/202607061655001",
      publishedAt: "2026-07-06",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-kwangju-20260810",
      title: "광주 반도체 클러스터 본궤도…군공항 부지 국가산단 '속도'",
      publisher: "광주일보",
      url: "https://v.daum.net/v/20260810002540507",
      publishedAt: "2026-08-10",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-fnnews-20260625",
      title: "반도체 클러스터 호남行 후폭풍..野 \"기업이 결정해야\"",
      publisher: "파이낸셜뉴스",
      url: "https://www.fnnews.com/news/202606251434594280",
      publishedAt: "2026-06-25",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-fnnews-20261011",
      title: "최태원, 호남반도체에 힘 실었지만…\"부지 누가 골랐나\" 진실공방 '시끌'",
      publisher: "파이낸셜뉴스",
      url: "https://www.fnnews.com/news/202610111824115160",
      publishedAt: "2026-10-11",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-herald-20260718",
      title: "\"한전 하나 더 지어야 할 판\"…삼성전자 前 사장도 비판한 호남 클러스터",
      publisher: "헤럴드경제",
      url: "https://biz.heraldcorp.com/article/10811481",
      publishedAt: "2026-07-18",
      type: "press",
      license: "link-only",
    },
  ],
};
