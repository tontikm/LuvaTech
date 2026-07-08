/**
 * Create admin user in Supabase Auth + admin_profiles row.
 * Run: npm run admin:setup -- your@email.com "Your Name" [password]
 *
 * If password omitted, one is generated and printed.
 */

import { createClient } from "@supabase/supabase-js";
import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";
import crypto from "crypto";

function loadEnv() {
  const envPath = path.join(process.cwd(), ".env.local");
  if (!fs.existsSync(envPath)) {
    console.error("Missing .env.local");
    process.exit(1);
  }
  const content = fs.readFileSync(envPath, "utf-8");
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let val = trimmed.slice(eq + 1).trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = val;
  }
}

loadEnv();

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error("Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local");
  process.exit(1);
}

const email = process.argv[2];
const name = process.argv[3] ?? "Admin";
let password = process.argv[4];

if (!email || !email.includes("@")) {
  console.error('Usage: npm run admin:setup -- your@email.com "Your Name" [password]');
  process.exit(1);
}

if (!password) {
  password = crypto.randomBytes(12).toString("base64url");
}

async function main() {
  const supabase = createClient(url!, serviceKey!, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { data: existing } = await supabase.auth.admin.listUsers();
  const found = existing?.users?.find((u) => u.email === email);

  let userId: string;

  if (found) {
    userId = found.id;
    await supabase.auth.admin.updateUserById(userId, { password, user_metadata: { name } });
    console.log(`Updated existing user: ${email}`);
  } else {
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { name },
    });
    if (error || !data.user) {
      console.error("Create user failed:", error?.message);
      process.exit(1);
    }
    userId = data.user.id;
    console.log(`Created user: ${email}`);
  }

  const prisma = new PrismaClient();
  await prisma.adminProfile.upsert({
    where: { id: userId },
    create: { id: userId, email, name, role: "admin" },
    update: { email, name },
  });
  await prisma.$disconnect();

  console.log("\n=== Admin ready ===");
  console.log(`Email:    ${email}`);
  console.log(`Password: ${password}`);
  console.log(`Login:    ${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3002"}/admin/login`);
  console.log("\nSet ADMIN_DEV_BYPASS=false in .env.local to require login.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
