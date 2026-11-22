import { buildClip, clipKeys } from "@/features/garden/album/clipBuild";

/**
 * 사진첩 카드 자료(features/garden/album/clips.ts) — 언행·정책·책 한 건에 파일 하나. 빌드 때 굽는다.
 * 모두 사이트에 이미 공개된 콘텐츠라 누구나 받는다.
 */
export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return clipKeys().map((key) => ({ key }));
}

export async function GET(_request: Request, { params }: { params: Promise<{ key: string }> }) {
  const { key } = await params;
  const clip = buildClip(key);
  if (!clip) return Response.json({ error: "없는 자료예요." }, { status: 404 });
  return Response.json(clip, { headers: { "Cache-Control": "public, max-age=300" } });
}
