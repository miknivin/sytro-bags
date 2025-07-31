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

  // Handle input change with validation
  const handleInputChange = (e) => {
    const value = e.target.value;
    // Remove leading/trailing spaces
    const cleanedValue = value.trim();
    if (cleanedValue.length <= 11) {
      setInputValue(value); // Keep original input (including multiple spaces) for display
    } else {
      alert("Name cannot exceed 11 characters!");
    }
  };

  // Handle confirm button click
  const handleConfirm = () => {
    const cleanedValue = inputValue.trim();
    if (!cleanedValue) {
      alert("Please enter a valid name!");
      return;
    }
    if (cleanedValue.length > 11) {
      alert("Name cannot exceed 11 characters!");
      return;
    }
    onConfirm(cleanedValue);
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
              placeholder="Enter name (max 11 characters)"
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              maxLength={11}
              autoFocus
            />
            <div className="text-muted mt-1">
              {inputValue.trim().length}/11 characters
            </div>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="tf-btn justify-content-center fw-6 fs-16 animate-hover-btn"
              onClick={onCancel}
            >
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
