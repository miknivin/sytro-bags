import Features from "@/components/common/Features";
import ShopGram from "@/components/common/ShopGram";
import Testimonials from "@/components/homes/home-4/Testimonials";
import Footer1 from "@/components/footers/Footer1";
// import Header1 from "@/components/headers/Header4";
import Topbar1 from "@/components/headers/Topbar4";
import Brands from "@/components/homes/home-1/Brands";

import Categories from "@/components/homes/home-4/Categories";
import "../public/scss/main.scss";
import Hero from "@/components/homes/home-4/Hero";
import Lookbook from "@/components/homes/home-1/Lookbook";
import Marquee from "@/components/homes/home-4/Marquee";
import Products from "@/components/homes/home-4/Products";
import Categories2 from "@/components/homes/home-4/Categories2";
import Topbar2 from "@/components/headers/Topbar2";
import Header4 from "@/components/headers/Header4";
export const metadata = {
  title: "Home 1 || Sytro",
  description: "Sytro",
};
export default function Home() {
  return (
    <>
      {/* <Topbar2 /> */}
      <Header4 />
      <Hero />
      <Marquee />
      {/* <Categories /> */}
      <Products />
  
      <Testimonials />
      {/* <Lookbook /> */}
      {/* <Categories2 /> */}
      {/* <Brands /> */}
      {/* <ShopGram /> */}
      <Features />
      <Footer1 />
    </>
  );
}
