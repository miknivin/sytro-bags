import Footer1 from "@/components/footers/Footer1";
import Header2 from "@/components/headers/Header2";
import Header4 from "@/components/headers/Header4";
import Link from "next/link";
import React from "react";

export default function page() {
  return (
    <>
      <Header4 />
      <>
        {/* page-title */}
        <div className="tf-page-title style-2">
          <div className="container-full">
            <div className="heading text-center">Terms &amp; Conditions</div>
          </div>
        </div>
        {/* /page-title */}
        {/* main-page */}
        <section className="flat-spacing-25">
          <div className="container">
            <div className="tf-main-area-page tf-terms-conditions">
              <div className="box">
                <h4>Terms and Conditions for Sytro</h4>
                <p>
                  Welcome to Sytro! These Terms and Conditions govern your use
                  of our website [www.sytro.com] and your purchase of products
                  from us. By accessing or using our website, you agree to
                  comply with and be bound by these terms. Please read them
                  carefully.
                </p>
              </div>
              <div className="box">
                <h4>1. Website Usage</h4>
                <p>
                  There are no age restrictions or specific prohibitions for
                  using our website. However, you agree to use the website for
                  lawful purposes only and not to engage in any activity that
                  disrupts or interferes with its functionality.
                </p>
              </div>
              <div className="box">
                <h4>2. Intellectual Property</h4>
                <ul className="pp-list">
                  <li>
                    All content on this website, including but not limited to
                    text, graphics, logos, images, and software, is the property
                    of Sytro and is protected by Indian and international
                    copyright laws.
                  </li>
                  <li>
                    You may not reproduce, distribute, or use any content from
                    this website without our prior written permission.
                  </li>
                </ul>
              </div>
              <div className="box">
                <h4>3. Limitation of Liability</h4>
                <p>
                  Sytro sells bags and related products. We are not liable for
                  any damages, injuries, or losses arising from the use of our
                  products or website, except as required by law.
                </p>
              </div>
              <div className="box">
                <h4>4. Governing Law</h4>
                <p>
                  These Terms and Conditions are governed by and construed in
                  accordance with the laws of India. Any disputes will be
                  subject to the exclusive jurisdiction of the courts in
                  Ernakulam, Kerala.
                </p>
              </div>
              <div className="box">
                <h4>5. Payment Terms</h4>
                <ul className="pp-list">
                  <li>
                    We accept payments through our secure payment gateway, which
                    supports credit/debit cards, UPI, and other online payment
                    methods.
                  </li>
                  <li>
                    We also offer Cash on Delivery (COD) for eligible orders.
                  </li>
                  <li>
                    All prices are listed in Indian Rupees (INR) and are
                    inclusive of applicable taxes.
                  </li>
                </ul>
              </div>
              <div className="box">
                <h4>6. Shipping and Delivery</h4>
                <ul className="pp-list">
                  <li>
                    Please refer to our{" "}
                    <Link style={{ color: "blue" }} href="/shipping-delivery">
                      Shipping Policy
                    </Link>{" "}
                    for details about shipping timelines, delivery areas, and
                    handling of delays or lost packages.
                  </li>
                  <li>
                    We strive to deliver your orders promptly, but we are not
                    responsible for delays caused by unforeseen circumstances
                    (e.g., natural disasters, courier delays).
                  </li>
                </ul>
              </div>
              <div className="box">
                <h4>7. User Accounts</h4>
                <ul className="pp-list">
                  <li>
                    To place an order, you must create an account on our
                    website.
                  </li>
                  <li>
                    You are responsible for maintaining the confidentiality of
                    your account credentials and for all activities that occur
                    under your account.
                  </li>
                  <li>
                    Notify us immediately if you suspect any unauthorized use of
                    your account.
                  </li>
                </ul>
              </div>
              <div className="box">
                <h4>Dispute Resolution</h4>
                <ul className="pp-list">
                  <li>
                    In the event of a dispute, we will strive to resolve it
                    amicably through negotiation or mediation.
                  </li>
                  <li>
                    If the dispute cannot be resolved, it will be referred to
                    the courts in Ernakulam, Kerala
                  </li>
                </ul>
              </div>
              <div className="box">
                <h4>9. Updates to Terms</h4>
                <ul className="pp-list">
                  <li>
                    We reserve the right to update or modify these Terms and
                    Conditions at any time. Any changes will be posted on this
                    page with an updated effective date.
                  </li>
                  <li>
                    Your continued use of the website after changes are made
                    constitutes your acceptance of the revised terms.
                  </li>
                </ul>
              </div>
              <div className="box">
                <h4>10. Contact Us</h4>
                <p>
                  If you have any questions or concerns about these Terms and
                  Conditions, please contact us at:
                </p>
                <p style={{ fontSize: "1em", color: "#666", marginBottom: 20 }}>
                  <b>Email:</b> sytrobags@gmail.com <br />
                  <b>Phone:</b> +91 72933 33483 <br />
                  <b>Address:</b> Panakal tower North Basin Road Broadway
                  Ernakulam, Kochi, Kerala 682031
                </p>
              </div>
            </div>
          </div>
        </section>
      </>

      <Footer1 />
    </>
  );
}
