"use client";
import { useSelector } from "react-redux";
import Link from "next/link";

export default function UserIcon({ isText = false, onOpenLogin }) {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  return (
    <>
      {isAuthenticated ? (
        <Link href={"/my-account"} className="nav-icon-item text-white">
          {!isText && <i className="icon icon-account" />}
          {isText && <span className="text-black">My Account</span>}
        </Link>
      ) : (
        <a
          href="/login"
          className="nav-icon-item text-white"
          onClick={(event) => {
            event.preventDefault();
            onOpenLogin?.();
          }}
        >
          {!isText && <i className="icon icon-account" />}
          {isText && <span className="text-black">Login</span>}
        </a>
      )}
    </>
  );
}
