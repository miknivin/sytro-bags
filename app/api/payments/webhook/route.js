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
      couponApplied
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
      couponApplied
    });
    const totalWeight = cartItems.reduce(
      (total, item) => total + item.quantity * 0.6,
      0
    );
    //console.log(totalWeight, "totalWeight");
    const currentDate = new Date().toISOString().replace("T", " ").slice(0, 16);
    const shiprocketPayload = {
      order_id: order._id.toString().slice(-6),
      order_date: currentDate,
      pickup_location: "HIFI BAG",
      channel_id: "6458223",
      comment: orderNotes || "Order via Razorpay",
      billing_customer_name: shippingInfo.fullName || "Customer",
      billing_last_name: shippingInfo.lastName || "lastname",
      billing_address: shippingInfo.address || "",
      billing_address_2: "",
      billing_city: shippingInfo.city || "",
      billing_pincode: shippingInfo.zipCode || "",
      billing_state: "Kerala",
      billing_country: "India",
      billing_email: user.email || "",
      billing_phone: shippingInfo.phoneNo || "",
      shipping_is_billing: true,
      shipping_customer_name: "",
      shipping_last_name: "",
      shipping_address: "",
      shipping_address_2: "",
      shipping_city: "",
      shipping_pincode: "",
      shipping_country: "",
      shipping_state: "",
      shipping_email: "",
      shipping_phone: "",
      order_items: cartItems.map((item) => ({
        name: item.name,
        sku: item.sku || `sku_${item.name}_${Date.now()}`,
        units: item.quantity,
        selling_price: item.price.toString(),
        discount: "0",
        tax: "18",
        hsn: "",
      })),
      payment_method: "Prepaid",
      shipping_charges: shippingPrice || 0,
      giftwrap_charges: 0,
      transaction_charges: 0,
      total_discount: 0,
      sub_total: totalPrice,
      length: 34,
      breadth: 6.5,
      height: 44,
      weight: totalWeight || 0.7,
    };

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
