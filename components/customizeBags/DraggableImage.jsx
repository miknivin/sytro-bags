/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faRotateRight,
  faUpRightAndDownLeftFromCenter,
} from "@fortawesome/free-solid-svg-icons";
import { useGesture } from "@use-gesture/react";
const DraggableImage = ({ width, height, uploadedImage,hideIcons  }) => {
  const nodeRef = useRef(null);
  const rotateRef = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isResizing, setIsResizing] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isClient, setIsClient] = useState(false);
  const [scale, setScale] = useState(1);
  const [angle, setAngle] = useState(0);
  const [isRotating, setIsRotating] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartPos, setDragStartPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    console.log(width, height);

    setIsClient(true);
  }, []);

  // Handle drag start
  const handleDragStart = (e) => {
    e.preventDefault();
    setIsDragging(true);

    // Get the initial mouse/touch position
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    setDragStartPos({
      x: clientX - position.x,
      y: clientY - position.y,
    });
  };

  // Handle drag move
  const handleDragMove = (e) => {
    if (isDragging && !isResizing && !isRotating) {
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
  
      const scaledWidth = 200 * scale; // Account for scaling
      const scaledHeight = 200 * scale;
  
      const minX = 0;
      const minY = 0;
      const maxX = width - scaledWidth; // Ensure it doesn't go outside right boundary
      const maxY = height - scaledHeight; // Ensure it doesn't go outside bottom boundary
  
      let newX = clientX - dragStartPos.x;
      let newY = clientY - dragStartPos.y;
  
      // Clamp position to stay within bounds
      newX = Math.max(minX, Math.min(newX, maxX));
      newY = Math.max(minY, Math.min(newY, maxY));
  
      setPosition({ x: newX, y: newY });
    }
  };
  
  

  // Handle drag end
  const handleDragEnd = () => {
    setIsDragging(false);
  };

  // Gesture for rotating
  useGesture(
    {
      onDrag: ({ movement: [x, y], memo = { angle: 0 } }) => {
        if (!isResizing) {
          setIsRotating(true);
          const radianAngle = Math.atan2(y, x);
          const degreeAngle = (radianAngle * 180) / Math.PI;
          setAngle(degreeAngle.toFixed(2));
        }
      },
      onDragEnd: () => {
        setIsRotating(false);
      },
    },
    { target: rotateRef, eventOptions: { passive: false } }
  );

  // Gesture for scaling (pinch)
  useGesture(
    {
      onPinch: ({ offset: [distance] }) => {
        setScale(Math.min(Math.max(0.5, distance), 3));
      },
    },
    {
      target: nodeRef,
      eventOptions: { passive: false },
      pinch: { scaleBounds: { min: 0.5, max: 3 }, rubberband: true },
    }
  );

  const handleMouseMove = (e) => {
    if (isResizing) {
      const currentMousePos = { x: e.clientX, y: e.clientY };

      if (currentMousePos.x < mousePos.x) {
        setScale((prev) => Math.max(0.5, prev - 0.1));
      } else if (currentMousePos.x > mousePos.x) {
        setScale((prev) => Math.min(3, prev + 0.1));
      }

      setMousePos(currentMousePos);
    }
  };

  const handleIconMouseDown = (e) => {
    e.stopPropagation();
    setIsResizing(true);
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  const handleIconMouseUp = () => {
    setIsResizing(false);
  };

  useEffect(() => {
    if (!isClient) return;

    if (isResizing && !isRotating) {
      window.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleIconMouseUp);
      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleIconMouseUp);
      };
    }
  }, [isResizing, mousePos, isClient]);

  // Add event listeners for dragging
  useEffect(() => {
    const node = nodeRef.current;
    if (!node) return;
    const handleMove = (e) => handleDragMove(e);
    const handleEnd = () => handleDragEnd();

    node.addEventListener("mousedown", handleDragStart);
    node.addEventListener("touchstart", handleDragStart, { passive: false });
    window.addEventListener("mousemove", handleMove);
    window.addEventListener("touchmove", handleMove, { passive: false });
    window.addEventListener("mouseup", handleEnd);
    window.addEventListener("touchend", handleEnd);

    return () => {
      node.removeEventListener("mousedown", handleDragStart);
      node.removeEventListener("touchstart", handleDragStart);
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("touchmove", handleMove);
      window.removeEventListener("mouseup", handleEnd);
      window.removeEventListener("touchend", handleEnd);
    };
  }, [isDragging, dragStartPos, isResizing, isRotating, nodeRef, isClient]);

  if (!isClient) {
    return null;
  }

  return (
    <div
      className="relative overflow-hidden border-2 border-gray-200"
      // style={{ width: `${width}px`, height: `${height}px` }}
    >
      <div
        ref={nodeRef}
        style={{
          position: "absolute",
          top: position.y,
          left: position.x,
          width: "200px",
          height: "200px",
          cursor: isResizing ? "se-resize" : isDragging ? "grabbing" : "grab",
          touchAction: "none",
          transform: `scale(${scale}) rotate(${angle}deg)`,
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",

            transformOrigin: "center center",
          }}
        >
          <img
            src={uploadedImage || "/api/placeholder/200/200"}
            alt="Draggable Content"
            className="w-full h-full select-none"
            style={{ pointerEvents: isResizing ? "none" : "auto" }}
          />
        </div>
        {!hideIcons&&(
             <div
             className="position-absolute d-flex p-2 rounded-full cursor-se-resize"
             style={{
               bottom: "0px",
               right: 0,
               mixBlendMode: "difference",
               color: "#000",
               backgroundColor: isResizing ? "rgba(255, 255, 255, 0.7)" : "white",
             }}
             onMouseDown={handleIconMouseDown}
           >
             <FontAwesomeIcon
               icon={faUpRightAndDownLeftFromCenter}
               style={{ transform: "rotate(90deg)" }}
             />
           </div>
        )}
     {!hideIcons&&(
        <div
        className="d-flex p-2 rounded-full"
        style={{
          position: "absolute",
          bottom: "-25px",
          left: "50%",
          touchAction: "none",
          color: "#000",

          backgroundColor: isResizing ? "rgba(255, 255, 255, 0.7)" : "white",
        }}
        ref={rotateRef}
      >
        <FontAwesomeIcon icon={faRotateRight} />
      </div>
     )}
      
      </div>
    </div>
  );
};

export default DraggableImage;
