"use server";

import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/client-server";

export async function adminLoginAction(email: string, password: string) {
  const client = await createSupabaseServerClient();
  if (!client) {
    if (
      process.env.NODE_ENV === "development" &&
      process.env.ADMIN_DEV_BYPASS === "true"
    ) {
      return { ok: true };
    }
    return { ok: false, error: "Auth not configured" };
  }

  const { error } = await client.auth.signInWithPassword({ email, password });
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

export async function adminLogoutAction() {
  const client = await createSupabaseServerClient();
  if (client) await client.auth.signOut();
  redirect("/admin/login");
}
