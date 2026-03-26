"use client";
import { memo } from "react";

import { Swiper, SwiperSlide } from "swiper/react";
import { ProductCard } from "../shopCards/ProductCard";
import { Navigation, Pagination } from "swiper/modules";
import { useGetProductsQuery } from "@/redux/api/productsApi";

function RelatedProducts({ product }) {
  const { data, error, isLoading } = useGetProductsQuery({
    category: product?.category,
  });

  // Filter out the product with the same _id and limit to 8 products
  const filteredProducts = data?.filteredProducts
    ?.filter((p) => p._id !== product._id)
    .slice(0, 8);

  // Return null if no products are found
  if (!filteredProducts || filteredProducts.length === 0) {
    console.log("null returmd");

    return null;
  }

  return (
    <section className="flat-spacing-1 pt_0">
      <div className="container">
        <div className="flat-title">
          <span className="title">Related Products</span>
        </div>
        <div className="hover-sw-nav hover-sw-2">
          <Swiper
            dir="ltr"
            className="swiper tf-sw-product-sell wrap-sw-over"
            slidesPerView={4}
            spaceBetween={30}
            breakpoints={{
              1024: {
                slidesPerView: 4,
              },
              640: {
                slidesPerView: 3,
              },
              0: {
                slidesPerView: 2,
                spaceBetween: 15,
              },
            }}
            modules={[Navigation, Pagination]}
            navigation={{
              prevEl: ".snbp3070",
              nextEl: ".snbn3070",
            }}
            pagination={{ clickable: true, el: ".spd307" }}
          >
            {filteredProducts.map((productItem, i) => (
              <SwiperSlide key={i} className="swiper-slide">
                <ProductCard product={productItem} />
              </SwiperSlide>
            ))}
          </Swiper>
          <div className="nav-sw nav-next-slider nav-next-product box-icon w_46 round snbp3070">
            <span className="icon icon-arrow-left" />
          </div>
          <div className="nav-sw nav-prev-slider nav-prev-product box-icon w_46 round snbn3070">
            <span className="icon icon-arrow-right" />
          </div>
          <div className="sw-dots style-2 sw-pagination-product justify-content-center spd307" />
        </div>
      </div>
    </section>
  );
}

export default memo(RelatedProducts);
