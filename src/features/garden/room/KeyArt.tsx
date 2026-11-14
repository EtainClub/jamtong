import { faceToPaths } from "./keyboard";

/**
 * 키 그림 — 12×12 도트를 또렷하게(crispEdges). 1칸 = 1단위. 색마다 path 하나.
 * 방 그림 안에서는 x·y·size로 놓는다(RoomArt의 키보드). 시트의 키캡은 CSS가 크기를 정한다.
 */
export function KeyFace({ face, x, y, size, className }: { face: string; x?: number; y?: number; size?: number; className?: string }) {
  const paths = faceToPaths(face);
  return (
    <svg
      viewBox="0 0 12 12"
      x={x}
      y={y}
      width={size}
      height={size}
      shapeRendering="crispEdges"
      aria-hidden="true"
      className={className}
    >
      {paths.map((p) => (
        <path key={p.color} d={p.d} fill={p.color} />
      ))}
    </svg>
  );
}
