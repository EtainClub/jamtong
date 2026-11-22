import type { PolicyInput } from "./schema";

/**
 * 최교진 교육부 장관의 AI 부정행위 관련 국회 발언과 사퇴 (2026년 11월).
 *
 * 대통령 X 게시물 답글에 "교육부 장관이 부정행위 대응에서 무책임한 답변을 했고, 그런 인사를 임명한 대통령에게도
 * 책임이 있다"는 주장이 달렸다(잼통 Voice #304). 발언과 비판, 사퇴·면직 경과를 적는다.
 *
 * ★ '임명 책임'은 평가다. 판정하지 않고 사실 경과(발언 → 비판 → 사의 → 면직 재가)만 적는다.
 * ★ 수능 대책 전체는 policy:csat-ai-cheating-2027.
 * ★ 2026-11-22 처음 등록 — 잼통 Voice 이슈 #304.
 */
export const CHOI_KYO_JIN_RESIGNATION: PolicyInput = {
  slug: "choi-kyo-jin-resignation",
  title: "최교진 교육부 장관의 AI 부정행위 발언과 사퇴",
  scope: "2026년 11월 16일 국회 교육위원회 발언, 교원단체·야당의 비판, 11월 22일 사의 표명과 대통령의 면직안 재가",
  ministries: ["교육부"],
  categories: ["institution"],
  asOf: "2026-11-22",
  rumors: [
    {
      id: "rumor-minister",
      text: "교육부 장관이 부정행위 대응에서 무책임한 답변을 했고, 그런 인사를 임명한 대통령에게도 책임이 있다",
      claimIds: ["claim-remark", "claim-critique", "claim-resign", "claim-dismissal"],
    },
  ],
  claims: [
    {
      id: "claim-remark",
      text:
        "최교진 장관은 11월 16일 국회 교육위원회에서 박정훈 국민의힘 의원이 AI 부정행위를 100% 적발할 수 있느냐고 묻자 " +
        "\"전 못할 것 같습니다\", \"제 나이가 있어서 그런지 (개인적으로) 그건 못 할 것 같다\"고 답했다.",
      assertionType: "FACT",
      sourceIds: ["src-khan-202611181652001"],
      verified: true,
    },
    {
      id: "claim-briefing",
      text:
        "장관은 17일 국무총리의 수능 대책 브리핑에 나오지 않았고 최은옥 차관이 대신 발표했다. 교육부는 일정 변경 때문이라고 했고, " +
        "이때는 사퇴를 \"전혀 검토된 바가 없다\"고 밝혔다.",
      assertionType: "FACT",
      sourceIds: ["src-khan-202611181652001"],
      verified: true,
    },
    {
      id: "claim-critique",
      text:
        "한국교원단체총연합회(교총)는 성명에서 \"수험생·학부모의 절박함을 전혀 헤아리지 못하는 태도\"라며 사퇴를 요구했다. " +
        "국민의힘 임이자 정책위의장은 수능 뒤 해임건의안을 내겠다고 했다. 교육부가 스마트안경 단속에 머물다 뒤늦게 대응을 " +
        "넓혔다는 비판도 이어졌다.",
      assertionType: "FACT",
      sourceIds: ["src-khan-202611181652001", "src-fnnews-202611221927094002"],
      verified: true,
    },
    {
      id: "claim-resign",
      text:
        "최 장관은 수능이 끝난 뒤인 11월 22일 \"수능이 마무리된 만큼 책임을 통감하고 사의를 표명한다\"며 사의를 밝혔다.",
      assertionType: "FACT",
      sourceIds: ["src-fnnews-202611221927094002", "src-etoday-2651320"],
      verified: true,
    },
    {
      id: "claim-dismissal",
      text:
        "대통령은 같은 날 면직안을 재가했다. 강유정 청와대 대변인은 \"최교진 교육부 장관의 면직안이 재가 완료됐다\"고 밝혔다. " +
        "재임 기간은 약 1년 2개월이다.",
      assertionType: "FACT",
      sourceIds: ["src-fnnews-202611221927094002"],
      verified: true,
    },
  ],
  critiqueIds: ["claim-critique"],
  timeline: [
    {
      id: "t-remark",
      date: "2026-11-16",
      datePrecision: "day",
      title: "국회 교육위 \"제 나이가 있어서\" 발언",
      summary: "AI 부정행위 100% 적발 질문에 대한 답.",
      claimIds: ["claim-remark"],
    },
    {
      id: "t-resign",
      date: "2026-11-22",
      datePrecision: "day",
      title: "사의 표명, 같은 날 면직 재가",
      summary: "\"책임을 통감\".",
      claimIds: ["claim-resign", "claim-dismissal"],
    },
  ],
  gaps: [
    "국회 영상회의록으로 발언 전체를 확인하지 못했다. 경향신문과 파이낸셜뉴스가 옮긴 문장이 조금 다르다.",
    "후임 장관 지명과 직무대행 체계는 11월 22일 기준 공식 발표를 확인하지 못했다.",
  ],
  sources: [
    {
      id: "src-khan-202611181652001",
      title: "\"AI 커닝 적발 자신 없어\" 최교진 발언에 교육계 \"이주호를 다시 돌아 볼 정도\"···교육부 장관 리더십 도마에",
      publisher: "경향신문",
      url: "https://www.khan.co.kr/article/202611181652001",
      publishedAt: "2026-11-18",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-fnnews-202611221927094002",
      title: "'AI 부정행위' 묻자 \"제 나이가 있어서\"…李대통령, 최교진 면직안 재가",
      publisher: "파이낸셜뉴스",
      url: "https://www.fnnews.com/news/202611221927094002",
      publishedAt: "2026-11-22",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-etoday-2651320",
      title: "수능 개편론 확산⋯서·논술형 도입 넘어 폐지론까지 [AI커닝 후폭풍]",
      publisher: "이투데이",
      url: "https://www.etoday.co.kr/news/view/2651320",
      publishedAt: "2026-11-22",
      type: "press",
      license: "link-only",
    },
  ],
};
