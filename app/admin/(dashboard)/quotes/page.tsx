import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/admin/auth";
import { getDashboardData } from "@/lib/db/queries";
import { AdminShell } from "@/components/admin/AdminShell";
import { GlassCard } from "@/components/ui";
import { formatCurrency, formatDate } from "@/lib/utils";

export default async function AdminQuotesPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  const { quotes } = await getDashboardData();

  return (
    <AdminShell userName={session.name}>
      <h1 className="text-2xl font-semibold">Quotations</h1>
      <p className="mt-1 text-sm text-white/50">AI-generated project proposals.</p>

      <div className="mt-8 space-y-4">
        {quotes.map((q) => {
          const quote = q as {
            id: string;
            quoteNumber: string;
            businessName: string;
            contactName: string;
            email: string;
            priceEstimate: number;
            estimatedTimeline: string;
            createdAt: string | Date;
          };
          return (
            <GlassCard key={quote.id}>
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="font-medium">{quote.quoteNumber}</p>
                  <p className="text-sm text-white/50">
                    {quote.businessName} · {quote.contactName}
                  </p>
                  <p className="text-xs text-white/30 mt-1">{quote.email}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold text-indigo-400">
                    {formatCurrency(quote.priceEstimate)}
                  </p>
                  <p className="text-xs text-white/40">{quote.estimatedTimeline}</p>
                </div>
              </div>
              <p className="mt-3 text-xs text-white/30">
                {formatDate(quote.createdAt)}
              </p>
            </GlassCard>
          );
        })}
        {!quotes.length && (
          <GlassCard>
            <p className="text-sm text-white/40">No quotations yet.</p>
          </GlassCard>
        )}
      </div>
    </AdminShell>
  );
}
