import { useEffect, useRef, useState } from "react";
import { Phone, Send, Video } from "lucide-react";
import type { ChatMessage, Role } from "../../types";
import Avatar from "./Avatar";

interface Props {
  messages: ChatMessage[];
  viewerRole: Role;
  partnerName: string;
  partnerColor: string;
  partnerSubLabel: string;
  onSend: (text: string) => void;
  onCall: (kind: "音声" | "ビデオ") => void;
  typing?: boolean;
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleString("ja-JP", {
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function ChatView({
  messages,
  viewerRole,
  partnerName,
  partnerColor,
  partnerSubLabel,
  onSend,
  onCall,
  typing,
}: Props) {
  const [draft, setDraft] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length, typing]);

  function handleSend() {
    const text = draft.trim();
    if (!text) return;
    onSend(text);
    setDraft("");
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
        <div className="flex items-center gap-3">
          <Avatar name={partnerName} color={partnerColor} size={40} />
          <div>
            <div className="text-sm font-semibold text-slate-800">{partnerName}</div>
            <div className="text-xs text-slate-400">{partnerSubLabel}</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onCall("音声")}
            title="音声通話（デモ）"
            className="flex h-9 w-9 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-50 hover:text-brand-600"
          >
            <Phone className="h-4.5 w-4.5" />
          </button>
          <button
            onClick={() => onCall("ビデオ")}
            title="ビデオ通話（デモ）"
            className="flex h-9 w-9 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-50 hover:text-brand-600"
          >
            <Video className="h-4.5 w-4.5" />
          </button>
        </div>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto px-6 py-5">
        {messages.map((m) => {
          if (m.sender === "system") {
            return (
              <div key={m.id} className="flex justify-center">
                <span className="rounded-full bg-slate-50 px-3 py-1 text-xs text-slate-400">
                  {m.kind === "call-log" ? "📞 " : ""}
                  {m.text} ・ {formatTime(m.createdAt)}
                </span>
              </div>
            );
          }
          const self = m.sender === viewerRole;
          return (
            <div key={m.id} className={`flex ${self ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[70%] ${self ? "items-end" : "items-start"} flex flex-col`}>
                <div
                  className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                    self
                      ? "rounded-br-sm bg-brand-500 text-white"
                      : "rounded-bl-sm bg-slate-100 text-slate-800"
                  }`}
                >
                  {m.text}
                </div>
                <span className="mt-1 px-1 text-[11px] text-slate-300">
                  {formatTime(m.createdAt)}
                </span>
              </div>
            </div>
          );
        })}
        {typing && (
          <div className="flex justify-start">
            <div className="flex items-center gap-1 rounded-2xl rounded-bl-sm bg-slate-100 px-4 py-3">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400"
                  style={{ animationDelay: `${i * 0.15}s` }}
                />
              ))}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="border-t border-slate-100 px-6 py-4">
        <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-2 py-1.5 focus-within:border-brand-300">
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="メッセージを入力..."
            className="flex-1 bg-transparent px-2 py-2 text-sm text-slate-800 outline-none placeholder:text-slate-350"
          />
          <button
            onClick={handleSend}
            disabled={!draft.trim()}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-500 text-white transition-colors hover:bg-brand-600 disabled:bg-slate-200"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
