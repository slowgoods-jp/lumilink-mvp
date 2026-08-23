export type Role = "student" | "teacher";

export interface StudentProfile {
  id: string;
  name: string;
  kana: string;
  grade: string;
  className: string;
  avatarColor: string;
  interests: string[];
  teacherIds: string[];
}

export interface TeacherProfile {
  id: string;
  name: string;
  kana: string;
  subject: string;
  avatarColor: string;
  studentIds: string[];
}

export type MessageSender = "student" | "teacher" | "system";

export interface ChatMessage {
  id: string;
  conversationId: string;
  sender: MessageSender;
  text: string;
  createdAt: string;
  kind?: "text" | "call-log";
}

export interface Conversation {
  id: string;
  studentId: string;
  teacherId: string;
  messages: ChatMessage[];
}

export interface ConversationSummary {
  id: string;
  conversationId: string;
  generatedAt: string;
  headline: string;
  bullets: string[];
  topics: string[];
  mood: "positive" | "neutral" | "concerned";
  moodLabel: string;
}

export type TaskStatus = "todo" | "in_progress" | "done";
export type TaskOrigin = "ai" | "teacher";

export interface StudentTask {
  id: string;
  studentId: string;
  conversationId?: string;
  title: string;
  description: string;
  status: TaskStatus;
  origin: TaskOrigin;
  createdAt: string;
  dueDate: string;
}

export type NoteTag = "関心" | "不安" | "評価" | "メモ";

export interface TeacherNote {
  id: string;
  studentId: string;
  teacherId: string;
  tag: NoteTag;
  text: string;
  createdAt: string;
}

export interface GrowthPoint {
  month: string;
  engagement: number;
  communication: number;
  taskCompletion: number;
  wellbeing: number;
}

export interface GrowthInsight {
  studentId: string;
  generatedAt: string;
  summary: string;
  strengths: string[];
  watchPoints: string[];
  suggestedNextAction: string;
}
