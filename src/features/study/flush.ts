/**
 * 미뤄 둔 계정 저장을 지금 하기 — 잼공은 고칠 때마다 2초 뒤에 계정(Firestore)에 쓴다(StudyApp).
 *
 * ★ 판을 끝내자마자 정원 선물로 넘어가면 그 2초가 지나기 전에 잼공 화면이 사라진다. 예전에는 그때 예약을 지워
 *   그날 공부가 이 기기에만 남고 계정에는 올라가지 않았다(다른 기기·앱에서 진도가 빠져 보였다).
 *   이제 화면을 떠날 때·앱을 내릴 때·정원으로 넘어갈 때 미뤄 둔 저장을 곧바로 한다.
 */
let flusher: (() => void) | null = null;

/** StudyApp이 동기화를 시작하면 등록하고, 끝나면 null로 지운다. */
export function setStudyFlusher(fn: (() => void) | null): void {
  flusher = fn;
}

/** 미뤄 둔 계정 저장이 있으면 지금 한다. 없으면 아무것도 하지 않는다. */
export function flushStudy(): void {
  flusher?.();
}
