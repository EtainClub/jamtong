"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { track } from "@/lib/analytics";
import { firebaseConfigured } from "@/lib/firebase/client";
import { askBook, lendRead, loadBookPack, watchReaders, type BookAnswer, type BookPack, type Reader } from "@/lib/firebase/library";

import { gardenFeedback } from "../feedback";
import { withInvite } from "../invite";
import { kstDayNumber } from "../rules";
import { sendGardenLink } from "../share";
import { Sheet } from "../Sheet";
import { useGarden } from "../store";
import type { Species } from "../types";
import type { RoomBook } from "./books";
import { FurnitureIcon } from "./RoomArt";
import {
  asksToday,
  BOOK_ASK_JAM,
  BOOK_ASK_MAX_CHARS,
  BOOK_ASK_PER_DAY,
  BOOK_MARKS_MAX,
  bookIdOf,
  booksOwned,
  lendClaim,
  LEND_JAM,
  LEND_PER_DAY,
  LIBRARY_SETS,
  seedReady,
} from "./library";
import type { RoomData } from "./rules";

const NO_READ: string[] = [];

/**
 * 독서대 — 방에 놓인 특별한 책을 누르면 뜨는 시트(docs/garden-miniroom.md "특별한 책 혜택").
 *
 * 주인: 장 읽기와 완독 도장, 낭독, 펼쳐 둘 문장 고르기, 책에게 묻기, 오늘의 책 씨앗, 빌려 읽은 손님의 잼, 장 카드 보내기.
 * 손님: 장서표와 주인이 펼쳐 둔 문장, 장 읽기 — 한 장을 끝까지 읽으면 '빌려 읽기'로 주인에게 잼이 간다(하루 한 번).
 *
 * ★ 글은 모두 잼통 사이트에 공개된 요약이다(api/book-pack). 원문 전문이 아니다 — 시트도 그렇게 밝힌다.
 */
export function BookSheet({
  book,
  room,
  mode,
  ownerNick,
  gid,
  uid,
  catalog,
  onClose,
}: {
  book: RoomBook;
  room: RoomData;
  mode: "owner" | "guest";
  /** 방 주인의 정원 이름(장서표). */
  ownerNick: string;
  /** 이 방의 공개 id. 주인의 방이 공개가 아니면 null(빌려 읽기·장 카드의 서재 이름이 없다). */
  gid: string | null;
  /** 지금 보는 사람. */
  uid: string | null;
  catalog: Species[];
  onClose: () => void;
}) {
  const owner = mode === "owner";
  const [pack, setPack] = useState<BookPack | null | undefined>(undefined);
  const [open, setOpen] = useState<string | null>(null);
  const [tab, setTab] = useState<"read" | "ask">("read");
  const [status, setStatus] = useState("");
  const read = useGarden((s) => s.data?.library.read[book.slug]) ?? NO_READ;
  // 연 날의 한국 날짜. 시트를 연 채 자정을 넘기면 다음에 열 때 바뀐다.
  const [day] = useState(() => kstDayNumber(Date.now()));
  const bookData = room.books?.[book.slug];
  const marks = bookData?.marks ?? [];

  useEffect(() => {
    let alive = true;
    void loadBookPack(book.slug).then((p) => alive && setPack(p));
    return () => {
      alive = false;
    };
  }, [book.slug]);

  useEffect(() => {
    track("book_open", { book: book.slug, mode });
  }, [book.slug, mode]);

  const tell = (text: string) => {
    setStatus(text);
    gardenFeedback("tap");
  };

  const chapter = pack?.chapters.find((c) => c.slug === open) ?? null;
  const markedPoints = pack ? pack.chapters.flatMap((c) => c.points.map((p) => ({ ...p, order: c.order }))).filter((p) => marks.includes(p.id)) : [];

  return (
    <Sheet label={`${book.title} 독서대`} title={`『${book.title}』`} onClose={onClose}>
      <div className="mt-2 flex items-center gap-3">
        <FurnitureIcon id={bookIdOf(book.slug)} size={72} />
        <div className="min-w-0 text-[12.5px] leading-relaxed">
          <p className="font-bold text-ink">
            📜 {ownerNick || "이 방"}의 서재 소장본{bookData?.since !== undefined ? ` · ${dayLabel(bookData.since)} 들임` : ""}
          </p>
          <p className="text-smoke">
            {book.publisher} · {book.year} · {book.chapters}장{owner ? ` · 완독 도장 ${Math.min(read.length, book.chapters)}/${book.chapters}` : ""}
          </p>
          <p className="text-[11px] text-ash">잼통이 장마다 다시 쓴 요약이에요. 책의 원문이 아니에요.</p>
        </div>
      </div>

      {markedPoints.length > 0 && (
        <section className="mt-3 rounded-xl bg-[#fff7df] px-3 py-2 text-[12.5px]" aria-label="펼쳐 둔 문장">
          <p className="font-bold">✍️ {owner ? "내가" : `${ownerNick || "주인"}님이`} 펼쳐 둔 문장</p>
          <ul className="mt-1 space-y-1">
            {markedPoints.map((p) => (
              <li key={p.id}>
                <b>{p.title}</b> <span className="text-smoke">— {p.say}</span> <span className="text-[11px] text-ash">{p.order}장</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {owner && (
        <div className="mt-3 grid grid-cols-2 gap-1.5" role="tablist">
          <button type="button" role="tab" aria-selected={tab === "read"} onClick={() => setTab("read")} className={`garden-diary-btn ${tab === "read" ? "" : "is-quiet"}`}>
            📖 읽기
          </button>
          <button type="button" role="tab" aria-selected={tab === "ask"} onClick={() => setTab("ask")} className={`garden-diary-btn ${tab === "ask" ? "" : "is-quiet"}`}>
            💬 책에게 묻기
          </button>
        </div>
      )}

      {status && (
        <p className="mt-2 rounded-lg bg-[#eef6ff] px-3 py-1.5 text-[12px] font-semibold text-ink" aria-live="polite">
          {status}
        </p>
      )}

      {pack === undefined && <p className="mt-3 text-[12px] text-smoke">책을 펴는 중…</p>}
      {pack === null && (
        <p className="mt-3 text-[12px] text-smoke">
          책을 펴지 못했어요. <Link href={`/books/${book.slug}`} className="underline">잼통에서 읽기 →</Link>
        </p>
      )}

      {pack && tab === "ask" && owner && <AskPanel book={book} pack={pack} day={day} tell={tell} onOpen={(slug) => { setTab("read"); setOpen(slug); }} />}

      {pack && tab === "read" && !chapter && (
        <ol className="mt-3 space-y-1">
          {pack.chapters.map((c) => (
            <li key={c.slug}>
              <button type="button" onClick={() => setOpen(c.slug)} className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-[13px] hover:bg-black/5">
                <span className="w-9 shrink-0 text-[11px] font-bold text-ash">{c.order}장</span>
                <span className="min-w-0 flex-1 font-semibold text-ink">{c.title}</span>
                {owner && read.includes(c.slug) && <span aria-label="완독 도장">🔖</span>}
                <span className="shrink-0 text-[11px] text-ash">{c.minutes}분</span>
              </button>
            </li>
          ))}
        </ol>
      )}

      {pack && tab === "read" && chapter && (
        <ChapterReader
          key={chapter.slug}
          book={book}
          chapter={chapter}
          owner={owner}
          marks={marks}
          done={read.includes(chapter.slug)}
          gid={gid}
          uid={uid}
          tell={tell}
          onBack={() => setOpen(null)}
        />
      )}

      {owner && tab === "read" && !chapter && (
        <OwnerExtras book={book} room={room} day={day} gid={gid} uid={uid} catalog={catalog} tell={tell} />
      )}

      <Link href={`/books/${book.slug}`} className="mt-4 inline-block text-[12px] text-smoke underline">
        잼통 사이트에서 이 책 보기 →
      </Link>
    </Sheet>
  );
}

function dayLabel(day: number): string {
  const d = new Date(day * 86_400_000);
  return `${d.getUTCFullYear()}.${String(d.getUTCMonth() + 1).padStart(2, "0")}.${String(d.getUTCDate()).padStart(2, "0")}`;
}

type Chapter = BookPack["chapters"][number];

/** 한 장 — 요약 본문과 쉽게 보기 토막. 주인은 낭독·도장·문장 고르기·장 카드, 손님은 빌려 읽기. */
function ChapterReader({
  book,
  chapter,
  owner,
  marks,
  done,
  gid,
  uid,
  tell,
  onBack,
}: {
  book: RoomBook;
  chapter: Chapter;
  owner: boolean;
  marks: string[];
  done: boolean;
  gid: string | null;
  uid: string | null;
  tell: (text: string) => void;
  onBack: () => void;
}) {
  const paragraphs = (chapter.body ?? "").split("\n\n").filter(Boolean);
  const speech = useSpeech();
  const [lent, setLent] = useState<"idle" | "busy" | "done">("idle");

  const toggleMark = (id: string) => {
    const next = marks.includes(id) ? marks.filter((m) => m !== id) : [...marks, id];
    if (next.length > BOOK_MARKS_MAX) return tell(`펼쳐 둘 문장은 ${BOOK_MARKS_MAX}개까지예요. 하나를 내려놓고 골라 주세요.`);
    useGarden.getState().setBookMarks(book.slug, next);
    tell(marks.includes(id) ? "문장을 내려놓았어요" : "✍️ 독서대에 펼쳐 두었어요 — 손님에게도 보여요");
  };

  const stamp = () => {
    if (useGarden.getState().markChapterRead(book.slug, chapter.slug)) {
      gardenFeedback("reward");
      track("book_read", { book: book.slug, chapter: chapter.order });
      tell(`🔖 ${chapter.order}장에 완독 도장을 찍었어요`);
    }
  };

  const lend = async () => {
    if (!gid || !uid) return tell("이 방은 빌려 읽기를 받지 않아요");
    setLent("busy");
    const nick = useGarden.getState().data?.nick ?? "";
    const result = await lendRead(gid, uid, nick, book.slug);
    setLent(result === "error" ? "idle" : "done");
    if (result === "ok") {
      gardenFeedback("reward");
      track("book_lend", { book: book.slug });
      tell("📚 빌려 읽기를 남겼어요 — 주인에게 잼이 가요");
    } else if (result === "already") tell("오늘은 이 방에서 이미 빌려 읽었어요. 내일 또 와요");
    else tell("빌려 읽기를 남기지 못했어요. 잠시 뒤 다시 눌러 주세요");
  };

  const shareCard = async () => {
    const base = `${window.location.origin}/bk/${book.slug}/${chapter.slug}${gid ? `?g=${gid}` : ""}`;
    const result = await sendGardenLink(withInvite(base, "i"), `『${book.title}』 ${chapter.order}장`, `${chapter.title} — ${chapter.summary}`, "book");
    tell(result === "copied" ? "장 카드 링크를 복사했어요" : result === "failed" ? "링크를 보내지 못했어요" : "장 카드를 보냈어요");
  };

  return (
    <article className="mt-3">
      <button type="button" onClick={() => { speech.stop(); onBack(); }} className="text-[12px] font-semibold text-smoke">
        ← 장 목록
      </button>
      <p className="mt-1 text-[11px] font-bold text-ash">{chapter.order}장</p>
      <h3 className="text-[17px] font-bold text-ink">{chapter.title}</h3>
      <p className="mt-1 text-[12.5px] text-smoke">{chapter.summary}</p>

      {owner && paragraphs.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {speech.supported ? (
            <button type="button" className="garden-diary-btn is-quiet" onClick={() => (speech.speaking ? speech.stop() : speech.speak(paragraphs.map((p) => p.replace(/^## /, ""))))}>
              {speech.speaking ? "⏹ 낭독 멈추기" : "🔊 이 장 낭독 듣기"}
            </button>
          ) : (
            <span className="text-[11px] text-ash">이 브라우저는 낭독을 지원하지 않아요</span>
          )}
        </div>
      )}

      <section className="mt-3 rounded-xl bg-black/[.03] px-3 py-2" aria-label="쉽게 보기">
        <p className="text-[12px] font-bold text-ink">쉽게 보기{owner ? ` · ✍️ 눌러서 독서대에 펼쳐 두기(${marks.length}/${BOOK_MARKS_MAX})` : ""}</p>
        <ul className="mt-1 space-y-1.5 text-[12.5px]">
          {chapter.points.map((p) => (
            <li key={p.id} className="flex items-start gap-2">
              {owner && (
                <button type="button" aria-pressed={marks.includes(p.id)} onClick={() => toggleMark(p.id)} className="shrink-0 text-[16px] leading-none" aria-label={`${p.title} — 독서대에 펼쳐 두기`}>
                  {marks.includes(p.id) ? "✍️" : "◻️"}
                </button>
              )}
              <span>
                <b>{p.title}</b> <span className="text-smoke">— {p.say}</span>
              </span>
            </li>
          ))}
        </ul>
      </section>

      {paragraphs.length > 0 ? (
        <div className="mt-3 space-y-2 text-[13.5px] leading-[1.8] text-ink">
          {paragraphs.map((p, i) =>
            p.startsWith("## ") ? (
              <h4 key={i} className="pt-1 text-[14px] font-bold">{p.slice(3)}</h4>
            ) : (
              <p key={i}>{p}</p>
            ),
          )}
        </div>
      ) : (
        <p className="mt-3 text-[12px] text-smoke">이 장은 요약 본문 없이 쉽게 보기만 있어요.</p>
      )}

      <div className="mt-4 flex flex-wrap gap-1.5">
        {owner ? (
          <>
            <button type="button" className="garden-diary-btn" disabled={done} onClick={stamp}>
              {done ? "🔖 완독 도장을 찍었어요" : "🔖 다 읽었어요 — 도장 찍기"}
            </button>
            <button type="button" className="garden-diary-btn is-quiet" onClick={() => void shareCard()}>
              📮 이 장을 카드로 보내기
            </button>
          </>
        ) : (
          firebaseConfigured &&
          gid && (
            <button type="button" className="garden-diary-btn" disabled={lent !== "idle"} onClick={() => void lend()}>
              {lent === "done" ? "📚 빌려 읽었어요" : `📚 다 읽었어요 — 빌려 읽기 남기기(주인에게 잼 ${LEND_JAM})`}
            </button>
          )
        )}
      </div>
    </article>
  );
}

/** 책에게 묻기 — 책마다 하루 BOOK_ASK_PER_DAY번, 한 번에 잼 BOOK_ASK_JAM. 답은 그 책의 요약 안에서만. */
function AskPanel({ book, pack, day, tell, onOpen }: { book: RoomBook; pack: BookPack; day: number; tell: (text: string) => void; onOpen: (slug: string) => void }) {
  const lib = useGarden((s) => s.data?.library);
  const jam = useGarden((s) => s.data?.jam ?? 0);
  const [q, setQ] = useState("");
  const [busy, setBusy] = useState(false);
  const [answer, setAnswer] = useState<BookAnswer | null>(null);
  const [serverLeft, setServerLeft] = useState<number | null>(null);
  const used = lib ? asksToday(lib, book.slug, day) : 0;
  const left = Math.max(0, serverLeft ?? BOOK_ASK_PER_DAY - used);

  const ask = async () => {
    const question = q.trim();
    if (question.length < 2 || busy) return;
    if (jam < BOOK_ASK_JAM) return tell(`잼이 ${BOOK_ASK_JAM} 있어야 물을 수 있어요`);
    if (left <= 0) return tell("오늘은 이 책에 다 물었어요. 내일 다시 물어 주세요");
    setBusy(true);
    const result = await askBook(book.slug, question);
    setBusy(false);
    if (!result.ok) {
      if (result.left !== undefined) setServerLeft(result.left);
      return tell(result.error);
    }
    useGarden.getState().payBookAsk(book.slug);
    setServerLeft(result.answer.left);
    setAnswer(result.answer);
    track("book_ask", { book: book.slug, grounded: result.answer.grounded });
    tell(`💬 잼 ${BOOK_ASK_JAM}을 썼어요 · 오늘 남은 질문 ${result.answer.left}번`);
  };

  return (
    <section className="mt-3" aria-label="책에게 묻기">
      <p className="text-[12px] leading-relaxed text-smoke">
        『{pack.title}』의 요약 안에서만 답해요. 답의 문장마다 몇 장에서 왔는지 달아요. 한 번에 잼 {BOOK_ASK_JAM} · 오늘 {left}/{BOOK_ASK_PER_DAY}번 남음.
      </p>
      <textarea
        value={q}
        onChange={(e) => setQ(e.target.value.slice(0, BOOK_ASK_MAX_CHARS))}
        rows={3}
        placeholder="예: 공장에서 일하던 시절에 어떤 일이 있었나요?"
        className="mt-2 w-full rounded-xl border border-black/15 bg-white px-3 py-2 text-[13.5px]"
      />
      <div className="mt-1 flex items-center justify-between">
        <span className="text-[11px] text-ash">{q.length}/{BOOK_ASK_MAX_CHARS}</span>
        <button type="button" className="garden-diary-btn" disabled={busy || q.trim().length < 2 || left <= 0} onClick={() => void ask()}>
          {busy ? "책을 넘기는 중…" : `💬 묻기 · 잼 ${BOOK_ASK_JAM}`}
        </button>
      </div>
      {answer && (
        <div className="mt-3 rounded-xl bg-[#f6f1ff] px-3 py-2.5 text-[13.5px] leading-relaxed">
          {!answer.grounded && <p className="mb-1 text-[11px] font-bold text-[#7a5a12]">이 책의 요약에서 답을 찾지 못했어요</p>}
          <p className="whitespace-pre-wrap text-ink">{answer.message}</p>
          {answer.chapters.length > 0 && (
            <p className="mt-2 flex flex-wrap gap-1">
              {answer.chapters.map((c) => (
                <button key={c.slug} type="button" onClick={() => onOpen(c.slug)} className="rounded-full bg-white px-2.5 py-1 text-[11.5px] font-semibold text-ink shadow-sm">
                  {c.order}장 · {c.title} 읽기
                </button>
              ))}
            </p>
          )}
          <p className="mt-2 text-[10.5px] text-ash">AI가 잼통의 요약을 읽고 쓴 답이에요. 틀릴 수 있으니 근거 장을 펴 확인해 주세요.</p>
        </div>
      )}
    </section>
  );
}

/** 주인만 — 오늘의 책 씨앗, 빌려 읽은 손님의 잼, 서재 세트. */
function OwnerExtras({ book, room, day, gid, uid, catalog, tell }: { book: RoomBook; room: RoomData; day: number; gid: string | null; uid: string | null; catalog: Species[]; tell: (text: string) => void }) {
  const lib = useGarden((s) => s.data?.library);
  const [readers, setReaders] = useState<Reader[]>([]);

  useEffect(() => {
    if (!gid || !firebaseConfigured) return;
    return watchReaders(gid, day, setReaders);
  }, [gid, day]);

  const owned = booksOwned(room.owned);
  const next = LIBRARY_SETS.find((s) => owned < s.books);
  const claim = lib ? lendClaim(lib, readers.map((r) => r.uid), day) : { uids: [], jam: 0 };
  const lentToday = lib && lib.lent.day === day ? lib.lent.uids.length : 0;

  const seed = () => {
    const species = useGarden.getState().claimBookSeed(book.slug, catalog, uid ?? "local");
    if (!species) return tell("오늘은 이 책의 씨앗을 이미 받았어요");
    gardenFeedback("reward");
    track("book_seed", { book: book.slug });
    tell(`🌱 「${species.title}」 씨앗을 받았어요 — 이 책이 나온 ${book.year}년까지 시작된 업적이에요`);
  };

  const takeLends = () => {
    const got = useGarden.getState().claimLends(readers.map((r) => r.uid));
    if (got <= 0) return;
    gardenFeedback("reward");
    tell(`📚 빌려 읽은 손님 덕에 잼 +${got}`);
  };

  return (
    <section className="mt-4 space-y-2 rounded-xl bg-[#f3f7ec] px-3 py-2.5 text-[12.5px]" aria-label="책 주인의 혜택">
      <div className="flex items-center justify-between gap-2">
        <span>🌱 오늘의 책 씨앗 — {book.year}년까지 시작된 업적에서 하나</span>
        <button type="button" className="garden-diary-btn shrink-0" disabled={!lib || !seedReady(lib, book.slug, day)} onClick={seed}>
          {lib && !seedReady(lib, book.slug, day) ? "받았어요" : "받기"}
        </button>
      </div>
      <div>
        <p>
          📚 빌려 읽기 — 손님이 내 방 책을 한 장 읽으면 한 사람에 잼 {LEND_JAM}(하루 {LEND_PER_DAY}명까지)
        </p>
        {!gid ? (
          <p className="text-[11.5px] text-ash">방을 공개해야 손님이 빌려 읽을 수 있어요.</p>
        ) : (
          <p className="mt-0.5 text-[11.5px] text-smoke">
            오늘 {readers.length}명이 빌려 읽었어요{readers.length ? ` · ${readers.slice(0, 5).map((r) => r.nick).join(", ")}` : ""} · 받은 잼 {lentToday * LEND_JAM}
          </p>
        )}
        {claim.jam > 0 && (
          <button type="button" className="garden-diary-btn mt-1" onClick={takeLends}>
            📚 잼 {claim.jam} 받기
          </button>
        )}
      </div>
      <p>
        📕 서재 세트 — 가진 특별한 책 {owned}/7권
        {next ? ` · ${next.books}권이면 ${next.label}` : " · 완전한 서재를 이뤘어요"}
      </p>
    </section>
  );
}

/** 낭독 — 브라우저의 음성 합성(한국어). 문단을 하나씩 읽는다(긴 글을 한 번에 넘기면 중간에 끊기는 브라우저가 있다). */
function useSpeech() {
  const [speaking, setSpeaking] = useState(false);
  const queue = useRef<string[]>([]);
  const supported = typeof window !== "undefined" && "speechSynthesis" in window;

  const stop = () => {
    queue.current = [];
    if (supported) window.speechSynthesis.cancel();
    setSpeaking(false);
  };

  useEffect(() => () => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) window.speechSynthesis.cancel();
  }, []);

  const next = () => {
    const text = queue.current.shift();
    if (!text) {
      setSpeaking(false);
      return;
    }
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "ko-KR";
    u.rate = 1;
    const voice = window.speechSynthesis.getVoices().find((v) => v.lang.startsWith("ko"));
    if (voice) u.voice = voice;
    u.onend = next;
    u.onerror = () => setSpeaking(false);
    window.speechSynthesis.speak(u);
  };

  const speak = (paragraphs: string[]) => {
    if (!supported) return;
    window.speechSynthesis.cancel();
    queue.current = [...paragraphs];
    setSpeaking(true);
    next();
  };

  return { supported, speaking, speak, stop };
}
