import Footer1 from "@/components/footers/Footer1";
import Header2 from "@/components/headers/Header2";
import Timelines from "@/components/othersPages/Timelines";
import React from "react";

export const metadata = {
  title: "Timeline || Ecomus - ",
  description: "Ecomus - ",
};
export default function page() {
  return (
    <>
      <Header2 />
      <div className="tf-page-title style-2">
        <div className="container-full">
          <div className="heading text-center">Timeline</div>
        </div>
      </div>

      <Timelines />
      <Footer1 />
    </>
  );
}
