import { NextResponse } from "next/server";
import crypto from "crypto";
import Order from "@/models/Order";
import dbConnect from "@/lib/db/connection";

export async function POST(req) {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      shippingInfo,
      cartItems,
      user,
      itemsPrice,
      shippingPrice,
      totalPrice,
      taxPrice,
    } = await req.json();

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET_KEY)
      .update(body)
      .digest("hex");

    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
      await dbConnect();

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
        totalAmount: totalPrice,
      });

      console.log("Order Created Successfully:", order);
      return NextResponse.redirect(
        `${process.env.FRONTEND_URL}/order_placed?order_success=true`
      );
    } else {
      return NextResponse.json(
        { success: false, error: "Invalid payment data" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error handling webhook:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
