"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

/**
 * 홈에서 지지자 응원으로 가는 문 — 숫자와 단추만.
 *
 * ★ 응원 글은 싣지 않는다.
 *   홈은 근거가 붙은 자료를 보여 주는 화면이다. 사람이 쓴 한 줄을 여기 올리면 응원이
 *   업적과 같은 층에 선다. 그래서 "이번 주 몇 줄"과 들어가는 길만 둔다.
 *
 * ★ 파이어베이스는 연 뒤에 받는다.
 *   홈 번들에 Firestore를 싣지 않으려고, 숫자는 화면이 뜬 뒤 동적 import로 센다.
 *   못 세면 숫자 없이 문만 남는다.
 */
const WEEK = 7 * 86_400_000;

export function CheerHomeCard() {
  const [week, setWeek] = useState<number | null>(null);

  useEffect(() => {
    let alive = true;
    void Promise.all([import("@/lib/firebase/client"), import("@/lib/firebase/cheers")])
      .then(([client, cheers]) => {
        if (!client.firebaseConfigured) return null;
        return cheers.countCheerNotes(Date.now() - WEEK);
      })
      .then((c) => {
        if (alive && c) setWeek(c.week);
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  return (
    <Link
      href="/words?tab=cheers&from=home"
      className="mt-4 flex items-center justify-between gap-3 rounded-card border border-stone px-4 py-3.5 transition-colors hover:border-graphite"
    >
      <span className="min-w-0">
        <span className="block text-[15px] font-semibold leading-snug text-ink">지지자 응원</span>
        <span className="mt-1 block text-[12px] leading-relaxed text-smoke">
          {week === null
            ? "대통령께 마음을 한 줄로 전하는 자리예요. 최근 언행을 두고 남길 수 있어요."
            : week > 0
              ? `이번 주 ${week.toLocaleString()}줄이 모였어요. 최근 언행을 두고 한 줄 남겨 보세요.`
              : "이번 주 첫 한 줄을 남겨 주세요. 최근 언행을 두고 남길 수 있어요."}
        </span>
      </span>
      <span aria-hidden="true" className="shrink-0 text-[13px] text-ash">
        →
      </span>
    </Link>
  );
}
