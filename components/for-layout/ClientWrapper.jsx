"use client";
import { useEffect, useState } from "react";


import Context from "@/context/Context";
import { usePathname } from "next/navigation";
import ScrollTop from "@/components/common/ScrollTop";
import { ReduxConsumer } from "@/utlis/ReduxConsumer";
import { Toaster } from "react-hot-toast";
export default function ClientWrapper({ children }) {
  const pathname = usePathname();
  const [scrollDirection, setScrollDirection] = useState("down");

  useEffect(() => {
    if (typeof window !== "undefined") {
      import("bootstrap/dist/js/bootstrap.esm");
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const header = document.querySelector("header");
      if (window.scrollY > 100) {
        header.classList.add("header-bg");
      } else {
        header.classList.remove("header-bg");
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setScrollDirection("up");
    const lastScrollY = { current: window.scrollY };

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > 250) {
        setScrollDirection(
          currentScrollY > lastScrollY.current ? "down" : "up"
        );
      } else {
        setScrollDirection("down");
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname]);

  useEffect(() => {
    const closeBootstrapComponents = async () => {
      const bootstrap = await import("bootstrap");
      document.querySelectorAll(".modal.show").forEach((modal) => {
        const modalInstance = bootstrap.Modal.getInstance(modal);
        if (modalInstance) modalInstance.hide();
      });

      document.querySelectorAll(".offcanvas.show").forEach((offcanvas) => {
        const offcanvasInstance = bootstrap.Offcanvas.getInstance(offcanvas);
        if (offcanvasInstance) offcanvasInstance.hide();
      });
    };

    closeBootstrapComponents();
  }, [pathname]);

  useEffect(() => {
    const header = document.querySelector("header");
    if (header) {
      header.style.top = scrollDirection === "up" ? "0px" : "-185px";
    }
  }, [scrollDirection]);

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
      const direction = localStorage.getItem("direction");
      if (direction) {
        const parsedDirection = JSON.parse(direction);
        document.documentElement.dir = parsedDirection.dir;
        document.body.classList.add(parsedDirection.dir);
      } else {
        document.documentElement.dir = "ltr";
      }

      document.getElementById("preloader")?.classList.add("disabled");
    };

    initializeDirection();
  }, []);

  return (
    <Context>
      <Toaster position="top-center" reverseOrder={false} />
      <ReduxConsumer>{children}</ReduxConsumer>
      <ScrollTop />
    </Context>
  );
}
