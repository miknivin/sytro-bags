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
  const [shouldLoadVideo, setShouldLoadVideo] = useState(false);

  const playerWidth = 180;
  const playerHeight = 320;

  useEffect(() => {
    setPosition({
      x: 10,
      y: window.innerHeight - playerHeight - 20,
    });
  }, []);

  useEffect(() => {
    let timeoutId = null;
    let idleId = null;

    const loadVideo = () => setShouldLoadVideo(true);

    if (typeof window !== "undefined" && "requestIdleCallback" in window) {
      idleId = window.requestIdleCallback(loadVideo, { timeout: 800 });
    } else {
      timeoutId = window.setTimeout(loadVideo, 300);
    }

    return () => {
      if (idleId !== null && "cancelIdleCallback" in window) {
        window.cancelIdleCallback(idleId);
      }
      if (timeoutId !== null) {
        window.clearTimeout(timeoutId);
      }
    };
  }, []);

  // Safely attempt autoplay when video src is loaded (iOS Safari returns a Promise that can reject)
  useEffect(() => {
    if (!shouldLoadVideo || !videoRef.current) return;
    const video = videoRef.current;
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // Autoplay blocked by browser policy (common on iOS) — safe to ignore
      });
    }
  }, [shouldLoadVideo]);

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
    try {
      const video = videoRef.current;
      if (!video) return;

      // Check for standard OR webkit-prefixed fullscreen support (Safari desktop)
      const isInFullscreen =
        document.fullscreenElement ||
        document.webkitFullscreenElement;

      if (!isInFullscreen) {
        // Use webkit prefix for Safari desktop, standard for others
        if (video.requestFullscreen) {
          video.requestFullscreen().catch(() => {});
        } else if (video.webkitEnterFullscreen) {
          // iOS Safari native video fullscreen
          video.webkitEnterFullscreen();
        } else if (video.webkitRequestFullscreen) {
          video.webkitRequestFullscreen();
        }
        setIsFullscreen(true);
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen().catch(() => {});
        } else if (document.webkitExitFullscreen) {
          document.webkitExitFullscreen();
        }
        setIsFullscreen(false);
      }
    } catch (e) {
      // Fullscreen not supported (iOS Safari in-page) — silently ignore
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
        src={shouldLoadVideo ? "/videos/sytro.mp4" : undefined}
        muted
        loop
        playsInline
        preload="none"
        className="card-img-top w-100 h-100"
        style={{
          objectFit: isFullscreen ? "contain" : "cover",
        }}
        onError={() => {}}
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
