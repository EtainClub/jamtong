import type { ReactNode } from "react";
import { lightstickOf } from "./lightsticks";
import { LightstickArt } from "./LightstickArt";

const C = { ink: "#3a2f2a", paper: "#fffdf6", wood: "#d39a5e", dark: "#9a6439", green: "#86c46d", leaf: "#3f8a4a", blue: "#2f9bd8", sky: "#9fd8f2", red: "#d9574a", yellow: "#ffd85c", pink: "#f5a3c0", cream: "#fff3d6" };
const shelf = <><rect x="3" y="37" width="34" height="4" fill={C.wood} /><path d="M8 41v4m24-4v4" stroke={C.dark} strokeWidth="3" /></>;
const table = <><rect x="2" y="31" width="36" height="5" rx="1" fill={C.wood} stroke={C.ink} strokeWidth="1.5" /><path d="M7 37v8m26-8v8" stroke={C.dark} strokeWidth="4" /></>;
const paw = <><ellipse cx="20" cy="25" rx="7" ry="5" /><circle cx="12" cy="17" r="3" /><circle cx="19" cy="14" r="3" /><circle cx="27" cy="17" r="3" /></>;

/** 직접 그린 40×46 정면 소품. 외부 이미지 없이 공유 미리보기에서도 같은 그림을 쓴다. */
export function StoryFurnitureArt({ art, w, h }: { art: string; w: number; h: number }) {
  if (lightstickOf(art)) return <LightstickArt art={art} w={w} h={h} />;
  let body: ReactNode;
  switch (art) {
    case "babi-mini":
      body = <><ellipse cx="20" cy="43" rx="15" ry="2" fill={C.dark} opacity=".18" /><path d="M29 31q10-9 7-1" fill="none" stroke={C.cream} strokeWidth="5" /><rect x="10" y="25" width="21" height="15" rx="6" fill={C.cream} stroke={C.ink} strokeWidth="1.5" /><path d="M13 36v7m15-7v7" stroke={C.cream} strokeWidth="5" /><path d="M8 13q-10 5-3 16l9-5m14-11q10 5 3 16l-8-5" fill={C.wood} stroke={C.ink} strokeWidth="1.5" /><path d="M10 10l5-3 5 2 6-1 5 6-2 13-9 4-11-4-2-9z" fill={C.cream} stroke={C.ink} strokeWidth="1.5" /><circle cx="14" cy="19" r="1.7" fill={C.ink} /><circle cx="25" cy="19" r="1.7" fill={C.ink} /><ellipse cx="20" cy="24" rx="2.4" ry="1.7" fill={C.ink} /><path d="M17 28q3 3 6 0" fill="none" stroke={C.ink} /><rect x="13" y="31" width="14" height="3" fill={C.red} /><circle cx="20" cy="35" r="2" fill={C.yellow} /></>;
      break;
    case "babi-bed":
      body = <><ellipse cx="20" cy="35" rx="18" ry="9" fill={C.pink} stroke={C.ink} strokeWidth="2" /><ellipse cx="20" cy="32" rx="14" ry="7" fill="#ffe1e6" /><g transform="translate(8 19) scale(.6)" fill={C.red}>{paw}</g><path d="M5 35v4m29-4v4" stroke={C.red} strokeWidth="2" /></>;
      break;
    case "babi-paw":
      body = <><path d="m15 6 5-4 5 4" stroke={C.ink} fill="none" /><rect x="4" y="7" width="32" height="34" rx="1" fill={C.wood} stroke={C.ink} strokeWidth="2" /><rect x="8" y="11" width="24" height="26" fill={C.paper} /><g fill={C.dark}>{paw}</g><path d="M15 33h10" stroke={C.pink} strokeWidth="2" /></>;
      break;
    case "babi-leash":
      body = <><rect x="6" y="6" width="28" height="6" fill={C.wood} stroke={C.ink} /><path d="M13 12v7q-6 9-3 16t13 2q5-7-1-15" fill="none" stroke={C.red} strokeWidth="3" /><path d="M22 17v-5m0 5h4v5h-4z" fill={C.yellow} stroke={C.ink} /><circle cx="29" cy="10" r="2" fill={C.ink} /></>;
      break;
    case "go-board":
      body = <>{table}<rect x="5" y="9" width="30" height="23" fill="#e8b967" stroke={C.ink} strokeWidth="1.5" />{[10, 15, 20, 25, 30].map((v) => <path key={v} d={`M${v} 12v17M8 ${v - 1}h24`} stroke={C.dark} strokeWidth=".6" />)}{[[15,14],[20,19],[25,24]].map(([x,y]) => <circle key={x} cx={x} cy={y} r="2.2" fill={C.ink} />)}{[[20,14],[15,24],[25,19]].map(([x,y]) => <circle key={x} cx={x} cy={y} r="2.2" fill={C.paper} stroke={C.dark} strokeWidth=".5" />)}</>;
      break;
    case "go-stones":
      body = <>{shelf}<path d="M4 25h14l-2 11H7z" fill={C.dark} stroke={C.ink} /><ellipse cx="11" cy="25" rx="7" ry="3" fill={C.wood} stroke={C.ink} /><path d="M22 25h14l-2 11H25z" fill={C.wood} stroke={C.ink} /><ellipse cx="29" cy="25" rx="7" ry="3" fill={C.dark} stroke={C.ink} />{[7,11,15].map((x) => <circle key={x} cx={x} cy="24" r="2.2" fill={C.ink} />)}{[25,29,33].map((x) => <circle key={x} cx={x} cy="24" r="2.2" fill={C.paper} />)}</>;
      break;
    case "hiking-pack":
      body = <><path d="M13 12V7q7-5 14 0v5" stroke={C.ink} fill="none" strokeWidth="2" /><rect x="7" y="11" width="27" height="32" rx="6" fill={C.leaf} stroke={C.ink} strokeWidth="2" /><rect x="6" y="8" width="29" height="7" rx="3" fill={C.sky} stroke={C.ink} /><rect x="11" y="26" width="19" height="13" rx="3" fill={C.green} stroke={C.ink} /><path d="M11 20h19m-12-5v10m8-10v10" stroke={C.cream} strokeWidth="2" /><rect x="3" y="25" width="5" height="13" fill={C.blue} /><rect x="33" y="24" width="5" height="13" fill={C.yellow} /></>;
      break;
    case "hiking-boots":
      body = <><path d="M4 18h11v11l8 6v8H3V29z" fill={C.dark} stroke={C.ink} strokeWidth="2" /><path d="M20 15h11v12l7 6v8H19V27z" fill={C.wood} stroke={C.ink} strokeWidth="2" /><path d="M4 39h18m-2-2h17" stroke={C.ink} strokeWidth="4" /><path d="m7 23 6 3-6 3 6 3m11-12 5 3-5 3 5 3" fill="none" stroke={C.yellow} strokeWidth="1.5" /></>;
      break;
    case "hiking-watch":
      body = <>{shelf}<rect x="15" y="4" width="10" height="31" rx="2" fill={C.ink} /><rect x="9" y="12" width="22" height="17" rx="4" fill="#596661" stroke={C.ink} strokeWidth="2" /><rect x="13" y="16" width="14" height="9" fill="#c8d5a6" /><path d="m15 22 4-4 3 4 3-2" stroke={C.leaf} fill="none" /><path d="M18 6h4m-4 27h4" stroke={C.cream} /></>;
      break;
    case "reading-books":
      body = <>{table}<rect x="7" y="25" width="27" height="5" fill={C.blue} stroke={C.ink} /><rect x="5" y="18" width="25" height="6" fill={C.red} stroke={C.ink} /><rect x="10" y="11" width="24" height="6" fill={C.green} stroke={C.ink} /><path d="M12 14h19M8 21h19m-17 7h21" stroke={C.paper} strokeWidth="2" /><path d="M25 11v11l3-2 3 2V11" fill={C.yellow} /></>;
      break;
    case "reading-shelf":
      body = <><rect x="3" y="4" width="34" height="39" fill={C.dark} stroke={C.ink} strokeWidth="2" /><rect x="6" y="7" width="28" height="32" fill={C.cream} />{[0,1].flatMap((row) => [0,1,2,3,4].map((i) => <rect key={`${row}-${i}`} x={8+i*5} y={10+row*16+(i%2)*2} width="4" height={11-(i%2)*2} fill={[C.blue,C.red,C.green,C.yellow,C.pink][(i+row)%5]} />))}<path d="M4 23h32M4 40h32" stroke={C.wood} strokeWidth="3" /></>;
      break;
    case "reading-light":
      body = <>{table}<path d="M24 30 20 17l8-8" stroke={C.ink} strokeWidth="2.5" fill="none" /><path d="m20 8 10-3 6 10-17 3z" fill={C.leaf} stroke={C.ink} strokeWidth="1.5" /><path d="m24 18-8 10h18l-3-12" fill={C.yellow} opacity=".25" /><path d="m5 25 8-2 6 2v6l-6-1-8 1z" fill={C.paper} stroke={C.ink} /><path d="M13 23v7" stroke={C.red} /><rect x="19" y="29" width="12" height="2" fill={C.leaf} /></>;
      break;
    case "fishing-rod":
      body = <><rect x="5" y="8" width="30" height="4" fill={C.wood} /><path d="M9 41 28 4" stroke={C.ink} strokeWidth="2" /><path d="M28 4q8 16 4 31" stroke={C.blue} fill="none" /><rect x="7" y="33" width="4" height="10" transform="rotate(25 9 38)" fill={C.dark} /><circle cx="15" cy="29" r="4" fill={C.wood} stroke={C.ink} /><ellipse cx="32" cy="35" rx="2" ry="5" fill={C.red} /><path d="M32 30v5" stroke={C.paper} strokeWidth="3" /></>;
      break;
    case "fishing-bag":
      body = <><rect x="7" y="6" width="13" height="37" rx="4" fill={C.blue} stroke={C.ink} strokeWidth="2" /><path d="M20 12q10 13 0 23M13 10v28" fill="none" stroke={C.ink} /><rect x="21" y="28" width="16" height="15" rx="2" fill={C.green} stroke={C.ink} /><path d="M21 33h16m-11-5v-4h7v4" fill="none" stroke={C.ink} /><rect x="28" y="32" width="3" height="4" fill={C.yellow} /></>;
      break;
    case "gukbap-table":
      body = <>{table}<ellipse cx="15" cy="29" rx="10" ry="2" fill={C.cream} /><path d="M5 20h20l-3 8H8z" fill={C.ink} /><ellipse cx="15" cy="20" rx="10" ry="3" fill="#bb6e3d" stroke={C.ink} /><path d="M10 20h3m5-1h3" stroke={C.green} strokeWidth="2" /><path d="M11 14q-3-3 0-6m7 6q-3-3 0-6" stroke={C.paper} strokeWidth="2" fill="none" /><path d="M29 17v12m4-12v12m3-12v12" stroke={C.dark} strokeWidth="1.2" /><circle cx="29" cy="16" r="2" fill={C.dark} /><ellipse cx="30" cy="29" rx="5" ry="2" fill={C.red} /></>;
      break;
    case "puer-tea":
      body = <>{table}<path d="M12 18h13l2 10H10z" fill={C.red} stroke={C.ink} /><ellipse cx="18" cy="18" rx="7" ry="2" fill={C.dark} /><circle cx="18" cy="15" r="2" fill={C.dark} /><path d="m12 23-7-5 2 8 5 1m14-7q9-2 6 6h-5" fill="none" stroke={C.red} strokeWidth="3" />{[5,29].map((x) => <g key={x}><path d={`M${x} 28h7l-1 3h-5z`} fill={C.cream} stroke={C.ink} /><path d={`M${x+1} 27h5`} stroke={C.dark} /></g>)}<path d="M18 10q-2-3 0-6" fill="none" stroke={C.paper} /></>;
      break;
    case "jade-inkstone":
      body = <>{table}<rect x="5" y="19" width="23" height="12" rx="4" fill={C.green} stroke={C.ink} strokeWidth="1.5" /><rect x="9" y="22" width="15" height="6" rx="2" fill={C.leaf} /><ellipse cx="16" cy="25" rx="5" ry="2" fill={C.ink} /><rect x="30" y="13" width="5" height="17" fill={C.ink} /><path d="M31 17h3m-3 4h3" stroke={C.yellow} /></>;
      break;
    case "calligraphy-brush":
      body = <><rect x="4" y="5" width="24" height="34" fill={C.paper} stroke={C.dark} strokeWidth="2" /><path d="M2 5h28M2 39h28" stroke={C.wood} strokeWidth="3" /><path d="m11 15 9-2-6 10 8 4m-13 3 8-3" stroke={C.ink} strokeWidth="2" fill="none" /><path d="M31 7v21" stroke={C.dark} strokeWidth="3" /><path d="m29 28 2 13 3-13" fill={C.ink} /><path d="M31 6V3" stroke={C.red} /></>;
      break;
    case "baseball-ball":
      body = <>{shelf}<rect x="6" y="8" width="28" height="28" fill={C.sky} fillOpacity=".2" stroke={C.blue} strokeWidth="1" /><circle cx="20" cy="23" r="10" fill={C.paper} stroke={C.ink} strokeWidth="1.5" /><path d="M13 15q8 8 0 16m14-16q-8 8 0 16" fill="none" stroke={C.red} strokeWidth="1.2" /><circle cx="20" cy="23" r="3" fill={C.yellow} stroke={C.dark} strokeWidth=".5" /><path d="m8 10 8 2m10 20 5 2" stroke={C.paper} strokeWidth="2" /></>;
      break;
    case "baseball-bat":
      body = <><rect x="3" y="11" width="34" height="23" rx="2" fill={C.dark} stroke={C.ink} /><path d="M9 30V17m22 13V17" stroke={C.cream} strokeWidth="2" /><path d="M5 22h11l11-5h7v10h-7l-11-4H5z" fill={C.wood} stroke={C.ink} /><path d="m22 21 2-2 1 4 3-3 2 3" fill="none" stroke={C.ink} strokeWidth=".8" /><path d="M6 20v5" stroke={C.red} strokeWidth="2" /></>;
      break;
    case "trout-aquarium":
      body = <>{table}<rect x="3" y="5" width="34" height="26" rx="2" fill={C.sky} fillOpacity=".65" stroke={C.blue} strokeWidth="1.5" /><path d="M5 27h30v3H5z" fill={C.cream} /><path d="M8 27q-4-9 0-13m1 9 4-5m18 9q4-9 0-14" fill="none" stroke={C.leaf} strokeWidth="2" /><path d="m13 17-5-4v9l5-3q10 9 19-1-9-9-19-1z" fill={C.green} stroke={C.ink} /><path d="M15 18h12" stroke={C.pink} strokeWidth="2" /><circle cx="27" cy="16" r="1" fill={C.ink} /><circle cx="32" cy="10" r="1.5" fill={C.paper} /><circle cx="29" cy="7" r="1" fill={C.paper} /><path d="M2 5h36" stroke={C.ink} strokeWidth="3" /></>;
      break;
    case "tennis-racket":
      body = <><rect x="5" y="7" width="30" height="4" fill={C.wood} /><ellipse cx="19" cy="17" rx="10" ry="13" fill={C.paper} stroke={C.blue} strokeWidth="3" />{[14,19,24].map((x) => <path key={x} d={`M${x} 7v20`} stroke={C.sky} />)}{[11,17,23].map((y) => <path key={y} d={`M10 ${y}h18`} stroke={C.sky} />)}<path d="m15 29 4 5 4-5m-4 5v9" fill="none" stroke={C.ink} strokeWidth="3" /><path d="M19 36v7" stroke={C.red} strokeWidth="5" /><circle cx="31" cy="34" r="6" fill={C.yellow} stroke={C.ink} /><path d="M29 29q-2 5 3 9" fill="none" stroke={C.paper} /></>;
      break;
    case "blog-baseball":
      body = <>{shelf}<circle cx="20" cy="24" r="12" fill={C.paper} stroke={C.ink} strokeWidth="1.5" /><path d="M12 15q9 9 0 18m16-18q-9 9 0 18" fill="none" stroke={C.red} strokeWidth="1.5" /><path d="m13 20 3-1m-2 8 3 1m10-8-3-1m2 8-3 1" stroke={C.red} /></>;
      break;
    case "soccer-ball":
      body = <><ellipse cx="20" cy="41" rx="18" ry="4" fill={C.green} stroke={C.leaf} /><circle cx="20" cy="25" r="15" fill={C.paper} stroke={C.ink} strokeWidth="1.5" /><path d="m20 18 7 5-3 8h-8l-3-8zM17 11l-4 5-6 1m22-3 1 7 5 2M7 30l7 1 3 8m11-2-3-7 6-4" fill={C.ink} stroke={C.ink} /><path d="m13 23-5-6m19 6 3-2m-10-3-3-7m-1 20-2 1m10-1 4 6" stroke={C.ink} /></>;
      break;
    case "blog-diary":
      body = <>{table}<path d="m5 12 27-4 3 20-27 3z" fill={C.paper} stroke={C.ink} /><path d="m4 9 27-4 3 20-27 4z" fill={C.pink} stroke={C.ink} strokeWidth="1.5" /><path d="m9 9 3 18m4-16 10-1m-9 4 8-1" stroke={C.paper} strokeWidth="1.5" /><path d="m22 19-4-3q-4-5 0-6 3 0 3 3 2-4 5-2 3 3-4 8z" fill={C.red} /><path d="M9 10h-5m6 6H5m6 6H6" stroke={C.dark} strokeWidth="2" /><path d="m29 26 2 9 2-3 3 2-3-9" fill={C.yellow} /></>;
      break;
    default:
      return null;
  }
  return <g transform={`scale(${w / 40} ${h / 46})`} shapeRendering="crispEdges">{body}</g>;
}
