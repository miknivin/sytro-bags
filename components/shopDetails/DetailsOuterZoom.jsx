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

export default function DetailsOuterZoom({ product }) {
  //const kidsBagId = "67a70ca93f464380b64b05a6";
  const [currentColor, setCurrentColor] = useState(colors[0]);
  const router = useRouter();
  const uploadModalRef = useRef(null);
  const handleColor = () => {};
  const cartItems = useSelector((state) => state.cart.cartItems);
  const [currentSize, setCurrentSize] = useState("Small");
  const selectedDesigns = useSelector((state) => state.cart.selectedDesigns);
  const uploadedImages = useSelector((state) => state.cart.uploadedImages);
  const [quantity, setQuantity] = useState(
    uploadedImages?.[product._id]?.length || 1
  );
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

  const handleQuantityChange = (newQuantity) => {
    // console.log(newQuantity, "newQuantity");
    if (newQuantity < 1) {
      setQuantity(1);
      return;
    }
    const currentImageCount = uploadedImages?.[product._id]?.length || 0;
    //console.log(currentImageCount, "currentImageCount");
    if (newQuantity < currentImageCount) {
      const imagesToKeep = uploadedImages[product._id].slice(0, newQuantity);
      dispatch(
        setUploadedImage({
          productId: product._id,
          uploadedImage: imagesToKeep,
        })
      );
      setQuantity(newQuantity);
    } else if (newQuantity > currentImageCount) {
      const currentPath = window.location.pathname;
      const query = new URLSearchParams({
        isUploadImage: "proceeding",
        quantity: (
          newQuantity - (uploadedImages?.[product._id]?.length || 0)
        ).toString(),
      }).toString();
      router.push(`${currentPath}?${query}`, { scroll: false });
      uploadModalRef.current?.click();
    } else {
      setQuantity(newQuantity);
    }
  };

  useEffect(() => {
    setQuantity(uploadedImages?.[product._id]?.length || 1);
  }, [uploadedImages, product._id]);

  useEffect(() => {
    // console.log(quantityChange);
    const currentImageCount = uploadedImages?.[product._id]?.length || 0;

    if (quantityChange.isIncreasing && quantity > currentImageCount) {
      const imagesToUploadCount = quantity - currentImageCount;
      const currentPath = window.location.pathname;
      const query = new URLSearchParams({
        isUploadImage: "proceeding",
        quantity: imagesToUploadCount.toString(),
      }).toString();
      router.push(`${currentPath}?${query}`, { scroll: false });
      const isProductInCart = cartItems.some(
        (item) => item.product === product._id
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
          })
        );
      }
    }
  }, [quantityChange, product._id, router]);
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
                  <div className="tf-product-info-price flex align-items-center mb-3">
                    <div style={{ fontWeight: 600 }} className="price-on-sale">
                      ₹{product?.offer?.toFixed(2)}
                    </div>
                    <div>
                      <span className=" fs-4 text-danger">
                        {/* {(
                          (1 - product.offer / product.actualPrice) *
                          100
                        ).toFixed(2)} */}
                        <s>₹{product?.actualPrice?.toFixed(2) || 3000}</s>
                      </span>
                    </div>
                  </div>
                  <div className="tf-product-info-variant-picker mb-0">
                    <div className="variant-picker-item"></div>
                    {product.category === "Kids Bags" && (
                      <div className="variant-picker-item mb-3">
                        <div
                          style={{ gap: "15px" }}
                          className="d-flex justify-content-between align-items-center"
                        >
                          {hasCustomDesign ? (
                            <div className="d-flex gap-2 flex-column">
                              <div className="d-flex gap-2 flex-wrap">
                                {uploadedImages[product?._id]?.map(
                                  (image, index) => (
                                    <div
                                      key={index}
                                      style={{
                                        width: "fit-content",
                                        maxWidth: "130px",
                                      }}
                                      className="position-relative border border-black rounded-2 d-flex flex-column"
                                    >
                                      <button
                                        onClick={() =>
                                          dispatch(
                                            removeUploadedImage({
                                              productId: product._id,
                                              imageIndex: index,
                                            })
                                          )
                                        }
                                        className="remove-button badge"
                                      >
                                        X
                                      </button>
                                      <img
                                        src={image}
                                        alt={`Uploaded Image ${index + 1}`}
                                        style={{
                                          width: "125px",
                                          height: "125px",
                                          objectFit: "contain",
                                          borderRadius: "5px",
                                        }}
                                      />
                                      <small
                                        title={image.split("/").pop()}
                                        className="line-clamp px-1"
                                      >
                                        {image.split("/").pop()}
                                      </small>
                                    </div>
                                  )
                                )}
                              </div>
                            </div>
                          ) : (
                            <>
                              <div class="row">
                                <div class="col-12">
                                  <ul class="list-unstyled">
                                    {[...(product?.details?.features || [])]
                                      .reverse()
                                      .map((feature, index) => (
                                        <li className="mb-2" key={index}>
                                          <div className="row align-items-center">
                                            <div
                                              className="col-auto"
                                              style={{
                                                color: "var(--primary)",
                                              }}
                                            >
                                              <FontAwesomeIcon
                                                icon={faCircleCheck}
                                              />
                                            </div>
                                            <div className="col px-0">
                                              {feature}
                                            </div>
                                          </div>
                                        </li>
                                      ))}
                                  </ul>
                                </div>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="tf-product-info-quantity">
                    <div className="quantity-title fw-6">Quantity</div>
                    <Quantity
                      setQuantity={setQuantity}
                      quantity={quantity}
                      // handleQuantityChange={handleQuantityChange}
                      imagesLength={uploadedImages?.[product._id]?.length || 0}
                    />
                  </div>
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
                                : "Add to cart"}{" "}
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
                              : "Add to cart"}{" "}
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
                  <>
                    <DetailsStatic />
                  </>
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
