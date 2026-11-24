"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { Composer } from "./composer";
import { KivoMark } from "./kivo-logo";
import { MenuButton, type MenuAction } from "./menu-button";
import { Sidebar } from "./sidebar";

export type Message = { role: "user" | "ai"; text: string };
export type Chat = { id: string; title: string; messages: Message[] };

const uid = () => Math.random().toString(36).slice(2, 10);

const replies = [
  "Hello. What can I help you with?",
  "Got it — let me think about that for a moment.",
  "Here's a quick take: break it into small steps and tackle the riskiest one first.",
  "Sure. Want me to go deeper on any part of that?",
];

export default function ChatApp() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [chats, setChats] = useState<Chat[]>([{ id: "first", title: "New chat", messages: [] }]);
  const [currentId, setCurrentId] = useState("first");
  const [thinking, setThinking] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const threadRef = useRef<HTMLDivElement>(null);

  const current = chats.find((c) => c.id === currentId) ?? chats[0];

  useEffect(() => {
    threadRef.current?.scrollTo({ top: threadRef.current.scrollHeight, behavior: "smooth" });
  }, [current.messages.length, thinking]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 1800);
    return () => clearTimeout(t);
  }, [toast]);

  const updateChat = (id: string, fn: (c: Chat) => Chat) =>
    setChats((cs) => cs.map((c) => (c.id === id ? fn(c) : c)));

  const newChat = useCallback(() => {
    const c = { id: uid(), title: "New chat", messages: [] };
    setChats((cs) => [c, ...cs]);
    setCurrentId(c.id);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        newChat();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [newChat]);

  const send = (text: string) => {
    const id = current.id;
    const isFirst = current.messages.length === 0;
    updateChat(id, (c) => ({
      ...c,
      title: isFirst ? text.slice(0, 40) : c.title,
      messages: [...c.messages, { role: "user", text }],
    }));
    setThinking(true);
    setTimeout(() => {
      updateChat(id, (c) => {
        const n = c.messages.filter((m) => m.role === "ai").length;
        return { ...c, messages: [...c.messages, { role: "ai", text: replies[n % replies.length] }] };
      });
      setThinking(false);
    }, 900);
  };

  const onMenu = (a: MenuAction) => {
    if (a === "new") return newChat();
    if (a === "rename") {
      const t = window.prompt("Rename chat", current.title)?.trim();
      if (t) updateChat(current.id, (c) => ({ ...c, title: t }));
      return;
    }
    if (a === "delete") {
      const rest = chats.filter((c) => c.id !== current.id);
      const next = rest.length ? rest : [{ id: uid(), title: "New chat", messages: [] }];
      setChats(next);
      setCurrentId(next[0].id);
      return setToast("Chat deleted");
    }
    setToast(`${a[0].toUpperCase() + a.slice(1)} — coming soon`);
  };

  return (
    <div
      className={cn(
        "grid h-dvh grid-cols-1 gap-2 p-0 transition-[grid-template-columns] duration-300 ease-[cubic-bezier(.2,.8,.2,1)] sm:p-2",
        sidebarOpen ? "md:grid-cols-[260px_1fr]" : "md:grid-cols-[56px_1fr]",
      )}
    >
      <Sidebar
        open={sidebarOpen}
        onOpenChange={setSidebarOpen}
        chats={chats}
        currentId={current.id}
        onSelect={(id) => {
          setCurrentId(id);
          if (window.innerWidth < 768) setSidebarOpen(false);
        }}
        onNewChat={() => {
          newChat();
          if (window.innerWidth < 768) setSidebarOpen(false);
        }}
      />

      {/* mobile scrim */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-20 bg-black/40 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <main className="relative flex min-w-0 flex-col overflow-hidden border-line bg-panel sm:rounded-2xl sm:border">
        {/* Top bar: left slot · centered MENU · right slot */}
        <header className="absolute inset-x-0 top-0 z-10 grid h-14 grid-cols-[1fr_auto_1fr] items-center gap-2 bg-linear-to-b from-panel from-70% to-transparent px-2 sm:px-3">
          <div className="flex items-center">
            <button
              onClick={() => setSidebarOpen(true)}
              aria-label="Open sidebar"
              className="grid size-9 place-items-center rounded-lg hover:bg-hover md:hidden"
            >
              <KivoMark className="size-5" />
            </button>
          </div>

          <MenuButton onAction={onMenu} />

          <div className="flex items-center justify-end gap-1">
          </div>
        </header>

        {/* Thread */}
        <div
          ref={threadRef}
          aria-live="polite"
          className="flex flex-1 flex-col gap-6 overflow-y-auto px-4 pb-6 pt-16 sm:px-6"
        >
          {(current.messages.length > 0 || thinking) && (
            <>
              {current.messages.map((m, i) =>
                m.role === "user" ? (
                  <div key={i} className="mx-auto flex w-full max-w-3xl justify-end animate-rise">
                    <p className="max-w-[85%] whitespace-pre-wrap break-words rounded-3xl bg-active px-4 py-2.5 text-[15px] leading-relaxed sm:max-w-[70%]">
                      {m.text}
                    </p>
                  </div>
                ) : (
                  <AiMessage key={i}>{m.text}</AiMessage>
                ),
              )}
              {thinking && (
                <AiMessage busy>
                  <span className="inline-flex gap-[5px] pt-3">
                    {[0, 150, 300].map((d) => (
                      <i key={d} className="size-[7px] rounded-full bg-muted animate-blink" style={{ animationDelay: `${d}ms` }} />
                    ))}
                  </span>
                </AiMessage>
              )}
            </>
          )}
        </div>

        <Composer onSend={send} disabled={thinking} />
      </main>

      {/* Toast */}
      <div
        className={cn(
          "pointer-events-none fixed bottom-7 left-1/2 z-50 -translate-x-1/2 rounded-xl bg-fg px-4 py-2.5 text-sm text-panel transition duration-200",
          toast ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0",
        )}
      >
        {toast}
      </div>
    </div>
  );
}

function AiMessage({ children, busy }: { children: React.ReactNode; busy?: boolean }) {
  return (
    <div className="mx-auto flex w-full max-w-3xl items-start gap-3 animate-rise">
      <KivoMark className={cn("mt-0.5 size-6", busy && "animate-[spin_2.4s_linear_infinite]")} />
      <div className="min-w-0 break-words pt-0.5 text-[15px] leading-relaxed">{children}</div>
    </div>
  );
}
