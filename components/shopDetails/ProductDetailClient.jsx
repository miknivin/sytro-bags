"use client";
import React from "react";
import { useGetProductDetailsQuery } from "@/redux/api/productsApi";
import FullScreenSpinner from "@/components/common/FullScreenSpinner";
import DetailsOuterZoom from "@/components/shopDetails/DetailsOuterZoom";
import ShopDetailsTab from "@/components/shopDetails/ShopDetailsTab";

export default function ProductDetailsClient({ productId }) {
  const { data, error, isLoading } = useGetProductDetailsQuery(productId);

  let product = null;

  try {
    if (error) {
      throw new Error("Failed to fetch product details");
    }
    product = data?.productById;
  } catch (err) {
    console.error("Error fetching product details:", err);
  }

  if (isLoading) return <FullScreenSpinner />;
  if (error && !data?.productById && !isLoading)
    return <p>Error fetching product details</p>;

  return (
    <>
      <DetailsOuterZoom product={product} />
      <ShopDetailsTab details={product?.details} />
    </>
  );
}
