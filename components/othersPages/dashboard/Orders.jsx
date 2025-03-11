"use client";
import React from "react";
import Link from "next/link";
import { useMyOrdersQuery } from "@/redux/api/orderApi"; // Adjust the import path based on your project structure

export default function Orders() {
  const { data, isLoading, isError, error } = useMyOrdersQuery();
  const orders = Array.isArray(data?.orders) ? data.orders : [];

  if (isLoading) {
    return <p>Loading orders...</p>;
  }

  if (isError) {
    console.error("Error fetching orders");
    console.log(error);
    return (
      <p className="fs-3 text-danger text-center">
        {error.data.message || "Error loading orders"}
      </p>
    );
  }

  // Function to check if the order date is today
  const isToday = (date) => {
    const today = new Date();
    const orderDate = new Date(date);
    return (
      orderDate.getDate() === today.getDate() &&
      orderDate.getMonth() === today.getMonth() &&
      orderDate.getFullYear() === today.getFullYear()
    );
  };

  return (
    <div className="my-account-content account-order">
      <div className="wrap-account-order">
        <table>
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
            {orders?.length > 0 ? (
              orders.map((order) => (
                <tr key={order.id} className="tf-order-item">
                  <td>#{order._id.slice(-6)}</td>
                  <td>
                    {order?.createdAt && (
                      <>
                        {new Date(order.createdAt).toLocaleDateString()}{" "}
                        {isToday(order.createdAt) && (
                          <span className="badge badge-warning text-black">
                            New
                          </span>
                        )}
                      </>
                    )}
                  </td>

                  <td>{order?.orderStatus}</td>
                  <td>
                    ₹{order?.totalAmount} for {order?.orderItems.length} items
                  </td>
                  <td>
                    <Link
                      href={`/my-account-orders-details?orderId=${order._id}`}
                      className="tf-btn btn-fill animate-hover-btn rounded-0 justify-content-center"
                    >
                      <span>View</span>
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center">
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
