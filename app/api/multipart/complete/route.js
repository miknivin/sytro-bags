"use server";
import { NextResponse } from "next/server";
import { S3Client, CompleteMultipartUploadCommand } from "@aws-sdk/client-s3";

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
    const parts = JSON.parse(formData.get("parts"));

    if (!fileKey || !uploadId || !parts) {
      throw new Error("File key, uploadId, and parts are required");
    }

    if (!process.env.AWS_BUCKET_NAME) {
      throw new Error("S3 bucket name not configured");
    }

    const completeParams = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: fileKey,
      UploadId: uploadId,
      MultipartUpload: {
        Parts: parts.map((part) => ({
          ETag: part.etag,
          PartNumber: part.partNumber,
        })),
      },
    };
    const completeCommand = new CompleteMultipartUploadCommand(completeParams);
    const completeRes = await s3Client.send(completeCommand);

    const finalUrl = `${process.env.CLOUDFRONT_DOMAIN_2}/${fileKey}`;

    return NextResponse.json({
      success: true,
      key: completeRes?.Key,
      finalUrl,
    });
  } catch (error) {
    console.error("Error completing multipart upload:", error);
    return NextResponse.json(
      { error: error.message, details: error.stack },
      { status: 500 }
    );
  }
}
