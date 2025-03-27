import axios from "axios";

export async function getLocationByPincode(pincode) {
  try {
    const url = `https://api.postalpincode.in/pincode/${pincode}`;

    const response = await axios.get(url);

    if (response.data[0].Status === "Success") {
      const postOfficeData = response.data[0].PostOffice[0];
      return {
        country: postOfficeData.Country || "India",
        state: postOfficeData.State,
        city: postOfficeData.District,
        pincode: pincode,
      };
    } else {
      throw new Error(
        response.data[0].Message || "No data found for this pincode"
      );
    }
  } catch (error) {
    console.error("Error fetching location data:", error.message);
    throw error;
  }
}
