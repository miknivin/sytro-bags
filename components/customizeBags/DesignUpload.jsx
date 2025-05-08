"use client";
import { useRef, useState } from "react";
import toast from "react-hot-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload, faTimes } from "@fortawesome/free-solid-svg-icons";
import { useSearchParams } from "next/navigation";

export default function DesignUpload({ onFileUpload, getPresignedUrls }) {
  const [files, setFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [uploadingIndices, setUploadingIndices] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef();
  const searchParams = useSearchParams();
  const quantity = parseInt(searchParams.get("quantity") || "1");

  const handleFileChange = (event) => {
    const selectedFiles = Array.from(event.target.files);
    const totalFiles = files.length + selectedFiles.length;

    const MAX_FILE_SIZE = 15 * 1024 * 1024; // 10 MB
    const MAX_TOTAL_SIZE = 50 * 1024 * 1024; // 50 MB

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
        setErrorMessage(`File ${file.name} exceeds 15 MB limit.`);
        toast.error(`File ${file.name} exceeds 15 MB limit.`);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (files.length === 0) return;
    if (files.length < quantity) {
      toast.error(
        `You need to upload ${quantity - files.length} more image${
          quantity - files.length > 1 ? "s" : ""
        } to submit`
      );
      return;
    }

    setIsSubmitting(true);
    try {
      const fileMetadata = files.map((file) => ({
        name: file.name,
        type: file.type,
      }));
      const formData = new FormData();
      formData.append("files", JSON.stringify(fileMetadata)); // Send metadata as JSON
      formData.append("quantity", quantity.toString());

      const result = await getPresignedUrls(formData);
      if (result.error) {
        throw new Error(result.error);
      }

      const { presignedUrls } = result;

      const uploadPromises = [];
      for (let i = 0; i < presignedUrls.length; i++) {
        setUploadingIndices((prev) => [...prev, i]);
        const file = files[i];
        uploadPromises.push(
          (async () => {
            const uploadResponse = await fetch(presignedUrls[i].presignedUrl, {
              method: "PUT",
              body: file,
              headers: { "Content-Type": file.type },
            });

            if (!uploadResponse.ok) {
              throw new Error(
                `Failed to upload ${file.name}: ${uploadResponse.statusText}`
              );
            }

            setUploadingIndices((prev) => prev.filter((idx) => idx !== i));
            return presignedUrls[i].publicUrl;
          })()
        );
      }

      const uploadedUrls = await Promise.all(uploadPromises);
      onFileUpload(uploadedUrls);

      previewUrls.forEach((url) => URL.revokeObjectURL(url));
      setPreviewUrls([]);
      setFiles([]);
      fileInputRef.current.value = null;
    } catch (err) {
      toast.error(err?.message || "Upload failed. Contact support.");
      console.error("Upload failed:", err);
    } finally {
      setIsSubmitting(false);
      setUploadingIndices([]);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const droppedFiles = Array.from(event.dataTransfer.files);
    const totalFiles = files.length + droppedFiles.length;

    const MAX_FILE_SIZE = 10 * 1024 * 1024;
    const MAX_TOTAL_SIZE = 50 * 1024 * 1024;

    if (totalFiles > quantity) {
      setErrorMessage(
        `You can only upload up to ${quantity} image${quantity > 1 ? "s" : ""}.`
      );
      return;
    }

    let totalSize = files.reduce((sum, file) => sum + file.size, 0);
    for (const file of droppedFiles) {
      if (file.size > MAX_FILE_SIZE) {
        setErrorMessage(`File ${file.name} exceeds 10 MB limit.`);
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

  const uploadMessage =
    quantity === 1 ? "Add an image" : `Add up to ${quantity} images`;

  return (
    <form onSubmit={handleSubmit}>
      <div className="d-flex flex-column align-items-center pt-5">
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
        <div className="p-2 border border-2 border-secondary text-center bg-light shadow-lg rounded position-relative w-100">
          {previewUrls.length === 0 && (
            <label
              htmlFor="upload-file"
              className="d-flex flex-column align-items-center justify-content-center py-5 px-3 rounded w-100"
              style={{ cursor: "pointer", border: "2px dashed #6c757d" }}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              <FontAwesomeIcon
                icon={faUpload}
                className="text-muted"
                style={{ width: "34px", height: "34px" }}
              />
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
              <p className="small text-warning">
                (Max 10MB each, Max 50MB total)
              </p>
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
                  {uploadingIndices.includes(index) && (
                    <div
                      className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
                      style={{ background: "rgba(0,0,0,0.5)" }}
                    >
                      <div className="spinner-border text-light" role="status">
                        <span className="visually-hidden">Uploading...</span>
                      </div>
                    </div>
                  )}
                  <button
                    type="button"
                    className="position-absolute top-0 end-0 btn btn-danger rounded-circle p-1"
                    style={{
                      transform: "translate(50%, -50%)",
                      fontSize: "9px",
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

          {files.length > 0 && (
            <>
              <button
                type="submit"
                className="tf-btn btn-fill w-100 mt-4 radius-3 justify-content-center fw-6 fs-14 flex-grow-1 animate-hover-btn"
                disabled={isSubmitting || uploadingIndices.length > 0}
              >
                {isSubmitting || uploadingIndices.length > 0
                  ? "Uploading..."
                  : "Submit"}
              </button>

              {files.length < quantity && (
                <button
                  type="button"
                  className="tf-btn btn-fill w-100 mt-2 radius-3 justify-content-center fw-6 fs-14 flex-grow-1 animate-hover-btn"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isSubmitting || uploadingIndices.length > 0}
                >
                  Upload more
                </button>
              )}
            </>
          )}
        </div>

        {errorMessage && <p className="text-danger mt-2">{errorMessage}</p>}
      </div>
    </form>
  );
}
