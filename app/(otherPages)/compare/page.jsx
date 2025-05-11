import Footer1 from "@/components/footers/Footer1";
import Header2 from "@/components/headers/Header2";
import Topbar1 from "@/components/headers/Topbar1";

import Compare from "@/components/othersPages/Compare";
import React from "react";

export const metadata = {
  title: "Compare || Ecomus - ",
  description: "Ecomus - ",
};
export default function page() {
  return (
    <>
      <Topbar1 />
      <Header2 />
      <div className="tf-page-title">
        <div className="container-full">
          <div className="heading text-center">Compare Products</div>
        </div>
      </div>

      <Compare />
      <Footer1 />
    </>
  );
}
