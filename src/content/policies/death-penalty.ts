import type { PolicyInput } from "./schema";

/**
 * 사형제의 현재: 집행 중단 29년, 헌법재판소 심리, 폐지 법안, 인권위 권고.
 *
 * 대통령 유튜브 영상 답글에 "사형을 집행하고 아동·성범죄·사기에 태형을 추가해 달라"는 제안이 달렸다(잼통 Voice).
 * 사형 집행이 왜 멈춰 있는지, 법적으로 어디까지 왔는지 적는다.
 *
 * ★ 태형은 현행 형법의 형벌 종류에 없다. 이 페이지는 사형만 다룬다(gaps).
 * ★ 2026-11-09 처음 등록 — 잼통 Voice 이슈 #250.
 */
export const DEATH_PENALTY: PolicyInput = {
  slug: "death-penalty",
  title: "사형제의 현재: 집행 중단과 폐지 논의 (2026년)",
  scope:
    "1997년 12월 이후 사형 미집행, 사형 확정자 수, 헌법재판소의 1996·2010년 합헌 결정과 세 번째 사건 심리, 2025년 사형제 폐지 특별법안, 2026년 인권위 권고",
  ministries: ["법무부", "국가인권위원회"],
  categories: ["institution"],
  asOf: "2026-11-09",
  rumors: [
    {
      id: "rumor-execute",
      text: "사형을 집행하고 아동·성범죄·사기에 태형을 추가해 달라",
      claimIds: ["claim-moratorium", "claim-court", "claim-bill", "claim-nhrck"],
    },
  ],
  claims: [
    {
      id: "claim-moratorium",
      text:
        "한국은 1997년 12월 30일 이후 사형을 집행하지 않았다. 법률상 사형제는 남아 있지만 국제사회에서는 사실상 사형폐지국으로 분류된다. 2026년 2월 보도 기준 사형 확정자는 57명이다.",
      assertionType: "FACT",
      sourceIds: ["src-segye-20261010", "src-sisa-20260208"],
      verified: true,
    },
    {
      id: "claim-court",
      text:
        "헌법재판소는 1996년과 2010년 사형제를 합헌으로 결정했다(2010년은 5대 4). 현재 세 번째 헌법소원 사건을 심리하고 있다.",
      assertionType: "FACT",
      sourceIds: ["src-segye-20261010", "src-sisa-20260208"],
      verified: true,
    },
    {
      id: "claim-bill",
      text: "2025년 11월 범여권 의원 65명이 종신형을 대안으로 하는 사형제 폐지 특별법안을 발의했다.",
      assertionType: "FACT",
      sourceIds: ["src-sisa-20260208"],
      verified: true,
    },
    {
      id: "claim-nhrck",
      text:
        "국가인권위원회는 2026년 10월 세계 사형폐지의 날을 맞아 사형 미집행 30년을 앞두고 정부와 국회에 법·제도적 폐지 논의를 본격화하고 사형폐지 의정서 가입을 검토하라고 촉구했다. " +
        "정부는 2020년 이후 유엔 사형집행 모라토리엄 결의에 찬성해 왔다.",
      assertionType: "FACT",
      sourceIds: ["src-newspim-20261008", "src-hankook-20261008-death"],
      verified: true,
    },
  ],
  critiqueIds: [],
  timeline: [
    {
      id: "t-last",
      date: "1997-12-30",
      datePrecision: "day",
      title: "마지막 사형 집행",
      summary: "이후 미집행.",
      claimIds: ["claim-moratorium"],
    },
    {
      id: "t-bill",
      date: "2025-11",
      datePrecision: "month",
      title: "사형제 폐지 특별법안 발의",
      summary: "종신형 대안.",
      claimIds: ["claim-bill"],
    },
    {
      id: "t-nhrck",
      date: "2026-10-08",
      datePrecision: "day",
      title: "인권위 \"폐지 논의 본격화\"",
      summary: "세계 사형폐지의 날.",
      claimIds: ["claim-nhrck"],
    },
  ],
  gaps: [
    "이재명 정부나 법무부가 사형 집행 재개 또는 폐지에 대해 새로 밝힌 공식 입장은 찾지 못했다.",
    "태형(신체형)은 현행 형법이 정한 형벌에 없고, 도입을 추진하는 정부·국회 움직임도 찾지 못했다.",
  ],
  sources: [
    {
      id: "src-segye-20261010",
      title: "마지막 사형 집행은 1997년 12월30일…\"폐지 논의 진전시키자\"",
      publisher: "세계일보",
      url: "https://www.segye.com/newsView/20261010504791",
      publishedAt: "2026-10-10",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-sisa-20260208",
      title: "29년째 멈춘 사형 집행…57명의 사형수는 지금? [정락인의 사건 속으로]",
      publisher: "시사저널",
      url: "https://v.daum.net/v/20260208160142572",
      publishedAt: "2026-02-08",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-newspim-20261008",
      title: "인권위 \"사형 미집행 30년 앞둬…법·제도적 폐지 논의 본격화해야\"",
      publisher: "뉴스핌",
      url: "https://www.newspim.com/news/view/20261008001134",
      publishedAt: "2026-10-08",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-hankook-20261008-death",
      title: "세계 사형폐지의 날… 인권위 \"사형 미집행 30년, 법적 폐지 논의할 때\"",
      publisher: "한국일보",
      url: "https://www.hankookilbo.com/news/article/A2026100817560002351",
      publishedAt: "2026-10-08",
      type: "press",
      license: "link-only",
    },
  ],
};
