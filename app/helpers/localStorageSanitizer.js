export function sanitizeLocalStorageImages() {
  // --- Sanitize uploadedImage object --- //
  const rawUploadedImage = localStorage.getItem("uploadedImage") || "{}";
  const uploadedImage = JSON.parse(rawUploadedImage);
  const updatedUploadedImage = {};

  for (const [productId, value] of Object.entries(uploadedImage)) {
    updatedUploadedImage[productId] = Array.isArray(value) ? value : [value];
  }

  localStorage.setItem("uploadedImage", JSON.stringify(updatedUploadedImage));

  // --- Sanitize uploadedImage in cartItems array --- //
  let cartItems = JSON.parse(localStorage.getItem("cartItems") || "[]");

  cartItems = cartItems.map((item) => {
    if (!Array.isArray(item.uploadedImage)) {
      item.uploadedImage = item.uploadedImage ? [item.uploadedImage] : [];
    }
    return item;
  });
console.log("done")
  localStorage.setItem("cartItems", JSON.stringify(cartItems));
}
