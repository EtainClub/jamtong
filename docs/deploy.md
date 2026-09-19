# 배포

**Firebase App Hosting** · 프로젝트 `jamtong` · 도메인 `jamtong.kr`

## 왜 App Hosting인가

일반 Hosting은 정적 파일만 올린다. 이 앱은 `/api/ask`가 서버에서 돌아야 해서
안 된다. 나머지는 전부 빌드 때 미리 그려지므로(홈·둘러보기·스토리 3편) 서버가
하는 일은 AI 안내 요청을 받는 것뿐이다.

## 리전

`asia-east1` (대만).

App Hosting은 아직 서울(`asia-northeast3`)을 지원하지 않는다. 쓸 수 있는 곳은
`asia-east1` · `asia-southeast1` · `europe-west4` · `us-central1` · `us-east4` ·
`us-east5`뿐이고, 이 중 한국에서 가장 가깝다. 어차피 대부분의 화면이 CDN에서
나가므로 리전이 걸리는 것은 AI 안내 한 경로다.

## 설정이 있는 곳

`apphosting.yaml` — 인스턴스 상한과 환경변수. 저장소가 진실이다.

```
minInstances 0    평소에 인스턴스를 띄우지 않는다. 첫 요청이 느린 대신 비용이 0
maxInstances 4    동시성 80 × 4 = 동시 320건. 트래픽이 몰려도 요금이 따라 오르지 않는다
```

환경변수는 셋으로 나뉜다.

| | 어디에 | 왜 |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | yaml의 평문, BUILD+RUNTIME | `NEXT_PUBLIC_*`은 빌드 때 코드에 박힌다 |
| `ANTHROPIC_API_KEY` | Secret Manager, RUNTIME | 저장소에 값이 들어가면 안 된다 |
| `ASK_IP_LIMIT` `ASK_DAILY_LIMIT` | yaml의 평문, RUNTIME | 코드를 고치지 않고 조일 수 있어야 한다 |

## 비밀값

```
firebase apphosting:secrets:set ANTHROPIC_API_KEY
firebase apphosting:secrets:grantaccess ANTHROPIC_API_KEY --backend <backend>
```

키를 바꿀 때도 `secrets:set`을 다시 부르면 된다 — 새 버전이 생기고 yaml은
버전을 지정하지 않으므로 다음 배포부터 새 값이 쓰인다.

**마지막 상한은 코드가 아니다.** Anthropic Console에서 이 키에 월 지출 한도를
걸어 두는 것이 유일하게 확실한 천장이다. `ASK_DAILY_LIMIT`은 그 아래 방어선이다.

## 배포되는 방식

App Hosting은 GitHub 저장소를 물고 있다가 지정한 브랜치에 푸시가 들어오면
직접 빌드한다. `firebase deploy`를 부르는 게 아니다.

```
main에 푸시  →  App Hosting이 pnpm install && pnpm build  →  롤아웃
```

그래서 **빌드가 깨지면 배포가 안 된다**가 곧 배포 전 검증이다. 푸시 전에
로컬에서 한 번 돌린다.

```
pnpm check && pnpm build
```

`pnpm check`는 콘텐츠 스키마·근거 무결성·AI 안내 주제 선별·타입·린트를 본다.
근거 없는 주장이 하나라도 들어가면 여기서 막힌다.

## 도메인

`jamtong.kr`은 **whois.co.kr**에서 샀고 네임서버도 거기(`ns1~4.whoisdomain.kr`)를
쓴다. 그래서 레코드는 whois.co.kr의 DNS 관리 화면에서 넣는다.

Firebase Console에서 커스텀 도메인을 추가하면 아래 세 줄을 요구한다.

| 종류 | 호스트 | 값 | 무엇을 증명하나 |
| --- | --- | --- | --- |
| A | `@` (루트) | `35.219.200.56` | 어디로 보낼지 |
| TXT | `@` (루트) | `fah-claim=004-02-d7a847e5-b6be-4318-b89c-731667fb1d11` | 도메인 소유 |
| CNAME | `_acme-challenge_e3n6vrwqcjz45u4s` | `968382eb-2c26-4cc4-931c-88b2c27efae2.3.authorize.certificatemanager.goog.` | 인증서 발급 |

기존 A 레코드 `118.67.131.217`(whois 주차 페이지)은 **지운다.** 남겨 두면
절반은 주차 페이지로 간다.

세 줄이 서로 다른 일을 한다. A만 넣으면 접속은 되지만 인증서가 안 나와 HTTPS가
깨지고, CNAME만 넣으면 소유 증명이 안 된다. 셋 다 필요하다.

### .kr 등록대행사에서 걸리는 지점

밑줄로 시작하는 호스트(`_acme-challenge_…`)를 거부하는 DNS 관리 화면이 있다.
whois.co.kr이 거부하면 네임서버를 Cloud DNS나 Cloudflare로 옮기는 것 말고는
방법이 없다 — 인증서 발급은 Certificate Manager의 DNS 인증을 거치고, 그 이름은
바꿀 수 없다.

### 확인

```
firebase apphosting:backends:get jamtong --project jamtong
```

또는 상태를 직접 본다.

```
curl -s "https://firebaseapphosting.googleapis.com/v1beta/projects/jamtong/locations/asia-east1/backends/jamtong/domains" \
  -H "Authorization: Bearer $(gcloud auth print-access-token)"
```

`ownershipState: OWNERSHIP_VERIFIED` · `certState: CERT_ACTIVE` · `hostState: HOST_ACTIVE`
셋이 다 되면 끝이다. 전파에 길게는 하루가 걸린다.

## 아직 안 된 것

- `daejangdong` · `stock-market` 두 편은 `draft`다. 미검증 주장이 각각 7건,
  10건 있고 화면에 그렇게 표시된다. 1차 출처를 붙이기 전까지는 이 상태다.
- OG 이미지가 없다. 링크를 공유하면 카드가 뜨지 않는다.
