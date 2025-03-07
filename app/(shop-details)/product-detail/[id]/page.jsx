"use client";
import Footer1 from "@/components/footers/Footer1";
import Header4 from "@/components/headers/Header4";
import ShopDetailsTab from "@/components/shopDetails/ShopDetailsTab";
import React from "react";
import Link from "next/link";
import DetailsOuterZoom from "@/components/shopDetails/DetailsOuterZoom";
import { useGetProductDetailsQuery } from "@/redux/api/productsApi";
import FullScreenSpinner from "@/components/common/FullScreenSpinner";

export default function Page({ params }) {
  const { id } = params; // Extract product ID from params

  // Call the query directly (Hooks must be used inside the component)
  const { data, error, isLoading } = useGetProductDetailsQuery(id);

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
  if (error && !data?.productById) return <p>Error fetching product details</p>;

  return (
    <>
      <Header4 />
      <div className="tf-breadcrumb">
        <div className="container">
          <div className="tf-breadcrumb-wrap d-flex justify-content-between flex-wrap align-items-center">
            <div className="tf-breadcrumb-list">
              <Link href={`/`} className="text">
                Home
              </Link>
              <i className="icon icon-arrow-right" />
              <span className="text">
                {product?.title || "Product Details"}
              </span>
            </div>
          </div>
        </div>
      </div>
      <DetailsOuterZoom product={product} />
      <ShopDetailsTab details={product?.details} />
      <Footer1 />
    </>
  );
}
