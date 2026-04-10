"use client";
import React, { useEffect, useState } from "react";
import { ProductCard } from "../shopCards/ProductCard";
import { useGetProductsQuery } from "@/redux/api/productsApi";
import { categories } from "../homes/home-4/Products";
import { useDispatch, useSelector } from "react-redux";
import { setGridProducts, setGridPage, setGridCategory } from "@/redux/features/productSlice";

export default function ProductGrid({ gridItems = 4, id }) {
  const dispatch = useDispatch();
  const reduxGrid = useSelector((state) => state.product);

  const decodedId = id ? decodeURIComponent(id) : null;
  const category = decodedId && categories.includes(decodedId) ? decodedId : "Kids Bags";

  // Initialize from Redux only if it's the same category
  const isSameCategory = reduxGrid.gridCategory === category;
  
  const [page, setPage] = useState(isSameCategory ? reduxGrid.gridPage : 1);
  const [allProducts, setAllProducts] = useState(isSameCategory ? reduxGrid.gridItems : []);
  const [hasMore, setHasMore] = useState(true);

  // Sync back to Redux
  useEffect(() => {
    dispatch(setGridProducts(allProducts));
  }, [allProducts, dispatch]);

  useEffect(() => {
    dispatch(setGridPage(page));
  }, [page, dispatch]);

  useEffect(() => {
    dispatch(setGridCategory(category));
  }, [category, dispatch]);

  // Reset if category changes manually
  useEffect(() => {
    if (!isSameCategory) {
      setPage(1);
      setAllProducts([]);
    }
  }, [category]);

  const { data, isLoading, isError, error, isFetching } = useGetProductsQuery({
    page,
    resPerPage: 8,
    category,
  });

  // Append new products when data changes
  useEffect(() => {
    if (data?.filteredProducts) {
      setAllProducts((prev) => {
        const newProducts = data.filteredProducts.filter(
          (p) => !prev.some((existing) => existing._id === p._id)
        );
        return [...prev, ...newProducts];
      });
      setHasMore(data.filteredProducts.length === 8); // Check if there’s more to load
    }
  }, [data]);

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

  if (isLoading && allProducts.length === 0) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '600px' }}>
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
        <div style={{ textAlign: "center", padding: "20px" }}>
          <button
            onClick={handleLoadMore}
            disabled={isFetching}
            className="tf-btn btn-fill justify-content-center fw-6 fs-16 flex-grow-1 animate-hover-btn"
          >
            {isFetching ? "Loading..." : "Load More"}
          </button>
        </div>
      )}
    </>
  );
}
