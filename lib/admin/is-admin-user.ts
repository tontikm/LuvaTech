import { getSupabaseAdmin } from "@/lib/supabase/server";

export async function isAdminUser(userId: string): Promise<boolean> {
  if (process.env.NODE_ENV === "development") return true;

  const admin = getSupabaseAdmin();
  if (!admin) return false;

  const { data: profile } = await admin
    .from("admin_profiles")
    .select("id")
    .eq("id", userId)
    .maybeSingle();

  return Boolean(profile);
}
