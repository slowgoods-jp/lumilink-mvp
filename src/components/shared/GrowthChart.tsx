import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { GrowthPoint } from "../../types";

const SERIES: { key: keyof Omit<GrowthPoint, "month">; label: string; color: string }[] = [
  { key: "engagement", label: "積極性", color: "#2382f5" },
  { key: "communication", label: "対話量", color: "#8b5cf6" },
  { key: "taskCompletion", label: "タスク遂行", color: "#10b981" },
  { key: "wellbeing", label: "心理的安定度", color: "#f59e0b" },
];

export default function GrowthChart({ data }: { data: GrowthPoint[] }) {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 16, left: -16, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis
            dataKey="month"
            tick={{ fontSize: 12, fill: "#94a3b8" }}
            axisLine={{ stroke: "#e2e8f0" }}
            tickLine={false}
          />
          <YAxis
            domain={[0, 100]}
            tick={{ fontSize: 12, fill: "#94a3b8" }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              borderRadius: 12,
              border: "1px solid #eef1f6",
              boxShadow: "0 8px 24px -8px rgba(15,23,42,0.15)",
              fontSize: 13,
            }}
          />
          <Legend
            wrapperStyle={{ fontSize: 12, paddingTop: 12 }}
            iconType="circle"
            iconSize={8}
          />
          {SERIES.map((s) => (
            <Line
              key={s.key}
              type="monotone"
              dataKey={s.key}
              name={s.label}
              stroke={s.color}
              strokeWidth={2.5}
              dot={{ r: 3, strokeWidth: 0, fill: s.color }}
              activeDot={{ r: 5 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
