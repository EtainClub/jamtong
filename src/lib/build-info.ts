/**
 * 빌드 신원을 한 곳에서 읽는다. 값은 next.config.ts가 빌드 때 구워 넣는다.
 *
 * 서버와 클라이언트가 같은 값을 본다 — 클라이언트 번들에 박힌 값과 서버가
 * 들고 있는 값을 비교해야 "탭이 옛 코드를 붙들고 있다"를 알 수 있다.
 */

export interface BuildInfo {
  version: string;
  commit: string;
  committedAt: string;
  builtAt: string;
  /** 이 빌드를 유일하게 가리키는 값. 비교는 늘 이걸로 한다. */
  id: string;
}

const version = process.env.NEXT_PUBLIC_APP_VERSION ?? "0.0.0";
const commit = process.env.NEXT_PUBLIC_BUILD_COMMIT ?? "";
const committedAt = process.env.NEXT_PUBLIC_BUILD_COMMITTED_AT ?? "";
const builtAt = process.env.NEXT_PUBLIC_BUILD_AT ?? "";

export const BUILD: BuildInfo = {
  version,
  commit,
  committedAt,
  builtAt,
  // 해시를 못 구한 환경에서도 빌드 시각으로 구분된다.
  id: commit ? `${version}+${commit}` : `${version}+${builtAt}`,
};

/** 화면에 적는 형태. "0.2.0 (8557f36)" */
export function formatVersion(info: BuildInfo = BUILD): string {
  return info.commit ? `${info.version} (${info.commit})` : info.version;
}
