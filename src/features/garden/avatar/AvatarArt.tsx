import { avatarDiffRects, avatarRects, colorPaths, type Face, type Look, type Rect } from "./compose";
import { DOT, GRID_H, GRID_W, type Pose } from "./sprites";

/**
 * 꼬마 그림. RoomSvg(방·공유 카드)와 옷 갈아입기·상점 미리보기가 같은 것을 쓴다. 설계는 docs/garden-avatar.md §4.2.
 *
 * ★ 눈 깜빡임은 눈 둘레의 다른 칸만 겹쳐 CSS로 잠깐 보인다. 둘째 장에는 opacity="0" 속성을 둔다 —
 *   CSS가 없는 곳(공유 카드의 SVG 이미지, 움직임 줄이기)에서는 첫 장만 보인다.
 */

export const AVATAR_W = GRID_W * DOT;
export const AVATAR_H = GRID_H * DOT;

/** 색마다 path 하나 — 두 배 판은 사각형이 수백 개라 DOM·공유 카드가 무거워지지 않게. */
function Rects({ rects }: { rects: Rect[] }) {
  return (
    <>
      {colorPaths(rects).map(([fill, d]) => (
        <path key={fill} d={d} fill={fill} />
      ))}
    </>
  );
}

/** 꼬마 한 명. (0,0)에서 40×48로 그린다 — 자리 옮기기는 부르는 쪽의 transform. */
export function AvatarFigure({ look, pose, face, blink = false }: { look: Look; pose: Pose; face: Face; blink?: boolean }) {
  const canBlink = blink && face.eyes !== "closed";
  return (
    <g shapeRendering="crispEdges">
      <Rects rects={avatarRects(look, pose, face)} />
      {canBlink && (
        <g className="garden-avatar-blink" opacity="0">
          <Rects rects={avatarDiffRects(look, pose, face, { ...face, eyes: "closed" })} />
        </g>
      )}
    </g>
  );
}

/** 따로 선 꼬마 그림(옷 갈아입기·상점 카드). */
export function AvatarIcon({ look, pose = "stand", face, size = 64, label }: { look: Look; pose?: Pose; face: Face; size?: number; label?: string }) {
  return (
    <svg
      viewBox={`0 0 ${AVATAR_W} ${AVATAR_H}`}
      width={(size * AVATAR_W) / AVATAR_H}
      height={size}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      className="garden-avatar-icon"
    >
      <AvatarFigure look={look} pose={pose} face={face} />
    </svg>
  );
}
