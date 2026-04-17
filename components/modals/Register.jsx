"use client";

import React, { useState } from "react";
import { useRegisterMutation } from "@/redux/api/authApi";
import GoogleSigninButton from "@/components/buttons/GoogleSigninButton";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import ModalShell from "@/components/modals/shared/ModalShell";

export default function Register({
  isOpen = false,
  onClose,
  onSwitchToLogin,
}) {
  const [register, { isLoading, error }] = useRegisterMutation();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isValidPassword = (password) =>
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
      password,
    );

  const handleSubmit = async (event) => {
    event.preventDefault();
    const { firstName, lastName, email, password } = formData;

    if (!firstName.trim() || !lastName.trim()) {
      setErrorMessage("Name is required.");
      return;
    }

    if (!isValidEmail(email)) {
      setErrorMessage("Enter a valid email address.");
      return;
    }

    if (!isValidPassword(password)) {
      setErrorMessage(
        "Password must be at least 8 characters long and contain at least one letter, one number, and one special character (e.g., @, #, $, %, &, ).",
      );
      return;
    }

    try {
      await register({
        name: `${firstName.trim()} ${lastName.trim()}`,
        email,
        password,
      }).unwrap();

      onClose?.();
      toast.success("You have been registered successfully!");

      const queryParams = new URLSearchParams(window.location.search);
      if (queryParams.get("toCheckout") === "proceeding") {
        router.push("/checkout");
      }

      setFormData({ firstName: "", lastName: "", email: "", password: "" });
      setErrorMessage("");
    } catch (err) {
      console.error(err);
      if (
        err?.data?.error?.includes("duplicate key error") &&
        err?.data?.error?.includes("email")
      ) {
        setErrorMessage("Email already exists. Please use another email.");
      } else {
        setErrorMessage("An error occurred. Please try again.");
      }
    }
  };

  return (
    <ModalShell
      isOpen={isOpen}
      onClose={onClose}
      className="modalCentered form-sign-in modal-part-content"
    >
      <div className="modal-content">
        <div className="header">
          <div className="demo-title">Register</div>
          <span
            className="icon-close icon-close-popup"
            onClick={onClose}
            role="button"
            tabIndex={0}
          />
        </div>
        <div className="tf-login-form">
          <form onSubmit={handleSubmit}>
            <div className="tf-field style-1">
              <input
                className="tf-field-input tf-input"
                placeholder=" "
                type="text"
                required
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
              />
              <label className="tf-field-label">First name</label>
            </div>
            <div className="tf-field style-1">
              <input
                className="tf-field-input tf-input"
                placeholder=" "
                type="text"
                required
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
              />
              <label className="tf-field-label">Last name</label>
            </div>
            <div className="tf-field style-1">
              <input
                className="tf-field-input tf-input"
                placeholder=" "
                type="email"
                required
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
              <label className="tf-field-label">Email *</label>
            </div>
            <div className="tf-field style-1">
              <input
                className="tf-field-input tf-input"
                placeholder=" "
                type="password"
                required
                name="password"
                value={formData.password}
                onChange={handleChange}
              />
              <label className="tf-field-label">Password *</label>
            </div>
            {errorMessage && (
              <p style={{ color: "red" }} className="error-message">
                {errorMessage}
              </p>
            )}
            <div className="bottom">
              <div className="w-100">
                <button
                  type="submit"
                  className="tf-btn btn-fill animate-hover-btn radius-3 w-100 justify-content-center"
                  disabled={isLoading}
                >
                  {isLoading ? "Registering..." : "Register"}
                </button>
              </div>
              {onSwitchToLogin && (
                <div className="w-100">
                  <button
                    type="button"
                    className="btn-link fw-6 w-100 link"
                    onClick={onSwitchToLogin}
                  >
                    Already have an account? Log in here
                    <i className="icon icon-arrow1-top-left" />
                  </button>
                </div>
              )}
            </div>
          </form>
          <GoogleSigninButton />
          {error && (
            <p style={{ color: "red" }} className="error-message text-danger">
              {error.data?.message}
            </p>
          )}
        </div>
      </div>
    </ModalShell>
  );
}
