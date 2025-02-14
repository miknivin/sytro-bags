import React from "react";
import Image from "next/image";
export default function About() {
  return (
    <>
      <section className="flat-spacing-23 flat-image-text-section">
        <div className="container">
          <div className="tf-grid-layout md-col-2 tf-img-with-text style-4">
            <div className="tf-image-wrap">
              <Image
                className="lazyload w-100"
                data-src="/images/collections/collection-69.webp"
                alt="collection-img"
                src="/images/collections/collection-69.webp"
                width={600}
                height={499}
              />
            </div>
            <div className="tf-content-wrap px-0 d-flex justify-content-center w-100">
              <div>
                <div className="heading">Established - 1995</div>
                <div className="text ">
                    <p className="abt-text">
                    Founded by visionary entrepreneur Nazar T M, what started as a modest workshop in Ernakulam Broadway has grown into one of India's most trusted bag manufacturers. Our 35-year legacy in bag manufacturing, coupled with our modern brand identity established in 2019, represents the perfect fusion of experience and innovation.
                    </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="flat-spacing-15">
        <div className="container">
          <div className="tf-grid-layout md-col-2 tf-img-with-text style-4">
            <div className="tf-content-wrap px-0 d-flex justify-content-center w-100">
              <div className="abt-text">
                <div className="heading">Our Mission</div>
                <div className="text">
                  <p >
                  To provide every customer with bags that exceed expectations in quality, durability, and style while maintaining affordability and sustainable practices. We aim to be the benchmark in Indian bag manufacturing, creating products that make every journey memorable.
                  </p>
                
                </div>
              </div>
            </div>
            <div className="grid-img-group">
              <div className="tf-image-wrap box-img item-1">
                <div className="img-style">
                  <Image
                    className="lazyload"
                    src="/images/collections/collection-71.jpg"
                    data-=""
                    alt="img-slider"
                    width={337}
                    height={388}
                  />
                </div>
              </div>
              <div className="tf-image-wrap box-img item-2">
                <div className="img-style">
                  <Image
                    className="lazyload"
                    src="/images/collections/collection-70.webp"
                    data-=""
                    alt="img-slider"
                    width={400}
                    height={438}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
