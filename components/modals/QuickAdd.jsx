"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Quantity from "../shopDetails/Quantity";
import { useContextElement } from "@/context/Context";

import { allProducts } from "@/data/products";
import { colors, sizeOptions } from "@/data/singleProductOptions";
import { useSelector } from "react-redux";
export default function QuickAdd() {
  const {
    quickAddItem,
    addProductToCart,
    isAddedToCartProducts,
    addToCompareItem,
    isAddedtoCompareItem,
  } = useContextElement();

  const selectedProduct = useSelector((state) => state.product.singleProduct);

  const [item, setItem] = useState({});

  useEffect(() => {
    setItem(selectedProduct || {});
   // console.log(item)
  }, [selectedProduct]);

  const [currentColor, setCurrentColor] = useState(null);
  const [currentSize, setCurrentSize] = useState(null);

  useEffect(() => {
    if (selectedProduct) {
      setCurrentColor(selectedProduct?.colors?.[0] || null);
      setCurrentSize(selectedProduct?.sizeOptions?.[0] || null);
    }
  }, [selectedProduct]);
  if (!item || Object.keys(item).length === 0) return null;
  return (
    <div className="modal fade modalDemo" id="quick_add">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="header">
            <span
              className="icon-close icon-close-popup"
              data-bs-dismiss="modal"
            />
          </div>
          <div className="wrap">
            <div className="tf-product-info-item">
              <div className="image">
                <Image
                  alt="image"
                  style={{ objectFit: "contain" }}
                  src={item?.images[0]?.url}
                  width={720}
                  height={1005}
                />
              </div>
              <div className="content">
                <Link href={`/product-detail/${item._id}`}>{item.title}</Link>
                <div className="tf-product-info-price">
                  <div className="price">${item.offer.toFixed(2)}</div>
                </div>
              </div>
            </div>
            {/* <div className="tf-product-info-variant-picker mb_15">
              <div className="variant-picker-item">
                <div className="variant-picker-label">
                  Color:
                  <span className="fw-6 variant-picker-label-value">
                    {currentColor.value}
                  </span>
                </div>
                <form className="variant-picker-values">
                  {colors.map((color) => (
                    <React.Fragment key={color.id}>
                      <input
                        type="radio"
                        name="color1"
                        readOnly
                        checked={currentColor == color}
                      />
                      <label
                        onClick={() => setCurrentColor(color)}
                        className="hover-tooltip radius-60"
                        data-value={color.value}
                      >
                        <span className={`btn-checkbox ${color.className}`} />
                        <span className="tooltip">{color.value}</span>
                      </label>
                    </React.Fragment>
                  ))}
                </form>
              </div>
              <div className="variant-picker-item">
                <div className="variant-picker-label">
                  Size:{" "}
                  <span className="fw-6 variant-picker-label-value">
                    {" "}
                    {currentSize.value}
                  </span>
                </div>
                <form className="variant-picker-values">
                  {sizeOptions.map((size) => (
                    <React.Fragment key={size.id}>
                      <input
                        type="radio"
                        name="size1"
                        readOnly
                        checked={currentSize == size}
                      />
                      <label
                        onClick={() => setCurrentSize(size)}
                        className="style-text"
                        data-value={size.value}
                      >
                        <p>{size.value}</p>
                      </label>
                    </React.Fragment>
                  ))}
                </form>
              </div>
            </div> */}
            <div className="tf-product-info-quantity mb_15">
              <div className="quantity-title fw-6">Quantity</div>
              <Quantity />
            </div>
            <div className="tf-product-info-buy-button">
              <form onSubmit={(e) => e.preventDefault()} className="">
                <a
                  className="tf-btn btn-fill justify-content-center fw-6 fs-16 flex-grow-1 animate-hover-btn"
                  onClick={() => addProductToCart(item.id)}
                >
                  <span>
                    {isAddedToCartProducts(item.id)
                      ? "Already Added - "
                      : "Add to cart - "}
                  </span>
                  <span className="tf-qty-price">${item.offer.toFixed(2)}</span>
                </a>
                <div className="tf-product-btn-wishlist btn-icon-action">
                  <i className="icon-heart" />
                  <i className="icon-delete" />
                </div>
                <a
                  href="#compare"
                  data-bs-toggle="offcanvas"
                  aria-controls="offcanvasLeft"
                  onClick={() => addToCompareItem(item.id)}
                  className="tf-product-btn-wishlist box-icon bg_white compare btn-icon-action"
                >
                  <span className="icon icon-compare" />
                  <span className="icon icon-check" />
                </a>
                <div className="w-100">
                  <button className="btns-full" disabled>
                    Buy with
                    <Image
                      alt="image"
                      src="/images/payments/paypal.png"
                      width={64}
                      height={18}
                    />
                  </button>
                  {/* <a href="#" className="payment-more-option">
                    More payment options
                  </a> */}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
