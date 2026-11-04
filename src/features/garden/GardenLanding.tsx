"use client";

import { useEffect } from "react";

/**
 * 정원 자랑 링크(/g/<id>)를 받은 사람을 친구 정원으로 보낸다.
 *
 * ShareLanding(router.replace)과 달리 페이지를 새로 연다. 정원은 처음 그릴 때
 * 주소의 ?visit=를 읽는데, 클라이언트 이동은 주소가 바뀌기 전에 화면을 그려서
 * 친구 정원 대신 내 텃밭이 열린다. replace라 뒤로 가기가 이 중간 주소로 돌아오지 않는다.
 */
export function GardenLanding({ href }: { href: string }) {
  useEffect(() => {
    window.location.replace(href);
  }, [href]);
  return null;
}
