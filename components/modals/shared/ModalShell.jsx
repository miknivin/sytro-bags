"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

export default function ModalShell({
  isOpen,
  onClose,
  className = "",
  dialogClassName = "modal-dialog modal-dialog-centered",
  closeOnBackdrop = true,
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

    body.classList.add("modal-open");
    body.style.overflow = "hidden";

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        onClose?.();
      }
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
      body.classList.remove("modal-open");
      body.style.overflow = previousOverflow;
    };
  }, [isOpen, onClose]);

  if (!isMounted || !isOpen) {
    return null;
  }

  return createPortal(
    <>
      <div
        className={`modal fade show ${className}`.trim()}
        style={{ display: "block" }}
        role="dialog"
        aria-modal="true"
        tabIndex={-1}
        onClick={closeOnBackdrop ? onClose : undefined}
      >
        <div
          className={dialogClassName}
          onClick={(event) => event.stopPropagation()}
        >
          {children}
        </div>
      </div>
      <div
        className="modal-backdrop fade show"
        onClick={closeOnBackdrop ? onClose : undefined}
      />
    </>,
    document.body,
  );
}
