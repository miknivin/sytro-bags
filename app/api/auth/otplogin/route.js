import { NextResponse } from "next/server";
import User from "@/models/User";
import dbConnect from "@/lib/db/connection";
import sendToken from "@/utlis/sendToken";

export async function POST(request) {
  try {
    await dbConnect();

    const { name, phone, otp } = await request.json();

    if (!phone || !otp) {
      return NextResponse.json(
        { error: "Phone number and OTP are required" },
        { status: 400 }
      );
    }

    let user = await User.findOne({ phone });

    if (user) {
      return sendToken(user, 200);
    }


    user = await User.create({
      name,
      phone,
      signupMethod: "OTP",
    });

    return sendToken(user, 201);
  } catch (error) {
    return NextResponse.json(
      { error: error?.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
