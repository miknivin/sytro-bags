import dbConnect from "@/lib/connection/connection";
import Enquiry from "@/lib/models/Enquiry";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ success: false, message: "Method Not Allowed" });
  }

  try {
    await dbConnect();
    console.log("sample");

    const { name, email, phone, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: "Please provide name, email, and message",
      });
    }

    try {
      const enquiry = await Enquiry.create({
        name,
        email,
        phone,
        message,
      });
      return res.status(201).json({
        success: true,
        data: enquiry,
      });
    } catch (error) {
      if (error.isUpdate) {
        const updatedEnquiry = await Enquiry.findOne({
          $or: [{ email }, { phone }],
        });
        return res.status(200).json({
          success: true,
          data: updatedEnquiry,
          message: "Enquiry updated successfully",
        });
      }
      throw error;
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
}
