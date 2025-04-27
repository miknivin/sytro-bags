import { NextResponse } from "next/server";
import Order from "@/models/Order";
import { authorizeRoles, isAuthenticatedUser } from "@/middlewares/auth";
import dbConnect from "@/lib/db/connection";
import User from "@/models/User";
export async function GET(req, { params }) {
  try {
    await dbConnect();

    const user = await isAuthenticatedUser(req);
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Need to login" },
        { status: 400 }
      );
    }

    const { id } = await params;

    const order = await Order.findById(id).populate("user", "name email phone");

    if (order && String(order.user._id) !== String(user._id)) {
      authorizeRoles(user, "admin");
    }

    if (!order) {
      return NextResponse.json(
        { success: false, message: "No order found with this ID" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, order }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
