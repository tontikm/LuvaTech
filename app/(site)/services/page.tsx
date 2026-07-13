import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { SERVICES, getServiceMonthlyStartingFrom } from "@/lib/data/services";
import { GlassCard, Badge } from "@/components/ui";
import { formatCurrency } from "@/lib/utils";

export default function ServicesPage() {
  return (
    <div className="pt-32 pb-24">
      <div className="mx-auto max-w-6xl px-6">
        <p className="text-sm font-medium uppercase tracking-wider text-accent">
          Services
        </p>
        <h1 className="mt-3 max-w-2xl font-display text-4xl font-semibold tracking-tight sm:text-5xl">
          Production-grade systems, not slide decks.
        </h1>
        <p className="mt-6 max-w-xl text-lg text-white/50 leading-relaxed">
          Each service is delivered with the same architecture, testing, and deployment
          standards you see running on this website. Pay once-off or choose a managed monthly
          subscription.
        </p>

        <div className="mt-16 grid gap-6 sm:grid-cols-2">
          {SERVICES.map((service) => {
            const monthlyFrom = getServiceMonthlyStartingFrom(service.slug);
            return (
            <Link key={service.slug} href={`/services/${service.slug}`}>
              <GlassCard className="h-full hover:border-white/15 transition-all group">
                <div className="flex items-start justify-between">
                  <Badge>{service.timeline}</Badge>
                  <ArrowUpRight className="h-4 w-4 text-white/20 group-hover:text-white/60 transition-colors" />
                </div>
                <h2 className="mt-4 text-xl font-medium">{service.title}</h2>
                <p className="mt-2 text-sm text-white/50 leading-relaxed">
                  {service.headline}
                </p>
                <p className="mt-6 text-sm text-white/30">
                  Once-off from {formatCurrency(service.startingFrom)}
                  {monthlyFrom != null && (
                    <> · or from {formatCurrency(monthlyFrom)}/mo</>
                  )}
                </p>
              </GlassCard>
            </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
