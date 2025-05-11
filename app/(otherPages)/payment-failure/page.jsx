import Footer1 from "@/components/footers/Footer1";
import Header2 from "@/components/headers/Header2";
import PaymentFailure from "@/components/othersPages/PaymentFailure";
import React from "react";

export const metadata = {
  title: "Payment Failure || Ecomus - ",
  description: "Ecomus - ",
};
export default function page() {
  return (
    <>
      <Header2 />
      <div className="tf-page-title">
        <div className="container-full">
          <div className="heading text-center">Payment Failure</div>
        </div>
      </div>

      <PaymentFailure />
      <Footer1 />
    </>
  );
}
