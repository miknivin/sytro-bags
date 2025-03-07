"use client";
import React from "react";
import { ProductCard } from "../shopCards/ProductCard";
import { useGetProductsQuery } from "@/redux/api/productsApi";

export default function ProductGrid({ gridItems = 4 }) {
  const { data, isLoading, isError, error } = useGetProductsQuery({
    page: 1,
    category: "Kids Bags",
  });

  if (isLoading) {
    return (
      <div style={{ textAlign: "center", padding: "20px" }}>
        Loading products...
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

  const allproducts = data?.filteredProducts || [];

  return (
    <>
      <div
        style={{
          width: "fit-content",
          margin: "0 auto",
          fontSize: "17px",
          marginBottom: "24px",
        }}
      >
        {allproducts.length} product(s) found
      </div>
      <div className="grid-layout wrapper-shop" data-grid={`grid-${gridItems}`}>
        {allproducts.map((elm, i) => (
          <ProductCard product={elm} key={i} />
        ))}
      </div>
    </>
  );
}
