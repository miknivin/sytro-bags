import dbConnect from "@/lib/db/connection";
import { isAuthenticatedUser } from "@/middlewares/auth";
import { NextResponse } from "next/server";
import SessionStartedOrder from "@/models/SessionStartedOrder";
import Order from "@/models/Order";
import ShipRocketToken from "@/models/ShipRocketToken";
import fetchFirstDocuments from "../../utils/fetchFirstDocuments/fetchFirst";
import User from "@/models/User";
export async function GET(req) {
  try {
    await dbConnect();
    //fetchFirstDocuments();
    const user = await isAuthenticatedUser(req);
    return NextResponse.json({ success: true, user }, { status: 200 });
  } catch (error) {
    const statusCode = 401;
    return NextResponse.json(
      { success: false, message: error.message },
      { status: statusCode }
    );
  }
}
