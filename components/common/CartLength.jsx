"use client";

import { useContextElement } from "@/context/Context";
import { useSelector} from "react-redux";
export default function CartLength() {
  const cartItems = useSelector((state) => state.cart.cartItems);
  const { cartProducts } = useContextElement();
  return <>{cartItems.length}</>;
}
