"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";

export default function BackToSchoolCollection() {
    return (
        <section className="back-to-school-section py-3">
            <div className="container">
                {/* Main Heading */}
                <div className="flat-title mb_1 gap-14 text-center" style={{ marginBottom: '10px' }}>
                    <h2 className="title wow fadeInUp" data-wow-delay="0s" style={{ marginTop: '50px', marginBottom: '18px' }}>
                        Back To School Collection
                    </h2>
                </div>

                {/* Two Images Grid */}
                <div className="row g-4">
                    {/* First Image */}
                    <div className="col-md-6">
                        <Link href="/shop-collection-sub/Kids%20Bags" className="collection-card-wrapper">
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
                                <div className="collection-content" style={{
                                    position: 'absolute',
                                    bottom: '30px',
                                    left: '50%',
                                    transform: 'translateX(-50%)',
                                    zIndex: 10
                                }}>
                                    <div className="tf-btn btn-line collection-other-link fw-6 bg-white p-3 rounded-lg">
                                        <span>View More</span>
                                        <i className="icon icon-arrow1-top-left" />
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </div>

                    {/* Second Image */}
                    <div className="col-md-6">
                        <Link href="/shop-collection-sub/laptop_backpack" className="collection-card-wrapper">
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
                                <div className="collection-content" style={{
                                    position: 'absolute',
                                    bottom: '30px',
                                    left: '50%',
                                    transform: 'translateX(-50%)',
                                    zIndex: 10
                                }}>
                                    <div className="tf-btn btn-line collection-other-link fw-6 bg-white p-3 rounded-lg">
                                        <span>View More</span>
                                        <i className="icon icon-arrow1-top-left" />
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .collection-card-wrapper {
                    display: block;
                    width: 100%;
                }

                @media (max-width: 768px) {
                    .back-to-school-section h2 {
                        margin-top: 20px !important;
                        margin-bottom: 10px !important;
                        font-size: 22px !important;
                    }
                    .collection-card {
                        height: auto !important;
                        aspect-ratio: 2 / 1;
                    }
                    .collection-content {
                        display: none !important;
                    }
                }
            `}</style>
        </section>
    );
}
