"use client";
import React, { useState } from "react";

import Image from "next/image";
import CountdownComponent from "../common/Countdown";
import { colors } from "@/data/singleProductOptions";
import StickyItem from "./StickyItem";
import Quantity from "./Quantity";

import Slider1ZoomOuter from "./sliders/Slider1ZoomOuter";

import { openCartModal } from "@/utlis/openCartModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGooglePay,
  faCcVisa,
  faCcMastercard,
  faApplePay,
} from "@fortawesome/free-brands-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import { setCartItem } from "@/redux/features/cartSlice.js";
import toast from "react-hot-toast";

export default function DetailsOuterZoom({ product }) {
  const [currentColor, setCurrentColor] = useState(colors[0]);
  const [quantity, setQuantity] = useState(1);
  const cartItems = useSelector((state) => state.cart.cartItems);
  const handleColor = (color) => {
    const updatedColor = colors.filter(
      (elm) => elm.value.toLowerCase() == color.toLowerCase()
    )[0];
    if (updatedColor) {
      setCurrentColor(updatedColor);
    }
  };

  const isAddedToCartProducts = (id) => {
    return (
      Array.isArray(cartItems) && cartItems.some((item) => item.product === id)
    );
  };

  const dispatch = useDispatch();
  const setItemToCart = () => {
    const cartItem = {
      product: product?._id,
      name: product?.name,
      price: product?.price,
      image: product?.images[0]?.url,
      stock: product?.stock,
      quantity: quantity,
      price: product?.offer,
    };

    dispatch(setCartItem(cartItem));
    toast.success("Item added to Cart");
  };
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
                  <Slider1ZoomOuter
                    handleColor={handleColor}
                    currentColor={currentColor.value}
                    firstImage={product?.images}
                  />
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="tf-product-info-wrap position-relative">
                <div className="tf-zoom-main" />
                <div className="tf-product-info-list other-image-zoom">
                  <div className="tf-product-info-title">
                    <h5>{product.name ? product.name : "Cotton jersey top"}</h5>
                  </div>
                  <div className="tf-product-info-price">
                    <div className="price-on-sale">
                      ${product.offer.toFixed(2)}
                    </div>
                    <div className="badges-on-sale">
                      <span>
                        {(1 - product.offer / product.actualPrice).toFixed(2) *
                          100}
                      </span>
                      % OFF
                    </div>
                  </div>
                  <div className="tf-product-info-variant-picker">
                    <div className="variant-picker-item"></div>
                    <div className="variant-picker-item">
                      {/* kids bag only */}
                      {/* <div style={{gap:'15px'}} className="d-flex justify-content-between align-items-center ">
                        <a
                          href="#find_size"
                          data-bs-toggle="modal"
                          className="tf-btn btn-fill radius-3 justify-content-center fw-6 fs-14 flex-grow-1 animate-hover-btn"
                        >
                          Customize bag
                        </a>
                        <a
                          href="#find_size"
                          data-bs-toggle="modal"
                          className="find-size fw-6"
                        >
                          Choose from existing bags
                        </a>
                      </div> */}
                    </div>
                  </div>
                  <div className="tf-product-info-quantity">
                    <div className="quantity-title fw-6">Quantity</div>
                    <Quantity setQuantity={setQuantity} quantity={quantity} />
                  </div>
                  <div className="tf-product-info-buy-button">
                    <form onSubmit={(e) => e.preventDefault()} className="">
                      <a
                        onClick={() => {
                          openCartModal();
                          setItemToCart();
                        }}
                        className="tf-btn btn-fill justify-content-center fw-6 fs-16 flex-grow-1 animate-hover-btn"
                      >
                        <span>
                          {isAddedToCartProducts(product._id)
                            ? "Already Added"
                            : "Add to cart"}{" "}
                          -{" "}
                        </span>
                        <span className="tf-qty-price">
                          ₹{(product.offer * quantity).toFixed(2)}
                        </span>
                      </a>

                      <div className="w-100">
                        <button disabled className="btns-full">
                          Buy with
                          <span className="d-flex gap-3 fs-4">
                            <FontAwesomeIcon
                              icon={faGooglePay}
                              className="text-xl"
                            />
                            <FontAwesomeIcon
                              icon={faCcVisa}
                              className="text-xl"
                            />
                            <FontAwesomeIcon
                              icon={faCcMastercard}
                              className="text-xl"
                            />
                            <FontAwesomeIcon
                              icon={faApplePay}
                              className="text-xl"
                            />
                          </span>
                        </button>
                      </div>
                    </form>
                  </div>
                  <div className="tf-product-info-delivery-return">
                    <div className="row">
                      <div className="col-xl-6 col-12">
                        <div className="tf-product-delivery">
                          <div className="icon">
                            <i className="icon-delivery-time" />
                          </div>
                          <p>
                            Estimate delivery times:
                            <span className="fw-7">12-26 days</span>
                            (International),
                            <span className="fw-7">3-6 days</span> (United
                            States).
                          </p>
                        </div>
                      </div>
                      <div className="col-xl-6 col-12">
                        <div className="tf-product-delivery mb-0">
                          <div className="icon">
                            <i className="icon-return-order" />
                          </div>
                          <p>
                            Return within <span className="fw-7">30 days</span>{" "}
                            of purchase. Duties &amp; taxes are non-refundable.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="tf-product-info-trust-seal">
                    <div className="tf-product-trust-mess">
                      <i className="icon-safe" />
                      <p className="fw-6">Guarantee Safe Checkout</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>{" "}
      <div>
        <StickyItem
          product={product}
          isAddedToCartProducts={isAddedToCartProducts}
          setItemsTocart={setItemToCart}
          quantity={quantity}
          setQuantity={setQuantity}
        />
      </div>
    </section>
  );
}
