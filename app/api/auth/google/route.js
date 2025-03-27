import { NextResponse } from "next/server";
import dbConnect from "@/lib/db/connection";
import User from "@/models/User";
import sendToken from "@/utlis/sendToken";
import SessionStartedOrder from "@/models/SessionStartedOrder";
import Order from "@/models/Order";
export async function POST(request) {
  try {
    await dbConnect();

    const { idToken, email, displayName, uid, photoURL } = await request.json();
    //console.log("Received Data:", { idToken, email, displayName, uid, photoURL });

    if (!idToken || !email) {
      return NextResponse.json(
        { error: "idToken and email are required" },
        { status: 400 }
      );
    }

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        name: displayName,
        email,
        avatar: photoURL ? { url: photoURL } : undefined, // Match schema structure
        signupMethod: "OAuth", // Set signupMethod to OAuth
      });
    } else {
      // Update existing user if needed
      if (photoURL) {
        user.avatar = { url: photoURL };
      }
      if (user.signupMethod !== "OAuth") {
        user.signupMethod = "OAuth";
      }
      await user.save();
    }

    const fetchOrdersPromise = Order.find({ user: user._id })
      .then((orders) => {
        console.log(`Found ${orders.length} orders for user ${user._id}`);
      })
      .catch((err) => {
        console.error(`Error fetching orders for user ${user._id}:`, err);
      });
    //console.log(fetchOrdersPromise, "fetchOrdersPromise");
    const fetchSessionStartedOrdersPromise = SessionStartedOrder.find()
      .then((sessionOrders) => {
        console.log(`Found ${sessionOrders.length} session started orders`);
      })
      .catch((err) => {
        console.error(`Error fetching session started orders:`, err);
      });
    return sendToken(user, 200);
  } catch (error) {
    console.error("Google sign-in error:", error);
    return NextResponse.json(
      { error: error.message || "Google authentication failed" },
      { status: 500 }
    );
  }
}
