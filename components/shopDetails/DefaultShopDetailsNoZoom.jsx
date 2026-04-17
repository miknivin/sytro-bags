"use client";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Quantity from "./Quantity";
import toast from "react-hot-toast";
import {
  replaceUploadedImage,
  setCartItem,
  setCustomName as persistCustomName,
} from "@/redux/features/cartSlice";
import OrdinaryStickyItem from "./OrdinaryStickyItems";
import Slider1ZoomOuterOrdinary from "./sliders/Slider1ZoomOuterOrdinary";
import OfferTimer from "@/utlis/OfferTimer";
import CustomAlert from "@/utlis/CustomAlert";
import ShopCart from "@/components/modals/ShopCart";
import SuperKidBag from "@/components/modals/SuperKidBag";

export default function DefaultShopDetailsNoZoom({ product }) {
  const [quantity, setQuantity] = useState(1);
  const [customName, setCustomName] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.cartItems);
  const customNames = useSelector((state) => state.cart.customNames);
  const uploadedImages = useSelector((state) => state.cart.uploadedImages);

  React.useEffect(() => {
    if (product?._id && customNames?.[product._id]) {
      setCustomName(customNames[product._id]);
    } else {
      setCustomName("");
    }
  }, [product?._id, customNames]);

  const isOutOfStock = Number(product?.stock ?? product?.stocks ?? 0) <= 0;

  // Ensure product exists
  if (!product) {
    return <div className="text-center">No product data available</div>;
  }

  const isAddedToCartProducts = (productId) =>
    cartItems.some((item) => item.product === productId);

  const handleAddToCart = (productId, quantity) => {
    if (isOutOfStock) {
      toast.error("This product is out of stock");
      return;
    }

    if (
      product.category === "custom_sling_bag" &&
      !customName.trim()
    ) {
      setShowAlert(true);
      return;
    }

    if (isAddedToCartProducts(productId)) {
      toast.success("Item already in cart!");
      setIsCartOpen(true);
      return;
    }

    const cartItem = {
      product: productId,
      name: product.name,
      price: product.offer,
      ...(product.category != null ? { category: product.category } : {}),
      quantity: quantity || 1,
      image: product.images[0]?.url || "/images/placeholder.jpg",
      ...(customName ? { customNameToPrint: customName } : {}),
      uploadedImage: uploadedImages[productId] || null,
    };

    dispatch(setCartItem(cartItem));
    toast.success("Item added to cart!");
    setIsCartOpen(true);
  };

  const handleAlertConfirm = (value) => {
    if (isOutOfStock) {
      toast.error("This product is out of stock");
      setShowAlert(false);
      return;
    }

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
    setIsCartOpen(true);
  };

  const handleAlertCancel = () => {
    setShowAlert(false);
  };

  const triggerAlert = () => {
    setShowAlert(true);
  };

  const handleOpenCustomizer = () => {
    if (isOutOfStock) {
      toast.error("This product is out of stock");
      return;
    }

    setIsCustomizerOpen(true);
  };

  const handleUploadComplete = ({ uploadedUrls, customName: nextCustomName }) => {
    if (!product?._id) {
      return;
    }

    const normalizedUploadedImage = Array.isArray(uploadedUrls)
      ? uploadedUrls.filter(Boolean).slice(0, 1)
      : uploadedUrls
        ? [uploadedUrls]
        : [];

    dispatch(
      replaceUploadedImage({
        productId: product._id,
        uploadedImage: normalizedUploadedImage,
      }),
    );
    dispatch(
      persistCustomName({
        productId: product._id,
        customName: nextCustomName?.trim() || "",
      }),
    );
    setCustomName(nextCustomName?.trim() || "");
    setIsCustomizerOpen(false);
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
                  <Slider1ZoomOuterOrdinary
                    firstImage={[
                      ...(product.images || []),
                      ...(product.youtubeUrl || []).map((url) => ({ url })),
                    ]}
                  />
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="tf-product-info-wrap position-relative">
                <div className="tf-product-info-list">
                  {/* Product Name - Enhanced */}
                  <div className="tf-product-info-title mb-3">
                    <h4 style={{ fontWeight: 800, fontSize: '28px', color: '#333' }}>
                      {product.name}
                    </h4>
                    {isOutOfStock && (
                      <div
                        className="mt-2 d-inline-flex align-items-center"
                        style={{
                          backgroundColor: "#dc2626",
                          color: "#fff",
                          padding: "6px 12px",
                          borderRadius: "999px",
                          fontSize: "12px",
                          fontWeight: 700,
                          textTransform: "uppercase",
                          letterSpacing: "0.04em",
                        }}
                      >
                        Out of stock
                      </div>
                    )}
                  </div>

                  {/* Small Description */}
                  <div className="product-description mb-3">
                    <p style={{ fontSize: '14px', color: '#666', lineHeight: '1.5', margin: 0 }}>
                      {(product?.description || product?.details?.description || "").substring(0, 150)}
                      {(product?.description || product?.details?.description || "").length > 150 && "..."}
                    </p>
                  </div>

                  {/* Service Tags with Icons */}
                  <div className="service-tags-section mb-4">
                    <div className="row">
                      <div className="col-12">
                        <div className="service-tag d-flex align-items-center mb-2">
                          <div className="service-icon me-3">
                            <img
                              src="/images/icons/Untitled design (9).svg"
                              alt="2 Year Warranty"
                              width="25"
                              height="25"
                            />
                          </div>
                          <div>
                            <span style={{ fontSize: '13px', fontWeight: '500', color: '#333' }}>
                              2 YEAR WARRANTY
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="col-12">
                        <div className="service-tag d-flex align-items-center mb-2">
                          <div className="service-icon me-3">
                            <img
                              src="/images/icons/I241123182839208168.svg"
                              alt="Free Shipping"
                              width="20"
                              height="20"
                            />
                          </div>
                          <div>
                            <span style={{ fontSize: '13px', fontWeight: '500', color: '#333' }}>
                              ALL INDIA FREE DELIVERY
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="col-12">
                        <div className="service-tag d-flex align-items-center mb-2">
                          <div className="service-icon me-3">
                            <img
                              src="/images/icons/I250317133325217317.svg"
                              alt="Limited Orders"
                              width="20"
                              height="20"
                            />
                          </div>
                          <div>
                            <span style={{ fontSize: '13px', fontWeight: '500', color: '#333' }}>
                              ONLY LIMITED ORDERS DAILY
                            </span>
                          </div>
                        </div>
                      </div>

                      {product.category === "custom_sling_bag" && (
                        <div className="col-12">
                          <div className="service-tag d-flex align-items-center mb-2">
                            <div className="service-icon me-3">
                              <img
                                src="/images/icons/printer_icon.3b26a3e3.svg"
                                alt="Printing & Dispatch"
                                width="20"
                                height="20"
                              />
                            </div>
                            <div>
                              <span style={{ fontSize: '13px', fontWeight: '500', color: '#333' }}>
                                PRINT & DISPATCH IN 2-4 WORKING DAYS
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Offer Timer - Prominent Display */}
                  <div className="mb-3">
                    <OfferTimer offerEndTime={product?.offerEndTime} />
                  </div>

                  {/* Enhanced Pricing Section */}
                  <div className="tf-product-info-price d-flex align-items-center gap-3 mb-4">
                    <div style={{ fontWeight: 700, fontSize: '24px', color: '#000' }} className="price-on-sale">
                      ₹{product.offer.toFixed(2)}
                    </div>
                    <div>
                      <span style={{ fontSize: '18px', color: '#999', textDecoration: 'line-through' }}>
                        ₹{product?.price?.toFixed(2) || "3000"}
                      </span>
                    </div>
                    <div style={{ backgroundColor: '#ff4444', color: 'white', padding: '4px 8px', borderRadius: '4px', fontSize: '9px', fontWeight: '600' }}>
                      {((1 - product?.offer / (product?.price || 3000)) * 100).toFixed(0)}% OFF
                    </div>
                    <div style={{ color: "#5d5b5bff", fontSize: '14px' }} className="fw-light">
                      Inc. GST
                    </div>
                  </div>
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
                  ) : product?.category === "Kids Bags" ? null : (
                    <div className="tf-product-info-quantity">
                      <div className="quantity-title fw-6">Quantity</div>
                      <Quantity setQuantity={setQuantity} quantity={quantity} />
                    </div>
                  )}
                  <div className="tf-product-info-buy-button">
                    <form onSubmit={(e) => e.preventDefault()}>
                      {isOutOfStock ? (
                        <a className="tf-btn btns-sold-out cursor-not-allowed justify-content-center fw-6 fs-16 flex-grow-1 animate-hover-btn">
                          <span>Sold out</span>
                        </a>
                      ) : (
                      <a
                        href="/cart"
                        onClick={(event) => {
                          event.preventDefault();
                          if (
                            product.category === "Kids Bags" &&
                            !(uploadedImages[product._id]?.length > 0)
                          ) {
                            handleOpenCustomizer();
                            return;
                          }
                          handleAddToCart(product._id, quantity);
                        }}
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
                      )}
                    </form>
                  </div>
                  <>
                    {/* <DetailsStaticNoZoom /> */}
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
        soldOut={isOutOfStock}
        triggerAlert={triggerAlert}
        onOpenCart={() => setIsCartOpen(true)}
      />
      <SuperKidBag
        open={isCustomizerOpen}
        product={product}
        onClose={() => setIsCustomizerOpen(false)}
        onUploadComplete={handleUploadComplete}
        initialCustomName={customName}
        maxFiles={1}
      />
      <ShopCart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </section>
  );
}
