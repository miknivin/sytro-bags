import Footer1 from "@/components/footers/Footer1";
import Header2 from "@/components/headers/Header2";
import Products from "@/components/shopDetails/Products";
import RecentProducts from "@/components/shopDetails/RecentProducts";
import ShopDetailsTab from "@/components/shopDetails/ShopDetailsTab";
import React from "react";
import Link from "next/link";
import ProductSinglePrevNext from "@/components/common/ProductSinglePrevNext";
import DefaultShopDetailsNoZoom from "@/components/shopDetails/DefaultShopDetailsNoZoom";
import OrdinaryProductDetailsClient from "@/components/shopDetails/OrdinaryProductDetailsClient";
import Header4 from "@/components/headers/Header4";

export const metadata = {
  title: "Product details || Sytro",
  description: "Sytro",
};

export default function page({ params }) {
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
              <span className="text">Product</span>
            </div>
            {/* <ProductSinglePrevNext currentId={params.id} /> */}
          </div>
        </div>
      </div>
      <OrdinaryProductDetailsClient productId={params.id} />
      {/* <Products />
      <RecentProducts /> */}
      <Footer1 />
    </>
  );
}
