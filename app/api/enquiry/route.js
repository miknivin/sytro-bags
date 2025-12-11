import { NextResponse } from "next/server";
import dbConnect from "@/lib/db/connection";
import Enquiry from "@/models/Enquiry";

export async function POST(request) {
    try {
        await dbConnect();

        const { name, email, phone, message } = await request.json();

        // Validate required fields
        if (!message) {
            return NextResponse.json(
                { success: false, message: "Message is required" },
                { status: 400 }
            );
        }

        if (!email && !phone) {
            return NextResponse.json(
                { success: false, message: "Email or phone is required" },
                { status: 400 }
            );
        }

        try {
            const enquiry = await Enquiry.create({
                name,
                email,
                phone,
                message,
            });

            return NextResponse.json({
                success: true,
                data: enquiry,
                message: "Enquiry submitted successfully",
            });
        } catch (error) {
            if (error.isUpdate) {
                // If it's an update (existing enquiry found), return success
                const updatedEnquiry = await Enquiry.findOne({
                    $or: [
                        ...(email ? [{ email }] : []),
                        ...(phone ? [{ phone }] : [])
                    ],
                });
                return NextResponse.json({
                    success: true,
                    data: updatedEnquiry,
                    message: "Enquiry updated successfully",
                });
            }
            throw error;
        }
    } catch (error) {
        console.error("Enquiry API error:", error);
        return NextResponse.json(
            { 
                success: false, 
                message: error.message || "Failed to submit enquiry" 
            },
            { status: 500 }
        );
    }
}