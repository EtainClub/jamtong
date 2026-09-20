import { readFileSync } from "node:fs";
import { join } from "node:path";

/**
 * 요약 파일을 읽어 온다.
 *
 * 요약은 이 폴더의 `text/NN.md`에 있다. 그 글을 TS 파일로 복사해 두면 같은
 * 글이 두 군데 살면서 조용히 갈라진다. 위키를 화면에 올릴 때와 같은 방식으로,
 * 빌드 때 한 번 읽어 정적 페이지로 굽는다.
 *
 * ★ 저장소 안에 둔다.
 *   처음에는 `refs/`에서 읽었는데 그 경로는 .gitignore에 걸려 있다. 손에서는
 *   돌아가고 배포 빌드에서는 파일이 없어 깨지는 자리다. 화면에 뜨는 글은
 *   전부 저장소에 있어야 한다 — 콘텐츠 검증이 도는 이유도 같다.
 *
 * 파일 모양: 첫 줄이 제목(앞에 "소챕터 제목"이 붙어 있기도 하다), 그 아래로
 * 빈 줄로 갈린 문단들. 그 사이에 소제목이 섞여 있다 — 스물두 장 가운데
 * 다섯 장에 서넛씩.
 *
 * 소제목은 `## `를 붙여 표시해 둔다. 화면이 그것을 보고 제목으로 그린다.
 * 마크다운을 쓰는 것이 아니라 문단과 제목을 가르는 표시일 뿐이다 — 문장으로
 * 끝나지 않는 짧은 줄이 소제목이라는 규칙을 한 곳에만 두려는 것이다.
 */

const DIR = join(process.cwd(), "src", "content", "books", "together", "text");

export interface LoadedChapter {
  title: string;
  paragraphs: string[];
}

/**
 * 소제목인가.
 *
 * 문장으로 끝나지 않고 짧은 줄이면 소제목이다. 자료가 마크다운을 쓰지 않아서
 * 모양으로 가를 수밖에 없는데, 스물두 장을 훑어 보니 이 둘로 갈리지 않는
 * 줄은 없었다. 문단은 전부 "…습니다."로 끝나고 200자를 넘는다.
 */
function isHeading(line: string): boolean {
  return line.length < 40 && !/[다요]\.$/.test(line);
}

export function loadChapter(file: string, drop: number[] = []): LoadedChapter {
  const lines = readFileSync(join(DIR, file), "utf8").split("\n");
  const title = (lines[0] ?? "").replace(/^소챕터 제목\s*/, "").trim();

  const paragraphs = lines
    .slice(1)
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    /* 자료에 남은 생성 흔적을 자리로 지정해 뺀다. 무엇을 뺐는지는 chapters.ts에 적는다. */
    .filter((_, index) => !drop.includes(index))
    .map((line) => (isHeading(line) ? `## ${line}` : line));

  return { title, paragraphs };
}

/**
 * 문단을 빈 줄로 이어 하나의 본문으로. 화면과 인용 검사가 이 문자열을 본다.
 *
 * cutAt을 주면 그 말이 처음 나오는 자리에서 뒤를 통째로 버린다. 문단 단위로
 * 빼는 것으로는 모자란 경우가 있어서다 — 20.md는 마지막 문단 **안쪽**에
 * 생성 흔적이 붙어 있어 문단을 통째로 빼면 본문까지 사라진다.
 */
export function bodyOf(chapter: LoadedChapter, cutAt?: string): string {
  const joined = chapter.paragraphs.join("\n\n");
  if (!cutAt) return joined;
  const at = joined.indexOf(cutAt);
  return at === -1 ? joined : joined.slice(0, at).trimEnd();
}

/** 읽는 데 걸리는 시간. 한국어 500자를 1분으로 본다. */
export function minutesOf(chapter: LoadedChapter): number {
  const chars = chapter.paragraphs.join("").length;
  return Math.max(2, Math.round(chars / 500));
}
