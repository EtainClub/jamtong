# 위키 카탈로그

이 위키의 모든 페이지가 여기 있다. 질문에 답하기 전에 이 파일을 먼저 읽고,
관련 있는 페이지로 들어간다.

규약은 `AGENTS.md`의 「LLM Wiki」 절에, 설계는 `docs/llm-wiki.md`에 있다.
이 파일은 사람이 고치지 않는다 — ingest할 때 에이전트가 갱신한다.

---

## 개념 (concept)

여러 소스에 걸친 이야기가 모이는 곳. 이 위키의 값어치는 대부분 여기 있다.

- [[concept/announced-vs-done]] — 발표된 것과 일어난 것. **국정 업적을 읽기
  전에 이 페이지를 먼저 본다.**
- [[concept/reform]] — 개혁. 무엇이 언제 바뀌었는가.
- [[concept/power-and-responsibility]] — 권한과 책임. 왜 그런 모양으로
  쪼개는가.
- [[concept/local-to-national]] — 지방에서 시작해 전국으로. 어떤 경로로
  퍼졌는가, 그리고 퍼지지 않은 것.
- [[concept/stigma]] — 낙인을 지우는 설계. 주는 양이 아니라 받는 방식.

## 소스 (source)

raw source 한 건 = 페이지 한 장. 업적과 대통령 언행만 들어온다.
**업적 22건은 모두 들어왔다.**

### 국정 — 제도

- [[source/prosecution-reform]] — 검찰개혁. 수사·기소 분리, 2026-10-02 시행 예정.
- [[source/judicial-reform]] — 사법개혁 3법. 법왜곡죄·재판소원·대법관 증원.
- [[source/stock-market]] — 주식시장 개선. 상법 두 건은 시행, 지수는 되밀렸다.
- [[source/rail-merger]] — KTX·SRT 통합. 2026-09-01 통합 운행.

### 국정 — 외교·산업

- [[source/nuclear-submarine]] — 핵추진잠수함. 승인은 났고 연료는 협상 중.
- [[source/resource-diplomacy]] — 핵심광물 공급망 외교. 74건 중 대부분이 MOU.
- [[source/oil-supply]] — 원유 수입처 다변화. 중동산 71.5% → 62.8%.
- [[source/arctic-route]] — 북극항로. 거의 전부가 계획이다.

### 경기도지사

- [[source/gyeonggi-basic-income]] — 재난기본소득. 세 차례, 지역화폐로.
- [[source/gyeonggi-or-cctv]] — 수술실 CCTV. 안성병원에서 의료법까지 3년.
- [[source/gyeonggi-valley]] — 청정계곡. 1,576개 정비, 96%가 자진철거.
- [[source/gyeonggi-child-meal]] — 아동급식. 4,500원 → 8,000원, 카드 모양까지.
- [[source/gyeonggi-microloan]] — 극저신용대출. 연 1%, 광역 중 유일.
- [[source/gyeonggi-shincheonji]] — 신천지 대응. 강제 역학조사로 명단 4만 2천.
- [[source/gyeonggi-construction]] — 건설 불공정 단속. 원가 공개와 페이퍼컴퍼니.
- [[source/gyeonggi-comfort-women]] — 위안부 피해자 지원. 월 203 → 293만 원.
- [[source/gyeonggi-ilsan-bridge]] — 일산대교 무료화. 22일, 그리고 패소.

### 성남시장

- [[source/seongnam-welfare]] — 3대 무상복지. 중앙정부가 막아섰고 소는 취하됐다.
- [[source/seongnam-meals]] — 무상급식. 세 시정이 이어서 한 일.
- [[source/seongnam-hospital]] — 시의료원. 시민이 발의하고 17년.
- [[source/seongnam-debt]] — 모라토리엄. 7,285억을 3년 6개월에.
- [[source/daejangdong]] — 판교대장 도시개발사업. 공공용지 53.5%, 환수는 CLAIM.

### 언행

- [[source/words-reform-is-hard]] — 「개혁은 혁명보다 어렵습니다」 2026-09-12.
- [[source/words-power-responsibility]] — 「책임과 권력」 2026-03-07.
- [[source/words-sports-reform]] — 「인사가 만사임이…」 2026-06-28.
- [[source/words-constitution]] — 「개헌에 대한 제 입장은…」 2026-08-14.
- [[source/words-noh-acquittal]] — 「노웅래 선배님, 죄송합니다」 2026-08-21.

## 인물·기관 (entity)

아직 없다.

## 사건 (event)

아직 없다.

## 종합 (synthesis)

질문의 답을 되돌려 적는 곳. 아직 없다.

---

## 진행 상황

raw source 37건 가운데 27건이 들어왔다. **업적 22건은 전부 끝났고, 남은
10건은 모두 언행이다.** 목록은 `pnpm wiki:ingest --list`.
