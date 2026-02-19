"use client";

import React from "react";
import Link from "next/link";
import { toast } from "react-hot-toast";
import {
  useMyOrdersQuery,
  useLazyGetInvoiceUrlQuery,
} from "@/redux/api/orderApi"; // adjust path if needed

export default function Orders() {
  const { data, isLoading, isError, error } = useMyOrdersQuery();
  const orders = Array.isArray(data?.orders) ? data.orders : [];

  const [triggerGetInvoice, { isLoading: isInvoiceLoading }] =
    useLazyGetInvoiceUrlQuery();

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

  // Helper: check if order date is today
  const isToday = (dateStr) => {
    const today = new Date();
    const orderDate = new Date(dateStr);
    return (
      orderDate.getDate() === today.getDate() &&
      orderDate.getMonth() === today.getMonth() &&
      orderDate.getFullYear() === today.getFullYear()
    );
  };

  if (isLoading) {
    return <p className="text-center py-8">Loading your orders...</p>;
  }

  if (isError) {
    console.error("Orders fetch error:", error);
    return (
      <p className="fs-3 text-danger text-center py-8">
        {error?.data?.message || "Failed to load orders"}
      </p>
    );
  }

  return (
    <div className="my-account-content account-order">
      <div className="wrap-account-order">
        <table className="w-full">
          <thead>
            <tr>
              <th className="fw-6">Order</th>
              <th className="fw-6">Date</th>
              <th className="fw-6">Status</th>
              <th className="fw-6">Total</th>
              <th className="fw-6">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.length > 0 ? (
              orders.map((order) => (
                <tr key={order._id} className="tf-order-item">
                  <td>#{order._id.slice(-6)}</td>

                  <td>
                    {order?.createdAt && (
                      <>
                        {new Date(order.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}{" "}
                        {isToday(order.createdAt) && (
                          <span className="badge badge-warning text-black ms-2">
                            New
                          </span>
                        )}
                      </>
                    )}
                  </td>

                  <td>{order?.orderStatus || "—"}</td>

                  <td>
                    ₹
                    {order?.totalAmount?.toLocaleString("en-IN") ||
                      order?.totalAmount ||
                      "—"}{" "}
                    for {order?.orderItems?.length || 0} item
                    {(order?.orderItems?.length ?? 0) !== 1 ? "s" : ""}
                  </td>

                  <td>
                    <div className="d-flex gap-3 flex-wrap">
                      <Link
                        href={`/my-account-orders-details?orderId=${order._id}`}
                        className="tf-btn btn-fill animate-hover-btn rounded-0 justify-content-center"
                      >
                        View
                      </Link>

                      <button
                        type="button"
                        onClick={() => handleDownloadInvoice(order._id)}
                        disabled={isInvoiceLoading}
                        className="tf-btn border-black animate-hover-btn rounded-0 justify-content-center"
                      >
                        {isInvoiceLoading ? "Downloading..." : "Invoice"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center py-8">
                  No orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
