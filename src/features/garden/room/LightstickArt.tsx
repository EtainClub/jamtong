import { lightstickOf } from "./lightsticks";

/** 받침까지 포함한 40×46 소품. SVG 필터·중복 id 없이 공유 이미지에도 동일하게 표시. */
export function LightstickArt({ art, w, h }: { art: string; w: number; h: number }) {
  const l = lightstickOf(art);
  if (!l) return null;
  const shape = l.shape === "orb" ? <circle cx="20" cy="15" r="10" />
    : l.shape === "heart" ? <path d="M20 26 8 15C0 4 15 0 20 9 25 0 40 4 32 15Z" />
    : l.shape === "star" ? <path d="m20 2 4 8 10 2-7 7 2 10-9-5-9 5 2-10-7-7 10-2Z" />
    : l.shape === "crystal" ? <path d="m20 2 12 9-4 14H12L8 11Z" />
    : l.shape === "flower" ? <path d="M20 9C7-6 0 14 11 17-2 28 18 35 20 24 22 35 42 28 29 17 40 14 33-6 20 9Z" />
    : <path d="M6 16Q13 1 20 12T34 8V21Q27 34 20 23T6 28Z" />;
  return <g transform={`scale(${w / 40} ${h / 46})`}>
    <ellipse cx="20" cy="43" rx="14" ry="2" fill="#342b45" opacity=".18" />
    <circle cx="20" cy="16" r="17" fill={l.color} opacity=".13" />
    <path d="M16 23h8v17h-8z" fill="#fff8e9" stroke="#45415a" strokeWidth="1.5" />
    <path d="M17 30h6m-6 4h6" stroke={l.color} strokeWidth="2" />
    <g fill={l.color} stroke="#45415a" strokeWidth="1.5" strokeLinejoin="round">{shape}</g>
    {l.shape === "crystal" ? ["#ff929a", "#ffda70", "#8de0ac", "#80cfff", "#d5abff"].map((c, i) => <path key={c} d={`M${11 + i * 4} 13v9`} stroke={c} strokeWidth="3" />)
      : <path d="m15 11 3-3m-4 8 2-2" stroke="#fffdf5" strokeWidth="2.5" strokeLinecap="round" />}
    {l.shape === "flower" && <circle cx="20" cy="17" r="4" fill="#ffe269" stroke="#45415a" />}
    <circle cx="20" cy="37" r="1.5" fill={l.color} />
    <path d="M10 41h20l2 3H8Z" fill="#45415a" />
    <path d="M4 6v5m-2-2h4m29 17v5m-2-2h4" stroke={l.color} strokeWidth="1.5" />
  </g>;
}
