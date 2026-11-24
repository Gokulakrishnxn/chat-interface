"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { ArrowUpIcon, ChevronDownIcon, PlusIcon } from "./icons";

export function Composer({ onSend, disabled }: { onSend: (text: string) => void; disabled?: boolean }) {
  const [value, setValue] = useState("");
  const ref = useRef<HTMLTextAreaElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, [value]);

  const submit = () => {
    const text = value.trim();
    if (!text || disabled) return;
    onSend(text);
    setValue("");
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
      className="relative px-3 pb-[max(10px,env(safe-area-inset-bottom))] sm:px-6 sm:pb-3"
    >
      {/* Rainbow glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-4 left-1/2 h-24 w-[min(768px,calc(100%-24px))] -translate-x-1/2 rounded-[28px] opacity-40 blur-[18px] animate-hue"
        style={{
          background:
            "radial-gradient(40% 60% at 15% 100%, rgba(234,179,8,.35), transparent 70%)," +
            "radial-gradient(35% 60% at 50% 0%, rgba(236,72,153,.28), transparent 70%)," +
            "radial-gradient(35% 60% at 85% 100%, rgba(59,130,246,.35), transparent 70%)," +
            "radial-gradient(30% 60% at 100% 40%, rgba(45,212,191,.3), transparent 70%)",
        }}
      />

      <div className="relative mx-auto max-w-3xl rounded-[26px] border border-line bg-panel-2 px-2.5 pb-2 pt-3 shadow-[0_10px_40px_rgba(0,0,0,.35)] transition-colors focus-within:border-[#3a3a3a] not-dark:focus-within:border-[#c9c9c4]">
        <textarea
          ref={ref}
          rows={1}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              submit();
            }
          }}
          placeholder="Describe your question or task"
          className="block max-h-[200px] min-h-6 w-full resize-none bg-transparent px-2 text-[15px] leading-normal text-fg outline-none placeholder:text-muted"
        />
        <div className="mt-2 flex items-center gap-1.5">
          <button type="button" aria-label="Attach" className="grid size-8 place-items-center rounded-full text-muted transition-colors hover:bg-hover hover:text-fg">
            <PlusIcon width={18} height={18} />
          </button>
          <div className="flex-1" />
          <button type="button" className="flex items-center gap-1 rounded-lg px-2 py-1.5 text-[13px] text-muted transition-colors hover:bg-hover hover:text-fg">
            Glance <ChevronDownIcon width={14} height={14} />
          </button>
          <button
            type="submit"
            aria-label="Send"
            disabled={!value.trim() || disabled}
            className="grid size-8 place-items-center rounded-full bg-fg text-panel transition disabled:cursor-default disabled:bg-[#3a3a3a] disabled:text-[#9a9a9a] not-dark:disabled:bg-[#d9d9d5] not-dark:disabled:text-[#8a8a85]"
          >
            <ArrowUpIcon width={16} height={16} />
          </button>
        </div>
      </div>
      <p className="mx-auto mt-2 hidden max-w-3xl text-center text-xs text-muted sm:block">
        Kivo can make mistakes. Check important info.
      </p>
    </form>
  );
}
