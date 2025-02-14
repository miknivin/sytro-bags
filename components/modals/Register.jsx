"use client";

import React, { useState, useEffect } from "react";
import { useRegisterMutation } from "@/redux/api/authApi";
import Swal from "sweetalert2";
import dynamic from "next/dynamic";

// Dynamically import Bootstrap with no SSR
const BootstrapClient = dynamic(
  () => import("bootstrap/dist/js/bootstrap.bundle.min.js"),
  {
    ssr: false,
  }
);

export default function Register() {
  const [register, { isLoading, error }] = useRegisterMutation();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [modalInstance, setModalInstance] = useState(null);

  useEffect(() => {
    // Load Bootstrap
    BootstrapClient;

    // Initialize modal
    if (typeof window !== "undefined") {
      const modalElement = document.getElementById("register");
      if (modalElement) {
        import("bootstrap").then(({ Modal }) => {
          setModalInstance(new Modal(modalElement));
        });
      }
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isValidPassword = (password) =>
    /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(password);

  const handleSubmit = async (e) => {
    e.preventDefault();
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
        "Password must be at least 8 characters long and contain at least one letter and one number."
      );
      return;
    }

    try {
      await register({
        name: `${firstName.trim()} ${lastName.trim()}`,
        email,
        password,
      }).unwrap();

      // Close modal safely
      if (modalInstance) {
        modalInstance.hide();
      }

      Swal.fire({
        icon: "success",
        title: "Registration Successful",
        text: "You have been registered successfully!",
        confirmButtonColor: "#3085d6",
      });

      setFormData({ firstName: "", lastName: "", email: "", password: "" });
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
    <div
      className="modal modalCentered fade form-sign-in modal-part-content"
      id="register"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="header">
            <div className="demo-title">Register</div>
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
              {errorMessage && <p className="error-message">{errorMessage}</p>}
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
                <div className="w-100">
                  <a
                    href="#login"
                    data-bs-toggle="modal"
                    className="btn-link fw-6 w-100 link"
                  >
                    Already have an account? Log in here
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
