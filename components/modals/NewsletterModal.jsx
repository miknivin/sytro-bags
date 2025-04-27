"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

export default function NewsletterModal() {
  const pathname = usePathname();
  const modalRef = useRef();
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText("SYTRO15").then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  };

  useEffect(() => {
    let myModal;
    let hideTimeout;
    const showModal = async () => {
      if (pathname === "/") {
        const bootstrap = await import("bootstrap");
        myModal = new bootstrap.Modal(modalRef.current, { keyboard: false });
        // Show modal after 2 seconds
        await new Promise((resolve) => setTimeout(resolve, 2000));
        myModal.show();
        // Hide modal after 10 seconds of display
        hideTimeout = setTimeout(() => {
          myModal.hide();
        }, 10000); // 10 seconds after showing

        // Ensure backdrop is removed when modal is hidden
        modalRef.current.addEventListener("hidden.bs.modal", () => {
          // Force remove backdrop if it remains
          const backdrop = document.querySelector(".modal-backdrop");
          if (backdrop) {
            backdrop.remove();
          }
          document.body.classList.remove("modal-open");
          document.body.style.overflow = "";
        });
      }
    };

    showModal();

    return () => {
      if (myModal) {
        myModal.hide(); // Ensure modal is hidden before disposal
        myModal.dispose(); // Clean up Bootstrap modal instance
      }
      if (hideTimeout) {
        clearTimeout(hideTimeout); // Clean up timeout
      }
      // Clean up event listener
      if (modalRef.current) {
        modalRef.current.removeEventListener("hidden.bs.modal", () => {});
      }
      // Clean up any remaining backdrops
      const backdrop = document.querySelector(".modal-backdrop");
      if (backdrop) {
        backdrop.remove();
      }
      document.body.classList.remove("modal-open");
      document.body.style.overflow = "";
    };
  }, [pathname]);

  // Check if coupon is expired
  const expirationDate = new Date("2025-04-28");
  if (new Date() > expirationDate) return null;

  return (
    <div
      ref={modalRef}
      className="modal modalCentered fade auto-popup modal-newleter"
      id="newsletterPopup"
      style={{ zIndex: "11111" }}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-top">
            <Image
              className="lazyload"
              data-src="https://ik.imagekit.io/c1jhxlxiy/banner%20coupon.jpg?updatedAt=1745328730124"
              alt="Newsletter banner"
              width={938}
              height={538}
              src="https://ik.imagekit.io/c1jhxlxiy/banner%20coupon.jpg?updatedAt=1745328730124"
            />
            <span
              className="icon icon-close btn-hide-popup"
              data-bs-dismiss="modal"
              aria-label="Close modal"
            />
          </div>
          <div className="modal-bottom">
            <h4 className="text-center">Don’t miss out</h4>
            <h6 className="text-center">
              Get 15% off your order! Use coupon code{" "}
              <span className="fw-medium text-warning">SYTRO15</span> at
              checkout. Offer expires on 28<sup>th</sup> April 2025.
            </h6>
            <div className="w-100 mx-auto mt-4" style={{ maxWidth: "16rem" }}>
              <div className="position-relative">
                <input
                  id="coupon-code"
                  type="text"
                  className="form-control bg-light border-secondary text-muted fs-6 rounded"
                  value="SYTRO15"
                  disabled
                  readOnly
                  style={{ padding: "1rem 0.625rem" }}
                />
                <button
                  onClick={handleCopy}
                  className="btn btn-light border-secondary position-absolute top-50 translate-middle-y d-flex"
                  style={{
                    right: "0.625rem",
                    padding: "0.5rem 0.625rem",
                    height: "2rem",
                  }}
                >
                  <span
                    className={`${
                      isCopied ? "d-none" : "d-inline-flex align-items-center"
                    }`}
                  >
                    <svg
                      className="me-1"
                      style={{ width: "0.75rem", height: "0.75rem" }}
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 18 20"
                    >
                      <path d="M16 1h-3.278A1.992 1.992 0 0 0 11 0H7a1.993 1.993 0 0 0-1.722 1H2a2 2 0 0 0-2 2v15a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2Zm-3 14H5a1 1 0 0 1 0-2h8a1 1 0 0 1 0 2Zm0-4H5a1 1 0 0 1 0-2h8a1 1 0 1 1 0 2Zm0-5H5a1 1 0 0 1 0-2h2V2h4v2h2a1 1 0 1 1 0 2Z" />
                    </svg>
                    <span className="fs-6 fw-semibold">Copy</span>
                  </span>
                  <span
                    className={`${
                      isCopied ? "d-inline-flex align-items-center" : "d-none"
                    }`}
                  >
                    <svg
                      className="me-1 text-primary"
                      style={{ width: "0.75rem", height: "0.75rem" }}
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 16 12"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M1 5.917 5.724 10.5 15 1.5"
                      />
                    </svg>
                    <span className="fs-6 fw-semibold text-primary">
                      Copied
                    </span>
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
