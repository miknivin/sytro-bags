// src/helpers/cartValidator.js
import Swal from "sweetalert2";

export const validateCartItems = (cartItems) => {
  const mismatchedItems = cartItems.filter((item) => {
    const uploadedImageArray = Array.isArray(item.uploadedImage)
      ? item.uploadedImage
      : item.uploadedImage
      ? [item.uploadedImage]
      : [];
    return item.quantity !== uploadedImageArray.length;
  });

  if (mismatchedItems.length > 0) {
    Swal.fire({
      icon: "error",
      title: "Upload Mismatch",
      text: `The following items have a mismatch between quantity and uploaded images: ${mismatchedItems
        .map(
          (item) =>
            `${item.name} (Quantity: ${item.quantity}, Images: ${
              Array.isArray(item.uploadedImage)
                ? item.uploadedImage.length
                : item.uploadedImage
                ? 1
                : 0
            })`
        )
        .join(", ")}. Please upload the correct number of images.`,
      confirmButtonText: "OK",
    });
    return false;
  }

  return true;
};
