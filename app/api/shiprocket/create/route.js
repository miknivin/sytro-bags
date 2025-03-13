// @/pages/api/createOrder.js
import { NextResponse } from "next/server";
import axios from "axios";
import { getShiprocketToken } from "@/lib/shipRocket/shipRocketToken.js";

export async function POST(req) {
  try {
    const orderData = await req.json();
    const token = await getShiprocketToken();

    const response = await axios.post(
      "https://apiv2.shiprocket.in/v1/external/orders/create/adhoc",
      orderData,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return NextResponse.json(
      { success: true, data: response.data },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error creating order:", error);
    const errorMessage =
      error.response?.data?.message || error.message || "Failed to create order";
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: error.response?.status || 500 }
    );
  }
}

     