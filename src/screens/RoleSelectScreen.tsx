import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, GraduationCap, Users } from "lucide-react";
import type { Role } from "../types";
import { students, teachers } from "../data/mockData";
import Avatar from "../components/shared/Avatar";

interface Props {
  onSelect: (role: Role, userId: string) => void;
}

export default function RoleSelectScreen({ onSelect }: Props) {
  const [role, setRole] = useState<Role | null>(null);

  return (
    <div className="relative min-h-screen w-full bg-white flex flex-col items-center justify-center px-6 py-16 overflow-hidden">
      <div className="pointer-events-none absolute -top-40 left-1/2 h-96 w-[40rem] -translate-x-1/2 rounded-full bg-brand-50 blur-3xl" />

      <AnimatePresence mode="wait">
        {!role ? (
          <motion.div
            key="role"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.4 }}
            className="relative z-10 w-full max-w-3xl"
          >
            <div className="mb-10 text-center">
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
                LumiLinkへようこそ
              </h1>
              <p className="mt-2 text-sm sm:text-base text-slate-500">
                利用する立場を選択してください
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
              <RoleCard
                icon={GraduationCap}
                title="学生として利用"
                description="教員とチャットで相談し、AIが生成するタスクや自分の成長を確認できます。"
                accent="from-brand-500 to-brand-600"
                onClick={() => setRole("student")}
              />
              <RoleCard
                icon={Users}
                title="教員として利用"
                description="学生との対話を確認し、AI要約・メモ・タスク管理で学生理解を深められます。"
                accent="from-violet-500 to-violet-600"
                onClick={() => setRole("teacher")}
              />
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="user"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.4 }}
            className="relative z-10 w-full max-w-xl"
          >
            <button
              onClick={() => setRole(null)}
              className="mb-6 flex items-center gap-1 text-sm text-slate-400 hover:text-slate-600 transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
              戻る
            </button>

            <div className="mb-8 text-center">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                {role === "student" ? "どの学生として利用しますか？" : "どの教員として利用しますか？"}
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                デモ用のサンプルアカウントを選択してください
              </p>
            </div>

            <div className="flex flex-col gap-3">
              {(role === "student" ? students : teachers).map((u) => (
                <button
                  key={u.id}
                  onClick={() => onSelect(role, u.id)}
                  className="group flex items-center gap-4 rounded-2xl border border-slate-200 bg-white px-5 py-4 text-left shadow-sm transition-all hover:border-brand-300 hover:shadow-card"
                >
                  <Avatar name={u.name} color={u.avatarColor} size={48} />
                  <div className="flex-1">
                    <div className="font-semibold text-slate-900">{u.name}</div>
                    <div className="text-xs text-slate-400">{u.kana}</div>
                    <div className="mt-0.5 text-sm text-slate-500">
                      {"grade" in u ? `${u.grade} ・ ${u.className}` : u.subject}
                    </div>
                  </div>
                  <span className="rounded-full bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-500 group-hover:bg-brand-50 group-hover:text-brand-600 transition-colors">
                    選択
                  </span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function RoleCard({
  icon: Icon,
  title,
  description,
  accent,
  onClick,
}: {
  icon: typeof GraduationCap;
  title: string;
  description: string;
  accent: string;
  onClick: () => void;
}) {
  return (
    <motion.button
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="flex flex-col items-start rounded-3xl border border-slate-200 bg-white p-7 text-left shadow-sm transition-shadow hover:shadow-card"
    >
      <div
        className={`mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${accent} shadow-soft`}
      >
        <Icon className="h-7 w-7 text-white" strokeWidth={2} />
      </div>
      <h3 className="text-lg font-bold text-slate-900">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-slate-500">{description}</p>
    </motion.button>
  );
}
