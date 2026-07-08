"use client";

import { cn } from "@/lib/utils";

export function DemoShell({
  title,
  children,
  className,
  compact,
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
  compact?: boolean;
}) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border border-white/10 bg-[#080b0f] shadow-[0_0_60px_-30px_rgba(45,212,191,0.35)]",
        className,
      )}
    >
      <div className="flex items-center gap-2 border-b border-white/[0.06] px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-red-500/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-green-500/70" />
        <span className="ml-2 text-xs text-white/35">{title}</span>
        <span className="ml-auto rounded-full border border-accent/20 bg-accent/10 px-2 py-0.5 text-[10px] uppercase tracking-wider text-accent">
          Live demo
        </span>
      </div>
      <div className={cn(compact ? "p-4" : "p-5 sm:p-6")}>{children}</div>
    </div>
  );
}
