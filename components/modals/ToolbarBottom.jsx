"use client";
import { useSelector } from "react-redux";
import Link from "next/link";
import { usePathname } from "next/navigation";
import CartLength from "../common/CartLength";
import WishlistLength from "../common/WishlistLength";

export default function ToolbarBottom() {
  const user = useSelector((state) => state.auth.isAuthenticated);
  const pathname = usePathname(); // Get current route

  return (
    <div className="tf-toolbar-bottom type-1150">
      <div className={`toolbar-item ${pathname === "/" ? "active" : ""}`}>
        <Link href="/">
          <div className="toolbar-icon">
            <i className="icon-shop" />
          </div>
          <div className="toolbar-label">Home</div>
        </Link>
      </div>
      <div
        className={`toolbar-item ${
          pathname === "#canvasSearch" ? "active" : ""
        }`}
      >
        <a
          href="#canvasSearch"
          data-bs-toggle="offcanvas"
          aria-controls="offcanvasLeft"
        >
          <div className="toolbar-icon">
            <i className="icon-search" />
          </div>
          <div className="toolbar-label">Search</div>
        </a>
      </div>
      <div
        className={`toolbar-item ${
          ["my-account", "my-account-orders", "my-account-edit"].some((route) =>
            pathname.includes(route)
          )
            ? "active"
            : ""
        }`}
      >
        {user ? (
          <Link href="/my-account">
            <div className="toolbar-icon">
              <i className="icon-account" />
            </div>
            <div className="toolbar-label">Account</div>
          </Link>
        ) : (
          <a href="#login" data-bs-toggle="modal">
            <div className="toolbar-icon">
              <i className="icon-account" />
            </div>
            <div className="toolbar-label">Login</div>
          </a>
        )}
      </div>
      {/* Uncomment if you want Wishlist back */}
      {/* <div className={`toolbar-item ${pathname === "/wishlist" ? "active" : ""}`}>
        <Link href="/wishlist">
          <div className="toolbar-icon">
            <i className="icon-heart" />
            <div className="toolbar-count">
              <WishlistLength />
            </div>
          </div>
          <div className="toolbar-label">Wishlist</div>
        </Link>
      </div> */}
      <div
        className={`toolbar-item ${
          pathname === "#shoppingCart" ? "active" : ""
        }`}
      >
        <a href="#shoppingCart" data-bs-toggle="modal">
          <div className="toolbar-icon">
            <i className="icon-bag" />
            <div className="toolbar-count">
              <CartLength />
            </div>
          </div>
          <div className="toolbar-label">Cart</div>
        </a>
      </div>
    </div>
  );
}
