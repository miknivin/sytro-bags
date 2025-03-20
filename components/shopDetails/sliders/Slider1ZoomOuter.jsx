"use client";
import { useRef, useState } from "react";
import Image from "next/image";
import { Navigation, Thumbs } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import Lightbox from "yet-another-react-lightbox"; // Using installed library
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import "yet-another-react-lightbox/styles.css"; // Lightbox styles

export default function Slider1ZoomOuter({
  handleColor = () => {},
  firstImage = [],
}) {
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const swiperRef = useRef(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);

  // Fallback for empty firstImage
  if (!firstImage.length) {
    return <div>No images available</div>;
  }

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
        watchSlidesProgress // Ensure thumbs sync
        breakpoints={{
          0: { direction: "horizontal" },
          1150: { direction: "vertical" },
        }}
      >
        {firstImage.map((slide, index) => (
          <SwiperSlide key={index} className="stagger-item">
            <div className="item">
              <Image
                className="lazyload"
                data-src={slide.url}
                alt={"thumbnail"}
                src={slide.url}
                fill
                style={{ objectFit: "cover" }}
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
        // onSlideChange={(swiper) => {
        //   handleColor(firstImage[swiper.activeIndex]?.dataValue);
        // }}
        nested={true} // Allow nested scrolling
        mousewheel={{ forceToAxis: true }} // Horizontal mousewheel only
        touchReleaseOnEdges={true} // Release touch at edges
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
                className="lazyload"
                data-src={slide.url}
                alt={slide.url || "image"}
                width={250}
                height={320}
                style={{ objectFit: "cover", maxHeight: "700px" }}
                src={slide.url}
              />
            </div>
          </SwiperSlide>
        ))}
        <div className="swiper-button-next swiper-nav button-style-arrow thumbs-next" />
        <div className="swiper-button-prev swiper-nav button-style-arrow  thumbs-prev" />
      </Swiper>

      {/* Lightbox */}
      {lightboxOpen && (
        <Lightbox
          open={lightboxOpen}
          close={() => setLightboxOpen(false)}
          slides={firstImage.map((slide) => ({ src: slide.url }))}
          index={photoIndex}
          plugins={[Zoom]}
          zoom={{
            maxZoomPixelRatio: 3, // Max zoom level (default: 1)
          }}
          on={{
            // Sync lightbox index with Swiper
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
