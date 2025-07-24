export default function DetailsStatic() {
  return (
    <>
      <div className="tf-product-info-delivery-return">
        <div style={{ display: "flex", alignItems: "stretch" }} className="row">
          <div className="col-xl-4 col-12 h-100">
            <div className="tf-product-delivery h-100">
              <div className="icon">
                <img
                  width={50}
                  src="https://ik.imagekit.io/c1jhxlxiy/package.png?updatedAt=1751890889661"
                  alt=""
                />
              </div>
              <p>
                Estimate delivery time:
                <span className="fw-7">4-6 days</span>
              </p>
            </div>
          </div>

          <div className="col-xl-4 col-12 h-100">
            <div className="tf-product-delivery h-100">
              <div className="icon">
                <img
                  width={50}
                  src="https://ik.imagekit.io/c1jhxlxiy/free-delivery.png?updatedAt=1751890559793"
                  alt=""
                />
              </div>
              <p>All India Free Shipping</p>
            </div>
          </div>
          <div className="col-xl-4 col-12 h-100">
            <div className="tf-product-delivery h-100">
              <div className="icon">
                <img
                  width={50}
                  src="https://ik.imagekit.io/c1jhxlxiy/return-and%20refund.png?updatedAt=1753343291913"
                  alt=""
                />
              </div>
              <p>5 day return & refund</p>
            </div>
          </div>
        </div>
      </div>
      <div className="tf-product-info-trust-seal">
        <div className="tf-product-trust-mess">
          <i className="icon-safe" />
          <p className="fw-6">Guarantee Safe Checkout</p>
        </div>
      </div>
    </>
  );
}
