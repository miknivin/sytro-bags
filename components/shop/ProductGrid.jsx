"use client";
import React, { useState, useEffect, useRef } from "react";
import { ProductCard } from "../shopCards/ProductCard";
import { useGetProductsQuery } from "@/redux/api/productsApi";
import { categories } from "../homes/home-4/Products";
import { isAppleTouchDevice } from "@/utlis/isAppleTouchDevice";

export default function ProductGrid({ gridItems = 4, id }) {
  const [page, setPage] = useState(1);
  const [allProducts, setAllProducts] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const loaderRef = useRef(null);
  const [isAppleTouch, setIsAppleTouch] = useState(false);

  // Decode the id to handle URL-encoded spaces (e.g., Kids%20Bags -> Kids Bags)
  const decodedId = id ? decodeURIComponent(id) : null;

  // Validate the decoded id against categories; fallback to "Kids Bags" if invalid
  const category =
    decodedId && categories.includes(decodedId) ? decodedId : "Kids Bags";

  const { data, isLoading, isError, error, isFetching } = useGetProductsQuery({
    page,
    resPerPage: 8,
    category,
  });

  useEffect(() => {
    setIsAppleTouch(isAppleTouchDevice());
  }, []);

  // Append new products when data changes
  useEffect(() => {
    if (data?.filteredProducts) {
      setAllProducts((prev) => [...prev, ...data.filteredProducts]);
      setHasMore(data.filteredProducts.length === 8); // Check if there’s more to load
    }
  }, [data]);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    if (isAppleTouch) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isFetching) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 0.1 }
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => {
      if (loaderRef.current) {
        observer.unobserve(loaderRef.current);
      }
    };
  }, [hasMore, isFetching, isAppleTouch]);

  // Handle Load More button click
  const handleLoadMore = () => {
    if (hasMore && !isFetching) {
      setPage((prev) => prev + 1);
    }
  };

  // Show invalid category message if id is provided but not in categories
  if (decodedId && !categories.includes(decodedId)) {
    return (
      <div style={{ textAlign: "center", padding: "20px", color: "red" }}>
        Invalid category: {decodedId.replace(/_/g, " ")}. Showing products for{" "}
        {category.replace(/_/g, " ")} instead.
      </div>
    );
  }

  if (isLoading && page === 1) {
    return (
      <div className="d-flex justify-content-center">
        <div className="spinner-border text-warning" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div style={{ textAlign: "center", padding: "20px", color: "red" }}>
        Error loading products: {error?.message || "Something went wrong"}
      </div>
    );
  }

  if (allProducts.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "20px", color: "#333" }}>
        No products found.
      </div>
    );
  }

  return (
    <>
      {/* <div
        style={{
          width: "fit-content",
          margin: "0 auto",
          fontSize: "17px",
          marginBottom: "24px",
        }}
      >
        {allProducts.length} product(s) found in {category.replace(/_/g, " ")}
      </div> */}
      <div className="grid-layout wrapper-shop" data-grid={`grid-${gridItems}`}>
        {allProducts.map((elm, i) => (
          <ProductCard product={elm} key={i} />
        ))}
      </div>
      {hasMore && (
        <div ref={loaderRef} style={{ textAlign: "center", padding: "20px" }}>
          {isFetching ? (
            "Loading..."
          ) : (
            <button
              onClick={handleLoadMore}
              className="tf-btn btn-fill justify-content-center fw-6 fs-16 flex-grow-1 animate-hover-btn"
            >
              Load More
            </button>
          )}
        </div>
      )}
    </>
  );
}
