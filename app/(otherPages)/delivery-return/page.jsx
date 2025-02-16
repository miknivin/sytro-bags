import Footer1 from "@/components/footers/Footer1";
import Header2 from "@/components/headers/Header2";
import Header4 from "@/components/headers/Header4";
import React from "react";

export default function page() {
  return (
    <>
      <Header4 />
      <>
        {/* page-title */}
        <div className="tf-page-title style-2">
          <div className="container-full">
            <div className="heading text-center">Returns and Refunds</div>
          </div>
        </div>
        {/* /page-title */}
        {/* main-page */}
        <section className="flat-spacing-25">
          <div className="container">
            <div className="tf-main-area-page tf-page-delivery">
              <div className="box">
                <h4>Returns and Refunds Policy for Sytro</h4>
                <p>
                  At Sytro, we strive to ensure your complete satisfaction with
                  every purchase. If you are not entirely satisfied with your
                  order, we’re here to help. Please read our policy below to
                  understand how returns and refunds work.
                </p>
              </div>
              <div className="box">
                <h4>1. Return Eligibility</h4>
                <ul className="tag-list">
                  <li>
                    You have 15 days from the date of delivery to initiate a
                    return.
                  </li>
                  <li>To be eligible for a return, the product must be:</li>
                  <ul
                    style={{
                      listStyleType: "disc",
                      marginLeft: 20,
                      color: "#333",
                      fontSize: "1em",
                      lineHeight: "1.6",
                    }}
                  >
                    <li>Unused</li>
                    <li>In its original packaging</li>
                    <li>With all tags attached</li>
                  </ul>
                </ul>
              </div>
              <div className="box">
                <h4>2. How to Initiate a Return</h4>
                <p>
                  To initiate a return, please contact us within 15 days of
                  receiving your order. You can reach us via:
                </p>
                <ul className="tag-list">
                  <li>
                    <b>Email: </b>sytrobags@gmail.com
                  </li>
                  <li>
                    <b>Phone: </b>+91 72933 33483
                  </li>
                  <li>
                    <b>WhatsApp: </b>+91 72933 33483
                  </li>
                </ul>
                <p>Provide the following details:</p>
                <ul className="tag-list">
                  <li>Your order number</li>
                  <li>Product details</li>
                  <li>Reason for return</li>
                </ul>
                <p>
                  Once your return request is approved, we will provide
                  instructions on how to return the product.
                </p>
              </div>
              <div className="box">
                <h4>3. Return Shipping</h4>
                <p>
                  Sytro will cover the cost of return shipping. We will provide
                  a return shipping label or arrange for a pickup, depending on
                  your location.
                </p>
              </div>
              <div className="box">
                <h4>4. Refund Process</h4>
                <ul className="tag-list">
                  <li>
                    Once we receive and inspect the returned product, we will
                    notify you of the approval or rejection of your refund.
                  </li>
                  <li>
                    If approved, your refund will be processed within 3-5
                    business days.
                  </li>
                  <li>
                    Refunds will be issued through the original payment method
                    or via bank transfer, depending on your preference.
                  </li>
                </ul>
              </div>
              <div className="box">
                <h4>5. Non-Returnable Items</h4>
                <p>
                Currently, all products sold by Sytro are eligible for returns, provided they meet the return conditions outlined above. However, kids' bags are non-refundable and non-returnable.
                </p>
              </div>
              <div className="box">
                <h4>6. Exchanges</h4>
                <p>
                  At this time, Sytro does not offer exchanges. If you wish to
                  replace an item, please return the original product and place
                  a new order
                </p>
              </div>
              <div className="box">
                <h4>7. Damaged or Defective Products</h4>
                <p>
                  If you receive a damaged or defective product, please contact
                  us immediately. We will arrange for a replacement or refund at
                  no additional cost to you.
                </p>
              </div>
              {/*  */}
              <div className="box">
                <h4>8. Contact Us</h4>
                <p>
                  If you have any questions about our Returns and Refunds
                  Policy, please contact us at:
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
