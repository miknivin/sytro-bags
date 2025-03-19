"use client";
import React, { useEffect, useRef, useState } from "react";

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
import { resetUploadedImage, setCartItem } from "@/redux/features/cartSlice.js";
import toast from "react-hot-toast";
import { setProductById } from "@/redux/features/productSlice";
import { useRouter, useSearchParams } from "next/navigation";
export default function DetailsOuterZoom({ product }) {
  //const kidsBagId = "67a70ca93f464380b64b05a6";
  const [currentColor, setCurrentColor] = useState(colors[0]);
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const cartItems = useSelector((state) => state.cart.cartItems);
  const [currentSize, setCurrentSize] = useState("Small");
  const selectedDesigns = useSelector((state) => state.cart.selectedDesigns);
  const uploadedImages = useSelector((state) => state.cart.uploadedImages);
  const searchParams = useSearchParams();
  const uploadModal = useRef();
  const selectedTemplate = useSelector(
    (state) => state.product.selectedTemplate
  );
  const handleColor = (color) => {
    // const updatedColor = colors.filter(
    //   (elm) => elm.value.toLowerCase() == color.toLowerCase()
    // )[0];
    // if (updatedColor) {
    //   setCurrentColor(updatedColor);
    // }
  };
  const sizeOptions = [{ value: "Small" }, { value: "Large" }];

  const isAddedToCartProducts = (id) => {
    return (
      Array.isArray(cartItems) && cartItems.some((item) => item.product === id)
    );
  };

  const hasCustomDesign = uploadedImages?.[product._id];

  const dispatch = useDispatch();
  const setItemToCart = () => {
    const cartItem = {
      product: product?._id,
      name: product?.name,
      price: product?.offer,
      image: product?.images[0]?.url,
      stock: product?.stock,
      quantity: quantity,
    };

    const storedSelectedDesigns =
      JSON.parse(localStorage.getItem("selectedDesigns")) || {};
    const storedUploadedImages =
      JSON.parse(localStorage.getItem("uploadedImages")) || {};

    cartItem.selectedDesign = storedSelectedDesigns[product?._id] || null;
    cartItem.uploadedImage = storedUploadedImages[product?._id] || null;

    dispatch(setCartItem(cartItem));
    toast.success("Item added to Cart");
  };

  useEffect(() => {
    if (product) {
      dispatch(setProductById(product));
    }
  }, [product, dispatch]);

  useEffect(() => {
    const isUploadImage = searchParams.get("isUploadImage");
    if (isUploadImage === "true" && hasCustomDesign) {
      if (!isAddedToCartProducts(product._id)) {
        setItemToCart();
      }
      openCartModal();
    }
  }, [searchParams]);
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
                    firstImage={
                      selectedDesigns[product._id]
                        ? [
                            {
                              url:
                                currentSize?.value === "Large"
                                  ? selectedDesigns[product._id]?.largeBagImage
                                  : selectedDesigns[product._id]?.smallBagImage,
                              _id: selectedDesigns?._id,
                            },
                            ...(currentSize?.value === "Large"
                              ? product?.extraImages?.slice(1) || []
                              : product?.images?.slice(1) || []),
                          ]
                        : [
                            ...(currentSize?.value === "Large"
                              ? product?.extraImages || []
                              : product?.images || []),
                          ]
                    }
                  />
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="tf-product-info-wrap position-relative">
                <div className="tf-zoom-main" />
                <div className="tf-product-info-list other-image-zoom">
                  <div className="tf-product-info-title">
                    <h5>
                      {product.name ? product.name : "Supershell collection"}{" "}
                      {selectedDesigns[product._id] && (
                        <span>({selectedDesigns[product._id].name})</span>
                      )}
                    </h5>
                  </div>
                  <div className="tf-product-info-price">
                    <div style={{ fontWeight: 600 }} className="price-on-sale">
                      ₹{product.offer.toFixed(2)}
                    </div>
                    <div className="badges-on-sale">
                      <span>
                        {(
                          (1 - product.offer / product.actualPrice) *
                          100
                        ).toFixed(2)}
                      </span>
                      % OFF
                    </div>
                  </div>
                  <div className="tf-product-info-variant-picker">
                    <div className="variant-picker-item"></div>
                    {product.category === "Kids Bags" && (
                      <div className="variant-picker-item mb-3">
                        <div
                          style={{ gap: "15px" }}
                          className="d-flex justify-content-between align-items-center"
                        >
                          {hasCustomDesign ? (
                            <div className="d-flex gap-2 flex-column">
                              <div
                                style={{ width: "fit-content" }}
                                className="position-relative border border-black rounded-2"
                              >
                                <button
                                  onClick={() =>
                                    dispatch(
                                      resetUploadedImage({
                                        productId: product._id,
                                      })
                                    )
                                  }
                                  className="remove-button badge"
                                >
                                  X
                                </button>
                                <img
                                  src={uploadedImages?.[product._id]}
                                  alt="Uploaded Image"
                                  style={{
                                    width: "125px",
                                    height: "125px",
                                    objectFit: "contain",
                                    borderRadius: "5px",
                                  }}
                                />
                              </div>
                              <div style={{ opacity: 0.7 }} className=" w-100">
                                <small title="" className="line-clamp">
                                  {uploadedImages?.[product._id]
                                    ? uploadedImages[product._id]
                                        .split("/")
                                        .pop()
                                    : ""}
                                </small>
                              </div>
                            </div>
                          ) : (
                            // Show Customize button if no design is selected
                            <a
                              ref={uploadModal}
                              href="#super_kidbag"
                              data-bs-toggle="modal"
                              className="tf-btn btn-fill radius-3 justify-content-center fw-6 fs-14 flex-grow-1 animate-hover-btn"
                            >
                              Upload your image
                            </a>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="tf-product-info-quantity">
                    <div className="quantity-title fw-6">Quantity</div>
                    <Quantity setQuantity={setQuantity} quantity={quantity} />
                  </div>
                  {/* size */}
                  <div className="variant-picker-item">
                    <div className="d-flex justify-content-between align-items-center"></div>
                    {/* <form className="variant-picker-values">
                      {sizeOptions.map((size, index) => (
                        <React.Fragment key={index}>
                          <input
                            type="radio"
                            name="size1"
                            id={size?.value}
                            readOnly
                            checked={currentSize == size?.value}
                          />
                          <label
                            onClick={() => setCurrentSize(size)}
                            className={`style-text ${
                              currentSize?.value === size?.value
                                ? "border-black bg-black text-white"
                                : ""
                            }`}
                            htmlFor={size.value}
                            data-value={size.value}
                          >
                            <p>{size.value}</p>
                          </label>
                        </React.Fragment>
                      ))}
                    </form> */}
                  </div>
                  <div className="tf-product-info-buy-button">
                    <form onSubmit={(e) => e.preventDefault()} className="">
                      <a
                        onClick={() => {
                          if (!hasCustomDesign) {
                            uploadModal.current.click();
                            router.push(
                              `${window.location.pathname}?isUploadImage=proceeding`,
                              {
                                scroll: false,
                              }
                            );
                            toast.error("You need to upload your image");
                            return;
                          }
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
                      <div className="w-100"></div>
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
                            <span className="fw-7">4-6 days</span>
                            {/* (International),
                            <span className="fw-7">3-6 days</span> (United
                            States). */}
                          </p>
                        </div>
                      </div>
                      {/* <div className="col-xl-6 col-12">
                        <div className="tf-product-delivery mb-0">
                          <div className="icon">
                            <i className="icon-return-order" />
                          </div>
                          <p>
                            Return within <span className="fw-7">30 days</span>{" "}
                            of purchase. Duties &amp; taxes are non-refundable.
                          </p>
                        </div>
                      </div> */}
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
          openUploadModal={() => uploadModal.current.click()}
          setItemsTocart={setItemToCart}
          quantity={quantity}
          setQuantity={setQuantity}
        />
      </div>
    </section>
  );
}
