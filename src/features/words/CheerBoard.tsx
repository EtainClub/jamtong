"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import type { CheerVideo } from "@/content/cheers/schema";
import { useAuth } from "@/lib/firebase/auth";
import {
  NOTE_MAX,
  deleteCheerNote,
  deleteCheerVideo,
  loadMyNoteAgrees,
  parseYoutubeId,
  postCheerNote,
  postCheerVideo,
  toggleNoteAgree,
  watchCheerNotes,
  watchCheerVideos,
  type CheerNote,
  type SubmittedVideo,
} from "@/lib/firebase/cheers";
import { checkAdmin } from "@/lib/firebase/feedback";
import { CheerWall, type CheerCard } from "./CheerWall";

/**
 * 지지자 응원 — 영상과 한 줄.
 *
 * ★ 영상이 위, 한 줄이 아래다.
 *   둘 다 처음에는 비어 있다. 영상은 운영자가 몇 편 걸어 두면 바로 차지만
 *   글판은 아무도 첫 번째가 되고 싶어 하지 않는다. 영상이 바닥을 깔아야
 *   "여기는 사람이 있는 자리"로 읽히고, 그 아래 한 줄 칸이 눌린다.
 *
 * ★ 영상은 씨앗과 올라온 것을 한 벽에 섞는다.
 *   코드에 박아 둔 것(seed)과 사람들이 올린 것을 따로 늘어놓으면 "공식"과
 *   "그 밖"이 생긴다. 이 탭에 공식은 없다. 전부 남이 만든 영상이다.
 *
 * ★ 로그인 화면을 먼저 들이밀지 않는다.
 *   나머지 화면과 같게 익명으로 시작한다(ensureUser). 올리기를 누른 순간
 *   계정이 생기고, 그래서 제 것을 도로 내릴 수 있다.
 */
export function CheerBoard({ seed }: { seed: CheerVideo[] }) {
  const { user, ready, configured, ensureUser } = useAuth();
  const uid = user?.uid ?? null;

  const [videos, setVideos] = useState<SubmittedVideo[]>([]);
  const [notes, setNotes] = useState<CheerNote[]>([]);
  const [agreed, setAgreed] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);

  /*
   * 운영자인지. 피드백 게시판과 같은 이유로 "어느 uid가 확인됐나"를 담고
   * 지금 uid와 견준다 — 이펙트 안에서 false로 되돌리면 React Compiler가 막는다.
   */
  const [adminUid, setAdminUid] = useState<string | null>(null);
  const admin = adminUid !== null && adminUid === uid;

  useEffect(() => {
    if (!configured) return;
    return watchCheerVideos(uid, setVideos, setError);
  }, [uid, configured]);

  useEffect(() => {
    if (!configured) return;
    return watchCheerNotes(
      uid,
      (next) => {
        setNotes(next);
        setLoaded(true);
        setError(null);
      },
      (message) => {
        setError(message);
        setLoaded(true);
      },
    );
  }, [uid, configured]);

  useEffect(() => {
    if (!uid || notes.length === 0) return;
    let alive = true;
    loadMyNoteAgrees(
      uid,
      notes.map((n) => n.id),
    ).then((set) => {
      if (alive) setAgreed(set);
    });
    return () => {
      alive = false;
    };
  }, [uid, notes]);

  useEffect(() => {
    if (!uid) return;
    let alive = true;
    checkAdmin(uid).then((is) => {
      if (alive && is) setAdminUid(uid);
    });
    return () => {
      alive = false;
    };
  }, [uid]);

  const seedIds = useMemo(() => new Set(seed.map((v) => v.youtubeId)), [seed]);

  /*
   * 한 벽에 붙일 카드.
   *
   * 씨앗이 먼저고 올라온 것이 뒤다 — 올라온 쪽은 최신순이라 자리가 계속
   * 바뀌는데, 위에 두면 탭을 열 때마다 다른 영상이 첫 칸에 온다.
   *
   * 씨앗과 같은 영상이 올라와 있으면 올라온 쪽을 버린다. 저장소는 제
   * 컬렉션 안의 겹침만 막을 수 있고 코드에 박힌 것까지는 모른다.
   */
  const cards = useMemo<CheerCard[]>(() => {
    const fromSeed: CheerCard[] = seed.map((video) => ({
      key: `seed:${video.id}`,
      youtubeId: video.youtubeId,
      title: video.title,
      channel: video.channel,
      channelUrl: video.channelUrl,
    }));

    const fromUsers: CheerCard[] = videos
      .filter((video) => !seedIds.has(video.youtubeId))
      .map((video) => ({
        key: `up:${video.youtubeId}`,
        youtubeId: video.youtubeId,
        title: video.title,
        channel: video.channel,
        channelUrl: video.channelUrl,
        onRemove:
          video.mine || admin
            ? () => {
                deleteCheerVideo(video.youtubeId).catch((e) =>
                  setError(e instanceof Error ? e.message : "내리지 못했습니다."),
                );
              }
            : undefined,
      }));

    return [...fromSeed, ...fromUsers];
  }, [seed, seedIds, videos, admin]);

  const onAgree = useCallback(
    async (note: CheerNote) => {
      const account = await ensureUser();
      if (!account) return;
      try {
        await toggleNoteAgree(account.uid, note.id, agreed.has(note.id));
        setAgreed((prev) => {
          const next = new Set(prev);
          if (next.has(note.id)) next.delete(note.id);
          else next.add(note.id);
          return next;
        });
      } catch (e) {
        setError(e instanceof Error ? e.message : "누르지 못했습니다.");
      }
    },
    [agreed, ensureUser],
  );

  /*
   * 파이어베이스가 없는 환경에서도 씨앗 영상은 보인다. 화면이 통째로
   * 사라지면 설정 문제가 콘텐츠 문제로 보인다.
   */
  if (!configured) {
    return (
      <>
        <CheerWall cards={cards} />
        <p className="mt-6 rounded-card border border-stone bg-taupe px-5 py-4 text-[13px] leading-relaxed text-smoke">
          파이어베이스 설정이 없어 올리기와 한 줄 응원은 쓸 수 없습니다.
        </p>
      </>
    );
  }

  return (
    <>
      {error && (
        <p className="mt-4 rounded-card border border-burgundy/30 bg-burgundy-tint/40 px-4 py-3 text-[13px] leading-relaxed text-burgundy">
          {error}
        </p>
      )}

      {admin && (
        <p className="mt-4 rounded-card border border-navy/30 bg-navy-tint/50 px-4 py-3 text-[12px] leading-relaxed text-navy">
          운영자로 보고 있습니다. 영상과 응원을 내릴 수 있습니다.
        </p>
      )}

      <CheerWall cards={cards} />

      <VideoComposer
        known={new Set([...seedIds, ...videos.map((v) => v.youtubeId)])}
        onError={setError}
        onDone={() => setError(null)}
      />

      <div className="mt-10 border-t border-stone pt-7">
        <div className="flex items-baseline justify-between gap-3">
          <h2 className="text-[15px] font-bold text-ink">한 줄 응원</h2>
          <span className="tabular text-[11px] text-ash">
            {loaded ? `${notes.length}개` : "불러오는 중"}
          </span>
        </div>
        <p className="mt-1.5 text-[12px] leading-relaxed text-ash">
          {NOTE_MAX}자까지, 한 줄입니다. 짧게 쓰게 해 둔 것이지 실수가 아닙니다 —
          여기는 응원을 남기는 자리고, 논쟁하는 자리가 아닙니다. 남에 대한
          이야기와 개인정보는 운영자가 지웁니다.
        </p>

        <NoteComposer onError={setError} onDone={() => setError(null)} />

        {loaded && notes.length === 0 && !error && (
          <p className="mt-4 rounded-card border border-stone px-5 py-6 text-center text-[13px] text-ash">
            아직 아무도 남기지 않았습니다. 첫 번째가 되어 주세요.
          </p>
        )}

        <ul className="mt-4 grid gap-2.5 sm:grid-cols-2">
          {notes.map((note) => (
            <li key={note.id}>
              <NoteCard
                note={note}
                agreed={agreed.has(note.id)}
                admin={admin}
                ready={ready}
                onAgree={() => onAgree(note)}
                onError={setError}
              />
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

/**
 * 영상 올리기.
 *
 * 주소를 받고 **먼저 틀어 보여 준 뒤에** 올린다. 붙여넣기 한 번으로 바로
 * 올라가면 잘못 복사한 영상이 남의 응원판에 걸리고, 올린 사람은 그걸 목록에서
 * 보고서야 안다. 제목과 채널도 이때 유튜브에서 받아 채운다 — 우리가 짓지도,
 * 올린 사람에게 받지도 않는다.
 */
function VideoComposer({
  known,
  onDone,
  onError,
}: {
  known: Set<string>;
  onDone: () => void;
  onError: (message: string) => void;
}) {
  const { ensureUser } = useAuth();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [found, setFound] = useState<{
    youtubeId: string;
    title: string;
    channel: string;
    channelUrl: string | null;
  } | null>(null);
  const [busy, setBusy] = useState(false);

  const reset = () => {
    setInput("");
    setFound(null);
    setOpen(false);
  };

  const look = async () => {
    const id = parseYoutubeId(input);
    if (!id) {
      onError("유튜브 주소가 아닙니다. 영상 주소를 그대로 붙여넣어 주세요.");
      return;
    }
    if (known.has(id)) {
      onError("이미 올라와 있는 영상입니다.");
      return;
    }

    setBusy(true);
    try {
      const res = await fetch(`/api/youtube?id=${id}`);
      const data = (await res.json()) as {
        error?: string;
        title?: string;
        channel?: string;
        channelUrl?: string | null;
      };
      if (!res.ok || !data.title || !data.channel) {
        throw new Error(data.error ?? "영상을 찾지 못했습니다.");
      }
      setFound({
        youtubeId: id,
        title: data.title,
        channel: data.channel,
        channelUrl: data.channelUrl ?? null,
      });
      onDone();
    } catch (e) {
      onError(e instanceof Error ? e.message : "영상을 찾지 못했습니다.");
    } finally {
      setBusy(false);
    }
  };

  const submit = async () => {
    if (!found) return;
    setBusy(true);
    try {
      const account = await ensureUser();
      if (!account) throw new Error("로그인을 준비하지 못했습니다.");
      await postCheerVideo(account.uid, found);
      reset();
      onDone();
    } catch (e) {
      onError(e instanceof Error ? e.message : "올리지 못했습니다.");
    } finally {
      setBusy(false);
    }
  };

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mt-8 flex w-full items-center justify-center gap-2 rounded-card border border-stone bg-taupe px-5 py-3.5 text-sm font-semibold text-navy transition-colors hover:border-graphite"
      >
        응원 영상 올리기
        <span aria-hidden="true">+</span>
      </button>
    );
  }

  return (
    <div className="mt-8 rounded-card border border-stone bg-taupe px-5 py-4">
      <label htmlFor="cheer-url" className="text-[12px] font-semibold text-smoke">
        유튜브 주소
      </label>
      <div className="mt-2 flex gap-2">
        <input
          id="cheer-url"
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            setFound(null);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              void look();
            }
          }}
          placeholder="https://youtube.com/shorts/..."
          className="min-w-0 flex-1 rounded-card border border-stone bg-canvas px-3.5 py-2.5 text-[14px] text-ink placeholder:text-ash focus:border-graphite focus:outline-none"
        />
        <button
          type="button"
          onClick={look}
          disabled={busy || input.trim().length === 0}
          className="shrink-0 rounded-full border border-stone px-4 py-2 text-[12px] font-semibold text-navy transition-opacity disabled:opacity-40"
        >
          {busy ? "찾는 중" : "찾기"}
        </button>
      </div>

      {found && (
        <div className="mt-4">
          <p className="text-[12px] font-semibold text-smoke">이 영상이 맞나요?</p>
          <div className="mt-2">
            <CheerWall
              cards={[
                {
                  key: "preview",
                  youtubeId: found.youtubeId,
                  title: found.title,
                  channel: found.channel,
                  channelUrl: found.channelUrl,
                },
              ]}
            />
          </div>
        </div>
      )}

      <div className="mt-4 flex justify-end gap-2">
        <button
          type="button"
          onClick={reset}
          className="rounded-full border border-stone px-4 py-2 text-[12px] font-semibold text-smoke transition-colors hover:border-graphite hover:text-ink"
        >
          취소
        </button>
        <button
          type="button"
          onClick={submit}
          disabled={busy || !found}
          className="rounded-full bg-ink px-4 py-2 text-[12px] font-semibold text-eggshell transition-opacity disabled:opacity-40"
        >
          {busy ? "올리는 중" : "올리기"}
        </button>
      </div>
    </div>
  );
}

/** 한 줄 칸. 접어 두지 않는다 — 한 줄짜리를 여는 데 한 번 더 누르게 할 이유가 없다. */
function NoteComposer({
  onDone,
  onError,
}: {
  onDone: () => void;
  onError: (message: string) => void;
}) {
  const { ensureUser } = useAuth();
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);

  const submit = async () => {
    setSending(true);
    try {
      const account = await ensureUser();
      if (!account) throw new Error("로그인을 준비하지 못했습니다.");
      await postCheerNote(account.uid, body);
      setBody("");
      onDone();
    } catch (e) {
      onError(e instanceof Error ? e.message : "남기지 못했습니다.");
    } finally {
      setSending(false);
    }
  };

  const left = NOTE_MAX - body.length;

  return (
    <div className="mt-4">
      <label htmlFor="cheer-note" className="sr-only">
        한 줄 응원
      </label>
      <div className="flex gap-2">
        <input
          id="cheer-note"
          value={body}
          maxLength={NOTE_MAX}
          onChange={(e) => setBody(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              if (body.trim().length > 0 && !sending) void submit();
            }
          }}
          placeholder="한 줄 남기기"
          className="min-w-0 flex-1 rounded-card border border-stone bg-canvas px-3.5 py-2.5 text-[14px] text-ink placeholder:text-ash focus:border-graphite focus:outline-none"
        />
        <button
          type="button"
          onClick={submit}
          disabled={sending || body.trim().length === 0}
          className="shrink-0 rounded-full bg-ink px-4 py-2 text-[12px] font-semibold text-eggshell transition-opacity disabled:opacity-40"
        >
          {sending ? "남기는 중" : "남기기"}
        </button>
      </div>
      <p className="tabular mt-1.5 text-right text-[11px] text-ash">{left}자 남음</p>
    </div>
  );
}

function NoteCard({
  note,
  agreed,
  admin,
  ready,
  onAgree,
  onError,
}: {
  note: CheerNote;
  agreed: boolean;
  admin: boolean;
  ready: boolean;
  onAgree: () => void;
  onError: (message: string) => void;
}) {
  const remove = async () => {
    try {
      await deleteCheerNote(note.id);
    } catch (e) {
      onError(e instanceof Error ? e.message : "지우지 못했습니다.");
    }
  };

  return (
    <article className="flex h-full flex-col justify-between rounded-card border border-stone bg-taupe px-4 py-3">
      <p className="text-[14px] leading-relaxed text-ink">{note.body}</p>

      <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
        <button
          type="button"
          onClick={onAgree}
          disabled={!ready}
          aria-pressed={agreed}
          className={`rounded-full px-2.5 py-1 text-[11px] font-semibold transition-colors disabled:opacity-40 ${
            agreed
              ? "bg-navy text-eggshell"
              : "border border-stone text-smoke hover:border-graphite hover:text-ink"
          }`}
        >
          나도요 {note.agreeCount > 0 && <span className="tabular">{note.agreeCount}</span>}
        </button>

        {note.mine && <span className="text-[11px] font-semibold text-navy">내 글</span>}

        {(note.mine || admin) && (
          <button
            type="button"
            onClick={remove}
            className="rounded-full border border-stone px-2.5 py-1 text-[11px] font-semibold text-ash transition-colors hover:border-burgundy hover:text-burgundy"
          >
            지우기
          </button>
        )}
      </div>
    </article>
  );
}
