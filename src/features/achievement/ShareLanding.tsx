"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * 공유 링크를 받은 사람을 원래 화면으로 보낸다.
 *
 * 서버에서 redirect하지 않는 이유: 크롤러도 따라가 버려서 카드가 다시
 * 업적 페이지의 정적 카드로 돌아간다. 브라우저에서만 옮긴다.
 *
 * replace를 쓴다. 뒤로 가기가 이 중간 주소로 돌아오면 다시 앞으로 튕긴다.
 */
export function ShareLanding({ href }: { href: string }) {
  const router = useRouter();

  useEffect(() => {
    router.replace(href);
  }, [href, router]);

  return null;
}
