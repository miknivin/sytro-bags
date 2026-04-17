export function sanitizeLocalStorageImages() {
  if (typeof window === "undefined" || !window.localStorage) return;

  try {
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
          }
        } catch (e) {
          console.error(`Local storage parse error for ${key}:`, e);
        }
      }
    });

    // --- Sanitize uploadedImage in cartItems array --- //
    const cartItemsRaw = localStorage.getItem("cartItems");
    if (cartItemsRaw) {
      let cartItems = JSON.parse(cartItemsRaw || "[]");
      let changed = false;

      cartItems = cartItems.map((item) => {
        if (!Array.isArray(item.uploadedImage)) {
          item.uploadedImage = item.uploadedImage ? [item.uploadedImage] : [];
          changed = true;
        }
        return item;
      });

      if (changed) {
        localStorage.setItem("cartItems", JSON.stringify(cartItems));
      }
    }
  } catch (globalError) {
    console.warn("Storage sanitization failed (likely restricted browser):", globalError);
  }
}
