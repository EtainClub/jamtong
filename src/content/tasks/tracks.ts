import type { PledgeTrack } from "@/content/pledges/schema";

/**
 * 국정과제 주요내용의 이행 표시. 열쇠는 `<과제 번호>:<원문 소제목>`이다.
 *
 * 공약과 같은 규칙을 따른다. 근거는 이 사이트에 이미 있는 업적·정책의 claim만 쓰고,
 * note에는 그 claim에 있는 내용만 적는다. 한 줄에 여러 일이 들어 있는데 일부만
 * 확인했으면 "추진 중"으로 두고 무엇이 남았는지 note에 적는다.
 *
 * 없는 과제·소제목을 가리키면 빌드가 멈춘다(index.ts).
 */
const P = "policy:pledge-check-2026#";

export const TASK_TRACKS: Record<string, PledgeTrack> = {
  "2:민주적 통제 강화": {
    status: "underway",
    ref: `${P}claim-martial-law`,
    note: "개정 계엄법이 2025년 7월 시행돼 계엄 중 국회 출입·회의 방해를 처벌한다. 군인복무기본법 정비는 확인하지 못했다.",
  },
  "3:수사·기소의 완전한 분리": {
    status: "done",
    ref: "policy:prosecution-launch#claim-launch",
    note: "2026년 10월 2일 검찰청이 폐지되고 중대범죄수사청·공소청이 출범했다.",
  },
  "6:인력 증원·처우 개선": {
    status: "underway",
    ref: "judicial-reform#claim-bench",
    note: "대법관 14명→26명 증원법이 통과됐고, 증원은 2028년 3월부터 3년에 걸쳐 한다. 판사 증원·수사인력 처우는 확인하지 못했다.",
  },
  "7:방송 공공성·자율성 회복": {
    status: "underway",
    ref: `${P}claim-broadcasting-act`,
    note: "개정 방송법이 2025년 8월 26일 시행돼 공영방송 이사회·사장 선임 구조와 편성위원회가 바뀌었다. 방심위 심의 제도 개선은 확인하지 못했다.",
  },
  "20:AI컴퓨팅인프라 확충": {
    status: "underway",
    ref: `${P}claim-gpu`,
    note: "엔비디아가 2030년까지 GPU 26만 장 이상을 공급하고 그중 5만 장을 정부가 구입한다고 보도됐다. 실제 도입 수량은 확인하지 못했다.",
  },
  "37:주요국 협력": {
    status: "underway",
    ref: "policy:us-investment#claim-tariff",
    note: "2025년 10월 한미 관세 합의로 상호관세가 25%에서 15%로 낮아졌다. 중국·일본·EU와의 협력은 이 근거에 없다.",
  },
  "37:글로벌 사우스 진출": {
    status: "underway",
    ref: "resource-diplomacy#claim-central",
    note: "2026년 9월 서울에서 중앙아시아 5개국 정상이 처음 다자 형식으로 모여 협정·양해각서 74건을 맺었다.",
  },
  "38:에너지고속도로 신속 구축": {
    status: "underway",
    ref: `${P}claim-grid-act`,
    note: "국가기간 전력망 확충 특별법이 2025년 9월 시행되고 송전·변전 사업 99개가 지정됐다.",
  },
  "40:2030 감축목표 달성": {
    status: "underway",
    ref: `${P}claim-ndc-2035`,
    note: "2026~2030년 배출권 할당계획이 확정돼 발전 부문 유상할당을 2030년 50%까지 올린다.",
  },
  "40:2035 이후 로드맵 수립": {
    status: "underway",
    ref: `${P}claim-ndc-2035`,
    note: "2035년 감축목표(2018년 대비 53~61%)가 2025년 11월 확정됐다. 장기 감축 로드맵은 확인하지 못했다.",
  },
  "46:100조원+α 규모 국민성장펀드 신설": {
    status: "done",
    ref: `${P}claim-growth-fund`,
    note: "2025년 12월 150조 원 이상 규모로 국민성장펀드가 출범했다.",
  },
  "47:주주가치 제고": {
    status: "underway",
    ref: "stock-market#claim-duty",
    note: "2025년 7월 상법 개정으로 이사가 총주주의 이익을 보호하도록 하는 조항이 신설됐다. 추가 입법은 이 근거에 없다.",
  },
  "47:공정한 시장질서 확립": {
    status: "underway",
    ref: "stock-market#claim-manipulation",
    note: "2025년 7월 주가조작 근절 합동대응단 설치를 담은 실천방안이 발표됐다.",
  },
  "47:주식시장 수요기반 확충": {
    status: "underway",
    ref: "stock-market#claim-reform",
    note: "2026년 3월 시장접근성 제고를 포함한 자본시장 체질개선 방안이 발표됐다. MSCI 편입 로드맵은 확인하지 못했다.",
  },
  "50:국가중추시설 이전": {
    status: "underway",
    ref: `${P}claim-sejong-office`,
    note: "대통령 세종집무실은 2027년 8월 착공, 2029년 8월 입주를 목표로 설계 중이다.",
  },
  "53:지역사랑상품권 활성화": {
    status: "underway",
    ref: `${P}claim-local-voucher`,
    note: "국가의 발행 지원을 의무화한 법이 2025년 8월 국회를 통과했다. 시행일과 발행 규모는 확인하지 못했다.",
  },
  "56:해양수도 완성": {
    status: "underway",
    ref: "arctic-route#claim-hq-relocation",
    note: "해양수산부가 부산 이전을 마쳤다. 해운선사 유치는 확인하지 못했다.",
  },
  "56:북극항로 개척": {
    status: "underway",
    ref: "arctic-route#claim-trial-voyage",
    note: "2026년 8~9월 국내 컨테이너선이 부산~로테르담 북극항로 시범운항을 했다.",
  },
  "59:채무부담 경감": {
    status: "underway",
    ref: "policy:new-leap-fund#claim-cumulative",
    note: "새도약기금이 2026년 10월까지 장기 연체채권 3조 8,551억 원을 소각했다.",
  },
  "60:주거비 부담 경감": {
    status: "underway",
    ref: "policy:youth-monthly-rent#quota",
    note: "청년 월세 지원이 2026년에도 이어져 신규 6만 명을 모집한다. 월세 세액공제 확대는 확인하지 못했다.",
  },
  "61:금융비용 절감": {
    status: "underway",
    ref: "policy:new-leap-fund#claim-cumulative",
    note: "새도약기금이 장기 연체채권 11조 7,000억 원을 사들여 일부를 소각했다. 분할상환·금리감면 확대는 확인하지 못했다.",
  },
  "69:소득안전망 강화": {
    status: "underway",
    ref: `${P}claim-grain-act`,
    note: "농산물 가격안정제를 담은 농안법 개정안이 2025년 8월 국회를 통과했다. 공익직불 확대는 확인하지 못했다.",
  },
  "77:상병수당 확대": {
    status: "underway",
    ref: `${P}claim-sick-pay`,
    note: "정부가 상병수당을 2027년 하반기 전국 본사업으로 바꾸는 방안을 추진한다고 밝혔다.",
  },
  "82:청년미래적금 신설": {
    status: "done",
    ref: "youth-future-savings#ys-launch-fact",
    note: "청년미래적금이 2026년 6월 22일 가입 신청을 시작했다.",
  },
  "84:지역·필수·공공의료 인력 양성": {
    status: "underway",
    ref: `${P}claim-regional-doctor`,
    note: "지역의사법이 2025년 12월 공포됐다. 공공의료 사관학교·의대 신설은 확인하지 못했다.",
  },
  "85:비대면진료 확대": {
    status: "underway",
    ref: `${P}claim-telemedicine`,
    note: "비대면진료 제도화 의료법이 2025년 12월 23일 공포됐고 1년 뒤 시행된다.",
  },
  "86:간병 부담 완화": {
    status: "underway",
    ref: `${P}claim-care-cost`,
    note: "정부가 2027년 상반기 요양병원 간병비 급여화 시범사업을 하겠다고 밝혔다.",
  },
  "87:양육지원 강화": {
    status: "underway",
    ref: "policy:child-allowance#claim-age-schedule",
    note: "아동수당이 2026년 만 9세 미만으로 올랐고 해마다 한 살씩 늘어 2030년 13세 미만이 된다.",
  },
  "93:비정규직 권리보장 확대": {
    status: "underway",
    ref: `${P}claim-yellow-envelope`,
    note: "개정 노동조합법 2·3조가 2026년 3월 10일 시행됐다. 노동자 추정·파견수수료 상한·공무직위원회법은 확인하지 못했다.",
  },
  "95:노동시간 단축": {
    status: "underway",
    ref: `${P}claim-working-hours`,
    note: "2026년 1월 실노동시간 단축 로드맵이 발표됐다. 포괄임금제 금지는 확인하지 못했다.",
  },
  "96:고용안전망 확대": {
    status: "underway",
    ref: "policy:national-employment-support#allowance-2026",
    note: "구직촉진수당 기본 월액이 2026년 1월 50만 원에서 60만 원으로 올랐다.",
  },
  "120:외교다변화": {
    status: "underway",
    ref: "resource-diplomacy#claim-central",
    note: "2026년 9월 첫 한-중앙아시아 정상회의가 서울에서 열렸다.",
  },
  "121:다자경제 협의체 의장국 수임을 통한 글로벌 경제외교 선도": {
    status: "underway",
    ref: `${P}claim-apec`,
    note: "2025년 경주 APEC에서 경주선언이 만장일치로 채택됐다. 2028년 G20 의장국은 앞으로의 일이다.",
  },
};
