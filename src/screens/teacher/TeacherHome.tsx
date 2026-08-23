import { AlertTriangle, ClipboardList, MessageCircle, Users } from "lucide-react";
import PageHeader from "../../components/shared/PageHeader";
import Avatar from "../../components/shared/Avatar";
import Badge from "../../components/shared/Badge";
import { growthData, students, useAppState } from "../../store/AppContext";
import type { TeacherProfile } from "../../types";

export default function TeacherHome({
  teacher,
  onOpenStudent,
}: {
  teacher: TeacherProfile;
  onOpenStudent: (id: string) => void;
}) {
  const state = useAppState();
  const myStudents = students.filter((s) => teacher.studentIds.includes(s.id));

  function needsFollowUp(studentId: string): boolean {
    const growth = growthData[studentId];
    const wellbeingDip = growth ? growth[growth.length - 1].wellbeing < 55 : false;
    const conv = state.conversations.find(
      (c) => c.studentId === studentId && c.teacherId === teacher.id
    );
    const concernedSummary = conv
      ? state.summaries[conv.id]?.[0]?.mood === "concerned"
      : false;
    return wellbeingDip || concernedSummary;
  }

  const followUpCount = myStudents.filter((s) => needsFollowUp(s.id)).length;
  const pendingTasks = state.tasks.filter(
    (t) => myStudents.some((s) => s.id === t.studentId) && t.status !== "done"
  ).length;

  return (
    <div className="flex h-full flex-col overflow-y-auto">
      <PageHeader title={`${teacher.name}先生、こんにちは`} subtitle={teacher.subject} />

      <div className="grid grid-cols-1 gap-5 px-8 py-6 sm:grid-cols-3">
        <StatCard icon={Users} label="担当学生数" value={`${myStudents.length}名`} tone="brand" />
        <StatCard
          icon={AlertTriangle}
          label="要フォローの学生"
          value={`${followUpCount}名`}
          tone="amber"
        />
        <StatCard
          icon={ClipboardList}
          label="未完了タスク合計"
          value={`${pendingTasks}件`}
          tone="mint"
        />
      </div>

      <div className="px-8 pb-10">
        <h2 className="mb-3 text-sm font-semibold text-slate-700">担当学生</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {myStudents.map((s) => {
            const conv = state.conversations.find(
              (c) => c.studentId === s.id && c.teacherId === teacher.id
            );
            const last = conv?.messages[conv.messages.length - 1];
            const follow = needsFollowUp(s.id);
            return (
              <button
                key={s.id}
                onClick={() => onOpenStudent(s.id)}
                className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm transition-all hover:border-brand-300 hover:shadow-card"
              >
                <div className="flex items-center gap-3">
                  <Avatar name={s.name} color={s.avatarColor} size={44} />
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-semibold text-slate-800">{s.name}</div>
                    <div className="truncate text-xs text-slate-400">
                      {s.grade} ・ {s.className}
                    </div>
                  </div>
                  {follow && (
                    <Badge tone="amber" icon={<AlertTriangle className="h-3 w-3" />}>
                      要フォロー
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                  <MessageCircle className="h-3.5 w-3.5 shrink-0" />
                  <span className="truncate">
                    {last ? last.text : "まだ会話がありません"}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: typeof Users;
  label: string;
  value: string;
  tone: "brand" | "amber" | "mint";
}) {
  const toneMap = {
    brand: "bg-brand-50 text-brand-600",
    amber: "bg-amber-50 text-amber-600",
    mint: "bg-mint-50 text-mint-600",
  };
  return (
    <div className="card-surface rounded-2xl p-5">
      <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl ${toneMap[tone]}`}>
        <Icon className="h-5 w-5" />
      </div>
      <div className="text-2xl font-bold text-slate-900">{value}</div>
      <div className="mt-0.5 text-xs text-slate-400">{label}</div>
    </div>
  );
}
