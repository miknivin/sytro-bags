import { NextResponse } from "next/server";
import crypto from "crypto";
import Order from "@/models/Order";
import dbConnect from "@/lib/db/connection";
import { isAuthenticatedUser } from "@/middlewares/auth";
import SessionStartedOrder from "@/models/SessionStartedOrder";
import { triggerAdminShipment } from "@/utlis/triggerAdminShipment";

export async function POST(req) {
  try {
    const user = await isAuthenticatedUser(req);
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    const body = await req.json();

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      shippingInfo,
      cartItems,
      itemsPrice,
      shippingPrice = 0,
      totalPrice,
      taxPrice = 0,
      orderNotes = "",
      couponApplied = "No",
      discountAmount = 0,
      couponDiscountType = "",
      couponDiscountValue = 0,
      advanceAmount,
    } = body;

    // Required Razorpay fields
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { success: false, error: "Missing payment details" },
        { status: 400 },
      );
    }

    // Verify signature
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET_KEY)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json(
        { success: false, error: "Invalid signature" },
        { status: 400 },
      );
    }

    await dbConnect();

    // Get COD charge from env with validation
    const codChargeRaw = process.env.COD_CHARGE;
    const codCharge = Number(codChargeRaw);

    // Validate COD charge
    if (isNaN(codCharge) || codCharge < 0) {
      console.error(`Invalid COD_CHARGE in env: ${codChargeRaw}`);
      return NextResponse.json(
        {
          success: false,
          error: "Server configuration error: Invalid COD charge",
        },
        { status: 500 },
      );
    }

    // Validate advance amount
    if (!advanceAmount || advanceAmount <= 0) {
      return NextResponse.json(
        { success: false, error: "Advance amount required" },
        { status: 400 },
      );
    }

    const expectedAdvance = codCharge + Math.round(totalPrice * 0.5);
    const tolerance = 10;
    if (Math.abs(advanceAmount - expectedAdvance) > tolerance) {
      return NextResponse.json(
        { success: false, error: `Advance must be ≈ ₹${expectedAdvance}` },
        { status: 400 },
      );
    }

    // ─────────────────────────────────────────────────────────────
    // Correct calculation (COD charge is EXTRA, fully paid in advance)
    // ─────────────────────────────────────────────────────────────
    const baseTotal = totalPrice; // product value only
    const overallTotal = baseTotal + codCharge; // totalAmount = base + extra COD charge

    const remainingProductValue = baseTotal - (advanceAmount - codCharge); 
    const codAmountToCollect = remainingProductValue;

    if (remainingProductValue < 0 || codAmountToCollect < 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid calculation — remaining cannot be negative",
        },
        { status: 400 },
      );
    }

    const order = await Order.create({
      shippingInfo,
      user: user._id,
      orderItems: cartItems,

      paymentMethod: "Partial-COD",
      advancePaid: advanceAmount,
      advancePaidAt: new Date(),

      paymentInfo: {
        id: razorpay_payment_id,
        status: "Advance Paid",
      },

      itemsPrice,
      shippingAmount: shippingPrice,
      taxAmount: taxPrice,
      totalAmount: overallTotal, // base + COD charge

      // Explicitly set calculated fields
      remainingAmount: remainingProductValue,
      codAmount: codAmountToCollect,

      orderNotes,
      couponApplied,
      discountAmount: discountAmount || 0,
      couponDiscountType: couponDiscountType || "",
      couponDiscountValue: couponDiscountValue || 0,

      // Optional: also store the COD charge explicitly (useful for reports)
      codChargeCollected: codCharge,
    });

    // Cleanup session
    setImmediate(() => {
      SessionStartedOrder.deleteOne({
        razorpayOrderId: razorpay_order_id,
      }).catch((err) => console.error("Session cleanup failed:", err));
    });

    // Trigger shipment
    setImmediate(() => {
      triggerAdminShipment(order._id.toString()).catch((err) =>
        console.error("Shiprocket trigger failed:", err),
      );
    });

    return NextResponse.json({
      success: true,
      message: "Advance paid & order created (COD remaining)",
      order: { localOrder: order },
    });
  } catch (error) {
    console.error("Advance webhook error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Server error while processing advance payment",
      },
      { status: 500 },
    );
  }
}
