"use client";
import Productcard4 from "@/components/shopCards/Productcart4";
import { useGetProductsQuery } from "@/redux/api/productsApi";
import { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { setProducts } from "@/redux/features/productSlice";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

export const categoriesWithName = [
  { value: "Kids Bags", name: "Kids Bags" },
  { value: "gym_duffle_bag", name: "Gym Duffle Bag" },
  { value: "mens_sling_bag", name: "Men’s Sling Bag" },
  // { value: "mens_backpack", name: "Men’s Backpack" },
  { value: "laptop_backpack", name: "Laptop Backpack" },
  { value: "ladies_backpack", name: "Ladies’ Backpack" },
  { value: "tote_bag", name: "Women's Tote Bag" },
];

export const categories = [
  "Kids Bags",
  "gym_duffle_bag",
  "mens_sling_bag",
  "womens_sling_bag",
  // "mens_backpack",
  "laptop_backpack",
  "ladies_backpack",
  "tote_bag",
];

const formatCategory = (category) =>
  category
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");

export default function Products() {
  const [page, setPage] = useState(1);
  const [allProducts, setAllProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isCategoryChanging, setIsCategoryChanging] = useState(false);
  const dispatch = useDispatch();
  const observerRef = useRef(null);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const { data, error, isLoading, isFetching, isSuccess } = useGetProductsQuery(
    {
      resPerPage: 8,
      page,
      ...(selectedCategory && { category: selectedCategory }),
    }
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
    if (products.length > 0) {
      setAllProducts((prev) => {
        if (page === 1) {
          return [...products];
        }
        const newProducts = products.filter(
          (p) => !prev.some((existing) => existing._id === p._id)
        );
        return [...prev, ...newProducts];
      });
    }
  }, [products, page, isSuccess]);

  // Dispatch products to Redux
  useEffect(() => {
    dispatch(setProducts(allProducts));
  }, [allProducts, dispatch]);

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

  // Infinite scroll observer
  useEffect(() => {
    if (isFetching || page >= totalPages || isCategoryChanging) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isFetching) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 0.1 }
    );

    const currentObserverRef = observerRef.current;
    if (currentObserverRef) {
      observer.observe(currentObserverRef);
    }

    return () => {
      if (currentObserverRef) {
        observer.unobserve(currentObserverRef);
      }
    };
  }, [isFetching, page, totalPages, isCategoryChanging]);

  const handleLoadMore = () => {
    if (selectedCategory === null && page < totalPages && !isFetching) {
      setPage((prev) => prev + 1);
    }
  };

  return (
    <section className="flat-spacing-6">
      <div className="container">
        <div className="flat-title mb_1 gap-14 text-center">
          <span className="title wow fadeInUp" data-wow-delay="0s">
            Where Quality Meets Innovation
          </span>
          <p className="sub-title wow fadeInUp" data-wow-delay="0s">
            Crafting excellence into every stitch since 1995
          </p>
        </div>
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
          <div className="text-center">
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
              {selectedCategory === null && page < totalPages && (
                <div className="text-center mt-4">
                  <button
                    className="tf-btn btn-fill justify-content-center fw-6 fs-16 flex-grow-1 animate-hover-btn"
                    onClick={handleLoadMore}
                    disabled={isFetching}
                  >
                    Load More
                  </button>
                </div>
              )}
              {page < totalPages && (
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
