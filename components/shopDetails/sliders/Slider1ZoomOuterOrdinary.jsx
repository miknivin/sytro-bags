"use client";
import { useRef, useState } from "react";
import Image from "next/image";
import { Navigation, Thumbs } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import "yet-another-react-lightbox/styles.css";
import { replaceS3WithCloudFront } from "@/components/shopCards/Productcart4";

export default function Slider1ZoomOuterOrdinary({ firstImage = [] }) {
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const swiperRef = useRef(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);

  // Fallback for empty firstImage
  if (!firstImage.length) {
    return <div>No images available</div>;
  }

  // Ensure valid image URL
  const getImageUrl = (url) => {
    try {
      return replaceS3WithCloudFront(url) || "/images/placeholder.jpg";
    } catch (error) {
      console.error("Error processing image URL:", error);
      return "/images/placeholder.jpg";
    }
  };

  return (
    <>
      {/* Thumbs Swiper */}
      <Swiper
        dir="ltr"
        direction="vertical"
        spaceBetween={10}
        slidesPerView={6}
        className="tf-product-media-thumbs other-image-zoom"
        onSwiper={setThumbsSwiper}
        modules={[Thumbs]}
        watchSlidesProgress
        breakpoints={{
          0: { direction: "horizontal" },
          1150: { direction: "vertical" },
        }}
      >
        {firstImage.map((slide, index) => (
          <SwiperSlide key={index} className="stagger-item">
            <div className="item">
              <Image
                src={getImageUrl(slide.url)}
                data-src={getImageUrl(slide.url)}
                alt="thumbnail"
                fill
                style={{ objectFit: "cover" }}
                loading="lazy"
                onError={(e) => {
                  e.target.src = "/images/placeholder.jpg";
                }}
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Main Swiper */}
      <Swiper
        dir="ltr"
        spaceBetween={10}
        slidesPerView={1}
        navigation={{
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        }}
        className="tf-product-media-main"
        id="gallery-swiper-started"
        thumbs={{ swiper: thumbsSwiper }}
        modules={[Thumbs, Navigation]}
        onSwiper={(swiper) => (swiperRef.current = swiper)}
        nested={true}
        mousewheel={{ forceToAxis: true }}
        touchReleaseOnEdges={true}
      >
        {firstImage.map((slide, index) => (
          <SwiperSlide key={index}>
            <div
              className="item"
              onClick={() => {
                setPhotoIndex(index);
                setLightboxOpen(true);
              }}
            >
              <Image
                src={getImageUrl(slide.url)}
                alt={slide.url || "product image"}
                width={500}
                height={700}
                style={{ objectFit: "cover", maxHeight: "700px" }}
                loading="lazy"
                onError={(e) => {
                  e.target.src = "/images/placeholder.jpg";
                }}
              />
            </div>
          </SwiperSlide>
        ))}
        <div className="swiper-button-next swiper-nav button-style-arrow thumbs-next" />
        <div className="swiper-button-prev swiper-nav button-style-arrow thumbs-prev" />
      </Swiper>

      {/* Lightbox */}
      {lightboxOpen && (
        <Lightbox
          open={lightboxOpen}
          close={() => setLightboxOpen(false)}
          slides={firstImage.map((slide) => ({ src: getImageUrl(slide.url) }))}
          index={photoIndex}
          plugins={[Zoom]}
          zoom={{
            maxZoomPixelRatio: 3,
          }}
          on={{
            indexChange: ({ index }) => {
              setPhotoIndex(index);
              swiperRef.current?.slideTo(index);
            },
          }}
        />
      )}
    </>
  );
}
