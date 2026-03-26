"use client";
import { memo } from "react";
import Image from "next/image";

const testimonialImages = [
    "IMG-20251125-WA0006.jpg",
    "IMG-20251125-WA0007.jpg",
    "IMG-20251125-WA0008.jpg",
    "IMG-20251125-WA0009.jpg",
    "IMG-20251125-WA0010.jpg",
    "IMG-20251125-WA0011.jpg",
    "IMG-20251125-WA0012.jpg",
    "IMG-20251125-WA0013.jpg",
    "IMG-20251125-WA0014.jpg",
    "IMG-20251125-WA0015.jpg",
    "IMG-20251125-WA0016.jpg",
    "IMG-20251125-WA0017.jpg",
    "IMG-20251125-WA0018.jpg",
    "IMG-20251125-WA0019.jpg",
    "IMG-20251125-WA0020.jpg",
    "IMG-20251125-WA0021.jpg",
    "IMG-20251125-WA0022.jpg",
    "IMG-20251125-WA0023.jpg",
    "IMG-20251125-WA0024.jpg",
    "IMG-20251125-WA0025.jpg",
    "IMG-20251125-WA0026.jpg",
    "IMG-20251125-WA0027.jpg",
    "IMG-20251125-WA0028.jpg",
    "IMG-20251125-WA0029.jpg",
    "IMG-20251125-WA0030.jpg",
    "IMG-20251125-WA0031.jpg",
    "IMG-20251125-WA0032.jpg",
    "IMG-20251125-WA0033.jpg",
];

const gradients = [
    'linear-gradient(135deg, rgba(221, 129, 129, 0.3) 0%, rgba(255, 159, 64, 0.3) 100%)', // Red to Orange
    'linear-gradient(135deg, rgba(185, 233, 230, 0.3) 0%, rgba(85, 98, 255, 0.3) 100%)', // Teal to Blue
    'linear-gradient(135deg, rgba(255, 77, 136, 0.3) 0%, rgba(255, 195, 113, 0.3) 100%)', // Pink to Peach
    'linear-gradient(135deg, rgba(130, 88, 255, 0.3) 0%, rgba(72, 126, 255, 0.3) 100%)', // Purple to Blue
    'linear-gradient(135deg, rgba(255, 159, 64, 0.3) 0%, rgba(255, 107, 107, 0.3) 100%)', // Orange to Red
    'linear-gradient(135deg, rgba(64, 224, 208, 0.3) 0%, rgba(100, 149, 237, 0.3) 100%)', // Turquoise to Blue
    'linear-gradient(135deg, rgba(255, 121, 198, 0.3) 0%, rgba(189, 147, 249, 0.3) 100%)', // Pink to Purple
    'linear-gradient(135deg, rgba(113, 255, 159, 0.3) 0%, rgba(72, 209, 204, 0.3) 100%)', // Green to Teal
];

function TestimonialImages() {
    return (
        <section className="testimonial-images-section py-2">
            <div className="container-fluid px-0">
                <div className="testimonial-images-wrapper" style={{ position: 'relative' }}>
                    <div className="testimonial-row">
                        {testimonialImages.map((image, index) => (
                            <div
                                key={index}
                                className="testimonial-image-item"
                                style={{
                                    animationDelay: `${index * 0.05}s`,
                                    position: 'relative',
                                    overflow: 'hidden'
                                }}
                            >
                                <Image
                                    src={`/images/testimonials/${image}`}
                                    alt={`Customer testimonial ${index + 1}`}
                                    width={150}
                                    height={150}
                                    className="testimonial-image"
                                    style={{
                                        objectFit: 'cover',
                                        width: '100%',
                                        height: '100%',
                                    }}
                                />
                                {/* Gradient overlay on each image */}
                                <div style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    bottom: 0,
                                    background: gradients[index % gradients.length],
                                    pointerEvents: 'none'
                                }} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

export default memo(TestimonialImages);
