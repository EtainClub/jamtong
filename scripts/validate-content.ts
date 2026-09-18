/**
 * 콘텐츠 검증 — CI 게이트.
 *
 * 검토 문서 4.2의 불변식, 참조 무결성, 공개 조건을 빌드 전에 강제한다.
 * Firestore였다면 불가능했을 검사다. 콘텐츠가 리포지토리에 있기 때문에 가능하다.
 */
import { STORIES } from "../src/content/stories";
import { validateStory } from "../src/content/schema";

let failed = false;

for (const story of STORIES) {
  const errors = validateStory(story);
  const pending = story.claims.filter((c) => !c.verified);
  const badge = story.publishStatus === "published" ? "공개" : "초안";

  if (errors.length > 0) {
    failed = true;
    console.error(`\n\u2717 ${story.slug} [${badge}]`);
    for (const error of errors) console.error(`    ${error}`);
    continue;
  }

  console.log(
    `\u2713 ${story.slug} [${badge}] \u2014 claim ${story.claims.length}, ` +
      `source ${story.sources.length}, \ubbf8\uac80\uc99d ${pending.length}`,
  );

  for (const claim of pending) {
    console.warn(`  \u26a0 \uac80\uc99d \uc804: ${claim.id} \u2014 ${claim.text.slice(0, 60)}\u2026`);
  }
}

if (failed) {
  console.error("\n\ucf58\ud150\uce20 \uac80\uc99d \uc2e4\ud328.");
  process.exit(1);
}

console.log("\n\uac80\uc99d \ud1b5\uacfc.");
