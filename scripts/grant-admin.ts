/**
 * 운영자 지정 — admins/{uid} 문서를 만든다.
 *
 * 규칙이 이 문서의 존재만 보므로, 여기에 uid를 넣는 것이 곧 운영자 권한이다.
 * 아무에게도 쓰기를 열지 않았기 때문에 앱에서는 만들 수 없고 이 길로만 만든다.
 *
 *   pnpm grant-admin <uid>            운영자로 지정
 *   pnpm grant-admin <uid> --revoke   지정 해제
 *
 * uid는 앱의 MY 화면에서 확인하거나 파이어베이스 콘솔 Authentication에서 본다.
 * 서비스 계정 키(sa.json)가 필요하며, 이 파일은 깃에 올라가지 않는다.
 */
import { readFileSync } from "node:fs";
import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

const [uid, flag] = process.argv.slice(2);

if (!uid) {
  console.error("uid를 적어 주세요.  pnpm grant-admin <uid> [--revoke]");
  process.exit(1);
}

const keyPath = process.env.GOOGLE_APPLICATION_CREDENTIALS ?? "sa.json";

let key: { project_id: string };
try {
  key = JSON.parse(readFileSync(keyPath, "utf8"));
} catch {
  console.error(`서비스 계정 키를 읽지 못했습니다: ${keyPath}`);
  process.exit(1);
}

if (getApps().length === 0) {
  initializeApp({ credential: cert(keyPath) });
}
const db = getFirestore();

async function main() {
  const ref = db.collection("admins").doc(uid);

  if (flag === "--revoke") {
    await ref.delete();
    console.log(`해제했습니다: ${uid} (${key.project_id})`);
    return;
  }

  await ref.set({ grantedAt: new Date().toISOString() });
  console.log(`운영자로 지정했습니다: ${uid} (${key.project_id})`);
  console.log("앱에서 피드백 화면을 새로 열면 운영자 표시가 나옵니다.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
