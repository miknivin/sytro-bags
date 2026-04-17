"use client";

import dynamic from "next/dynamic";
import { useGetMeQuery } from "@/redux/api/userApi.js";

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
  useGetMeQuery();

  return (
    <div id="wrapper">
      {children}
      <VideoPlayer />
      <ToolbarBottom />
    </div>
  );
}
