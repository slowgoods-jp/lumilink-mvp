import { motion } from "framer-motion";
import {
  Brain,
  ClipboardCheck,
  Link2,
  MessageCircle,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";

const TITLE = "LumiLink";
const LETTER_DELAY = 0.075;
const START_DELAY = 0.45;
const LETTER_DURATION = 0.55;
const TOTAL_TITLE_TIME =
  START_DELAY + (TITLE.length - 1) * LETTER_DELAY + LETTER_DURATION;

const letterVariants = {
  hidden: { opacity: 0, x: -28, filter: "blur(6px)" },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    filter: "blur(0px)",
    transition: {
      delay: START_DELAY + i * LETTER_DELAY,
      duration: LETTER_DURATION,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  }),
};

const features = [
  { icon: MessageCircle, label: "1対1チャット" },
  { icon: Brain, label: "AI要約" },
  { icon: ClipboardCheck, label: "タスク生成" },
  { icon: TrendingUp, label: "成長可視化" },
  { icon: ShieldCheck, label: "安全な交流" },
];

export default function CoverScreen({ onStart }: { onStart: () => void }) {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-white flex flex-col items-center justify-center px-6">
      <div className="pointer-events-none absolute -top-32 -left-24 h-96 w-96 rounded-full bg-brand-100 blur-3xl opacity-70 animate-float-slow" />
      <div
        className="pointer-events-none absolute -bottom-32 -right-24 h-96 w-96 rounded-full bg-mint-100 blur-3xl opacity-70 animate-float-slow"
        style={{ animationDelay: "1.5s" }}
      />
      <div className="pointer-events-none absolute top-1/3 right-1/4 h-64 w-64 rounded-full bg-violet-100 blur-3xl opacity-50" />

      <motion.div
        initial={{ opacity: 0, scale: 0.6, rotate: -8 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-violet-500 shadow-soft"
      >
        <Link2 className="h-8 w-8 text-white" strokeWidth={2.5} />
      </motion.div>

      <h1
        className="relative z-10 flex text-6xl sm:text-7xl md:text-8xl font-extrabold tracking-tight text-slate-900"
        aria-label={TITLE}
      >
        {TITLE.split("").map((ch, i) => (
          <motion.span
            key={i}
            custom={i}
            initial="hidden"
            animate="visible"
            variants={letterVariants}
            className="inline-block bg-gradient-to-r from-brand-600 via-brand-500 to-violet-500 bg-clip-text text-transparent"
          >
            {ch}
          </motion.span>
        ))}
      </h1>

      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: TOTAL_TITLE_TIME, duration: 0.6 }}
        className="relative z-10 mt-5 max-w-xl text-center text-base sm:text-lg text-slate-500 leading-relaxed"
      >
        学生と教員の日常的なコミュニケーションを支援し、
        <br className="hidden sm:block" />
        AIによる要約・タスク生成・成長可視化を行う教育プラットフォーム
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: TOTAL_TITLE_TIME + 0.15, duration: 0.6 }}
        className="relative z-10 mt-8 flex flex-wrap items-center justify-center gap-2 sm:gap-3"
      >
        {features.map(({ icon: Icon, label }) => (
          <div
            key={label}
            className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-white/80 px-3.5 py-1.5 text-xs sm:text-sm font-medium text-slate-600 shadow-sm backdrop-blur"
          >
            <Icon className="h-3.5 w-3.5 text-brand-500" />
            {label}
          </div>
        ))}
      </motion.div>

      <motion.button
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: TOTAL_TITLE_TIME + 0.3, duration: 0.6 }}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        onClick={onStart}
        className="relative z-10 mt-10 rounded-full bg-slate-900 px-8 py-3.5 text-sm sm:text-base font-semibold text-white shadow-soft transition-colors hover:bg-slate-800"
      >
        はじめる
      </motion.button>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: TOTAL_TITLE_TIME + 0.5, duration: 0.8 }}
        className="relative z-10 mt-14 text-xs tracking-wide text-slate-400"
      >
        コミュニケーションを記録に変え、記録を成長に変える
      </motion.p>
    </div>
  );
}
