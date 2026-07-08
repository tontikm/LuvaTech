import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/admin/auth";
import { getDashboardData } from "@/lib/db/queries";
import { AdminShell } from "@/components/admin/AdminShell";
import { GlassCard, Badge } from "@/components/ui";
import { formatDate } from "@/lib/utils";

export default async function AdminLeadsPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  const { leads } = await getDashboardData();

  return (
    <AdminShell userName={session.name}>
      <h1 className="text-2xl font-semibold">Leads</h1>
      <p className="mt-1 text-sm text-white/50">{leads.length} total leads captured.</p>

      <div className="mt-8 space-y-3">
        {leads.map((lead) => (
          <GlassCard key={lead.id} className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="font-medium">{lead.businessName}</p>
              <p className="text-sm text-white/50">
                {lead.contactName} · {lead.email}
              </p>
              <p className="text-xs text-white/30 mt-1">
                {lead.industry} · {formatDate(lead.createdAt)}
              </p>
            </div>
            <Badge>{lead.status}</Badge>
          </GlassCard>
        ))}
        {!leads.length && (
          <GlassCard>
            <p className="text-sm text-white/40">Leads appear when visitors use the AI assistant or quote form.</p>
          </GlassCard>
        )}
      </div>
    </AdminShell>
  );
}
