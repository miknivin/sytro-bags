"use client";
import React, { useState, useEffect } from "react";
import { useLoginMutation } from "@/redux/api/authApi";
import Swal from "sweetalert2";

export default function Login() {
  const [login, { isLoading, error }] = useLoginMutation();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      import("bootstrap");
    }
  }, []);
  

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = formData;

    try {
      await login({ email, password }).unwrap();

      // Ensure this only runs in the browser
      if (typeof document !== "undefined") {
        const modalElement = document.getElementById("login");
        if (modalElement) {
          import("bootstrap").then(({ Modal }) => {
            const modalInstance =
              Modal.getInstance(modalElement) || new Modal(modalElement);
            modalInstance.hide();
          });
        }
      }

      Swal.fire({
        icon: "success",
        title: "Login Successful",
        text: "You have successfully logged in!",
        confirmButtonColor: "#3085d6",
      });

      // Reset form fields
      setFormData({ email: "", password: "" });
    } catch (err) {
      console.error(err);
      setErrorMessage("Invalid email or password. Please try again.");
    }
  };

  return (
    <div
      className="modal modalCentered fade form-sign-in modal-part-content"
      id="login"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="header">
            <div className="demo-title">Log in</div>
            <span
              className="icon-close icon-close-popup"
              data-bs-dismiss="modal"
            />
          </div>
          <div className="tf-login-form">
            <form onSubmit={handleSubmit}>
              <div className="tf-field style-1">
                <input
                  className="tf-field-input tf-input"
                  placeholder=" "
                  type="email"
                  name="email"
                  required
                  autoComplete="email"
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
                  name="password"
                  required
                  autoComplete="current-password"
                  value={formData.password}
                  onChange={handleChange}
                />
                <label className="tf-field-label">Password *</label>
              </div>
              {errorMessage && (
                <p className="error-message text-danger">{errorMessage}</p>
              )}
              <div>
                <a
                  href="#forgotPassword"
                  data-bs-toggle="modal"
                  className="btn-link link"
                >
                  Forgot your password?
                </a>
              </div>
              <div className="bottom">
                <div className="w-100">
                  <button
                    type="submit"
                    className="tf-btn btn-fill animate-hover-btn radius-3 w-100 justify-content-center"
                    disabled={isLoading}
                  >
                    {isLoading ? "Logging in..." : "Log in"}
                  </button>
                </div>
                <div className="w-100">
                  <a
                    href="#register"
                    data-bs-toggle="modal"
                    className="btn-link fw-6 w-100 link"
                  >
                    New customer? Create your account
                    <i className="icon icon-arrow1-top-left" />
                  </a>
                </div>
              </div>
            </form>
            {error && (
              <p className="error-message text-danger">{error.data?.message}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
