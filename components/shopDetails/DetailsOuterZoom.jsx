"use client";

import React, { useMemo } from "react";
import StickyItem from "./StickyItem";
import Slider1ZoomOuter from "./sliders/Slider1ZoomOuter";
import OfferTimer from "@/utlis/OfferTimer";
import HappyCustomers from "../common/HappyCustomers";

function DetailsOuterZoom({ product, details, onOrderNow, isAddedToCart }) {
  const isOutOfStock = Number(product?.stock ?? product?.stocks ?? 0) <= 0;
  const galleryItems = useMemo(
    () => [
      ...((product?.images || []).map((image) => ({
        url: image?.url,
        _id: image?._id,
      }))),
      ...((product?.youtubeUrl || []).map((url) => ({ url }))),
    ].filter((item) => item.url),
    [product?.images, product?.youtubeUrl],
  );

  if (!product) {
    return null;
  }

  return (
    <section
      className="flat-spacing-4 pt_0"
      style={{ maxWidth: "100vw", overflow: "clip" }}
    >
      <div
        className="tf-main-product section-image-zoom"
        style={{ maxWidth: "100vw", overflow: "clip" }}
      >
        <div className="container">
          <div className="row">
            <div className="col-md-6">
              <div className="tf-product-media-wrap sticky-top h-100">
                <div className="thumbs-slider">
                  <Slider1ZoomOuter firstImage={galleryItems} />
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="tf-product-info-wrap position-relative">
                <div className="tf-zoom-main" />
                <div className="tf-product-info-list other-image-zoom">
                  <div className="tf-product-info-title mb-3">
                    <h4
                      style={{
                        fontWeight: 800,
                        fontSize: "28px",
                        color: "#333",
                      }}
                    >
                      {product.name ? product.name : "Supershell collection"}
                    </h4>
                    {isOutOfStock && (
                      <div
                        className="mt-2 d-inline-flex align-items-center"
                        style={{
                          backgroundColor: "#dc2626",
                          color: "#fff",
                          padding: "6px 12px",
                          borderRadius: "999px",
                          fontSize: "12px",
                          fontWeight: 700,
                          textTransform: "uppercase",
                          letterSpacing: "0.04em",
                        }}
                      >
                        Out of stock
                      </div>
                    )}
                  </div>

                  <div className="product-description mb-3">
                    <p
                      style={{
                        fontSize: "14px",
                        color: "#666",
                        lineHeight: "1.5",
                        margin: 0,
                      }}
                    >
                      {(
                        details?.description ||
                        product?.description ||
                        ""
                      ).substring(0, 150)}
                      {(details?.description || product?.description || "")
                        .length > 150 && "..."}
                    </p>
                  </div>

                  {product.category === "Kids Bags" && (
                    <div className="service-tags-section mb-4">
                      <div className="row">
                        <div className="col-12">
                          <div className="service-tag d-flex align-items-center mb-2">
                            <div className="service-icon me-3">
                              <img
                                src="/images/icons/Untitled design (9).svg"
                                alt="2 Year Warranty"
                                width="20"
                                height="20"
                              />
                            </div>
                            <div>
                              <span
                                style={{
                                  fontSize: "13px",
                                  fontWeight: "500",
                                  color: "#333",
                                }}
                              >
                                2 YEAR WARRANTY
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="col-12">
                          <div className="service-tag d-flex align-items-center mb-2">
                            <div className="service-icon me-3">
                              <img
                                src="/images/icons/I241123182839208168.svg"
                                alt="Free Shipping"
                                width="20"
                                height="20"
                              />
                            </div>
                            <div>
                              <span
                                style={{
                                  fontSize: "13px",
                                  fontWeight: "500",
                                  color: "#333",
                                }}
                              >
                                ALL INDIA FREE DELIVERY
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="col-12">
                          <div className="service-tag d-flex align-items-center mb-2">
                            <div className="service-icon me-3">
                              <img
                                src="/images/icons/I250317133325217317.svg"
                                alt="Limited Orders"
                                width="20"
                                height="20"
                              />
                            </div>
                            <div>
                              <span
                                style={{
                                  fontSize: "13px",
                                  fontWeight: "500",
                                  color: "#333",
                                }}
                              >
                                ONLY LIMITED ORDERS DAILY
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="col-12">
                          <div className="service-tag d-flex align-items-center mb-2">
                            <div className="service-icon me-3">
                              <img
                                src="/images/icons/printer_icon.3b26a3e3.svg"
                                alt="Printing & Dispatch"
                                width="20"
                                height="20"
                              />
                            </div>
                            <div>
                              <span
                                style={{
                                  fontSize: "13px",
                                  fontWeight: "500",
                                  color: "#333",
                                }}
                              >
                                PRINT & DISPATCH IN 2-4 WORKING DAYS
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="mb-3">
                    {product?.offerEndTime && (
                      <OfferTimer offerEndTime={product.offerEndTime} />
                    )}
                  </div>

                  <div className="tf-product-info-price d-flex align-items-center gap-3 mb-4">
                    <div
                      style={{
                        fontWeight: 700,
                        fontSize: "24px",
                        color: "#000",
                      }}
                      className="price-on-sale"
                    >
                      &#8377;{product?.offer?.toFixed(2)}
                    </div>
                    <div>
                      <span
                        style={{
                          fontSize: "18px",
                          color: "#999",
                          textDecoration: "line-through",
                        }}
                      >
                        &#8377;{product?.actualPrice?.toFixed(2) || 3000}
                      </span>
                    </div>
                    <div
                      style={{
                        backgroundColor: "#ff4444",
                        color: "white",
                        padding: "4px 8px",
                        borderRadius: "4px",
                        fontSize: "10px",
                        fontWeight: "600",
                      }}
                    >
                      {(
                        (1 - product?.offer / product?.actualPrice) *
                        100
                      ).toFixed(0)}
                      % OFF
                    </div>
                    <div
                      style={{ color: "#5d5b5bff", fontSize: "14px" }}
                      className="fw-light"
                    >
                      Inc. GST
                    </div>
                  </div>
                  <div className="tf-product-info-variant-picker mb-0">
                    <div className="variant-picker-item"></div>
                  </div>
                  <div className="variant-picker-item">
                    <div className="d-flex justify-content-between align-items-center"></div>
                  </div>
                  <div className="tf-product-info-buy-button">
                    <form onSubmit={(event) => event.preventDefault()} className="">
                      {isOutOfStock ? (
                        <button
                          type="button"
                          className="tf-btn btns-sold-out cursor-not-allowed btn-fill justify-content-center fw-6 fs-16 flex-grow-1 animate-hover-btn mb-2 border-0"
                        >
                          <span>Sold out</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={onOrderNow}
                          className="tf-btn btn-fill justify-content-center fw-6 fs-16 flex-grow-1 animate-hover-btn mb-2 border-0"
                        >
                          <span>
                            {isAddedToCart ? "Already added" : "Order now"} :{"  "}
                          </span>
                          <span className="tf-qty-price">
                            {"   "}&#8377;{(product.offer * 1).toFixed(2)}
                          </span>
                        </button>
                      )}
                      <div className="w-100"></div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <HappyCustomers />
      <div>
        <StickyItem
          product={product}
          soldOut={isOutOfStock}
          onOrderNow={onOrderNow}
        />
      </div>
    </section>
  );
}

export default React.memo(DetailsOuterZoom);
