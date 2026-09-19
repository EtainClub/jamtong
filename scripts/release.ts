/**
 * 버전 올리기.
 *
 *   pnpm release          커밋 메시지를 읽고 올릴 자리를 스스로 정한다
 *   pnpm release --dry    무엇이 바뀔지만 보여준다
 *   pnpm release minor    자리를 직접 지정한다 (major|minor|patch)
 *
 * 이 저장소는 이미 Conventional Commits를 쓴다(feat:, fix:, chore: …).
 * 그래서 올릴 자리를 사람이 고를 필요가 없다.
 *
 *   BREAKING CHANGE 또는 `타입!:`  → major
 *   feat:                          → minor
 *   그 밖에                        → patch
 *
 * 커밋마다 올리지 않는 이유: 이 앱은 푸시가 곧 배포다. 커밋마다 버전을 올리면
 * 번호가 하루에 열 번씩 바뀌어 아무것도 뜻하지 않게 된다. 배포를 구분하는 일은
 * 커밋 해시가 이미 하고 있다(`next.config.ts`). 버전은 이정표에만 붙인다.
 */
import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync, existsSync } from "node:fs";

type Bump = "major" | "minor" | "patch";

const git = (...args: string[]) =>
  execFileSync("git", args, { stdio: ["ignore", "pipe", "pipe"] }).toString().trim();

function lastTag(): string | null {
  try {
    return git("describe", "--tags", "--abbrev=0");
  } catch {
    return null;
  }
}

interface Entry {
  type: string;
  breaking: boolean;
  subject: string;
  hash: string;
}

function commitsSince(tag: string | null): Entry[] {
  const range = tag ? `${tag}..HEAD` : "HEAD";
  const raw = git("log", range, "--no-merges", "--format=%H%x00%s%x00%b%x00%x00");
  if (!raw) return [];

  const entries: Entry[] = [];
  for (const block of raw.split("\0\0")) {
    const [hash, subject, body] = block.replace(/^\n/, "").split("\0");
    if (!hash || !subject) continue;
    const m = /^(\w+)(\([^)]*\))?(!)?:\s*(.+)$/.exec(subject);
    entries.push({
      type: m ? m[1] : "other",
      breaking: Boolean(m?.[3]) || /BREAKING[ -]CHANGE/.test(body ?? ""),
      subject: m ? m[4] : subject,
      hash: hash.slice(0, 7),
    });
  }
  return entries;
}

function decide(entries: Entry[]): Bump | null {
  if (entries.length === 0) return null;
  if (entries.some((e) => e.breaking)) return "major";
  if (entries.some((e) => e.type === "feat")) return "minor";
  return "patch";
}

function next(version: string, bump: Bump): string {
  const [major, minor, patch] = version.split(".").map(Number);
  if (bump === "major") return `${major + 1}.0.0`;
  if (bump === "minor") return `${major}.${minor + 1}.0`;
  return `${major}.${minor}.${patch + 1}`;
}

const SECTIONS: [string, string][] = [
  ["feat", "새 기능"],
  ["fix", "고친 것"],
  ["refactor", "구조 정리"],
  ["docs", "문서"],
  ["chore", "그 밖에"],
];

function changelog(version: string, entries: Entry[]): string {
  const today = new Date().toISOString().slice(0, 10);
  const lines = [`## ${version} — ${today}`, ""];

  const breaking = entries.filter((e) => e.breaking);
  if (breaking.length > 0) {
    lines.push("### 깨지는 변경", "");
    for (const e of breaking) lines.push(`- ${e.subject} (${e.hash})`);
    lines.push("");
  }

  for (const [type, label] of SECTIONS) {
    const group = entries.filter((e) => e.type === type && !e.breaking);
    if (group.length === 0) continue;
    lines.push(`### ${label}`, "");
    for (const e of group) lines.push(`- ${e.subject} (${e.hash})`);
    lines.push("");
  }
  return lines.join("\n");
}

function main() {
  const args = process.argv.slice(2);
  const dry = args.includes("--dry");
  const forced = args.find((a) => ["major", "minor", "patch"].includes(a)) as Bump | undefined;

  if (git("status", "--porcelain") && !dry) {
    console.error("커밋하지 않은 변경이 있다. 먼저 정리할 것.");
    process.exit(1);
  }

  const tag = lastTag();
  const entries = commitsSince(tag);
  const bump = forced ?? decide(entries);

  if (!bump) {
    console.log(`${tag ?? "처음"} 이후 올릴 커밋이 없다.`);
    return;
  }

  const pkgPath = "package.json";
  const pkg = JSON.parse(readFileSync(pkgPath, "utf8")) as { version: string };
  const version = next(pkg.version, bump);
  const notes = changelog(version, entries);

  console.log(`${pkg.version} → ${version}  (${bump}, 커밋 ${entries.length}건)\n`);
  console.log(notes);

  if (dry) {
    console.log("--dry 이므로 아무것도 쓰지 않았다.");
    return;
  }

  pkg.version = version;
  writeFileSync(pkgPath, `${JSON.stringify(pkg, null, 2)}\n`);

  const head = "# 변경 기록\n\n";
  const prev = existsSync("CHANGELOG.md")
    ? readFileSync("CHANGELOG.md", "utf8").replace(head, "")
    : "";
  writeFileSync("CHANGELOG.md", `${head}${notes}\n${prev}`);

  git("add", pkgPath, "CHANGELOG.md");
  git("commit", "-m", `chore(release): v${version}`);
  git("tag", "-a", `v${version}`, "-m", `v${version}`);

  console.log(`\n커밋과 태그 v${version}을 만들었다. 푸시하면 배포된다.`);
  console.log("  git push --follow-tags");
}

main();
