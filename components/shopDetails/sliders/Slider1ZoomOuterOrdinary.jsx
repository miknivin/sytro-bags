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
  const videoRefs = useRef({});

  // Helper to detect video URLs
  const isVideoUrl = (url) => /\.(mp4|webm|mov|avi|mpeg|ogg)$/i.test(url);
  
  // Separate images and videos
  const images = firstImage.filter(item => !isVideoUrl(item.url));
  const videos = firstImage.filter(item => isVideoUrl(item.url));
  const allMedia = [...images, ...videos];

  // Fallback for empty media
  if (!allMedia.length) {
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
        {allMedia.map((slide, index) => {
          const isVideo = isVideoUrl(slide.url);
          return (
          <SwiperSlide key={index} className="stagger-item">
            <div className="item">
              {isVideo ? (
                <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                  <video src={getImageUrl(slide.url)} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    borderRadius: '50%',
                    width: '40px',
                    height: '40px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 10
                  }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                      <polygon points="5 3 19 12 5 21"/>
                    </svg>
                  </div>
                </div>
              ) : (
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
              )}
            </div>
          </SwiperSlide>
        );
        })}
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
        onSlideChange={(swiper) => {
          const currentIndex = swiper.activeIndex;
          const currentSlide = allMedia[currentIndex];
          if (currentSlide && isVideoUrl(currentSlide.url)) {
            const video = videoRefs.current[currentIndex];
            if (video) {
              video.play();
            }
          }
        }}
        nested={true}
        mousewheel={{ forceToAxis: true }}
        touchReleaseOnEdges={true}
      >
        {allMedia.map((slide, index) => {
          const isVideo = isVideoUrl(slide.url);
          return (
          <SwiperSlide key={index}>
            {isVideo ? (
              <video
                ref={(el) => (videoRefs.current[index] = el)}
                src={getImageUrl(slide.url)}
                controls
                style={{ width: '100%', height: 'auto', minHeight: '400px', maxHeight: '700px', objectFit: 'cover', display: 'block' }}
                preload="metadata"
              />
            ) : (
              <div
                className="item"
                onClick={() => {
                  const imageIndex = images.findIndex(img => img.url === slide.url);
                  setPhotoIndex(imageIndex);
                  setLightboxOpen(true);
                }}
                style={{ cursor: 'pointer' }}
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
            )}
          </SwiperSlide>
        );
        })}
        <div className="swiper-button-next swiper-nav button-style-arrow thumbs-next" />
        <div className="swiper-button-prev swiper-nav button-style-arrow thumbs-prev" />
      </Swiper>

      {/* Lightbox */}
      {lightboxOpen && (
        <Lightbox
          open={lightboxOpen}
          close={() => setLightboxOpen(false)}
          slides={images.map((slide) => ({ src: getImageUrl(slide.url) }))}
          index={photoIndex}
          plugins={[Zoom]}
          zoom={{
            maxZoomPixelRatio: 3,
          }}
          on={{
            indexChange: ({ index }) => {
              setPhotoIndex(index);
              const allMediaIndex = allMedia.findIndex(m => m.url === images[index].url);
              swiperRef.current?.slideTo(allMediaIndex);
            },
          }}
        />
      )}
    </>
  );
}
