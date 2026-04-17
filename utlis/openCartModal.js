const OPEN_CART_EVENT = "styro:cart:open";

export const openCartModal = () => {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(new CustomEvent(OPEN_CART_EVENT));
};
