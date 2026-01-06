import { NextResponse } from "next/server";
import crypto from "crypto";
import Order from "@/models/Order";
import dbConnect from "@/lib/db/connection";
import { isAuthenticatedUser } from "@/middlewares/auth";
import User from "@/models/User";
import Product from "@/models/Products";
import SessionStartedOrder from "@/models/SessionStartedOrder";
import { triggerAdminShipment } from "@/utlis/triggerAdminShipment";
export async function POST(req) {
  try {
    SessionStartedOrder;
    Product;
    User;
    const user = await isAuthenticatedUser(req);
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
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
      shippingPrice,
      totalPrice,
      taxPrice,
      orderNotes,
      couponApplied,
      discountAmount,
      couponDiscountType,
      couponDiscountValue,
    } = body;
    console.log(cartItems, "cartItems");

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { success: false, error: "Missing payment details" },
        { status: 400 }
      );
    }

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET_KEY)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json(
        { success: false, error: "Invalid payment signature" },
        { status: 400 }
      );
    }
    console.log("verified payment");

    await dbConnect();
    console.log("db connected");

    const order = await Order.create({
      shippingInfo,
      user: user._id,
      orderItems: cartItems,
      paymentMethod: "Online",
      paymentInfo: {
        id: razorpay_payment_id,
        status: "Paid",
      },
      itemsPrice,
      shippingAmount: shippingPrice,
      taxAmount: taxPrice,
      orderNotes: orderNotes,
      totalAmount: totalPrice,
      couponApplied,
      discountAmount: discountAmount || 0,
      couponDiscountType: couponDiscountType || "",
      couponDiscountValue: couponDiscountValue || 0,
    });

    setImmediate(() => {
      SessionStartedOrder.deleteOne({ razorpayOrderId: razorpay_order_id })
        .then(() =>
          console.log("Cleaned SessionStartedOrder-", razorpay_order_id)
        )
        .catch((err) =>
          console.error("Failed to cleanup SessionStartedOrder::", err)
        );
    });

    // 2. Trigger admin shipment creation (non-blocking)
    setImmediate(() => {
      triggerAdminShipment(order._id.toString()).catch((err) =>
        console.error("triggerAdminShipment failed (ignored):", err)
      );
    });
    return NextResponse.json({
      success: true,
      message: "Order placed successfully",
      order: {
        localOrder: order,
      },
    });
  } catch (error) {
    console.error("Error handling webhook:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
