"use client";
import React, { useState, useEffect } from "react";
import { useLoginMutation } from "@/redux/api/authApi";
import Swal from "sweetalert2";
import GoogleSigninButton from "@/components/buttons/GoogleSigninButton";
import Link from "next/link";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";

export default function Login() {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const [login, { isLoading, error }] = useLoginMutation();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  // Handle navigation when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, router]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = formData;

    try {
      await login({ email, password }).unwrap();

      Swal.fire({
        icon: "success",
        title: "Login Successful",
        text: "You have successfully logged in!",
        confirmButtonColor: "#3085d6",
      });

      // Reset form fields
      setFormData({ email: "", password: "" });
      // Navigation will be handled by useEffect when isAuthenticated updates
    } catch (err) {
      console.error(err);
      setErrorMessage("Invalid email or password. Please try again.");
    }
  };

  // If authenticated, return null or a loading state while redirecting
  if (isAuthenticated) {
    return null; // or you could return a loading spinner
  }

  return (
    <section className="flat-spacing-10">
      <div className="container">
        <div className="tf-grid-layout lg-col-2 tf-login-wrap">
          <div className="tf-login-form">
            <h5 className="mb_36">Log in</h5>
            <div>
              <form onSubmit={handleSubmit}>
                <div className="tf-field style-1 mb_15">
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
                  <label className="tf-field-label fw-4 text_black-2">
                    Email *
                  </label>
                </div>
                <div className="tf-field style-1 mb_30">
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
                  <label className="tf-field-label fw-4 text_black-2">
                    Password *
                  </label>
                </div>
                {errorMessage && (
                  <p className="error-message text-danger mb_20">
                    {errorMessage}
                  </p>
                )}
                <div className="mb_20 d-flex flex-column">
                  <button
                    style={{ maxWidth: "unset" }}
                    type="submit"
                    className="tf-btn w-100 radius-3 btn-fill animate-hover-btn justify-content-center"
                    disabled={isLoading}
                  >
                    {isLoading ? "Logging in..." : "Log in"}
                  </button>
                  <GoogleSigninButton />
                </div>

                {error && (
                  <p className="error-message text-danger mt_20">
                    {error.data?.message}
                  </p>
                )}
              </form>
            </div>
          </div>
          <div className="tf-login-content">
            <h5 className="mb_36">I'm new here</h5>
            <Link href="/register" className="tf-btn btn-line">
              Create your account
              <i className="icon icon-arrow1-top-left" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
