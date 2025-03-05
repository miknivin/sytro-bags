import addExtraImages from "./functions/addExtraImages.js"; // Ensure correct path

const productId = "67a70ca93f464380b64b05a6";
const imageUrls = [
  "https://kids-bags.s3.eu-north-1.amazonaws.com/product_images/iron+strike+l.png",
  "https://kids-bags.s3.eu-north-1.amazonaws.com/product_images/bag+l+side.png",
  "https://kids-bags.s3.eu-north-1.amazonaws.com/product_images/closeup.png",
  "https://kids-bags.s3.eu-north-1.amazonaws.com/product_images/large+one+side.png",
  "https://kids-bags.s3.eu-north-1.amazonaws.com/product_images/logo+(1).png",
  "https://kids-bags.s3.eu-north-1.amazonaws.com/product_images/side+closup.png",
];

// Wrapping in an async function
(async () => {
  try {
    await addExtraImages(productId, imageUrls);
    console.log("Images added successfully");
  } catch (error) {
    console.error("Error adding images:", error.message);
  }
})();
