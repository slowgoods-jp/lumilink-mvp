import { useState } from "react";
import Avatar from "../shared/Avatar";
import type { StudentProfile, TeacherProfile } from "../../types";
import TeacherChatTab from "./TeacherChatTab";
import TeacherNotesTab from "./TeacherNotesTab";
import TeacherTasksTab from "./TeacherTasksTab";
import TeacherGrowthTab from "./TeacherGrowthTab";

const TABS = [
  { id: "chat", label: "チャット & AI要約" },
  { id: "notes", label: "メモ・評価" },
  { id: "tasks", label: "タスク管理" },
  { id: "growth", label: "成長記録" },
] as const;

type TabId = (typeof TABS)[number]["id"];

export default function StudentDetail({
  student,
  teacher,
}: {
  student: StudentProfile;
  teacher: TeacherProfile;
}) {
  const [tab, setTab] = useState<TabId>("chat");

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
        <div className="flex items-center gap-3">
          <Avatar name={student.name} color={student.avatarColor} size={40} />
          <div>
            <div className="text-sm font-semibold text-slate-800">{student.name}</div>
            <div className="text-xs text-slate-400">
              {student.grade} ・ {student.className}
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {student.interests.map((i) => (
            <span
              key={i}
              className="rounded-full bg-slate-50 px-2.5 py-1 text-[11px] text-slate-500"
            >
              {i}
            </span>
          ))}
        </div>
      </div>

      <div className="flex gap-1 border-b border-slate-100 px-6">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`relative px-3 py-3 text-sm font-medium transition-colors ${
              tab === t.id ? "text-brand-600" : "text-slate-400 hover:text-slate-600"
            }`}
          >
            {t.label}
            {tab === t.id && (
              <span className="absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-brand-500" />
            )}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-hidden">
        {tab === "chat" && <TeacherChatTab student={student} teacher={teacher} />}
        {tab === "notes" && <TeacherNotesTab student={student} teacher={teacher} />}
        {tab === "tasks" && <TeacherTasksTab student={student} teacher={teacher} />}
        {tab === "growth" && <TeacherGrowthTab student={student} />}
      </div>
    </div>
  );
}
