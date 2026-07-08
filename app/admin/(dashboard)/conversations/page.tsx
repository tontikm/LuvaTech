import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/admin/auth";
import { getDashboardData } from "@/lib/db/queries";
import { AdminShell } from "@/components/admin/AdminShell";
import { GlassCard } from "@/components/ui";
import { formatDate } from "@/lib/utils";

export default async function AdminConversationsPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  const { conversations } = await getDashboardData();

  return (
    <AdminShell userName={session.name}>
      <h1 className="text-2xl font-semibold">Conversations</h1>
      <p className="mt-1 text-sm text-white/50">Recent AI assistant sessions.</p>

      <div className="mt-8 space-y-3">
        {conversations.map((c) => {
          const messages = Array.isArray(c.messages) ? c.messages : [];
          const lastMsg = messages[messages.length - 1] as
            | { role?: string; parts?: Array<{ text?: string }> }
            | undefined;
          const preview =
            lastMsg?.parts?.[0]?.text?.slice(0, 120) ??
            (typeof lastMsg === "object" && lastMsg && "content" in lastMsg
              ? String((lastMsg as { content: string }).content).slice(0, 120)
              : "No messages");

          return (
            <GlassCard key={c.id}>
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">Session {c.sessionId.slice(0, 8)}…</p>
                <p className="text-xs text-white/40">
                  {formatDate(
                    "updatedAt" in c && c.updatedAt
                      ? (c.updatedAt as string | Date)
                      : (c as { createdAt: string | Date }).createdAt,
                  )}
                </p>
              </div>
              <p className="mt-2 text-sm text-white/50 line-clamp-2">{preview}</p>
              <p className="mt-2 text-xs text-white/30">{messages.length} messages</p>
            </GlassCard>
          );
        })}
        {!conversations.length && (
          <GlassCard>
            <p className="text-sm text-white/40">Conversations appear when visitors use the AI assistant.</p>
          </GlassCard>
        )}
      </div>
    </AdminShell>
  );
}
