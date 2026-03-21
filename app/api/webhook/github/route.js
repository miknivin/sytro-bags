// app/api/github-webhook/route.js
import { NextResponse } from "next/server";

import Order from "@/models/Order";
import { verifySignature } from "@/utlis/verifySignature";

const GITHUB_WEBHOOK_SECRET = process.env.GITHUB_WEBHOOK_SECRET;

export async function POST(request) {
  if (!GITHUB_WEBHOOK_SECRET) {
    return NextResponse.json(
      { error: "Server misconfigured - missing webhook secret" },
      { status: 500 },
    );
  }

  const rawBody = await request.text();

  const signature = request.headers.get("x-hub-signature-256");
  const event = request.headers.get("x-github-event");

  if (
    !signature ||
    !verifySignature(rawBody, signature, GITHUB_WEBHOOK_SECRET)
  ) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  if (event !== "push") {
    return NextResponse.json({ received: true });
  }

  let payload;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const repo = payload.repository?.full_name || "unknown";
  const ref = payload.ref || "";
  const branch = ref.startsWith("refs/heads/")
    ? ref.replace("refs/heads/", "")
    : "unknown";

  if (branch !== "test") {
    return NextResponse.json({ received: true });
  }
  // Collect all changed files across commits
  const changedFiles = new Set();
  for (const commit of payload.commits || []) {
    [...(commit.added || []), ...(commit.modified || [])].forEach((file) =>
      changedFiles.add(file),
    );
  }

  const INVOICE_TEMPLATE_PATH = "lib/others/invoice.ejs";

  if (changedFiles.has(INVOICE_TEMPLATE_PATH)) {
    try {
      console.log(
        `[${new Date().toISOString()}] Invoice template changed → invalidating all invoiceURLs`,
      );

      const result = await Order.updateMany(
        { invoiceURL: { $ne: "" } },
        { $set: { invoiceURL: "" } },
      );

      console.log(
        `[${new Date().toISOString()}] Invoice URLs invalidated: ` +
          `matched=${result.matchedCount}, modified=${result.modifiedCount}`,
      );
    } catch (err) {
      console.error("Failed to invalidate invoice URLs:", err);
    }
  }

  return NextResponse.json({ received: true, ok: true });
}
