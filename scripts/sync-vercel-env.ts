/**
 * Push .env.local values to Vercel Production environment.
 * Run: npm run sync:vercel-env
 *
 * Overrides ADMIN_DEV_BYPASS=false for production.
 * Skips empty optional API keys (OPENAI, RESEND).
 */

import { execSync } from "child_process";
import fs from "fs";
import path from "path";

const ENV_PATH = path.join(process.cwd(), ".env.local");

const REQUIRED = [
  "NEXT_PUBLIC_SITE_URL",
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "SUPABASE_SERVICE_ROLE_KEY",
  "DATABASE_URL",
  "DIRECT_URL",
  "EMAIL_FROM",
] as const;

const OPTIONAL = ["OPENAI_API_KEY", "RESEND_API_KEY"] as const;

const PRODUCTION_OVERRIDES: Record<string, string> = {
  ADMIN_DEV_BYPASS: "false",
};

function parseEnvFile(content: string): Record<string, string> {
  const out: Record<string, string> = {};
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
    out[key] = val;
  }
  return out;
}

function addEnv(key: string, value: string) {
  execSync(`npx vercel env add ${key} production --force`, {
    input: value,
    stdio: ["pipe", "inherit", "inherit"],
    encoding: "utf-8",
  });
  console.log(`✓ ${key}`);
}

function main() {
  if (!fs.existsSync(ENV_PATH)) {
    console.error("Missing .env.local");
    process.exit(1);
  }

  const env = parseEnvFile(fs.readFileSync(ENV_PATH, "utf-8"));
  Object.assign(env, PRODUCTION_OVERRIDES);

  if (env.NEXT_PUBLIC_SITE_URL?.includes("localhost")) {
    env.NEXT_PUBLIC_SITE_URL =
      process.env.VERCEL_PRODUCTION_URL ?? "https://luvatech.vercel.app";
    console.log(`Using production site URL: ${env.NEXT_PUBLIC_SITE_URL}\n`);
  }

  console.log("=== Syncing env to Vercel (production) ===\n");

  for (const key of REQUIRED) {
    const val = env[key];
    if (!val) {
      console.error(`✗ ${key} — missing in .env.local`);
      process.exit(1);
    }
    addEnv(key, val);
  }

  addEnv("ADMIN_DEV_BYPASS", PRODUCTION_OVERRIDES.ADMIN_DEV_BYPASS);

  for (const key of OPTIONAL) {
    const val = env[key];
    if (!val) {
      console.log(`○ ${key} — skipped (empty, add in Vercel when ready)`);
      continue;
    }
    addEnv(key, val);
  }

  console.log("\nDone. Redeploy: npx vercel --prod");
}

main();
