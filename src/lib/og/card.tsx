import { readFile } from "node:fs/promises";
import { join } from "node:path";

/**
 * 공유 카드 공통 부품 (설계 검토 문서 8장 Sprint 1 "공유 카드").
 *
 * 링크를 붙였을 때 뜨는 그림이다. 이 위키는 퍼져야 쓸모가 있는데, 지금까지
 * 카드가 없어서 어디에 붙이든 맨 링크만 나갔다.
 *
 * satori는 브라우저가 아니라 CDN 웹폰트를 못 읽고 WOZFF2도 못 읽는다.
 * 한글 글리프가 담긴 정적 OTF를 직접 넘긴다. 안 넘기면 제목이 두부로 나온다.
 */

const FONT_DIR = join(process.cwd(), "assets/fonts");

const [light, semibold] = await Promise.all([
  readFile(join(FONT_DIR, "Pretendard-Light.otf")),
  readFile(join(FONT_DIR, "Pretendard-SemiBold.otf")),
]);

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";

export const ogFonts = [
  { name: "Pretendard", data: light, weight: 300 as const, style: "normal" as const },
  { name: "Pretendard", data: semibold, weight: 600 as const, style: "normal" as const },
];

/** 디자인 토큰. globals.css의 값을 그대로 옮긴다 — 한 곳에서 갈라지면 안 된다. */
export const C = {
  eggshell: "#fdfcfc",
  taupe: "#f5f3f1",
  stone: "#ebe8e4",
  ink: "#000000",
  graphite: "#44403b",
  smoke: "#777169",
  ash: "#a59f97",
  navy: "#16366b",
  burgundy: "#8a2233",
  pending: "#8a6a12",
  pendingTint: "#f6f0df",
};

/** 로컬 이미지를 data URI로. satori는 상대 경로를 못 읽는다. */
export async function dataUri(relPath: string, mime = "image/png") {
  const buf = await readFile(join(process.cwd(), relPath));
  return `data:${mime};base64,${buf.toString("base64")}`;
}
