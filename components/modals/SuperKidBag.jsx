import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useSelector, useDispatch } from "react-redux";
import DesignUpload from "../customizeBags/DesignUpload";
import { setSelectedTemplate } from "@/redux/features/productSlice";
import {
  resetSelectedDesign,
  setSelectedDesign,
  setUploadedImage,
} from "@/redux/features/cartSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

export default function SuperKidBag() {
  const dispatch = useDispatch();
  const isCustomDesign = useSelector((state) => state.customBag.isCustomDesign);
  const productById = useSelector((state) => state.product.productById);
  const [choiceImages, setChoiceImages] = useState([]);
  const [activeIndex, setActiveIndex] = useState(null);
  const [isDesign, setIsDesign] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showDesignUpload, setShowDesignUpload] = useState(false);
  const [userSelectedDesign, setUserSelectedDesign] = useState(null);
  const modalRef = useRef(null);
  const closeRef = useRef(null);
  const modalContent = useRef(null);
  const selectedDesigns = useSelector((state) => state.cart.selectedDesigns);
  useEffect(() => {
    if (productById && productById._id === "67a70ca93f464380b64b05a6") {
      setChoiceImages(productById?.templateImages || []);
      if (selectedDesigns?.[productById._id]) {
        setShowDesignUpload(true);
      }
    }
  }, [productById]);

  useEffect(() => {
    if (!isCustomDesign) {
      setIsDesign(false);
    }
  }, [isCustomDesign]);

  useEffect(() => {
    console.log("executes");
    const modalElement = modalContent.current;

    if (modalElement) {
      const handleScroll = () => {
        if (modalElement.scrollTop > 300) {
          setIsScrolled(true);
        } else {
          setIsScrolled(false);
        }
      };

      modalElement.addEventListener("scroll", handleScroll);

      return () => {
        modalElement.removeEventListener("scroll", handleScroll);
      };
    }
  }, []);

  const handleClick = (index) => {
    setActiveIndex(index);
    setIsScrolled(true);
  };

  const handleFileUpload = (blobUrl) => {
    if (blobUrl) {
      dispatch(
        setUploadedImage({ productId: productById._id, uploadedImage: blobUrl })
      );
      if (userSelectedDesign) {
        dispatch(
          setSelectedDesign({
            productId: productById._id,
            design: userSelectedDesign,
          })
        );
      }
      closeRef.current.click();
    } else {
      dispatch(
        setUploadedImage({ productId: productById._id, uploadedImage: null })
      );
      dispatch(setSelectedDesign({ productId: productById._id, design: null }));
    }
  };

  const handleSelectDesign = () => {
    if (activeIndex !== null) {
      const selectedDesign = choiceImages[activeIndex];
      setUserSelectedDesign(selectedDesign);
      dispatch(setSelectedTemplate(selectedDesign));
      setShowDesignUpload(true);
    }
  };

  return (
    <div
      className="modal fade modalDemo customize tf-product-modal"
      id="super_kidbag"
      ref={modalRef}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div
          className="modal-content"
          ref={modalContent}
          style={{ overflowY: "auto" }}
        >
          <div
            style={{ zIndex: 999, top: "-40px" }}
            className="header bg-white py-4 px-2 position-sticky "
          >
            {showDesignUpload ? (
              <div className="demo-title d-flex align-items-center">
                {showDesignUpload ? (
                  <button
                    type="button"
                    className="tf-btn btn-fill radius-3 justify-content-center fw-6 fs-14 animate-hover-btn d-flex align-items-center gap-2"
                    onClick={() => {
                      setShowDesignUpload(false);
                      dispatch(
                        resetSelectedDesign({
                          productId: productById._id,
                        })
                      );
                    }}
                  >
                    <FontAwesomeIcon icon={faArrowLeft} /> Back
                  </button>
                ) : (
                  "Choose your Template"
                )}
              </div>
            ) : (
              <button
                type="button"
                className="tf-btn btn-fill radius-3 justify-content-center fw-6 fs-14  animate-hover-btn"
                onClick={handleSelectDesign}
                disabled={activeIndex === null}
              >
                Select Design
              </button>
            )}

            <span
              className="icon-close icon-close-popup"
              data-bs-dismiss="modal"
              ref={closeRef}
            />
          </div>

          {!showDesignUpload ? (
            <>
              <div className="tf-rte">
                <div className="mt-3">
                  <div
                    className="row d-flex align-items-stretch "
                    style={{ overflowY: "auto" }}
                  >
                    {choiceImages.map((image, index) => (
                      <div key={index} className="col-6 col-md-4 mb-3">
                        <div
                          className="card h-100"
                          style={{
                            ...(activeIndex === index
                              ? { border: "2px solid #fec007" }
                              : {}),
                          }}
                          onClick={() => handleClick(index)}
                        >
                          <Image
                            loading="lazy"
                            src={image.smallBagImage}
                            alt={`Custom Bag ${index + 1}`}
                            width={150}
                            height={150}
                            className="card-img-top rounded"
                          />
                          <div className="card-body px-2 py-0">
                            <p
                              style={{ fontWeight: "600" }}
                              className="card-text px-2 py-0 text-center"
                            >
                              {image.name}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-md-12 mb-3 mb-md-0">
                  <button
                    type="button"
                    className="tf-btn btn-fill radius-3 justify-content-center fw-6 fs-14 flex-grow-1 animate-hover-btn w-100"
                    onClick={handleSelectDesign}
                    disabled={activeIndex === null}
                  >
                    Select Design
                  </button>
                </div>
              </div>
            </>
          ) : (
            <DesignUpload onFileUpload={handleFileUpload} />
          )}
        </div>
      </div>
    </div>
  );
}
