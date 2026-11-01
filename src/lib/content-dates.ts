import { execFileSync } from "node:child_process";

/**
 * 콘텐츠 파일을 마지막으로 고친 날 — 저장소 기록에서 읽는다.
 *
 * ★ 손으로 적지 않는다.
 *   "마지막 수정" 칸을 사람이 적으면 고치고 날짜를 잊는 날 거짓이 된다.
 *   커밋 날짜는 고친 사실과 함께만 바뀐다.
 *
 * ★ 모르면 비운다.
 *   빌드 환경에 .git이 없거나 얕은 복제면 모든 파일이 마지막 커밋 날짜를
 *   받는다 — 오늘 아무것도 안 고친 글이 "오늘 수정"으로 보인다. 그럴 바엔
 *   날짜를 보이지 않는다.
 *
 * 서버에서만 부른다(child_process). 빌드 한 번에 git을 한 번만 부른다. 페이지 수백 개가 저마다 부르면 느리다.
 */

let table: Map<string, string> | null | undefined;

function git(args: string[]): string {
  return execFileSync("git", args, {
    stdio: ["ignore", "pipe", "ignore"],
    maxBuffer: 64 * 1024 * 1024,
  }).toString();
}

function load(): Map<string, string> | null {
  if (table !== undefined) return table;
  try {
    if (git(["rev-parse", "--is-shallow-repository"]).trim() !== "false") return (table = null);
    const out = git(["log", "--format=%x00%cs", "--name-only", "--", "src/content"]);
    const map = new Map<string, string>();
    // 새 커밋부터 나온다. 파일이 처음 보이는 커밋이 마지막으로 고친 커밋이다.
    for (const block of out.split("\0").slice(1)) {
      const [date, ...files] = block.trim().split("\n");
      for (const file of files) if (file && !map.has(file)) map.set(file, date);
    }
    table = map;
  } catch {
    table = null;
  }
  return table;
}

/**
 * 경로들 가운데 가장 최근에 고친 날. 디렉터리를 주면(끝에 `/`) 그 안 전부를 본다.
 * 기록을 읽을 수 없으면 null.
 */
export function lastUpdated(paths: string[]): string | null {
  const map = load();
  if (!map) return null;
  let latest: string | null = null;
  for (const [file, date] of map) {
    const hit = paths.some((p) => (p.endsWith("/") ? file.startsWith(p) : file === p));
    if (hit && (!latest || date > latest)) latest = date;
  }
  return latest;
}
