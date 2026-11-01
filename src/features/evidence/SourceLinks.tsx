import type { ArchivedSource } from "@/content/source-archive";

/**
 * 출처 하나의 링크 줄 — 원문, 보존본, 확인한 날.
 *
 * 원문이 사라졌으면 원문 링크를 앞세우지 않는다. 끊긴 링크를 누르고 빈
 * 화면을 본 사람은 근거가 없다고 읽는다. 그때는 보존본이 원문 자리에 선다.
 *
 * 훅이 없어서 서버와 클라이언트 어디서나 쓴다.
 */
export function SourceLinks({ source, size = "sm" }: { source: ArchivedSource; size?: "xs" | "sm" }) {
  const original = source.url && !source.gone ? source.url : undefined;
  const archived = source.archivedUrl && source.archivedUrl !== source.url ? source.archivedUrl : undefined;
  if (!original && !archived && !source.gone) return null;

  const text = size === "xs" ? "text-[11px]" : "text-sm";
  const link = `inline-flex items-center gap-1 font-medium text-navy underline-offset-2 hover:underline`;

  return (
    <span className={`flex flex-wrap items-center gap-x-3 gap-y-1 ${text}`}>
      {original && (
        <a href={original} target="_blank" rel="noopener noreferrer" className={link}>
          원문 보기<span aria-hidden="true">↗</span>
          <span className="sr-only">(새 창)</span>
        </a>
      )}
      {archived && (
        <a href={archived} target="_blank" rel="noopener noreferrer" className={link}>
          {original ? "보존본" : "보존본으로 보기"}
          <span aria-hidden="true">↗</span>
          <span className="sr-only">(인터넷 아카이브, 새 창)</span>
        </a>
      )}
      {source.gone && <span className="text-[11px] text-pending">원문 링크가 끊겼습니다</span>}
      {source.checkedAt && (
        <span className="tabular text-[11px] text-ash">링크 확인 {source.checkedAt}</span>
      )}
    </span>
  );
}

/**
 * 출처 목록 한 줄 — 『제목』에 링크를 걸고, 곁에 보존본을 단다.
 *
 * 공약·재판처럼 출처를 줄글 목록으로 펴는 자리에서 쓴다. 원문이 사라졌으면
 * 제목이 보존본을 가리키고, 그렇다고 적는다.
 */
export function SourceCitation({ source }: { source: ArchivedSource }) {
  const archived = source.archivedUrl && source.archivedUrl !== source.url ? source.archivedUrl : undefined;
  const href = source.url && !source.gone ? source.url : archived;
  const label = (
    <>
      {source.publisher} 『{source.title}』
    </>
  );
  return (
    <>
      {href ? (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-2 hover:text-smoke"
        >
          {label}
        </a>
      ) : (
        label
      )}
      {source.publishedAt && <span className="tabular"> · {source.publishedAt}</span>}
      {source.gone ? (
        <span className="text-pending"> · 원문 링크 끊김{archived ? ", 보존본으로 연결" : ""}</span>
      ) : (
        archived && (
          <>
            {" · "}
            <a
              href={archived}
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 hover:text-smoke"
            >
              보존본<span className="sr-only">(인터넷 아카이브, 새 창)</span>
            </a>
          </>
        )
      )}
    </>
  );
}
