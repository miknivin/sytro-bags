"use client";

import { useState } from "react";
import Testimonials from "../common/Testimonials";

const tabs = [
  { title: "Review", active: true },
  { title: "Description", active: false },
  // { title: "Shiping", active: false },
  // { title: "Return Polocies", active: false },
];

export default function ShopDetailsTab({ product, details }) {
  const [currentTab, setCurrentTab] = useState(1);

  const currentTabs = [
    { title: "Review", id: 1 },
    { title: "Description", id: 2 },
  ];

  return (
    <section
      className="flat-spacing-17 pt_0"
      style={{ maxWidth: "100vw", overflow: "clip" }}
    >
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="widget-tabs style-has-border">
              <ul className="widget-menu-tab">
                {currentTabs.map((elm) => (
                  <li
                    key={elm.id}
                    onClick={() => setCurrentTab(elm.id)}
                    className={`item-title ${currentTab === elm.id ? "active" : ""
                      } `}
                  >
                    <span className="inner">{elm.title}</span>
                  </li>
                ))}
              </ul>
              <div className="widget-content-tab">
                <div
                  className={`widget-content-inner ${currentTab === 1 ? "active" : ""
                    } `}
                >
                  <Testimonials isTitle={false} />
                </div>
                <div
                  className={`widget-content-inner ${currentTab === 2 ? "active" : ""
                    } `}
                >
                  <div className="">
                    <p className="mb_30">{details?.description}</p>
                    <div className="tf-product-des-demo">
                      <div className="right">
                        <h3 className="fs-16 fw-5">Features</h3>
                        <ul>
                          {details?.features?.map((item) => (
                            <li key={item}>{item}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="left">
                        <h3 className="fs-16 fw-5">Materials Care</h3>
                        <ul>
                          {details?.materialUsed?.map((item) => (
                            <li key={item}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
