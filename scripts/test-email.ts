/**
 * Smoke-test Resend email delivery.
 * Run: npm run test:email [recipient@email.com]
 */

import fs from "fs";
import path from "path";
import { sendEmail, isEmailConfigured } from "../lib/email/send";

function loadEnvLocal() {
  const envPath = path.join(process.cwd(), ".env.local");
  if (!fs.existsSync(envPath)) return;
  for (const line of fs.readFileSync(envPath, "utf-8").split("\n")) {
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

async function main() {
  loadEnvLocal();

  if (!isEmailConfigured()) {
    console.log("SKIP: RESEND_API_KEY or EMAIL_FROM not set");
    process.exit(0);
  }

  const to = process.argv[2] ?? process.env.ADMIN_EMAIL;
  if (!to?.includes("@")) {
    console.error("Usage: npm run test:email -- recipient@email.com");
    process.exit(1);
  }

  const result = await sendEmail({
    to,
    subject: "LuvaTech email smoke test",
    html: "<p>If you received this, Resend is configured correctly.</p>",
    text: "If you received this, Resend is configured correctly.",
  });

  if (!result.ok) {
    console.error("FAIL:", result.error);
    process.exit(1);
  }

  console.log(`OK: test email sent to ${to}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
