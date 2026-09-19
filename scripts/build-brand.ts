/**
 * 브랜드 자산 생성. 원본 두 장에서 파비콘·앱 아이콘·로고를 전부 뽑는다.
 *
 *   pnpm brand
 *
 * ImageMagick(`magick`)이 필요하다. 원본은 `assets/brand/`에 있고 서빙되지 않는다.
 * 결과물만 `public/images/`와 `src/app/`으로 나간다.
 *
 * 크기에 따라 판을 나누는 이유:
 * 원본은 1254px 캔버스 안에 그림이 699×883으로 들어가 사방에 여백이 넉넉하다.
 * 그대로 줄이면 여백까지 같이 줄어 32px에서 '잼통'이 회색 덩어리가 된다.
 * 작은 자리는 여백을 잘라 꽉 채우고 언샵으로 획을 되살린다. 큰 자리는 원본
 * 여백을 유지한다 — iOS·안드로이드가 가장자리까지 찬 아이콘을 싫어한다.
 */
import { execFileSync } from "node:child_process";
import { mkdirSync, rmSync, statSync } from "node:fs";

const EGGSHELL = "#fdfcfc";
const UNSHARP = "0x0.6+0.8+0.02";

const APPICON = "assets/brand/jamtong-app-icon.png";
const WORDMARK = "assets/brand/jamtong-korean-wordmark.png";

/** 여백을 뺀 그림 영역. 원본이 바뀌면 다시 재어야 한다. */
const ICON_ART = "699x883+241+194";
/** 스우시와 글자만. 한반도 워터마크는 뺀다. */
const WORD_ART = "653x453+664+107";

const TMP_ICON = ".brand-icon-tight.png";
const TMP_WORD = ".brand-word-clean.png";

const magick = (...args: string[]) => execFileSync("magick", args, { stdio: "inherit" });

function main() {
  mkdirSync("public/images", { recursive: true });

  // ── 작은 자리용: 여백을 잘라 정사각으로 ──
  magick(APPICON, "-crop", ICON_ART, "+repage",
    "-background", EGGSHELL, "-gravity", "center", "-extent", "883x883", TMP_ICON);

  const small = (dest: string, size: number) =>
    magick(TMP_ICON, "-filter", "Lanczos", "-resize", `${size}x${size}`,
      "-unsharp", UNSHARP, "-background", EGGSHELL, "-flatten", dest);

  small("src/app/icon.png", 32);              // 탭 파비콘
  small("public/images/jamtong-icon-sm.png", 128);  // 상단 바 28px의 4배
  magick(TMP_ICON, "-filter", "Lanczos", "-resize", "48x48", "-unsharp", UNSHARP,
    "-background", EGGSHELL, "-flatten",
    "-define", "icon:auto-resize=48,32,16", "public/images/jamtong-favicon.ico");
  magick("public/images/jamtong-favicon.ico", "src/app/favicon.ico");

  // ── 큰 자리용: 원본 여백 유지 ──
  const large = (dest: string, size: number, inset = 0) => {
    if (inset) {
      const inner = Math.round(size * (1 - inset));
      magick(APPICON, "-resize", `${inner}x${inner}`,
        "-background", EGGSHELL, "-gravity", "center", "-extent", `${size}x${size}`, dest);
    } else {
      magick(APPICON, "-resize", `${size}x${size}`, "-background", EGGSHELL, "-flatten", dest);
    }
  };

  large("src/app/icon1.png", 512);
  large("src/app/apple-icon.png", 180);       // iOS는 투명을 검정으로 채우므로 불투명
  large("public/images/jamtong-icon-192.png", 192);
  large("public/images/jamtong-icon-512.png", 512);
  large("public/images/jamtong-icon-maskable-512.png", 512, 0.22);  // 안드로이드 안전 영역

  // ── 로고 ──
  magick(WORDMARK, "-crop", WORD_ART, "+repage",
    "-fuzz", "14%", "-fill", EGGSHELL, "-opaque", "#fcfcfb",
    "-bordercolor", EGGSHELL, "-border", "44", TMP_WORD);
  magick(TMP_WORD, "-resize", "880x", "public/images/jamtong-logo.png");
  magick(TMP_WORD, "-resize", "1760x", "public/images/jamtong-logo@2x.png");
  magick(TMP_WORD, "-fuzz", "6%", "-transparent", EGGSHELL,
    "-resize", "880x", "public/images/jamtong-logo-transparent.png");

  rmSync(TMP_ICON);
  rmSync(TMP_WORD);

  for (const p of [
    "src/app/favicon.ico", "src/app/icon.png", "src/app/icon1.png", "src/app/apple-icon.png",
    "public/images/jamtong-icon-sm.png", "public/images/jamtong-icon-192.png",
    "public/images/jamtong-icon-512.png", "public/images/jamtong-icon-maskable-512.png",
    "public/images/jamtong-favicon.ico", "public/images/jamtong-logo.png",
    "public/images/jamtong-logo@2x.png", "public/images/jamtong-logo-transparent.png",
  ]) {
    console.log(`  ${p}  ${Math.round(statSync(p).size / 1024)}KB`);
  }
}

main();
