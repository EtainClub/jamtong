import { readTranslatedBody, type BookTranslation } from "../../i18n";

/**
 * 『이재명 자서전』 영어 — 1~8장.
 *
 * ★ 원본(`../chapters.ts`, `../text/NN.md`)의 편집부 요약을 옮긴 것이다. 원서 번역본이 아니다.
 * ★ 기계 번역이고 원어민 검수 전이다(review). 검수하면 reviewed를 올리고 누가 언제 봤는지 적는다.
 * ★ 고유명사는 국어의 로마자 표기법으로 적는다(Andong, Seongnam, Sangdaewon-dong, Gyeongju).
 *   이름은 대통령실 영문 표기 Lee Jae-myung. 회사명 에프코아코리아(F-Coa Korea)는 표기를 확인하지 못했다.
 * ★ 원본 본문은 주어를 생략한 요약이다. 번역은 3인칭(the author, he)으로 옮긴다 — 저자의 1인칭 목소리를 지어내지 않는다.
 *   그러다 보니 저자만의 주장(대장동 환수액, 20억 회유와 협박, 압수수색 횟수, "제거 작전 보고서" 등)이
 *   편집부의 단정처럼 읽힐 수 있다. 그런 문장에는 "according to the author", "he writes"를 붙였다.
 *   원본의 쉽게 보기 토막이 같은 대목을 "저자의 설명", "저자의 기록"으로 옮긴 것과 같은 규율이다.
 * ★ 3장의 자살 시도 대목은 방법(약의 개수, 연탄)을 옮기지 않았다. 원본 토막도 방법을 적지 않는다.
 *   할 일의 상담 전화는 한국의 109 대신 나라별 상담 전화 목록(findahelpline.com)으로 바꿨다.
 */
const body = (n: number) => readTranslatedBody("auto_2025", "en", `${String(n).padStart(2, "0")}.md`);
const machine = { method: "machine", reviewed: false } as const;

export const AUTOBIOGRAPHY_EN: BookTranslation = {
  locale: "en",
  bookSlug: "autobiography",
  title: "Lee Jae-myung: An Autobiography",
  subtitle: "That Dream Brought Me This Far",
  note: "Lee Jae-myung's autobiography, published in 2025. It follows his life from a childhood in the mountains of Andong through his years as a boy factory worker, law school, human rights lawyer and civic activist, up to his entry into politics. The text here is not the author's own words: it is our English translation of a summary we wrote in Korean after reading the book.",
  chapters: [
    {
      chapterId: "autobiography-01",
      basedOn: "6151b0cc22c5",
      review: machine,
      title: "Like a Marten, Deep in the Mountains",
      summary: "A childhood in a slash-and-burn farming village in the mountains of Andong, his mother's faith in him, the discrimination he faced for being poor, and the factory life he began at thirteen.",
      lead: "The mountain village where the author was born and raised, and how he ended up in a factory at thirteen.",
      points: {
        "a1-p1": {
          title: "He walked 12 km to school and back",
          figure: { kind: "number", value: "12", unit: "km", note: "Mountain path to school, every day (round trip)", caption: "A village with no bus", tone: "ash" },
          say: "The author grew up deep in the mountains of Andong, where no buses ran. Every day he walked a 12-kilometer round trip on mountain paths to get to elementary school.",
          quote: "It was a remote village of slash-and-burn farmers where not even buses ran, and getting to Samgye Elementary School meant walking a rough 12-kilometer mountain path, there and back, every day.",
        },
        "a1-p2": {
          title: "He was slapped 27 times",
          figure: { kind: "number", value: "27", unit: "slaps", note: "For not planting flowers properly", caption: "He did not bow his head", tone: "burgundy" },
          say: "He was often left alone in an empty classroom because he couldn't bring school supplies, and a teacher slapped him 27 times for not planting flowers properly. The author says that was when he learned he had to stand up to injustice.",
          quote: "During a Saemaul Movement beautification project, he was slapped across the face twenty-seven times by a teacher because he had not planted the flowers properly, having been busy helping at home; even at that young age he felt the injustice of it, and he held firm without bowing his head.",
        },
        "a1-p3": {
          title: "Every single student went on the school trip",
          figure: { kind: "grid", total: 20, filled: 20, label: "Whole school", caption: "Not one child left out" },
          say: "Teachers raised the trip money through odd jobs and the school store, so every child, the poorest included, went on the trip. The author says this was the starting point of his idea of welfare for all.",
          quote: "Thanks to this, the entire school went together on their first school trip, to Gyeongju, without a single child left out.",
        },
        "a1-p4": {
          title: "At thirteen, 12-hour days in a factory",
          figure: { kind: "steps", steps: [{ label: "Feb 1976", value: "Graduated" }, { label: "Seongnam", value: "Hillside room" }, { label: "Factory", value: "12 h a day", tone: "burgundy" }], caption: "A factory instead of middle school" },
          say: "Right after elementary school he moved to Seongnam and went to work in a factory instead of middle school. He worked 12 hours a day, breathing in hydrochloric acid and lead fumes.",
          quote: "Moving to a place that promised higher pay, he worked twelve hours a day, from 8:30 in the morning until past 9 at night.",
        },
      },
      actions: {
        "a1-a1": {
          title: "Look up how the law now protects children from labor",
          detail: "At thirteen, the author got into a factory using someone else's name. Find out for yourself the age at which Korea's Labor Standards Act now allows people to work, and how it protects young workers.",
          linkLabel: "Labor Standards Act (Korea Law Information Center, in Korean)",
        },
        "a1-a2": {
          title: "Learn what education support children can get",
          detail: "The author recalls being left alone in an empty classroom because he couldn't bring school supplies. If a child around you is struggling, find out what education benefits or school-cost support they can receive, and tell them.",
          linkLabel: "Bokjiro (Korean welfare portal, in Korean)",
        },
      },
      shorts: [],
      body: body(1),
    },
    {
      chapterId: "autobiography-02",
      basedOn: "f82aeed82096",
      review: machine,
      title: "Does Being Poor Mean Not Knowing Love?",
      summary: "Three months' wages stolen, a wrist broken in a press, a hundred scars. How the violence of the factory led him to resolve on a world without people like Assistant Manager Hong.",
      lead: "What the years as a boy factory worker left on the author's body and in his mind.",
      points: {
        "a2-p1": {
          title: "Three months' wages were stolen",
          figure: { kind: "number", value: "90", unit: "days", note: "Twelve-hour days he was never paid for", caption: "The owner fled with the wages", tone: "burgundy" },
          say: "On the day he was to be paid three months' wages, the owner ran off with the money. Because he had been working under someone else's name, he could not even report it.",
          quote: "The pay for ninety days of grueling work, twelve hours a day, had vanished, and when he came home and saw his mother tearing dried pollack into strips for piecework, tears of grief and injustice poured out of him.",
        },
        "a2-p2": {
          title: "More than a hundred scars",
          figure: { kind: "stack", title: "What the factories left", items: [{ label: "Polisher", value: "Worn-off prints" }, { label: "Shear", value: "A severed finger" }, { label: "Press", value: "Broken wrist", tone: "burgundy" }], footer: { label: "Scars", value: "100+", tone: "burgundy" } },
          say: "Each factory's machines were more dangerous than the last. His palms wore away, he saw a co-worker's fingers cut off, and his body was left with more than a hundred scars.",
          quote: "Cut by sharp steel sheets and worn down by toxic substances and noise, his body came to bear more than a hundred scars, large and small.",
        },
        "a2-p3": {
          title: "A broken wrist he could not mention",
          figure: { kind: "steps", steps: [{ label: "Press accident" }, { label: "Only ointment", value: "Feared firing" }, { label: "Lifelong injury", tone: "burgundy" }], caption: "A wrist never treated" },
          say: "A press broke the bones of his left wrist, but afraid he would be fired if he said it hurt, he put ointment on it and kept working. The wrist stayed bent, a lifelong disability.",
          quote: "His wrist bone was broken, but afraid that if he showed any pain his machine would be taken away and he would be fired, he simply put ointment on the broken wrist and kept the machine running in silence.",
        },
        "a2-p4": {
          title: "Not becoming Hong, but a world without Hongs",
          figure: { kind: "versus", left: { label: "First resolve", value: "A boss like Hong", tone: "ash" }, right: { label: "New resolve", value: "A world without Hongs", tone: "navy" }, caption: "After seeing who orders the violence" },
          say: "At first he wanted to be like Hong, a high-school-educated manager nobody beat. After seeing Hong stir up violence from behind the scenes, he resolved instead to build a world without such people.",
          quote: "And so he moved away from his original idea of becoming a manager like Assistant Manager Hong and lording it over others, toward the conviction that he had to build a world without people like Hong who exploit and oppress the powerless.",
        },
      },
      actions: {
        "a2-a1": {
          title: "Learn what compensation you can get for a work injury",
          detail: "The author did not even know he could receive part of his wages while recovering from a workplace injury, so he worked with his arm in a cast. Take a moment to check what workers' compensation covers and how to apply.",
          linkLabel: "Korea Workers' Compensation and Welfare Service (in Korean)",
        },
        "a2-a2": {
          title: "Save the number for unpaid-wage help",
          detail: "What happened to a thirteen-year-old who could not report stolen wages still happens to someone today. If you are in Korea, save the Ministry of Employment and Labor helpline and pass it on to anyone who needs it.",
          linkLabel: "Ministry of Employment and Labor helpline 1350 (in Korea)",
        },
      },
      shorts: [],
      body: body(2),
    },
    {
      chapterId: "autobiography-03",
      basedOn: "868fd3a5745b",
      review: machine,
      title: "Two Factory Boys Reciting Poems",
      summary: "Two boy workers who got through the factory by memorizing poems, a cram school director who waived the fees, a bending arm and two moments of despair, and a 285 on the entrance exam that got him into law school.",
      lead: "The years when he tried to study his way out of the factory. This chapter includes a passage in which the author tried to end his life.",
      points: {
        "a3-p1": {
          title: "The director who waived his fees",
          figure: { kind: "versus", left: { label: "His situation", value: "No money for fees", tone: "ash" }, right: { label: "The director", value: "\"Just come\"", tone: "navy" }, caption: "The world's first recognition" },
          say: "When the author was about to quit because he could not pay, director Kim Chang-gu told him not to pay and just keep coming. The author counts this as a lifelong source of strength.",
          quote: "Then Kim Chang-gu, the director of Seongil Academy, heard about his circumstances, told him that if he wanted to study he should simply keep coming without paying, and waived his fees entirely.",
        },
        "a3-p2": {
          title: "A stranger and his brother-in-law saved him",
          figure: { kind: "steps", steps: [{ label: "Bent arm, poverty", tone: "burgundy" }, { label: "Pharmacist", value: "Sensed it" }, { label: "Brother-in-law" }, { label: "Lives on", tone: "navy" }], caption: "Seventeen, at the edge" },
          say: "Facing a disability as his arm bent and the weight of poverty, the seventeen-year-old tried to give up on life. The attention of a pharmacist who sensed something and of the brother-in-law who stayed by him saved him.",
          quote: "The heartfelt comfort of his poor brother-in-law and the quiet, nagging care of a stranger, the pharmacist, had pulled a fading life back from the brink.",
        },
        "a3-p3": {
          title: "From below 300,000th to the top 2,000 in 8 months",
          figure: { kind: "steps", steps: [{ label: "Start", value: "Below 300,000th", tone: "ash" }, { label: "8 months", value: "3–4 h of sleep" }, { label: "Entrance exam", value: "285 points", tone: "navy" }], caption: "Thumbtacks in the desk" },
          say: "He studied with thumbtacks pressed into his desk to stay awake. His national ranking rose from below 300,000th to within the top 2,000 in eight months.",
          quote: "His ranking, which at the start of his preparation had been below 300,000th nationwide, shot up to within the top 2,000 in eight months, and on an extraordinarily difficult national entrance exam he scored 285 points, among the very highest in the country.",
        },
        "a3-p4": {
          title: "A scholarship worth three times his factory pay",
          figure: { kind: "bars", bars: [{ label: "Factory wage", ratio: 33, value: "1×", tone: "ash" }, { label: "Allowance", ratio: 100, value: "200,000 won (3×)", tone: "navy" }], caption: "Special scholarship, Chung-Ang law" },
          say: "He entered law school as a special scholarship student, with tuition waived and a living allowance of 200,000 won a month, three times his factory wage.",
          quote: "He proudly entered Chung-Ang University's College of Law as a special scholarship student, with his admission fee and tuition fully waived and a monthly living allowance of 200,000 won, three times his factory wage.",
        },
      },
      actions: {
        "a3-a1": {
          title: "Save a number to call when things get hard",
          detail: "What saved the author in this chapter was the attention of a stranger, a pharmacist, and of his brother-in-law. Save a crisis line you can call any time for yourself or someone close to you, and reach out first to anyone who seems worn down. In Korea, the number is 109.",
          linkLabel: "Find a Helpline (crisis lines by country)",
          href: "https://findahelpline.com",
        },
        "a3-a2": {
          title: "Thank an adult who believed in you",
          detail: "The author never forgot the director who waived his fees. If you had someone like that, send them a word of greeting and thanks this week.",
        },
      },
      shorts: [],
      body: body(3),
    },
    {
      chapterId: "autobiography-04",
      basedOn: "cac6c964b71a",
      review: machine,
      title: "I Will Be a Strength to the Weak",
      summary: "A diary entry, written after he became a scholarship student at law school, choosing to be a lawyer rather than a judge or prosecutor; the shock of learning the truth about Gwangju; and failing the bar by 0.34 points.",
      lead: "What he saw after entering university, and the promise he made.",
      points: {
        "a4-p1": {
          title: "He wrote that he would be a lawyer, not a judge",
          figure: { kind: "versus", left: { label: "Judge, prosecutor", value: "What others expected", tone: "ash" }, right: { label: "Lawyer", value: "A light for the weak", tone: "navy" }, caption: "A resolution in his diary at 20" },
          say: "People already treated him like a future judge, but thinking of the friends still in the factories, he wrote in his diary that he would become a lawyer who helps the weak.",
          quote: "Around the age of twenty, before his university entrance ceremony, he wrote a resolution in his diary: even if he passed the bar exam, instead of becoming a judge or prosecutor he would become a lawyer, help the powerless and marginalized, and be a warm light for those suffering in the shadows.",
        },
        "a4-p2": {
          title: "He read \"Bible\" as \"bib-leh\"",
          figure: { kind: "stack", title: "Signs of learning alone", items: [{ label: "Bible", value: "\"bib-leh\"" }, { label: "Iron", value: "\"eye-rong\"" }, { label: "Island", value: "\"iz-land\"" }], footer: { label: "Why", value: "Never heard them" } },
          say: "He had learned English only from books and dictionaries and had never heard the words spoken, so he sometimes pronounced them oddly and was laughed at.",
          quote: "Having learned English alone from books and dictionaries, he had never had the chance to hear how words actually sounded, and he quietly suffered humiliations such as pronouncing \"Bible\" as \"bib-leh,\" \"iron\" as \"eye-rong,\" and \"island\" as \"iz-land.\"",
        },
        "a4-p3": {
          title: "He saw the truth about Gwangju on video",
          figure: { kind: "versus", left: { label: "Trusting the news", value: "A mob riot", tone: "burgundy" }, right: { label: "After the footage", value: "Troops' massacre", tone: "navy" }, caption: "Shame and guilt" },
          say: "Believing the news, the author had thought of May 18 as a riot. When his friend Lee Young-jin showed him footage of what happened, he felt great shock and shame.",
          quote: "Until then he had believed only the distorted reports of the government, newspapers and broadcasters, and had wrongly understood the May 18 Gwangju Democratization Movement as a riot by mobs.",
        },
        "a4-p4": {
          title: "He failed by 0.34 points",
          figure: { kind: "bars", bars: [{ label: "Minimum", ratio: 100, value: "40", tone: "ash" }, { label: "Commercial law", ratio: 99, value: "39.66", tone: "burgundy" }], caption: "Passed overall, failed one subject" },
          say: "In the second round of the bar exam his total was comfortably above the line, but he fell 0.34 points short of the minimum in commercial law. The author says this failure cured him of arrogance.",
          quote: "His total score was well above the pass mark, but in commercial law he scored 39.66, just 0.34 points short of the subject's minimum of 40, and so he failed.",
        },
      },
      actions: {
        "a4-a1": {
          title: "Look at one record of May 18 for yourself",
          detail: "What changed the author's mind was not the news but recorded footage. Find one record from May 1980 in Gwangju and look at it yourself.",
          linkLabel: "May 18 Memorial Foundation (in Korean)",
        },
        "a4-a2": {
          title: "Write one line on what a recent failure taught you",
          detail: "The author writes that failing by 0.34 points was what made him let go of his arrogance. Think of one recent failure of your own and write down in one line what you learned.",
        },
      },
      shorts: [],
      body: body(4),
    },
    {
      chapterId: "autobiography-05",
      basedOn: "2828a7322d38",
      review: machine,
      title: "I Do Not Forget the People of My Hard Times",
      summary: "A woman carrying bricks outside his window, a night spent standing up to the word \"factory boy,\" a letter to a friend in prison, and the news of his success told to his father on his last day.",
      lead: "What the author vowed never to forget on the threshold of success.",
      points: {
        "a5-p1": {
          title: "He met the eyes of a woman carrying bricks",
          figure: { kind: "versus", left: { label: "Inside", value: "Him, with his books", tone: "ash" }, right: { label: "Outside", value: "Carrying bricks", tone: "burgundy" }, caption: "Irritation turns to shame" },
          say: "He opened the window to complain about the noise and saw a woman carrying bricks on her head up and down construction stairs. Thinking of his family working in factories, he felt ashamed.",
          quote: "The moment his eyes met those of the sweating woman, his irritation turned to shame, and a deep ache spread through his chest.",
        },
        "a5-p2": {
          title: "He stood up to the word \"factory boy\"",
          figure: { kind: "versus", left: { label: "Erase your roots", value: "Taste of privilege", tone: "burgundy" }, right: { label: "Keep your roots", value: "Fix the structure", tone: "navy" }, caption: "The two paths the author saw" },
          say: "When a candidate in the next room spoke contemptuously of workers, the author refused to let it go. Leaving the factory, he said, does not make the boy workers' pain disappear.",
          quote: "just because he had left that place, did that mean the pain of the countless boy workers still slaving over oil and grease in factories had disappeared?",
        },
        "a5-p3": {
          title: "He wrote to a friend in prison",
          figure: { kind: "versus", left: { label: "Him", value: "Studying for the bar", tone: "ash" }, right: { label: "Lee Young-jin", value: "Jailed, expelled", tone: "burgundy" }, caption: "The friend missing at graduation" },
          say: "The friend who had shown him the truth about Gwangju was jailed for leading protests and missed graduation. The author wrote him a letter full of respect and guilt.",
          quote: "Although he himself, using his exam preparation as an excuse, had not been able to throw himself fully into the struggle in the streets, he put into the letter his deep respect for, and sense of debt to, a righteous friend who had given his youth to fighting injustice and was serving time in prison for it.",
        },
        "a5-p4": {
          title: "The last news he gave his father",
          figure: { kind: "steps", steps: [{ label: "Spring 1986", value: "Cancer returns", tone: "burgundy" }, { label: "Bar exam", value: "Passed" }, { label: "In his ear", value: "The news", tone: "navy" }], caption: "Resentment turns to regret" },
          say: "When the father who had blocked his studies was given months to live, the author's resentment turned to regret, and he threw himself into the exam and passed. He whispered the news into the ear of his fading father.",
          quote: "He leaned close to the ear of his father, who was barely clinging to life amid the agony of failing breath as if waiting for news of his son, and whispered that he had passed.",
        },
      },
      actions: {
        "a5-a1": {
          title: "Thank a working person you meet today",
          detail: "Seeing the woman carrying bricks outside his window, the author realized whose labor he was studying on. Today, say thank you to one delivery driver, security guard or cleaner.",
        },
        "a5-a2": {
          title: "Say one thing you have been putting off to your family",
          detail: "The author writes with regret that he never told his father he loved him. This week, say the thanks or apology you have been putting off.",
        },
      },
      shorts: [],
      body: body(5),
    },
    {
      chapterId: "autobiography-06",
      basedOn: "15ee0a279da3",
      review: machine,
      title: "The Mentors Who Cheered On a 25-Year-Old Lawyer",
      summary: "A human rights law office in Seongnam instead of a judgeship, ten million won lent by two elders, free legal defense, marriage to Kim Hye-kyung, and the threats he received for confronting the Park View preferential sale.",
      lead: "Who helped the author when he became a lawyer at twenty-five, and whom he worked for.",
      points: {
        "a6-p1": {
          title: "Ten million won lent by two elders",
          figure: { kind: "bars", bars: [{ label: "Cho Young-rae", ratio: 50, value: "5 million won", tone: "navy" }, { label: "Via Kim Chang-gu", ratio: 50, value: "5 million won", tone: "navy" }, { label: "Total", ratio: 100, value: "10 million won", tone: "ash" }], caption: "Seed money for his Seongnam office" },
          say: "He could have become a judge or prosecutor, but chose to be a human rights lawyer in Seongnam. With no money of his own, lawyer Cho Young-rae and director Kim Chang-gu raised the funds for his office.",
          quote: "On top of that, Kim Chang-gu, the director of Seongil Academy who had taught him without charging fees during his equivalency exam days, arranged another five million won, so he was able to raise ten million won.",
        },
        "a6-p2": {
          title: "Justice for a migrant worker who lost his arm",
          figure: { kind: "steps", steps: [{ label: "Arm severed", tone: "burgundy" }, { label: "Deportation" }, { label: "A year in court" }, { label: "Injury upheld", tone: "navy" }], caption: "Filipino worker Ariel Galak" },
          say: "A Filipino worker was about to be expelled without treatment because he was undocumented. The author worked on his case for over a year and won recognition of his industrial injury.",
          quote: "In the end, against the odds, he won recognition of the injury as an industrial accident and sent the compensation to a faraway country, and he drank a glass thinking of his own injured arm.",
        },
        "a6-p3": {
          title: "He proposed by handing over six diaries",
          figure: { kind: "number", value: "6", unit: "diaries", note: "Ten years of diaries, from 15 to 24", caption: "Handed over, nothing hidden", tone: "navy" },
          say: "When Kim Hye-kyung hesitated, he gave her all six diaries he had kept over ten years, showing her his poverty and his wounds and asking for her trust.",
          quote: "When she could not easily make up her mind, he handed her all six of his diaries, written over ten years from his factory days at fifteen until he passed the bar at twenty-four.",
        },
        "a6-p4": {
          title: "He says he turned down a 2-billion-won offer",
          figure: { kind: "versus", left: { label: "Developers' offer", value: "2 billion won", tone: "burgundy" }, right: { label: "His answer", value: "No", tone: "navy" }, caption: "Then came threats (his account)" },
          say: "The author writes that when he dug into the Park View scandal he was offered 2 billion won to back off, and that after he refused, threats aimed at his family followed.",
          quote: "According to the author, the construction interests tried to win him over by offering two billion won to set up a citizens' news outlet, and he turned them down with a mocking joke, telling those who wanted to buy a person's conscience with money that they would have to bring five hundred billion won.",
        },
      },
      actions: {
        "a6-a1": {
          title: "Know where to get free legal advice",
          detail: "The author defended clients for free who could not even pay for photocopies. So that no one goes without legal help for lack of money, find out where free legal advice is available and tell those who need it. In Korea, call the Korea Legal Aid Corporation.",
          linkLabel: "Korea Legal Aid Corporation 132 (in Korea)",
        },
        "a6-a2": {
          title: "Look up what one local civic group does",
          detail: "The author began his civic activism with the Seongnam Citizens' Association. Whatever its leanings, find one civic group active where you live and see what it does.",
        },
      },
      shorts: [],
      body: body(6),
    },
    {
      chapterId: "autobiography-07",
      basedOn: "575ed28eefb6",
      review: machine,
      title: "The War That Has Not Ended",
      summary: "The Park View exposé and his first fine, the author's account of the Daejang-dong development profits, a hospital ordinance scrapped in 47 seconds and the church basement where he decided on politics, and the investigations and audits of his years as mayor.",
      lead: "What the author calls his fight against entrenched interests. Please read contested matters such as Daejang-dong as the author's account.",
      points: {
        "a7-p1": {
          title: "He was fined for his exposé",
          figure: { kind: "steps", steps: [{ label: "Tape exposed" }, { label: "Arrests" }, { label: "He is charged", value: "Accomplice", tone: "burgundy" }, { label: "Fine", value: "1.5M won", tone: "burgundy" }], caption: "The Park View sale scandal" },
          say: "The author exposed the Park View preferential sale scandal and several people were arrested. In the process he himself was fined 1.5 million won for helping someone impersonate a prosecutor.",
          quote: "This exposure caused an uproar, and the wife of the provincial governor, senior officials, police officers and journalists were arrested one after another, but the prosecution instead charged him as an accomplice for helping the producer impersonate a prosecutor, and he was ultimately sentenced to a fine of 1.5 million won.",
        },
        "a7-p2": {
          title: "Daejang-dong: the author says 550 billion won was recovered",
          figure: { kind: "bars", bars: [{ label: "City's investment", ratio: 4, value: "2.5 billion won", tone: "ash" }, { label: "Recovered (his account)", ratio: 100, value: "Over 550 billion won", tone: "navy" }], caption: "Seongnam's figures; views differ" },
          say: "The author explains that by having private developers bear the risk while the city took its profit first, Seongnam invested 2.5 billion won and recovered more than 550 billion won. Assessments of this project differ sharply, so please read it alongside the sources on our achievement page (in Korean).",
          quote: "According to the author's account, through this Seongnam City, having invested 2.5 billion won, ultimately recovered more than 550 billion won in development profits for its citizens, including 440 billion won, about seventy percent of the initially expected profit.",
        },
        "a7-p3": {
          title: "18,000 initiative signatures in 3 weeks",
          figure: { kind: "bars", bars: [{ label: "Initiative", ratio: 9, value: "Over 18,000", tone: "navy" }, { label: "Support", ratio: 100, value: "Over 200,000", tone: "navy" }], caption: "Campaign for a city hospital" },
          say: "When two large general hospitals closed, citizens collected signatures on the streets in midwinter to draft a city hospital ordinance themselves.",
          quote: "In the bitter cold of midwinter he went out into the streets with a microphone to meet citizens, and in three weeks they achieved a remarkable feat, collecting more than 18,000 signatures for the citizens' initiative and drawing support signatures from well over 200,000 citizens.",
        },
        "a7-p4": {
          title: "The ordinance vanished in 47 seconds",
          figure: { kind: "number", value: "47", unit: "sec", note: "Citizen-initiated hospital ordinance shelved by the council (March 2004)", caption: "Without any debate", tone: "burgundy" },
          say: "In March 2004 the city council shelved the ordinance in 47 seconds without debate. The citizens' representatives who protested were reported to the police.",
          quote: "Because the ordinance carried the earnest hopes of hundreds of thousands of citizens, he sat in the observers' gallery full of hope, but the city council, in just forty-seven seconds and without even a debate for or against, rammed through a decision to defer deliberation, effectively scrapping the ordinance.",
        },
        "a7-p5": {
          title: "He decided to enter the tiger's den",
          figure: { kind: "steps", steps: [{ label: "Church basement", value: "In hiding", tone: "burgundy" }, { label: "Into politics" }, { label: "2013", value: "Groundbreaking", tone: "navy" }], caption: "From protest to politics" },
          say: "Hiding in a church basement, the author decided that shouting from outside would change nothing, and that he would become mayor and build the hospital himself.",
          quote: "Just as you have to enter the tiger's den to catch the tiger, he concluded that citizens had to elect a mayor with their own strength and have that mayor build the hospital, and he made up his mind to enter real politics.",
        },
      },
      actions: {
        "a7-a1": {
          title: "Read Daejang-dong through the sources on our achievement page",
          detail: "The recovery figure in this chapter is the author's account and Seongnam City's calculation. Read the sources and counterarguments on our achievement page to see what counts as recovered and what is in dispute.",
          linkLabel: "Seongnam Pangyo-Daejang urban development (in Korean)",
        },
        "a7-a2": {
          title: "Check how it went from 47 seconds to opening day",
          detail: "The ordinance scrapped in 47 seconds led to the Seongnam Medical Center. Check on our achievement page when it actually opened and how long it took.",
          linkLabel: "Seongnam Medical Center (in Korean)",
        },
      },
      shorts: [],
      body: body(7),
    },
    {
      chapterId: "autobiography-08",
      basedOn: "0bc8c11e275c",
      review: machine,
      title: "Wounds Are the Passage Through Which Light Enters Us",
      summary: "A closing chapter that looks back over the whole book: from mountain boy to factory worker, human rights lawyer, mayor of Seongnam and governor of Gyeonggi, to a presidential defeat by 0.73 points, a stabbing, and the martial law of December 3.",
      lead: "This chapter looks back over the whole book at once. If you are reading about the author's life for the first time, you can start here.",
      points: {
        "a8-p1": {
          title: "He studied on a water barrel by a neighbor's light",
          figure: { kind: "stack", title: "Three goals at seventeen", items: [{ label: "Not to be beaten" }, { label: "To escape poverty" }, { label: "To travel freely" }], footer: { label: "So", value: "Into learning", tone: "navy" } },
          say: "In a rented room with no space for a desk, the author turned a water barrel upside down in the yard and read by the light from a neighbor's window.",
          quote: "In a cramped rented room with no space even for a desk, on nights when his family was asleep, he turned an outdoor water barrel upside down in the yard and turned the pages of his books by the light that leaked from a neighbor's window.",
        },
        "a8-p2": {
          title: "He lost by 0.73% and conceded unconditionally",
          figure: { kind: "number", value: "0.73", unit: "%", note: "Presidential vote margin (as the book records)", caption: "Conceded to prevent division", tone: "ash" },
          say: "He lost the presidential election by a very small margin. The author writes that he apologized to his supporters and conceded unconditionally to prevent division.",
          quote: "He then ran for president, but lost by a narrow margin of 0.73 percentage points; bowing his head in apology to the supporters who had given their all through the night, he conceded cleanly and unconditionally to prevent division.",
        },
        "a8-p3": {
          title: "He survived a stabbing",
          figure: { kind: "steps", steps: [{ label: "January 2024", value: "Stabbed", tone: "burgundy" }, { label: "Survives" }, { label: "Life as a bonus", tone: "navy" }], caption: "Between life and death" },
          say: "In January 2024, as opposition leader, the author was stabbed in the neck by an assailant. After surviving, he came to see the rest of his life as a bonus.",
          quote: "In January 2024, as leader of the opposition party, he stood at the crossroads of life and death when an assailant stabbed him in the neck with a knife, but having miraculously survived, he came to regard the rest of his life as a bonus and became calmer and stronger still.",
        },
        "a8-p4": {
          title: "Wounds, he says, are where light comes in",
          figure: { kind: "number", value: "100+", unit: "scars", note: "Left on the boy worker's body", caption: "What the chapter title means", tone: "burgundy" },
          say: "The author calls the more than a hundred scars on his body, and all his hardships, the marks of a road walked to become a light for the weak.",
          quote: "The more than a hundred wounds left on the boy worker's body and all of life's hardships stand as an undying record of a fierce fight to protect not private interest but the public good and justice, and as the mark of a great journey taken by one human being who let light in through his wounds and set out to become a steadfast light for the weak.",
        },
      },
      actions: {
        "a8-a1": {
          title: "Read more about the night of December 3 in another book",
          detail: "This chapter passes over the December 3 martial law in a single sentence. Chapter 1 of another book, The People Will Do It in the End, covers those hours in detail.",
          linkLabel: "The People Will Do It in the End, chapter 1 (in Korean)",
        },
        "a8-a2": {
          title: "Share one scene that stayed with you",
          detail: "Sometimes a person's life reaches people before any argument does. Pick the scene from this book that stayed with you most and send it to someone you know, with a link to that chapter.",
        },
      },
      shorts: [],
      body: body(8),
    },
  ],
};
