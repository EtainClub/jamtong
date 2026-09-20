"use client";

import { addDoc, collection, serverTimestamp } from "firebase/firestore";

import { firebaseDb } from "./client";

/**
 * 정정·반론 접수 (검토 문서 3장).
 *
 * ★ 피드백과 다른 창구다.
 *   피드백은 사이트에 바라는 것이고 공개가 기능이다. 이쪽은 **실린 내용이
 *   틀렸다는 주장**이다. 공개 게시판에 두면 누구든 남을 두고 쓸 수 있는
 *   자리가 되고, 그 글 자체가 이 사이트가 실은 문장이 된다. 그래서 여기는
 *   운영자에게만 간다.
 *
 * ★ 처리한 결과는 해당 페이지에 적는다.
 *   접수함을 닫아 두는 대신, 고친 것은 그 업적·언행에 드러나야 한다. 이
 *   저장소는 콘텐츠가 git에 있으므로 무엇이 언제 바뀌었는지도 남는다.
 *
 * 로그인을 요구하지 않는다. 틀렸다고 말하려는 사람에게 계정을 먼저 만들게
 * 하면 그 말은 대개 오지 않는다. 익명 계정을 조용히 만들어 붙이고, 그
 * uid는 본인이 접수 여부를 확인하는 데만 쓴다.
 */

export const CORRECTION_KINDS = ["fact", "rebuttal", "takedown"] as const;
export type CorrectionKind = (typeof CORRECTION_KINDS)[number];

export const CORRECTION_KIND_LABEL: Record<CorrectionKind, string> = {
  fact: "사실 정정",
  rebuttal: "반론 게재",
  takedown: "삭제 요청",
};

export const CORRECTION_KIND_HINT: Record<CorrectionKind, string> = {
  fact: "실린 내용이 사실과 다릅니다.",
  rebuttal: "사실 관계와 별개로, 이런 반론을 함께 실어 주십시오.",
  takedown: "실리지 않아야 할 내용입니다.",
};

/** 요청하는 사람이 이 일과 어떤 관계인가. 처리 순서가 달라진다. */
export const CORRECTION_ROLES = ["subject", "related", "reader"] as const;
export type CorrectionRole = (typeof CORRECTION_ROLES)[number];

export const CORRECTION_ROLE_LABEL: Record<CorrectionRole, string> = {
  subject: "글에 나오는 당사자",
  related: "관계자·대리인",
  reader: "읽은 사람",
};

export const CORRECTION_BODY_MAX = 2000;

export interface CorrectionInput {
  /** 어느 화면의 이야기인지. 링크에서 받아 채운다. */
  page: string;
  kind: CorrectionKind;
  role: CorrectionRole;
  /** 무엇이 어떻게 틀렸는지. */
  body: string;
  /** 근거 주소. 없으면 빈 문자열. */
  evidenceUrl: string;
  /** 회신받을 곳. 적지 않아도 접수된다. */
  contact: string;
}

export async function submitCorrection(uid: string, input: CorrectionInput): Promise<void> {
  const db = firebaseDb();
  if (!db) throw new Error("파이어베이스 설정이 없습니다.");

  const body = input.body.trim();
  if (body.length < 10) throw new Error("무엇이 어떻게 틀렸는지 적어 주세요.");
  if (body.length > CORRECTION_BODY_MAX) {
    throw new Error(`${CORRECTION_BODY_MAX}자까지 쓸 수 있습니다.`);
  }

  await addDoc(collection(db, "corrections"), {
    page: input.page.slice(0, 300),
    kind: input.kind,
    role: input.role,
    body,
    evidenceUrl: input.evidenceUrl.trim().slice(0, 500),
    contact: input.contact.trim().slice(0, 200),
    authorUid: uid,
    /* 접수 → 확인 중 → 처리됨. 상태를 옮기는 것은 운영자다. */
    status: "received",
    createdAt: serverTimestamp(),
  });
}
