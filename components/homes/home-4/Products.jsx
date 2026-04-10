"use client";
import Productcard4 from "@/components/shopCards/Productcart4";
import { useGetProductsQuery } from "@/redux/api/productsApi";
import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setProducts, setPage as setReduxPage, setCategory as setReduxCategory } from "@/redux/features/productSlice";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

const ENABLE_INTERSECTION_OBSERVER = false;

export const categoriesWithName = [
  { value: "Kids Bags", name: "Kids Bags" },
  { value: "gym_duffle_bag", name: "Gym Duffle Bag" },
  { value: "mens_sling_bag", name: "Men’s Sling Bag" },
  { value: "custom_sling_bag", name: "Custom Sling Bag" },
  { value: "travel_duffle_bag", name: "Travel Duffle Bag" },

  { value: "trekking_bag", name: "Trekking Bag" },
  { value: "laptop_backpack", name: "Laptop Backpack" },
  { value: "ladies_backpack", name: "Ladies’ Backpack" },
  { value: "tote_bag", name: "Women's Tote Bag" },
];

export const categories = [
  "Kids Bags",
  "gym_duffle_bag",
  "mens_sling_bag",
  "womens_sling_bag",
  "travel_duffle_bag",
  "custom_sling_bag",
  // "mens_backpack",
  "laptop_backpack",
  "ladies_backpack",
  "tote_bag",
  "trekking_bag",
];

const formatCategory = (category) =>
  category
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");

export default function Products() {
  const dispatch = useDispatch();
  const reduxState = useSelector((state) => state.product);
  
  const [page, setPage] = useState(reduxState?.page || 1);
  const [allProducts, setAllProducts] = useState(reduxState?.items || []);
  const [selectedCategory, setSelectedCategory] = useState(reduxState?.category);
  const [isCategoryChanging, setIsCategoryChanging] = useState(false);
  
  const observerRef = useRef(null);
  const intersectionObserverRef = useRef(null);
  const hasTriggeredForPageRef = useRef(false);
  const scrollTimeoutRef = useRef(null);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const { data, error, isLoading, isFetching, isSuccess } = useGetProductsQuery(
    {
      resPerPage: 8,
      page,
      ...(selectedCategory && { category: selectedCategory }),
    },
  );

  const filteredProductsCount = data?.filteredProductsCount || 0;
  const totalPages = Math.ceil(filteredProductsCount / 8) || 1;
  const products = data?.filteredProducts || [];

  // Handle category change from URL
  useEffect(() => {
    const categoryFromQuery = searchParams.get("category");
    if (categoryFromQuery && categories.includes(categoryFromQuery)) {
      if (categoryFromQuery !== selectedCategory) {
        setSelectedCategory(categoryFromQuery);
        setIsCategoryChanging(true);
        setPage(1);
        setAllProducts([]);
      }
    } else if (selectedCategory !== null) {
      setSelectedCategory(null);
      setIsCategoryChanging(true);
      setPage(1);
      setAllProducts([]);
    }
  }, [searchParams, selectedCategory]);

  // Update products state
  useEffect(() => {
    if (!isSuccess) return;
    setIsCategoryChanging(false);
    hasTriggeredForPageRef.current = false;
    if (products.length > 0) {
      setAllProducts((prev) => {
        if (page === 1) {
          return [...products];
        }
        const newProducts = products.filter(
          (p) => !prev.some((existing) => existing._id === p._id),
        );
        return [...prev, ...newProducts];
      });
    }
  }, [products, page, isSuccess]);

  // Dispatch products to Redux
  useEffect(() => {
    dispatch(setProducts(allProducts));
  }, [allProducts, dispatch]);

  useEffect(() => {
    dispatch(setReduxPage(page));
  }, [page, dispatch]);

  useEffect(() => {
    dispatch(setReduxCategory(selectedCategory));
  }, [selectedCategory, dispatch]);

  // Auto-scroll to products section when category is selected via URL
  useEffect(() => {
    const categoryParam = searchParams.get("category");
    if (categoryParam && !isLoading && !isFetching && allProducts.length > 0) {
      // 1. Detect if this is a back/forward navigation
      const navigationType = window.performance?.getEntriesByType("navigation")[0]?.type;
      const isBackNavigation = navigationType === "back_forward";

      // 2. Only auto-scroll if it's a NEW navigation and we are at the top
      // This prevents overriding the browser's scroll restoration on back-button
      if (!isBackNavigation && window.scrollY < 150) {
        scrollTimeoutRef.current = setTimeout(() => {
          const productsSection = document.getElementById("products");
          if (productsSection) {
            productsSection.scrollIntoView({
              behavior: "auto",
              block: "start",
            });
          }
        }, 150);
      }
    }

    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
        scrollTimeoutRef.current = null;
      }
    };
  }, [
    selectedCategory,
    isLoading,
    isFetching,
    searchParams,
    allProducts.length,
  ]);

  // Handle category selection
  const handleCategorySelect = (category) => {
    const newSelectedCategory = category === selectedCategory ? null : category;
    if (newSelectedCategory !== selectedCategory) {
      setSelectedCategory(newSelectedCategory);
      const params = new URLSearchParams(searchParams.toString());
      if (newSelectedCategory) {
        params.set("category", newSelectedCategory);
      } else {
        params.delete("category");
      }
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
      setAllProducts([]);
    }
  };

  // Optional infinite scroll observer
  useEffect(() => {
    if (!ENABLE_INTERSECTION_OBSERVER) {
      if (intersectionObserverRef.current) {
        intersectionObserverRef.current.disconnect();
        intersectionObserverRef.current = null;
      }
      return;
    }

    if (intersectionObserverRef.current) {
      intersectionObserverRef.current.disconnect();
      intersectionObserverRef.current = null;
    }

    if (
      isFetching ||
      !isSuccess ||
      page >= totalPages ||
      isCategoryChanging ||
      allProducts.length === 0
    ) {
      return;
    }

    const currentObserverRef = observerRef.current;
    if (!currentObserverRef) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry?.isIntersecting || hasTriggeredForPageRef.current) return;

        hasTriggeredForPageRef.current = true;
        observer.unobserve(entry.target);
        observer.disconnect();
        intersectionObserverRef.current = null;
        setPage((prev) => (prev >= totalPages ? prev : prev + 1));
      },
      {
        rootMargin: "0px 0px 300px 0px",
        threshold: 0,
      },
    );

    intersectionObserverRef.current = observer;
    observer.observe(currentObserverRef);

    return () => {
      observer.disconnect();
      if (intersectionObserverRef.current === observer) {
        intersectionObserverRef.current = null;
      }
    };
  }, [
    isFetching,
    isSuccess,
    page,
    totalPages,
    isCategoryChanging,
    allProducts.length,
  ]);

  const handleLoadMore = () => {
    if (isFetching || page >= totalPages) return;
    setPage((prev) => prev + 1);
  };

  return (
    <section id="products" className="flat-spacing-6 pt-2">
      <div className="container">
        <div className="mb-4 d-flex flex-nowrap flex-md-wrap overflow-x-auto gap-2 justify-content-start justify-content-md-center">
          <button
            className={`btn btn-sm rounded-pill category-pill white-space-no-break me-2 mb-2 ${
              selectedCategory === null
                ? "btn-warning"
                : "btn-outline-secondary"
            }`}
            onClick={() => handleCategorySelect(null)}
          >
            All
          </button>
          {categoriesWithName.map(({ value, name }) => (
            <button
              key={value}
              className={`btn btn-sm rounded-pill category-pill white-space-no-wrap me-2 mb-2 ${
                selectedCategory === value
                  ? "btn-warning"
                  : "btn-outline-secondary"
              }`}
              onClick={() => handleCategorySelect(value)}
            >
              {name}
            </button>
          ))}
        </div>
        {isLoading || (isFetching && !isSuccess) || isCategoryChanging ? (
          <div className="text-center" style={{ minHeight: '500px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="spinner-border text-warning" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : error ? (
          <div className="text-center text-red-500">
            Failed to load products:{" "}
            {error?.data?.error || error?.message || "Unknown error"}
          </div>
        ) : allProducts.length === 0 ? (
          <div className="text-center text-gray-500">
            No products available for this category.
          </div>
        ) : (
          <>
            <div style={{ minHeight: "fit-content" }}>
              <div className="grid-layout" data-grid="grid-4">
                {allProducts.map((product) => (
                  <Productcard4 product={product} key={product._id} />
                ))}
              </div>
              {isFetching && page > 1 && (
                <div className="text-center mt-4">
                  <div className="spinner-border text-warning" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              )}
              {!ENABLE_INTERSECTION_OBSERVER && page < totalPages && (
                <div className="text-center mt-4">
                  <button
                    type="button"
                    className="tf-btn btn-fill animate-hover-btn radius-3"
                    onClick={handleLoadMore}
                    disabled={isFetching}
                  >
                    <span>{isFetching ? "Loading..." : "Load More"}</span>
                  </button>
                </div>
              )}
              {ENABLE_INTERSECTION_OBSERVER && page < totalPages && (
                <div
                  ref={observerRef}
                  style={{
                    height: "50px",
                    marginTop: "20px",
                    background: "transparent",
                  }}
                />
              )}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
