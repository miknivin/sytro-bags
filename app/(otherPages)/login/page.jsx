import Footer1 from "@/components/footers/Footer1";
import Header2 from "@/components/headers/Header2";
import Header4 from "@/components/headers/Header4";
import Login from "@/components/othersPages/Login";
import React from "react";

export const metadata = {
  title: "Login || Sytro",
  description: "Sytro",
};
export default function page() {
  return (
    <>
      <Header4 />
      <div className="tf-page-title style-2">
        <div className="container-full">
          <div className="heading text-center">Log in</div>
        </div>
      </div>

      <Login />
      <Footer1 />
    </>
  );
}
