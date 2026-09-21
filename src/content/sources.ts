import type { Source } from "./schema";

/**
 * 공유 출처 레지스트리.
 *
 * 같은 1차 자료를 스토리와 성과 카드가 함께 인용한다. 출처 레코드를 양쪽에
 * 복사해 두면 제목이나 날짜가 조용히 갈라진다. 한 곳에서만 고친다.
 */

export const MOF_2026: Source = {
  id: "src-mof-2026",
  title:
    "북극항로 시대로의 대도약, 민생경제 활력, 대한민국 균형성장 실현 — 「2026년도 해양수산부 업무계획」 보고",
  url: "https://www.mof.go.kr/doc/ko/selectDoc.do?docSeq=64262&listUpdtDt=2025-11-07++10%3A00&menuSeq=971&bbsSeq=10",
  publisher: "해양수산부",
  publishedAt: "2025-12-23",
  type: "official",
  license: "public",
  quote:
    "북극항로는 아시아와 유럽을 연결하는 최단거리 항로로서, 물류비용을 절감하고 조선·금융 등 전후방 산업이 동반 성장할 수 있는 기회로 여겨진다. (…) 하반기에 국내 민간 선사는 컨테이너선을 이용하여 부산에서 로테르담까지 북극항로 시범운항을 추진하여 극지운항 경험과 정보를 축적한다.",
};

export const NANET_2025: Source = {
  id: "src-nanet-2025",
  title: "데이터로 보는 북극항로 — 『Data&Law』 2025-9호(통권 제34호), 전문경력관 최경원",
  url: "https://docviewer.nanet.go.kr/reader/viewer",
  publisher: "국회도서관 법률정보실 국내법률정보과",
  publishedAt: "2025-08-28",
  type: "legislative",
  license: "public",
  quote:
    "한국해양수산개발원이 부산항에서 출발한 로테르담(네덜란드)행 78,000톤의 선박을 대상으로 7~10월 기준으로 수에즈 운하, 희망봉, 북극항로(북동항로) 항로를 분석한 결과 북극항로의 거리와 시간이 가장 짧은 것으로 나타났다.",
};

export const ISDC_DAEJANG: Source = {
  id: "src-isdc-daejang",
  title: "성남 판교대장 도시개발사업 — 추진사업 (사업개요·추진경위·토지이용계획)",
  url: "https://www.isdc.co.kr/devWork/devWork0202.asp",
  publisher: "성남도시개발공사 주택사업처",
  type: "official",
  license: "public",
  quote:
    "위치 : 분당구 대장동 210일원 / 면적 : 917,068.8㎡(약277천평) / 사업기간 : 2014년 5월 ~ 2026년 12월 / 계획인구 : 15,938인(5,903세대) — 토지이용계획: 공공용지 소계 490,747.6㎡ (53.5%)",
};

export const ISDC_PARK: Source = {
  id: "src-isdc-park",
  title: "제1공단 도시계획시설(공원화) 사업 — 추진사업",
  url: "https://www.isdc.co.kr/devWork/devWork0203.asp",
  publisher: "성남도시개발공사 주택사업처",
  type: "official",
  license: "public",
  quote:
    "위치 : 수정구 신흥동 2458일원 / 면적 : 56,022㎡ (약17천평) / 공원 : 46,615㎡, 도로 : 9,407㎡ / 사업기간 : 2016. 4. ~ 2022. 3.",
};

export const MOTIR_MEGA_2026: Source = {
  id: "src-motir-mega-2026",
  title:
    "(참고자료) ‘대한민국 대도약 3대 메가프로젝트 국민보고회’ 개최",
  url: "https://www.motir.go.kr/kor/article/ATCL3f49a5a8c/171974/view",
  publisher: "산업통상부",
  publishedAt: "2026-06-29",
  type: "official",
  license: "public",
  quote:
    "①서남권에 총 800조원 규모의 반도체 팹(4기) ②충청권은 81조원을 투자하여 " +
    "패키징 거점으로 육성 (…) 총 18.4GW의 AI 데이터센터가 구축될 예정이다 (…) " +
    "2030년까지 재생에너지 100GW를 조기 달성",
};

/* ────────────────────────────────────────────────────────────────
 * 카르텔
 *
 * 대통령 발언 하나만 정부 자료이고 나머지는 보도다. 공정위 업무계획과
 * 도로공사 보도자료의 원문을 찾지 못해 언론 보도로 대신했다 — 1차 자료를
 * 찾으면 여기를 바꾼다. 화면은 이미 1차 자료와 보도를 갈라 보인다.
 * ──────────────────────────────────────────────────────────────── */

export const KOREA_COLLUSION_2026: Source = {
  id: "src-korea-collusion-2026",
  title: "이 대통령 “반시장적 담합 행위는 암적 존재…무거운 제재 뒤따라야”",
  url: "https://www.korea.kr/news/policyNewsView.do?newsId=148959685",
  publisher: "대한민국 정책브리핑",
  publishedAt: "2026-02-19",
  type: "official",
  license: "public",
  quote:
    "시장 지배력을 악용한 이런 담합 행위는 공정한 경쟁을 가로막고 시장 신뢰를 " +
    "훼손하며 국민경제 발전을 방해하는 암적 존재 (…) 특히 이런 반시장적 행위가 " +
    "반복될 경우에는 아예 시장에서 영구적으로 퇴출시키는 방안도 적극 검토해야 한다",
};

export const FTC_H2_2026: Source = {
  id: "src-ftc-h2-2026",
  title: "담합·독과점 칼 빼든 공정위…등록취소부터 지분매각까지 검토",
  url: "https://www.fnnews.com/news/202608042033566315",
  publisher: "파이낸셜뉴스",
  publishedAt: "2026-08-04",
  type: "press",
  license: "quotable",
  quote:
    "반복적인 담합 행위를 저지른 기업에 대해 등록 취소나 일정 기간 영업정지 " +
    "처분을 내릴 수 있는 근거를 마련 (…) 시장지배적 지위 남용이나 중대한 담합 " +
    "행위에 대해서는 지분 매각과 영업 양도 등 구조적 조치를 적용할 수 있도록 " +
    "제도를 정비한다",
};

export const FTC_BIDDING_2026: Source = {
  id: "src-ftc-bidding-2026",
  title: "담합 시정명령 두 번이면 입찰 제한 요청…공정위, 상습 담합 제재 강화",
  url: "https://www.etoday.co.kr/news/view/2627771",
  publisher: "이투데이",
  publishedAt: "2026-09-21",
  type: "press",
  license: "quotable",
  quote:
    "담합으로 시정명령 이상의 조치를 받은 사업자가 10년 안에 다시 담합으로 " +
    "시정명령 이상의 조치를 받으면 원칙적으로 입찰참가자격 제한 요청 대상이 된다",
};

export const MSIT_QOS_2026: Source = {
  id: "src-msit-qos-2026",
  title: "모든 요금제 데이터 무제한…850만명 통신비 줄어든다",
  url: "https://www.hankyung.com/article/2026040904461",
  publisher: "한국경제",
  publishedAt: "2026-04-09",
  type: "press",
  license: "quotable",
  quote:
    "모든 데이터 요금제에 데이터 안심옵션(QoS)을 도입한다 (…) 약 717만 명이 " +
    "연 3221억원, 65세 이상 약 140만 명이 음성·문자 무제한으로 연 590억원을 " +
    "절감할 것으로 추산된다",
};

export const EX_RESTAREA_2026: Source = {
  id: "src-ex-restarea-2026",
  title: "“음식값 낮추고 서비스 높인다” 도로공사, 휴게소 8곳 ‘공사 직계약’ 시범 전환",
  url: "https://biz.heraldcorp.com/article/10880817",
  publisher: "헤럴드경제",
  publishedAt: "2026-09-21",
  type: "press",
  license: "quotable",
  quote:
    "기존의 다단계 임대 구조가 단순화되면서 입점매장이 부담하던 수수료율이 " +
    "대폭 낮아진다 (…) 입점매장의 수수료 부담이 줄어들어 결과적으로 음식 " +
    "판매가격이 낮아질 것으로 기대한다",
};

/* ────────────────────────────────────────────────────────────────
 * 카르텔 — 의료
 *
 * 여기는 앞의 카르텔들과 달리 1차 자료가 둘이다. 법률 원문과 정책브리핑이
 * 있고, 첫 선발 진행과 의료계 반대만 보도로 채웠다. 정원이 왜 묶여 있었는지는
 * 2024년 기사를 그대로 쓴다 — 그때 적힌 사실이 지금 달라지지 않았다.
 * ──────────────────────────────────────────────────────────────── */

export const LAW_REGIONAL_DOCTOR_2025: Source = {
  id: "src-law-regional-doctor-2025",
  title: "지역의사의 양성 및 지원 등에 관한 법률 (법률 제21239호)",
  url: "https://law.go.kr/lsInfoP.do?lsiSeq=280435&viewCls=lsRvsDocInfoR",
  publisher: "국가법령정보센터",
  publishedAt: "2025-12-23",
  type: "official",
  license: "public",
};

export const KOREA_MED_QUOTA_2026: Source = {
  id: "src-korea-med-quota-2026",
  title: "내년부터 5년간 지역·필수·공공의료 의사 연평균 668명 양성",
  url: "https://www.korea.kr/news/policyNewsView.do?newsId=148959405",
  publisher: "대한민국 정책브리핑",
  publishedAt: "2026-02-11",
  type: "official",
  license: "public",
  quote:
    "보건복지부는 10일 정부서울청사에서 ‘제7차 보건의료정책심의위원회’를 열고 " +
    "(…) 2027학년도 이후 증원 인력 중 2024학년도 정원(3058명)을 초과하는 " +
    "인원은 모두 ‘지역의사’로 선발한다",
};

export const MOHW_REGIONAL_PICK_2026: Source = {
  id: "src-mohw-regional-pick-2026",
  title: "7일부터 지역의사선발전형 수시모집 시작…비수도권 32개 의대서 490명 선발",
  url: "https://www.newspim.com/news/view/20260902001185",
  publisher: "뉴스핌",
  publishedAt: "2026-09-03",
  type: "press",
  license: "quotable",
  quote:
    "2027학년도 지역의사제를 통한 선발 인원은 진료권 단위 359명, 광역권 단위 " +
    "131명 등 총 490명 (…) 의사면허를 취득한 이후에는 선발 당시 공고된 " +
    "의무복무지역에서 10년간 의무복무하게 된다",
};

export const KMA_REGIONAL_OPPOSE_2025: Source = {
  id: "src-kma-regional-oppose-2025",
  title: "의협, ‘지역의사제’ 공식 반대 표명…“위헌 소지”",
  url: "https://www.munhwa.com/article/11534152",
  publisher: "문화일보",
  publishedAt: "2025-09-18",
  type: "press",
  license: "quotable",
  quote:
    "공중보건장학제도 등 기존의 유사 제도가 지원자 미달로 사실상 실패한 전례에 " +
    "비춰볼 때 지역·공공의사 제도가 실질적인 인력 확보 효과를 거두기 어렵고, " +
    "10년간의 의무 복무는 헌법상 직업 선택의 자유·거주 이전의 자유를 침해할 " +
    "소지가 크므로 위헌 소지가 있다",
};

export const MED_QUOTA_FROZEN_2024: Source = {
  id: "src-med-quota-frozen-2024",
  title: "의약분업부터 시작된 ‘의대 증원’ 논의…18년 역사 살펴보니",
  url: "https://www.newsis.com/view/NISX20240206_0002618441",
  publisher: "뉴시스",
  publishedAt: "2024-02-06",
  type: "press",
  license: "quotable",
  quote:
    "정부는 의약분업에 대한 의료계의 반발로 2000년 3507명이었던 의대 정원의 " +
    "10%인 351명을 단계적으로 감축했다 (…) 현재 전국 40개 의과대학 입학정원은 " +
    "2006년부터 현재까지 18년째 3058명으로 동결돼 있다",
};
