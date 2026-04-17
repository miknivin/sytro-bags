"use client";
import { useEffect } from "react";

import Context from "@/context/Context";
import { usePathname } from "next/navigation";
import ScrollTop from "@/components/common/ScrollTop";
import { ReduxConsumer } from "@/utlis/ReduxConsumer";
import { Toaster } from "react-hot-toast";
import WhatsAppButton from "../modals/WhatsAppButton";
export default function ClientWrapper({ children }) {
  const pathname = usePathname();
  //
  useEffect(() => {
    if (typeof window !== "undefined") {
      import("bootstrap/dist/js/bootstrap.esm");
    }
  }, []);

  useEffect(() => {
    let ticking = false;
    let frameId = null;
    let lastScrollY = window.scrollY;

    const updateHeaderState = () => {
      const header = document.querySelector("header");
      const currentScrollY = window.scrollY;

      if (header) {
        header.classList.toggle("header-bg", currentScrollY > 100);

        const nextDirection =
          currentScrollY > 250 && currentScrollY <= lastScrollY ? "up" : "down";
        header.style.top = nextDirection === "up" ? "0px" : "-185px";
      }

      lastScrollY = currentScrollY;
      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        ticking = true;
        frameId = window.requestAnimationFrame(updateHeaderState);
      }
    };

    updateHeaderState();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (frameId) {
        window.cancelAnimationFrame(frameId);
      }
    };
  }, [pathname]);

  useEffect(() => {
    document.body.classList.remove("modal-open");
    document.body.style.overflow = "";
    document
      .querySelectorAll(".modal-backdrop, .offcanvas-backdrop")
      .forEach((element) => element.remove());
  }, [pathname]);

  return (
    <Context>
      <Toaster position="top-center" reverseOrder={false} />
      <ReduxConsumer>{children}</ReduxConsumer>
      <ScrollTop />
      <WhatsAppButton />
    </Context>
  );
}
