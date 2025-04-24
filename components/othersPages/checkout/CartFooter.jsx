"use client";

import React, { useEffect, useState, useRef } from "react";
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
import FullScreenSpinner from "@/components/common/FullScreenSpinner";
import { Tooltip } from "react-tooltip";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleChevronLeft,
  faCircleChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { validateCartItems } from "@/app/helpers/Cartvalidator";
import toast from "react-hot-toast";
import handleCheckoutSession from "@/utlis/checkoutSession";
const CartFooter = ({
  cartItems,
  subtotal,
  formData,
  email,
  handleSubmit,
  isLoading,
}) => {
  const prevRefs = useRef([]);
  const nextRefs = useRef([]);
  const cartModalref = useRef(null);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const user = useSelector((state) => state.auth.user);
  const router = useRouter();
  const [retryLoading, setRetryLoading] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponError, setCouponError] = useState("");
  const [discount, setDiscount] = useState(0); // 0 or 0.1 (10%)
  const [discountAmount, setDiscountAmount] = useState(0);
  const [discountedTotal, setDiscountedTotal] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("BANK");
  const [razorpayWebhook, { isLoading: webhookLoading }] =
    useRazorpayWebhookMutation();
  const [checkoutSession, { isLoading: sessionLoading, error }] =
    useRazorpayCheckoutSessionMutation();
  const dispatch = useDispatch();
  const isFormValid = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const indiaPhoneRegex = /^[6-9][0-9]{9}$/;
    const uaePhoneRegex =
      /^(50|52|54|55|56|58|3[235678]|6[24578]|7[0245689]|9[2456789])[0-9]{7}$/;

    const trimmedEmail = formData.email?.trim() || "";
    const trimmedPhoneNo = formData.phoneNo?.trim() || "";
    const trimmedZipCode = formData.zipCode?.trim() || "";
    const zipCodeRegex = /^\d+$/;

    return (
      formData.firstName &&
      formData.lastName &&
      formData.address &&
      formData.city &&
      trimmedPhoneNo &&
      trimmedZipCode &&
      emailRegex.test(trimmedEmail) &&
      (uaePhoneRegex.test(trimmedPhoneNo) ||
        indiaPhoneRegex.test(trimmedPhoneNo)) &&
      zipCodeRegex.test(trimmedZipCode)
    );
  };
  const handleApplyCoupon = (e) => {
    e.preventDefault();

    setCouponError("");

    if (
      couponCode.trim().toUpperCase() !== "MIRI2" &&
      couponCode.trim().toUpperCase() !== "SYTRO15"
    ) {
      setCouponError("Invalid coupon code");
      return;
    }

    if (couponCode.trim().toUpperCase() === "MIRI2") {
      const totalQuantity = cartItems.reduce(
        (sum, item) => sum + item.quantity,
        0
      );
      if (totalQuantity <= 1) {
        setCouponError(
          "Total quantity of items must be greater than 1 to apply this coupon"
        );
        toast.error(
          "Total quantity of items must be greater than 1 to apply this coupon"
        );
        setTimeout(() => {
          cartModalref.current?.click();
        }, 400);
        return;
      }
    }

    setCouponApplied(true);
  };

  const handleRazorpayPayment = async () => {
    const fullName = `${formData.firstName} ${formData.lastName}`.trim();
    const finalTotal = discountedTotal || subtotal;

    if (!validateCartItems(cartItems)) {
      return;
    }

    const orderData = {
      orderItems: cartItems,
      shippingInfo: {
        ...formData,
        fullName,
      },
      totalPrice: Number(finalTotal.toFixed(2)),
      currency: "INR",
      itemsPrice: Number(finalTotal.toFixed(2)),
    };
    if (!isFormValid() || !cartItems.length) return;
    let checkoutData;
    try {
      // Pass checkoutSession to handleCheckoutSession
      checkoutData = await handleCheckoutSession(orderData, checkoutSession);
      console.log(checkoutData, "checkoutData");
    } catch (error) {
      // Error is already handled in handleCheckoutSession (Swal alert + API call)
      return; // Exit if checkout fails
    }

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY,
      amount: Number(finalTotal.toFixed(2)) * 100,
      currency: "INR",
      name: "Sytro",
      order_id: checkoutData.id,
      description: "Order Payment",
      image:
        "https://ik.imagekit.io/c1jhxlxiy/logo@2x%20(1).png?updatedAt=1741333514217",
      handler: async function (response) {
        // console.log("Payment successful, verifying with server...", response);
        const fullName = `${formData.firstName} ${formData.lastName}`.trim();
        const paymentData = {
          razorpay_order_id: response.razorpay_order_id,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_signature: response.razorpay_signature,
          shippingInfo: {
            ...formData,
            fullName,
            // email,
          },
          cartItems,
          couponApplied: couponCode || "No",
          itemsPrice: subtotal,
          shippingPrice: 0,
          totalPrice: Number(finalTotal.toFixed(2)),
          taxPrice: 0,
          orderNotes: formData.orderNotes || "",
        };

        try {
          const serverResponse = await razorpayWebhook(paymentData).unwrap();

          if (serverResponse.success) {
            console.log("Payment verified. Order placed");

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
          try {
            setRetryLoading(true); // Start loading

            const backupPaymentData = {
              ...paymentData,
              userId: user?._id,
            };

            const apiResponse = await fetch(
              `${process.env.NEXT_PUBLIC_PAYMENT_URL}/api/order`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify(backupPaymentData),
              }
            );

            const result = await apiResponse.json();
            setRetryLoading(false);
            if (result.success) {
              setRetryLoading(false);
              console.log("retried");
              Swal.fire({
                icon: "success",
                title: "Order Created Successfully!",
                text: "Your order has been placed.",
                confirmButtonText: "OK",
              }).then(() => {
                dispatch(clearCart());
                router.push("/my-account-orders");
              });
            } else {
              console.error("Retry failed:", result.error);
              Swal.fire({
                icon: "error",
                title: "Payment & Retry Failed",
                text: `Please visit the Contact page for assistance. Your order ID: ${
                  response.razorpay_order_id || "Unavailable"
                }`,
                confirmButtonText: "OK",
              });
            }
          } catch (apiError) {
            console.error("Error calling retry API:", apiError);
            Swal.fire({
              icon: "error",
              title: "Payment & Retry Failed",
              text: `Please visit the Contact page for assistance. Your order ID: ${
                response.razorpay_order_id || "Unavailable"
              }`,
              confirmButtonText: "OK",
            });
          } finally {
            setRetryLoading(false);
          }
        }
      },
      prefill: {
        name: `${formData?.firstName} ${formData?.lastName}`,
        email: formData?.email,
        contact: formData?.phoneNo,
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
    // console.log(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    let newDiscount = 0;
    if (couponApplied) {
      newDiscount = couponCode.trim().toUpperCase() === "SYTRO15" ? 0.15 : 0.1;
    }
    const newDiscountAmount = subtotal * newDiscount;
    const newDiscountedTotal = subtotal - newDiscountAmount;

    setDiscount(newDiscount);
    setDiscountAmount(newDiscountAmount);
    setDiscountedTotal(newDiscountedTotal);
  }, [couponApplied, subtotal, couponCode]);

  const isAnyLoading =
    isLoading || sessionLoading || webhookLoading || retryLoading;
  return (
    <>
      {isAnyLoading && <FullScreenSpinner />}
      <div className="tf-page-cart-footer">
        <div className="tf-cart-footer-inner">
          <h5 className="fw-5 mb_20">Your order</h5>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              paymentMethod === "BANK"
                ? handleRazorpayPayment()
                : handleSubmit();
            }}
            className="tf-page-cart-checkout widget-wrap-checkout"
          >
            <ul className="wrap-checkout-product">
              {cartItems.map((elm, i) => {
                prevRefs.current[i] = prevRefs.current[i] || React.createRef();
                nextRefs.current[i] = nextRefs.current[i] || React.createRef();
                return (
                  <li
                    key={i}
                    className="d-flex flex-column border-black border p-2 rounded-2 gap-1 mb-2"
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
                        <span className="quantity bg-warning">
                          {elm.quantity}
                        </span>
                      </figure>
                      <div className="content">
                        <div className="info">
                          <p className="name" style={{ paddingRight: "10px" }}>
                            {elm.name}
                          </p>
                        </div>
                        <span className="price">
                          ₹{(elm.price * elm.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                    <div
                      style={{ width: "fit-content", gap: "0" }}
                      className="checkout-product-item flex-column justify-content-start"
                    >
                      <Swiper
                        modules={[Navigation, Pagination]}
                        spaceBetween={10}
                        slidesPerView={1}
                        navigation={{
                          prevEl: prevRefs.current[i].current,
                          nextEl: nextRefs.current[i].current,
                        }}
                        onBeforeInit={(swiper) => {
                          swiper.params.navigation.prevEl =
                            prevRefs.current[i].current;
                          swiper.params.navigation.nextEl =
                            nextRefs.current[i].current;
                        }}
                        style={{
                          width: "100px",
                          height: "100px",
                        }}
                      >
                        {elm.uploadedImage.map((url, index) => (
                          <SwiperSlide
                            key={index}
                            className="position-relative border p-1"
                          >
                            <Image
                              src={url}
                              alt={`Uploaded image ${index + 1} for ${
                                elm.name
                              }`}
                              width={100}
                              height={100}
                              className="popover-image"
                              style={{
                                objectFit: "contain",
                                width: "100%",
                                height: "100%",
                              }}
                            />
                            <div
                              style={{
                                fontSize: "10px",
                                height: "fit-content",
                              }}
                              className="position-absolute text-white p-1  rounded-circle top-0 left-0 bg-black bg-opacity-75"
                            >
                              {index + 1}/{elm.uploadedImage?.length}
                            </div>
                          </SwiperSlide>
                        ))}
                        <button
                          ref={prevRefs.current[i]}
                          type="button"
                          role="button"
                          className="nav-btn prev-btn"
                        >
                          <FontAwesomeIcon
                            icon={faCircleChevronLeft}
                            size="sm"
                          />
                        </button>
                        <button
                          ref={nextRefs.current[i]}
                          type="button"
                          role="button"
                          className="nav-btn next-btn"
                        >
                          <FontAwesomeIcon
                            icon={faCircleChevronRight}
                            size="sm"
                          />
                        </button>
                      </Swiper>
                      <div className="content">
                        <div className="info">
                          <p className="name ps-2">Uploaded image</p>
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>

            {!cartItems.length && (
              <div className="container">
                <div className="row align-items-center mt-5 mb-5">
                  <div className="col-12 fs-18">Your shop cart is empty</div>
                  <div className="col-12 mt-3">
                    <Link
                      href={`/shop-collection-sub`}
                      className="tf-btn btn-fill animate-hover-btn radius-3 w-100"
                    >
                      Explore Products!
                    </Link>
                  </div>
                </div>
              </div>
            )}
            <div className="d-flex flex-column">
              {!couponApplied && (
                <div className="coupon-box">
                  <input
                    type="text"
                    placeholder="Discount code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                  />
                  <a
                    href="#"
                    className="tf-btn btn-sm radius-3 btn-fill btn-icon animate-hover-btn"
                    onClick={handleApplyCoupon}
                  >
                    Apply
                  </a>
                </div>
              )}
              {couponError && (
                <p className="error" style={{ color: "red" }}>
                  {couponError}
                </p>
              )}
              {couponApplied && (
                <p className="success" style={{ color: "green" }}>
                  Coupon {couponCode} applied successfully!
                </p>
              )}
            </div>

            <div className="order-summary">
              <div className="d-flex justify-content-between line  py-4">
                <h6 className="fw-5">Subtotal</h6>
                <h6 className="fw-5">₹{subtotal.toFixed(2)}</h6>
              </div>
              {couponApplied && (
                <div className="d-flex justify-content-between line py-4">
                  <h6 className="fw-5">
                    Discount ({couponCode === "SYTRO15" ? "15%" : "10%"})
                  </h6>
                  <h6 className="fw-5">-₹{discountAmount.toFixed(2)}</h6>
                </div>
              )}
              <div className="d-flex justify-content-between line py-4">
                <h6 className="fw-5">Total</h6>
                <h6 className="total fw-5">₹{discountedTotal.toFixed(2)}</h6>
              </div>
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
              <>
                <small className="text-danger">
                  You need to log in in order to purchase.
                </small>
                <a
                  href="#login"
                  data-bs-toggle="modal"
                  className="tf-btn radius-3 btn-fill btn-icon animate-hover-btn justify-content-center mt-0"
                >
                  Click here to login
                </a>
              </>
            ) : (
              <button
                type="submit"
                disabled={isLoading || !isFormValid() || !cartItems.length}
                className={`tf-btn radius-3 btn-fill btn-icon animate-hover-btn justify-content-center ${
                  isAnyLoading || !isFormValid() || !cartItems.length
                    ? "disabled-btn"
                    : ""
                }`}
                data-tooltip-id="cart-tooltip"
                data-tooltip-content={
                  isAnyLoading
                    ? "Processing..."
                    : !isFormValid()
                    ? "Fill all the details correctly"
                    : !cartItems.length
                    ? "Cart is empty"
                    : ""
                }
              >
                {isLoading
                  ? "Processing..."
                  : paymentMethod === "BANK"
                  ? "Go to payment"
                  : "Place order"}
              </button>
            )}
            <Tooltip id="cart-tooltip" place="top" />
          </form>
          <a
            ref={cartModalref}
            href="#shoppingCart"
            style={{ display: "none" }}
            data-bs-toggle="modal"
          >
            <span className="sr-only">cart modal</span>
          </a>
        </div>
      </div>
    </>
  );
};

export default CartFooter;
