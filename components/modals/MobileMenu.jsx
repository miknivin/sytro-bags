"use client";
import React, { useRef, useState } from "react";
import Link from "next/link";
import { navItems as staticNavItems } from "@/data/menu";
import { usePathname, useSearchParams } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faUser } from "@fortawesome/free-solid-svg-icons";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { useListProductsQuery } from "@/redux/api/productsApi";

export default function MobileMenu() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
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

  // Define categories with proper names (same as homepage)
  const categoriesWithName = [
    { value: "Kids Bags", name: "Kids Bags", href: "/shop-collection-sub/Kids%20Bags" },
    { value: "gym_duffle_bag", name: "Gym Duffle Bag", href: "/shop-collection-sub/gym_duffle_bag" },
    { value: "mens_sling_bag", name: "Men's Sling Bag", href: "/shop-collection-sub/mens_sling_bag" },
    { value: "custom_sling_bag", name: "Custom Sling Bag", href: "/shop-collection-sub/custom_sling_bag" },
    { value: "travel_duffle_bag", name: "Travel Duffle Bag", href: "/shop-collection-sub/travel_duffle_bag" },
    { value: "trekking_bag", name: "Trekking Bag", href: "/shop-collection-sub/trekking_bag" },
    { value: "laptop_backpack", name: "Laptop Backpack", href: "/shop-collection-sub/laptop_backpack" },
    { value: "ladies_backpack", name: "Ladies' Backpack", href: "/shop-collection-sub/ladies_backpack" },
    { value: "tote_bag", name: "Women's Tote Bag", href: "/shop-collection-sub/tote_bag" },
  ];

  // Get categories that actually have products
  const getAvailableCategories = (products) => {
    const availableCategories = new Set();
    products.forEach(product => {
      if (product.category) {
        availableCategories.add(product.category);
      }
    });

    return categoriesWithName.filter(cat =>
      availableCategories.has(cat.value)
    ).map(category => {
      // Map each category to its dedicated page URL


      return {
        id: category.value.toLowerCase().replace(/\s+/g, '-'),
        label: category.name,
        href: category.href || `/shop-collection-sub/${encodeURIComponent(category.value)}`
      };
    });
  };

  const updatedNavItems = staticNavItems.map((item) => {
    if (item.label === "Products") {
      return {
        ...item,
        links: getAvailableCategories(products),
      };
    }
    // Add Back to School menu
    if (item.label === "Back to School" || item.id === "back-to-school") {
      return {
        id: "back-to-school",
        label: "Back to School",
        links: [
          {
            id: "personalized-school-bag",
            label: "Personalized School Bag",
            href: "/shop-collection-sub/Kids%20Bags"
          },
          {
            id: "backpack",
            label: "Backpack",
            href: "/shop-collection-sub/laptop_backpack"
          }
        ]
      };
    }
    return item;
  });

  // Add Back to School menu if it doesn't exist in staticNavItems
  const hasBackToSchool = staticNavItems.some(item =>
    item.label === "Back to School" || item.id === "back-to-school"
  );

  if (!hasBackToSchool) {
    // Find index to insert after Products
    const productsIndex = updatedNavItems.findIndex(item => item.label === "Products");
    const insertIndex = productsIndex !== -1 ? productsIndex + 1 : updatedNavItems.length;

    updatedNavItems.splice(insertIndex, 0, {
      id: "back-to-school",
      label: "Back to School",
      links: [
        {
          id: "personalized-school-bag",
          label: "Personalized School Bag",
          href: "/shop-collection-sub/Kids%20Bags"
        },
        {
          id: "backpack",
          label: "Backpack",
          href: "/shop-collection-sub/laptop_backpack"
        }
      ]
    });
  }

  const handleCategoryClick = (href) => {
    // Close the mobile menu by clicking the close button
    if (closeRef?.current) {
      closeRef.current.click();
    }

    // Navigate to the category page
    router.push(href);
  }; const toggleMenu = (item) => {
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
    // Current URL info
    const pathParts = pathname.split("/").filter(Boolean); // ["shop-collection-sub", "Kids%20Bags"]
    const firstSegment = pathParts[0];   // e.g. "shop-collection-sub" or "about"
    const secondSegment = pathParts[1];  // e.g. "Kids%20Bags" or "laptop_backpack"

    // Decode the segment (handles "Kids%20Bags" → "Kids Bags")
    const decodedSecondSegment = secondSegment ? decodeURIComponent(secondSegment) : null;

    // Helper: exact match for /shop-collection-sub/[slug]
    const isCurrentCategoryPage = firstSegment === "shop-collection-sub" && secondSegment;
    const currentCategoryPath = isCurrentCategoryPage
      ? `/shop-collection-sub/${secondSegment}`
      : null;

    const hrefMatchesCurrentCategory = (href) => {
      if (!href || !currentCategoryPath) return false;
      // Match both encoded and decoded forms
      return href === currentCategoryPath || decodeURIComponent(href) === currentCategoryPath;
    };

    // ——————————————————————————————————————
    // 1. Check if we're on a dedicated category page: /shop-collection-sub/...
    // ——————————————————————————————————————
    if (isCurrentCategoryPage) {
      // Top-level item
      if (menuItem.href && hrefMatchesCurrentCategory(menuItem.href)) {
        return true;
      }

      // Check all sub-links (level 2 and level 3)
      if (menuItem.links) {
        for (let sub of menuItem.links) {
          if (sub.href && hrefMatchesCurrentCategory(sub.href)) {
            return true;
          }
          if (sub.links) {
            for (let deep of sub.links) {
              if (deep.href && hrefMatchesCurrentCategory(deep.href)) {
                return true;
              }
            }
          }
        }
      }
    }

    // ——————————————————————————————————————
    // 2. Regular path matching for all other pages (/, /about, /contact, etc.)
    // ——————————————————————————————————————
    if (menuItem.href && menuItem.href.includes("/") && !menuItem.href.includes("category=")) {
      const itemFirstSegment = menuItem.href.split("/").filter(Boolean)[0];
      if (itemFirstSegment === firstSegment) {
        return true;
      }
    }

    return false;
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
                  className={`mb-menu-link current ${isMenuActive(item) ? "activeMenu" : ""
                    } border-none-b p-0`}
                >
                  <span>{item.label}</span>
                  {item.links && (
                    <FontAwesomeIcon
                      icon={faChevronDown}
                      className={`chevron-icon ${openMenus[item.id] ? "rotate-180" : ""
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
                              className={`sub-nav-link ${isMenuActive(subItem) ? "activeMenu" : ""
                                } p-0 border-none-b`}
                            >
                              <span>{subItem.label}</span>
                              <FontAwesomeIcon
                                icon={faChevronDown}
                                className={`chevron-icon ${openMenus[subItem.id] ? "rotate-180" : ""
                                  }`}
                              />
                            </button>
                            {openMenus[subItem.id] && (
                              <ul className="sub-nav-menu sub-menu-level-2">
                                {subItem.links.map((innerItem, i3) => (
                                  <li key={i3}>
                                    <button
                                      onClick={() => handleCategoryClick(innerItem.href)}
                                      className={`sub-nav-link ${isMenuActive(innerItem)
                                        ? "activeMenu"
                                        : ""
                                        } border-none-b p-0 w-100 text-start`}
                                      data-bs-dismiss="offcanvas"
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
                            className={`sub-nav-link product-category ${subItem.href === pathname ? "activeMenu" : ""
                              } border-none-b p-0 w-100 text-start`}
                            data-bs-dismiss="offcanvas"
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
                  onClick={() => handleCategoryClick('/my-account')}
                  className="user-account border-none-b p-0 w-100 text-start"
                  data-bs-dismiss="offcanvas"
                >
                  <span>My Account</span>
                </button>
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
