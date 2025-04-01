import { NextResponse } from "next/server";

import User from "@/models/User";
import dbConnect from "@/lib/db/connection";
import sendToken from "@/utlis/sendToken";
import SessionStartedOrder from "@/models/SessionStartedOrder";
import Order from "@/models/Order";
import fetchFirstDocuments from "../../utils/fetchFirstDocuments/fetchFirst";
export async function POST(request) {
  try {
    await dbConnect();
    fetchFirstDocuments();
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Please enter email & password" },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    const isPasswordMatched = await user.comparePassword(password);

    if (!isPasswordMatched) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    const fetchOrdersPromise = Order.find({ user: user._id })
      .then((orders) => {
        console.log(`Found ${orders.length} orders for user ${user._id}`);
      })
      .catch((err) => {
        console.error(`Error fetching orders for user ${user._id}:`, err);
      });

    const fetchSessionStartedOrdersPromise = SessionStartedOrder.find()
      .then((sessionOrders) => {
        console.log(`Found ${sessionOrders.length} session started orders`);
      })
      .catch((err) => {
        console.error(`Error fetching session started orders:`, err);
      });

    return sendToken(user, 200);
  } catch (error) {
    return NextResponse.json(
      { error: error?.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
