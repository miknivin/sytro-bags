"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useSelector } from "react-redux";

export default function FindSize() {
  const productById = useSelector((state) => state.product.productById);
  const [choiceImages, setChoiceImages] = useState([]);
  const [activeIndex, setActiveIndex] = useState(null);

  const handleClick = (index) => {
    setActiveIndex(index);
  };
  useEffect(() => {
    console.log("Product By ID:", productById);
    if (productById && productById._id === "67a70ca93f464380b64b05a6") {
      setChoiceImages(productById?.choiceImages || []);
      console.log("Choice Images:", productById?.choiceImages);
    }
  }, [productById]);

  return (
    <div
      className="modal fade modalDemo customize tf-product-modal"
      id="custom_bag"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content" style={{ overflowY: "auto" }}>
          <div className="header">
            <div className="demo-title">Choose from existing designs</div>
            <span
              className="icon-close icon-close-popup"
              data-bs-dismiss="modal"
            />
          </div>
          <div className="tf-rte">
            {/* Bootstrap Grid to Display Images */}
            <div className="mt-3">
              <div className="row" style={{ overflowY: "auto" }}>
                {choiceImages &&
                  choiceImages.map((image, index) => (
                    <div key={index} className="col-6 col-md-4 mb-3">
                      <div
                        className={`image-container rounded p-2`}
                        style={
                          activeIndex === index
                            ? { border: "2px solid #fec007" }
                            : {}
                        }
                        onClick={() => handleClick(index)}
                      >
                        <Image
                          loading="lazy"
                          src={image}
                          alt={`Custom Bag ${index + 1}`}
                          width={150}
                          height={150}
                          className="img-fluid rounded"
                        />
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
