import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import Order from "@/models/Order";

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

export async function POST(req) {
  try {
    const formData = await req.formData();
    const files = formData.getAll("file"); // Get all "file" entries

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No files provided" }, { status: 400 });
    }

    // Function to upload a single file to S3
    const uploadFile = async (file) => {
      const fileBuffer = Buffer.from(await file.arrayBuffer());
      const uniqueId = randomUUID().replace(/-/g, "").slice(0, 6);
      const fileExtension = file.name.split(".").pop();
      const newFileName = `${file.name.replace(
        `.${fileExtension}`,
        ""
      )}_${uniqueId}.${fileExtension}`;

      const uploadParams = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: `user-uploads/${newFileName}`,
        Body: fileBuffer,
        ContentType: file.type,
      };

      const command = new PutObjectCommand(uploadParams);
      await s3.send(command);

      const fileUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/user-uploads/${newFileName}`;
      return { name: newFileName, url: fileUrl };
    };

    let result;
    if (files.length === 1) {
      // Single file case
      const uploadedFile = await uploadFile(files[0]);
      result = uploadedFile;
    } else {
      // Multiple files case
      const uploadPromises = files.map((file) => uploadFile(file));
      result = await Promise.all(uploadPromises);
    }

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
