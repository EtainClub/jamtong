/**
 * LLM Wiki — 건강검진 (docs/llm-wiki.md §7).
 *
 * 기계가 볼 수 있는 것만 본다. 모순이나 낡은 서술처럼 읽어야 아는 것은
 * 에이전트가 따로 훑는다 — 여기서 흉내 내면 둘 다 못 한다.
 *
 * ★ 가장 중요한 검사는 #1 깨진 앵커다.
 *   위키의 모든 단정문은 raw source의 id를 가리켜야 한다. 이 검사가 도는 한,
 *   지지자 응원처럼 검증하지 않은 곳에서 온 문장은 **달 앵커가 없어서**
 *   위키에 들어올 수 없다. 오염을 규율이 아니라 문법으로 막는 자리다.
 *
 * 오류가 하나라도 있으면 실패한다. 경고는 실패시키지 않는다 — ingest는
 * 점진적이고, 아직 안 한 것이 잘못은 아니다.
 */
import { execFileSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { ACHIEVEMENTS } from "../src/content/achievements";
import { STATEMENTS } from "../src/content/words";
import { ALL_SOURCES } from "../src/content/milestones";

const WIKI = "wiki";
const KINDS = new Set(["source", "concept", "entity", "event", "synthesis"]);

const errors: string[] = [];
const warns: string[] = [];
const err = (page: string, msg: string) => errors.push(`${page}: ${msg}`);
const warn = (page: string, msg: string) => warns.push(`${page}: ${msg}`);

/* ── 위키 읽기 ─────────────────────────────────────────────── */

interface Page {
  /** wiki/ 기준, 확장자 없는 경로. 위키링크가 쓰는 이름이다. */
  name: string;
  path: string;
  text: string;
  body: string;
  front: Record<string, string>;
}

function readPages(): Page[] {
  const out: Page[] = [];
  const walk = (dir: string, prefix: string) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      if (entry.isDirectory()) {
        walk(join(dir, entry.name), `${prefix}${entry.name}/`);
        continue;
      }
      if (!entry.name.endsWith(".md")) continue;
      const path = join(dir, entry.name);
      const text = readFileSync(path, "utf8");
      out.push({
        name: `${prefix}${entry.name.slice(0, -3)}`,
        path,
        text,
        ...split(text),
      });
    }
  };
  walk(WIKI, "");
  return out;
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

/* ── raw source의 앵커 목록 ────────────────────────────────── */

function knownAnchors(): Set<string> {
  const set = new Set<string>();
  for (const a of ACHIEVEMENTS) {
    set.add(a.slug);
    for (const c of a.claims) set.add(`${a.slug}#${c.id}`);
    // 업적은 제 출처를 제 안에 들고 있다. ALL_SOURCES만 보면 절반을 놓친다.
    for (const s of a.sources) set.add(`source:${s.id}`);
  }
  for (const s of STATEMENTS) {
    set.add(`words:${s.slug}`);
    for (const p of s.easy?.points ?? []) set.add(`words:${s.slug}#${p.id}`);
  }
  for (const s of ALL_SOURCES) set.add(`source:${s.id}`);
  return set;
}

/* ── 검사 ──────────────────────────────────────────────────── */

const ANCHOR = /\^\[([^\]]+)\]/g;
const WIKILINK = /\[\[([^\]|#]+)(?:[|#][^\]]*)?\]\]/g;

function main() {
  if (!existsSync(WIKI)) {
    console.error(`${WIKI}/ 가 없다. docs/llm-wiki.md §9 Phase 1을 먼저 한다.`);
    process.exit(1);
  }

  const pages = readPages();
  const names = new Set(pages.map((p) => p.name));
  const anchors = knownAnchors();
  const inbound = new Map<string, number>(pages.map((p) => [p.name, 0]));

  // ① 깨진 앵커 · ② 깨진 위키링크 · ③ frontmatter
  for (const page of pages) {
    const special = page.name === "index" || page.name === "log";

    for (const [, ref] of page.body.matchAll(ANCHOR)) {
      if (!anchors.has(ref)) {
        err(page.name, `앵커가 raw source에 없다 — ^[${ref}]`);
      }
    }

    for (const [, target] of page.body.matchAll(WIKILINK)) {
      const to = target.trim();
      if (!names.has(to)) {
        err(page.name, `위키링크가 가리키는 페이지가 없다 — [[${to}]]`);
        continue;
      }
      /*
       * index가 건 링크는 inbound로 세지 않는다. 카탈로그는 모든 페이지를
       * 가리키므로, 세면 고아 페이지가 영원히 0건이 되어 검사 ⑥이 죽는다.
       * 고아란 "카탈로그 말고는 아무도 안 부르는 페이지"다.
       */
      if (to !== page.name && page.name !== "index") {
        inbound.set(to, (inbound.get(to) ?? 0) + 1);
      }
    }

    if (special) continue;

    if (!page.front.title) err(page.name, "frontmatter에 title이 없다");
    if (!page.front.kind) err(page.name, "frontmatter에 kind가 없다");
    else if (!KINDS.has(page.front.kind)) {
      err(page.name, `kind가 이상하다 — ${page.front.kind} (${[...KINDS].join("|")})`);
    }
    if (page.front.kind === "source" && !page.front.source) {
      err(page.name, "source 페이지에 frontmatter source(앵커)가 없다");
    }
    if (page.front.source && !anchors.has(page.front.source)) {
      err(page.name, `frontmatter source 앵커가 raw에 없다 — ${page.front.source}`);
    }
  }

  // ④ index.md와 실제 파일
  const index = pages.find((p) => p.name === "index");
  if (!index) {
    err("index", "index.md가 없다");
  } else {
    const listed = new Set(
      [...index.body.matchAll(WIKILINK)].map(([, t]) => t.trim()),
    );
    for (const page of pages) {
      if (page.name === "index" || page.name === "log") continue;
      if (!listed.has(page.name)) err("index", `카탈로그에 빠진 페이지 — ${page.name}`);
    }
  }

  // ⑤ wiki 스크립트가 모델 API를 부르려 한다 (docs/llm-wiki.md §8)
  for (const file of ["scripts/wiki-ingest.ts", "scripts/wiki-lint.ts"]) {
    const text = readFileSync(file, "utf8");
    if (/^\s*import[\s\S]*?["']@anthropic-ai\//m.test(text)) {
      err(file, "위키 파이프라인은 모델 API를 부르지 않는다 (docs/llm-wiki.md §8)");
    }
  }

  // ⑥ 고아 페이지
  for (const page of pages) {
    if (page.name === "index" || page.name === "log") continue;
    if ((inbound.get(page.name) ?? 0) === 0) {
      warn(page.name, "아무도 링크하지 않는다 (index 제외)");
    }
  }

  // ⑦ 아직 ingest하지 않은 소스
  const todo = [
    ...ACHIEVEMENTS.map((a) => ({ page: `source/${a.slug}`, what: `업적 ${a.slug}` })),
    ...STATEMENTS.map((s) => ({ page: `source/words-${s.slug}`, what: `언행 ${s.slug}` })),
  ].filter((t) => !names.has(t.page));
  if (todo.length > 0) {
    warn("ingest", `${todo.length}건이 아직 위키에 없다 — pnpm wiki:ingest --list`);
  }

  // ⑧ 낡은 페이지 — 소스가 더 나중에 커밋됐다
  for (const page of pages) {
    const src = page.front.source;
    if (!src) continue;
    const srcPath = src.startsWith("words:")
      ? `src/content/words/${src.slice(6).split("#")[0]}.ts`
      : `src/content/achievements/${src.split("#")[0]}`;
    const a = committedAt(srcPath);
    const b = committedAt(page.path);
    if (a && b && a > b) {
      warn(page.name, `소스가 이 페이지보다 나중에 바뀌었다 — ${srcPath}`);
    }
  }

  // ⑨ 앵커 없는 단정 문단
  for (const page of pages) {
    if (page.name === "index" || page.name === "log") continue;
    if (page.front.kind === "synthesis") continue; // 종합은 앵커가 문단마다 없을 수 있다
    const naked = page.body
      .split(/\n{2,}/)
      .map((p) => p.trim())
      .filter(
        (p) =>
          p.length > 40 &&
          !p.startsWith("#") &&
          !p.startsWith(">") &&
          !p.startsWith("```") &&
          !p.startsWith("|") &&
          !/\^\[/.test(p) &&
          !/\[\[/.test(p),
      );
    if (naked.length > 0) {
      warn(page.name, `앵커도 링크도 없는 문단 ${naked.length}개 — 「${naked[0].slice(0, 30)}…」`);
    }
  }

  report(pages.length);
}

/** 마지막으로 커밋된 시각. 커밋된 적 없으면 null. */
function committedAt(path: string): number | null {
  try {
    const out = execFileSync("git", ["log", "-1", "--format=%ct", "--", path], {
      stdio: ["ignore", "pipe", "ignore"],
    })
      .toString()
      .trim();
    return out ? Number(out) : null;
  } catch {
    return null;
  }
}

function report(pageCount: number) {
  console.log(`위키 페이지 ${pageCount}장\n`);

  if (warns.length > 0) {
    console.log("경고");
    for (const w of warns) console.log(`  ⚠ ${w}`);
    console.log("");
  }

  if (errors.length > 0) {
    console.error("오류");
    for (const e of errors) console.error(`  ✗ ${e}`);
    console.error(`\n위키 검사 실패 — 오류 ${errors.length}건.`);
    process.exit(1);
  }

  console.log(`위키 검사 통과. (경고 ${warns.length}건)`);
}

main();
