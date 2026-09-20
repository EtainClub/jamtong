import { presidentFriend } from "./president-friend";
import { youthDay } from "./youth-day";
import { oilPrice } from "./oil-price";
import { reformIsHard } from "./reform-is-hard";
import { developmentalCare } from "./developmental-care";
import { housingSupply } from "./housing-supply";
import { nohAcquittal } from "./noh-acquittal";
import { constitution } from "./constitution";
import { nationalInterest } from "./national-interest";
import { powerResponsibility } from "./power-responsibility";
import { vote } from "./vote";
import { sewolMockery } from "./sewol-mockery";
import { bundangHouse } from "./bundang-house";
import { wish } from "./wish";
import { sportsReform } from "./sports-reform";
import { frontier } from "./frontier";
import { validateStatement, type Statement } from "./schema";

/**
 * 언행 레지스트리.
 *
 * 최근 순으로 세운다. 여기는 업적과 달리 '한 일과 하겠다는 일'을 가릴 필요가
 * 없다 — 말한 날은 이미 지난 날이다. 그냥 최근이 위다.
 */
export const STATEMENTS: Statement[] = [
  presidentFriend,
  youthDay,
  oilPrice,
  reformIsHard,
  developmentalCare,
  housingSupply,
  nohAcquittal,
  constitution,
  nationalInterest,
  powerResponsibility,
  vote,
  sewolMockery,
  bundangHouse,
  wish,
  sportsReform,
  /* 책에 실린 글. 2022년이라 목록 맨 아래다. */
  frontier,
].sort((a, b) => b.postedAt.localeCompare(a.postedAt) || a.slug.localeCompare(b.slug));

export function getStatement(slug: string): Statement | undefined {
  return STATEMENTS.find((s) => s.slug === slug);
}

/**
 * 인용이 원문에서 벗어난 것이 하나라도 있으면 빌드를 세운다.
 *
 * 페이지에서 검사하지 않고 여기서 한다. 목록 페이지만 열어도 걸리게 하려는
 * 것이다 — 상세로 들어가야 알 수 있으면 늦다.
 */
const errors = STATEMENTS.flatMap((s) =>
  validateStatement(s).map((e) => `${s.slug}: ${e}`),
);
if (errors.length > 0) {
  throw new Error(`언행 자료 검증 실패:\n${errors.join("\n")}`);
}
