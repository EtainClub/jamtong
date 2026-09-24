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
import { CHEERS } from "../src/content/cheers";
import { validateCheers } from "../src/content/cheers/schema";
import { BOOKS } from "../src/content/books";
import { validateBook } from "../src/content/books/schema";

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
    `✓ 언행 ${statement.slug} — ${statement.body ? `원문 ${statement.body.length}자` : "영상 개요"}, ` +
      `쉬운 토막 ${points}, 말풀이 ${statement.glossary.length}`,
  );
}

/*
 * 지지자 응원.
 *
 * 여기서 볼 것은 겹침뿐이다. 영상 내용은 우리가 검증하지 않는다 — 검증한
 * 것처럼 보이게 하는 순간 업적에 붙는 근거와 구분이 사라진다. 다만 같은
 * 영상이 두 번 걸리는 것은 우리 잘못이므로 빌드에서 잡는다.
 */
const cheerErrors = validateCheers(CHEERS);
if (cheerErrors.length > 0) {
  failed = true;
  console.error("\n✗ 지지자 응원");
  for (const error of cheerErrors) console.error(`    ${error}`);
} else {
  console.log(`✓ 지지자 응원 — 영상 ${CHEERS.length}편`);
}
/*
 * 자서전.
 *
 * 두 가지를 본다. 옮긴 토막이 발췌에 실재하는가(언행과 같은 규율), 그리고
 * 챕터마다 행동이 하나라도 있는가. 뒤의 것이 이 섹션의 존재 이유다 —
 * 읽고 끝나는 글을 하나 더 만들려는 것이 아니다.
 */
for (const book of BOOKS) {
  const errors = validateBook(book);
  const actions = book.chapters.reduce((n, c) => n + c.actions.length, 0);
  const bodies = book.chapters.filter((c) => c.body).length;

  if (errors.length > 0) {
    failed = true;
    console.error(`\n\u2717 자서전 ${book.slug}`);
    for (const error of errors) console.error(`    ${error}`);
    continue;
  }

  if (book.chapters.length === 0) {
    console.warn(`  \u26a0 자서전 ${book.slug} — 챕터가 아직 없습니다 (서지 정보만)`);
    continue;
  }

  console.log(
    `\u2713 자서전 ${book.slug} — 챕터 ${book.chapters.length}, ` +
      `본문 ${bodies}, 행동 ${actions}`,
  );
}

const unsourced = BOOKS.filter((book) => !book.source.verified);
if (unsourced.length > 0) {
  console.warn(
    `  \u26a0 서지 정보를 1차 자료로 대조하지 않은 책 ${unsourced.length}권: ` +
      unsourced.map((b) => b.slug).join(", "),
  );
}

if (failed) {
  console.error("\n\ucf58\ud150\uce20 \uac80\uc99d \uc2e4\ud328.");
  process.exit(1);
}

console.log("\n\uac80\uc99d \ud1b5\uacfc.");
