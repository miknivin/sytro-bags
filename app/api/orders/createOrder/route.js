import dbConnect from "@/lib/db/connection";
import { isAuthenticatedUser } from "@/middlewares/auth";
import Order from "@/models/Order";
import Product from "@/models/Products";
import User from "@/models/User";
import { NextResponse } from "next/server";
import { triggerAdminShipment } from "@/utlis/triggerAdminShipment";

export async function POST(req) {
  try {
    // Dummy imports to prevent tree-shaking issues (common in Next.js)
    Product;
    User;

    await dbConnect();

    const user = await isAuthenticatedUser(req);
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    const body = await req.json();

    const {
      orderItems,
      shippingInfo,
      itemsPrice,
      taxAmount = 0,
      shippingAmount = 0,
      totalAmount: baseTotalAmount, // this is the base total sent from frontend
      paymentMethod,
      paymentInfo,
      couponCode,
      discountAmount = 0,
      couponDiscountType = "",
      couponDiscountValue = 0,
      codChargeCollected, // optional field from frontend
    } = body;

    // Determine COD charge
    let finalCodCharge = 100; // ultimate fallback

    // Priority 1: Value sent from frontend (if valid)
    if (
      codChargeCollected !== undefined &&
      !isNaN(Number(codChargeCollected)) &&
      Number(codChargeCollected) >= 0
    ) {
      finalCodCharge = Number(codChargeCollected);
    }
    // Priority 2: Environment variable
    else if (process.env.COD_CHARGE && !isNaN(Number(process.env.COD_CHARGE))) {
      finalCodCharge = Number(process.env.COD_CHARGE);
    }

    // Calculate final totalAmount
    let finalTotalAmount = Number(baseTotalAmount || 0);

    // Add COD charge ONLY when it's normal COD payment
    if (paymentMethod === "COD") {
      finalTotalAmount += finalCodCharge;
    }

    // Debug log (you can remove later)
    console.log("COD Order creation:", {
      baseTotal: baseTotalAmount,
      codCharge: finalCodCharge,
      finalTotal: finalTotalAmount,
      paymentMethod,
    });

    const order = await Order.create({
      orderItems,
      shippingInfo,
      itemsPrice: Number(itemsPrice || 0),
      taxAmount: Number(taxAmount),
      shippingAmount: Number(shippingAmount),
      totalAmount: finalTotalAmount, // ← now includes COD charge for normal COD
      paymentMethod,
      paymentInfo,
      remainingAmount: finalTotalAmount,
      couponApplied: couponCode || "No",
      discountAmount: Number(discountAmount),
      couponDiscountType: couponDiscountType || "",
      couponDiscountValue: Number(couponDiscountValue || 0),
      user: user?._id,

      codChargeCollected: finalCodCharge,
    });

    // Trigger shipment in background
    setImmediate(() => {
      triggerAdminShipment(order._id.toString()).catch((err) =>
        console.error("triggerAdminShipment failed (ignored):", err),
      );
    });

    return NextResponse.json({ success: true, order }, { status: 200 });
  } catch (error) {
    console.error("COD Order creation error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Internal Server Error" },
      { status: 500 },
    );
  }
}
