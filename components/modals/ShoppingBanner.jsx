"use client";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLightbulb,
  faTimes,
  faCopy,
  faSquareCheck,
} from "@fortawesome/free-solid-svg-icons";

export default function ShoppingBanner() {
  const [isVisible, setIsVisible] = useState(true);
  const [copied, setCopied] = useState(false);

  const handleClose = () => {
    setIsVisible(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText("SYTRO15");
    setCopied(true);
    setTimeout(() => setCopied(false), 5000);
  };

  if (!isVisible) return null;

  return (
    <div
      id="sticky-banner"
      tabIndex={-1}
      style={{ zIndex: 1030, backgroundColor: "#122432" }}
      role="alert"
      className="fixed-top w-100 border-bottom"
    >
      <div className="container d-flex justify-content-between align-items-center p-3">
        <div className="d-flex align-items-center mx-auto text-white">
          <p className="d-flex align-items-center mb-0 text-muted fs-6">
            <span
              className="d-inline-flex align-items-center justify-content-center bg-secondary-subtle rounded-circle me-3"
              style={{ width: "1.5rem", height: "1.5rem", padding: "10px" }}
            >
              <FontAwesomeIcon
                icon={faLightbulb}
                className="fa-xs text-secondary"
                style={{ fontSize: "0.75rem" }}
              />
              <span className="visually-hidden">Light bulb</span>
            </span>
            <span className="text-white">
              Get 15% off your order! Use coupon code{" "}
              <span className="fw-medium text-warning">SYTRO15</span>{" "}
              <button
                type="button"
                className="btn btn-sm text-white px-2 py-0"
                onClick={handleCopy}
                aria-label="Copy coupon code"
              >
                <FontAwesomeIcon icon={copied ? faSquareCheck : faCopy} />
              </button>
              at checkout. Offer expires on 26<sup>th</sup>April 2025.
            </span>
          </p>
        </div>
        <div className="d-flex align-items-center">
          <button
            type="button"
            className="btn btn-link p-1 text-white"
            onClick={handleClose}
            aria-label="Close banner"
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
      </div>
    </div>
  );
}
