import { google } from "googleapis";

export async function POST(request) {
  try {
    // Parse the incoming JSON payload
    const body = await request.json();

    // Define the expected header fields
    const expectedHeader = [
      "Sr No",
      "Date",
      "Tada Order id",
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

    // Validate that all required fields are present
    const missingFields = expectedHeader.filter(
      (field) => !(field in body) && field !== "Sr No" // Sr No can be auto-generated
    );
    if (missingFields.length > 0) {
      return new Response(
        JSON.stringify({
          error: `Missing fields: ${missingFields.join(", ")}`,
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Initialize Google Sheets API with API key
    const sheets = google.sheets({
      version: "v4",
      auth: process.env.GOOGLE_SHEETS_KEY,
    });

    const spreadsheetId = "1FbHCqb6hE-ThaeozUcA0RsoAw8au84Pwb9T6iWT8mQs";
    const range = "Sheet1!A:Z"; // Append to Sheet1

    // Prepare the row data, ensuring order matches the header
    const rowData = expectedHeader.map(
      (field) => (field === "Sr No" ? "" : body[field] || "") // Leave Sr No blank or auto-generate if needed
    );

    // Append the row to the spreadsheet
    const response = await sheets.spreadsheets.values.append({
      spreadsheetId,
      range,
      valueInputOption: "RAW",
      insertDataOption: "INSERT_ROWS",
      resource: {
        values: [rowData],
      },
    });

    return new Response(
      JSON.stringify({
        message: "Row added successfully",
        data: response.data,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error adding row:", error);
    return new Response(JSON.stringify({ error: "Failed to add row" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
