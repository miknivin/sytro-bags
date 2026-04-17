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
    const closeBootstrapComponents = async () => {
      try {
        const bootstrap = await import("bootstrap");
        document.querySelectorAll(".modal.show").forEach((modal) => {
          const modalInstance = bootstrap.Modal.getInstance(modal);
          if (modalInstance) modalInstance.hide();
        });

        document.querySelectorAll(".offcanvas.show").forEach((offcanvas) => {
          const offcanvasInstance = bootstrap.Offcanvas.getInstance(offcanvas);
          if (offcanvasInstance) offcanvasInstance.hide();
        });
      } catch (error) {
        console.error("Failed to close Bootstrap components:", error);
      }
    };

    closeBootstrapComponents();
  }, [pathname]);

  useEffect(() => {
    const initializeWOW = async () => {
      const { WOW } = await import("wowjs");
      const wow = new WOW({ mobile: false, live: false });
      wow.init();
    };

    initializeWOW();
  }, [pathname]);

  useEffect(() => {
    const initializeDirection = () => {
      try {
        const direction = localStorage.getItem("direction");
        if (direction) {
          const parsedDirection = JSON.parse(direction);
          if (parsedDirection && parsedDirection.dir) {
            document.documentElement.dir = parsedDirection.dir;
            document.body.classList.add(parsedDirection.dir);
          }
        } else {
          document.documentElement.dir = "ltr";
        }
      } catch (error) {
        console.error(
          "Local storage access failed or invalid direction data:",
          error,
        );
        document.documentElement.dir = "ltr";
      } finally {
        // Ensure preloader is disabled even if there's an error
        const preloader = document.getElementById("preloader");
        if (preloader) {
          preloader.classList.add("disabled");
        }
      }
    };

    initializeDirection();

    // Fallback: Ensure preloader is hidden after 2 seconds no matter what
    const timeoutId = setTimeout(() => {
      const preloader = document.getElementById("preloader");
      if (preloader && !preloader.classList.contains("disabled")) {
        preloader.classList.add("disabled");
      }
    }, 2000);

    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <Context>
      <Toaster position="top-center" reverseOrder={false} />
      <ReduxConsumer>{children}</ReduxConsumer>
      <ScrollTop />
      <WhatsAppButton />
    </Context>
  );
}
