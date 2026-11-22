/**
 * 업적 카툰의 공유 파일(GIF·MP4)을 Firebase Storage에 올리고, 주소를 src/content/cartoons/media.json에 적는다.
 *
 *   pnpm cartoon:upload                    .cartoon-work/media에 있는 것 모두
 *   pnpm cartoon:upload seongnam-hospital  한 업적만
 *
 * ★ 저장소에는 넣지 않는다(업적마다 1–2MB, 다 합치면 수십 MB). 만드는 것은 `pnpm cartoon:render`.
 * ★ 경로는 cartoons/<slug>/cartoon-<sha256 앞 12자>.<gif|mp4> — 내용이 바뀌면 주소도 바뀐다. 그래서 오래 캐시해도 된다.
 *   같은 내용이면 다시 올리지 않는다(목록의 sha256이 같으면 건너뛴다).
 * ★ 받기 단추가 바로 내려받도록 Content-Disposition: attachment로 올린다(다른 도메인이라 <a download>가 듣지 않는다).
 * ★ 서비스 계정 키(sa.json)와 .env.local의 NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET이 필요하다(bgm:upload와 같다).
 */
import { createHash, randomUUID } from "node:crypto";
import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getDownloadURL, getStorage } from "firebase-admin/storage";

import type { CartoonMedia } from "../src/content/cartoons";

const ROOT = process.cwd();
const MEDIA = join(ROOT, ".cartoon-work", "media");
const MANIFEST = join(ROOT, "src", "content", "cartoons", "media.json");
const KINDS = { gif: "image/gif", mp4: "video/mp4" } as const;

const keyPath = process.env.GOOGLE_APPLICATION_CREDENTIALS ?? "sa.json";
const bucketName = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;

async function main() {
  if (!bucketName) {
    console.error("NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET가 없습니다. .env.local을 확인해 주세요.");
    process.exit(1);
  }
  if (!existsSync(MEDIA)) {
    console.error("올릴 파일이 없습니다 — pnpm cartoon:render 먼저");
    process.exit(1);
  }
  if (getApps().length === 0) initializeApp({ credential: cert(keyPath), storageBucket: bucketName });
  const bucket = getStorage().bucket();

  const only = process.argv[2];
  const manifest = (existsSync(MANIFEST) ? JSON.parse(readFileSync(MANIFEST, "utf8")) : {}) as Record<string, CartoonMedia>;
  const slugs = readdirSync(MEDIA).filter((s) => /^[a-z0-9-]+$/.test(s) && (!only || s === only)).sort();

  for (const slug of slugs) {
    const entry: CartoonMedia = { ...manifest[slug] };
    for (const kind of Object.keys(KINDS) as Array<keyof typeof KINDS>) {
      const file = join(MEDIA, slug, `cartoon.${kind}`);
      if (!existsSync(file)) continue;
      const bytes = readFileSync(file);
      const sha256 = createHash("sha256").update(bytes).digest("hex");
      if (entry[kind]?.sha256 === sha256) {
        console.log(`  · ${slug}.${kind} 그대로`);
        continue;
      }
      const target = bucket.file(`cartoons/${slug}/cartoon-${sha256.slice(0, 12)}.${kind}`);
      await target.save(bytes, {
        contentType: KINDS[kind],
        metadata: {
          cacheControl: "public, max-age=31536000, immutable",
          contentDisposition: `attachment; filename="jamtong-${slug}.${kind}"`,
          metadata: { firebaseStorageDownloadTokens: randomUUID(), sha256 },
        },
        resumable: false,
      });
      entry[kind] = { url: await getDownloadURL(target), bytes: bytes.length, sha256 };
      console.log(`  ✓ ${slug}.${kind} ${Math.round(bytes.length / 1024)}KB`);
    }
    manifest[slug] = entry;
  }

  const sorted = Object.fromEntries(Object.entries(manifest).sort(([a], [b]) => a.localeCompare(b)));
  writeFileSync(MANIFEST, JSON.stringify(sorted, null, 2) + "\n");
  console.log(`✓ ${MANIFEST.replace(ROOT + "/", "")} — ${Object.keys(sorted).length}개 업적`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
