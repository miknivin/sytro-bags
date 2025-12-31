"use client";
import { useState, useRef } from "react";
import toast from "react-hot-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload, faTimes } from "@fortawesome/free-solid-svg-icons";
import { useSearchParams } from "next/navigation";

import { uploadMultipartFile } from "@/utlis/uploadMultipart";
import {
  useAbortMultipartUploadMutation,
  useCompleteMultipartUploadMutation,
  useInitiateMultipartUploadMutation,
} from "@/redux/api/multipartApi";

export default function DesignUpload({ onFileUpload, getPresignedUrls, children }) {
  const [files, setFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [uploadingIndices, setUploadingIndices] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef();
  const searchParams = useSearchParams();
  const quantity = parseInt(searchParams.get("quantity") || "1");

  const [initiateMultipartUpload] = useInitiateMultipartUploadMutation();
  const [completeMultipartUpload] = useCompleteMultipartUploadMutation();
  const [abortMultipartUpload] = useAbortMultipartUploadMutation();

  const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25 MB
  const MAX_TOTAL_SIZE = 50 * 1024 * 1024; // 50 MB
  const MULTIPART_THRESHOLD = 5 * 1024 * 1024; // Changed from 2MB to 5MB

  const handleFileChange = (event) => {
    const selectedFiles = Array.from(event.target.files);
    const totalFiles = files.length + selectedFiles.length;

    if (totalFiles > quantity) {
      setErrorMessage(
        `You can only upload up to ${quantity} image${quantity > 1 ? "s" : ""}.`
      );
      fileInputRef.current.value = null;
      return;
    }

    let totalSize = files.reduce((sum, file) => sum + file.size, 0);
    for (const file of selectedFiles) {
      if (file.size > MAX_FILE_SIZE) {
        setErrorMessage(`File ${file.name} exceeds 25 MB limit.`);
        toast.error(`File ${file.name} exceeds 25 MB limit.`);
        fileInputRef.current.value = null;
        return;
      }
      totalSize += file.size;
      if (totalSize > MAX_TOTAL_SIZE) {
        setErrorMessage(`Total file size exceeds 50 MB limit.`);
        fileInputRef.current.value = null;
        return;
      }
    }

    const newPreviewUrls = selectedFiles.map((file) =>
      URL.createObjectURL(file)
    );
    setFiles((prev) => [...prev, ...selectedFiles]);
    setPreviewUrls((prev) => [...prev, ...newPreviewUrls]);
    setErrorMessage("");
  };

  const handleDelete = (index) => {
    const newFiles = files.filter((_, i) => i !== index);
    const newPreviewUrls = previewUrls.filter((_, i) => i !== index);
    URL.revokeObjectURL(previewUrls[index]);
    setFiles(newFiles);
    setPreviewUrls(newPreviewUrls);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const droppedFiles = Array.from(event.dataTransfer.files);
    const totalFiles = files.length + droppedFiles.length;

    if (totalFiles > quantity) {
      setErrorMessage(
        `You can only upload up to ${quantity} image${quantity > 1 ? "s" : ""}.`
      );
      return;
    }

    let totalSize = files.reduce((sum, file) => sum + file.size, 0);
    for (const file of droppedFiles) {
      if (file.size > MAX_FILE_SIZE) {
        setErrorMessage(`File ${file.name} exceeds 25 MB limit.`);
        return;
      }
      totalSize += file.size;
      if (totalSize > MAX_TOTAL_SIZE) {
        setErrorMessage(`Total file size exceeds 50 MB limit.`);
        return;
      }
    }

    const newPreviewUrls = droppedFiles.map((file) =>
      URL.createObjectURL(file)
    );
    setFiles((prev) => [...prev, ...droppedFiles]);
    setPreviewUrls((prev) => [...prev, ...newPreviewUrls]);
    setErrorMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (files.length === 0) return;
    if (files.length < quantity) {
      toast.error(
        `You need to upload ${quantity - files.length} more image${quantity - files.length > 1 ? "s" : ""
        } to submit`
      );
      return;
    }

    setIsSubmitting(true);
    const uploadedUrls = [];

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        setUploadingIndices((prev) => [...prev, i]);

        if (file.size <= MULTIPART_THRESHOLD) {
          // Single-part upload for files <= 5MB
          const fileMetadata = [{ name: file.name, type: file.type }];
          const formData = new FormData();
          formData.append("files", JSON.stringify(fileMetadata));
          formData.append("quantity", "1");

          const result = await getPresignedUrls(formData);
          if (result.error) {
            throw new Error(result.error);
          }

          const { presignedUrls } = result;
          const uploadResponse = await fetch(presignedUrls[0].presignedUrl, {
            method: "PUT",
            body: file,
            headers: { "Content-Type": file.type },
          });

          if (!uploadResponse.ok) {
            throw new Error(
              `Failed to upload ${file.name}: ${uploadResponse.statusText}`
            );
          }

          uploadedUrls.push(presignedUrls[0].publicUrl);
        } else {
          // Multipart upload for files > 5MB
          const finalUrl = await uploadMultipartFile(
            file,
            1,
            MULTIPART_THRESHOLD, // Now 5MB
            initiateMultipartUpload,
            completeMultipartUpload,
            abortMultipartUpload
          );
          uploadedUrls.push(finalUrl);
        }

        setUploadingIndices((prev) => prev.filter((idx) => idx !== i));
      }

      onFileUpload(uploadedUrls);
      previewUrls.forEach((url) => URL.revokeObjectURL(url));
      setPreviewUrls([]);
      setFiles([]);
      fileInputRef.current.value = null;
    } catch (err) {
      toast.error(err.message || "Upload failed. Contact support.");
      console.error("Upload failed:", err);
    } finally {
      setIsSubmitting(false);
      setUploadingIndices([]);
    }
  };

  const uploadMessage =
    quantity === 1 ? "Add an image" : `Add up to ${quantity} images`;

  return (
    <form onSubmit={handleSubmit} className="w-100">
      <div className="d-flex flex-column align-items-center pt-0">
        <input
          id="upload-file"
          type="file"
          name="file"
          className="d-none"
          accept="image/*"
          multiple={quantity > 1}
          onChange={handleFileChange}
          ref={fileInputRef}
        />
        <div
          className="p-2 border-0 text-center bg-white shadow-sm rounded-4 position-relative w-100"
          style={{ transition: 'all 0.3s ease' }}
        >


          {previewUrls.length === 0 && (
            <label
              htmlFor="upload-file"
              className="d-flex flex-column align-items-center justify-content-center py-1 px-3 rounded-4 w-100 upload-dropzone"
              style={{
                cursor: "pointer",
                border: "2px dashed #e2e8f0",
                backgroundColor: "#f8fafc",
                transition: "all 0.2s ease",
              }}
              onDragOver={(e) => {
                e.preventDefault();
                e.currentTarget.style.borderColor = "#ffc720";
                e.currentTarget.style.backgroundColor = "#fff9e6";
              }}
              onDragLeave={(e) => {
                e.currentTarget.style.borderColor = "#e2e8f0";
                e.currentTarget.style.backgroundColor = "#f8fafc";
              }}
              onDrop={(e) => {
                handleDrop(e);
                e.currentTarget.style.borderColor = "#e2e8f0";
                e.currentTarget.style.backgroundColor = "#f8fafc";
              }}
            >
              <div className="mb-1 d-flex align-items-center justify-content-center" style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                backgroundColor: "#fff",
                boxShadow: "0 2px 4px rgba(0,0,0,0.05)"
              }}>
                <FontAwesomeIcon
                  icon={faUpload}
                  style={{ width: "16px", height: "16px", color: "black" }}
                />
              </div>
              <h6
                className="mb-1 fw-bold text-dark"
                style={{ fontSize: "1rem", letterSpacing: "-0.01em" }}
              >
                Upload your child's photo
              </h6>
              <p className="mb-2 text-dark px-2 small" style={{ maxWidth: "280px" }}>
                Transform them into their favorite superhero!
              </p>
              <div className="d-flex flex-column gap-1 align-items-center">
                <span className="badge rounded-pill px-3 py-2 small fw-bold" style={{ backgroundColor: "#ffc720", color: "#000" }}>
                  {uploadMessage}
                </span>
                <span className="text-muted" style={{ fontSize: "11px" }}>
                  SVG, PNG, JPG (Max 50MB)
                </span>
              </div>
            </label>
          )}

          {previewUrls.length > 0 && (
            <div className="mt-2 d-flex justify-content-center">
              {previewUrls.map((url, index) => (
                <div
                  key={index}
                  className="position-relative"
                  style={{ width: "160px" }}
                >
                  <div className="rounded-3 overflow-hidden shadow-sm border border-dark" style={{ height: "160px" }}>
                    <img
                      src={url}
                      alt={`Preview ${index + 1}`}
                      className="w-100 h-100"
                      style={{ objectFit: "cover" }}
                    />
                  </div>
                  {uploadingIndices.includes(index) && (
                    <div
                      className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center rounded-3"
                      style={{ background: "rgba(255,255,255,0.7)", zIndex: 1 }}
                    >
                      <div className="spinner-border spinner-border-sm text-primary" role="status">
                        <span className="visually-hidden">Uploading...</span>
                      </div>
                    </div>
                  )}
                  <button
                    type="button"
                    className="position-absolute top-0 end-0 btn btn-danger rounded-circle d-flex align-items-center justify-content-center shadow-sm"
                    style={{
                      transform: "translate(30%, -30%)",
                      width: "22px",
                      height: "22px",
                      padding: "0",
                      fontSize: "10px",
                      zIndex: 2,
                      border: "2px solid #fff"
                    }}
                    onClick={() => handleDelete(index)}
                    aria-label={`Remove image ${index + 1}`}
                    disabled={uploadingIndices.includes(index)}
                  >
                    <FontAwesomeIcon icon={faTimes} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {children}

          {files.length > 0 && (
            <div className="d-flex flex-column gap-2 mt-2">
              <button
                type="submit"
                className="tf-btn btn-fill w-100 rounded-pill justify-content-center fw-bold fs-15 shadow-sm animate-hover-btn bg-black text-white border-0"
                style={{ height: "44px" }}
                disabled={isSubmitting || uploadingIndices.length > 0}
              >
                {isSubmitting || uploadingIndices.length > 0
                  ? "Uploading..."
                  : "Submit "}
              </button>
            </div>
          )}
        </div>

        {errorMessage && <p className="text-danger mt-2">{errorMessage}</p>}
      </div>
    </form>
  );
}
