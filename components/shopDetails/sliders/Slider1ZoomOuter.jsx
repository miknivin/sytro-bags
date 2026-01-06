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
import { replaceS3WithCloudFront } from "@/components/shopCards/Productcart4";

export default function Slider1ZoomOuter({
  handleColor = () => { },
  firstImage = [],
}) {
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const swiperRef = useRef(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);

  // Helper to get YouTube embed URL and ID
  const getYoutubeInfo = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url?.match(regExp);
    if (match && match[2].length === 11) {
      return {
        id: match[2],
        embedUrl: `https://www.youtube.com/embed/${match[2]}`,
        thumbnail: `https://img.youtube.com/vi/${match[2]}/0.jpg`
      };
    }
    return null;
  };

  // Separate images and YouTube videos
  const images = firstImage.filter(item => !getYoutubeInfo(item.url));
  const youtubeVideos = firstImage.filter(item => getYoutubeInfo(item.url));
  const allMedia = [...images, ...youtubeVideos];

  // Fallback for empty media
  if (!allMedia.length) {
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
        watchSlidesProgress
        breakpoints={{
          0: { direction: "horizontal" },
          1150: { direction: "vertical" },
        }}
      >
        {allMedia.map((slide, index) => {
          const youtubeInfo = getYoutubeInfo(slide.url);
          return (
            <SwiperSlide key={index} className="stagger-item">
              <div className="item">
                {youtubeInfo ? (
                  <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                    <Image
                      src={youtubeInfo.thumbnail}
                      alt="youtube thumbnail"
                      fill
                      style={{ objectFit: "cover" }}
                    />
                    <div style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      backgroundColor: 'rgba(255, 0, 0, 0.8)',
                      borderRadius: '8px',
                      width: '30px',
                      height: '20px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      zIndex: 10
                    }}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="white">
                        <polygon points="5 3 19 12 5 21" />
                      </svg>
                    </div>
                  </div>
                ) : (
                  <Image
                    className="lazyload"
                    data-src={replaceS3WithCloudFront(slide.url) || "/fallback.png"}
                    alt={"thumbnail"}
                    src={replaceS3WithCloudFront(slide.url) || "/fallback.png"}
                    fill
                    style={{ objectFit: "cover" }}
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
        nested={true}
        mousewheel={{ forceToAxis: true }}
        touchReleaseOnEdges={true}
      >
        {allMedia.map((slide, index) => {
          const youtubeInfo = getYoutubeInfo(slide.url);
          return (
            <SwiperSlide key={index}>
              {youtubeInfo ? (
                <div
                  className="video-container"
                  style={{
                    position: "relative",
                    paddingBottom: "140%",
                    height: 0,
                    overflow: "hidden",
                    backgroundColor: "#000"
                  }}
                >
                  <iframe
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      border: 0,
                    }}
                    src={`${youtubeInfo.embedUrl}?autoplay=0&rel=0`}
                    title="YouTube video player"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  ></iframe>
                </div>
              ) : (
                <div
                  className="item"
                  onClick={() => {
                    const imageIndex = images.findIndex(img => img.url === slide.url);
                    if (imageIndex !== -1) {
                      setPhotoIndex(imageIndex);
                      setLightboxOpen(true);
                    }
                  }}
                  style={{ cursor: 'pointer' }}
                >
                  <Image
                    className="lazyload"
                    data-src={replaceS3WithCloudFront(slide.url) || "/fallback.png"}
                    alt={slide.url || "image"}
                    width={250}
                    height={320}
                    style={{ objectFit: "cover", maxHeight: "700px" }}
                    src={replaceS3WithCloudFront(slide.url) || "/fallback.png"}
                  />
                </div>
              )}
            </SwiperSlide>
          );
        })}
        <div className="swiper-button-next swiper-nav button-style-arrow thumbs-next" style={{ zIndex: 100, pointerEvents: 'auto' }} />
        <div className="swiper-button-prev swiper-nav button-style-arrow  thumbs-prev" style={{ zIndex: 100, pointerEvents: 'auto' }} />
      </Swiper>

      {/* Lightbox */}
      {lightboxOpen && (
        <Lightbox
          open={lightboxOpen}
          close={() => setLightboxOpen(false)}
          slides={images.map((slide) => ({ src: slide.url }))}
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
