"use client";

import React, { useState } from "react";
import Link from "next/link";
import { navItems as staticNavItems } from "@/data/menu";
import { usePathname, useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { useSelector } from "react-redux";
import { useListProductsQuery } from "@/redux/api/productsApi";
import OffcanvasShell from "@/components/modals/shared/OffcanvasShell";

export default function MobileMenu({
  isOpen = false,
  onClose,
  onOpenLogin,
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [openMenus, setOpenMenus] = useState({});
  const productsFromStore = useSelector((state) => state.product.items) || [];
  const user = useSelector((state) => state.auth.user);

  const shouldFetch = productsFromStore.length <= 30;
  const { data, isLoading, isError } = useListProductsQuery(undefined, {
    skip: !shouldFetch,
  });

  const products =
    shouldFetch && data ? data.filteredProducts : productsFromStore;

  const categoriesWithName = [
    {
      value: "Kids Bags",
      name: "Kids Bags",
      href: "/shop-collection-sub/Kids%20Bags",
    },
    {
      value: "gym_duffle_bag",
      name: "Gym Duffle Bag",
      href: "/shop-collection-sub/gym_duffle_bag",
    },
    {
      value: "mens_sling_bag",
      name: "Men's Sling Bag",
      href: "/shop-collection-sub/mens_sling_bag",
    },
    {
      value: "custom_sling_bag",
      name: "Custom Sling Bag",
      href: "/shop-collection-sub/custom_sling_bag",
    },
    {
      value: "travel_duffle_bag",
      name: "Travel Duffle Bag",
      href: "/shop-collection-sub/travel_duffle_bag",
    },
    {
      value: "trekking_bag",
      name: "Trekking Bag",
      href: "/shop-collection-sub/trekking_bag",
    },
    {
      value: "laptop_backpack",
      name: "Laptop Backpack",
      href: "/shop-collection-sub/laptop_backpack",
    },
    {
      value: "ladies_backpack",
      name: "Ladies' Backpack",
      href: "/shop-collection-sub/ladies_backpack",
    },
    {
      value: "tote_bag",
      name: "Women's Tote Bag",
      href: "/shop-collection-sub/tote_bag",
    },
  ];

  const getAvailableCategories = (availableProducts) => {
    const availableCategories = new Set();
    availableProducts.forEach((product) => {
      if (product.category) {
        availableCategories.add(product.category);
      }
    });

    return categoriesWithName
      .filter((category) => availableCategories.has(category.value))
      .map((category) => ({
        id: category.value.toLowerCase().replace(/\s+/g, "-"),
        label: category.name,
        href:
          category.href ||
          `/shop-collection-sub/${encodeURIComponent(category.value)}`,
      }));
  };

  const updatedNavItems = staticNavItems.map((item) => {
    if (item.label === "Products") {
      return {
        ...item,
        links: getAvailableCategories(products),
      };
    }

    if (item.label === "Back to School" || item.id === "back-to-school") {
      return {
        id: "back-to-school",
        label: "Back to School",
        links: [
          {
            id: "personalized-school-bag",
            label: "Personalized School Bag",
            href: "/shop-collection-sub/Kids%20Bags",
          },
          {
            id: "backpack",
            label: "Backpack",
            href: "/shop-collection-sub/laptop_backpack",
          },
        ],
      };
    }

    return item;
  });

  const hasBackToSchool = staticNavItems.some(
    (item) =>
      item.label === "Back to School" || item.id === "back-to-school",
  );

  if (!hasBackToSchool) {
    const productsIndex = updatedNavItems.findIndex(
      (item) => item.label === "Products",
    );
    const insertIndex =
      productsIndex !== -1 ? productsIndex + 1 : updatedNavItems.length;

    updatedNavItems.splice(insertIndex, 0, {
      id: "back-to-school",
      label: "Back to School",
      links: [
        {
          id: "personalized-school-bag",
          label: "Personalized School Bag",
          href: "/shop-collection-sub/Kids%20Bags",
        },
        {
          id: "backpack",
          label: "Backpack",
          href: "/shop-collection-sub/laptop_backpack",
        },
      ],
    });
  }

  const handleCategoryClick = (href) => {
    onClose?.();
    router.push(href);
  };

  const handleLoginClick = (event) => {
    event.preventDefault();
    onClose?.();
    onOpenLogin?.();
  };

  const toggleMenu = (item) => {
    if (item.href) {
      handleCategoryClick(item.href);
      return;
    }

    setOpenMenus((prev) => ({
      ...prev,
      [item.id]: !prev[item.id],
    }));
  };

  const isMenuActive = (menuItem) => {
    const pathParts = pathname.split("/").filter(Boolean);
    const firstSegment = pathParts[0];
    const secondSegment = pathParts[1];
    const currentCategoryPath =
      firstSegment === "shop-collection-sub" && secondSegment
        ? `/shop-collection-sub/${secondSegment}`
        : null;

    const hrefMatchesCurrentCategory = (href) => {
      if (!href || !currentCategoryPath) {
        return false;
      }

      return (
        href === currentCategoryPath ||
        decodeURIComponent(href) === currentCategoryPath
      );
    };

    if (currentCategoryPath) {
      if (menuItem.href && hrefMatchesCurrentCategory(menuItem.href)) {
        return true;
      }

      if (menuItem.links) {
        for (const subItem of menuItem.links) {
          if (subItem.href && hrefMatchesCurrentCategory(subItem.href)) {
            return true;
          }

          if (subItem.links) {
            for (const deepItem of subItem.links) {
              if (deepItem.href && hrefMatchesCurrentCategory(deepItem.href)) {
                return true;
              }
            }
          }
        }
      }
    }

    if (
      menuItem.href &&
      menuItem.href.includes("/") &&
      !menuItem.href.includes("category=")
    ) {
      const itemFirstSegment = menuItem.href.split("/").filter(Boolean)[0];
      if (itemFirstSegment === firstSegment) {
        return true;
      }
    }

    return false;
  };

  if (isLoading && shouldFetch) {
    return <div></div>;
  }

  if (isError && shouldFetch) {
    return <div>Error fetching products</div>;
  }

  return (
    <OffcanvasShell
      isOpen={isOpen}
      onClose={onClose}
      className="offcanvas-start canvas-mb"
    >
      <span
        className="icon-close icon-close-popup"
        onClick={onClose}
        aria-label="Close"
      />
      <div className="mb-canvas-content">
        <div className="mb-body">
          <ul className="nav-ul-mb" id="wrapper-menu-navigation">
            {updatedNavItems.map((item, index) => (
              <li key={index} className="nav-mb-item">
                <button
                  onClick={() => toggleMenu(item)}
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
                    {item.links?.map((subItem, subIndex) => (
                      <li key={subIndex}>
                        {subItem.links ? (
                          <>
                            <button
                              onClick={() => toggleMenu(subItem)}
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
                                {subItem.links.map((innerItem, innerIndex) => (
                                  <li key={innerIndex}>
                                    <button
                                      onClick={() =>
                                        handleCategoryClick(innerItem.href)
                                      }
                                      className={`sub-nav-link ${
                                        isMenuActive(innerItem)
                                          ? "activeMenu"
                                          : ""
                                      } border-none-b p-0 w-100 text-start`}
                                    >
                                      {innerItem.label}
                                      {innerItem.demoLabel && (
                                        <div className="demo-label">
                                          <span className="demo-new">New</span>
                                        </div>
                                      )}
                                    </button>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </>
                        ) : (
                          <button
                            onClick={() => handleCategoryClick(subItem.href)}
                            className={`sub-nav-link product-category ${
                              subItem.href === pathname ? "activeMenu" : ""
                            } border-none-b p-0 w-100 text-start`}
                          >
                            {subItem.label}
                            {subItem.demoLabel && (
                              <div className="demo-label">
                                <span className="demo-new">New</span>
                              </div>
                            )}
                          </button>
                        )}
                      </li>
                    ))}
                  </div>
                )}
              </li>
            ))}
            <li className="nav-account">
              {user ? (
                <button
                  onClick={() => handleCategoryClick("/my-account")}
                  className="user-account border-none-b p-0 w-100 text-start"
                >
                  <span>My Account</span>
                </button>
              ) : (
                <a
                  href="/login"
                  onClick={handleLoginClick}
                  className="user-account"
                >
                  <span>Login</span>
                </a>
              )}
            </li>
          </ul>
        </div>
      </div>
    </OffcanvasShell>
  );
}
