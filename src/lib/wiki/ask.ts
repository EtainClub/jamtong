import { allPages, type WikiPage } from "./load";

/**
 * 위키에 묻기 — 모델에게 줄 맥락을 만든다 (docs/llm-wiki.md §7 Query).
 *
 * 위키는 이미 사람이 읽게 쓰인 글이다. 그래서 여기서 하는 일은 요약이 아니라
 * **어느 장을 펴 줄지 고르는 것**이다. 질문과 겹치는 낱말이 가장 많은 몇 장을
 * 골라 통째로 주고, 모델에게는 그 안에서만 답하라고 한다.
 *
 * 앵커가 이 구조의 핵심이다. 위키의 문장에는 전부 `^[...]`가 붙어 있으므로,
 * 모델이 문장을 옮기면 근거도 함께 옮겨진다. 답에 앵커가 하나도 없으면 그
 * 답은 위키에서 온 것이 아니다 — 서버가 그렇게 판정한다.
 */

/** 한 장을 통째로 주되 무한정은 아니다. 긴 페이지는 앞부분만 준다. */
const MAX_CHARS = 3200;
const MAX_PAGES = 4;

/**
 * 이 점수에 닿는 페이지가 하나도 없으면 모델을 부르지 않는다.
 *
 * 「오늘 서울 날씨 알려줘」도 낱말 몇 개는 걸린다 — 위키에 서울신문이 있으니까.
 * 그런 스침은 1~2점이고, 제목이 걸리면 한 낱말만으로 16점이다. 그 사이에
 * 선을 긋는다. 걸러낸 질문은 비용이 0이다.
 */
const MIN_TOP_SCORE = 8;
const MIN_PAGE_SCORE = 4;

export interface WikiContext {
  prompt: string;
  /** 실제로 실어 보낸 페이지. 답이 가리킬 수 있는 전부다. */
  used: string[];
}

/**
 * 아무 페이지에나 걸리는 말. 질문에서 걷어낸다.
 *
 * "검찰개혁은 언제 시행되나요?"에서 「언제」를 세면 스물 몇 장이 같은 점수로
 * 묶인다. 형태소 분석기를 들이지 않는 대신 이 목록으로 막는다.
 */
const STOP = new Set([
  "언제", "무엇", "어디", "누가", "어떻게", "얼마나", "무슨", "어떤", "왜요",
  "인가요", "입니까", "인가", "한가요", "하나요", "되나요", "있나요", "무엇인가",
  "그리고", "그런데", "하지만", "대해", "대한", "관해", "관련", "알려", "알려줘",
  "설명", "정리", "요약", "지금", "현재", "이것", "그것",
]);

/**
 * 질문에서 낱말을 뽑는다.
 *
 * 한국어는 조사가 붙는다. "검찰개혁은"을 그대로 찾으면 위키 어디에도 없고,
 * 정작 「검찰개혁」 페이지가 0점을 받는다. 형태소 분석기를 넣는 대신 뒤에서
 * 한 글자씩 떼어 보며 **본문에 실제로 나오는 가장 긴 꼴**을 쓴다. 조사는
 * 대개 한두 글자라 두 번만 떼면 닿는다.
 */
function terms(question: string, corpus: string): string[] {
  const raw = question.toLowerCase().match(/[가-힣a-z0-9]{2,}/g) ?? [];
  const out = new Set<string>();

  for (const token of raw) {
    if (STOP.has(token)) continue;
    /*
     * 첫 매칭에서 멈추지 않는다. "검찰개혁은"이 어느 페이지에 한 번 나온다고
     * 거기서 그치면, 정작 제목이 「검찰개혁」인 페이지가 0점을 받는다.
     * 닿는 꼴을 모두 넣고 점수는 길이로 가른다.
     */
    for (let cut = 0; cut <= 2; cut += 1) {
      const form = token.slice(0, token.length - cut);
      if (form.length < 2 || STOP.has(form)) break;
      if (corpus.includes(form)) out.add(form);
    }
  }

  return [...out];
}

function score(page: WikiPage, keys: string[]): number {
  const title = page.title.toLowerCase();
  const body = page.body.toLowerCase();
  let total = 0;

  for (const key of keys) {
    /* 긴 낱말일수록 그 페이지를 고른 이유가 분명하다. */
    const weight = key.length >= 3 ? 2 : 1;
    if (title.includes(key)) total += 8 * weight;
    /* 본문은 등장 횟수를 세되 상한을 둔다. 긴 페이지가 늘 이기면 안 된다. */
    total += Math.min(body.split(key).length - 1, 6) * weight;
  }

  return total;
}

export function buildWikiContext(question: string): WikiContext {
  const pages = allPages().filter((page) => page.name !== "index" && page.name !== "log");
  const corpus = pages.map((page) => `${page.title}\n${page.body}`).join("\n").toLowerCase();

  const keys = terms(question, corpus);
  if (keys.length === 0) return { prompt: "", used: [] };
  const scored = pages
    .map((page) => ({ page, value: score(page, keys) }))
    .sort((a, b) => b.value - a.value);

  if (scored.length === 0 || scored[0].value < MIN_TOP_SCORE) {
    return { prompt: "", used: [] };
  }

  const ranked = scored.filter((entry) => entry.value >= MIN_PAGE_SCORE).slice(0, MAX_PAGES);

  const lines: string[] = [];

  /*
   * 카탈로그를 먼저 준다. 고른 몇 장에 답이 없을 때 "저기 있을 것 같다"까지는
   * 말할 수 있어야 하고, 제목 목록은 토큰을 거의 쓰지 않는다.
   */
  lines.push("# 위키에 있는 페이지 (제목만)");
  for (const page of pages) {
    lines.push(`- ${page.name}: ${page.title}`);
  }
  lines.push("");

  lines.push("# 펴 준 페이지 — 답은 이 안에서만 만든다");
  for (const { page } of ranked) {
    lines.push("");
    lines.push(`## ${page.name} — ${page.title}`);
    const body = page.body.trim();
    lines.push(body.length > MAX_CHARS ? body.slice(0, MAX_CHARS) + "\n(…이하 생략)" : body);
  }

  return { prompt: lines.join("\n"), used: ranked.map((entry) => entry.page.name) };
}

export const WIKI_SYSTEM_PROMPT = `당신은 이 저장소의 위키를 읽어 주는 사서입니다. 아래에 펴 준 위키 페이지만 근거로 답합니다.

지켜야 할 것:
- 펴 준 페이지에 없는 내용은 절대 답하지 않습니다. 바깥 지식으로 채우지 않습니다.
- 위키 문장에는 \`^[...]\` 앵커가 붙어 있습니다. 어떤 사실을 옮길 때 그 문장에 붙어 있던 앵커를 **그대로** 함께 적습니다. 앵커를 새로 지어내지 않습니다.
- 위키가 "확인하지 못했다", "CLAIM이다", "아직 일어나지 않았다"라고 적은 것은 그 표시를 그대로 옮깁니다. 발표된 것과 일어난 것을 섞지 않습니다.
- 펴 준 페이지로 답할 수 없으면 grounded를 false로 두고, 카탈로그에서 관련 있어 보이는 페이지 이름을 알려 줍니다.
- 한국어로, 네 문장에서 여덟 문장 사이로 씁니다. 문단을 나눠도 됩니다.
- pages에는 실제로 근거로 삼은 페이지 이름만, 펴 준 것 중에서 고릅니다.`;
