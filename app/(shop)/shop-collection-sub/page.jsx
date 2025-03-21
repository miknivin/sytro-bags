import Footer1 from "@/components/footers/Footer1";
import Header2 from "@/components/headers/Header2";
import Header4 from "@/components/headers/Header4";
import Topbar1 from "@/components/headers/Topbar1";
import ShopDefault from "@/components/shop/ShopDefault";
import Subcollections from "@/components/shop/Subcollections";
import React from "react";

export const metadata = {
  title:
    "Kids Collection",
  description: "Sytro - Ultimate Nextjs Ecommerce Template",
};
export default function page() {
  return (
    <>
      {/* <Topbar1 /> */}
      <Header4 />
      <div className="tf-page-title">
        <div className="container-full">
          <div className="heading text-center">New Arrival</div>
          <p className="text-center text-2 text_black-2 mt_5">
            Shop through our latest collection
          </p>
        </div>
      </div>
      {/* <Subcollections /> */}
      <ShopDefault />
      <Footer1 />
    </>
  );
}
