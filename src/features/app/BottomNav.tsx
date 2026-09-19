"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/**
 * 하단 탭 바.
 *
 * 모바일 우선 제품이므로 주 이동 수단은 하단에 둔다. 엄지가 닿는 자리다.
 *
 * 아직 만들지 않은 탭은 비활성으로 두고 "준비 중"이라고 쓴다. 눌리는데
 * 아무 일도 일어나지 않는 탭이 가장 나쁘다.
 */

interface Tab {
  href: string;
  label: string;
  icon: React.ReactNode;
  ready: boolean;
  /**
   * 이 탭이 제 것으로 치는 경로들.
   *
   * 업적 상세(/achievement/...)는 주소가 /explore로 시작하지 않지만 업적 탭의
   * 자식이다. 적어 두지 않으면 상세에서 어느 탭에 있는지 표시가 사라진다.
   */
  owns?: string[];
}

const TABS: Tab[] = [
  { href: "/", label: "홈", ready: true, icon: <HomeIcon /> },
  { href: "/timeline", label: "타임라인", ready: true, icon: <TimelineIcon /> },
  { href: "/explore", label: "업적", ready: true, owns: ["/achievement"], icon: <ExploreIcon /> },
  { href: "/ask", label: "AI에게 묻기", ready: false, icon: <AskIcon /> },
  { href: "/my", label: "MY", ready: false, icon: <MyIcon /> },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="주요 메뉴"
      className="sticky bottom-0 z-40 border-t border-stone bg-canvas/95 backdrop-blur"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <ul className="mx-auto flex max-w-[560px] items-stretch">
        {TABS.map((tab) => {
          const active =
            tab.href === "/"
              ? pathname === "/"
              : pathname.startsWith(tab.href) ||
                (tab.owns?.some((p) => pathname.startsWith(p)) ?? false);

          if (!tab.ready) {
            // 흐리게만 두면 모바일에서는 왜 눌리지 않는지 알 길이 없다 —
            // hover도 title도 없다. 글자로 적는다.
            return (
              <li key={tab.href} className="flex-1">
                <span
                  aria-disabled="true"
                  className="flex cursor-not-allowed flex-col items-center gap-0.5 py-2 text-ash/45"
                >
                  {tab.icon}
                  <span className="text-[10px] font-medium">{tab.label}</span>
                  <span className="text-[9px] font-medium text-ash/70">준비 중</span>
                </span>
              </li>
            );
          }

          return (
            <li key={tab.href} className="flex-1">
              <Link
                href={tab.href}
                aria-current={active ? "page" : undefined}
                className={`flex flex-col items-center gap-0.5 py-2 transition-colors ${
                  active ? "text-navy" : "text-ash hover:text-smoke"
                }`}
              >
                {tab.icon}
                <span className="text-[10px] font-medium">{tab.label}</span>
                <span aria-hidden="true" className="text-[9px] leading-none">
                  &nbsp;
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

const iconProps = {
  width: 22,
  height: 22,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.7,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

function HomeIcon() {
  return (
    <svg {...iconProps}>
      <path d="M3 10.5 12 3l9 7.5" />
      <path d="M5.5 9.5V20h13V9.5" />
    </svg>
  );
}

function TimelineIcon() {
  return (
    <svg {...iconProps}>
      <path d="M4 12h16" />
      <circle cx="8" cy="12" r="2.2" />
      <circle cx="16" cy="12" r="2.2" />
      <path d="M8 7V5M16 19v-2" />
    </svg>
  );
}

function ExploreIcon() {
  return (
    <svg {...iconProps}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="m15 9-2 4.5L8.5 15l2-4.5z" />
    </svg>
  );
}

function AskIcon() {
  return (
    <svg {...iconProps}>
      <path d="M20 12a8 8 0 1 1-3.2-6.4" />
      <path d="M12 16v-.5c0-1 .6-1.6 1.4-2.1.8-.5 1.3-1 1.3-1.9a2.7 2.7 0 0 0-5.4-.1" />
      <circle cx="12" cy="19" r=".6" fill="currentColor" />
    </svg>
  );
}

function MyIcon() {
  return (
    <svg {...iconProps}>
      <circle cx="12" cy="8.5" r="3.5" />
      <path d="M5 20c.8-3.5 3.6-5.5 7-5.5s6.2 2 7 5.5" />
    </svg>
  );
}
