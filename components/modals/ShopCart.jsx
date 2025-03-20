"use client";
import { useContextElement } from "@/context/Context";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import Rupee from "@/utlis/Rupeesvg";
import { removeCartItem, updateCartItem } from "@/redux/features/cartSlice";
import TruckIcon from "@/utlis/TruckSvg";
import { resetSingleProduct } from "@/redux/features/productSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRupeeSign } from "@fortawesome/free-solid-svg-icons";
import { useRouter,usePathname } from "next/navigation";
export default function ShopCart() {
  const modalRef = useRef(null);
  const dispatch = useDispatch();
  const { cartProducts, setCartProducts } = useContextElement();
  const cartItems = useSelector((state) => state.cart.cartItems);
  const [subtotal, setSubtotal] = useState(0);
  const router = useRouter();
  const pathname = usePathname();
  const isShopCollectionSub = pathname?.includes("/shop-collection-sub");
  useEffect(() => {
    const newSubtotal = cartItems.reduce((total, item) => {
      const price = Number(item.price) || 0;
      const quantity = Number(item.quantity) || 0;
      return total + price * quantity;
    }, 0);
    // console.log(cartItems,'cartItems');
    setSubtotal(newSubtotal);
  }, [cartItems]);

  const handleNavigation = (e) => {
    e.preventDefault(); // Prevent default Link behavior
    const modalInstance = modalRef.current?.modalInstance;

    if (modalInstance) {
      modalInstance.hide(); // Close the modal
      router.push("/shop-collection-sub"); // Navigate after closing
    }
  };
  const increaseQuantity = (cartItem, id) => {
    const newQuantity = Number(cartItem.quantity) + 1;
    updateQuantity(cartItem, id, newQuantity);
  };

  const decreaseQuantity = (cartItem, id) => {
    const newQuantity = Number(cartItem.quantity) - 1;
    if (newQuantity >= 1) {
      updateQuantity(cartItem, id, newQuantity);
    }
  };

  const updateQuantity = (item, id, quantity) => {
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
            <div className="tf-mini-cart-threshold">
              <div className="tf-progress-bar">
                <span style={{ width: "50%" }}>
                  <div className="progress-car">
                    <TruckIcon />
                  </div>
                </span>
              </div>
              <div className="tf-progress-msg"></div>
            </div>
            <div className="tf-mini-cart-wrap">
              <div className="tf-mini-cart-main">
                <div className="tf-mini-cart-sroll pb-5">
                  <div className="tf-mini-cart-items">
                    {cartItems?.map((elm, i) => (
                      <div key={i} className="tf-mini-cart-item">
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
                            ₹{" "}
                            {(Number(elm.price) * Number(elm.quantity)).toFixed(
                              2
                            )}
                          </div>
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
                              {...(isShopCollectionSub ? { "data-bs-dismiss": "modal" } : {})}
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
                    className="tf-mini-cart-view-checkout"
                  >
                    <Link
                      href={"/checkout"}
                      className="tf-btn btn-fill animate-hover-btn radius-3 w-100 justify-content-center"
                    >
                      <span>Check out</span>
                    </Link>
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
