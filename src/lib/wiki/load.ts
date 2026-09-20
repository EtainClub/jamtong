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

/**
 * 페이지를 한 줄로.
 *
 * 검색 결과와 메타 설명이 같은 문장을 쓴다. 두 곳에서 따로 만들면 한쪽은
 * "개념 페이지. 갱신 2026-09-20."처럼 내용이 없는 문장이 된다 — 실제로
 * 그랬다.
 */
export function pageSummary(page: WikiPage, max = 150): string {
  const first = page.body
    /* 앵커와 위키링크 껍데기를 벗기고 안의 말만 남긴다. */
    .replace(/\^\[[^\]]+\]/g, " ")
    .replace(/\[\[([^\]|#]+)(?:[|#][^\]]*)?\]\]/g, "$1")
    .split(/\n{2,}/)
    .map((block) => block.replace(/\s+/g, " ").trim())
    /* 제목·표·인용은 건너뛴다. 설명이 될 만한 첫 문단을 찾는다. */
    .find((block) => block.length > 20 && !/^[#>|`*-]/.test(block));

  if (!first) return page.title;
  return first.length > max ? first.slice(0, max - 1) + "…" : first;
}

export function getPage(name: string): WikiPage | undefined {
  return allPages().find((page) => page.name === name);
}

/** 카탈로그는 `/wiki` 자체가 맡는다. 나머지가 하위 경로를 갖는다. */
export function contentPages(): WikiPage[] {
  return allPages().filter((page) => page.name !== "index");
}

export interface WikiConceptCard {
  name: string;
  title: string;
  /** 카탈로그가 그 페이지에 붙여 둔 한 줄. */
  blurb: string;
}

/**
 * 홈에 세울 개념 페이지 목록.
 *
 * 한 줄 소개를 따로 두지 않고 `index.md`가 이미 적어 둔 것을 읽는다. 카탈로그는
 * ingest마다 에이전트가 갱신하므로, 화면에 문구를 복사해 두면 그날부터 두 곳이
 * 갈라진다. 카탈로그에 없는 개념 페이지는 홈에도 나오지 않는다 — 그게 맞다,
 * 카탈로그에 없으면 lint가 이미 오류로 잡는다.
 */
export function conceptCards(): WikiConceptCard[] {
  const index = getPage("index");
  if (!index) return [];

  /* 카탈로그 항목은 두 줄로 접혀 있기도 하다. 들여쓴 줄을 앞줄에 붙인다. */
  const lines: string[] = [];
  for (const raw of index.body.split("\n")) {
    if (/^\s{2,}\S/.test(raw) && lines.length > 0) {
      lines[lines.length - 1] += " " + raw.trim();
      continue;
    }
    lines.push(raw);
  }

  const titles = new Map(allPages().map((page) => [page.name, page]));
  const out: WikiConceptCard[] = [];

  for (const line of lines) {
    const match = /^-\s+\[\[(concept\/[^\]]+)\]\]\s+—\s+(.*)$/.exec(line.trim());
    if (!match) continue;
    const page = titles.get(match[1]);
    if (!page) continue;
    /*
     * 카탈로그의 한 줄은 제목을 한 번 더 적고 시작한다("개혁. 무엇이 언제
     * 바뀌었는가."). 목록에서는 그게 자연스럽지만 카드에서는 제목이 두 번
     * 보인다. 앞머리가 제목과 같으면 떼어낸다.
     */
    const plain = match[2].replace(/\*\*/g, "").trim();
    const withoutTitle = plain.startsWith(page.title + ".")
      ? plain.slice(page.title.length + 1).trim()
      : plain;

    out.push({
      name: page.name,
      title: page.title,
      blurb: withoutTitle.length > 0 ? withoutTitle : plain,
    });
  }

  return out;
}
