"use client";

import { useEffect, useRef, useState, type ComponentType, type SVGProps } from "react";
import { cn } from "@/lib/cn";
import { DownloadIcon, PencilIcon, PlusIcon, SettingsIcon, ShareIcon, TrashIcon } from "./icons";

export type MenuAction = "new" | "rename" | "share" | "export" | "settings" | "delete";

const items: { id: MenuAction; label: string; Icon: ComponentType<SVGProps<SVGSVGElement>>; kbd?: string }[] = [
  { id: "new", label: "New chat", Icon: PlusIcon, kbd: "⌘K" },
  { id: "rename", label: "Rename chat", Icon: PencilIcon },
  { id: "share", label: "Share", Icon: ShareIcon },
  { id: "export", label: "Export transcript", Icon: DownloadIcon },
  { id: "settings", label: "Settings", Icon: SettingsIcon },
  { id: "delete", label: "Delete chat", Icon: TrashIcon },
];

/** Usage limits shown at the top of the menu (placeholder data until a backend exists). */
const limits = [
  { label: "5-hour limit", resets: "Resets at 4:40 PM", pct: 21 },
  { label: "Weekly · all models", resets: "Resets Mon 1:30 PM", pct: 8 },
];

/** How far (px) the eyes can drift toward the cursor. */
const EYE_RANGE = 1.6;

/** The pill alternates: 5-hour usage for PEEK_MS, then MENU for PEEK_MS, on loop. */
const PEEK_MS = 10_000;

export function MenuButton({ onAction }: { onAction: (a: MenuAction) => void }) {
  const [open, setOpen] = useState(false);
  const [peek, setPeek] = useState(true);
  const showPeek = peek && !open;
  const fiveHour = limits[0];

  useEffect(() => {
    const t = setInterval(() => setPeek((p) => !p), PEEK_MS);
    return () => clearInterval(t);
  }, []);
  const ref = useRef<HTMLDivElement>(null);
  const orbRef = useRef<HTMLSpanElement>(null);
  const eyesRef = useRef<HTMLSpanElement>(null);

  // Close on outside click / Escape
  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  // Eyes follow the cursor
  useEffect(() => {
    let raf = 0;
    const onMove = (e: PointerEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const orb = orbRef.current;
        const eyes = eyesRef.current;
        if (!orb || !eyes) return;
        const r = orb.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height / 2);
        const d = Math.hypot(dx, dy) || 1;
        const k = Math.min(1, d / 120) * EYE_RANGE;
        eyes.style.transform = `translate(${(dx / d) * k}px, ${(dy / d) * k}px)`;
      });
    };
    window.addEventListener("pointermove", onMove);
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={open ? "Close menu" : "Open menu"}
        title={showPeek ? `${fiveHour.label}: ${fiveHour.pct}% used` : undefined}
        className="liquid-glass relative flex h-[34px] w-[116px] items-center overflow-hidden rounded-full text-[#ececec] outline-offset-4 transition-transform duration-200 active:scale-[0.97]"
      >
        <span className="flex w-full items-center justify-between pl-[3px] pr-3.5">
          {/* Orb with eyes (+ usage ring while peeking) */}
          <span className="relative grid size-6 place-items-center">
            <span
              ref={orbRef}
              aria-hidden
              className="grid size-6 place-items-center rounded-full bg-[radial-gradient(circle_at_35%_30%,#3a3a3a,#0b0b0b_70%)] shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)]"
            >
              <span ref={eyesRef} className="pill-blink flex gap-[3px] transition-transform duration-150 ease-out">
                <i className="block size-[3.5px] rounded-full bg-white" />
                <i className="block size-[3.5px] rounded-full bg-white" />
              </span>
            </span>
            <svg
              aria-hidden
              viewBox="0 0 24 24"
              className={cn(
                "pointer-events-none absolute inset-0 size-6 -rotate-90 transition-opacity duration-500",
                showPeek ? "opacity-100" : "opacity-0",
              )}
            >
              <circle cx="12" cy="12" r="11" fill="none" stroke="rgba(255,255,255,.12)" strokeWidth="1.5" />
              <circle
                cx="12"
                cy="12"
                r="11"
                fill="none"
                stroke="#3b82f6"
                strokeWidth="1.5"
                strokeLinecap="round"
                pathLength={100}
                strokeDasharray={`${fiveHour.pct} 100`}
              />
            </svg>
          </span>

          {/* 5H usage → MENU ↕ CLOSE rolling label */}
          <span className="relative h-3.5 overflow-hidden text-[9px] font-semibold tracking-[0.14em]">
            <span
              className={cn(
                "flex flex-col items-end transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]",
                showPeek ? "translate-y-0" : open ? "-translate-y-7" : "-translate-y-3.5",
              )}
            >
              <span className="h-3.5 whitespace-nowrap leading-3.5">
                5H <span className="text-[#60a5fa]">{fiveHour.pct}%</span>
              </span>
              <span className="h-3.5 leading-3.5">MENU</span>
              <span className="h-3.5 leading-3.5">CLOSE</span>
            </span>
          </span>
        </span>
      </button>

      {/* Popover */}
      <div
        role="menu"
        className={cn(
          "liquid-glass absolute left-1/2 top-[calc(100%+8px)] w-[min(330px,calc(100vw-24px))] origin-top -translate-x-1/2 rounded-[22px] p-1.5 transition duration-200 ease-[cubic-bezier(0.32,0.72,0,1)]",
          open ? "pointer-events-auto scale-100 opacity-100" : "pointer-events-none -translate-y-1.5 scale-95 opacity-0",
        )}
      >
        {/* Usage limits */}
        <div className="flex flex-col gap-3 px-3 pb-3 pt-2.5">
          {limits.map(({ label, resets, pct }) => (
            <div key={label} role="presentation">
              <div className="mb-1.5 flex items-baseline gap-2 text-[13px]">
                <span className="min-w-0 truncate whitespace-nowrap text-[#ececec]">{label}</span>
                <span className="ml-auto whitespace-nowrap text-xs text-muted">{resets}</span>
                <span className="w-8 text-right text-xs tabular-nums text-muted">{pct}%</span>
              </div>
              <div
                role="progressbar"
                aria-label={label}
                aria-valuenow={pct}
                aria-valuemin={0}
                aria-valuemax={100}
                className="h-1 overflow-hidden rounded-full bg-white/10"
              >
                <div className="h-full rounded-full bg-[#3b82f6]" style={{ width: `${pct}%` }} />
              </div>
            </div>
          ))}
        </div>
        <div className="mx-2 mb-1 h-px bg-white/10" />

        {items.map(({ id, label, Icon, kbd }) => (
          <div key={id}>
            {id === "settings" && <div className="mx-2 my-1 h-px bg-white/10" />}
            <button
              role="menuitem"
              onClick={() => {
                setOpen(false);
                onAction(id);
              }}
              className={cn(
                "flex w-full items-center gap-3 rounded-2xl px-3 py-2 text-left text-sm transition-colors hover:bg-white/8",
                id === "delete" ? "text-red-400" : "text-[#ececec]",
              )}
            >
              <Icon width={16} height={16} className={id === "delete" ? "text-red-400" : "text-muted"} />
              {label}
              {kbd && <kbd className="ml-auto font-sans text-xs text-muted">{kbd}</kbd>}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
