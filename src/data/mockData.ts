import type {
  ChatMessage,
  Conversation,
  GrowthPoint,
  StudentProfile,
  StudentTask,
  TeacherNote,
  TeacherProfile,
} from "../types";

export const teachers: TeacherProfile[] = [
  {
    id: "t1",
    name: "佐藤 直樹",
    kana: "さとう なおき",
    subject: "経営学 / ゼミ担当",
    avatarColor: "#2382f5",
    studentIds: ["s1", "s2", "s3"],
  },
  {
    id: "t2",
    name: "中村 恵子",
    kana: "なかむら けいこ",
    subject: "国際関係論",
    avatarColor: "#8b5cf6",
    studentIds: ["s1", "s3"],
  },
];

export const students: StudentProfile[] = [
  {
    id: "s1",
    name: "岡本 波音",
    kana: "おかもと はのん",
    grade: "3年",
    className: "経営学部 グローバルマネジメント学科",
    avatarColor: "#10b981",
    interests: ["海外インターン", "マーケティング", "データ分析"],
    teacherIds: ["t1", "t2"],
  },
  {
    id: "s2",
    name: "山田 蓮",
    kana: "やまだ れん",
    grade: "2年",
    className: "経営学部 経営学科",
    avatarColor: "#f59e0b",
    interests: ["起業", "プログラミング"],
    teacherIds: ["t1"],
  },
  {
    id: "s3",
    name: "鈴木 心",
    kana: "すずき こころ",
    grade: "4年",
    className: "経営学部 グローバルマネジメント学科",
    avatarColor: "#ef4444",
    interests: ["就職活動", "英語学習"],
    teacherIds: ["t1", "t2"],
  },
];

function iso(daysAgo: number, hour: number, minute: number): string {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  d.setHours(hour, minute, 0, 0);
  return d.toISOString();
}

export const conversations: Conversation[] = [
  {
    id: "c-s1-t1",
    studentId: "s1",
    teacherId: "t1",
    messages: [],
  },
  {
    id: "c-s1-t2",
    studentId: "s1",
    teacherId: "t2",
    messages: [],
  },
  {
    id: "c-s2-t1",
    studentId: "s2",
    teacherId: "t1",
    messages: [],
  },
  {
    id: "c-s3-t1",
    studentId: "s3",
    teacherId: "t1",
    messages: [],
  },
  {
    id: "c-s3-t2",
    studentId: "s3",
    teacherId: "t2",
    messages: [],
  },
];

export const messages: ChatMessage[] = [
  // c-s1-t1: 岡本波音 x 佐藤先生
  { id: "m1", conversationId: "c-s1-t1", sender: "teacher", text: "波音さん、先週相談してた海外インターンの件、その後どう？応募先は決まった？", createdAt: iso(3, 9, 5) },
  { id: "m2", conversationId: "c-s1-t1", sender: "student", text: "はい！シンガポールのマーケティング企業に2社応募しました。ただ面接がすべて英語らしくて少し不安です…", createdAt: iso(3, 9, 12) },
  { id: "m3", conversationId: "c-s1-t1", sender: "teacher", text: "いいね、行動が早い！英語面接は模擬練習を一緒にやろう。今週の空きコマで大丈夫？", createdAt: iso(3, 9, 15) },
  { id: "m4", conversationId: "c-s1-t1", sender: "student", text: "ありがとうございます、木曜の3限が空いてます。あと、データ分析の授業でつまずいていて、それも相談したいです。", createdAt: iso(3, 9, 20) },
  { id: "m5", conversationId: "c-s1-t1", sender: "teacher", text: "了解、木曜3限でおさえておくね。データ分析はどの部分？", createdAt: iso(3, 9, 24) },
  { id: "m6", conversationId: "c-s1-t1", sender: "student", text: "回帰分析の解釈が曖昧なままレポートを書いてしまっていて…評価が少し心配です。", createdAt: iso(3, 9, 27) },
  { id: "m7", conversationId: "c-s1-t1", sender: "teacher", text: "わかった、木曜にまとめて見よう。無理せず一つずつ進めていこうね。", createdAt: iso(3, 9, 30) },
  { id: "m8", conversationId: "c-s1-t1", sender: "student", text: "ありがとうございます、少し安心しました！", createdAt: iso(2, 18, 40) },
  { id: "m9", conversationId: "c-s1-t1", sender: "system", text: "音声通話 12:34", createdAt: iso(1, 15, 0), kind: "call-log" },
  { id: "m10", conversationId: "c-s1-t1", sender: "teacher", text: "さっきの通話の続きだけど、インターンの志望動機、たたき台ができたら送ってね。", createdAt: iso(1, 15, 20) },
  { id: "m11", conversationId: "c-s1-t1", sender: "student", text: "はい、今週中に下書きを送ります！", createdAt: iso(1, 15, 25) },

  // c-s1-t2: 岡本波音 x 中村先生
  { id: "m12", conversationId: "c-s1-t2", sender: "teacher", text: "国際関係論のレポート、テーマは決まった？", createdAt: iso(5, 10, 0) },
  { id: "m13", conversationId: "c-s1-t2", sender: "student", text: "ASEANの経済統合と日系企業の進出戦略について書こうと思っています。", createdAt: iso(5, 10, 6) },
  { id: "m14", conversationId: "c-s1-t2", sender: "teacher", text: "面白いテーマだね。参考文献を3つほど送るので、来週までに構成案を見せてほしいな。", createdAt: iso(5, 10, 10) },
  { id: "m15", conversationId: "c-s1-t2", sender: "student", text: "ありがとうございます！シンガポールのインターン選考とも関連づけられそうなので頑張ります。", createdAt: iso(5, 10, 14) },

  // c-s2-t1: 山田蓮 x 佐藤先生
  { id: "m16", conversationId: "c-s2-t1", sender: "student", text: "先生、起業サークルの活動で試作したアプリのビジネスモデルについて相談したいです。", createdAt: iso(2, 13, 0) },
  { id: "m17", conversationId: "c-s2-t1", sender: "teacher", text: "いいね、聞かせて。収益化のイメージはある？", createdAt: iso(2, 13, 5) },
  { id: "m18", conversationId: "c-s2-t1", sender: "student", text: "サブスク型を考えていますが、正直プログラミングの実装で手一杯で計画がまだ甘いです…最近少し焦りもあります。", createdAt: iso(2, 13, 9) },
  { id: "m19", conversationId: "c-s2-t1", sender: "teacher", text: "焦らなくて大丈夫。まず簡単な収益シミュレーションのフォーマットを送るから、それを埋めるところから始めよう。", createdAt: iso(2, 13, 14) },
  { id: "m20", conversationId: "c-s2-t1", sender: "student", text: "助かります、やってみます！", createdAt: iso(2, 13, 16) },
  { id: "m21", conversationId: "c-s2-t1", sender: "student", text: "先生、収益シミュレーション作ってみました。来週見ていただけますか？", createdAt: iso(0, 8, 30) },

  // c-s3-t1: 鈴木心 x 佐藤先生
  { id: "m22", conversationId: "c-s3-t1", sender: "teacher", text: "心さん、就活の進捗どう？エントリーシートは書けてる？", createdAt: iso(4, 11, 0) },
  { id: "m23", conversationId: "c-s3-t1", sender: "student", text: "3社分書いたのですが、自己PRがどれも似た内容になってしまって…添削していただけませんか。", createdAt: iso(4, 11, 8) },
  { id: "m24", conversationId: "c-s3-t1", sender: "teacher", text: "もちろん。データで送ってくれれば今週中にコメント入れて返すよ。", createdAt: iso(4, 11, 12) },
  { id: "m25", conversationId: "c-s3-t1", sender: "student", text: "ありがとうございます、助かります。正直、内定が出るか不安で夜眠れないこともあります。", createdAt: iso(4, 11, 18) },
  { id: "m26", conversationId: "c-s3-t1", sender: "teacher", text: "その気持ち分かるよ。一人で抱え込まないで、進捗はこまめに共有してね。キャリアセンターの面談も予約しておこう。", createdAt: iso(4, 11, 24) },
  { id: "m27", conversationId: "c-s3-t1", sender: "student", text: "ありがとうございます、少し気が楽になりました。", createdAt: iso(4, 11, 27) },

  // c-s3-t2: 鈴木心 x 中村先生
  { id: "m28", conversationId: "c-s3-t2", sender: "teacher", text: "TOEIC対策の進捗はどう？", createdAt: iso(6, 9, 0) },
  { id: "m29", conversationId: "c-s3-t2", sender: "student", text: "毎日1時間は続けていて、模試では750点まで伸びました！", createdAt: iso(6, 9, 5) },
  { id: "m30", conversationId: "c-s3-t2", sender: "teacher", text: "素晴らしい伸びだね！このペースで続けよう。", createdAt: iso(6, 9, 9) },
];

export function seedConversations(): Conversation[] {
  return conversations.map((c) => ({
    ...c,
    messages: messages.filter((m) => m.conversationId === c.id),
  }));
}

export const initialTasks: StudentTask[] = [
  {
    id: "task1",
    studentId: "s1",
    conversationId: "c-s1-t1",
    title: "英語面接の模擬練習に参加する",
    description: "木曜3限に佐藤先生と模擬面接。想定質問リストを事前に3つ考えておく。",
    status: "todo",
    origin: "ai",
    createdAt: iso(3, 9, 32),
    dueDate: iso(-2, 0, 0),
  },
  {
    id: "task2",
    studentId: "s1",
    conversationId: "c-s1-t1",
    title: "回帰分析レポートの該当箇所を見直す",
    description: "回帰係数の解釈部分にコメントを付けて木曜の面談までに再提出。",
    status: "in_progress",
    origin: "ai",
    createdAt: iso(3, 9, 33),
    dueDate: iso(-1, 0, 0),
  },
  {
    id: "task3",
    studentId: "s1",
    conversationId: "c-s1-t1",
    title: "インターン志望動機の下書きを提出",
    description: "シンガポールのマーケティング企業2社向けの志望動機を下書きし佐藤先生に共有する。",
    status: "todo",
    origin: "teacher",
    createdAt: iso(1, 15, 26),
    dueDate: iso(-4, 0, 0),
  },
  {
    id: "task4",
    studentId: "s1",
    conversationId: "c-s1-t2",
    title: "レポート構成案を作成する",
    description: "ASEAN経済統合と日系企業進出戦略についての構成案をまとめる。",
    status: "done",
    origin: "teacher",
    createdAt: iso(5, 10, 15),
    dueDate: iso(-1, 0, 0),
  },
  {
    id: "task5",
    studentId: "s2",
    conversationId: "c-s2-t1",
    title: "収益シミュレーションのフォーマットを埋める",
    description: "サブスク型モデルの単価・想定ユーザー数・解約率を仮置きして試算する。",
    status: "done",
    origin: "teacher",
    createdAt: iso(2, 13, 15),
    dueDate: iso(-3, 0, 0),
  },
  {
    id: "task6",
    studentId: "s2",
    conversationId: "c-s2-t1",
    title: "ビジネスモデルの壁打ち面談を予約する",
    description: "収益シミュレーションを踏まえ、佐藤先生との壁打ち面談枠を確保する。",
    status: "todo",
    origin: "ai",
    createdAt: iso(0, 8, 31),
    dueDate: iso(-5, 0, 0),
  },
  {
    id: "task7",
    studentId: "s3",
    conversationId: "c-s3-t1",
    title: "自己PRを3パターンに差別化する",
    description: "エピソードの切り口を変え、企業ごとに異なる強みを打ち出す。",
    status: "in_progress",
    origin: "teacher",
    createdAt: iso(4, 11, 13),
    dueDate: iso(-2, 0, 0),
  },
  {
    id: "task8",
    studentId: "s3",
    conversationId: "c-s3-t1",
    title: "キャリアセンター面談を予約する",
    description: "就活の不安について相談するため、キャリアセンターの面談枠を予約する。",
    status: "todo",
    origin: "ai",
    createdAt: iso(4, 11, 28),
    dueDate: iso(-3, 0, 0),
  },
  {
    id: "task9",
    studentId: "s3",
    conversationId: "c-s3-t2",
    title: "TOEIC模試の復習ノートをまとめる",
    description: "750点だった模試の間違えた設問を分類し復習ノートを作成する。",
    status: "todo",
    origin: "ai",
    createdAt: iso(6, 9, 10),
    dueDate: iso(-6, 0, 0),
  },
];

export const initialNotes: TeacherNote[] = [
  {
    id: "note1",
    studentId: "s1",
    teacherId: "t1",
    tag: "関心",
    text: "海外インターン(シンガポール)への意欲が高い。マーケティング分野に強い関心。行動も早く自走できるタイプ。",
    createdAt: iso(3, 9, 40),
  },
  {
    id: "note2",
    studentId: "s1",
    teacherId: "t1",
    tag: "不安",
    text: "英語面接への不安と、データ分析(回帰分析)の理解不足を同時に抱えている。負荷が重ならないよう優先順位を一緒に整理したい。",
    createdAt: iso(3, 9, 41),
  },
  {
    id: "note3",
    studentId: "s1",
    teacherId: "t1",
    tag: "評価",
    text: "課題への着手が早く、相談のタイミングも適切。木曜の面談で回帰分析とインターン対策を並行支援する。",
    createdAt: iso(1, 15, 30),
  },
  {
    id: "note4",
    studentId: "s2",
    teacherId: "t1",
    tag: "不安",
    text: "起業アイデアへの熱意はあるが、実装作業に時間を取られ計画部分が手薄。焦りが見える発言あり、要フォロー。",
    createdAt: iso(2, 13, 20),
  },
  {
    id: "note5",
    studentId: "s2",
    teacherId: "t1",
    tag: "評価",
    text: "収益シミュレーションを期限内に完成させた。計画立案への抵抗感が薄れてきている様子。",
    createdAt: iso(0, 8, 35),
  },
  {
    id: "note6",
    studentId: "s3",
    teacherId: "t1",
    tag: "不安",
    text: "就職活動に強いプレッシャーを感じており、睡眠にも影響が出ている発言あり。メンタル面のケアを優先し、キャリアセンターと連携予定。",
    createdAt: iso(4, 11, 29),
  },
  {
    id: "note7",
    studentId: "s3",
    teacherId: "t2",
    tag: "評価",
    text: "TOEICスコアが順調に伸びている(720→750)。継続的な努力が成果に結びついている好例。",
    createdAt: iso(6, 9, 12),
  },
];

function buildGrowth(base: {
  engagement: number;
  communication: number;
  taskCompletion: number;
  wellbeing: number;
}, deltas: Partial<GrowthPoint>[]): GrowthPoint[] {
  const months = ["3月", "4月", "5月", "6月", "7月", "8月"];
  let cur = { ...base };
  return months.map((month, i) => {
    const d = deltas[i] ?? {};
    cur = {
      engagement: Math.max(0, Math.min(100, cur.engagement + (d.engagement ?? 0))),
      communication: Math.max(0, Math.min(100, cur.communication + (d.communication ?? 0))),
      taskCompletion: Math.max(0, Math.min(100, cur.taskCompletion + (d.taskCompletion ?? 0))),
      wellbeing: Math.max(0, Math.min(100, cur.wellbeing + (d.wellbeing ?? 0))),
    };
    return { month, ...cur };
  });
}

export const growthData: Record<string, GrowthPoint[]> = {
  s1: buildGrowth(
    { engagement: 58, communication: 55, taskCompletion: 50, wellbeing: 62 },
    [
      {},
      { engagement: 6, communication: 4, taskCompletion: 8, wellbeing: 2 },
      { engagement: 5, communication: 7, taskCompletion: 6, wellbeing: -3 },
      { engagement: 8, communication: 5, taskCompletion: 10, wellbeing: -5 },
      { engagement: 4, communication: 6, taskCompletion: 5, wellbeing: 4 },
      { engagement: 3, communication: 5, taskCompletion: 4, wellbeing: 6 },
    ]
  ),
  s2: buildGrowth(
    { engagement: 45, communication: 40, taskCompletion: 35, wellbeing: 58 },
    [
      {},
      { engagement: 3, communication: 2, taskCompletion: 4, wellbeing: -4 },
      { engagement: 5, communication: 6, taskCompletion: 3, wellbeing: -8 },
      { engagement: 7, communication: 5, taskCompletion: 12, wellbeing: 2 },
      { engagement: 6, communication: 4, taskCompletion: 9, wellbeing: 6 },
      { engagement: 4, communication: 5, taskCompletion: 8, wellbeing: 5 },
    ]
  ),
  s3: buildGrowth(
    { engagement: 62, communication: 66, taskCompletion: 60, wellbeing: 55 },
    [
      {},
      { engagement: 2, communication: 3, taskCompletion: 5, wellbeing: -6 },
      { engagement: -3, communication: 1, taskCompletion: 2, wellbeing: -10 },
      { engagement: 4, communication: 5, taskCompletion: 6, wellbeing: -4 },
      { engagement: 6, communication: 4, taskCompletion: 8, wellbeing: 5 },
      { engagement: 5, communication: 6, taskCompletion: 7, wellbeing: 8 },
    ]
  ),
};
