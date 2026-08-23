import { useState } from "react";
import { Home, MessageCircle, ClipboardCheck, TrendingUp } from "lucide-react";
import Sidebar, { type NavItem } from "../../components/shared/Sidebar";
import { useAppDispatch, useCurrentStudent } from "../../store/AppContext";
import StudentHome from "./StudentHome";
import StudentChat from "./StudentChat";
import StudentTasks from "./StudentTasks";
import StudentGrowth from "./StudentGrowth";

const NAV: NavItem[] = [
  { id: "home", label: "ホーム", icon: Home },
  { id: "chat", label: "チャット", icon: MessageCircle },
  { id: "tasks", label: "タスク", icon: ClipboardCheck },
  { id: "growth", label: "成長記録", icon: TrendingUp },
];

export default function StudentApp() {
  const student = useCurrentStudent();
  const dispatch = useAppDispatch();
  const [page, setPage] = useState("home");
  const [activeTeacherId, setActiveTeacherId] = useState<string | null>(null);

  if (!student) return null;

  function goToChat(teacherId: string) {
    setActiveTeacherId(teacherId);
    setPage("chat");
  }

  return (
    <div className="flex h-screen w-full bg-white">
      <Sidebar
        items={NAV}
        activeId={page}
        onSelect={setPage}
        userName={student.name}
        userSubLabel={`${student.grade} ・ 学生`}
        userColor={student.avatarColor}
        onLogout={() => dispatch({ type: "LOGOUT" })}
      />
      <main className="flex-1 overflow-hidden">
        {page === "home" && <StudentHome student={student} onOpenChat={goToChat} />}
        {page === "chat" && (
          <StudentChat
            student={student}
            initialTeacherId={activeTeacherId}
            onTeacherChange={setActiveTeacherId}
          />
        )}
        {page === "tasks" && <StudentTasks student={student} />}
        {page === "growth" && <StudentGrowth student={student} />}
      </main>
    </div>
  );
}
