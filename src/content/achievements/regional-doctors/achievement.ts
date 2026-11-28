import { achievementSchema, type AchievementInput } from "@/content/schema";

/**
 * 지역의사제·비대면진료 법제화 — 지역에서 일할 의사를 기르고, 비대면진료를 법에 담았다.
 *
 * ★ 2026-11-28 작성. 초안은 Codex(GPT)가 실시간 검색으로 1차 자료(법령·정책브리핑·부처 보도자료)와 보도를 모아 썼고,
 *   에이전트가 출처 페이지를 직접 받아 인용문이 그대로 있는지, claim의 숫자가 그 출처에 있는지 대조한 뒤 내용을 읽어 고쳤다
 *   (docs/gov-achievements-p1-review.md).
 * ★ 계획·추진과 시행·완료를 구분했다. 부처의 계획·평가와 비판은 CLAIM(주장한 쪽)으로 적었다.
 */
const raw: AchievementInput = {
  id: "regional-doctors",
  slug: "regional-doctors",
  title: "지역의사제·비대면진료 법제화",
  subtitle: "지역에서 일할 의사를 기르고, 비대면진료를 법에 담았다",
  lifeQuestion: "지역의사제와 비대면진료 제도화로 지역에서 진료받는 여건은 무엇이 달라지나?",
  kicker: "주요 정책",
  categories: ["region", "welfare", "institution"],
  summary: "지역의사법과 비대면진료 제도화를 위한 의료법 개정안은 2025년 12월 2일 국회를 통과하고 12월 23일 공포됐다. 지역의사법은 2026년 2월 24일 시행됐으며, 학비 지원과 면허 취득 후 10년 의무복무를 결합한 복무형과 기존 전문의가 지역 근무 계약을 맺는 계약형을 규정한다. 2027학년도 첫 지역의사선발전형의 모집 규모는 32개 대학·의학전문대학원 490명으로 안내됐으며, 비대면진료 개정법은 2026년 12월 24일 시행 예정이다. 의료계에서는 기본권 제한과 복무 후 이탈을 우려하고 있으며, 보건복지부도 공중보건의사 감소에 따른 당분간의 지역의료 어려움을 전망했다.",
  type: "policy",
  publishStatus: "published",
  sourceNote: "2026년 11월 28일 기준 국가법령정보센터의 공포·시행 정보와 현행 계약기간 조문, 보건복지부·교육부의 제도·모집 안내, 정부 브리핑, 연합뉴스·MBC의 반대 의견 보도에 근거한다. 490명은 첫 모집 규모이며 최종 등록·졸업·면허 취득·지역 배치 인원이 아니다. 비대면진료 개정법의 시행일은 아직 도래하지 않았고, 2026년 10월 입법예고된 세부기준의 최종 확정 내용은 이번 조사에서 확인하지 못했다. 지역의사제에 따른 의료 공백 감소, 의무복무 후 정착률, 비대면진료 제도화 이후의 안전성과 접근성 개선 실적도 확인되지 않았다. 2025년 9월 의협의 위헌 소지 주장은 당시 발의안에 대한 의견으로, 공포 법률에 대한 사법적 판단을 뜻하지 않는다.",
  headlineKeyNumberId: "rd-kn-service",
  keyNumbers: [
    {"id": "rd-kn-service", "label": "복무형 의무복무", "value": "10", "unit": "년", "caption": "의사면허 취득 후 선발 당시 공고된 지역에서 복무", "claimId": "rd-service"},
    {"id": "rd-kn-selection", "label": "2027학년도 첫 모집 규모", "value": "490", "unit": "명", "caption": "32개 의과대학·의학전문대학원, 최종 배치 실적과 구분", "claimId": "rd-selection"},
    {"id": "rd-kn-public-doctors", "label": "2026년 의과 공보의 규모", "value": "593", "unit": "명", "caption": "2026년 3월 정부 브리핑 기준, 2025년 945명", "claimId": "rd-gap"},
  ],
  timeline: [
    {"id": "rd-t-passage", "date": "2025-12-02", "datePrecision": "day", "title": "두 법률안 국회 통과", "summary": "지역의사법 제정안과 비대면진료 제도화를 위한 의료법 개정안이 본회의를 통과했다.", "claimIds": ["rd-passage"]},
    {"id": "rd-t-promulgation", "date": "2025-12-23", "datePrecision": "day", "title": "지역의사법·개정 의료법 공포", "summary": "지역의사법은 법률 제21239호, 개정 의료법은 법률 제21238호로 공포됐다.", "claimIds": ["rd-enforcement", "rd-telemedicine-date"]},
    {"id": "rd-t-regional-start", "date": "2026-02-24", "datePrecision": "day", "title": "지역의사법 시행", "summary": "복무형·계약형 지역의사의 양성·지원에 관한 법률이 시행됐다.", "claimIds": ["rd-enforcement"]},
    {"id": "rd-t-gap", "date": "2026-03-13", "datePrecision": "day", "title": "공보의 감소 대응 방안 발표", "summary": "정부는 의과 공보의가 945명에서 593명으로 감소했다고 밝히고 순회진료·비대면진료 등 대응 계획을 제시했다.", "claimIds": ["rd-gap", "rd-gap-response"]},
    {"id": "rd-t-selection", "date": "2026-09-03", "datePrecision": "day", "title": "2027학년도 첫 모집 안내", "summary": "복지부·교육부는 총 490명 모집을 안내했다. 차 의과학대는 8월 원서접수를 마쳤고, 나머지 31개 대학은 9월 7일부터 수시모집을 진행하는 일정이다.", "claimIds": ["rd-selection"]},
    {"id": "rd-t-rules", "date": "2026-10-19", "datePrecision": "day", "title": "비대면진료 세부기준 입법예고", "summary": "복지부는 초진의 지역 제한·처방일수 등 시행규칙 개정안을 입법예고했다. 확정·시행된 기준과 구분해야 한다.", "claimIds": ["rd-telemedicine-rules"]},
    {"id": "rd-t-telemedicine-start", "date": "2026-12-24", "displayDate": "2026.12.24 시행 예정", "datePrecision": "day", "title": "비대면진료 개정법 시행 예정", "summary": "2026년 11월 28일 기준 아직 시행 전인 법정 시행일이다.", "claimIds": ["rd-telemedicine-date"]},
  ],
  counterpoints: [
    {"id": "rd-cp-rights", "question": "10년 의무복무는 직업 선택과 거주 이전의 자유를 제한하지 않나?", "response": "대한의사협회는 2025년 9월 당시 발의안에 대해 기본권 제한과 위헌 소지를 주장했다. 실제 제도는 학비를 지원하는 대신 의사면허에 지역 복무 조건을 붙이고 위반 시 면허 제재가 가능하도록 한다. 의협의 주장은 반대 의견이며, 이번 자료에서 공포 법률에 대한 위헌 결정은 확인되지 않았다.", "claimIds": ["rd-rights-criticism", "rd-service"]},
    {"id": "rd-cp-retention", "question": "의무기간이 끝나면 떠나고, 지금의 의료 공백은 그대로 남는 것 아닌가?", "response": "의료계 일부는 복무 후 이탈과 교육 격차를 우려한다. 첫 전형은 2027학년도 입학생을 뽑는 단계이고, 정부도 당분간 지역의료의 어려움이 지속될 것으로 전망하면서 순회진료·계약형 지역필수의사제 시범사업 활용 등을 제시했다. 기존 전문의를 대상으로 하는 계약형의 법적 근거도 마련됐지만, 장기 정착과 공백 해소 효과는 아직 확인되지 않았다.", "claimIds": ["rd-retention-criticism", "rd-selection", "rd-contract", "rd-gap-response"]},
    {"id": "rd-cp-telemedicine", "question": "비대면진료만 늘리면 지역에서 대면진료를 받을 수 있는 문제가 해결되나?", "response": "개정법은 비대면진료를 대면진료의 보완적 수단으로 두고 재진·의원급 중심 구조와 중개매체 관리 근거를 마련했다. 복지부는 공보의 감소 대응에서도 순회진료와 비대면진료 등을 함께 추진하겠다고 밝혔다. 개정법 시행 전인 만큼 지역의 대면진료 공백을 얼마나 줄일지와 제도화 이후 안전성은 아직 확인되지 않았다.", "claimIds": ["rd-telemedicine-design", "rd-telemedicine-date", "rd-gap-response"]},
  ],
  claims: [
    { id: "rd-passage", text: "「지역의사의 양성 및 지원 등에 관한 법률」 제정안과 비대면진료 제도화를 위한 「의료법」 개정안은 2025년 12월 2일 국회 본회의를 통과했다.", assertionType: "FACT", sourceIds: ["src-rd-regional-outline", "src-rd-telemedicine-outline"], verified: true },
    { id: "rd-enforcement", text: "지역의사법은 2025년 12월 23일 법률 제21239호로 공포됐고 2026년 2월 24일 시행됐다.", assertionType: "FACT", sourceIds: ["src-rd-law"], verified: true },
    { id: "rd-service", text: "지역의사선발전형으로 선발된 학생은 등록금·교재비·실습비·기숙사비 등 학비 지원 대상이며, 의사면허 취득 후 선발 당시 공고된 의무복무지역에서 10년간 복무하도록 한다. 면허에 지역 복무 조건을 붙이며, 위반 시 법령에 따라 시정명령·면허자격 정지·면허취소 등의 조치가 가능하다.", assertionType: "FACT", sourceIds: ["src-rd-selection"], verified: true },
    { id: "rd-contract", text: "계약형 지역의사는 기존 전문의가 특정 지역에서 근무하기로 국가·지자체 및 의료기관과 계약을 체결하는 유형이다. 현행 시행령은 공고하는 계약기간을 5년 이상 7년 이하로 정하고, 지역 의료 수요·자원 등을 고려해 지자체장과 선정 의료기관장이 협의하면 전체 10년을 넘지 않는 범위에서 연장할 수 있도록 한다.", assertionType: "FACT", sourceIds: ["src-rd-regional-outline", "src-rd-contract"], verified: true },
    { id: "rd-selection", text: "보건복지부·교육부는 2027학년도 첫 지역의사선발전형에서 서울을 제외한 32개 의과대학·의학전문대학원 총 490명을 선발한다고 안내했다. 2026년 9월 3일 발표에 따르면 차 의과학대학교 의학전문대학원은 8월 4~6일 원서접수를 진행했고, 나머지 31개 대학은 9월 7일부터 시작되는 수시모집을 통해 선발하는 일정이다. 이는 모집 규모·일정 안내이며 최종 등록이나 지역 배치 실적을 뜻하지 않는다.", assertionType: "CLAIM", assertedBy: "보건복지부·교육부", sourceIds: ["src-rd-selection"], verified: true },
    { id: "rd-telemedicine-date", text: "비대면진료 제도화를 담은 개정 의료법은 2025년 12월 23일 법률 제21238호로 공포됐고, 공포 후 1년이 지난 2026년 12월 24일 시행 예정이다. 2026년 11월 28일 기준 해당 개정법의 시행 전이다.", assertionType: "FACT", sourceIds: ["src-rd-medical-law", "src-rd-telemedicine-outline"], verified: true },
    { id: "rd-telemedicine-design", text: "개정 의료법은 비대면진료를 대면진료의 보완적 수단으로 두고 재진환자·의원급 의료기관 중심으로 운영하며, 초진에는 지역·처방 범위를 제한하는 구조를 마련했다. 비대면진료 중개매체의 신고·인증, 개인정보 보호와 공적 지원시스템·전자처방전 전달시스템의 법적 근거도 포함한다.", assertionType: "FACT", sourceIds: ["src-rd-telemedicine-outline"], verified: true },
    { id: "rd-telemedicine-rules", text: "보건복지부는 2026년 10월 19일부터 11월 9일까지 비대면진료 관련 시행규칙 등의 개정안을 입법예고했다. 발표안은 일반 비대면진료의 대면진료 이력을 6개월 이내 동일 증상으로 정하고, 초진은 원칙적으로 환자 주소지와 같은 시·도 내 의료기관에서 실시하며 처방일수를 원칙적으로 7일 이내로 제한하는 내용이다. 이는 입법예고안으로, 최종 확정·시행된 기준이라는 의미는 아니다.", assertionType: "CLAIM", assertedBy: "보건복지부", sourceIds: ["src-rd-rules"], verified: true },
    { id: "rd-gap", text: "보건복지부의 2026년 3월 13일 브리핑에 따르면 전체 의과 공중보건의사 규모는 2025년 945명에서 2026년 593명으로 줄었다.", assertionType: "FACT", sourceIds: ["src-rd-gap"], verified: true },
    { id: "rd-gap-response", text: "보건복지부는 2030년대 초반까지 공보의 규모가 약 300~500명대를 유지하고 당분간 지역의료의 어려움이 지속될 것으로 전망했다. 대응책으로 취약지 우선 배치, 순회진료·비대면진료와 원격협진 활성화, 계약형 지역필수의사제 시범사업 등 기존 지원사업 활용을 추진하겠다고 밝혔다.", assertionType: "CLAIM", assertedBy: "보건복지부", sourceIds: ["src-rd-gap"], verified: true },
    { id: "rd-rights-criticism", text: "대한의사협회는 2025년 9월 당시 발의된 필수의료 특별법안의 지역·공공의사 제도에 반대하며, 10년 의무복무가 직업 선택·거주 이전의 자유를 침해할 소지가 있다고 주장했다. 의무복무보다 자발적으로 필수·지역의료를 담당할 환경을 만드는 것이 필요하다는 입장도 밝혔다.", assertionType: "CLAIM", assertedBy: "대한의사협회", sourceIds: ["src-rd-rights"], verified: true },
    { id: "rd-retention-criticism", text: "2025년 12월 MBC 보도에 따르면 의료계 일부는 지역의사제에서 충분한 임상 경험 확보가 어렵고 선발 방식 차이에 따른 교육 격차·사회적 낙인이 생길 수 있다고 우려했다. 의무복무가 끝나면 지역을 떠나는 구조가 반복될 수 있다는 주장도 제기됐다.", assertionType: "CLAIM", assertedBy: "MBC가 보도한 의료계 일부", sourceIds: ["src-rd-retention"], verified: true },
  ],
  sources: [
    { id: "src-rd-law", title: "지역의사의 양성 및 지원 등에 관한 법률", url: "https://www.law.go.kr/lsInfoP.do?lsId=014995", publisher: "국가법령정보센터", publishedAt: "2025-12-23", type: "legislative", license: "public", quote: "[시행 2026. 2. 24.] [법률 제21239호, 2025. 12. 23., 제정]" },
    { id: "src-rd-medical-law", title: "의료법 일부개정법률 제21238호", url: "https://www.law.go.kr/LSW/lsInfoP.do?lsiSeq=280431&viewCls=lsRvsDocInfoR", publisher: "국가법령정보센터", publishedAt: "2025-12-23", type: "legislative", license: "public", quote: "[시행 2026. 12. 24.] [법률 제21238호, 2025. 12. 23., 일부개정]" },
    { id: "src-rd-regional-outline", title: "'지역의사제' 법률안 국회 통과…의료 불균형 해소 기대", url: "https://m.korea.kr/news/policyNewsView.do?newsId=148955787", publisher: "보건복지부·대한민국 정책브리핑", publishedAt: "2025-12-03", type: "official", license: "public", quote: "계약형은 기존 전문의 중 특정 지역에서 일정 기간(5~10년) 종사하기로 국가·지자체 및 의료기관과 계약을 체결한 의사다." },
    { id: "src-rd-selection", title: "2027학년도 지역의사 첫 선발, 지원자격부터 의무복무까지 궁금증 한눈에", url: "https://m.korea.kr/briefing/pressReleaseView.do?newsId=156779969&pWise=mSub&pWiseSub=C1", publisher: "보건복지부·교육부·대한민국 정책브리핑", publishedAt: "2026-09-03", type: "official", license: "public", quote: "2027학년도에는 서울을 제외한 32개 의과대학·의학전문대학원에서 총 490명의 지역의사를 처음 선발한다." },
    { id: "src-rd-contract", title: "지역의사법 시행령 제9조 계약형 지역의사의 계약기간", url: "https://www.law.go.kr/lsLinkCommonInfo.do?chrClsCd=010202&lspttninfSeq=198659", publisher: "국가법령정보센터", publishedAt: "2026-09-04", type: "legislative", license: "public", quote: "제9조(계약형 지역의사의 계약기간) ① 법 제10조제2항 후단에 따라 의료기관의 장이 공고하는 계약형 지역의사의 계약기간은 5년 이상 7년 이하의 범위에서 정한다." },
    { id: "src-rd-telemedicine-outline", title: "'비대면진료 제도화' 15년 만에 확정…의료법 개정안 통과", url: "https://www.korea.kr/news/policyNewsView.do?newsId=148955797", publisher: "보건복지부·대한민국 정책브리핑", publishedAt: "2025-12-03", type: "official", license: "public", quote: "개정안은 비대면진료가 대면진료의 보완적 수단임을 명시하고, 재진환자 중심으로 실시하도록 규정했다. 초진 등 대면 기록이 없는 경우에는 지역과 처방 범위를 제한해 안전성을 확보했다." },
    { id: "src-rd-rules", title: "비대면진료 실시·처방기준 구체화하여 입법예고 6개월 내 같은 증상은 같은 의료기관에서 비대면진료", url: "https://m.korea.kr/briefing/pressReleaseView.do?newsId=156785554&pWise=mMain&pWiseMain=L4", publisher: "보건복지부·대한민국 정책브리핑", publishedAt: "2026-10-19", type: "official", license: "public", quote: "초진 비대면진료의 의약품 처방일수는 원칙적으로 7일 이내로 제한한다." },
    { id: "src-rd-gap", title: "공중보건의사 감소 대비 지역의료대책 관련 브리핑", url: "https://www.korea.kr/briefing/policyBriefingView.do?newsId=156748859", publisher: "보건복지부·대한민국 정책브리핑", publishedAt: "2026-03-13", type: "official", license: "public", quote: "전체 의과 공보의 규모는 지난해 945명에서 올해 593명으로 37%가 감소하였습니다." },
    { id: "src-rd-rights", title: "의협, 지역의사·공공의대 법안에 반대 의견 제출…\"위헌 소지\"", url: "https://www.yna.co.kr/amp/view/AKR20250918117900530", publisher: "연합뉴스", publishedAt: "2025-09-18", type: "press", license: "quotable", quote: "10년간의 의무 복무는 헌법상 직업 선택의 자유·거주 이전의 자유를 침해할 소지가 크므로 위헌 소지가 있다" },
    { id: "src-rd-retention", title: "'10년 근무' 지역의사제 통과됐지만‥의협 반대", url: "https://imnews.imbc.com/replay/2025/nwtoday/article/6785170_36807.html", publisher: "MBC", publishedAt: "2025-12-15", type: "press", license: "quotable", quote: "또, 지역에 정착하기보다는 '의무기간이 끝나는 즉시 떠나는 구조'가 반복될 수 있다고 주장합니다." },
  ],
};

export const regionalDoctors = achievementSchema.parse(raw);
