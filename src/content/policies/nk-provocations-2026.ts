import type { PolicyInput } from "./schema";

/**
 * 북한의 2026년 10~11월 연속 미사일 발사와 군의 대응 태세.
 *
 * 대통령 유튜브 영상 답글 세 건에 "북한 위협으로 불안한 국민을 위해 안보를 한 번 더 살펴 달라"는 요청이 달렸다(잼통 Voice).
 * 10월 말부터 이어진 북한의 발사와, 합참·국방부가 밝힌 대응을 적는다.
 *
 * ★ 북한 드론 전력은 policy:nk-drones, DMZ 지뢰 사고는 policy:dmz-mine-2026, 전작권 전환은 policy:opcon-transfer에 있다.
 * ★ 2026-11-09 처음 등록 — 잼통 Voice 이슈 #226.
 */
export const NK_PROVOCATIONS_2026: PolicyInput = {
  slug: "nk-provocations-2026",
  title: "북한의 연속 미사일 발사와 군의 대응 (2026년 10~11월)",
  scope:
    "국방부의 남북 군사회담 제안(10월 하순) 뒤 북한의 10월 29일~11월 4일 연속 발사(600mm 방사포, 집속탄두 전술탄도·순항미사일, 신형 지대공미사일), 합참의 대응 입장",
  ministries: ["국방부", "합동참모본부"],
  categories: ["diplomacy"],
  asOf: "2026-11-09",
  rumors: [
    {
      id: "rumor-security",
      text: "북한 위협으로 불안한 국민을 위해 안보를 한 번 더 살펴 달라",
      claimIds: ["claim-oct29", "claim-sequence", "claim-jcs", "claim-new-weapons"],
    },
  ],
  claims: [
    {
      id: "claim-oct29",
      text:
        "북한은 국방부가 비무장지대 군사분계선 일대의 우발적 충돌을 막기 위한 남북 군사회담을 제안한 지 6일 만인 2026년 10월 29일 원산 일대에서 동해상으로 단거리 탄도미사일 10여 발을 쐈다. " +
        "약 250km를 날았고 600mm 방사포(KN-25)로 추정됐다. 올해 17번째 탄도미사일 발사였다.",
      assertionType: "FACT",
      sourceIds: ["src-imbc-6861638"],
      verified: true,
    },
    {
      id: "claim-sequence",
      text:
        "이어 10월 31일 전술탄도미사일, 11월 2일 전략순항미사일에 각각 집속탄두를 얹어 쐈고, 미국 중간선거 당일인 11월 4일에는 함경남도 선덕 일대에서 동해상으로 미사일 여러 발을 쐈다. 김여정 부부장은 미국의 대북 정책을 비난했다.",
      assertionType: "FACT",
      sourceIds: ["src-fnnews-20261104", "src-mt-20261104"],
      verified: true,
    },
    {
      id: "claim-new-weapons",
      text: "북한 매체는 11월 4일 신형 지대공미사일 시험을 했다고 밝혔고, 집속탄을 얹은 '화살-1형' 순항미사일의 표적은 함경남도 리원비행장으로 분석됐다.",
      assertionType: "FACT",
      sourceIds: ["src-fnnews-20261105-nk"],
      verified: true,
    },
    {
      id: "claim-jcs",
      text:
        "합참은 한미가 발사 준비 단계부터 감시했고 발사 직후 탐지·추적했다며 \"굳건한 한미 연합방위태세 하에 북한의 다양한 동향에 대해 예의주시하면서 어떠한 도발에도 압도적으로 대응할 수 있는 능력과 태세를 유지하고 있다\"고 밝혔다.",
      assertionType: "CLAIM",
      assertedBy: "합동참모본부",
      sourceIds: ["src-imbc-6861638", "src-fnnews-20261104"],
      verified: true,
    },
  ],
  critiqueIds: [],
  timeline: [
    {
      id: "t-1029",
      date: "2026-10-29",
      datePrecision: "day",
      title: "단거리 탄도미사일 10여 발",
      summary: "회담 제안 6일 만.",
      claimIds: ["claim-oct29"],
    },
    {
      id: "t-1104",
      date: "2026-11-04",
      datePrecision: "day",
      title: "선덕 일대 미사일 발사",
      summary: "미 중간선거 당일.",
      claimIds: ["claim-sequence", "claim-new-weapons"],
    },
  ],
  gaps: [
    "연속 발사에 대해 국가안보실(NSC) 회의가 열렸는지와 대통령의 지시 내용은 보도에서 확인하지 못했다.",
    "북한이 국방부의 군사회담 제안에 공식 답했는지는 확인되지 않았다.",
  ],
  sources: [
    {
      id: "src-imbc-6861638",
      title: "北, 국방부 회담 제안 6일 만에 탄도미사일 10여 발 발사‥\"250km 비행\"",
      publisher: "MBC",
      url: "https://imnews.imbc.com/news/2026/politics/article/6861638_36911.html",
      publishedAt: "2026-10-29",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-fnnews-20261104",
      title: "합참, 北 함남 선덕서 동해상으로 미사일 수발 발사…'몰아치기' 도발(종합)",
      publisher: "파이낸셜뉴스",
      url: "https://www.fnnews.com/news/202611041201208740",
      publishedAt: "2026-11-04",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-mt-20261104",
      title: "北, '美 중간선거' 당일 미사일 도발…김여정은 \"반사적 대응\" 언급",
      publisher: "머니투데이",
      url: "https://www.mt.co.kr/politics/2026/11/04/2026110413210060009",
      publishedAt: "2026-11-04",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-fnnews-20261105-nk",
      title: "北, 러시아 S-400 닮은 신형 대공미사일 쏴… '화살-1'엔 집속탄 얹어 리원비행장 겨냥 시험 발사",
      publisher: "파이낸셜뉴스",
      url: "https://www.fnnews.com/news/202611051104481078",
      publishedAt: "2026-11-05",
      type: "press",
      license: "link-only",
    },
  ],
};
