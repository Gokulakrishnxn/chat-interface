"use client";

import { cn } from "@/lib/cn";
import { EditIcon, LibraryIcon, PanelIcon } from "./icons";
import { KivoMark, KivoWordmark } from "./kivo-logo";
import type { Chat } from "./chat-app";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  chats: Chat[];
  currentId: string;
  onSelect: (id: string) => void;
  onNewChat: () => void;
};

export function Sidebar({ open, onOpenChange, chats, currentId, onSelect, onNewChat }: Props) {
  const navItem = cn(
    "flex h-9 items-center gap-2.5 whitespace-nowrap rounded-lg text-sm transition-colors hover:bg-hover",
    open ? "w-full justify-start px-2.5" : "w-9 justify-center",
  );

  return (
    <aside
      aria-label="Sidebar"
      className={cn(
        "flex min-w-0 flex-col overflow-hidden rounded-2xl border border-line bg-panel px-2 pb-2 pt-3",
        // mobile: off-canvas drawer
        "max-md:fixed max-md:inset-y-2 max-md:left-2 max-md:z-30 max-md:w-[min(300px,84vw)] max-md:shadow-2xl max-md:transition-transform max-md:duration-300",
        open ? "max-md:translate-x-0" : "max-md:-translate-x-[110%]",
      )}
    >
      {/* Header */}
      <div className={cn("mb-4 flex h-9 items-center", open ? "justify-between pl-2.5" : "justify-center")}>
        {open ? (
          <>
            <KivoWordmark />
            <button
              onClick={() => onOpenChange(false)}
              aria-label="Collapse sidebar"
              title="Collapse sidebar"
              className="grid size-9 place-items-center rounded-lg text-muted transition-colors hover:bg-hover hover:text-fg"
            >
              <PanelIcon />
            </button>
          </>
        ) : (
          <button
            onClick={() => onOpenChange(true)}
            aria-label="Kivo — expand sidebar"
            title="Expand sidebar"
            className="grid size-9 place-items-center rounded-lg transition-colors hover:bg-hover"
          >
            <KivoMark className="size-[22px]" />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className={cn("flex flex-col gap-0.5", open ? "items-stretch" : "items-center")}>
        <button className={navItem} onClick={onNewChat} title="New chat">
          <EditIcon />
          {open && <span>New chat</span>}
        </button>
        <button className={navItem} title="Library">
          <LibraryIcon />
          {open && <span>Library</span>}
        </button>
      </nav>

      {/* Recents */}
      {open && (
        <div className="mt-6 min-h-0 flex-1 overflow-y-auto">
          <p className="mb-1.5 px-2.5 text-xs font-medium text-muted">Recents</p>
          <ul className="flex flex-col gap-px">
            {chats.map((c) => (
              <li key={c.id}>
                <button
                  onClick={() => onSelect(c.id)}
                  className={cn(
                    "w-full truncate rounded-lg px-2.5 py-2 text-left text-sm transition-colors",
                    c.id === currentId ? "bg-active text-fg" : "text-muted hover:bg-hover hover:text-fg",
                  )}
                >
                  {c.title}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Credits + account */}
      <div className={cn("mt-auto flex flex-col gap-1.5", open ? "items-stretch" : "items-center")}>
        <button
          title="Credits"
          className={cn(
            "flex h-10 items-center gap-2.5 rounded-xl text-sm transition-colors hover:bg-hover",
            open ? "w-full border border-line bg-panel-2 px-3 font-medium" : "w-9 justify-center",
          )}
        >
          <svg viewBox="0 0 24 24" className="size-[18px] -rotate-90" aria-hidden>
            <circle cx="12" cy="12" r="9" fill="none" stroke="var(--muted)" strokeWidth="2.2" />
            <circle cx="12" cy="12" r="9" fill="none" stroke="var(--fg)" strokeWidth="2.2" pathLength={100} strokeDasharray="1 100" />
          </svg>
          {open && (
            <>
              <span>Credits</span>
              <span className="ml-auto text-[13px] text-muted">
                <b className="font-semibold text-fg">2.038</b> / 200
              </span>
            </>
          )}
        </button>

        {/* Account */}
        <button
          title="Account"
          aria-label="Account"
          className={cn(
            "flex h-11 items-center gap-2.5 rounded-xl text-left transition-colors hover:bg-hover",
            open ? "w-full px-1.5" : "w-9 justify-center",
          )}
        >
          <span className="grid size-8 flex-none place-items-center rounded-full bg-[radial-gradient(circle_at_35%_30%,#fb923c,#c2410c)] text-xs font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,.25)]">
            G
          </span>
          {open && (
            <span className="min-w-0 leading-tight">
              <span className="block truncate text-sm font-medium text-fg">Gokulakrishnan</span>
              <span className="block truncate text-xs text-muted">Free plan</span>
            </span>
          )}
        </button>
      </div>
    </aside>
  );
}
