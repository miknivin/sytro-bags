"use client";
import { options } from "@/data/singleProductOptions";
import Image from "next/image";
import React from "react";
import Quantity from "./Quantity";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { openCartModal } from "@/utlis/openCartModal";
export default function StickyItem({
  soldOut = false,
  product,
  isAddedToCartProducts,
  setItemsTocart,
  openUploadModal,
  setQuantity,
  quantity,
}) {
  const uploadedImages = useSelector((state) => state.cart.uploadedImages);
  const hasCustomDesign = uploadedImages?.[product._id];
  // const { addProductToCart, isAddedToCartProducts } = useContextElement();
  return (
    <div className="tf-sticky-btn-atc">
      <div className="container">
        <div className="tf-height-observer w-100 d-flex align-items-center">
          <div className="tf-sticky-atc-product d-flex align-items-center">
            <div className="tf-sticky-atc-img">
              <Image
                className="lazyloaded"
                data-src={product.images[1].url}
                alt="image"
                src={product.images[1].url}
                width={770}
                height={1075}
              />
            </div>
            <div className="tf-sticky-atc-title fw-5 d-xl-block d-none">
              {product.name}
            </div>
          </div>
          <div className="tf-sticky-atc-infos">
            <form onSubmit={(e) => e.preventDefault()} className="">
              <div className="tf-sticky-atc-variant-price text-center"></div>
              <div className="tf-sticky-atc-btns">
                <div className="tf-product-info-quantity">
                  <Quantity quantity={quantity} setQuantity={setQuantity} />
                </div>
                {product.stocks <= 0 ? (
                  <a className="tf-btn btns-sold-out cursor-not-allowed btn-fill radius-3 justify-content-center fw-6 fs-14 flex-grow-1 animate-hover-btn ">
                    <span>Sold out</span>
                  </a>
                ) : (
                  <a
                    onClick={() => {
                      if (!hasCustomDesign) {
                        openUploadModal()
                        toast.error("You need to upload the image");
                        return;
                      }
                      openCartModal();
                      setItemsTocart();
                    }}
                    className="tf-btn btn-fill radius-3 justify-content-center fw-6 fs-14 flex-grow-1 animate-hover-btn"
                  >
                    <span>
                      {isAddedToCartProducts(product._id)
                        ? "Already Added"
                        : "Add to cart"}
                    </span>
                  </a>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
