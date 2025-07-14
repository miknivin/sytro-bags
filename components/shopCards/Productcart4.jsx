"use client";
import { useEffect, useState } from "react";
import React from "react";
import { useContextElement } from "@/context/Context";
import Image from "next/image";
import Link from "next/link";
import CountdownComponent from "../common/Countdown";

export const replaceS3WithCloudFront = (url) => {
  if (!url) return url;
  const s3Pattern = /^https:\/\/kids-bags\.s3\.eu-north-1\.amazonaws\.com/;
  const cloudFrontDomain =
    process.env.NEXT_PUBLIC_CLOUDFRONT_DOMAIN ||
    "https://d229x2i5qj11ya.cloudfront.net";

  let newUrl = url.replace(s3Pattern, cloudFrontDomain);

  const domainEndIndex = newUrl.indexOf("/", 8); // Start after 'https://'
  if (domainEndIndex !== -1) {
    const protocolAndDomain = newUrl.slice(0, domainEndIndex);
    const path = newUrl.slice(domainEndIndex).replace(/\/+/, "/");
    newUrl = protocolAndDomain + path;
  }

  return newUrl;
};

export default function Productcard4({ product }) {
  const [currentImage, setCurrentImage] = useState(product.imgSrc);

  useEffect(() => {
    setCurrentImage(product.imgSrc);
  }, [product]);

  return (
    <div className="card-product style-4 fl-item p-2 border" key={product._id}>
      <div className="card-product-wrapper">
        {product.images && product.images.length > 1 && (
          <Link
            href={
              product.category !== "Kids Bags"
                ? `/product-no-zoom/${product._id}`
                : `/product-detail/${product._id}`
            }
            className="product-img"
          >
            <Image
              className="lazyload img-product bg-light"
              data-src={
                replaceS3WithCloudFront(product.images[0].url) ||
                "/fallback.png"
              }
              src={
                replaceS3WithCloudFront(product.images[0].url) ||
                "/fallback.png"
              }
              alt="image-product"
              width="720"
              height="1005"
            />
            <Image
              className="lazyload img-hover"
              data-src={
                replaceS3WithCloudFront(product.images[0].url) ||
                "/fallback.png"
              }
              src={
                replaceS3WithCloudFront(product.images[0].url) ||
                "/fallback.png"
              }
              alt="image-product"
              width="720"
              height="1005"
            />
          </Link>
        )}

        <div className="list-product-btn column-right">
          {/* <a
            onClick={() => addToWishlist(product._id)}
            className="box-icon bg_white wishlist btn-icon-action round"
          >
            <span
              className={`icon icon-heart ${
                isAddedtoWishlist(product._id) ? "added" : ""
              }`}
            ></span>
            <span className="tooltip">
              {isAddedtoWishlist(product.id)
                ? "Already Wishlisted"
                : "Add to Wishlist"}
            </span>
            <span className="icon icon-delete"></span>
          </a> */}
          {/* <a
            href="#compare"
            onClick={() => addToCompareItem(product._id)}
            data-bs-toggle="offcanvas"
            aria-controls="offcanvasLeft"
            className="box-icon bg_white compare btn-icon-action round"
          >
            <span
              className={`icon icon-compare ${
                isAddedtoCompareItem(product._id) ? "added" : ""
              }`}
            ></span>
            <span className="tooltip">
              {" "}
              {isAddedtoCompareItem(product._id)
                ? "Already Compared"
                : "Add to Compare"}
            </span>
            <span className="icon icon-check"></span>
          </a> */}
          <Link
            href={
              product.category !== "Kids Bags"
                ? `/product-no-zoom/${product._id}`
                : `/product-detail/${product._id}`
            }
            // data-bs-toggle="modal"
            className="box-icon bg_white quickview tf-btn-loading round"
          >
            <span className="icon icon-view"></span>
            <span className="tooltip">Quick View</span>
          </Link>
        </div>
        {product.sizes && (
          <div className="size-list">
            {product.sizes.map((size) => (
              <span key={size}>{size}</span>
            ))}
          </div>
        )}
        {/* <a
          href="#quick_add"
          onClick={() => setQuickAddItem(product._id)}
          data-bs-toggle="modal"
          className="btn-quick-add quick-add"
        >
          Add to cart
        </a> */}

        {/* {product.discount && (
          <div className="on-sale-wrap text-end">
            <div className="on-sale-item">{product.discount}</div>
          </div>
        )} */}
        {/* {product.countdown && (
          <div className="countdown-box">
            <div className="js-countdown">
              <CountdownComponent labels={product.countdown.labels} />
            </div>
          </div>
        )} */}
      </div>
      <div className="card-product-info">
        <Link
          href={
            product.category !== "Kids Bags"
              ? `/product-no-zoom/${product._id}`
              : `/product-detail/${product._id}`
          }
          className="title link"
        >
          {product.name}
        </Link>
        <span className="price d-flex gap-1">
          ₹{product.offer.toFixed(2)}
          {product.offer < product.actualPrice && (
            <del style={{ fontSize: "12px" }} className="text-danger">
              ₹{product.actualPrice}
            </del>
          )}
        </span>
        {/* {product.colors && (
          <ul className="list-color-product">
            {product.colors.map((color) => (
              <li
                className={`list-color-item color-swatch ${
                  currentImage == color.imgSrc ? "active" : ""
                } `}
                onMouseOver={() => setCurrentImage(color.imgSrc)}
                key={color.name}
              >
                <span className="tooltip">{color.name}</span>
                <span className={`swatch-value ${color.colorClass}`} />
                <Image
                  className="lazyload"
                  data-src={color.imgSrc}
                  src={color.imgSrc}
                  alt="image-product"
                  width={720}
                  height={1005}
                />
              </li>
            ))}
          </ul>
        )} */}
      </div>
    </div>
  );
}
