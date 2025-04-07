"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import { useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleChevronLeft,
  faCircleChevronRight,
} from "@fortawesome/free-solid-svg-icons";
const ImageModal = ({ isOpen, imageUrls, onClose }) => {
  console.log(imageUrls, "modal");
  if (!isOpen || !imageUrls?.length) return null;
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  return (
    <div
      className="modal fade show d-block"
      style={{ backgroundColor: "rgba(0,0,0,0.75)" }}
      onClick={onClose}
    >
      <div
        className="modal-dialog modal-dialog-centered"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-content">
          <div className="modal-body p-4">
            {imageUrls.length === 1 ? (
              <div className="d-flex justify-content-center">
                <img
                  src={imageUrls[0]}
                  alt="Uploaded content"
                  className="img-fluid"
                  style={{ maxHeight: "90vh" }}
                />
              </div>
            ) : (
              <Swiper
                modules={[Navigation, Pagination]}
                navigation={{
                  prevEl: prevRef.current,
                  nextEl: nextRef.current,
                }}
                onBeforeInit={(swiper) => {
                  swiper.params.navigation.prevEl = prevRef.current;
                  swiper.params.navigation.nextEl = nextRef.current;
                }}
                spaceBetween={10}
                slidesPerView={1}
                style={{ maxHeight: "85vh" }}
              >
                {imageUrls.map((url, index) => (
                  <SwiperSlide key={index}>
                    <div className="d-flex justify-content-center">
                      <img
                        src={url}
                        alt={`Uploaded content ${index + 1}`}
                        className="img-fluid"
                        style={{ maxHeight: "90vh" }}
                      />
                    </div>
                  </SwiperSlide>
                ))}

                <button ref={prevRef} className="nav-btn prev-btn">
                  <FontAwesomeIcon icon={faCircleChevronLeft} size="lg" />
                </button>
                <button ref={nextRef} className="nav-btn next-btn">
                  <FontAwesomeIcon icon={faCircleChevronRight} size="lg" />
                </button>
              </Swiper>
            )}
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageModal;
