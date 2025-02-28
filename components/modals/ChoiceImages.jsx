"use client";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useSelector, useDispatch } from "react-redux";
import DesignUpload from "../customizeBags/DesignUpload";
import Canvas from "../customizeBags/Canvas";
import { setCustomDesign } from "@/redux/features/customBagSlice";

export default function ChoiceImages() {
  const dispatch = useDispatch();
  const isCustomDesign = useSelector((state) => state.customBag.isCustomDesign);
  const productById = useSelector((state) => state.product.productById);
  const [choiceImages, setChoiceImages] = useState([]);
  const [activeIndex, setActiveIndex] = useState(null);
  const [isDesign, setIsDesign] = useState(false);
  const modalRef = useRef(null);
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
  useEffect(() => {
    if (!isCustomDesign) {
      setIsDesign(false);
    }
  }, [isCustomDesign]);
  return (
    <div
      className="modal fade modalDemo customize tf-product-modal"
      id="custom_bag"
      ref={modalRef}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content" style={{ overflowY: "auto" }}>
          <div className="header">
            <div className="demo-title">
              {isDesign ? "Customize" : "Choose from existing"}
            </div>
            <span
              className="icon-close icon-close-popup"
              data-bs-dismiss="modal"
            />
          </div>
          {!isDesign ? (
            <>
              <div className="tf-rte">
                {/* Bootstrap Grid to Display Images */}
                <div className="mt-3">
                  {/*  */}
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
              <div className="row">
                <div className="col-md-6 mb-3 mb-md-0">
                  <button
                    type="button"
                    disabled
                    className="tf-btn btn-fill radius-3 justify-content-center fw-6 fs-14 flex-grow-1 animate-hover-btn w-100"
                  >
                    Select Design
                  </button>
                </div>
                <div className="col-md-6">
                  <button
                    onClick={() => {
                      dispatch(setCustomDesign(true));
                      setIsDesign(true);
                    }}
                    className="link border-0"
                  >
                    Didn't find what you're looking, Customise your own
                  </button>
                </div>
              </div>
            </>
          ) : (
            <Canvas modalRef={modalRef} />
          )}
        </div>
      </div>
    </div>
  );
}
