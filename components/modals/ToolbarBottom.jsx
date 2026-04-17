"use client";
import { useSelector } from "react-redux";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import CartLength from "../common/CartLength";
import Login from "@/components/modals/Login";
import Register from "@/components/modals/Register";
import SearchModal from "@/components/modals/SearchModal";
import ShopCart from "@/components/modals/ShopCart";

export default function ToolbarBottom() {
  const user = useSelector((state) => state.auth.isAuthenticated);
  const pathname = usePathname();
  const [activeAuthModal, setActiveAuthModal] = useState(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    setActiveAuthModal(null);
    setIsSearchOpen(false);
    setIsCartOpen(false);
  }, [pathname]);

  return (
    <>
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
            href="/search"
            onClick={(event) => {
              event.preventDefault();
              setIsSearchOpen(true);
            }}
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
            <a
              href="/login"
              onClick={(event) => {
                event.preventDefault();
                setActiveAuthModal("login");
              }}
            >
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
          <a
            href="/cart"
            onClick={(event) => {
              event.preventDefault();
              setIsCartOpen(true);
            }}
          >
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
      <Login
        isOpen={activeAuthModal === "login"}
        onClose={() => setActiveAuthModal(null)}
        onSwitchToRegister={() => setActiveAuthModal("register")}
      />
      <Register
        isOpen={activeAuthModal === "register"}
        onClose={() => setActiveAuthModal(null)}
        onSwitchToLogin={() => setActiveAuthModal("login")}
      />
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
      <ShopCart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}
