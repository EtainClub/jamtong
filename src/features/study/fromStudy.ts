/**
 * "잼공에서 정원으로 왔다"는 표시 — 정원이 「잼공으로 돌아가기」를 띄울지 정한다.
 *
 * ★ 주소(?from=study)로는 안 된다. 링크로 넘어갈 때 정원이 처음 그려지는 순간에는 주소창이 아직 /study다.
 *   그래서 이 탭에만 남는 sessionStorage에 넘어간 때를 적고, 정원은 10분 안의 표시만 믿는다.
 * ★ 저장소가 막혀 있으면(비공개 창 등) 조용히 넘어간다 — 돌아가기 버튼이 안 뜰 뿐이다.
 */
const KEY = "jamgong-from-study";
const FRESH_MS = 10 * 60_000;

export function markFromStudy(): void {
  try {
    sessionStorage.setItem(KEY, String(Date.now()));
  } catch {
    // 저장소가 막혀 있다.
  }
}

export function cameFromStudy(): boolean {
  try {
    const at = Number(sessionStorage.getItem(KEY));
    return Number.isFinite(at) && at > 0 && Date.now() - at < FRESH_MS;
  } catch {
    return false;
  }
}

export function clearFromStudy(): void {
  try {
    sessionStorage.removeItem(KEY);
  } catch {
    // 저장소가 막혀 있다.
  }
}
