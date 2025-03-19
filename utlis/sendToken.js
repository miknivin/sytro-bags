import { NextResponse } from "next/server";

const sendToken = (user, statusCode) => {
  const token = user?.getJwtToken();

  // Set cookie options
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Lax",
    maxAge: (process.env.COOKIE_EXPIRES_TIME || 7) * 24 * 60 * 60,
    path: "/",
  };
  //console.log(cookieOptions, "cookieOptions");

  // Create the response
  const response = NextResponse.json(
    {
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    },
    { status: statusCode }
  );

  // Set the cookie in the response headers
  response.cookies.set("token", token, cookieOptions);

  return response;
};

export default sendToken;
