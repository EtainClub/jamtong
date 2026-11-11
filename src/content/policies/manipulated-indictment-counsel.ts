import type { PolicyInput } from "./schema";

/**
 * 조작기소 특검법 — 수사 대상 12건의 구성과 공소취소 조항 삭제 경위.
 *
 * 2026년 11월 4일 시사 요약 인스타그램 계정이 "수사 대상 12건 중 8건이 이재명 대통령 관련
 * 사건", "대통령이 기자회견에서 공소취소 조항을 빼 달라고 하자 소위에서 삭제할 방침"이라고
 * 올렸다(신고 센터 factbot-gap #220·#221). 원안과 법사위 수정안을 나눠 적는다.
 *
 * ★ '이 대통령 관련 사건'을 몇 건으로 세느냐는 보도마다 다르다. 원안은 8건(서울신문 계열
 *   보도·국민의힘 지적)으로, 수정안은 7건(경향신문)으로 셌다. 9건으로 센 보도(중앙일보)도
 *   검색에 나왔지만 원문이 내려가 대조하지 못해 싣지 않았다. 누가 그렇게 셌는지 적는다.
 * ★ 법안 원문(의안정보시스템)은 대조하지 못했다. 조문 내용은 보도로 적고 gaps에 남긴다.
 * ★ 재판 중단과 9월 18일 대통령 요청의 맥락은 policy:trial-suspension에 있다.
 * ★ 2026-11-05 처음 등록 — factbot-gap #220·#221.
 *   2026-11-10 factbot-gap #280('여당 의원 105명이 李공취모 출범')을 더했다. 특검법 이전, 2월 23일
 *   출범한 민주당 의원 모임이다. 정부 기구가 아니라 의원들의 모임이며, 숫자는 출범 당일 보도 기준이다.
 *   2026-11-11 11월 6일 본회의 가결과 공포 일정(11월 17일 국무회의 상정 예정)을 더했다.
 */
export const MANIPULATED_INDICTMENT_COUNSEL: PolicyInput = {
  slug: "manipulated-indictment-counsel",
  title: "조작기소 특검법 — 수사 대상과 공소취소 조항",
  scope:
    "2026년 2월 23일 출범한 민주당 '공소취소 모임(공취모)'의 규모와 요구, 2026년 4월 30일 발의된 조작기소 특검법의 수사 대상 12건 구성, 공소취소 권한 조항이 9월 대통령 요청 뒤 11월 4일 법사위 소위 수정안에서 삭제된 경위, 11월 6일 본회의 가결과 공포 일정까지",
  ministries: ["국회 법제사법위원회"],
  categories: ["institution"],
  asOf: "2026-11-11",
  rumors: [
    {
      id: "rumor-105",
      text: "여당 의원 105명이 공소취소를 추진하는 모임(李공취모)을 출범시켰다",
      claimIds: ["claim-caucus-launch", "claim-caucus-demands", "claim-caucus-departures", "claim-caucus-party", "claim-caucus-opposition"],
    },
    {
      id: "rumor-eight-of-twelve",
      text: "조작기소 특검법의 수사 대상 12건 중 8건이 이재명 대통령 관련 사건이다",
      claimIds: ["claim-original-list", "claim-count-differs", "claim-revised-scope", "claim-revised-count", "claim-passed"],
    },
    {
      id: "rumor-clause-removed",
      text: "대통령이 기자회견에서 공소취소 조항을 빼 달라고 하자 소위에서 삭제할 방침이다",
      claimIds: ["claim-original-power", "claim-president-request", "claim-subcommittee", "claim-chair", "claim-opposition"],
    },
  ],
  claims: [
    {
      id: "claim-caucus-launch",
      text:
        "더불어민주당 의원들의 '이재명 대통령 사건 공소취소와 국정조사 추진을 위한 의원모임(공취모)'이 2026년 2월 23일 출범했다. 참여 의원은 현역 민주당 의원 162명의 64.8%인 " +
        "105명으로 보도됐고, 출범식에는 약 60명이 참석했다. 상임대표는 박성준 의원, 간사는 이건태 의원이다. 정청래 대표와 이성윤 최고위원은 참여하지 않았다.",
      assertionType: "FACT",
      sourceIds: ["src-news1-20260223", "src-imbc-20260223", "src-sedaily-20260223"],
      verified: true,
    },
    {
      id: "claim-caucus-demands",
      text:
        "공취모는 출범식에서 대장동·쌍방울 대북송금·위증교사 사건 등을 검찰의 조작기소로 보고 즉각 공소취소를 촉구하며, 조작기소 의혹에 대한 국정조사와 검찰권 남용을 막는 " +
        "제도 개혁을 추진한다고 결의했다. 박성준 상임대표는 \"최종 목적은 공소취소\"라고 말했다.",
      assertionType: "CLAIM",
      assertedBy: "공취모(민주당 의원 모임)",
      sourceIds: ["src-news1-20260223", "src-imbc-20260223", "src-segye-20260225"],
      verified: true,
    },
    {
      id: "claim-caucus-departures",
      text:
        "105명은 출범 당일 숫자다. 김병주 의원은 사조직이나 계파 모임으로 오해받을 수 있다며 출범 즈음 탈퇴했고, 2월 25일에는 민형배·김기표·부승찬 의원이 탈퇴 의사를 밝혔다. " +
        "최민희 의원은 모임 해체를 요구했다.",
      assertionType: "FACT",
      sourceIds: ["src-news1-20260223", "src-segye-20260225"],
      verified: true,
    },
    {
      id: "claim-caucus-party",
      text:
        "민주당 지도부는 2026년 2월 25일 최고위원회의에서 이 대통령 사건 조작기소 진상규명과 공소취소를 위한 국정조사 추진 특별위원회 설치를 의결하고, 공취모를 당 공식기구로 " +
        "흡수하겠다고 밝혔다. 박성준 상임대표는 공소취소 때까지 모임을 유지할 필요가 있다고 했다.",
      assertionType: "FACT",
      sourceIds: ["src-segye-20260225"],
      verified: true,
    },
    {
      id: "claim-caucus-opposition",
      text:
        "국민의힘은 민주당 최대 모임이 대통령 공소취소를 위해 만들어졌다며 \"대통령 방탄을 위해 헌법을 외면했다\"고 비판하고 재판 재개를 촉구했다. 장동혁 대표는 \"미친 짓\"이라고 했다.",
      assertionType: "CLAIM",
      assertedBy: "국민의힘",
      sourceIds: ["src-imbc-20260223"],
      verified: true,
    },
    {
      id: "claim-original-list",
      text:
        "더불어민주당 천준호 의원이 2026년 4월 30일 대표발의한 원안은 수사 대상을 12개 사건으로 정했다. 보도에 " +
        "따르면 이 가운데 대장동·위례·백현동·성남FC·쌍방울 대북송금·경기도 법인카드·허위사실공표·위증교사 사건은 " +
        "'이 대통령 관련 사건의 수사권·공소권 남용 범죄 의혹'으로 묶였고, 나머지는 김용 전 민주연구원 부원장 " +
        "금품수수, 서해 공무원 피격, 문재인 정부 통계 조작 의혹, 윤석열 명예훼손 혐의 허위 보도 의혹 사건이다.",
      assertionType: "FACT",
      sourceIds: ["src-twig-20260430"],
      verified: true,
    },
    {
      id: "claim-count-differs",
      text:
        "원안의 '이 대통령 관련 사건'을 위 보도는 8건으로 셌고, 국민의힘도 11월 4일 법사위에서 12개 가운데 8개가 " +
        "이 대통령 관련이라고 문제 삼았다. 다만 12개 항목을 어떻게 나누고 묶느냐에 따라 숫자가 달라지며, 법안 " +
        "조문이 '대통령 관련'이라는 분류를 따로 두는지는 확인하지 못했다.",
      assertionType: "FACT",
      sourceIds: ["src-twig-20260430", "src-fn-20261104"],
      verified: true,
    },
    {
      id: "claim-original-power",
      text:
        "원안은 특검에게 재판 중인 사건의 이첩을 요구할 권한과 공소 제기·유지 권한을 주었다. 직무 범위에 " +
        "'공소유지 여부의 결정'이 들어 있어, 대선 뒤 멈춘 이 대통령 사건의 공소를 특검이 취소할 수 있다는 " +
        "해석이 나왔다.",
      assertionType: "FACT",
      sourceIds: ["src-twig-20260430", "src-jkn-20261104"],
      verified: true,
    },
    {
      id: "claim-president-request",
      text:
        "이 대통령은 2026년 9월 18일 기자회견에서 국회에 \"기존 기소 사건들에 대한 이송 또는 처분에 관한 " +
        "조항들은 삭제하고 진상 규명에만 집중해 주시기 바란다\"고 요청했다.",
      assertionType: "CLAIM",
      assertedBy: "이재명 대통령",
      sourceIds: ["src-inews-20261028"],
      verified: true,
    },
    {
      id: "claim-subcommittee",
      text:
        "국회 법제사법위원회는 2026년 11월 4일 특검법을 상정해 법안심사제1소위원회에 회부했고, 소위는 같은 날 " +
        "수정안을 의결했다. 수정안은 특검 직무 범위에서 '공소유지 여부의 결정'을 지우고, 검사가 수사·기소하거나 " +
        "공소를 유지 중인 사건의 이첩을 요구하는 조항을 뺐다. 법사위 전체회의는 그날 국민의힘 의원들이 퇴장한 " +
        "가운데 법안을 가결했다.",
      assertionType: "FACT",
      sourceIds: ["src-fn-20261104", "src-jkn-20261104", "src-hankook-20261104", "src-mediatoday-20261105"],
      verified: true,
    },
    {
      id: "claim-chair",
      text:
        "김의겸 소위원장은 \"공소취소 여부 관련된 부분은 저희가 말끔히 삭제했다\"고 말했다. 서영교 법사위원장은 " +
        "대통령 공소취소 내용은 소위에서 아예 빼는데 공소취소 법안이라고 하는 것은 허위 사실이라고 했다.",
      assertionType: "CLAIM",
      assertedBy: "더불어민주당 법사위원",
      sourceIds: ["src-hankook-20261104", "src-fn-20261104"],
      verified: true,
    },
    {
      id: "claim-revised-scope",
      text:
        "수정안에서 수사 대상은 12개로 유지됐지만 범위는 넓어졌다. 탈북 어민 강제북송, 문재인 전 대통령 사위의 " +
        "취업 관련 뇌물수수, 사드 기밀 유출, 월성원전 1호기 경제성 조작 의혹이 새로 들어갔다. 김의겸 소위원장은 " +
        "특정인만을 위한 수사 대상이라는 비판을 고려했다고 설명했다.",
      assertionType: "FACT",
      sourceIds: ["src-jkn-20261104", "src-hankook-20261104"],
      verified: true,
    },
    {
      id: "claim-revised-count",
      text:
        "경향신문은 수정안의 12개를 이 대통령 관련 7개(대장동·위례·백현동, 성남FC, 쌍방울 대북송금 등)와 문재인 " +
        "정부 관련 5개(서해 공무원 피격, 통계조작, 사위 특혜 채용, 탈북 어민 북송, 월성원전)로 나눴다. 수정안 " +
        "조문을 직접 대조하지는 못했다.",
      assertionType: "FACT",
      sourceIds: ["src-khan-20261105"],
      verified: true,
    },
    {
      id: "claim-structure",
      text:
        "수정안에서도 특검은 여당·제1야당·비교섭단체가 추천한 후보 가운데 대통령이 한 명을 임명한다. 특검팀은 " +
        "파견검사 20명(원안 30명)을 포함해 309명이고, 준비 20일과 수사 180일을 합쳐 최장 200일 활동한다.",
      assertionType: "FACT",
      sourceIds: ["src-jkn-20261104", "src-hankook-20261104"],
      verified: true,
    },
    {
      id: "claim-opposition",
      text:
        "국민의힘 박형수 의원은 \"국회가 대통령 하수인인가\"라며 '이 대통령 구하기, 죄 없애주기 법안'이라고 " +
        "했고, 장동혁 대표는 공소취소 조항을 뺐다는 말이 거짓이며 우회로가 남아 있다고 주장했다. 기소 사건의 " +
        "이해당사자인 대통령이 특검을 임명하는 구조도 박형수 의원이 \"심각한 이해충돌\"이라고 비판했다.",
      assertionType: "CLAIM",
      assertedBy: "국민의힘",
      sourceIds: ["src-fn-20261104", "src-mediatoday-20261105"],
      verified: true,
    },
    {
      id: "claim-plenary",
      text:
        "특검법은 2026년 11월 5일 본회의에 상정됐고 국민의힘은 바로 필리버스터(무제한 토론)에 들어갔다. 민주당은 " +
        "같은 날 토론 종결 동의안을 냈으며, 24시간 뒤인 6일 종결 표결을 거쳐 법안을 표결할 계획이다.",
      assertionType: "FACT",
      sourceIds: ["src-khan-20261105", "src-newspim-20261105"],
      verified: true,
    },
    {
      id: "claim-passed",
      text:
        "특검법은 2026년 11월 6일 국회 본회의에서 재석 168명 가운데 찬성 167명, 반대 1명으로 가결됐다. " +
        "국민의힘은 표결에 참여하지 않았다. 특검 후보는 민주당·국민의힘·조국혁신당이 1명씩 추천하고, " +
        "이 대통령이 그 가운데 1명을 임명한다.",
      assertionType: "FACT",
      sourceIds: ["src-fn-20261106", "src-newspim-20261110"],
      verified: true,
    },
    {
      id: "claim-promulgation",
      text:
        "청와대는 11월 17일 국무회의에 특검법 공포안을 올려 심의·의결할 예정이라고 밝혔다. 대통령은 공포하거나 " +
        "국회에 재의를 요구할 수 있으며, 2026년 11월 10일 보도 기준으로 결정은 나오지 않았다.",
      assertionType: "FACT",
      sourceIds: ["src-newspim-20261110"],
      verified: true,
    },
    {
      id: "claim-residual-power",
      text:
        "법사위 수정안에서 공소유지 여부 결정·이첩 요구 조항은 빠졌지만, 특검법 6조 7항이 형사소송법상 검사 " +
        "권한 규정을 특검에 준용해 공소취소 가능성을 두고 해석이 엇갈린다. 민주당 지도부는 불가능하다는 " +
        "입장이고, 김의겸 법사위 여당 간사는 \"명백한 조작기소가 있다면 공소취소도 가능하다\"고 말했다.",
      assertionType: "FACT",
      sourceIds: ["src-newspim-20261110"],
      verified: true,
    },
  ],
  critiqueIds: ["claim-opposition", "claim-structure", "claim-caucus-opposition", "claim-residual-power"],
  timeline: [
    {
      id: "t-caucus",
      date: "2026-02-23",
      datePrecision: "day",
      title: "공취모 출범",
      summary: "민주당 의원 105명 참여(출범 당일 기준).",
      claimIds: ["claim-caucus-launch", "claim-caucus-demands"],
    },
    {
      id: "t-caucus-party",
      date: "2026-02-25",
      datePrecision: "day",
      title: "민주당, 당 특위 설치 의결",
      summary: "공취모를 공식기구로 흡수 방침, 일부 의원 탈퇴.",
      claimIds: ["claim-caucus-party", "claim-caucus-departures"],
    },
    {
      id: "t-bill",
      date: "2026-04-30",
      datePrecision: "day",
      title: "조작기소 특검법 발의",
      summary: "12개 사건, 공소유지 여부 결정·이첩 요구 권한 포함.",
      claimIds: ["claim-original-list", "claim-original-power"],
    },
    {
      id: "t-request",
      date: "2026-09-18",
      datePrecision: "day",
      title: "대통령, 이송·처분 조항 삭제 요청",
      summary: "진상 규명에만 집중해 달라고 했다.",
      claimIds: ["claim-president-request"],
    },
    {
      id: "t-subcommittee",
      date: "2026-11-04",
      datePrecision: "day",
      title: "법사위 소위 수정안·전체회의 가결",
      summary: "공소유지 여부 결정과 이첩 요구 조항 삭제, 문재인 정부 사건 추가.",
      claimIds: ["claim-subcommittee", "claim-revised-scope", "claim-chair", "claim-opposition"],
    },
    {
      id: "t-plenary",
      date: "2026-11-05",
      datePrecision: "day",
      title: "본회의 상정, 필리버스터",
      summary: "6일 종결 표결 예정.",
      claimIds: ["claim-plenary"],
    },
    {
      id: "t-passed",
      date: "2026-11-06",
      datePrecision: "day",
      title: "본회의 가결",
      summary: "찬성 167, 반대 1. 국민의힘 불참.",
      claimIds: ["claim-passed"],
    },
    {
      id: "t-promulgation",
      date: "2026-11-17",
      datePrecision: "day",
      title: "국무회의 공포안 상정 예정",
      summary: "공포 또는 재의요구를 정한다.",
      claimIds: ["claim-promulgation"],
    },
  ],
  gaps: [
    "원안과 수정안의 조문을 국회 의안정보시스템에서 직접 대조하지 못했다. 수정안 12개 항목의 정확한 문구와 '이 대통령 관련'으로 셀 항목 수는 조문으로 확정되지 않았다.",
    "원안에 있던 김용 전 부원장 금품수수, 허위 보도 의혹 사건이 수정안에서 어떻게 바뀌었는지는 보도로 확인하지 못했다.",
    "본회의 통과 뒤 공포 여부는 11월 10일 보도 기준이다. 11월 17일 국무회의 결과는 아직 반영하지 못했다.",
    "통과된 법안의 '이 대통령 관련 사건'은 6건(시대·뉴스핌)으로 보도됐지만, 수정안 단계에서 경향신문은 7건으로 셌다. 조문으로 확정하지 못했다.",
    "공취모의 현재 참여 의원 수와 당 특위로 흡수됐는지, 모임이 지금도 활동하는지는 확인하지 못했다. 105명은 2월 23일 출범 당일 보도 숫자다.",
  ],
  sources: [
    {
      id: "src-twig-20260430",
      title: "'공소 취소권' 가진 특검 온다",
      publisher: "트윅(서울신문)",
      url: "https://www.twig24.com/news/2026/05/01/20260501001006",
      publishedAt: "2026-04-30",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-inews-20261028",
      title: "'조희대 국조' 민주당, '조작기소 특검'도 재추진…다음주 법사위 상정",
      publisher: "아이뉴스24",
      url: "https://www.inews24.com/view/2020072",
      publishedAt: "2026-10-28",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-fn-20261104",
      title: "'조작기소 특검법' 법사위 상정, 野 집단퇴장 속 與 5일 본회의 추진",
      publisher: "파이낸셜뉴스",
      url: "https://www.fnnews.com/news/202611041422342101",
      publishedAt: "2026-11-04",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-hankook-20261104",
      title: "與, 조작기소 특검법 수정안 법사소위 처리…곧 전체회의 표결",
      publisher: "한국일보",
      url: "https://www.hankookilbo.com/news/article/A2026110415470004669",
      publishedAt: "2026-11-04",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-jkn-20261104",
      title: "조작기소 특검법, 수사대상 확대해 법사위 소위 통과",
      publisher: "재경일보",
      url: "https://news.jkn.co.kr/post/1070269",
      publishedAt: "2026-11-04",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-mediatoday-20261105",
      title: "법사위 끝내 이재명 조작기소 특검법 강행처리 \"대통령 구하기\"",
      publisher: "미디어오늘",
      url: "https://www.mediatoday.co.kr/news/articleView.html?idxno=338213",
      publishedAt: "2026-11-05",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-fn-20261106",
      title: "조작기소 특검법, 與주도로 국회 통과…野 장외투쟁 본격화",
      publisher: "파이낸셜뉴스",
      url: "https://www.fnnews.com/news/202611061802265727",
      publishedAt: "2026-11-06",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-newspim-20261110",
      title: "[뉴스분석] '조작기소 특검법' 공 넘겨받은 李대통령…위헌·이해충돌·공소취소 3대 쟁점",
      publisher: "뉴스핌",
      url: "https://www.newspim.com/news/view/20261110001264",
      publishedAt: "2026-11-10",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-khan-20261105",
      title: "'수사·기소권 모두 쥔' 조작기소특검법 본회의 상정",
      publisher: "경향신문",
      url: "https://khan.co.kr/article/202611052145015",
      publishedAt: "2026-11-05",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-newspim-20261105",
      title: "조작기소 특검법 국회 본회의 상정…국민의힘 필리버스터 돌입",
      publisher: "뉴스핌",
      url: "https://www.newspim.com/news/view/20261105001312",
      publishedAt: "2026-11-05",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-news1-20260223",
      title: "與의원 105명 참여 '공취모' 출범…\"李 조작기소 국조 추진\"(종합)",
      publisher: "다음 뉴스(뉴스1)",
      url: "https://v.daum.net/v/20260223162312227",
      publishedAt: "2026-02-23",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-imbc-20260223",
      title: "의원 105명 참여 '李 공소취소' 모임 출범‥국힘 \"李 재판 재개해야\"",
      publisher: "MBC",
      url: "https://imnews.imbc.com/replay/2026/nwdesk/article/6802694_37004.html",
      publishedAt: "2026-02-23",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-sedaily-20260223",
      title: "정청래 뺀 105명 李 ‘공취모’ 발족…당청갈등도 노출",
      publisher: "서울경제",
      url: "https://www.sedaily.com/article/20011628",
      publishedAt: "2026-02-23",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-segye-20260225",
      title: "당청 엇박자설은 '부인'… '대통령 뒷전 된 일 없어' [전방위 대응 나선 李대통령]",
      publisher: "세계일보",
      url: "https://www.segye.com/newsView/20260225516647",
      publishedAt: "2026-02-25",
      type: "press",
      license: "link-only",
    },
  ],
};
