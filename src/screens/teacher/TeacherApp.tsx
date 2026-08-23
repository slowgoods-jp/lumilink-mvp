import { useState } from "react";
import { Home, Users } from "lucide-react";
import Sidebar, { type NavItem } from "../../components/shared/Sidebar";
import { useAppDispatch, useCurrentTeacher } from "../../store/AppContext";
import TeacherHome from "./TeacherHome";
import TeacherStudents from "./TeacherStudents";

const NAV: NavItem[] = [
  { id: "home", label: "ホーム", icon: Home },
  { id: "students", label: "学生管理", icon: Users },
];

export default function TeacherApp() {
  const teacher = useCurrentTeacher();
  const dispatch = useAppDispatch();
  const [page, setPage] = useState("home");
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);

  if (!teacher) return null;

  function openStudent(id: string) {
    setSelectedStudentId(id);
    setPage("students");
  }

  return (
    <div className="flex h-screen w-full bg-white">
      <Sidebar
        items={NAV}
        activeId={page}
        onSelect={setPage}
        userName={teacher.name}
        userSubLabel={`${teacher.subject} ・ 教員`}
        userColor={teacher.avatarColor}
        onLogout={() => dispatch({ type: "LOGOUT" })}
      />
      <main className="flex-1 overflow-hidden">
        {page === "home" && <TeacherHome teacher={teacher} onOpenStudent={openStudent} />}
        {page === "students" && (
          <TeacherStudents
            teacher={teacher}
            selectedStudentId={selectedStudentId}
            onSelectStudent={setSelectedStudentId}
          />
        )}
      </main>
    </div>
  );
}
