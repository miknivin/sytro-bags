"use client";
import { memo } from "react";
import Image from "next/image";
import Link from "next/link";

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

function Productcard4({ product }) {
  const isOutOfStock = Number(product?.stock ?? product?.stocks ?? 0) <= 0;

  const primaryImage =
    replaceS3WithCloudFront(product?.images?.[0]?.url) || "/fallback.png";

  return (
    <div className="card-product style-4 single-image-hover fl-item p-2 border"
      style={{ borderRadius: '10px' }} key={product._id}>
      <div className="card-product-wrapper">
        {isOutOfStock && (
          <div className="on-sale-wrap text-end">
            <div className="on-sale-item" style={{ backgroundColor: "#dc2626" }}>
              Out of stock
            </div>
          </div>
        )}
        {product.images && product.images.length > 0 && (
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
              data-src={primaryImage}
              src={primaryImage}
              alt="image-product"
              width="720"
              height="1005"
              loading="lazy"
              sizes="(max-width: 767px) 50vw, (max-width: 1199px) 33vw, 25vw"
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
        {/* {product.sizes && (
          <div className="size-list">
            {product.sizes.map((size) => (
              <span key={size}>{size}</span>
            ))}
          </div>
        )} */}
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
        {product.category === "custom_sling_bag" && !isOutOfStock && (
          <div className="limited-orders-tag">
            <span className="limited-orders-text">Only Limited Orders Daily</span>
          </div>
        )}
        {/* Limited Orders Tag for Kids Bags */}
        {product.category === "Kids Bags" && !isOutOfStock && (
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
          <div className="price kids-bag-price d-flex flex-column">
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

export default memo(Productcard4);
