import { NextResponse } from "next/server";
import User from "@/models/User";
import { isAuthenticatedUser } from "@/middlewares/auth";

export const PUT = async (req) => {
  const user = await isAuthenticatedUser(req);
  if (!user) {
    return NextResponse.json(
      { success: false, message: "Need to login" },
      { status: 400 }
    );
  }

  const { name, email, phone } = await req.json();

  const updatedUser = await User.findByIdAndUpdate(
    user._id,
    { name, email, phone },
    { new: true }
  );

  return NextResponse.json({ user: updatedUser }, { status: 200 });
};
