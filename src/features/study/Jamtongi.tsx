/**
 * 잼통이 — 잼공의 길잡이. 둥근 유리 잼 병, 호박색 잼, 크림색 뚜껑, 두 잎 새싹, 점 눈.
 * Codex(GPT) 그림이 들어오기 전까지 쓰는 코드 그림이다(docs/daily-study.md §9). 꾸밈이라 스크린리더에는 숨긴다.
 */
export type JamMood = "smile" | "cheer" | "think" | "sleep";

const MOUTH: Record<JamMood, React.ReactNode> = {
  smile: <path d="M27 47 Q32 52 37 47" stroke="#3a2412" strokeWidth="2.2" fill="none" strokeLinecap="round" />,
  cheer: <path d="M26 46 Q32 55 38 46 Z" fill="#3a2412" />,
  think: <path d="M28 49 L36 48" stroke="#3a2412" strokeWidth="2.2" strokeLinecap="round" />,
  sleep: <path d="M28 48 Q32 50 36 48" stroke="#3a2412" strokeWidth="2" fill="none" strokeLinecap="round" />,
};

export function Jamtongi({ mood = "smile", size = 56, hop = false }: { mood?: JamMood; size?: number; hop?: boolean }) {
  return (
    <svg
      width={size}
      height={size * 1.15}
      viewBox="0 0 64 74"
      aria-hidden="true"
      focusable="false"
      className={`shrink-0 ${hop ? "jt-hop" : ""}`}
    >
      <path d="M32 12 C26 4 18 5 17 8 C22 12 28 13 32 12 Z" fill="#5aa046" />
      <path d="M32 12 C38 3 47 4 48 7 C43 12 36 13 32 12 Z" fill="#6cb653" />
      <path d="M32 12 V17" stroke="#4a8a3a" strokeWidth="2" />
      <rect x="13" y="16" width="38" height="9" rx="3" fill="#f3e6c8" stroke="#c9b48a" strokeWidth="1.2" />
      <path d="M12 26 h40 a4 4 0 0 1 4 4 v28 a12 12 0 0 1 -12 12 h-24 a12 12 0 0 1 -12 -12 v-28 a4 4 0 0 1 4 -4 z" fill="#ffffffb0" stroke="#b9c9c3" strokeWidth="1.4" />
      <path d="M10 37 Q20 33 32 36 T54 35 V58 a12 12 0 0 1 -12 12 h-20 a12 12 0 0 1 -12 -12 z" fill="#e8892b" />
      <path d="M20 36 q1 6 -1 8" stroke="#f6b26b" strokeWidth="2.4" fill="none" strokeLinecap="round" />
      {mood === "sleep" ? (
        <path d="M22 40 q3 2 6 0 M36 40 q3 2 6 0" stroke="#3a2412" strokeWidth="2" fill="none" strokeLinecap="round" />
      ) : (
        <>
          <circle cx="25" cy="40" r="2.6" fill="#3a2412" />
          <circle cx="39" cy="40" r="2.6" fill="#3a2412" />
        </>
      )}
      {MOUTH[mood]}
      <circle cx="20" cy="46" r="2.4" fill="#f7a59a" opacity=".7" />
      <circle cx="44" cy="46" r="2.4" fill="#f7a59a" opacity=".7" />
      <path d="M18 70 v3 M46 70 v3" stroke="#b9c9c3" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

export function Say({ mood = "smile", size = 52, children }: { mood?: JamMood; size?: number; children: React.ReactNode }) {
  return (
    <div className="flex items-end gap-2.5">
      <Jamtongi mood={mood} size={size} />
      <div className="st-bubble">{children}</div>
    </div>
  );
}
