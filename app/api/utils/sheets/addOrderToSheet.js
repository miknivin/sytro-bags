import { google } from "googleapis";

export async function addOrderToSheet(order, user, cartItems) {
  try {
    const expectedHeader = [
      "Sr No",
      "Date",
      "Order _id",
      "Order id",
      "Item Id",
      "Product Name/SKU",
      "Quantity",
      "Drive link",
      "Notes/Comments",
      "Customer Name",
      "Shipping Address",
      "City",
      "State",
      "Pincode",
      "Phone",
      "Cod/Prepaid",
      "Cod amount",
      "Fetch Status",
      "Received file",
      "Status",
      "Shipping Date",
      "Tracking ID",
      "Courier Name",
      "Rate",
    ];

    // Initialize Google Sheets API with service account credentials
    const auth = new google.auth.GoogleAuth({
      credentials: JSON.parse(process.env.GOOGLE_SHEETS_CREDENTIALS),
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const sheets = google.sheets({
      version: "v4",
      auth,
    });

    const spreadsheetId = "1FbHCqb6hE-ThaeozUcA0RsoAw8au84Pwb9T6iWT8mQs";
    const range = "Sheet1!A:Z";

    const rows = [];
    const currentDate = new Date().toISOString().split("T")[0]; // e.g., 2025-06-26

    for (const item of cartItems) {
      const quantity = item.quantity || 1;
      const itemId = item.product || `ITEM_${Date.now()}`;
      const driveLink = Array.isArray(item.uploadedImage)
        ? item.uploadedImage.join(", ")
        : item.uploadedImage || "";

      // Create one row per unit quantity
      for (let i = 0; i < quantity; i++) {
        const rowData = expectedHeader.map((field) => {
          switch (field) {
            case "Sr No":
              return "";
            case "Date":
              return currentDate;
            case "Order _id":
              return order._id.toString();
            case "Order id":
              return order._id.toString().slice(-6);
            case "Item Id":
              return itemId?.slice(-6);
            case "Product Name/SKU":
              return item.name || "";
            case "Quantity":
              return "1"; // One row per unit
            case "Drive link":
              return driveLink;
            case "Notes/Comments":
              return order.orderNotes || "";
            case "Customer Name":
              return order.shippingInfo?.fullName || user.name || "";
            case "Shipping Address":
              return order.shippingInfo?.address || "";
            case "City":
              return order.shippingInfo?.city || "";
            case "State":
              return order.shippingInfo?.state || "";
            case "Pincode":
              return order.shippingInfo?.zipCode || "";
            case "Phone":
              return order.shippingInfo?.phoneNo || "";
            case "Cod/Prepaid":
              return order.paymentMethod || "Prepaid";
            case "Cod amount":
              return order.paymentMethod === "COD" ? order.totalAmount || 0 : 0;
            case "Fetch Status":
              return "Pending";
            case "Received file":
              return driveLink ? "Yes" : "No";
            case "Status":
              return "Processing";
            case "Shipping Date":
              return "";
            case "Tracking ID":
              return "";
            case "Courier Name":
              return "";
            case "Rate":
              return item.price || 0;
            default:
              return "";
          }
        });

        rows.push(rowData);
      }
    }

    // Append rows to Google Sheets
    let sheetsResult = null;
    if (rows.length > 0) {
      sheetsResult = await sheets.spreadsheets.values.append({
        spreadsheetId,
        range,
        valueInputOption: "RAW",
        insertDataOption: "INSERT_ROWS",
        resource: {
          values: rows,
        },
      });
    }

    return {
      success: true,
      message: "Rows added to Google Sheets successfully",
      sheets: sheetsResult ? sheetsResult.data : null,
      rowsAdded: rows.length,
    };
  } catch (error) {
    console.error("Error adding rows to Google Sheets:", error);
    return {
      success: false,
      error: "Failed to add rows",
    };
  }
}
