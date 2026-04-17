"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

export default function OffcanvasShell({
  isOpen,
  onClose,
  className = "",
  children,
}) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const { body } = document;
    const previousOverflow = body.style.overflow;

    body.style.overflow = "hidden";

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        onClose?.();
      }
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
      body.style.overflow = previousOverflow;
    };
  }, [isOpen, onClose]);

  if (!isMounted || !isOpen) {
    return null;
  }

  return createPortal(
    <>
      <div className="offcanvas-backdrop fade show" onClick={onClose} />
      <div
        className={`offcanvas show ${className}`.trim()}
        style={{ visibility: "visible" }}
        tabIndex={-1}
      >
        {children}
      </div>
    </>,
    document.body,
  );
}
