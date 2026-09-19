"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { formatVersion } from "@/lib/build-info";

/**
 * 상단 바 메뉴.
 *
 * 하단 탭이 주 이동 수단이므로 여기에는 자주 가지 않는 곳만 둔다.
 * 버전을 메뉴 바닥에 적는 이유: "사이트가 이상해요"를 받았을 때 어느 빌드인지
 * 물어볼 자리가 필요하다.
 */

const LINKS = [
  { href: "/", label: "홈" },
  { href: "/explore", label: "둘러보기" },
  { href: "/about", label: "이 사이트에 대하여" },
];

export function AppMenu() {
  const [open, setOpen] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!boxRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={boxRef} className="relative">
      <button
        type="button"
        aria-label={open ? "메뉴 닫기" : "메뉴 열기"}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="grid h-9 w-9 place-items-center rounded-full text-smoke transition-colors hover:bg-taupe"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
          <path
            d={open ? "M6 6l12 12M18 6L6 18" : "M4 7h16M4 12h16M4 17h16"}
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 top-11 w-60 overflow-hidden rounded-card border border-stone bg-eggshell shadow-lg shadow-ink/10">
          <ul className="py-1.5">
            {LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block px-4 py-2.5 text-sm text-graphite transition-colors hover:bg-taupe hover:text-ink"
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <a
                href="https://github.com/EtainClub/jamtong"
                target="_blank"
                rel="noreferrer"
                onClick={() => setOpen(false)}
                className="block px-4 py-2.5 text-sm text-graphite transition-colors hover:bg-taupe hover:text-ink"
              >
                소스 코드 (GitHub)
              </a>
            </li>
          </ul>
          <div className="border-t border-stone px-4 py-2.5">
            <span className="tabular font-mono text-[11px] text-ash">v{formatVersion()}</span>
          </div>
        </div>
      )}
    </div>
  );
}
