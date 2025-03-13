import Footer1 from "@/components/footers/Footer1";
import Header4 from "@/components/headers/Header4";
import Register from "@/components/othersPages/Register";
import React from "react";

export const metadata = {
  title: "Sytro",
  description: "Sytro",
};
export default function page() {
  return (
    <>
      <Header4 />
      <div className="tf-page-title style-2">
        <div className="container-full">
          <div className="heading text-center">Register</div>
        </div>
      </div>

      <Register />
      <Footer1 />
    </>
  );
}
