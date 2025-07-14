"use client";
import Image from "next/image";
import React from "react";
import Link from "next/link";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import ReactStars from "react-rating-stars-component";
import { useGoogleReviewsQuery } from "@/redux/api/websiteSettings";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export default function GoogleReviews({ isTitle = true }) {
  const { data: reviewsData, isLoading, error } = useGoogleReviewsQuery();
  
  if (isLoading) {
    return <div className=" text-center">Loading reviews...</div>;
  }

  if (error) {
    return <div>Error loading reviews: {error.message}</div>;
  }

  const reviews = reviewsData?.reviews || [];
  const totalRating = reviewsData?.rating || 0; // e.g., 4.9
  const totalReviews = reviewsData?.user_ratings_total || 0; // e.g., 17

  return (
    <section
      className="flat-spacing-5 pt_0 flat-testimonial"
      style={{ maxWidth: "100vw", overflow: "hidden" }}
    >
      <div className="container px-md-5">
        {isTitle && (
          <div
            className="flat-title wow fadeInUp mx-auto pb-5"
            style={{ width: "fit-content" }}
            data-wow-delay="0s"
          >
            <span className="title">
              <img
                src="https://d229x2i5qj11ya.cloudfront.net/google-h.png"
                alt="Google Reviews"
              />
            </span>
            <div className="d-flex align-items-start justify-content-center">
              <p
                style={{ marginTop: "-24px" }}
                className="sub-title text-start fs-5 d-flex flex-wrap"
              >
                {totalRating.toFixed(1)} / 5
                <span className="rating ms-2 d-inline-block">
                  <ReactStars
                    count={5}
                    value={totalRating}
                    size={30}
                    activeColor="#f5c518"
                    edit={false}
                    isHalf={true}
                  />
                </span>
                <span className="ms-2">({totalReviews} reviews)</span>
              </p>
            </div>
          </div>
        )}

        <div className="wrap-carousel">
          <Swiper
            dir="ltr"
            className="swiper tf-sw-testimonial"
            spaceBetween={30}
            autoplay={{
              delay: 8000,
              disableOnInteraction: false,
            }}
            slidesPerView={3}
            breakpoints={{
              0: {
                slidesPerView: 1,
                spaceBetween: 15,
              },
              640: {
                slidesPerView: 2,
                spaceBetween: 15,
              },
              1024: {
                slidesPerView: 3,
                spaceBetween: 30,
              },
            }}
            modules={[Navigation, Pagination, Autoplay]}
            navigation={{
              prevEl: ".snbp3",
              nextEl: ".snbn3",
            }}
            pagination={{ clickable: true, el: ".spb3" }}
          >
            {reviews.map((review, index) => (
              <SwiperSlide className="swiper-slide" key={index}>
                <div
                  className="testimonial-item style-column wow fadeInUp"
                  data-wow-delay={`${index * 0.1}s`}
                >
                  <div className="rating">
                    <ReactStars
                      count={5}
                      value={review.rating}
                      size={24}
                      activeColor="#f5c518"
                      edit={false}
                      isHalf={true}
                    />
                  </div>
                  <div className="text">{review.text}</div>
                  <div className="author">
                    <div className="d-flex justify-content-start gap-1 align-items-start">
                      <Image
                        src={review.profile_photo_url || "/default-avatar.png"}
                        className="rounded-circle"
                        style={{ borderRadius: "50%" }}
                        width={50}
                        height={50}
                        alt={`${review.author_name}'s avatar`}
                        unoptimized // Remove after configuring next.config.js
                      />
                      <div className="d-flex flex-column">
                        <div className="name">{review.author_name}</div>
                        <div className="metas">
                          {review.relative_time_description}
                        </div>
                      </div>
                    </div>
                  </div>
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
