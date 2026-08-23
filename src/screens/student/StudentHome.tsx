import { ClipboardCheck, MessageCircle, Sparkles, TrendingUp } from "lucide-react";
import PageHeader from "../../components/shared/PageHeader";
import Avatar from "../../components/shared/Avatar";
import { growthData, teachers, useAppState } from "../../store/AppContext";
import type { StudentProfile } from "../../types";

export default function StudentHome({
  student,
  onOpenChat,
}: {
  student: StudentProfile;
  onOpenChat: (teacherId: string) => void;
}) {
  const state = useAppState();
  const myTeachers = teachers.filter((t) => student.teacherIds.includes(t.id));
  const myTasks = state.tasks.filter((t) => t.studentId === student.id);
  const todoCount = myTasks.filter((t) => t.status !== "done").length;
  const growth = growthData[student.id];
  const latestScore = growth ? growth[growth.length - 1] : null;
  const overall = latestScore
    ? Math.round(
        (latestScore.engagement +
          latestScore.communication +
          latestScore.taskCompletion +
          latestScore.wellbeing) /
          4
      )
    : null;

  const recentSummaries = myTeachers
    .flatMap((t) => {
      const conv = state.conversations.find(
        (c) => c.studentId === student.id && c.teacherId === t.id
      );
      const summary = conv ? state.summaries[conv.id]?.[0] : undefined;
      return summary ? [{ teacher: t, summary }] : [];
    })
    .slice(0, 2);

  return (
    <div className="flex h-full flex-col overflow-y-auto">
      <PageHeader title={`おかえりなさい、${student.name}さん`} subtitle={student.className} />

      <div className="grid grid-cols-1 gap-5 px-8 py-6 sm:grid-cols-3">
        <StatCard
          icon={ClipboardCheck}
          label="未完了のタスク"
          value={`${todoCount}件`}
          tone="brand"
        />
        <StatCard
          icon={MessageCircle}
          label="担当教員"
          value={`${myTeachers.length}名`}
          tone="violet"
        />
        <StatCard
          icon={TrendingUp}
          label="総合成長スコア"
          value={overall !== null ? `${overall}` : "-"}
          tone="mint"
        />
      </div>

      <div className="px-8 pb-8">
        <h2 className="mb-3 text-sm font-semibold text-slate-700">担当教員とチャットする</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {myTeachers.map((t) => (
            <button
              key={t.id}
              onClick={() => onOpenChat(t.id)}
              className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm transition-all hover:border-brand-300 hover:shadow-card"
            >
              <Avatar name={t.name} color={t.avatarColor} size={44} />
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-semibold text-slate-800">{t.name}</div>
                <div className="truncate text-xs text-slate-400">{t.subject}</div>
              </div>
              <MessageCircle className="h-4 w-4 shrink-0 text-slate-300" />
            </button>
          ))}
        </div>
      </div>

      {recentSummaries.length > 0 && (
        <div className="px-8 pb-10">
          <h2 className="mb-3 flex items-center gap-1.5 text-sm font-semibold text-slate-700">
            <Sparkles className="h-4 w-4 text-brand-500" />
            最近のAI要約
          </h2>
          <div className="space-y-3">
            {recentSummaries.map(({ teacher, summary }) => (
              <div
                key={summary.id}
                className="rounded-2xl border border-slate-200 bg-slate-50/50 p-4"
              >
                <div className="mb-1.5 flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-400">
                    {teacher.name}先生との会話
                  </span>
                </div>
                <p className="text-sm font-medium text-slate-800">{summary.headline}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: typeof ClipboardCheck;
  label: string;
  value: string;
  tone: "brand" | "violet" | "mint";
}) {
  const toneMap = {
    brand: "bg-brand-50 text-brand-600",
    violet: "bg-violet-50 text-violet-600",
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
