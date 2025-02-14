"use client"
import Footer1 from "@/components/footers/Footer1";
import Header4 from "@/components/headers/Header4";
import Products from "@/components/shopDetails/Products";
import RecentProducts from "@/components/shopDetails/RecentProducts";
import ShopDetailsTab from "@/components/shopDetails/ShopDetailsTab";
import React from "react";
import Link from "next/link";
import DetailsOuterZoom from "@/components/shopDetails/DetailsOuterZoom";
import ProductSinglePrevNext from "@/components/common/ProductSinglePrevNext";
import { useGetProductDetailsQuery } from "@/redux/api/productsApi";
import FullScreenSpinner from "@/components/common/FullScreenSpinner";


// export const metadata = {
//   title: "Shop Details || Ecomus - Ultimate Nextjs Ecommerce Template",
//   description: "Ecomus - Ultimate Nextjs Ecommerce Template",
// };

export default function Page({ params }) {
  const { id } = params; // Extract product ID from params
  const { data, error, isLoading } = useGetProductDetailsQuery(id);
  const product = data?.productById
  if (isLoading) return <FullScreenSpinner/>;
  if (error) return <p>Error fetching product details</p>;

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
              <span className="text">{product?.title || "Product Details"}</span>
            </div>
            <ProductSinglePrevNext currentId={product?.id} />
          </div>
        </div>
      </div>
      <DetailsOuterZoom product={product} />
      <ShopDetailsTab details={product?.details} />
      {/* <Products />
      <RecentProducts /> */}
      <Footer1 />
    </>
  );
}
