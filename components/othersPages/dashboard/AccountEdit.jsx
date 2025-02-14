"use client";
import React, { useEffect, useState } from "react";
import { useUpdateProfileMutation } from "@/redux/api/userApi"; // Adjust path
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

export default function AccountEdit() {
  const router = useRouter();
  const [updateProfile, { isLoading, isError, error }] =
    useUpdateProfileMutation();
  const auth = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    console.log(auth);

    if (!auth.isAuthenticated) {
      router.push("/");
    } else if (auth.user) {
      setFormData({
        name: auth.user.name || "",
        email: auth.user.email || "",
        phone: auth.user.phone || "",
      });
    }
  }, [auth]);

  // Handle Input Changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await updateProfile({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
      }).unwrap();

      toast.success("Profile updated successfully!");
    } catch (err) {
      console.error("Update failed:", err);
      toast.error("Failed to update profile.");
    }
  };

  return (
    <div className="my-account-content account-edit">
      <div className="">
        <form onSubmit={handleSubmit} className="" id="form-password-change">
          <div className="tf-field style-1 mb_15">
            <input
              className="tf-field-input tf-input"
              placeholder=" "
              type="text"
              id="name"
              required
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
            <label className="tf-field-label fw-4 text_black-2" htmlFor="name">
              Name
            </label>
          </div>

          <div className="tf-field style-1 mb_15">
            <input
              className="tf-field-input tf-input"
              placeholder=" "
              type="email"
              autoComplete="email"
              required
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
            <label className="tf-field-label fw-4 text_black-2" htmlFor="email">
              Email
            </label>
          </div>
          <div className="tf-field style-1 mb_15">
            <input
              className="tf-field-input tf-input"
              placeholder=" "
              type="tel"
              required
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />
            <label className="tf-field-label fw-4 text_black-2" htmlFor="phone">
              Phone
            </label>
          </div>
          {isError && (
            <p className="text-red-500">
              {error?.data?.message || "Update failed"}
            </p>
          )}
          <div className="mb_20">
            <button
              type="submit"
              className="tf-btn w-100 radius-3 btn-fill animate-hover-btn justify-content-center"
              disabled={isLoading}
            >
              {isLoading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
