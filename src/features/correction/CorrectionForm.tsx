"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";

import { useAuth } from "@/lib/firebase/auth";
import {
  CORRECTION_BODY_MAX,
  CORRECTION_KINDS,
  CORRECTION_KIND_HINT,
  CORRECTION_KIND_LABEL,
  CORRECTION_ROLES,
  CORRECTION_ROLE_LABEL,
  submitCorrection,
  type CorrectionKind,
  type CorrectionRole,
} from "@/lib/firebase/corrections";

/**
 * 정정·반론 접수 양식.
 *
 * 어느 화면의 이야기인지는 링크가 `?page=`로 들고 온다. 서버에서 읽지 않고
 * 여기서 읽는 이유는 이 페이지를 빌드 때 구워 두기 위해서다 — 쿼리를
 * 서버에서 읽는 순간 매 요청 렌더링이 된다.
 */
export function CorrectionForm() {
  const params = useSearchParams();
  const { ensureUser, configured } = useAuth();

  const [page, setPage] = useState(params.get("page") ?? "");
  const [kind, setKind] = useState<CorrectionKind>("fact");
  const [role, setRole] = useState<CorrectionRole>("reader");
  const [body, setBody] = useState("");
  const [evidenceUrl, setEvidenceUrl] = useState("");
  const [contact, setContact] = useState("");
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    setSending(true);
    setError(null);
    try {
      const account = await ensureUser();
      if (!account) throw new Error("접수를 준비하지 못했습니다.");
      await submitCorrection(account.uid, { page, kind, role, body, evidenceUrl, contact });
      setDone(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "접수하지 못했습니다.");
    } finally {
      setSending(false);
    }
  };

  if (!configured) {
    return (
      <p className="mt-6 rounded-card border border-stone bg-taupe px-4 py-3 text-[13px] text-smoke">
        이 환경에는 접수 설정이 없습니다. 저장소의 이슈로 알려 주세요.
      </p>
    );
  }

  if (done) {
    return (
      <div className="mt-6 rounded-card border border-stone bg-taupe px-5 py-5">
        <p className="text-[15px] font-semibold text-ink">접수했습니다.</p>
        <p className="mt-2 text-[13px] leading-relaxed text-smoke">
          확인한 뒤 고칠 것은 고치고, 고치지 않기로 하면 왜 그런지 남깁니다.
          연락처를 적으셨으면 결과를 그리로 보냅니다.
        </p>
      </div>
    );
  }

  const over = body.length > CORRECTION_BODY_MAX;

  return (
    <div className="mt-6 rounded-card border border-stone bg-taupe px-5 py-5">
      <fieldset>
        <legend className="text-[12px] font-bold text-ink">무엇을 요청하십니까</legend>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {CORRECTION_KINDS.map((k) => (
            <button
              key={k}
              type="button"
              onClick={() => setKind(k)}
              aria-pressed={k === kind}
              className={`rounded-full px-3 py-1.5 text-[12px] font-semibold transition-colors ${
                k === kind
                  ? "bg-ink text-eggshell"
                  : "border border-stone text-smoke hover:border-graphite hover:text-ink"
              }`}
            >
              {CORRECTION_KIND_LABEL[k]}
            </button>
          ))}
        </div>
        <p className="mt-2 text-[12px] text-ash">{CORRECTION_KIND_HINT[kind]}</p>
      </fieldset>

      <fieldset className="mt-5">
        <legend className="text-[12px] font-bold text-ink">이 일과의 관계</legend>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {CORRECTION_ROLES.map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRole(r)}
              aria-pressed={r === role}
              className={`rounded-full px-3 py-1.5 text-[12px] font-semibold transition-colors ${
                r === role
                  ? "bg-ink text-eggshell"
                  : "border border-stone text-smoke hover:border-graphite hover:text-ink"
              }`}
            >
              {CORRECTION_ROLE_LABEL[r]}
            </button>
          ))}
        </div>
      </fieldset>

      <label htmlFor="co-page" className="mt-5 block text-[12px] font-bold text-ink">
        어느 화면입니까
      </label>
      <input
        id="co-page"
        type="text"
        value={page}
        onChange={(e) => setPage(e.target.value)}
        placeholder="/achievement/daejangdong"
        className="mt-2 w-full rounded-card border border-stone bg-canvas px-3.5 py-2.5 text-[14px] text-ink placeholder:text-ash focus:border-graphite focus:outline-none"
      />

      <label htmlFor="co-body" className="mt-5 block text-[12px] font-bold text-ink">
        무엇이 어떻게 틀렸습니까
      </label>
      <textarea
        id="co-body"
        value={body}
        onChange={(e) => setBody(e.target.value)}
        rows={6}
        placeholder="실린 문장과 사실이 어떻게 다른지 적어 주세요. 반론 게재라면 실어야 할 반론을 그대로 적어 주세요."
        className="mt-2 w-full resize-y rounded-card border border-stone bg-canvas px-3.5 py-3 text-[14px] leading-relaxed text-ink placeholder:text-ash focus:border-graphite focus:outline-none"
      />
      <p className={`mt-1 tabular text-[11px] ${over ? "text-burgundy" : "text-ash"}`}>
        {body.length} / {CORRECTION_BODY_MAX}
      </p>

      <label htmlFor="co-src" className="mt-4 block text-[12px] font-bold text-ink">
        근거 주소 <span className="font-normal text-ash">(있으면)</span>
      </label>
      <input
        id="co-src"
        type="url"
        value={evidenceUrl}
        onChange={(e) => setEvidenceUrl(e.target.value)}
        placeholder="https://"
        className="mt-2 w-full rounded-card border border-stone bg-canvas px-3.5 py-2.5 text-[14px] text-ink placeholder:text-ash focus:border-graphite focus:outline-none"
      />

      <label htmlFor="co-contact" className="mt-4 block text-[12px] font-bold text-ink">
        회신받을 곳 <span className="font-normal text-ash">(적지 않아도 접수됩니다)</span>
      </label>
      <input
        id="co-contact"
        type="text"
        value={contact}
        onChange={(e) => setContact(e.target.value)}
        placeholder="이메일 또는 연락처"
        className="mt-2 w-full rounded-card border border-stone bg-canvas px-3.5 py-2.5 text-[14px] text-ink placeholder:text-ash focus:border-graphite focus:outline-none"
      />

      {error && <p className="mt-4 text-[13px] text-burgundy">{error}</p>}

      <button
        type="button"
        onClick={() => void submit()}
        disabled={sending || over || body.trim().length < 10}
        className="mt-5 w-full rounded-full bg-ink px-5 py-3 text-sm font-semibold text-eggshell transition-opacity disabled:opacity-40"
      >
        {sending ? "보내는 중…" : "접수하기"}
      </button>
    </div>
  );
}
