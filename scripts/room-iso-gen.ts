/**
 * 아이소 방 가구 그림 만들기 — 그림 가이드는 docs/garden-miniroom-iso.md §4, 목록은 가구표(room/catalog.ts) 전체.
 *
 *   pnpm room:iso-gen              아직 없는 그림을 모두
 *   pnpm room:iso-gen sofa-back    하나만(있어도 다시)
 *   pnpm room:iso-gen --list       그릴 목록만 본다
 *   ROOM_ISO_JOBS=3 pnpm room:iso-gen
 *
 * ★ 그리는 것: 지금 정면 그림 파일(furnitureSprites.ts)이 있는 바닥·벽 가구. 코드가 그리는 것은 그리지 않는다 —
 *   창문(창밖 날씨), 키보드(주인이 그린 키), 특별한 책(책마다 색), 기념품 진열장(담긴 기념품), 전시품(품종마다 다른 그림).
 * ★ 다 그린 가구는 src/features/garden/room/isoArt.json에 적는다. 방 그림(IsoRoom.tsx)이 그 목록을 읽는다 — 목록에 없는 가구는
 *   정면 그림을 세워서 그린다. 그림을 지우고 다시 돌리면 목록도 다시 맞춘다.
 *
 * ★ 그림은 Codex CLI의 내장 이미지 생성(GPT)으로 만든다(scripts/cartoon-gen.ts와 같은 길). `codex login status`가 필요하다.
 * ★ 그림 두 장을 붙인다 — ① 지금 정면 도트 그림(public/images/room/<ref>.png): 색·도트 느낌을 맞춘다.
 *   ② 기하 안내(이 스크립트가 ImageMagick으로 그린다): 2:1 아이소 각도와 바닥 크기·높이를 회색 덩어리로 보인다. 물건은 그 덩어리를 채운다.
 * ★ 배경은 마젠타 단색으로 받아 투명하게 뺀다. 그다음 그림 상자(가로 (w+d)×20, 세로 (w+d)×10+h — 타일 40)의 네 배 판에
 *   아래 가운데 맞춰 넣는다. 기준점은 바닥의 앞 꼭짓점이다. 크기는 room/iso.ts의 ISO 표에서 읽는다.
 * ★ 방향은 두 장만 그린다 — back(뒤가 멀리, 방향 0)과 front(뒤가 가까이, 방향 2). 방향 1·3은 화면이 좌우 반전한다.
 * ★ 글자·숫자·로고를 그리지 않는다. 만든 그림은 사람이 훑어본다. 맞지 않으면 파일을 지우고 다시 돌린다.
 * ★ 프롬프트와 날짜를 public/images/room-iso/prompts.json에 남긴다.
 */
import { execFile, spawn } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { promisify } from "node:util";

import { FURNITURE } from "../src/features/garden/room/catalog";
import { FURNITURE_SPRITES } from "../src/features/garden/room/furnitureSprites";
import { ISO, ISO_TILE, isoBox, type IsoSpec } from "../src/features/garden/room/iso";
import { YARD_ITEMS } from "../src/features/garden/yard";

const run = promisify(execFile);
const ROOT = process.cwd();
const OUT = join(ROOT, "public", "images", "room-iso");
const WORK = process.env.ROOM_ISO_WORK ?? join(ROOT, ".room-iso-work");
const JOBS = Number(process.env.ROOM_ISO_JOBS ?? 3);

/** 타일 40px 기준(docs/garden-miniroom-iso.md §4.1). 파일은 네 배 판. */
const TILE = ISO_TILE;
const SCALE = 4;
const KEY = "#ff00ff";

interface Pilot {
  id: string;
  /** 색·도트 느낌을 맞출 지금 정면 그림. */
  ref: string;
  /** room/iso.ts의 ISO 열쇠 — 바닥 크기·높이를 거기서 읽는다. */
  iso: string;
  view: "back" | "front" | "wall";
  what: string;
  /** ISO 표에 없는 것(마당 소품)의 크기. */
  spec?: IsoSpec;
  /** 정면 그림이 없는 것 — 이미 그린 아이소 그림 하나를 그림체 참고로 붙인다(마당 소품). */
  styleRef?: string;
}

/** 손으로 적은 설명(0단계 시범). 나머지는 가구표의 이름·설명과 정면 그림으로. */
const CUSTOM: Pilot[] = [
  { id: "bed-back", ref: "bed", iso: "bed", view: "back", what: "a single bed: wooden frame and tall wooden headboard at the FAR end, white mattress, pink pillow near the headboard, light-blue quilt with small white flowers covering the near two-thirds" },
  { id: "bed-front", ref: "bed", iso: "bed", view: "front", what: "the same single bed seen from the headboard side: the tall wooden headboard is at the NEAR end, the pillow just behind it, the light-blue flowered quilt toward the far end" },
  { id: "desk", ref: "desk", iso: "desk", view: "back", what: "a simple wooden study desk: flat light-wood top, four slim darker-wood legs, empty top surface (nothing on it)" },
  { id: "chair-back", ref: "chair", iso: "chair", view: "back", what: "a wooden chair: square seat, four legs, backrest at the FAR side so the seat faces the viewer" },
  { id: "chair-front", ref: "chair", iso: "chair", view: "front", what: "the same wooden chair turned around: the backrest is on the NEAR side, so we see the back of the backrest in front of the seat" },
  { id: "radio-back", ref: "radio", iso: "radio", view: "back", what: "a small retro orange radio with a round speaker grille and a short antenna, facing the viewer" },
  { id: "radio-front", ref: "radio", iso: "radio", view: "front", what: "the same small orange radio seen from behind: plain back panel, antenna visible" },
  { id: "rug", ref: "rug", iso: "rug", view: "back", what: "a flat ROUND (oval in this isometric view) pink rug with a lighter pink inner ring, lying flat on the floor, no thickness, filling the floor diamond of the guide" },
  { id: "frame-wall", ref: "painting", iso: "painting", view: "wall", what: "a small framed landscape picture (wooden frame, sky and green hill) hanging flat on the LEFT wall, so it is a slanted parallelogram following the wall" },
];

/** 앞뒤가 뚜렷해 두 장(back·front)을 그리는 가구. 나머지는 한 장을 방향마다 좌우 반전해 쓴다. */
const TWO_VIEWS = new Set(["bed", "chair", "radio", "sofa", "rocker", "bench", "piano", "bookshelf", "wardrobe", "mailbox", "voice-tv", "showcase", "shelf-complete", "tent", "trout-aquarium"]);
/** 정면 그림 파일이 있어도 코드가 그리는 것 — 창문은 유리 자리에 창밖 날씨를 그린다. */
const SKIP = new Set(["win-round", "win-wide"]);

/** 가구 하나의 그림 이름들. 0단계에서 정한 이름(언덕 그림 = frame-wall)은 그대로. */
function names(id: string): { back: string; front: string } | { wall: string } {
  if (ISO[id].layer === "wall") return { wall: id === "painting" ? "frame-wall" : `${id}-wall` };
  return TWO_VIEWS.has(id) ? { back: `${id}-back`, front: `${id}-front` } : { back: id, front: id };
}

/** 그릴 가구 — 가구표 순서. */
const TARGETS = FURNITURE.filter((f) => ISO[f.id] && FURNITURE_SPRITES[f.art] && !SKIP.has(f.id));

const PILOTS: Pilot[] = TARGETS.flatMap((f) => {
  const n = names(f.id);
  const what = (view: Pilot["view"]) =>
    `the object shown in the FIRST attached image, a "${f.label}" (Korean name; ${f.hint})` +
    (view === "front" ? ", turned around so that its back side faces the viewer" : "") +
    // 올려 두는 것은 책상·탁자 위에 올라간다 — 정면 그림에 받침이 있어도 물건만.
    (ISO[f.id].layer === "small" ? ". Draw ONLY the object itself standing directly on the ground: no table, stand, shelf or furniture under it, even if the first image shows one" : "");
  const jobs: Pilot[] = "wall" in n
    ? [{ id: n.wall, ref: f.art, iso: f.id, view: "wall", what: `${what("wall")}, hanging flat on the LEFT wall, so it is a slanted parallelogram following the wall` }]
    : n.back === n.front
      ? [{ id: n.back, ref: f.art, iso: f.id, view: "back", what: what("back") }]
      : [{ id: n.back, ref: f.art, iso: f.id, view: "back", what: what("back") }, { id: n.front, ref: f.art, iso: f.id, view: "front", what: what("front") }];
  return jobs.map((j) => CUSTOM.find((c) => c.id === j.id) ?? j);
});

/**
 * 마당 소품(yard.ts, docs/garden-farm-v2.md §6 4b) — 정면 그림이 없어 이미 그린 아이소 그림(광장 등불)을 그림체 참고로.
 * 마당 바닥에 서는 1 × 1 크기. 파일 이름은 yard-<id>.
 */
PILOTS.push(...YARD_ITEMS.map((y): Pilot => ({
  id: `yard-${y.id}`, ref: "", iso: "", view: "back", styleRef: "lantern",
  spec: { layer: "furniture", w: 1, d: 1, h: y.h },
  what: `${y.art}, an outdoor garden decoration (draw only the object — no grass, no ground patch under it)`,
})));

/** 다 그린 가구의 목록 — 방 그림이 읽는다. 한 방향이라도 빠진 가구는 넣지 않는다. */
function writeManifest() {
  const out: Record<string, ReturnType<typeof names>> = {};
  for (const f of TARGETS) {
    const n = names(f.id);
    const files = "wall" in n ? [n.wall] : [n.back, n.front];
    if (files.every((x) => existsSync(join(OUT, `${x}.png`)))) out[f.id] = n;
  }
  writeFileSync(join(ROOT, "src", "features", "garden", "room", "isoArt.json"), JSON.stringify(out, null, 2) + "\n");
  // 마당 소품 — 다 그린 id만. 마당 그림(IsoYard.tsx)이 읽고, 없는 것은 글자로 세운다.
  const yard = YARD_ITEMS.filter((y) => existsSync(join(OUT, `yard-${y.id}.png`))).map((y) => y.id);
  writeFileSync(join(ROOT, "src", "features", "garden", "yardArt.json"), JSON.stringify(yard) + "\n");
  return Object.keys(out).length;
}

// ── 그림 상자와 기하 안내 ──────────────────────────────────────────────

function specOf(p: Pilot) {
  const spec = p.spec ?? ISO[p.iso];
  if (!spec) throw new Error(`${p.id}: room/iso.ts에 ${p.iso}가 없다`);
  return spec;
}

function boxSize(p: Pilot): { W: number; H: number } {
  const b = isoBox(specOf(p));
  return { W: b.w, H: b.h };
}

/** 회색 덩어리 안내 그림 — ImageMagick MVG 명령. (SVG로 그리면 ImageMagick이 선 색·굵기를 빠뜨린다.) 앞면의 그늘은 시안과 같다. */
function guideMvg(p: Pilot): { VW: number; VH: number; mvg: string } {
  const s = 3; // 안내 그림은 크게
  const T = TILE * s;
  const { W, H } = boxSize(p);
  const { w, d, h } = specOf(p);
  const pad = 60;
  const VW = Math.round(W * s + pad * 2);
  const VH = Math.round(H * s + pad * 2);
  const xy = (x: number, y: number) => `${x.toFixed(1)},${y.toFixed(1)}`;
  const poly = (pts: string[], fill: string) => `fill '${fill}' stroke '#333333' stroke-width 2 polygon ${pts.join(" ")}`;
  const line = (a: string, b: string) => `fill none stroke '#e02020' stroke-width 8 line ${a} ${b}`;
  const out: string[] = [];
  if (p.view === "wall") {
    // 왼쪽 벽(u=0) 위의 평행사변형 — 벽 자체도 옅게.
    const wx = pad, wy = pad + h * s;
    // 왼쪽 벽은 안쪽 꼭짓점(오른쪽 위)에서 왼쪽 아래로 내려간다.
    const Q = (a: number, z: number) => xy(wx + ((w - a) * T) / 2, wy + (a * T) / 4 - z * s);
    out.push(poly([Q(-0.3, -10), Q(w + 0.3, -10), Q(w + 0.3, h + 10), Q(-0.3, h + 10)], "#f3e6cf"));
    out.push(poly([Q(0, 0), Q(w, 0), Q(w, h), Q(0, h)], "#9a9a9a"));
  } else {
    // 방향 0: 원점(0,0)이 그림 상자의 위 꼭짓점 쪽.
    const ox = pad + d * (T / 2);
    const oy = pad + h * s;
    const P = (u: number, v: number, z: number) => xy(ox + ((u - v) * T) / 2, oy + ((u + v) * T) / 4 - z * s);
    out.push(poly([P(0, 0, 0), P(w, 0, 0), P(w, d, 0), P(0, d, 0)], "#e2b07a"));
    if (h > 0) {
      out.push(poly([P(0, d, 0), P(w, d, 0), P(w, d, h), P(0, d, h)], "#a8a8a8"));
      out.push(poly([P(w, 0, 0), P(w, d, 0), P(w, d, h), P(w, 0, h)], "#8a8a8a"));
    }
    out.push(poly([P(0, 0, h), P(w, 0, h), P(w, d, h), P(0, d, h)], "#c4c4c4"));
    // 물건의 뒤 — 빨간 선. back: 먼 쪽(v가 작은 모서리), front: 가까운 쪽(v가 큰 모서리).
    out.push(p.view === "back" ? line(P(0, 0, h), P(w, 0, h)) : line(P(0, d, h), P(w, d, h)));
  }
  return { VW, VH, mvg: out.join("\n") };
}

function prompt(p: Pilot, file: string): string {
  const orient =
    p.view === "wall"
      ? "It hangs on the left wall of an isometric room."
      : `The red line in the geometry guide marks the ${p.view === "back" ? "BACK of the object (the far edge)" : "BACK of the object, which here is the NEAR edge (the object is turned away from us)"}.`;
  return (
    `Use your built-in image generation tool to create ONE image, then copy the generated PNG into the current directory as ${file}. ` +
    "Do not write any code other than the copy command. " +
    `Subject: ${p.what}. ` +
    "Projection: classic 2:1 isometric pixel art (dimetric, floor edges rise 1 pixel for every 2 across), camera fixed from the front-right corner of a room looking down, exactly like the attached geometry guide (the SECOND attached image). " +
    `The object must fill the grey block in the guide: same angle, same footprint proportions and same height proportion. ${orient} ` +
    (p.styleRef
      ? "Style: match the FIRST attached image exactly (another isometric object from this same game — same pixel size, outline and shading) — cute,"
      : "Style: match the FIRST attached image (the same object drawn front-on in this game) — cute,") +
    " soft Korean cozy-room pixel art, chunky clean pixels, warm pastel palette, dark brown 1-pixel outline, light from the upper left (top face brightest, left face medium, right face darkest). " +
    `Background: one flat solid pure magenta ${KEY} everywhere outside the object, no gradient, no floor, no shadow, no room, no other objects. ` +
    "Exactly one object, centered, fully inside the frame with margin. Absolutely no text, letters, numbers, logos or watermark."
  );
}

// ── 만들기 ──────────────────────────────────────────────────────────

async function make(p: Pilot): Promise<boolean> {
  const raw = join(WORK, `${p.id}.png`);
  const guidePng = join(WORK, `${p.id}.guide.png`);
  const ref = p.styleRef ? join(OUT, `${p.styleRef}.png`) : join(ROOT, "public", "images", "room", `${p.ref}.png`);
  const guide = guideMvg(p);
  const mvgPath = join(WORK, `${p.id}.guide.mvg`);
  writeFileSync(mvgPath, guide.mvg + "\n");
  await run("magick", ["-size", `${guide.VW}x${guide.VH}`, "xc:white", "-draw", `@${mvgPath}`, guidePng]);

  const text = prompt(p, `${p.id}.png`);
  const code = await new Promise<number>((resolve) => {
    // stdin을 닫아 둔다 — 열려 있으면 codex가 프롬프트를 더 받으려고 멈춘다.
    const child = spawn("codex", ["exec", "--skip-git-repo-check", "-s", "workspace-write", "-C", WORK, text, "-i", ref, guidePng], { stdio: ["ignore", "ignore", "pipe"] });
    let err = "";
    child.stderr.on("data", (d) => (err = (err + String(d)).slice(-400)));
    const timer = setTimeout(() => child.kill("SIGTERM"), 10 * 60_000);
    child.on("close", (c) => {
      clearTimeout(timer);
      if (c !== 0) console.error(`  ✗ ${p.id}: codex 실패(${c})`, err.trim().slice(-200));
      resolve(c ?? 1);
    });
  });
  if (code !== 0) return false;
  if (!existsSync(raw)) {
    console.error(`  ✗ ${p.id}: 그림이 생기지 않았다`);
    return false;
  }

  // 마젠타 빼기 → 잘라내기 → 그림 상자(네 배 판)에 아래 가운데 맞춤 → 반투명 가장자리 없애기 → 색 줄이기.
  const { W, H } = boxSize(p);
  const BW = Math.round(W * SCALE);
  const BH = Math.round(H * SCALE);
  await run("magick", [
    raw, "-alpha", "set", "-fuzz", "22%", "-fill", "none", "-draw", "color 0,0 floodfill",
    "-fuzz", "18%", "-transparent", KEY,
    "-trim", "+repage",
    "-resize", `${BW}x${BH}`,
    "-background", "none", "-gravity", "south", "-extent", `${BW}x${BH}`,
    "-channel", "A", "-threshold", "50%", "+channel",
    "-colors", "64",
    `PNG32:${join(OUT, `${p.id}.png`)}`,
  ]);

  const log = join(OUT, "prompts.json");
  const records = existsSync(log) ? (JSON.parse(readFileSync(log, "utf8")) as Record<string, unknown>) : {};
  records[p.id] = { tool: "codex exec · built-in image_gen (GPT)", created: new Date().toISOString().slice(0, 10), reference: `room/${p.ref}.png + geometry guide`, box: `${BW}x${BH}`, prompt: text };
  writeFileSync(log, JSON.stringify(records, null, 2) + "\n");
  writeManifest();
  console.log(`  ✓ ${p.id} (${BW}×${BH})`);
  return true;
}

async function main() {
  mkdirSync(WORK, { recursive: true });
  mkdirSync(OUT, { recursive: true });
  const only = process.argv[2] === "--list" ? undefined : process.argv[2];
  if (process.argv[2] === "--list") {
    for (const p of PILOTS) console.log(`${existsSync(join(OUT, `${p.id}.png`)) ? "✓" : "·"} ${p.id}`);
    console.log(`${PILOTS.length}장 · 가구 ${TARGETS.length}종 · 목록에 ${writeManifest()}종`);
    return;
  }
  if (only && !PILOTS.some((p) => p.id === only)) {
    console.error(`모르는 그림: ${only} — ${PILOTS.map((p) => p.id).join(", ")}`);
    process.exit(1);
  }
  const jobs = PILOTS.filter((p) => (only ? p.id === only : !existsSync(join(OUT, `${p.id}.png`))));
  console.log(`그릴 그림 ${jobs.length}개 · 동시에 ${JOBS} · 목록에 ${writeManifest()}종`);
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
  console.log(failed ? `✗ ${failed}개 실패 — 다시 돌리면 빠진 것만 그린다` : "✓ 모두 그렸다 — 훑어보고 맞지 않는 것은 지운 뒤 다시 돌린다");
  process.exit(failed ? 1 : 0);
}

void main();
