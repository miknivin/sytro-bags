"use client";
import React from "react";
import { useGetProductDetailsQuery } from "@/redux/api/productsApi";
import DefaultShopDetailsNoZoom from "@/components/shopDetails/DefaultShopDetailsNoZoom";
import ShopDetailsTab from "@/components/shopDetails/ShopDetailsTab";
import GoogleReviews from "../common/GoogleReviews";
import FullScreenSpinner from "../common/FullScreenSpinner";

export default function ProductDetailsClient({ productId }) {
  const { data, error, isLoading } = useGetProductDetailsQuery(productId);

  // Handle loading state
  if (isLoading) {
    return <FullScreenSpinner />;
  }

  // Handle error state
  if (error) {
    return (
      <div>
        Error loading product: {error.message || "Something went wrong"}
      </div>
    );
  }

  // Ensure data exists
  if (!data || !data.productById) {
    return <div>No product data available</div>;
  }

  const product = {
    _id: data?.productById?._id,
    name: data?.productById?.name || "Product",
    category: data?.productById?.category || "Kids Bags",
    price: data?.productById?.actualPrice || 0,
    offer: data?.productById?.offer || 0,
    offerEndTime: data?.productById?.offerEndTime || null,
    images:
      data?.productById?.images?.length > 0
        ? data.productById?.images
        : [{ url: "/images/placeholder.jpg" }],
    stocks: data?.productById?.stock || 0,
    details: data?.productById?.details || "No details available",
  };

  return (
    <>
      <DefaultShopDetailsNoZoom product={product} />
      <GoogleReviews />
      <ShopDetailsTab product={product} details={product.details} />
    </>
  );
}
