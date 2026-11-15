/**
 * 운영자 카탈로그 방 음원을 Firebase Storage(`bgm/catalog/<slug>.mp3`)로 올린다.
 *
 *   pnpm bgm:upload --file "assets/노래/우리_함께_나아갈_길.mp3" --slug together-road
 *
 * 기본적으로 ffmpeg로 32kHz · 96kbps · -20 LUFS MP3로 맞춘 뒤 올린다(`--raw`로 건너뛸 수 있다).
 * 서비스 계정 키(sa.json)와 .env.local의 NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET이 필요하다.
 */
import { execFileSync } from "node:child_process";
import { createHash, randomUUID } from "node:crypto";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getDownloadURL, getStorage } from "firebase-admin/storage";

function arg(name: string): string | undefined {
  const idx = process.argv.indexOf(`--${name}`);
  return idx >= 0 ? process.argv[idx + 1] : undefined;
}

const file = arg("file");
const slug = arg("slug");
const raw = process.argv.includes("--raw");

if (!file || !slug || !/^[a-z0-9-]+$/.test(slug)) {
  console.error("사용법: pnpm bgm:upload -- --file <mp3경로> --slug <ascii-slug> [--raw]");
  process.exit(1);
}

const keyPath = process.env.GOOGLE_APPLICATION_CREDENTIALS ?? "sa.json";
const bucketName = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;
if (!bucketName) {
  console.error("NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET가 없습니다. .env.local을 확인해 주세요.");
  process.exit(1);
}

async function main() {
  const tempDir = mkdtempSync(join(tmpdir(), "jamtong-bgm-"));
  try {
    const uploadSource = raw ? file! : join(tempDir, `${slug}.mp3`);
    if (!raw) {
      execFileSync(
        "ffmpeg",
        ["-y", "-i", file!, "-af", "loudnorm=I=-20:TP=-3:LRA=11", "-ar", "32000", "-ac", "2", "-b:a", "96k", uploadSource],
        { stdio: "inherit" },
      );
    }

    const bytes = readFileSync(uploadSource);
    const sha256 = createHash("sha256").update(bytes).digest("hex");

    let duration = "";
    try {
      const seconds = Number(
        execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "default=nw=1:nk=1", uploadSource])
          .toString()
          .trim(),
      );
      if (Number.isFinite(seconds) && seconds > 0) {
        const m = Math.floor(seconds / 60);
        const s = Math.round(seconds % 60);
        duration = `${m}:${String(s).padStart(2, "0")}`;
      }
    } catch {
      // ffprobe가 없어도 업로드는 진행한다.
    }

    if (getApps().length === 0) {
      initializeApp({ credential: cert(keyPath), storageBucket: bucketName });
    }
    const bucket = getStorage().bucket();
    const storagePath = `bgm/catalog/${slug}.mp3`;
    const target = bucket.file(storagePath);

    await target.save(bytes, {
      contentType: "audio/mpeg",
      metadata: {
        cacheControl: "public, max-age=31536000, immutable",
        metadata: { firebaseStorageDownloadTokens: randomUUID(), sha256 },
      },
      resumable: false,
    });

    const url = await getDownloadURL(target);
    console.log(JSON.stringify({ storagePath, bytes: bytes.length, duration, sha256, url }, null, 2));
  } finally {
    rmSync(tempDir, { recursive: true, force: true });
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
