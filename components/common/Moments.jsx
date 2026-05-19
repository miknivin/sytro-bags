"use client";
import { memo, useRef, useState } from "react";
import { Autoplay, FreeMode, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/free-mode";
import { useGetMomentsQuery } from "@/redux/api/websiteSettings";

export const dynamic = "force-dynamic";
function Moments() {
  const { data, error, isLoading } = useGetMomentsQuery();
  const [activePlayingIndex, setActivePlayingIndex] = useState(null);

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
              onSlideChange={() => setActivePlayingIndex(null)}
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
                    {activePlayingIndex === i ? (
                      <video
                        className="w-100 video-aspect-ratio object-fit-cover rounded-4"
                        controls
                        autoPlay
                        playsInline
                        preload="auto"
                        onPause={() => setActivePlayingIndex(null)}
                        onEnded={() => setActivePlayingIndex(null)}
                      >
                        <source src={url} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                    ) : (
                      <div
                        className="w-100 video-aspect-ratio rounded-4 d-flex flex-column align-items-center justify-content-center position-relative cursor-pointer"
                        style={{
                          background: "linear-gradient(135deg, #111827 0%, #1f2937 100%)",
                          border: "1px solid rgba(255,255,255,0.08)",
                          boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.3), 0 8px 10px -6px rgba(0, 0, 0, 0.3)",
                          minHeight: "280px"
                        }}
                        onClick={() => setActivePlayingIndex(i)}
                      >
                        {/* Watermark Logo */}
                        <div style={{ opacity: 0.08, position: "absolute", top: "20px" }}>
                          <img src="/images/logo/logo-white.svg" alt="Sytro Logo" width="80" />
                        </div>

                        {/* Play Button Overlay */}
                        <div className="d-flex flex-column align-items-center" style={{ zIndex: 2 }}>
                          <div className="play-button-outer d-flex align-items-center justify-content-center mb-3" style={{
                            width: "54px",
                            height: "54px",
                            borderRadius: "50%",
                            backgroundColor: "#ffc720",
                            color: "#000",
                            boxShadow: "0 4px 20px rgba(255, 199, 32, 0.4)",
                            transition: "transform 0.2s ease"
                          }}>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width={24}
                              height={24}
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path d="M8 5v14l11-7z" />
                            </svg>
                          </div>
                          <span className="badge rounded-pill bg-dark border border-secondary text-white px-3 py-2 small fw-bold" style={{ fontSize: "11px", letterSpacing: "0.05em" }}>
                            WATCH REEL
                          </span>
                        </div>
                      </div>
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

export default memo(Moments);
