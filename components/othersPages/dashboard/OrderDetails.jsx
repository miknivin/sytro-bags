"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useOrderDetailsQuery } from "@/redux/api/orderApi";

export default function OrderDetails() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const { data, isLoading, error } = useOrderDetailsQuery(orderId, {
    skip: !orderId,
  });
  const [orderDetails, setOrderDetails] = useState(null);
  const [activeTab, setActiveTab] = useState("Order History"); // State to track active tab

  const handleTabClick = (tabName) => {
    setActiveTab(tabName); // Update the active tab when a tab is clicked
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false, // Use 24-hour format
    }).format(date);
  };

  const addDate = (dateString, daysToAdd = 0) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    date.setDate(date.getDate() + daysToAdd); // Add 7 days

    return new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(date);
  };

  useEffect(() => {
    const tabs = () => {
      document.querySelectorAll(".widget-tabs").forEach((widgetTab) => {
        const titles = widgetTab.querySelectorAll(
          ".widget-menu-tab .item-title"
        );

        titles.forEach((title, index) => {
          title.addEventListener("click", () => {
            // Remove active class from all menu items
            titles.forEach((item) => item.classList.remove("active"));
            // Add active class to the clicked item
            title.classList.add("active");

            // Remove active class from all content items
            const contentItems = widgetTab.querySelectorAll(
              ".widget-content-tab > *"
            );
            contentItems.forEach((content) =>
              content.classList.remove("active")
            );

            // Add active class and fade-in effect to the matching content item
            const contentActive = contentItems[index];
            contentActive.classList.add("active");
            contentActive.style.display = "block";
            contentActive.style.opacity = 0;
            setTimeout(() => (contentActive.style.opacity = 1), 0);

            // Hide all siblings' content
            contentItems.forEach((content, idx) => {
              if (idx !== index) {
                content.style.display = "none";
              }
            });
          });
        });
      });
    };

    // Call the function to initialize the tabs
    tabs();

    // Clean up event listeners when the component unmounts
    return () => {
      document
        .querySelectorAll(".widget-menu-tab .item-title")
        .forEach((title) => {
          title.removeEventListener("click", () => {});
        });
    };
  }, []);

  useEffect(() => {
    setOrderDetails(data?.order || null);
  }, [orderId, data]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <>
      {orderDetails && (
        <div className="wd-form-order">
          <div className="order-head">
            <figure className="img-product">
              {orderDetails.orderItems?.[0]?.image && (
                <Image
                  alt="product"
                  src={orderDetails.orderItems[0].image}
                  width="720"
                  height="1005"
                />
              )}
            </figure>
            <div className="content">
              <div className="badge">{orderDetails.orderStatus}</div>
              <h6 className="mt-8 fw-5">
                Order #{orderDetails?._id?.slice(-6)}
              </h6>
            </div>
          </div>
          <div className="tf-grid-layout md-col-2 gap-15">
            <div className="item">
              <div className="text-2 text_black-2">Start Time</div>
              <div className="text-2 mt_4 fw-6">
                {formatDate(orderDetails.createdAt)}
              </div>
            </div>
            <div className="item">
              <div className="text-2 text_black-2">Address</div>
              <div className="text-2 mt_4 fw-6">
                {orderDetails.shippingInfo?.address || "N/A"}
              </div>
            </div>
          </div>
          <div className="widget-tabs style-has-border widget-order-tab">
            <ul className="widget-menu-tab">
              <li
                className={`item-title ${
                  activeTab === "Order History" ? "active" : ""
                }`}
                onClick={() => handleTabClick("Order History")}
              >
                <span className="inner">Order History</span>
              </li>
              <li
                className={`item-title ${
                  activeTab === "Item Details" ? "active" : ""
                }`}
                onClick={() => handleTabClick("Item Details")}
              >
                <span className="inner">Item Details</span>
              </li>
            </ul>
            <div className="widget-content-tab">
              {/* Order History Tab */}
              <div
                className={`widget-content-inner ${
                  activeTab === "Order History" ? "active" : ""
                }`}
              >
                <div className="widget-timeline">
                  <ul className="timeline">
                    {["Processing", "Shipped", "Delivered"].includes(
                      orderDetails.orderStatus
                    ) && (
                      <>
                        <li>
                          <div className="timeline-badge success" />
                          <div className="timeline-box">
                            <a className="timeline-panel" href="#">
                              <div className="text-2 fw-6">
                                Product Processing
                              </div>
                            </a>
                            <p>
                              <strong>Estimated Delivery Date : </strong>
                              {addDate(orderDetails.createdAt, 7)}
                            </p>
                          </div>
                        </li>
                      </>
                    )}
                    {["Shipped", "Delivered"].includes(
                      orderDetails.orderStatus
                    ) && (
                      <>
                        <li>
                          <div className="timeline-badge success" />
                          <div className="timeline-box">
                            <a className="timeline-panel" href="#">
                              <div className="text-2 fw-6">Product Shipped</div>
                              <span>{formatDate(orderDetails.updatedAt)}</span>
                            </a>
                          </div>
                        </li>
                      </>
                    )}
                    {["Delivered"].includes(orderDetails.orderStatus) && (
                      <>
                        <li>
                          <div className="timeline-badge success" />
                          <div className="timeline-box">
                            <a className="timeline-panel" href="#">
                              <div className="text-2 fw-6">
                                Product Delivered
                              </div>
                              <span>{formatDate(orderDetails.updatedAt)}</span>
                            </a>
                          </div>
                        </li>
                      </>
                    )}
                  </ul>
                </div>
              </div>

              {/* Item Details Tab */}
              <div
                className={`widget-content-inner ${
                  activeTab === "Item Details" ? "active" : ""
                }`}
              >
                {orderDetails.orderItems.map((item, i) => (
                  <div className="order-head" key={i}>
                    <figure className="img-product">
                      <img
                        alt="product"
                        src={item.image} // Use the image URL from the item object
                        width="720"
                        height="1005"
                      />
                    </figure>
                    <div className="content">
                      <div className="text-2 fw-6">{item.name}</div>{" "}
                      <div className="mt_4">
                        <span className="fw-6">Price: </span>
                        {`₹${item.price}${
                          item.quantity > 1 ? ` * ${item.quantity}` : ""
                        }`}
                      </div>
                    </div>
                  </div>
                ))}

                <ul>
                  <li className="d-flex justify-content-between text-2">
                    <span>Total Price</span>
                    <span className="fw-6">₹{orderDetails.totalAmount}</span>
                  </li>
                  {/* <li className="d-flex justify-content-between text-2 mt_4 pb_8 line">
                    <span>Total Discounts</span>
                    <span className="fw-6">$10</span>
                  </li>
                  <li className="d-flex justify-content-between text-2 mt_8">
                    <span>Order Total</span>
                    <span className="fw-6">$18.95</span>
                  </li> */}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
