import {
  milestoneSchema,
  claimSchema,
  type Claim,
  type MilestoneCollection,
  type MilestoneInput,
} from "@/content/schema";
import {
  EX_RESTAREA_2026,
  FTC_UNIFORM_2026,
  HK_RAIL_2026,
  INSIGHT_STAY_2026,
  KHAN_REMICON_2026,
  KYEONGGI_UNIFORM_2026,
  MT_FLOUR_2026,
  MT_LTV_2026,
  NEWSIS_REFINERY_2026,
  NEWSIS_SUGAR_2026,
  NOCUT_LOCAL_2026,
  NOCUT_REFINERY_FTC_2026,
  SEGYE_REPEAT_2026,
  TF_KTB_2026,
  YNA_LOCAL_2026,
  FTC_BIDDING_2026,
  FTC_H2_2026,
  KOREA_MED_QUOTA_2026,
  LAW_REGIONAL_DOCTOR_2025,
  MOHW_REGIONAL_PICK_2026,
  MSIT_QOS_2026,
} from "@/content/sources";

/**
 * 카르텔 성과 카드 — 2026년.
 *
 * ★ 아홉 중 `done`은 하나뿐이다. 그게 이 자료의 실제 모습이다.
 *   지역의사법만 이미 효력이 있다 — 2026년 2월 24일 시행됐다. 나머지 여덟은
 *   공정위의 셋이 법과 고시를 고치겠다는 **계획**이고(하나는 2027년 1월 시행
 *   예정), 의대 증원은 2027학년도부터 일어날 **의결**이며, 통신 둘은 부처와
 *   사업자의 **합의**, 휴게소 하나는 여덟 곳에서 도는 **시범**, 지역의사 첫
 *   선발은 아직 **진행 중**이다. 수가 크다고 성과 칸으로 올리면 이 레이어가
 *   지켜 온 것이 무너진다 — 3대 메가프로젝트에서 지킨 선과 같다.
 *
 * ★ 절감액은 추산이지 측정값이 아니다.
 *   717만 명·3,221억 원은 통신 3사의 추산이고, 휴게소 값이 내렸는지는
 *   아무도 아직 재지 않았다. 카드의 highlight에 "추산"을 적어 둔다.
 *
 * ★ 증원을 성과로 적지 않는다.
 *   3,342명은 5년에 걸쳐 일어날 일이고 2026년 9월 현재 늘어난 정원은 없다.
 *   490명도 선발이 끝나지 않았다. 제도가 섰다는 것과 사람이 갔다는 것은
 *   다른 일이며, 후자는 10년 복무가 끝나는 2040년대에야 말할 수 있다.
 *
 * ★ 2026년 10월 31일 보강 — 제재 처분과 수사가 더해졌다.
 *   설탕·밀가루·LTV·레미콘·교복은 공정위가 **처분을 내린** 것이라 완료로 센다.
 *   다만 처분은 소송에서 뒤집힐 수 있고, 설탕·밀가루는 일부 업체가 이미
 *   집행정지를 받았다. 그 사실을 카드에 함께 적는다. 정유사 기소와 국고채·
 *   정유사 심의는 결론이 나지 않았으므로 추진 중이다. 토착비리 2차 단속은
 *   2026년 11월 1일 시작이라 이 글을 쓰는 날(10월 31일)에는 아직 계획이다.
 *
 * ★ 1차 자료가 아닌 것이 섞여 있다.
 *   공정위 업무계획과 도로공사 발표의 원문을 찾지 못해 보도로 대신했다.
 *   의료 쪽은 법률 원문과 정책브리핑이 있고 첫 선발만 보도다.
 *   근거 서랍이 1차 자료와 보도를 갈라 보이므로 화면에서 그 차이가 드러난다.
 */

const claim = (id: string, text: string, source: string | string[]): Claim =>
  claimSchema.parse({
    id,
    text,
    assertionType: "FACT",
    sourceIds: Array.isArray(source) ? source : [source],
    verified: true,
  });

const claims: Claim[] = [
  claim(
    "ct-sugar",
    "공정거래위원회는 2026년 2월 12일 CJ제일제당·삼양사·대한제당 등 설탕 제조·판매 3사가 2021년 2월부터 2025년 4월까지 8차례에 걸쳐 설탕 가격의 변경 폭과 시기를 합의했다며, 법 위반행위 금지명령과 가격변경 현황 보고명령 등 시정명령과 함께 과징금 총 4,083억 원을 부과한다고 밝혔다.",
    NEWSIS_SUGAR_2026.id,
  ),
  claim(
    "ct-flour",
    "공정거래위원회는 2026년 5월 20일 대한제분·CJ제일제당·사조동아원·삼양사 등 제분사 7곳이 2019년 11월부터 2025년 10월까지 약 6년간 밀가루 가격을 담합했다며 과징금 6,710억 4,500만 원을 부과했다. 담합 사건 사상 최대 규모이며, 담합 이전 경쟁 수준으로 가격을 다시 정하도록 하는 가격 재결정 명령도 함께 내렸다. 같은 제분사들은 2006년에도 담합으로 제재를 받은 바 있다.",
    MT_FLOUR_2026.id,
  ),
  claim(
    "ct-cartel-stay",
    "설탕·밀가루 담합 과징금 일부는 법원에서 집행이 멈췄다. 2026년 9월 서울고등법원 등은 삼양사·사조동아원·대한제분의 밀가루 담합 과징금 집행정지 신청을 인용했고, 삼양사와 대한제당의 설탕 담합 과징금도 집행이 정지됐다. 집행정지는 임시 조치이며 처분이 적법한지는 본안 소송에서 가려진다.",
    INSIGHT_STAY_2026.id,
  ),
  claim(
    "ct-ftc-repeat-bill",
    "더불어민주당과 공정거래위원회는 2026년 9월 28일 당정협의회에서 반복담합 근절 입법 추진방안을 내놓았다. 17개 업종에서 5년 안에 두 번 이상 담합한 사업자에게 등록취소나 영업정지를 할 수 있게 하고, 가격 재결정 명령의 법적 근거를 마련하며, 담합 처분시효를 12년에서 최장 15년으로 늘리는 내용이다. 법안 제출 시점은 밝히지 않았다.",
    SEGYE_REPEAT_2026.id,
  ),
  claim(
    "ct-local-first",
    "경찰청 국가수사본부는 2026년 3월부터 10월까지 1차 토착비리 특별단속을 벌여 785건, 2,288명을 단속하고 이 가운데 지방공직자 등 1,094명을 송치했다. 31명을 구속했고 범죄수익 약 40억 원을 기소 전 몰수·추징 보전했다. 유형별로는 재정비리가 1,114명으로 가장 많았고 권한남용 968명, 수의계약 불법행위 149명 순이었다. 신분별로는 공무원이 1,015명(44%)이었다.",
    [NOCUT_LOCAL_2026.id, YNA_LOCAL_2026.id],
  ),
  claim(
    "ct-local-second",
    "경찰청 국가수사본부는 2026년 11월 1일부터 ‘지역 유착 5대 비리 특별단속’을 시작한다고 밝혔다. 단속 대상을 지방의회·지방자치단체·지방공기업 중심에서 법조·군·경찰·교정·세무·소방·교육 등 지역 공직사회 전반으로 넓히고, 직무비리·금품수수·알선비리·수의계약·재정비리·인사비리·조합비리를 단속한다.",
    [YNA_LOCAL_2026.id, NOCUT_LOCAL_2026.id],
  ),
  claim(
    "ct-refinery-indict",
    "서울중앙지검 공정거래조사부는 2026년 7월 6일 HD현대오일뱅크·SK에너지·GS칼텍스·에쓰오일 등 정유사 4곳과 일부 임직원을 공정거래법 위반 등의 혐의로 기소했다. 미국과 이란 사이 전쟁 발발 직후 국내 석유제품 가격을 담합해 유가를 교란한 혐의이며, 가격 담합 혐의는 HD현대오일뱅크와 SK에너지에 적용됐다. 정유업계는 과도한 기소라는 입장이다.",
    NEWSIS_REFINERY_2026.id,
  ),
  claim(
    "ct-refinery-ftc",
    "공정거래위원회 사무처는 2026년 10월 7일 SK에너지와 HD현대오일뱅크가 2022년 2월부터 2026년 3월까지 휘발유·경유·등유 판매가격 정보를 교환하고 가격을 담합한 혐의에 대한 심사보고서를 위원회에 제출해 심의 절차를 시작했다고 밝혔다. 관련 매출액은 약 44조 1천억 원이며, 심사관은 시정조치와 과징금을 부과해야 한다는 의견을 냈다.",
    NOCUT_REFINERY_FTC_2026.id,
  ),
  claim(
    "ct-bank-ltv",
    "공정거래위원회는 2026년 1월 21일 KB국민·신한·하나·우리 등 4대 시중은행이 부동산 담보대출의 담보인정비율(LTV) 정보를 교환해 경쟁을 제한했다며 과징금 총 2,720억 원을 부과하기로 결정했다고 밝혔다. 경쟁제한적 정보교환을 금지하는 개정 공정거래법이 시행된 2021년 12월 이후의 행위를 제재 대상으로 삼았다.",
    MT_LTV_2026.id,
  ),
  claim(
    "ct-ktb-bid",
    "공정거래위원회는 2026년 8월 6일 국고채 입찰 담합 사건의 심사보고서를 위원회에 제출하고 증권사 10곳과 은행 5곳 등 15개 국고채 전문딜러에게 송부했다고 밝혔다. 담합 혐의 대상 입찰 규모는 약 76조 2천억 원이며, 최종 판단은 전원회의 심의를 거쳐 내려진다.",
    TF_KTB_2026.id,
  ),
  claim(
    "ct-rail-revolving",
    "국토교통부는 2026년 6월 29일 철도 전관 카르텔 근절 태스크포스 점검회의를 열었다. 국가철도공단은 퇴직자 관련 수의계약 금지 기간을 2년에서 3년으로 늘리고 종합심사제 내부위원 비율을 50%에서 30%로 줄였으며, 코레일은 4월 15일 재취업 업체에 감점을 주도록 계약업무처리 기준을 고쳐 6월 1일 발주에 적용했다. 에스알의 퇴직자 근무 자진신고 QR은 8월 시범 운영 예정이고, 철도기술연구원의 AI 이해충돌 모니터링 시스템은 11월까지 구축할 계획이다.",
    HK_RAIL_2026.id,
  ),
  claim(
    "ct-uniform",
    "공정거래위원회는 2026년 10월 13일 용인 기흥·처인과 울산, 경북 영천의 19개 중·고교가 발주한 교복 구매 입찰 51건에서 담합한 업체 10곳에 시정명령과 함께 과징금 총 1억 200만 원을 부과한다고 밝혔다. 낙찰률은 예정가격의 평균 98.29%에 달했다. 공정위는 2010년 이후 교복 입찰 담합을 모두 52건 제재했다.",
    [FTC_UNIFORM_2026.id, KYEONGGI_UNIFORM_2026.id],
  ),
  claim(
    "ct-remicon",
    "공정거래위원회는 2026년 2월 2일 광양 지역 레미콘 제조·판매업체 7곳이 2021년 5월부터 2023년 9월까지 레미콘 판매가격을 공동으로 결정하고 물량을 나눠 가진 행위에 시정명령과 과징금 22억 3,900만 원을 부과했다고 밝혔다. 이 기간 1㎥당 가격은 7만 2,400원에서 9만 1,200원으로 올랐다. 공정위는 건설 원·부자재 등 중간재 품목의 담합 감시를 강화하겠다고 밝혔다.",
    KHAN_REMICON_2026.id,
  ),
  claim(
    "ct-ftc-repeat",
    "공정거래위원회는 2026년 8월 4일 발표한 2026년 하반기 주요 업무 추진계획에서, 반복적으로 담합한 사업자에게 등록 취소나 일정 기간 영업정지 처분을 내릴 수 있는 근거를 마련하겠다고 밝혔다. 법 개정이 필요한 사항으로 아직 시행되지 않았다.",
    FTC_H2_2026.id,
  ),
  claim(
    "ct-ftc-structural",
    "공정거래위원회는 같은 계획에서 시장지배적 지위 남용이나 중대한 담합에 대해 지분 매각과 영업 양도 등 구조적 조치를 적용할 수 있도록 제도를 정비하겠다고 밝혔다. 구조적 조치는 예외적인 상황에서만 보충적으로 쓰겠다고 함께 밝혔다.",
    FTC_H2_2026.id,
  ),
  claim(
    "ct-ftc-bidding",
    "공정거래위원회는 입찰참가자격 제한 요청 기준을 바꾸는 고시 개정안을 행정예고했다. 벌점 산정 기간을 최근 5년에서 10년으로 늘리고, 요청 기준을 누계 5점 초과에서 4점 이상으로 낮추며, 대상을 입찰담합에서 모든 유형의 담합으로 넓히는 내용이다. 의견 제출 기한은 2026년 10월 12일이고 시행 예정일은 2027년 1월 1일이다.",
    FTC_BIDDING_2026.id,
  ),
  claim(
    "ct-telecom-qos",
    "과학기술정보통신부와 이동통신 3사는 2026년 4월 모든 데이터 요금제에 데이터 안심옵션(QoS)을 도입하기로 합의했다. 월 제공 데이터를 다 쓴 뒤에도 400Kbps로 데이터를 계속 쓸 수 있게 하는 것이며, 상반기에 개편을 마무리하기로 했다. 통신 3사 추산으로 약 717만 명이 연 3,221억 원을 절감할 것으로 예상된다.",
    MSIT_QOS_2026.id,
  ),
  claim(
    "ct-telecom-senior",
    "같은 개편에서 65세 이상 이용자에게 음성·문자를 무제한으로 제공하기로 했다. 약 140만 명이 연 590억 원을 절감할 것으로 추산된다. QoS 도입과 합치면 약 850만 명, 연 3,800억 원이다.",
    MSIT_QOS_2026.id,
  ),
  claim(
    "ct-restarea-direct",
    "한국도로공사는 고속도로 휴게소의 다단계 임대 구조를 줄이려고 공사가 입점매장과 직접 계약하는 방식을 여덟 곳에서 시범 운영한다. 여주(인천 방향)·대천(양방향)·군위(부산 방향)·장유(부산 방향)가 운영 중이고 합천호(양방향)·월출산(통합)이 개장을 준비하고 있다. 수수료 부담이 줄어 음식 판매가격이 낮아질 것으로 기대한다고 밝혔다.",
    EX_RESTAREA_2026.id,
  ),
  claim(
    "ct-medical-law",
    "「지역의사의 양성 및 지원 등에 관한 법률」이 법률 제21239호로 2025년 12월 23일 공포돼 2026년 2월 24일 시행됐다. 복무형 지역의사로 선발되면 학비·교재비·기숙사비 등을 지원받는 대신, 의사면허를 취득한 뒤 선발 당시 공고된 의무복무지역에서 10년간 일해야 한다.",
    [LAW_REGIONAL_DOCTOR_2025.id, MOHW_REGIONAL_PICK_2026.id],
  ),
  claim(
    "ct-medical-quota",
    "보건복지부는 2026년 2월 10일 제7차 보건의료정책심의위원회에서 2027학년도부터 2031학년도까지 의과대학 정원을 연평균 668명씩 5년간 모두 3,342명 늘리기로 의결했다. 2027학년도 이후 증원 인력 중 2024학년도 정원 3,058명을 초과하는 인원은 모두 지역의사로 선발한다. 의결이 끝났을 뿐 증원은 2027학년도부터 단계적으로 일어난다.",
    KOREA_MED_QUOTA_2026.id,
  ),
  claim(
    "ct-medical-first",
    "2027학년도에 서울을 제외한 32개 의과대학·의학전문대학원에서 지역의사 490명을 처음 선발한다. 진료권 단위 359명, 광역권 단위 131명이다. 차의과학대학교 의학전문대학원은 2026년 8월 4~6일에 원서를 받았고, 나머지 31개 대학은 9월 7일 시작된 수시모집으로 받았다.",
    MOHW_REGIONAL_PICK_2026.id,
  ),
];

const raw: MilestoneInput[] = [
  {
    id: "ct-sugar",
    title: "설탕 담합 3사 과징금 4,083억 원",
    summary:
      "공정위가 CJ제일제당·삼양사·대한제당에 시정명령과 과징금을 부과했다. 삼양사와 대한제당은 법원에서 과징금 집행정지를 받았고, 처분이 적법한지는 본안 소송에서 가려진다.",
    categories: ["economy"],
    audiences: ["소비자", "식품업체"],
    status: "done",
    date: "2026-02-12",
    datePrecision: "day",
    claimIds: ["ct-sugar", "ct-cartel-stay"],
    highlight: { value: "4,083억 원", label: "설탕 3사 과징금" },
  },
  {
    id: "ct-flour",
    title: "밀가루 담합 7개사 과징금 6,710억 원·가격 재결정 명령",
    summary:
      "담합 사건 사상 최대 과징금이고, 담합 전 수준으로 값을 다시 정하라는 명령도 함께 내렸다. 같은 제분사들의 두 번째 적발이다. 일부 업체는 법원에서 집행정지를 받았다.",
    categories: ["economy"],
    audiences: ["소비자", "식품업체"],
    status: "done",
    date: "2026-05-20",
    datePrecision: "day",
    claimIds: ["ct-flour", "ct-cartel-stay"],
    highlight: { value: "6,710억 원", label: "제분 7개사 과징금 (역대 최대)" },
  },
  {
    id: "ct-ftc-repeat",
    title: "반복 담합에 등록취소·영업정지 — 당정 입법 추진",
    summary:
      "8월 공정위 업무계획에 들어간 뒤, 9월 28일 당정이 17개 업종에서 5년 안에 두 번 담합하면 등록취소·영업정지를 할 수 있게 하는 입법 방안을 냈다. 법을 고쳐야 하는 일이라 아직 시행되지 않았다.",
    categories: ["economy"],
    audiences: ["담합 사업자"],
    status: "ongoing",
    date: "2026-09-28",
    datePrecision: "day",
    claimIds: ["ct-ftc-repeat-bill", "ct-ftc-repeat"],
  },
  {
    id: "ct-ftc-structural",
    title: "중대 담합에 지분매각·영업양도 등 구조적 조치",
    summary:
      "과징금 대신 회사의 구조 자체를 바꾸게 하는 조치를 쓸 수 있게 제도를 정비하겠다는 계획이다. 예외적인 상황에서만 보충적으로 쓰겠다고 함께 밝혔다.",
    categories: ["economy"],
    audiences: ["시장지배적 사업자"],
    status: "planned",
    date: "2026-08-04",
    datePrecision: "day",
    claimIds: ["ct-ftc-structural"],
  },
  {
    id: "ct-ftc-bidding",
    title: "담합 두 번이면 공공입찰 제한",
    summary:
      "벌점 산정 기간을 5년에서 10년으로 늘리고 기준을 낮추며, 입찰담합만이 아니라 모든 담합을 대상으로 넓힌다. 행정예고 단계이고 시행 예정일은 2027년 1월 1일이다.",
    categories: ["economy"],
    audiences: ["공공입찰 참여 기업"],
    status: "planned",
    date: "2026-09-21",
    datePrecision: "day",
    claimIds: ["ct-ftc-bidding"],
    highlight: { value: "10년", label: "벌점 산정 기간 (현행 5년)" },
  },
  {
    id: "ct-telecom-qos",
    title: "모든 데이터 요금제에 QoS 도입 합의",
    summary:
      "월 데이터를 다 써도 400Kbps로 계속 쓸 수 있게 한다. 부처와 사업자의 합의이고 상반기 중 마무리하기로 했다. 아래 금액은 통신 3사의 추산이지 측정값이 아니다.",
    categories: ["economy"],
    audiences: ["이동통신 이용자"],
    status: "ongoing",
    date: "2026-04-09",
    datePrecision: "day",
    claimIds: ["ct-telecom-qos"],
    highlight: { value: "연 3,221억 원", label: "717만 명 절감 추산" },
  },
  {
    id: "ct-telecom-senior",
    title: "65세 이상 음성·문자 무제한",
    summary:
      "같은 개편에 들어 있다. 금액은 추산이다.",
    categories: ["economy", "welfare"],
    audiences: ["65세 이상 이용자"],
    status: "ongoing",
    date: "2026-04-09",
    datePrecision: "day",
    claimIds: ["ct-telecom-senior"],
    highlight: { value: "연 590억 원", label: "140만 명 절감 추산" },
  },
  {
    id: "ct-local-first",
    title: "1차 토착비리 특별단속 — 1,094명 송치",
    summary:
      "경찰이 8개월 동안 지방행정기관 중심으로 단속해 마무리했다. 송치는 경찰 수사가 끝났다는 뜻이지 유죄가 확정됐다는 뜻이 아니다.",
    categories: ["region"],
    audiences: ["지역 주민"],
    status: "done",
    date: "2026-10-28",
    datePrecision: "day",
    claimIds: ["ct-local-first"],
    highlight: { value: "1,094명", label: "송치 (구속 31명)" },
  },
  {
    id: "ct-local-second",
    title: "지역 유착 5대 비리 특별단속 — 지역 공직사회 전반으로",
    summary:
      "2차 단속이다. 대상을 법조·군·경찰·교정·세무·소방·교육으로 넓히고 인사비리와 재건축·재개발 조합비리를 더한다. 2026년 11월 1일 시작한다.",
    categories: ["region"],
    audiences: ["지역 주민"],
    status: "planned",
    date: "2026-11-01",
    datePrecision: "day",
    claimIds: ["ct-local-second"],
  },
  {
    id: "ct-refinery-indict",
    title: "검찰, 정유 4사 기소 — 전쟁 직후 유가 담합 혐의",
    summary:
      "기소까지 왔고 판결은 나오지 않았다. 정유업계는 혐의를 받아들이지 않고 있다.",
    categories: ["economy"],
    audiences: ["운전자", "주유소"],
    status: "ongoing",
    date: "2026-07-06",
    datePrecision: "day",
    claimIds: ["ct-refinery-indict"],
  },
  {
    id: "ct-refinery-ftc",
    title: "공정위, 정유사 2곳 기름값 담합 심의 시작",
    summary:
      "심사관이 과징금 부과 의견을 낸 단계다. 위원회가 결론을 내리지 않았다.",
    categories: ["economy"],
    audiences: ["운전자", "주유소"],
    status: "ongoing",
    date: "2026-10-07",
    datePrecision: "day",
    claimIds: ["ct-refinery-ftc"],
    highlight: { value: "약 44조 원", label: "관련 매출액" },
  },
  {
    id: "ct-bank-ltv",
    title: "4대 은행 LTV 정보교환 담합 과징금 2,720억 원",
    summary:
      "대출 조건을 정하는 정보를 은행끼리 주고받아 경쟁을 줄였다고 본 처분이다. 은행들은 처분에 반발하며 법적 대응을 예고했다.",
    categories: ["economy"],
    audiences: ["대출 이용자"],
    status: "done",
    date: "2026-01-21",
    datePrecision: "day",
    claimIds: ["ct-bank-ltv"],
    highlight: { value: "2,720억 원", label: "4대 은행 과징금" },
  },
  {
    id: "ct-ktb-bid",
    title: "국고채 입찰 담합 — 15개 전문딜러 제재 절차",
    summary:
      "심사보고서를 보낸 단계이고 전원회의 결론은 아직이다.",
    categories: ["economy"],
    audiences: ["국가 재정"],
    status: "ongoing",
    date: "2026-08-06",
    datePrecision: "day",
    claimIds: ["ct-ktb-bid"],
    highlight: { value: "약 76조 원", label: "혐의 대상 입찰 규모" },
  },
  {
    id: "ct-rail-revolving",
    title: "철도 기관 전관 차단 — 퇴직자 수의계약 금지 3년으로",
    summary:
      "국가철도공단과 코레일은 계약 기준을 이미 고쳤고, 에스알과 철도기술연구원의 조치는 시범·구축 중이다. 기관마다 진행 정도가 달라 묶어서 추진 중으로 센다.",
    categories: ["economy"],
    audiences: ["철도 발주 기관"],
    status: "ongoing",
    date: "2026-06-29",
    datePrecision: "day",
    claimIds: ["ct-rail-revolving"],
    highlight: { value: "2년 → 3년", label: "퇴직자 관련 수의계약 금지 기간" },
  },
  {
    id: "ct-uniform",
    title: "3개 지역 교복 입찰 담합 제재",
    summary:
      "세 지역 중·고교 열아홉 곳의 교복 구매 입찰이다. 금액은 작지만 학부모가 내는 값과 바로 이어진다.",
    categories: ["education", "economy"],
    audiences: ["학부모", "중·고등학생"],
    status: "done",
    date: "2026-10-13",
    datePrecision: "day",
    claimIds: ["ct-uniform"],
    highlight: { value: "98.29%", label: "담합 입찰의 평균 낙찰률" },
  },
  {
    id: "ct-remicon",
    title: "광양 레미콘 7개사 가격·물량 담합 제재",
    summary:
      "건설 현장에 들어가는 레미콘 값을 함께 정하고 물량을 나눈 일이다. 한 지역 사건이며, 건설사 자체의 입찰담합 제재는 아니다.",
    categories: ["economy"],
    audiences: ["건설 현장"],
    status: "done",
    date: "2026-02-02",
    datePrecision: "day",
    claimIds: ["ct-remicon"],
    highlight: { value: "22억 원", label: "과징금" },
  },
  {
    id: "ct-restarea-direct",
    title: "휴게소 여덟 곳 공사 직계약 시범",
    summary:
      "도로공사가 입점매장과 직접 계약해 중간 단계를 줄인다. 값이 실제로 내렸는지는 아직 재지 않았다.",
    categories: ["economy"],
    audiences: ["고속도로 이용자", "휴게소 입점매장"],
    status: "ongoing",
    date: "2026-09-21",
    datePrecision: "day",
    claimIds: ["ct-restarea-direct"],
    highlight: { value: "8곳", label: "시범 운영 휴게소" },
  },
  {
    id: "ct-medical-law",
    title: "지역의사법 시행 — 10년 의무복무",
    summary:
      "지역의사를 따로 뽑아 학비를 대신 내 주고, 면허를 딴 뒤 정해진 지역에서 10년을 일하게 하는 법이다. 2025년 12월 23일 공포돼 2026년 2월 24일부터 시행 중이다. 이 묶음에서 유일하게 이미 효력이 있는 항목이다.",
    categories: ["health", "region"],
    audiences: ["비수도권 주민", "의대 지원자"],
    status: "done",
    date: "2026-02-24",
    datePrecision: "day",
    claimIds: ["ct-medical-law"],
    highlight: { value: "10년", label: "복무형 지역의사 의무복무" },
  },
  {
    id: "ct-medical-quota",
    title: "의대 증원분 전원을 지역의사로",
    summary:
      "보건의료정책심의위원회가 2027~2031학년도에 의대 정원을 5년간 3,342명 늘리고, 2024학년도 정원 3,058명을 넘는 인원은 모두 지역의사로 뽑기로 의결했다. 의결이 끝났을 뿐 증원 자체는 2027학년도부터 단계적으로 일어난다.",
    categories: ["health", "region"],
    audiences: ["비수도권 주민", "의대 지원자"],
    status: "planned",
    date: "2026-02-10",
    datePrecision: "day",
    claimIds: ["ct-medical-quota"],
    highlight: { value: "3,342명", label: "5년간 증원 계획 (연평균 668명)" },
  },
  {
    id: "ct-medical-first",
    title: "2027학년도 지역의사 490명 첫 선발",
    summary:
      "서울을 뺀 32개 의대·의전원이 처음으로 지역의사를 뽑는다. 31개 대학이 9월 7일 수시모집으로 원서를 받았다. 선발이 아직 끝나지 않았고, 이들이 실제로 지역에 남는지는 10년 복무가 끝나는 2040년대에야 알 수 있다.",
    categories: ["health", "region"],
    audiences: ["비수도권 주민", "의대 지원자"],
    status: "ongoing",
    date: "2026-09-07",
    datePrecision: "day",
    claimIds: ["ct-medical-first"],
    highlight: { value: "490명", label: "진료권 359명 · 광역권 131명" },
  },
];

export const cartel2026: MilestoneCollection = {
  milestones: raw.map((item) => milestoneSchema.parse(item)),
  claims,
  sources: [
    NEWSIS_SUGAR_2026,
    MT_FLOUR_2026,
    INSIGHT_STAY_2026,
    SEGYE_REPEAT_2026,
    NOCUT_LOCAL_2026,
    YNA_LOCAL_2026,
    NEWSIS_REFINERY_2026,
    NOCUT_REFINERY_FTC_2026,
    MT_LTV_2026,
    TF_KTB_2026,
    HK_RAIL_2026,
    FTC_UNIFORM_2026,
    KYEONGGI_UNIFORM_2026,
    KHAN_REMICON_2026,
    FTC_H2_2026,
    FTC_BIDDING_2026,
    MSIT_QOS_2026,
    EX_RESTAREA_2026,
    LAW_REGIONAL_DOCTOR_2025,
    KOREA_MED_QUOTA_2026,
    MOHW_REGIONAL_PICK_2026,
  ],
};
