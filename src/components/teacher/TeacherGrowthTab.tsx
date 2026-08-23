import { useState } from "react";
import { AlertTriangle, ArrowRight, Sparkles, ThumbsUp } from "lucide-react";
import GrowthChart from "../shared/GrowthChart";
import { growthData, useAppDispatch, useAppState } from "../../store/AppContext";
import { generateGrowthInsight } from "../../services/aiService";
import type { StudentProfile } from "../../types";

export default function TeacherGrowthTab({ student }: { student: StudentProfile }) {
  const state = useAppState();
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const data = growthData[student.id] ?? [];
  const insight = state.growthInsights[student.id];

  async function handleGenerate() {
    setLoading(true);
    const result = await generateGrowthInsight(student.id, student.name, data);
    dispatch({ type: "SET_GROWTH_INSIGHT", insight: result });
    setLoading(false);
  }

  return (
    <div className="h-full overflow-y-auto px-6 py-5">
      <div className="card-surface mb-6 rounded-2xl p-6">
        <GrowthChart data={data} />
      </div>

      <div className="mb-3 flex items-center justify-between">
        <h2 className="flex items-center gap-1.5 text-sm font-semibold text-slate-700">
          <Sparkles className="h-4 w-4 text-brand-500" />
          AIによる{student.name}さんの成長分析
        </h2>
        <button
          onClick={handleGenerate}
          disabled={loading}
          className="flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-slate-800 disabled:opacity-60"
        >
          {loading ? "分析中..." : insight ? "再分析する" : "AIに分析してもらう"}
        </button>
      </div>

      {insight ? (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="card-surface rounded-2xl p-5 lg:col-span-3">
            <p className="text-sm leading-relaxed text-slate-700">{insight.summary}</p>
          </div>
          <div className="rounded-2xl border border-mint-100 bg-mint-50/50 p-5">
            <div className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-mint-700">
              <ThumbsUp className="h-4 w-4" />
              良い傾向
            </div>
            <ul className="space-y-1.5 text-xs leading-relaxed text-slate-600">
              {insight.strengths.map((s, i) => (
                <li key={i}>・{s}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-amber-100 bg-amber-50/50 p-5">
            <div className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-amber-700">
              <AlertTriangle className="h-4 w-4" />
              注意ポイント
            </div>
            <ul className="space-y-1.5 text-xs leading-relaxed text-slate-600">
              {insight.watchPoints.map((s, i) => (
                <li key={i}>・{s}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-brand-100 bg-brand-50/50 p-5">
            <div className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-brand-700">
              <ArrowRight className="h-4 w-4" />
              推奨する次のアクション
            </div>
            <p className="text-xs leading-relaxed text-slate-600">
              {insight.suggestedNextAction}
            </p>
          </div>
        </div>
      ) : (
        <p className="text-xs leading-relaxed text-slate-400">
          「AIに分析してもらう」を押すと、この学生の活動データをもとにした分析コメントが表示されます。
        </p>
      )}
    </div>
  );
}
