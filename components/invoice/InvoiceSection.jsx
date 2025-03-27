"use client";
import { useEffect, useRef, useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useOrderDetailsQuery } from "@/redux/api/orderApi";
import Link from "next/link";
export default function InvoiceSection({ orderId }) {
  const invoiceRef = useRef(null);
  const [order, setOrder] = useState(null);
  const { data, error, isLoading } = useOrderDetailsQuery(orderId);
  useEffect(() => {
    setOrder(data?.order);
  }, [data]);
  const handlePrintInvoice = async (e) => {
    e.preventDefault();
    if (invoiceRef.current) {
      try {
        const element = invoiceRef.current;
        const originalOverflow = element.style.overflowX;
        element.style.overflowX = "visible";

        const canvas = await html2canvas(element, {
          scale: 2,
          useCORS: true,
          width: element.scrollWidth,
          height: element.scrollHeight,
          windowWidth: element.scrollWidth,
        });

        element.style.overflowX = originalOverflow;

        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF({
          orientation: "portrait",
          unit: "px",
          format: "a4",
        });

        const imgWidth = canvas.width;
        const imgHeight = canvas.height;
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
        const width = imgWidth * ratio;
        const height = imgHeight * ratio;

        pdf.addImage(imgData, "PNG", 0, 0, width, height);
        pdf.save(`invoice-${order?._id?.slice(-6) || "unknown"}.pdf`);
      } catch (error) {
        console.error("Failed to generate invoice PDF:", error);
      }
    }
  };

  if (isLoading)
    return (
      <div>
        <div className="spinner-border text-secondary" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  if (error) return <div>Error loading invoice: {error.message}</div>;
  if (!order) return <div>No order data available</div>;

  return (
    <section className="invoice-section" style={{ padding: "20px" }}>
      <div
        className="cus-container2"
        style={{ width: "900px", margin: "0 auto", maxWidth: "100%" }}
      >
        <div
          className="top d-flex align-items-center justify-content-between"
          style={{ marginBottom: "20px", textAlign: "right" }}
        >
          <Link
            className="tf-btn btn-fill animate-hover-btn rounded-0 justify-content-center"
            href={"/my-account-orders"}
          >
            Go back
          </Link>

          <a
            href="#"
            className="tf-btn btn-fill animate-hover-btn"
            onClick={handlePrintInvoice}
          >
            Print
          </a>
        </div>
        <div
          className="box-invoice"
          ref={invoiceRef}
          style={{
            width: "100%",
            overflowX: "auto",
            border: "1px solid #e0e0e0",
            borderRadius: "5px",
            backgroundColor: "#fff",
          }}
        >
          <div
            className="header"
            style={{ padding: "20px", minWidth: "850px" }}
          >
            <div
              className="wrap-top"
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "20px",
              }}
            >
              <div className="box-left">
                <a href="index.html">
                  <img
                    src="/images/logo/logo@2x.png"
                    alt="logo"
                    className="logo"
                    style={{ height: "50px" }}
                  />
                </a>
              </div>
              <div className="box-right" style={{ textAlign: "right" }}>
                <div
                  className="d-flex justify-content-end align-items-center flex-wrap"
                  style={{ display: "flex", alignItems: "center", gap: "10px" }}
                >
                  <div
                    className="title"
                    style={{ fontSize: "18px", fontWeight: "bold" }}
                  >
                    Invoice #
                  </div>
                  <span className="code-num" style={{ fontSize: "16px" }}>
                    {order._id.slice(-6) || "N/A"}
                  </span>
                </div>
              </div>
            </div>
            <div
              className="wrap-date"
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "20px",
              }}
            >
              <div className="box-left">
                <label htmlFor="" style={{ display: "block" }}>
                  Invoice date:
                </label>
                <span className="date" style={{ fontSize: "14px" }}>
                  {new Date(order.createdAt).toLocaleDateString() || "N/A"}
                </span>
              </div>
              <div className="box-right" style={{ textAlign: "right" }}>
                {/* <label htmlFor="" style={{ display: "block" }}>
                  Due date:
                </label>
                <span className="date" style={{ fontSize: "14px" }}>
                  {order.deliveredAt
                    ? new Date(order.deliveredAt).toLocaleDateString()
                    : "N/A"}
                </span> */}
              </div>
            </div>
            <div
              className="wrap-info"
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "20px",
              }}
            >
              <div className="box-left">
                <div
                  className="title"
                  style={{ fontSize: "18px", fontWeight: "bold" }}
                >
                  Supplier
                </div>
                <div
                  className="sub"
                  style={{ fontSize: "16px", marginBottom: "5px" }}
                >
                  Sytro bags
                </div>
                <p
                  className="desc"
                  style={{ fontSize: "14px", lineHeight: "1.5" }}
                >
                  Panakal tower, North Basin Road Broadway, <br /> Kochi, Kerala
                  682031
                </p>
              </div>
              <div className="box-right" style={{ textAlign: "right" }}>
                <div
                  className="title"
                  style={{ fontSize: "18px", fontWeight: "bold" }}
                >
                  Customer
                </div>
                <div
                  className="sub"
                  style={{ fontSize: "16px", marginBottom: "5px" }}
                >
                  {order.shippingInfo?.fullName || "N/A"}
                </div>
                <p
                  className="desc"
                  style={{ fontSize: "14px", lineHeight: "1.5" }}
                >
                  {order.shippingInfo?.address || "N/A"},{" "}
                  {order.shippingInfo?.city || "N/A"}
                  <br />
                  {(order.shippingInfo?.state || "") &&
                    `${order.shippingInfo.state} `}
                  {order.shippingInfo?.zipCode || "N/A"}
                  <br />
                  {order.shippingInfo?.country || "N/A"}
                </p>
              </div>
            </div>
            <div className="wrap-table-invoice">
              <table
                className="invoice-table"
                style={{ width: "100%", borderCollapse: "collapse" }}
              >
                <thead>
                  <tr
                    className="title"
                    style={{ backgroundColor: "#f5f5f5", textAlign: "left" }}
                  >
                    <th
                      style={{
                        padding: "10px",
                        borderBottom: "1px solid #e0e0e0",
                      }}
                    >
                      Description
                    </th>
                    <th
                      style={{
                        padding: "10px",
                        borderBottom: "1px solid #e0e0e0",
                      }}
                    >
                      Price
                    </th>
                    <th
                      style={{
                        padding: "10px",
                        borderBottom: "1px solid #e0e0e0",
                      }}
                    >
                      Quantity
                    </th>
                    <th
                      style={{
                        padding: "10px",
                        borderBottom: "1px solid #e0e0e0",
                      }}
                    >
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {order.orderItems?.map((item, index) => (
                    <tr
                      key={index}
                      className="content"
                      style={{ borderBottom: "1px solid #e0e0e0" }}
                    >
                      <td style={{ padding: "10px" }}>{item.name || "N/A"}</td>
                      <td style={{ padding: "10px" }}>
                        ₹{parseFloat(item.price).toFixed(2) || "0.00"}
                      </td>
                      <td style={{ padding: "10px" }}>
                        {item.quantity || "0"}
                      </td>
                      <td style={{ padding: "10px" }}>
                        ₹
                        {(parseFloat(item.price) * item.quantity).toFixed(2) ||
                          "0.00"}
                      </td>
                    </tr>
                  ))}
                  <tr className="content">
                    <td
                      className="total"
                      style={{ padding: "10px", fontWeight: "bold" }}
                    >
                      Subtotal
                    </td>
                    <td style={{ padding: "10px" }}></td>
                    <td style={{ padding: "10px" }}></td>
                    <td style={{ padding: "10px" }}>
                      ₹{order.itemsPrice?.toFixed(2) || "0.00"}
                    </td>
                  </tr>
                  <tr className="content">
                    <td className="total" style={{ padding: "10px" }}>
                      Tax
                    </td>
                    <td style={{ padding: "10px" }}></td>
                    <td style={{ padding: "10px" }}></td>
                    <td style={{ padding: "10px" }}>
                      ₹{order.taxAmount?.toFixed(2) || "0.00"}
                    </td>
                  </tr>
                  <tr className="content">
                    <td className="total" style={{ padding: "10px" }}>
                      Shipping
                    </td>
                    <td style={{ padding: "10px" }}></td>
                    <td style={{ padding: "10px" }}></td>
                    <td style={{ padding: "10px" }}>
                      ₹{order.shippingAmount?.toFixed(2) || "0.00"}
                    </td>
                  </tr>
                  <tr className="content">
                    <td
                      className="total"
                      style={{ padding: "10px", fontWeight: "bold" }}
                    >
                      Total
                    </td>
                    <td style={{ padding: "10px" }}></td>
                    <td style={{ padding: "10px" }}></td>
                    <td
                      className="total"
                      style={{ padding: "10px", fontWeight: "bold" }}
                    >
                      ₹{order.totalAmount?.toFixed(2) || "0.00"}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div
            className="footer"
            style={{ padding: "20px", textAlign: "center", minWidth: "850px" }}
          >
            <ul
              className="box-contact"
              style={{
                listStyle: "none",
                padding: 0,
                margin: 0,
                fontSize: "14px",
              }}
            >
              <li style={{ display: "inline", marginRight: "20px" }}>
                www.sytrobags.com
              </li>
              <li style={{ display: "inline", marginRight: "20px" }}>
                sytrobags@gmail.com
              </li>
              <li style={{ display: "inline" }}>+91 9567678465</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
