export interface Bilingual {
  en: string;
  zh: string;
}

/** General admissions process — not specific to any one school. */
export const PROCESS_STEPS: Bilingual[] = [
  {
    en: "Research schools by curriculum, district, age range, and school type using the directory.",
    zh: "利用學校名錄,按課程、地區、年齡範圍及學校類型研究心儀學校。",
  },
  {
    en: "Attend open days or school tours, and shortlist 3–6 schools that fit your family's priorities.",
    zh: "參加開放日或校園導覽,並從中篩選 3 至 6 所符合家庭需要的學校。",
  },
  {
    en: "Check each school's specific entrance exams, application deadlines, and required documents.",
    zh: "查閱各校的入學考試要求、申請截止日期及所需文件。",
  },
  {
    en: "Submit online applications with supporting documents and pay application fees before each deadline.",
    zh: "在截止日期前遞交網上申請,附上所需文件並繳付申請費。",
  },
  {
    en: "Prepare for and attend entrance assessments, exams, and/or interviews.",
    zh: "準備並出席入學評估、考試及/或面試。",
  },
  {
    en: "Review offers, pay any reservation deposit, and confirm your place.",
    zh: "審視取錄通知,繳付留位按金並確認學位。",
  },
  {
    en: "Complete enrolment — debenture or capital levy, uniforms, school bus, and orientation.",
    zh: "完成入學手續——債券或資本徵費、校服、校車及迎新活動。",
  },
];

export interface ExamType {
  code: string;
  nameEn: string;
  nameZh: string;
  descEn: string;
  descZh: string;
  levelEn: string;
  levelZh: string;
}

export const EXAM_TYPES: ExamType[] = [
  {
    code: "ISEB",
    nameEn: "ISEB Pre-Tests",
    nameZh: "ISEB 入學前測試",
    descEn:
      "Online adaptive tests (English, maths, verbal and non-verbal reasoning) used by many UK-curriculum senior schools as part of 11+/13+ entry.",
    descZh: "由英國評核委員會（ISEB）設計的網上適應性測試，涵蓋英文、數學、語文及非語文推理，常用於英式課程中學的 11+／13+ 入學程序。",
    levelEn: "Secondary",
    levelZh: "中學",
  },
  {
    code: "CAT4",
    nameEn: "CAT4 (Cognitive Abilities Test)",
    nameZh: "CAT4（認知能力測試）",
    descEn:
      "Assesses verbal, non-verbal, quantitative and spatial reasoning rather than curriculum knowledge; widely used across primary and secondary admissions.",
    descZh: "評估語文、非語文、數量及空間推理能力，而非課程知識；廣泛應用於小學及中學入學評核。",
    levelEn: "Primary & Secondary",
    levelZh: "小學及中學",
  },
  {
    code: "MAP",
    nameEn: "MAP Growth",
    nameZh: "MAP Growth 測試",
    descEn:
      "An adaptive test of reading, language usage and maths, often used by American-curriculum schools to place and assess applicants.",
    descZh: "評核閱讀、語文運用及數學能力的適應性測試，美式課程學校常用作評估及分班參考。",
    levelEn: "Primary & Secondary",
    levelZh: "小學及中學",
  },
  {
    code: "11+",
    nameEn: "11+ Entrance Exam",
    nameZh: "11+ 入學試",
    descEn:
      "School-set or ISEB-based exams for entry into Year 7 (age 11), typically covering English, maths, and reasoning, plus an interview.",
    descZh: "學校自設或以 ISEB 為基礎的入學試，適用於 Year 7（11 歲）入學，一般包括英文、數學及推理能力測試，並附面試。",
    levelEn: "Secondary",
    levelZh: "中學",
  },
  {
    code: "13+",
    nameEn: "13+ Entrance Exam",
    nameZh: "13+ 入學試",
    descEn:
      "Exams for entry into Year 9 (age 13), typically more academically demanding than 11+, often including subject-specific papers.",
    descZh: "適用於 Year 9（13 歲）入學的考試，難度一般較 11+ 為高，並可能包括個別學科的筆試。",
    levelEn: "Secondary",
    levelZh: "中學",
  },
  {
    code: "SCHOOL",
    nameEn: "School-specific assessment",
    nameZh: "學校自設評估",
    descEn:
      "Many schools use their own interview, play-based assessment (for younger children), or written test instead of — or alongside — a standardised exam.",
    descZh: "不少學校會採用自設面試、遊戲導向評估（適用於年幼學生）或筆試，取代或輔以標準化考試。",
    levelEn: "All levels",
    levelZh: "各級別",
  },
];

export const CHECKLIST_ITEMS: Bilingual[] = [
  { en: "Child's birth certificate and passport / HKID", zh: "子女的出生證明及護照／香港身份證" },
  { en: "Passport-sized photos", zh: "護照相片" },
  { en: "Immunisation / vaccination record", zh: "疫苗接種紀錄" },
  { en: "School reports from the current or most recent school", zh: "現在或最近就讀學校的成績表" },
  { en: "Reference letter from the current school (if required)", zh: "現在就讀學校的推薦信（如需要）" },
  { en: "Proof of residential address in Hong Kong", zh: "香港住址證明" },
  { en: "Parents' passports / HKIDs and proof of relationship", zh: "父母的護照／香港身份證及親屬關係證明" },
  { en: "Application fee payment confirmation", zh: "申請費繳費確認" },
];
