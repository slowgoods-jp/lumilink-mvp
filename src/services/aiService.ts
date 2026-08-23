import type {
  ChatMessage,
  ConversationSummary,
  GrowthInsight,
  GrowthPoint,
  StudentTask,
} from "../types";

/**
 * デモ用の疑似AIエンジン。
 * 本物のLLM APIに差し替える場合は、この関数群のシグネチャを維持したまま
 * 内部実装をfetch呼び出しに置き換えるだけで良いように設計している。
 */

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const CONCERN_WORDS = ["不安", "心配", "眠れ", "焦り", "つまず", "難しい", "悩"];
const POSITIVE_WORDS = ["ありがとう", "できました", "伸び", "嬉しい", "頑張", "楽しみ", "安心"];

interface KeywordHit {
  word: string;
  count: number;
}

function countKeywords(text: string, dict: string[]): KeywordHit[] {
  return dict
    .map((word) => ({ word, count: (text.match(new RegExp(word, "g")) ?? []).length }))
    .filter((h) => h.count > 0);
}

function extractTopics(messages: ChatMessage[]): string[] {
  const text = messages.map((m) => m.text).join(" ");
  const topicDict: { label: string; patterns: string[] }[] = [
    { label: "海外インターン", patterns: ["インターン", "シンガポール", "海外"] },
    { label: "英語・語学対策", patterns: ["英語", "TOEIC", "面接"] },
    { label: "データ分析/学業", patterns: ["回帰分析", "レポート", "データ分析"] },
    { label: "就職活動", patterns: ["就活", "エントリーシート", "自己PR", "内定"] },
    { label: "起業・キャリア", patterns: ["起業", "ビジネスモデル", "収益"] },
    { label: "メンタル・体調", patterns: ["不安", "眠れ", "焦り", "心配"] },
  ];
  const found = topicDict.filter((t) => t.patterns.some((p) => text.includes(p)));
  return (found.length > 0 ? found : [{ label: "日常的な相談", patterns: [] }]).map((t) => t.label);
}

function detectMood(messages: ChatMessage[]): ConversationSummary["mood"] {
  const studentText = messages
    .filter((m) => m.sender === "student")
    .map((m) => m.text)
    .join(" ");
  const concern = countKeywords(studentText, CONCERN_WORDS).reduce((a, b) => a + b.count, 0);
  const positive = countKeywords(studentText, POSITIVE_WORDS).reduce((a, b) => a + b.count, 0);
  if (concern > positive && concern > 0) return "concerned";
  if (positive > 0) return "positive";
  return "neutral";
}

const moodLabel: Record<ConversationSummary["mood"], string> = {
  positive: "前向き・意欲的",
  neutral: "落ち着いている",
  concerned: "やや不安・要フォロー",
};

export async function generateConversationSummary(
  conversationId: string,
  messages: ChatMessage[]
): Promise<ConversationSummary> {
  await wait(1100);

  const topics = extractTopics(messages);
  const mood = detectMood(messages);
  const studentMsgs = messages.filter((m) => m.sender === "student");
  const teacherMsgs = messages.filter((m) => m.sender === "teacher");

  const bullets: string[] = [];
  if (topics.length > 0) {
    bullets.push(`主な話題: ${topics.join(" / ")}`);
  }
  bullets.push(
    `学生から${studentMsgs.length}件、教員から${teacherMsgs.length}件のメッセージがあり、双方向のやり取りが継続しています。`
  );
  if (mood === "concerned") {
    bullets.push("学生の発言に不安や焦りを示す言葉が見られます。次回のフォローアップを推奨します。");
  } else if (mood === "positive") {
    bullets.push("学生の発言は前向きで、取り組みへの意欲が感じられます。");
  }
  const lastTeacherMsg = [...teacherMsgs].pop();
  if (lastTeacherMsg) {
    bullets.push(`直近の教員からの提案: 「${truncate(lastTeacherMsg.text, 40)}」`);
  }

  const headline =
    mood === "concerned"
      ? `${topics[0]}を中心に相談があり、フォローアップ推奨`
      : `${topics[0]}について具体的な進展が共有された`;

  return {
    id: `sum-${conversationId}-${Date.now()}`,
    conversationId,
    generatedAt: new Date().toISOString(),
    headline,
    bullets,
    topics,
    mood,
    moodLabel: moodLabel[mood],
  };
}

function truncate(text: string, len: number): string {
  return text.length > len ? `${text.slice(0, len)}…` : text;
}

const TASK_TEMPLATES: { match: string[]; title: string; description: string }[] = [
  {
    match: ["面接", "英語"],
    title: "英語面接の想定質問を準備する",
    description: "自己紹介・志望動機・強みを英語で1分にまとめ、声に出して練習する。",
  },
  {
    match: ["回帰分析", "データ分析", "レポート"],
    title: "レポートの分析部分を見直す",
    description: "指摘のあった箇所に自分の言葉で解釈コメントを追記し、再提出する。",
  },
  {
    match: ["インターン"],
    title: "志望動機の下書きを作成する",
    description: "応募先企業ごとに、経験と結びつけた志望動機を200字程度でまとめる。",
  },
  {
    match: ["エントリーシート", "自己PR", "就活"],
    title: "自己PRのバリエーションを増やす",
    description: "企業ごとに異なるエピソードを1つ選び、強みの見せ方を変えて書いてみる。",
  },
  {
    match: ["ビジネスモデル", "起業", "収益"],
    title: "収益シミュレーションを更新する",
    description: "直近の相談内容を踏まえ、想定ユーザー数と単価の仮説を見直す。",
  },
  {
    match: ["不安", "心配", "眠れ"],
    title: "面談で困りごとを言語化して共有する",
    description: "次回の面談までに、不安に感じている点を3つ箇条書きにしておく。",
  },
  {
    match: ["TOEIC", "英語"],
    title: "苦手分野の復習ノートを作る",
    description: "直近の模試やテストで間違えた設問を分類し、復習ノートにまとめる。",
  },
];

export async function generateSuggestedTask(
  studentId: string,
  conversationId: string | undefined,
  messages: ChatMessage[]
): Promise<StudentTask> {
  await wait(900);

  const text = messages.map((m) => m.text).join(" ");
  const template =
    TASK_TEMPLATES.find((t) => t.match.some((k) => text.includes(k))) ?? {
      title: "次回の面談で相談したいことを整理する",
      description: "直近のやり取りを振り返り、次に確認したいポイントをメモしておく。",
    };

  const due = new Date();
  due.setDate(due.getDate() + 7);

  return {
    id: `task-ai-${Date.now()}`,
    studentId,
    conversationId,
    title: template.title,
    description: template.description,
    status: "todo",
    origin: "ai",
    createdAt: new Date().toISOString(),
    dueDate: due.toISOString(),
  };
}

export async function generateGrowthInsight(
  studentId: string,
  studentName: string,
  history: GrowthPoint[]
): Promise<GrowthInsight> {
  await wait(1200);

  const first = history[0];
  const last = history[history.length - 1];
  const deltas = {
    engagement: last.engagement - first.engagement,
    communication: last.communication - first.communication,
    taskCompletion: last.taskCompletion - first.taskCompletion,
    wellbeing: last.wellbeing - first.wellbeing,
  };

  const entries = Object.entries(deltas) as [keyof typeof deltas, number][];
  const sorted = [...entries].sort((a, b) => b[1] - a[1]);
  const labelMap: Record<keyof typeof deltas, string> = {
    engagement: "積極性・関与度",
    communication: "コミュニケーション量",
    taskCompletion: "タスク遂行力",
    wellbeing: "心理的な安定度",
  };

  const strengths = sorted
    .filter(([, v]) => v > 3)
    .slice(0, 2)
    .map(([k, v]) => `${labelMap[k]}が${Math.round(v)}ポイント向上`);

  const watchPoints = sorted
    .filter(([, v]) => v < 0)
    .slice(0, 2)
    .map(([k, v]) => `${labelMap[k]}が${Math.round(Math.abs(v))}ポイント低下傾向`);

  const wellbeingDip = last.wellbeing < 55;

  const summary = `${studentName}さんは直近半年で${
    strengths.length > 0 ? strengths[0] : "安定した取り組み"
  }が見られます。${
    watchPoints.length > 0
      ? `一方で${watchPoints[0]}があり、負荷のかかり方に注意が必要です。`
      : "大きな懸念点は見られません。"
  }`;

  const suggestedNextAction = wellbeingDip
    ? "次回の1on1では学習面だけでなく、負荷や体調面についても声かけを行うことを推奨します。"
    : "現在のペースを維持しつつ、次のチャレンジ(応募・提出物など)の後押しを行うと良いタイミングです。";

  return {
    studentId,
    generatedAt: new Date().toISOString(),
    summary,
    strengths: strengths.length > 0 ? strengths : ["継続的な対話ができています"],
    watchPoints: watchPoints.length > 0 ? watchPoints : ["特筆すべき懸念点はありません"],
    suggestedNextAction,
  };
}

export async function generateAutoReply(studentText: string): Promise<string> {
  await wait(700);
  const replies = [
    "なるほど、詳しく聞かせてくれてありがとう。次のステップを一緒に整理しよう。",
    "いいですね。その調子で進めていきましょう。何か困ったらいつでも相談してください。",
    "承知しました。状況を踏まえて、来週の面談で詳しく話しましょう。",
    "共有してくれてありがとう。無理のないペースで進めていきましょうね。",
  ];
  if (CONCERN_WORDS.some((w) => studentText.includes(w))) {
    return "話してくれてありがとう。一人で抱え込まず、いつでも相談してくださいね。近いうちに時間をとって詳しく聞かせてください。";
  }
  return replies[Math.floor(Math.random() * replies.length)];
}
