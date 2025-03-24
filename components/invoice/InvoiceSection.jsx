"use client";
import { useRef } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export default function InvoiceSection() {
  const invoiceRef = useRef(null);

  const handlePrintInvoice = async (e) => {
    e.preventDefault();
    if (invoiceRef.current) {
      try {
        const element = invoiceRef.current;

        const originalOverflow = element.style.overflowX;
        element.style.overflowX = "visible";

        const canvas = await html2canvas(element, {
          scale: 2, // Higher resolution
          useCORS: true, // Handle external images
          width: element.scrollWidth, // Capture full width
          height: element.scrollHeight, // Capture full height
          windowWidth: element.scrollWidth, // Ensure viewport matches content
        });

        // Restore original overflow
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
        pdf.save("invoice.pdf");
      } catch (error) {
        console.error("Failed to generate invoice PDF:", error);
      }
    }
  };

  return (
    <section className="invoice-section" style={{ padding: "20px" }}>
      <div
        className="cus-container2"
        style={{
          width: "900px",
          margin: "0 auto",
          maxWidth: "100%",
        }}
      >
        <div
          className="top"
          style={{ marginBottom: "20px", textAlign: "right" }}
        >
          <a
            href="#"
            className="tf-btn btn-fill animate-hover-btn"
            onClick={handlePrintInvoice}
          >
            Print this invoice
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
                    src="images/logo/logo.svg"
                    alt="logo"
                    className="logo"
                    style={{ height: "50px" }}
                  />
                </a>
              </div>
              <div className="box-right" style={{ textAlign: "right" }}>
                <div
                  className="d-flex justify-content-between align-items-center flex-wrap"
                  style={{ display: "flex", alignItems: "center", gap: "10px" }}
                >
                  <div
                    className="title"
                    style={{ fontSize: "18px", fontWeight: "bold" }}
                  >
                    Invoice #
                  </div>
                  <span className="code-num" style={{ fontSize: "16px" }}>
                    0043128641
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
                  03/10/2024
                </span>
              </div>
              <div className="box-right" style={{ textAlign: "right" }}>
                <label htmlFor="" style={{ display: "block" }}>
                  Due date:
                </label>
                <span className="date" style={{ fontSize: "14px" }}>
                  03/10/2024
                </span>
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
                  Jobio LLC
                </div>
                <p className="desc" style={{ fontSize: "14px", lineHeight: "1.5" }}>
                  2301 Ravenswood Rd Madison,
                  <br /> WI 53711
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
                  John Doe
                </div>
                <p className="desc" style={{ fontSize: "14px", lineHeight: "1.5" }}>
                  329 Queensberry Street, North Melbourne <br /> VIC 3051,
                  Australia.
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
                      VAT (20%)
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
                  <tr
                    className="content"
                    style={{ borderBottom: "1px solid #e0e0e0" }}
                  >
                    <td style={{ padding: "10px" }}>Standard Plan</td>
                    <td style={{ padding: "10px" }}>$443.00</td>
                    <td style={{ padding: "10px" }}>$921.80</td>
                    <td style={{ padding: "10px" }}>$9243</td>
                  </tr>
                  <tr
                    className="content"
                    style={{ borderBottom: "1px solid #e0e0e0" }}
                  >
                    <td style={{ padding: "10px" }}>Extra Plan</td>
                    <td style={{ padding: "10px" }}>$413.00</td>
                    <td style={{ padding: "10px" }}>$912.80</td>
                    <td style={{ padding: "10px" }}>$5943</td>
                  </tr>
                  <tr className="content">
                    <td
                      className="total"
                      style={{ padding: "10px", fontWeight: "bold" }}
                    >
                      Total Due
                    </td>
                    <td style={{ padding: "10px" }}></td>
                    <td style={{ padding: "10px" }}></td>
                    <td
                      className="total"
                      style={{ padding: "10px", fontWeight: "bold" }}
                    >
                      $9,750
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
                www.ecomus.com
              </li>
              <li style={{ display: "inline", marginRight: "20px" }}>
                invoice@ecomus.com
              </li>
              <li style={{ display: "inline" }}>(123) 123-456</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}