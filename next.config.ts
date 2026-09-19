import { execSync } from "node:child_process";
import { readFileSync } from "node:fs";

import type { NextConfig } from "next";

/**
 * 빌드 신원.
 *
 * 웹앱에는 "설치된 버전"이 없다. 사용자는 늘 배포된 것을 받는다.
 * 그래도 버전이 필요한 이유는 둘이다.
 *   1. "사이트가 이상해요"를 받았을 때 어느 빌드인지 특정해야 한다
 *   2. 오래 열어 둔 탭이 옛 코드를 붙들고 있을 때 알려 줘야 한다
 *
 * 그래서 사람이 읽는 semver(package.json)와 기계가 구분하는 커밋 해시를
 * 함께 굽는다. semver는 이정표에서만 올리고(`pnpm release`), 해시는 배포마다
 * 저절로 달라진다. 배포할 때마다 package.json을 건드릴 필요가 없다.
 */
function buildInfo() {
  const pkg = JSON.parse(readFileSync("./package.json", "utf8")) as { version: string };

  const git = (cmd: string) => {
    try {
      return execSync(cmd, { stdio: ["ignore", "pipe", "ignore"] }).toString().trim();
    } catch {
      return "";
    }
  };

  // App Hosting은 저장소를 체크아웃해 빌드하므로 대개 .git이 있다.
  // 없더라도 배포가 깨지면 안 되므로 전부 빈 값을 허용한다.
  const commit = git("git rev-parse --short HEAD");
  const committedAt = git("git log -1 --format=%cI");

  return {
    NEXT_PUBLIC_APP_VERSION: pkg.version,
    NEXT_PUBLIC_BUILD_COMMIT: commit,
    NEXT_PUBLIC_BUILD_COMMITTED_AT: committedAt,
    NEXT_PUBLIC_BUILD_AT: new Date().toISOString(),
  };
}

const nextConfig: NextConfig = {
  env: buildInfo(),

  /**
   * /story/… 로 나간 링크를 살려 둔다.
   * 이름을 바꾼 것은 우리 사정이지 이미 공유된 주소의 사정이 아니다.
   */
  async redirects() {
    return [
      { source: "/story/:slug", destination: "/achievement/:slug", permanent: true },
    ];
  },
};

export default nextConfig;
