import type { OxItem } from "./ox";

/**
 * 잼공 1단계 「알기」 — **정부 정책 팩트**의 O/X(정책 단원 `p:<slug>`).
 *
 * 업적 O/X(ox.ts)와 같은 규칙이다. 이재명 정부의 일을 업적 14건보다 넓게 익히도록 위키의 정책 팩트(src/content/policies)에서 만든다.
 *   - 문항은 claimIds의 claim만으로 참·거짓이 가려진다. 풀이는 그 claim으로 답한다.
 *   - 근거 claim은 O·X 모두 확인된 것(verified)만. O 문항의 근거가 부처 주장(CLAIM)이면 문장에 주장한 쪽을 넣는다.
 *   - 숫자는 뜻을 물을 때만, claim에 있는 그대로. validatePolicyOx가 claim에 없는 숫자를 잡는다.
 *   - X 문항은 근거 claim이 곧바로 바로잡는 헷갈리기 쉬운 문장(계획→완료, 일부→전체, 대상 착각). 도는 말이라고 부르지 않는다.
 * ★ 초안은 GPT(Codex)가 확인된 claim만 보고 썼고, 기계 검사 뒤 에이전트가 읽어 고쳤다(docs/jamgong-policy-ox-review.md).
 */
export const POLICY_OX: Record<string, OxItem[]> = {
  "oil-relief-fund": [
    { id: "ox1", answer: true, statement: "고유가 피해지원금은 거주 지역과 계층에 따라 지급액이 달랐다.", explain: "지역과 계층을 구분해 지원금을 지급했어요. 비수도권은 같은 계층의 수도권보다 지급액이 컸어요.", claimIds: ["claim-amounts"] },
    { id: "ox2", answer: true, statement: "고유가 피해지원금의 미성년 자녀 몫은 원칙적으로 세대주가 신청했다.", explain: "미성년 자녀 몫은 주민등록 세대주가 신청하고 받았어요. 성인 구성원이 없는 미성년자 세대주는 직접 신청할 수 있었어요.", claimIds: ["claim-minors"] },
    { id: "ox3", answer: false, statement: "고유가 피해지원금은 주소지와 관계없이 전국 매장에서 쓸 수 있었다.", explain: "주소지 관할 지역의 매장에서만 쓸 수 있었어요. 사용기한 뒤 남은 잔액은 소멸됐어요.", claimIds: ["claim-deadline"] },
  ],
  "housing-measures": [
    { id: "ox1", answer: true, statement: "주택 대출 규제는 수도권·규제지역의 생애최초 구입 LTV를 낮췄다.", explain: "금융당국은 생애최초 구입 LTV를 낮추고 전입 의무를 뒀어요. 수도권·규제지역의 주택 구입 목적 주택담보대출 한도도 제한했어요.", claimIds: ["claim-627"] },
    { id: "ox2", answer: true, statement: "이재명 대통령은 세입자의 계약갱신청구권을 그대로 유지한다고 말했다.", explain: "대통령은 계약갱신청구권이 세입자의 권리라고 말했어요. 세입자가 동의해야 줄일 수 있다고 했어요.", claimIds: ["claim-renewal-president"] },
    { id: "ox3", answer: false, statement: "외국인 토지거래허가구역에서 허가받은 외국인에게는 실거주 의무가 없다.", explain: "해당 구역에서 허가받은 외국인은 정해진 기간 안에 입주해야 해요. 입주 뒤 실거주 의무도 있어요.", claimIds: ["claim-foreign-permit"] },
  ],
  "foreigner-health-vote": [
    { id: "ox1", answer: true, statement: "외국인 건강보험 가입자 전체는 2025년 낸 보험료가 받은 급여보다 많았다.", explain: "외국인 가입자 전체의 건강보험 재정수지는 흑자였어요. 같은 해 중국 국적 가입자의 재정수지는 적자였어요.", claimIds: ["claim-2025"] },
    { id: "ox2", answer: true, statement: "외국인의 건강보험 피부양자 자격에는 국내 거주기간 요건이 있다.", explain: "외국인은 국내에 6개월 이상 살아야 건강보험 피부양자가 될 수 있어요.", claimIds: ["claim-dependent-rule"] },
    { id: "ox3", answer: false, statement: "영주권을 가진 외국인은 요건을 갖추면 대통령선거에도 투표할 수 있다.", explain: "요건을 갖춘 외국인은 지방선거에서만 투표할 수 있어요. 대통령선거와 국회의원선거에는 투표할 수 없어요.", claimIds: ["claim-vote-rule"] },
  ],
  "prosecution-launch": [
    { id: "ox1", answer: true, statement: "검찰청이 폐지된 날 중대범죄수사청과 공소청이 함께 출범했다.", explain: "검찰청 폐지와 두 기관의 출범은 같은 날 이루어졌어요. 공소청은 옛 대검찰청 청사에서 출범식을 열었어요.", claimIds: ["claim-launch"] },
    { id: "ox2", answer: true, statement: "중수청은 출범 당시 정원보다 적은 인원을 임용한 상태였다.", explain: "출범일까지 임용된 인원은 직제상 정원에 못 미쳤어요. 정원을 모두 채운 상태로 출범한 것은 아니에요.", claimIds: ["claim-staffing"] },
    { id: "ox3", answer: false, statement: "중수청과 공소청은 모두 정식 청장이 임명된 상태로 출범했다.", explain: "두 기관 모두 청장 없이 출범했어요. 중수청은 차장이, 공소청은 직무대행이 이끌었어요.", claimIds: ["claim-acting"] },
  ],
  "egg-imports": [
    { id: "ox1", answer: true, statement: "정부가 수입한 계란은 할인 지원을 거쳐 대형마트에서 판매됐다.", explain: "수입 계란은 정부의 할인 지원을 거쳤어요. 이후 대형마트에서 할인 가격으로 판매됐어요.", claimIds: ["claim-sale-price"] },
    { id: "ox2", answer: true, statement: "농림축산식품부는 계란 수입이 공급선 다변화를 위한 것이었다고 밝혔다.", explain: "농림축산식품부는 조류인플루엔자에 따른 계란값 안정을 위한 수입이었다고 설명했어요. 외교 일정과는 무관하다고 밝혔어요.", claimIds: ["claim-ministry"] },
    { id: "ox3", answer: false, statement: "브라질산 계란 수입비용은 대부분 현지 계란 구매비였다.", explain: "브라질산 계란 비용 가운데 현지 구매비보다 항공운송비·관세 등이 훨씬 컸어요. 관세는 국내 세입으로 들어갔어요.", claimIds: ["claim-brazil-breakdown"] },
  ],
  "new-leap-fund": [
    { id: "ox1", answer: true, statement: "새도약기금은 채무자가 따로 신청하지 않아도 대상 채권을 사들인다.", explain: "기금이 금융회사에서 대상 개인 연체채권을 사들이는 구조예요. 개인사업자 채권도 대상에 포함돼요.", claimIds: ["claim-eligibility"] },
    { id: "ox2", answer: true, statement: "새도약기금은 사행성·유흥업 관련 채권을 매입 대상에서 제외한다.", explain: "사행성·유흥업 관련 채권은 매입하지 않아요. 외국인 채권도 매입 대상에서 빠져요.", claimIds: ["claim-exclusions"] },
    { id: "ox3", answer: false, statement: "새도약기금이 사들인 연체채권은 소득이나 재산과 관계없이 모두 소각된다.", explain: "전액 소각에는 소득과 재산 요건이 있어요. 그 밖에는 원금 감면이나 분할상환 등의 채무조정을 해요.", claimIds: ["claim-screening"] },
  ],
  "us-investment": [
    { id: "ox1", answer: true, statement: "한미 관세 합의의 대미투자는 현금 투자와 조선 협력으로 나뉜다.", explain: "현금 투자와 한국 기업 주도의 조선 협력을 합친 구조예요. 현금 투자는 연간 상한 안에서 사업 진행에 따라 집행해요.", claimIds: ["claim-structure"] },
    { id: "ox2", answer: true, statement: "한미 관세 합의는 원리금 회수가 보장되는 사업으로 투자를 한정했다.", explain: "상업적 합리성과 원리금 회수가 보장되는 사업만 투자 대상이에요. 원금 회수가 어려우면 수익 배분 비율을 조정할 수 있어요.", claimIds: ["claim-repayment"] },
    { id: "ox3", answer: false, statement: "한미 관세 합의로 한국은 쌀과 쇠고기 시장을 추가 개방했다.", explain: "같은 합의로 관세는 낮아졌지만 쌀과 쇠고기 시장은 추가로 열지 않았어요.", claimIds: ["claim-tariff"] },
  ],
  "child-allowance": [
    { id: "ox1", answer: true, statement: "아동수당 지급 연령은 한 번에 확대하지 않고 해마다 단계적으로 높인다.", explain: "지급 연령을 매년 한 살씩 높이는 일정이에요. 2026년 지급 대상은 만 9세 미만이에요.", claimIds: ["claim-age-schedule"] },
    { id: "ox2", answer: true, statement: "아동수당은 비수도권과 인구감소지역 아동에게 추가 금액을 지급한다.", explain: "기본 금액에 지역별 추가 지원이 붙어요. 인구감소지역에서 지역사랑상품권으로 받으면 추가 금액이 더 붙어요.", claimIds: ["claim-amount"] },
    { id: "ox3", answer: false, statement: "2026년 아동수당은 이미 만 13세 미만 아동 모두에게 지급된다.", explain: "2026년에는 만 9세 미만이 대상이에요. 이후 지급 연령을 매년 한 살씩 높이는 일정이에요.", claimIds: ["claim-age-schedule"] },
  ],
  "teen-support": [
    { id: "ox1", answer: true, statement: "가족을 돌보는 청소년·청년은 소득 요건에 따라 자기돌봄비를 지원받는다.", explain: "청년미래센터가 가족을 돌보는 청소년·청년에게 자기돌봄비를 지원해요. 장학금·금융·주거 서비스도 연계해요.", claimIds: ["claim-carers"] },
    { id: "ox2", answer: true, statement: "지방청소년정책위원회에는 청소년 위원을 위촉해야 한다.", explain: "지방자치단체의 지방청소년정책위원회에 청소년 위원을 위촉하도록 했어요. 청소년 참여를 위한 국민생각함 패널도 운영해요.", claimIds: ["claim-participation"] },
    { id: "ox3", answer: false, statement: "K-Art 청년 창작자 지원은 예술 분야와 무관하게 모든 청년을 대상으로 한다.", explain: "K-Art 청년 창작자 지원은 순수예술 분야 청년 창작자를 대상으로 해요. 모든 청년에게 주는 지원은 아니에요.", claimIds: ["claim-artists"] },
  ],
  "retirement-pension": [
    { id: "ox1", answer: true, statement: "노사정 퇴직연금 합의는 사업장 규모에 따라 사외적립을 단계적으로 의무화한다.", explain: "모든 사업장에 회사 밖 적립을 의무화하는 방향이에요. 구체적인 단계와 시기는 실태조사 뒤 정하기로 했어요.", claimIds: ["claim-tripartite"] },
    { id: "ox2", answer: true, statement: "고용노동부는 퇴직연금 의무화 뒤에도 일시금 수령이 보장된다고 밝혔다.", explain: "고용노동부는 기존 일시금 수령 방식을 그대로 보장한다고 설명했어요. 일시금을 받지 못한다는 오해를 합의문에 반영했다고 밝혔어요.", claimIds: ["claim-tripartite-lump-sum"] },
    { id: "ox3", answer: false, statement: "노사정 합의의 기금형 퇴직연금은 기존 계약형을 전부 대체한다.", explain: "기금형은 확정기여형에 도입하되 기존 계약형과 병행하기로 했어요. 기존 계약형을 대체하는 합의는 아니에요.", claimIds: ["claim-fund-type"] },
  ],
  "national-debt": [
    { id: "ox1", answer: true, statement: "2026년 확정 예산의 총지출은 전년보다 늘어났다.", explain: "국회가 확정한 2026년 예산의 총지출은 전년보다 커졌어요. 연말 국가채무 규모도 계획에 제시됐어요.", claimIds: ["claim-2026-final"] },
    { id: "ox2", answer: true, statement: "2026년 예산안의 적자국채 규모는 한 해 세입 부족분을 메우기 위한 수치다.", explain: "정부가 예산안에 제시한 적자국채는 2026년 한 해의 숫자예요. 세입 부족분을 메우기 위한 발행 규모예요.", claimIds: ["claim-2026-deficit-bond"] },
    { id: "ox3", answer: false, statement: "2026년 국고채 총발행 한도는 전부 새로 늘어나는 빚에 해당한다.", explain: "총발행 한도에는 새로 늘어나는 순발행뿐 아니라 차환발행도 들어 있어요. 전체가 새 빚인 것은 아니에요.", claimIds: ["claim-2026-issuance"] },
  ],
  "unemployment-benefits": [
    { id: "ox1", answer: true, statement: "정당한 이직 사유가 인정되면 스스로 퇴사해도 구직급여를 받을 수 있다.", explain: "구직급여는 원칙적으로 비자발적 실업이 대상이에요. 다만 규정에 정한 정당한 이직 사유가 있으면 자진 퇴사도 가능해요.", claimIds: ["claim-voluntary-rule"] },
    { id: "ox2", answer: true, statement: "사업주와 짜고 거짓으로 실업급여를 받으면 양쪽 모두 처벌받는다.", explain: "거짓 수급을 공모하면 받은 사람과 사업주 모두 처벌 대상이에요. 정당한 사유에 해당하는지는 고용센터가 인정해요.", claimIds: ["claim-judgement"] },
    { id: "ox3", answer: false, statement: "실제 근로조건이 한 번 낮아지면 곧바로 정당한 이직 사유가 인정된다.", explain: "해당 사유는 이직일 전 1년 이내에 2개월 이상 있어야 해요. 임금이 한 번 깎였다고 바로 해당하지는 않아요.", claimIds: ["claim-annex2-conditions"] },
  ],
  "cash-support-welfare-fraud": [
    { id: "ox1", answer: true, statement: "2025년 민생회복 소비쿠폰은 취업 여부와 관계없이 지급됐다.", explain: "소비쿠폰은 취업 여부와 상관없이 전 국민에게 지급됐어요. 추가 지급은 소득과 지역 등에 따라 달랐어요.", claimIds: ["claim-coupon-target"] },
    { id: "ox2", answer: true, statement: "2025년 소비쿠폰 재원에는 국채 추가 발행과 지출 구조조정이 포함됐다.", explain: "정부안의 재원에는 국채 추가 발행과 지출 구조조정 등이 들어 있었어요. 기금 가용재원도 활용했어요.", claimIds: ["claim-coupon-funding"] },
    { id: "ox3", answer: false, statement: "2025년 소비쿠폰은 소득과 거주 지역에 관계없이 모두 같은 금액을 받았다.", explain: "계층에 따라 첫 지급액이 달랐어요. 추가 지급 여부와 지역별 가산 지원도 달랐어요.", claimIds: ["claim-coupon-target"] },
  ],
  "us-intel-standards": [
    { id: "ox1", answer: true, statement: "익명의 미국 행정부 고위 당국자는 한국의 정보·방첩 관련 동맹 기준 준수를 기대한다고 밝혔다.", explain: "당국자는 한미 정보 협력에 관한 언론 질의에 답했어요. 특히 정보와 방첩 사안에서 동맹 기준 준수를 기대한다고 했어요.", claimIds: ["claim-statement"] },
    { id: "ox2", answer: true, statement: "미국 고위 당국자는 동맹 기준 발언에서 기한이나 불이행 조치를 언급하지 않았다.", explain: "당국자는 동맹의 기준이 구체적으로 무엇인지 설명하지 않았어요. 기한이나 불이행 때의 조치도 말하지 않았어요.", claimIds: ["claim-no-specifics"] },
    { id: "ox3", answer: false, statement: "미국의 동맹 기준 관련 발언은 백악관이 보낸 정부 간 공식 서한이었다.", explain: "발언은 익명 당국자가 언론의 서면 질의에 답한 내용이에요. 보도는 백악관이라고 특정하지 않았어요.", claimIds: ["claim-form"] },
  ],
  "honam-chip-cluster": [
    { id: "ox1", answer: true, statement: "정부는 호남권 반도체 클러스터 부지로 광주 군공항을 정했다.", explain: "대통령 주재 메가프로젝트 민관합동점검회의에서 부지를 정했어요. 결과는 대통령비서실장이 브리핑했어요.", claimIds: ["claim-site-decision"] },
    { id: "ox2", answer: true, statement: "청와대는 광주 군공항 부지가 평탄화돼 공기를 줄일 수 있다고 밝혔다.", explain: "청와대는 기업들이 광주 군공항을 가장 적합한 후보지로 봤다고 설명했어요. 평탄화와 도심·KTX역 접근성 등을 이유로 들었어요.", claimIds: ["claim-site-reason"] },
    { id: "ox3", answer: false, statement: "서남권 첨단산업 발전 비전의 기업 투자 계획은 발표 당시 최종 투자 확정액이었다.", explain: "발전 비전에는 기업의 투자 수요를 반영한 계획이 담겼어요. 8월 보도 기준 최종 투자 결정이 확정됐다는 내용은 없었어요.", claimIds: ["claim-investment-plan"] },
  ],
  "delisting-reform": [
    { id: "ox1", answer: true, statement: "상장폐지 개혁은 시가총액과 공시위반 등 퇴출 요건을 강화했다.", explain: "개혁방안은 상장폐지 요건 강화와 집중관리기간 운영을 담았어요. 절차 효율화도 주요 축이에요.", claimIds: ["claim-announcement"] },
    { id: "ox2", answer: true, statement: "상장폐지 개혁의 시가총액·동전주·공시위반 요건은 상장규정 개정 뒤 시행됐다.", explain: "해당 요건들은 거래소 상장규정 개정과 금융위 승인을 거쳐 시행됐어요. 완전자본잠식 요건은 반기보고서부터 적용해요.", claimIds: ["claim-effective"] },
    { id: "ox3", answer: false, statement: "동전주 상장폐지 요건은 주가가 하루만 기준 아래로 내려가도 즉시 적용된다.", explain: "기준 미달이 연속으로 이어져야 관리종목이 돼요. 관리종목 지정 뒤에도 주가 회복 여부를 확인하는 기간이 있어요.", claimIds: ["claim-penny-stock"] },
  ],
  "small-business-support": [
    { id: "ox1", answer: true, statement: "소상공인 부담경감 크레딧은 공과금과 보험료 결제에 쓰는 디지털 포인트다.", explain: "등록한 카드로 공과금과 보험료를 결제하면 한도 안에서 자동 차감돼요. 현금 지급은 아니에요.", claimIds: ["claim-credit"] },
    { id: "ox2", answer: true, statement: "상생페이백은 카드 소비 증가분을 상품권으로 돌려주는 소비자 환급이다.", explain: "이전 카드 사용액보다 늘어난 소비의 일부를 디지털 온누리상품권으로 돌려줘요. 자영업자 전용 지원금은 아니에요.", claimIds: ["claim-payback"] },
    { id: "ox3", answer: false, statement: "소상공인 배달·택배비 지원을 받으려면 작년 카드 사용 실적이 있어야 한다.", explain: "배달·택배비 지원에는 카드 사용 실적 조건이 없어요. 작년 카드 실적이 조건인 지원은 상생페이백이에요.", claimIds: ["claim-delivery", "claim-payback"] },
  ],
  "child-benefits-total": [
    { id: "ox1", answer: true, statement: "첫만남이용권은 현금이 아닌 국민행복카드 바우처로 지급된다.", explain: "첫만남이용권은 국민행복카드 바우처예요. 출생일부터 정해진 사용기간 안에 써야 해요.", claimIds: ["claim-first-voucher"] },
    { id: "ox2", answer: true, statement: "우리아이자립펀드 지원방안은 소득 구간에 따라 정부 지원 방식을 달리한다.", explain: "소득 구간에 따라 정액 지원이나 부모 납입에 대한 매칭을 적용해요. 부모와 정부 납입을 합친 연간 한도도 있어요.", claimIds: ["claim-fund-plan"] },
    { id: "ox3", answer: false, statement: "우리아이자립펀드는 2026년 10월 현재 이미 가입 가능한 상품이다.", explain: "출시 목표는 2027년 하반기예요. 2026년 10월에는 가입할 수 있는 상품이 아니에요.", claimIds: ["claim-fund-status"] },
  ],
  "housing-loan-budget": [
    { id: "ox1", answer: true, statement: "2026년 정책대출용 주택도시기금 재원은 전년보다 줄었다.", explain: "디딤돌·버팀목 등에 쓰는 기금 재원은 전년보다 줄었어요. 국토교통부는 기금 여유재원이 줄어든 상황을 고려했다고 설명했어요.", claimIds: ["claim-2026-fund-cut"] },
    { id: "ox2", answer: true, statement: "2026년 정책대출의 이차보전 예산은 전년보다 늘어났다.", explain: "은행 재원으로 대출하고 금리 차이를 정부가 메우는 예산이에요. 이 예산은 전년보다 늘었어요.", claimIds: ["claim-2026-interest-subsidy"] },
    { id: "ox3", answer: false, statement: "2027년 정책대출 예산안은 은행 재원을 먼저 쓰는 방식을 폐지했다.", explain: "은행 자체 재원으로 먼저 공급하고 정부가 이자 차이를 보전하는 방식을 이어가요. 기금 여유자금이 회복되면 예전 방식으로 돌아갈 계획이에요.", claimIds: ["claim-2027-plan"] },
  ],
  "korea-japan-evacuation": [
    { id: "ox1", answer: true, statement: "한일 재외국민보호 각서는 제3국 위기 때 대피 협력과 정보 교환을 담았다.", explain: "위기관리 정보 공유와 대피 계획 교환을 담은 각서예요. 자국민 대피 때 상호 협의와 지원도 포함돼요.", claimIds: ["claim-mou-content"] },
    { id: "ox2", answer: true, statement: "한일은 재외국민보호 각서를 맺기 전에도 상대국 국민 대피를 도왔다.", explain: "코로나19 때 귀국을 돕고 수단과 이스라엘에서 대피를 지원했어요. 외교부는 기존 협력을 각서 체결의 계기로 들었어요.", claimIds: ["claim-prior-coop"] },
    { id: "ox3", answer: false, statement: "한일 재외국민보호 각서는 국제법상 구속력 있는 의무를 만든다.", explain: "외교부는 이 각서가 국제법상 법적 구속력 있는 권리나 의무를 만들지 않는다고 설명했어요.", claimIds: ["claim-mou-content"] },
  ],
  "coupang-dispute": [
    { id: "ox1", answer: true, statement: "쿠팡 개인정보 유출 조사에서 전직 직원이 공격자로 지목됐다.", explain: "조사단은 인증 시스템을 설계·개발했던 전직 직원을 공격자로 발표했어요. 퇴사 뒤에도 서명키가 바뀌지 않았어요.", claimIds: ["claim-breach"] },
    { id: "ox2", answer: true, statement: "쿠팡 임시대표의 첫 경찰 조사에서는 증거 인멸 혐의가 집중적으로 다뤄졌다.", explain: "첫 출석 조사에서는 증거 인멸 혐의가 집중적으로 다뤄졌어요. 그 전에 경찰 출석 요구에 두 차례 응하지 않았어요.", claimIds: ["claim-police-first"] },
    { id: "ox3", answer: false, statement: "쿠팡 임시대표는 첫 경찰 조사 전에 나온 출석 요구에 모두 응했다.", explain: "첫 조사 전에 경찰의 출석 요구 두 차례에 응하지 않았어요. 이후 서울경찰청 수사 TF에 처음 출석했어요.", claimIds: ["claim-police-first"] },
  ],
  "labor-union-policy": [
    { id: "ox1", answer: true, statement: "노조 회계공시는 공표 자체보다 조합비 세액공제 요건과 연결된 제도다.", explain: "해당 규모 노조가 결산결과를 공표하지 않으면 조합원이 공제를 받지 못해요. 공표 자체가 의무인 것은 아니에요.", claimIds: ["claim-disclosure-rule"] },
    { id: "ox2", answer: true, statement: "한국노총과 민주노총은 모두 노조 회계공시에 응하기로 했다.", explain: "두 단체 모두 회계공시에 응하기로 했어요. 민주노총은 조합원에게 불이익을 주지 않기 위해서라고 밝혔어요.", claimIds: ["claim-unions-complied"] },
    { id: "ox3", answer: false, statement: "고용노동부는 2026년 회계공시 제도 자체를 없애겠다고 밝혔다.", explain: "고용노동부는 회계공시 제도를 유지하는 방향을 밝혔어요. 없애려는 것은 상급단체 공시와 산하 조합원 세액공제를 연동하는 규정이에요.", claimIds: ["claim-2026-change"] },
  ],
  "pledge-check-2026": [
    { id: "ox1", answer: true, statement: "국민성장펀드는 기금과 민간 자금이 함께 재원을 마련하는 구조다.", explain: "기금과 민간 자금이 함께 재원을 내요. 직접투자·간접투자·인프라투융자·초저리대출로 나눠 운용할 예정이에요.", claimIds: ["claim-growth-fund"] },
    { id: "ox2", answer: true, statement: "개정 계엄법은 계엄 선포 뒤 국회의원의 국회 출입과 회의 방해를 처벌한다.", explain: "국회의원과 국회 소속 공무원의 출입·회의를 방해하면 처벌해요. 계엄 선포·변경 때 국무회의 회의록을 국회에 내도록 했어요.", claimIds: ["claim-martial-law"] },
    { id: "ox3", answer: false, statement: "엔비디아의 한국 GPU 공급 계획 물량은 전부 정부가 구입한다.", explain: "공급 계획 물량 가운데 일부는 정부가 구입해요. 나머지는 민간 기업이 쓰는 것으로 보도됐어요.", claimIds: ["claim-gpu"] },
  ],
  "tasks-check-2026": [
    { id: "ox1", answer: true, statement: "개정 국민투표법은 재외투표인명부에 오른 사람의 투표를 허용했다.", explain: "재외투표인명부에 오른 사람도 투표할 수 있게 했어요. 사전·거소·선상투표도 도입했어요.", claimIds: ["claim-referendum-act"] },
    { id: "ox2", answer: true, statement: "행정안전부 경찰국 폐지 뒤 자치경찰 지원 업무는 종전 소관 부서로 옮겼다.", explain: "경찰국을 없애는 직제 개정령이 공포·시행됐어요. 자치경찰 지원 등은 경찰국 신설 이전 소관 부서로 옮겼어요.", claimIds: ["claim-police-bureau"] },
    { id: "ox3", answer: false, statement: "2026년 개헌안은 국회 의결을 마쳐 개헌 국민투표 절차가 계속됐다.", explain: "본회의 의결 정족수에 못 미쳐 투표가 성립하지 않았어요. 국회의장은 개헌 국민투표를 위한 절차 중단을 선언했어요.", claimIds: ["claim-amendment-failed"] },
  ],
  "single-stock-leverage-etf": [
    { id: "ox1", answer: true, statement: "단일종목 레버리지 ETF·ETN은 국내 시장에 이미 처음 상장됐다.", explain: "단일종목 레버리지 ETF·ETN은 2026년 5월 국내 시장에 처음 상장됐어요.", claimIds: ["claim-listing"] },
    { id: "ox2", answer: true, statement: "단일종목 레버리지 상품 도입과 함께 심화 사전교육이 신설됐다.", explain: "심화 사전교육을 새로 만들었어요. 상품 이름에는 단일종목과 레버리지·인버스를 표기하도록 했어요.", claimIds: ["claim-safeguards"] },
    { id: "ox3", answer: false, statement: "국내 단일종목 레버리지 ETF는 모든 국내 상장주식을 기초 종목으로 쓸 수 있다.", explain: "기초 종목은 정해진 기준을 충족한 국내 우량주로 제한돼요. 모든 국내 상장주식이 대상은 아니에요.", claimIds: ["claim-decree"] },
  ],
  "petition-handling": [
    { id: "ox1", answer: true, statement: "국민신문고 민원 분석에서 가장 큰 비중을 차지한 분야는 교통이었다.", explain: "청와대와 국민권익위원회가 공개한 분석에서 교통 분야가 가장 많았어요. 화재로 운영이 멈춘 기간도 있었어요.", claimIds: ["claim-volume"] },
    { id: "ox2", answer: true, statement: "청와대는 민원 분석을 바탕으로 집단갈등 조정 전문 인력을 늘리겠다고 밝혔다.", explain: "청와대는 권익위 집단갈등조정국 전문 인력을 늘리겠다고 했어요. 시민상담관 위촉과 기관별 담당관 설치도 밝혔어요.", claimIds: ["claim-plan"] },
    { id: "ox3", answer: false, statement: "국민신문고는 해당 분석 기간에 화재 영향 없이 계속 운영됐다.", explain: "국가정보자원관리원 화재로 약 한 달 운영이 멈췄어요. 월평균 민원은 그 기간을 제외해 계산했어요.", claimIds: ["claim-volume"] },
  ],
  "hybe-investigation": [
    { id: "ox1", answer: true, statement: "증권선물위원회는 방시혁 하이브 의장 등을 부정거래 혐의로 고발·통보했다.", explain: "상장 전 투자자 기망과 증권신고서 계약 누락 등의 혐의예요. 증권선물위원회가 검찰에 고발·통보했어요.", claimIds: ["claim-referral"] },
    { id: "ox2", answer: true, statement: "이재명 대통령은 한국거래소 방문에서 주식시장 불공정 행위에 강경한 입장을 밝혔다.", explain: "대통령은 한국거래소 시장감시본부를 방문했어요. 주식시장에서 장난치면 패가망신한다는 것을 보여주겠다고 말했어요.", claimIds: ["claim-pledge"] },
    { id: "ox3", answer: false, statement: "검찰은 경찰이 신청한 방시혁 하이브 의장 구속영장을 그대로 받아들였다.", explain: "검찰은 경찰의 구속영장 신청을 반려했어요. 사회적 법익이 침해됐다는 부분을 더 소명하라고 했어요.", claimIds: ["claim-warrant"] },
  ],
  "oil-price-cap": [
    { id: "ox1", answer: true, statement: "석유제품 최고가격제는 가격 급등락 때 최고액을 정할 수 있는 법 규정에 근거한다.", explain: "석유사업법은 수입·판매 가격이 현저히 오르내리거나 그럴 우려가 있을 때 최고액을 정할 수 있도록 해요.", claimIds: ["claim-basis"] },
    { id: "ox2", answer: true, statement: "최고가격제 손실보전은 정산위원회가 원가와 적정 이윤을 심사한 뒤 이루어진다.", explain: "정유사가 손실액을 산정해 정산을 요청하는 구조예요. 위원회가 심사해 정산가격을 정한 뒤 손실보전금을 줘요.", claimIds: ["claim-settlement"] },
    { id: "ox3", answer: false, statement: "석유제품 최고가격제는 주유소의 소비자 판매가격에 직접 상한을 정한다.", explain: "최고가격제가 제한하는 것은 정유사의 공급가격이에요. 주유소 판매가격은 대상이 아니에요.", claimIds: ["claim-launch"] },
  ],
  "housing-pledge-vs-policy": [
    { id: "ox1", answer: true, statement: "대선 선거공약서의 주거 항목은 공공임대 확대와 전세 보증제도 개선을 담았다.", explain: "고품질 공공임대와 공공임대 비율의 단계적 확대를 담았어요. 전세사기 걱정 없는 보증제도 개선도 포함됐어요.", claimIds: ["claim-pledge-book"] },
    { id: "ox2", answer: true, statement: "이재명 후보는 대선 기간 노후 도심 재개발·재건축의 용적률 상향을 내세웠다.", explain: "서울 노후 도심의 용적률 상향과 분담금 완화를 내세웠어요. 신도시 인프라 재정비와 새 신도시 준비도 언급했어요.", claimIds: ["claim-campaign-supply"] },
    { id: "ox3", answer: false, statement: "대선 선거공약서의 주거 항목에는 부동산 세금 인상 공약이 명시됐다.", explain: "선거공약서 주거 항목에는 부동산 세금을 올리거나 내리는 공약이 없어요. 공공임대와 주거지원 확대 등이 담겼어요.", claimIds: ["claim-pledge-book"] },
  ],
  "supporter-conflict": [
    { id: "ox1", answer: true, statement: "한국갤럽의 2026년 3월 조사에서 대통령 긍정 평가는 부정 평가보다 높았다.", explain: "해당 조사에서는 대통령 직무 긍정 평가가 부정 평가보다 높았어요. 긍정 평가는 취임 뒤 가장 높았어요.", claimIds: ["claim-gallup-high"] },
    { id: "ox2", answer: true, statement: "이재명 대통령은 지향점이 바뀌었다는 누리꾼에게 지향점은 그대로라고 답했다.", explain: "대통령은 해당 글을 공유하며 지향점은 바뀐 게 없다고 답했어요. 대표 범위가 넓어져 방법이 더 신중해졌을 뿐이라고 했어요.", claimIds: ["claim-president-1015"] },
    { id: "ox3", answer: false, statement: "이재명 대통령은 개헌을 자신의 뜻만으로 추진할 수 있다고 말했다.", explain: "대통령은 개헌에 국회의원 200명 이상의 동의가 필요하다고 했어요. 자신의 뜻대로 할 수 없다고 설명했어요.", claimIds: ["claim-president-1015"] },
  ],
  "humidifier-disinfectant-decree": [
    { id: "ox1", answer: true, statement: "가습기살균제 참사 지원대책은 국가와 기업이 함께 책임지는 배상 체계로 바꾼다.", explain: "종합지원대책은 기업 중심 피해구제를 손해배상 체계로 바꾸는 내용이에요. 기업과 국가가 함께 책임지는 방향이에요.", claimIds: ["claim-plan"] },
    { id: "ox2", answer: true, statement: "가습기살균제 특별법 개정으로 피해구제위원회는 배상심의위원회로 바뀐다.", explain: "개정 특별법이 시행됐어요. 기존 피해구제위원회는 국무총리 소속 배상심의위원회로 바뀌어요.", claimIds: ["claim-law"] },
    { id: "ox3", answer: false, statement: "기존 법으로 인정된 가습기살균제 피해자도 배상을 받으려면 새로 신청해야 한다.", explain: "기존 법으로 피해를 인정받은 사람은 시행일에 신청한 것으로 봐요. 인정받지 못한 사람에게는 새 신청기간을 뒀어요.", claimIds: ["claim-existing-victims"] },
  ],
  "prosecution-reform-statements": [
    { id: "ox1", answer: true, statement: "검찰개혁 국정과제는 공소청을 법무부에 두고 중수청을 행안부에 두도록 했다.", explain: "공소청은 공소제기·유지 업무를 전담해요. 종전 검찰청의 중대범죄 수사는 행안부 소속 중수청이 맡도록 적었어요.", claimIds: ["claim-task"] },
    { id: "ox2", answer: true, statement: "대통령은 중수청의 행안부 배치를 수사·기소 기관의 재결합 방지로 설명했다.", explain: "취임 100일 기자회견에서 중수청 소속을 정치적 결정이라고 했어요. 법무부에 함께 맡기면 다시 합쳐질 수 있다고 설명했어요.", claimIds: ["claim-100day"] },
    { id: "ox3", answer: false, statement: "검찰개혁 국정과제는 공소청이 중대범죄 수사까지 전담하도록 정했다.", explain: "국정과제는 공소청이 공소제기·유지를 전담하도록 했어요. 중대범죄 수사는 중수청이 전담하는 내용이에요.", claimIds: ["claim-task"] },
  ],
  "government-communication": [
    { id: "ox1", answer: true, statement: "문화체육관광부 아래에는 국민방송 KTV와 아리랑TV가 있다.", explain: "현재 국정홍보는 문화체육관광부가 맡아요. 그 아래에 국민방송 KTV와 아리랑TV가 있어요.", claimIds: ["claim-structure"] },
    { id: "ox2", answer: true, statement: "KTV는 나누리 포털에서 출처 표시 조건으로 영상 클립을 공개하기 시작했다.", explain: "나누리 포털의 클립은 공공누리 제1유형으로 공개했어요. 출처를 표시하면 상업적 이용과 이차 저작물 작성이 가능해요.", claimIds: ["claim-ktv-open"] },
    { id: "ox3", answer: false, statement: "현재 국정홍보는 부활한 국정홍보처가 담당하고 있다.", explain: "국정홍보처는 폐지됐고 기능은 문화체육관광부로 넘어갔어요. 현재도 문화체육관광부가 담당해요.", claimIds: ["claim-structure"] },
  ],
  "ktv-video-reuse": [
    { id: "ox1", answer: true, statement: "KTV 나누리 포털의 공개 클립은 출처를 표시하면 상업적으로도 이용할 수 있다.", explain: "공개 클립은 공공누리 제1유형으로 이용할 수 있어요. 출처 표시를 조건으로 상업적 이용과 변형도 가능해요.", claimIds: ["claim-nanuri"] },
    { id: "ox2", answer: true, statement: "KTV 나누리 포털은 가입하고 약관에 동의하면 공개 클립을 내려받을 수 있다.", explain: "권리 정비가 끝난 클립을 순차 공개하는 포털이에요. 가입과 약관 동의 뒤 바로 내려받을 수 있어요.", claimIds: ["claim-nanuri"] },
    { id: "ox3", answer: false, statement: "KTV 나누리 포털은 방송용 시사·교양·다큐 완성본을 이미 모두 개방했다.", explain: "해당 프로그램 완성본은 아직 개방하지 않았어요. KTV는 법률 검토를 거쳐 단계적으로 개방하겠다고 했어요.", claimIds: ["claim-exception"] },
  ],
  "government-ad-allocation": [
    { id: "ox1", answer: true, statement: "정부광고 매체 선정에서는 광고주인 정부기관 등의 의견을 먼저 존중한다.", explain: "정부광고법과 시행령은 광고주 기관의 의견을 먼저 존중하도록 해요. 문체부는 기존 지표 활용을 중단하고 요청 때 참고자료를 줘요.", claimIds: ["claim-advertiser"] },
    { id: "ox2", answer: true, statement: "정부광고 집행 내역은 통합지원시스템에서 로그인 없이 볼 수 있다.", explain: "기관별·월별 정부광고 집행 내역을 매달 공개해요. 통합지원시스템에서 로그인 없이 확인할 수 있어요.", claimIds: ["claim-disclosure"] },
    { id: "ox3", answer: false, statement: "정부광고 지표의 가중치는 모든 광고주 기관에 동일하게 강제됐다.", explain: "정부광고 지표의 가중치는 광고주인 각 기관이 스스로 정했어요. 효과성과 신뢰성을 담은 지표였어요.", claimIds: ["claim-index-2021"] },
  ],
  "nps-fund-2026": [
    { id: "ox1", answer: true, statement: "국민연금 외환스와프는 해외투자용 달러를 외환보유액에서 빌리는 구조다.", explain: "시장 매입 대신 외환보유액에서 달러를 빌려요. 당국은 만기에 돌려받아 외환보유액 감소가 일시적이라고 설명해요.", claimIds: ["claim-swap"] },
    { id: "ox2", answer: true, statement: "국민연금의 전략적 환헤지는 환율이 기준보다 오를 때 달러를 파는 제도다.", explain: "정해 둔 기준보다 환율이 오르면 해외자산의 일정 비율까지 달러를 팔아요. 시장에 달러를 공급하는 구조예요.", claimIds: ["claim-hedge"] },
    { id: "ox3", answer: false, statement: "국민연금은 2026년 1월 국내주식 목표비중을 낮추기로 했다.", explain: "기금운용위원회는 국내주식 목표비중을 높였어요. 허용범위를 벗어날 때 기계적으로 매도하는 것도 한시 유예했어요.", claimIds: ["claim-january"] },
  ],
  "ukraine-pow-dispute": [
    { id: "ox1", answer: true, statement: "우크라이나군에 생포됐던 북한군 포로는 2026년 9월 한국에 왔다.", explain: "러시아 쿠르스크에서 생포된 포로들이 한국으로 왔어요. 젤렌스키 대통령이 이를 공개했고 외교부는 송환 사실을 부인하지 않았어요.", claimIds: ["claim-arrived"] },
    { id: "ox2", answer: true, statement: "외교부는 북한군 포로 문제를 당사자의 자유의사를 존중해 해결해야 한다고 밝혔다.", explain: "외교부는 자유의사와 국제법·인도주의 원칙에 맞는 해결을 강조했어요. 신변안전을 이유로 신병과 경로 등은 공개하지 않았어요.", claimIds: ["claim-gov-principle"] },
    { id: "ox3", answer: false, statement: "외교부는 북한군 포로의 신병과 이동 경로를 모두 공개했다고 밝혔다.", explain: "외교부는 당사자와 가족의 신변안전을 이유로 신병과 경로 등을 공개하지 않았어요.", claimIds: ["claim-gov-principle"] },
  ],
  "pyongyang-drone-trial": [
    { id: "ox1", answer: true, statement: "평양 무인기 사건은 계엄 요건 조성을 위한 투입 지시 혐의로 기소됐다.", explain: "특검은 윤석열 전 대통령 등을 일반이적·직권남용 혐의로 기소했어요. 계엄 선포 요건을 만들려 무인기 투입을 지시했다는 혐의예요.", claimIds: ["claim-charge"] },
    { id: "ox2", answer: true, statement: "평양 무인기 사건 1심 재판부는 군사상 이익 침해 위험만 생겨도 일반이적죄가 된다고 봤다.", explain: "재판부는 실제 침해 위험이 생겨도 일반이적죄가 성립한다고 판단했어요. 작전이 군 전력과 운용 방식을 노출했다고 봤어요.", claimIds: ["claim-reasoning"] },
    { id: "ox3", answer: false, statement: "평양 무인기 사건 1심 재판부는 피고인들의 혐의를 모두 무죄로 판단했다.", explain: "1심 재판부는 네 피고인의 혐의를 모두 유죄로 봤어요. 피고인별로 징역형이나 집행유예를 선고했어요.", claimIds: ["claim-verdict"] },
  ],
  "dmz-mine-2026": [
    { id: "ox1", answer: true, statement: "군은 비무장지대 지뢰 폭발로 다친 장병들을 군 병원에 후송했다.", explain: "수색로를 내던 장병들 근처에서 지뢰가 터져 부상자가 발생했어요. 부상자는 헬기 등으로 군 병원에 후송됐어요.", claimIds: ["claim-incident"] },
    { id: "ox2", answer: true, statement: "군은 군사분계선 이남 북한군 지뢰지대 제거 전에 유엔사를 통해 북측에 알렸다.", explain: "군은 북측에 미리 알린 뒤 폭발 원인이 된 지뢰지대를 제거했어요. 군사분계선 이남으로 넘어온 지뢰를 제거하겠다고 밝혔어요.", claimIds: ["claim-removal"] },
    { id: "ox3", answer: false, statement: "합참은 비무장지대 폭발 지뢰가 자연 유실로 넘어온 것이라고 최종 판단했다.", explain: "합참은 파편이 북한군 지뢰와 같다고 확인했어요. 자연 유실이 아니라 인위적으로 매설된 것으로 판단했어요.", claimIds: ["claim-investigation"] },
  ],
  "china-group-visa-free": [
    { id: "ox1", answer: true, statement: "법무부는 중국 단체관광객 무비자 제도의 시행 기간을 연장했다.", explain: "법무부는 제도를 2026년 말까지 연장했어요. 중국이 한국 국민에게 허용한 무비자 기간과 같게 맞췄다고 설명했어요.", claimIds: ["claim-extension"] },
    { id: "ox2", answer: true, statement: "중국 단체관광객 무비자 제도는 입국 명단 사전 점검과 여행사 처분을 둔다.", explain: "입국 명단을 미리 점검해 고위험군을 걸러요. 무단이탈자가 나오면 여행사에 행정처분을 해요.", claimIds: ["claim-safeguard"] },
    { id: "ox3", answer: false, statement: "중국 단체관광객 무비자 제도는 여행사를 거치지 않은 개별 관광객도 포함한다.", explain: "지정 여행사가 모은 단체관광객만 대상이에요. 개별 관광객은 이 제도의 대상이 아니에요.", claimIds: ["claim-conditions"] },
  ],
  "supplementary-budget": [
    { id: "ox1", answer: true, statement: "2025년 첫 추경은 이재명 정부 출범 전에 국회를 통과했다.", explain: "2025년에는 추경이 두 번 있었어요. 첫 추경은 이재명 정부 출범 전에 여야 합의로 처리됐어요.", claimIds: ["claim-2025-first"] },
    { id: "ox2", answer: true, statement: "2026년 첫 추경에는 고유가 지원뿐 아니라 지방재정 보강도 포함됐다.", explain: "고유가 부담 완화 외에 지방재정 보강과 민생 안정 등이 포함됐어요. 산업 피해 최소화와 국채 상환도 들어 있어요.", claimIds: ["claim-2026-items"] },
    { id: "ox3", answer: false, statement: "2026년 첫 추경은 새 국채를 발행해 재원을 마련했다.", explain: "재원은 초과세수와 기금이었어요. 새로 국채를 발행하지 않았어요.", claimIds: ["claim-2026-funding"] },
  ],
  "nk-medical-aid": [
    { id: "ox1", answer: true, statement: "통일부의 강동군병원 지원 계획은 현금이 아닌 의료장비 지원이다.", explain: "엑스레이·CT·청진기·구급차 등 의료장비를 보내는 계획이에요. 현금을 주는 방식은 아니에요.", claimIds: ["claim-plan"] },
    { id: "ox2", answer: true, statement: "북한 의료장비 지원 계획의 남북협력기금 집행 절차는 앞으로 밟을 예정이다.", explain: "보건의료협력 예산을 쓸 계획이에요. 남북교류협력추진협의회 의결 등 기금 집행 절차는 앞으로 진행할 예정이에요.", claimIds: ["claim-funding"] },
    { id: "ox3", answer: false, statement: "정부는 강동군병원 의료장비 지원을 북한이 수용하겠다는 뜻을 확인했다.", explain: "남북 직접 소통이 끊겨 있어 북한이 장비를 받을 뜻이 있는지 확인하지 못했어요.", claimIds: ["claim-north-response"] },
  ],
  "national-security-act-repeal": [
    { id: "ox1", answer: true, statement: "국가보안법 폐지법률안은 정부 제출안이 아니라 국회의원 발의안이다.", explain: "민형배·김준형·윤종오 의원 등이 발의했어요. 정부가 낸 법안은 아니에요.", claimIds: ["claim-bill"] },
    { id: "ox2", answer: true, statement: "국가보안법 폐지법률안은 법제사법위원회 심사 단계에 머물러 있다.", explain: "법안은 법제사법위원회에 회부됐어요. 소관위원회 심사 단계에 머물러 있어요.", claimIds: ["claim-committee"] },
    { id: "ox3", answer: false, statement: "국가보안법 폐지법률안 발의 의원 고발 사건은 경찰이 혐의를 인정해 송치했다.", explain: "경찰은 불송치 결정을 했어요. 국회의원의 법안 발의는 헌법이 보장한 권한이라는 이유였어요.", claimIds: ["claim-complaint"] },
  ],
  "fishermen-repatriation-2019": [
    { id: "ox1", answer: true, statement: "강제북송 어민 사건 2심은 노영민 전 비서실장에게 무죄를 선고했다.", explain: "2심은 노영민 전 비서실장의 공모를 인정하기 어렵다고 봤어요. 다른 피고인들에게는 집행유예가 붙은 징역형을 선고했어요.", claimIds: ["claim-appeal-ruling"] },
    { id: "ox2", answer: true, statement: "강제북송 사건 2심 재판부는 강제북송을 사법심사 대상으로 판단했다.", explain: "재판부는 강제북송이 통치행위가 아니라 사법심사 대상이라고 봤어요. 충분한 법적 검토 없이 북송을 결정한 것이 위법하다고 판단했어요.", claimIds: ["claim-reasoning"] },
    { id: "ox3", answer: false, statement: "강제북송 사건 2심 재판부는 중대범죄 혐의가 있으면 귀순 의사와 무관하게 북송할 수 있다고 봤다.", explain: "재판부는 중대범죄로 보호 대상에서 빠져도 귀순 의사에 반해 북송할 수 없다고 판단했어요.", claimIds: ["claim-reasoning"] },
  ],
  "school-sports-day": [
    { id: "ox1", answer: true, statement: "최교진 교육부 장관은 학교 운동회 소음에 대한 주민들의 이해를 부탁했다.", explain: "교육부 장관은 X에 아이들의 함성을 언급하며 글을 올렸어요. 운동회 소음에 너그러운 이해를 부탁했어요.", claimIds: ["claim-minister"] },
    { id: "ox2", answer: true, statement: "교육부는 운동회 소음 민원에 따른 경찰 출동 문제를 경찰청 등과 협의하겠다고 밝혔다.", explain: "교육부는 경찰 출동 문제를 관계기관과 협의하겠다고 했어요. 체육활동 제한 실태를 살피고 지원도 강화하겠다고 밝혔어요.", claimIds: ["claim-moe-plan"] },
    { id: "ox3", answer: false, statement: "대통령의 왕궁초등학교 운동회 방문 글에는 소음 민원 대책이 담겼다.", explain: "대통령은 운동회를 마을의 축제라고 표현했어요. 해당 글에는 소음 민원에 대한 대책이 없었어요.", claimIds: ["claim-president-visit"] },
  ],
  "english-conversation-instructors": [
    { id: "ox1", answer: true, statement: "영어회화전문강사는 정규 교원 정원 외의 계약직이다.", explain: "영어회화전문강사는 계약직으로 도입됐어요. 계약이 끝나면 공개 채용을 다시 거치는 구조예요.", claimIds: ["claim-structure"] },
    { id: "ox2", answer: true, statement: "국가인권위원회는 영어회화전문강사의 고용안정대책을 교육부에 권고했다.", explain: "국가인권위원회는 무기계약직 전환 등 고용안정대책을 마련하라고 교육부에 권고했어요.", claimIds: ["claim-nhrck"] },
    { id: "ox3", answer: false, statement: "영어회화전문강사는 정규 교원 임용에서 우선권을 갖는다.", explain: "영어회화전문강사에게는 정규 교원 임용의 우선권이 없어요. 계약 종료 뒤 공개 채용을 다시 거쳐요.", claimIds: ["claim-structure"] },
  ],
  "veterans-columbarium": [
    { id: "ox1", answer: true, statement: "인천가족공원 호국봉안담은 인천에 사는 국가유공자를 위한 공설 봉안시설이다.", explain: "인천시의 공설 봉안시설이에요. 대상은 국가보훈기본법에서 정한 국가유공자 가운데 인천에 사는 사람이에요.", claimIds: ["claim-facility"] },
    { id: "ox2", answer: true, statement: "국가보훈부는 국립묘지 밖 안장시설에 실제 낸 사용료도 유족에게 지원한다.", explain: "국립묘지가 아닌 봉안당·봉안장·자연장의 사용료를 지원해요. 국가보훈대상자 유족이 실제 낸 금액에 대해 지원 한도가 있어요.", claimIds: ["claim-mpva-support"] },
    { id: "ox3", answer: false, statement: "인천가족공원 호국봉안담에 안치된 유공자는 다른 곳으로 이장할 수 있다.", explain: "호국봉안담에 이미 안치된 유공자를 다른 곳으로 옮기는 이장은 할 수 없어요.", claimIds: ["claim-terms"] },
  ],
  "daycare-priority": [
    { id: "ox1", answer: true, statement: "어린이집 입소 우선순위에서 맞벌이 가정과 다문화가족은 모두 우선 대상이다.", explain: "맞벌이 가정과 다문화가족 모두 입소 우선 대상이에요. 다문화가족은 여러 우선 대상 가운데 하나예요.", claimIds: ["claim-first-rank"] },
    { id: "ox2", answer: true, statement: "다문화가족은 결혼이민자나 귀화자와 한국 국적자로 이루어진 가족을 말한다.", explain: "다문화가족지원법은 이렇게 가족을 정의하고 있어요. 다문화가족 자녀는 한국 국적인 경우가 많아요.", claimIds: ["claim-definition"] },
    { id: "ox3", answer: false, statement: "어린이집 입소 때 다문화가족 자녀는 다른 모든 우선 대상보다 앞선다.", explain: "다문화가족만 따로 앞세운 제도가 아니에요. 기초생활수급자·한부모가족·맞벌이 가정 등과 함께 우선 대상에 포함돼요.", claimIds: ["claim-first-rank"] },
  ],
  "character-education": [
    { id: "ox1", answer: true, statement: "제3차 인성교육종합계획안은 상호 존중과 협력적 소통 강화를 추진 과제로 담았다.", explain: "계획안에는 교육 구성원 간 상호 존중과 협력적 소통 강화가 들어 있어요. 공동체 기반 협력 체계 구축도 과제예요.", claimIds: ["claim-plan-tasks"] },
    { id: "ox2", answer: true, statement: "제3차 인성교육종합계획안에는 대학생과 학부모를 위한 인성교육도 들어 있다.", explain: "대학생 교양 과목과 봉사활동 학점제를 통한 인성교육 확대가 담겼어요. 학부모 인성교육 콘텐츠도 포함돼 있어요.", claimIds: ["claim-plan-detail"] },
    { id: "ox3", answer: false, statement: "제3차 인성교육종합계획안의 마음건강 교과는 이미 도입이 끝난 교과다.", explain: "마음건강 교과는 가칭으로 도입 방안이 계획안에 들어 있어요. 도입 완료로 제시된 내용은 아니에요.", claimIds: ["claim-plan-detail"] },
  ],
  "stock-stabilization-fund": [
    { id: "ox1", answer: true, statement: "증권시장안정펀드는 금융회사와 증권 유관기관이 돈을 모아 주식을 사는 장치다.", explain: "증시가 급락할 때 금융회사와 증권 유관기관이 출자해 주식을 사들여요. 정부 재정을 직접 넣는 기금은 아니에요.", claimIds: ["claim-structure"] },
    { id: "ox2", answer: true, statement: "금융위원회는 증시 급락 대응으로 상장사의 하루 자사주 매수 주문 한도를 완화했다.", explain: "금융위원회는 하루 자사주 매수 주문 수량 한도를 한시적으로 완화했어요. 금융감독원과 한국거래소는 불법 공매도 집중감시도 시작했어요.", claimIds: ["claim-nov-buyback"] },
    { id: "ox3", answer: false, statement: "11월 25일 보도 기준으로 증권시장안정펀드는 실제 주식 매입을 시작했다.", explain: "해당 보도 기준으로 실제 주식 매입은 시작되지 않았어요. 정부 대응은 가동 준비와 자사주 매수 한도 완화, 공매도 감시까지예요.", claimIds: ["claim-nov-not-yet"] },
  ],
  "pension-reform-2025": [
    { id: "ox1", answer: true, statement: "개정 국민연금법은 국가가 연금급여 지급을 보장하도록 명문화했다.", explain: "개정법에는 국가가 연금급여 지급을 보장한다고 명시돼 있어요. 지급에 필요한 시책도 수립하고 시행하도록 했어요.", claimIds: ["claim-guarantee"] },
    { id: "ox2", answer: true, statement: "국민연금 개혁으로 출산 크레딧 대상이 첫째 자녀부터로 넓어졌다.", explain: "이전에는 둘째 자녀부터 출산 크레딧을 인정했어요. 개혁으로 첫째 자녀부터 인정하도록 대상이 넓어졌어요.", claimIds: ["claim-credits"] },
    { id: "ox3", answer: false, statement: "국민연금 소득대체율 조정으로 기존 수급자의 연금액도 모두 함께 오른다.", explain: "조정된 소득대체율은 2026년 이후 보험료를 내는 기간에 적용돼요. 이미 연금을 받는 사람의 연금액이 다 같이 오르는 것은 아니에요.", claimIds: ["claim-rates"] },
  ],
  "may18-merit-list": [
    { id: "ox1", answer: true, statement: "대법원은 광주 시민들의 5·18 시위를 헌정 질서를 지키기 위한 정당한 행위로 보았다.", explain: "대법원 전원합의체는 광주의 시위 진압을 내란 행위로 판단했어요. 시민들의 시위는 헌정 질서를 지키기 위한 정당한 행위로 보았어요.", claimIds: ["claim-1997"] },
    { id: "ox2", answer: true, statement: "이진숙 의원 등이 낸 5·18 관련 개정안에는 유공자와 유족 명단 공개가 담겼다.", explain: "발의된 개정안에는 민주유공자와 유족, 보상금을 받은 관련자 명단을 해마다 공개하는 내용이 있어요.", claimIds: ["claim-bill"] },
    { id: "ox3", answer: false, statement: "5·18을 폭동이라 쓴 글에 대한 항소심 무죄는 그 표현을 사실로 인정한 판결이다.", explain: "항소심 재판부는 해당 표현을 사실의 적시가 아니라 의견으로 보아 무죄를 선고했어요.", claimIds: ["claim-daegu"] },
  ],
  "president-korean-war-remarks": [
    { id: "ox1", answer: true, statement: "이재명 대통령은 6·25전쟁 추모 글에서 참전용사와 유가족의 희생에 감사를 표했다.", explain: "대통령은 전쟁 주년을 맞아 SNS에 글을 올렸어요. 국군 장병과 참전용사, 유가족의 희생에 존경과 감사를 표했어요.", claimIds: ["claim-2025-post"] },
    { id: "ox2", answer: true, statement: "이재명 대통령은 6·25 기념사에서 참전유공자 지원을 대를 이어 계승하겠다고 했다.", explain: "대통령은 참전용사의 특별한 희생에 특별한 보상과 예우가 따라야 한다고 했어요. 참전유공자 지원의 계승도 약속했어요.", claimIds: ["claim-2026-speech"] },
    { id: "ox3", answer: false, statement: "이재명 대통령의 2026년 6·25 기념사에는 자유라는 말이 전혀 없다.", explain: "해당 기념사에는 자유라는 말이 나와요. 자유민주주의라는 표현은 나오지 않아요.", claimIds: ["claim-2026-words"] },
  ],
  "potential-growth-2026": [
    { id: "ox1", answer: true, statement: "한국 잠재성장률 반등 보도에 쓰인 값은 IMF 전망을 바탕으로 언론이 역산한 수치다.", explain: "IMF가 잠재성장률을 직접 발표한 것은 아니에요. 언론이 실질 GDP 성장률과 GDP갭률 전망으로 역산했어요.", claimIds: ["claim-method"] },
    { id: "ox2", answer: true, statement: "국회예산정책처는 한국 잠재성장률이 오르는 방향으로 전망했다.", explain: "국회예산정책처는 잠재성장률이 상승하는 쪽으로 전망했어요. 기관마다 추정 방법과 시점이 달라 수치를 그대로 견주기는 어려워요.", claimIds: ["claim-nabo"] },
    { id: "ox3", answer: false, statement: "한국 잠재성장률이 연속 반등한다는 보도는 이미 확정된 실적에 관한 내용이다.", explain: "연합뉴스와 SBS Biz가 보도한 잠재성장률 수치는 모두 전망치예요. 확정된 실적을 제시한 내용은 아니에요.", claimIds: ["claim-numbers"] },
  ],
  "multicultural-review": [
    { id: "ox1", answer: true, statement: "이재명 대통령은 다문화가정이 차별받지 않도록 하는 정책은 계속되어야 한다고 밝혔다.", explain: "대통령은 다문화가정이 내국인가정보다 차별받지 않도록 하는 정책은 필요하다고 했어요. 일부 정책의 과잉 시정이 혐오 유발로 오인돼서는 안 된다고도 했어요.", claimIds: ["claim-post-1029"] },
    { id: "ox2", answer: true, statement: "법무부는 다문화가족 우대 시책 현황과 개선 방안을 논의하는 관계기관 회의를 열었다.", explain: "법무부는 중앙부처와 광역지자체 담당자가 참여한 회의를 열었어요. 지자체 우대 시책의 현황을 파악하고 개선 방안을 논의했어요.", claimIds: ["claim-moj-review"] },
    { id: "ox3", answer: false, statement: "한국인과 결혼한 외국인은 혼인만 하면 법무부 심사 없이 자동으로 귀화한다.", explain: "일정한 혼인·거주 요건을 갖추면 간이귀화를 신청할 수 있어요. 허가는 품행·생계유지 능력·기본 소양 등에 대한 법무부 심사를 거쳐야 해요.", claimIds: ["claim-naturalization"] },
  ],
  "firefighter-finance": [
    { id: "ox1", answer: true, statement: "소방공무원이 국가직으로 바뀐 뒤에도 소방 업무와 경비 부담은 시·도에 남아 있다.", explain: "소방공무원의 신분은 국가직으로 바뀌었어요. 하지만 법상 소방 업무는 시·도 사무이고 경비도 시·도가 부담해요.", claimIds: ["claim-structure"] },
    { id: "ox2", answer: true, statement: "정부 예산안에서 중앙 소방청 예산은 2026년보다 늘었다.", explain: "같은 예산안에서 중앙 소방청 예산은 증가했어요. 소방안전교부세 감소와 중앙 소방청 예산을 구분해야 해요.", claimIds: ["claim-nfa-budget"] },
    { id: "ox3", answer: false, statement: "소방안전교부세는 담배 판매가 줄어도 같은 금액을 보장하는 고정 지원금이다.", explain: "소방안전교부세는 담배 개별소비세 수입의 일정 비율로 정해져 있어요. 담배 판매가 줄면 교부세도 함께 줄어요.", claimIds: ["claim-grant-2027"] },
  ],
  "national-proposal": [
    { id: "ox1", answer: true, statement: "국민제안 정책화 시스템은 채택되지 않은 제안을 다시 검토하는 과정을 공개한다.", explain: "권익위가 연 시스템은 불채택 제안을 다시 검토해 정책으로 만드는 과정을 공개해요. 청와대 누리집에서도 들어갈 수 있어요.", claimIds: ["claim-system"] },
    { id: "ox2", answer: true, statement: "국민제안 정책화 절차에는 공청회와 정책화 추진 회의가 포함된다.", explain: "권익위와 심의위원회가 불채택 제안 가운데 대상을 발굴해요. 공청회와 정책화 추진 회의를 거쳐 제도 개선으로 이어 가요.", claimIds: ["claim-selection"] },
    { id: "ox3", answer: false, statement: "국민제안 정책화 시스템은 공식 발표에서 공감 수에 따른 선정 기준을 제시했다.", explain: "공식 발표에는 공감 수로 제안을 거르는 기준이 나오지 않아요. 권익위와 심의위원회가 정책화 대상을 발굴하는 절차가 보도됐어요.", claimIds: ["claim-selection"] },
  ],
  "farm-income-support": [
    { id: "ox1", answer: true, statement: "농산물 가격안정제는 평균가격이 기준가격보다 낮으면 차액을 보전하는 제도다.", explain: "주요 농산물 평균가격이 기준가격보다 낮아질 때 차액의 전부 또는 일부를 보전해요. 해당 예산은 정부 예산안에 처음 담겼어요.", claimIds: ["claim-price-stabilization"] },
    { id: "ox2", answer: true, statement: "농식품부 추경은 요소 공급 차질과 면세유 가격 상승에 따른 농가 부담 완화를 주목적으로 했다.", explain: "중동 전쟁으로 요소 공급에 차질이 생기고 농업용 면세유 가격이 올라 농가 부담이 늘었어요. 이를 줄이는 것이 추경의 주목적이에요.", claimIds: ["claim-supplementary"] },
    { id: "ox3", answer: false, statement: "농식품부의 2027년 예산안은 이미 국회 심의까지 마친 확정 예산이다.", explain: "해당 예산은 국회 심의 전 정부안이에요. 공익직불 예산과 농어촌 기본소득 시범사업 확대도 이 정부안에 담긴 내용이에요.", claimIds: ["claim-budget-2027"] },
  ],
  "president-sns": [
    { id: "ox1", answer: true, statement: "이재명 대통령은 SNS를 통한 국민과의 직접 소통을 계속하겠다고 밝혔다.", explain: "대통령은 SNS 소통과 국민의 언어로 교감하는 일을 계속하겠다고 썼어요. 직접 소통을 대표공복이 포기하면 안 될 책무라고도 했어요.", claimIds: ["claim-reason"] },
    { id: "ox2", answer: true, statement: "청와대는 대통령 유튜브 대담 프로그램인 대통령의 Y 첫 회를 공개했다.", explain: "청와대는 대통령이 출연하는 유튜브 대담 프로그램 첫 회를 공개했어요. 이후에도 일정한 간격으로 이어갈 예정이에요.", claimIds: ["claim-y-launch"] },
    { id: "ox3", answer: false, statement: "첫 방송 직후 좋아요가 조회수보다 많았던 화면은 매크로 조작으로 확인됐다.", explain: "주간경향 팩트체크는 조작 주장을 거짓으로 판정했어요. 조회수와 좋아요는 검증 과정이 달라 일시적으로 차이가 날 수 있다고 설명했어요.", claimIds: ["claim-y-views"] },
  ],
  "chief-justice-conflict": [
    { id: "ox1", answer: true, statement: "헌법상 대법관 임명에는 대법원장 제청과 국회 동의가 필요하다.", explain: "대법관은 대법원장의 제청으로 국회 동의를 얻어 대통령이 임명해요. 대통령 혼자 후보를 정해 임명하는 구조가 아니에요.", claimIds: ["claim-reject"] },
    { id: "ox2", answer: true, statement: "대법원장 탄핵소추 의결서가 송달되면 헌법재판소 결정 때까지 권한 행사가 정지된다.", explain: "대법원장 탄핵소추는 재적의원 과반수 찬성으로 의결해요. 의결서가 송달되면 헌법재판소 결정 때까지 권한 행사가 멈춰요.", claimIds: ["claim-requirement"] },
    { id: "ox3", answer: false, statement: "대법관 증원법은 공포 즉시 늘어난 대법관 전원을 한꺼번에 충원하도록 했다.", explain: "개정법은 공포 즉시 일괄 충원하는 방식이 아니에요. 2028년 3월부터 해마다 단계적으로 대법관을 늘리도록 했어요.", claimIds: ["claim-justices"] },
  ],
  "disinformation-response": [
    { id: "ox1", answer: true, statement: "허위조작정보 근절법이라는 이름은 별도 법률이 아닌 개정 정보통신망법의 통칭이다.", explain: "별도의 허위조작정보 근절법이 있는 것은 아니에요. 해당 이름은 공포와 시행을 거친 개정 정보통신망법을 가리키는 통칭이에요.", claimIds: ["claim-law"] },
    { id: "ox2", answer: true, statement: "대규모 SNS 등은 허위조작정보 신고를 받고 처리 결과를 알릴 의무가 있다.", explain: "일정 이용자 규모 이상의 SNS·온라인 커뮤니티·동영상 공유 서비스가 대상이에요. 자율 운영정책과 투명성 보고서 공표 의무도 있어요.", claimIds: ["claim-platform"] },
    { id: "ox3", answer: false, statement: "개정 정보통신망법은 풍자와 패러디까지 모두 허위조작정보 규율 대상으로 삼는다.", explain: "풍자와 패러디, 공익 목적의 정보는 규율 대상에서 빠져요. 공익 보도 등에는 가중 손해배상 예외도 있어요.", claimIds: ["claim-exceptions"] },
  ],
  "president-disaster-response": [
    { id: "ox1", answer: true, statement: "청와대는 대구 상가 천장 붕괴 사고 뒤 대통령이 구조와 수습에 만전을 지시했다고 밝혔다.", explain: "청와대는 대통령이 경찰청장 직무대행에게 상황을 보고받았다고 밝혔어요. 관계기관에 인명 구조와 사고 수습에 만전을 기하도록 지시했다고 설명했어요.", claimIds: ["claim-daegu-order"] },
    { id: "ox2", answer: true, statement: "이재명 대통령은 부천 공장 화재로 숨진 소방관의 빈소를 찾아 조문했다.", explain: "대통령은 소방관이 숨진 날 추모 글을 X에 올렸어요. 같은 날 빈소를 찾아 조문했어요.", claimIds: ["claim-firefighter"] },
    { id: "ox3", answer: false, statement: "이재명 대통령은 서해수호의 날 기념식과 하루 전 천안함 추모식에 모두 참석했다.", explain: "대통령은 서해수호의 날 기념식에 참석했어요. 하루 앞선 천안함 추모식은 해군 2함대사령관이 주관했고 대통령은 참석하지 않았어요.", claimIds: ["claim-west-sea"] },
  ],
  "ballot-shortage-2026": [
    { id: "ox1", answer: true, statement: "지방선거 투표용지 부족 사태 때 투표가 중지됐다가 재개된 투표소가 있었다.", explain: "선관위 집계에는 추가 투표용지를 쓴 투표소가 나와요. 그 가운데 일부는 투표가 잠시라도 중지됐다가 재개됐어요.", claimIds: ["claim-scale"] },
    { id: "ox2", answer: true, statement: "지방선거 투표용지 부족 사태 뒤 중앙선관위원장과 사무총장이 책임을 지고 사퇴했다.", explain: "중앙선관위원장과 사무총장이 사퇴했어요. 선관위는 외부 인사가 참여하는 진상규명위원회도 운영했어요.", claimIds: ["claim-responsibility"] },
    { id: "ox3", answer: false, statement: "중앙선거관리위원회는 행정부에 소속된 선거 관리 기관이다.", explain: "중앙선거관리위원회는 헌법에 따른 독립 헌법기관이에요. 행정부에 속하지 않아요.", claimIds: ["claim-nec-status"] },
  ],
  "illegal-sports-betting": [
    { id: "ox1", answer: true, statement: "사감위는 월드컵 기간 불법도박 사이트를 감시하고 접속 차단 심의를 의뢰했다.", explain: "사감위는 집중 신고기간에 불법도박 사이트를 감시했어요. 접속 차단 심의 의뢰와 경찰 수사 의뢰도 했어요.", claimIds: ["claim-crackdown"] },
    { id: "ox2", answer: true, statement: "불법스포츠토토신고센터는 사이트뿐 아니라 운영자 신고에도 포상금을 준다.", explain: "사이트 신고와 계좌정보를 함께 낸 신고에 포상금이 있어요. 운영자를 신고한 경우에도 포상금을 지급해요.", claimIds: ["claim-reward"] },
    { id: "ox3", answer: false, statement: "사감위가 추산한 국내 불법도박 시장 규모는 불법 스포츠도박만 합친 값이다.", explain: "불법 스포츠도박만의 규모가 아니에요. 불법 카지노·온라인도박·경주류를 모두 합친 추산이에요.", claimIds: ["claim-size"] },
  ],
  "tax-arrears-team": [
    { id: "ox1", answer: true, statement: "지방세입 체납관리단은 소액 체납 가구의 실태를 전화와 방문으로 살핀다.", explain: "체납관리단은 실태조사원을 채용해 소액 체납 가구를 살폈어요. 전화 상담과 방문을 통해 생활 실태를 조사했어요.", claimIds: ["claim-launch"] },
    { id: "ox2", answer: true, statement: "지방세입 체납관리 과정에서 분할 납부 허용과 체납 처분의 잠정 중단도 이뤄졌다.", explain: "밀린 세금을 낸 사람들 외에 분할 납부를 허용받은 사람들도 있어요. 일부에게는 체납 처분을 잠정 중단하는 정리보류를 결정했어요.", claimIds: ["claim-results"] },
    { id: "ox3", answer: false, statement: "지방세입 체납관리단의 긴급 쌀 지원은 모든 국민에게 나눠 주는 배급이다.", explain: "긴급 쌀 지원은 생계가 어려운 체납자를 찾아 복지로 연결한 사례 가운데 하나예요. 모든 국민에게 나눠 주는 배급이 아니에요.", claimIds: ["claim-welfare"] },
  ],
  "jungsucheong-chief": [
    { id: "ox1", answer: true, statement: "임은정 광주지방중수청장 감찰 착수를 지시한 사람은 행정안전부 장관이다.", explain: "윤호중 행정안전부 장관이 감찰 착수를 지시하고 중수청에 공문을 보냈어요. 중수청은 감찰담당관에게 감찰을 지시했어요.", claimIds: ["claim-inspection"] },
    { id: "ox2", answer: true, statement: "중수청 감찰관실은 임은정 광주지방중수청장의 업무용 PC를 포렌식했다.", explain: "중수청 감찰관실이 광주지방중수청을 방문했어요. 임은정 청장의 업무용 PC에 대한 포렌식을 진행했어요.", claimIds: ["claim-pc-forensic"] },
    { id: "ox3", answer: false, statement: "이재명 대통령은 중수청의 구체적 개별 사건 수사를 직접 지휘하겠다고 밝혔다.", explain: "대통령은 구체적 사건 수사 지휘는 하지 않겠다고 했어요. 검사가 대통령에게 충성할 필요도 없고 그렇게 만들어서도 안 된다고 했어요.", claimIds: ["claim-no-case-command"] },
  ],
  "farmland-survey-2026": [
    { id: "ox1", answer: true, statement: "농지 전수조사는 기본조사 뒤 투기와 불법이 의심되는 농지를 현장 점검하는 방식이다.", explain: "지방정부와 국립농산물품질관리원이 조사 인력을 새로 뽑았어요. 기본조사를 거쳐 투기·불법 의심 농지에 대한 현장 점검을 진행했어요.", claimIds: ["claim-plan"] },
    { id: "ox2", answer: true, statement: "농림축산식품부는 투기와 무관한 관행적 농지 위반은 처분 대상에서 빼겠다고 밝혔다.", explain: "농식품부는 상속농지와 고령농 보유 농지, 관행적 임대차 등 투기와 무관한 위반을 구분하겠다고 했어요. 관행적 위반은 처분하지 않는다고 설명했어요.", claimIds: ["claim-no-disposal"] },
    { id: "ox3", answer: false, statement: "농지 전수조사에서 투기 목적이 적발되면 별도 절차 없이 즉시 강제 매각한다.", explain: "투기 목적 적발 뒤에는 처분 의무를 먼저 공고해요. 이를 이행하지 않으면 정해진 기간 안에 매각하라는 처분명령을 내려요.", claimIds: ["claim-plan"] },
  ],
  "bonghwa-vietnam-valley": [
    { id: "ox1", answer: true, statement: "봉화 K-베트남 밸리는 이용상의 한반도 이주 역사와 화산 이씨 집성촌을 관광 자원으로 삼는다.", explain: "고려시대 베트남 왕자 이용상의 이주 역사와 집성촌을 활용해요. 관광과 국제교류 자원으로 삼는 사업이에요.", claimIds: ["claim-content"] },
    { id: "ox2", answer: true, statement: "봉화 K-베트남 밸리 총사업비에는 이미 투자된 금액도 포함돼 있다.", explain: "총사업비에는 기존 투자액이 들어 있어요. 봉화군은 신규·기존 조성사업과 연계사업을 특구로 묶어 투자계획을 구성했다고 설명했어요.", claimIds: ["claim-budget"] },
    { id: "ox3", answer: false, statement: "K-베트남 밸리는 베트남 현지에 조성하는 지역특화발전특구다.", explain: "사업 위치는 경북 봉화군 봉성면 창평리 일원이에요. 베트남 땅에 조성하는 사업이 아니에요.", claimIds: ["claim-location"] },
  ],
  "ajou-pediatric-emergency": [
    { id: "ox1", answer: true, statement: "아주대병원 소아응급센터의 영아 사망 사건에서 부모는 의료과실을 주장하며 의료진을 고소했다.", explain: "심정지 상태로 이송된 영아는 심폐소생술에도 숨졌어요. 부모는 의료과실을 주장하며 의료진을 고소했어요.", claimIds: ["claim-case"] },
    { id: "ox2", answer: true, statement: "경기남부경찰청은 영아 사망 사건 수사를 위해 아주대병원 소아응급센터를 압수수색했다.", explain: "경기남부경찰청이 아주대병원 소아전문응급의료센터를 압수수색했어요. 영아 사망 사건 수사를 위한 조치였어요.", claimIds: ["claim-search"] },
    { id: "ox3", answer: false, statement: "소아청소년과 전공의 모집에서 모든 수련병원이 신입 전공의를 확보했다.", explain: "모든 병원이 신입 전공의를 뽑은 것은 아니에요. 해당 모집에서는 수련병원 대다수가 한 명도 뽑지 못했어요.", claimIds: ["claim-workforce"] },
  ],
  "presidential-office-budget": [
    { id: "ox1", answer: true, statement: "2026년 대통령실 확정 예산은 전년보다 늘었다.", explain: "대통령실 예산은 국회에서 확정됐어요. 확정된 2026년 예산은 2025년 예산보다 늘었어요.", claimIds: ["claim-budget-trend"] },
    { id: "ox2", answer: true, statement: "대통령실 특수활동비는 본예산 전액 삭감 뒤 이재명 정부 출범 후 추경에 다시 편성됐다.", explain: "당시 야당이던 민주당이 2025년 예산에서 특수활동비를 전액 삭감했어요. 이재명 정부 출범 뒤 같은 해 추경에 다시 편성됐어요.", claimIds: ["claim-special-history"] },
    { id: "ox3", answer: false, statement: "국회 운영위원회는 국민의힘이 요구한 전임 대통령실 참모들을 국감 증인으로 모두 채택했다.", explain: "국민의힘이 요구한 강훈식 전 비서실장과 김용범 전 정책실장 등은 증인 명단에 들지 않았어요.", claimIds: ["claim-witness"] },
  ],
  "nk-drones": [
    { id: "ox1", answer: true, statement: "국방부는 드론작전사령부를 국방부 직할 본부로 개편하는 방안을 발표했다.", explain: "국방부는 드론작전사령부 개편과 드론·대드론 발전 정책을 발표했어요. 사령부는 국방부 직할 본부로 바뀌는 내용이에요.", claimIds: ["claim-mnd"] },
    { id: "ox2", answer: true, statement: "정부의 2027년 국방예산안은 드론·대드론 예산을 전년보다 늘렸다.", explain: "정부가 국회에 낸 예산안에서는 드론·대드론 예산이 늘었어요. 교육훈련 예산도 커졌으며 최종 규모는 국회 의결로 정해져요.", claimIds: ["claim-budget-2027"] },
    { id: "ox3", answer: false, statement: "러시아가 북한에 실제로 넘긴 자폭드론 기술의 구체적 내용은 공개 확인됐다.", explain: "우크라이나 국방부 정보국장이 기술과 인프라 제공을 주장했어요. 어떤 기술이 실제 이전됐는지는 공개적으로 확인되지 않았어요.", claimIds: ["claim-russia"] },
  ],
  "bereaved-public-servants": [
    { id: "ox1", answer: true, statement: "인사혁신처는 순직공무원 사망조위금 최저액을 높이겠다고 발표했다.", explain: "인사혁신처는 공무원 재해보상 제도개선 종합계획을 발표했어요. 순직공무원 사망조위금 최저액을 올리는 내용이 담겼어요.", claimIds: ["claim-condolence"] },
    { id: "ox2", answer: true, statement: "공무원 재해보상 제도개선 계획은 위험직무순직 유족연금 지급률을 높이는 내용이다.", explain: "위험직무순직 공무원 유족연금의 지급률을 높이는 내용이에요. 지급률은 기준소득월액을 기준으로 정해져요.", claimIds: ["claim-pension-rate"] },
    { id: "ox3", answer: false, statement: "순직공무원 보훈 보상 권리는 두 신청일 가운데 늦은 날부터 생기도록 바꿀 계획이다.", explain: "순직유족급여 청구일과 국가유공자 등록 신청일 가운데 빠른 날부터 권리가 생기도록 바꿀 계획이에요.", claimIds: ["claim-timing"] },
  ],
  "party-merger": [
    { id: "ox1", answer: true, statement: "정청래 당시 민주당 대표는 지방선거를 함께 치르자며 조국혁신당에 합당을 제안했다.", explain: "정청래 대표가 합당을 제안했어요. 조국 대표는 국민과 당원의 목소리를 듣고 결정하겠다고 답했어요.", claimIds: ["claim-proposal"] },
    { id: "ox2", answer: true, statement: "민주당은 지방선거 전 합당 논의를 중단하면서 선거 뒤 통합 추진 준비를 제안했다.", explain: "정청래 대표는 의원총회 결과를 반영해 선거 전 합당 논의 중단을 발표했어요. 대신 선거 뒤 통합을 위한 준비위원회 구성을 제안했어요.", claimIds: ["claim-halt"] },
    { id: "ox3", answer: false, statement: "민주당과 조국혁신당은 한쪽 당원 투표가 부결돼도 합당할 수 있다.", explain: "당헌·당규상 합당에 필요한 절차가 있어요. 어느 한쪽 당원 투표에서 부결되면 합당할 수 없어요.", claimIds: ["claim-procedure"] },
  ],
  "opcon-transfer": [
    { id: "ox1", answer: true, statement: "전작권 전환은 한미가 합의한 조건을 충족하는지 검증하는 절차로 진행된다.", explain: "완전운용능력 검증을 거쳐 목표연도를 정하고 이후 완전임무수행능력을 검증해요. 상호 합의한 조건에 기반한 절차예요.", claimIds: ["claim-conditions"] },
    { id: "ox2", answer: true, statement: "정부는 대통령 임기 안에 전작권을 전환하는 것을 목표로 추진해 왔다.", explain: "정부는 완전운용능력 검증을 마친 뒤 전환 목표연도를 정하는 방안을 추진해 왔어요. 대통령 임기 안 전환이 목표예요.", claimIds: ["claim-target"] },
    { id: "ox3", answer: false, statement: "한미는 예정된 안보협의회를 앞당겨 개최하기로 합의했다.", explain: "미 국방부는 예정된 한미안보협의회를 다음 해 초로 미룬다고 발표했어요. 한국 국방부도 연기 개최에 합의했다고 밝혔어요.", claimIds: ["claim-scm-delay"] },
  ],
  "retirement-age": [
    { id: "ox1", answer: true, statement: "민주당 정년연장특위의 세 가지 안은 노사 합의를 얻지 못해 연내 입법으로 이어지지 못했다.", explain: "특위는 정년을 늘리는 여러 안을 냈지만 노사 합의를 얻지 못했어요. 그해 안에 입법하려던 목표는 무산됐어요.", claimIds: ["claim-drafts"] },
    { id: "ox2", answer: true, statement: "정년연장 논의에서 노동계는 도달 시점을, 경영계는 재고용 우선 도입을 문제로 제기했다.", explain: "노동계는 제시된 정년 도달 시점이 늦다고 반발했어요. 경영계는 법정 정년보다 재고용을 먼저 도입하자고 주장했어요.", claimIds: ["claim-schedule"] },
    { id: "ox3", answer: false, statement: "온라인에 제시된 출생연도별 정년 연장표는 정부와 국회가 확정한 내용이다.", explain: "출생연도에 따라 몇 년씩 늘어난다는 식의 정년 연장표는 정부나 국회가 확정한 내용이 아니에요.", claimIds: ["claim-chart"] },
  ],
  "anti-discrimination-law": [
    { id: "ox1", answer: true, statement: "정춘생 의원의 차별금지법안은 고용과 교육, 재화 이용 등의 차별을 금지하는 내용이다.", explain: "법안은 성별·장애·병력·나이·인종 등을 이유로 한 차별을 금지해요. 고용과 교육, 재화 이용 등의 영역이 대상이에요.", claimIds: ["claim-bill-content"] },
    { id: "ox2", answer: true, statement: "이재명 대통령은 차별금지법이 중요한 과제지만 민생과 경제가 더 시급하다고 말했다.", explain: "대통령은 취임 한 달 기자회견에서 차별금지법을 중요한 사회 과제로 언급했어요. 민생과 경제가 더 시급하다고도 말했어요.", claimIds: ["claim-president"] },
    { id: "ox3", answer: false, statement: "정춘생 의원의 차별금지법안은 법제사법위원회를 거치지 않고 시행에 들어갔다.", explain: "정춘생 의원이 대표 발의한 법안은 법제사법위원회에 회부됐어요. 제시된 상태는 법안 발의와 위원회 회부예요.", claimIds: ["claim-bills"] },
  ],
  "budget-2027": [
    { id: "ox1", answer: true, statement: "정부는 2027년 총지출을 전년 본예산보다 늘려 편성했다.", explain: "정부가 편성한 2027년 총지출은 2026년 본예산보다 많아요. 총수입 규모도 함께 제시했어요.", claimIds: ["claim-total"] },
    { id: "ox2", answer: true, statement: "정부의 미래대응기금 계획에는 청년 등 분야 투자와 위기 대비 재원 유보가 함께 담겼다.", explain: "미래대응기금으로 청년·성장동력·지역·교육 분야에 재원을 쓰는 계획이에요. 세입 변동과 위기에 대비해 남겨 두는 재원도 있어요.", claimIds: ["claim-fund"] },
    { id: "ox3", answer: false, statement: "정부가 제출한 2027년 예산안은 국회 심의 과정에서 내용을 바꿀 수 없다.", explain: "예산안은 국회 심의로 바뀔 수 있어요. 대통령은 여야 의견을 듣고 더 나은 대안을 반영하겠다고 했어요.", claimIds: ["claim-speech-deadline"] },
  ],
  "police-audit-2026": [
    { id: "ox1", answer: true, statement: "김종철 경찰청장 직무대행은 청장 임명 시점에 대해 답할 수 없다고 했다.", explain: "김 직무대행은 청장 임명은 정부 인사에 관한 일이라고 했어요. 임명 시점에 대해서는 답할 수 없다고 밝혔어요.", claimIds: ["claim-acting"] },
    { id: "ox2", answer: true, statement: "김종철 경찰청장 직무대행은 한동훈 의원 딸 의혹 수사에 미흡한 점이 있었다고 인정했다.", explain: "김 직무대행은 수사에 미흡한 점이 있었다고 인정했어요. 재수사와 당시 수사라인 감찰을 검토하겠다고 했어요.", claimIds: ["claim-admit"] },
    { id: "ox3", answer: false, statement: "김종철 경찰청장 직무대행은 한동훈 의원 딸 의혹 재수사와 감찰을 이미 완료했다고 밝혔다.", explain: "김 직무대행이 밝힌 것은 재수사와 당시 수사라인 감찰을 검토하겠다는 내용이에요. 완료됐다는 발표가 아니에요.", claimIds: ["claim-admit"] },
  ],
  "jobs-wages-2026": [
    { id: "ox1", answer: true, statement: "2026년 9월 취업자는 전년보다 늘었지만 증가 폭은 전달보다 줄었다.", explain: "전체 취업자는 전년 같은 달보다 늘었어요. 다만 증가 폭은 전달의 증가 폭보다 작아졌어요.", claimIds: ["claim-total"] },
    { id: "ox2", answer: true, statement: "정부의 산업전환 고용안정 기본계획에는 AI 직업훈련 지원과 고용 변화 지표 개발이 담겼다.", explain: "한국형 AI 노출지수와 조기경보 대시보드를 만드는 계획이에요. AI 직업훈련 지원과 중장년 재취업지원 의무 사업장 확대도 담겼어요.", claimIds: ["claim-ai-plan"] },
    { id: "ox3", answer: false, statement: "2026년 9월 고용 동향에서 숙박·음식점업과 건설업 취업자는 모두 늘었다.", explain: "숙박·음식점업과 건설업 취업자는 줄었어요. 보건·사회복지서비스업과 운수·창고업은 늘었어요.", claimIds: ["claim-industry"] },
  ],
  "jeong-yulseong": [
    { id: "ox1", answer: true, statement: "정율성은 항일단체 조선의열단에서 활동했고 중국과 북한의 군가도 작곡했다.", explain: "정율성은 광주 출신으로 조선의열단에서 활동했어요. 중국 인민해방군가와 북한 조선인민군 행진곡을 작곡했어요.", claimIds: ["claim-who"] },
    { id: "ox2", answer: true, statement: "김병내 광주 남구청장은 훼손된 정율성 흉상의 복원을 검토하겠다고 했다.", explain: "김병내 구청장은 흉상 복원 검토 의사를 밝혔어요. 광주시도 종합계획 수립 용역 예산을 반영했어요.", claimIds: ["claim-2025"] },
    { id: "ox3", answer: false, statement: "광주시는 국가보훈부의 중단 요구 뒤 정율성 역사공원을 계획대로 완공했다.", explain: "광주시는 국가보훈부 장관의 중단 요구 뒤 역사공원 조성을 멈췄어요. 생가만 복원했어요.", claimIds: ["claim-2023"] },
  ],
  "capital-taxes": [
    { id: "ox1", answer: true, statement: "금투세 폐지와 가상자산 과세 유예는 같은 소득세법 개정안에서 함께 처리됐다.", explain: "국회는 같은 개정안에서 금투세를 폐지하고 가상자산 과세 시행을 미뤘어요. 금투세 폐지는 윤석열 정부가 추진했고 당시 민주당이 동의했어요.", claimIds: ["claim-fit-repeal-law"] },
    { id: "ox2", answer: true, statement: "재정경제부는 가상자산 과세를 더 미루는 방안을 국회와 협의해 추진한다고 발표했다.", explain: "재정경제부는 가상자산 과세 추가 유예 방안을 국회와 협의하겠다고 발표했어요. 손실 이월공제 방안도 함께 협의하겠다고 했어요.", claimIds: ["claim-crypto-deferral"] },
    { id: "ox3", answer: false, statement: "대통령의 거래세 관련 발언 뒤 정부는 금투세 재도입을 공식화했다.", explain: "대통령은 거래세의 역진성을 지적하며 양도소득세와 바꿔야 한다고 말했어요. 정부가 금투세 재도입을 공식화한 것은 아니에요.", claimIds: ["claim-fit-2026"] },
  ],
  "lh-speculation": [
    { id: "ox1", answer: true, statement: "LH 직원들의 신도시 예정지 땅 투기 의혹이 드러나자 전국 경찰이 수사에 나섰다.", explain: "LH 직원들이 내부 정보를 이용해 신도시 예정지의 땅을 샀다는 의혹이 드러났어요. 전국 경찰이 이에 대한 수사에 나섰어요.", claimIds: ["claim-case"] },
    { id: "ox2", answer: true, statement: "전북경찰청의 부동산 투기 수사 송치 대상에는 내부정보 이용과 불법전매가 포함됐다.", explain: "송치 유형에는 내부정보 이용과 불법 형질변경·보상 목적 투기가 있었어요. 분양권 불법전매 등도 포함됐어요.", claimIds: ["claim-jeonbuk"] },
    { id: "ox3", answer: false, statement: "내부정보 땅 투기 혐의를 받은 LH 직원은 무죄가 확정돼 투기 토지도 몰수되지 않았다.", explain: "해당 직원은 처음의 무죄 판단이 뒤집혀 대법원에서 징역형이 확정됐어요. 투기에 쓰인 토지도 모두 몰수됐어요.", claimIds: ["claim-conviction"] },
  ],
  "saemangeum-airport": [
    { id: "ox1", answer: true, statement: "서울행정법원은 조류 충돌 위험과 생태계 영향을 이유로 새만금 공항 기본계획 취소 판결을 내렸다.", explain: "법원은 새만금 국제공항 기본계획을 취소하라고 판결했어요. 조류 충돌 위험과 서천갯벌 등 주변 생태계 영향이 이유였어요.", claimIds: ["claim-ruling"] },
    { id: "ox2", answer: true, statement: "국토교통부는 새만금 공항 기본계획 취소 판결에 항소하고 지자체 등과 대응하고 있다.", explain: "국토부는 공항이 국가 균형발전 국정과제라며 항소했어요. 전북특별자치도 등과 협의체를 꾸려 항소심에 대응하고 있어요.", claimIds: ["claim-appeal"] },
    { id: "ox3", answer: false, statement: "서울고법의 집행정지 결정으로 새만금 공항 건설 절차는 항소심 전까지 전면 중단됐다.", explain: "서울고법은 원고 측 집행정지 신청을 기각했어요. 이에 따라 국토부는 항소심 판결 전까지 건설 절차를 이어갈 수 있어요.", claimIds: ["claim-stay"] },
  ],
  "csat-smart-glasses": [
    { id: "ox1", answer: true, statement: "수능 수험생 유의사항에는 스마트안경이 시험장 반입 금지 물품으로 명시됐다.", explain: "평가원이 공개한 수능 유의사항에 스마트안경이 들어갔어요. 시험장 반입 금지 물품으로 처음 명시됐어요.", claimIds: ["claim-ban"] },
    { id: "ox2", answer: true, statement: "수능 감독관은 시험 중에도 수험생에게 안경 확인을 요청할 수 있다.", explain: "감독관은 시험 도중에도 안경 확인을 요구할 수 있어요. 수험생이 따르지 않으면 중대한 부정행위로 조치할 수 있어요.", claimIds: ["claim-supervise"] },
    { id: "ox3", answer: false, statement: "수능에서 스마트안경은 착용하지 않고 소지만 하면 시험 무효 대상이 아니다.", explain: "스마트안경은 반입하거나 소지만 해도 시험이 무효가 돼요. 시험 중 착용하면 다음 해 수능 응시 자격도 정지돼요.", claimIds: ["claim-sanction"] },
  ],
  "jobless-insurance-relief": [
    { id: "ox1", answer: true, statement: "소득이 끊긴 국민연금 가입자는 가입을 유지한 채 보험료 납부예외를 신청할 수 있다.", explain: "소득이 없는 기간에는 납부예외를 신청할 수 있어요. 가입은 유지하지만 그 기간은 가입기간에 들어가지 않아요.", claimIds: ["claim-exemption"] },
    { id: "ox2", answer: true, statement: "실직 뒤 국민연금 납부를 재개하는 지역가입자는 보험료 지원을 받을 수 있다.", explain: "사업 중단이나 실직 뒤 납부를 다시 시작하는 지역가입자를 지원해요. 보험료의 일부를 정해진 기간까지 지원받을 수 있어요.", claimIds: ["claim-resume"] },
    { id: "ox3", answer: false, statement: "국민연금 실업크레딧은 구직급여 수급자의 재산이나 소득과 관계없이 모두 적용된다.", explain: "실업크레딧은 구직급여를 받는 사람이 이용할 수 있어요. 다만 고소득·고자산자는 지원 대상에서 제외돼요.", claimIds: ["claim-credit"] },
  ],
  "disability-support": [
    { id: "ox1", answer: true, statement: "장애수당은 18세 이상 등록장애인 중 중증이 아닌 수급자나 차상위계층을 대상으로 한다.", explain: "장애수당은 18세 이상 등록장애인 중 중증이 아닌 사람을 대상으로 해요. 기초생활수급자 또는 차상위계층이어야 해요.", claimIds: ["claim-allowance"] },
    { id: "ox2", answer: true, statement: "장애인 주차표지를 위조하면 형사처벌 대상이 된다.", explain: "장애인 주차표지 위조는 과태료가 아니라 형사처벌 대상이에요. 위조 표지를 사용한 사람에게 징역형의 집행유예가 선고된 사례가 있어요.", claimIds: ["claim-parking-forgery"] },
    { id: "ox3", answer: false, statement: "건축물 부설주차장의 장애인 전용주차구역 비율은 모든 지자체에서 동일하다.", explain: "시행령이 정한 범위 안에서 지자체 조례로 비율을 정해요. 경기도 안에서도 시군별 비율이 달라요.", claimIds: ["claim-parking-ratio"] },
  ],
  "enemy-cemetery-unclaimed": [
    { id: "ox1", answer: true, statement: "파주 북한군 묘지는 전쟁 뒤 흩어진 북한군과 중국군 유해를 모아 조성됐다.", explain: "처음에는 북한군·중국군 묘지로 조성됐어요. 중국군 유해 송환 뒤 북한군 묘지로 이름이 바뀌었어요.", claimIds: ["claim-cemetery"] },
    { id: "ox2", answer: true, statement: "무연고 사망자 통계에는 연고자가 장례를 위임한 경우도 포함된다.", explain: "보건복지부 자료상 무연고 사망자에는 연고자가 장례를 위임한 경우가 포함돼요. 해당 유형이 가장 많았어요.", claimIds: ["claim-unclaimed"] },
    { id: "ox3", answer: false, statement: "무연고 사망자 장례는 모든 지자체가 같은 여건과 매뉴얼로 운영한다.", explain: "무연고 사망자 장례는 지자체가 맡으며 예산·시설·조례에 따라 편차가 커요. 공영장례 매뉴얼이 없는 지자체도 있어요.", claimIds: ["claim-funeral-gap"] },
  ],
  "suicide-statistics-2025": [
    { id: "ox1", answer: true, statement: "2025년 자살 사망자 수와 자살률은 모두 전년보다 줄었다.", explain: "해당 연도의 자살 사망자 수는 전년보다 줄었어요. 인구 대비 자살률도 함께 낮아졌어요.", claimIds: ["claim-total"] },
    { id: "ox2", answer: true, statement: "2025년 사망원인통계에서 자살은 40대의 가장 큰 사망원인이었다.", explain: "해당 통계에서 자살은 40대 사망원인 가운데 가장 높은 순위였어요. 전년에 이어 같은 순위를 기록했어요.", claimIds: ["claim-forties"] },
    { id: "ox3", answer: false, statement: "2025년 자살률은 전년보다 모든 연령대에서 낮아졌다.", explain: "10대 자살률은 전년보다 늘었어요. 전 연령대 가운데 유일하게 증가했고 통계 작성 이래 가장 높았어요.", claimIds: ["claim-teens"] },
  ],
  "single-parent-support": [
    { id: "ox1", answer: true, statement: "한부모가족 아동양육비 지원 대상에는 조손가족도 포함된다.", explain: "한부모가족 아동양육비는 조손가족도 포함해 지원해요. 조손가족의 어린 자녀에게는 추가 지원도 있어요.", claimIds: ["claim-allowance"] },
    { id: "ox2", answer: true, statement: "한부모가족 지원은 주민센터나 복지로에서 신청할 수 있다.", explain: "주민센터 또는 복지로에서 신청할 수 있어요. 초·중·고 자녀의 학용품비와 복지시설 입소 가구 생활보조금 지원도 있어요.", claimIds: ["claim-extra"] },
    { id: "ox3", answer: false, statement: "한부모가족 아동양육비 지원은 가구의 소득인정액과 관계없이 지급된다.", explain: "지원 대상은 소득인정액이 기준중위소득 65% 이하인 가구예요. 근로·사업소득은 일부를 공제하고 계산해요.", claimIds: ["claim-income"] },
  ],
  "japan-agreements-pardons": [
    { id: "ox1", answer: true, statement: "이재명 대통령은 위안부 합의와 강제징용 제3자 변제를 유지하겠다고 말했다.", explain: "대통령은 요미우리신문 인터뷰에서 두 방침을 유지하겠다고 했어요. 받아들이기 어려워도 국가 간 약속이라 뒤집을 수 없다고 설명했어요.", claimIds: ["claim-japan"] },
    { id: "ox2", answer: true, statement: "이재명 정부의 2025년 광복절 특별사면에는 경제인도 포함됐다.", explain: "특별사면 대상에 최신원 전 회장과 최지성 전 실장 등 경제인이 포함됐어요. 법무부는 경제 살리기에 기여할 기회를 주는 취지라고 설명했어요.", claimIds: ["claim-pardon-business"] },
    { id: "ox3", answer: false, statement: "2025년 광복절 특별사면·복권 대상에는 정치인과 고위공직자가 전혀 없었다.", explain: "해당 특별사면·복권에는 정치인과 고위공직자도 포함됐어요. 국민의힘이 요청한 인사도 대상에 들어 있었어요.", claimIds: ["claim-pardon-scale"] },
  ],
  "oda-budget": [
    { id: "ox1", answer: true, statement: "2026년 확정 ODA 예산은 전년보다 줄었다.", explain: "확정된 ODA 예산은 전년보다 감소했어요. 정부는 저성과·소규모·행사성 사업 등을 정비한 결과라고 설명했어요.", claimIds: ["claim-2026"] },
    { id: "ox2", answer: true, statement: "2026년 ODA 지역 배분에서는 아시아와 아프리카의 비중이 가장 크다.", explain: "지역별 배분은 아시아와 아프리카의 비중이 가장 커요. 분야별로는 교통의 비중이 가장 크고 인도적 지원 등이 뒤를 이어요.", claimIds: ["claim-2026-regions"] },
    { id: "ox3", answer: false, statement: "2027년 ODA 시행계획에 담긴 요구액은 국회 의결을 마친 확정 예산이다.", explain: "시행계획의 금액은 예산 요구액이에요. 예산 심사와 국회 의결에 따라 바뀔 수 있어요.", claimIds: ["claim-2027"] },
  ],
  "cash-receipt-report": [
    { id: "ox1", answer: true, statement: "현금영수증 의무발행업종은 10만 원 이상 현금 거래 때 요청이 없어도 발급해야 한다.", explain: "의무발행업종은 10만 원 이상 현금 거래에서 발급 요청이 없어도 현금영수증을 발급해야 해요. 미발급 시 가산세가 붙어요.", claimIds: ["claim-mandatory"] },
    { id: "ox2", answer: true, statement: "일반가맹점의 현금영수증 발급 거부는 반복 위반 때 과태료도 부과된다.", explain: "처음 거부하면 가산세와 명령서가 나와요. 반복 위반 때는 가산세에 과태료가 더해져요.", claimIds: ["claim-sanction"] },
    { id: "ox3", answer: false, statement: "의무발행업종의 현금영수증 미발급은 거래 당사자인 소비자만 신고할 수 있다.", explain: "의무발행업종의 미발급은 소비자뿐 아니라 제3자도 신고할 수 있어요. 일반적인 발급 거부 신고는 거래 당사자인 소비자가 할 수 있어요.", claimIds: ["claim-who"] },
  ],
  "democracy-history-records": [
    { id: "ox1", answer: true, statement: "옛 남영동 대공분실은 민주화운동기념관으로 문을 열었다.", explain: "옛 남영동 대공분실에 민주화운동기념관이 문을 열었고, 민주화운동기념사업회가 운영해요.", claimIds: ["claim-hall"] },
    { id: "ox2", answer: true, statement: "국사편찬위원회가 공개한 김대중 사건 관련 미국 문서는 전자사료관에서 볼 수 있다.", explain: "미국이 기밀 해제한 김대중 내란음모 사건 관련 문서를 국사편찬위원회가 확보해 공개했어요.", claimIds: ["claim-nara"] },
    { id: "ox3", answer: false, statement: "민주화운동기념관에는 옛 대공분실 조사실이 보존돼 있지 않다.", explain: "구관에는 박종철 열사가 고문받은 조사실 등 옛 대공분실 공간이 보존돼 있어요.", claimIds: ["claim-hall-exhibit"] },
  ],
  "overseas-trips-2026": [
    { id: "ox1", answer: true, statement: "대통령의 UAE 순방에서는 방산 협력을 포함한 전략적 협력 공동선언이 나왔다.", explain: "대통령은 UAE 등을 순방했고, UAE와 방산 협력을 포함한 전략적 협력 공동선언을 냈어요.", claimIds: ["claim-2025"] },
    { id: "ox2", answer: true, statement: "한국과 멕시코는 국빈방문에서 투자보장협정 개정 협상을 타결했다.", explain: "두 나라는 투자보장협정 개정 협상을 타결하고, 외교차관급 정책협의회 정례화에도 합의했어요.", claimIds: ["claim-mexico"] },
    { id: "ox3", answer: false, statement: "미국·멕시코 순방의 한미 정상회담에서는 전시작전통제권 전환을 논의하지 않았다.", explain: "해당 회담에서는 핵추진잠수함 협력, 원자력협정과 함께 전시작전통제권 전환도 논의했어요.", claimIds: ["claim-us-2026-09"] },
  ],
  "local-unsold-housing": [
    { id: "ox1", answer: true, statement: "LH가 매입한 지방 미분양 주택은 전세 거주 뒤 분양전환이 가능한 방식으로 공급한다.", explain: "사들인 주택은 전세로 거주한 뒤 분양전환을 받을 수 있는 분양전환형 든든전세로 공급해요.", claimIds: ["claim-lh-purchase-2"] },
    { id: "ox2", answer: true, statement: "지방 준공 후 미분양 아파트 취득세 감면은 면적과 취득가 요건이 있다.", explain: "개인이 사는 지방 준공 후 미분양 아파트 중 전용 85㎡·취득가 6억 원 이하가 감면 대상이에요.", claimIds: ["claim-tax-support"] },
    { id: "ox3", answer: false, statement: "세컨드홈 특례 확대 대상에는 수도권과 광역시도 포함된다.", explain: "세컨드홈 대상은 인구감소관심지역까지 넓어졌지만, 수도권과 광역시는 제외돼요.", claimIds: ["claim-second-home"] },
  ],
  "real-estate-crime-crackdown": [
    { id: "ox1", answer: true, statement: "국무조정실 부동산감독추진단은 여러 기관이 참여하는 불법행위 대응 협의회를 주관한다.", explain: "추진단은 국토교통부·금융위원회·국세청·경찰청 등이 참여하는 협의회를 주관해요.", claimIds: ["claim-task-force"] },
    { id: "ox2", answer: true, statement: "국토교통부 특별사법경찰은 집값 담합과 실거래가 허위 신고 등을 직접 수사한다.", explain: "특별사법경찰은 부동산거래신고법·주택법·공인중개사법 위반을 직접 수사하고 있어요.", claimIds: ["claim-special-police"] },
    { id: "ox3", answer: false, statement: "부동산감독원 설치법은 상임위 심사를 마쳐 연내 출범이 확정됐다.", explain: "설치법은 제시된 기준일에 모두 상임위 심사 단계였고, 공포 후 시행까지 시간이 필요해 연내 출범은 무산됐어요.", claimIds: ["claim-agency-bill"] },
  ],
  "home-price-drop-plan": [
    { id: "ox1", answer: true, statement: "이재명 대통령은 집값 급락 시 공적임대용 대량 매입을 포함한 대비책을 강구 중이라고 밝혔다.", explain: "대통령은 집값이 크게 하락하면 공적임대주택 용도로 정부가 대량 매입하는 방안도 대비책에 포함된다고 했어요.", claimIds: ["claim-buyback"] },
    { id: "ox2", answer: true, statement: "과거 정부는 대출 상환이 어려운 집주인의 주택을 사들여 임차인으로 계속 살게 한 적이 있다.", explain: "희망임대주택 리츠로 하우스푸어 주택을 매입해 집주인이 임차인으로 계속 살게 한 전례가 있어요.", claimIds: ["claim-past-cases"] },
    { id: "ox3", answer: false, statement: "집값 급락 대비 대량 매입 구상은 매입 대상과 재원 조달 방식이 모두 공개됐다.", explain: "제시된 기준일에는 매입 대상, 가격 기준, 시행 시점과 재원 조달 방식이 공개되지 않았어요.", claimIds: ["claim-undecided"] },
  ],
  "corporate-rental-housing": [
    { id: "ox1", answer: true, statement: "신유형 장기민간임대주택 계획은 리츠 등 법인이 장기간 임대하는 방식이다.", explain: "국토교통부는 리츠 등 법인이 한 단지 100세대 이상을 20년 이상 임대하는 유형을 도입하겠다고 발표했어요.", claimIds: ["claim-2024-plan"] },
    { id: "ox2", answer: true, statement: "정부는 장기 민간임대 공급을 유도하려 HUG 보증을 결합한 장기 모기지 도입을 추진한다.", explain: "공공지원 민간임대 금융지원을 강화하고, HUG 보증을 결합한 임대주택 담보 장기 모기지를 도입하기로 했어요.", claimIds: ["claim-813-rental"] },
    { id: "ox3", answer: false, statement: "HUG는 공공지원 민간임대 리츠의 운영 기간 연장을 이미 확정했다.", explain: "HUG는 운영 기간을 늘리는 방안을 연구하는 용역을 발주했으며, 검토 초기 단계예요.", claimIds: ["claim-reit-20y"] },
  ],
  "housing-supply-bills": [
    { id: "ox1", answer: true, statement: "개정 주택법은 인접한 주택 단지의 공동 리모델링을 허용한다.", explain: "주택공급 관련 개정 주택법에는 인접 단지의 공동 리모델링을 허용하는 내용이 들어 있어요.", claimIds: ["claim-housing-act"] },
    { id: "ox2", answer: true, statement: "개정 부동산거래신고법은 같은 시·도 일부만 토지거래허가구역으로 지정할 수 있게 한다.", explain: "국토교통부 장관이 같은 시·도 안 일부 지역만 토지거래허가구역으로 지정할 수 있게 했어요.", claimIds: ["claim-public-housing-act"] },
    { id: "ox3", answer: false, statement: "용산공원 주변 부지의 녹지 기준 완화 법안은 본회의 처리를 마쳤다.", explain: "용산공원 주변 부지의 공원·녹지 기준을 완화하는 개정안은 해당 본회의에서 처리가 보류됐어요.", claimIds: ["claim-yongsan-held"] },
  ],
  "multi-child-housing": [
    { id: "ox1", answer: true, statement: "민영·공공주택의 다자녀 특별공급은 자녀가 둘인 가구도 대상이다.", explain: "민영·공공주택 모두 다자녀 특별공급 기준이 자녀 2명 이상으로 바뀌었어요.", claimIds: ["claim-two-children"] },
    { id: "ox2", answer: true, statement: "공공주택지구 공공임대는 중형 주택을 공급할 수 있는 비율 상한이 높아졌다.", explain: "전용 60~85㎡ 중형 비율 상한을 높이고, 전용 60㎡ 이하 비율 하한은 낮췄어요.", claimIds: ["claim-mid-size-2026"] },
    { id: "ox3", answer: false, statement: "공공주택지구마다 중형 공공임대를 반드시 40%씩 공급해야 한다.", explain: "40%는 중형 주택 비율의 상한이에요. 사업마다 그 비율을 채워야 하는 의무 물량은 아니에요.", claimIds: ["claim-mid-size-2026"] },
  ],
  "capital-area-housing-sites": [
    { id: "ox1", answer: true, statement: "서울 서초구 서리풀1지구는 공공주택지구로 지정·고시됐다.", explain: "국토교통부는 서초구 원지·신원·염곡·내곡동 일대 서리풀1지구를 공공주택지구로 지정·고시했어요.", claimIds: ["claim-seoripul"] },
    { id: "ox2", answer: true, statement: "정부는 신규 택지 발표와 함께 서울과 인접 수도권 그린벨트에 토지거래허가제를 적용했다.", explain: "투기를 막으려고 서울 그린벨트 전역과 서울 인접 수도권 그린벨트를 토지거래허가구역으로 지정했어요.", claimIds: ["claim-813"] },
    { id: "ox3", answer: false, statement: "10월 29일 발표된 신규 택지에는 용산공원과 서울 시내 그린벨트가 포함됐다.", explain: "해당 신규 택지에는 서울 시내 그린벨트와 용산공원이 들어가지 않았어요.", claimIds: ["claim-seoul-gb-excluded"] },
  ],
  "overseas-trips-dispute": [
    { id: "ox1", answer: true, statement: "위성락 국가안보실장은 다자 정상외교에 영부인이 동행하는 것이 관행이라고 말했다.", explain: "위 실장은 정상의 다자 외교 계기가 여러 개 있고, 그런 정상외교는 관행적으로 영부인을 수반한다고 설명했어요.", claimIds: ["claim-wi-first-lady"] },
    { id: "ox2", answer: true, statement: "외교부는 멕시코 순방의 K팝 일정을 공공외교 활동이라고 설명했다.", explain: "외교부는 멕시코 K팝 일정이 공공외교 활동이라며, 일부 장면만으로 순방을 평가절하하는 것은 적절하지 않다고 했어요.", claimIds: ["claim-mofa"] },
    { id: "ox3", answer: false, statement: "대통령의 우리는 식구다 건배사는 한일 정상회담에서 일본 총리에게 제안한 말이다.", explain: "이 건배사는 샌프란시스코에서 젠슨 황 등 글로벌 IT 경영진과 국내 기업 총수들이 함께한 만찬에서 나왔어요.", claimIds: ["claim-sikgu"] },
  ],
  "west-sea-structures": [
    { id: "ox1", answer: true, statement: "한중 잠정조치수역은 해양경계가 정해지기 전 어업협정으로 정한 구역이다.", explain: "두 나라 배타적경제수역이 겹치는 곳에 어업협정으로 정한 구역이며, 협정에는 구조물·양식 규정이 없어요.", claimIds: ["claim-structures"] },
    { id: "ox2", answer: true, statement: "외교부는 서해 구조물 문제를 해양경계획정과 별도 채널에서 다룬다고 설명했다.", explain: "두 정상은 해양경계획정 회담 개최를 위해 노력하기로 했고, 구조물 문제는 별도 트랙의 기존 채널에서 다뤄요.", claimIds: ["claim-boundary-talks"] },
    { id: "ox3", answer: false, statement: "중국이 설치한 서해 잠정조치수역 구조물은 모두 수역 밖으로 옮겨졌다.", explain: "선란 1·2호는 남아 있어요. 정부는 나머지 구조물도 수역 밖으로 옮기도록 협의를 이어 갈 방침이에요.", claimIds: ["claim-remaining"] },
  ],
  "land-holding-tax": [
    { id: "ox1", answer: true, statement: "국토보유세는 모든 토지에 일괄 부과하는 세금 구상이다.", explain: "국토보유세는 모든 토지에 일괄 부과하는 세금으로, 고가 부동산에 매기는 종합부동산세와 달라요.", claimIds: ["claim-history"] },
    { id: "ox2", answer: true, statement: "이 대통령은 보유세 강화 논의에서 실거주와 투기용 주택을 구분해야 한다고 말했다.", explain: "대통령은 실거주 용도는 감해주고, 호화주택·다주택·명백한 투기용 주택은 가중 요소가 될 수 있다고 했어요.", claimIds: ["claim-2026-debate"] },
    { id: "ox3", answer: false, statement: "2026년 정부 세제개편안은 국토보유세라는 새 토지세를 도입하는 내용이다.", explain: "정부가 확정한 개편안은 새 토지세 도입이 아니라 종합부동산세 개편이에요.", claimIds: ["claim-2026-reform"] },
  ],
  "administrative-capital": [
    { id: "ox1", answer: true, statement: "행정수도특별법 제정안에는 세종시를 행정수도로 규정하는 내용이 담겼다.", explain: "계류 중인 제정안들은 세종시를 행정수도로 규정하고 헌법기관과 중앙행정기관의 이전 근거 등을 담았어요.", claimIds: ["claim-bills"] },
    { id: "ox2", answer: true, statement: "더불어민주당과 국토교통부는 행정수도법을 연내 처리하기로 뜻을 모았다.", explain: "당정협의회에서 행정수도법을 연내 차질 없이 처리하기로 뜻을 모았어요.", claimIds: ["claim-party-gov"] },
    { id: "ox3", answer: false, statement: "대통령 세종집무실은 이미 입주를 마쳐 운영 중이다.", explain: "대통령 세종집무실은 착공과 입주를 목표로 추진 중인 사업이에요.", claimIds: ["claim-office"] },
  ],
  "real-estate-to-stocks": [
    { id: "ox1", answer: true, statement: "이 대통령은 주거 불안을 설명하며 부동산을 대체할 투자 수단으로 주식을 들었다.", explain: "대통령은 투자가 주택·부동산에 한정되면서 주거 불안이 생겼다며 대체 투자 수단으로 주식을 들었어요.", claimIds: ["claim-2025-07"] },
    { id: "ox2", answer: true, statement: "이찬진 금융감독원장은 생산적 금융을 위해 위험자산 가중치 등 규제 근거를 합리화하고 있다고 말했다.", explain: "금감원장은 부동산 쏠림 완화 기조를 유지하며 생산적 금융을 위한 규제 근거 합리화 작업을 하고 있다고 했어요.", claimIds: ["claim-fss"] },
    { id: "ox3", answer: false, statement: "이 대통령은 자본시장 제도 개선보다 부동산으로 자금을 더 집중시키라고 주문했다.", explain: "대통령은 부동산에 집중된 자원 배분 왜곡을 바로잡고, 자본시장 제도를 개선해 생산적 금융 전환을 가속하라고 했어요.", claimIds: ["claim-2026-01"] },
  ],
  "youth-2030-jobs-loans": [
    { id: "ox1", answer: true, statement: "청년고용촉진특별법 개정에 맞춰 청년 고용 통계는 새로운 연령 기준도 따로 공표됐다.", explain: "청년이 15~34세로 새로 정의되면서 이 연령대의 고용 통계가 따로 공표됐어요.", claimIds: ["claim-youth-34"] },
    { id: "ox2", answer: true, statement: "청년미래보금자리론은 생애최초로 요건에 맞는 비아파트를 사는 청년을 대상으로 발표됐다.", explain: "만 39세 이하 청년이 생애최초로 4억 원 이하·85㎡ 이하 비아파트를 살 때 지원하는 상품으로 발표됐어요.", claimIds: ["claim-813-youth"] },
    { id: "ox3", answer: false, statement: "8·13 대책은 수도권·규제지역 주택 구입 대출의 6억 원 상한을 없앴다.", explain: "해당 대책에서도 수도권·규제지역의 주택 구입 대출 6억 원 상한은 바뀌지 않았어요.", claimIds: ["claim-813-youth"] },
  ],
  "manipulated-indictment-counsel": [
    { id: "ox1", answer: true, statement: "조작기소 의혹 특검법이 직접 수사하도록 한 대상은 당시 수사기관의 수사·기소 과정이다.", explain: "특검이 직접 수사하는 것은 당시 수사기관이 사건을 수사하고 기소한 과정이에요.", claimIds: ["claim-target-prosecutors"] },
    { id: "ox2", answer: true, statement: "조작기소 의혹 특검법 수정안은 공소유지 여부 결정과 기존 사건 이첩 요구 조항을 뺐다.", explain: "수정안은 공소유지 여부의 결정을 직무 범위에서 지우고, 수사·기소·공소유지 중인 사건의 이첩 요구 조항도 뺐어요.", claimIds: ["claim-subcommittee"] },
    { id: "ox3", answer: false, statement: "조작기소 의혹 특검법이 시행되면 대통령이나 특검이 대통령 재판의 유무죄를 판결한다.", explain: "특검법이 시행돼도 대통령 재판의 유무죄와 공소기각 여부는 각 재판부가 판결로 정해요.", claimIds: ["claim-who-judges"] },
  ],
  "hinzpeter-award": [
    { id: "ox1", answer: true, statement: "힌츠페터 국제보도상은 경쟁 부문과 비경쟁 특별 부문으로 나뉜다.", explain: "경쟁 부문은 뉴스·기획·다큐멘터리로 구성되며, 비경쟁 특별 부문도 있어요.", claimIds: ["claim-prize"] },
    { id: "ox2", answer: true, statement: "힌츠페터 국제보도상 시상식과 함께 서울과 광주에서 수상작 상영회가 열렸다.", explain: "해당 시상식은 옛 전남도청 회의실에서 열렸고, 서울과 광주에서 수상작 상영회도 함께 열렸어요.", claimIds: ["claim-2026"] },
    { id: "ox3", answer: false, statement: "힌츠페터 국제보도상은 정부 부처가 직접 주최하는 행사다.", explain: "힌츠페터 국제보도상은 정부 부처 주최가 아니라 5·18기념재단과 한국영상기자협회 공동 주최 행사예요.", claimIds: ["claim-organizers"] },
  ],
  "special-forces-walking": [
    { id: "ox1", answer: true, statement: "특전사 워킹 행사 영상에는 장병들이 걸음걸이와 포즈를 배우는 장면이 담겼다.", explain: "여성 모델이 군복 차림 장병들에게 걸음걸이와 포즈를 가르치고 장병들이 패션쇼처럼 걷는 영상이 공개됐어요.", claimIds: ["claim-event"] },
    { id: "ox2", answer: true, statement: "육군은 특전사 워킹 교육의 내용이 부대 특성과 장병 눈높이에 맞지 않았다고 인정했다.", explain: "육군은 교육이 부적절했고 사전 검토도 미흡했다고 인정하며, 장병 의견을 듣고 교육 내용을 다시 검토하겠다고 했어요.", claimIds: ["claim-army"] },
    { id: "ox3", answer: false, statement: "특전사 워킹 교육은 부대 자체 기획이 아니라 육군 전체의 공통 프로그램이었다.", explain: "육군은 해당 부대가 인성교육의 하나로 자체 계획하고 강사를 섭외한 프로그램이라고 설명했어요.", claimIds: ["claim-army"] },
  ],
  "special-pardon-criteria": [
    { id: "ox1", answer: true, statement: "이재명 정부 첫 특별사면에는 서민생계형 형사범과 여야 정치인 등이 포함됐다.", explain: "법무부가 밝힌 특별사면 대상에는 소상공인·청년·운전업 종사자 등과 경제인, 여야 정치인 등이 포함됐어요.", claimIds: ["claim-2025"] },
    { id: "ox2", answer: true, statement: "첫 특별사면 때 운전면허 행정제재 감면에서 음주운전은 제외됐다.", explain: "운전면허 감면에서는 음주운전, 교통 사망사고, 난폭운전, 무면허운전 등이 제외됐어요.", claimIds: ["claim-2025-admin"] },
    { id: "ox3", answer: false, statement: "내란죄 등의 사면을 제한하는 민주당 사면법 개정안은 법사위 전체회의를 통과했다.", explain: "이 개정안은 법사위 소위를 통과했지만 전체회의에서는 대통령 권한 제약에 대한 신중 검토 의견에 따라 보류됐어요.", claimIds: ["claim-bill-dem"] },
  ],
  "taekwondo-unesco": [
    { id: "ox1", answer: true, statement: "한국은 태권도의 도장 기반 공동체 수련 문화를 유네스코에 별도로 등재 신청했다.", explain: "한국도 태권도 도장 기반 공동체 수련 문화라는 이름으로 별도 등재 신청서를 냈어요.", claimIds: ["claim-kr-nomination"] },
    { id: "ox2", answer: true, statement: "국가유산청장은 북한의 태권도 단독 등재가 배타적 권리를 주는 것은 아니라고 설명했다.", explain: "청장은 북한이 단독 등재되더라도 배타적 권리가 생기지 않으며 한국의 확장 또는 별도 등재를 추진한다고 했어요.", claimIds: ["claim-no-exclusive"] },
    { id: "ox3", answer: false, statement: "북한의 태권도 유네스코 등재는 등재 권고 예상 발표만으로 최종 확정됐다.", explain: "등재 권고가 예상된다는 발표였어요. 최종 결정은 무형유산위원회에서 하도록 돼 있어요.", claimIds: ["claim-nk-nomination"] },
  ],
  "brunson-remarks": [
    { id: "ox1", answer: true, statement: "브런슨 사령관은 한국을 단검에 빗댄 발언이 작전환경을 설명한 것이라고 해명했다.", explain: "한국을 중국을 겨누는 단검에 빗댄 발언이 논란이 되자 작전환경을 설명한 것이라고 해명했어요.", claimIds: ["claim-dagger"] },
    { id: "ox2", answer: true, statement: "국방부는 브런슨의 DMZ 발언을 개인 견해로 규정하고 한국 영토주권 입장을 재확인했다.", explain: "국방부는 유엔군사령관 개인 견해라고 했고, 유엔사도 대한민국 주권에 의문의 여지가 없다고 밝혔어요.", claimIds: ["claim-mnd"] },
    { id: "ox3", answer: false, statement: "유엔사는 브런슨의 DMZ 발언을 해명하며 대한민국 주권에 의문이 있다고 밝혔다.", explain: "유엔사는 대한민국 주권에는 의문의 여지가 없다며, DMZ 내 정전협정상 책임을 설명한 것이라고 했어요.", claimIds: ["claim-mnd"] },
  ],
  "park-respect-remark": [
    { id: "ox1", answer: true, statement: "이재명의 존경하는 박근혜 표현은 대통령 재임 중이 아니라 대선 후보 때 나왔다.", explain: "이 표현은 대선 후보 시절 청년 간담회에서 지지자 응원의 효과를 설명하며 나온 말이에요.", claimIds: ["claim-remark"] },
    { id: "ox2", answer: true, statement: "이재명 후보 선거캠프는 박근혜 전 대통령 존경 표현이 의례적 표현이라고 설명했다.", explain: "당시 선거캠프는 전직 대통령에 대한 의례적 표현을 지나치게 확대해석한 것이라고 설명했어요.", claimIds: ["claim-camp"] },
    { id: "ox3", answer: false, statement: "이재명 후보는 박근혜 존경 표현을 해명하며 표를 얻으려고 존경하는 척했다고 인정했다.", explain: "이 후보는 표를 얻으려고 존경하는 척한다는 의심을 소개하며 반박했고, 발언의 맥락을 봐야 한다고 했어요.", claimIds: ["claim-explanation"] },
  ],
  "wage-income-tax": [
    { id: "ox1", answer: true, statement: "누진세율 구조에서는 급여가 오를 때 더 높은 세율 구간에 드는 근로자가 늘 수 있다.", explain: "급여가 오르면 더 높은 세율 구간에 들어가는 사람이 늘어, 세 부담이 급여보다 빠르게 커질 수 있어요.", claimIds: ["claim-causes"] },
    { id: "ox2", answer: true, statement: "여야 의원들은 소득세 과세표준을 물가에 연동하는 법안을 각각 발의했다.", explain: "더불어민주당과 국민의힘 의원들이 종합소득 과세표준을 물가에 연동하는 소득세법 개정안을 각각 냈어요.", claimIds: ["claim-indexation-bills"] },
    { id: "ox3", answer: false, statement: "최근 근로소득세 징수액 증가는 정부가 근로소득세율을 올린 결과다.", explain: "징수액 증가는 세율 인상 때문이 아니라 근로자·급여 증가와 과세표준 구간이 그대로인 구조에서 나왔어요.", claimIds: ["claim-no-rate-hike"] },
  ],
  "religion-politics": [
    { id: "ox1", answer: true, statement: "이 대통령은 위법하게 정치에 개입하고 불법 자금을 쓰는 종교단체의 해산 검토를 언급했다.", explain: "대통령은 헌법과 법률을 어긴 종교단체에 대해 해산까지 검토해야 한다는 취지로 말했어요.", claimIds: ["claim-cabinet"] },
    { id: "ox2", answer: true, statement: "법제처장은 종교단체 해산 가능성을 비영리법인 설립허가 취소 규정의 적용 문제라고 설명했다.", explain: "법제처장은 민법상 설립허가 취소 규정의 적용 문제이며, 조직적으로 매우 심한 위법행위를 지속한 경우 가능하다고 했어요.", claimIds: ["claim-legal"] },
    { id: "ox3", answer: false, statement: "청와대 대변인은 종교단체 해산 발언이 특정 종교를 지목한 것이라고 설명했다.", explain: "청와대 대변인은 대통령의 발언이 특정 종교를 가리킨 것은 아니라고 설명했어요.", claimIds: ["claim-spokesperson"] },
  ],
  "ev-subsidy-process": [
    { id: "ox1", answer: true, statement: "전기차 보조금은 보급사업 수행자로 선정된 제작·수입사가 파는 차량이어야 대상이 된다.", explain: "지침에는 평가를 거쳐 보급사업 수행자로 선정된 제작·수입사의 차량을 보조금 대상으로 하는 제도가 들어갔어요.", claimIds: ["claim-operator"] },
    { id: "ox2", answer: true, statement: "전기차 보조금 구매 지원신청은 구매자와 제작·수입사가 구매계약을 맺은 뒤 접수한다.", explain: "지자체 공고 절차는 보급사업 공고, 구매계약, 구매 지원신청서 접수 순서예요.", claimIds: ["claim-flow"] },
    { id: "ox3", answer: false, statement: "전기차 보조금은 차량 출고·등록보다 지원신청서 접수 순서에 따라 지급된다.", explain: "전기차 보조금은 지원신청서 접수 순서가 아니라 차량의 출고·등록 순서로 지급돼요.", claimIds: ["claim-order"] },
  ],
  "tesla-fsd": [
    { id: "ox1", answer: true, statement: "테슬라는 국내 출시한 감독형 FSD 이용 중에도 운전자가 항상 주의해야 한다고 안내했다.", explain: "테슬라는 감독형 FSD가 완전한 자율주행이 아니며 운전자가 항상 주의를 유지해야 한다고 안내했어요.", claimIds: ["claim-launch"] },
    { id: "ox2", answer: true, statement: "중국산 테슬라는 미국 안전기준 인증을 인정하는 한미 FTA 경로에 해당하지 않는다.", explain: "미국산 차량은 한미 FTA에 따른 판매 경로가 있지만, 중국산 테슬라는 그 경로에 해당하지 않아 FSD를 쓸 수 없어요.", claimIds: ["claim-china-made"] },
    { id: "ox3", answer: false, statement: "국내에 출시된 감독형 FSD는 이미 팔린 모든 테슬라 차량에 적용된다.", explain: "출시 안내에서 적용 대상은 미국에서 생산된 HW4 탑재 차량이에요.", claimIds: ["claim-launch"] },
  ],
  "car-insurance-rental": [
    { id: "ox1", answer: true, statement: "대법원은 대차료 손해배상액을 정하는 법원이 보험 약관 지급기준에 구속되지 않는다고 판단했다.", explain: "대법원은 법원이 약관 지급기준에 구속되지 않는다고 봤지만, 대차 필요성과 비용 상당성은 피해자가 입증해야 한다고 했어요.", claimIds: ["claim-court"] },
    { id: "ox2", answer: true, statement: "쌍방과실 교통사고에서는 본인 과실 비율만큼 렌트비를 직접 부담해야 한다.", explain: "금융감독원 안내에 따르면 쌍방과실이면 본인 과실 비율만큼 렌트비를 직접 내야 해요.", claimIds: ["claim-fss-guide"] },
    { id: "ox3", answer: false, statement: "자차 단독사고에서도 렌트비 보상을 받을 수 있다.", explain: "금융감독원 렌트비 보상 안내에 따르면 자차 단독사고에는 렌트비가 나오지 않아요.", claimIds: ["claim-fss-guide"] },
  ],
  "motorcycle-road-rules": [
    { id: "ox1", answer: true, statement: "이륜자동차는 원칙적으로 고속도로와 자동차전용도로를 통행할 수 없다.", explain: "도로교통법은 이륜자동차의 고속도로·자동차전용도로 통행을 원칙적으로 금지해요.", claimIds: ["claim-ban"] },
    { id: "ox2", answer: true, statement: "경찰청의 이륜차 보도 통행 단속장비는 번호판을 인식해 차량 동선을 추적한다.", explain: "경찰청은 보도나 통행금지 장소를 지나는 차량의 번호판을 인식해 동선을 추적·단속하는 장비를 시범운영했어요.", claimIds: ["claim-sidewalk-camera"] },
    { id: "ox3", answer: false, statement: "헌법재판소는 이륜차 고속도로 통행 금지 조항을 위헌으로 결정했다.", explain: "헌법재판소는 구조적 사고 위험성과 사고 결과의 중대성을 근거로 해당 조항을 합헌으로 봤어요.", claimIds: ["claim-court"] },
  ],
  "vietnam-veterans": [
    { id: "ox1", answer: true, statement: "국가보훈부의 국가 참전명예수당은 월남전 참전유공자도 지급 대상이다.", explain: "국가보훈부는 6·25전쟁과 월남전 참전유공자에게 국가 참전명예수당을 지급해요.", claimIds: ["claim-national"] },
    { id: "ox2", answer: true, statement: "보훈부는 지방정부 참전명예수당의 최소 지급 수준을 높이도록 권고했다.", explain: "기초자치단체와 광역자치단체에 각각 최소 지급액을 권고하는 가이드라인을 냈어요.", claimIds: ["claim-guideline"] },
    { id: "ox3", answer: false, statement: "지방정부가 조례로 지급하는 참전명예수당은 전국에서 같은 금액이다.", explain: "지방정부가 따로 주는 참전명예수당은 지역 간 금액 차이가 커요.", claimIds: ["claim-local"] },
  ],
  "care-workers": [
    { id: "ox1", answer: true, statement: "장기요양위원회가 의결한 2027년 장기요양보험료율은 전년보다 높다.", explain: "위원회는 소득 대비 장기요양보험료율을 올리는 내용으로 수가와 보험료율을 의결했어요.", claimIds: ["claim-2027"] },
    { id: "ox2", answer: true, statement: "노인요양시설 요양보호사 한시가산은 종료 예정 시점보다 연장됐다.", explain: "종사자 처우 항목에는 끝날 예정이던 요양보호사 한시가산을 다음 해 말까지 연장하는 내용이 포함됐어요.", claimIds: ["claim-2027-workers"] },
    { id: "ox3", answer: false, statement: "장기요양보험료율 인상 결정으로 모든 요양보호사의 기본급 인상 폭이 확정됐다.", explain: "보험료율 인상이 곧바로 임금 인상으로 이어지지는 않으며, 전체 요양보호사의 기본급 인상 확정 수치는 없어요.", claimIds: ["claim-no-base"] },
  ],
  "imported-food-safety": [
    { id: "ox1", answer: true, statement: "부적합 판정을 받은 수입식품 업체의 같은 식품은 이후 정밀검사를 반복해서 받는다.", explain: "부적합 판정을 받은 업체의 같은 식품은 정밀검사를 반복해서 받으며, 검사 횟수 상한도 강화됐어요.", claimIds: ["claim-inspection"] },
    { id: "ox2", answer: true, statement: "식약처는 김장철 수입 배추와 고춧가루의 수입·유통 단계 검사를 강화한다고 밝혔다.", explain: "식약처는 김장철 검사를 강화하고 중국산 배추와 절임배추의 포름알데히드 검사도 계속한다고 밝혔어요.", claimIds: ["claim-kimjang"] },
    { id: "ox3", answer: false, statement: "중국산 수입식품 통관 부적합률은 실제 검사 건수만을 분모로 계산한 수치다.", explain: "제시된 통관 부적합률은 실제 검사 건수가 아니라 전체 수입 건수를 분모로 한 수치예요.", claimIds: ["claim-inspection"] },
  ],
  "tax-reform-2026": [
    { id: "ox1", answer: true, statement: "2026년 세제개편안은 주택분 종부세 세율을 주택 수보다 주택 가액 기준으로 일원화한다.", explain: "개편안은 주택 가액 기준으로 세율을 단계적으로 일원화하고, 실거주 여부에 따라 기본공제를 달리해요.", claimIds: ["claim-ccomprehensive"] },
    { id: "ox2", answer: true, statement: "신용카드 매출 관련 부가가치세 공제 축소안은 국회 심의에서 내용이 바뀔 수 있다.", explain: "정부가 국회에 낸 개정안으로, 심의 과정에서 공제율·한도·시행 시점이 바뀔 수 있어요.", claimIds: ["claim-card-credit-status"] },
    { id: "ox3", answer: false, statement: "신용카드 매출 관련 세제개편안은 우대 공제율과 연간 한도를 모두 높이는 내용이다.", explain: "개편안은 한시 우대의 기한을 연장하되 우대 공제율을 낮추고 연간 우대 한도를 줄이는 내용이에요.", claimIds: ["claim-card-credit-plan"] },
  ],
  "new-start-fund": [
    { id: "ox1", answer: true, statement: "새출발기금은 비상계엄 이후 창업한 사업자도 대상에 포함하도록 사업 영위 기간을 넓혔다.", explain: "대상 사업 영위 기간을 확대해 비상계엄 이후 창업한 사업자도 들어갈 수 있게 됐어요.", claimIds: ["claim-expand"] },
    { id: "ox2", answer: true, statement: "새출발기금은 요건에 맞는 저소득 부실차주의 무담보 채무 원금 감면과 상환기간을 확대했다.", explain: "총 채무액 1억 원 이하 저소득 부실차주는 무담보 채무 원금 감면율 상한과 거치·상환기간이 늘었어요.", claimIds: ["claim-low-income"] },
    { id: "ox3", answer: false, statement: "새출발기금의 개선된 채무조정 조건은 기존 이용자에게는 적용되지 않는다.", explain: "원금 감면율과 기간 확대, 단기 연체자 금리 상한 인하 조건은 기존 이용자에게도 소급 적용돼요.", claimIds: ["claim-low-income"] },
  ],
  "inherited-house-loans": [
    { id: "ox1", answer: true, statement: "다주택자의 수도권·규제지역 아파트 담보대출은 만기연장이 원칙적으로 제한된다.", explain: "가계부채 관리방안은 해당 대출의 만기연장과 같은 은행 안에서 증액 없는 대환도 원칙적으로 허용하지 않아요.", claimIds: ["claim-maturity"] },
    { id: "ox2", answer: true, statement: "미성년 때 주택 지분을 상속받은 경우 심사를 거쳐 생애최초 LTV 혜택을 받을 수 있다.", explain: "불가피한 사유가 있으면 금융회사 여신심사위원회 심사를 거쳐 생애최초 LTV 혜택을 적용할 수 있게 했어요.", claimIds: ["claim-first-home"] },
    { id: "ox3", answer: false, statement: "상속 주택의 만기연장 규제 예외는 증여 주택에도 동일하게 적용된다.", explain: "금융당국은 상속과 달리 증여는 선택할 수 있는 행위라며 증여 주택을 예외에서 뺐어요.", claimIds: ["claim-inherit-vs-gift"] },
  ],
  "death-penalty": [
    { id: "ox1", answer: true, statement: "한국은 사형을 장기간 집행하지 않았지만 법률상 사형제는 남아 있다.", explain: "한국은 사형을 집행하지 않아 사실상 사형폐지국으로 분류되지만, 법률상 사형제는 남아 있어요.", claimIds: ["claim-moratorium"] },
    { id: "ox2", answer: true, statement: "범여권 의원들이 발의한 사형제 폐지 법안은 종신형을 대안으로 제시했다.", explain: "범여권 의원들은 종신형을 대안으로 하는 사형제 폐지 특별법안을 발의했어요.", claimIds: ["claim-bill"] },
    { id: "ox3", answer: false, statement: "헌법재판소는 과거 사형제를 위헌으로 결정해 폐지했다.", explain: "헌법재판소는 앞선 사형제 사건들에서 합헌으로 결정했고, 새로운 헌법소원 사건을 심리 중이에요.", claimIds: ["claim-court"] },
  ],
  "president-family-dispute": [
    { id: "ox1", answer: true, statement: "이재명의 친형 강제입원 관련 허위사실 공표 사건은 파기환송심에서 무죄가 확정됐다.", explain: "대법원이 무죄 취지로 파기환송했고, 파기환송심이 무죄를 선고해 확정됐어요.", claimIds: ["claim-court"] },
    { id: "ox2", answer: true, statement: "이재명 후보는 가족 통화 논란에 대해 자신의 과거이고 책임질 부분이라며 사과했다.", explain: "이 후보는 자신의 과거의 한 부분이고 책임져야 할 부분이라며 깊이 사과한다고 말했어요.", claimIds: ["claim-apology"] },
    { id: "ox3", answer: false, statement: "이재명의 친형 강제입원 관련 직권남용 혐의는 유죄로 판결됐다.", explain: "친형 강제입원 관련 직권남용 혐의는 1·2심 모두 무죄였어요.", claimIds: ["claim-court"] },
  ],
  "universal-public-rental": [
    { id: "ox1", answer: true, statement: "보편형 공공임대는 소득·자산 기준을 완화해 중산층 무주택자도 입주하도록 하는 구상이다.", explain: "정부는 일반 무주택자와 중산층도 입주할 수 있도록 소득·자산 기준을 완화한 공공임대 유형을 신설한다고 밝혔어요.", claimIds: ["claim-universal"] },
    { id: "ox2", answer: true, statement: "보편형 공공임대 예산안에는 건설형뿐 아니라 매입형과 전세형도 포함됐다.", explain: "예산안의 공급 물량에는 LH 택지 건설형과 함께 매입형·전세형이 포함됐어요.", claimIds: ["claim-budget"] },
    { id: "ox3", answer: false, statement: "보편형 공공임대는 출산 여부와 관계없이 모든 입주자의 거주 기간이 같다.", explain: "기본 거주 기간에서 출산할 때마다 기간이 늘어나며, 미성년 자녀가 셋 이상이면 최대 20년까지 살 수 있어요.", claimIds: ["claim-universal"] },
  ],
  "decision-records": [
    { id: "ox1", answer: true, statement: "하준경 청와대 정책실장은 단일종목 레버리지 ETF 도입의 최종 결정은 금융위원회가 했다고 밝혔다.", explain: "하 실장은 회의록 문제에 사과하면서도 상품 도입의 최종 결정은 청와대가 아니라 금융위원회가 했다고 밝혔어요.", claimIds: ["claim-etf-apology"] },
    { id: "ox2", answer: true, statement: "임종국 의원은 반도체산업지원실의 행사 추진에 회의 결과 보고서가 없다고 지적했다.", explain: "임 의원은 홍보·토크콘서트를 추진하면서 세부 지출 내역과 회의 결과 보고서가 없다고 지적했어요.", claimIds: ["claim-chip-records"] },
    { id: "ox3", answer: false, statement: "청와대는 단일종목 레버리지 ETF 비공개 간담회의 회의록을 작성했다고 답변했다.", explain: "청와대는 해당 간담회가 비공개 간담회여서 회의록을 작성하지 않았다고 서면 답변했어요.", claimIds: ["claim-etf-minutes"] },
  ],
  "state-violence-statute": [
    { id: "ox1", answer: true, statement: "국가범죄 시효 특례법은 형사 공소시효와 피해자의 국가배상청구권 소멸시효를 함께 다뤘다.", explain: "법안은 반인권적 국가범죄의 공소시효를 없애고, 피해자의 국가배상청구권에 소멸시효를 적용하지 않는 내용이에요.", claimIds: ["claim-2024"] },
    { id: "ox2", answer: true, statement: "이 대통령은 거부권으로 무산된 국가폭력 범죄 시효 배제 법안의 재입법을 촉구했다.", explain: "대통령은 제주 4·3 행사에서 빠른 재입법을 말했고, 국무회의에서도 입법을 조속히 매듭지으라고 주문했어요.", claimIds: ["claim-president"] },
    { id: "ox3", answer: false, statement: "국회를 통과했던 반인권적 국가범죄 시효 특례법은 거부권 없이 시행됐다.", explain: "최상목 대통령 권한대행이 재의를 요구했고, 법안은 폐기됐어요.", claimIds: ["claim-veto"] },
  ],
  "public-contract-advance": [
    { id: "ox1", answer: true, statement: "공공계약 선금 개편은 계약 규모가 작을수록 최초 지급률을 높게 정했다.", explain: "최초 지급률은 소규모 계약이 더 높으며, 정부는 중소기업이 많은 소규모 계약을 우대했다고 설명했어요.", claimIds: ["claim-small"] },
    { id: "ox2", answer: true, statement: "공공계약 선금은 계약마다 전용계좌로 관리하고 사용계획서를 내야 한다.", explain: "계약상대자는 선금사용계획서를 제출하고, 계약마다 전용계좌로 선금을 관리해야 해요.", claimIds: ["claim-control"] },
    { id: "ox3", answer: false, statement: "개편된 공공계약 선금 제도는 최초 지급 이후 추가 지급을 전면 금지한다.", explain: "계약 이행이 확인되면 누적 최대 70%까지 선금을 추가 지급할 수 있어요.", claimIds: ["claim-rate"] },
  ],
  "wangsuk-new-town": [
    { id: "ox1", answer: true, statement: "왕숙지구 본청약 지연 보완책에는 중도금 납부 방식을 조정하는 내용이 담겼다.", explain: "LH는 본청약이 예정보다 6개월 이상 늦어지면 중도금 30%를 한 번에 내도록 조정하겠다고 했어요.", claimIds: ["claim-lh-measures"] },
    { id: "ox2", answer: true, statement: "왕숙지구 사전청약 당첨자들은 대기 중 주거비와 분양가 상승을 걱정했다.", explain: "사전청약 당첨자들은 입주를 기다리는 동안의 주거비와 분양가 상승에 대한 우려를 나타냈어요.", claimIds: ["claim-lh-measures"] },
    { id: "ox3", answer: false, statement: "왕숙 A19 블록의 본청약은 기존 거주자 이주가 빨라져 당초보다 앞당겨졌다.", explain: "기존 거주자의 이주·철거 일정이 늦어져 본청약이 미뤄졌어요. 입주 시점은 본청약 공고 때 확정해요.", claimIds: ["claim-a19"] },
  ],
  "insurrection-warrants": [
    { id: "ox1", answer: true, statement: "뉴시스 집계에서 종합특검의 구속영장 기각률은 내란 특검과 김건희 특검보다 높았다.", explain: "제시된 뉴시스 집계에서는 종합특검의 기각률이 내란 특검과 김건희 특검의 기각률보다 높았어요.", claimIds: ["claim-rates"] },
    { id: "ox2", answer: true, statement: "법원은 심우정 전 검찰총장 영장 기각 사유로 증거 인멸과 도주 우려 소명 문제를 들었다.", explain: "법원은 증거 인멸 염려에 대한 소명이 부족하고 도망할 염려가 있다고 보기 어렵다고 했어요.", claimIds: ["claim-reasons"] },
    { id: "ox3", answer: false, statement: "내란 사건 전담재판부 특례법은 아직 국회를 통과하지 못한 발의 단계다.", explain: "해당 특례법은 이미 국회를 통과해 공포·시행됐고, 법원은 전담재판부와 전담 영장법관을 배치했어요.", claimIds: ["claim-special-act"] },
  ],
  "electronic-monitoring": [
    { id: "ox1", answer: true, statement: "전자감독 예산은 늘었고 감독 경보 건수도 증가했다.", explain: "제시된 기간에 전자감독 예산이 늘었고, 감독 경보 건수도 증가했어요.", claimIds: ["claim-budget"] },
    { id: "ox2", answer: true, statement: "법무부는 인천 전자감독 대상자 사건 뒤 감독 체계를 전면 재점검하겠다고 밝혔다.", explain: "법무부는 인천 사건 뒤 사과했으며, 감독 체계를 전면 재점검하겠다고 했어요.", claimIds: ["claim-response"] },
    { id: "ox3", answer: false, statement: "전자감독 대상자가 늘어나는 동안 전담 인력도 함께 늘었다.", explain: "전자감독 대상자는 늘었지만 전담 인력은 줄었고, 직원 한 명이 맡는 대상자는 늘었어요.", claimIds: ["claim-scale"] },
  ],
  "comment-nationality-label": [
    { id: "ox1", answer: true, statement: "댓글 접속 국가 표시 법안은 일정 규모 이상 서비스가 작성자의 접속 국가를 공개하도록 한다.", explain: "법안은 일정 규모 이상 서비스 제공자가 게시판·댓글 작성자의 접속 국가를 다른 이용자에게 표시하도록 하는 내용이에요.", claimIds: ["claim-bill"] },
    { id: "ox2", answer: true, statement: "댓글 접속 국가 표시 도입을 두고 국민의힘은 촉구하고 민주당은 반대했다.", explain: "국민의힘은 도입을 거듭 촉구했고, 민주당은 혐중 정서를 부추긴다며 반대했어요.", claimIds: ["claim-pending"] },
    { id: "ox3", answer: false, statement: "국회 검토에서는 VPN 우회 이용자의 실제 접속 국가를 실시간으로 쉽게 가려낼 수 있다고 봤다.", explain: "과방위 수석전문위원은 VPN 등 우회 접속 이용자의 실제 국가를 실시간으로 가려내기 어렵다고 검토했어요.", claimIds: ["claim-issues"] },
  ],
  "nk-provocations-2026": [
    { id: "ox1", answer: true, statement: "국방부는 비무장지대 군사분계선 일대의 우발적 충돌 방지를 위해 남북 군사회담을 제안했다.", explain: "국방부의 남북 군사회담 제안은 비무장지대 군사분계선 일대에서 우발적 충돌을 막기 위한 것이었어요.", claimIds: ["claim-oct29"] },
    { id: "ox2", answer: true, statement: "합동참모본부는 한미가 북한 미사일 발사 준비 단계부터 감시하고 발사 직후 탐지·추적했다고 밝혔다.", explain: "합참은 발사 준비 단계부터 감시했고 발사 직후 탐지·추적했으며, 대응 능력과 태세를 유지한다고 밝혔어요.", claimIds: ["claim-jcs"] },
    { id: "ox3", answer: false, statement: "북한은 남북 군사회담 제안 이후 단거리 탄도미사일 발사를 중단했다.", explain: "북한은 국방부가 군사회담을 제안한 뒤 원산 일대에서 동해상으로 단거리 탄도미사일을 발사했어요.", claimIds: ["claim-oct29"] },
  ],
  "rent-shift-2026": [
    { id: "ox1", answer: true, statement: "HUG 전세보증의 전월세 전환율이 오르면 보증 가입이 가능한 월세 상한도 높아진다.", explain: "HUG 전세보증 가입에 적용하는 전월세 전환율이 올랐고, 이에 따라 가입 가능한 월세 상한도 높아져요.", claimIds: ["claim-conversion"] },
    { id: "ox2", answer: true, statement: "전월세 안심신탁은 임차인 보증금을 HUG 전용 계좌에 맡기는 방식이다.", explain: "임차인이 보증금을 맡기면 HUG가 운용해 임대인에게 매달 월세처럼 지급하는 계약이며, 별도 보증 가입이 필요 없어요.", claimIds: ["claim-trust"] },
    { id: "ox3", answer: false, statement: "전월세 안심신탁 임대인의 소득세·법인세 감면은 법 개정 없이 적용된다.", explain: "임대인 소득세·법인세 감면은 법 개정이 전제이며, 제시된 기준일에는 개정안이 아직 발의되지 않았어요.", claimIds: ["claim-trust-tax"] },
  ],
  "cyber-security": [
    { id: "ox1", answer: true, statement: "범부처 정보보호 종합대책에는 이동통신사 불시 보안 점검이 포함된다.", explain: "종합대책은 이동통신사에 실제 해킹 방식의 불시 점검을 하는 내용을 담았어요.", claimIds: ["claim-2025-plan"] },
    { id: "ox2", answer: true, statement: "개정 개인정보보호법은 반복·대규모 유출에 대한 과징금을 강화했다.", explain: "개정법으로 고의·중과실이나 반복·대규모 유출에는 전체 매출액의 10%까지 과징금을 매길 수 있게 됐어요.", claimIds: ["claim-penalty"] },
    { id: "ox3", answer: false, statement: "대통령은 사이버 보안 차르 기구의 구성이 끝났다고 밝혔다.", explain: "대통령은 흩어진 보안 기능을 총괄 조정할 기구의 구성을 적극 검토하라고 지시했어요.", claimIds: ["claim-czar"] },
  ],
  "cheorwon-howitzer-crash": [
    { id: "ox1", answer: true, statement: "철원 자주포 추돌 사고에서 경찰은 군의 안전조치 이행 여부를 조사하고 있다.", explain: "경찰은 군사경찰과 함께 운행 규정과 매뉴얼, 안전조치가 제대로 이뤄졌는지 확인하고 있어요.", claimIds: ["claim-investigation"] },
    { id: "ox2", answer: true, statement: "철원 사고의 자주포 대열은 이동 중 장비 문제로 나뉘었다.", explain: "자주포 일부가 뒤처지자 호위 차량이 따라갔고, 앞선 대열 후미에는 호위 차량이 없었어요.", claimIds: ["claim-escort"] },
    { id: "ox3", answer: false, statement: "철원 자주포 추돌 사고는 훈련장으로 향하던 중에 발생했다.", explain: "사고 당시 자주포는 훈련을 마치고 부대로 복귀하고 있었어요.", claimIds: ["claim-crash"] },
  ],
  "wildfire-causes": [
    { id: "ox1", answer: true, statement: "개정 산림재난방지법은 실수로 산불을 낸 경우의 처벌을 강화한다.", explain: "실수로 산불을 낸 경우의 법정형을 높이고, 허가 없이 불을 피운 경우의 과태료도 올려요.", claimIds: ["claim-law"] },
    { id: "ox2", answer: true, statement: "봄철 산불 종합대책은 산불조심기간 시작을 앞당기는 내용을 담았다.", explain: "봄철 산불조심기간을 앞당기고 진화 인력과 감시 CCTV를 늘리는 내용이에요.", claimIds: ["claim-spring"] },
    { id: "ox3", answer: false, statement: "가을철 산불 대책은 산주 동의 없이도 건축물 주변 나무를 베도록 했다.", explain: "건축물 25m 이내 나무를 허가 없이 벨 수 있게 했지만 산주의 동의가 필요해요.", claimIds: ["claim-autumn"] },
  ],
  "duplicate-listing-rules": [
    { id: "ox1", answer: true, statement: "중복상장 규정은 모회사와 자회사의 동시 상장을 원칙적으로 금지한다.", explain: "금융위원회는 모회사와 자회사가 함께 상장하는 중복상장을 원칙적으로 금지하는 규정을 승인했어요.", claimIds: ["claim-guideline"] },
    { id: "ox2", answer: true, statement: "중복상장 때 모회사 이사회는 주주 영향 평가와 보호 방안을 마련해야 한다.", explain: "이사회에는 주주 영향 평가와 보호 방안 마련, 주주 소통·동의 확인 등의 의무가 붙어요.", claimIds: ["claim-board"] },
    { id: "ox3", answer: false, statement: "물적분할 자회사는 저비중 자회사이면 상장 때 주주동의가 면제된다.", explain: "저비중 자회사는 주주동의 면제 대상이지만, 물적분할 자회사는 저비중이어도 동의가 필요해요.", claimIds: ["claim-low-weight"] },
  ],
  "kosdaq-segment-2026": [
    { id: "ox1", answer: true, statement: "코스닥 승강제 계획은 프리미엄에 더 엄격한 진입·유지 요건을 두는 내용이다.", explain: "금융위원회는 프리미엄에 더 엄격한 진입·유지 요건과 지배구조·영문공시 요건을 두겠다고 발표했어요.", claimIds: ["claim-segment"] },
    { id: "ox2", answer: true, statement: "모험자본 공급 계획은 장기투자 분야의 장기만기 펀드를 우대한다.", explain: "딥테크 같은 장기투자 분야는 모태펀드 투자 때 장기만기 펀드를 우대하는 계획이에요.", claimIds: ["claim-venture"] },
    { id: "ox3", answer: false, statement: "코스닥 승강제는 발표와 동시에 도입이 완료됐다.", explain: "금융위원회는 의견수렴을 거쳐 이듬해 초 도입하는 것이 목표이며, 순조로우면 그해에도 가능하다고 설명했어요.", claimIds: ["claim-schedule"] },
  ],
  "health-checkup-tax": [
    { id: "ox1", answer: true, statement: "국세청은 한 회사의 임직원 건강검진 지원비를 근로소득으로 보고 과세를 통보했다.", explain: "한 보험사 자회사 세무조사에서 임직원 건강검진 지원비를 근로소득으로 보고 소득세 과세를 통보했어요.", claimIds: ["claim-case"] },
    { id: "ox2", answer: true, statement: "건강검진비 과세 통보를 받은 회사는 조세심판원에 심판을 청구했다.", explain: "회사는 과세전적부심사가 받아들여지지 않자 조세심판원에 심판을 청구했어요.", claimIds: ["claim-pending"] },
    { id: "ox3", answer: false, statement: "국세청은 회사가 추가로 지원한 검진비도 법정 검진 의무 이행 비용으로 봤다.", explain: "국세청은 공단 검진만으로 법정 의무를 다할 수 있어 추가 비용은 의무 이행이 아니라고 봤어요.", claimIds: ["claim-interpretation"] },
  ],
  "csat-ai-cheating-2027": [
    { id: "ox1", answer: true, statement: "수능 AI 부정행위 대책은 필기구로 위장한 촬영·통신기기 차단을 포함했다.", explain: "교육부는 개인 필기구를 흑색 연필로 제한하고 다른 필기구는 시험장에서 나눠 주기로 했어요.", claimIds: ["claim-items"] },
    { id: "ox2", answer: true, statement: "수능 부정행위자의 응시 제한 기간 확대에는 법 개정이 필요하다.", explain: "정부는 응시 제한 기간 확대를 국회와 협의하겠다고 했고, 이를 위해서는 법 개정이 필요해요.", claimIds: ["claim-sanction"] },
    { id: "ox3", answer: false, statement: "교육부는 AI 부정행위 우려 때문에 수능을 연기하기로 했다.", explain: "교육부는 수능을 예정대로 치른다고 밝혔어요. 장관은 연기가 더 큰 혼란을 부를 수 있다고 설명했어요.", claimIds: ["claim-no-delay"] },
  ],
  "choi-kyo-jin-resignation": [
    { id: "ox1", answer: true, statement: "최교진 교육부 장관은 수능이 끝난 뒤 책임을 통감한다며 사의를 밝혔다.", explain: "최 장관은 수능이 마무리된 만큼 책임을 통감한다며 사의를 표명했어요.", claimIds: ["claim-resign"] },
    { id: "ox2", answer: true, statement: "대통령은 최교진 교육부 장관의 면직안을 재가했다.", explain: "청와대 대변인은 최 장관의 면직안 재가가 완료됐다고 밝혔어요.", claimIds: ["claim-dismissal"] },
    { id: "ox3", answer: false, statement: "교육부는 수능 대책 브리핑에 장관이 불참했을 때 이미 사퇴를 검토 중이라고 밝혔다.", explain: "당시 차관이 대신 발표했고 교육부는 일정 변경 때문이며 사퇴는 전혀 검토된 바 없다고 밝혔어요.", claimIds: ["claim-briefing"] },
  ],
  "csat-reform-debate-2026": [
    { id: "ox1", answer: true, statement: "국가교육위원회는 수능 절대평가 전환과 서·논술형 문항 도입을 검토해 왔다.", explain: "AI 부정행위 사태 전부터 검토하던 내용이며, 이를 담을 계획 시안 발표는 연말로 미뤄졌어요.", claimIds: ["claim-nec-plan"] },
    { id: "ox2", answer: true, statement: "전교조는 AI 부정행위 사태 뒤 수능을 대입 자격고사로 바꾸자고 제안했다.", explain: "전교조는 감독교사의 주의력에 의존하는 방식으로는 근본 해결이 어렵다며 자격고사 전환을 제안했어요.", claimIds: ["claim-proposals"] },
    { id: "ox3", answer: false, statement: "서울시교육감의 수능 폐지 제안에 따라 수능 폐지가 이미 시행됐다.", explain: "서울시교육감은 장래의 수능 폐지를 제안했어요. 이는 AI 부정행위 뒤 나온 수능 개편 주장이에요.", claimIds: ["claim-proposals"] },
  ],
  "national-exam-ai-cheating": [
    { id: "ox1", answer: true, statement: "국가자격시험 AI 부정행위 조사는 의심 답안을 전문가가 검토하는 방식이다.", explain: "점수와 과목 간 격차, 제보로 의심 사례를 고르고 전문가가 답안지를 검토해 뚜렷한 사례는 수사를 의뢰해요.", claimIds: ["claim-survey"] },
    { id: "ox2", answer: true, statement: "세무사 시험 특정감사에서 확인된 채점 문제로 재채점과 추가 합격이 이뤄졌다.", explain: "감사에서 같은 답에 다른 점수를 준 문제가 확인됐고, 해당 문항 재채점으로 추가 합격자가 나왔어요.", claimIds: ["claim-58-audit", "claim-58-regrade"] },
    { id: "ox3", answer: false, statement: "국가자격시험 AI 부정행위 전수조사에는 과거 채점 논란이 있던 세무사 시험도 포함된다.", explain: "전수조사는 올해 시행된 국가자격시험을 대상으로 하며, 과거 채점 논란이 있던 세무사 시험은 대상이 아니에요.", claimIds: ["claim-survey"] },
  ],
  "public-housing-240k": [
    { id: "ox1", answer: true, statement: "이재명 대통령은 공적주택 공급을 과거 평균보다 확대할 예정이라고 말했다.", explain: "대통령은 매년 평균 공적주택 공급 예정 물량이 지난 기간의 평균보다 확대된 수준이라고 말했어요.", claimIds: ["claim-plan"] },
    { id: "ox2", answer: true, statement: "국토교통부는 지분적립형 공공분양을 입주 뒤 지분을 나눠 사는 방식으로 제시했다.", explain: "국토교통부가 내놓은 모델은 분양가 일부로 입주한 뒤 지분을 나눠 사는 방식이에요.", claimIds: ["claim-sale-models"] },
    { id: "ox3", answer: false, statement: "공공택지 공동주택의 분양가상한제는 분양가를 주변 시세의 일정 비율로 정한다.", explain: "법상 분양가격은 택지비와 건축비로 구성돼요. 주변 시세의 일정 비율로 정하는 방식이 아니에요.", claimIds: ["claim-price-cap"] },
  ],
  "public-rental-rules": [
    { id: "ox1", answer: true, statement: "LH 신축 매입약정의 매입가격은 감정평가로만 산정한다.", explain: "LH는 매입임대 제도를 고쳐 신축 매입약정의 가격을 감정평가로만 산정하도록 했어요.", claimIds: ["claim-purchase-reform"] },
    { id: "ox2", answer: true, statement: "국토교통부는 공적임대주택의 중형 평형 비중을 늘리겠다는 목표를 밝혔다.", explain: "국토교통부는 공적주택 현장간담회에서 중형 평형 비중 확대를 목표로 제시했어요.", claimIds: ["claim-mid-size"] },
    { id: "ox3", answer: false, statement: "공공임대주택 임차인은 집을 다른 사람에게 자유롭게 다시 빌려줄 수 있다.", explain: "공공임대주택 전대는 금지돼요. 법령이 정한 사유가 있고 공공주택사업자의 동의를 받은 경우만 예외예요.", claimIds: ["claim-sublet-ban"] },
  ],
  "trial-election-law": [
    { id: "ox1", answer: true, statement: "이재명 대통령의 선거법 사건 항소심은 공소사실 전부를 무죄로 판단했다.", explain: "항소심은 원심을 파기하고 골프 발언과 백현동 관련 발언을 포함한 공소사실 전부를 무죄로 봤어요.", claimIds: ["claim-appeal"] },
    { id: "ox2", answer: true, statement: "이재명 대통령의 선거법 파기환송심은 기일이 추후 지정돼 중단된 상태다.", explain: "서울고법 재판부는 헌법에 따른 조치라며 예정 기일을 추후 지정으로 바꿨어요.", claimIds: ["claim-suspended"] },
    { id: "ox3", answer: false, statement: "대법원의 선거법 유죄 취지 파기환송으로 이재명 대통령의 형이 확정됐다.", explain: "대법원은 원심을 파기해 사건을 서울고법에 돌려보냈어요. 유죄 취지이지만 형은 아직 정해지지 않았어요.", claimIds: ["claim-remand"] },
  ],
  "trial-perjury": [
    { id: "ox1", answer: true, statement: "이재명 대통령의 위증교사 사건은 1심에서 무죄가 선고됐다.", explain: "서울중앙지법은 이 대통령의 위증교사 혐의에 대해 1심 무죄를 선고했어요.", claimIds: ["claim-acquitted"] },
    { id: "ox2", answer: true, statement: "위증교사 사건 재판부는 변론요지서를 건넨 행위를 방어권 범위 안으로 봤다.", explain: "재판부는 검사 사칭 사건 상황 설명과 변론요지서 전달을 피고인의 방어권 범위 안이라고 판단했어요.", claimIds: ["claim-defense-right"] },
    { id: "ox3", answer: false, statement: "이재명 대통령의 위증교사 항소심은 대선 뒤에야 기일이 추후 지정됐다.", explain: "위증교사 항소심은 대선 전에 공판을 추후 지정으로 바꿨고 이후 중단된 상태예요.", claimIds: ["claim-suspended"] },
  ],
  "trial-daejang": [
    { id: "ox1", answer: true, statement: "검찰은 성남FC 후원금의 대가로 편의를 제공했다며 이재명 대통령을 기소했다.", explain: "검찰은 기업 후원금의 대가로 인허가나 용도 변경 편의를 제공했다며 제3자 뇌물 혐의를 적용했어요.", claimIds: ["claim-fc-charge"] },
    { id: "ox2", answer: true, statement: "이재명 대통령의 대장동 등 개발 사건 재판은 유무죄 판단 전에 멈췄다.", explain: "재판부가 헌법을 적용해 기일을 추후 지정하면서 첫 유무죄 판단 전에 중단됐어요.", claimIds: ["claim-suspended"] },
    { id: "ox3", answer: false, statement: "백현동·대북송금 구속영장 기각은 이재명 대통령에게 무죄를 선고한 결정이다.", explain: "영장 기각은 구속할지를 정한 판단이에요. 백현동 부분의 직접 증거 부족 등을 언급했지만 유무죄 판단은 아니에요.", claimIds: ["claim-warrant"] },
  ],
  "trial-north-remittance": [
    { id: "ox1", answer: true, statement: "검찰은 이재명 대통령이 쌍방울에 경기도 관련 비용을 대신 내게 했다며 기소했다.", explain: "검찰은 이 전 부지사와 공모해 스마트팜 사업비와 도지사 방북 비용을 대납하게 했다는 혐의로 기소했어요.", claimIds: ["claim-charge"] },
    { id: "ox2", answer: true, statement: "이재명 대통령의 대북송금 재판은 기일이 추후 지정되며 중단됐다.", explain: "수원지법은 국정운영 계속성 등을 보장하기 위해 기일을 추후 지정했고 공범 재판은 따로 진행하기로 했어요.", claimIds: ["claim-suspended"] },
    { id: "ox3", answer: false, statement: "이화영 전 부지사의 대북송금 확정판결은 이재명 대통령의 유무죄도 판단했다.", explain: "이 대통령은 이 전 부지사 사건의 피고인이 아니에요. 그 판결은 이 대통령에 대한 판단이 아니에요.", claimIds: ["claim-separate"] },
  ],
  "trial-corporate-card": [
    { id: "ox1", answer: true, statement: "검찰은 경기도 관용차와 법인카드 등의 사적 사용 혐의로 이재명 대통령을 기소했다.", explain: "검찰은 관용차 사적 사용과 경기도 예산으로 과일·식사 대금 등을 냈다는 업무상 배임 혐의로 기소했어요.", claimIds: ["claim-charge"] },
    { id: "ox2", answer: true, statement: "경찰은 경기도 법인카드 사건에서 이재명 대통령을 불송치한 적이 있다.", explain: "경찰은 관여 정황이 확인되지 않는다는 취지로 불송치했고, 이후 검찰이 사건을 넘겨받아 다시 수사했어요.", claimIds: ["claim-police"] },
    { id: "ox3", answer: false, statement: "이재명 대통령의 경기도 법인카드 재판은 유죄 선고 뒤 중단됐다.", explain: "이 재판은 공판준비기일 단계에서 기일이 추후 지정돼 중단됐어요. 이 대통령에 대한 유무죄 판단은 없어요.", claimIds: ["claim-suspended"] },
  ],
  "trial-suspension": [
    { id: "ox1", answer: true, statement: "대통령 취임 전 시작된 재판의 중단 여부는 헌법 해석이 갈리는 사안이다.", explain: "헌법은 소추라는 말만 쓰고 취임 전 시작된 재판은 따로 정하지 않아, 진행 중 재판 중단 여부에 해석이 갈려요.", claimIds: ["claim-art84-scope"] },
    { id: "ox2", answer: true, statement: "이재명 대통령의 재판을 언제 다시 열지는 각 재판부가 정한다.", explain: "서울고법원장은 선거법 파기환송심 재개가 이론적으로 가능하다고 답했어요. 재개 시점은 각 재판부가 정해요.", claimIds: ["claim-resume-debate"] },
    { id: "ox3", answer: false, statement: "이재명 대통령의 형사재판 기일 추후 지정은 무죄 판결을 뜻한다.", explain: "기일 추후 지정은 무죄 판결도 공소 취소도 아니에요. 재판부가 기일을 잡지 않아 중단된 상태예요.", claimIds: ["claim-not-acquittal"] },
  ],
  "trial-past-convictions": [
    { id: "ox1", answer: true, statement: "이재명 대통령이 공개한 범죄·수사경력 회보서의 전과는 모두 벌금형이다.", explain: "공개된 회보서에는 공무원 자격 사칭, 음주운전, 특수공무집행방해, 공직선거법 위반의 벌금형이 적혀 있어요.", claimIds: ["claim-four"] },
    { id: "ox2", answer: true, statement: "이재명 대통령의 지하철역 명함 배포 사건은 배포 장소가 선거운동 금지 장소로 판단됐다.", explain: "항소심은 지하철역 구내가 선거운동이 허용되지 않는 장소라고 봤고 대법원에서 벌금형이 확정됐어요.", claimIds: ["pc4-final"] },
    { id: "ox3", answer: false, statement: "후보자 등록 때 제출하는 범죄경력에는 금액과 관계없이 모든 벌금형이 포함된다.", explain: "공직선거법은 벌금 100만 원 이상 형의 범죄경력을 제출하도록 해요. 그 미만은 포함하지 않아요.", claimIds: ["claim-bulletin"] },
  ],
  "ai-learning-materials": [
    { id: "ox1", answer: true, statement: "AI 디지털교과서는 법 개정으로 교과서에서 교육자료로 지위가 바뀌었다.", explain: "법 개정으로 교육자료가 됐어요. 교육자료는 학교장이 사용할지 정해요.", claimIds: ["law-change"] },
    { id: "ox2", answer: true, statement: "AI 디지털교과서가 교육자료가 되면서 사용 학교가 구독료를 스스로 마련해야 하게 됐다.", explain: "교육자료가 되면서 교육청의 구독료 지원이 어려워졌고, 사용하려는 학교가 비용을 마련해야 하게 됐어요.", claimIds: ["funding"] },
    { id: "ox3", answer: false, statement: "AI 디지털교과서는 교육자료로 바뀐 뒤에도 학교가 반드시 채택해야 한다.", explain: "반드시 채택해야 하는 교과서와 달리 교육자료는 학교장이 사용할지 정해요.", claimIds: ["law-change"] },
  ],
  "bk21-four": [
    { id: "ox1", answer: true, statement: "BK21 연구장학금 지급 기준액은 박사과정이 석사과정보다 높다.", explain: "대학원생 연구장학금 지급 기준액은 박사과정이 석사과정보다 높게 정해져 있어요.", claimIds: ["stipend"] },
    { id: "ox2", answer: true, statement: "BK21은 대학의 교육연구단을 선정해 참여 대학원생에게 연구장학금을 지원한다.", explain: "선정된 교육연구단이나 팀에 참여하는 대학원생이 연구장학금을 받는 구조예요.", claimIds: ["unit"] },
    { id: "ox3", answer: false, statement: "BK21 연구장학금은 교육연구단 참여 여부와 관계없이 모든 대학원생에게 지급된다.", explain: "대학 교육연구단이나 팀을 선정해 지원하고, 그곳에 참여한 대학원생이 연구장학금을 받아요.", claimIds: ["unit"] },
  ],
  "everyone-transit-card": [
    { id: "ox1", answer: true, statement: "모두의 교통카드 기본형은 쓴 교통비의 일정 비율을 돌려준다.", explain: "기본형은 이용한 교통비에 정해진 환급률을 적용해 돌려주는 정률 환급 방식이에요.", claimIds: ["basic-rate"] },
    { id: "ox2", answer: true, statement: "모두의 교통카드 일반형·플러스형은 기준금액을 초과한 이용액을 돌려준다.", explain: "일반형·플러스형은 기준금액을 넘게 쓴 만큼을 환급하며, 청년 기준금액은 지역에 따라 달라요.", claimIds: ["flat-types"] },
    { id: "ox3", answer: false, statement: "모두의 교통카드는 카드를 발급받기만 하면 회원가입 없이 환급받는다.", explain: "환급받으려면 K-패스 앱이나 홈페이지에서 회원가입을 하고 카드를 등록해야 해요.", claimIds: ["register"] },
  ],
  "exam-fee-support": [
    { id: "ox1", answer: true, statement: "청년 국가기술자격시험 응시료 지원은 예산이 소진되면 중단된다.", explain: "예산이 소진되면 개인에게 남은 지원 횟수가 있더라도 더는 지원받을 수 없어요.", claimIds: ["budget"] },
    { id: "ox2", answer: true, statement: "청년 응시료 지원은 Q-Net 원서 접수 때 자동으로 적용된다.", explain: "별도 신청 없이 원서 접수 때 적용되며, 원하지 않으면 지원받지 않기를 고를 수 있어요.", claimIds: ["auto-apply"] },
    { id: "ox3", answer: false, statement: "청년 응시료 지원을 받고 시험에 불참하면 차감된 지원 횟수가 돌아온다.", explain: "접수를 취소하면 횟수가 돌아오지만, 접수 후 시험을 보지 않으면 차감된 횟수는 돌아오지 않아요.", claimIds: ["no-show"] },
  ],
  "happy-housing": [
    { id: "ox1", answer: true, statement: "행복주택 청년 계층은 혼인 중이 아닌 무주택자를 대상으로 한다.", explain: "청년 계층 대상은 만 19세 이상 만 39세 이하이면서 혼인 중이 아닌 무주택자예요.", claimIds: ["target"] },
    { id: "ox2", answer: true, statement: "행복주택 입주자는 계약 갱신 때 입주자격을 다시 확인받는다.", explain: "계약 기간이 끝나면 입주자격을 다시 확인해 갱신하는 방식이에요.", claimIds: ["duration"] },
    { id: "ox3", answer: false, statement: "행복주택은 소득 기준만 맞으면 자산과 자동차가액은 확인하지 않는다.", explain: "행복주택에 입주하려면 총자산과 자동차가액 기준도 따로 충족해야 해요.", claimIds: ["asset"] },
  ],
  "high-school-credit": [
    { id: "ox1", answer: true, statement: "고교학점제 선택과목은 바뀐 기준에서 출석률만 채우면 학점을 받는다.", explain: "선택과목은 출석률만 확인하며, 학점을 줄 때 학업성취율은 보지 않아요.", claimIds: ["elective-rule"] },
    { id: "ox2", answer: true, statement: "고교학점제 공통과목은 출석률과 학업성취율을 모두 확인한다.", explain: "공통과목은 기존처럼 출석률과 학업성취율 기준을 모두 적용해요.", claimIds: ["common-rule"] },
    { id: "ox3", answer: false, statement: "고교학점제의 바뀐 이수 기준은 처음부터 모든 학년에 동시에 적용된다.", explain: "바뀐 기준은 고1·고2에 먼저 적용한 뒤, 다음 학년도부터 고1~고3으로 넓혀요.", claimIds: ["schedule"] },
  ],
  "high-school-free-tuition": [
    { id: "ox1", answer: true, statement: "고교 무상교육은 수업료뿐 아니라 입학금과 교과서비도 지원한다.", explain: "입학금·수업료·학교운영지원비·교과서비를 지원하며 고등학교 전 학년이 대상이에요.", claimIds: ["covers"] },
    { id: "ox2", answer: true, statement: "고교 무상교육의 국비 지원을 더 줄이는 내용은 정부 예산안 단계다.", explain: "정부 예산안은 국가 증액교부금과 정부 부담 비중을 줄이는 내용이며, 아직 국회 심의 전이에요.", claimIds: ["budget-2027"] },
    { id: "ox3", answer: false, statement: "고교 무상교육에는 학비를 학교장이 정하는 사립학교도 예외 없이 포함된다.", explain: "고교 무상교육에서는 학비를 학교장이 정하는 일부 사립학교가 제외돼요.", claimIds: ["covers"] },
  ],
  "income-contingent-loan": [
    { id: "ox1", answer: true, statement: "취업 후 상환 학자금대출의 대학원 생활비 대출에는 소득구간 기준이 있다.", explain: "대학원생 생활비 대출은 학자금 지원구간 6구간 이하여야 하며, 등록금 대출은 소득구간과 관계없어요.", claimIds: ["grad"] },
    { id: "ox2", answer: true, statement: "취업 후 상환 학자금대출의 학부 등록금 대출은 소득구간과 관계없다.", explain: "학부생 등록금 대출은 소득구간 제한이 없지만, 생활비 대출에는 학자금 지원구간 기준이 있어요.", claimIds: ["undergrad"] },
    { id: "ox3", answer: false, statement: "취업 후 상환 학자금대출은 취업하면 원금과 이자를 갚지 않아도 된다.", explain: "취업 등으로 소득이 생긴 때부터 소득 수준에 따라 원금과 이자를 상환하는 대출이에요.", claimIds: ["repay"] },
  ],
  "national-employment-support": [
    { id: "ox1", answer: true, statement: "국민취업지원제도는 두 유형 모두 상담과 취업지원서비스를 제공한다.", explain: "두 유형 모두 심층상담 뒤 직업훈련·일경험·복지 프로그램 연계 같은 서비스를 받아요.", claimIds: ["services"] },
    { id: "ox2", answer: true, statement: "국민취업지원제도는 고용센터나 고용24에서 상시 신청할 수 있다.", explain: "거주지 관할 고용센터를 방문하거나 고용24에서 본인이 신청할 수 있어요.", claimIds: ["apply"] },
    { id: "ox3", answer: false, statement: "국민취업지원제도는 유형과 관계없이 모두 구직촉진수당을 지급한다.", explain: "구직촉진수당은 Ⅰ유형의 지원이에요. Ⅱ유형에는 취업활동계획 수립 참여수당 등 취업활동비용을 지원해요.", claimIds: ["allowance", "services"] },
  ],
  "national-scholarship": [
    { id: "ox1", answer: true, statement: "국가장학금은 재학생뿐 아니라 입학 예정 신입생도 신청할 수 있다.", explain: "입학 예정자를 포함해 재학생·복학생·편입생·재입학생 등 모든 대학생이 신청할 수 있어요.", claimIds: ["who"] },
    { id: "ox2", answer: true, statement: "국가장학금은 한국장학재단 누리집이나 앱에서 신청한다.", explain: "국가장학금 신청은 한국장학재단 누리집과 앱에서 할 수 있어요.", claimIds: ["rounds"] },
    { id: "ox3", answer: false, statement: "국가장학금 Ⅰ유형은 소득구간과 관계없이 모든 대학생에게 등록금 전액을 지원한다.", explain: "기초·차상위 가구 대학생은 등록금 전액을 지원하고, 나머지는 소득구간별로 지원액이 달라요.", claimIds: ["amount"] },
  ],
  "out-of-school-youth": [
    { id: "ox1", answer: true, statement: "꿈드림은 학교 밖 청소년에게 교육과 취업뿐 아니라 생활·의료 지원도 제공한다.", explain: "꿈드림은 상담·교육·직업체험·취업 지원과 생활·의료 같은 자립 지원, 건강증진 프로그램을 제공해요.", claimIds: ["services"] },
    { id: "ox2", answer: true, statement: "학교 밖 청소년 지원 대상에는 자퇴한 청소년도 포함된다.", explain: "대상 연령 안에서 제적·퇴학·자퇴한 청소년과 상급학교에 진학하지 않은 청소년 등이 포함돼요.", claimIds: ["who"] },
    { id: "ox3", answer: false, statement: "학교 밖 청소년의 수능 모의평가 응시료 지원은 일부 금액만 보조한다.", explain: "해당 연령의 학교 밖 청소년에게 지원 한도 안에서 모의평가 응시료를 전액 지원해요.", claimIds: ["mock-exam"] },
  ],
  "pre-startup-package": [
    { id: "ox1", answer: true, statement: "예비창업패키지는 예비창업자에게 사업화 자금과 창업 프로그램을 지원한다.", explain: "중소벤처기업부 소관 사업으로 창업진흥원이 수행하며, 사업화 자금과 창업 프로그램을 지원해요.", claimIds: ["support"] },
    { id: "ox2", answer: true, statement: "예비창업패키지는 신청자 명의의 사업자등록증이 없는 사람을 대상으로 한다.", explain: "신청자 이름의 사업자등록증이 없고 법인의 법률상 대표권도 없는 예비창업자가 신청할 수 있어요.", claimIds: ["who"] },
    { id: "ox3", answer: false, statement: "예비창업패키지는 법인의 법률상 대표권이 있어도 신청할 수 있다.", explain: "신청자 명의의 사업자등록증뿐 아니라 법인의 법률상 대표권도 없어야 신청할 수 있어요.", claimIds: ["who"] },
  ],
  "stem-research-stipend": [
    { id: "ox1", answer: true, statement: "이공계 연구생활장려금은 참여 대학이 추가되며 지원 대상이 확대됐다.", explain: "하반기에 새로 참여한 대학이 더해지면서 참여 대학과 지원 대상 대학원생이 늘었어요.", claimIds: ["scale-2026"] },
    { id: "ox2", answer: true, statement: "이공계 연구생활장려금은 참여 대학에서 연구하는 전일제 대학원생이 대상이다.", explain: "참여 요건을 갖춘 대학에서 연구 활동 중인 이공계 전일제 대학원생을 대상으로 해요.", claimIds: ["who"] },
    { id: "ox3", answer: false, statement: "이공계 연구생활장려금은 기존 R&D 인건비에 기준금액 전액을 무조건 더해 준다.", explain: "별도로 기준금액 전액을 더 주는 돈이 아니에요. 기존 학생지원금과 합쳐 최저 지급액을 보장해요.", claimIds: ["floor"] },
  ],
  "student-startup-teams": [
    { id: "ox1", answer: true, statement: "학생 창업유망팀에는 초·중·고교생과 학교 밖 청소년도 신청할 수 있다.", explain: "전국 초·중·고·대학과 대학원 학생뿐 아니라 학교 밖 청소년도 신청 대상이에요.", claimIds: ["who"] },
    { id: "ox2", answer: true, statement: "학생 창업유망팀은 창업교육과 일대일 멘토링을 지원받는다.", explain: "창업교육·멘토링·네트워킹을 지원하며, 우수팀에는 시드투자 연계와 국제 박람회 참여 기회도 제공해요.", claimIds: ["support"] },
    { id: "ox3", answer: false, statement: "학생 창업유망팀의 시드투자 연계 기회는 선발된 모든 팀에 제공된다.", explain: "창업교육과 멘토링 등을 지원하고, 시드투자 연계와 국제 신기술 박람회 참여 기회는 우수팀에 제공해요.", claimIds: ["support"] },
  ],
  "teen-culture-nuri": [
    { id: "ox1", answer: true, statement: "문화누리카드는 기초생활수급자와 법정 차상위계층을 대상으로 한다.", explain: "대상은 6세 이상 기초생활수급자와 법정 차상위계층이에요.", claimIds: ["target"] },
    { id: "ox2", answer: true, statement: "문화누리카드 지원금은 청소년에게 기본 지원금보다 더 지급되는 연령 구간이 있다.", explain: "13~18세 청소년은 기본 지원금에 추가 금액을 더해 지원받아요.", claimIds: ["amount"] },
    { id: "ox3", answer: false, statement: "문화누리카드는 지난해 발급받았다면 이용 실적과 올해 자격에 상관없이 자동 충전된다.", explain: "지난해 3만 원 이상 사용하고 올해도 자격이 유지돼야 별도 신청 없이 자동 충전돼요.", claimIds: ["recharge"] },
  ],
  "tomorrow-learning-card": [
    { id: "ox1", answer: true, statement: "국민내일배움카드는 고용24나 거주지 관할 고용센터에서 신청할 수 있다.", explain: "고용24를 통한 온라인 신청과 거주지 관할 고용센터 방문 신청이 가능해요.", claimIds: ["apply"] },
    { id: "ox2", answer: true, statement: "국민내일배움카드는 훈련과정과 참여자 조건에 따라 본인 부담이 달라진다.", explain: "직종의 평균 취업률과 근로장려금 수급 여부, 국민취업지원제도 참여 유형 등에 따라 부담이 달라져요.", claimIds: ["copay"] },
    { id: "ox3", answer: false, statement: "국민내일배움카드는 한도를 다 쓰면 누구나 추가 지원을 받는다.", explain: "추가 지원은 기간제·파견·단시간·일용 근로자나 기초생활수급자 등 정해진 대상이 유효기간 안에 받을 수 있어요.", claimIds: ["extra"] },
  ],
  "work-experience": [
    { id: "ox1", answer: true, statement: "미래내일 일경험 사업은 미취업 청년을 대상으로 한다.", explain: "만 15~34세의 미취업 청년이 참여할 수 있는 사업이에요.", claimIds: ["target"] },
    { id: "ox2", answer: true, statement: "미래내일 일경험 사업은 청년일경험포털에서 신청한다.", explain: "미래내일 일경험 사업 참여 신청은 청년일경험포털에서 할 수 있어요.", claimIds: ["portal"] },
    { id: "ox3", answer: false, statement: "미래내일 일경험 사업은 한 해에 한 번만 참여할 수 있다.", explain: "미래내일 일경험 사업은 한 해에도 여러 번 참여할 수 있어요.", claimIds: ["multiple"] },
  ],
  "young-future-savings": [
    { id: "ox1", answer: true, statement: "청년미래적금은 가입자가 넣은 돈에 정부 기여금을 더하는 적금이다.", explain: "정부가 가입자 납입액의 일정 비율을 기여금으로 더하며 일반형과 우대형의 기여율이 달라요.", claimIds: ["match-rate"] },
    { id: "ox2", answer: true, statement: "청년미래적금은 매월 한도 안에서 자유롭게 납입할 수 있다.", explain: "매월 최소 1천 원에서 최대 50만 원까지 자유롭게 넣을 수 있어요.", claimIds: ["deposit"] },
    { id: "ox3", answer: false, statement: "청년미래적금에서 발생한 이자소득에는 세금이 부과된다.", explain: "청년미래적금의 이자소득은 비과세여서 이자소득에 세금을 매기지 않아요.", claimIds: ["tax-free"] },
  ],
  "youth-challenge": [
    { id: "ox1", answer: true, statement: "청년도전지원사업은 구직을 멈춘 청년의 자신감 회복과 구직의욕 향상을 돕는다.", explain: "경제활동 참여와 노동시장 복귀를 돕기 위해 자신감 회복과 구직의욕을 높이는 맞춤형 프로그램을 제공해요.", claimIds: ["purpose"] },
    { id: "ox2", answer: true, statement: "청년도전지원사업은 참여 과정의 길이에 따라 참여수당이 달라진다.", explain: "단기·중기·장기 과정별로 참여 기간과 시간, 참여수당이 다르게 정해져 있어요.", claimIds: ["programs"] },
    { id: "ox3", answer: false, statement: "청년도전지원사업은 구직단념청년 유형으로만 참여할 수 있다.", explain: "자립준비청년과 북한이탈청년 등 다른 대상 유형도 있고, 지자체가 인정한 청년도 참여할 수 있어요.", claimIds: ["other-groups"] },
  ],
  "youth-culture-pass": [
    { id: "ox1", answer: true, statement: "청년문화예술패스는 공연·전시뿐 아니라 영화에도 사용할 수 있다.", explain: "영화에도 사용할 수 있지만, 영화 이용 횟수는 수도권과 비수도권에 각각 제한이 있어요.", claimIds: ["uses"] },
    { id: "ox2", answer: true, statement: "청년문화예술패스는 도서 구매에도 사용할 수 있게 됐다.", explain: "도서 구매에도 쓸 수 있도록 사용처가 확대됐고 추가 발급도 진행됐어요.", claimIds: ["books"] },
    { id: "ox3", answer: false, statement: "청년문화예술패스는 대상 연령이면 지역별 인원 제한 없이 발급된다.", explain: "시도별로 정해진 인원 안에서 신청한 순서대로 발급하는 방식이에요.", claimIds: ["first-come"] },
  ],
  "youth-housing-dream-account": [
    { id: "ox1", answer: true, statement: "청년주택드림청약통장은 무주택자만 가입할 수 있다.", explain: "청년주택드림청약통장에 가입하려면 주택을 소유하지 않은 무주택자여야 해요.", claimIds: ["no-house"] },
    { id: "ox2", answer: true, statement: "청년주택드림청약통장은 소득세 신고·납부 등 소득 증빙을 요구한다.", explain: "연소득 5천만 원 이하의 근로·사업·기타소득자로서 소득세 신고·납부 등이 증빙돼야 해요.", claimIds: ["income"] },
    { id: "ox3", answer: false, statement: "기존 청년우대형청약저축 가입자는 별도로 신청해야 주택드림통장으로 전환된다.", explain: "기존 청년우대형청약저축 가입자는 따로 신청하지 않아도 청년주택드림청약통장으로 자동 전환됐어요.", claimIds: ["auto-switch"] },
  ],
  "youth-jeonse-loan": [
    { id: "ox1", answer: true, statement: "청년전용 버팀목전세자금은 예비 세대주도 대상에 포함한다.", explain: "무주택 세대주뿐 아니라 예비 세대주도 포함하며, 세대원 전원이 무주택이어야 해요.", claimIds: ["target"] },
    { id: "ox2", answer: true, statement: "청년전용 버팀목전세자금은 소득과 보증금 구간에 따라 금리가 다르다.", explain: "변동금리가 적용되며, 소득과 임차보증금 구간에 따라 대출금리가 달라져요.", claimIds: ["rate"] },
    { id: "ox3", answer: false, statement: "청년전용 버팀목전세자금은 갚을 필요가 없는 전세보증금 지원금이다.", explain: "일시상환 또는 혼합상환으로 갚아야 하는 대출이며, 이용기간은 연장할 수 있어요.", claimIds: ["term"] },
  ],
  "youth-job-leap": [
    { id: "ox1", answer: true, statement: "청년일자리도약장려금은 수도권과 비수도권 기업 모두에 기업 지원을 제공한다.", explain: "청년을 채용한 5인 이상 우선지원대상기업이면 수도권과 비수도권 모두 기업 지원 대상이에요.", claimIds: ["company-support"] },
    { id: "ox2", answer: true, statement: "청년일자리도약장려금의 청년 근속 인센티브는 지역에 따라 최대 금액이 다르다.", explain: "일반 비수도권·우대지원지역·특별지원지역별 최대 금액이 다르고, 근속 시점에 따라 나눠 받아요.", claimIds: ["youth-tiers"] },
    { id: "ox3", answer: false, statement: "청년일자리도약장려금은 수도권 취업 청년에게도 근속 인센티브를 준다.", explain: "청년 근속 인센티브는 비수도권 유형에만 있고 수도권 유형은 기업 지원만 해요.", claimIds: ["capital-no-youth"] },
  ],
  "youth-monthly-rent": [
    { id: "ox1", answer: true, statement: "청년월세 지원은 부모와 따로 사는 무주택 청년을 대상으로 한다.", explain: "부모와 별도로 거주하는 19~34세의 무주택 청년이 대상이에요.", claimIds: ["target"] },
    { id: "ox2", answer: true, statement: "청년월세 지원은 실제로 내는 월세를 한도 안에서 생애 한 번 지원한다.", explain: "실제 월세 가운데 정해진 월별 금액과 기간 한도 안에서 지원하며 생애 한 번만 받을 수 있어요.", claimIds: ["amount"] },
    { id: "ox3", answer: false, statement: "청년월세 지원은 월세뿐 아니라 임차보증금과 관리비도 지원한다.", explain: "청년월세 지원에서는 임차보증금과 관리비 등을 지원하지 않아요.", claimIds: ["excluded"] },
  ],
  "youth-startup-academy": [
    { id: "ox1", answer: true, statement: "청년창업사관학교는 사업화 자금과 함께 창업공간·교육·코칭을 지원한다.", explain: "사업화 자금뿐 아니라 창업공간·교육·코칭·기술지원 같은 창업 프로그램을 제공해요.", claimIds: ["support"] },
    { id: "ox2", answer: true, statement: "청년창업사관학교는 K-Startup 누리집에서 온라인으로 신청한다.", explain: "중소벤처기업부 소관이며 중소벤처기업진흥공단이 수행하고, K-Startup 누리집에서 신청해요.", claimIds: ["operator"] },
    { id: "ox3", answer: false, statement: "청년창업사관학교는 창업 경험이 있는 대표자도 창업 3년 이내여야만 신청할 수 있다.", explain: "일반 대상은 창업 3년 이내 대표자지만, 경험창업자는 39세 이하이며 창업 7년 이내인 대표자까지 신청할 수 있어요.", claimIds: ["who"] },
  ],
  "youth-startup-tax-relief": [
    { id: "ox1", answer: true, statement: "청년창업중소기업 세액감면은 처음 소득이 생긴 과세연도부터 적용된다.", explain: "창업 후 처음 소득이 생긴 과세연도부터 정해진 기간 동안 법인세나 소득세를 감면해요.", claimIds: ["period"] },
    { id: "ox2", answer: true, statement: "청년창업중소기업의 대표자 나이 등 구체적인 요건은 대통령령으로 정한다.", explain: "어떤 기업이 청년창업중소기업인지 판단하는 대표자 나이 등의 요건은 대통령령으로 정해요.", claimIds: ["youth-rule"] },
    { id: "ox3", answer: false, statement: "청년창업중소기업 세액감면은 창업 시점이 달라도 같은 감면 규정을 적용한다.", explain: "새로운 창업 시점부터는 그 이전에 창업한 경우와 다른 감면 규정이 따로 적용돼요.", claimIds: ["rate-2026"] },
  ],
  "youth-tomorrow-savings": [
    { id: "ox1", answer: true, statement: "청년내일저축계좌는 저소득 가구의 일하는 청년을 대상으로 한다.", explain: "기준 중위소득 50% 이하 가구에 속하면서 일하고 있는 청년이 대상이에요.", claimIds: ["target"] },
    { id: "ox2", answer: true, statement: "청년내일저축계좌 지원금을 받으려면 금융교육과 자금사용계획서 제출이 필요하다.", explain: "저축 기간 동안 일을 계속하고 금융교육을 이수하며 자금사용계획서를 내야 해요.", claimIds: ["conditions"] },
    { id: "ox3", answer: false, statement: "청년내일저축계좌는 실직이나 질병이 생겨도 적립을 잠시 멈출 수 없다.", explain: "실직·질병 등의 사정으로 적립을 멈출 수 있어요. 적립 중지 가능 기간도 기존보다 늘었어요.", claimIds: ["pause"] },
  ],
};
