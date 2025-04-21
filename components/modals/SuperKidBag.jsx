"use client";
import { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter, useSearchParams } from "next/navigation";
import DesignUpload from "../customizeBags/DesignUpload";
import {
  setUploadedImage,
  setSelectedDesign,
} from "@/redux/features/cartSlice";
import { getPresignedUrls } from "@/lib/actions/presign";

export default function SuperKidBag() {
  const productById = useSelector((state) => state.product.productById);
  const dispatch = useDispatch();
  const closeRef = useRef(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleFileUpload = (uploadedUrls) => {
    if (uploadedUrls && uploadedUrls.length > 0) {
      // Dispatch array of uploaded URLs
      dispatch(
        setUploadedImage({
          productId: productById._id,
          uploadedImage: uploadedUrls,
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
        <div className="modal-content" style={{ overflowY: "auto" }}>
          <div className="d-flex justify-content-end">
            <span
              className="icon-close icon-close-popup"
              data-bs-dismiss="modal"
              ref={closeRef}
            />
          </div>
          <DesignUpload
            onFileUpload={handleFileUpload}
            getPresignedUrls={getPresignedUrls}
          />
        </div>
      </div>
    </div>
  );
}
