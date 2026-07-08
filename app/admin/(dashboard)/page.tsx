import { redirect } from "next/navigation";
import Link from "next/link";
import { getAdminSession } from "@/lib/admin/auth";
import { getDashboardData } from "@/lib/db/queries";
import { AdminShell } from "@/components/admin/AdminShell";
import { GlassCard } from "@/components/ui";
import { formatCurrency, formatDate } from "@/lib/utils";

export default async function AdminDashboardPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  const data = await getDashboardData();

  return (
    <AdminShell userName={session.name}>
      <h1 className="text-2xl font-semibold">Command Centre</h1>
      <p className="mt-1 text-sm text-white/50">
        Live data from your website — leads, quotes, and meetings.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "New leads (7d)", value: data.stats.newLeadsThisWeek },
          { label: "Quotes (7d)", value: data.stats.quotesThisWeek },
          { label: "Upcoming meetings", value: data.stats.upcomingMeetings },
          { label: "Conversion rate", value: `${data.stats.conversionRate}%` },
        ].map((stat) => (
          <GlassCard key={stat.label}>
            <p className="text-xs text-white/40">{stat.label}</p>
            <p className="mt-2 text-3xl font-semibold">{stat.value}</p>
          </GlassCard>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <GlassCard>
          <div className="flex items-center justify-between">
            <h2 className="font-medium">Recent quotations</h2>
            <Link href="/admin/quotes" className="text-xs text-indigo-400 hover:text-indigo-300">
              View all
            </Link>
          </div>
          <div className="mt-4 space-y-3">
            {data.quotes.slice(0, 5).map((q) => (
              <div
                key={q.id}
                className="flex items-center justify-between border-b border-white/[0.04] pb-3 last:border-0"
              >
                <div>
                  <p className="text-sm font-medium">
                    {"quoteNumber" in q ? q.quoteNumber : (q as { quoteNumber: string }).quoteNumber}
                  </p>
                  <p className="text-xs text-white/40">
                    {"businessName" in q ? q.businessName : ""}
                  </p>
                </div>
                <p className="text-sm text-indigo-400">
                  {formatCurrency("priceEstimate" in q ? (q.priceEstimate as number) : 0)}
                </p>
              </div>
            ))}
            {!data.quotes.length && (
              <p className="text-sm text-white/30">No quotes yet — open the AI assistant to generate one.</p>
            )}
          </div>
        </GlassCard>

        <GlassCard>
          <div className="flex items-center justify-between">
            <h2 className="font-medium">Upcoming meetings</h2>
            <Link href="/admin/meetings" className="text-xs text-indigo-400 hover:text-indigo-300">
              View all
            </Link>
          </div>
          <div className="mt-4 space-y-3">
            {data.upcomingBookings.slice(0, 5).map((b) => (
              <div key={b.id} className="border-b border-white/[0.04] pb-3 last:border-0">
                <p className="text-sm font-medium">{b.name}</p>
                <p className="text-xs text-white/40">
                  {formatDate(b.scheduledAt)} · {b.email}
                </p>
              </div>
            ))}
            {!data.upcomingBookings.length && (
              <p className="text-sm text-white/30">No upcoming meetings.</p>
            )}
          </div>
        </GlassCard>
      </div>
    </AdminShell>
  );
}
