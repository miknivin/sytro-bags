"use client";

import React, { useRef, useState, useEffect } from "react";
import { useDrag } from "@use-gesture/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faExpand,
  faCompress,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";

export default function VideoPlayer() {
  const videoRef = useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [show, setShow] = useState(true);
  const [position, setPosition] = useState({ x: 10, y: 10 });

  const playerWidth = 180;
  const playerHeight = 320;

  useEffect(() => {
    setPosition({
      x: 10,
      y: window.innerHeight - playerHeight - 20,
    });
  }, []);

  const bind = useDrag(({ movement: [mx, my], memo }) => {
    const startX = memo?.x ?? position.x;
    const startY = memo?.y ?? position.y;

    const newX = startX + mx;
    const newY = startY + my;

    const maxX = window.innerWidth - playerWidth;
    const maxY = window.innerHeight - playerHeight;

    const boundedX = Math.max(0, Math.min(newX, maxX));
    const boundedY = Math.max(0, Math.min(newY, maxY));

    setPosition({ x: boundedX, y: boundedY });

    return memo ?? { x: position.x, y: position.y };
  });

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      videoRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const closeVideo = () => {
    setShow(false);
  };

  if (!show) return null;

  return (
    <div
      {...bind()}
      className="card bg-dark text-white shadow-lg"
      style={{
        width: `${playerWidth}px`,
        height: `${playerHeight}px`,
        cursor: "move",
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 9999,
        transform: `translate(${position.x}px, ${position.y}px)`,
        touchAction: "none", // Important for mobile
      }}
    >
      <video
        ref={videoRef}
        src="https://ik.imagekit.io/c1jhxlxiy/SYTRO%203%20(1).mp4?updatedAt=1744783201611"
        autoPlay
        muted
        loop
        className="card-img-top w-100 h-100"
        style={{ objectFit: "cover" }}
      />
      <button
        onClick={toggleFullscreen}
        className="btn btn-dark btn-sm position-absolute bottom-0 end-0 m-3 opacity-75"
        style={{ backgroundColor: "rgba(0, 0, 0, 0.75)" }}
        aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
      >
        <FontAwesomeIcon
          icon={isFullscreen ? faCompress : faExpand}
          size="lg"
        />
      </button>
      <button
        onClick={closeVideo}
        className="btn btn-dark btn-sm position-absolute top-0 end-0 m-3 opacity-75"
        style={{ backgroundColor: "rgba(0, 0, 0, 0.75)" }}
        aria-label="Close video"
      >
        <FontAwesomeIcon icon={faTimes} size="lg" />
      </button>
    </div>
  );
}
