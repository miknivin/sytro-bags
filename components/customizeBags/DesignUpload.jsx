"use client";
import { useUploadKidsImageMutation } from "@/redux/api/orderApi";
import { useState } from "react";

export default function DesignUpload({ onFileUpload }) {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  const [uploadKidsImage, { isLoading, error }] = useUploadKidsImageMutation();

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFileName(selectedFile.name);

      // Generate a preview URL for the selected file
      const blobUrl = URL.createObjectURL(selectedFile);
      setPreviewUrl(blobUrl);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await uploadKidsImage(formData).unwrap();
      if (response.url) {
        onFileUpload(response.url);

        // Clear preview after successful upload
        setPreviewUrl("");
        setFile(null);
        setFileName("");
      }
    } catch (err) {
      console.error("Upload failed:", err);
    }
  };

  const handleDelete = () => {
    // Reset all states to allow reupload
    setFile(null);
    setFileName("");
    setPreviewUrl("");
  };

  return (
    <div className="d-flex flex-column align-items-center">
      <div
        className="p-2 border border-2 border-secondary text-center bg-light shadow-lg rounded position-relative"
        // style={{ width: "450px" }}
      >
        {!previewUrl && (
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
            <h6 className="mb-1 fw-bold text-muted fs-3">
              Click to upload or <br /> drag & drop
            </h6>
            <p className="mb-1 text-muted px-1">
              Now, you can upload your child’s photo and watch them transform
              into their favorite superhero.
            </p>
            <p className="small text-muted">SVG, PNG, JPG, JPEG</p>
            <input
              id="upload-file"
              type="file"
              className="d-none"
              accept="image/*"
              onChange={handleFileChange}
            />
          </label>
        )}

        {/* Show file name after selection */}
        {fileName && <p className="mt-3 text-success fw-bold">{fileName}</p>}

        {/* Show file preview before uploading */}
        {previewUrl && (
          <div
            style={{ width: "fit-content", height: "fit-content" }}
            className="mt-3 position-relative mx-auto"
          >
            <img
              src={previewUrl}
              alt="File Preview"
              className="img-fluid border rounded"
              style={{ maxWidth: "240px" }}
            />
            {/* Delete button (cross) */}
            <button
              className="position-absolute top-0 end-0 btn btn-danger rounded-circle"
              style={{ transform: "translate(62%, -50%)" }}
              onClick={handleDelete}
            >
              ✕
            </button>
          </div>
        )}

        {/* Submit button to upload file */}
        {file && (
          <button
            className="tf-btn btn-fill w-100 mt-4 radius-3 justify-content-center fw-6 fs-14 flex-grow-1 animate-hover-btn mt-2"
            onClick={handleUpload}
            disabled={isLoading}
          >
            {isLoading ? "Uploading..." : "Submit"}
          </button>
        )}
      </div>

      {/* Error message */}
      {error && <p className="text-danger mt-2">Upload failed. Try again.</p>}
    </div>
  );
}
