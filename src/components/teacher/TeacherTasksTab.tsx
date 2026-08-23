import { useState } from "react";
import { Bot, Calendar, Plus, User } from "lucide-react";
import Badge from "../shared/Badge";
import { useAppDispatch, useAppState } from "../../store/AppContext";
import type { StudentProfile, StudentTask, TaskStatus, TeacherProfile } from "../../types";

const COLUMNS: { status: TaskStatus; label: string; tone: "slate" | "brand" | "mint" }[] = [
  { status: "todo", label: "未着手", tone: "slate" },
  { status: "in_progress", label: "進行中", tone: "brand" },
  { status: "done", label: "完了", tone: "mint" },
];

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("ja-JP", { month: "long", day: "numeric" });
}

export default function TeacherTasksTab({
  student,
  teacher,
}: {
  student: StudentProfile;
  teacher: TeacherProfile;
}) {
  const state = useAppState();
  const dispatch = useAppDispatch();
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const conversation = state.conversations.find(
    (c) => c.studentId === student.id && c.teacherId === teacher.id
  );

  const tasks = state.tasks
    .filter((t) => t.studentId === student.id)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  function cycleStatus(task: StudentTask) {
    const order: TaskStatus[] = ["todo", "in_progress", "done"];
    const next = order[(order.indexOf(task.status) + 1) % order.length];
    dispatch({ type: "SET_TASK_STATUS", taskId: task.id, status: next });
  }

  function handleAdd() {
    if (!title.trim()) return;
    const due = new Date();
    due.setDate(due.getDate() + 7);
    dispatch({
      type: "ADD_TASK",
      task: {
        id: `task-${Date.now()}`,
        studentId: student.id,
        conversationId: conversation?.id,
        title: title.trim(),
        description: description.trim(),
        status: "todo",
        origin: "teacher",
        createdAt: new Date().toISOString(),
        dueDate: due.toISOString(),
      },
    });
    setTitle("");
    setDescription("");
    setShowForm(false);
  }

  return (
    <div className="flex h-full flex-col overflow-y-auto px-6 py-5">
      <div className="mb-5 flex items-center justify-between">
        <p className="text-xs text-slate-400">{student.name}さんに関するタスク一覧</p>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="flex items-center gap-1.5 rounded-xl bg-slate-900 px-3.5 py-2 text-xs font-semibold text-white transition-colors hover:bg-slate-800"
        >
          <Plus className="h-3.5 w-3.5" />
          タスクを割り当てる
        </button>
      </div>

      {showForm && (
        <div className="mb-6 rounded-2xl border border-slate-200 bg-slate-50/50 p-4">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="タスクのタイトル"
            className="mb-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-brand-300"
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="詳細（任意）"
            rows={2}
            className="mb-2 w-full resize-none rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-brand-300"
          />
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setShowForm(false)}
              className="rounded-xl px-3.5 py-2 text-xs font-medium text-slate-400 hover:bg-slate-100"
            >
              キャンセル
            </button>
            <button
              onClick={handleAdd}
              disabled={!title.trim()}
              className="rounded-xl bg-brand-500 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-brand-600 disabled:opacity-40"
            >
              追加する
            </button>
          </div>
        </div>
      )}

      <div className="grid flex-1 grid-cols-1 gap-5 sm:grid-cols-3">
        {COLUMNS.map((col) => {
          const items = tasks.filter((t) => t.status === col.status);
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
                {items.map((task) => (
                  <button
                    key={task.id}
                    onClick={() => cycleStatus(task)}
                    className="rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm transition-all hover:border-brand-300 hover:shadow-card"
                  >
                    <div className="mb-2">
                      <Badge tone={task.origin === "ai" ? "violet" : "slate"}>
                        {task.origin === "ai" ? (
                          <span className="flex items-center gap-1">
                            <Bot className="h-3 w-3" /> AI提案
                          </span>
                        ) : (
                          <span className="flex items-center gap-1">
                            <User className="h-3 w-3" /> 教員割当
                          </span>
                        )}
                      </Badge>
                    </div>
                    <h3 className="text-sm font-semibold text-slate-800">{task.title}</h3>
                    {task.description && (
                      <p className="mt-1 text-xs leading-relaxed text-slate-500">
                        {task.description}
                      </p>
                    )}
                    <div className="mt-3 flex items-center gap-1 text-[11px] text-slate-400">
                      <Calendar className="h-3 w-3" />
                      期限: {formatDate(task.dueDate)}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
