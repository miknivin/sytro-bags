export function sanitizeLocalStorageImages() {
  const keysToSanitize = ["uploadedImage", "uploadedImages"];

  keysToSanitize.forEach((key) => {
    const rawData = localStorage.getItem(key);
    if (rawData) {
      const parsed = JSON.parse(rawData);
      const updated = {};

      for (const [productId, value] of Object.entries(parsed)) {
        updated[productId] = Array.isArray(value) ? value : [value];
      }

      localStorage.setItem(key, JSON.stringify(updated));
    }
  });

  // --- Sanitize uploadedImage in cartItems array --- //
  let cartItems = JSON.parse(localStorage.getItem("cartItems") || "[]");

  cartItems = cartItems.map((item) => {
    if (!Array.isArray(item.uploadedImage)) {
      item.uploadedImage = item.uploadedImage ? [item.uploadedImage] : [];
    }
    return item;
  });

  localStorage.setItem("cartItems", JSON.stringify(cartItems));
  console.log("Sanitization complete");
}
