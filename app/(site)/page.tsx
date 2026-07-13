import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { HeroSection, FeaturesSection, CtaSection } from "@/components/marketing/sections";
import { ProductLabSection } from "@/components/demos/ProductLabSection";
import { SERVICES } from "@/lib/data/services";
import { getCarePlanStartingFrom } from "@/lib/data/care-plans";
import { CASE_STUDIES } from "@/lib/data/case-studies";
import { GlassCard, Badge } from "@/components/ui";
import { formatCurrency } from "@/lib/utils";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FeaturesSection />
      <ProductLabSection />

      <section className="py-24 border-t border-white/[0.06]">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-medium uppercase tracking-wider text-accent">
                Services
              </p>
              <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight">
                Everything your business needs to run on autopilot.
              </h2>
            </div>
            <Link
              href="/services"
              className="hidden text-sm text-white/50 hover:text-white sm:flex items-center gap-1"
            >
              View all <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {SERVICES.slice(0, 6).map((service) => {
              const careFrom = getCarePlanStartingFrom(service.slug);
              return (
              <Link key={service.slug} href={`/services/${service.slug}`}>
                <GlassCard className="h-full hover:border-white/15 transition-all group">
                  <Badge>{service.timeline}</Badge>
                  <h3 className="mt-4 font-display text-lg font-medium group-hover:text-white transition-colors">
                    {service.title}
                  </h3>
                  <p className="mt-2 text-sm text-white/50 line-clamp-2">
                    {service.headline}
                  </p>
                  <p className="mt-4 text-sm text-white/30">
                    Build from {formatCurrency(service.startingFrom)}
                    {careFrom != null && (
                      <> · Care from {formatCurrency(careFrom)}/mo</>
                    )}
                  </p>
                </GlassCard>
              </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-24 border-t border-white/[0.06]">
        <div className="mx-auto max-w-6xl px-6">
          <p className="text-sm font-medium uppercase tracking-wider text-accent">
            Case studies
          </p>
          <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight">
            Real results, not mockups.
          </h2>

          <div className="mt-12 grid gap-6 lg:grid-cols-2">
            {CASE_STUDIES.map((study) => (
              <Link key={study.slug} href={`/portfolio/${study.slug}`}>
                <GlassCard className="h-full hover:border-white/15 transition-all group">
                  <Badge>{study.industry}</Badge>
                  <h3 className="mt-4 font-display text-xl font-medium">{study.client}</h3>
                  <p className="mt-2 text-white/50 leading-relaxed">{study.headline}</p>
                  <div className="mt-6 grid grid-cols-2 gap-4">
                    {study.metrics.slice(0, 2).map((m) => (
                      <div key={m.label}>
                        <p className="text-lg font-semibold text-accent">
                          {m.improvement}
                        </p>
                        <p className="text-xs text-white/40">{m.label}</p>
                      </div>
                    ))}
                  </div>
                </GlassCard>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <CtaSection />
    </>
  );
}
