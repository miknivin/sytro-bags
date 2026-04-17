"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { useGetMeQuery } from "@/redux/api/userApi.js";
import { useSelector } from "react-redux";
import FullScreenSpinner from "@/components/common/FullScreenSpinner";

const QuickAdd = dynamic(() => import("@/components/modals/QuickAdd"), {
  ssr: false,
});
const VideoPlayer = dynamic(
  () => import("@/components/common/DraggableVideo"),
  {
    ssr: false,
  },
);
const ShopCart = dynamic(() => import("@/components/modals/ShopCart"), {
  ssr: false,
});
const AskQuestion = dynamic(() => import("@/components/modals/AskQuestion"), {
  ssr: false,
});
const DeliveryReturn = dynamic(
  () => import("@/components/modals/DeliveryReturn"),
  {
    ssr: false,
  },
);
const Login = dynamic(() => import("@/components/modals/Login"), {
  ssr: false,
});
const Register = dynamic(() => import("@/components/modals/Register"), {
  ssr: false,
});
const MobileMenu = dynamic(() => import("@/components/modals/MobileMenu"), {
  ssr: false,
});
const SearchModal = dynamic(() => import("@/components/modals/SearchModal"), {
  ssr: false,
});
const ToolbarBottom = dynamic(
  () => import("@/components/modals/ToolbarBottom"),
  {
    ssr: false,
  },
);
const ToolbarShop = dynamic(() => import("@/components/modals/ToolbarShop"), {
  ssr: false,
});
const ShareModal = dynamic(() => import("@/components/modals/ShareModal"), {
  ssr: false,
});

export function ReduxConsumer({ children }) {
  const { isLoading } = useGetMeQuery();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const [showLoader, setShowLoader] = useState(true);

  useEffect(() => {
    if (!isLoading) {
      setShowLoader(false);
    }
  }, [isLoading]);

  // Safety timeout: hide loader after 5 seconds even if request hangs
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoader(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading && showLoader) {
    return <FullScreenSpinner />;
  }

  return (
    <div id="wrapper">
      {children}
      {/* <HomesModal />
      <ShoppingBanner /> */}
      {/* <QuickView /> */}
      <QuickAdd />
      <VideoPlayer />
      {/* <ProductSidebar /> */}
      <ShopCart />
      <AskQuestion />
      {/* <BlogSidebar /> */}
      <DeliveryReturn />
      {/* <ChoiceImages /> */}
      {!isAuthenticated && (
        <>
          <Login />
          <Register />
        </>
      )}

      <MobileMenu />
      {/* <ResetPass /> */}
      <SearchModal />
      <ToolbarBottom />
      <ToolbarShop />
      {/* <SuperKidBag /> */}

      {/* <NewsletterModal /> */}
      <ShareModal />
    </div>
  );
}
