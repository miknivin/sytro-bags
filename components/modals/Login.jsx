"use client";
import React, { useState, useEffect } from "react";
import { useLoginMutation } from "@/redux/api/authApi";
import Swal from "sweetalert2";
import GoogleSigninButton from "@/components/buttons/GoogleSigninButton";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
export default function Login() {
  const router = useRouter();
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

      toast.success("You have successfully logged in!");
      const queryParams = new URLSearchParams(window.location.search);
      if (queryParams.get("toCheckout") === "proceeding") {
        router.push("/checkout");
        console.log("Navigating to checkout");
      }
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
      <div
        className="modal-dialog modal-dialog-centered"
        style={{ display: "flex", alignItems: "center" }}
      >
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
                  className="btn-link link mb-1"
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
                    className="tf-btn btn-fill border-black bg-transparent border text-black animate-hover-btn radius-3 w-100 justify-content-center"
                  >
                    Sign up for new customers
                    <i className="icon icon-arrow1-top-left" />
                  </a>
                </div>
              </div>
              <p className="text-center">OR</p>
              <GoogleSigninButton />
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
