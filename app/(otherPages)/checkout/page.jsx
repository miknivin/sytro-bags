import Footer1 from "@/components/footers/Footer1";
import Header4 from "@/components/headers/Header4";
import Checkout from "@/components/othersPages/Checkout";
import React from "react";

export const metadata = {
  title: "Sytro bags",
  description: "Sytro bags",
};
export default function page() {
  return (
    <>
      <Header4 />
      <div className="tf-page-title">
        <div className="container-full">
          <div className="heading text-center">Check Out</div>
        </div>
      </div>

      <Checkout />
      <Footer1 />
    </>
  );
}
