import Footer1 from "@/components/footers/Footer1";
import FullScreenSpinner from "@/components/common/FullScreenSpinner";
import Header4 from "@/components/headers/Header4";
import Checkout from "@/components/othersPages/Checkout";
import { Suspense } from "react";

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

      <Suspense fallback={<FullScreenSpinner />}>
        <Checkout />
      </Suspense>
      <Footer1 />
    </>
  );
}
