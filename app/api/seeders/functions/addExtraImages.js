import mongoose from "mongoose";
import dbConnect from "./../../../../lib/db/connection.js";
import Product from "./../../../../models/Products.js";

const addExtraImages = async (productId, imageUrls) => {
  try {
    await dbConnect();
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      throw new Error("Invalid Product ID");
    }

    const extraImages = imageUrls.map((url) => ({
      _id: new mongoose.Types.ObjectId(),
      url,
    }));

    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      { $push: { extraImages: { $each: extraImages } } },
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      throw new Error("Product not found");
    }

    console.log("Extra images added successfully:", updatedProduct.extraImages);
  } catch (error) {
    console.error("Error adding extra images:", error.message);
  }
};

export default addExtraImages;
