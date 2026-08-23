import { AnimatePresence, motion } from "framer-motion";
import { AppProvider, useAppDispatch, useAppState } from "./store/AppContext";
import CoverScreen from "./screens/CoverScreen";
import RoleSelectScreen from "./screens/RoleSelectScreen";
import StudentApp from "./screens/student/StudentApp";
import TeacherApp from "./screens/teacher/TeacherApp";
import { useState } from "react";
import type { Role } from "./types";

type Stage = "cover" | "role";

function AppInner() {
  const state = useAppState();
  const dispatch = useAppDispatch();
  const [stage, setStage] = useState<Stage>("cover");

  if (state.role && state.currentUserId) {
    return state.role === "student" ? <StudentApp /> : <TeacherApp />;
  }

  function handleSelect(role: Role, userId: string) {
    dispatch({ type: "LOGIN", role, userId });
  }

  return (
    <AnimatePresence mode="wait">
      {stage === "cover" ? (
        <motion.div key="cover" exit={{ opacity: 0 }} transition={{ duration: 0.35 }}>
          <CoverScreen onStart={() => setStage("role")} />
        </motion.div>
      ) : (
        <motion.div
          key="role"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.35 }}
        >
          <RoleSelectScreen onSelect={handleSelect} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppInner />
    </AppProvider>
  );
}
