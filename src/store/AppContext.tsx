import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  type Dispatch,
  type ReactNode,
} from "react";
import {
  growthData,
  initialNotes,
  initialTasks,
  seedConversations,
  students,
  teachers,
} from "../data/mockData";
import type {
  ChatMessage,
  Conversation,
  ConversationSummary,
  GrowthInsight,
  NoteTag,
  Role,
  StudentTask,
  TaskStatus,
  TeacherNote,
} from "../types";

const STORAGE_KEY = "lumilink-demo-state-v1";

export interface AppState {
  role: Role | null;
  currentUserId: string | null;
  conversations: Conversation[];
  tasks: StudentTask[];
  notes: TeacherNote[];
  summaries: Record<string, ConversationSummary[]>;
  growthInsights: Record<string, GrowthInsight>;
}

function buildInitialState(): AppState {
  return {
    role: null,
    currentUserId: null,
    conversations: seedConversations(),
    tasks: initialTasks,
    notes: initialNotes,
    summaries: {},
    growthInsights: {},
  };
}

type Action =
  | { type: "LOGIN"; role: Role; userId: string }
  | { type: "LOGOUT" }
  | { type: "SEND_MESSAGE"; conversationId: string; message: ChatMessage }
  | { type: "ADD_SUMMARY"; summary: ConversationSummary }
  | { type: "ADD_TASK"; task: StudentTask }
  | { type: "SET_TASK_STATUS"; taskId: string; status: TaskStatus }
  | { type: "ADD_NOTE"; studentId: string; teacherId: string; tag: NoteTag; text: string }
  | { type: "DELETE_NOTE"; noteId: string }
  | { type: "SET_GROWTH_INSIGHT"; insight: GrowthInsight }
  | { type: "RESET_DEMO" };

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case "LOGIN":
      return { ...state, role: action.role, currentUserId: action.userId };
    case "LOGOUT":
      return { ...state, role: null, currentUserId: null };
    case "SEND_MESSAGE":
      return {
        ...state,
        conversations: state.conversations.map((c) =>
          c.id === action.conversationId
            ? { ...c, messages: [...c.messages, action.message] }
            : c
        ),
      };
    case "ADD_SUMMARY": {
      const list = state.summaries[action.summary.conversationId] ?? [];
      return {
        ...state,
        summaries: {
          ...state.summaries,
          [action.summary.conversationId]: [action.summary, ...list],
        },
      };
    }
    case "ADD_TASK":
      return { ...state, tasks: [action.task, ...state.tasks] };
    case "SET_TASK_STATUS":
      return {
        ...state,
        tasks: state.tasks.map((t) =>
          t.id === action.taskId ? { ...t, status: action.status } : t
        ),
      };
    case "ADD_NOTE": {
      const note: TeacherNote = {
        id: `note-${Date.now()}`,
        studentId: action.studentId,
        teacherId: action.teacherId,
        tag: action.tag,
        text: action.text,
        createdAt: new Date().toISOString(),
      };
      return { ...state, notes: [note, ...state.notes] };
    }
    case "DELETE_NOTE":
      return { ...state, notes: state.notes.filter((n) => n.id !== action.noteId) };
    case "SET_GROWTH_INSIGHT":
      return {
        ...state,
        growthInsights: { ...state.growthInsights, [action.insight.studentId]: action.insight },
      };
    case "RESET_DEMO":
      return buildInitialState();
    default:
      return state;
  }
}

function loadState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return buildInitialState();
    const parsed = JSON.parse(raw) as AppState;
    if (!parsed.conversations || !parsed.tasks) return buildInitialState();
    return parsed;
  } catch {
    return buildInitialState();
  }
}

const AppStateContext = createContext<AppState | null>(null);
const AppDispatchContext = createContext<Dispatch<Action> | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, loadState);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  return (
    <AppStateContext.Provider value={state}>
      <AppDispatchContext.Provider value={dispatch}>{children}</AppDispatchContext.Provider>
    </AppStateContext.Provider>
  );
}

export function useAppState(): AppState {
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error("useAppState must be used within AppProvider");
  return ctx;
}

export function useAppDispatch(): Dispatch<Action> {
  const ctx = useContext(AppDispatchContext);
  if (!ctx) throw new Error("useAppDispatch must be used within AppProvider");
  return ctx;
}

export function useCurrentStudent() {
  const state = useAppState();
  return useMemo(
    () => students.find((s) => s.id === state.currentUserId) ?? null,
    [state.currentUserId]
  );
}

export function useCurrentTeacher() {
  const state = useAppState();
  return useMemo(
    () => teachers.find((t) => t.id === state.currentUserId) ?? null,
    [state.currentUserId]
  );
}

export { students, teachers, growthData };
