import type { ReactNode } from "react";
import { ShieldCheck } from "lucide-react";

export default function PageHeader({
  title,
  subtitle,
  actions,
  showSafety = true,
}: {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  showSafety?: boolean;
}) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 px-8 py-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-slate-400">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-2">
        {actions}
        {showSafety && (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-mint-50 px-3 py-1.5 text-xs font-medium text-mint-600">
            <ShieldCheck className="h-3.5 w-3.5" />
            AI安全モニタリング有効
          </span>
        )}
      </div>
    </div>
  );
}
