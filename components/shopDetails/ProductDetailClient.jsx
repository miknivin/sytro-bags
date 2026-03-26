"use client";
import dynamic from "next/dynamic";
import { memo } from "react";
import { useGetProductDetailsQuery } from "@/redux/api/productsApi";
import FullScreenSpinner from "@/components/common/FullScreenSpinner";
import DetailsOuterZoom from "@/components/shopDetails/DetailsOuterZoom";
import ShopDetailsTab from "@/components/shopDetails/ShopDetailsTab";

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

  return (
    <>
      <DetailsOuterZoom product={product} details={product?.details} />
      <ShopDetailsTab details={product?.details} />
      <Moments />
      <RelatedProducts product={product} />
      <GoogleReviews />
      <Features />
      <TrustBanner />
      <TestimonialImages />
    </>
  );
}

export default memo(ProductDetailsClient);
