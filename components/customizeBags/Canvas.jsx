import { useRef, useState, useEffect } from "react";
import DesignUpload from "./DesignUpload";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faArrowUpFromBracket,
  faDownload,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { useSelector } from "react-redux";
import DraggableImage from "./DraggableImage";
import { useDispatch } from "react-redux";
import { clearImages, setCustomDesign } from "@/redux/features/customBagSlice";
import html2canvas from "html2canvas";

export default function Canvas({ modalRef }) {
  const dispatch = useDispatch();
  const [isFileUploaded, setIsFileUploaded] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const imageUrls = useSelector((state) => state.customBag.imageUrls);
  const wrapperRef = useRef();
  const [hideIcons, setHideIcons] = useState(false);

  const handleDownload = async () => {
    if (!wrapperRef.current) return;

    setHideIcons(true); // Hide icons before capturing

    setTimeout(async () => {
      try {
        const canvas = await html2canvas(wrapperRef.current, {
          useCORS: true,
          backgroundColor: null,
          scale: 2,
        });

        const link = document.createElement("a");
        link.href = canvas.toDataURL("image/png");
        link.download = "canvas-image.png";
        link.click();
      } catch (error) {
        console.error("Error generating image:", error);
      } finally {
        // Restore icons after a short delay
        setTimeout(() => {
          setHideIcons(false);
        }, 500); // Adjust delay as needed
      }
    }, 300); // Short delay before capturing the canvas
  };

  useEffect(() => {
    if (wrapperRef.current) {
      setDimensions({
        width: wrapperRef.current.clientWidth,
        height: wrapperRef.current.clientHeight,
      });
    }
  }, [isFileUploaded]);
  return (
    <div className="position-relative">
      {/* Conditional Rendering */}
      {isFileUploaded ? (
        <div>
          {/* Sticky Toolbar */}
          <div
            className="sticky-top bg-white p-3 shadow-sm rounded-2"
            style={{ zIndex: 1000, top: "-30px" }}
          >
            <div className="d-flex justify-content-end w-100 h-100">
              <div
                className="btn-group"
                role="group"
                aria-label="Basic example"
              >
                <button
                  onClick={() => {
                    dispatch(setCustomDesign(false));
                    dispatch(clearImages());
                  }}
                  type="button"
                  className="btn btn-outline-secondary"
                >
                  <FontAwesomeIcon icon={faArrowLeft} />
                </button>
                <button type="button" className="btn btn-outline-secondary">
                  <FontAwesomeIcon icon={faArrowUpFromBracket} />
                </button>
                <button
                  type="button"
                  onClick={handleDownload}
                  className="btn btn-outline-secondary"
                >
                  <FontAwesomeIcon icon={faDownload} />
                </button>
              </div>
            </div>
          </div>

          {/* Image Display */}
          <div
            className="d-flex justify-content-center align-items-center mt-2 w-100 h-100"
            ref={wrapperRef}
          >
            <img
              src="https://ik.imagekit.io/c1jhxlxiy/prod.jpg?updatedAt=1737052433288"
              alt="Bag"
              style={{
                width: "100%",
                maxWidth: "500px",
                height: "auto",
                objectFit: "contain",
              }}
            />
            {imageUrls &&
              imageUrls.length > 0 &&
              wrapperRef &&
              wrapperRef.current &&
              imageUrls.map((imageUrl, index) => (
                <DraggableImage
                  key={index}
                  width={wrapperRef.current.clientWidth}
                  height={600}
                  uploadedImage={imageUrl}
                  hideIcons={hideIcons}
                />
              ))}
          </div>
        </div>
      ) : (
        <div className="d-flex justify-content-center align-items-center">
          <DesignUpload onFileUpload={setIsFileUploaded} />
        </div>
      )}
    </div>
  );
}
