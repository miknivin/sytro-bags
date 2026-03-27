"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import Lightbox from "yet-another-react-lightbox"; // Using installed library
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import "yet-another-react-lightbox/styles.css"; // Lightbox styles
import { replaceS3WithCloudFront } from "@/components/shopCards/Productcart4";
import { isAppleTouchDevice } from "@/utlis/isAppleTouchDevice";

export default function Slider1ZoomOuter({
  handleColor = () => {},
  firstImage = [],
}) {
  const swiperRef = useRef(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);
  const [isAppleTouch, setIsAppleTouch] = useState(false);
  const [loadedYoutubeSlides, setLoadedYoutubeSlides] = useState({});

  useEffect(() => {
    setIsAppleTouch(isAppleTouchDevice());
  }, []);

  // Helper to get YouTube embed URL and ID
  const getYoutubeInfo = (url) => {
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url?.match(regExp);
    if (match && match[2].length === 11) {
      return {
        id: match[2],
        embedUrl: `https://www.youtube.com/embed/${match[2]}`,
        thumbnail: `https://img.youtube.com/vi/${match[2]}/0.jpg`,
      };
    }
    return null;
  };

  // Separate images and YouTube videos
  const images = firstImage.filter((item) => !getYoutubeInfo(item.url));
  const youtubeVideos = firstImage.filter((item) => getYoutubeInfo(item.url));
  const allMedia = [...images, ...youtubeVideos];
  const visibleThumbs = allMedia.slice(0, 4);
  const hasOverflowMedia = allMedia.length > 4;

  const openYoutubeSlide = (index) => {
    setLoadedYoutubeSlides((current) => {
      if (current[index]) {
        return current;
      }

      return {
        ...current,
        [index]: true,
      };
    });
  };

  const openOverflowLightbox = () => {
    if (!images.length) {
      return;
    }

    const hiddenMedia = allMedia.slice(4);
    const firstHiddenImageIndex = images.findIndex((image) =>
      hiddenMedia.some((media) => media.url === image.url),
    );

    setPhotoIndex(firstHiddenImageIndex >= 0 ? firstHiddenImageIndex : 0);
    setLightboxOpen(true);
  };

  // Fallback for empty media
  if (!allMedia.length) {
    return <div>No images available</div>;
  }

  return (
    <>
      {/*
      <Swiper
        dir="ltr"
        direction="vertical"
        spaceBetween={10}
        slidesPerView={6}
        className="tf-product-media-thumbs other-image-zoom"
        preloadImages={false}
        lazyPreloadPrevNext={1}
        breakpoints={{
          0: { direction: "horizontal" },
          1150: { direction: "vertical" },
        }}
      >
        {visibleThumbs.map((slide, index) => {
          const youtubeInfo = getYoutubeInfo(slide.url);
          return (
            <SwiperSlide key={index} className="stagger-item">
              <button
                type="button"
                className="item border-0 bg-transparent p-0 w-100"
                onClick={() => {
                  swiperRef.current?.slideTo(index);
                  setActiveMediaIndex(index);
                }}
                style={{
                  outline: "none",
                }}
              >
                {youtubeInfo ? (
                  <div
                    style={{
                      position: "relative",
                      width: "100%",
                      height: "100%",
                      border:
                        activeMediaIndex === index
                          ? "2px solid #000"
                          : "2px solid transparent",
                      borderRadius: "5px",
                      overflow: "hidden",
                    }}
                  >
                    <Image
                      src={youtubeInfo.thumbnail}
                      alt="youtube thumbnail"
                      fill
                      loading="lazy"
                      style={{ objectFit: "cover" }}
                    />
                    <div
                      style={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        backgroundColor: "rgba(255, 0, 0, 0.8)",
                        borderRadius: "8px",
                        width: "30px",
                        height: "20px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        zIndex: 10,
                      }}
                    >
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="white"
                      >
                        <polygon points="5 3 19 12 5 21" />
                      </svg>
                    </div>
                  </div>
                ) : (
                  <div
                    style={{
                      position: "relative",
                      width: "100%",
                      height: "100%",
                      border:
                        activeMediaIndex === index
                          ? "2px solid #000"
                          : "2px solid transparent",
                      borderRadius: "5px",
                      overflow: "hidden",
                    }}
                  >
                    <Image
                      className="lazyload"
                      data-src={
                        replaceS3WithCloudFront(slide.url) || "/fallback.png"
                      }
                      alt={"thumbnail"}
                      src={replaceS3WithCloudFront(slide.url) || "/fallback.png"}
                      fill
                      loading="lazy"
                      style={{ objectFit: "cover" }}
                    />
                  </div>
                )}
              </button>
            </SwiperSlide>
          );
        })}
        {hasOverflowMedia && (
          <SwiperSlide className="stagger-item">
            <button
              type="button"
              className="item border-0 bg-light p-0 w-100 d-flex align-items-center justify-content-center"
              onClick={openOverflowLightbox}
              aria-label="Open gallery lightbox"
              style={{
                fontSize: "28px",
                fontWeight: 700,
                color: "#333",
              }}
            >
              ..
            </button>
          </SwiperSlide>
        )}
      </Swiper>
      */}

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
        modules={[Navigation]}
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
          setActiveMediaIndex(swiper.realIndex || 0);
        }}
        onSlideChange={(swiper) => {
          setActiveMediaIndex(swiper.realIndex);
        }}
        nested={true}
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
                    backgroundColor: "#000",
                  }}
                >
                  {loadedYoutubeSlides[index] ? (
                    <iframe
                      loading="lazy"
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        border: 0,
                      }}
                      src={`${youtubeInfo.embedUrl}?autoplay=1&rel=0&playsinline=1`}
                      title="YouTube video player"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    ></iframe>
                  ) : (
                    <button
                      type="button"
                      onClick={() => openYoutubeSlide(index)}
                      aria-label="Play product video"
                      style={{
                        position: "absolute",
                        inset: 0,
                        border: 0,
                        padding: 0,
                        background: "transparent",
                        cursor: "pointer",
                      }}
                    >
                      <Image
                        src={youtubeInfo.thumbnail}
                        alt="youtube thumbnail"
                        fill
                        loading="lazy"
                        style={{ objectFit: "cover" }}
                      />
                      <div
                        style={{
                          position: "absolute",
                          top: "50%",
                          left: "50%",
                          transform: "translate(-50%, -50%)",
                          backgroundColor: "rgba(255, 0, 0, 0.85)",
                          borderRadius: "10px",
                          width: "56px",
                          height: "40px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          zIndex: 10,
                        }}
                      >
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="white"
                        >
                          <polygon points="5 3 19 12 5 21" />
                        </svg>
                      </div>
                    </button>
                  )}
                </div>
              ) : (
                <div
                  className="item"
                  onClick={() => {
                    if (isAppleTouch) {
                      return;
                    }
                    const imageIndex = images.findIndex(
                      (img) => img.url === slide.url,
                    );
                    if (imageIndex !== -1) {
                      setPhotoIndex(imageIndex);
                      setLightboxOpen(true);
                    }
                  }}
                  style={{ cursor: "pointer" }}
                >
                  <Image
                    className="lazyload"
                    data-src={
                      replaceS3WithCloudFront(slide.url) || "/fallback.png"
                    }
                    alt={slide.url || "image"}
                    width={250}
                    height={320}
                    loading="lazy"
                    style={{ objectFit: "cover", maxHeight: "700px" }}
                    src={replaceS3WithCloudFront(slide.url) || "/fallback.png"}
                  />
                </div>
              )}
            </SwiperSlide>
          );
        })}
        <div
          className="swiper-button-next swiper-nav button-style-arrow thumbs-next"
          style={{ zIndex: 100, pointerEvents: "auto" }}
        />
        <div
          className="swiper-button-prev swiper-nav button-style-arrow  thumbs-prev"
          style={{ zIndex: 100, pointerEvents: "auto" }}
        />
      </Swiper>

      {/* Lightbox */}
      {lightboxOpen && (
        <Lightbox
          open={lightboxOpen}
          close={() => setLightboxOpen(false)}
          slides={images.map((slide) => ({
            src: replaceS3WithCloudFront(slide.url) || "/fallback.png",
          }))}
          index={photoIndex}
          plugins={isAppleTouch ? [] : [Zoom]}
          zoom={isAppleTouch ? undefined : { maxZoomPixelRatio: 3 }}
          on={{
            indexChange: ({ index }) => {
              setPhotoIndex(index);
              const allMediaIndex = allMedia.findIndex(
                (m) => m.url === images[index].url,
              );
              swiperRef.current?.slideTo(allMediaIndex);
            },
          }}
        />
      )}
    </>
  );
}
