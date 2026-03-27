"use client";

import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter, useSearchParams } from "next/navigation";
import DesignUpload from "../customizeBags/DesignUpload";
import {
  setCustomName,
  setSelectedDesign,
  setUploadedImage,
} from "@/redux/features/cartSlice";
import { getPresignedUrls } from "@/functions/action";

export default function SuperKidBag({
  open,
  product,
  onClose,
  onUploadComplete,
  initialCustomName = "",
  maxFiles,
}) {
  const isControlled = typeof open === "boolean";
  const productById = useSelector((state) => state.product.productById);
  const customNames = useSelector((state) => state.cart.customNames);
  const [localCustomName, setLocalCustomName] = useState("");
  const dispatch = useDispatch();
  const closeRef = useRef(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeProduct = product || productById;

  useEffect(() => {
    if (isControlled) {
      setLocalCustomName(initialCustomName || "");
      return;
    }

    if (activeProduct?._id && customNames?.[activeProduct._id]) {
      setLocalCustomName(customNames[activeProduct._id]);
    } else {
      setLocalCustomName("");
    }
  }, [activeProduct, customNames, initialCustomName, isControlled]);

  const handleDismiss = () => {
    if (isControlled) {
      onClose?.();
      return;
    }

    closeRef.current?.click();
  };

  const handleFileUpload = (uploadedUrls) => {
    if (!activeProduct?._id) {
      return;
    }

    const normalizedUrls = Array.isArray(uploadedUrls)
      ? uploadedUrls.filter(Boolean)
      : uploadedUrls
        ? [uploadedUrls]
        : [];

    if (isControlled) {
      onUploadComplete?.({
        uploadedUrls: normalizedUrls,
        customName: localCustomName.trim(),
      });
      return;
    }

    if (normalizedUrls.length > 0) {
      dispatch(
        setUploadedImage({
          productId: activeProduct._id,
          uploadedImage: normalizedUrls,
        }),
      );
      dispatch(
        setCustomName({
          productId: activeProduct._id,
          customName: localCustomName,
        }),
      );

      const isUploadImage = searchParams.get("isUploadImage");
      if (isUploadImage === "proceeding") {
        router.push(`${window.location.pathname}?isUploadImage=true`, {
          scroll: false,
        });
      }
    } else {
      dispatch(
        setUploadedImage({
          productId: activeProduct._id,
          uploadedImage: [],
        }),
      );
      dispatch(
        setSelectedDesign({
          productId: activeProduct._id,
          design: null,
        }),
      );
    }

    closeRef.current?.click();
  };

  const modalBody = (
    <>
      <div className="text-center mb-2">
        <h5 className="fw-bold text-dark mb-0">Customize Your Bag</h5>
        <p className="text-muted small mb-0">Upload a photo and set a name</p>
      </div>

      <DesignUpload
        onFileUpload={handleFileUpload}
        getPresignedUrls={getPresignedUrls}
        maxFiles={maxFiles}
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
              onChange={(event) => setLocalCustomName(event.target.value)}
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
              style={{ pointerEvents: "none" }}
            >
              {localCustomName.length}/11
            </div>
          </div>
          <p
            className="text-muted mt-2 mb-0"
            style={{ fontSize: "12px", opacity: 0.8 }}
          >
            This name will be printed exactly as entered above.
          </p>
        </div>
      </DesignUpload>
    </>
  );

  if (isControlled) {
    if (!open || !activeProduct?._id) {
      return null;
    }

    return (
      <div
        className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center px-3"
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.55)",
          zIndex: 1060,
        }}
        onClick={handleDismiss}
      >
        <div
          className="bg-white rounded-4 shadow-lg w-100"
          style={{ maxWidth: "520px", maxHeight: "90vh", overflowY: "auto" }}
          onClick={(event) => event.stopPropagation()}
        >
          <div className="d-flex justify-content-end p-2">
            <button
              type="button"
              onClick={handleDismiss}
              className="btn btn-link text-dark p-1 text-decoration-none"
              aria-label="Close customize bag modal"
            >
              <span className="icon-close icon-close-popup" />
            </button>
          </div>
          <div className="px-3 pb-3">{modalBody}</div>
        </div>
      </div>
    );
  }

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
          <div className="px-3 pb-3">{modalBody}</div>
        </div>
      </div>
    </div>
  );
}
