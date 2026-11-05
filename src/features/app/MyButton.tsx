"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { useAuth } from "@/lib/firebase/auth";

/**
 * 상단 바의 MY 단추. 하단 탭의 MY 자리를 정원에 내주고 여기로 왔다.
 *
 * 구글로 연결한 계정이면 그 프로필 사진을, 아니면 사람 모양을 보인다.
 * 계정을 여기서 만들지 않는다 — 익명 계정은 필요한 화면(정원, 응원 등)이 만든다.
 */
export function MyButton() {
  const { user } = useAuth();
  const pathname = usePathname();
  const active = pathname.startsWith("/my");

  return (
    <Link
      href="/my"
      aria-label="MY"
      aria-current={active ? "page" : undefined}
      className={`grid h-8 w-8 shrink-0 place-items-center overflow-hidden rounded-full border transition-colors ${
        active ? "border-navy text-navy" : "border-stone text-ash hover:border-graphite hover:text-smoke"
      }`}
    >
      {user?.photoURL ? (
        // 외부(구글) 이미지라 next/image 설정을 늘리지 않고 그대로 싣는다. MyPanel과 같다.
        // eslint-disable-next-line @next/next/no-img-element
        <img src={user.photoURL} alt="" referrerPolicy="no-referrer" className="h-full w-full object-cover" />
      ) : (
        <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" aria-hidden="true">
          <circle cx="12" cy="8.5" r="3.5" />
          <path d="M5 20c.8-3.5 3.6-5.5 7-5.5s6.2 2 7 5.5" />
        </svg>
      )}
    </Link>
  );
}
