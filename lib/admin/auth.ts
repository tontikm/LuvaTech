import { createSupabaseServerClient } from "@/lib/supabase/client-server";
import { getSupabaseAdmin } from "@/lib/supabase/server";

export type AdminSession = {
  id: string;
  email: string;
  name: string;
};

export async function getAdminSession(): Promise<AdminSession | null> {
  if (
    process.env.NODE_ENV === "development" &&
    process.env.ADMIN_DEV_BYPASS === "true"
  ) {
    return {
      id: "dev-admin",
      email: process.env.ADMIN_EMAIL ?? "admin@luvatech.co.za",
      name: "Admin",
    };
  }

  const client = await createSupabaseServerClient();
  if (!client) return null;

  const {
    data: { user },
  } = await client.auth.getUser();
  if (!user) return null;

  const admin = getSupabaseAdmin();
  if (admin) {
    const { data: profile } = await admin
      .from("admin_profiles")
      .select("*")
      .eq("id", user.id)
      .maybeSingle();

    if (profile) {
      return {
        id: user.id,
        email: user.email ?? "",
        name: profile.name as string,
      };
    }
  }

  if (process.env.NODE_ENV === "development") {
    return {
      id: user.id,
      email: user.email ?? "",
      name: user.user_metadata?.name ?? "Admin",
    };
  }

  return null;
}

export async function requireAdminSession(): Promise<AdminSession> {
  const session = await getAdminSession();
  if (!session) throw new Error("Unauthorized");
  return session;
}
