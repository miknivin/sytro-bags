import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLightbulb, faTimes } from "@fortawesome/free-solid-svg-icons";

export default function ShoppingBanner() {
  const [isVisible, setIsVisible] = useState(true);

  const handleClose = () => {
    setIsVisible(false);
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
              style={{ width: "1.5rem", height: "1.5rem", padding:"10px" }}
            >
              <FontAwesomeIcon
                icon={faLightbulb}
                className="fa-xs text-secondary"
                style={{ fontSize: "0.75rem" }}
              />
              <span className="visually-hidden">Light bulb</span>
            </span>
            <span className="text-white">
              New brand identity has been launched for the
              <a
                href="https://flowbite.com"
                className="fw-medium text-primary text-decoration-underline"
              >
                Flowbite Library
              </a>
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
