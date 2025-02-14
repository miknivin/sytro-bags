"use client";
import Productcard4 from "@/components/shopCards/Productcart4";
import { useGetProductsQuery } from "@/redux/api/productsApi";

import { useState, useEffect } from "react";
import { setProducts } from "@/redux/features/productSlice";
import { useDispatch, useSelector } from "react-redux";
export default function Products() {
  const [page, setPage] = useState(1); 
  const dispatch = useDispatch();
  const { data, error, isLoading, isFetching } = useGetProductsQuery({
    page
  });

  const products = data?.filteredProducts || [];
  const totalPages = data?.totalPages || 1;

  const handleLoadMore = () => {
    if (page < totalPages) {
      setPage((prev) => prev + 1);
    }
  };
  useEffect(() => {
    if (data?.filteredProducts) {
      console.log(data?.filteredProducts)
      dispatch(setProducts(data.filteredProducts)); 
    }
  }, [data, dispatch]);

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

        {/* Handle Loading State */}
        {isLoading ? (
          <div className="text-center">Loading products...</div>
        ) : error ? (
          <div className="text-center text-red-500">Failed to load products.</div>
        ) : (
          <>
            <div className="grid-layout" data-grid="grid-4">
              {products.map((product, i) => (
                <Productcard4 product={product} key={product._id || i} />
              ))}
            </div>

            {page < totalPages && (
              <div className="tf-pagination-wrap view-more-button text-center">
                <button
                  className={`tf-btn-loading tf-loading-default style-2 btn-loadmore ${
                    isFetching ? "loading" : ""
                  }`}
                  onClick={handleLoadMore}
                  disabled={isFetching}
                >
                  <span className="text">Load more</span>
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
