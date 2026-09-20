/**
 * 지지자 응원 영상 벽.
 *
 * 업적 쇼츠(ShortsSection)와 같은 방식으로 튼다 — 영상은 유튜브에 두고 여기서는
 * 틀기만 하고, `youtube-nocookie.com`을 써서 재생 전에는 추적 쿠키를 심지 않는다.
 *
 * 다른 점은 근거다. 업적 쇼츠에는 주장마다 근거 단추가 붙지만 여기는 붙지
 * 않는다 — 붙일 근거가 없기 때문이다. 이것은 확인된 사실이 아니라 남이 만든
 * 응원이고, 그 차이를 단추 대신 안내 문구와 만든 사람 이름이 진다.
 *
 * 이 파일은 그리기만 한다. 코드에 박아 둔 영상인지 누가 올린 영상인지는
 * 여기서 가리지 않는다 — 둘을 다르게 그리면 올린 사람이 제 것을 덜 쳐진
 * 자리로 읽는다. 다를 것은 지울 수 있는가 하나뿐이고, 그건 단추로 드러난다.
 */

export interface CheerCard {
  key: string;
  youtubeId: string;
  /** 유튜브에 올라간 제목 그대로. 다듬는 것은 화면이 한다. */
  title: string;
  channel: string;
  channelUrl?: string | null;
  /** 지울 수 있는 사람에게만 준다. 없으면 단추가 나오지 않는다. */
  onRemove?: () => void;
}

/**
 * 제목 끝의 해시태그 꼬리를 뗀다.
 *
 * 제목 자체는 올린 사람 것이므로 자료에는 그대로 담아 둔다. 다만 화면에서는
 * "#이재명 #청와대 #…"이 제목보다 길어져 무슨 영상인지 안 보인다. 자르는
 * 자리는 **끝에 몰린 태그**뿐이고, 문장 가운데 있는 것은 건드리지 않는다.
 */
function trimHashtags(title: string): string {
  const cut = title.replace(/(?:\s*#[^\s#]+)+\s*$/u, "").trim();
  return cut.length > 0 ? cut : title;
}

function Frame({ card }: { card: CheerCard }) {
  const title = trimHashtags(card.title);

  return (
    <figure className="m-0">
      <div className="mx-auto w-full max-w-[300px]">
        <div className="relative aspect-[9/16] overflow-hidden rounded-card border border-stone bg-taupe">
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${card.youtubeId}?rel=0&modestbranding=1`}
            title={title}
            loading="lazy"
            allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="absolute inset-0 h-full w-full"
          />
        </div>
      </div>

      <figcaption className="mx-auto mt-3 w-full max-w-[300px]">
        <p className="text-[13.5px] font-semibold leading-snug text-ink">{title}</p>
        {/*
          * 만든 사람을 제목 아래 붙인다. 누가 만든 것인지 적지 않으면 우리가
          * 만든 것처럼 읽힌다 — 이 탭에서 그것이 가장 큰 오해다.
          */}
        <p className="mt-1 text-[12px] text-ash">
          {card.channelUrl ? (
            <a
              href={card.channelUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="underline decoration-stone underline-offset-2 hover:text-smoke"
            >
              {card.channel}
            </a>
          ) : (
            card.channel
          )}
        </p>

        {card.onRemove && (
          <button
            type="button"
            onClick={card.onRemove}
            className="mt-2 rounded-full border border-stone px-3 py-1 text-[11px] font-semibold text-ash transition-colors hover:border-burgundy hover:text-burgundy"
          >
            내리기
          </button>
        )}
      </figcaption>
    </figure>
  );
}

export function CheerWall({ cards }: { cards: CheerCard[] }) {
  if (cards.length === 0) {
    return (
      <p className="mt-6 rounded-card border border-stone px-5 py-6 text-center text-[13px] text-ash">
        아직 걸린 영상이 없습니다. 첫 번째로 올려 주세요.
      </p>
    );
  }

  return (
    <div className="mt-6 grid gap-8 sm:grid-cols-2">
      {cards.map((card) => (
        <Frame key={card.key} card={card} />
      ))}
    </div>
  );
}
