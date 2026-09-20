import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

/**
 * 위키 페이지를 디스크에서 읽는다.
 *
 * `wiki/`는 에이전트가 쓰는 마크다운이고 빌드 때 한 번 읽어 정적 페이지로
 * 굽는다. 런타임에 파일을 읽지 않으므로 배포본에 fs 접근이 남지 않는다.
 *
 * 형식 검사는 여기서 하지 않는다. `pnpm wiki:lint`가 frontmatter·위키링크·
 * 앵커를 이미 보고, 오류가 있으면 `pnpm check`가 배포 전에 멈춘다.
 */

const WIKI_DIR = join(process.cwd(), "wiki");

export interface WikiPage {
  /** wiki/ 기준, 확장자 없는 경로. 위키링크가 쓰는 이름이자 URL 조각이다. */
  name: string;
  title: string;
  kind: string;
  updated?: string;
  /** frontmatter를 뗀 본문. */
  body: string;
}

/** frontmatter를 가른다. 중첩 없는 key: value만 쓰므로 파서를 들이지 않는다. */
function split(text: string): { front: Record<string, string>; body: string } {
  const match = /^---\n([\s\S]*?)\n---\n?/.exec(text);
  if (!match) return { front: {}, body: text };
  const front: Record<string, string> = {};
  for (const line of match[1].split("\n")) {
    const at = line.indexOf(":");
    if (at > 0) front[line.slice(0, at).trim()] = line.slice(at + 1).trim();
  }
  return { front, body: text.slice(match[0].length) };
}

let cache: WikiPage[] | null = null;

export function allPages(): WikiPage[] {
  if (cache) return cache;

  const out: WikiPage[] = [];
  const walk = (dir: string, prefix: string) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      if (entry.isDirectory()) {
        walk(join(dir, entry.name), prefix + entry.name + "/");
        continue;
      }
      if (!entry.name.endsWith(".md")) continue;
      const name = prefix + entry.name.slice(0, -3);
      const { front, body } = split(readFileSync(join(dir, entry.name), "utf8"));
      out.push({
        name,
        title: front.title ?? name,
        kind: front.kind ?? "meta",
        updated: front.updated,
        body,
      });
    }
  };
  walk(WIKI_DIR, "");

  cache = out.sort((a, b) => a.name.localeCompare(b.name));
  return cache;
}

export function getPage(name: string): WikiPage | undefined {
  return allPages().find((page) => page.name === name);
}

/** 카탈로그는 `/wiki` 자체가 맡는다. 나머지가 하위 경로를 갖는다. */
export function contentPages(): WikiPage[] {
  return allPages().filter((page) => page.name !== "index");
}
