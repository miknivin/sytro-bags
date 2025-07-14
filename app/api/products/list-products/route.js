import { NextResponse } from "next/server";
import dbConnect from "@/lib/db/connection";
import products from "@/models/Products";

export async function GET(req) {
  try {
    await dbConnect();

    const filteredProducts = await products
      .find()
      .select("name images offer category");

    return NextResponse.json(
      {
        success: true,
        filteredProducts,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}
