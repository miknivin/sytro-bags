// src/helpers/cartValidator.js
import Swal from "sweetalert2";

export const validateCartItems = (cartItems) => {
  const mismatchedItems = cartItems.filter((item) => {
    if (item.category !== "Kids Bags") return false;
    const uploadedImageArray = Array.isArray(item.uploadedImage)
      ? item.uploadedImage
      : item.uploadedImage
        ? [item.uploadedImage]
        : [];
    return uploadedImageArray.length === 0;
  });

  if (mismatchedItems.length > 0) {
    Swal.fire({
      icon: "error",
      title: "Image Required",
      text: `Please upload at least one image for the following Kids Bags: ${mismatchedItems
        .map((item) => item.name)
        .join(", ")}.`,
      confirmButtonText: "OK",
    });
    return false;
  }

  return true;
};
