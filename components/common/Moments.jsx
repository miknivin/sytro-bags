"use client";
import { useState, useRef } from "react";
import { Autoplay, FreeMode, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/free-mode";
import { useGetMomentsQuery } from "@/redux/api/websiteSettings";

export default function Moments() {
  const { data, error, isLoading } = useGetMomentsQuery();
  const [playingVideos, setPlayingVideos] = useState({});
  const videoRefs = useRef({});

  const handlePlay = (index) => {
    const video = videoRefs.current[index];
    if (video) {
      video.play();
    }
  };

  const handleVideoPlay = (index) => {
    setPlayingVideos((prev) => ({ ...prev, [index]: true }));
  };

  const handleVideoPause = (index) => {
    setPlayingVideos((prev) => ({ ...prev, [index]: false }));
  };

  return (
    <section
      className="flat-spacing-7 flat-iconbox wow fadeInUp pt-5"
      data-wow-delay="0s"
    >
      <div className="flat-title mb_1 gap-14">
        <span className="title wow fadeInUp" data-wow-delay="0s">
          Captured Moments
        </span>
        <p className="sub-title wow fadeInUp" data-wow-delay="0s">
          Discover the joy of unboxing our custom bags in these captivating
          video moments.
        </p>
      </div>
      <div className="container">
        <div className="wrap-carousel moments-container wrap-mobile">
          {isLoading && <div className="text-center">Loading...</div>}
          {error && (
            <div className="text-center text-danger">
              Error: {error.data?.error || "Failed to load videos"}
            </div>
          )}
          {data?.success && data.data.length > 0 ? (
            <Swiper
              dir="ltr"
              slidesPerView={4}
              spaceBetween={30}
              freeMode={true}
              autoplay={{
                delay: 5000,
                disableOnInteraction: true,
              }}
              breakpoints={{
                1200: {
                  slidesPerView: 5,
                },
                800: {
                  slidesPerView: 3,
                },
                600: {
                  slidesPerView: 2,
                },
                0: {
                  slidesPerView: 2,
                },
              }}
              className="swiper tf-sw-mobile px-3 px-md-4"
              data-preview={1}
              data-space={5}
              modules={[FreeMode, Pagination, Autoplay]}
              pagination={{ clickable: true, el: ".spd103" }}
            >
              {data.data.flat().map((url, i) => (
                <SwiperSlide key={i} className="swiper-slide">
                  <div className="tf-video-box style-border-line text-center mx-auto position-relative">
                    <video
                      className="w-100 video-aspect-ratio object-fit-cover rounded-4"
                      ref={(el) => (videoRefs.current[i] = el)}
                      controls={playingVideos[i]}
                      muted
                      playsInline
                      onPlay={() => handleVideoPlay(i)}
                      onPause={() => handleVideoPause(i)}
                    >
                      <source src={url} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                    {!playingVideos[i] && (
                      <button
                        style={{
                          position: "absolute",
                          top: "50%",
                          left: "50%",
                          transform: "translate(-50%, -50%)",
                          background: "rgba(0, 0, 0, 0.5)",
                          border: "none",
                          borderRadius: "50%",
                          width: "50px",
                          height: "50px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: "pointer",
                          transition: "background 0.3s",
                        }}
                        className="play-button position-absolute"
                        onClick={() => handlePlay(i)}
                      >
                        <svg
                          className="text-gray-800 dark:text-white"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          width={30}
                          height={30}
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke="white"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 18V6l8 6-8 6Z"
                          />
                        </svg>
                      </button>
                    )}
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            !isLoading &&
            !error && <div className="text-center">No videos available</div>
          )}
          <div className="sw-dots style-2 sw-pagination-mb justify-content-center spd103" />
        </div>
      </div>
    </section>
  );
}
