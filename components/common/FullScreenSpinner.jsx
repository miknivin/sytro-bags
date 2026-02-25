import React from "react";

const FullScreenSpinner = () => {
  return (
    <div
      className="d-flex justify-content-center align-items-center bg-light"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 9999,
      }}
    >
      <div className="spinner-border text-warning" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
};

export default FullScreenSpinner;
