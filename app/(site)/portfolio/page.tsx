import Link from "next/link";
import { CASE_STUDIES } from "@/lib/data/case-studies";
import { Badge, GlassCard } from "@/components/ui";

export default function PortfolioPage() {
  return (
    <div className="pt-32 pb-24">
      <div className="mx-auto max-w-6xl px-6">
        <p className="text-sm font-medium uppercase tracking-wider text-accent">
          Portfolio
        </p>
        <h1 className="mt-3 max-w-2xl font-display text-4xl font-semibold tracking-tight sm:text-5xl">
          Interactive case studies with live demos.
        </h1>
        <p className="mt-6 max-w-xl text-lg text-white/50 leading-relaxed">
          Each project includes before/after metrics, the stack we deployed, and working
          examples of the automation we built.
        </p>

        <div className="mt-16 space-y-8">
          {CASE_STUDIES.map((study) => (
            <Link key={study.slug} href={`/portfolio/${study.slug}`}>
              <GlassCard className="hover:border-white/15 transition-all">
                <div className="grid gap-8 lg:grid-cols-3">
                  <div className="lg:col-span-2">
                    <Badge>{study.industry}</Badge>
                    <h2 className="mt-4 text-2xl font-semibold">{study.client}</h2>
                    <p className="mt-3 text-white/50 leading-relaxed">{study.summary}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {study.metrics.map((m) => (
                      <div key={m.label} className="rounded-xl bg-white/[0.03] p-4">
                        <p className="text-xs text-white/40">{m.label}</p>
                        <p className="mt-1 text-sm text-white/30 line-through">
                          {m.before}
                        </p>
                        <p className="text-lg font-semibold text-accent">{m.after}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </GlassCard>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
