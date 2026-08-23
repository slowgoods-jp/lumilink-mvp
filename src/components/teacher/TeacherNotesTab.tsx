import { useState } from "react";
import { Trash2 } from "lucide-react";
import Badge from "../shared/Badge";
import { teachers, useAppDispatch, useAppState } from "../../store/AppContext";
import type { NoteTag, StudentProfile, TeacherProfile } from "../../types";

const TAGS: { tag: NoteTag; tone: "brand" | "amber" | "mint" | "slate" }[] = [
  { tag: "関心", tone: "brand" },
  { tag: "不安", tone: "amber" },
  { tag: "評価", tone: "mint" },
  { tag: "メモ", tone: "slate" },
];

function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString("ja-JP", {
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function TeacherNotesTab({
  student,
  teacher,
}: {
  student: StudentProfile;
  teacher: TeacherProfile;
}) {
  const state = useAppState();
  const dispatch = useAppDispatch();
  const [tag, setTag] = useState<NoteTag>("メモ");
  const [text, setText] = useState("");

  const notes = state.notes
    .filter((n) => n.studentId === student.id)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  function handleSubmit() {
    const trimmed = text.trim();
    if (!trimmed) return;
    dispatch({ type: "ADD_NOTE", studentId: student.id, teacherId: teacher.id, tag, text: trimmed });
    setText("");
  }

  return (
    <div className="flex h-full flex-col overflow-y-auto px-6 py-5">
      <div className="mb-6 rounded-2xl border border-slate-200 bg-slate-50/50 p-4">
        <div className="mb-2 flex flex-wrap gap-1.5">
          {TAGS.map((t) => (
            <button
              key={t.tag}
              onClick={() => setTag(t.tag)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                tag === t.tag
                  ? "bg-slate-900 text-white"
                  : "bg-white text-slate-500 hover:bg-slate-100"
              }`}
            >
              {t.tag}
            </button>
          ))}
        </div>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="学生についての気づき・関心・不安・評価を記録..."
          rows={3}
          className="w-full resize-none rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-800 outline-none focus:border-brand-300"
        />
        <div className="mt-2 flex justify-end">
          <button
            onClick={handleSubmit}
            disabled={!text.trim()}
            className="rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-slate-800 disabled:opacity-40"
          >
            メモを追加
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {notes.length === 0 && (
          <p className="text-center text-xs text-slate-300">まだメモがありません</p>
        )}
        {notes.map((n) => {
          const tone = TAGS.find((t) => t.tag === n.tag)?.tone ?? "slate";
          const author = teachers.find((t) => t.id === n.teacherId);
          return (
            <div key={n.id} className="rounded-2xl border border-slate-200 bg-white p-4">
              <div className="mb-1.5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge tone={tone}>{n.tag}</Badge>
                  <span className="text-[11px] text-slate-400">
                    {author?.name ?? "不明"} ・ {formatDateTime(n.createdAt)}
                  </span>
                </div>
                {n.teacherId === teacher.id && (
                  <button
                    onClick={() => dispatch({ type: "DELETE_NOTE", noteId: n.id })}
                    className="text-slate-300 transition-colors hover:text-rose-500"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
              <p className="text-sm leading-relaxed text-slate-700">{n.text}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
