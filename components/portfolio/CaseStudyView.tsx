"use client";

import Link from "next/link";
import { ArrowLeft, Bot, LayoutDashboard, FileText, Calendar } from "lucide-react";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { CaseStudy } from "@/lib/data/case-studies";
import { Badge, Button, GlassCard } from "@/components/ui";
import { QuoteCalculator } from "@/components/demos/QuoteCalculator";
import { PipelineBoard } from "@/components/demos/PipelineBoard";
import { BookingSimulator } from "@/components/demos/BookingSimulator";
import { ClientOnly } from "@/components/demos/ClientOnly";

const DEMO_ICONS = {
  chatbot: Bot,
  quote: FileText,
  booking: Calendar,
  dashboard: LayoutDashboard,
};

export function CaseStudyView({ study }: { study: CaseStudy }) {
  const [activeDemo, setActiveDemo] = useState(study.demoSections[0]?.id ?? "chatbot");
  const activeSection =
    study.demoSections.find((d) => d.id === activeDemo) ?? study.demoSections[0];

  return (
    <div className="pt-32 pb-24">
      <div className="mx-auto max-w-6xl px-6">
        <Link
          href="/portfolio"
          className="inline-flex items-center gap-2 text-sm text-white/40 transition-colors hover:text-white"
        >
          <ArrowLeft className="h-4 w-4 shrink-0" />
          All case studies
        </Link>

        <Badge className="mt-8">{study.industry}</Badge>
        <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight">
          {study.client}
        </h1>
        <p className="mt-4 text-xl text-white/50">{study.headline}</p>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {study.metrics.map((m) => (
            <GlassCard key={m.label}>
              <p className="text-xs text-white/40">{m.label}</p>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-sm text-white/30 line-through">{m.before}</span>
                <span className="text-xl font-semibold text-accent">{m.after}</span>
              </div>
              <p className="mt-1 text-xs text-green-400/80">{m.improvement}</p>
            </GlassCard>
          ))}
        </div>

        <div className="mt-16 grid gap-8 lg:grid-cols-2">
          <GlassCard>
            <h2 className="text-lg font-medium">The challenge</h2>
            <p className="mt-4 text-sm text-white/50 leading-relaxed">{study.challenge}</p>
            <h2 className="mt-8 text-lg font-medium">What we built</h2>
            <ul className="mt-4 space-y-2">
              {study.solution.map((s) => (
                <li key={s} className="text-sm text-white/50">
                  • {s}
                </li>
              ))}
            </ul>
            <div className="mt-6 flex flex-wrap gap-2">
              {study.stack.map((t) => (
                <Badge key={t}>{t}</Badge>
              ))}
            </div>
          </GlassCard>

          <div>
            <div className="mb-4 flex flex-wrap gap-2">
              {study.demoSections.map((section) => {
                const Icon = DEMO_ICONS[section.id as keyof typeof DEMO_ICONS] ?? Bot;
                return (
                  <button
                    key={section.id}
                    type="button"
                    onClick={() => setActiveDemo(section.id)}
                    className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-xs transition-colors ${
                      activeDemo === section.id
                        ? "border-accent bg-accent/10 text-white"
                        : "border-white/10 text-white/50 hover:border-white/20"
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    {section.title}
                  </button>
                );
              })}
            </div>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeDemo}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.22 }}
              >
                <GlassCard className="min-h-[280px]">
                  <h3 className="text-lg font-medium">{activeSection.title}</h3>
                  <p className="mt-3 text-sm text-white/50 leading-relaxed">
                    {activeSection.description}
                  </p>
                  {activeDemo === "chatbot" && (
                    <Button
                      className="mt-6"
                      variant="secondary"
                      onClick={() =>
                        window.dispatchEvent(new CustomEvent("open-ai-assistant"))
                      }
                    >
                      <Bot className="h-4 w-4" />
                      Talk to AI Assistant
                    </Button>
                  )}
                  {activeDemo === "quote" && (
                    <div className="mt-6">
                      <ClientOnly>
                        <QuoteCalculator compact lockServiceSlug="quotation-systems" />
                      </ClientOnly>
                    </div>
                  )}
                  {activeDemo === "dashboard" && (
                    <div className="mt-6">
                      <ClientOnly>
                        <PipelineBoard compact />
                      </ClientOnly>
                    </div>
                  )}
                  {activeDemo === "booking" && (
                    <div className="mt-6">
                      <ClientOnly>
                        <BookingSimulator compact />
                      </ClientOnly>
                    </div>
                  )}
                </GlassCard>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <GlassCard className="mt-12 border-l-2 border-l-accent">
          <blockquote className="text-lg italic leading-relaxed text-white/70">
            &ldquo;{study.testimonial.quote}&rdquo;
          </blockquote>
          <p className="mt-4 text-sm text-white/40">
            {study.testimonial.author}, {study.testimonial.role}
          </p>
        </GlassCard>
      </div>
    </div>
  );
}
