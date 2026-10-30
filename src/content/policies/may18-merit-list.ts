import type { PolicyInput } from "./schema";

/**
 * 5·18 민주유공자 명단 공개 논란과 5·18의 법적 평가.
 *
 * 부마민주항쟁 기념일 글(10월 16일) 답글에 "5·18 유공자 명단과 공적을 공개하라",
 * "5·18은 폭동이었다", "폭동이라 쓴 글이 항소심에서 무죄가 났다"는 말이 달렸다
 * (잼통 Voice). 명단이 왜 공개되지 않는지, 법원과 법률이 5·18을 어떻게 규정했는지,
 * 10월의 항소심 무죄가 무엇을 판단한 것인지 적는다.
 *
 * ★ 2026-10-30 처음 등록 — 잼통 Voice 이슈 #79, #80.
 */
export const MAY18_MERIT_LIST: PolicyInput = {
  slug: "may18-merit-list",
  title: "5·18 민주유공자 명단 공개 논란과 5·18의 법적 평가",
  scope:
    "5·18 민주유공자 명단이 비공개인 법적 근거와 판결, 2026년 명단 공개 법안, 5·18에 대한 대법원 판결·특별법, 2026년 10월 '폭동' 표현 항소심 무죄의 의미",
  ministries: ["국가보훈부"],
  categories: ["institution"],
  asOf: "2026-10-30",
  rumors: [
    {
      id: "rumor-list",
      text: "민주화가 자랑스럽다면 5·18 유공자 명단과 공적을 공개해야 한다",
      claimIds: ["claim-closed", "claim-court-list", "claim-bill", "claim-bill-oppose"],
    },
    {
      id: "rumor-riot",
      text: "5·18은 애초에 민주화운동이 아니라 폭동이었다",
      claimIds: ["claim-1997", "claim-act"],
    },
    {
      id: "rumor-acquittal",
      text: "5·18을 폭동이라 한 글이 의견이라며 항소심에서 무죄가 나왔으니 법원도 개혁해야 한다",
      claimIds: ["claim-daegu", "claim-daegu-scope", "claim-appeal"],
    },
  ],
  claims: [
    {
      id: "claim-closed",
      text:
        "국가보훈부(옛 국가보훈처)는 5·18 민주유공자 명단을 개인 신상 정보로 보고, 공공기관의 정보공개에 관한 법률 " +
        "제9조 제1항 제6호(개인 사생활 침해 우려 정보)에 따라 공개하지 않는다. 독립유공자 등 다른 유공자 명단도 같은 " +
        "원칙으로 일괄 공개하지 않는다고 설명해 왔다.",
      assertionType: "CLAIM",
      assertedBy: "국가보훈처",
      sourceIds: ["src-newsis-20190212"],
      verified: true,
    },
    {
      id: "claim-court-list",
      text:
        "5·18 유공자 명단을 공개하라며 국가보훈처를 상대로 낸 소송은 2020년 대법원에서 받아들여지지 않았다. 유공자 " +
        "명단은 개인에 관한 사항이라는 판단이었다.",
      assertionType: "FACT",
      sourceIds: ["src-heraldk-20260705"],
      verified: false,
    },
    {
      id: "claim-bill",
      text:
        "국민의힘 이진숙 의원 등은 2026년 10월 1일 5·18 관련 법률 개정안 3건을 냈다. 5·18 민주유공자와 유족, 보상금을 " +
        "받은 관련자 명단을 해마다 공고·공개하게 하고, 5·18민주화운동의 정의에 '광주 관련 지역에서'라는 장소 요건을 " +
        "더하는 내용이 들어 있다.",
      assertionType: "FACT",
      sourceIds: ["src-mtn-20261007"],
      verified: true,
    },
    {
      id: "claim-bill-oppose",
      text:
        "5·18민주유공자유족회·부상자회·공로자회와 5·18기념재단은 개정안 철회를 요구했다. 특히 장소 요건을 더하는 " +
        "대목을 가장 크게 문제 삼았다.",
      assertionType: "CLAIM",
      assertedBy: "5·18 단체",
      sourceIds: ["src-mtn-20261007"],
      verified: true,
    },
    {
      id: "claim-1997",
      text:
        "대법원은 1997년 4월 17일 전원합의체 판결(96도3376)에서 1980년 5월 광주의 시위 진압을 내란 행위로 보고 " +
        "전두환·노태우 전 대통령 등에게 내란·반란 등의 죄를 확정했다. 판결은 광주 시민들의 시위를 헌정 질서를 지키기 " +
        "위한 정당한 행위로 보았다.",
      assertionType: "FACT",
      sourceIds: ["src-scourt-1997"],
      verified: false,
    },
    {
      id: "claim-act",
      text:
        "5·18민주화운동 등에 관한 특별법 제8조는 5·18민주화운동에 대한 허위 사실을 유포하면 5년 이하의 징역 또는 " +
        "5천만 원 이하의 벌금에 처한다. 2021년 1월부터 시행됐고, 예술·학문·연구·학설·시사 보도·역사 서술 목적이면 " +
        "처벌하지 않는다.",
      assertionType: "FACT",
      sourceIds: ["src-law-518", "src-newsis-20230517"],
      verified: true,
    },
    {
      id: "claim-daegu",
      text:
        "대구지방법원 형사항소부는 2026년 10월 16일, 온라인 커뮤니티에 5·18을 '폭동'이라 쓴 40대에게 1심의 벌금 " +
        "100만 원을 깨고 무죄를 선고했다. 재판부는 이 표현을 사실의 적시가 아니라 의견으로 보았다.",
      assertionType: "FACT",
      sourceIds: ["src-seoul-20261020", "src-kbmaeil-20261027"],
      verified: true,
    },
    {
      id: "claim-daegu-scope",
      text:
        "재판부는 특별법의 처벌 대상이 '허위의 사실을 유포한 행위'로 한정돼 있어, 5·18에 대한 부정적 평가나 역사적 " +
        "의의에 대한 이견 자체는 처벌할 수 없다고 했다. 5·18이 폭동이라는 판단을 한 것이 아니라, 그 글이 처벌 조항에 " +
        "해당하는지를 판단한 것이다.",
      assertionType: "INTERPRETATION",
      sourceIds: ["src-seoul-20261020"],
      verified: true,
    },
    {
      id: "claim-appeal",
      text:
        "대구지방공소청이 상고해 대법원이 최종 판단한다. 10월 20일 국정감사에서 이 판결을 묻는 질의에 대구지방법원장은 최종 " +
        "판단은 대법원의 몫이라고 답했다.",
      assertionType: "FACT",
      sourceIds: ["src-kbmaeil-20261027", "src-seoul-20261020"],
      verified: true,
    },
    {
      id: "claim-president",
      text:
        "이재명 대통령은 2026년 5월 18일 제46주년 기념식에서 5·18 정신을 헌법 전문에 싣도록 최선을 다하겠다고 했고, " +
        "직계가족이 없어도 민주유공자로 인정받을 수 있는 직권등록제를 도입하겠다고 했다.",
      assertionType: "CLAIM",
      assertedBy: "이재명 대통령",
      sourceIds: ["src-newsis-20260518"],
      verified: true,
    },
    {
      id: "claim-critique",
      text:
        "명단 공개를 요구하는 쪽은 독립유공자 공훈록처럼 공적을 공개해야 검증이 가능하다고 주장한다. 5·18 단체 쪽은 " +
        "명단 공개가 유공자와 가족을 낙인찍고 2차 피해를 부를 수 있다고 반대한다.",
      assertionType: "OPINION",
      sourceIds: ["src-heraldk-20260705", "src-mtn-20261007"],
      verified: true,
    },
  ],
  critiqueIds: ["claim-critique"],
  timeline: [
    {
      id: "t-1997",
      date: "1997-04-17",
      datePrecision: "day",
      title: "대법원, 전두환·노태우 내란·반란죄 확정",
      summary: "광주 시위 진압을 내란 행위로 판단.",
      claimIds: ["claim-1997"],
    },
    {
      id: "t-2021",
      date: "2021-01",
      datePrecision: "month",
      title: "5·18 허위사실 유포 처벌 조항 시행",
      summary: "특별법 제8조.",
      claimIds: ["claim-act"],
    },
    {
      id: "t-bill",
      date: "2026-10-01",
      datePrecision: "day",
      title: "명단 공개·장소 요건 개정안 발의",
      summary: "국민의힘 이진숙 의원 등.",
      claimIds: ["claim-bill"],
    },
    {
      id: "t-daegu",
      date: "2026-10-16",
      datePrecision: "day",
      title: "'폭동' 표현 항소심 무죄",
      summary: "의견이라 처벌 조항에 해당하지 않는다는 판단. 공소청 상고.",
      claimIds: ["claim-daegu", "claim-appeal"],
    },
  ],
  gaps: [
    "2020년 대법원 판결의 사건번호와 선고일은 판결문으로 대조하지 못했다. 보도로만 확인했다.",
    "1997년 판결은 판결 요지로 적었고 판결문 원문과 문장 단위로 대조하지는 않았다.",
    "이진숙 의원 등의 개정안이 국회 상임위원회에서 어디까지 논의됐는지는 확인하지 못했다.",
  ],
  sources: [
    {
      id: "src-newsis-20190212",
      title: "독립유공자와 달리 5·18유공자 명단 공개 안 돼…이유는",
      publisher: "뉴시스",
      url: "https://www.newsis.com/view/NISX20190212_0000556276",
      publishedAt: "2019-02-12",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-heraldk-20260705",
      title: "정유라 \"독립 유공자 명단은 공개하는데…5·18 유공자 명단은 왜 못하나?\"",
      publisher: "헤럴드경제",
      url: "https://www.heraldk.com/article/2026070519434079672",
      publishedAt: "2026-07-05",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-mtn-20261007",
      title: "오월 단체 \"이진숙 발의 5·18 관련법 개정안 철회해야\"",
      publisher: "머니투데이방송",
      url: "https://news.mtn.co.kr/news-detail/2026100710012786854",
      publishedAt: "2026-10-07",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-scourt-1997",
      title: "대법원 1997. 4. 17. 선고 96도3376 전원합의체 판결",
      publisher: "대법원",
      url: "https://casenote.kr/%EB%8C%80%EB%B2%95%EC%9B%90/96%EB%8F%843376",
      publishedAt: "1997-04-17",
      type: "judicial",
      license: "public",
    },
    {
      id: "src-law-518",
      title: "5·18민주화운동 등에 관한 특별법",
      publisher: "국가법령정보센터",
      url: "https://www.law.go.kr/%EB%B2%95%EB%A0%B9/5%C2%B718%EB%AF%BC%EC%A3%BC%ED%99%94%EC%9A%B4%EB%8F%99%EB%93%B1%EC%97%90%EA%B4%80%ED%95%9C%ED%8A%B9%EB%B3%84%EB%B2%95",
      type: "legislative",
      license: "public",
    },
    {
      id: "src-newsis-20230517",
      title: "유튜브에 버젓이 \"5·18은 북한 소행\"…허위사실 유포 여전",
      publisher: "뉴시스",
      url: "https://www.newsis.com/view/NISX20230517_0002307052",
      publishedAt: "2023-05-17",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-seoul-20261020",
      title: "5·18 폭동 표현 '무죄' 선고한 대구지법… 국감서 거센 비판",
      publisher: "서울신문",
      url: "https://www.seoul.co.kr/news/newsView.php?id=20261020500203",
      publishedAt: "2026-10-20",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-kbmaeil-20261027",
      title: "‘5·18 폭동’ 게시글 무죄 판결에 대구지방공소청 상고",
      publisher: "경북매일",
      url: "https://www.kbmaeil.com/article/20261027500282",
      publishedAt: "2026-10-27",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-newsis-20260518",
      title: "[전문]이재명 대통령 제46주년 5·18민주화운동 기념식 기념사",
      publisher: "뉴시스",
      url: "https://www.newsis.com/view/NISX20260518_0003633913",
      publishedAt: "2026-05-18",
      type: "press",
      license: "link-only",
    },
  ],
};
