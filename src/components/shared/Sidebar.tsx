import { LogOut, Link2 } from "lucide-react";
import Avatar from "./Avatar";

export interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface Props {
  items: NavItem[];
  activeId: string;
  onSelect: (id: string) => void;
  userName: string;
  userSubLabel: string;
  userColor: string;
  onLogout: () => void;
}

export default function Sidebar({
  items,
  activeId,
  onSelect,
  userName,
  userSubLabel,
  userColor,
  onLogout,
}: Props) {
  return (
    <aside className="flex h-screen w-64 shrink-0 flex-col border-r border-slate-100 bg-white">
      <div className="flex items-center gap-2 px-6 py-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-violet-500">
          <Link2 className="h-4.5 w-4.5 text-white" strokeWidth={2.5} />
        </div>
        <span className="text-lg font-bold text-slate-900">LumiLink</span>
      </div>

      <nav className="flex-1 space-y-1 px-3">
        {items.map((item) => {
          const active = item.id === activeId;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onSelect(item.id)}
              className={`flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors ${
                active
                  ? "bg-brand-50 text-brand-700"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
              }`}
            >
              <Icon className="h-4.5 w-4.5" />
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="border-t border-slate-100 p-4">
        <div className="mb-2 flex items-center gap-3 rounded-xl px-2 py-2">
          <Avatar name={userName} color={userColor} size={38} />
          <div className="min-w-0 flex-1">
            <div className="truncate text-sm font-semibold text-slate-800">{userName}</div>
            <div className="truncate text-xs text-slate-400">{userSubLabel}</div>
          </div>
        </div>
        <button
          onClick={onLogout}
          className="flex w-full items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-medium text-slate-400 transition-colors hover:bg-slate-50 hover:text-slate-700"
        >
          <LogOut className="h-4 w-4" />
          役割を切り替える
        </button>
      </div>
    </aside>
  );
}
