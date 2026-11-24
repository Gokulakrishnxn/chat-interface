import { cn } from "@/lib/cn";

/**
 * Kivo "bloom" — seven tapered rays of uneven length around an open centre.
 * Original mark; colour defaults to Kivo coral and can be overridden via `className` (text-*).
 */
const BLOOM =
  "M10.50 9.60L11.25 1.40A0.75 0.75 0 0 1 12.75 1.40L13.50 9.60Z" +
  "M13.06 9.46L18.22 6.32A0.65 0.65 0 0 1 19.02 7.34L14.72 11.59Z" +
  "M14.58 10.90L22.00 12.70A0.70 0.70 0 0 1 21.81 14.08L14.17 13.77Z" +
  "M14.37 13.35L16.79 18.44A0.65 0.65 0 0 1 15.69 19.13L12.17 14.72Z" +
  "M12.87 14.69L10.21 22.27A0.75 0.75 0 0 1 8.76 21.91L9.96 13.97Z" +
  "M10.51 14.32L5.06 16.42A0.65 0.65 0 0 1 4.45 15.28L9.25 11.93Z" +
  "M9.27 12.49L2.74 9.37A0.70 0.70 0 0 1 3.22 8.06L10.22 9.86Z";

export function KivoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={cn("size-6 flex-none text-[#EE7A4C]", className)}>
      <path d={BLOOM} fill="currentColor" />
    </svg>
  );
}

/** Mark + name, for the expanded sidebar. */
export function KivoWordmark({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <KivoMark className="size-5" />
      <span className="text-[17px] font-semibold tracking-tight">Kivo</span>
    </span>
  );
}
