"use client";
import React, { useEffect, useState } from "react";
import { useOtpLoginMutation } from "@/redux/api/authApi";
import Swal from "sweetalert2";
import GoogleSigninButton from "@/components/buttons/GoogleSigninButton";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import OTPAuthentication from "./OtpAuthentication";

export default function Login() {
  const router = useRouter();
  const [otpLogin, { isLoading, error }] = useOtpLoginMutation();
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      import("bootstrap");
    }
  }, []);

  const handlePhoneVerified = async (phone, otp) => {
    try {
      await otpLogin({ phone, otp }).unwrap();

      // Close the modal
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
    } catch (err) {
      console.error(err);
      setErrorMessage("Failed to log in. Please try again.");
    }
  };

  const closeModal = () => {
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
            <div className="demo-title">Enter Your Phone Number</div>
            <span
              className="icon-close icon-close-popup"
              data-bs-dismiss="modal"
            />
          </div>
          <div className="tf-login-form">
            <OTPAuthentication
              onPhoneVerified={handlePhoneVerified}
              closeModal={closeModal}
            />
            <p className="text-center">OR</p>
            <GoogleSigninButton />
            {error && (
              <p className="error-message text-danger">
                {error.data?.message || errorMessage}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
