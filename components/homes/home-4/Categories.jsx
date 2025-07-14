"use client";
import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules"; // Import Swiper modules
import "swiper/css"; // Import Swiper core styles
import "swiper/css/navigation"; // Import Swiper navigation styles
import "swiper/css/pagination"; // Import Swiper pagination styles
import { categories } from "./Products";

export default function Categories() {
  const imageUrl =
    "https://ik.imagekit.io/c1jhxlxiy/963852_78078-OFCN4G-491.jpg?updatedAt=1752256353548";

  return (
    <section className="flat-spacing-13 position-relative">
      <div className="container-full">
        <div className="wrap-carousel">
          <Swiper
            dir="ltr"
            slidesPerView={3}
            spaceBetween={30}
            breakpoints={{
              768: { slidesPerView: 3 },
              640: { slidesPerView: 3 },
              0: { slidesPerView: 1.3 },
            }}
            modules={[Navigation, Pagination]} // Register Swiper modules
            navigation={{
              prevEl: ".snbp3",
              nextEl: ".snbn3",
            }}
            pagination={{ clickable: true, el: ".spb3" }}
          >
            {categories.map((category, index) => (
              <SwiperSlide key={index}>
                <div className="collection-item-v2 hover-img">
                  <Link
                    href={`/shop-collection-sub/${category}`}
                    className="collection-inner"
                  >
                    <div className="collection-image img-style">
                      <Image
                        className="lazyload"
                        data-src={imageUrl}
                        alt={category}
                        src={imageUrl}
                        width={600}
                        height={666}
                      />
                    </div>
                    <div className="collection-content">
                      <div className="top wow fadeInUp" data-wow-delay="0s">
                        {/* <p className="subheading">
                          Start from <span className="fw-6">{slide.price}</span>
                        </p> */}
                      </div>
                      <div className="bottom wow fadeInUp" data-wow-delay="0s">
                        <button className="tf-btn btn-line collection-other-link fw-6 bg-white p-3 rounded-lg">
                          <span>Shop now</span>
                          <i className="icon icon-arrow1-top-left" />
                        </button>
                      </div>
                    </div>
                  </Link>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
          <div className="nav-sw nav-next-slider nav-next-testimonial lg snbp3">
            <span className="icon icon-arrow-left" />
          </div>
          <div className="nav-sw nav-prev-slider nav-prev-testimonial lg snbn3">
            <span className="icon icon-arrow-right" />
          </div>
          <div className="sw-dots style-2 sw-pagination-testimonial justify-content-center spb3" />
        </div>
      </div>
    </section>
  );
}
