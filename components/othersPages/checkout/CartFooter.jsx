"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import {
  useRazorpayCheckoutSessionMutation,
  useRazorpayWebhookMutation,
} from "@/redux/api/orderApi";
import Swal from "sweetalert2";
import { clearCart } from "@/redux/features/cartSlice";
const CartFooter = ({
  cartItems,
  subtotal,
  formData,
  email,
  handleSubmit,
  isLoading,
}) => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const router = useRouter();
  const [paymentMethod, setPaymentMethod] = useState("BANK");
  const [razorpayWebhook] = useRazorpayWebhookMutation();
  const [checkoutSession, { isLoading: sessionLoading, error }] =
    useRazorpayCheckoutSessionMutation();
  const dispatch = useDispatch();
  const isFormValid = () => {
    return (
      formData.firstName &&
      formData.lastName &&
      formData.address &&
      formData.city &&
      formData.phoneNo &&
      formData.zipCode &&
      email
    );
  };

  const handleRazorpayPayment = async () => {
    const orderData = {
      orderItems: cartItems,
      currency: "INR",
      itemsPrice: Math.trunc(subtotal),
    };
    const checkoutData = await checkoutSession({
      orderData,
    }).unwrap();
    if (!isFormValid() || !cartItems.length) return;

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY,
      amount: subtotal * 100,
      currency: "INR",
      name: "Sytro",
      order_id: checkoutData.id,
      description: "Order Payment",
      image:
        "https://ik.imagekit.io/c1jhxlxiy/logo@2x%20(1).png?updatedAt=1741333514217",
      handler: async function (response) {
        console.log("Payment successful, verifying with server...", response);

        const paymentData = {
          razorpay_order_id: response.razorpay_order_id,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_signature: response.razorpay_signature,
          shippingInfo: formData,
          cartItems,
          itemsPrice: subtotal,
          shippingPrice: 0,
          totalPrice: subtotal + 0,
          taxPrice: 0,
        };

        try {
          const serverResponse = await razorpayWebhook(paymentData).unwrap();

          if (serverResponse.success) {
            console.log("Payment verified. Order placed:", serverResponse);

            Swal.fire({
              icon: "success",
              title: "Order Placed Successfully!",
              text: "Thank you for your purchase. Your order has been placed.",
              confirmButtonText: "OK",
            }).then(() => {
              dispatch(clearCart());
              router.push("/my-account-orders");
            });
          } else {
            console.error("Payment verification failed:", serverResponse.error);
            alert("Payment verification failed. Please contact support.");
          }
        } catch (error) {
          console.error("Error verifying payment:", error);
          alert("Error verifying payment. Please try again.");
        }
      },
      prefill: {
        name: `${formData.firstName} ${formData.lastName}`,
        email: email,
        contact: formData.phoneNo,
      },
      theme: {
        color: "#fbb52b",
      },
    };

    const razor = new window.Razorpay(options);
    razor.open();
  };

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    console.log(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div className="tf-page-cart-footer">
      <div className="tf-cart-footer-inner">
        <h5 className="fw-5 mb_20">Your order</h5>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            console.log("clicked");

            paymentMethod === "BANK" ? handleRazorpayPayment() : handleSubmit();
          }}
          className="tf-page-cart-checkout widget-wrap-checkout"
        >
          <ul className="wrap-checkout-product">
            {cartItems.map((elm, i) => (
              <li
                key={i}
                className="d-flex flex-column border-black border p-2 rounded-2"
              >
                <div className="checkout-product-item">
                  <figure className="img-product">
                    <Image
                      style={{ borderRadius: "10px" }}
                      alt="product"
                      src={elm.image}
                      width={720}
                      height={1005}
                    />
                    <span className="quantity bg-warning">{elm.quantity}</span>
                  </figure>
                  <div className="content">
                    <div className="info">
                      <p className="name">{elm.name}</p>
                    </div>
                    <span className="price">
                      ₹{(elm.price * elm.quantity).toFixed(2)}
                    </span>
                  </div>
                </div>
                <div className="checkout-product-item">
                  <figure className="img-product">
                    <Image
                      style={{ borderRadius: "10px" }}
                      alt="product"
                      src={elm.uploadedImage}
                      width={720}
                      height={1005}
                    />
                  </figure>
                  <div className="content">
                    <div className="info">
                      <p className="name">Uploaded image</p>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          {!cartItems.length && (
            <div className="container">
              <div className="row align-items-center mt-5 mb-5">
                <div className="col-12 fs-18">Your shop cart is empty</div>
                <div className="col-12 mt-3">
                  <Link
                    href={`/shop-default`}
                    className="tf-btn btn-fill animate-hover-btn radius-3 w-100"
                  >
                    Explore Products!
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* <div className="coupon-box">
            <input type="text" placeholder="Discount code" />
            <a
              href="#"
              className="tf-btn btn-sm radius-3 btn-fill btn-icon animate-hover-btn"
            >
              Apply
            </a>
          </div> */}

          <div className="d-flex justify-content-between line pb_20">
            <h6 className="fw-5">Total</h6>
            <h6 className="total fw-5">₹{subtotal}</h6>
          </div>

          <div className="wd-check-payment">
            <div className="fieldset-radio mb_20">
              <input
                type="radio"
                name="paymentMethod"
                id="bank"
                value="BANK"
                className="tf-check d-flex align-items-center"
                checked={paymentMethod === "BANK"}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              <label htmlFor="bank">Online transfer</label>
            </div>
            {/* <div className="fieldset-radio mb_20">
              <input
                required
                type="radio"
                name="paymentMethod"
                id="delivery"
                value="COD"
                className="tf-check"
                checked={paymentMethod === "COD"}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              <label htmlFor="delivery">Cash on delivery</label>
            </div> */}
          </div>

          {!isAuthenticated ? (
            <a
              href="#login"
              data-bs-toggle="modal"
              className="tf-btn radius-3 btn-fill btn-icon animate-hover-btn justify-content-center"
            >
              Place order
            </a>
          ) : (
            <button
              type="submit"
              disabled={isLoading || !isFormValid() || !cartItems.length}
              className={`tf-btn radius-3 btn-fill btn-icon animate-hover-btn justify-content-center ${
                isLoading || !isFormValid() || !cartItems.length
                  ? "disabled-btn"
                  : ""
              }`}
            >
              {isLoading
                ? "Processing..."
                : paymentMethod === "BANK"
                ? "Go to payment"
                : "Place order"}
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default CartFooter;
