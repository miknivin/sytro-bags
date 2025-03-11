import dbConnect from '@/lib/db/connection';
import { isAuthenticatedUser } from '@/middlewares/auth';
import Order from '@/models/Order';
import { NextResponse } from 'next/server';
import User from "@/models/User"; 
export async function POST(req) {
    try {
        await dbConnect();
        const user = await isAuthenticatedUser(req);
        
        if (!user) return; 

        const body = await req.json();
        
        const {
            orderItems,
            shippingInfo,
            itemsPrice,
            taxAmount,
            shippingAmount,
            totalAmount,
            paymentMethod,
            paymentInfo,
        } = body;

        const order = await Order.create({
            orderItems,
            shippingInfo,
            itemsPrice,
            taxAmount,
            shippingAmount,
            totalAmount,
            paymentMethod,
            paymentInfo,
            user: user?._id, 
        });

        return NextResponse.json(
            { success: true, order },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            { success: false, message: error.message || 'Internal Server Error' },
            { status: 500 }
        );
    }
}
