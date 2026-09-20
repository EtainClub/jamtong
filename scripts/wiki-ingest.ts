/**
 * LLM Wiki — ingest 준비 (docs/llm-wiki.md §7).
 *
 * ★ 이 스크립트는 위키를 쓰지 않는다. 읽을 것을 모아 줄 뿐이다.
 *   통합은 에이전트가 한다 — 이 덤프를 읽고 마크다운을 쓰고 index와 log를
 *   갱신하는 것은 사람 옆에 앉은 LLM의 일이다. 자동 파이프라인으로 만들면
 *   "요약을 읽고 무엇을 강조할지 정하는" 개입 지점이 사라진다.
 *
 * ★ 모델 API를 부르지 않는다.
 *   구독제 에이전트가 이 저장소를 열고 직접 처리한다. 그래야 비용이 0이고,
 *   서버에 키를 둘 일도, 일일 한도를 감시할 일도 없다.
 *   wiki-lint의 검사 #5가 이 경계를 지킨다.
 *
 * 쓰기:
 *   pnpm wiki:ingest --list                 아직 ingest하지 않은 소스
 *   pnpm wiki:ingest words/reform-is-hard
 *   pnpm wiki:ingest achievement/judicial-reform
 */
import { readdirSync, readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

import { ACHIEVEMENTS } from "../src/content/achievements";
import { STATEMENTS } from "../src/content/words";
import { ALL_SOURCES } from "../src/content/milestones";
import type { Achievement, Claim, Source } from "../src/content/schema";
import type { Statement } from "../src/content/words/schema";

const WIKI = "wiki";

/*
 * raw source는 여기 적힌 것뿐이다 (docs/llm-wiki.md §4).
 *
 * cheers를 넣지 않는다. 운영자가 코드로 커밋했더라도 우리는 그 영상의 제목과
 * 채널만 알고 내용은 확인하지 않았다. raw source의 자격은 "누가 등록했나"가
 * 아니라 "검증된 주장을 담고 있나"다.
 */
type Ref =
  | { kind: "words"; slug: string; statement: Statement }
  | { kind: "achievement"; slug: string; achievement: Achievement };

function allRefs(): Ref[] {
  return [
    ...ACHIEVEMENTS.map(
      (achievement): Ref => ({ kind: "achievement", slug: achievement.slug, achievement }),
    ),
    ...STATEMENTS.map(
      (statement): Ref => ({ kind: "words", slug: statement.slug, statement }),
    ),
  ];
}

/** 소스 페이지의 파일 이름. ascii 슬러그만 쓴다 (§6). */
export function sourcePagePath(ref: { kind: string; slug: string }): string {
  return ref.kind === "words"
    ? `source/words-${ref.slug}`
    : `source/${ref.slug}`;
}

function wikiFiles(): string[] {
  const out: string[] = [];
  const walk = (dir: string, prefix: string) => {
    if (!existsSync(dir)) return;
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      if (entry.isDirectory()) walk(join(dir, entry.name), `${prefix}${entry.name}/`);
      else if (entry.name.endsWith(".md")) out.push(`${prefix}${entry.name.slice(0, -3)}`);
    }
  };
  walk(WIKI, "");
  return out;
}

/** 이 소스를 이미 언급한 위키 페이지. 새로 쓰기 전에 읽어야 할 곳이다. */
function mentions(needles: string[]): string[] {
  const hits: string[] = [];
  for (const page of wikiFiles()) {
    const text = readFileSync(join(WIKI, `${page}.md`), "utf8");
    if (needles.some((n) => text.includes(n))) hits.push(page);
  }
  return hits;
}

/*
 * 출처를 찾는다.
 *
 * 업적은 제 출처를 제 안에 들고 있고(achievement.sources), 세부 성과는 공유
 * 레지스트리(ALL_SOURCES)를 쓴다. 한쪽만 보면 "출처를 찾지 못함"이 잔뜩 뜨는데
 * 실제로는 멀쩡한 자료다 — 그 상태로 ingest하면 위키에 출처 없는 문장이 쌓인다.
 */
function source(id: string, local: Source[] = []): Source | undefined {
  return local.find((s) => s.id === id) ?? ALL_SOURCES.find((s) => s.id === id);
}

function claimBlock(slug: string, claims: Claim[], local: Source[] = []): string[] {
  const lines: string[] = [];
  for (const claim of claims) {
    const flags = [
      claim.assertionType,
      claim.verified ? "verified" : "**미검증**",
    ].join(" · ");
    lines.push(`- \`^[${slug}#${claim.id}]\` [${flags}]`);
    lines.push(`  ${claim.text}`);
    for (const sid of claim.sourceIds) {
      const s = source(sid, local);
      if (!s) {
        lines.push(`  - ⚠ 출처 \`${sid}\`를 찾지 못함`);
        continue;
      }
      lines.push(
        `  - \`^[source:${s.id}]\` ${s.publisher ?? "?"} 『${s.title}』${s.publishedAt ? ` (${s.publishedAt})` : ""}`,
      );
      if (s.quote) lines.push(`    > ${s.quote.replace(/\n/g, " ")}`);
    }
  }
  return lines;
}

function dumpStatement(statement: Statement): string {
  const L: string[] = [];

  L.push(`# ingest 준비 — 언행 「${statement.title}」`);
  L.push("");
  L.push(`- 앵커 접두사: \`words:${statement.slug}\``);
  L.push(`- 쓸 페이지: \`${WIKI}/${sourcePagePath({ kind: "words", slug: statement.slug })}.md\``);
  L.push(`- ${statement.channel} · ${statement.displayDate} (${statement.postedAt})`);
  if (statement.url) L.push(`- ${statement.url}`);
  if (statement.context) L.push(`- 맥락: ${statement.context}`);
  L.push(`- 주제: ${statement.topics.join(", ") || "(없음)"}`);
  L.push("");

  L.push("## 원문 — 고치지 않는다");
  L.push("");
  L.push("```");
  L.push(statement.body);
  L.push("```");
  L.push("");

  if (statement.glossary.length > 0) {
    L.push("## 말풀이");
    for (const g of statement.glossary) L.push(`- **${g.term}** — ${g.explain}`);
    L.push("");
  }

  if (statement.easy) {
    L.push("## 쉽게 보기 — 앵커로 쓸 수 있는 토막");
    L.push("");
    L.push(`> ${statement.easy.intro}`);
    L.push("");
    for (const p of statement.easy.points) {
      L.push(`- \`^[words:${statement.slug}#${p.id}]\` **${p.title}**`);
      L.push(`  ${p.say}`);
      L.push(`  > ${p.quote.replace(/\n/g, " ")}`);
    }
    if (statement.easy.caveat) {
      L.push("");
      L.push(`- ⚠ 오해하기 쉬운 곳: ${statement.easy.caveat.text}`);
      L.push(`  > ${statement.easy.caveat.quote.replace(/\n/g, " ")}`);
    }
    L.push("");
  }

  if (statement.relatedAchievements.length > 0) {
    L.push("## 걸려 있는 업적");
    for (const slug of statement.relatedAchievements) {
      const a = ACHIEVEMENTS.find((x) => x.slug === slug);
      L.push(
        a
          ? `- \`^[${a.slug}]\` ${a.title} — ${a.subtitle} (claim ${a.claims.length}개)`
          : `- ⚠ \`${slug}\` — 레지스트리에 없는 업적이다`,
      );
    }
    L.push("");
  }

  return L.join("\n");
}

function dumpAchievement(achievement: Achievement): string {
  const L: string[] = [];

  L.push(`# ingest 준비 — 업적 「${achievement.title}」`);
  L.push("");
  L.push(`- 앵커 접두사: \`${achievement.slug}\``);
  L.push(`- 쓸 페이지: \`${WIKI}/${sourcePagePath({ kind: "achievement", slug: achievement.slug })}.md\``);
  L.push(`- ${achievement.subtitle}`);
  L.push(`- 공개 상태: ${achievement.publishStatus}`);
  L.push("");
  L.push("## 요약");
  L.push("");
  L.push(achievement.summary);
  L.push("");

  if (achievement.keyNumbers.length > 0) {
    L.push("## 핵심 수치");
    for (const n of achievement.keyNumbers) {
      L.push(`- ${n.label}: ${n.value}${n.unit ?? ""}${n.caption ? ` — ${n.caption}` : ""}`);
    }
    L.push("");
  }

  L.push("## 확인된 사실 — 앵커로 쓸 수 있는 claim");
  L.push("");
  L.push(...claimBlock(achievement.slug, achievement.claims, achievement.sources));
  L.push("");

  if (achievement.timeline.length > 0) {
    L.push("## 연표");
    for (const e of achievement.timeline) {
      L.push(`- [${e.displayDate ?? e.date}] **${e.title}** — ${e.summary}`);
    }
    L.push("");
  }

  if (achievement.graph) {
    L.push("## 기관·관계");
    for (const e of achievement.graph.entities) L.push(`- ${e.name} (\`${e.id}\`)`);
    for (const r of achievement.graph.relations) {
      const from = achievement.graph.entities.find((e) => e.id === r.fromId)?.name ?? r.fromId;
      const to = achievement.graph.entities.find((e) => e.id === r.toId)?.name ?? r.toId;
      L.push(`  - [${r.startDate}] ${from} → ${to}: ${r.label}`);
    }
    L.push("");
  }

  if (achievement.counterpoints.length > 0) {
    L.push("## 쟁점 — 위키에 반드시 옮긴다");
    for (const c of achievement.counterpoints) {
      L.push(`- **${c.question}**`);
      L.push(`  ${c.response}`);
    }
    L.push("");
  }

  return L.join("\n");
}

function checklist(ref: Ref, already: string[]): string {
  const L: string[] = [];
  L.push("---");
  L.push("");
  L.push("## 이미 이 소스를 언급한 위키 페이지");
  if (already.length === 0) L.push("(없음 — 이 소스는 처음 들어온다)");
  else for (const p of already) L.push(`- [[${p}]] → \`${WIKI}/${p}.md\``);
  L.push("");
  L.push("## 할 일");
  L.push("");
  L.push(`1. \`${WIKI}/${sourcePagePath(ref)}.md\`를 쓴다 (frontmatter: title, kind: source, updated).`);
  L.push("2. 이 소스가 건드리는 concept·entity 페이지를 만들거나 고친다.");
  L.push("   — 이미 있는 페이지는 위에 적힌 것부터 읽는다.");
  L.push("3. 모든 단정문에 위에 적힌 앵커를 붙인다. 앵커 없는 단정은 쓰지 않는다.");
  L.push("4. 미검증·CLAIM·INTERPRETATION 표시가 붙은 것은 그 사실을 문장에 적는다.");
  L.push(`5. \`${WIKI}/index.md\`에 새 페이지를 등록한다.`);
  L.push(`6. \`${WIKI}/log.md\`에 한 줄 append한다.`);
  L.push("7. `pnpm wiki:lint`를 돌려 오류가 0인지 본다.");
  L.push("");
  return L.join("\n");
}

function main() {
  const arg = process.argv[2];
  const refs = allRefs();

  if (!arg || arg === "--list") {
    const pages = new Set(wikiFiles());
    const done = refs.filter((r) => pages.has(sourcePagePath(r)));
    const todo = refs.filter((r) => !pages.has(sourcePagePath(r)));

    console.log(`ingest 완료 ${done.length} / 전체 ${refs.length}\n`);
    if (todo.length > 0) {
      console.log("아직 ingest하지 않은 소스:");
      for (const r of todo) {
        const title = r.kind === "words" ? r.statement.title : r.achievement.title;
        console.log(`  pnpm wiki:ingest ${r.kind}/${r.slug}    ${title}`);
      }
    } else {
      console.log("전부 ingest했다.");
    }
    return;
  }

  const [kind, slug] = arg.split("/");
  const ref = refs.find((r) => r.kind === kind && r.slug === slug);
  if (!ref) {
    console.error(`알 수 없는 소스: ${arg}`);
    console.error("pnpm wiki:ingest --list 로 목록을 본다.");
    process.exit(1);
  }

  const needles =
    ref.kind === "words" ? [`words:${ref.slug}`] : [`^[${ref.slug}]`, `^[${ref.slug}#`];

  const body =
    ref.kind === "words" ? dumpStatement(ref.statement) : dumpAchievement(ref.achievement);

  console.log(body);
  console.log(checklist(ref, mentions(needles)));
}

main();
