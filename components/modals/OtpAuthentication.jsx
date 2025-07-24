"use client";
import { useState, useEffect } from "react";
import {
  PhoneAuthProvider,
  RecaptchaVerifier,
  signInWithCredential,
  signInWithPhoneNumber,
} from "firebase/auth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/free-solid-svg-icons";
import toast from "react-hot-toast";
import { auth } from "../../lib/firebase.config";

const OTPAuthentication = ({ phone, closeModal, onPhoneVerified }) => {
  const [phoneNumber, setPhoneNumber] = useState(phone || "");
  const [otp, setOtp] = useState("");
  const [verificationId, setVerificationId] = useState("");
  const [timer, setTimer] = useState(0);
  const [resendDisabled, setResendDisabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [phoneError, setPhoneError] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (timer > 0) {
      const countdown = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);

      return () => clearInterval(countdown);
    } else {
      setResendDisabled(false);
    }
  }, [timer]);

  const setupRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        auth,
        "recaptcha-container",
        {
          size: "invisible",
          callback: (response) => {
            console.log("reCAPTCHA verified");
          },
          "expired-callback": () => {
            console.log("reCAPTCHA expired");
          },
        }
      );
    }
  };

  const validateAndFormatPhoneNumber = (phone) => {
    phone = phone.trim();

    if (!phone.startsWith("+91")) {
      phone = "+91" + phone;
    }

    const phoneNumberWithoutPrefix = phone.replace("+91", "");

    const isValid = /^\d{10}$/.test(phoneNumberWithoutPrefix);

    if (isValid) {
      return phone;
    } else {
      setPhoneError(
        "Invalid phone number. It should contain exactly 10 digits"
      );
      throw new Error(
        "Invalid phone number. It should contain exactly 10 digits"
      );
    }
  };

  const handleSendOtp = async (phoneNumberToSend) => {
    try {
      const formattedPhoneNumber =
        validateAndFormatPhoneNumber(phoneNumberToSend);
      setIsLoading(true);
      setupRecaptcha();
      const appVerifier = window?.recaptchaVerifier;
      try {
        const confirmationResult = await signInWithPhoneNumber(
          auth,
          formattedPhoneNumber,
          appVerifier
        );
        setVerificationId(confirmationResult.verificationId);
        console.log("OTP sent");
        setPhoneNumber(formattedPhoneNumber);
        setResendDisabled(true);
        setTimer(60);
      } catch (error) {
        console.error("Error sending OTP:", error);
        setError(
          "Error sending OTP. Please check the phone number and try again."
        );
      } finally {
        setIsLoading(false);
      }
    } catch (validationError) {
      console.error(validationError);
      setError(
        "Invalid phone number format. Please enter a valid phone number."
      );
    }
  };

  const handleVerifyOtp = async () => {
    setIsLoading(true);
    try {
      const credential = PhoneAuthProvider.credential(verificationId, otp);
      const result = await signInWithCredential(auth, credential);
      if (result.user) {
        console.log("OTP verified successfully");
        // toast.success("OTP verified successfully");
        onPhoneVerified(phoneNumber,otp); // Pass phone number to parent
        closeModal(); // Close the modal
      }
    } catch (error) {
      console.error("Error verifying OTP:", error.message);
      setError("Invalid OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="">
      <div id="recaptcha-container"></div>
      <div className="">
        <div>
          {!verificationId && (
            <>
              <div className="mb-3">
                {error && (
                  <div style={{ color: "red", marginBottom: "10px" }}>
                    <p>{error}</p>
                  </div>
                )}
                <label htmlFor="phoneNumber" className="form-label">
                  Phone Number
                </label>
                <input
                  type="tel"
                  className="form-control"
                  id="phoneNumber"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="Enter phone number"
                />
                {phoneError && <div className="text-danger">{phoneError}</div>}
              </div>
              <div className="d-grid mb-4">
                <button
                  className="tf-btn btn-fill animate-hover-btn radius-3 w-100 justify-content-center"
                  onClick={() => handleSendOtp(phoneNumber)}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div
                      style={{ width: "2rem", height: "2rem" }}
                      className="spinner-border text-light"
                      role="status"
                    >
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  ) : (
                    "Send OTP"
                  )}
                </button>
              </div>
            </>
          )}
          {verificationId && (
            <>
              <div className="mb-3">
                <label htmlFor="otp" className="form-label">
                  OTP
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="otp"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter OTP"
                />
              </div>
              <div className="d-grid mb-3">
                <button
                  className="tf-btn btn-fill animate-hover-btn radius-3 w-100 justify-content-center"
                  onClick={handleVerifyOtp}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div
                      style={{ width: "2rem", height: "2rem" }}
                      className="spinner-border text-light"
                      role="status"
                    >
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  ) : (
                    "Verify OTP"
                  )}
                </button>
              </div>
              <div className="d-grid">
                <button
                  className="btn btn-outline-secondary"
                  onClick={() => handleSendOtp(phoneNumber)}
                  disabled={resendDisabled || isLoading}
                >
                  {resendDisabled ? `Resend OTP (${timer})` : "Resend OTP"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default OTPAuthentication;
