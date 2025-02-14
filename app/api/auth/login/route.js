import { NextResponse } from "next/server";


import User from "@/models/User";
import dbConnect from "@/lib/db/connection";
import sendToken from "@/utlis/sendToken";

export async function POST(request) {
  try {
    await dbConnect();
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

    return sendToken(user, 200);
  } catch (error) {
    return NextResponse.json(
      { error: error?.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
