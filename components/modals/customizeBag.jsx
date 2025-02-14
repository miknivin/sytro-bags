"use client";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export default function CustomModal() {
  const pathname = usePathname();
  const modalElement = useRef();
  const modalInstance = useRef(null);

  useEffect(() => {
    const loadBootstrap = async () => {
      const bootstrap = await import("bootstrap"); // dynamically import bootstrap
      modalInstance.current = new bootstrap.Modal(
        document.getElementById("customModal"),
        {
          keyboard: false,
        }
      );
    };

    loadBootstrap();
  }, []);

  const showModal = () => {
    if (modalInstance.current) {
      modalInstance.current.show();
    }
  };

  return (
    <>

      <div
        ref={modalElement}
        className="modal modalCentered fade auto-popup"
        id="customModal"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-top">
              <Image
                className="lazyload"
                data-src="/images/item/banner.jpg"
                alt="modal-banner"
                width={938}
                height={538}
                src="/images/item/banner.jpg"
              />
              <span
                className="icon icon-close btn-hide-popup"
                data-bs-dismiss="modal"
              />
            </div>
            <div className="modal-bottom text-center">
              <h4>Welcome to Our Website</h4>
              <h6>Enjoy browsing through our content.</h6>
              <a
                href="#"
                data-bs-dismiss="modal"
                className="tf-btn btn-line fw-6 btn-hide-popup"
              >
                Close
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
