"use client";
import { useContextElement } from "@/context/Context";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import Rupee from "@/utlis/Rupeesvg";
import {
  removeCartItem,
  removeCartItemUploadedImage,
  updateCartItem,
} from "@/redux/features/cartSlice";
import { resetSingleProduct } from "@/redux/features/productSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { useRouter, usePathname } from "next/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import {
  faCircleChevronLeft,
  faCircleChevronRight,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-hot-toast";
import { useUploadKidsImageMutation } from "@/redux/api/orderApi";
export default function ShopCart() {
  const [showPopover, setShowPopover] = useState(false);
  const [uploadKidsImage, { isLoading, error }] = useUploadKidsImageMutation();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const [imageUrl, setImageUrl] = useState("");
  const modalRef = useRef(null);
  const dispatch = useDispatch();
  const { cartProducts, setCartProducts } = useContextElement();
  const cartItems = useSelector((state) => state.cart.cartItems);
  const [subtotal, setSubtotal] = useState(0);
  const router = useRouter();
  const pathname = usePathname();
  const [popoverStates, setPopoverStates] = useState({});
  const [imageUrls, setImageUrls] = useState({});
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const fileInputRefs = useRef({});

  const [showUploadInput, setShowUploadInput] = useState({});
  const handlePopoverToggle = (productId, uploadedImage) => {
    setPopoverStates((prev) => ({
      ...prev,
      [productId]: !prev[productId],
    }));
    setImageUrls((prev) => ({
      ...prev,
      [productId]: Array.isArray(uploadedImage)
        ? uploadedImage
        : uploadedImage
        ? [uploadedImage]
        : [],
    }));
  };

  const handleClosePopover = (productId) => {
    setPopoverStates((prev) => ({
      ...prev,
      [productId]: false,
    }));
  };
  //console.log(cartItems);

  const handleClick = () => {
    if (isQuantityValid()) {
      if (isAuthenticated) {
        router.push("/checkout", { scroll: false });
      } else {
        router.push(`${window.location.pathname}?toCheckout=proceeding`, {
          scroll: false,
        });
      }
    } else {
      const mismatchedItems = cartItems.filter(
        (item) => item.quantity !== (imageUrls[item.product]?.length || 0)
      );
      const productNames = mismatchedItems.map((item) => item.name).join(", ");
      toast.error(
        `These products have mismatched image with quantity: ${productNames}`
      );
      console.log("Mismatched items:", mismatchedItems);
    }
  };

  const isQuantityValid = () => {
    if (cartItems.length === 0) return false;
    return cartItems.every((item) => {
      const imageCount = imageUrls[item.product]?.length || 0;
      return item.quantity === imageCount;
    });
  };

  const handleRemoveImage = (productId, cartItem, imageIndex) => {
    dispatch(
      removeCartItemUploadedImage({
        productId,
        imageIndex,
      })
    );
    decreaseQuantity(cartItem, productId);
  };
  useEffect(() => {
    const updatedImageUrls = {};
    cartItems.forEach((item) => {
      updatedImageUrls[item.product] = item.uploadedImage || [];
    });
    setImageUrls(updatedImageUrls);
  }, [cartItems]);
  const isShopCollectionSub = pathname?.includes("/shop-collection-sub");
  useEffect(() => {
    const newSubtotal = cartItems.reduce((total, item) => {
      const price = Number(item.price) || 0;
      const quantity = Number(item.quantity) || 0;
      return total + price * quantity;
    }, 0);
    setSubtotal(newSubtotal);
  }, [cartItems]);

  const handleNavigation = (e) => {
    e.preventDefault();
    const modalInstance = modalRef.current?.modalInstance;

    if (modalInstance) {
      modalInstance.hide(); // Close the modal
      router.push("/shop-collection-sub"); // Navigate after closing
    }
  };
  const increaseQuantity = (cartItem, id) => {
    const newQuantity = Number(cartItem.quantity) + 1;
    const imageCount = imageUrls[cartItem.product]?.length || 0;
    if (imageCount < newQuantity) {
      setShowUploadInput((prev) => ({
        ...prev,
        [id]: true,
      }));
      updateQuantity(cartItem, id, newQuantity);
      setTimeout(() => {
        fileInputRefs.current[id]?.click();
      }, 100);
    } else {
      updateQuantity(cartItem, id, newQuantity);
    }
  };

  const handleFileUpload = async (event, productId, quantity, imageCount) => {
    const files = Array.from(event.target.files); // Get all selected files
    if (files.length > 0) {
      try {
        const formData = new FormData();
        // Calculate the maximum number of files to process
        const remainingSlots = quantity - imageCount;
        const filesToUpload =
          remainingSlots >= files.length
            ? files
            : files.slice(0, remainingSlots);

        if (filesToUpload.length === 0) {
          toast.error(
            `No more images can be uploaded. Current image count (${imageCount}) matches or exceeds quantity (${quantity}).`
          );
          return;
        }

        filesToUpload.forEach((file) => formData.append("file", file));
        formData.append("productId", productId);

        const response = await uploadKidsImage(formData).unwrap();

        const urls = (Array.isArray(response) ? response : [response]).map(
          (item) => item.url
        );

        const currentImages = imageUrls[productId] || [];
        const updatedImages = [...currentImages, ...urls].slice(0, quantity);

        const newImageCount = updatedImages.length;

        if (newImageCount > quantity) {
          toast.warn(
            `Warning: Uploaded image count (${newImageCount}) exceeds quantity (${quantity}).`
          );
        } else if (newImageCount < quantity) {
          toast.info(
            `Still need ${
              quantity - newImageCount
            } more images for product ${productId}.`
          );
        } else {
          toast.success("Uploaded image(s) successfully");
        }

        // Update Redux store with the merged and limited array
        dispatch(
          updateCartItem({
            product: productId,
            uploadedImage: updatedImages,
          })
        );

        event.target.value = ""; // Clear file input after upload
      } catch (err) {
        console.error("Upload failed:", error || err);
      }
    }
  };

  const decreaseQuantity = (cartItem, id) => {
    const newQuantity = Number(cartItem.quantity) - 1;
    if (newQuantity >= 1) {
      const updatedUploadedImage = imageUrls[cartItem.product]
        ? imageUrls[cartItem.product].length > newQuantity
          ? imageUrls[cartItem.product].slice(0, newQuantity)
          : imageUrls[cartItem.product]
        : [];

      updateQuantity(cartItem, id, newQuantity, updatedUploadedImage);
    }
  };

  const updateQuantity = (item, id, quantity, uploadedImage) => {
    const safeQuantity = Number(quantity) || 1;
    const updatedCartProducts = cartProducts.map((product) =>
      product.id === id ? { ...product, quantity: safeQuantity } : product
    );
    setCartProducts(updatedCartProducts);
    const cartItem = {
      product: id,
      name: item?.name || "",
      price: Number(item?.offer) || Number(item?.price) || 0,
      image: item?.image || "",
      stock: item?.stock || 0,
      quantity: safeQuantity,
      offer: item?.offer || 0,
      uploadedImage: uploadedImage || item?.uploadedImage || [], // Include updatedUploadedImage or fallback to existing
    };
    dispatch(updateCartItem(cartItem));
  };

  const removeItem = (id) => {
    setCartProducts((prev) => prev.filter((item) => item.product !== id));
    dispatch(removeCartItem(id));
    dispatch(resetSingleProduct());
  };

  return (
    <div
      ref={modalRef}
      className="modal fullRight fade modal-shopping-cart"
      id="shoppingCart"
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="header">
            <div className="title fw-5">Shopping cart</div>
            <span
              className="icon-close icon-close-popup"
              data-bs-dismiss="modal"
            />
          </div>
          <div className="wrap">
            <div className="tf-mini-cart-wrap mt-3">
              <div className="tf-mini-cart-main">
                <div className="tf-mini-cart-sroll pb-5">
                  <div className="tf-mini-cart-items">
                    {cartItems?.map((elm, i) => (
                      <div
                        key={i}
                        className="tf-mini-cart-item border-bottom border-black"
                      >
                        <div className="tf-mini-cart-image">
                          <Link href={`/product-detail/${elm.product}`}>
                            <Image
                              alt="image"
                              src={elm.image}
                              width={668}
                              height={932}
                              style={{
                                objectFit: "cover",
                                borderRadius: "15px",
                              }}
                            />
                          </Link>
                        </div>
                        <div className="tf-mini-cart-info">
                          <Link
                            className="title link"
                            href={`/product-detail/${elm.product}`}
                          >
                            {elm.name}
                          </Link>
                          <div className="price fw-6">
                            ₹
                            {(Number(elm.price) * Number(elm.quantity)).toFixed(
                              2
                            )}
                          </div>
                          <div className="popover-container">
                            <button
                              type="button"
                              className="popover-button text-decoration-underline"
                              onClick={() =>
                                handlePopoverToggle(
                                  elm.product,
                                  elm.uploadedImage
                                )
                              }
                              // onBlur={() => handleClosePopover(elm.product)} // Close on blur
                            >
                              Uploaded image(s)
                            </button>

                            {popoverStates[elm.product] &&
                              imageUrls[elm.product] &&
                              imageUrls[elm.product].length > 0 && (
                                <div
                                  className="popover-content "
                                  data-placement="bottom"
                                >
                                  <div className="position-relative">
                                    <Swiper
                                      modules={[Navigation, Pagination]}
                                      spaceBetween={10}
                                      slidesPerView={1}
                                      navigation={{
                                        prevEl: prevRef.current,
                                        nextEl: nextRef.current,
                                      }}
                                      onBeforeInit={(swiper) => {
                                        swiper.params.navigation.prevEl =
                                          prevRef.current;
                                        swiper.params.navigation.nextEl =
                                          nextRef.current;
                                      }}
                                      style={{
                                        width: "100px",
                                        height: "100px",
                                      }}
                                    >
                                      {imageUrls[elm.product].map(
                                        (url, index) => (
                                          <SwiperSlide
                                            key={index}
                                            className="position-relative"
                                          >
                                            <Image
                                              src={url}
                                              alt={`Uploaded image ${
                                                index + 1
                                              } for ${elm.name}`}
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
                                              {index + 1}/
                                              {imageUrls[elm.product]?.length}
                                            </div>
                                            {imageUrls[elm.product].length >
                                              1 && (
                                              <button
                                                style={{
                                                  fontSize: "10px",
                                                  left: "40%",
                                                }}
                                                onClick={() =>
                                                  handleRemoveImage(
                                                    elm.product,
                                                    elm,
                                                    index
                                                  )
                                                }
                                                className="position-absolute border-0 bg-opacity-75 text-white p-1 rounded-circle bottom-0 bg-danger"
                                              >
                                                <FontAwesomeIcon
                                                  style={{ color: "white" }}
                                                  icon={faTrash}
                                                />
                                              </button>
                                            )}
                                          </SwiperSlide>
                                        )
                                      )}
                                      <button
                                        ref={prevRef}
                                        className="nav-btn prev-btn"
                                      >
                                        <FontAwesomeIcon
                                          icon={faCircleChevronLeft}
                                          size="sm"
                                        />
                                      </button>
                                      <button
                                        ref={nextRef}
                                        className="nav-btn next-btn"
                                      >
                                        <FontAwesomeIcon
                                          icon={faCircleChevronRight}
                                          size="sm"
                                        />
                                      </button>
                                    </Swiper>
                                  </div>

                                  <button
                                    type="button"
                                    className="popover-close-button"
                                    onClick={() =>
                                      handleClosePopover(elm.product)
                                    }
                                  >
                                    ×
                                  </button>
                                </div>
                              )}
                          </div>
                          {imageUrls[elm.product]?.length !== elm.quantity && (
                            <div className="upload-input-container">
                              <div className="upload-input-container">
                                {isLoading ? (
                                  <div
                                    className="spinner-border spinner-border-sm text-primary"
                                    role="status"
                                  >
                                    <span className="visually-hidden">
                                      Uploading...
                                    </span>
                                  </div>
                                ) : (
                                  <input
                                    type="file"
                                    className="form-control form-control-sm"
                                    accept="image/*"
                                    multiple
                                    ref={(el) => {
                                      if (el)
                                        fileInputRefs.current[elm.product] = el;
                                    }}
                                    onChange={(e) =>
                                      handleFileUpload(
                                        e,
                                        elm.product,
                                        elm.quantity,
                                        imageUrls[elm.product]?.length || 0
                                      )
                                    }
                                  />
                                )}
                              </div>
                            </div>
                          )}
                          <div className="tf-mini-cart-btns">
                            <div className="wg-quantity small">
                              <span
                                className="btn-quantity minus-btn"
                                onClick={() =>
                                  decreaseQuantity(elm, elm.product)
                                }
                              >
                                -
                              </span>
                              <input
                                type="number"
                                name="number"
                                value={elm.quantity}
                                min={1}
                                readOnly
                                onChange={(e) =>
                                  updateQuantity(
                                    elm,
                                    elm.product,
                                    parseInt(e.target.value) || 1
                                  )
                                }
                              />
                              <span
                                className="btn-quantity plus-btn"
                                onClick={() =>
                                  increaseQuantity(elm, elm.product)
                                }
                              >
                                +
                              </span>
                            </div>
                            <div
                              className="tf-mini-cart-remove"
                              style={{ cursor: "pointer" }}
                              onClick={() => removeItem(elm.product)}
                            >
                              Remove
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    {!cartItems?.length && (
                      <div className="container">
                        <div className="row align-items-center mt-5 mb-5">
                          <div className="col-12 fs-18">
                            Your shop cart is empty
                          </div>
                          <div className="col-12 mt-3">
                            <Link
                              href="/shop-collection-sub"
                              {...(isShopCollectionSub
                                ? { "data-bs-dismiss": "modal" }
                                : {})}
                              className="tf-btn btn-fill animate-hover-btn radius-3 w-100 justify-content-center"
                              style={{ width: "fit-content" }}
                            >
                              Explore Products!
                            </Link>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="tf-mini-cart-bottom">
                <div className="tf-mini-cart-bottom-wrap">
                  <div className="tf-cart-totals-discounts">
                    <div className="tf-cart-total">Subtotal</div>
                    <div className="tf-totals-total-value fw-6">
                      ₹ {subtotal.toFixed(2)}
                    </div>
                  </div>
                  <div className="tf-mini-cart-line" />
                  <div className="tf-cart-checkbox"></div>
                  <div
                    data-bs-dismiss="modal"
                    className="tf-mini-cart-view-checkout flex-column"
                  >
                    {isQuantityValid() ? (
                      isAuthenticated ? (
                        <Link
                          href="/checkout"
                          className="tf-btn btn-fill animate-hover-btn radius-3 w-100 justify-content-center"
                        >
                          <span>Check out</span>
                        </Link>
                      ) : (
                        <a
                          href="#login"
                          data-bs-toggle="modal"
                          className="tf-btn radius-3 btn-fill btn-icon animate-hover-btn justify-content-center mt-0 w-100"
                          onClick={(e) => {
                            e.preventDefault();
                            handleClick();
                          }}
                        >
                          Check out
                        </a>
                      )
                    ) : cartItems.length > 0 ? (
                      <>
                        <span className="text-danger">
                          These products have mismatched image with quantity:
                        </span>
                        <ul className="text-danger">
                          {cartItems
                            .filter(
                              (item) =>
                                item.quantity !==
                                (imageUrls[item.product]?.length || 0)
                            )
                            .map((item, index) => (
                              <li key={index}>
                                {item.name} (Quantity: {item.quantity}, Images:{" "}
                                {imageUrls[item.product]?.length || 0})
                              </li>
                            ))}
                        </ul>
                        <button
                          disabled
                          className="tf-btn btn-fill animate-hover-btn radius-3 w-100 justify-content-center"
                          onClick={(e) => {
                            e.preventDefault();
                          }}
                        >
                          <span>Check out</span>
                        </button>
                      </>
                    ) : (
                      <button
                        disabled
                        className="tf-btn btn-fill animate-hover-btn radius-3 w-100 justify-content-center"
                        onClick={(e) => {
                          e.preventDefault();
                        }}
                      >
                        <span>Check out</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
