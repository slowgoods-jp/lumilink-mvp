import { useState } from "react";
import { Bot, Calendar, Sparkles, User } from "lucide-react";
import PageHeader from "../../components/shared/PageHeader";
import Badge from "../../components/shared/Badge";
import { teachers, useAppDispatch, useAppState } from "../../store/AppContext";
import { generateSuggestedTask } from "../../services/aiService";
import type { StudentProfile, StudentTask, TaskStatus } from "../../types";

const COLUMNS: { status: TaskStatus; label: string; tone: "slate" | "brand" | "mint" }[] = [
  { status: "todo", label: "未着手", tone: "slate" },
  { status: "in_progress", label: "進行中", tone: "brand" },
  { status: "done", label: "完了", tone: "mint" },
];

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("ja-JP", { month: "long", day: "numeric" });
}

export default function StudentTasks({ student }: { student: StudentProfile }) {
  const state = useAppState();
  const dispatch = useAppDispatch();
  const [generating, setGenerating] = useState(false);

  const myTasks = state.tasks
    .filter((t) => t.studentId === student.id)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  function cycleStatus(task: StudentTask) {
    const order: TaskStatus[] = ["todo", "in_progress", "done"];
    const next = order[(order.indexOf(task.status) + 1) % order.length];
    dispatch({ type: "SET_TASK_STATUS", taskId: task.id, status: next });
  }

  async function handleGenerate() {
    const activeConv = state.conversations.find(
      (c) => c.studentId === student.id && c.messages.length > 0
    );
    setGenerating(true);
    const task = await generateSuggestedTask(
      student.id,
      activeConv?.id,
      activeConv?.messages ?? []
    );
    dispatch({ type: "ADD_TASK", task });
    setGenerating(false);
  }

  return (
    <div className="flex h-full flex-col overflow-y-auto">
      <PageHeader
        title="タスク"
        subtitle="教員との会話からAIが生成したタスクと、教員から割り当てられたタスク"
        actions={
          <button
            onClick={handleGenerate}
            disabled={generating}
            className="flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-slate-800 disabled:opacity-60"
          >
            <Sparkles className="h-3.5 w-3.5" />
            {generating ? "生成中..." : "AIに新しいタスクを提案してもらう"}
          </button>
        }
      />

      <div className="grid flex-1 grid-cols-1 gap-5 px-8 py-6 sm:grid-cols-3">
        {COLUMNS.map((col) => {
          const items = myTasks.filter((t) => t.status === col.status);
          return (
            <div key={col.status} className="flex flex-col">
              <div className="mb-3 flex items-center gap-2">
                <Badge tone={col.tone}>{col.label}</Badge>
                <span className="text-xs text-slate-400">{items.length}件</span>
              </div>
              <div className="flex flex-1 flex-col gap-3">
                {items.length === 0 && (
                  <div className="rounded-2xl border border-dashed border-slate-200 p-4 text-center text-xs text-slate-300">
                    タスクはありません
                  </div>
                )}
                {items.map((task) => {
                  const teacher = teachers.find(
                    (t) =>
                      t.id ===
                      state.conversations.find((c) => c.id === task.conversationId)?.teacherId
                  );
                  return (
                    <button
                      key={task.id}
                      onClick={() => cycleStatus(task)}
                      className="rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm transition-all hover:border-brand-300 hover:shadow-card"
                    >
                      <div className="mb-2 flex items-center justify-between">
                        <Badge tone={task.origin === "ai" ? "violet" : "slate"}>
                          {task.origin === "ai" ? (
                            <span className="flex items-center gap-1">
                              <Bot className="h-3 w-3" /> AI提案
                            </span>
                          ) : (
                            <span className="flex items-center gap-1">
                              <User className="h-3 w-3" /> 教員
                            </span>
                          )}
                        </Badge>
                        {teacher && (
                          <span className="text-[11px] text-slate-400">{teacher.name}</span>
                        )}
                      </div>
                      <h3 className="text-sm font-semibold text-slate-800">{task.title}</h3>
                      <p className="mt-1 text-xs leading-relaxed text-slate-500">
                        {task.description}
                      </p>
                      <div className="mt-3 flex items-center gap-1 text-[11px] text-slate-400">
                        <Calendar className="h-3 w-3" />
                        期限: {formatDate(task.dueDate)}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
