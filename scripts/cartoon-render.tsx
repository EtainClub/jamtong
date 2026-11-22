/**
 * 업적 카툰의 공유용 파일 — GIF(메신저에 올리기)와 MP4(숏츠·인스타) (docs/garden-cartoon-review.md §4.2).
 *
 *   pnpm cartoon:render                    카툰이 다 그려진 업적 모두
 *   pnpm cartoon:render seongnam-hospital  한 업적만
 *
 * ★ 앱 안의 카툰(CartoonView)과 같은 칸 모양이다: 번호 원 · 해설 상자 · 그림 · 숫자 딱지 · 잼통이 말풍선.
 *   칸마다 두 장면 — 해설과 그림, 그다음 말풍선과 숫자 — 을 이어 붙이고, 앞에 표지, 끝에 반론과 근거 주소를 둔다.
 * ★ 프레임은 공유 카드와 같은 렌더러(next/og, satori)로 그리고 ffmpeg로 묶는다. 헤드리스 브라우저가 필요 없다.
 * ★ 끝 장면에 반론 한 줄과 근거 주소를 꼭 넣는다 — 파일만 떠돌아도 근거로 돌아올 길이 있게.
 * ★ 그림은 AI 삽화라고 바닥줄에 늘 적는다.
 *
 * 결과: .cartoon-work/media/<slug>/cartoon.gif, cartoon.mp4 — 저장소에 넣지 않는다(크다).
 * `pnpm cartoon:upload`가 Firebase Storage에 올리고 주소를 src/content/cartoons/media.json에 적는다. 화면은 그 주소로 "받기" 단추를 단다.
 */
/* eslint-disable @next/next/no-img-element -- 브라우저가 아니라 satori(공유 카드 렌더러)가 그리는 프레임이다. */
import { execFile } from "node:child_process";
import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { promisify } from "node:util";

import { ImageResponse } from "next/og";

import { getPublishedAchievements } from "../src/content/achievements";
import { buildMemorial } from "../src/features/garden/memorial/build";
import type { MemorialEntry } from "../src/features/garden/memorial/types";

const run = promisify(execFile);
const ROOT = process.cwd();
const W = 1080;
const H = 1350;
const INK = "#2a2420";
const SITE = "jamtong.kr";

const fonts = [
  { name: "Pretendard", data: readFileSync(join(ROOT, "assets/fonts/Pretendard-Light.otf")), weight: 300 as const, style: "normal" as const },
  { name: "Pretendard", data: readFileSync(join(ROOT, "assets/fonts/Pretendard-SemiBold.otf")), weight: 600 as const, style: "normal" as const },
];

/** 잼통이 시트(2×2)에서 한 자세를 잘라 data URI로. 0=서기 1=걷기 2=가리키기 3=만세. */
async function pose(tmp: string, n: 0 | 1 | 2 | 3): Promise<string> {
  const out = join(tmp, `pose${n}.png`);
  const x = n % 2 === 0 ? "0" : "iw/2";
  const y = n < 2 ? "0" : "ih/2";
  await run("ffmpeg", ["-loglevel", "error", "-y", "-i", join(ROOT, "assets/cartoons/jamtongi-sheet.png"), "-vf", `crop=iw/2:ih/2:${x}:${y},scale=320:-1,colorkey=0xFFFFFF:0.12:0.08`, out]);
  return `data:image/png;base64,${readFileSync(out).toString("base64")}`;
}

/** webp는 satori가 읽지 못한다 — PNG로 바꿔 data URI로. */
async function png(tmp: string, src: string): Promise<string> {
  const out = join(tmp, `${src.split("/").pop()}.png`);
  await run("ffmpeg", ["-loglevel", "error", "-y", "-i", join(ROOT, "public", src), "-vf", "scale=1000:-1", out]);
  return `data:image/png;base64,${readFileSync(out).toString("base64")}`;
}

async function frame(path: string, node: React.ReactElement) {
  const res = new ImageResponse(node, { width: W, height: H, fonts });
  writeFileSync(path, Buffer.from(await res.arrayBuffer()));
}

function Shell({ entry, children }: { entry: MemorialEntry; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", width: "100%", height: "100%", background: "#f6efe0", padding: 28, fontFamily: "Pretendard" }}>
      <div style={{ display: "flex", flexDirection: "column", flex: 1, border: `8px solid ${INK}`, borderRadius: 28, background: "#fffdf7", overflow: "hidden" }}>{children}</div>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 14, fontSize: 24, color: "#6b6159" }}>
        <span>잼통 · {entry.title}</span>
        <span>그림: AI 삽화 · 근거 {SITE}</span>
      </div>
    </div>
  );
}

function PanelFrame({ entry, i, image, face, full }: { entry: MemorialEntry; i: number; image: string; face: string; full: boolean }) {
  const p = entry.cartoon!.panels[i];
  return (
    <Shell entry={entry}>
      <div style={{ display: "flex", alignItems: "center", gap: 18, padding: "22px 26px", background: "#fff3c4", borderBottom: `8px solid ${INK}` }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 64, height: 64, borderRadius: 64, background: INK, color: "#fff", fontSize: 34, fontWeight: 600 }}>{i + 1}</div>
        <div style={{ display: "flex", flex: 1, fontSize: 42, fontWeight: 600, color: INK, lineHeight: 1.3 }}>{p.title}</div>
      </div>
      <div style={{ display: "flex", position: "relative", width: "100%", height: 640 }}>
        <img src={image} alt="" width={1008} height={672} style={{ objectFit: "cover", width: "100%", height: "100%" }} />
        {full && p.fact && (
          <div style={{ display: "flex", position: "absolute", right: 22, bottom: 22, padding: "10px 22px", border: `5px solid ${INK}`, borderRadius: 20, background: "#fff", color: "#b3261e", fontSize: 38, fontWeight: 600, boxShadow: `6px 6px 0 ${INK}` }}>
            {p.fact}
          </div>
        )}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 18, padding: "26px 24px", flex: 1 }}>
        <img src={face} alt="" width={200} height={200} />
        {full ? (
          <div style={{ display: "flex", flex: 1, padding: "24px 30px", border: `5px solid ${INK}`, borderRadius: 36, background: "#fff", fontSize: 40, lineHeight: 1.5, color: INK }}>{p.say}</div>
        ) : (
          <div style={{ display: "flex", flex: 1 }} />
        )}
      </div>
    </Shell>
  );
}

function Cover({ entry, face }: { entry: MemorialEntry; face: string }) {
  return (
    <Shell entry={entry}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flex: 1, gap: 26, padding: 60, background: "#fff3c4" }}>
        <div style={{ display: "flex", fontSize: 40, color: "#6b6159" }}>잼통이와 보는 업적 이야기</div>
        <div style={{ display: "flex", fontSize: 70, fontWeight: 600, color: INK, textAlign: "center", lineHeight: 1.25 }}>{entry.title}</div>
        <div style={{ display: "flex", fontSize: 34, color: "#6b6159", textAlign: "center" }}>{entry.subtitle}</div>
        <img src={face} alt="" width={380} height={380} />
      </div>
    </Shell>
  );
}

function End({ entry, face }: { entry: MemorialEntry; face: string }) {
  return (
    <Shell entry={entry}>
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", flex: 1, gap: 28, padding: 60 }}>
        {entry.cartoon?.caveat && (
          <div style={{ display: "flex", flexDirection: "column", padding: "22px 26px", borderRadius: 24, background: "#f1ebde", fontSize: 32, lineHeight: 1.5, color: INK }}>
            <span style={{ fontWeight: 600 }}>알아 둘 것</span>
            <span>{entry.cartoon.caveat}</span>
          </div>
        )}
        {entry.counter && (
          <div style={{ display: "flex", flexDirection: "column", padding: "22px 26px", borderRadius: 24, background: "#f1ebde", fontSize: 32, lineHeight: 1.5, color: INK }}>
            <span style={{ fontWeight: 600 }}>반론도 함께 봐요</span>
            <span>{entry.counter.text}</span>
          </div>
        )}
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <img src={face} alt="" width={220} height={220} />
          <div style={{ display: "flex", flexDirection: "column", flex: 1, fontSize: 36, color: INK, lineHeight: 1.45 }}>
            <span style={{ fontWeight: 600 }}>근거와 출처는 여기에서</span>
            <span style={{ fontSize: 30, wordBreak: "break-all" }}>{`${SITE}${entry.href}`}</span>
          </div>
        </div>
      </div>
    </Shell>
  );
}

async function render(entry: MemorialEntry) {
  const tmp = join(ROOT, ".cartoon-work", "render", entry.slug);
  rmSync(tmp, { recursive: true, force: true });
  mkdirSync(tmp, { recursive: true });
  const [stand, , point, cheer] = await Promise.all([pose(tmp, 0), pose(tmp, 1), pose(tmp, 2), pose(tmp, 3)]);
  const panels = entry.cartoon!.panels;
  const list: Array<{ file: string; sec: number }> = [];
  const add = async (name: string, sec: number, node: React.ReactElement) => {
    const file = join(tmp, `${String(list.length).padStart(3, "0")}-${name}.png`);
    await frame(file, node);
    list.push({ file, sec });
  };
  await add("cover", 2.2, <Cover entry={entry} face={cheer} />);
  for (let i = 0; i < panels.length; i++) {
    const image = await png(tmp, panels[i].image);
    const face = i % 2 === 0 ? point : stand;
    await add(`p${i}a`, 0.9, <PanelFrame entry={entry} i={i} image={image} face={face} full={false} />);
    await add(`p${i}b`, 3.6, <PanelFrame entry={entry} i={i} image={image} face={face} full />);
  }
  await add("end", 4, <End entry={entry} face={point} />);

  // concat 목록 — 마지막 장면은 한 번 더 적어야 길이가 먹는다(ffmpeg concat의 규칙).
  const concat = join(tmp, "list.txt");
  writeFileSync(concat, list.map((f) => `file '${f.file}'\nduration ${f.sec}`).join("\n") + `\nfile '${list.at(-1)!.file}'\n`);
  const outDir = join(ROOT, ".cartoon-work", "media", entry.slug);
  mkdirSync(outDir, { recursive: true });
  await run("ffmpeg", ["-loglevel", "error", "-y", "-f", "concat", "-safe", "0", "-i", concat, "-vf", "fps=30,format=yuv420p", "-c:v", "libx264", "-preset", "slow", "-crf", "24", "-movflags", "+faststart", join(outDir, "cartoon.mp4")]);
  await run("ffmpeg", [
    "-loglevel", "error", "-y", "-f", "concat", "-safe", "0", "-i", concat,
    "-vf", "fps=4,scale=540:-1:flags=lanczos,split[s0][s1];[s0]palettegen=stats_mode=diff:max_colors=200[p];[s1][p]paletteuse=dither=bayer:bayer_scale=4:diff_mode=rectangle",
    "-loop", "0", join(outDir, "cartoon.gif"),
  ]);
  rmSync(tmp, { recursive: true, force: true });
  const size = (f: string) => `${Math.round(readFileSync(join(outDir, f)).length / 1024)}KB`;
  console.log(`  ✓ ${entry.slug} — GIF ${size("cartoon.gif")} · MP4 ${size("cartoon.mp4")} · ${list.reduce((n, f) => n + f.sec, 0).toFixed(1)}초`);
}

async function main() {
  const only = process.argv[2];
  const known = new Set(getPublishedAchievements().map((a) => a.slug));
  if (only && !known.has(only)) {
    console.error(`모르는 업적: ${only}`);
    process.exit(1);
  }
  const entries = buildMemorial().filter((e) => e.cartoon && (!only || e.slug === only));
  if (entries.length === 0) {
    console.log("카툰이 다 그려진 업적이 없다 — pnpm cartoon:gen 먼저");
    return;
  }
  for (const e of entries) await render(e);
}

void main();
