import type { PolicyInput } from "./schema";

/**
 * 힌츠페터 국제보도상: 운영 주체, 재원, 2026년 시상식과 대통령 축전.
 *
 * 11월 초 대통령 X 게시물 답글에 "힌츠페터 국제보도상 같은 행사에 세금을 쓰지 말아야 한다"(이슈 #274)와
 * "시상식에 직접 참석하지 않은 것은 5·18을 가볍게 여긴다는 뜻"(이슈 #248)이라는 말이 달렸다(잼통 Voice).
 * 두 답글은 같은 게시물에 달렸고 같은 시기(11월 5일)의 시상식을 가리키는 것으로 보고 한 페이지에 묶는다.
 *
 * ★ 이 상은 정부 행사가 아니다. 주최는 5·18기념재단과 한국영상기자협회, 후원은 광주광역시다.
 * ★ 국비가 들어가는지는 확인하지 못했다(gaps). 확인된 것은 광주시 후원과 2020년 광주시 예산 편성 계획이다.
 * ★ 2026-11-09 처음 등록 — 잼통 Voice 이슈 #274, #248.
 */
export const HINZPETER_AWARD: PolicyInput = {
  slug: "hinzpeter-award",
  title: "힌츠페터 국제보도상: 운영 주체·재원과 2026년 시상식",
  scope:
    "5·18 당시 광주를 취재한 독일 기자 위르겐 힌츠페터의 이름을 딴 국제보도상의 주최·후원 구조, 상금, 2026년 제6회 시상식과 대통령 축전",
  ministries: ["광주광역시"],
  categories: ["institution"],
  asOf: "2026-11-09",
  rumors: [
    {
      id: "rumor-tax",
      text: "힌츠페터 국제보도상 같은 행사에 세금을 쓰지 말아야 한다",
      claimIds: ["claim-organizers", "claim-origin", "claim-prize"],
    },
    {
      id: "rumor-absence",
      text: "대통령이 시상식에 직접 참석하지 않은 것은 5·18을 가볍게 여긴다는 뜻이다",
      claimIds: ["claim-organizers", "claim-2026", "claim-message"],
    },
  ],
  claims: [
    {
      id: "claim-organizers",
      text:
        "힌츠페터 국제보도상은 5·18기념재단과 한국영상기자협회가 공동으로 제정·주최하고 광주광역시가 후원하는 상이다. " +
        "정부 부처가 주최하는 행사가 아니다.",
      assertionType: "FACT",
      sourceIds: ["src-journalist-49451", "src-tf-20261102"],
      verified: true,
    },
    {
      id: "claim-origin",
      text:
        "2020년 제정을 발표할 때 두 단체는 광주시의회 의원들과 만나, 광주시가 그해 안에 예산을 편성해 이듬해 5월 상을 시작하는 방안을 논의했다.",
      assertionType: "FACT",
      sourceIds: ["src-journalist-47944"],
      verified: true,
    },
    {
      id: "claim-prize",
      text:
        "경쟁 부문(뉴스·기획·다큐멘터리)과 비경쟁 특별 부문으로 나뉘며, 제정 당시 부문별 상금은 1만 달러였다. 2025년 공모의 대상 상금은 1,500만 원이었다.",
      assertionType: "FACT",
      sourceIds: ["src-journalist-49451", "src-journalist-58737"],
      verified: true,
    },
    {
      id: "claim-2026",
      text:
        "2026년 제6회 시상식은 11월 5일 오후 6시 광주 동구 옛 전남도청 회의실에서 열렸고, 서울과 광주에서 수상작 상영회도 함께 열렸다.",
      assertionType: "FACT",
      sourceIds: ["src-tf-20261102"],
      verified: true,
    },
    {
      id: "claim-message",
      text:
        "이 대통령은 시상식에 직접 참석하지 않고 축전을 보냈다. 축전에서 \"침묵이 강요되는 현장에서 진실을 밝히는 언론인들의 기록은 불의를 멈추고 평화로 나아가게 하는 강력한 힘\"이라고 했다.",
      assertionType: "FACT",
      sourceIds: ["src-koreancenter-1435416"],
      verified: false,
    },
  ],
  critiqueIds: [],
  timeline: [
    {
      id: "t-2020",
      date: "2020",
      datePrecision: "year",
      title: "상 제정 발표",
      summary: "5·18기념재단·한국영상기자협회 공동 제정, 광주시 후원.",
      claimIds: ["claim-organizers", "claim-origin"],
    },
    {
      id: "t-2026",
      date: "2026-11-05",
      datePrecision: "day",
      title: "제6회 시상식",
      summary: "옛 전남도청. 대통령은 축전.",
      claimIds: ["claim-2026", "claim-message"],
    },
  ],
  gaps: [
    "2026년 시상식에 쓰인 광주시 예산 규모와 국비(5·18기념재단 국고보조 포함)가 들어가는지는 공개 자료에서 찾지 못했다.",
    "답글이 말한 '시상식'이 힌츠페터 시상식이라는 것은 같은 게시물·같은 시기라는 정황으로 본 것이다. 답글 원문이 다른 시상식을 가리켰을 수 있다.",
    "축전 기사의 게재일이 표시되지 않아 2026년 시상식 축전인지 기사 번호 순서로 추정했다(미검증).",
  ],
  sources: [
    {
      id: "src-journalist-47944",
      title: "5·18 진실 알린 '언론인 힌츠페터' 이름 딴 국제보도상 생긴다",
      publisher: "한국기자협회",
      url: "https://www.journalist.or.kr/m/m_article.html?no=47944",
      publishedAt: "2020",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-journalist-49451",
      title: "영상기협, 5·18재단 '힌츠페터 국제보도상' 공동 제정... 내달 1일 국제 공모",
      publisher: "한국기자협회",
      url: "https://journalist.or.kr/news/article.html?no=49451",
      publishedAt: "2021",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-journalist-58737",
      title: "2025 힌츠페터국제보도상 공모 시작",
      publisher: "한국기자협회",
      url: "https://www.journalist.or.kr/m/m_article.html?no=58737",
      publishedAt: "2025",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-tf-20261102",
      title: "세계 분쟁 현장 기록한 영상기자들 광주로…'힌츠페터국제보도상' 5일 시상식",
      publisher: "더팩트",
      url: "https://news.tf.co.kr/read/ogmeta/2383509.htm",
      publishedAt: "2026-11-02",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-koreancenter-1435416",
      title: "힌츠페터보도상에 축전…\"용기 있는 언론인에 버팀목 돼주길\"",
      publisher: "코리안센터",
      url: "https://www.koreancenter.or.kr/news/articleView.html?idxno=1435416",
      type: "press",
      license: "link-only",
    },
  ],
};
