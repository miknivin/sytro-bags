import Features from "@/components/common/Features";
import TestimonialImages from "@/components/common/TestimonialImages";
import Categories from "@/components/homes/home-4/Categories";
import BackToSchoolCollection from "@/components/common/BackToSchoolCollection";

import "../public/scss/main.scss";
import Hero from "@/components/homes/home-4/Hero";
import Products from "@/components/homes/home-4/Products";
import Header4 from "@/components/headers/Header4";
import Moments from "@/components/common/Moments";
import GoogleReviews from "@/components/common/GoogleReviews";
import TrustBanner from "@/components/common/TrustBanner";
import Footer1 from "@/components/footers/Footer1";
export const metadata = {
  title: "Home || Sytro",
  description: "Sytro",
};
export default function Home() {
  return (
    <>
      {/* <AnnouncementBanner /> */}
      {/* <Topbar2 /> */}
      <Header4 />
      <Hero />
      <BackToSchoolCollection />
      {/* <Marquee /> */}
      <Categories />
      <Products />
      <Moments />
      <GoogleReviews />
      {/* <Testimonials /> */}
      {/* <Lookbook /> */}
      {/* <Categories2 /> */}
      {/* <Brands /> */}
      {/* <ShopGram /> */}

      <Features />
      <TrustBanner />
      <TestimonialImages />
      <Footer1 />
    </>
  );
}
