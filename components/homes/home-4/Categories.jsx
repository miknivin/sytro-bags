"use client";
import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export const categoriesWithDetails = [
  {
    name: "Gym Duffle Bag",
    image:
      "https://ik.imagekit.io/c1jhxlxiy/gym%20duffle%20bags.webp?updatedAt=1752562395881",
    url: "/shop-collection-sub/gym_duffle_bag",
  },
  {
    name: "Mens Sling Bag",
    image:
      "https://ik.imagekit.io/c1jhxlxiy/mens%20sling%20bag.webp?updatedAt=1752562348385",
    url: "/shop-collection-sub/mens_sling_bag",
  },
  {
    name: "Womens Tote Bag",
    image:
      "https://ik.imagekit.io/c1jhxlxiy/800X800-04.webp?updatedAt=1752652610373",
    url: "/shop-collection-sub/tote_bag",
  },

  {
    name: "Laptop Backpack",
    image:
      "https://ik.imagekit.io/c1jhxlxiy/laptop%20bags.webp?updatedAt=1752562560331",
    url: "/shop-collection-sub/laptop_backpack",
  },
  {
    name: "Womens Backpack",
    image:
      "https://ik.imagekit.io/c1jhxlxiy/women%20backpacks.webp?updatedAt=1752562477210",
    url: "/shop-collection-sub/ladies_backpack",
  },
  {
    name: "Travel Duffle Bag",
    image:
      "https://ik.imagekit.io/c1jhxlxiy/travel_duffle.webp?updatedAt=1753718908340",
    url: "/shop-collection-sub/travel_duffle_bag",
  },
  {
    name: "Super Shell Collection",
    image:
      "https://ik.imagekit.io/c1jhxlxiy/kidsbag.webp?updatedAt=1753772415449",
    url: "/shop-collection-sub/Kids%20Bags",
  },
  // {
  //   name: "Tote Bag",
  //   image:
  //     "https://ik.imagekit.io/c1jhxlxiy/tote_bag.jpg?updatedAt=1752256353548",
  //   url: "/shop-collection-sub/tote_bag",
  // },
];

export default function Categories() {
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
            modules={[Navigation, Pagination]}
            navigation={{
              prevEl: ".snbp3",
              nextEl: ".snbn3",
            }}
            pagination={{ clickable: true, el: ".spb3" }}
          >
            {categoriesWithDetails.map((category, index) => (
              <SwiperSlide key={index}>
                <div className="collection-item-v2 hover-img">
                  <Link href={category.url} className="collection-inner">
                    <div className="collection-image img-style">
                      <Image
                        className="lazyload"
                        data-src={category.image}
                        alt={category.name}
                        src={category.image}
                        width={600}
                        height={666}
                      />
                    </div>
                    <div className="collection-content">
                      <div className="top wow fadeInUp" data-wow-delay="0s">
                        {/* <h3>{category.name}</h3> */}
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
