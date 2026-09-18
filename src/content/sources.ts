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
