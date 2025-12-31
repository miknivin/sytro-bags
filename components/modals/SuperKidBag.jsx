"use client";
import { useRef, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter, useSearchParams } from "next/navigation";
import DesignUpload from "../customizeBags/DesignUpload";
import {
  setUploadedImage,
  setSelectedDesign,
  setCustomName,
} from "@/redux/features/cartSlice";
import { getPresignedUrls } from "@/functions/action";


export default function SuperKidBag() {
  const productById = useSelector((state) => state.product.productById);
  const customNames = useSelector((state) => state.cart.customNames);
  const [localCustomName, setLocalCustomName] = useState("");
  const dispatch = useDispatch();
  const closeRef = useRef(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (productById && customNames?.[productById._id]) {
      setLocalCustomName(customNames[productById._id]);
    } else {
      setLocalCustomName("");
    }
  }, [productById, customNames]);

  const handleFileUpload = (uploadedUrls) => {
    if (uploadedUrls && uploadedUrls.length > 0) {
      // Dispatch array of uploaded URLs
      dispatch(
        setUploadedImage({
          productId: productById._id,
          uploadedImage: uploadedUrls,
        })
      );

      // Dispatch custom name
      dispatch(
        setCustomName({
          productId: productById._id,
          customName: localCustomName,
        })
      );

      const isUploadImage = searchParams.get("isUploadImage");
      if (isUploadImage === "proceeding") {
        router.push(`${window.location.pathname}?isUploadImage=true`, {
          scroll: false,
        });
      }
    } else {
      // Reset if no URLs are provided
      dispatch(
        setUploadedImage({
          productId: productById._id,
          uploadedImage: [],
        })
      );
      dispatch(
        setSelectedDesign({
          productId: productById._id,
          design: null,
        })
      );
    }
    closeRef.current.click();
  };

  return (
    <div
      className="modal fade modalDemo customize tf-product-modal"
      id="super_kidbag"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="d-flex justify-content-end p-2">
            <span
              className="icon-close icon-close-popup"
              data-bs-dismiss="modal"
              ref={closeRef}
            />
          </div>
          <div className="px-3 pb-3">
            <div className="text-center mb-2">
              <h5 className="fw-bold text-dark mb-0">Customize Your Bag</h5>
              <p className="text-muted small mb-0">Upload a photo and set a name</p>
            </div>

            <DesignUpload
              onFileUpload={handleFileUpload}
              getPresignedUrls={getPresignedUrls}
            >
              <div className="tf-product-info-custom-name mt-2 pt-2 border-top">
                <div className="mb-2 d-flex align-items-center gap-2">
                  <span className="fw-bold text-dark fs-14">Name on Bag</span>
                  <span className="text-muted small fw-normal">(Optional)</span>
                </div>
                <div className="position-relative">
                  <input
                    type="text"
                    value={localCustomName}
                    maxLength={11}
                    onChange={(e) => setLocalCustomName(e.target.value)}
                    placeholder="Name"
                    className="form-control rounded-3 border-light-subtle shadow-sm"
                    style={{
                      padding: "14px 16px",
                      fontSize: "15px",
                      transition: "border-color 0.2s",
                    }}
                  />
                  <div
                    className="position-absolute end-0 top-50 translate-middle-y me-3 text-muted small"
                    style={{ pointerEvents: 'none' }}
                  >
                    {localCustomName.length}/11
                  </div>
                </div>
                <p className="text-muted mt-2 mb-0" style={{ fontSize: "12px", opacity: 0.8 }}>
                  This name will be printed exactly as entered above.
                </p>
              </div>
            </DesignUpload>
          </div>
        </div>
      </div>
    </div>
  );
}
