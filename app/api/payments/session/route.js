import Razorpay from "razorpay";
import dbConnect from "@/lib/db/connection";
import User from "@/models/User";
import Order from "@/models/Order";
import SessionStartedOrder from "@/models/SessionStartedOrder";
import { isAuthenticatedUser } from "@/middlewares/auth";

export async function POST(req) {
  try {
    const body = await req.json();
    User;
    await dbConnect();

    const user = await isAuthenticatedUser(req);
    if (!user) {
      return new Response(
        JSON.stringify({ success: false, error: "Unauthorized user" }),
        { status: 401 }
      );
    }
    const { orderData } = body;
    const { itemsPrice, shippingInfo, orderItems } = orderData;

    if (!itemsPrice || !orderItems) {
      return new Response(JSON.stringify({ error: "Missing fields" }), {
        status: 400,
      });
    }

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_SECRET_KEY,
    });

    const options = {
      amount: itemsPrice * 100,
      currency: "INR",
      receipt: `order_${Date.now()}`,
      payment_capture: 1,
    };

    const order = await razorpay.orders.create(options);

    const newOrder = new SessionStartedOrder({
      razorpayOrderId: order.id,
      razorpayPaymentStatus: order.status,
      user: user._id,
      orderItems,
      shippingInfo,
      itemsPrice,
      totalAmount: itemsPrice,
    });

    await newOrder.save();
    console.log(newOrder);
    return new Response(JSON.stringify(order), { status: 200 });
  } catch (error) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ error: "Failed to create order" }), {
      status: 500,
    });
  }
}
