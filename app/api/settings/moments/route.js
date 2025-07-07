import { NextResponse } from "next/server";
import WebsiteSettings from "@/models/WebsiteSettings"; // Adjust path to your model
import dbConnect from "@/lib/db/connection";

export async function GET() {
  try {
    // Ensure database connection
    await dbConnect();

    const settings = await WebsiteSettings.find({}).select("moments").lean();

    return NextResponse.json(
      {
        success: true,
        data: settings.map((setting) => setting.moments),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching moments:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 }
    );
  }
}
