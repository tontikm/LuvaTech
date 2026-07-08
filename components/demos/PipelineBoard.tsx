"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { formatCurrency, cn } from "@/lib/utils";
import { DemoShell } from "@/components/demos/DemoShell";

type Stage = "New" | "Qualified" | "Quoted" | "Booked";

type Deal = {
  id: string;
  company: string;
  value: number;
  owner: string;
  stage: Stage;
};

const STAGES: Stage[] = ["New", "Qualified", "Quoted", "Booked"];

const SEED: Deal[] = [
  { id: "1", company: "Meridian Civils", value: 180000, owner: "Thabo", stage: "New" },
  { id: "2", company: "Nova Dental", value: 95000, owner: "Sara", stage: "Qualified" },
  { id: "3", company: "Atlas Logistics", value: 140000, owner: "Mia", stage: "Qualified" },
  { id: "4", company: "Harbor Retail", value: 72000, owner: "Jon", stage: "Quoted" },
  { id: "5", company: "Peak Clinics", value: 110000, owner: "Thabo", stage: "Quoted" },
  { id: "6", company: "Lumen Media", value: 58000, owner: "Sara", stage: "Booked" },
];

export function PipelineBoard({ compact }: { compact?: boolean }) {
  const [deals, setDeals] = useState<Deal[]>(SEED);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [status, setStatus] = useState("Drag a deal into another column.");

  function onDrop(stage: Stage) {
    if (!draggingId) return;
    const deal = deals.find((d) => d.id === draggingId);
    if (!deal || deal.stage === stage) {
      setDraggingId(null);
      return;
    }
    setDeals((prev) =>
      prev.map((d) => (d.id === draggingId ? { ...d, stage } : d)),
    );
    setStatus(`Moved ${deal.company} to ${stage}.`);
    setDraggingId(null);
  }

  return (
    <DemoShell title="LuvaTech · Pipeline CRM" compact={compact}>
      <div className="mb-3 flex items-center justify-between gap-3">
        <p className="text-xs text-white/45">{status}</p>
        <span className="rounded-full border border-white/10 px-2 py-0.5 text-[10px] text-white/35">
          {deals.length} deals
        </span>
      </div>

      <div
        className={cn(
          "grid gap-3",
          compact ? "grid-cols-2 lg:grid-cols-4" : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
        )}
      >
        {STAGES.map((stage) => {
          const column = deals.filter((d) => d.stage === stage);
          const total = column.reduce((sum, d) => sum + d.value, 0);
          return (
            <div
              key={stage}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => onDrop(stage)}
              className="min-h-[180px] rounded-xl border border-white/[0.08] bg-white/[0.02] p-2.5"
            >
              <div className="mb-2 flex items-center justify-between px-1">
                <p className="text-xs font-medium text-white/70">{stage}</p>
                <p className="text-[10px] text-white/35">{formatCurrency(total)}</p>
              </div>
              <div className="space-y-2">
                <AnimatePresence initial={false}>
                  {column.map((deal) => (
                    <motion.div
                      key={deal.id}
                      layout
                      initial={false}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.96 }}
                      transition={{ type: "spring", stiffness: 420, damping: 28 }}
                      draggable
                      onDragStart={() => setDraggingId(deal.id)}
                      onDragEnd={() => setDraggingId(null)}
                      className={cn(
                        "cursor-grab rounded-lg border border-white/10 bg-[#0c1016] p-2.5 active:cursor-grabbing",
                        draggingId === deal.id && "border-accent/50 opacity-70",
                      )}
                    >
                      <p className="text-sm font-medium text-white/85">{deal.company}</p>
                      <div className="mt-1 flex items-center justify-between text-[11px] text-white/40">
                        <span>{deal.owner}</span>
                        <span className="text-accent/90">{formatCurrency(deal.value)}</span>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          );
        })}
      </div>
    </DemoShell>
  );
}
