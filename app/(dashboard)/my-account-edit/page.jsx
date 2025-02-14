import Footer1 from "@/components/footers/Footer1";
import Header4 from "@/components/headers/Header4";
import AccountEdit from "@/components/othersPages/dashboard/AccountEdit";
import DashboardNav from "@/components/othersPages/dashboard/DashboardNav";
import React from "react";

export const metadata = {
  title: "My Account Edit || Sytro - Ultimate Nextjs Ecommerce Template",
  description: "Ecomus ",
};
export default function page() {
  return (
    <>
      <Header4 />
      <div className="tf-page-title">
        <div className="container-full">
          <div className="heading text-center">My Account Edit</div>
        </div>
      </div>
      <section className="flat-spacing-11">
        <div className="container">
          <div className="row">
            <div className="col-lg-3">
              <DashboardNav />
            </div>
            <div className="col-lg-9">
              <AccountEdit />
            </div>
          </div>
        </div>
      </section>

      <Footer1 />
    </>
  );
}
