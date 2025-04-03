import { NextResponse } from "next/server";
import dbConnect from "@/lib/db/connection";
import Product from "@/models/Products";
import User from "@/models/User"; // Add this line
import fetchFirstDocuments from "../../utils/fetchFirstDocuments/fetchFirst";

export async function GET(req, { params }) {
  try {
    await dbConnect();
    fetchFirstDocuments();
    const { id: productId } = await params;

    if (!productId) {
      return NextResponse.json(
        { success: false, message: "Product ID is required" },
        { status: 400 }
      );
    }

    const productById = await Product.findById(productId)
      .populate({
        path: "reviews.user",
        select: "name email avatar",
      })
      .populate({
        path: "user",
        select: "name email avatar",
      });

    if (!productById) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, productById }, { status: 200 });
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
