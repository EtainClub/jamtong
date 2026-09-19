# 쇼츠 대본

업적 하나에 쇼츠 하나. 구성요소 ⑦이다.

## 왜 저장소에 두는가

대본이 근거에서 나온다. 업적 파일의 claim이 바뀌면 대본의 숫자도 바뀌어야 하고,
그 변경이 PR로 남아야 한다. 대본을 노트북이나 메신저에 흩어 두면 영상과 사이트가
조용히 어긋난다 — 영상은 한 번 올리면 고치기 어렵기 때문에 더 위험하다.

## 대본이 지키는 것

1. **숫자마다 claim id를 단다.** 영상에서 말한 수치는 전부 사이트에서 근거를
   열어볼 수 있어야 한다. 대본에 claim id가 없는 문장은 넣지 않는다.
2. **확인되지 않은 수식어를 쓰지 않는다.** "전국 최초", "사상 최대" 같은 말은
   claim으로 확인된 것만 쓴다.
3. **남의 몫을 가져오지 않는다.** 시작이나 완성이 다른 시정이면 그렇게 말한다.
   짧은 영상일수록 이 부분이 잘려 나가기 쉽고, 잘리면 통째로 공격받는다.
4. **마지막에 주소를 남긴다.** 영상은 40~60초다. 근거를 다 담을 수 없으므로
   담을 수 있는 곳으로 보낸다.

## 만드는 흐름

```
대본(이 폴더) → NotebookLM 영상 개요 생성 → 유튜브 쇼츠 업로드
             → 업적 파일의 shorts[]에 youtubeId 등록
```

각 파일의 「NotebookLM 소스」를 통째로 붙여 넣고, 「커스터마이즈 프롬프트」를
지시문 칸에 넣는다. 생성된 영상은 초안이므로 대본의 숫자와 대조한 뒤 올린다.

## 목록

| 업적 | 대본 | 상태 |
| --- | --- | --- |
| 성남시 3대 무상복지 | [seongnam-welfare.md](seongnam-welfare.md) | 등록됨 |
| 성남시 모라토리엄 | [seongnam-debt.md](seongnam-debt.md) | 등록됨 |
| 성남시의료원 | [seongnam-hospital.md](seongnam-hospital.md) | 영상 없음 |
| 성남시 무상급식 | [seongnam-meals.md](seongnam-meals.md) | 등록됨 |
| 경기도 청정계곡 | [gyeonggi-valley.md](gyeonggi-valley.md) | 등록됨 |
| 경기도 재난기본소득 | [gyeonggi-basic-income.md](gyeonggi-basic-income.md) | 등록됨 |
| 경기도 신천지 대응 | [gyeonggi-shincheonji.md](gyeonggi-shincheonji.md) | 등록됨 |
| 경기도 수술실 CCTV | [gyeonggi-or-cctv.md](gyeonggi-or-cctv.md) | 등록됨 |
| 경기도 건설 불공정 단속 | [gyeonggi-construction.md](gyeonggi-construction.md) | 등록됨 |
| 경기도 아동급식 | [gyeonggi-child-meal.md](gyeonggi-child-meal.md) | 등록됨 |
| 경기도 극저신용대출 | [gyeonggi-microloan.md](gyeonggi-microloan.md) | 등록됨 |
| 경기도 위안부 피해자 지원 | [gyeonggi-comfort-women.md](gyeonggi-comfort-women.md) | 등록됨 |
| 일산대교 무료화 | [gyeonggi-ilsan-bridge.md](gyeonggi-ilsan-bridge.md) | 등록됨 |
| 검찰개혁 | [prosecution-reform.md](prosecution-reform.md) | 영상 없음 |
| 사법개혁 3법 | [judicial-reform.md](judicial-reform.md) | 영상 없음 |
| KTX·SRT 통합 | [rail-merger.md](rail-merger.md) | 영상 없음 |
| 핵추진잠수함 건조 승인 | [nuclear-submarine.md](nuclear-submarine.md) | 영상 없음 |
| 핵심광물 공급망 외교 | [resource-diplomacy.md](resource-diplomacy.md) | 영상 없음 |
| 원유 수입처 다변화 | [oil-supply.md](oil-supply.md) | 영상 없음 |

「등록됨」은 업적 파일의 `shorts[]`에 youtubeId가 들어간 것이다. 북극항로·대장동·
주식시장은 대본을 거치지 않고 영상이 먼저 올라간 것이라 이 표에 없다.
