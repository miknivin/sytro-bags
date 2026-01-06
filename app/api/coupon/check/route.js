import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db/connection';
import Coupon from '@/models/Coupon';

export async function POST(req) {
    try {
        await dbConnect();
        const { code, subtotal } = await req.json();

        if (!code) {
            return NextResponse.json(
                { success: false, message: 'Please provide a coupon code' },
                { status: 400 }
            );
        }

        const coupon = await Coupon.findOne({
            code: code.toUpperCase(),
            isActive: true,
            startDate: { $lte: new Date() },
            endDate: { $gte: new Date() },
        });

        if (!coupon) {
            return NextResponse.json(
                { success: false, message: 'Invalid or expired coupon code' },
                { status: 404 }
            );
        }

        if (subtotal < coupon.minimumPurchase) {
            return NextResponse.json(
                {
                    success: false,
                    message: `Minimum purchase of ₹${coupon.minimumPurchase} is required for this coupon`,
                },
                { status: 400 }
            );
        }

        if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
            return NextResponse.json(
                { success: false, message: 'Coupon usage limit reached' },
                { status: 400 }
            );
        }

        return NextResponse.json({
            success: true,
            coupon: {
                code: coupon.code,
                discountType: coupon.discountType,
                discountValue: coupon.discountValue,
                description: coupon.description,
                maximumDiscount: coupon.maximumDiscount,
            },
        });
    } catch (error) {
        console.error('Coupon validation error:', error);
        return NextResponse.json(
            { success: false, message: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
