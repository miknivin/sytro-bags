import { createHmac, timingSafeEqual } from "crypto";

export function verifySignature(payload, receivedSignature) {
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
