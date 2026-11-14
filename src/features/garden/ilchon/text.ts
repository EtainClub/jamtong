import { TEXT_MAX } from "./rules";

/**
 * 방명록·1촌평의 직접 쓴 글 걸러내기 (docs/garden-miniroom.md §5.3).
 *
 * ★ 지지자 응원(cheerNotes)에는 금칙어·링크 걸러내기가 없다(길이만 본다). 그래서 여기에 가장 작은 것을 둔다.
 *   모르는 사람이 내 방에 글을 남기는 자리라, 링크와 연락처 모양(전화번호·@아이디·메신저 아이디)을
 *   막는 것이 먼저다. 욕은 몇 개만 — 나머지는 신고(feedback)와 주인의 지우기, 운영자의 가리기가 맡는다.
 * ★ 화면에서만 거른다. 규칙은 길이만 본다(firestore.rules의 lineOk()). 손으로 만든 요청은 이것을 지나칠 수
 *   있으므로, 그리는 쪽은 언제나 글로만 그린다(링크로 만들지 않는다).
 */

/** 줄바꿈과 겹친 빈칸을 하나로. 한 줄이라고 해 놓고 여러 줄이 들어오면 한 줄이 아니다(cheers.ts와 같다). */
export function cleanLine(input: string): string {
  return input.replace(/\s+/g, " ").trim();
}

const URL_RE = [
  /(https?:\/\/|www\.)/i,
  /[a-z0-9-]{2,}\s*\.\s*(com|net|org|kr|co|io|me|ly|gg|xyz|app|link|site|info|biz|tv|to|be|in|cc|so|page|shop)\b/i,
  /open\s*\.?\s*kakao/i,
];
const PHONE_RE = [
  // 숫자 사이에 빈칸·점·줄표를 끼워도 7자리가 넘으면 연락처로 본다.
  /\d(?:[\s.\-–—)(]*\d){6,}/,
  // 한글로 쓴 휴대전화 앞자리.
  /공\s*일\s*공/,
  /영\s*일\s*영/,
];
const HANDLE_RE = [
  /@\s*[a-z0-9_.]{2,}/i,
  /(카톡|카카오\s*톡|카카오|오픈\s*채팅|오픈\s*톡|오카방|텔레\s*그램|텔레|라인\s*아이디|인스타|디스코드|디코|트위터)/,
  /\b(kakao|katalk|telegram|insta(gram)?|discord|twitter|line\s*id|dm)\b/i,
  /아이디(?!어)/,
  /\bid\s*[:：]/i,
];

/**
 * 욕. 빈칸·기호·숫자를 지운 뒤에 찾는다("씨 발", "씨1발"도 잡게).
 * 짧게 둔다 — 길게 둘수록 보통 말을 잘못 막는다("시발점"은 뺀다. "씨바"는 "꽃씨 바구니"를 막아서 넣지 않는다).
 */
const SWEAR = ["씨발", "시발", "씨빨", "ㅅㅂ", "ㅆㅂ", "병신", "ㅂㅅ", "개새끼", "개새기", "좆", "존나", "지랄", "닥쳐", "미친놈", "미친년", "썅", "느금", "니애미", "섹스", "fuck", "shit"];

export type LineProblem = "empty" | "long" | "link" | "contact" | "swear";

export const LINE_PROBLEM_TEXT: Record<LineProblem, string> = {
  empty: "한 줄을 적어 주세요",
  long: `${TEXT_MAX}자까지 쓸 수 있어요`,
  link: "링크는 남길 수 없어요",
  contact: "연락처나 메신저 아이디는 남길 수 없어요",
  swear: "고운 말로 적어 주세요",
};

/** 직접 쓴 한 줄의 문제. 없으면 null. cleanLine을 거친 글을 넘긴다. */
export function lineProblem(text: string): LineProblem | null {
  if (text.length === 0) return "empty";
  if (text.length > TEXT_MAX) return "long";
  if (URL_RE.some((re) => re.test(text))) return "link";
  if (PHONE_RE.some((re) => re.test(text)) || HANDLE_RE.some((re) => re.test(text))) return "contact";
  const squashed = text
    .toLowerCase()
    .replace(/시발점/g, "")
    .replace(/[\s\d\p{P}\p{S}_]/gu, "");
  if (SWEAR.some((w) => squashed.includes(w))) return "swear";
  return null;
}
