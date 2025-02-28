"use client";
import { addImageUrl } from "@/redux/features/customBagSlice";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function DesignUpload({ onFileUpload }) {
  const dispatch = useDispatch();
  const imageUrls = useSelector((state) => state.customBag.imageUrls);
  const [fileName, setFileName] = useState("");

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const blobUrl = URL.createObjectURL(file); // Create blob URL
      console.log(blobUrl,'blobUrl');
      
      dispatch(addImageUrl(blobUrl)); // Store in Redux
      console.log("Updated Image URLs:", imageUrls); // Log Redux state
      setFileName(file.name);
      onFileUpload(true);
    } else {
      setFileName("");
      onFileUpload(false);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center">
      <div
        className="p-4 border border-2 border-secondary text-center bg-light shadow-lg rounded position-relative"
        style={{ width: "450px" }}
      >
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
          <p className="mb-1 fw-bold text-muted">
            Click to upload or drag & drop
          </p>
          <p className="small text-muted">SVG, PNG, JPG</p>
          <input
            id="upload-file"
            type="file"
            className="d-none"
            onChange={handleFileChange}
          />
        </label>
        {fileName && <p className="mt-3 text-success fw-bold">{fileName}</p>}
      </div>
    </div>
  );
}
