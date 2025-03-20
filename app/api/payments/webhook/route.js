import { NextResponse } from "next/server";
import crypto from "crypto";
import Order from "@/models/Order";
import dbConnect from "@/lib/db/connection";
import { isAuthenticatedUser } from "@/middlewares/auth";
import User from "@/models/User";
import { createShiprocketOrder } from "@/lib/shipRocket/createShipRocketOrder";

export async function POST(req) {
  try {
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
    } = body;

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
      paymentMethod: "Online", // Hardcoded since this is Razorpay
      paymentInfo: {
        id: razorpay_payment_id,
        status: "Paid",
      },
      itemsPrice,
      shippingAmount: shippingPrice,
      taxAmount: taxPrice,
      orderNotes: orderNotes,
      totalAmount: totalPrice,
    });

    // Prepare Shiprocket payload
    const shiprocketPayload = {
      pickup_address: {
        address:
          "Hifi bags, Panakkal Tower, North Basin Road, Ernakulam, Broadway",
        city: "Kochi",
        pincode: "682031",
      },
      delivery_details: {
        name: shippingInfo.name || "Customer",
        mobile: shippingInfo.phoneNo,
        address: shippingInfo.address,
        city: shippingInfo.city,
        pincode: shippingInfo.pinCode,
      },
      product_details: cartItems.map((item) => ({
        name: item.name,
        unit_price: item.price,
        quantity: item.quantity,
        discount: 0,
        tax_rate: 18,
      })),
      payment_method: "Prepaid", // Razorpay payments are always Prepaid for Shiprocket
      package_details: {
        dead_weight: 1.5,
        dimensions: {
          length: 34,
          height: 44,
          width: 6.5,
        },
      },
      other_details: {
        order_channel: "Custom",
        order_tag: "Standard",
        order_id: order._id.toString(),
        notes: orderNotes || "Handle with care",
      },
    };

    // Attempt Shiprocket integration but don't let it affect main response
    let shiprocketResult = null;
    try {
      const shiprocketResponse = await createShiprocketOrder(shiprocketPayload);
      if (shiprocketResponse.success) {
        console.log("success", shiprocketResponse);

        order.shiprocketOrderId = shiprocketResponse.data.order_id;
        await order.save();
        shiprocketResult = shiprocketResponse.data;
      } else {
        console.warn(
          "Shiprocket integration failed:",
          shiprocketResponse.error
        );
      }
    } catch (shiprocketError) {
      console.warn("Shiprocket integration error:", shiprocketError.message);
    }

    return NextResponse.json({
      success: true,
      message: "Order placed successfully",
      order: {
        localOrder: order,
        shiprocketOrder: shiprocketResult,
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
