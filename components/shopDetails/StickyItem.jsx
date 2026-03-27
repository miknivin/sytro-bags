"use client";

import Image from "next/image";
import React from "react";

export default function StickyItem({
  soldOut = false,
  product,
  onOrderNow,
}) {
  return (
    <div className="tf-sticky-btn-atc">
      <div className="container">
        <div className="tf-height-observer w-100 d-flex align-items-center">
          <div className="tf-sticky-atc-product d-flex align-items-center">
            <div className="tf-sticky-atc-img">
              <Image
                className="lazyloaded"
                data-src={product.images[0].url}
                alt="image"
                src={product.images[0].url}
                width={770}
                height={1075}
              />
            </div>
            <div className="tf-sticky-atc-title fw-5 d-xl-block d-none">
              {product.name}
            </div>
          </div>
          <div className="tf-sticky-atc-infos">
            <form onSubmit={(event) => event.preventDefault()} className="">
              <div className="tf-sticky-atc-variant-price text-center"></div>
              <div className="tf-sticky-atc-btns">
                {soldOut ? (
                  <button
                    type="button"
                    className="tf-btn btns-sold-out cursor-not-allowed btn-fill radius-3 justify-content-center fw-6 fs-14 flex-grow-1 animate-hover-btn border-0"
                  >
                    <span>Sold out</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={onOrderNow}
                    className="tf-btn btn-fill justify-content-center fw-6 fs-16 flex-grow-1 animate-hover-btn border-0"
                  >
                    <span>Order now</span>
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
