"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

import { CardCarousel } from "@/features/carousel/CardCarousel";
import { useAuth } from "@/lib/firebase/auth";
import { checkAdmin } from "@/lib/firebase/feedback";
import {
  ALT_MAX,
  AUTHOR_NAME_MAX,
  FILE_MAX_MB,
  FILE_TYPES,
  TITLE_MAX,
  approveInfographic,
  checkInfographicFile,
  deleteInfographic,
  uploadInfographic,
  watchApprovedInfographics,
  watchMyInfographics,
  watchPendingInfographics,
  type Infographic,
} from "@/lib/firebase/infographics";

/**
 * 업적 인포그래픽.
 *
 * 그림은 Firebase Storage에, 목록은 Firestore에 있다. 구글 계정을 연결한 사람이 올리고,
 * 운영자가 승인한 것만 캐러셀에 실린다. 승인 대기인 그림은 올린 사람과
 * 운영자에게만 보인다.
 *
 * 넘기는 방식은 CardCarousel이 갖는다. 카드에는 그림의 윗부분만 보이고,
 * 누르면 뷰어에서 한 장 전체를 본다. 세로로 긴 그림을 카드 폭에 맞춰
 * 통째로 넣으면 글자가 읽히지 않는다.
 */
export function InfographicSection() {
  const { user, configured } = useAuth();
  const uid = user?.uid ?? null;

  const [approved, setApproved] = useState<Infographic[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [mine, setMine] = useState<Infographic[]>([]);
  const [pending, setPending] = useState<Infographic[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState<Infographic | null>(null);
  const close = useCallback(() => setOpen(null), []);

  /*
   * 운영자인지. 응원판과 같은 이유로 "어느 uid가 확인됐나"를 담고 지금 uid와
   * 견준다 — 이펙트 안에서 false로 되돌리면 React Compiler가 막는다.
   */
  const [adminUid, setAdminUid] = useState<string | null>(null);
  const admin = adminUid !== null && adminUid === uid;

  useEffect(() => {
    if (!configured) return;
    return watchApprovedInfographics(
      uid,
      (items) => {
        setApproved(items);
        setLoaded(true);
      },
      (message) => {
        setError(message);
        setLoaded(true);
      },
    );
  }, [uid, configured]);

  useEffect(() => {
    if (!uid) return;
    return watchMyInfographics(uid, setMine, setError);
  }, [uid]);

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

  useEffect(() => {
    if (!admin || !uid) return;
    return watchPendingInfographics(uid, setPending, setError);
  }, [admin, uid]);

  const run = (action: () => Promise<void>, fallback: string) => {
    action()
      .then(() => setError(null))
      .catch((e) => setError(e instanceof Error ? e.message : fallback));
  };

  const approve = (item: Infographic) => {
    run(() => approveInfographic(item.id), "승인하지 못했습니다.");
    setOpen(null);
  };

  const remove = (item: Infographic) => {
    const name = item.title ? `「${item.title}」을(를)` : "이 그림을";
    if (!window.confirm(`${name} 내릴까요? 그림 파일도 함께 지워집니다.`)) return;
    run(() => deleteInfographic(item), "내리지 못했습니다.");
    setOpen(null);
  };

  // 설정이 없는 환경에서는 실린 것도 올릴 곳도 없다.
  if (!configured) return null;

  const myPending = mine.filter((item) => item.status === "pending");

  return (
    <section aria-labelledby="ex-infographics" className="mt-5">
      <div className="flex items-baseline justify-between gap-3">
        <h2 id="ex-infographics" className="text-[15px] font-bold text-ink">
          업적 인포그래픽
        </h2>
        {loaded && <span className="tabular text-[12px] text-ash">{approved.length}장</span>}
      </div>

      {error && (
        <p className="mt-3 rounded-card border border-burgundy/30 bg-burgundy-tint/40 px-4 py-3 text-[13px] leading-relaxed text-burgundy">
          {error}
        </p>
      )}

      <div className="mt-3">
        {!loaded ? (
          <div className="aspect-[4/3] animate-pulse rounded-card-lg border border-stone bg-taupe" />
        ) : approved.length > 0 ? (
          <CardCarousel
            items={approved}
            label={`인포그래픽 ${approved.length}장. 좌우 화살표 키로 넘길 수 있어요.`}
            itemLabel={(i) => `${i + 1}번 인포그래픽`}
          >
            {(item) => (
              <button
                type="button"
                onClick={() => setOpen(item)}
                className="group block w-full text-left"
              >
                <span className="relative block aspect-[4/3] overflow-hidden rounded-card border border-stone bg-white">
                  <Image
                    src={item.imageUrl}
                    alt=""
                    fill
                    sizes="(max-width: 560px) calc(100vw - 74px), 486px"
                    className="object-cover object-top"
                  />
                  <span className="absolute bottom-3 right-3 rounded-full bg-[#071a2c]/75 px-3 py-1.5 text-[11px] font-semibold text-white backdrop-blur transition-colors group-hover:bg-[#071a2c]/90">
                    크게 보기
                  </span>
                </span>
                {item.title && (
                  <span className="mt-3 block text-[16px] font-semibold leading-snug text-ink">
                    {item.title}
                  </span>
                )}
                {item.authorName && (
                  <span className="mt-1 block text-[12px] text-ash">등록 {item.authorName}</span>
                )}
              </button>
            )}
          </CardCarousel>
        ) : (
          <p className="rounded-card border border-stone bg-taupe px-5 py-4 text-[13px] leading-relaxed text-smoke">
            아직 실린 인포그래픽이 없습니다.
          </p>
        )}
      </div>

      <Uploader onError={setError} onDone={() => setError(null)} />

      {myPending.length > 0 && (
        <PendingList
          heading="내가 올린 것 · 승인 대기"
          note="운영자가 확인한 뒤 실립니다. 승인 전에는 나만 볼 수 있습니다."
          items={myPending}
          onOpen={setOpen}
        />
      )}

      {admin && (
        <PendingList
          heading={`승인 대기 ${pending.length}장`}
          note="운영자로 보고 있습니다. 그림을 눌러 크게 보고 승인하거나 내릴 수 있습니다."
          items={pending}
          onOpen={setOpen}
        />
      )}

      {open && (
        <InfographicViewer
          item={open}
          onClose={close}
          onApprove={admin && open.status === "pending" ? () => approve(open) : undefined}
          onRemove={admin || open.mine ? () => remove(open) : undefined}
        />
      )}
    </section>
  );
}

/* ── 올리기 ─────────────────────────────────────────────────────── */

function Uploader({
  onDone,
  onError,
}: {
  onDone: () => void;
  onError: (message: string) => void;
}) {
  const { user, ensureUser, signInWithGoogle, switchToGoogle, linkBlock } = useAuth();
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [alt, setAlt] = useState("");
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);

  // 미리보기 주소는 바뀌거나 폼이 사라질 때 거둔다.
  useEffect(() => {
    if (!preview) return;
    return () => URL.revokeObjectURL(preview);
  }, [preview]);

  const reset = () => {
    setFile(null);
    setPreview(null);
    setTitle("");
    setAuthorName("");
    setAlt("");
    setOpen(false);
  };

  const pick = (next: File | null) => {
    if (!next) return;
    const problem = checkInfographicFile(next);
    if (problem) {
      onError(problem);
      return;
    }
    onDone();
    setFile(next);
    setPreview(URL.createObjectURL(next));
  };

  const connect = async (how: () => Promise<void>) => {
    setBusy(true);
    try {
      await how();
      onDone();
    } catch (e) {
      onError(e instanceof Error ? e.message : "구글 계정을 연결하지 못했습니다.");
    } finally {
      setBusy(false);
    }
  };

  const submit = async () => {
    if (!file) return;
    setBusy(true);
    try {
      const account = await ensureUser();
      if (!account) throw new Error("로그인을 준비하지 못했습니다.");
      // 규칙은 토큰에 담긴 연결 정보를 본다. 방금 연결했다면 새 토큰이어야 한다.
      await account.getIdToken(true);
      await uploadInfographic(account.uid, { file, title, alt, authorName });
      reset();
      setSent(true);
      onDone();
    } catch (e) {
      onError(e instanceof Error ? e.message : "올리지 못했습니다.");
    } finally {
      setBusy(false);
    }
  };

  if (!open) {
    return (
      <>
        <button
          type="button"
          onClick={() => {
            setOpen(true);
            setSent(false);
          }}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-card border border-stone bg-taupe px-5 py-3.5 text-sm font-semibold text-navy transition-colors hover:border-graphite"
        >
          인포그래픽 올리기
          <span aria-hidden="true">+</span>
        </button>
        {sent && (
          <p role="status" className="mt-2 text-[12px] leading-relaxed text-smoke">
            올렸습니다. 운영자가 확인한 뒤 실립니다.
          </p>
        )}
      </>
    );
  }

  /*
   * 구글 계정을 연결한 사람만 올린다. 익명 계정은 브라우저를 지우면 사라지는
   * 일회용이라, 내려야 할 그림을 올린 사람이 누구인지 되짚을 수 없다.
   * 규칙도 같은 것을 본다 — 여기는 막히기 전에 이유를 말해 주는 자리다.
   */
  if (!user?.providers.includes("google.com")) {
    return (
      <div className="mt-3 rounded-card border border-stone bg-taupe px-5 py-4">
        <p className="text-[13px] leading-relaxed text-smoke">
          인포그래픽은 구글 계정을 연결한 분만 올릴 수 있습니다. 올린 그림을
          확인하거나 내릴 때 올린 분을 알아볼 수 있어야 하기 때문입니다.
        </p>
        {linkBlock === "already-in-use" ? (
          <>
            <p className="mt-3 text-[12px] leading-relaxed text-ash">
              그 구글 계정은 이미 다른 기록과 이어져 있습니다. 그 계정으로 들어가면
              지금 기기의 익명 기록은 따라가지 않습니다.
            </p>
            <button
              type="button"
              onClick={() => connect(switchToGoogle)}
              disabled={busy}
              className="mt-3 rounded-full bg-ink px-4 py-2 text-[12px] font-semibold text-eggshell transition-opacity disabled:opacity-40"
            >
              그 구글 계정으로 들어가기
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={() => connect(signInWithGoogle)}
            disabled={busy}
            className="mt-3 rounded-full bg-ink px-4 py-2 text-[12px] font-semibold text-eggshell transition-opacity disabled:opacity-40"
          >
            구글 계정 연결하기
          </button>
        )}
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="ml-2 mt-3 rounded-full border border-stone px-4 py-2 text-[12px] font-semibold text-smoke transition-colors hover:border-graphite hover:text-ink"
        >
          닫기
        </button>
      </div>
    );
  }


  return (
    <div className="mt-3 rounded-card border border-stone bg-taupe px-5 py-4">
      <p className="text-[12px] leading-relaxed text-ash">
        그림만 고르면 올릴 수 있습니다. 운영자가 확인한 뒤 실립니다.
      </p>

      <label htmlFor="ig-file" className="mt-4 block text-[12px] font-semibold text-smoke">
        그림 (PNG·JPG·WEBP, {FILE_MAX_MB}MB까지)
      </label>
      <input
        id="ig-file"
        type="file"
        accept={FILE_TYPES.join(",")}
        onChange={(e) => pick(e.target.files?.[0] ?? null)}
        className="mt-2 block w-full text-[13px] text-smoke file:mr-3 file:rounded-full file:border file:border-stone file:bg-canvas file:px-3.5 file:py-1.5 file:text-[12px] file:font-semibold file:text-navy"
      />
      {preview && (
        // 올리기 전 미리보기는 blob 주소라 next/image가 다루지 않는다.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={preview}
          alt=""
          className="mt-3 max-h-64 w-full rounded-card border border-stone bg-white object-contain"
        />
      )}

      {/*
        * 나머지는 접어 둔다. 칸이 다 펼쳐져 있으면 전부 채워야 하는 것처럼
        * 보여 올리기를 망설이게 된다. 모두 선택이다.
        */}
      <div className="mt-4 space-y-2">
        <OptionalField id="ig-title" label="제목" hint="캐러셀에서 그림 밑에 크게 보입니다.">
          <input
            id="ig-title"
            autoFocus
            value={title}
            maxLength={TITLE_MAX}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="원화의 SDR 편입, 어디까지 왔나?"
            className="w-full rounded-card border border-stone bg-canvas px-3.5 py-2.5 text-[14px] text-ink placeholder:text-ash focus:border-graphite focus:outline-none"
          />
        </OptionalField>

        <OptionalField id="ig-author" label="등록자 이름" hint="적으면 그림 밑에 등록자로 보입니다.">
          <input
            id="ig-author"
            autoFocus
            value={authorName}
            maxLength={AUTHOR_NAME_MAX}
            onChange={(e) => setAuthorName(e.target.value)}
            className="w-full rounded-card border border-stone bg-canvas px-3.5 py-2.5 text-[14px] text-ink placeholder:text-ash focus:border-graphite focus:outline-none"
          />
        </OptionalField>

        <OptionalField
          id="ig-alt"
          label="그림 설명"
          hint="그림 속 글과 숫자, 출처를 옮겨 적어 주시면 그림을 볼 수 없는 분도 읽을 수 있고, 운영자 확인도 빨라집니다."
        >
          <textarea
            id="ig-alt"
            autoFocus
            value={alt}
            maxLength={ALT_MAX}
            rows={5}
            onChange={(e) => setAlt(e.target.value)}
            className="w-full resize-y rounded-card border border-stone bg-canvas px-3.5 py-2.5 text-[13px] leading-relaxed text-ink focus:border-graphite focus:outline-none"
          />
          <p className="tabular mt-1 text-right text-[11px] text-ash">
            {alt.trim().length} / {ALT_MAX}
          </p>
        </OptionalField>
      </div>

      <div className="mt-3 flex justify-end gap-2">
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
          disabled={busy || !file}
          className="rounded-full bg-ink px-4 py-2 text-[12px] font-semibold text-eggshell transition-opacity disabled:opacity-40"
        >
          {busy ? "올리는 중" : "올리기"}
        </button>
      </div>
    </div>
  );
}

/**
 * 접힌 선택 칸. 누르면 펼쳐지고 바로 쓸 수 있게 커서가 들어간다.
 * 한 번 연 칸은 다시 접지 않는다 — 쓰던 글이 사라진 것처럼 보이면 안 된다.
 */
function OptionalField({
  id,
  label,
  hint,
  children,
}: {
  id: string;
  label: string;
  hint: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-controls={id}
        className="flex w-full items-center justify-between gap-2 rounded-card border border-dashed border-stone px-3.5 py-2.5 text-left text-[13px] text-smoke transition-colors hover:border-graphite hover:text-ink"
      >
        <span>
          {label} 적기 <span className="text-[11px] text-ash">(선택)</span>
        </span>
        <span aria-hidden="true" className="text-ash">
          +
        </span>
      </button>
    );
  }

  return (
    <div>
      <label htmlFor={id} className="block text-[12px] font-semibold text-smoke">
        {label} <span className="font-normal text-ash">(선택)</span>
      </label>
      <p className="mt-1 text-[11px] leading-relaxed text-ash">{hint}</p>
      <div className="mt-2">{children}</div>
    </div>
  );
}

/* ── 승인 대기 ──────────────────────────────────────────────────── */

function PendingList({
  heading,
  note,
  items,
  onOpen,
}: {
  heading: string;
  note: string;
  items: Infographic[];
  onOpen: (item: Infographic) => void;
}) {
  return (
    <div className="mt-5 rounded-card border border-navy/30 bg-navy-tint/50 px-4 py-3.5">
      <p className="text-[13px] font-bold text-navy">{heading}</p>
      <p className="mt-1 text-[12px] leading-relaxed text-smoke">{note}</p>
      {items.length > 0 && (
        <ul className="mt-3 space-y-2">
          {items.map((item) => (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => onOpen(item)}
                className="flex w-full items-center gap-3 rounded-card border border-stone bg-taupe p-2 text-left transition-colors hover:border-graphite"
              >
                <span className="relative block h-16 w-14 shrink-0 overflow-hidden rounded border border-stone bg-white">
                  <Image
                    src={item.imageUrl}
                    alt=""
                    fill
                    sizes="56px"
                    className="object-cover object-top"
                  />
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-[13px] font-semibold text-ink">
                    {item.title || "제목 없음"}
                  </span>
                  {item.createdAt && (
                    <span className="tabular mt-0.5 block text-[11px] text-ash">
                      {item.authorName && `등록 ${item.authorName} · `}
                      {item.createdAt.toLocaleString("ko-KR")}
                    </span>
                  )}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/* ── 뷰어 ───────────────────────────────────────────────────────── */

/**
 * 한 장을 화면 가득 펼친다. 세로로 길어 스크롤로 내려 읽고, 휴대폰에서는
 * 두 손가락으로 키운다. 닫으면 누르기 전 자리로 포커스가 돌아간다.
 *
 * 승인과 내리기는 여기서 한다. 운영자가 그림을 다 보지 않고 승인하는 길을
 * 만들지 않는다.
 */
function InfographicViewer({
  item,
  onClose,
  onApprove,
  onRemove,
}: {
  item: Infographic;
  onClose: () => void;
  onApprove?: () => void;
  onRemove?: () => void;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const restoreTo = document.activeElement;
    closeRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);

    // 뒤의 페이지가 함께 스크롤되지 않게 한다.
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
      if (restoreTo instanceof HTMLElement) restoreTo.focus();
    };
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={item.title || "인포그래픽"}
      className="fixed inset-0 z-50 flex flex-col bg-[#071a2c]"
    >
      <header className="flex shrink-0 items-center justify-between gap-3 px-4 py-3">
        <p className="min-w-0 truncate text-[14px] font-semibold text-white">
          {item.status === "pending" && (
            <span className="mr-2 rounded bg-white/15 px-1.5 py-0.5 text-[10px] font-bold">
              승인 대기
            </span>
          )}
          {item.title}
        </p>
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="닫기"
          className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            aria-hidden="true"
          >
            <path d="M6 6l12 12M18 6 6 18" />
          </svg>
        </button>
      </header>

      {/* 그림 바깥을 누르면 닫는다. 그림 위를 누른 것은 읽는 중이다. */}
      <div className="flex-1 overflow-y-auto overscroll-contain px-2 pb-6" onClick={onClose}>
        <Image
          src={item.imageUrl}
          alt={item.alt || item.title || "인포그래픽"}
          width={item.width}
          height={item.height}
          sizes={`(max-width: ${item.width}px) 100vw, ${item.width}px`}
          onClick={(e) => e.stopPropagation()}
          className="mx-auto h-auto w-full rounded-card"
          style={{ maxWidth: item.width }}
        />
        {item.authorName && (
          <p className="mt-3 text-center text-[12px] text-white/70">등록 {item.authorName}</p>
        )}
      </div>

      {(onApprove || onRemove) && (
        <footer className="flex shrink-0 justify-end gap-2 border-t border-white/10 px-4 py-3">
          {onRemove && (
            <button
              type="button"
              onClick={onRemove}
              className="rounded-full border border-white/30 px-4 py-2 text-[12px] font-semibold text-white transition-colors hover:bg-white/10"
            >
              내리기
            </button>
          )}
          {onApprove && (
            <button
              type="button"
              onClick={onApprove}
              className="rounded-full bg-white px-4 py-2 text-[12px] font-semibold text-[#071a2c] transition-colors hover:bg-white/85"
            >
              승인하고 싣기
            </button>
          )}
        </footer>
      )}
    </div>
  );
}
