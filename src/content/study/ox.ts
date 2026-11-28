import { z } from "zod";

/**
 * 잡초 O/X 퀴즈 문항 — 업적의 **내용을 이해했는지** 묻는다(docs/garden-achievement-strategy.md "잡초 O/X 퀴즈").
 *
 * 숫자를 맞히게 하지 않는다. 무엇을 하는 정책인지, 누구 대상인지, 끝났는지 계획인지, 확인된 사실인지 누구의 주장인지,
 * 한계·반론이 무엇인지를 묻는다. 숫자는 뜻(늘었다·줄었다, 어느 쪽이 크다)을 물을 때만 쓴다.
 *
 * ★ 문항은 claimIds의 claim만으로 참·거짓이 가려져야 한다. 풀이(explain)는 그 claim으로 답한다.
 * ★ X 문항은 **헷갈리기 쉬운 문장**이다. 실제로 SNS에서 도는 말인지는 확인하지 않았다 — 화면에서 "도는 말"·"흔한 오해"라고 부르지 않는다.
 *   실제로 도는 말은 정책의 rumors에 따로 있다(사람이 승인한 판정과 함께, docs/jamgong-roadmap.md R5).
 *   X 문항은 근거 claim이 그 문장을 곧바로 바로잡을 때만 싣는다. 퀴즈 시트에서 문제로만 보이고 곧바로 풀이가 붙는다 — 다른 곳(카드·공유·위키)에 싣지 않는다.
 * ★ 2026-11-28 X 문항 56개를 다시 읽었다(docs/jamgong-ox-review.md).
 * ★ 주장(CLAIM)은 주장한 사람을 문장에 넣는다. 확인 전(verified: false) claim은 O 문항의 근거로 쓰지 않는다(memorial.test.ts가 본다).
 * ★ 초안은 GPT(Codex)가 claim·반론·쉬운 설명만 보고 썼고, 문항마다 근거 claim과 대조해 고쳤다(2026-11-25).
 */
export const oxItemSchema = z.object({
  id: z.string().regex(/^ox[0-9]+$/),
  /** 한 문장, 평서문. */
  statement: z.string().min(10).max(80),
  answer: z.boolean(),
  /** 맞혔든 틀렸든 보이는 풀이 — 정답의 까닭을 근거 claim으로. */
  explain: z.string().min(10),
  claimIds: z.array(z.string()).min(1),
});
export type OxItem = z.infer<typeof oxItemSchema>;

/** 업적 slug → 문항. 업적마다 O 둘·X 둘. */
export const ACHIEVEMENT_OX: Record<string, OxItem[]> = {
  "arctic-route": [
    { id: "ox1", answer: true, statement: "국내 선사의 컨테이너선이 실제 수출 화물을 싣고 북극항로로 유럽에 갔다가 돌아왔다.", explain: "팬스타 아크로호는 수출 컨테이너 화물을 싣고 유럽으로 갔어요. 돌아올 때도 북동항로를 거쳐 부산에 도착했어요.", claimIds: ["claim-trial-voyage", "claim-trial-return"] },
    { id: "ox2", answer: true, statement: "해양수산부는 러시아 제재가 계속되면 북서항로 시범운항 같은 대안을 검토하겠다고 밝혔다.", explain: "해양수산부는 제재가 풀리면 북동항로 수송 확대를 추진하고, 계속되면 북서항로 시범운항 등 대안을 검토하겠다고 밝혔어요.", claimIds: ["claim-russia"] },
    { id: "ox3", answer: false, statement: "부산에서 로테르담까지 북극항로로 가는 거리는 수에즈 운하를 거칠 때보다 더 길다.", explain: "한국해양수산개발원의 비교 분석에서는 북극항로가 수에즈 운하 경유보다 짧았어요. 분석상 소요 시간도 북극항로 쪽이 적었어요.", claimIds: ["claim-route-comparison"] },
    { id: "ox4", answer: false, statement: "해양수산부는 첫 왕복 항해를 마친 만큼 후속 시범운항은 더 추진하지 않겠다고 밝혔다.", explain: "해양수산부는 이번 항해의 경험과 데이터를 바탕으로 후속 시범운항과 상업 운항을 준비하겠다고 밝혔어요. 북극항로를 국가 장기 과제로 추진한다는 입장이에요.", claimIds: ["claim-next-voyage"] },
  ],
  "birth-rebound": [
    { id: "ox1", answer: true, statement: "정부의 국가인구전략 기본계획은 출산율 대신 삶의 만족도 등을 핵심 성과지표로 삼았다.", explain: "핵심 성과지표는 합계출산율이 아니라 삶의 만족도와 경제활동참가율이에요.", claimIds: ["br-plan"] },
    { id: "ox2", answer: true, statement: "국가인구전략 기본계획에는 청년·신혼·양육가구를 위한 공공주택 공급이 포함됐다.", explain: "기본계획에는 이들 가구를 위한 공공주택 공급과 맞춤형 육아휴직, 유연근무 등이 들어 있어요.", claimIds: ["br-plan-detail"] },
    { id: "ox3", answer: false, statement: "출생아가 늘어난 2026년 8월에는 출생아가 사망자보다 많아 인구가 자연증가했다.", explain: "출생아는 늘었지만 사망자가 더 많았어요. 자연감소 폭이 줄었을 뿐, 자연증가로 바뀐 것은 아니에요.", claimIds: ["br-aug", "br-natural"] },
    { id: "ox4", answer: false, statement: "국가데이터처는 2025년 출생아 증가가 정부 정책의 효과라고 통계 발표에서 밝혔다.", explain: "국가데이터처 발표는 출생아 증가 원인을 따로 밝히지 않았어요. 그 발표를 근거로 정부 정책의 효과라고 단정할 수는 없어요.", claimIds: ["br-2025"] },
  ],
  "daejangdong": [
    { id: "ox1", answer: true, statement: "대장동 사업 회사는 성남도시개발공사가 의결권의 과반을 갖는 구조로 설립됐다.", explain: "성남도시개발공사가 의결권의 절반보다 한 주를 더 갖는 구조였어요. 공공이 사업 회사의 의결권 과반을 가진 거예요.", claimIds: ["claim-ppp-structure"] },
    { id: "ox2", answer: true, statement: "대장동 관련자들은 업무상 배임으로 1심 유죄 판결을 받았고 피고인들이 항소했다.", explain: "1심은 김만배 씨 등 관련자들의 업무상 배임을 인정했어요. 피고인들의 항소로 항소심이 시작됐고 자료 기준일까지 항소심 선고는 확인되지 않았어요.", claimIds: ["claim-trial-first", "claim-trial-appeal"] },
    { id: "ox3", answer: false, statement: "성남시는 대장동 개발이익 환수액 전체를 현금 배당으로 받았다고 설명했다.", explain: "성남시가 밝힌 환수 내역에는 현금 배당과 공원·기반시설 같은 현물 형태가 함께 들어 있어요. 환수액 전체가 현금 배당이라는 설명은 아니에요.", claimIds: ["claim-recovery-breakdown"] },
    { id: "ox4", answer: false, statement: "대장동의 확정이익 방식은 부동산 경기가 오르면 공공도 상승분을 추가로 나누는 구조다.", explain: "확정이익 방식은 공공의 몫을 미리 정해 두는 구조예요. 경기가 올라도 상승분을 나누지 않아요. 1심 재판부도 확정 이익을 정해 둔 탓에 공공에 돌아갔어야 할 이익이 민간업자들에게 배분됐다고 판단했어요.", claimIds: ["claim-fixed-profit", "claim-trial-first"] },
  ],
  "export-surplus": [
    { id: "ox1", answer: true, statement: "한국의 수출 1조 달러 돌파 발표는 연간 확정치가 아닌 누적 수출 잠정 집계에 따른 것이다.", explain: "산업통상부가 발표한 것은 해당 시점까지의 누적 수출 잠정 집계예요. 한 해 전체의 확정 실적은 아니에요.", claimIds: ["es-1t"] },
    { id: "ox2", answer: true, statement: "산업통상부는 수출이 늘어나는 가운데서도 보호무역주의 강화를 앞으로의 위험으로 꼽았다.", explain: "산업통상부는 미국·EU의 보호무역주의 강화와 반도체·석유제품 단가 변동성 등을 위험 요인으로 제시했어요.", claimIds: ["es-risk"] },
    { id: "ox3", answer: false, statement: "한국의 수출 증가는 반도체에만 한정돼 반도체를 뺀 품목의 수출은 전년보다 줄었다.", explain: "2026년 1~10월에는 반도체를 뺀 품목의 수출도 전년 같은 기간보다 늘었어요. 반도체만 수출이 증가한 것은 아니에요.", claimIds: ["es-nonchip"] },
    { id: "ox4", answer: false, statement: "IMF가 내놓은 한국의 연간 경상흑자 예상은 전망이 아니라 이미 확정된 통계다.", explain: "IMF가 세계경제전망에서 제시한 한국의 연간 경상흑자는 예상치예요. 확정 통계가 아니에요.", claimIds: ["es-imf"] },
  ],
  "gyeonggi-basic-income": [
    { id: "ox1", answer: true, statement: "경기도의 1차 재난기본소득은 소득에 관계없이 전 도민에게 지역화폐로 지급하겠다는 정책이었다.", explain: "경기도는 소득 조건 없이 전 도민에게 지급하겠다고 발표했어요. 지급 수단은 지역화폐였어요.", claimIds: ["claim-first"] },
    { id: "ox2", answer: true, statement: "경기도는 1차 재난기본소득이 지급액보다 더 큰 규모의 소비를 유도한다고 밝혔다.", explain: "경기도는 지급액보다 큰 소비를 유도하는 소비 견인효과가 있다고 밝혔어요. 이는 경기도가 제시한 효과에 관한 주장이에요.", claimIds: ["claim-effect"] },
    { id: "ox3", answer: false, statement: "1차 재난기본소득으로 받은 지역화폐는 사용 기한 없이 계속 모아 둘 수 있었다.", explain: "1차 지급 발표에는 지급일로부터 3개월이 지나면 소멸한다는 조건이 있었어요. 기한 없이 보관할 수 있는 돈은 아니었어요.", claimIds: ["claim-first"] },
    { id: "ox4", answer: false, statement: "3차 재난기본소득도 정부 지원금 수령 여부와 관계없이 모든 경기도민에게 지급됐다.", explain: "3차는 정부의 상생 국민지원금 지급대상에서 제외된 소득상위 도민 등을 대상으로 지급했어요. 전 도민에게 지급한 것은 아니에요.", claimIds: ["claim-third"] },
  ],
  "gyeonggi-child-meal": [
    { id: "ox1", answer: true, statement: "경기도 아동급식카드의 지원 대상은 끼니를 거를 우려가 있는 미성년 아동이다.", explain: "지원 대상은 만 18세 미만의 결식 우려 아동이에요. 끼니가 걱정되는 아이들의 식사를 지원하는 카드예요.", claimIds: ["claim-card"] },
    { id: "ox2", answer: true, statement: "경기도는 결식아동의 한 끼 급식 지원액을 올리고 카드로 한 번에 쓸 수 있는 한도도 높였다.", explain: "경기도는 2021년 한 끼 급식단가를 올리면서 아동급식카드의 1회 사용 한도도 함께 높였어요.", claimIds: ["claim-7000"] },
    { id: "ox3", answer: false, statement: "아동급식카드 사용처를 개선한 뒤에도 경기도 내 일반음식점에서는 카드를 쓸 수 없었다.", explain: "경기도는 BC카드 가맹 일반음식점과 연계해 사용처를 넓혔어요. 경기도 내 모든 일반음식점에서 쓸 수 있도록 개선한 내용이에요.", claimIds: ["claim-card"] },
    { id: "ox4", answer: false, statement: "경기도는 아동급식카드를 교체하면서 일반 체크카드와 쉽게 구별되는 전용 디자인으로 바꿨다.", explain: "기존 카드는 다른 사람도 급식카드임을 알 수 있었어요. 교체한 카드는 일반 체크카드와 같은 디자인의 IC카드예요.", claimIds: ["claim-design"] },
  ],
  "gyeonggi-comfort-women": [
    { id: "ox1", answer: true, statement: "경기도는 도내 거주 일본군 위안부 피해자의 월 지원금을 높이고 위로금을 신설했다.", explain: "경기도는 도내 거주 피해자의 월 지원금을 올리겠다고 밝혔어요. 지원 내용을 바꾸면서 매월 지급하는 위로금도 새로 뒀어요.", claimIds: ["claim-raise"] },
    { id: "ox2", answer: true, statement: "이재명 경기도지사는 베를린 소녀상 철거 방침을 거둬 달라는 서한을 현지 당국에 보냈다.", explain: "베를린 미테구의 소녀상 철거 요구가 나오자 베를린시장과 미테구청장에게 철회를 요청하는 서한을 보냈어요.", claimIds: ["claim-berlin"] },
    { id: "ox3", answer: false, statement: "경기도가 발표한 피해자 월 지원금 총액은 정부 지원금과 별도로 받는 경기도 몫이다.", explain: "발표된 월 지원금 총액에는 정부 지원금이 포함돼 있어요. 전부를 경기도가 별도로 지급하는 금액으로 보면 안 돼요.", claimIds: ["claim-raise"] },
    { id: "ox4", answer: false, statement: "경기도가 진료비를 건강관리비로 바꾼 뒤에도 피해자가 신청해야 매월 지급받을 수 있다.", explain: "건강관리비는 신청 여부와 상관없이 매월 정액을 지급하는 방식으로 바뀌었어요.", claimIds: ["claim-raise"] },
  ],
  "gyeonggi-construction": [
    { id: "ox1", answer: true, statement: "경기도의 공공건설 원가 공개는 일정 규모 이상 공사의 설계·계약·하도급 내역을 알리는 제도다.", explain: "경기도와 관련 기관이 시행하는 일정 계약금액 이상의 공공건설공사가 대상이에요. 설계·계약·하도급 내역 등 원가 자료를 홈페이지에 공개했어요.", claimIds: ["claim-cost"] },
    { id: "ox2", answer: true, statement: "경기도는 입찰 단계에서 서류 검토와 현장 점검으로 건설업 등록 기준 충족 여부를 확인했다.", explain: "페이퍼컴퍼니 사전단속은 입찰 단계에서 이뤄졌어요. 자본금·사무실·기술인력 등 등록 기준을 서류와 현장에서 확인했어요.", claimIds: ["claim-paper-start"] },
    { id: "ox3", answer: false, statement: "경기도의 공공건설 원가 공개에 건설업계는 영업기밀 우려 없이 찬성했다.", explain: "건설업계는 원가 자료가 영업기밀이라며 공개에 반발했어요.", claimIds: ["claim-cost"] },
    { id: "ox4", answer: false, statement: "경기도가 발표한 사전단속 기간의 공공입찰 경쟁률은 시작 무렵보다 높아졌다.", explain: "경기도가 밝힌 집계에서 공공입찰 경쟁률은 사전단속을 시작한 무렵보다 낮아졌어요.", claimIds: ["claim-paper-yearly"] },
  ],
  "gyeonggi-ilsan-bridge": [
    { id: "ox1", answer: true, statement: "경기도는 일산대교 사업시행자 지정을 취소하는 공익처분으로 한때 무료 통행을 시행했다.", explain: "경기도는 2021년 사업시행자 지정을 취소하는 공익처분을 내렸어요. 같은 날부터 일산대교 무료 통행을 시작했어요.", claimIds: ["claim-free"] },
    { id: "ox2", answer: true, statement: "경기도는 2026년부터 일산대교를 통과하는 모든 차량의 통행료 일부를 도 예산으로 지원한다.", explain: "경기도는 모든 통과 차량의 통행료 절반을 지원해요. 도 자체예산을 투입하고 전면 무료화를 위한 협의도 이어간다고 밝혔어요.", claimIds: ["claim-half"] },
    { id: "ox3", answer: false, statement: "일산대교 무료 통행은 운영사의 집행정지 신청이 법원에서 받아들여지지 않아 계속 유지됐다.", explain: "법원은 운영사의 집행정지 신청을 두 차례 받아들였어요. 두 번째 결정에 따라 통행료 징수가 재개됐어요.", claimIds: ["claim-stay", "claim-back"] },
    { id: "ox4", answer: false, statement: "일산대교 사업시행자 지정 취소 소송은 대법원이 경기도의 승소를 확정하며 끝났다.", explain: "대법원은 일산대교 운영사가 이긴 원심 판결을 확정했어요. 경기도가 이긴 소송이 아니에요.", claimIds: ["claim-final"] },
  ],
  "gyeonggi-microloan": [
    { id: "ox1", answer: true, statement: "경기도 극저신용대출은 신용이 낮아 제도권 금융을 이용하기 어려운 도민을 위한 제도다.", explain: "이 대출은 제도권 금융을 이용하기 어려운 도민을 대상으로 해요. 성인 도민 가운데 정해진 신용점수 기준에 해당하는 사람이 대상이에요.", claimIds: ["claim-loan"] },
    { id: "ox2", answer: true, statement: "경기도 극저신용대출의 만기 상환 현황에는 완납 외에 전환대출·분할약정을 통한 상환도 있다.", explain: "만기 상환 현황은 완납과 전환대출·분할약정을 통한 성실 상환을 구분해 집계했어요. 전부 갚은 경우만 있는 것은 아니에요.", claimIds: ["claim-repay"] },
    { id: "ox3", answer: false, statement: "경기도 극저신용대출은 신용점수가 낮은 사람도 담보나 보증을 마련해야 이용할 수 있다.", explain: "이 대출은 담보와 보증 없이 빌려주는 제도예요. 담보나 보증을 마련해야 한다는 설명은 내용과 달라요.", claimIds: ["claim-loan"] },
    { id: "ox4", answer: false, statement: "경기도 극저신용대출은 생활이 어려운 도민에게 갚을 의무 없이 돈을 주는 지원금이다.", explain: "돈을 무상으로 주는 지원금이 아니라 이자를 내고 갚아야 하는 대출이에요. 상환 기간도 정해져 있어요.", claimIds: ["claim-loan"] },
  ],
  "gyeonggi-or-cctv": [
    { id: "ox1", answer: true, statement: "경기도 수술실 CCTV는 한 공공병원 시범 설치에서 산하 공공병원 전체로 확대됐다.", explain: "안성병원에 먼저 시범 설치했어요. 이후 경기도의료원 산하 병원 전체의 수술실로 확대했어요.", claimIds: ["claim-first", "claim-six"] },
    { id: "ox2", answer: true, statement: "경기도는 공공병원뿐 아니라 일부 민간 병원에도 수술실 CCTV 설치비를 지원하기로 했다.", explain: "경기도는 민간 병원급 의료기관을 대상으로 설치비 일부를 지원하기로 했어요. 치과병원·한방병원·요양병원은 제외됐어요.", claimIds: ["claim-private"] },
    { id: "ox3", answer: false, statement: "수술실 CCTV 설치 의무화에 따라 환자나 보호자의 요청이 없어도 모든 수술을 촬영한다.", explain: "설치 의무와 실제 촬영 조건은 달라요. 의료법 개정에 따른 촬영은 환자나 보호자가 요청할 때 이뤄져요.", claimIds: ["claim-law"] },
    { id: "ox4", answer: false, statement: "수술실 CCTV 의무화 법안이 통과되자 의료계는 이를 수용해 법적 다툼을 하지 않았다.", explain: "의료계는 법 통과 뒤 헌법소원을 냈어요. 법이 통과됐다고 해서 의료계의 이견이 사라진 것은 아니에요.", claimIds: ["claim-law"] },
  ],
  "gyeonggi-shincheonji": [
    { id: "ox1", answer: true, statement: "경기도의 신천지 대응에는 도내 예배당 폐쇄와 집회·봉사활동 중단 지시가 포함됐다.", explain: "이재명 경기도지사는 도내 모든 신천지 예배당을 즉시 폐쇄하고 집회와 봉사활동을 중단하도록 지시했어요. 신도 전수조사도 실시하겠다고 밝혔어요.", claimIds: ["claim-order"] },
    { id: "ox2", answer: true, statement: "경기도는 확보한 명단을 바탕으로 도 연고 신천지 신도들에게 전화로 증상을 물었다.", explain: "경기도는 확보한 명단을 바탕으로 도 연고 신천지 신도를 대상으로 전수조사를 진행했어요. 조사 방식은 전화 문진이었어요.", claimIds: ["claim-survey"] },
    { id: "ox3", answer: false, statement: "경기도의 신천지 신도 전수조사에서는 코로나19 증상이 있는 신도가 한 명도 나오지 않았다.", explain: "경기도는 전수조사 결과 코로나19 유증상자가 740명으로 확인됐다고 밝혔어요. 증상이 있는 신도가 없었던 것이 아니에요.", claimIds: ["claim-symptom"] },
    { id: "ox4", answer: false, statement: "경기도의 신천지 명단 확보는 강제 조사 없이 교회 측의 자발적인 제출만으로 이뤄졌다.", explain: "경기도는 감염병 예방·관리 법률에 근거해 신천지 부속기관에 강제 역학조사를 집행했어요. 이 조사로 명단을 확보했어요.", claimIds: ["claim-entry"] },
  ],
  "gyeonggi-valley": [
    { id: "ox1", answer: true, statement: "경기도 청정계곡 사업은 시·군과 협력해 하천과 계곡의 불법점유 시설물을 정비하는 사업이다.", explain: "경기도는 청정계곡 도민환원 사업을 추진하며 시·군과 함께 불법점유 시설물에 대한 조치에 들어갔어요.", claimIds: ["claim-start"] },
    { id: "ox2", answer: true, statement: "경기도의 2020년 봄 집계에서 계곡 불법시설 철거는 행정대집행보다 자진철거가 많았다.", explain: "당시 경기도 집계에서는 영업주 등이 스스로 철거한 곳이 행정대집행으로 철거한 곳보다 훨씬 많았어요.", claimIds: ["claim-2020"] },
    { id: "ox3", answer: false, statement: "경기도는 2020년 봄 계곡 정비 집계에서 실제 사람이 사는 시설도 모두 철거 대상으로 삼았다.", explain: "당시 집계에서 실제 주거용 시설은 철거 대상에서 제외됐어요.", claimIds: ["claim-2020"] },
    { id: "ox4", answer: false, statement: "경기도의 2021년 중간 집계에서는 계곡 불법시설이 모두 정비돼 소송 중인 시설도 남지 않았다.", explain: "2021년 6월 말 기준으로 정비되지 않은 시설이 남아 있었어요. 실제 주거시설과 소송이 진행 중인 시설이었어요.", claimIds: ["claim-2021"] },
  ],
  "housing-stabilization": [
    { id: "ox1", answer: true, statement: "정부의 주택 공급 확대방안은 수도권에서 주택 공사를 시작할 물량을 늘리겠다는 계획이다.", explain: "발표된 공급 물량은 착공 기준 계획이에요. 이미 공사를 시작했거나 완공한 실적을 뜻하지 않아요.", claimIds: ["hs-supply"] },
    { id: "ox2", answer: true, statement: "서울 토지거래허가구역 지정 뒤 1년간 전셋값은 오르고 전월세 매물은 1년 전보다 줄었다.", explain: "해당 기간 서울 아파트 전세가격지수는 올랐어요. 서울 전월세 매물은 1년 전보다 감소했어요.", claimIds: ["hs-jeonse"] },
    { id: "ox3", answer: false, statement: "토지거래허가구역에서는 주택을 취득해도 직접 거주할 의무 없이 바로 임대할 수 있다.", explain: "토지거래허가구역에서는 주택 취득 후 실거주 의무가 붙었어요. 거주 의무 없이 임대할 수 있다는 설명은 맞지 않아요.", claimIds: ["hs-1015"] },
    { id: "ox4", answer: false, statement: "강남·서초의 일부 하락과 함께 10·15 대책 직후부터 1년간 서울 전체 아파트값도 내렸다.", explain: "일부 지역의 주간 하락과 서울 전체의 연간 흐름은 달라요. 대책 직후부터 1년간 서울 전체 아파트 매매가격은 올랐어요.", claimIds: ["hs-seoul-price", "hs-district"] },
  ],
  "inbound-tourism": [
    { id: "ox1", answer: true, statement: "문화체육관광부는 관광객 증가 배경으로 비자 완화와 K-컬처 확산을 함께 꼽았다.", explain: "문화체육관광부는 항공편 확충과 비자 발급 완화 등 정책뿐 아니라 K-컬처 확산과 국민 환대도 성과의 배경으로 들었어요.", claimIds: ["tr-policy"] },
    { id: "ox2", answer: true, statement: "외국인 관광객 증가는 수도권 밖 공항과 항만으로 들어오는 외국인 증가로도 나타났다.", explain: "비수도권 공항·항만으로 들어온 외국인은 전년 같은 기간보다 늘었어요. 수도권 밖 입국 경로에서도 증가가 나타난 거예요.", claimIds: ["tr-region"] },
    { id: "ox3", answer: false, statement: "한국을 찾는 외국인 관광객 증가는 중화권에만 나타났고 일본과 구미주에서는 줄었다.", explain: "중화권뿐 아니라 일본과 구미주 출신 방한객도 전년 같은 기간보다 늘었어요. 증가가 중화권에만 한정된 것은 아니에요.", claimIds: ["tr-origin-mix"] },
    { id: "ox4", answer: false, statement: "문화체육관광부는 자료 기준일에 연말 관광객 목표를 이미 달성했다고 발표했다.", explain: "자료 기준일에는 연말 목표를 아직 달성하지 못했어요. 문화체육관광부는 연말까지 목표를 달성할 수 있다고 전망했어요.", claimIds: ["tr-forecast"] },
  ],
  "judicial-reform": [
    { id: "ox1", answer: true, statement: "재판소원은 대법원 판결을 포함한 법원 재판의 위헌 여부를 헌법재판소가 판단하는 제도다.", explain: "재판소원은 법원의 재판을 헌법소원심판 청구 대상에 포함한 제도예요. 헌법재판소가 대법원 판결을 포함한 법원 재판의 위헌 여부를 판단할 수 있어요.", claimIds: ["claim-appeal"] },
    { id: "ox2", answer: true, statement: "사법개혁 3법에는 직무 위축과 분쟁 장기화, 사법부 독립성에 대한 우려가 제기됐다.", explain: "법왜곡죄에는 판·검사 직무 위축, 재판소원에는 분쟁 장기화 우려가 제기됐어요. 대법관 증원에도 사법부 독립성에 대한 우려가 따랐어요.", claimIds: ["claim-criticism"] },
    { id: "ox3", answer: false, statement: "재판소원은 형사재판에만 적용되므로 민사·행정 소송의 재판은 대상에서 빠진다.", explain: "재판소원은 형사재판에만 한정되지 않아요. 민사·행정 소송까지 적용되는 제도예요.", claimIds: ["claim-appeal"] },
    { id: "ox4", answer: false, statement: "대법관 증원법은 공포와 동시에 대법관 수를 한꺼번에 늘리도록 한 법이다.", explain: "대법관 증원은 공포와 동시에 이뤄지는 것이 아니에요. 법에 따라 나중에 시작해 여러 해에 걸쳐 단계적으로 늘려요.", claimIds: ["claim-bench", "claim-pass"] },
  ],
  "mexico-visit": [
    { id: "ox1", answer: true, statement: "한·멕시코 전대금융은 현지 은행을 통해 한국산 물품·서비스 구매자에게 자금을 빌려주는 방식이다.", explain: "현지 은행에 신용한도를 설정해 한국산 물품·서비스를 사는 쪽에 자금을 빌려주는 방식이에요. 양국 수출입은행이 이를 신설하기로 했어요.", claimIds: ["claim-finance"] },
    { id: "ox2", answer: true, statement: "이재명 대통령은 한국 방산 기술의 멕시코 현지 생산을 위해 상대 정상에게 지원을 요청했다고 밝혔다.", explain: "이 대통령은 현지 생산과 제3국 시장 공동 진출을 위해 셰인바움 대통령의 관심과 지원을 요청했다고 밝혔어요. 요청했다는 발언과 생산 확정은 구분해야 해요.", claimIds: ["claim-defense-ask"] },
    { id: "ox3", answer: false, statement: "한·멕시코 투자보장협정 개정은 협상 타결로 서명과 국회 비준동의까지 모두 끝났다.", explain: "이 대통령은 개정 협상이 타결됐다고 밝히면서 서명과 국회 비준동의 등 필요한 절차를 거쳐야 한다고 설명했어요.", claimIds: ["claim-bit"] },
    { id: "ox4", answer: false, statement: "한·멕시코는 이번 정상회담에서 무역협정 체결까지 마쳤다.", explain: "양국은 무역협정 체결에 필요한 공동 이익 연구에 착수하기로 합의했어요. 연구 착수 합의를 무역협정 체결로 볼 수는 없어요.", claimIds: ["claim-trade"] },
  ],
  "nuclear-submarine": [
    { id: "ox1", answer: true, statement: "한국 정부는 핵추진잠수함의 운용·정비 자립성을 확보하기 위해 국내 개발·건조 방침을 밝혔다.", explain: "정부는 전력 획득·유지·정비의 자립성과 안정성을 위해 한국에서 개발·건조하겠다고 밝혔어요.", claimIds: ["claim-where"] },
    { id: "ox2", answer: true, statement: "한미 공동 팩트시트에는 핵추진잠수함 건조 승인과 연료 조달 방안에 관한 협의가 함께 담겼다.", explain: "미국이 한국의 핵추진잠수함 건조를 승인한다는 내용이 담겼어요. 연료 조달 방안을 포함한 관련 요건은 긴밀히 협의하기로 했어요.", claimIds: ["claim-approve"] },
    { id: "ox3", answer: false, statement: "핵추진잠수함 건조 승인은 정부가 계획한 잠수함의 건조와 전력 배치까지 끝났다는 뜻이다.", explain: "정부가 제시한 것은 앞으로의 건조와 전력화 계획이에요. 착공과 진수, 전력화는 모두 이후 목표로 제시됐어요.", claimIds: ["claim-plan"] },
    { id: "ox4", answer: false, statement: "핵추진잠수함 연료는 건조 승인만 있으면 별도 협정이나 미국 의회 동의 없이 이전받을 수 있다.", explain: "핵연료 이전에는 별도 협정 체결과 미국 의회 동의가 필요해요. 2026년 9월 19일 기준으로 관련 협상도 타결되지 않았어요.", claimIds: ["claim-fuel"] },
  ],
  "oil-supply": [
    { id: "ox1", answer: true, statement: "산업통상부는 중동산 원유 의존도를 낮추려고 미국·호주·알제리 등으로 수입처를 넓히겠다고 밝혔다.", explain: "산업통상부는 미국·호주·알제리 등으로 도입선을 넓혀 중동산 비중을 낮추겠다고 발표했어요. 한 지역에 대한 의존도를 줄이려는 방향이에요.", claimIds: ["claim-share"] },
    { id: "ox2", answer: true, statement: "국회 입법조사처는 비축유 스와프 사용량과 이후 회복 수준이 충분히 공개되지 않았다고 지적했다.", explain: "국회 입법조사처는 민간재고와 비축유 스와프를 얼마나 사용했고 어느 수준까지 회복했는지 공개가 충분하지 않다고 지적했어요.", claimIds: ["claim-reserve"] },
    { id: "ox3", answer: false, statement: "석유 최고가격제는 정유사 공급가격 대신 소비자가 주유소에서 내는 판매가격에 상한을 둔다.", explain: "상한을 두는 대상은 정유사가 주유소·대리점에 출고하는 공급가격이에요. 소비자가 주유소에서 내는 판매가격에 직접 상한을 두는 방식은 아니에요.", claimIds: ["claim-cap"] },
    { id: "ox4", answer: false, statement: "정부는 비축유 스와프를 정유사에 기름을 공급한 뒤 돌려받지 않는 방식이라고 설명했다.", explain: "정부가 설명한 스와프는 비축유를 먼저 공급하고 정유사가 해외 대체유를 들여온 뒤 같은 양을 반환하는 방식이에요. 돌려받지 않는 지원이 아니에요.", claimIds: ["claim-swap"] },
  ],
  "prosecution-reform": [
    { id: "ox1", answer: true, statement: "국회를 통과한 검찰개혁 법률은 검찰청을 폐지하고 수사와 기소를 분리하는 내용을 담았다.", explain: "중대범죄수사청법과 공소청법이 국회를 통과해 공포됐어요. 두 법에 따라 검찰청을 폐지하고 수사와 기소를 분리하도록 정했어요.", claimIds: ["claim-law"] },
    { id: "ox2", answer: true, statement: "법에 따른 역할 분담에서 중수청은 권력형 부패범죄 등을 수사하고 검사는 기소와 공소유지를 맡는다.", explain: "중수청은 권력형 부패범죄와 대규모 경제범죄 등을 수사하도록 정했어요. 검사는 영장 청구와 기소, 공소유지를 맡아요.", claimIds: ["claim-agencies"] },
    { id: "ox3", answer: false, statement: "법에 따라 수사와 기소를 분리해도 검사는 직접 수사를 시작할 권한을 그대로 유지한다.", explain: "법에 따른 역할 분담에서 검사는 수사개시권을 잃어요. 영장 청구와 기소, 공소유지 업무를 맡도록 정했어요.", claimIds: ["claim-agencies"] },
    { id: "ox4", answer: false, statement: "시행을 앞두고 집계된 중수청 지원자 수는 정원을 웃돌아 필요한 인원보다 많았다.", explain: "2026년 9월 16일 기준 지원자 수는 중수청 정원보다 적었어요. 이 수치는 지원자 집계예요.", claimIds: ["claim-staffing"] },
  ],
  "rail-merger": [
    { id: "ox1", answer: true, statement: "KTX·SRT 통합 예매 앱에서는 두 열차를 한 곳에서 조회하고 예매할 수 있게 됐다.", explain: "따로 운영되던 코레일톡과 SRT 앱이 코레일+로 통합됐어요. 이 앱에서 KTX와 SRT를 함께 조회하고 예매할 수 있어요.", claimIds: ["claim-app"] },
    { id: "ox2", answer: true, statement: "국토교통부는 통합 운행과 함께 고속철도 좌석 공급을 늘리고 수서축 좌석도 확대한다고 밝혔다.", explain: "국토교통부는 주중과 주말 모두 좌석을 추가 공급한다고 밝혔어요. 수서축 좌석도 확대된다는 내용이에요.", claimIds: ["claim-seats"] },
    { id: "ox3", answer: false, statement: "KTX·SRT 통합 때 고속철도 운임은 기존 SRT보다 높은 쪽에 맞춰 인상됐다.", explain: "운임은 기존 SRT 수준으로 조정돼 평균적으로 낮아졌어요. 서울~부산과 용산~광주송정 운임도 내렸어요.", claimIds: ["claim-fare"] },
    { id: "ox4", answer: false, statement: "KTX·SRT 통합은 기관 통합 절차를 남겨 둔 채 예매 앱만 합친 단계다.", explain: "국토교통부는 기관 통합에 필요한 법정·행정 절차를 모두 마치고 통합 운행을 시작한다고 밝혔어요. 기존 SRT 차량의 명칭도 바뀌었어요.", claimIds: ["claim-merge"] },
  ],
  "resource-diplomacy": [
    { id: "ox1", answer: true, statement: "한국과 아르헨티나의 리튬 협력은 양국 기업이 탐사와 채굴에 공동 투자하는 내용의 합의다.", explain: "양국은 리튬 탐사·채굴에 기업들이 공동 투자하는 핵심광물 협력 양해각서를 체결했어요.", claimIds: ["claim-argentina"] },
    { id: "ox2", answer: true, statement: "한국과 카자흐스탄은 세계적인 공급 차질이 생길 때 원유 공급을 확대하기로 합의했다.", explain: "양국은 글로벌 공급 차질 시 원유 공급 확대에 합의했어요. 원전과 소형모듈원자로의 공동 연구개발도 논의했어요.", claimIds: ["claim-kazakh"] },
    { id: "ox3", answer: false, statement: "아르헨티나 원유 도입은 2026년에 시범 단계를 건너뛰고 곧바로 정식 수입으로 시작됐다.", explain: "2026년에 이뤄진 것은 원유 시범 도입이에요. 정식 수입은 2027년부터 시작하는 것으로 제시돼 있어요.", claimIds: ["claim-argentina"] },
    { id: "ox4", answer: false, statement: "과거 이명박 정부의 자원외교에서는 체결한 양해각서가 모두 본계약으로 이어졌다.", explain: "당시 체결한 양해각서 가운데 일부만 본계약으로 이어졌어요. 양해각서 체결과 본계약 성사를 같은 단계로 볼 수 없어요.", claimIds: ["claim-mb-mou"] },
  ],
  "seongnam-debt": [
    { id: "ox1", answer: true, statement: "성남시가 모라토리엄을 선언하며 밝힌 채무에는 판교특별회계에서 가져다 쓴 돈이 포함됐다.", explain: "당시 성남시가 밝힌 규모에는 공원로 확장 등에 쓰인 판교특별회계 전입금과 예산 미편성 의무금이 포함됐어요.", claimIds: ["claim-moratorium"] },
    { id: "ox2", answer: true, statement: "성남시의 일반회계 채무 전액 상환에는 국비로 자동 상환되는 특별회계 채무라는 예외가 있었다.", explain: "성남시는 일반회계 채무를 전액 상환했어요. 다만 국비로 자동 상환되는 공기업특별회계 채무는 남아 있었어요.", claimIds: ["claim-zero"] },
    { id: "ox3", answer: false, statement: "성남시의 모라토리엄 졸업 발표는 일반회계 채무까지 이미 모두 갚았다는 뜻이었다.", explain: "졸업 발표는 모라토리엄 당시 밝힌 채무를 모두 정리했다는 내용이에요. 일반회계 채무 전액 상환은 그보다 뒤인 2018년에 이뤄졌어요.", claimIds: ["claim-graduation", "claim-zero"] },
    { id: "ox4", answer: false, statement: "성남시는 모라토리엄을 선언한 해부터 일반회계 채무를 전액 갚은 해까지 지방채를 발행하지 않았다.", explain: "성남시는 2010년부터 8년간 지방채를 발행하기도 하고 상환하기도 했어요. 이 기간에는 발행액보다 상환액이 더 많았어요.", claimIds: ["claim-bond", "claim-zero"] },
  ],
  "seongnam-hospital": [
    { id: "ox1", answer: true, statement: "성남시의료원은 주민들이 조례를 발의해 설립한 전국 첫 공공병원이다.", explain: "성남시의료원은 주민발의 조례로 설립된 전국 첫 공공병원이에요. 주민의 조례 발의가 병원 설립으로 이어진 사례예요.", claimIds: ["claim-first"] },
    { id: "ox2", answer: true, statement: "성남에서는 기존 병원들이 문을 닫은 뒤 시민들이 시립병원 설립 추진위원회를 꾸렸다.", explain: "인하병원과 중앙병원이 문을 닫은 뒤 각계각층의 성남 시민이 참여한 설립 추진위원회가 구성됐어요.", claimIds: ["claim-closure"] },
    { id: "ox3", answer: false, statement: "성남시의료원 설립을 위한 주민발의 조례안은 시의회에 처음 제출됐을 때 바로 가결됐다.", explain: "주민발의 조례안은 시의회에서 두 차례 부결됐어요. 이후에야 시립병원 설립 조례가 가결됐어요.", claimIds: ["claim-petition", "claim-passed"] },
    { id: "ox4", answer: false, statement: "성남시의료원은 코로나19로 개원식이 미뤄진 동안에는 진료도 시작하지 못했다.", explain: "성남시의료원은 진료를 먼저 시작했어요. 정식 개원식은 코로나19로 미뤄져 나중에 온라인으로 열렸어요.", claimIds: ["claim-open"] },
  ],
  "seongnam-meals": [
    { id: "ox1", answer: true, statement: "성남시 무상급식은 초등학교 일부 학년에서 시작해 의무교육 대상 전체로 확대됐다.", explain: "처음에는 초등학교 1학년을 대상으로 시작했어요. 이후 의무교육 대상자 모두가 무상급식을 받게 됐어요.", claimIds: ["claim-start", "claim-expand"] },
    { id: "ox2", answer: true, statement: "성남시의 고등학교 무상급식 확대 전에도 사립유치원 아이들이 지원받고 있었다.", explain: "고등학교로 확대하기 전부터 사립유치원과 초등학교, 중학교에 무상급식을 지원하고 있었어요.", claimIds: ["claim-scale"] },
    { id: "ox3", answer: false, statement: "성남시 무상급식은 사업을 시작할 때부터 고등학생까지 모두 지원하는 방식이었다.", explain: "사업은 초등학교 1학년을 대상으로 시작했어요. 고등학교 전면 시행은 그보다 나중에 이뤄졌어요.", claimIds: ["claim-start", "claim-highschool"] },
    { id: "ox4", answer: false, statement: "성남시에서 의무교육 대상 전체로 무상급식을 넓힐 때 고등학교도 함께 전면 시행했다.", explain: "의무교육 대상 전체로 확대된 뒤에 고등학교 무상급식이 전면 시행됐어요. 두 단계는 구분해야 해요.", claimIds: ["claim-expand", "claim-highschool"] },
  ],
  "seongnam-welfare": [
    { id: "ox1", answer: true, statement: "성남시 청년배당은 거주·연령 요건을 갖춘 청년에게 소득이나 취업 여부를 따지지 않고 지급했다.", explain: "정해진 거주 기간과 연령 요건을 충족하면 소득·재산·취업 여부를 따지지 않았어요. 지급 수단은 성남사랑상품권이었어요.", claimIds: ["claim-youth"] },
    { id: "ox2", answer: true, statement: "성남시 무상교복은 기초생활수급자 자녀 지원에서 시작해 이후 보편 지원으로 확대됐다.", explain: "처음에는 기초생활수급자 자녀에게 교복을 지급했어요. 이후 보편 지원으로 넓어져 관내 중·고등학교 신입생을 지원했어요.", claimIds: ["claim-uniform-2011", "claim-uniform-universal"] },
    { id: "ox3", answer: false, statement: "성남시 무상복지 소송은 대법원이 사전협의 절차에 문제가 없다고 판결하면서 끝났다.", explain: "경기도가 소송을 취하해 대법원의 판단은 나오지 않았어요. 절차 위반 여부도 법적으로 결론나지 않았어요.", claimIds: ["claim-withdraw"] },
    { id: "ox4", answer: false, statement: "성남시 청년배당은 성남사랑상품권 대신 현금을 지급하는 방식으로 운영됐다.", explain: "청년배당은 현금이 아니라 성남사랑상품권으로 지급하는 제도예요.", claimIds: ["claim-youth"] },
  ],
  "stock-market": [
    { id: "ox1", answer: true, statement: "개정 상법은 이사가 회사뿐 아니라 전체 주주의 이익도 공평하게 대우하도록 했다.", explain: "이사가 총주주의 이익을 보호하고 전체 주주의 이익을 공평하게 대우하도록 하는 조항이 신설됐어요.", claimIds: ["claim-duty"] },
    { id: "ox2", answer: true, statement: "불공정거래 행위자에게는 과징금 외에 금융투자상품 거래를 제한하는 명령도 시행됐다.", explain: "불공정거래 행위자에게 과징금을 부과할 수 있어요. 금융투자상품 거래와 상장사 임원 선임·재임을 제한하는 명령도 시행됐어요.", claimIds: ["claim-manipulation"] },
    { id: "ox3", answer: false, statement: "개정 상법에 따르면 회사가 사들인 자기주식은 용도와 관계없이 예외 없이 소각해야 한다.", explain: "자기주식은 원칙적으로 소각해야 하지만 예외가 있어요. 임직원 보상 등의 경우에는 주주총회 승인에 따라 보유와 처분이 허용돼요.", claimIds: ["claim-buyback"] },
    { id: "ox4", answer: false, statement: "일반주주도 경영권 프리미엄을 나누는 의무공개매수 제도는 이미 시행된 제도다.", explain: "의무공개매수 제도는 자본시장법 개정으로 추진 중이에요. 정부가 제시한 안을 이미 시행된 제도로 보면 안 돼요.", claimIds: ["claim-mto"] },
  ],
  "youth-future-savings": [
    { id: "ox1", answer: true, statement: "청년미래적금은 청년의 저축에 정부 기여금과 이자소득세 면제 혜택을 더하는 상품이다.", explain: "자유롭게 납입하는 적금에 가입 유형별 정부 기여금이 붙고, 이자소득세가 면제돼요.", claimIds: ["ys-product"] },
    { id: "ox2", answer: true, statement: "청년미래적금은 나이뿐 아니라 개인소득과 가구소득 등 가입요건도 따지는 상품이다.", explain: "가입 연령 외에도 개인소득·가구소득 요건이 있으며, 우대형 조건은 별도로 적용돼요.", claimIds: ["ys-eligibility"] },
    { id: "ox3", answer: false, statement: "금융위원회가 발표한 청년미래적금 누적 신청자는 모두 계좌 개설까지 마친 사람들이다.", explain: "금융위원회가 발표한 것은 누적 가입 신청자 수예요. 신청 종료 후 자격심사와 계좌 개설이 별도로 진행돼요.", claimIds: ["ys-demand"] },
    { id: "ox4", answer: false, statement: "청년미래적금의 최대 수익 효과는 정부 기여금과 비과세를 뺀 은행 이자만 뜻한다.", explain: "안내된 최대 효과는 정부 기여금과 비과세 혜택을 포함해 단리 적금으로 환산한 값이에요. 은행 금리 자체와는 달라요.", claimIds: ["ys-rate"] },
  ],
  "integrated-care": [
    { id: "ox1", answer: true, statement: "통합돌봄 본사업은 2026년 3월부터 전국 시군구에서 시행됐다.", explain: "2026년 3월 27일부터 전국 229개 시군구에서 의료·요양·돌봄을 함께 설계하고 연계하는 본사업이 시행됐어요.", claimIds: ["ic-launch"] },
    { id: "ox2", answer: true, statement: "통합돌봄 대상에는 의료 필요도가 높은 중증 장애인도 포함된다.", explain: "65세 이상 노인과 함께 의료 필요도가 높은 중증 장애인(지체·뇌병변 등)도 대상이에요.", claimIds: ["ic-access"] },
    { id: "ox3", answer: false, statement: "통합돌봄의 근거 법률은 이재명 정부 출범 뒤에 처음 만들어졌다.", explain: "돌봄통합지원법은 2024년 3월 26일 제정됐고 2026년 3월 27일 시행됐어요. 제정은 현 정부 출범 전이에요.", claimIds: ["ic-law"] },
    { id: "ox4", answer: false, statement: "첫 실태조사에서 인구감소지역은 모든 돌봄 서비스의 충족률이 일반지역보다 낮았다.", explain: "방문진료·재택의료센터는 인구감소지역이 낮았지만, 지역사회중심재활·노인맞춤돌봄 등은 인구감소지역이 더 높았어요.", claimIds: ["ic-gap"] },
  ],
  "regional-doctors": [
    { id: "ox1", answer: true, statement: "지역의사선발전형으로 뽑힌 학생은 면허를 딴 뒤 정해진 지역에서 10년간 복무해야 한다.", explain: "학비를 지원받는 대신 의사면허 취득 후 선발 때 공고된 지역에서 10년간 복무해요.", claimIds: ["rd-service"] },
    { id: "ox2", answer: true, statement: "지역의사법은 2026년 2월부터 시행됐다.", explain: "지역의사법은 2025년 12월 23일 공포됐고 2026년 2월 24일 시행됐어요.", claimIds: ["rd-enforcement"] },
    { id: "ox3", answer: false, statement: "비대면진료를 제도화한 개정 의료법은 공포와 동시에 바로 시행됐다.", explain: "2025년 12월 23일 공포됐고, 공포 1년 뒤인 2026년 12월 24일에 시행될 예정이에요.", claimIds: ["rd-telemedicine-date"] },
    { id: "ox4", answer: false, statement: "개정 의료법은 비대면진료를 대면진료를 대신하는 기본 진료 방식으로 정했다.", explain: "비대면진료는 대면진료의 보완적 수단이에요. 재진환자·의원급 의료기관 중심으로 운영하도록 했어요.", claimIds: ["rd-telemedicine-design"] },
  ],
  "working-hours": [
    { id: "ox1", answer: true, statement: "노사정은 실노동시간을 2030년까지 OECD 평균 수준으로 줄이기로 했다.", explain: "노사정 공동선언에서 2030년까지 OECD 평균 수준(연 1,700시간대)으로 줄이도록 노력하기로 했어요.", claimIds: ["wh-target"] },
    { id: "ox2", answer: true, statement: "고용노동부는 임금 감소 없이 노동시간을 줄이는 기업에 노동자 1인당 지원금을 주겠다고 밝혔다.", explain: "워라밸+4.5 프로젝트로 노사 합의로 임금 감소 없이 실노동시간을 줄이는 기업에 해당 노동자 1인당 지원한다고 밝혔어요.", claimIds: ["wh-support"] },
    { id: "ox3", answer: false, statement: "워라밸+4.5 프로젝트 참여 기업은 모두 주 4.5일제 방식으로만 노동시간을 줄였다.", explain: "금요일 오후 휴무나 격주 휴무 외에 주 38시간제·주 35시간제 같은 방식도 있었어요.", claimIds: ["wh-june-status"] },
    { id: "ox4", answer: false, statement: "6월 말 워라밸+4.5 프로젝트 참여 기업은 대부분 대기업이었다.", explain: "6월 말 참여 기업 가운데 50인 미만 기업이 67.9%였어요.", claimIds: ["wh-june-status"] },
  ],
  "local-currency": [
    { id: "ox1", answer: true, statement: "개정 지역사랑상품권법은 국가와 지자체의 상품권 발행·운영 지원을 의무로 정했다.", explain: "상품권 발행·판매·환전 등 운영에 필요한 행정적·재정적 지원이 의무가 됐어요.", claimIds: ["lc-support"] },
    { id: "ox2", answer: true, statement: "개정법은 인구감소지역에 보조금을 추가로 반영할 수 있는 근거를 새로 만들었다.", explain: "인구감소지역에 보조금 예산을 더 반영할 수 있는 근거가 생겼어요. 금액이나 비율을 정한 것은 아니에요.", claimIds: ["lc-depopulation"] },
    { id: "ox3", answer: false, statement: "개정 지역사랑상품권법에 따라 모든 지자체는 상품권을 반드시 발행해야 한다.", explain: "법은 지자체장이 상품권을 발행할 수 있다고 정해요. 지원이 의무가 된 것이지 발행이 의무가 된 것은 아니에요.", claimIds: ["lc-optional"] },
    { id: "ox4", answer: false, statement: "국가 지원 의무화 조항은 법이 공포된 날부터 바로 시행됐다.", explain: "개정법은 2025년 8월 26일 공포됐지만 지원 의무화는 2026년 1월 1일부터 시행됐어요.", claimIds: ["lc-dates"] },
  ],
  "yellow-envelope": [
    { id: "ox1", answer: true, statement: "개정 노동조합법은 근로조건을 실질적으로 지배·결정하는 원청도 그 범위에서 사용자로 본다.", explain: "근로계약 당사자가 아니어도 근로조건을 실질적이고 구체적으로 지배·결정할 수 있으면 그 범위에서 사용자로 인정돼요.", claimIds: ["ye-employer"] },
    { id: "ox2", answer: true, statement: "노란봉투법은 2026년 3월부터 시행됐다.", explain: "2025년 8월 24일 국회를 통과해 9월 9일 공포됐고, 2026년 3월 10일 시행됐어요.", claimIds: ["ye-enactment"] },
    { id: "ox3", answer: false, statement: "노란봉투법은 불법 파업을 포함한 모든 쟁의행위의 손해배상 책임을 없앴다.", explain: "법에 따른 노조 활동의 청구를 제한한 것이에요. 배상책임이 인정되면 근로자별 책임비율을 정하고 감면을 심사해요.", claimIds: ["ye-damages"] },
    { id: "ox4", answer: false, statement: "10월 1일 기준 교섭 요구를 받은 원청 대부분에서 원·하청 교섭이 완전 타결됐다.", explain: "10월 1일 기준 교섭 요구를 받은 원청 460곳 가운데 완전 타결은 3곳이었어요.", claimIds: ["ye-october"] },
  ],
};

for (const items of Object.values(ACHIEVEMENT_OX)) for (const item of items) oxItemSchema.parse(item);
