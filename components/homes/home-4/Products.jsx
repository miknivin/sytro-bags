"use client";
import Productcard4 from "@/components/shopCards/Productcart4";
import { useGetProductsQuery } from "@/redux/api/productsApi";
import { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { setProducts } from "@/redux/features/productSlice";

export default function Products() {
  const [page, setPage] = useState(1);
  const [allProducts, setAllProducts] = useState([]);
  const dispatch = useDispatch();
  const observerRef = useRef(null);

  const { data, error, isLoading, isFetching } = useGetProductsQuery({
    resPerPage: 8,
    page,
  });

  //console.log("API Response:", { data, error, isLoading, isFetching, page });

  const filteredProductsCount = data?.filteredProductsCount || 0;
  const totalPages = Math.ceil(filteredProductsCount / 8) || 1;
  const products = data?.filteredProducts || [];

  // Update products only when new unique data arrives
  useEffect(() => {
    if (products.length > 0) {
      setAllProducts((prev) => {
        // Filter out duplicates by _id
        const newProducts = products.filter(
          (p) => !prev.some((existing) => existing._id === p._id)
        );
        const updatedProducts = [...prev, ...newProducts];
        // console.log(
        //   "New Products Added:",
        //   updatedProducts.length,
        //   "Page:",
        //   page
        // );
        dispatch(setProducts(updatedProducts));
        return updatedProducts;
      });
    }
  }, [data, dispatch, page]); // Added page to dependencies

  // Infinite scroll observer
  useEffect(() => {
    if (isFetching || page >= totalPages) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isFetching) {
          // console.log("Observer Triggered, Loading Page:", page + 1);
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
  }, [isFetching, page, totalPages]);

  return (
    <section className="flat-spacing-6">
      <div className="container">
        <div className="flat-title mb_1 gap-14">
          <span className="title wow fadeInUp" data-wow-delay="0s">
            Where Quality Meets Innovation
          </span>
          <p className="sub-title wow fadeInUp" data-wow-delay="0s">
            Crafting excellence into every stitch since 1995
          </p>
        </div>

        {isLoading && page === 1 ? (
          <div className="text-center">
            <div class="spinner-border text-warning" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : error ? (
          <div className="text-center text-red-500">
            Failed to load products:{" "}
            {error?.data?.error || error?.message || "Unknown error"}
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
                  <div class="spinner-border text-warning" role="status">
                    <span class="visually-hidden">Loading...</span>
                  </div>
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
                >
                  {/* Visible for debugging, can be hidden */}
                  {isFetching ? "" : "Scroll to load more"}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
