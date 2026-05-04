import { NextResponse } from "next/server";
import crypto from "crypto";
import dbConnect from "@/lib/db/connection";
import Order from "@/models/Order";
import SessionStartedOrder from "@/models/SessionStartedOrder";
import { triggerAdminShipment } from "@/utlis/triggerAdminShipment";

/**
 * SERVER-SIDE RAZORPAY WEBHOOK
 *
 * This endpoint is called directly by Razorpay's servers when a payment is
 * captured. It acts as a reliable fallback for when the client-side webhook
 * call (/api/payments/webhook) fails — e.g. the user closes the tab, loses
 * internet, or a server error occurs after payment.
 *
 * Setup in Razorpay Dashboard:
 *   URL: https://<your-domain>/api/webhook/razorpay
 *   Events: payment.captured
 *   Secret: Set RAZORPAY_WEBHOOK_SECRET in your .env.local
 *
 * This handler is IDEMPOTENT — if the order already exists (client-side
 * webhook succeeded), it does nothing.
 */
export async function POST(req) {
  try {
    // 1. Read raw body for signature verification
    const rawBody = await req.text();
    const signature = req.headers.get("x-razorpay-signature");

    if (!signature) {
      console.error("[Razorpay Webhook] Missing signature header");
      return NextResponse.json({ error: "Missing signature" }, { status: 400 });
    }

    // 2. Verify webhook signature using RAZORPAY_WEBHOOK_SECRET
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
    if (!webhookSecret) {
      console.error("[Razorpay Webhook] RAZORPAY_WEBHOOK_SECRET is not set");
      return NextResponse.json({ error: "Server misconfigured" }, { status: 500 });
    }

    const expectedSignature = crypto
      .createHmac("sha256", webhookSecret)
      .update(rawBody)
      .digest("hex");

    if (expectedSignature !== signature) {
      console.error("[Razorpay Webhook] Invalid signature — possible spoofing attempt");
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    // 3. Parse the verified body
    const event = JSON.parse(rawBody);
    const eventType = event.event;

    // 4. Only handle payment.captured events
    if (eventType !== "payment.captured") {
      // Acknowledge other events without action
      return NextResponse.json({ received: true }, { status: 200 });
    }

    const payment = event.payload?.payment?.entity;
    const razorpayOrderId = payment?.order_id;
    const razorpayPaymentId = payment?.id;

    if (!razorpayOrderId) {
      console.error("[Razorpay Webhook] Missing order_id in payment entity");
      return NextResponse.json({ error: "Missing order_id" }, { status: 400 });
    }

    await dbConnect();

    // 5. IDEMPOTENCY CHECK — if order already saved by client-side webhook, skip
    const existingOrder = await Order.findOne({
      "paymentInfo.id": razorpayPaymentId,
    });
    if (existingOrder) {
      console.log(
        `[Razorpay Webhook] Order already exists for payment ${razorpayPaymentId} — skipping`
      );
      return NextResponse.json({ received: true, skipped: true }, { status: 200 });
    }

    // 6. Look up the session order to get all order data
    const sessionOrder = await SessionStartedOrder.findOne({
      razorpayOrderId,
    });

    if (!sessionOrder) {
      console.error(
        `[Razorpay Webhook] No SessionStartedOrder found for Razorpay order: ${razorpayOrderId}`
      );
      // Return 200 to prevent Razorpay from retrying — the order data is missing
      // and retrying won't help. Investigate manually.
      return NextResponse.json(
        { received: true, error: "Session not found — manual review needed" },
        { status: 200 }
      );
    }

    // 7. Determine payment method and amounts from the session
    const paymentMethod = sessionOrder.paymentMethod || "Online";
    const isPartial = paymentMethod === "Partial-COD";

    const codCharge = Number(process.env.COD_CHARGE ?? 100);
    const itemsTotal = Number(sessionOrder.itemsPrice) || 0;
    const totalAmount = Number(sessionOrder.totalAmount) || itemsTotal;
    const advancePaid = Number(sessionOrder.paymentAmount) || (isPartial ? 0 : totalAmount);

    let remainingAmount = 0;
    let codAmount = 0;
    let orderTotalAmount = totalAmount;

    if (isPartial) {
      const codChargeActual = Number(sessionOrder.codCharge ?? codCharge);
      remainingAmount = Math.max(totalAmount - (advancePaid - codChargeActual), 0);
      codAmount = remainingAmount;
      orderTotalAmount = totalAmount + codChargeActual;
    }

    // 8. Create the Order
    const newOrder = await Order.create({
      shippingInfo: {
        fullName: sessionOrder?.shippingInfo?.fullName,
        address: sessionOrder?.shippingInfo?.address,
        email: sessionOrder?.shippingInfo?.email,
        state: sessionOrder?.shippingInfo?.state,
        city: sessionOrder?.shippingInfo?.city,
        phoneNo: sessionOrder?.shippingInfo?.phoneNo,
        zipCode: sessionOrder?.shippingInfo?.zipCode,
        country: sessionOrder?.shippingInfo?.country || "India",
      },
      user: sessionOrder.user,
      orderItems: sessionOrder.orderItems?.map((item) => ({
        name: item?.name,
        uploadedImage: item?.uploadedImage,
        quantity: item?.quantity,
        image: item?.image,
        price: item?.price,
        product: item?.product,
        customNameToPrint: item?.customNameToPrint,
      })),
      paymentMethod,
      paymentInfo: {
        id: razorpayPaymentId,
        status: isPartial ? "Advance Paid" : "Paid",
      },
      itemsPrice: itemsTotal,
      taxAmount: 0,
      shippingAmount: 0,
      totalAmount: orderTotalAmount,
      advancePaid: isPartial ? advancePaid : 0,
      advancePaidAt: isPartial ? new Date() : null,
      remainingAmount,
      codAmount,
      codChargeCollected: isPartial ? Number(sessionOrder.codCharge ?? codCharge) : 0,
      orderStatus: "Processing",
      orderNotes: sessionOrder.orderNotes,
    });

    console.log(
      `[Razorpay Webhook] ✅ Order ${newOrder._id} created via server webhook for payment ${razorpayPaymentId}`
    );

    // 9. Cleanup session and trigger shipment (non-blocking)
    setImmediate(() => {
      SessionStartedOrder.deleteOne({ razorpayOrderId })
        .then(() => console.log(`[Razorpay Webhook] Cleaned up session ${razorpayOrderId}`))
        .catch((err) => console.error("[Razorpay Webhook] Session cleanup failed:", err));
    });

    setImmediate(() => {
      triggerAdminShipment(newOrder._id.toString()).catch((err) =>
        console.error("[Razorpay Webhook] triggerAdminShipment failed:", err)
      );
    });

    return NextResponse.json({ received: true, orderId: newOrder._id }, { status: 200 });
  } catch (error) {
    console.error("[Razorpay Webhook] Unhandled error:", {
      message: error.message,
      name: error.name,
      stack: error.stack,
      ...(error.errors && { validationErrors: Object.keys(error.errors) }),
    });
    // Return 500 so Razorpay retries the webhook
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
