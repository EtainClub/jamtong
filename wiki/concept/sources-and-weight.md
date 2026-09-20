---
title: 자료의 무게
kind: concept
updated: 2026-09-20
---

# 자료의 무게

앵커가 있다고 다 같은 근거가 아니다. **이 페이지는 위키가 어떤 자료를
어떤 무게로 쓰는지, 그리고 지금까지 그 판단을 어디서 내렸는지를 모은다.**
^[source:src-book]

세운 이유는 하나다. 같은 판단을 다음 ingest에서 다시 하지 않기 위해서다.
^[source:src-namu-ib]

## raw의 `type`은 무게를 구분하지 못한다

업적이 들고 있는 출처 레코드에는 `type` 필드가 있고 `press`가 83건으로 가장
많다. 그런데 **지지자가 정리한 책도, 나무위키도 `type: "press"`로 들어가
있다.** ^[source:src-book] ^[source:src-namu-ib]

기계는 둘을 신문 보도와 같은 칸에 넣는다. 그래서 무게는 위키가 따로 잰다.
^[source:src-book]

## 위키가 쓰는 네 층

| 층 | 무엇 | 예 |
|---|---|---|
| 1 | 법령·판결 | 상법 개정 이유 ^[stock-market#claim-duty] |
| 2 | 정부·공공기관 문서, 공보 | 해수부 업무계획 ^[source:src-mof-2026] · 비전성남 ^[source:src-snvision-2018] · 성남도시개발공사 ^[source:src-isdc-daejang] |
| 3 | 언론 보도 | 한국일보 ^[source:src-press-2014] · 경향신문 ^[source:src-khan-pr-2026] |
| 4 | 위키·지지자 정리본 | 나무위키 ^[source:src-namu-ib] · 『밍밍 잼칠라 이장님』 ^[source:src-book] |

**4층은 단독 근거로 쓰지 않는다.** ^[source:src-book] 같은 사실이 1~3층에서 확인될 때만
곁들이고, 확인되지 않으면 그 사실을 그렇게 적는다.

여기에 **가로지르는 축**이 하나 더 있다 — 층과 무관하게, 그 일을 한 쪽이
스스로 낸 수치는 CLAIM이다([[concept/announced-vs-done]]의 마지막 절).
^[gyeonggi-construction#claim-poll]

## 4층이 어디에 얼마나 들어와 있나

지지자가 정리한 책은 **업적 13건**에 출처로 달려 있다(레코드 13개).
^[source:src-book] ^[source:src-book-2] ^[source:src-book-6]
^[source:src-book-7] ^[source:src-book-9] ^[source:src-book-12]
^[source:src-book-17] ^[source:src-book-28] ^[source:src-book-30]
^[source:src-book-51] ^[source:src-book-54] ^[source:src-book-61]
^[source:src-book-67]

책 스스로 「오류를 범하지 않기 위해 다양한 기사와 공보를 확인하였고 (…)
실수가 있을 수 있고 개인적인 해석임을 이해 부탁드립니다」라고 적는다.
^[source:src-book] **그 단서를 위키도 그대로 받는다.**

## 그래서 실제로 무엇을 했나

### 수치를 고쳐 실은 곳 — 셋

| 책이 적은 것 | 자료가 말하는 것 | 어디 |
|---|---|---|
| 무료화 28일 | **22일** ^[gyeonggi-ilsan-bridge#claim-back] | [[source/gyeonggi-ilsan-bridge]] |
| 취임 3년 만에 5,400억 청산 | **3년 6개월에 7,285억** ^[seongnam-debt#claim-graduation] | [[source/seongnam-debt]] |
| 3차 재난기본소득 = 모든 도민 | **소득상위 12%, 253만 7천 명** ^[gyeonggi-basic-income#claim-third] | [[source/gyeonggi-basic-income]] |

**틀린 수는 출처가 무엇이든 고쳐 싣는다.** ^[source:src-book-67]
^[source:src-book-54]

### 수식어를 받지 않은 곳 — 둘

- 「전국 최초 초중고 친환경 무상급식」 — 무엇을 기준으로 최초인지에 따라
  답이 갈려 **위키는 주장하지 않는다.** ^[seongnam-meals#claim-start]
  ^[source:src-book]
- 「설치 반대하는 이유의 타당성을 찾지 못했다」·「아무도 못 건드렸던
  신천지」 — **그 책의 평가이고 위키가 물려받지 않는다.**
  ^[source:src-book-9] ^[source:src-book-7]

### 4층이 유일한 근거인 곳 — 셋

여기가 이 페이지에서 가장 중요한 목록이다. **갈아 끼울 자리다.**
^[source:src-namu-ib]

- 일산대교 집행정지 인용(2021-11-15) — 나무위키.
  ^[gyeonggi-ilsan-bridge#claim-stay] ^[source:src-namu-ib]
- 일산대교 징수 재개(2021-11-18) — 나무위키.
  ^[gyeonggi-ilsan-bridge#claim-back] ^[source:src-namu-ib]
- 베를린 소녀상 철거 철회 요청 서한(2020) — 지지자 책.
  ^[gyeonggi-comfort-women#claim-berlin] ^[source:src-book-61]

앞의 둘은 날짜 자체가 패소 확정 보도와 어긋나지 않지만,
^[gyeonggi-ilsan-bridge#claim-final] 1차 자료로는 약하다.
^[source:src-namu-ib]

## 말은 말의 근거일 뿐이다

언행 소스는 층이 다른 문제다. 원문이 무수정으로 보존되고 인용문이 원문에
실재해야 빌드가 통과하므로 **「그렇게 말했다」의 근거로는 1층에 가깝다.**
^[words:reform-is-hard]

그러나 **「그래서 그렇게 됐다」의 근거는 되지 못한다.** 여러 페이지가 같은
문장을 적어 뒀다 — 이 글을 근거로 「절차를 지켰다」를 쓰면 안 된다,
^[words:reform-is-hard#r-how] 「조정하고 타협했다」를 쓰면 안 된다,
^[words:power-responsibility#pr-talk] 말이 이력을 증명하지 않는다.
^[words:wish]

## raw에 되돌릴 것 (Phase 4 후보)

`docs/llm-wiki.md` §9 Phase 4는 위키가 발견한 것을 raw 수정 **목록으로** ^[source:src-book]
돌려주라고 한다. 위키가 고치지는 않는다.

- 출처 레코드의 `type`에 위키·정리본을 가릴 값이 없다. 지금은 책과
  나무위키가 `press`다. ^[source:src-book] ^[source:src-namu-ib]
- 위 「유일한 근거」 셋은 자료를 보강하거나 claim을 내리는 것이 낫다.
  ^[gyeonggi-comfort-women#claim-berlin]

## 관련

- [[concept/announced-vs-done]]
- [[synthesis/lint-2026-09-20]]
