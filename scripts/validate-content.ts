/**
 * 콘텐츠 검증 — CI 게이트.
 *
 * 검토 문서 4.2의 불변식, 참조 무결성, 공개 조건을 빌드 전에 강제한다.
 * Firestore였다면 불가능했을 검사다. 콘텐츠가 리포지토리에 있기 때문에 가능하다.
 */
import { ACHIEVEMENTS } from "../src/content/achievements";
import { validateAchievement, validateMilestones } from "../src/content/schema";
import { MILESTONES, ALL_CLAIMS, ALL_SOURCES } from "../src/content/milestones";
import { STATEMENTS } from "../src/content/words";
import { validateStatement } from "../src/content/words/schema";

let failed = false;

for (const achievement of ACHIEVEMENTS) {
  const errors = validateAchievement(achievement);
  const pending = achievement.claims.filter((c) => !c.verified);
  const badge = achievement.publishStatus === "published" ? "공개" : "초안";

  if (errors.length > 0) {
    failed = true;
    console.error(`\n\u2717 ${achievement.slug} [${badge}]`);
    for (const error of errors) console.error(`    ${error}`);
    continue;
  }

  console.log(
    `\u2713 ${achievement.slug} [${badge}] \u2014 claim ${achievement.claims.length}, ` +
      `source ${achievement.sources.length}, \ubbf8\uac80\uc99d ${pending.length}`,
  );

  for (const claim of pending) {
    console.warn(`  \u26a0 \uac80\uc99d \uc804: ${claim.id} \u2014 ${claim.text.slice(0, 60)}\u2026`);
  }
}

const achErrors = validateMilestones({
  milestones: MILESTONES,
  claims: ALL_CLAIMS,
  sources: ALL_SOURCES,
});
const achPending = ALL_CLAIMS.filter((c) => !c.verified);

if (achErrors.length > 0) {
  failed = true;
  console.error(`\n\u2717 \uc131\uacfc \uce74\ub4dc`);
  for (const error of achErrors) console.error(`    ${error}`);
} else {
  console.log(
    `\u2713 \uc131\uacfc \uce74\ub4dc \u2014 ${MILESTONES.length}\uac74, ` +
      `claim ${ALL_CLAIMS.length}, source ${ALL_SOURCES.length}, \ubbf8\uac80\uc99d ${achPending.length}`,
  );
}


/*
 * 언행.
 *
 * 검사는 하나뿐이다 — 쉽게 보기의 인용이 원문 안에 그대로 있는가.
 * 이게 없으면 '쉽게 보기'는 그냥 우리가 쓴 글이 되고, 원문과 얼마나
 * 다른지 아무도 모르게 된다.
 */
for (const statement of STATEMENTS) {
  const errors = validateStatement(statement);
  const points = statement.easy?.points.length ?? 0;

  if (errors.length > 0) {
    failed = true;
    console.error(`\n✗ 언행 ${statement.slug}`);
    for (const error of errors) console.error(`    ${error}`);
    continue;
  }

  console.log(
    `✓ 언행 ${statement.slug} — 원문 ${statement.body.length}자, ` +
      `쉬운 토막 ${points}, 말풀이 ${statement.glossary.length}`,
  );
}
if (failed) {
  console.error("\n\ucf58\ud150\uce20 \uac80\uc99d \uc2e4\ud328.");
  process.exit(1);
}

console.log("\n\uac80\uc99d \ud1b5\uacfc.");
