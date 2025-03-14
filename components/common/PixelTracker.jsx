// @/components/PixelTracker.js
"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export default function PixelTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (window.fbq) {
      window.fbq("track", "PageView");
    }
  }, [pathname, searchParams]);

  return null;
}
