import { useState } from "react";
import { AlertTriangle, ArrowRight, Sparkles, ThumbsUp } from "lucide-react";
import PageHeader from "../../components/shared/PageHeader";
import GrowthChart from "../../components/shared/GrowthChart";
import { growthData, useAppDispatch, useAppState } from "../../store/AppContext";
import { generateGrowthInsight } from "../../services/aiService";
import type { StudentProfile } from "../../types";

export default function StudentGrowth({ student }: { student: StudentProfile }) {
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
    <div className="flex h-full flex-col overflow-y-auto">
      <PageHeader title="成長記録" subtitle="半年間の活動データをもとにした成長の推移" />

      <div className="px-8 py-6">
        <div className="card-surface rounded-2xl p-6">
          <GrowthChart data={data} />
        </div>
      </div>

      <div className="px-8 pb-10">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="flex items-center gap-1.5 text-sm font-semibold text-slate-700">
            <Sparkles className="h-4 w-4 text-brand-500" />
            AIによる成長分析
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
                次のアクション
              </div>
              <p className="text-xs leading-relaxed text-slate-600">
                {insight.suggestedNextAction}
              </p>
            </div>
          </div>
        ) : (
          <p className="text-xs leading-relaxed text-slate-400">
            「AIに分析してもらう」を押すと、活動データをもとにした振り返りコメントが表示されます。
          </p>
        )}
      </div>
    </div>
  );
}
