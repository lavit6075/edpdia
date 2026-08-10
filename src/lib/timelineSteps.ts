export type AdmissionLevel = "kindergarten" | "primary" | "secondary";

export interface TimelineStep {
  /** How many months before the intake month (typically September) this step falls. */
  monthsBefore: number;
  en: string;
  zh: string;
  /** If omitted, the step applies to every level. */
  levels?: AdmissionLevel[];
}

/**
 * General, non-school-specific guidance based on typical Hong Kong international school
 * admissions cycles. Actual deadlines and requirements vary by school.
 */
export const TIMELINE_STEPS: TimelineStep[] = [
  {
    monthsBefore: 18,
    en: "Research schools — shortlist by curriculum, location, school type and philosophy.",
    zh: "研究學校——按課程、地點、學校類型及教育理念篩選心儀學校。",
  },
  {
    monthsBefore: 15,
    en: "Attend open days, school tours, and information sessions.",
    zh: "參加開放日、校園導覽及入學簡介會。",
  },
  {
    monthsBefore: 13,
    en: "Gather required documents: birth certificate, passport, immunisation record, school reports and references.",
    zh: "準備所需文件:出生證明、護照、疫苗接種紀錄、成績表及推薦信。",
  },
  {
    monthsBefore: 12,
    en: "Prepare for entrance interviews and play-based assessments.",
    zh: "為入學面試及遊戲導向評估作準備。",
    levels: ["kindergarten"],
  },
  {
    monthsBefore: 12,
    en: "Register for and prepare for entrance assessments (e.g. CAT4, MAP, or the school's own entrance test).",
    zh: "報名並準備入學評估(例如 CAT4、MAP 或學校自設的入學試)。",
    levels: ["primary"],
  },
  {
    monthsBefore: 12,
    en: "Register for and prepare for entrance assessments (e.g. ISEB pre-tests, 11+, 13+, CAT4, or MAP, depending on the school).",
    zh: "報名並準備入學評估(視乎學校要求,可能包括 ISEB predication tests、11+、13+、CAT4 或 MAP)。",
    levels: ["secondary"],
  },
  {
    monthsBefore: 11,
    en: "Submit online applications and pay application fees before each school's deadline.",
    zh: "在各校截止日期前遞交網上申請及繳付申請費。",
  },
  {
    monthsBefore: 9,
    en: "Attend assessments, entrance exams and/or interviews as scheduled by each school.",
    zh: "按各校安排出席評估、入學考試及/或面試。",
  },
  {
    monthsBefore: 7,
    en: "Receive offers; pay the reservation deposit to confirm a place if accepted.",
    zh: "收到取錄通知;如接受學位,須繳付留位按金以確認學位。",
  },
  {
    monthsBefore: 4,
    en: "Settle the debenture or annual capital levy, and any remaining enrolment paperwork.",
    zh: "繳付債券或全年資本徵費,並完成餘下的入學手續。",
  },
  {
    monthsBefore: 2,
    en: "Arrange uniforms, school bus, and attend new-student orientation if offered.",
    zh: "訂購校服、安排校車,並出席學校提供的新生迎新活動(如有)。",
  },
  {
    monthsBefore: 0,
    en: "Intake month — first day of school.",
    zh: "入學月份——開學日。",
  },
];
