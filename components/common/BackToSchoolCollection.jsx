"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";

export default function BackToSchoolCollection() {
    return (
        <section className="back-to-school-section py-3">
            <div className="container">
                {/* Main Heading */}
                <div className="text-center mb-4">
                    <h2 style={{
                        fontSize: '25px',
                        fontWeight: '400',
                        color: '#122432',
                        marginBottom: '16px',
                        textTransform: 'none',
                        letterSpacing: '0px',
                        fontFamily: 'Pencil Child, pencilchild, cursive'
                    }}>
                        Back To School Collection
                    </h2>
                </div>

                {/* Two Images Grid */}
                <div className="row g-4">
                    {/* First Image */}
                    <div className="col-md-6">
                        <div className="collection-card" style={{
                            position: 'relative',
                            overflow: 'hidden',
                            borderRadius: '12px',
                            height: '300px',
                            backgroundColor: '#f5f5f5'
                        }}>
                            <Image
                                src="/images/shop/kids bag.webp"
                                alt="Back to School Collection 1"
                                width={1600}
                                height={800}
                                style={{
                                    objectFit: 'cover',
                                    width: '100%',
                                    height: '100%'
                                }}
                            />
                            <div style={{
                                position: 'absolute',
                                bottom: '30px',
                                left: '50%',
                                transform: 'translateX(-50%)',
                                zIndex: 10
                            }}>
                                <Link
                                    href="/shop-collection-sub/Kids%20Bags"
                                    className="tf-btn btn-line collection-other-link fw-6 bg-white p-3 rounded-lg"
                                >
                                    <span>View More</span>
                                    <i className="icon icon-arrow1-top-left" />
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Second Image */}
                    <div className="col-md-6">
                        <div className="collection-card" style={{
                            position: 'relative',
                            overflow: 'hidden',
                            borderRadius: '12px',
                            height: '300px',
                            backgroundColor: '#f5f5f5'
                        }}>
                            <Image
                                src="/images/shop/schoolbag.webp"
                                alt="Back to School Collection 2"
                                width={1600}
                                height={800}
                                style={{
                                    objectFit: 'cover',
                                    width: '100%',
                                    height: '100%'
                                }}
                            />
                            <div style={{
                                position: 'absolute',
                                bottom: '30px',
                                left: '50%',
                                transform: 'translateX(-50%)',
                                zIndex: 10
                            }}>
                                <Link
                                    href="/shop-collection-sub/laptop_backpack"
                                    className="tf-btn btn-line collection-other-link fw-6 bg-white p-3 rounded-lg"
                                >
                                    <span>View More</span>
                                    <i className="icon icon-arrow1-top-left" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
                @media (max-width: 768px) {
                    .collection-card {
                        height: 180px !important;
                    }
                    .collection-card .tf-btn {
                        padding: 10px 24px !important;
                        font-size: 14px !important;
                        bottom: 20px !important;
                    }
                }
            `}</style>
        </section>
    );
}
