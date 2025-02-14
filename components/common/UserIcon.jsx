"use client";
import { useSelector } from "react-redux";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function UserIcon() {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const [authState, setAuthState] = useState(isAuthenticated);

  useEffect(() => {
    setAuthState(isAuthenticated);
    console.log(isAuthenticated, "isAuthenticated");
  }, [isAuthenticated]);

  return (
    <>
      {authState ? (
        <Link href={"/my-account"} className="nav-icon-item">
          <i className="icon icon-account" />
        </Link>
      ) : (
        <Link href={"#login"} data-bs-toggle="modal" className="nav-icon-item">
          <i className="icon icon-account" />
        </Link>
      )}
    </>
  );
}
