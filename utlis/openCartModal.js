export const openCartModal = async () => {
  const bootstrap = await import("bootstrap");

  // Close any open modals
  const modalElements = document.querySelectorAll(".modal.show");
  modalElements.forEach((modal) => {
    const modalInstance = bootstrap.Modal.getInstance(modal);
    if (modalInstance) {
      modalInstance.hide();
    }
  });

  // Close any open offcanvas
  const offcanvasElements = document.querySelectorAll(".offcanvas.show");
  offcanvasElements.forEach((offcanvas) => {
    const offcanvasInstance = bootstrap.Offcanvas.getInstance(offcanvas);
    if (offcanvasInstance) {
      offcanvasInstance.hide();
    }
  });

  // Open shopping cart modal
  const myModal = new bootstrap.Modal(document.getElementById("shoppingCart"), {
    keyboard: false,
  });

  myModal.show();

  document
    .getElementById("shoppingCart")
    .addEventListener("hidden.bs.modal", () => {
      myModal.hide();
    });
};
