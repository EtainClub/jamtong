import { cartelSchema, type CartelEntry, type CartelInput } from "./schema";

/**
 * 아직 열지 못한 카르텔들.
 *
 * 이름은 서 있고 내용은 비어 있다. 목록에서 지우는 쪽이 화면은 깔끔하지만,
 * 그러면 무엇을 아직 못 했는지가 보이지 않는다. 자서전 여섯 권을 서지 정보만
 * 두고 세워 둔 것과 같은 처리를 한다 — 비어 있다고 적고 색인하지 않는다.
 *
 * 근거가 붙기 시작하면 그 카르텔은 여기서 나가 제 파일을 갖는다. 파일은
 * 담을 것이 생겼을 때 만든다. 담합·통신·휴게소가 그렇게 나갔고, 의료는
 * 한 번 비워 두었다가 법률 원문과 정책브리핑을 찾고 나서 나갔다.
 *
 * ★ 왜 비었는지를 카르텔마다 적는다.
 *   "조사 필요" 네 글자로는 다음에 여는 사람이 어디서부터 시작할지 모른다.
 *   무엇을 찾다가 무엇에 막혔는지까지 적는다.
 *
 * ★ 「노동조합」은 여기에도 없다.
 *   출발점이 된 카드뉴스에는 있었지만 등록하지 않았다. 이 정부는 노란봉투법을
 *   2026년 3월 시행하고 노동 분야 제1호 국정과제로 삼았다 — 방향이 반대다.
 *   정부나 대통령이 노동조합을 카르텔로 지목한 자료를 찾지 못했고, 근거 없이
 *   실으면 이 위키가 없는 정책을 만들어 내는 셈이 된다.
 *   (docs/achievements/cartel.md 2절)
 */

const pending = (raw: CartelInput): CartelEntry => ({
  cartel: cartelSchema.parse(raw),
  claims: [],
  sources: [],
});

/**
 * 정유사.
 *
 * `oil-supply`에 석유 최고가격제가 있지만 그것은 담합 제재가 아니라 가격
 * 규제다. "담합을 깼다"로 읽히지 않게 하려면 틀을 다시 짜야 해서, 업적을
 * 성급히 걸지 않고 비워 둔다.
 */
export const refinery = pending({
  id: "refinery",
  slug: "refinery",
  name: "정유사",
  summary: "기름값이 어떻게 정해지는지. 아직 정리하지 않았습니다.",
  openQuestions: [
    "정유사 담합을 제재한 사례를 찾지 못했습니다.",
    "`oil-supply`의 석유 최고가격제는 담합 제재가 아니라 가격 규제입니다. 이 표적에 걸려면 틀을 다시 써야 합니다.",
  ],
});

export const finance = pending({
  id: "finance",
  slug: "finance",
  name: "금융",
  summary: "은행이 무엇으로 돈을 버는지. 아직 정리하지 않았습니다.",
  openQuestions: [
    "‘이자장사’ 비판과 생산적·포용 금융 기조는 확인했지만, 카르텔을 깬 구체적 조치는 찾지 못했습니다.",
    "`gyeonggi-microloan`은 대안을 만든 일이지 카르텔을 깬 일이 아닙니다.",
  ],
});

export const bureaucracy = pending({
  id: "bureaucracy",
  slug: "bureaucracy",
  name: "관료",
  summary: "공직 사회의 이권과 자리 돌리기. 아직 정리하지 않았습니다.",
  openQuestions: ["관련 제도나 조치를 찾지 못했습니다."],
});

/**
 * 언론.
 *
 * 카드뉴스의 문구("특정 세력의 왜곡과 편향")는 사실 서술이 아니라 평가다.
 * 그대로 옮길 수 없고, 대신 무엇이 어떻게 바뀌었는지를 적을 자료를 찾아야 한다.
 */
export const media = pending({
  id: "media",
  slug: "media",
  name: "언론",
  summary: "뉴스가 어디를 거쳐 사람에게 닿는지. 아직 정리하지 않았습니다.",
  openQuestions: [
    "관련 제도나 조치를 찾지 못했습니다.",
    "출발점이 된 카드뉴스의 문구는 평가여서 그대로 쓸 수 없습니다. 무엇이 언제 바뀌었는지로 다시 써야 합니다.",
  ],
});

/**
 * 교육.
 *
 * 「사교육 카르텔」은 2023년 이전 정부가 킬러문항을 두고 쓴 말이다. 이 정부가
 * 같은 틀로 무엇을 했는지는 확인하지 못했다. 남의 정부 일을 이 자리에 옮기지
 * 않는다.
 */
export const education = pending({
  id: "education",
  slug: "education",
  name: "교육",
  summary: "사교육비와 입시. 아직 정리하지 않았습니다.",
  openQuestions: [
    "‘사교육 카르텔’은 2023년 이전 정부가 쓴 말입니다. 이 정부의 조치는 확인하지 못했습니다.",
    "대통령이 담합 분야로 이름을 댄 것 중 ‘교복’이 있습니다. 교육으로 볼지 담합으로 볼지 정하지 못했습니다.",
  ],
});

export const PENDING_CARTELS: CartelEntry[] = [
  refinery,
  finance,
  bureaucracy,
  media,
  education,
];
