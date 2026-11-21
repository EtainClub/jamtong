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

/**
 * 일본어 카드용 서체 — 옮긴 자서전 장(/ja/books/…)만 쓴다.
 *
 * Pretendard에는 가나가 없고, 한자는 한국식 자형이다. Noto Sans JP를 JIS X 0208(제1·2수준 한자)과
 * 가나·전각 기호·ASCII로 줄여 둔 파일이다(assets/fonts/README.md). 모든 카드가 읽지 않도록
 * 부를 때 한 번만 읽는다. 목록 앞의 Noto Sans JP가 먼저 쓰이고, 없는 글자(한글)는 Pretendard로 넘어간다.
 */
let jaFonts: Promise<typeof ogFonts> | undefined;
export function ogFontsJa(): Promise<typeof ogFonts> {
  jaFonts ??= Promise.all([
    readFile(join(FONT_DIR, "NotoSansJP-Light.otf")),
    readFile(join(FONT_DIR, "NotoSansJP-Medium.otf")),
  ]).then(([jaLight, jaMedium]) => [
    { name: "Noto Sans JP", data: jaLight, weight: 300 as const, style: "normal" as const },
    { name: "Noto Sans JP", data: jaMedium, weight: 600 as const, style: "normal" as const },
    ...ogFonts,
  ]);
  return jaFonts;
}

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

/**
 * 로컬 이미지를 data URI로. satori는 상대 경로를 못 읽는다.
 * ★ public/ 아래만 읽는다. 경로를 통째로 받아 join하면 Turbopack이 저장소 전체를 서버 출력에 싣는다
 *   ("Dynamic filesystem access causes tracing of the whole project"). 부르는 쪽은 "public/..."을 그대로 넘긴다.
 */
export async function dataUri(relPath: string, mime = "image/png") {
  if (!relPath.startsWith("public/")) throw new Error(`dataUri: public/ 아래만 읽는다 — ${relPath}`);
  const buf = await readFile(join(process.cwd(), "public", relPath.slice("public/".length)));
  return `data:${mime};base64,${buf.toString("base64")}`;
}
