"use client";

import dynamic from "next/dynamic";
import { memo, useState } from "react";
import { useGetProductDetailsQuery } from "@/redux/api/productsApi";
import { useDispatch, useSelector } from "react-redux";
import FullScreenSpinner from "@/components/common/FullScreenSpinner";
import DetailsOuterZoom from "@/components/shopDetails/DetailsOuterZoom";
import ShopDetailsTab from "@/components/shopDetails/ShopDetailsTab";
import SuperKidBag from "@/components/modals/SuperKidBag";
import {
  replaceUploadedImage,
  setCustomName,
  upsertCartItem,
} from "@/redux/features/cartSlice";
import ShopCart from "@/components/modals/ShopCart";

const Moments = dynamic(() => import("../common/Moments"), {
  loading: () => null,
  ssr: false,
});

const Features = dynamic(() => import("../common/Features"), {
  loading: () => null,
  ssr: false,
});

const GoogleReviews = dynamic(() => import("../common/GoogleReviews"), {
  loading: () => null,
  ssr: false,
});

const RelatedProducts = dynamic(() => import("./RelatedProducts"), {
  loading: () => null,
  ssr: false,
});

const TrustBanner = dynamic(() => import("@/components/common/TrustBanner"), {
  loading: () => null,
  ssr: false,
});

const TestimonialImages = dynamic(
  () => import("@/components/common/TestimonialImages"),
  {
    loading: () => null,
    ssr: false,
  },
);

function ProductDetailsClient({ productId }) {
  const { data, error, isLoading } = useGetProductDetailsQuery(productId);
  const dispatch = useDispatch();
  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const cartItems = useSelector((state) => state.cart.cartItems);
  const customNames = useSelector((state) => state.cart.customNames);

  let product = null;

  try {
    if (error) {
      throw new Error("Failed to fetch product details");
    }
    product = data?.productById;
  } catch (err) {
    console.error("Error fetching product details:", err);
  }

  if (isLoading) return <FullScreenSpinner />;
  if (error && !data?.productById && !isLoading)
    return <p>Error fetching product details</p>;

  const initialCustomName =
    product?._id && typeof customNames?.[product._id] === "string"
      ? customNames[product._id]
      : "";
  const isOutOfStock = Number(product?.stock ?? product?.stocks ?? 0) <= 0;
  const isAddedToCart = Array.isArray(cartItems)
    ? cartItems.some((item) => item.product === product?._id)
    : false;

  const handleOpenCustomizer = () => {
    if (!product || isOutOfStock) {
      return;
    }

    setIsCustomizerOpen(true);
  };

  const handleCloseCustomizer = () => {
    setIsCustomizerOpen(false);
  };

  const handleUploadComplete = ({ uploadedUrls, customName }) => {
    if (!product?._id) {
      return;
    }

    const normalizedUploadedImage = Array.isArray(uploadedUrls)
      ? uploadedUrls.filter(Boolean).slice(0, 1)
      : uploadedUrls
        ? [uploadedUrls]
        : [];

    if (!normalizedUploadedImage.length) {
      return;
    }

    const trimmedCustomName = customName?.trim() || "";

    dispatch(
      replaceUploadedImage({
        productId: product._id,
        uploadedImage: normalizedUploadedImage,
      }),
    );
    dispatch(
      setCustomName({
        productId: product._id,
        customName: trimmedCustomName,
      }),
    );
    dispatch(
      upsertCartItem({
        product: product._id,
        name: product?.name,
        category: product?.category || "Kids Bags",
        price: product?.offer ?? 0,
        image: product?.images?.[0]?.url || "",
        stock: product?.stock,
        quantity: 1,
        uploadedImage: normalizedUploadedImage,
        ...(trimmedCustomName
          ? { customNameToPrint: trimmedCustomName }
          : {}),
      }),
    );

    setIsCustomizerOpen(false);
    setIsCartOpen(true);
  };

  return (
    <>
      <DetailsOuterZoom
        product={product}
        details={product?.details}
        onOrderNow={handleOpenCustomizer}
        isAddedToCart={isAddedToCart}
      />
      <ShopDetailsTab details={product?.details} />
      <Moments />
      <RelatedProducts product={product} />
      <GoogleReviews />
      <Features />
      <TrustBanner />
      <TestimonialImages />
      <SuperKidBag
        open={isCustomizerOpen}
        product={product}
        onClose={handleCloseCustomizer}
        onUploadComplete={handleUploadComplete}
        initialCustomName={initialCustomName}
        maxFiles={1}
      />
      <ShopCart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}

export default memo(ProductDetailsClient);
