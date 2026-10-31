/**
 * 업적 인포그래픽 옮기기 — 코드에 박혀 있던 그림을 Firebase로 올린다.
 *
 * 인포그래픽은 이제 Storage(그림)와 Firestore `infographics`(목록)에서
 * 관리한다. 이 스크립트는 그 전에 public/images/infographics/에 두었던
 * 그림을 같은 자리로 옮기고, 운영자가 승인한 것으로 싣는다.
 *
 *   pnpm infographics:migrate
 *
 * 문서 id를 그림 id로 고정하므로 다시 돌려도 겹치지 않고 덮어쓴다.
 * 서비스 계정 키(sa.json)와 .env.local의 버킷 이름이 필요하다.
 * 다 옮긴 뒤에는 public/images/infographics/와 이 스크립트를 지워도 된다.
 */
import { readFileSync } from "node:fs";
import { cert, getApps, initializeApp } from "firebase-admin/app";
import { FieldValue, getFirestore } from "firebase-admin/firestore";
import { getDownloadURL, getStorage } from "firebase-admin/storage";

interface Seed {
  id: string;
  title: string;
  /** public 기준 경로. */
  image: string;
  width: number;
  height: number;
  alt: string;
}

const SEEDS: Seed[] = [
  {
    id: "won-sdr",
    title: "원화의 SDR 편입, 어디까지 왔나?",
    image: "/images/infographics/won-sdr.webp",
    width: 1055,
    height: 1491,
    alt: [
      "원화의 SDR 편입, 어디까지 왔나? IMF 특별인출권(SDR) 바스켓 기준, 2026년 관점. SDR 편입은 IMF 바스켓 편입이며 달러형 패권통화와는 다르다.",
      "1. 현재 SDR 바스켓 5개 통화: 미국 달러 43.38%, 유로 29.31%, 중국 위안 12.28%, 일본 엔 7.59%, 영국 파운드 7.44%.",
      "2. 편입 요건(IMF는 약 5년마다 정기 심사): 최근 5년 기준 세계 상위 수출 경제, 국제적으로 자유롭게 사용되는 통화(무역결제·외환거래·금융거래에서 널리 사용), 실질적으로는 기존 편입통화를 대체할 만큼 수출 비중과 국제사용성이 뚜렷해야 함.",
      "3. 한국의 강점: 수출 저변 확대(반도체·방산·조선·화장품·콘텐츠·식품), 대외건전성(큰 경상수지 흑자와 안정적 대외신인도), 채권시장 위상 강화(WGBI 편입 진행), 외환시장 선진화(24시간 원·달러 시장 개시), 자본시장 신뢰 개선(투명성·주주보호 강화).",
      "4. 가능성 진단: 단기적으로 2027년 심사는 쉽지 않음(낮은 편) — 아직 원화의 국제결제·외환거래 비중이 제한적. 중장기적으로는 가능성 열려 있음 — 성장·수출·시장개혁이 이어지면 편입 논의의 기반 확대.",
      "5. 보완해야 할 점: 원화 무역결제 확대, 역외 원화시장과 유동성 강화, 외국인 투자 접근성 개선, 안정적 제도 운영과 신뢰 축적, 5년 평균 수출 경쟁력 유지.",
      "한 줄 결론: 원화의 SDR 편입은 '불가능'이 아니라, 조건을 더 쌓아야 하는 중장기 과제다.",
    ].join(" "),
  },
  {
    id: "leader-x-following",
    title: "팔로워 대비 팔로잉이 많은 세계 지도자 TOP 10",
    image: "/images/infographics/leader-x-following.webp",
    width: 1122,
    height: 1402,
    alt: [
      "팔로워 대비 팔로잉이 많은 세계 지도자 TOP 10. 공식 X 계정 기준, 비율 = 팔로잉 ÷ 팔로워. 이재명 대통령이 비율 1위로, 2위보다 약 29배 높음.",
      "1위 대한민국 이재명 대통령: 팔로잉 45.25만, 팔로워 110만, 비율 41.1%.",
      "2위 핀란드 알렉산데르 스투브 대통령: 팔로잉 7,573, 팔로워 54.3만, 비율 1.40%.",
      "3위 멕시코 클라우디아 셰인바움 대통령: 팔로잉 1,638, 팔로워 500만, 비율 0.033%.",
      "4위 브라질 루이스 이나시우 룰라 다 시우바 대통령: 팔로잉 2,826, 팔로워 1,040만, 비율 0.027%.",
      "5위 영국 키어 스타머 총리: 팔로잉 386, 팔로워 250만, 비율 0.015%.",
      "6위 이탈리아 조르자 멜로니 총리: 팔로잉 251, 팔로워 370만, 비율 0.0068%.",
      "7위 엘살바도르 나이브 부켈레 대통령: 팔로잉 540, 팔로워 810만, 비율 0.0067%.",
      "8위 프랑스 에마뉘엘 마크롱 대통령: 팔로잉 710, 팔로워 1,080만, 비율 0.0066%.",
      "9위 인도 나렌드라 모디 총리: 팔로잉 2,677, 팔로워 1억 700만, 비율 0.0025%.",
      "10위 튀르키예 레제프 타이이프 에르도안 대통령: 팔로잉 140, 팔로워 1,970만, 비율 0.0007%.",
      "핵심 포인트: 이재명 대통령의 X 팔로잉 비율은 압도적 1위. 대부분 지도자는 팔로워 수는 많지만 팔로잉 비율은 매우 낮음.",
      "출처: 각 지도자의 공식 X 공개 프로필(웹 수집치). 수치는 변동될 수 있습니다.",
    ].join(" "),
  },
];

/** 운영자가 코드로 넣은 것이라 올린 사람 자리에 이 이름을 둔다. */
const SEED_OWNER = "seed";

const keyPath = process.env.GOOGLE_APPLICATION_CREDENTIALS ?? "sa.json";
const bucketName = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;

if (!bucketName) {
  console.error("NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET가 없습니다. .env.local을 확인해 주세요.");
  process.exit(1);
}

if (getApps().length === 0) {
  initializeApp({ credential: cert(keyPath), storageBucket: bucketName });
}
const db = getFirestore();
const bucket = getStorage().bucket();

async function main() {
  for (const seed of SEEDS) {
    const imagePath = `infographics/${SEED_OWNER}/${seed.id}`;
    const file = bucket.file(imagePath);
    await file.save(readFileSync(`public${seed.image}`), {
      contentType: "image/webp",
      resumable: false,
    });
    const imageUrl = await getDownloadURL(file);

    await db.collection("infographics").doc(seed.id).set({
      title: seed.title,
      alt: seed.alt,
      imageUrl,
      imagePath,
      width: seed.width,
      height: seed.height,
      authorUid: SEED_OWNER,
      status: "approved",
      createdAt: FieldValue.serverTimestamp(),
      approvedAt: FieldValue.serverTimestamp(),
    });
    console.log(`옮겼습니다: ${seed.id}`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
