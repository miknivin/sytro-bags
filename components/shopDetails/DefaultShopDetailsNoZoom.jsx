"use client";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Quantity from "./Quantity";
import toast from "react-hot-toast";
import { openCartModal } from "@/utlis/openCartModal";
import { setCartItem } from "@/redux/features/cartSlice";
import OrdinaryStickyItem from "./OrdinaryStickyItems";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import Slider1ZoomOuterOrdinary from "./sliders/Slider1ZoomOuterOrdinary";
import DetailsStatic from "./DetailsStatic";
import OfferTimer from "@/utlis/OfferTimer";
import DetailsStaticNoZoom from "./DetailsStaticNoZoom";
import CustomAlert from "@/utlis/CustomAlert";

export default function DefaultShopDetailsNoZoom({ product }) {
  const [quantity, setQuantity] = useState(1);
  const [customName, setCustomName] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.cartItems);

  // Ensure product exists
  if (!product) {
    return <div className="text-center">No product data available</div>;
  }

  const isAddedToCartProducts = (productId) =>
    cartItems.some((item) => item.product === productId);

  const handleAddToCart = (productId, quantity) => {
    if (product.category === "custom_sling_bag" && !customName.trim()) {
      setShowAlert(true);
      return;
    }

    if (isAddedToCartProducts(productId)) {
      toast.success("Item already in cart!");
      openCartModal();
      return;
    }

    const cartItem = {
      product: productId,
      name: product.name,
      price: product.offer,
      ...(product.category != null ? { category: product.category } : {}),
      quantity: quantity || 1,
      image: product.images[0]?.url || "/images/placeholder.jpg",
      ...(product.category === "custom_sling_bag" && customName
        ? { customNameToPrint: customName }
        : {}),
    };

    dispatch(setCartItem(cartItem));
    toast.success("Item added to cart!");
    openCartModal();
  };

  const handleAlertConfirm = (value) => {
    setCustomName(value);
    setShowAlert(false);
    const cartItem = {
      product: product._id,
      name: product.name,
      price: product.offer,
      ...(product.category != null ? { category: product.category } : {}),
      quantity: quantity || 1,
      image: product.images[0]?.url || "/images/placeholder.jpg",
      customNameToPrint: value?.trim(),
    };
    dispatch(setCartItem(cartItem));
    toast.success("Item added to cart!");
    openCartModal();
  };

  const handleAlertCancel = () => {
    setShowAlert(false);
  };

  const triggerAlert = () => {
    setShowAlert(true);
  };

  return (
    <section
      className="flat-spacing-4 pt_0"
      style={{ maxWidth: "100vw", overflow: "clip" }}
    >
      <CustomAlert
        show={showAlert}
        onConfirm={handleAlertConfirm}
        onCancel={handleAlertCancel}
        title="Name Required"
        message="Please enter a name for the custom sling bag."
        confirmText="Add to Cart"
        cancelText="Cancel"
      />
      <div className="tf-main-product section-image-zoom">
        <div className="container">
          <div className="row">
            <div className="col-md-6">
              <div className="tf-product-media-wrap sticky-top h-100">
                <div className="thumbs-slider">
                  <Slider1ZoomOuterOrdinary firstImage={product.images || []} />
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="tf-product-info-wrap position-relative">
                <div className="tf-product-info-list">
                  <div className="tf-product-info-title">
                    <h5>{product.name}</h5>
                  </div>
                  <div>
                    {product && product.offerEndTime && (
                      <OfferTimer offerEndTime={product.offerEndTime} />
                    )}
                  </div>
                  <div className="tf-product-info-price flex align-items-center mb-3">
                    <div className="price-on-sale">
                      ₹{product.offer.toFixed(2)}
                    </div>
                    <div>
                      <span className=" fs-4 text-danger">
                        <s>₹{product?.price?.toFixed(2) || "3000"}</s>
                      </span>
                    </div>
                    <div style={{ color: "##787878" }} className="fw-light">
                      Inc. GST
                    </div>
                  </div>
                  <ul className="list-unstyled">
                    {[...(product?.details?.features || [])]
                      .reverse()
                      ?.map((feature, index) => (
                        <li className="mb-2" key={index}>
                          <div className="row align-items-start">
                            <div
                              className="col-auto"
                              style={{
                                color: "var(--primary)",
                                marginTop: "4px",
                              }}
                            >
                              <FontAwesomeIcon icon={faCircleCheck} />
                            </div>
                            <div className="col px-0">{feature}</div>
                          </div>
                        </li>
                      ))}
                  </ul>
                  {product?.category === "custom_sling_bag" ? (
                    <div className="tf-product-info-custom-name">
                      <div className="mb-1 custom-name-title fw-6">
                        Enter the name you want on the bag
                      </div>
                      <input
                        type="text"
                        value={customName}
                        maxLength={11}
                        onChange={(e) => setCustomName(e.target.value)}
                        placeholder="Enter the name you want on the bag"
                        className="form-control"
                      />
                      <div className="text-muted mt-1">
                        {customName.length}/11 characters
                      </div>
                    </div>
                  ) : (
                    <div className="tf-product-info-quantity">
                      <div className="quantity-title fw-6">Quantity</div>
                      <Quantity setQuantity={setQuantity} quantity={quantity} />
                    </div>
                  )}
                  <div className="tf-product-info-buy-button">
                    <form onSubmit={(e) => e.preventDefault()}>
                      <a
                        onClick={() => handleAddToCart(product._id, quantity)}
                        className="tf-btn btn-fill justify-content-center fw-6 fs-16 flex-grow-1 animate-hover-btn"
                        style={{ backgroundColor: "#122432" }}
                      >
                        <span>
                          {isAddedToCartProducts(product._id)
                            ? "Already Added"
                            : "Order now"}{" "}
                          - ₹{(product.offer * quantity).toFixed(2)}
                        </span>
                      </a>
                    </form>
                  </div>
                  <>
                    <DetailsStaticNoZoom />
                  </>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <OrdinaryStickyItem
        product={product}
        customNameToPrint={customName}
        isAddedToCartProducts={isAddedToCartProducts}
        setQuantity={setQuantity}
        quantity={quantity}
        soldOut={product.stocks <= 0}
        triggerAlert={triggerAlert}
      />
    </section>
  );
}
