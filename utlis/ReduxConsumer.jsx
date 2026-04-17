"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { useGetMeQuery } from "@/redux/api/userApi.js";
import FullScreenSpinner from "@/components/common/FullScreenSpinner";

const VideoPlayer = dynamic(
  () => import("@/components/common/DraggableVideo"),
  {
    ssr: false,
  },
);
const ToolbarBottom = dynamic(
  () => import("@/components/modals/ToolbarBottom"),
  {
    ssr: false,
  },
);

export function ReduxConsumer({ children }) {
  const { isLoading } = useGetMeQuery();
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
      <VideoPlayer />
      <ToolbarBottom />
    </div>
  );
}
