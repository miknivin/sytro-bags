import Footer1 from "@/components/footers/Footer1";
import Header2 from "@/components/headers/Header2";
import Header4 from "@/components/headers/Header4";
import About from "@/components/othersPages/about/About";
import Features from "@/components/othersPages/about/Features";
import FlatTitle from "@/components/othersPages/about/FlatTitle";
import Hero from "@/components/othersPages/about/Hero";
import ShopGram from "@/components/othersPages/about/ShopGram";
import Testimonials from "@/components/othersPages/about/Testimonials";
import React from "react";

export const metadata = {
  title: "About Us || Sytro",
  description: "Sytro",
};
export default function page() {
  return (
    <>
      <Header4 />
      <Hero />
      <FlatTitle />
      <div className="container">
        <div className="line"></div>
      </div>
      <About />
      <Features />
      <Testimonials />
      <div className="container">
        <div className="line"></div>
      </div>
      {/* <ShopGram /> */}
      <Footer1 />
    </>
  );
}
