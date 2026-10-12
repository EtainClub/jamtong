/**
 * 방금 고른 것을 같은 탭 안에서만 기억한다(sessionStorage).
 *
 * 카드를 눌러 상세로 갔다가 뒤로 오면 무엇을 봤는지 남아 있게 하려는 것뿐이다.
 * 저장소를 못 쓰는 브라우저(사생활 보호 모드 등)에서는 기억하지 못할 뿐 화면은 그대로다.
 */
export function loadSelection<T>(key: string): T | null {
  try {
    const raw = sessionStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

export function saveSelection<T>(key: string, value: T) {
  try {
    sessionStorage.setItem(key, JSON.stringify(value));
  } catch {
    // 저장하지 못하면 돌아왔을 때 처음부터 보일 뿐이다.
  }
}
