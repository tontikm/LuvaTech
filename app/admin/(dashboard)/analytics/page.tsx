import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/admin/auth";
import { getDashboardData } from "@/lib/db/queries";
import { AdminShell } from "@/components/admin/AdminShell";
import { GlassCard } from "@/components/ui";

export default async function AdminAnalyticsPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  const data = await getDashboardData();

  const pageViews = data.analytics.filter((a) => a.type === "page_view");
  const chatStarts = data.analytics.filter((a) => a.type === "chat_start");

  const pathCounts = pageViews.reduce<Record<string, number>>((acc, e) => {
    const path = e.path ?? "/";
    acc[path] = (acc[path] ?? 0) + 1;
    return acc;
  }, {});

  const topPaths = Object.entries(pathCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8);

  return (
    <AdminShell userName={session.name}>
      <h1 className="text-2xl font-semibold">Analytics</h1>
      <p className="mt-1 text-sm text-white/50">Website traffic and conversion metrics.</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <GlassCard>
          <p className="text-xs text-white/40">Page views</p>
          <p className="mt-2 text-3xl font-semibold">{data.stats.pageViews}</p>
        </GlassCard>
        <GlassCard>
          <p className="text-xs text-white/40">Chat sessions started</p>
          <p className="mt-2 text-3xl font-semibold">{data.stats.chatStarts}</p>
        </GlassCard>
        <GlassCard>
          <p className="text-xs text-white/40">Quotes generated</p>
          <p className="mt-2 text-3xl font-semibold">{data.stats.quoteRequests}</p>
        </GlassCard>
        <GlassCard>
          <p className="text-xs text-white/40">Chat → quote conversion</p>
          <p className="mt-2 text-3xl font-semibold">{data.stats.conversionRate}%</p>
        </GlassCard>
      </div>

      <GlassCard className="mt-8">
        <h2 className="font-medium">Top pages</h2>
        <div className="mt-4 space-y-2">
          {topPaths.map(([path, count]) => (
            <div key={path} className="flex items-center justify-between text-sm">
              <span className="text-white/60">{path}</span>
              <span className="text-white/40">{count} views</span>
            </div>
          ))}
          {!topPaths.length && (
            <p className="text-sm text-white/30">Browse the site to populate analytics.</p>
          )}
        </div>
      </GlassCard>

      <GlassCard className="mt-6">
        <h2 className="font-medium">Recent events</h2>
        <div className="mt-4 space-y-2">
          {data.analytics.slice(0, 15).map((e) => (
            <div key={e.id} className="flex items-center justify-between text-xs text-white/40">
              <span>{e.type}</span>
              <span>{e.path ?? "—"}</span>
            </div>
          ))}
        </div>
      </GlassCard>
    </AdminShell>
  );
}
