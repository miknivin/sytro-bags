import Footer1 from "@/components/footers/Footer1";
import Header4 from "@/components/headers/Header4";
import ProductDetailsClient from "@/components/shopDetails/ProductDetailClient";
import Link from "next/link";

export default function Page({ params }) {
  const { id } = params;

  return (
    <>
      <Header4 />
      <div className="tf-breadcrumb">
        <div className="container">
          <div className="tf-breadcrumb-wrap d-flex justify-content-between flex-wrap align-items-center">
            <div className="tf-breadcrumb-list">
              <Link href={`/`} className="text">
                Home
              </Link>
              <i className="icon icon-arrow-right" />
              <span className="text">Product Details</span>
            </div>
          </div>
        </div>
      </div>
      <ProductDetailsClient productId={id} />
      <Footer1 />
    </>
  );
}
