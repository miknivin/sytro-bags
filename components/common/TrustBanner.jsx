"use client";
import { memo } from "react";
import Image from "next/image";

const TrustBanner = () => {
    const trustItems = [
        {
            src: "/images/designs/ISO CERTIFD (1).webp",
            alt: "Flipkart Seller",
            label: "PROUD SELLER",
        },
        {
            src: "/images/designs/ISO CERTIFD (2).webp",
            alt: "Amazon Seller",
            label: "PROUD SELLER",
        },
        {
            src: "/images/designs/india post.webp",
            alt: "India Post Shipping",
            label: "SHIPPING FULFILLMENT BY",
        },
        {
            src: "/images/designs/ISO CERTIFD.webp",
            alt: "ISO Certified",
            label: "CERTIFIED BY",
        },
        {
            src: "/images/designs/razorpay.webp",
            alt: "Razorpay Secure Payments",
            label: "PAYMENT SECURED BY",
        }
    ];

    return (
        <div className="w-full py-2 bg-gray-50 overflow-hidden border-t border-b border-gray-200">
            <div className="relative">
                <div className="flex animate-marquee">
                    {/* First set of logos */}
                    {trustItems.map((item, index) => (
                        <div key={index} className="flex items-center justify-center mx-20 min-w-[160px] flex-shrink-0">
                            <div className="h-16 flex items-center justify-center">
                                <Image
                                    src={item.src}
                                    alt={item.alt}
                                    width={140}
                                    height={64}
                                    className="object-contain filter grayscale opacity-60"
                                    priority={index < 3}
                                />
                            </div>
                        </div>
                    ))}
                    {/* Duplicate set for seamless scrolling */}
                    {trustItems.map((item, index) => (
                        <div key={`dup-${index}`} className="flex items-center justify-center mx-20 min-w-[160px] flex-shrink-0">
                            <div className="h-16 flex items-center justify-center">
                                <Image
                                    src={item.src}
                                    alt={item.alt}
                                    width={140}
                                    height={64}
                                    className="object-contain filter grayscale opacity-60"
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <style jsx>{`
        .animate-marquee {
          display: flex;
          animation: marquee 10s linear infinite;
          width: max-content;
        }
        
        @keyframes marquee {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        @media (max-width: 768px) {
          .animate-marquee {
            animation-duration: 12s;
          }
        }

        @media (max-width: 576px) {
          .animate-marquee {
            animation-duration: 10s;
          }
        }
      `}</style>
        </div>
    );
};

export default memo(TrustBanner);
