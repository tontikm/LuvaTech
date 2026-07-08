/**
 * Smoke-test OpenAI assistant API route.
 * Run: npm run test:chatbot
 * Requires dev server or SITE_URL pointing at a running instance.
 */

import fs from "fs";
import path from "path";

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

  if (!process.env.OPENAI_API_KEY) {
    console.log("SKIP: OPENAI_API_KEY not set");
    process.exit(0);
  }

  const base =
    process.argv[2] ??
    process.env.NEXT_PUBLIC_SITE_URL ??
    "http://localhost:3002";
  const url = `${base.replace(/\/$/, "")}/api/chat`;

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      messages: [{ role: "user", content: "Reply with exactly: LuvaTech OK" }],
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    console.error(`FAIL: ${response.status}`, body.slice(0, 500));
    process.exit(1);
  }

  const text = await response.text();
  if (!text.includes("data:") && !text.includes("LuvaTech")) {
    console.error("FAIL: unexpected response", text.slice(0, 300));
    process.exit(1);
  }

  console.log(`OK: assistant responded from ${url}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
