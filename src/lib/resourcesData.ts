export interface ResourceArticle {
  id: string;
  tagEn: string;
  tagZh: string;
  titleEn: string;
  titleZh: string;
  excerptEn: string;
  excerptZh: string;
}

/**
 * Placeholder editorial content — general guidance written by Edpdia, not reporting on a
 * specific real-world event. Replace with real articles before publishing; see README.
 */
export const RESOURCE_ARTICLES: ResourceArticle[] = [
  {
    id: "understanding-debentures",
    tagEn: "Admissions basics",
    tagZh: "入學基本知識",
    titleEn: "Debentures and capital levies, explained",
    titleZh: "債券與資本徵費全面睇",
    excerptEn:
      "Many Hong Kong international schools ask for a debenture or an annual capital levy on top of tuition. Here's what the difference is, when a debenture might make sense, and what questions to ask before you pay one.",
    excerptZh: "不少香港國際學校在學費以外，會要求家長購買債券或繳付全年資本徵費。兩者有何分別？何時值得購買債券？繳付前應向學校查詢什麼？",
  },
  {
    id: "ib-vs-a-levels",
    tagEn: "Curriculum",
    tagZh: "課程",
    titleEn: "IB Diploma vs. A-Levels: how the two actually differ",
    titleZh: "IB 文憑與 A-Level：兩者實際分別",
    excerptEn:
      "Both are widely recognised by universities worldwide, but they suit different kinds of learners. A neutral look at breadth vs. depth, coursework style, and how each is typically assessed.",
    excerptZh: "兩者均獲全球大學廣泛認可，但適合不同類型的學生。從課程廣度與深度、學習模式及評核方式作中立比較。",
  },
  {
    id: "prep-for-entrance-exams",
    tagEn: "Exams",
    tagZh: "考試",
    titleEn: "Preparing for entrance assessments without over-tutoring",
    titleZh: "準備入學評核，毋須過度操練",
    excerptEn:
      "CAT4, MAP, and ISEB pre-tests assess reasoning ability more than curriculum content. What that means for how (and how much) to prepare a young child.",
    excerptZh: "CAT4、MAP 及 ISEB 入學前測試,評核的主要是推理能力而非課程知識。這對家長應如何（以及應否）為孩子作準備,有什麼啟示？",
  },
  {
    id: "reading-a-school-fee-schedule",
    tagEn: "Fees",
    tagZh: "學費",
    titleEn: "How to read a school fee schedule",
    titleZh: "如何解讀學校收費表",
    excerptEn:
      "Tuition is rarely the whole cost. A guide to the other line items you'll commonly see — application fees, reservation deposits, capital levies, and what's usually refundable.",
    excerptZh: "學費往往並非唯一開支。本文整理常見的其他收費項目——申請費、留位按金、資本徵費，以及一般哪些屬可退還。",
  },
  {
    id: "choosing-curriculum-for-your-child",
    tagEn: "Choosing a school",
    tagZh: "選校",
    titleEn: "Matching a curriculum to your child, not the other way round",
    titleZh: "為子女配對合適課程,而非反其道而行",
    excerptEn:
      "British, American, IB, or something else — a practical framework for weighing curriculum choice against your child's learning style, university plans, and how long you expect to stay in Hong Kong.",
    excerptZh: "英式、美式、IB，還是其他課程？本文提供實用框架，助你按子女的學習模式、升學計劃，以及在港居住的預期時間，衡量課程選擇。",
  },
  {
    id: "questions-to-ask-open-day",
    tagEn: "School visits",
    tagZh: "校園參觀",
    titleEn: "12 questions worth asking on a school tour",
    titleZh: "校園導覽時值得一問的 12 條問題",
    excerptEn:
      "Beyond exam results, a list of questions about class size, pastoral care, learning support, and transition points that can tell you a lot about day-to-day life at a school.",
    excerptZh: "除了考試成績,本文列出有關班size、學生支援、學習支援及升班銜接的問題,助你更了解學校的日常運作。",
  },
];
