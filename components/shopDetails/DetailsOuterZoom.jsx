"use client";
import React, { useEffect, useRef, useState } from "react";

import Image from "next/image";
import { colors } from "@/data/singleProductOptions";
import StickyItem from "./StickyItem";
import Quantity from "./Quantity";
import Slider1ZoomOuter from "./sliders/Slider1ZoomOuter";
import { openCartModal } from "@/utlis/openCartModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";

import { useDispatch, useSelector } from "react-redux";
import {
  removeUploadedImage,
  resetUploadedImage,
  setCartItem,
  setUploadedImage,
} from "@/redux/features/cartSlice.js";
import toast from "react-hot-toast";
import { setProductById } from "@/redux/features/productSlice";
import { useRouter, useSearchParams } from "next/navigation";
import DetailsStatic from "./DetailsStatic";
import { sanitizeLocalStorageImages } from "@/app/helpers/localStorageSanitizer";
import OfferTimer from "@/utlis/OfferTimer";
import HappyCustomers from "../common/HappyCustomers";
import CustomAlert from "@/utlis/CustomAlert";

export default function DetailsOuterZoom({ product, details }) {
  //const kidsBagId = "67a70ca93f464380b64b05a6";

  const [currentColor, setCurrentColor] = useState(colors[0]);

  const router = useRouter();
  const uploadModalRef = useRef(null);
  const handleColor = () => {};
  const cartItems = useSelector((state) => state.cart.cartItems);
  const [currentSize, setCurrentSize] = useState("Small");
  const selectedDesigns = useSelector((state) => state.cart.selectedDesigns);
  const uploadedImages = useSelector((state) => state.cart.uploadedImages);
  const customNames = useSelector((state) => state.cart.customNames);
  const [quantity, setQuantity] = useState(
    product.category === "Kids Bags"
      ? 1
      : uploadedImages?.[product._id]?.length || 1,
  );
  const [customName, setCustomName] = useState("");

  useEffect(() => {
    if (product?._id && customNames?.[product._id]) {
      setCustomName(customNames[product._id]);
    } else {
      setCustomName("");
    }
  }, [product?._id, customNames]);

  const [showAlert, setShowAlert] = useState(false);
  const searchParams = useSearchParams();
  const uploadModal = useRef(null);
  const quantityChange = useSelector((state) => state.cart.quantityChange);
  const isAddedToCartProducts = (id) => {
    return (
      Array.isArray(cartItems) && cartItems.some((item) => item.product === id)
    );
  };

  const hasCustomDesign = uploadedImages?.[product._id];

  const dispatch = useDispatch();

  const setItemToCart = (forcedName = null) => {
    const nameToUse = forcedName !== null ? forcedName : customName;

    // Name is now optional for Kids Bags
    /*
    if (product.category === "Kids Bags" && !nameToUse.trim()) {
      setShowAlert(true);
      return;
    }
    */

    const cartItem = {
      product: product?._id,
      name: product?.name,
      category: product?.category || "Kids Bags",
      price: product?.offer,
      image: product?.images[0]?.url,
      stock: product?.stock,
      quantity: quantity,
      ...(nameToUse.trim() ? { customNameToPrint: nameToUse.trim() } : {}),
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

  const handleAlertConfirm = (value) => {
    setCustomName(value);
    setShowAlert(false);
    setItemToCart(value);
    openCartModal();
  };

  const handleAlertCancel = () => {
    setShowAlert(false);
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

  useEffect(() => {
    if (product.category !== "Kids Bags") {
      setQuantity(uploadedImages?.[product._id]?.length || 1);
    }
  }, [uploadedImages, product._id]);

  useEffect(() => {
    if (product.category === "Kids Bags") return; // Disable for Kids Bags

    const currentImageCount = uploadedImages?.[product._id]?.length || 0;
    // ... rest of logic
    if (quantityChange.isIncreasing && quantity > currentImageCount) {
      const imagesToUploadCount = quantity - currentImageCount;
      const currentPath = window.location.pathname;
      const query = new URLSearchParams({
        isUploadImage: "proceeding",
        quantity: imagesToUploadCount.toString(),
      }).toString();
      router.push(`${currentPath}?${query}`, { scroll: false });
      const isProductInCart = cartItems.some(
        (item) => item.product === product._id,
      );
      if (isProductInCart) {
        uploadModalRef.current?.click();
        setQuantity(currentImageCount > 0 ? currentImageCount : 1);
      }
    } else if (!quantityChange.isIncreasing && quantity < currentImageCount) {
      const lastImageIndex = currentImageCount - 1;
      if (lastImageIndex >= 0) {
        dispatch(
          removeUploadedImage({
            productId: product?._id,
            imageIndex: lastImageIndex,
          }),
        );
      }
    }
  }, [quantityChange, product._id, router]);
  useEffect(() => {
    sanitizeLocalStorageImages();
  }, []);
  return (
    <section
      className="flat-spacing-4 pt_0"
      style={{ maxWidth: "100vw", overflow: "clip" }}
    >
      <CustomAlert
        show={showAlert}
        onConfirm={handleAlertConfirm}
        onCancel={handleAlertCancel}
        title="Name Required"
        message="Please enter a name for the kids bag."
        confirmText="Add to Cart"
        cancelText="Cancel"
      />
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
                    firstImage={[
                      ...(selectedDesigns[product._id]
                        ? [
                            {
                              url:
                                currentSize?.valueOf === "Large"
                                  ? selectedDesigns[product._id]?.largeBagImage
                                  : selectedDesigns[product._id]?.smallBagImage,
                              _id: selectedDesigns?._id,
                            },
                            ...(currentSize?.valueOf === "Large"
                              ? product?.extraImages?.slice(1) || []
                              : product?.images?.slice(1) || []),
                          ]
                        : [
                            ...(currentSize?.valueOf === "Large"
                              ? product?.extraImages || []
                              : product?.images || []),
                          ]),
                      ...(product.youtubeUrl || []).map((url) => ({ url })),
                    ]}
                  />
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="tf-product-info-wrap position-relative">
                <div className="tf-zoom-main" />
                <div className="tf-product-info-list other-image-zoom">
                  {/* Product Name - Bold */}
                  <div className="tf-product-info-title mb-3">
                    <h4
                      style={{
                        fontWeight: 800,
                        fontSize: "28px",
                        color: "#333",
                      }}
                    >
                      {product.name ? product.name : "Supershell collection"}{" "}
                      {selectedDesigns[product._id] && (
                        <span>({selectedDesigns[product._id].name})</span>
                      )}
                    </h4>
                  </div>

                  {/* Small Description */}
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

                  {/* Service Tags */}
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

                  {/* Offer Timer - Prominent Display */}
                  <div className="mb-3">
                    {product && product?.offerEndTime && (
                      <OfferTimer
                        offerEndTime={product && product?.offerEndTime}
                      />
                    )}
                  </div>

                  {/* Pricing Section */}
                  <div className="tf-product-info-price d-flex align-items-center gap-3 mb-4">
                    <div
                      style={{
                        fontWeight: 700,
                        fontSize: "24px",
                        color: "#000",
                      }}
                      className="price-on-sale"
                    >
                      ₹{product?.offer?.toFixed(2)}
                    </div>
                    <div>
                      <span
                        style={{
                          fontSize: "18px",
                          color: "#999",
                          textDecoration: "line-through",
                        }}
                      >
                        ₹{product?.actualPrice?.toFixed(2) || 3000}
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
                    {/* Customization is now handled via the Order button and modal */}
                  </div>
                  {product.category !== "Kids Bags" && (
                    <div className="tf-product-info-quantity">
                      <div className="quantity-title fw-6">Quantity</div>
                      <Quantity
                        setQuantity={setQuantity}
                        quantity={quantity}
                        imagesLength={
                          uploadedImages?.[product._id]?.length || 0
                        }
                      />
                    </div>
                  )}
                  {/* size */}
                  <div className="variant-picker-item">
                    <div className="d-flex justify-content-between align-items-center"></div>
                  </div>
                  <div className="tf-product-info-buy-button">
                    <form onSubmit={(e) => e.preventDefault()} className="">
                      {!hasCustomDesign ? (
                        <>
                          <a
                            href="#super_kidbag"
                            data-bs-toggle="modal"
                            onClick={() => {
                              const currentPath = window.location.pathname;
                              const query = new URLSearchParams({
                                isUploadImage: "proceeding",
                                quantity: quantity.toString(),
                              }).toString();
                              router.push(`${currentPath}?${query}`, {
                                scroll: false,
                              });
                              //toast.error("You need to upload your image");
                            }}
                            className="tf-btn btn-fill justify-content-center fw-6 fs-16 flex-grow-1 animate-hover-btn mb-2"
                          >
                            <span>
                              {isAddedToCartProducts(product._id)
                                ? "Already Added"
                                : "Order now"}{" "}
                              :{"  "}
                            </span>
                            <span className="tf-qty-price">
                              {"   "}₹{(product.offer * quantity).toFixed(2)}
                            </span>
                          </a>
                        </>
                      ) : (
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
                              : "Order now"}{" "}
                            :{"  "}
                          </span>
                          <span className="tf-qty-price">
                            {"   "}₹{(product.offer * quantity).toFixed(2)}
                          </span>
                        </a>
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
          isAddedToCartProducts={isAddedToCartProducts}
          openUploadModal={() => uploadModal.current.click()}
          setItemsTocart={setItemToCart}
          quantity={quantity}
          setQuantity={setQuantity}
        />
      </div>
      <a
        href="#super_kidbag"
        ref={uploadModalRef}
        data-bs-toggle="modal"
        style={{ display: "none" }}
      >
        {" "}
      </a>
    </section>
  );
}
