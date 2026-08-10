export interface FaqEntry {
  id: string;
  questionEn: string;
  questionZh: string;
  answerEn: string;
  answerZh: string;
}

export const FAQ_ENTRIES: FaqEntry[] = [
  {
    id: "what-is-edpdia",
    questionEn: "What is Edpdia?",
    questionZh: "Edpdia 是什麼？",
    answerEn:
      "Edpdia is an independent, encyclopaedia-style directory of Hong Kong international schools. We compile publicly available information — curricula, admissions details, fees, and official links — in one neutral place. We are not a school, agency, or admissions consultant, and we don't charge schools for placement in the directory.",
    answerZh:
      "Edpdia 是一個獨立、百科全書式的香港國際學校名錄。我們將公開資料——包括課程、入學詳情、學費及官方連結——整合於一個中立的平台。我們並非學校、中介或升學顧問，亦不會向學校收取上榜費用。",
  },
  {
    id: "which-schools",
    questionEn: "Which schools are included?",
    questionZh: "名錄涵蓋哪些學校？",
    answerEn:
      "Edpdia covers international schools in Hong Kong only — we do not list local mainstream kindergartens, primary, or secondary schools operating under the Hong Kong local curriculum.",
    answerZh: "Edpdia 只收錄香港的國際學校——不包括採用香港本地課程的主流幼稚園、小學或中學。",
  },
  {
    id: "how-current",
    questionEn: "How current is the information?",
    questionZh: "資料有多新？",
    answerEn:
      "Every school profile shows a \"last verified\" date and a verification status. Fees, deadlines, and other details change from year to year — always confirm directly with the school before making a decision or submitting an application.",
    answerZh: "每個學校頁面均顯示「最後核實日期」及核實狀態。學費、截止日期及其他詳情每年均可能有所變動——作出決定或遞交申請前，請務必直接向學校核實。",
  },
  {
    id: "where-data-from",
    questionEn: "Where does the data come from?",
    questionZh: "資料來源是什麼？",
    answerEn:
      "We prioritise official school websites, with the Wayback Machine archive as a fallback when a live page can't be read. Every fee, deadline, exam result, and destination statistic on a profile links to the specific page it came from, with the date it was accessed.",
    answerZh: "我們優先採用學校官方網站的資料，若未能讀取即時網頁，則以 Wayback Machine 存檔作為後備來源。頁面上每項學費、截止日期、考試成績及升學去向數據，均附有原始資料來源連結及查閱日期。",
  },
  {
    id: "not-published",
    questionEn: "Why does a field say \"Not published\"?",
    questionZh: "為何某些欄位顯示「未公開」？",
    answerEn:
      "We never invent or estimate figures. If a school hasn't published a piece of information anywhere we could find, we show \"Not published\" instead of a guess. This is intentional, not a data-entry gap.",
    answerZh: "我們絕不會臆測或估算數字。若學校未有在任何可查找的地方公開某項資料，我們會顯示「未公開」，而非胡亂估計。這是刻意的做法，並非資料遺漏。",
  },
  {
    id: "what-is-pending-verification",
    questionEn: "What does \"pending verification\" mean?",
    questionZh: "「待核實」代表什麼？",
    answerEn:
      "It means the record hasn't yet been through a second, independent check against the official source. Treat it as a helpful starting point rather than a guaranteed-accurate figure, and cross-check anything decision-critical directly with the school.",
    answerZh: "代表該項資料尚未經第二次獨立核對官方來源。請視之為有用的參考起點，而非保證準確的數字，任何影響決定的資料請直接向學校核實。",
  },
  {
    id: "rankings",
    questionEn: "Do you rank or rate schools?",
    questionZh: "你們會為學校排名或評分嗎？",
    answerEn:
      "No. We deliberately don't score, rate, or rank schools. Every family's priorities are different, so we present facts — curriculum, fees, results where published — and let you weigh them yourself.",
    answerZh: "不會。我們刻意不會為學校評分、評級或排名。每個家庭的考量各有不同，因此我們只呈現事實——課程、學費、已公開的成績等——由你自行衡量。",
  },
  {
    id: "how-compare-works",
    questionEn: "How does the school comparison tool work?",
    questionZh: "學校比較功能如何運作？",
    answerEn:
      "Tick \"Compare\" on up to 4 school cards in the directory, then open the comparison bar to see them side by side. The comparison is saved in the page's web address, so you can bookmark or share it with someone else.",
    answerZh: "在學校名錄中最多勾選 4 所學校的「比較」選項，然後打開比較列即可並排查看。比較結果會儲存在網址中，方便你加入書籤或分享給他人。",
  },
  {
    id: "shortlist-storage",
    questionEn: "Where is my shortlist stored?",
    questionZh: "我的心水學校清單儲存在哪裡？",
    answerEn:
      "Locally in your browser only, using localStorage. We don't have accounts or a server-side database, so your shortlist won't sync across devices and will be lost if you clear your browser data.",
    answerZh: "僅儲存於你瀏覽器的本機儲存空間（localStorage）。我們沒有帳戶系統或伺服器資料庫，因此清單不會在不同裝置間同步，清除瀏覽器資料後亦會消失。",
  },
  {
    id: "found-error",
    questionEn: "I found an error — how do I report it?",
    questionZh: "我發現資料有錯誤，應如何反映？",
    answerEn:
      "Please use the contact form and tell us which school and field is wrong, ideally with a link to the correct official source. We'll review and update it.",
    answerZh: "請使用聯絡表格，告知我們哪所學校及哪項資料有誤，並盡量附上正確的官方資料來源連結。我們會盡快審核並更新。",
  },
];
