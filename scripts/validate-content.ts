/**
 * 콘텐츠 검증 — CI 게이트.
 *
 * 검토 문서 4.2의 불변식과 참조 무결성을 빌드 전에 강제한다.
 * Firestore였다면 불가능했을 검사다. 콘텐츠가 리포지토리에 있기 때문에 가능하다.
 */
import { arcticRoute } from "../src/content/stories/arctic-route/story";
import { validateStory, type Story } from "../src/content/schema";

const stories: Story[] = [arcticRoute];

let failed = false;
let unverified = 0;

for (const story of stories) {
  const errors = validateStory(story);

  if (errors.length > 0) {
    failed = true;
    console.error(`\n✗ ${story.slug}`);
    for (const error of errors) console.error(`    ${error}`);
  } else {
    console.log(`✓ ${story.slug} — claim ${story.claims.length}, source ${story.sources.length}`);
  }

  const pending = story.claims.filter((c) => !c.verified);
  unverified += pending.length;
  for (const claim of pending) {
    console.warn(`  ⚠ 검증 전: ${claim.id} — ${claim.text}`);
  }
}

if (failed) {
  console.error("\n콘텐츠 검증 실패.");
  process.exit(1);
}

console.log(`\n검증 통과. 미검증 claim ${unverified}개 (배포 전 편집팀 확인 필요).`);
