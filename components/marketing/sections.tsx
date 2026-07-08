"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowRight,
  Bot,
  Calendar,
  FileText,
  Workflow,
  Zap,
} from "lucide-react";
import { BRAND_DESCRIPTION, BRAND_NAME, BRAND_TAGLINE } from "@/lib/site";
import { Button, GlassCard, GradientRing } from "@/components/ui";

const FEATURES = [
  {
    icon: Workflow,
    title: "Full Automation",
    description:
      "CRM pipelines, dashboards, and integrations connected end to end.",
  },
  {
    icon: FileText,
    title: "Instant Proposals",
    description:
      "Branded PDF quotations emailed in seconds, not days. No manual copy-paste.",
  },
  {
    icon: Calendar,
    title: "Smart Booking",
    description:
      "Consultation scheduling built into the conversation flow with automated confirmations.",
  },
  {
    icon: Bot,
    title: "AI Assistant",
    description:
      "Qualifies leads, answers questions, and generates quotes live on this site right now.",
  },
];

export function HeroSection() {
  return (
    <section className="relative flex min-h-[100svh] items-center overflow-x-hidden">
      <div className="absolute inset-0 grid-bg" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(45,212,191,0.18),transparent_55%)]" />
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-background to-transparent" />

      <div className="relative mx-auto w-full max-w-6xl px-6 pb-24 pt-28">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="font-display text-5xl font-bold tracking-tight sm:text-7xl lg:text-8xl"
        >
          <span className="gradient-text">{BRAND_NAME}</span>
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.12 }}
          className="mt-6 max-w-2xl font-display text-2xl font-semibold tracking-tight text-white/90 sm:text-3xl lg:text-4xl"
        >
          {BRAND_TAGLINE}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.22 }}
          className="mt-5 max-w-xl text-base leading-relaxed text-white/50 sm:text-lg"
        >
          {BRAND_DESCRIPTION}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.32 }}
          className="mt-10 flex flex-col items-stretch gap-4 sm:flex-row sm:items-center"
        >
          <Link href="/book" className="w-full sm:w-auto">
            <Button size="lg" className="w-full sm:w-auto">
              Book Demo
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <GradientRing fullWidth>
            <Button
              size="lg"
              variant="secondary"
              className="w-full border-transparent shadow-none sm:w-auto"
              onClick={() => {
                window.dispatchEvent(new CustomEvent("open-ai-assistant"));
              }}
            >
              <Bot className="h-4 w-4" />
              Ask a question
            </Button>
          </GradientRing>
        </motion.div>
      </div>
    </section>
  );
}

export function FeaturesSection() {
  return (
    <section className="border-t border-white/[0.06] py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="max-w-xl">
          <p className="text-sm font-medium uppercase tracking-wider text-accent">
            What you&apos;re experiencing
          </p>
          <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            This website is the product demo.
          </h2>
          <p className="mt-4 text-white/50 leading-relaxed">
            Every feature you interact with, from automated workflows and quote generation to
            booking, is exactly what we build for clients.
          </p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2">
          {FEATURES.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <GlassCard className="h-full hover:border-accent/20 transition-colors">
                <feature.icon className="h-5 w-5 text-accent" />
                <h3 className="mt-4 font-display text-lg font-medium">{feature.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/50">
                  {feature.description}
                </p>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function CtaSection() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-6xl px-6">
        <GlassCard className="relative overflow-hidden text-center">
          <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-transparent to-transparent" />
          <div className="relative">
            <Zap className="mx-auto h-8 w-8 text-accent" />
            <h2 className="mt-6 font-display text-3xl font-semibold tracking-tight">
              Ready to automate your business?
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-white/50">
              Tell us what you want to automate. You&apos;ll receive a professional
              quotation in minutes.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button
                size="lg"
                onClick={() => window.dispatchEvent(new CustomEvent("open-ai-assistant"))}
              >
                Get Your Quote
              </Button>
              <Link href="/book">
                <Button size="lg" variant="outline">
                  Schedule a Call
                </Button>
              </Link>
            </div>
          </div>
        </GlassCard>
      </div>
    </section>
  );
}
