import axios from "axios";

export async function getLocationByPincode(pincode) {
  const url = `https://api.postalpincode.in/pincode/${pincode}`;
  const response = await axios.get(url);

  if (response.data[0]?.Status === "Success") {
    const postOfficeData = response.data[0].PostOffice[0];
    return {
      country: postOfficeData.Country || "India",
      state: postOfficeData.State,
      city: postOfficeData.District,
      pincode: pincode,
    };
  }
  return null; // Silently return null if no data or API fails
}
