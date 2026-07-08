import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Check } from "lucide-react";
import { getService, SERVICES } from "@/lib/data/services";
import { Badge, Button, GlassCard } from "@/components/ui";
import { formatCurrency } from "@/lib/utils";
import { ServiceDemoEmbed } from "@/components/demos/ServiceDemoEmbed";
import { PackageCard } from "@/components/services/PackageCard";

export function generateStaticParams() {
  return SERVICES.map((s) => ({ slug: s.slug }));
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();

  return (
    <div className="pt-32 pb-24">
      <div className="mx-auto max-w-6xl px-6">
        <div>
          <Link
            href="/services"
            className="inline-flex items-center gap-2 text-sm text-white/40 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-4 w-4 shrink-0" />
            All services
          </Link>
        </div>

        <div className="mt-8">
          <Badge>{service.timeline}</Badge>
        </div>

        <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight">
          {service.title}
        </h1>
        <p className="mt-4 text-xl text-white/50">{service.headline}</p>
        <p className="mt-6 text-lg leading-relaxed text-white/60">{service.description}</p>

        <div className="mt-10 flex flex-wrap items-center gap-4">
          <p className="font-display text-2xl font-semibold">
            From {formatCurrency(service.startingFrom)}
          </p>
          <Link href="/book">
            <Button size="md">Book Demo</Button>
          </Link>
        </div>

        <section className="mt-16">
          <h2 className="font-display text-2xl font-semibold tracking-tight">Packages</h2>
          <p className="mt-2 text-sm text-white/50">
            Pick a starting point. We tailor scope after a short discovery call.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
            {service.packages.map((pkg, index) => (
              <PackageCard key={pkg.name} pkg={pkg} index={index} />
            ))}
          </div>
        </section>

        <ServiceDemoEmbed slug={service.slug} />

        <div className="mt-16 grid gap-6 sm:grid-cols-2">
          <GlassCard>
            <h2 className="font-display text-lg font-medium">Outcomes</h2>
            <ul className="mt-4 space-y-3">
              {service.outcomes.map((o) => (
                <li key={o} className="flex gap-2 text-sm text-white/60">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                  {o}
                </li>
              ))}
            </ul>
          </GlassCard>
          <GlassCard>
            <h2 className="font-display text-lg font-medium">Capabilities</h2>
            <ul className="mt-4 space-y-3">
              {service.capabilities.map((c) => (
                <li key={c} className="flex gap-2 text-sm text-white/60">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                  {c}
                </li>
              ))}
            </ul>
          </GlassCard>
        </div>

        <GlassCard className="mt-6">
          <h2 className="font-display text-lg font-medium">Technology</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {service.techStack.map((t) => (
              <Badge key={t}>{t}</Badge>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
