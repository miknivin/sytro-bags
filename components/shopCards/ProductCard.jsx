"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useContextElement } from "@/context/Context";
import { setSingleProductForQuickAdd } from "@/redux/features/productSlice";
import { useDispatch } from "react-redux";

// Utility function to replace S3 URL with CloudFront URL
const getCloudFrontUrl = (s3Url) => {
  const cloudFrontDomain =
    process.env.NEXT_PUBLIC_CLOUDFRONT_DOMAIN ||
    "https://d229x2i5qj11ya.cloudfront.net";
  if (!s3Url) return s3Url; // Return original if undefined or null
  return s3Url.replace(/https:\/\/[^/]+/, cloudFrontDomain);
};

export const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const [currentImage, setCurrentImage] = useState(
    getCloudFrontUrl(product?.images[0]?.url)
  );
  const { setQuickViewItem } = useContextElement();
  const {
    setQuickAddItem,
    addToWishlist,
    isAddedtoWishlist,
    addToCompareItem,
    isAddedtoCompareItem,
  } = useContextElement();

  useEffect(() => {
    setCurrentImage(getCloudFrontUrl(product?.images[0]?.url));
  }, [product]);

  return (
    <div className="card-product fl-item" key={product._id}>
      <div className="card-product-wrapper">
        <Link
          href={
            product.category !== "Kids Bags"
              ? `/product-no-zoom/${product._id}`
              : `/product-detail/${product._id}`
          }
          className="product-img"
        >
          <Image
            className="lazyload img-product"
            data-src={getCloudFrontUrl(product?.images[0]?.url)}
            src={currentImage}
            alt="image-product"
            width={720}
            height={1005}
          />
          <Image
            className="lazyload img-hover"
            data-src={getCloudFrontUrl(
              product?.images[1]?.url
                ? product?.images[1]?.url
                : product?.images[0]?.url
            )}
            src={getCloudFrontUrl(
              product?.images[1]?.url
                ? product?.images[1]?.url
                : product?.images[0]?.url
            )}
            alt="image-product"
            width={720}
            height={1005}
          />
        </Link>
        <div className="list-product-btn">
          {/* <button
            href="#quick_add"
            aria-disabled
            disabled
            onClick={() => {
              setQuickAddItem(product._id);
              dispatch(setSingleProductForQuickAdd(product));
            }}
            data-bs-toggle="modal"
            className="box-icon bg_white quick-add tf-btn-loading"
          >
            <span className="icon icon-bag" />
            <span className="tooltip">Quick Add</span>
          </button> */}
          {/* <a
            onClick={() => addToWishlist(product.id)}
            className="box-icon bg_white wishlist btn-icon-action"
          >
            <span
              className={`icon icon-heart ${
                isAddedtoWishlist(product.id) ? "added" : ""
              }`}
            />
            <span className="tooltip">
              {isAddedtoWishlist(product.id)
                ? "Already Wishlisted"
                : "Add to Wishlist"}
            </span>
            <span className="icon icon-delete" />
          </a> */}
          {/* <a
            href="#compare"
            data-bs-toggle="offcanvas"
            aria-controls="offcanvasLeft"
            onClick={() => addToCompareItem(product.id)}
            className="box-icon bg_white compare btn-icon-action"
          >
            <span
              className={`icon icon-compare ${
                isAddedtoCompareItem(product.id) ? "added" : ""
              }`}
            />
            <span className="tooltip">
              {" "}
              {isAddedtoCompareItem(product.id)
                ? "Already Compared"
                : "Add to Compare"}
            </span>
            <span className="icon icon-check" />
          </a> */}
          <Link
            href={
              product.category !== "Kids Bags"
                ? `/product-no-zoom/${product._id}`
                : `/product-detail/${product._id}`
            }
            className="box-icon bg_white quickview tf-btn-loading"
          >
            <span className="icon icon-view" />
            {/* <span className="tooltip">Quick View</span> */}
          </Link>
        </div>
        {/* {product.countdown && (
          <div className="countdown-box">
            <div className="js-countdown">
              <CountdownComponent />
            </div>
          </div>
        )}
        {product.sizes && (
          <div className="size-list">
            {product.sizes.map((size) => (
              <span key={size}>{size}</span>
            ))}
          </div>
        )} */}
        {/* Limited Orders Tag for Custom Sling Bags */}
        {product.category === "custom_sling_bag" && (
          <div className="limited-orders-tag">
            <span className="limited-orders-text">Only Limited Orders Daily</span>
          </div>
        )}
        {/* Limited Orders Tag for Kids Bags */}
        {product.category === "Kids Bags" && (
          <div className="limited-orders-tag">
            <span className="limited-orders-text">Only Limited Orders Daily</span>
          </div>
        )}
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
        {product.category === "Kids Bags" && (
          <p className="product-note">
            Personalised Bags With Kid Photo and Name
          </p>
        )}
        {product.category === "custom_sling_bag" && (
          <p className="product-note">
            Premium quality custom design with durable materials
          </p>
        )}
        {product.actualPrice && product.offer && (
          <div className="price product-card-price d-flex flex-column">
            <div className="d-flex align-items-center gap-1">
              <span className="offer-price">
                ₹{product.offer.toFixed(2)}
              </span>
              {product.offer < product.actualPrice && (
                <>
                  <del className="original-price">
                    ₹{product.actualPrice}
                  </del>
                  <span className="discount-percentage">
                    {Math.round(((product.actualPrice - product.offer) / product.actualPrice) * 100)}% OFF
                  </span>
                </>
              )}
            </div>
          </div>
        )}

        {/* {product.colors && (
          <ul className="list-color-product">
            {product.colors.map((color) => (
              <li
                className={`list-color-item color-swatch ${
                  currentImage == getCloudFrontUrl(color.imgSrc) ? "active" : ""
                } `}
                key={color.name}
                onMouseOver={() => setCurrentImage(getCloudFrontUrl(color.imgSrc))}
              >
                <span className="tooltip">{color.name}</span>
                <span className={`swatch-value ${color.colorClass}`} />
                <Image
                  className="lazyload"
                  data-src={getCloudFrontUrl(color.imgSrc)}
                  src={getCloudFrontUrl(color.imgSrc)}
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
};
