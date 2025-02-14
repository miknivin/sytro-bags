import Footer1 from "@/components/footers/Footer1";
import React from "react";
import Link from "next/link";
import Header4 from "@/components/headers/Header4";
export default function page() {
  return (
    <>
      <Header4 />
      <>
        {/* page-title */}
        <div className="tf-page-title style-2">
          <div className="container-full">
            <div className="heading text-center">Shipping &amp; Delivery</div>
          </div>
        </div>
        {/* /page-title */}
        {/* main-page */}
        <section className="flat-spacing-25">
          <div className="container">
            <div className="tf-main-area-page tf-page-delivery">
              <div className="box">
                <h4>Shipping and Delivery Policy for Sytro</h4>
                <p>
                  At Sytro, we strive to deliver your orders promptly and
                  efficiently. This policy outlines our shipping and delivery
                  processes to ensure a smooth experience for our customers.
                </p>
              </div>
              <div className="box">
                <h4>1. Shipping Areas</h4>
                <p>We currently ship only within India.</p>
              </div>
              <div className="box">
                <h4>2. Order Processing</h4>

                <ul className="tag-list">
                  <li>
                    Orders are processed within 1-2 business days after payment
                    confirmation.
                  </li>
                  <li>
                    Orders placed on weekends or public holidays will be
                    processed on the next business day.
                  </li>
                </ul>
              </div>
              <div className="box">
                <h4>3. Shipping Timelines</h4>

                <ul className="tag-list">
                  <li>
                    Delivery times may vary depending on the destination. Here
                    are the estimated timelines:
                    <ul
                      style={{
                        listStyleType: "disc",
                        marginLeft: 20,
                        color: "#333",
                        fontSize: "1em",
                        lineHeight: "1.6",
                      }}
                    >
                      <li>
                        <strong>Metro Cities:</strong> 3-5 business days
                      </li>
                      <li>
                        <strong>Other Areas:</strong> 5-7 business days
                      </li>
                    </ul>
                  </li>

                  <li
                    style={{ fontSize: "0.9em", color: "#666", marginTop: 10 }}
                  >
                    These timelines are estimates and may vary due to unforeseen
                    circumstances.
                  </li>
                </ul>
              </div>
              <div className="box">
                <h4>4. Shipping Costs</h4>

                <p>Shipping is free for all orders within India.</p>
              </div>
              <div className="box">
                <h4>5. Tracking Your Order</h4>

                <ul className="tag-list">
                  <li>
                    Once your order is shipped, you will receive a tracking
                    number.
                  </li>
                  <li>
                    You can track your order status on our website by logging
                    into your account.
                  </li>
                </ul>
              </div>
              <div className="box">
                <h4>6. Delays in Delivery</h4>

                <ul className="tag-list">
                  <li>
                    While we strive to deliver your order on time, delays may
                    occur due to reasons beyond our control, such as courier
                    delays, natural disasters, or incorrect address details.
                  </li>
                  <li>
                    In case of a delay, we will keep you informed and work with
                    our shipping partners to resolve the issue as quickly as
                    possible
                  </li>
                </ul>
              </div>
              <div className="box">
                <h4>7. Lost or Damaged Packages</h4>

                <ul className="tag-list">
                  <li>
                    If your package is lost or damaged during transit, please
                    contact us immediately.
                  </li>
                  <li>
                    We will investigate the issue and arrange for a replacement
                    at no additional cost to you.
                  </li>
                </ul>
              </div>
              <div className="box">
                <h4>8. Returns</h4>

                <ul className="tag-list">
                  <li>
                    If you are not satisfied with your purchase, you may return
                    the product within 15 days of delivery, provided it is
                    unused, in its original packaging, and with all tags
                    attached.
                  </li>
                  <li>
                    For more details, please refer to our{" "}
                    <Link href={"/delivery-return"}>
                      {" "}
                      Returns and Refunds Policy.
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="box">
                <h4>8. Contact Us</h4>
                <p>
                  If you have any questions about our Shipping and Delivery,
                  please contact us at:
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
