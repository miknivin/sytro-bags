"use client";
import { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation"; // Add this import
import DesignUpload from "../customizeBags/DesignUpload";
import {
  setUploadedImage,
  setSelectedDesign,
} from "@/redux/features/cartSlice";

export default function SuperKidBag() {
  const productById = useSelector((state) => state.product.productById);
  const dispatch = useDispatch();
  const closeRef = useRef(null);
  const router = useRouter(); // Add router

  const handleFileUpload = (blobUrl) => {
    if (blobUrl) {
      dispatch(
        setUploadedImage({ productId: productById._id, uploadedImage: blobUrl })
      );
      // dispatch(setSelectedDesign({ design: blobUrl }));

      router.push(`${window.location.pathname}?isUploadImage=true`, {
        scroll: false,
      });
    } else {
      dispatch(setUploadedImage({ uploadedImage: null }));
      dispatch(setSelectedDesign({ design: null }));
    }
    closeRef.current.click();
  };

  return (
    <div
      className="modal fade modalDemo customize tf-product-modal"
      id="super_kidbag"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content" style={{ overflowY: "auto" }}>
          <div className="d-flex justify-content-end">
            <span
              className="icon-close icon-close-popup"
              data-bs-dismiss="modal"
              ref={closeRef}
            />
          </div>
          <DesignUpload onFileUpload={handleFileUpload} />
        </div>
      </div>
    </div>
  );
}