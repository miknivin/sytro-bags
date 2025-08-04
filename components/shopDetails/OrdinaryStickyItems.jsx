"use client";
import Image from "next/image";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { openCartModal } from "@/utlis/openCartModal";
import Quantity from "./Quantity";
import { setCartItem } from "@/redux/features/cartSlice";

export default function OrdinaryStickyItem({
  soldOut = false,
  product,
  isAddedToCartProducts,
  setQuantity,
  quantity,
  customNameToPrint,
  triggerAlert,
}) {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.cartItems);

  const handleAddToCart = () => {
    if (product.category === "custom_sling_bag" && !customNameToPrint.trim()) {
      triggerAlert();
      return;
    }

    if (isAddedToCartProducts(product._id)) {
      toast.success("Item already in cart!");
      openCartModal();
      return;
    }

    const cartItem = {
      product: product._id,
      name: product.name,
      category: product.category, // Use product.category instead of product.name
      price: product.offer,
      quantity: quantity,
      image: product.images[0]?.url || "/images/placeholder.jpg",
      ...(product.category === "Kids Bags" ? { uploadedImage: [] } : {}),
      ...(product.category === "custom_sling_bag" && customNameToPrint
        ? { customNameToPrint: customNameToPrint }
        : {}),
    };

    dispatch(setCartItem(cartItem));
    toast.success("Item added to cart!");
    openCartModal();
  };

  return (
    <>
      <div className="tf-sticky-btn-atc">
        <div className="container">
          <div className="tf-height-observer w-100 d-flex align-items-center">
            <div className="tf-sticky-atc-product d-flex align-items-center">
              <div className="tf-sticky-atc-img">
                <Image
                  className="lazyloaded"
                  data-src={product.images[0]?.url || "/images/placeholder.jpg"}
                  alt="image"
                  src={product.images[0]?.url || "/images/placeholder.jpg"}
                  width={770}
                  height={1075}
                  onError={(e) => {
                    e.target.src = "/images/placeholder.jpg";
                  }}
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
                  {product.category !== "custom_sling_bag" && (
                    <div className="tf-product-info-quantity">
                      <Quantity quantity={quantity} setQuantity={setQuantity} />
                    </div>
                  )}
                  {product.stocks <= 0 ? (
                    <a className="tf-btn btns-sold-out cursor-not-allowed btn-fill radius-3 justify-content-center fw-6 fs-14 flex-grow-1 animate-hover-btn">
                      <span>Sold out</span>
                    </a>
                  ) : (
                    <a
                      onClick={handleAddToCart}
                      className="tf-btn btn-fill justify-content-center fw-6 fs-16 flex-grow-1 animate-hover-btn"
                    >
                      <span>
                        {isAddedToCartProducts(product._id)
                          ? "Already Added"
                          : "Order now"}
                      </span>
                    </a>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
