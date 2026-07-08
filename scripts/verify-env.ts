/**
 * Verify LuvaTech environment variables are set.
 * Run: npm run env:check
 */

const required = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "SUPABASE_SERVICE_ROLE_KEY",
  "DATABASE_URL",
  "DIRECT_URL",
] as const;

const optional = ["OPENAI_API_KEY", "RESEND_API_KEY"] as const;

function loadEnv() {
  const fs = require("fs");
  const path = require("path");
  const envPath = path.join(process.cwd(), ".env.local");
  if (!fs.existsSync(envPath)) {
    console.error("Missing .env.local — copy from .env.example");
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

let failed = false;

console.log("=== LuvaTech env check ===\n");

for (const key of required) {
  const val = process.env[key];
  if (!val || val.length < 8) {
    console.error(`✗ ${key} — missing or empty`);
    failed = true;
  } else {
    const hint =
      key.includes("URL") && val.startsWith("http")
        ? val.replace(/https:\/\/([^.]+).*/, "https://$1…")
        : `${val.slice(0, 6)}…`;
    console.log(`✓ ${key} (${hint})`);
  }
}

console.log("");
for (const key of optional) {
  const val = process.env[key];
  if (!val) {
    console.log(`○ ${key} — not set (feature disabled)`);
  } else {
    console.log(`✓ ${key}`);
  }
}

if (failed) {
  console.log("\nAdd missing values to .env.local from your Supabase dashboard:");
  console.log("  Settings → API (URL, anon key, service_role key)");
  console.log("  Settings → Database → Connection string (URI + Direct)");
  process.exit(1);
}

console.log("\nAll required Supabase vars set. Run: npm run db:push");
