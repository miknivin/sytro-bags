export function sanitizeLocalStorageImages() {
  const keysToSanitize = ["uploadedImage", "uploadedImages"];

  keysToSanitize.forEach((key) => {
    const rawData = localStorage.getItem(key);
    if (rawData) {
      try {
        const parsed = JSON.parse(rawData);

        if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
          const updated = {};

          for (const [productId, value] of Object.entries(parsed)) {
            updated[productId] = Array.isArray(value) ? value : [value];
          }

          localStorage.setItem(key, JSON.stringify(updated));
        } else {
          console.warn(`Skipping ${key}: Parsed data is not a valid object`, {
            parsed,
          });
        }
      } catch (error) {
        console.error(
          `Failed to parse localStorage key "${key}":`,
          error.message,
          { rawData }
        );
        // Optionally, remove invalid data
        // localStorage.removeItem(key);
      }
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
