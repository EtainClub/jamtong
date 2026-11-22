/**
 * 업적 카툰 그림 만들기 — 쉬운 설명 장면 하나가 한 칸(docs/garden-cartoon-review.md).
 *
 *   pnpm cartoon:gen                       아직 그림이 없는 칸을 모두
 *   pnpm cartoon:gen seongnam-hospital     한 업적만
 *   CARTOON_JOBS=4 pnpm cartoon:gen        동시에 몇 칸(기본 4)
 *
 * ★ 그림은 Codex CLI의 내장 이미지 생성(GPT)으로 만든다. 로그인된 Codex(`codex login status`)가 있어야 한다.
 *   잼통이 캐릭터 시트(public/cartoons/jamtongi.webp의 원본 PNG)를 참조 이미지로 붙여 캐릭터를 맞춘다.
 * ★ 그림에는 글자를 넣지 않는다. 칸의 글(해설·말풍선·숫자)은 화면이 콘텐츠에서 얹는다 — 사실이 그림에 갇히지 않고,
 *   AI가 한글을 잘못 그리는 일도 없다.
 * ★ 실존 인물·정치인을 그리지 않는다. 사람은 평범한 시민으로만.
 * ★ 만든 그림은 사람이 훑어본다(글자가 섞였는지, 사실과 다른 것을 그렸는지). 맞지 않으면 그 파일을 지우고 다시 돌린다.
 * ★ 프롬프트와 날짜를 public/cartoons/<slug>/prompts.json에 남긴다 — 히어로 삽화의 image.md와 같은 기록이다.
 */
import { execFile, spawn } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { promisify } from "node:util";

import { getPublishedAchievements } from "../src/content/achievements";

const run = promisify(execFile);
const ROOT = process.cwd();
const OUT = join(ROOT, "public", "cartoons");
const WORK = process.env.CARTOON_WORK ?? join(ROOT, ".cartoon-work");
const REF = process.env.CARTOON_REF ?? join(ROOT, "assets", "cartoons", "jamtongi-sheet.png");
const JOBS = Number(process.env.CARTOON_JOBS ?? 4);

const STYLE =
  "Draw Jamtongi EXACTLY as in the attached character sheet (round glass jam jar, amber jam, cream lid, green two-leaf sprout, dot eyes, stubby arms and legs, jam drip). " +
  "Style: the same clean Korean educational comic (hakseup manhwa) line art with soft flat colors, thick friendly outlines, warm palette. " +
  "Landscape 3:2 single comic panel, full-bleed, no panel border. People are ordinary, generic Korean citizens drawn simply — no politicians, no real or identifiable persons, no celebrities, no national leaders. " +
  "No religious symbols or religious buildings (no crosses, temples or churches) — show gathering places as plain generic halls. " +
  "Constraints: absolutely no text, no letters, no Korean or English writing, no numbers, no signs with words, no logos, no watermark.";

interface Job {
  slug: string;
  achievement: string;
  id: string;
  title: string;
  say: string;
}

function prompt(job: Job): string {
  return (
    `Use your built-in image generation tool to create ONE image, then copy the generated PNG into the current directory as ${job.id}.png. ` +
    "Do not write any code other than the copy command. " +
    `Scene: one panel of an explainer comic about the Korean public achievement "${job.achievement}". ` +
    `This panel explains (Korean): "${job.title} — ${job.say}". ` +
    "Show this situation visually with ordinary people, places and objects, and with Jamtongi reacting to it as a friendly guide. " +
    "Do not draw any numbers or words; convey amounts with simple visual metaphors (piles, lines, sizes). " +
    STYLE
  );
}

async function make(job: Job): Promise<boolean> {
  const dir = join(OUT, job.slug);
  mkdirSync(dir, { recursive: true });
  const png = join(WORK, `${job.id}.png`);
  const text = prompt(job);
  // stdin을 닫아 둔다 — 열려 있으면 codex가 프롬프트를 더 받으려고 stdin을 기다리며 멈춘다.
  const code = await new Promise<number>((resolve) => {
    const child = spawn("codex", ["exec", "--skip-git-repo-check", "-s", "workspace-write", "-C", WORK, text, "-i", REF], { stdio: ["ignore", "ignore", "pipe"] });
    let err = "";
    child.stderr.on("data", (d) => (err = (err + String(d)).slice(-400)));
    const timer = setTimeout(() => child.kill("SIGTERM"), 10 * 60_000);
    child.on("close", (c) => {
      clearTimeout(timer);
      if (c !== 0) console.error(`  ✗ ${job.slug}/${job.id}: codex 실패(${c})`, err.trim().slice(-200));
      resolve(c ?? 1);
    });
  });
  if (code !== 0) return false;
  if (!existsSync(png)) {
    console.error(`  ✗ ${job.slug}/${job.id}: 그림이 생기지 않았다`);
    return false;
  }
  await run("cwebp", ["-quiet", "-q", "76", "-resize", "1080", "0", png, "-o", join(dir, `${job.id}.webp`)]);
  const log = join(dir, "prompts.json");
  const records = existsSync(log) ? (JSON.parse(readFileSync(log, "utf8")) as Record<string, unknown>) : {};
  records[job.id] = { tool: "codex exec · built-in image_gen (GPT)", created: new Date().toISOString().slice(0, 10), reference: "jamtongi character sheet", prompt: text };
  writeFileSync(log, JSON.stringify(records, null, 2) + "\n");
  console.log(`  ✓ ${job.slug}/${job.id}`);
  return true;
}

async function main() {
  if (!existsSync(REF)) {
    console.error(`캐릭터 시트가 없다: ${REF} — 잼통이 시트 PNG를 두고 CARTOON_REF로 가리킨다.`);
    process.exit(1);
  }
  mkdirSync(WORK, { recursive: true });
  const only = process.argv[2];
  const jobs: Job[] = [];
  for (const a of getPublishedAchievements()) {
    if (only && a.slug !== only) continue;
    for (const s of a.eli5?.scenes ?? []) {
      if (existsSync(join(OUT, a.slug, `${s.id}.webp`))) continue;
      jobs.push({ slug: a.slug, achievement: a.title, id: s.id, title: s.title, say: s.say });
    }
  }
  console.log(`그릴 칸 ${jobs.length}개 · 동시에 ${JOBS}`);
  let next = 0;
  let failed = 0;
  await Promise.all(
    Array.from({ length: JOBS }, async () => {
      while (next < jobs.length) {
        const job = jobs[next++];
        if (!(await make(job))) failed++;
      }
    }),
  );
  console.log(failed ? `✗ ${failed}칸 실패 — 다시 돌리면 빠진 칸만 그린다` : "✓ 모두 그렸다 — 그림을 훑어보고 맞지 않는 칸은 지운 뒤 다시 돌린다");
  process.exit(failed ? 1 : 0);
}

void main();
