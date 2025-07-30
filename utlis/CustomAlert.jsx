"use client";
import React, { useState, useEffect } from "react";

export default function CustomAlert({
  show,
  onConfirm,
  onCancel,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
}) {
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    if (show) {
      setInputValue("");
    }
  }, [show]);

  // Handle confirm button click
  const handleConfirm = () => {
    if (!inputValue.trim()) {
      alert("Please enter a valid name!"); // Simple validation
      return;
    }
    onConfirm(inputValue);
  };

  // Handle key press (Enter to confirm, Escape to cancel)
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleConfirm();
    } else if (e.key === "Escape") {
      onCancel();
    }
  };

  if (!show) return null;

  return (
    <div
      className="modal fade show d-block custom-alert-modal"
      tabIndex="-1"
      role="dialog"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{title}</h5>
            <button
              type="button"
              className="btn-close"
              onClick={onCancel}
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            <p>{message}</p>
            <input
              type="text"
              className="form-control custom-alert-input"
              placeholder="Enter the name you want on the bag"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              autoFocus
            />
          </div>
          <div className="modal-footer">
            <button type="button" className="tf-btn justify-content-center fw-6 fs-16 animate-hover-btn" onClick={onCancel}>
              {cancelText}
            </button>
            <button
              type="button"
              className="tf-btn btn-fill justify-content-center fw-6 fs-16 animate-hover-btn"
              onClick={handleConfirm}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
