import Razorpay from "razorpay";
import dbConnect from "@/lib/db/connection";
import User from "@/models/User";
import Order from "@/models/Order";
import SessionStartedOrder from "@/models/SessionStartedOrder";
import { isAuthenticatedUser } from "@/middlewares/auth";
import { createShiprocketOrder } from "@/lib/shipRocket/createShipRocketOrder";

export async function POST(req) {
  try {
    const body = await req.json();
    await dbConnect();
    console.log("DB connected");

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
      amount: itemsPrice * 100, // Convert to paise
      currency: "INR",
      receipt: `order_${Date.now()}`,
      payment_capture: 1,
    };

    const razorpayOrder = await razorpay.orders.create(options);

    // Save order to MongoDB
    const newOrder = new SessionStartedOrder({
      razorpayOrderId: razorpayOrder.id,
      razorpayPaymentStatus: razorpayOrder.status,
      user: user._id,
      orderItems,
      shippingInfo,
      itemsPrice,
      totalAmount: itemsPrice,
    });

    await newOrder.save();

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
      product_details: orderItems.map((item) => ({
        name: item.name,
        unit_price: item.price,
        quantity: item.quantity,
        discount: 0,
        tax_rate: 18,
      })),
      payment_method: "Prepaid", // Razorpay orders are prepaid
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
        order_id: newOrder._id.toString(),
        notes: "Handle with care",
      },
    };

    // Attempt Shiprocket integration but don't let it affect main response
    let shiprocketResult = null;
    try {
      const shiprocketResponse = await createShiprocketOrder(shiprocketPayload);
      if (shiprocketResponse.success) {
        newOrder.shiprocketOrderId = shiprocketResponse.data.order_id;
        await newOrder.save();
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

    return new Response(
      JSON.stringify({
        success: true,
        razorpayOrder,
        localOrder: newOrder,
        shiprocketOrder: shiprocketResult,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ error: "Failed to create order" }), {
      status: 500,
    });
  }
}
