"use client";
import React, { useRef, useState } from "react";
import Link from "next/link";
import { navItems as staticNavItems } from "@/data/menu";
import { usePathname } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faUser } from "@fortawesome/free-solid-svg-icons";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { useListProductsQuery } from "@/redux/api/productsApi";

export default function MobileMenu() {
  const router = useRouter();
  const pathname = usePathname();
  const [openMenus, setOpenMenus] = useState({});
  const [shouldDismiss, setShouldDismiss] = useState(false);
  const productsFromStore = useSelector((state) => state.product.items) || [];
  const user = useSelector((state) => state.auth.user);
  const closeRef = useRef();

  const shouldFetch = productsFromStore.length <= 30;
  const { data, isLoading, isError } = useListProductsQuery(undefined, {
    skip: !shouldFetch,
  });

  const products =
    shouldFetch && data ? data.filteredProducts : productsFromStore;

  const updatedNavItems = staticNavItems.map((item) => {
    if (item.label === "Products") {
      return {
        ...item,
        links: [
          ...products.map((product) => ({
            id: product._id,
            label: product.name,
            href: `/product-detail/${product._id}`,
          })),
        ],
      };
    }
    return item;
  });

  const toggleMenu = (item) => {
    if (item.href) {
      setShouldDismiss(true);
      router.push(item.href);
      return;
    }
    setShouldDismiss(false);
    setOpenMenus((prev) => ({
      ...prev,
      [item.id]: !prev[item.id],
    }));
  };

  const isMenuActive = (menuItem) => {
    let active = false;
    if (menuItem.href?.includes("/")) {
      if (menuItem.href?.split("/")[1] === pathname.split("/")[1]) {
        active = true;
      }
    }
    if (menuItem.links) {
      menuItem.links.forEach((elm2) => {
        if (elm2.href?.includes("/")) {
          if (elm2.href?.split("/")[1] === pathname.split("/")[1]) {
            active = true;
          }
        }
        if (elm2.links) {
          elm2.links.forEach((elm3) => {
            if (elm3.href.split("/")[1] === pathname.split("/")[1]) {
              active = true;
            }
          });
        }
      });
    }
    return active;
  };

  if (isLoading && shouldFetch) {
    return <div>Loading products...</div>;
  }

  if (isError && shouldFetch) {
    return <div>Error fetching products</div>;
  }

  return (
    <div className="offcanvas offcanvas-start canvas-mb" id="mobileMenu">
      <span
        className="icon-close icon-close-popup"
        data-bs-dismiss="offcanvas"
        aria-label="Close"
        ref={closeRef}
      />
      <div className="mb-canvas-content">
        <div className="mb-body">
          <ul className="nav-ul-mb" id="wrapper-menu-navigation">
            {updatedNavItems.map((item, i) => (
              <li key={i} className="nav-mb-item">
                <button
                  onClick={() => toggleMenu(item)}
                  {...(shouldDismiss && { "data-bs-dismiss": "offcanvas" })}
                  className={`mb-menu-link current ${
                    isMenuActive(item) ? "activeMenu" : ""
                  } border-none-b p-0`}
                >
                  <span>{item.label}</span>
                  {item.links && (
                    <FontAwesomeIcon
                      icon={faChevronDown}
                      className={`chevron-icon ${
                        openMenus[item.id] ? "rotate-180" : ""
                      }`}
                    />
                  )}
                </button>
                {openMenus[item.id] && (
                  <div className="sub-nav-menu">
                    {item.links?.map((subItem, i2) => (
                      <li key={i2}>
                        {subItem.links ? (
                          <>
                            <button
                              onClick={() => toggleMenu(subItem.id)}
                              className={`sub-nav-link ${
                                isMenuActive(subItem) ? "activeMenu" : ""
                              } p-0 border-none-b`}
                            >
                              <span>{subItem.label}</span>
                              <FontAwesomeIcon
                                icon={faChevronDown}
                                className={`chevron-icon ${
                                  openMenus[subItem.id] ? "rotate-180" : ""
                                }`}
                              />
                            </button>
                            {openMenus[subItem.id] && (
                              <ul className="sub-nav-menu sub-menu-level-2">
                                {subItem.links.map((innerItem, i3) => (
                                  <li key={i3}>
                                    <Link
                                      href={innerItem.href}
                                      className={`sub-nav-link ${
                                        isMenuActive(innerItem)
                                          ? "activeMenu"
                                          : ""
                                      }`}
                                    >
                                      {innerItem.label}
                                      {innerItem.demoLabel && (
                                        <div className="demo-label">
                                          <span className="demo-new">New</span>
                                        </div>
                                      )}
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </>
                        ) : (
                          <Link
                            href={subItem.href}
                            className={`sub-nav-link ${
                              isMenuActive(subItem) ? "activeMenu" : ""
                            }`}
                          >
                            {subItem.label}
                            {subItem.demoLabel && (
                              <div className="demo-label">
                                <span className="demo-new">New</span>
                              </div>
                            )}
                          </Link>
                        )}
                      </li>
                    ))}
                  </div>
                )}
              </li>
            ))}
            <li className="nav-account">
              {user ? (
                <Link href="/my-account" className="user-account">
                  <span>My Account</span>
                </Link>
              ) : (
                <a
                  href="#login"
                  data-bs-toggle="modal"
                  data-bs-dismiss="offcanvas"
                  onClick={() => closeRef?.current?.click()}
                  className="user-account"
                >
                  <span>Login</span>
                </a>
              )}
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
