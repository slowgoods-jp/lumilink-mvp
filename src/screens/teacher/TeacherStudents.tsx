import { useEffect } from "react";
import { AlertTriangle, Users as UsersIcon } from "lucide-react";
import Avatar from "../../components/shared/Avatar";
import Badge from "../../components/shared/Badge";
import { growthData, students, useAppState } from "../../store/AppContext";
import type { TeacherProfile } from "../../types";
import StudentDetail from "../../components/teacher/StudentDetail";

export default function TeacherStudents({
  teacher,
  selectedStudentId,
  onSelectStudent,
}: {
  teacher: TeacherProfile;
  selectedStudentId: string | null;
  onSelectStudent: (id: string) => void;
}) {
  const state = useAppState();
  const myStudents = students.filter((s) => teacher.studentIds.includes(s.id));

  useEffect(() => {
    if (!selectedStudentId && myStudents.length > 0) {
      onSelectStudent(myStudents[0].id);
    }
  }, [selectedStudentId, myStudents, onSelectStudent]);

  const selected = students.find((s) => s.id === selectedStudentId) ?? null;

  return (
    <div className="flex h-full">
      <div className="w-72 shrink-0 overflow-y-auto border-r border-slate-100 py-4">
        <div className="px-4 pb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
          担当学生 ({myStudents.length}名)
        </div>
        {myStudents.map((s) => {
          const growth = growthData[s.id];
          const wellbeingDip = growth ? growth[growth.length - 1].wellbeing < 55 : false;
          const conv = state.conversations.find(
            (c) => c.studentId === s.id && c.teacherId === teacher.id
          );
          const concerned = conv ? state.summaries[conv.id]?.[0]?.mood === "concerned" : false;
          const follow = wellbeingDip || concerned;
          return (
            <button
              key={s.id}
              onClick={() => onSelectStudent(s.id)}
              className={`flex w-full items-center gap-3 px-4 py-3 text-left transition-colors ${
                s.id === selectedStudentId ? "bg-brand-50" : "hover:bg-slate-50"
              }`}
            >
              <Avatar name={s.name} color={s.avatarColor} size={38} />
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-semibold text-slate-800">{s.name}</div>
                <div className="truncate text-xs text-slate-400">
                  {s.grade} ・ {s.className}
                </div>
              </div>
              {follow && <AlertTriangle className="h-4 w-4 shrink-0 text-amber-500" />}
            </button>
          );
        })}
      </div>

      <div className="flex-1 overflow-hidden">
        {selected ? (
          <StudentDetail student={selected} teacher={teacher} />
        ) : (
          <div className="flex h-full flex-col items-center justify-center text-slate-300">
            <UsersIcon className="mb-2 h-8 w-8" />
            <Badge tone="slate">学生を選択してください</Badge>
          </div>
        )}
      </div>
    </div>
  );
}
