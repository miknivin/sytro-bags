"use client";
import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import {
  useRazorpayCheckoutSessionMutation,
  useRazorpayWebhookMutation,
  useRazorpayAdvanceCheckoutSessionMutation,
  useRazorpayAdvanceWebhookMutation,
  useCheckCouponMutation,
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

// Import COD_CHARGE
import { COD_CHARGE } from "@/lib/constants/constants";

const CartFooter = ({
  cartItems,
  subtotal,
  discountAmount,
  totalAmount: baseTotalAmount, // renamed to avoid confusion
  appliedCoupon,
  setAppliedCoupon,
  formData,
  email,
  handleSubmit,
  isLoading,
}) => {
  const prevRefs = useRef([]);
  const nextRefs = useRef([]);
  const buttonRef = useRef(null);
  const cartModalref = useRef(null);
  const hasClickedRef = useRef(false);

  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const user = useSelector((state) => state.auth.user);
  const router = useRouter();
  const dispatch = useDispatch();
  const searchParams = useSearchParams();

  const [couponCode, setCouponCode] = useState("");
  const [couponError, setCouponError] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("BANK");

  // RTK Query hooks
  const [createFullSession, { isLoading: fullSessionLoading }] =
    useRazorpayCheckoutSessionMutation();
  const [verifyFullPayment, { isLoading: fullWebhookLoading }] =
    useRazorpayWebhookMutation();
  const [createAdvanceSession, { isLoading: advanceSessionLoading }] =
    useRazorpayAdvanceCheckoutSessionMutation();
  const [verifyAdvancePayment, { isLoading: advanceWebhookLoading }] =
    useRazorpayAdvanceWebhookMutation();
  const [checkCoupon, { isLoading: isCheckingCoupon }] =
    useCheckCouponMutation();

  // Calculate final totalAmount based on payment method

  const isFormValid = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const indiaPhoneRegex = /^[6-9][0-9]{9}$/;
    const uaePhoneRegex =
      /^(50|52|54|55|56|58|3[235678]|6[24578]|7[0245689]|9[2456789])[0-9]{7}$/;
    const indianPinCodeRegex = /^[1-9][0-9]{5}$/; // Strict 6-digit Indian PIN code regex

    const trimmedEmail = formData.email?.trim() || "";
    const trimmedPhoneNo = formData.phoneNo?.trim() || "";
    const trimmedZipCode = formData.zipCode?.trim() || "";

    return (
      formData.firstName &&
      formData.address &&
      formData.city &&
      trimmedPhoneNo &&
      trimmedZipCode &&
      emailRegex.test(trimmedEmail) &&
      (uaePhoneRegex.test(trimmedPhoneNo) ||
        indiaPhoneRegex.test(trimmedPhoneNo)) &&
      indianPinCodeRegex.test(trimmedZipCode)
    );
  };

  const hasRestrictedCategory = cartItems.some(
    (item) =>
      item.category === "Kids Bags" || item.category === "custom_sling_bag",
  );

  const finalTotalAmount = (() => {
    let base = baseTotalAmount - (discountAmount || 0);

    // Add COD charge ONLY for normal COD (not Partial-COD or Online)
    if (paymentMethod === "COD" && !hasRestrictedCategory) {
      base += COD_CHARGE;
    }

    return base;
  })();

  // Rounding logic for Partial-COD only
  const half = baseTotalAmount * 0.5;
  const roundedAdvanceBase = Math.ceil(half);
  const advanceAmount = hasRestrictedCategory
    ? roundedAdvanceBase + COD_CHARGE
    : 0;

  const remainingAmount = hasRestrictedCategory
    ? baseTotalAmount - roundedAdvanceBase
    : 0;

  const roundOffAdded = roundedAdvanceBase - half;

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    setCouponError("");
    if (!couponCode.trim()) {
      setCouponError("Please enter a coupon code");
      return;
    }
    try {
      const result = await checkCoupon({
        code: couponCode.trim(),
        subtotal,
      }).unwrap();
      if (result.success) {
        setAppliedCoupon(result.coupon);
        toast.success("Coupon applied successfully!");
      } else {
        setCouponError(result.message || "Invalid coupon code");
      }
    } catch (err) {
      setCouponError(err.data?.message || "Error validating coupon");
    }
  };

  const handleRazorpayPayment = async () => {
    // Validation for custom sling bags
    const invalidSlingBags = cartItems.filter(
      (item) =>
        item.category === "custom_sling_bag" &&
        (!item.customNameToPrint || item.customNameToPrint.trim() === ""),
    );
    if (invalidSlingBags.length > 0) {
      const names = invalidSlingBags.map((item) => item.name).join(", ");
      Swal.fire({
        icon: "error",
        title: "Invalid Order",
        text: `Please provide a name for: ${names}`,
        confirmButtonText: "OK",
      });
      cartModalref.current?.click();
      return;
    }

    if (!validateCartItems(cartItems)) return;

    const fullName = `${formData.firstName} ${formData.lastName}`.trim();
    const finalTotal = finalTotalAmount; // Use the updated total
    const isPartial = paymentMethod === "Partial-COD";
    const razorpayAmount = isPartial ? advanceAmount : finalTotal;

    const orderData = {
      orderItems: cartItems,
      shippingInfo: { ...formData, fullName },
      totalPrice: Number(finalTotal.toFixed(2)),
      currency: "INR",
      itemsPrice: Number(finalTotal.toFixed(2)),
    };

    if (!isFormValid() || !cartItems.length) return;

    let checkoutData;
    try {
      if (isPartial) {
        checkoutData = await createAdvanceSession({ orderData }).unwrap();
      } else {
        checkoutData = await createFullSession({ orderData }).unwrap();
      }
    } catch (err) {
      console.error("Session creation failed:", err);
      Swal.fire({
        icon: "error",
        title: "Payment Initialization Failed",
        text: "Could not start payment. Please try again or contact support.",
        confirmButtonText: "OK",
      });
      return;
    }

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY,
      amount: razorpayAmount * 100,
      currency: "INR",
      name: "Sytro",
      order_id: checkoutData.id,
      description: isPartial
        ? `Advance Payment (50% rounded + ₹${COD_CHARGE} COD charge)`
        : "Full Order Payment",
      image:
        "https://ik.imagekit.io/c1jhxlxiy/logo@2x%20(1).png?updatedAt=1741333514217",
      handler: async function (response) {
        const paymentData = {
          razorpay_order_id: response.razorpay_order_id,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_signature: response.razorpay_signature,
          shippingInfo: { ...formData, fullName },
          cartItems,
          couponApplied: appliedCoupon?.code || "No",
          discountAmount: discountAmount || 0,
          couponDiscountType: appliedCoupon?.discountType || "",
          couponDiscountValue: appliedCoupon?.discountValue || 0,
          itemsPrice: subtotal,
          shippingPrice: 0,
          totalPrice: Number(finalTotal.toFixed(2)),
          taxPrice: 0,
          orderNotes: formData.orderNotes || "",
          paymentMethod: isPartial ? "Partial-COD" : "Online",
          advanceAmount: isPartial ? advanceAmount : finalTotal,
        };

        try {
          let serverResponse;
          if (isPartial) {
            serverResponse = await verifyAdvancePayment(paymentData).unwrap();
          } else {
            serverResponse = await verifyFullPayment(paymentData).unwrap();
          }

          if (serverResponse.success) {
            const roundOffText =
              roundOffAdded > 0
                ? ` (incl. ₹${roundOffAdded.toFixed(2)} round-off)`
                : "";

            Swal.fire({
              icon: "success",
              title: isPartial
                ? "Advance Paid Successfully!"
                : "Order Placed Successfully!",
              text: isPartial
                ? `₹${advanceAmount.toFixed(0)} paid now (includes ₹${COD_CHARGE} COD charge${roundOffText}). Remaining ₹${remainingAmount.toFixed(0)} on delivery.`
                : "Thank you for your purchase. Your order has been placed.",
              confirmButtonText: "OK",
            }).then(() => {
              dispatch(clearCart());
              router.push("/my-account-orders");
            });
          } else {
            throw new Error("Verification failed");
          }
        } catch (err) {
          console.error("Payment verification failed:", err);
          Swal.fire({
            icon: "error",
            title: "Payment Failed",
            text: `Payment could not be verified. Please contact support.\nRazorpay Order ID: ${response.razorpay_order_id || "N/A"}`,
            confirmButtonText: "OK",
          });
        }
      },
      prefill: {
        name: `${formData?.firstName} ${formData?.lastName}`,
        email: formData?.email,
        contact: formData?.phoneNo,
      },
      theme: { color: "#fbb52b" },
    };

    const razor = new window.Razorpay(options);
    razor.open();
  };

  // Login redirect logic (unchanged)
  const handleLoginClick = (e) => {
    e.preventDefault();
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set("toclickplaceorder", "true");
    router.push(`?${newSearchParams.toString()}`);
  };

  useEffect(() => {
    if (
      isAuthenticated &&
      searchParams.get("toclickplaceorder") === "true" &&
      buttonRef.current &&
      !hasClickedRef.current
    ) {
      if (!isLoading && isFormValid() && cartItems.length > 0) {
        hasClickedRef.current = true;
        buttonRef.current.click();
        const newSearchParams = new URLSearchParams(searchParams);
        newSearchParams.delete("toclickplaceorder");
        router.replace(`?${newSearchParams.toString()}`);
      }
    }
  }, [isAuthenticated, searchParams, isLoading, cartItems, router]);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    return () => document.body.removeChild(script);
  }, []);

  const isAnyLoading =
    isLoading ||
    fullSessionLoading ||
    fullWebhookLoading ||
    advanceSessionLoading ||
    advanceWebhookLoading ||
    isCheckingCoupon;

  return (
    <>
      {isAnyLoading && <FullScreenSpinner />}

      <div className="tf-page-cart-footer">
        <div className="tf-cart-footer-inner">
          <h5 className="fw-5 mb_20">Your order</h5>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (paymentMethod === "BANK" || paymentMethod === "Partial-COD") {
                handleRazorpayPayment();
              } else {
                // For normal COD, pass the updated finalTotalAmount to handleSubmit
                handleSubmit(e, paymentMethod, finalTotalAmount);
              }
            }}
            className="tf-page-cart-checkout widget-wrap-checkout"
          >
            {/* Product list */}
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
                      <figure
                        style={{ borderRadius: "10px" }}
                        className="img-product"
                      >
                        <Image
                          style={{ borderRadius: "10px" }}
                          alt="product"
                          src={elm.image || "/images/placeholder.jpg"}
                          width={720}
                          height={1005}
                          onError={(e) =>
                            (e.target.src = "/images/placeholder.jpg")
                          }
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
                          {elm.customNameToPrint && (
                            <p>
                              Name on bag: <b>{elm.customNameToPrint}</b>
                            </p>
                          )}
                        </div>
                        <span className="price">
                          ₹{(elm.price * elm.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>

                    {elm.category === "Kids Bags" &&
                      elm.uploadedImage &&
                      Array.isArray(elm.uploadedImage) &&
                      elm.uploadedImage.length > 0 && (
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
                            style={{ width: "100px", height: "100px" }}
                          >
                            {elm.uploadedImage.map((url, index) => (
                              <SwiperSlide
                                key={index}
                                className="position-relative border p-1"
                              >
                                <Image
                                  src={url}
                                  alt={`Uploaded image ${index + 1} for ${elm.name}`}
                                  width={100}
                                  height={100}
                                  className="popover-image"
                                  style={{
                                    objectFit: "contain",
                                    width: "100%",
                                    height: "100%",
                                  }}
                                  onError={(e) =>
                                    (e.target.src = "/images/placeholder.jpg")
                                  }
                                />
                                <div
                                  style={{
                                    fontSize: "10px",
                                    height: "fit-content",
                                  }}
                                  className="position-absolute text-white p-1 rounded-circle top-0 left-0 bg-black bg-opacity-75"
                                >
                                  {index + 1}/{elm.uploadedImage.length}
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
                      )}
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
                      href="/shop-collection-sub"
                      className="tf-btn btn-fill animate-hover-btn radius-3 w-100"
                    >
                      Explore Products!
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {/* Coupon section */}
            <div className="d-flex flex-column">
              {!appliedCoupon && (
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
              {appliedCoupon && (
                <div className="d-flex justify-content-between align-items-center">
                  <p className="success mb-0" style={{ color: "green" }}>
                    Coupon {appliedCoupon.code} applied successfully! (
                    {appliedCoupon.description})
                  </p>
                  <button
                    type="button"
                    className="btn btn-sm text-danger"
                    onClick={() => {
                      setAppliedCoupon(null);
                      setCouponCode("");
                    }}
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>

            {/* Order summary */}
            <div className="order-summary">
              <div className="d-flex justify-content-between line py-4">
                <h6 className="fw-5">Subtotal</h6>
                <h6 className="fw-5">₹{subtotal.toFixed(2)}</h6>
              </div>

              {appliedCoupon && (
                <div className="d-flex justify-content-between line py-4">
                  <h6 className="fw-5">
                    Discount (
                    {appliedCoupon.discountType === "percentage"
                      ? `${appliedCoupon.discountValue}%`
                      : `₹${appliedCoupon.discountValue}`}
                    )
                  </h6>
                  <h6 className="fw-5">-₹{discountAmount.toFixed(2)}</h6>
                </div>
              )}

              {/* Show COD charge line when normal COD is selected */}
              {!hasRestrictedCategory && paymentMethod === "COD" && (
                <div className="d-flex justify-content-between line py-4 text-muted">
                  <h6>COD Charge</h6>
                  <h6>+₹{COD_CHARGE.toFixed(0)}</h6>
                </div>
              )}

              <div className="d-flex justify-content-between line py-4">
                <h6 className="fw-5">Total</h6>
                <h6 className="total fw-5">₹{finalTotalAmount.toFixed(2)}</h6>
              </div>

              {/* Round-off display (Partial-COD only) */}
              {hasRestrictedCategory &&
                paymentMethod === "Partial-COD" &&
                roundOffAdded > 0 && (
                  <div className="d-flex justify-content-between line py-4 text-muted">
                    <h6 className="fw-5">Round-off added to Advance</h6>
                    <h6 className="total fw-5">+₹{roundOffAdded.toFixed(2)}</h6>
                  </div>
                )}

              {/* Final advance display (Partial-COD only) */}
              {hasRestrictedCategory && paymentMethod === "Partial-COD" && (
                <div className="d-flex justify-content-between line py-4 fw-6">
                  <h6>Advance (incl. ₹{COD_CHARGE} COD charge)</h6>
                  <h6>₹{advanceAmount.toFixed(2)}</h6>
                </div>
              )}
            </div>

            {/* Payment methods */}
            <div className="wd-check-payment">
              {hasRestrictedCategory && (
                <div className="alert alert-warning" role="alert">
                  Cash on Delivery is not available for custom bags. Pay 50%
                  (rounded up) + ₹{COD_CHARGE} COD charge now – rest on
                  delivery.
                </div>
              )}

              <div className="fieldset-radio mb_20">
                <input
                  type="radio"
                  name="paymentMethod"
                  id="bank"
                  value="BANK"
                  checked={paymentMethod === "BANK"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <label htmlFor="bank">Online transfer (Full payment)</label>
              </div>

              {hasRestrictedCategory ? (
                <div className="fieldset-radio mb_20">
                  <input
                    type="radio"
                    name="paymentMethod"
                    id="partial-cod"
                    value="Partial-COD"
                    checked={paymentMethod === "Partial-COD"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <label htmlFor="partial-cod">
                    Pay ₹{advanceAmount.toFixed(0)} now (incl. ₹{COD_CHARGE} COD
                    charge + round-off)
                    <br />
                    <small>
                      Remaining: ₹{remainingAmount.toFixed(0)} on delivery
                    </small>
                  </label>
                </div>
              ) : (
                <div className="fieldset-radio mb_20">
                  <input
                    type="radio"
                    name="paymentMethod"
                    id="cod"
                    value="COD"
                    checked={paymentMethod === "COD"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <label htmlFor="cod">
                    Cash on Delivery (+ ₹{COD_CHARGE} charge)
                  </label>
                </div>
              )}
            </div>

            {/* Submit button */}
            {!isAuthenticated ? (
              <>
                {!isFormValid() || !cartItems.length ? (
                  <button
                    disabled
                    className="tf-btn radius-3 btn-fill btn-icon animate-hover-btn justify-content-center disabled-btn"
                    data-tooltip-id="cart-tooltip"
                    data-tooltip-content={
                      !isFormValid()
                        ? "Fill all the details correctly"
                        : !cartItems.length
                          ? "Cart is empty"
                          : ""
                    }
                  >
                    Place order
                  </button>
                ) : (
                  <a
                    href="#"
                    data-bs-toggle="modal"
                    data-bs-target="#login"
                    className="tf-btn radius-3 btn-fill btn-icon animate-hover-btn justify-content-center mt-0"
                    onClick={handleLoginClick}
                  >
                    Place order
                  </a>
                )}
              </>
            ) : (
              <button
                ref={buttonRef}
                type="submit"
                disabled={isAnyLoading || !isFormValid() || !cartItems.length}
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
                {isAnyLoading
                  ? "Processing..."
                  : paymentMethod === "Partial-COD"
                    ? `Pay ₹${advanceAmount.toFixed(0)} Now`
                    : paymentMethod === "BANK"
                      ? "Go to payment"
                      : `Place order (COD + ₹${COD_CHARGE})`}
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
