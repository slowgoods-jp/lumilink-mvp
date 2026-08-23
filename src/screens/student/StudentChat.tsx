import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, ClipboardPlus, Sparkles } from "lucide-react";
import ChatView from "../../components/shared/ChatView";
import Avatar from "../../components/shared/Avatar";
import Badge from "../../components/shared/Badge";
import { teachers, useAppDispatch, useAppState } from "../../store/AppContext";
import { generateAutoReply, generateConversationSummary, generateSuggestedTask } from "../../services/aiService";
import type { ChatMessage, StudentProfile } from "../../types";

const moodTone = { positive: "mint", neutral: "slate", concerned: "amber" } as const;

export default function StudentChat({
  student,
  initialTeacherId,
  onTeacherChange,
}: {
  student: StudentProfile;
  initialTeacherId: string | null;
  onTeacherChange: (id: string) => void;
}) {
  const state = useAppState();
  const dispatch = useAppDispatch();
  const myTeachers = teachers.filter((t) => student.teacherIds.includes(t.id));
  const [teacherId, setTeacherId] = useState(initialTeacherId ?? myTeachers[0]?.id ?? "");
  const [typing, setTyping] = useState(false);
  const [summarizing, setSummarizing] = useState(false);
  const [taskGenerating, setTaskGenerating] = useState(false);
  const [taskAddedFlash, setTaskAddedFlash] = useState(false);

  useEffect(() => {
    if (initialTeacherId) setTeacherId(initialTeacherId);
  }, [initialTeacherId]);

  const teacher = teachers.find((t) => t.id === teacherId);
  const conversation = useMemo(
    () => state.conversations.find((c) => c.studentId === student.id && c.teacherId === teacherId),
    [state.conversations, student.id, teacherId]
  );
  const latestSummary = conversation ? state.summaries[conversation.id]?.[0] : undefined;

  function selectTeacher(id: string) {
    setTeacherId(id);
    onTeacherChange(id);
  }

  function handleSend(text: string) {
    if (!conversation) return;
    const msg: ChatMessage = {
      id: `m-${Date.now()}`,
      conversationId: conversation.id,
      sender: "student",
      text,
      createdAt: new Date().toISOString(),
    };
    dispatch({ type: "SEND_MESSAGE", conversationId: conversation.id, message: msg });
    setTyping(true);
    generateAutoReply(text).then((reply) => {
      dispatch({
        type: "SEND_MESSAGE",
        conversationId: conversation.id,
        message: {
          id: `m-${Date.now() + 1}`,
          conversationId: conversation.id,
          sender: "teacher",
          text: reply,
          createdAt: new Date().toISOString(),
        },
      });
      setTyping(false);
    });
  }

  function handleCall(kind: "音声" | "ビデオ") {
    if (!conversation) return;
    const seconds = 30 + Math.floor(Math.random() * 600);
    const mm = Math.floor(seconds / 60);
    const ss = String(seconds % 60).padStart(2, "0");
    dispatch({
      type: "SEND_MESSAGE",
      conversationId: conversation.id,
      message: {
        id: `call-${Date.now()}`,
        conversationId: conversation.id,
        sender: "system",
        text: `${kind}通話 ${mm}:${ss}`,
        createdAt: new Date().toISOString(),
        kind: "call-log",
      },
    });
  }

  async function handleSummarize() {
    if (!conversation || conversation.messages.length === 0) return;
    setSummarizing(true);
    const summary = await generateConversationSummary(conversation.id, conversation.messages);
    dispatch({ type: "ADD_SUMMARY", summary });
    setSummarizing(false);
  }

  async function handleGenerateTask() {
    if (!conversation) return;
    setTaskGenerating(true);
    const task = await generateSuggestedTask(student.id, conversation.id, conversation.messages);
    dispatch({ type: "ADD_TASK", task });
    setTaskGenerating(false);
    setTaskAddedFlash(true);
    setTimeout(() => setTaskAddedFlash(false), 2400);
  }

  if (!teacher || !conversation) return null;

  return (
    <div className="flex h-full">
      <div className="w-64 shrink-0 overflow-y-auto border-r border-slate-100 py-4">
        <div className="px-4 pb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
          担当教員
        </div>
        {myTeachers.map((t) => {
          const conv = state.conversations.find(
            (c) => c.studentId === student.id && c.teacherId === t.id
          );
          const last = conv?.messages[conv.messages.length - 1];
          return (
            <button
              key={t.id}
              onClick={() => selectTeacher(t.id)}
              className={`flex w-full items-center gap-3 px-4 py-3 text-left transition-colors ${
                t.id === teacherId ? "bg-brand-50" : "hover:bg-slate-50"
              }`}
            >
              <Avatar name={t.name} color={t.avatarColor} size={38} />
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-semibold text-slate-800">{t.name}</div>
                <div className="truncate text-xs text-slate-400">
                  {last ? last.text : "会話を始めましょう"}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <div className="flex-1">
        <ChatView
          messages={conversation.messages}
          viewerRole="student"
          partnerName={teacher.name}
          partnerColor={teacher.avatarColor}
          partnerSubLabel={teacher.subject}
          onSend={handleSend}
          onCall={handleCall}
          typing={typing}
        />
      </div>

      <div className="w-80 shrink-0 overflow-y-auto border-l border-slate-100 p-5">
        <div className="mb-3 flex items-center gap-1.5 text-sm font-semibold text-slate-700">
          <Sparkles className="h-4 w-4 text-brand-500" />
          AIアシスト
        </div>

        <button
          onClick={handleSummarize}
          disabled={summarizing}
          className="mb-2 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-slate-800 disabled:opacity-60"
        >
          {summarizing ? (
            <>
              <Spinner /> 要約を生成中...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" /> 会話をAIで要約する
            </>
          )}
        </button>

        <button
          onClick={handleGenerateTask}
          disabled={taskGenerating}
          className="mb-5 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50 disabled:opacity-60"
        >
          {taskGenerating ? (
            <>
              <Spinner dark /> タスクを生成中...
            </>
          ) : (
            <>
              <ClipboardPlus className="h-4 w-4" /> 次のタスクを提案してもらう
            </>
          )}
        </button>

        {taskAddedFlash && (
          <div className="mb-4 flex items-center gap-2 rounded-xl bg-mint-50 px-3 py-2 text-xs font-medium text-mint-600">
            <CheckCircle2 className="h-4 w-4" />
            タスクを追加しました。「タスク」画面で確認できます。
          </div>
        )}

        {latestSummary ? (
          <div className="space-y-3 rounded-2xl border border-slate-200 bg-slate-50/50 p-4">
            <div className="flex items-center justify-between">
              <Badge tone={moodTone[latestSummary.mood]}>{latestSummary.moodLabel}</Badge>
              <span className="text-[11px] text-slate-400">
                {new Date(latestSummary.generatedAt).toLocaleTimeString("ja-JP", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
            <p className="text-sm font-semibold text-slate-800">{latestSummary.headline}</p>
            <ul className="space-y-1.5">
              {latestSummary.bullets.map((b, i) => (
                <li key={i} className="flex gap-1.5 text-xs leading-relaxed text-slate-600">
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-slate-400" />
                  {b}
                </li>
              ))}
            </ul>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {latestSummary.topics.map((t) => (
                <Badge key={t} tone="brand">
                  {t}
                </Badge>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-xs leading-relaxed text-slate-400">
            「会話をAIで要約する」を押すと、この会話の要約とタスク提案が表示されます。
          </p>
        )}
      </div>
    </div>
  );
}

function Spinner({ dark }: { dark?: boolean }) {
  return (
    <span
      className={`h-3.5 w-3.5 animate-spin rounded-full border-2 ${
        dark ? "border-slate-300 border-t-slate-600" : "border-white/30 border-t-white"
      }`}
    />
  );
}
