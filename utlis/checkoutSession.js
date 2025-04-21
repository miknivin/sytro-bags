import axios from "axios";
import Swal from "sweetalert2";

const handleCheckoutSession = async (orderData, checkoutSession) => {
  try {
    const response = await checkoutSession({ orderData }).unwrap();
    return response;
  } catch (error) {
    console.error("Checkout session failed:", error);

    // Make POST request to session-started endpoint
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_ADMIN_URL}/api/orders/payments/session-started`,
        {
          orderData,
        },
        {
          withCredentials: true,
        }
      );
      if (response.data) {
        return response.data; // Return response.data if it exists
      }
    } catch (axiosError) {
      console.error("Failed to log session start:", axiosError);
    }

    // Show user-friendly error message
    await Swal.fire({
      icon: "error",
      title: "Checkout Failed",
      text: "Unable to initiate payment. Please try again or contact support.",
      confirmButtonText: "OK",
    });

    throw error; // Re-throw to allow caller to handle further if needed
  }
};

export default handleCheckoutSession;
