"use server";
import { NextResponse } from "next/server";
import { S3Client, AbortMultipartUploadCommand } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

export async function POST(req) {
  try {
    const formData = await req.formData();
    const fileKey = formData.get("fileKey");
    const uploadId = formData.get("uploadId");

    if (!fileKey || !uploadId) {
      throw new Error("File key and uploadId are required");
    }

    if (!process.env.AWS_BUCKET_NAME) {
      throw new Error("S3 bucket name not configured");
    }

    const abortParams = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: fileKey,
      UploadId: uploadId,
    };
    const abortCommand = new AbortMultipartUploadCommand(abortParams);
    await s3Client.send(abortCommand);

    return NextResponse.json({
      success: true,
      message: "Multipart upload aborted successfully",
    });
  } catch (error) {
    console.error("Error aborting multipart upload:", error);
    return NextResponse.json(
      { error: error.message, details: error.stack },
      { status: 500 }
    );
  }
}
