import { NextResponse } from "next/server";
import User from "@/models/User";
import dbConnect from "@/lib/db/connection";
import sendToken from "@/utlis/sendToken";

import SessionStartedOrder from "@/models/SessionStartedOrder";

export async function POST(request) {
  try {
    await dbConnect();
    const { name, email, password } = await request.json();

    const user = await User.create({
      name,
      email,
      password,
    });
    const fetchSessionStartedOrdersPromise = SessionStartedOrder.find()
      .then((sessionOrders) => {
        console.log(`Found ${sessionOrders.length} session started orders`);
      })
      .catch((err) => {
        console.error(`Error fetching session started orders:`, err);
      });
    return sendToken(user, 201);
  } catch (error) {
    return NextResponse.json(
      { error: error?.message || "Internal Server Erroe" },
      { status: 500 }
    );
  }
}
