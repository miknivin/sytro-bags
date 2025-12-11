"use client";
import React, { useRef, useState } from "react";
import emailjs from "@emailjs/browser";
export default function ContactForm2() {
  const formRef = useRef();
  const [success, setSuccess] = useState(true);
  const [showMessage, setShowMessage] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleShowMessage = () => {
    setShowMessage(true);
    setTimeout(() => {
      setShowMessage(false);
    }, 2000);
  };

  const saveToAdmin = async (formData) => {
    try {
      const response = await fetch("/api/enquiry", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      return result.success;
    } catch (error) {
      console.error("Failed to save to admin:", error);
      return false;
    }
  };

  const sendMail = async (e) => {
    setLoading(true);
    
    // Get form data
    const formData = new FormData(formRef.current);
    const enquiryData = {
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone") || "",
      message: formData.get("message"),
    };

    // Validate that either email or phone is provided
    if (!enquiryData.email && !enquiryData.phone) {
      alert("Please provide either an email address or phone number.");
      setLoading(false);
      return;
    }

    try {
      // Save to admin panel first
      const adminSaved = await saveToAdmin(enquiryData);
      
      // Send email
      const emailResult = await emailjs.sendForm(
        "service_noj8796", 
        "template_fs3xchn", 
        formRef.current, 
        {
          publicKey: "iG4SCmR-YtJagQ4gV",
        }
      );

      if (emailResult.status === 200 && adminSaved) {
        setSuccess(true);
        handleShowMessage();
        formRef.current.reset();
      } else {
        setSuccess(false);
        handleShowMessage();
      }
    } catch (error) {
      console.error("Form submission error:", error);
      setSuccess(false);
      handleShowMessage();
    } finally {
      setLoading(false);
    }
  };
  return (
    <section className="bg_grey-7 flat-spacing-9">
      <div className="container">
        <div className="flat-title">
          <span className="title">Carry Excellence</span>
          <p className="sub-title text_black-2">
            Because your journey deserves the best companion
          </p>
        </div>
        <div>
          <form
            ref={formRef}
            onSubmit={(e) => {
              e.preventDefault();
              sendMail();
            }}
            className="mw-705 mx-auto text-center form-contact"
            id="contactform"
            action="./contact/contact-process.php"
            method="post"
          >
            <div className="d-flex gap-15 mb_15">
              <fieldset className="w-100">
                <input
                  type="text"
                  name="name"
                  id="name"
                  required
                  placeholder="Name *"
                />
              </fieldset>
              <fieldset className="w-100">
                <input
                  type="email"
                  autoComplete="abc@xyz.com"
                  name="email"
                  id="email"
                  placeholder="Email"
                />
              </fieldset>
            </div>
            <div className="mb_15">
              <fieldset className="w-100">
                <input
                  type="tel"
                  name="phone"
                  id="phone"
                  placeholder="Phone Number"
                />
              </fieldset>
            </div>
            <div className="mb_15">
              <textarea
                placeholder="Message"
                name="message"
                id="message"
                required
                cols={30}
                rows={10}
                defaultValue={""}
              />
            </div>
            <div className="send-wrap">
              <div className={`tfSubscribeMsg ${showMessage ? "active" : ""}`}>
                {success ? (
                  <p style={{ color: "rgb(52, 168, 83)" }}>
                    Message has been sent successfully and saved to our system.
                  </p>
                ) : (
                  <p style={{ color: "red" }}>Something went wrong. Please try again.</p>
                )}
              </div>
              <button
                type="submit"
                disabled={loading}
                className="tf-btn radius-3 btn-fill animate-hover-btn justify-content-center"
              >
                {loading ? "Sending..." : "Send"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
