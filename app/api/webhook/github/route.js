// app/api/github-webhook/route.js
import { NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "crypto";

// ──────────────────────────────────────────────
//   CONFIG – put this in .env.local or Vercel env vars
// ──────────────────────────────────────────────
const GITHUB_WEBHOOK_SECRET = process.env.GITHUB_WEBHOOK_SECRET;

if (!GITHUB_WEBHOOK_SECRET) {
  console.error("Missing environment variable: GITHUB_WEBHOOK_SECRET");
  // In real production → you should crash or return 500 here
}

// Constant-time comparison → prevents timing attacks
function verifySignature(payload, receivedSignature) {
  if (!receivedSignature || !receivedSignature.startsWith("sha256=")) {
    return false;
  }

  const signature = receivedSignature.slice(7); // remove "sha256="

  const expected = createHmac("sha256", GITHUB_WEBHOOK_SECRET)
    .update(payload)
    .digest("hex");

  try {
    const expectedBuf = Buffer.from(expected, "hex");
    const receivedBuf = Buffer.from(signature, "hex");

    if (expectedBuf.length !== receivedBuf.length) {
      return false;
    }

    return timingSafeEqual(expectedBuf, receivedBuf);
  } catch {
    return false;
  }
}

export async function POST(request) {
  // 1. Get raw body → needed for signature verification
  const rawBody = await request.text();

  // 2. Read important GitHub headers
  const signature = request.headers.get("x-hub-signature-256");
  const event = request.headers.get("x-github-event");

  // 3. Verify signature (security – do NOT skip this!)
  if (!signature || !verifySignature(rawBody, signature)) {
    console.error("Invalid or missing GitHub webhook signature");
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  // 4. We only care about push events
  if (event !== "push") {
    return NextResponse.json({ received: true, ignored: true });
  }

  // 5. Parse the JSON payload
  let payload;
  try {
    payload = JSON.parse(rawBody);
  } catch (err) {
    console.error("Invalid JSON in webhook payload", err);
    return NextResponse.json({ error: "Bad payload" }, { status: 400 });
  }

  // 6. Extract key information
  const repo = payload.repository?.full_name || "unknown/repo";
  const branch = payload.ref?.replace("refs/heads/", "") || "unknown";
  const pusher = payload.pusher?.name || payload.pusher?.login || "unknown";
  const commits = payload.commits || [];

  // 7. Collect ALL changed files in this push (can span multiple commits)
  const changedFiles = new Set();

  for (const commit of commits) {
    // Added files
    (commit.added || []).forEach((file) => changedFiles.add(`A  ${file}`));
    // Modified files
    (commit.modified || []).forEach((file) => changedFiles.add(`M  ${file}`));
    // Removed files
    (commit.removed || []).forEach((file) => changedFiles.add(`D  ${file}`));
  }

  // 8. Nice console output (you can replace this with Slack/DB/file logging)
  console.log("───────────────────────────────");
  console.log("GitHub Push received");
  console.log(`Repo:    ${repo}`);
  console.log(`Branch:  ${branch}`);
  console.log(`Pusher:  ${pusher}`);
  console.log(`Commits: ${commits.length}`);

  console.log(`Changed files (${changedFiles.size}):`);

  if (changedFiles.size === 0) {
    console.log("  (no file changes detected)");
  } else {
    // Sort for nicer reading
    [...changedFiles].sort().forEach((line) => console.log(`  ${line}`));
  }

  console.log("───────────────────────────────");

  // GitHub expects HTTP 2xx quickly (~10 seconds max)
  return NextResponse.json({ received: true, ok: true });
}

// Very important: disable Next.js body parser → we need raw string for HMAC
export const config = {
  api: {
    bodyParser: false,
  },
};