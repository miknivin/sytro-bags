import Footer1 from "@/components/footers/Footer1";
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
            <div className="heading text-center">Privacy Policy</div>
          </div>
        </div>
        {/* /page-title */}
        {/* main-page */}
        <section className="flat-spacing-25">
          <div className="container">
            <div className="tf-main-area-page">
              <h4>The Company Private Policy</h4>
              <p>
                Welcome to Sytro! We are committed to protecting your privacy
                and ensuring that your personal information is handled in a safe
                and responsible manner. This Privacy Policy outlines how we
                collect, use, and protect your information when you visit our
                website [www.sytro.com] and make purchases from us.
              </p>
              <p>
                If you have any questions regarding this Privacy Policy, you
                should contact our Customer Service Department by email at
                sytrobags@gmail.com
              </p>
            </div>
          </div>

          <div className="container">
            <div className="tf-main-area-page">
              <>
                <h3
                  style={{ fontSize: "1.5em", color: "#333", marginBottom: 10 }}
                >
                  1. Information We Collect
                </h3>
                <p style={{ fontSize: "1em", color: "#666", marginBottom: 20 }}>
                  We may collect the following types of information:
                </p>
                <h4
                  style={{ fontSize: "1.2em", color: "#333", marginBottom: 10 }}
                >
                  Personal Information:
                </h4>
                <ul className="pp-list">
                  <li>Name</li>
                  <li>Email address</li>
                  <li>Phone number</li>
                  <li>Shipping and billing address</li>
                  <li>
                    Payment information (credit/debit card details, UPI, etc.)
                  </li>
                  <li>Order history</li>
                  <li>
                  Sytro Bags collects Instagram direct messages sent to @sytro_bags via a webhook at https://webhook.sytrobags.com/api/webhook for customer support on our e-commerce platform selling custom bags. We collect sender ID, message text, timestamp, and echo status to extract phone numbers and send automated WhatsApp responses via AiSensy, using the Sytro Bags WhatsApp Business Cloud API. We do not store or share this data after processing, except to send WhatsApp messages, and comply with Meta's data policies.
                  </li>
                </ul>
                <h4
                  style={{
                    fontSize: "1.2em",
                    color: "#333",
                    marginBottom: 10,
                    marginTop: 10,
                  }}
                >
                  Non-Personal Information:
                </h4>
                <ul className="pp-list">
                  <li>IP address</li>
                  <li>Browser type and version</li>
                  <li>Pages visited on our website</li>
                  <li>Time and date of visit</li>
                  <li>Referring website</li>
                </ul>
              </>
            </div>
          </div>
          <div className="container">
            <div className="tf-main-area-page">
              <>
                <h4
                  className="mt-4 mb-0"
                  style={{ fontSize: "1.5em", color: "#333", marginBottom: 10 }}
                >
                  2. How We Use Your Information
                </h4>
                <p style={{ fontSize: "1em", color: "#666", marginBottom: 20 }}>
                  We use the information we collect for the following purposes:
                </p>
                <ul className="pp-list">
                  <li>To process and fulfill your orders</li>
                  <li>
                    To communicate with you about your orders via email or
                    WhatsApp
                  </li>
                  <li>To improve our website and services</li>
                  <li>To comply with legal obligations</li>
                </ul>
              </>
            </div>
          </div>
          <div className="container">
            <div className="tf-main-area-page">
              <>
                <h4
                  className="mt-4 mb-0"
                  style={{ fontSize: "1.5em", color: "#333", marginBottom: 10 }}
                >
                  3. Sharing Your Information
                </h4>
                <p style={{ fontSize: "1em", color: "#666", marginBottom: 20 }}>
                  We do not sell, trade, or otherwise transfer your personal
                  information to outside parties except in the following
                  circumstances:
                </p>
                <ul className="pp-list">
                  <li>
                    <b>Third-Party Service Providers:</b> We share your
                    information with trusted third-party service providers, such
                    as payment gateways (e.g., Razorpay) and shipping companies
                    (e.g., Delhivery, FedEx), to process payments and deliver
                    your orders.
                  </li>
                  <li>
                    <b>Legal Requirements:</b> We may disclose your information
                    if required to do so by law or in response to valid requests
                    by public authorities.
                  </li>
                </ul>
              </>
            </div>
          </div>
          <div className="container">
            <div className="tf-main-area-page">
              <>
                <h4
                  className="mt-4 mb-0"
                  style={{ fontSize: "1.5em", color: "#333", marginBottom: 10 }}
                >
                  4. Data Security
                </h4>
                <p style={{ fontSize: "1em", color: "#666", marginBottom: 20 }}>
                  We implement a variety of security measures to maintain the
                  safety of your personal information. These include:
                </p>
                <ul className="pp-list">
                  <li>
                    Secure Socket Layer (SSL) technology to encrypt sensitive
                    information
                  </li>
                  <li>Regular malware scanning</li>
                  <li>Restricted access to personal information</li>
                </ul>
              </>
            </div>
          </div>
          <div className="container">
            <div className="tf-main-area-page">
              <>
                <h4
                  className="mt-4 mb-0"
                  style={{ fontSize: "1.5em", color: "#333", marginBottom: 10 }}
                >
                  5. Your Rights
                </h4>
                <p style={{ fontSize: "1em", color: "#666", marginBottom: 20 }}>
                  Under the Indian IT Act and other applicable laws, you have
                  the following rights regarding your personal information:
                </p>
                <ul className="pp-list">
                  <li>
                    <b>Access:</b> You can request a copy of the personal
                    information we hold about you.
                  </li>
                  <li>
                    <b>Correction:</b> You can request corrections to any
                    inaccurate or incomplete information.
                  </li>
                  <li>
                    <b>Deletion:</b> You can request the deletion of your
                    personal information, subject to certain legal obligations.
                  </li>
                </ul>
              </>
            </div>
          </div>

          <div className="container">
            <div className="tf-main-area-page">
              <>
                <h4
                  className="mt-4 mb-0"
                  style={{ fontSize: "1.5em", color: "#333", marginBottom: 10 }}
                >
                  6. Data Retention
                </h4>
                <p style={{ fontSize: "1em", color: "#666", marginBottom: 20 }}>
                  We retain your personal information for the lifetime of our
                  business operations to fulfill legal, accounting, and
                  operational requirements. If you wish to request the deletion
                  of your data, please contact us using the details provided
                  below.
                </p>
              </>
            </div>
          </div>
          <div className="container">
            <div className="tf-main-area-page">
              <>
                <h4
                  className="mt-4 mb-0"
                  style={{ fontSize: "1.5em", color: "#333", marginBottom: 10 }}
                >
                  7. Cookies
                </h4>
                <p style={{ fontSize: "1em", color: "#666", marginBottom: 20 }}>
                  Our website uses cookies to enhance your browsing experience.
                  Cookies are small files that a site or its service provider
                  transfers to your computer's hard drive through your web
                  browser (if you allow) that enables the site's or service
                  provider's systems to recognize your browser and capture and
                  remember certain information.
                </p>
                <p style={{ fontSize: "1em", color: "#666", marginBottom: 20 }}>
                  You can choose to disable cookies through your browser
                  settings, but this may affect your ability to use certain
                  features of our website.
                </p>
              </>
            </div>
          </div>
          <div className="container">
            <div className="tf-main-area-page">
              <>
                <h4
                  className="mt-4 mb-0"
                  style={{ fontSize: "1.5em", color: "#333", marginBottom: 10 }}
                >
                  8. Third-Party Links
                </h4>
                <p style={{ fontSize: "1em", color: "#666", marginBottom: 20 }}>
                  Our website may contain links to third-party websites. These
                  sites have their own privacy policies, and we are not
                  responsible for their content or activities.
                </p>
              </>
            </div>
          </div>
          <div className="container">
            <div className="tf-main-area-page">
              <>
                <h4
                  className="mt-4 mb-0"
                  style={{ fontSize: "1.5em", color: "#333", marginBottom: 10 }}
                >
                  9. Changes to This Privacy Policy
                </h4>
                <p style={{ fontSize: "1em", color: "#666", marginBottom: 20 }}>
                  We may update this Privacy Policy from time to time. Any
                  changes will be posted on this page with an updated effective
                  date. We encourage you to review this policy periodically to
                  stay informed about how we are protecting your information.
                </p>
              </>
            </div>
          </div>
          <div className="container">
            <div className="tf-main-area-page">
              <>
                <h4
                  className="mt-4 mb-0"
                  style={{ fontSize: "1.5em", color: "#333", marginBottom: 10 }}
                >
                  10. Contact Us
                </h4>
                <p style={{ fontSize: "1em", color: "#666", marginBottom: 20 }}>
                  If you have any questions or concerns about this Privacy
                  Policy or our data practices, please contact us at:
                </p>
                <p style={{ fontSize: "1em", color: "#666", marginBottom: 20 }}>
                  <b>Email:</b> sytrobags@gmail.com <br />
                  <b>Phone:</b> +91 72933 33483 <br />
                  <b>Address:</b> Panakal tower North Basin Road Broadway
                  Ernakulam, Kochi, Kerala 682031
                </p>
              </>
            </div>
          </div>
        </section>
      </>

      <Footer1 />
    </>
  );
}
