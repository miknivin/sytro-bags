import { isAuthenticatedUser } from "@/middlewares/auth";
import { NextResponse } from "next/server";


export async function GET(req) {
  try {
    const user = await isAuthenticatedUser(req);
    return NextResponse.json({ success: true, user }, { status: 200 });
  } catch (error) {
    const statusCode = 401;
    return NextResponse.json({ success: false, message: error.message }, { status: statusCode });
  }
}
