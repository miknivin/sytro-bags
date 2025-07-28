"use client";
import React, { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";

export default function MyAccount() {
  const user = useSelector((state) => state.auth.user);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="my-account-content account-dashboard">
      <div className="mb_60">
        <h5 className="fw-5 mb_20">Hello {user?.name || ""}</h5>
        <p>
          From your account dashboard you can view your{" "}
          <Link className="text_primary" href={`/my-account-orders`}>
            recent orders
          </Link>
          {/* , manage your{" "}
          <Link className="text_primary" href={`/my-account-edit`}>
            shipping and billing addresses
          </Link>
          ,  */}
          {" "}and{" "}
          <Link className="text_primary" href={`/my-account-edit`}>
            edit your account details
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
