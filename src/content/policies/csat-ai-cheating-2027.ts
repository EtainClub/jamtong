import type { PolicyInput } from "./schema";

/**
 * 2027학년도 수능 AI 부정행위 대책 (2026년 11월).
 *
 * 11월 15일 세무사 시험 수석 합격자의 AI 부정행위 자백 뒤, 대통령이 17일 필리핀 순방 중 화상으로 수능 비상
 * 점검회의를 열고 X에 대책을 올렸다. 그 게시물 답글의 주장들(잼통 Voice #301·#302·#303·#306·#307·#308·
 * #310·#312)에 대응하는 사실을 적는다.
 *
 * ★ 포상금은 대통령 지시(건당 1억원 이상·최소 1억원)와 정부 발표(최대 1억원)가 다르다. 둘 다 적는다.
 * ★ AI 기업 기록 제출 의무화 법률은 11월 22일까지 만들어지지 않았다. '지시'이지 '시행'이 아니다.
 * ★ 장관 발언과 사퇴는 policy:choi-kyo-jin-resignation, 수능 개편 논의는 policy:csat-reform-debate-2026,
 *   세무사·국가자격·공공기관 시험은 policy:national-exam-ai-cheating, 스마트안경 반입 금지는
 *   policy:csat-smart-glasses에 있다.
 * ★ 2026-11-22 처음 등록 — 잼통 Voice 이슈 #301~#303·#306~#308·#310·#312.
 */
export const CSAT_AI_CHEATING_2027: PolicyInput = {
  slug: "csat-ai-cheating-2027",
  title: "2027학년도 수능 AI 부정행위 대책",
  scope:
    "2026년 11월 17일 대통령 지시와 정부 대책 — 신고 포상금, 시험 중 재난문자, AI 기업 기록 확보, 필기구 제한, " +
    "수능 연기 여부, 응시 제한과 형사처벌 근거, 피해 수험생 구제, 그리고 각 대책에 대한 비판",
  ministries: ["국무총리실", "교육부", "한국교육과정평가원", "과학기술정보통신부", "행정안전부", "국민권익위원회"],
  categories: ["institution"],
  asOf: "2026-11-22",
  rumors: [
    {
      id: "rumor-delay",
      text: "부정행위 대책이 처벌 위주의 사후 대응뿐이니 수능을 연기하고 사전 대비를 제대로 갖춘 뒤 치러야 한다",
      claimIds: ["claim-no-delay", "claim-delay-reason", "claim-prevent", "claim-items"],
    },
    {
      id: "rumor-alert",
      text: "시험 중 재난문자 발송은 다른 수험생의 집중을 깨고, 스피커를 떼거나 설정을 바꾸면 효과도 없다",
      claimIds: ["claim-alert-order", "claim-alert-plan", "claim-alert-critique"],
    },
    {
      id: "rumor-reward-abuse",
      text: "건당 1억 원 신고 포상제는 함정·무고 신고로 억울한 수험생을 만들고, 수험생끼리 서로 감시하게 만든다",
      claimIds: ["claim-reward-order", "claim-reward-gov", "claim-reward-min", "claim-reward-critique"],
    },
    {
      id: "rumor-ai-records",
      text: "AI 회사에서 시험 시간 이용 기록을 받는 방안은 해외 업체 협조가 불확실하고 사생활 침해 우려가 있다",
      claimIds: ["claim-ai-order", "claim-ai-msit", "claim-ai-limit"],
    },
    {
      id: "rumor-items",
      text: "부정행위 대책으로 샤프심·수정테이프 같은 개인 물품까지 갑자기 못 쓰게 하는 것은 성실한 수험생에게 불공정하다",
      claimIds: ["claim-items", "claim-items-critique"],
    },
    {
      id: "rumor-relief",
      text: "부정행위자 때문에 등급·합격에서 밀려난 수험생을 추가 합격 처리하는 등 피해 구제 방안을 마련해야 한다",
      claimIds: ["claim-sanction", "claim-relief"],
    },
    {
      id: "rumor-criminal",
      text: "AI에 답을 물은 행위를 공무집행방해죄로 처벌한다는 설명은 법리에 맞지 않고, 보통은 업무방해죄가 거론된다",
      claimIds: ["claim-criminal", "claim-criminal-law", "claim-prosecution"],
    },
    {
      id: "rumor-tone",
      text: "'전시라는 각오', '도둑질', '인생 망치지 마시고' 같은 표현은 공적 지시문으로서 위협적이고 조롱하는 어조다",
      claimIds: ["claim-wording", "claim-sns-critique"],
    },
  ],
  claims: [
    {
      id: "claim-trigger",
      text:
        "11월 15일 제63회 세무사 시험 수석 합격자가 초소형 카메라로 문제를 찍어 생성형 AI로 답을 받았다고 자백했다. " +
        "수능(11월 19일)을 나흘 앞두고 AI 부정행위 대책이 급히 쟁점이 됐다.",
      assertionType: "FACT",
      sourceIds: ["src-aitimes-217426"],
      verified: true,
    },
    {
      id: "claim-wording",
      text:
        "대통령은 11월 17일 필리핀 순방 중 화상으로 수능 비상 점검회의를 주재하고 X에 대책을 올렸다. 글에는 \"전시라는 각오로 " +
        "국가역량을 총동원해\", 시험 부정은 \"성적을 훔치는 도둑질이나 마찬가지\", \"공연히 요행을 노리다가 인생 망치지 마시고, " +
        "본인이나 모두를 위해 포기하기 바란다\"는 표현이 들어 있다. 마지막 문장은 부정행위를 하려는 사람에게 한 말이다.",
      assertionType: "FACT",
      sourceIds: ["src-heraldcorp-10940524"],
      verified: true,
    },
    {
      id: "claim-sns-critique",
      text:
        "경향신문은 시험 전날 밤 대통령이 확정되지 않은 대책을 SNS로 먼저 내놓아 혼란을 키웠고, 그 부담은 현장 감독관이 진다고 " +
        "보도했다. 한 교사는 \"현장 제지로 시험실 분위기가 흔들렸을 때 모든 책임이 감독관한테 돌아간다는 두려움이 있다\"고 했다.",
      assertionType: "FACT",
      sourceIds: ["src-khan-202611181705001"],
      verified: true,
    },
    {
      id: "claim-reward-order",
      text:
        "대통령은 첨단장비를 쓴 입시부정을 신고하면 한 건에 1억원 이상(부정 인원수만큼 가산)을 주고, 공범을 신고하면 신고자의 " +
        "처벌·제재를 줄여 주는 제도를 검토하라고 지시했다.",
      assertionType: "FACT",
      sourceIds: ["src-heraldcorp-10940524"],
      verified: true,
    },
    {
      id: "claim-reward-gov",
      text:
        "정부는 11월 18일 신고·제보한 사안이 \"부정행위로 확인될 경우 최대 1억원의 포상금 지급을 추진\"하고, 관련 규정을 신속히 " +
        "마련해 이번 수능부터 적용하겠다고 발표했다. 신고만으로 주는 것이 아니라 부정행위로 확인되어야 지급한다.",
      assertionType: "FACT",
      sourceIds: ["src-khan-202611182212001"],
      verified: true,
    },
    {
      id: "claim-reward-min",
      text:
        "대통령은 11월 21일 X에서 포상금은 '최대'가 아니라 부정행위 1건당 '최소 1억원'이고 원칙적으로 부정행위자 수만큼 " +
        "가산한다고 정정했다. 자수하면서 공범을 신고하면 처벌을 줄이고 포상금도 준다고 했다. 실제 지급 기준과 방식은 아직 " +
        "확정되지 않았다.",
      assertionType: "FACT",
      sourceIds: ["src-heraldcorp-10944716"],
      verified: true,
    },
    {
      id: "claim-reward-critique",
      text:
        "1억원 포상금이 수험생끼리 서로 감시하게 만든다는 비판이 나왔다. 허위·함정 신고를 어떻게 걸러낼지에 대한 규정은 " +
        "11월 22일까지 공개되지 않았다.",
      assertionType: "FACT",
      sourceIds: ["src-hankookilbo-a2026111815570003915", "src-heraldcorp-10944716"],
      verified: true,
    },
    {
      id: "claim-alert-order",
      text:
        "대통령은 최고등급 재난문자를 시험 직전뿐 아니라 \"시험 중에도 수시로\" 보내는 방안과, 부정행위 확인으로 방해받은 시간만큼 " +
        "시험을 연장하는 방안을 검토하라고 지시했다. 숨긴 휴대전화를 울려 찾아내려는 것이다.",
      assertionType: "FACT",
      sourceIds: ["src-heraldcorp-10940524"],
      verified: true,
    },
    {
      id: "claim-alert-plan",
      text:
        "교육부·행정안전부는 수능 당일 8시 30분 무렵 위급재난문자를 보내고, 시험 중에도 한 번 이상 불시에 보내기로 했다. " +
        "위급재난문자는 켜져 있는 휴대전화에서 최대 음량으로 10.5초 동안 울린다.",
      assertionType: "FACT",
      sourceIds: ["src-hankookilbo-a2026111815570003915", "src-khan-202611182129015"],
      verified: true,
    },
    {
      id: "claim-alert-critique",
      text:
        "수험생 커뮤니티에는 \"일단 한번 큰소리가 울리기 시작하면 주의력이 깨져 그 반 전체의 시험이 망할 수 있다\"는 글이 올라왔다. " +
        "전교조 대변인은 \"수능은 10~20초 차이로도 점수가 갈리는 시험\"이라며 시간 연장으로 피해가 메워지지 않는다고 했다. " +
        "교사들은 고사장마다 연장 시간이 달라지면 형평성 논란이 생긴다고 우려했다.",
      assertionType: "FACT",
      sourceIds: ["src-hankookilbo-a2026111815570003915", "src-khan-202611181705001"],
      verified: true,
    },
    {
      id: "claim-ai-order",
      text:
        "대통령은 AI 기업들이 시험 시간 중 문제지를 찍어 질문한 이용 사례를 제공하기로 했다고 밝히고, 정부가 요청하면 불법적인 " +
        "시험문제 답안 요구 사례를 기업이 의무적으로 제출하도록 하는 법률을 만들라고 지시했다.",
      assertionType: "FACT",
      sourceIds: ["src-heraldcorp-10940524"],
      verified: true,
    },
    {
      id: "claim-ai-msit",
      text:
        "과학기술정보통신부는 11월 17일 글로벌 AI 기업들이 시험 중 이미지 업로드·문제풀이 기록 확인에 협조하기로 했다고 밝혔다. " +
        "방법을 묻자 \"법적인 문제도 있고 민간사업자와의 관계에서 존중해야 할 부분도 있다\"며 구체적으로 설명하지 않았다.",
      assertionType: "CLAIM",
      assertedBy: "과학기술정보통신부",
      sourceIds: ["src-etoday-2651151", "src-khan-202611182129015"],
      verified: true,
    },
    {
      id: "claim-ai-limit",
      text:
        "대통령이 지시한 기록 제출 의무화 법률은 아직 만들어지지 않았다. 해외 기업에서 계정 정보처럼 개인정보가 담긴 자료를 받으려면 " +
        "법률에 따른 절차가 필요하고, 다른 사람 계정으로 질문했을 수 있어 기록만으로 부정행위자를 특정하기 어렵다는 지적이 있다.",
      assertionType: "FACT",
      sourceIds: ["src-etoday-2651151"],
      verified: true,
    },
    {
      id: "claim-items",
      text:
        "교육부는 11월 18일 개인이 가져갈 수 있는 필기구를 흑색 연필로 제한하고, 컴퓨터용 사인펜·수정테이프·지우개·샤프심은 " +
        "시험장에서 나눠 주기로 했다. 필기구로 위장한 초소형 촬영·통신기기를 막기 위한 조치라고 설명했다. 옷 단추에는 스티커를 " +
        "붙이고, 매 교시 안경을 확인한다.",
      assertionType: "FACT",
      sourceIds: ["src-korea-kr-148975981"],
      verified: true,
    },
    {
      id: "claim-items-critique",
      text: "필기구 기준이 시험 하루 전에 바뀌어 수험생 혼란을 키웠다는 지적이 나왔다.",
      assertionType: "FACT",
      sourceIds: ["src-khan-202611182129015"],
      verified: true,
    },
    {
      id: "claim-no-delay",
      text:
        "수험생 커뮤니티와 일부 강사 사이에서 연기 요구가 이어졌지만, 교육부는 11월 16일 수능을 예정대로 19일에 치른다고 밝혔다. " +
        "최교진 장관은 국회에서 \"지금 수능 기간을 연기하는 것은 더 큰 혼란이 있을 수 있기 때문에 검토하기 어렵다\"고 했다.",
      assertionType: "FACT",
      sourceIds: ["src-kyeonggi-20261116580222", "src-sisajournal-394354"],
      verified: true,
    },
    {
      id: "claim-delay-reason",
      text:
        "최은옥 차관은 17일 \"수능 연기를 전혀 검토하지 않은 건 아니다. 논의를 했다\"며, 출제위원이 이미 격리돼 있고 시험지 " +
        "보안 문제가 있으며, 연기해도 \"1~2주가 최대치\"여서 그 사이 대책을 더하는 효과보다 수험생 혼란과 대입 일정 차질이 " +
        "더 크다고 판단했다고 설명했다.",
      assertionType: "CLAIM",
      assertedBy: "교육부",
      sourceIds: ["src-sisajournal-394354"],
      verified: true,
    },
    {
      id: "claim-prevent",
      text:
        "국무총리는 17일 담화에서 시험 전 대책으로 감독 인력 약 8,400명(스마트기기 전담 약 1,800명, 복도 감독 약 6,600명) 추가 " +
        "배치, 1교시 전 전자기기 전원을 끈 채 수거, 가방 복도 보관, 매 교시 안경 확인, 3교시 전 재확인을 내놓았다.",
      assertionType: "FACT",
      sourceIds: ["src-fnnews-202611171547048889"],
      verified: true,
    },
    {
      id: "claim-sanction",
      text:
        "같은 담화에서 부정행위자의 수능 응시 제한을 1년에서 10년으로 늘려 올해 수능부터 적용하도록 국회와 협의하겠다고 했다. " +
        "부정행위로 입학한 신입생은 입학을 취소하고, 대학에 다니며 다시 응시한 학생은 제적한다. 10년 제한은 법 개정이 필요하다.",
      assertionType: "FACT",
      sourceIds: ["src-fnnews-202611171547048889", "src-khan-202611182212001"],
      verified: true,
    },
    {
      id: "claim-criminal",
      text:
        "정부는 수능 부정행위를 형법의 위계에 의한 공무집행방해죄로 수사 의뢰하겠다고 밝혔다. 국가가 시행하는 시험은 " +
        "위계공무집행방해, 민간 기관의 업무를 방해한 경우는 업무방해가 적용되는 구조다.",
      assertionType: "FACT",
      sourceIds: ["src-fnnews-202611171547048889", "src-fnnews-202611191824252493"],
      verified: true,
    },
    {
      id: "claim-criminal-law",
      text:
        "두 죄 모두 최고 징역 5년이다. 벌금은 위계공무집행방해가 1천만원 이하, 업무방해가 1천500만원 이하다. 두 죄에는 별도의 " +
        "미수범 처벌 규정이 없어, 시험 도중 적발돼 결과에 이르지 못한 경우를 처벌할 수 있느냐가 쟁점이다.",
      assertionType: "FACT",
      sourceIds: ["src-segye-20261120512146", "src-fnnews-202611191824252493"],
      verified: true,
    },
    {
      id: "claim-prosecution",
      text:
        "공소청은 11월 17일 생성형 AI·스마트기기 부정행위는 시험 종료 전 적발 여부나 재범 여부와 관계없이 원칙적으로 정식재판에 " +
        "넘기라고 일선에 지시했다. 조직적 사건은 구속영장 청구와 징역형 구형도 검토한다.",
      assertionType: "FACT",
      sourceIds: ["src-fnnews-202611191824252493"],
      verified: true,
    },
    {
      id: "claim-detected",
      text:
        "교육부는 수능 당일 전자기기 관련 부정행위를 111건으로 집계했다. 적발된 수험생이 실제로 AI를 이용했는지는 확인되지 않았다.",
      assertionType: "FACT",
      sourceIds: ["src-etoday-2651151"],
      verified: true,
    },
    {
      id: "claim-relief",
      text:
        "부정행위가 나중에 적발될 때 성적을 다시 산출할지, 대입에서 불이익을 받은 수험생을 어떻게 구제할지는 정해지지 않았다. " +
        "평가원 관계자는 \"아직 교육부로부터 추가 지침을 전달받은 바 없다\"고 했다. 정부 대책은 부정행위자 제재에 맞춰져 있다.",
      assertionType: "FACT",
      sourceIds: ["src-khan-202611182129015"],
      verified: true,
    },
  ],
  critiqueIds: [
    "claim-sns-critique",
    "claim-reward-critique",
    "claim-alert-critique",
    "claim-ai-limit",
    "claim-items-critique",
    "claim-relief",
  ],
  timeline: [
    {
      id: "t-confession",
      date: "2026-11-15",
      datePrecision: "day",
      title: "세무사 수석 합격자 AI 부정행위 자백",
      summary: "수능 나흘 전.",
      claimIds: ["claim-trigger"],
    },
    {
      id: "t-no-delay",
      date: "2026-11-16",
      datePrecision: "day",
      title: "교육부 \"수능 연기 없다\"",
      summary: "19일 예정대로.",
      claimIds: ["claim-no-delay"],
    },
    {
      id: "t-order",
      date: "2026-11-17",
      datePrecision: "day",
      title: "대통령 비상 점검회의·X 지시, 총리 담화",
      summary: "포상금, 재난문자, AI 기록, 응시 제한 10년.",
      claimIds: ["claim-wording", "claim-reward-order", "claim-alert-order", "claim-ai-order", "claim-prevent", "claim-sanction"],
    },
    {
      id: "t-gov-plan",
      date: "2026-11-18",
      datePrecision: "day",
      title: "정부 포상금·재난문자·필기구 대책",
      summary: "최대 1억원, 시험 중 불시 문자, 흑색 연필만.",
      claimIds: ["claim-reward-gov", "claim-alert-plan", "claim-items"],
    },
    {
      id: "t-exam",
      date: "2026-11-19",
      datePrecision: "day",
      title: "2027학년도 수능",
      summary: "전자기기 부정행위 111건.",
      claimIds: ["claim-detected"],
    },
    {
      id: "t-reward-min",
      date: "2026-11-21",
      datePrecision: "day",
      title: "대통령 \"최소 1억원\" 정정",
      summary: "인원수만큼 가산.",
      claimIds: ["claim-reward-min"],
    },
  ],
  gaps: [
    "포상금 지급 규정(허위·함정 신고 처리, 재원, 지급 시점)은 11월 22일까지 공개되지 않았다.",
    "시험 중 재난문자가 실제로 몇 번, 언제 울렸는지와 그로 인한 시간 연장 사례는 확인하지 못했다. 휴대전화를 무음으로 두거나 스피커를 훼손했을 때 위급재난문자가 울리는지에 대한 공식 설명도 찾지 못했다.",
    "귀마개 반입 규정이 바뀌었다는 답글 주장은 확인하지 못했다. 정책브리핑은 필기구 변경만 적고 있다.",
    "AI 기업 기록 제출 의무화 법안과 국회에 발의된 'AI 커닝' 처벌 법안의 내용은 법안 원문으로 확인하지 못했다.",
    "111건 가운데 형사 고발·수사 의뢰가 몇 건인지, 사후 적발 결과는 아직 나오지 않았다.",
  ],
  sources: [
    {
      id: "src-aitimes-217426",
      title: "세무사 시험 수석 합격자 \"생성 AI로 부정행위\" 자백",
      publisher: "AI타임스",
      url: "https://www.aitimes.com/news/articleView.html?idxno=217426",
      publishedAt: "2026-11-15",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-heraldcorp-10940524",
      title: "李대통령, AI 활용 입시부정에 '전시 수준 대응' 지시…1억원 포상제 도입 검토",
      publisher: "헤럴드경제",
      url: "https://biz.heraldcorp.com/article/10940524",
      publishedAt: "2026-11-18",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-heraldcorp-10944716",
      title: "李대통령 \"수능 부정행위 포상금 최소 1억…행위자 수만큼 가산\"",
      publisher: "헤럴드경제",
      url: "https://biz.heraldcorp.com/article/10944716",
      publishedAt: "2026-11-21",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-khan-202611181705001",
      title: "수능 코앞인데 SNS에 대책 쏟아낸 대통령…혼란은 현장 몫",
      publisher: "경향신문",
      url: "https://www.khan.co.kr/article/202611181705001",
      publishedAt: "2026-11-18",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-khan-202611182212001",
      title: "\"부정행위 신고하면 최대 1억원\" 정부, 이번 수능부터 포상금 지급 추진",
      publisher: "경향신문",
      url: "https://www.khan.co.kr/article/202611182212001",
      publishedAt: "2026-11-18",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-khan-202611182129015",
      title: "시험 중 불시 재난문자, 최대음량 10.5초 경보음…정부, 수능 전날까지 '추가 대책'",
      publisher: "경향신문",
      url: "https://www.khan.co.kr/article/202611182129015",
      publishedAt: "2026-11-18",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-hankookilbo-a2026111815570003915",
      title: "\"울리면 2~3분 더 준다고?\"… 수능 하루 전 '재난문자 대책'에 수험생·교사 불안",
      publisher: "한국일보",
      url: "https://www.hankookilbo.com/news/article/A2026111815570003915",
      publishedAt: "2026-11-18",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-etoday-2651151",
      title: "수능 끝나도 AI 부정행위 추적 계속⋯해외 빅테크와 공조 [AI커닝 후폭풍]",
      publisher: "이투데이",
      url: "https://www.etoday.co.kr/news/view/2651151",
      publishedAt: "2026-11-21",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-korea-kr-148975981",
      title: "수능 필기구 '흑색연필'만 허용…사인펜·수정테이프·지우개·샤프심 시험장 지급",
      publisher: "대한민국 정책브리핑(교육부)",
      url: "https://www.korea.kr/news/policyNewsView.do?newsId=148975981",
      publishedAt: "2026-11-18",
      type: "official",
      license: "link-only",
    },
    {
      id: "src-kyeonggi-20261116580222",
      title: "교육부 \"수능 연기 없다\"…'AI 커닝 비상'에도 19일 예정대로",
      publisher: "경기일보",
      url: "https://www.kyeonggi.com/article/20261116580222",
      publishedAt: "2026-11-16",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-sisajournal-394354",
      title: "결국 '수능 연기' 안 한다…교육부 \"논의했지만 부작용 더 크다고 판단\"",
      publisher: "시사저널",
      url: "https://www.sisajournal.com/news/articleView.html?idxno=394354",
      publishedAt: "2026-11-17",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-fnnews-202611171547048889",
      title: "단추마다 스티커, 재난문자 삑소리로 '숨긴 폰' 적발…수능 10년 제한(종합)",
      publisher: "파이낸셜뉴스(뉴스1)",
      url: "https://www.fnnews.com/news/202611171547048889",
      publishedAt: "2026-11-17",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-fnnews-202611191824252493",
      title: "'AI 커닝' 미수범 처벌 규정 없어…제재 법안·양형기준 체계화 필요",
      publisher: "파이낸셜뉴스",
      url: "https://www.fnnews.com/news/202611191824252493",
      publishedAt: "2026-11-19",
      type: "press",
      license: "link-only",
    },
    {
      id: "src-segye-20261120512146",
      title: "세무사·리트·수능 등 잇단 'AI 커닝'… 법적 처벌 수위는? [이슈+]",
      publisher: "세계일보",
      url: "https://www.segye.com/newsView/20261120512146",
      publishedAt: "2026-11-22",
      type: "press",
      license: "link-only",
    },
  ],
};
