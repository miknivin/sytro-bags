"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useGetProductsQuery } from "@/redux/api/productsApi";

const categoriesWithDetails = [
  {
    name: "Kids bags",
    image:
      "https://ik.imagekit.io/c1jhxlxiy/gym%20duffle%20bags.webp?updatedAt=1752562395881",
    url: "/shop-collection-sub",
  },
  {
    name: "Gym Duffle Bag",
    image:
      "https://ik.imagekit.io/c1jhxlxiy/gym%20duffle%20bags.webp?updatedAt=1752562395881",
    url: "/shop-collection-sub/gym_duffle_bag",
  },
  {
    name: "Mens Sling Bag",
    image:
      "https://ik.imagekit.io/c1jhxlxiy/mens%20sling%20bag.webp?updatedAt=1752562348385",
    url: "/shop-collection-sub/mens_sling_bag",
  },
  {
    name: "Womens Tote Bag",
    image:
      "https://ik.imagekit.io/c1jhxlxiy/800X800-04.webp?updatedAt=1752652610373",
    url: "/shop-collection-sub/tote_bag",
  },
  {
    name: "Laptop Backpack",
    image:
      "https://ik.imagekit.io/c1jhxlxiy/laptop%20bags.webp?updatedAt=1752562560331",
    url: "/shop-collection-sub/laptop_backpack",
  },
  {
    name: "Womens Backpack",
    image:
      "https://ik.imagekit.io/c1jhxlxiy/women%20backpacks.webp?updatedAt=1752562477210",
    url: "/shop-collection-sub/ladies_backpack",
  },
];

export default function SearchModal() {
  const [searchTerm, setSearchTerm] = useState("");
  const { data, isLoading, error } = useGetProductsQuery({
    keyword: searchTerm,
    page: 1,
  });
  const products = data?.filteredProducts || [];

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div className="offcanvas offcanvas-end canvas-search" id="canvasSearch">
      <div className="canvas-wrapper">
        <header className="tf-search-head">
          <div className="title fw-5">
            Search our site
            <div className="close">
              <span
                className="icon-close icon-close-popup"
                data-bs-dismiss="offcanvas"
                aria-label="Close"
              />
            </div>
          </div>
          <div className="tf-search-sticky">
            <form onSubmit={handleSearchSubmit} className="tf-mini-search-frm">
              <fieldset className="text">
                <input
                  type="text"
                  placeholder="Search"
                  className=""
                  name="text"
                  tabIndex={0}
                  value={searchTerm}
                  onChange={handleSearchChange}
                  aria-required="true"
                  required
                />
              </fieldset>
              <button className="" type="submit">
                <i className="icon-search" />
              </button>
            </form>
          </div>
        </header>
        <div className="canvas-body p-0">
          <div className="tf-search-content">
            <div className="tf-cart-hide-has-results">
              <div className="tf-col-quicklink">
                <div className="tf-search-content-title fw-5">Quick link</div>
                <div  className="d-flex flex-wrap gap-2">
                  {categoriesWithDetails.map((category) => (
                    <Link
                      key={category.name}
                      href={category.url}
                      className="badge bg-light text-dark px-3 py-2 rounded-pill"
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>
              </div>
              <div className="tf-col-content">
                {!searchTerm && (
                  <div className="tf-search-content-title fw-5">
                    Need some inspiration?
                  </div>
                )}
                <div className="tf-search-hidden-inner">
                  {isLoading ? (
                    <div className="spinner-border text-warning" role="status">
                      <span>Loading...</span>
                    </div>
                  ) : error ? (
                    <p>Error loading products</p>
                  ) : products.length > 0 ? (
                    products.map((product) => (
                      <div className="tf-loop-item" key={product._id}>
                        <div className="image">
                          <Link href={
                              product?.category && product.category !== "Kids Bags"
                                ? `/product-no-zoom/${product._id}`
                                : `/product-detail/${product._id}`
                            }>
                            <Image
                              alt={product.name}
                              src={
                                product.images[0]?.url || "/default-image.jpg"
                              }
                              width={100}
                              height={100}
                            />
                          </Link>
                        </div>
                        <div className="content">
                          <Link href={
                              product?.category && product.category !== "Kids Bags"
                                ? `/product-no-zoom/${product._id}`
                                : `/product-detail/${product._id}`
                            }>
                            {product.name}
                          </Link>
                          <div className="tf-product-info-price">
                            {product.offer ? (
                              <>
                                <div className="compare-at-price">
                                  ₹{product?.actualPrice?.toFixed(2)}
                                </div>
                                <div className="price-on-sale fw-6">
                                  ₹{product?.offer?.toFixed(2)}
                                </div>
                              </>
                            ) : (
                              <div className="price fw-6">
                                ₹{product?.actualPrice?.toFixed(2)}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p>No products found</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
