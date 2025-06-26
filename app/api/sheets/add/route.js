import { google } from "googleapis";
import { MongoClient } from "mongodb";

export async function POST(request) {
  let client;
  try {
    // Parse the incoming JSON payload
    const body = await request.json();

    // Define the expected header fields
    const expectedHeader = [
      "Sr No",
      "Date",
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

    // Validate that all required fields are present
    const missingFields = expectedHeader.filter(
      (field) => !(field in body) && field !== "Sr No"
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

    // Prepare the row data for Google Sheets
    const rowData = expectedHeader.map((field) =>
      field === "Sr No" ? "" : body[field] || ""
    );

    // Append the row to the spreadsheet
    const sheetsResponse = await sheets.spreadsheets.values.append({
      spreadsheetId,
      range,
      valueInputOption: "RAW",
      insertDataOption: "INSERT_ROWS",
      resource: {
        values: [rowData],
      },
    });

    // Connect to MongoDB
    client = await MongoClient.connect(process.env.MONGODB_URI);
    const db = client.db("your_database_name");
    const collection = db.collection("orders");

    // Prepare data for MongoDB (convert field names to snake_case for consistency)
    const mongoDocument = {
      date: body["Date"],
      tada_order_id: body["Tada Order id"],
      item_id: body["Item Id"],
      product_name_sku: body["Product Name/SKU"],
      quantity: Number(body["Quantity"]),
      drive_link: body["Drive link"],
      notes_comments: body["Notes/Comments"],
      customer_name: body["Customer Name"],
      shipping_address: body["Shipping Address"],
      city: body["City"],
      state: body["State"],
      pincode: body["Pincode"],
      phone: body["Phone"],
      cod_prepaid: body["Cod/Prepaid"],
      cod_amount: Number(body["Cod amount"]),
      fetch_status: body["Fetch Status"],
      received_file: body["Received file"],
      status: body["Status"],
      shipping_date: body["Shipping Date"],
      tracking_id: body["Tracking ID"],
      courier_name: body["Courier Name"],
      rate: Number(body["Rate"]),
      created_at: new Date(),
    };

    // Insert into MongoDB
    const mongoResult = await collection.insertOne(mongoDocument);

    // Create indexes for efficient querying
    await collection.createIndex({ tada_order_id: 1 }, { unique: true });
    await collection.createIndex({ item_id: 1 });
    await collection.createIndex({ customer_name: 1 });
    await collection.createIndex({ status: 1 });

    return new Response(
      JSON.stringify({
        message: "Row added to Google Sheets and MongoDB successfully",
        sheets: sheetsResponse.data,
        mongo: { insertedId: mongoResult.insertedId },
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
  } finally {
    if (client) await client.close();
  }
}
