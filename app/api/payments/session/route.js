import Razorpay from "razorpay";
import dbConnect from "@/lib/db/connection";
import Order from "@/models/Order";
import User from "@/models/User";

export async function POST(req) {
  try {
    const body = await req.json();
    await dbConnect();
    console.log("db connected");

    const { itemsPrice } = body?.orderData;

    if (!itemsPrice) {
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

    return new Response(JSON.stringify(order), { status: 200 });
  } catch (error) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ error: "Failed to create order" }), {
      status: 500,
    });
  }
}
