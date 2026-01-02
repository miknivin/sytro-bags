import { socialLinksWithBorder } from "@/data/socials";
import React from "react";

export default function Map2() {
  return (
    <section className="flat-spacing-9">
      <div className="container">
        <div className="tf-grid-layout gap-0 lg-col-2">
          <div className="w-100">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3929.4309075051287!2d76.2765106!3d9.981218799999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b080d56d60dc6dd%3A0x9285d886d0f7e60a!2sBasin%20Rd%20%26%20Broadway%2C%20Marine%20Drive%2C%20Ernakulam%2C%20Kochi%2C%20Kerala%20682031!5e0!3m2!1sen!2sin!4v1739523560115!5m2!1sen!2sin"
              width="100%"
              height={894}
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
          <div className="tf-content-left has-mt">
            <div className="sticky-top">
              <h5 className="mb_20">Visit Our Store</h5>
              <div className="mb_20">
                <p className="mb_15">
                  <strong>Address</strong>
                </p>
                <p>North Basin Road Broadway Ernakulam, Kochi, Kerala 682031</p>
              </div>
              <div className="mb_20">
                <p className="mb_15">
                  <strong>Phone</strong>
                </p>
                <a href="tel:+918921570685">+91 8921570685</a>
              </div>
              <div className="mb_20">
                <p className="mb_15">
                  <strong>Email</strong>
                </p>
                <a href="mailto:sytrobags@gmail.com">sytrobags@gmail.com</a>
              </div>
              {/* <div className="mb_36">
                <p className="mb_15">
                  <strong>Open Time</strong>
                </p>
                <p className="mb_15">Our store has re-opened for shopping,</p>
                <p>exchange Every day 11am to 7pm</p>
              </div> */}
              <div>
                <ul className="tf-social-icon d-flex gap-20 style-default">
                  {socialLinksWithBorder.map((link, index) => (
                    <li key={index}>
                      <a
                        href={link.href}
                        className={`box-icon link round ${link.className} ${link.borderClass}`}
                      >
                        <i
                          className={`icon ${link.iconSize} ${link.iconClass}`}
                        />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
