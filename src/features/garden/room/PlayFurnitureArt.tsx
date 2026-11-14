/** 정적인 원본 그림. 클릭 움직임은 RoomScene에서만 얹어 공유 그림은 고정한다. */
export function PlayFurnitureArt({ art, w, h }: { art: string; w: number; h: number }) {
  const ink = "#3a2f2a", wood = "#d39a5e", cream = "#fff3d6", blue = "#2f9bd8", red = "#d9574a";
  let body;
  switch (art) {
    case "play-musicbox": body = <><path d="M9 34v9m22-9v9" stroke={ink} strokeWidth="3" /><rect x="5" y="26" width="30" height="12" rx="2" fill={wood} stroke={ink} strokeWidth="2" /><ellipse cx="20" cy="26" rx="15" ry="4" fill={cream} stroke={ink} /><path d="M20 25V9m-12 6 12-9 12 9z" fill={red} stroke={ink} strokeWidth="1.5" /><path d="M12 16v8m16-8v8" stroke={blue} strokeWidth="3" /><circle cx="20" cy="5" r="3" fill="#ffd85c" /><path d="m35 30 4-2v7h-4" fill="none" stroke={ink} strokeWidth="2" /></>; break;
    case "play-chime": body = <><path d="M20 2v8m-12 2 12-4 12 4M10 12v16m10-18v23m10-21v16" fill="none" stroke={ink} strokeWidth="1.5" /><path d="M7 15h6v13H7zm10 2h6v16h-6zm10-2h6v13h-6z" fill="#ffd85c" stroke={ink} /><path d="M20 33v5l-4 5h8l-4-5" fill={blue} stroke={ink} /></>; break;
    case "voice-tv": body = <><path d="m13 4 7 6 8-8" fill="none" stroke={ink} strokeWidth="2" /><rect x="2" y="10" width="36" height="28" rx="3" fill={wood} stroke={ink} strokeWidth="2" /><rect x="6" y="14" width="23" height="20" rx="3" fill="#9fd8f2" stroke={ink} /><path d="m14 19 9 5-9 5z" fill={cream} /><circle cx="33" cy="18" r="2" fill={red} /><path d="M31 24h4m-4 4h4m-4 4h4M8 38v6m24-6v6" stroke={ink} strokeWidth="2" /></>; break;
    case "voice-mic": body = <><path d="M20 24v17m-9 2h18" stroke={ink} strokeWidth="3" /><rect x="13" y="4" width="14" height="23" rx="7" fill={blue} stroke={ink} strokeWidth="2" /><path d="M10 19v3q0 12 20 0v-3M16 10h8m-8 4h8m-8 4h8" fill="none" stroke={ink} strokeWidth="1.5" /><path d="m3 9 4 3m26 0 4-3m-5 11h6M2 20h6" stroke="#ffd85c" strokeWidth="2" /></>; break;
    default: return null;
  }
  return <g transform={`scale(${w/40} ${h/46})`}>{body}</g>;
}
