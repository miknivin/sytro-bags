"use client"

import React from "react";
import Image from "next/image";
import Link from "next/link";
import Rupee from "@/utlis/Rupeesvg";
import { useSelector } from "react-redux";

const CartFooter = ({ 
  cartItems, 
  subtotal, 
  formData, 
  email, 
  handleSubmit,
  isLoading 
}) => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  // Check if form is valid
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

  return (
    <div className="tf-page-cart-footer">
      <div className="tf-cart-footer-inner">
        <h5 className="fw-5 mb_20">Your order</h5>
        <form onSubmit={handleSubmit} className="tf-page-cart-checkout widget-wrap-checkout">
          <ul className="wrap-checkout-product">
            {cartItems.map((elm, i) => (
              <li key={i} className="checkout-product-item">
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
                  <span
                    className="price"
                    style={{ display: "inline-flex", alignItems: "center" }}
                  >
                    <Rupee width={"8px"} />
                    {(elm.price * elm.quantity).toFixed(2)}
                  </span>
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

          <div className="coupon-box">
            <input type="text" placeholder="Discount code" />
            <a
              href="#"
              className="tf-btn btn-sm radius-3 btn-fill btn-icon animate-hover-btn"
            >
              Apply
            </a>
          </div>

          <div className="d-flex justify-content-between line pb_20">
            <h6 className="fw-5">Total</h6>
            <h6
              className="total fw-5"
              style={{ display: "inline-flex", alignItems: "center" }}
            >
              <Rupee width="8px" />
              {subtotal}
            </h6>
          </div>

          <div className="wd-check-payment">
            <div className="fieldset-radio mb_20">
              <input
                type="radio"
                name="paymentMethod"
                id="bank"
                value="BANK"
                disabled
                className="tf-check"
                onChange={(e) => formData.paymentMethod = e.target.value}
              />
              <label htmlFor="bank">Direct bank transfer</label>
            </div>
            <div className="fieldset-radio mb_20">
              <input
                required
                type="radio"
                name="paymentMethod"
                id="delivery"
                value="COD"
                className="tf-check"
                defaultChecked
                onChange={(e) => formData.paymentMethod = e.target.value}
              />
              <label htmlFor="delivery">Cash on delivery</label>
            </div>
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
              className="tf-btn radius-3 btn-fill btn-icon animate-hover-btn justify-content-center"
            >
              {isLoading ? "Processing..." : "Place order"}
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default CartFooter;