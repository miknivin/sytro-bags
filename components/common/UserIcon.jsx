"use client";
import { useSelector } from "react-redux";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function UserIcon({ isText = false }) {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const [authState, setAuthState] = useState(isAuthenticated);

  useEffect(() => {
    setAuthState(isAuthenticated);
    console.log(isAuthenticated, "isAuthenticated");
  }, [isAuthenticated]);

  return (
    <>
      {authState ? (
        <Link href={"/my-account"} className="nav-icon-item text-white">
          {!isText && <i className="icon icon-account" />}
          {isText && <span className="text-black">My Account</span>}
        </Link>
      ) : (
        <Link
          href={"#login"}
          data-bs-toggle="modal"
          className="nav-icon-item text-white"
        >
          {!isText && <i className="icon icon-account" />}
          {isText && <span className="text-black">Login</span>}
        </Link>
      )}
    </>
  );
}
