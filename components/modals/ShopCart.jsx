"use client";
import { useContextElement } from "@/context/Context";
import Image from "next/image";
import Link from "next/link";
import { useRef, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Rupee from "@/utlis/Rupeesvg";
import { removeCartItem, updateCartItem } from "@/redux/features/cartSlice";
import TruckIcon from "@/utlis/TruckSvg";

export default function ShopCart() {
  const dispatch = useDispatch();
  const { cartProducts, setCartProducts } = useContextElement();
  const cartItems = useSelector((state) => state.cart.cartItems);
  const [subtotal, setSubtotal] = useState(0);

  // Calculate subtotal whenever cartItems change
  useEffect(() => {
    const newSubtotal = cartItems.reduce((total, item) => {
      return total + item.price * item.quantity;
    }, 0);
    setSubtotal(newSubtotal);
  }, [cartItems]);

  // Function to increase quantity
  const increaseQuantity = (cartItem, id) => {
    const newQuantity = Number(cartItem.quantity) + 1;
    updateQuantity(cartItem, id, newQuantity);
  };

  // Function to decrease quantity
  const decreaseQuantity = (cartItem, id) => {
    console.log(id);
    const newQuantity = Number(cartItem.quantity) - 1;
    console.log(newQuantity);
    if (newQuantity >= 1) {
      updateQuantity(cartItem, id, newQuantity);
    }
  };

  // Function to update quantity in both local state and Redux store
  const updateQuantity = (item, id, quantity) => {
    //Update local state
    const updatedCartProducts = cartProducts.map((item) =>
      item.id === id ? { ...item, quantity } : item
    );
    setCartProducts(updatedCartProducts);

    // Update Redux store
    const cartItem = {
      product: id,
      name: item?.name,
      price: item?.offer,
      image: item?.image,
      stock: item?.stock,
      quantity: quantity,
      offer: item?.offer,
    };

    dispatch(updateCartItem(cartItem));
  };

  const removeItemFromCart = (item, id) => {
    dispatch(removeCartItem(item));
  };

  // Function to remove an item from the cart
  const removeItem = (id) => {
    // Remove from local state
    setCartProducts((prev) => prev.filter((item) => item.product !== id));

    // Remove from Redux store
    dispatch(removeCartItem(id));
  };

  return (
    <div className="modal fullRight fade modal-shopping-cart" id="shoppingCart">
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
              <div className="tf-progress-msg">
                {/* Buy <span className="price fw-6">$75.00</span> more to enjoy
                <span className="fw-6">Free Shipping</span> */}
              </div>
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
                            <Rupee width={"10px"} />{" "}
                            {(elm.price * elm.quantity).toFixed(2)}
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
                              onClick={() => removeItemFromCart(elm.product)}
                            >
                              Remove
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}

                    {!cartItems.length && (
                      <div className="container">
                        <div className="row align-items-center mt-5 mb-5">
                          <div className="col-12 fs-18">
                            Your shop cart is empty
                          </div>
                          <div className="col-12 mt-3">
                            <Link
                              href={"/shop-default"}
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
                      <Rupee width={"10px"} /> {subtotal.toFixed(2)}
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
