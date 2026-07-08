import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/admin/auth";
import { getDashboardData } from "@/lib/db/queries";
import { AdminShell } from "@/components/admin/AdminShell";
import { GlassCard } from "@/components/ui";
import { formatDate } from "@/lib/utils";

export default async function AdminMeetingsPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  const { bookings } = await getDashboardData();

  return (
    <AdminShell userName={session.name}>
      <h1 className="text-2xl font-semibold">Meetings</h1>
      <p className="mt-1 text-sm text-white/50">Consultation bookings from website and AI assistant.</p>

      <div className="mt-8 space-y-3">
        {bookings.map((b) => (
          <GlassCard key={b.id}>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="font-medium">{b.name}</p>
                <p className="text-sm text-white/50">{b.email}</p>
                {b.company && <p className="text-xs text-white/30">{b.company}</p>}
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">{formatDate(b.scheduledAt)}</p>
                <p className="text-xs text-white/40">{b.status}</p>
              </div>
            </div>
            {b.notes && <p className="mt-3 text-sm text-white/40">{b.notes}</p>}
          </GlassCard>
        ))}
        {!bookings.length && (
          <GlassCard>
            <p className="text-sm text-white/40">No bookings yet.</p>
          </GlassCard>
        )}
      </div>
    </AdminShell>
  );
}
