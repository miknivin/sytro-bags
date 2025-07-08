"use server";
import { NextResponse } from "next/server";
import {
  S3Client,
  CreateMultipartUploadCommand,
  UploadPartCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { randomUUID } from "crypto";

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const validateFileType = (fileName) => {
  const allowedExtensions = [".jpg", ".jpeg", ".png", ".mp4", ".pdf"];
  const extension = fileName.split(".").pop().toLowerCase();
  return allowedExtensions.includes(`.${extension}`);
};

export async function POST(req) {
  try {
    const formData = await req.formData();
    const filesMetadata = JSON.parse(formData.get("files"));
    const quantity = parseInt(formData.get("quantity") || "1");
    const partCount = parseInt(formData.get("partCount") || "1");

    if (
      !filesMetadata ||
      !Array.isArray(filesMetadata) ||
      filesMetadata.length === 0
    ) {
      throw new Error("No files metadata provided");
    }

    if (filesMetadata.length > quantity) {
      throw new Error(`Cannot upload more than ${quantity} files`);
    }

    if (!partCount || partCount < 1) {
      throw new Error("Invalid part count");
    }

    const results = await Promise.all(
      filesMetadata.map(async (meta) => {
        if (!validateFileType(meta.name)) {
          throw new Error(`Unsupported file type for ${meta.name}`);
        }

        const uniqueId = randomUUID().replace(/-/g, "").slice(0, 6);
        const fileExtension = meta.name.split(".").pop().toLowerCase();
        const newFileName = `${meta.name.replace(
          `.${fileExtension}`,
          ""
        )}_${uniqueId}.${fileExtension}`;
        const fileKey = `user-uploads/${newFileName}`;

        const createParams = {
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: fileKey,
          ContentType: meta.type,
        };
        const createCommand = new CreateMultipartUploadCommand(createParams);
        const { UploadId } = await s3Client.send(createCommand);

        const presignedUrls = {};
        for (let partNumber = 1; partNumber <= partCount; partNumber++) {
          const uploadPartParams = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: fileKey,
            UploadId,
            PartNumber: partNumber,
          };
          const uploadPartCommand = new UploadPartCommand(uploadPartParams);
          const presignedUrl = await getSignedUrl(s3Client, uploadPartCommand, {
            expiresIn: 3600,
          });
          presignedUrls[partNumber] = presignedUrl;
        }

        return {
          name: newFileName,
          fileKey,
          uploadId: UploadId,
          presignedUrls,
          publicUrl: `https://${process.env.CLOUDFRONT_DOMAIN}/${fileKey}`,
        };
      })
    );

    return NextResponse.json({ success: true, results });
  } catch (error) {
    console.error("Error initiating multipart upload:", error);
    return NextResponse.json(
      { error: error.message, details: error.stack },
      { status: 500 }
    );
  }
}
