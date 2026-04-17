"use client";

import React, { useState } from "react";
import { useOtpLoginMutation } from "@/redux/api/authApi";
import GoogleSigninButton from "@/components/buttons/GoogleSigninButton";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import OTPAuthentication from "./OtpAuthentication";
import ModalShell from "@/components/modals/shared/ModalShell";

export default function Login({ isOpen = false, onClose, onSwitchToRegister }) {
  const router = useRouter();
  const [otpLogin, { isLoading, error }] = useOtpLoginMutation();
  const [errorMessage, setErrorMessage] = useState("");

  const handlePhoneVerified = async (phone, otp) => {
    try {
      await otpLogin({ phone, otp }).unwrap();
      onClose?.();

      toast.success("You have successfully logged in!");
      const queryParams = new URLSearchParams(window.location.search);
      if (queryParams.get("toCheckout") === "proceeding") {
        router.push("/checkout");
      }
    } catch (err) {
      console.error(err);
      setErrorMessage("Failed to log in. Please try again.");
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
          <div className="demo-title">Enter Your Phone Number</div>
          <span
            className="icon-close icon-close-popup"
            onClick={onClose}
            role="button"
            tabIndex={0}
          />
        </div>
        <div className="tf-login-form">
          <OTPAuthentication
            onPhoneVerified={handlePhoneVerified}
            closeModal={onClose}
          />
          <p className="text-center">OR</p>
          <GoogleSigninButton />
          {onSwitchToRegister && (
            <div className="bottom mt-3">
              <div className="w-100">
                <button
                  type="button"
                  className="btn-link fw-6 w-100 link"
                  onClick={onSwitchToRegister}
                >
                  Create an account
                  <i className="icon icon-arrow1-top-left" />
                </button>
              </div>
            </div>
          )}
          {(error || errorMessage) && (
            <p className="error-message text-danger">
              {error?.data?.message || errorMessage}
            </p>
          )}
          {isLoading && <p className="text-center mt-2">Verifying...</p>}
        </div>
      </div>
    </ModalShell>
  );
}
