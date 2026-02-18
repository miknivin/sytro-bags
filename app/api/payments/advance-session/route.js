import Razorpay from "razorpay";
import dbConnect from "@/lib/db/connection";
import User from "@/models/User";
import SessionStartedOrder from "@/models/SessionStartedOrder";
import { isAuthenticatedUser } from "@/middlewares/auth";

export async function POST(req) {
  try {
    // 1. Authenticate user
    const user = await isAuthenticatedUser(req);
    if (!user) {
      return new Response(
        JSON.stringify({ success: false, error: "Unauthorized user" }),
        { status: 401 },
      );
    }

    // 2. Parse body – exactly same as default session route
    const body = await req.json();
    const { orderData } = body;

    const { itemsPrice, shippingInfo, orderItems, totalPrice } = orderData;

    // 3. Basic validation – same style as default route
    if (!itemsPrice || !orderItems || !totalPrice) {
      return new Response(JSON.stringify({ error: "Missing fields" }), {
        status: 400,
      });
    }

    // 4. Calculate advance amount (business rule for partial COD)
    const fixedCodCharge = 100;
    const advancePercentage = 0.5;
    const advanceAmount =
      fixedCodCharge + Math.round(totalPrice * advancePercentage);

    // Sanity check (optional but recommended)
    if (advanceAmount <= fixedCodCharge || advanceAmount >= totalPrice) {
      return new Response(
        JSON.stringify({ error: "Invalid advance amount calculation" }),
        { status: 400 },
      );
    }

    // 5. Initialize Razorpay
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_SECRET_KEY,
    });

    // 6. Create Razorpay order – but only for ADVANCE amount
    const options = {
      amount: advanceAmount * 100, // only advance in paise
      currency: "INR",
      receipt: `adv_${Date.now()}`,
      payment_capture: 1,
      notes: {
        payment_type: "advance",
        full_total: totalPrice,
      },
    };

    const order = await razorpay.orders.create(options);

    // 7. Save session with partial payment info
    const newOrder = new SessionStartedOrder({
      razorpayOrderId: order.id,
      razorpayPaymentStatus: order.status,

      // New fields for partial flow
      paymentMethod: "Partial-COD",
      paymentAmount: advanceAmount, // what is being charged now
      codCharge: 100,

      user: user._id,
      orderItems,
      shippingInfo,
      itemsPrice,
      totalAmount: totalPrice, // full order value (kept same as default)
    });

    await newOrder.save();

    console.log("Advance session created:", newOrder);

    // 8. Return exactly the same shape as default session route
    // → just the Razorpay order object
    return new Response(JSON.stringify(order), { status: 200 });
  } catch (error) {
    console.error("Advance session creation error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to create advance payment session" }),
      { status: 500 },
    );
  }
}
