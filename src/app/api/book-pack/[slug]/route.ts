import { ROOM_BOOKS } from "@/features/garden/room/books";
import { bookPack } from "@/lib/books/pack";

/**
 * 특별한 책 꾸러미(lib/books/pack.ts) — 방의 독서대가 받는다. 빌드 때 책마다 한 번 굽는다.
 * 사이트의 /books/<slug>에 이미 공개된 요약이라 누구나 받는다.
 */
export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return ROOM_BOOKS.map((b) => ({ slug: b.slug }));
}

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const pack = bookPack(slug);
  if (!pack) return Response.json({ error: "없는 책이에요." }, { status: 404 });
  return Response.json(pack);
}
