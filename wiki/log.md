# 위키 기록

무슨 일이 언제 있었는지. append만 한다 — 위쪽 항목을 고치지 않는다.

각 항목은 `## [날짜] 종류 | 제목`으로 시작한다. 그래야
`grep "^## \[" log.md | tail -5`로 최근 다섯 건을 볼 수 있다.

종류는 `ingest` · `query` · `lint` 셋이다.

---

## [2026-09-20] lint | 위키 뼈대를 세우다

`wiki/`, `index.md`, `log.md`를 만들고 `scripts/wiki-ingest.ts`와
`scripts/wiki-lint.ts`를 붙였다. `pnpm check`에 `wiki:lint`를 연결했다.
규약은 `AGENTS.md`의 「LLM Wiki」 절, 설계는 `docs/llm-wiki.md`.

ingest 덤프를 처음 돌려 보고 버그 하나를 잡았다 — 업적은 제 출처를
`achievement.sources`에 들고 있는데 `ALL_SOURCES`만 보고 있었다. 고치기 전에는
모든 1차 자료가 "찾지 못함"으로 떴다. 그대로 ingest했으면 출처 없는 문장이
위키에 쌓일 뻔했다.

## [2026-09-20] ingest | 사법개혁 3법

`achievement/judicial-reform` → [[source/judicial-reform]].
claim 다섯, 1차 자료 넷. 대법관 증원이 2028년 시작이라는 점을 페이지 안에
따로 세워 뒀다 — 「했다」로 읽히면 안 되는 대목이다.

## [2026-09-20] ingest | 검찰개혁

`achievement/prosecution-reform` → [[source/prosecution-reform]].
claim 셋. 시행일(2026-10-02)이 아직 오지 않아 「아직 일어나지 않았다」를
페이지 맨 앞에 뒀다.

## [2026-09-20] ingest | 개혁은 혁명보다 어렵습니다

`words/reform-is-hard` → [[source/words-reform-is-hard]].
사실이 없는 글이라 논지만 따라갔다. 쉽게 보기 토막 여섯을 앵커로 썼다.

이 세 건이 만나 [[concept/reform]]이 생겼다. 검찰개혁·사법개혁·방법론 발언이
한 자리에 모인 것은 이 저장소에서 처음이다 — 사이트에는 이 화면이 없다.
