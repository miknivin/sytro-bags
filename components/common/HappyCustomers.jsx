"use client";
import React from "react";
import Image from "next/image";

const testimonialImages = [
    "anah6bjb9j35bky099vf.webp",
    "d8g9as5bwqjfv4eduk1m.webp",
    "e0e2slnupzw737btqxvc.webp",
    "e2hxaxmh1xsexqfrrss6.webp",
    "fhs1ogwvep3ddbwsachq.webp",
    "mbtc1pddwdp1kiavl6ys.webp",
    "n7yx10lexhgqxlpeve0m.webp",
    "sy8l53mfgiuuzahiccfa.webp",
    "yhthqtmuag9kqgvtvejj.webp",
];

export default function HappyCustomers() {
    return (
        <section className="happy-customers-section py-4">
            <div className="container">
                <div style={{
                    backgroundColor: '#f2f2f2',
                    borderRadius: '16px',
                    padding: '32px 24px',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
                    overflow: 'hidden'
                }}>
                    {/* Title */}
                    <div className="text-center mb-4" style={{ overflow: 'hidden' }}>
                        <h2 style={{
                            fontSize: 'clamp(20px, 5vw, 32px)',
                            fontWeight: '600',
                            color: '#F16244',

                            whiteSpace: 'nowrap'
                        }}>
                            10000+ <span style={{ color: '#6b7280' }}>HAPPY CUSTOMERS</span>
                        </h2>
                    </div>

                    {/* Images Row - Scrollable */}
                    <div
                        className="happy-customers-row d-flex gap-3 pb-3"
                        style={{
                            overflowX: 'auto',
                            overflowY: 'hidden',
                            scrollbarWidth: 'thin',
                            WebkitOverflowScrolling: 'touch',
                            msOverflowStyle: '-ms-autohiding-scrollbar'
                        }}
                    >
                        {testimonialImages.map((image, index) => (
                            <div
                                key={index}
                                className="happy-customer-card flex-shrink-0"
                                style={{
                                    width: '90px',
                                    height: '90px',
                                    borderRadius: '8px',
                                    overflow: 'hidden',
                                    border: '2px solid #e5e7eb',
                                    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                                    cursor: 'pointer'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-4px)';
                                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = 'none';
                                }}
                            >
                                <Image
                                    src={`/images/reviews/${image}`}
                                    alt={`Happy customer ${index + 1}`}
                                    width={300}
                                    height={300}
                                    quality={100}
                                    unoptimized={false}
                                    style={{
                                        objectFit: 'cover',
                                        width: '100%',
                                        height: '100%',
                                    }}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <style jsx>{`
                .happy-customers-row::-webkit-scrollbar {
                    height: 6px;
                }
                .happy-customers-row::-webkit-scrollbar-track {
                    background: #f1f1f1;
                    border-radius: 10px;
                }
                .happy-customers-row::-webkit-scrollbar-thumb {
                    background: #d1d5db;
                    border-radius: 10px;
                }
                .happy-customers-row::-webkit-scrollbar-thumb:hover {
                    background: #9ca3af;
                }
            `}</style>
        </section>
    );
}
