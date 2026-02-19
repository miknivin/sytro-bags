"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import {
  useOrderDetailsQuery,
  useLazyGetInvoiceUrlQuery,
} from "@/redux/api/orderApi";
import ImageModal from "@/components/modals/ImageModal";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

export default function OrderDetails() {
  const searchParams = useSearchParams();
  const [currentImage, setCurrentImage] = useState([]);
  const orderId = searchParams.get("orderId");
  const { data, isLoading, error } = useOrderDetailsQuery(orderId, {
    skip: !orderId,
  });
  const [triggerGetInvoice, { isLoading: isInvoiceLoading }] =
    useLazyGetInvoiceUrlQuery();

  const [orderDetails, setOrderDetails] = useState(null);
  const [activeTab, setActiveTab] = useState("Order History");
  const [isOpen, setIsOpen] = useState(false);

  const openModal = (imageurl) => {
    const urls = Array.isArray(imageurl) ? imageurl : [imageurl];
    setCurrentImage(urls);
    setIsOpen(true);
  };

  const closeModal = () => setIsOpen(false);

  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
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
      hour12: false,
    }).format(date);
  };

  const addDate = (dateString, daysToAdd = 0) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    date.setDate(date.getDate() + daysToAdd);
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
          ".widget-menu-tab .item-title",
        );
        titles.forEach((title, index) => {
          title.addEventListener("click", () => {
            titles.forEach((item) => item.classList.remove("active"));
            title.classList.add("active");

            const contentItems = widgetTab.querySelectorAll(
              ".widget-content-tab > *",
            );
            contentItems.forEach((content) =>
              content.classList.remove("active"),
            );

            const contentActive = contentItems[index];
            contentActive.classList.add("active");
            contentActive.style.display = "block";
            contentActive.style.opacity = 0;
            setTimeout(() => (contentActive.style.opacity = 1), 0);

            contentItems.forEach((content, idx) => {
              if (idx !== index) content.style.display = "none";
            });
          });
        });
      });
    };

    tabs();

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

  if (isLoading) return <div>Loading order details...</div>;
  if (error) return <div>Error loading order: {error.message}</div>;
  if (!orderDetails) return <div>No order found</div>;

  // Extract values with fallbacks
  const {
    _id,
    orderItems = [],
    shippingInfo = {},
    paymentMethod,
    advancePaid = 0,
    remainingAmount = 0,
    codAmount = 0,
    totalAmount = 0,
    itemsPrice = 0,
    createdAt,
    orderStatus,
    orderNotes = "N/A",
    codChargeCollected = 100, // from DB, fallback to 100
  } = orderDetails;

  const orderIdShort = _id?.slice(-6) || "N/A";
  const handleDownloadInvoice = async (orderId) => {
    try {
      // 1. Get temporary/signed invoice URL
      const result = await triggerGetInvoice(orderId).unwrap();

      const pdfUrl = typeof result === "string" ? result : result?.invoiceUrl;

      if (!pdfUrl) {
        throw new Error("No invoice URL received");
      }

      // 2. Fetch the actual PDF file
      const response = await fetch(pdfUrl);

      if (!response.ok) {
        throw new Error(`Failed to fetch PDF: ${response.statusText}`);
      }

      const blob = await response.blob();

      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `invoice-${orderId.slice(-6)}.pdf`;
      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);

      toast.success("Invoice downloaded");
    } catch (err) {
      console.error("Invoice download failed:", err);
      toast.error(
        err?.data?.message ||
          err?.message ||
          "Could not download invoice. Please try again.",
      );
    }
  };

  return (
    <>
      <div className="w-100 mb-4 d-flex justify-content-between align-items-center">
        <Link
          style={{height:"30px"}}
          className="tf-btn rounded-circle btn-fill animate-hover-btn rounded-0 justify-content-center p-2"
          href="/my-account-orders"
        >
          <FontAwesomeIcon icon={faArrowLeft} />
        </Link>
        <button
          type="button"
          onClick={() => handleDownloadInvoice(_id)}
          disabled={isInvoiceLoading}
          className="tf-btn border-black animate-hover-btn rounded-0 justify-content-center"
        >
          {isInvoiceLoading ? "Downloading..." : "Invoice"}
        </button>
      </div>

      <div className="wd-form-order">
        {/* Order Header */}
        <div className="order-head">
          <figure className="img-product">
            {orderItems?.[0]?.image && (
              <Image
                alt="product"
                src={orderItems[0].image}
                width={720}
                height={1005}
              />
            )}
          </figure>
          <div className="content">
            <div className="badge">{orderStatus || "N/A"}</div>
            <h6 className="mt-8 fw-5">Order #{orderIdShort}</h6>
            <p>Payment method: {paymentMethod || "N/A"}</p>
          </div>
        </div>

        {/* Basic Info */}
        <div className="tf-grid-layout md-col-2 gap-15 mb-4">
          <div className="item">
            <div className="text-2 text_black-2">Order Date</div>
            <div className="text-2 mt_4 fw-6">{formatDate(createdAt)}</div>
          </div>
          <div className="item">
            <div className="text-2 text_black-2">Delivery Address</div>
            <div className="text-2 mt_4 fw-6">
              {shippingInfo?.address || "N/A"}
              <br />
              {shippingInfo?.city}, {shippingInfo?.state} -{" "}
              {shippingInfo?.zipCode}
              <br />
              Phone: {shippingInfo?.phoneNo || "N/A"}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="widget-tabs style-has-border widget-order-tab">
          <ul className="widget-menu-tab">
            <li
              className={`item-title ${activeTab === "Order History" ? "active" : ""}`}
              onClick={() => handleTabClick("Order History")}
            >
              <span className="inner">Order History</span>
            </li>
            <li
              className={`item-title ${activeTab === "Item Details" ? "active" : ""}`}
              onClick={() => handleTabClick("Item Details")}
            >
              <span className="inner">Item Details</span>
            </li>
          </ul>

          <div className="widget-content-tab">
            {/* Order History Tab */}
            <div
              className={`widget-content-inner ${activeTab === "Order History" ? "active" : ""}`}
            >
              <div className="widget-timeline">
                <ul className="timeline">
                  <li>
                    <div
                      className={`timeline-badge ${orderStatus === "Processing" ? "warning" : "success"}`}
                    />
                    <div className="timeline-box">
                      <div className="text-2 fw-6">Order Placed</div>
                      <span>{formatDate(createdAt)}</span>
                    </div>
                  </li>

                  {orderStatus === "Processing" && (
                    <li>
                      <div className="timeline-badge warning" />
                      <div className="timeline-box">
                        <div className="text-2 fw-6">Processing</div>
                        <p>Estimated Delivery: {addDate(createdAt, 7)}</p>
                      </div>
                    </li>
                  )}

                  {(orderStatus === "Shipped" ||
                    orderStatus === "Delivered") && (
                    <li>
                      <div className="timeline-badge success" />
                      <div className="timeline-box">
                        <div className="text-2 fw-6">Shipped</div>
                        <span>{formatDate(orderDetails?.updatedAt)}</span>
                      </div>
                    </li>
                  )}

                  {orderStatus === "Delivered" && (
                    <li>
                      <div className="timeline-badge success" />
                      <div className="timeline-box">
                        <div className="text-2 fw-6">Delivered</div>
                        <span>{formatDate(orderDetails?.updatedAt)}</span>
                      </div>
                    </li>
                  )}
                </ul>
              </div>
            </div>

            {/* Item Details Tab (with Payment Info added at the bottom) */}
            <div
              className={`widget-content-inner ${activeTab === "Item Details" ? "active" : ""}`}
            >
              {/* Items List */}
              {orderItems.map((item, i) => (
                <div className="order-head mb-4" key={i}>
                  <figure className="img-product">
                    <Image
                      alt={item.name}
                      src={item.image || "/images/placeholder.jpg"}
                      width={720}
                      height={1005}
                    />
                  </figure>
                  <div className="content">
                    <div className="text-2 fw-6">{item.name}</div>
                    <div className="mt_4">
                      <span className="fw-6">Price: </span>₹
                      {Number(item.price).toFixed(2)}
                      {item.quantity > 1 && ` × ${item.quantity}`}
                    </div>
                    {item.customNameToPrint && (
                      <div>
                        <span className="fw-6">Name on bag: </span>
                        {item.customNameToPrint}
                      </div>
                    )}
                    {item.uploadedImage?.length > 0 && (
                      <div>
                        <button
                          style={{ textDecoration: "underline" }}
                          onClick={() => openModal(item.uploadedImage)}
                          className="fw-6 border-0 text-brand-primary bg-transparent"
                        >
                          View Uploaded Image
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* Pricing summary */}
              <ul className="mt-4">
                <li className="d-flex justify-content-between text-2">
                  <span>Items Total</span>
                  <span>₹{itemsPrice.toFixed(2)}</span>
                </li>
                {paymentMethod === "COD" && (
                  <li className="d-flex justify-content-between text-2">
                    <span>COD Charge</span>
                    <span>₹{codChargeCollected.toFixed(0)}</span>
                  </li>
                )}
                <li className="d-flex justify-content-between text-2 mt-3 fw-bold">
                  <span>Order Total</span>
                  <span>₹{totalAmount.toFixed(2)}</span>
                </li>
              </ul>

              {/* Payment Info Section – Added here for user side */}
              {paymentMethod === "Partial-COD" && (
                <div className="mt-5 pt-4 border-top">
                  <h6 className="fw-6 mb-3">Payment Information</h6>

                  <div className="d-flex justify-content-between mb-2">
                    <span>Advance Paid</span>
                    <span className="fw-5">₹{advancePaid.toFixed(2)}</span>
                  </div>

                  {paymentMethod === "Partial-COD" && (
                    <>
                      <div className="d-flex justify-content-between mb-2">
                        <span>COD Charge (included in advance)</span>
                        <span>₹{codChargeCollected.toFixed(0)}</span>
                      </div>

                      <div className="d-flex justify-content-between fw-bold border-top pt-3 mt-3">
                        <span>Remaining Amount to Pay</span>
                        <span>₹{remainingAmount.toFixed(2)}</span>
                      </div>

                      <p className="text-muted small mt-3">
                        You have already paid ₹{advancePaid.toFixed(2)} in
                        advance (including ₹{codChargeCollected.toFixed(0)} COD
                        charge).
                      </p>
                    </>
                  )}

                  {paymentMethod === "Online" && (
                    <div className="d-flex justify-content-between mb-2">
                      <span>Full Amount Paid Online</span>
                      <span className="fw-5">₹{totalAmount.toFixed(2)}</span>
                    </div>
                  )}

                  {paymentMethod === "COD" && (
                    <div className="d-flex justify-content-between mb-2 text-primary">
                      <span>Full Amount to Pay on Delivery</span>
                      <span className="fw-5">₹{totalAmount.toFixed(2)}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Image Modal */}
        <ImageModal
          isOpen={isOpen}
          imageUrls={currentImage}
          onClose={closeModal}
        />
      </div>
    </>
  );
}
