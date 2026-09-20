/**
 * 유튜브 영상의 제목과 채널을 알아 온다.
 *
 * ★ 올린 사람에게 제목을 받지 않는다.
 *   받으면 그건 그 사람이 붙인 이름이지 영상 제목이 아니다. 목록에 "이재명
 *   대통령 응원 영상"이라고 적혀 있는데 틀어 보면 다른 것이 나오는 일이
 *   그렇게 생긴다. 제목은 유튜브에 물어서 채운다.
 *
 * ★ 브라우저에서 바로 부르지 않고 여기를 거친다.
 *   유튜브 oembed는 지금 CORS를 열어 두지만 그건 남의 서비스 사정이고 언제
 *   거둘지 우리가 정하지 못한다. 그리고 여기를 지나면 같은 영상을 두 번째
 *   묻는 사람에게는 캐시가 답한다.
 */

const ID = /^[\w-]{11}$/;

export async function GET(request: Request) {
  const id = new URL(request.url).searchParams.get("id") ?? "";
  if (!ID.test(id)) {
    return Response.json({ error: "영상 주소를 알아보지 못했습니다." }, { status: 400 });
  }

  const target =
    "https://www.youtube.com/oembed?format=json&url=" +
    encodeURIComponent(`https://www.youtube.com/watch?v=${id}`);

  let res: Response;
  try {
    res = await fetch(target, { next: { revalidate: 86400 } });
  } catch {
    return Response.json({ error: "유튜브에 물어보지 못했습니다." }, { status: 502 });
  }

  /*
   * 없는 영상, 비공개, 퍼가기 금지가 모두 여기로 들어온다. 셋을 구분해서
   * 알려 주지 않는다 — 어느 쪽이든 올린 사람이 할 일은 같다.
   */
  if (!res.ok) {
    return Response.json(
      { error: "유튜브에서 찾을 수 없는 영상입니다. 비공개이거나 퍼가기가 막혀 있을 수 있습니다." },
      { status: 404 },
    );
  }

  const data = (await res.json()) as {
    title?: string;
    author_name?: string;
    author_url?: string;
  };

  if (!data.title || !data.author_name) {
    return Response.json({ error: "제목을 읽지 못했습니다." }, { status: 502 });
  }

  return Response.json(
    {
      youtubeId: id,
      title: data.title,
      channel: data.author_name,
      channelUrl: data.author_url ?? null,
    },
    { headers: { "cache-control": "public, max-age=86400" } },
  );
}
