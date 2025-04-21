"use client";
import { useUploadKidsImageMutation } from "@/redux/api/orderApi";
import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import toast from "react-hot-toast";

export default function DesignUpload({ onFileUpload }) {
  const [files, setFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const searchParams = useSearchParams();
  const fileInputRef = useRef();
  const quantity = parseInt(searchParams.get("quantity") || "1");
  const [uploadKidsImage, { isLoading, error }] = useUploadKidsImageMutation();

  useEffect(() => {
    return () => {
      previewUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previewUrls]);

  const handleFileChange = (event) => {
    const selectedFiles = Array.from(event.target.files);
    const totalFiles = files.length + selectedFiles.length;

    if (totalFiles > quantity) {
      setErrorMessage(
        `You can only upload up to ${quantity} image${quantity > 1 ? "s" : ""}.`
      );
      event.target.value = null;
      return;
    }

    const newPreviewUrls = selectedFiles.map((file) =>
      URL.createObjectURL(file)
    );
    setFiles((prev) => [...prev, ...selectedFiles]);
    setPreviewUrls((prev) => [...prev, ...newPreviewUrls]);
    setErrorMessage("");
  };

  const handleUpload = async () => {
    if (files.length === 0) return;
    if (files.length < quantity) {
      toast.error(
        `You need to upload ${quantity - files.length} more image${
          quantity - files.length > 1 ? "s" : ""
        } to submit`
      );
      return;
    }

    try {
      const uploadPromises = files.map(async (file) => {
        const formData = new FormData();
        formData.append("file", file);
        const response = await uploadKidsImage(formData).unwrap();
        return response.url;
      });

      const uploadedUrls = await Promise.all(uploadPromises);
      onFileUpload(uploadedUrls);

      previewUrls.forEach((url) => URL.revokeObjectURL(url));
      setPreviewUrls([]);
      setFiles([]);
    } catch (err) {
      console.error("Upload failed:", err);
    }
  };

  const handleDelete = (index) => {
    const newFiles = files.filter((_, i) => i !== index);
    const newPreviewUrls = previewUrls.filter((_, i) => i !== index);
    // URL.revokeObjectURL(previewUrls[index]); // Revoke only the deleted URL

    setFiles(newFiles);
    setPreviewUrls(newPreviewUrls);
  };

  const uploadMessage =
    quantity === 1 ? "Add an image" : `Add up to ${quantity} images`;

  return (
    <div className="d-flex flex-column align-items-center">
      <div className="p-2 border border-2 border-secondary text-center bg-light shadow-lg rounded position-relative w-100">
        {previewUrls.length === 0 && (
          <label
            htmlFor="upload-file"
            className="d-flex flex-column align-items-center justify-content-center py-5 px-3 rounded w-100"
            style={{ cursor: "pointer", border: "2px dashed #6c757d" }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="34"
              height="34"
              fill="currentColor"
              className="bi bi-upload"
              viewBox="0 0 34 34"
            >
              <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5" />
              <path d="M7.646 1.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 2.707V11.5a.5.5 0 0 1-1 0V2.707L5.354 4.854a.5.5 0 1 1-.708-.708z" />
            </svg>
            <h6
              className="mb-1 fw-bold text-muted fs-3"
              style={{ lineHeight: "25px" }}
            >
              Click to upload or <br /> drag & drop
            </h6>
            <p className="mb-1 text-muted px-1">
              Now, you can upload your child’s photo and watch them transform
              into their favorite superhero.
            </p>
            <p className="small text-muted">{uploadMessage}</p>
            <p className="small text-muted">SVG, PNG, JPG, JPEG</p>
            <input
              id="upload-file"
              type="file"
              className="d-none"
              accept="image/*"
              multiple={quantity > 1}
              onChange={handleFileChange}
              ref={fileInputRef}
            />
          </label>
        )}

        {previewUrls.length > 0 && (
          <div className="mt-3 row d-flex gap-3">
            {previewUrls.map((url, index) => (
              <div
                key={index}
                className="col-4 col-sm-6 col-md-4 col-lg-3 position-relative border"
              >
                <img
                  src={url}
                  alt={`Preview ${index + 1}`}
                  className="img-fluid rounded w-100"
                  style={{ maxHeight: "150px", objectFit: "contain" }}
                />
                <button
                  className="position-absolute top-0 end-0 btn btn-danger rounded-circle p-1"
                  style={{ transform: "translate(50%, -50%)", fontSize: "9px" }}
                  onClick={() => handleDelete(index)}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}

        {files.length > 0 && (
          <>
            <button
              className="tf-btn btn-fill w-100 mt-4 radius-3 justify-content-center fw-6 fs-14 flex-grow-1 animate-hover-btn mt-2"
              onClick={handleUpload}
              disabled={isLoading}
            >
              {isLoading ? "Uploading..." : "Submit"}
            </button>

            {files.length < quantity && (
              <>
                <input
                  id="upload-file"
                  type="file"
                  className="d-none"
                  accept="image/*"
                  multiple={quantity > 1}
                  onChange={handleFileChange}
                  ref={fileInputRef}
                />
                <button
                  className="tf-btn btn-fill w-100 mt-2 radius-3 justify-content-center fw-6 fs-14 flex-grow-1 animate-hover-btn"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isLoading}
                >
                  {isLoading ? "Uploading..." : "Upload more"}
                </button>
              </>
            )}
          </>
        )}
      </div>

      {error && (
        <p className="text-danger mt-2">
          Upload failed. Try again.
          <br />
          {error}
        </p>
      )}
      {errorMessage && <p className="text-danger mt-2">{errorMessage}</p>}
    </div>
  );
}
