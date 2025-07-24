"use client";

import HomesModal from "@/components/modals/HomesModal";
import ProductSidebar from "@/components/modals/ProductSidebar";
import QuickAdd from "@/components/modals/QuickAdd";
import ShopCart from "@/components/modals/ShopCart";
import AskQuestion from "@/components/modals/AskQuestion";
import BlogSidebar from "@/components/modals/BlogSidebar";
import ColorCompare from "@/components/modals/ColorCompare";
import DeliveryReturn from "@/components/modals/DeliveryReturn";
import ChoiceImages from "@/components/modals/ChoiceImages";
import Login from "@/components/modals/Login";
import MobileMenu from "@/components/modals/MobileMenu";
import Register from "@/components/modals/Register";
import ResetPass from "@/components/modals/ResetPass";
import SearchModal from "@/components/modals/SearchModal";
import ToolbarBottom from "@/components/modals/ToolbarBottom";
import ToolbarShop from "@/components/modals/ToolbarShop";

import { usePathname } from "next/navigation";
import NewsletterModal from "@/components/modals/NewsletterModal";
import ShareModal from "@/components/modals/ShareModal";
import ScrollTop from "@/components/common/ScrollTop";
import { useGetMeQuery } from "@/redux/api/userApi.js";
import { useSelector } from "react-redux";
import FullScreenSpinner from "@/components/common/FullScreenSpinner";
import SuperKidBag from "@/components/modals/SuperKidBag";
import VideoPlayer from "@/components/common/DraggableVideo";
import ShoppingBanner from "@/components/modals/ShoppingBanner";

export function ReduxConsumer({ children }) {
  const { isLoading } = useGetMeQuery();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  if (isLoading) {
    return <FullScreenSpinner />;
  }

  return (
    <div id="wrapper">
      {children}
      {/* <HomesModal />
      <ShoppingBanner /> */}
      {/* <QuickView /> */}
      <QuickAdd />
      {/* <VideoPlayer /> */}
      {/* <ProductSidebar /> */}
      <ShopCart />
      <AskQuestion />
      {/* <BlogSidebar /> */}
      <DeliveryReturn />
      <ChoiceImages />
      {!isAuthenticated && (
        <>
          <Login />
          <Register />
        </>
      )}

      <MobileMenu />
      <ResetPass />
      <SearchModal />
      <ToolbarBottom />
      <ToolbarShop />
      <SuperKidBag />

      {/* <NewsletterModal /> */}
      <ShareModal />
    </div>
  );
}
