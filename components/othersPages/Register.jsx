"use client";
import React, { useState, useEffect } from "react";
import { useRegisterMutation } from "@/redux/api/authApi";
import Swal from "sweetalert2";
import GoogleSigninButton from "@/components/buttons/GoogleSigninButton";
import Link from "next/link";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";

export default function Register() {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const [register, { isLoading, error }] = useRegisterMutation();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, router]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isValidPassword = (password) =>
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
      password
    );

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
        "Password must be at least 8 characters long and contain at least one letter, one number, and one special character."
      );
      return;
    }

    try {
      await register({
        name: `${firstName.trim()} ${lastName.trim()}`,
        email,
        password,
      }).unwrap();

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

  if (isAuthenticated) {
    return null;
  }

  return (
    <section className="flat-spacing-10">
      <div className="container">
        <div className="form-register-wrap">
          <div className="flat-title align-items-start gap-0 mb_30 px-0">
            <h5 className="mb_18">Register</h5>
          </div>
          <div className="tf-login-form">
            <form onSubmit={handleSubmit}>
              <div className="tf-field style-1 mb_15">
                <input
                  className="tf-field-input tf-input"
                  placeholder=" "
                  type="text"
                  required
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                />
                <label className="tf-field-label fw-4 text_black-2">
                  First name *
                </label>
              </div>
              <div className="tf-field style-1 mb_15">
                <input
                  className="tf-field-input tf-input"
                  placeholder=" "
                  type="text"
                  required
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                />
                <label className="tf-field-label fw-4 text_black-2">
                  Last name *
                </label>
              </div>
              <div className="tf-field style-1 mb_15">
                <input
                  className="tf-field-input tf-input"
                  placeholder=" "
                  type="email"
                  required
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />
                <label className="tf-field-label fw-4 text_black-2">
                  Email *
                </label>
              </div>
              <div className="tf-field style-1 mb_30">
                <input
                  className="tf-field-input tf-input"
                  placeholder=" "
                  type="password"
                  required
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                />
                <label className="tf-field-label fw-4 text_black-2">
                  Password *
                </label>
              </div>
              {errorMessage && (
                <p className="error-message text-danger mb_20">
                  {errorMessage}
                </p>
              )}
              <div className="mb_20">
                <button
                  type="submit"
                  className="tf-btn w-100 radius-3 btn-fill animate-hover-btn justify-content-center"
                  disabled={isLoading}
                >
                  {isLoading ? "Registering..." : "Register"}
                </button>
              </div>
              <GoogleSigninButton />
              <div className="text-center mt_20">
                <Link href="/login" className="tf-btn btn-line">
                  Already have an account? Log in here
                  <i className="icon icon-arrow1-top-left" />
                </Link>
              </div>
              {error && (
                <p className="error-message text-danger mt_20">
                  {error.data?.message}
                </p>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
