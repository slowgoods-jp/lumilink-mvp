import type { ReactNode } from "react";

type Tone = "slate" | "brand" | "mint" | "violet" | "amber" | "rose";

const toneClasses: Record<Tone, string> = {
  slate: "bg-slate-100 text-slate-600",
  brand: "bg-brand-50 text-brand-600",
  mint: "bg-mint-50 text-mint-600",
  violet: "bg-violet-50 text-violet-600",
  amber: "bg-amber-50 text-amber-600",
  rose: "bg-rose-50 text-rose-600",
};

export default function Badge({
  children,
  tone = "slate",
  icon,
}: {
  children: ReactNode;
  tone?: Tone;
  icon?: ReactNode;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${toneClasses[tone]}`}
    >
      {icon}
      {children}
    </span>
  );
}
