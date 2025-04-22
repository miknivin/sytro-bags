"use server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { randomUUID } from "crypto";

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

export async function getPresignedUrls(formData) {
  try {
    const filesMetadata = JSON.parse(formData.get("files")); // Parse metadata array
    const quantity = parseInt(formData.get("quantity") || "1");

    if (!filesMetadata || filesMetadata.length === 0) {
      throw new Error("No files metadata provided");
    }

    if (filesMetadata.length > quantity) {
      throw new Error(`Cannot upload more than ${quantity} files`);
    }

    const presignedUrls = await Promise.all(
      filesMetadata.map(async (meta) => {
        const uniqueId = randomUUID().replace(/-/g, "").slice(0, 6);
        const fileExtension = meta.name.split(".").pop().toLowerCase();
        const newFileName = `${meta.name.replace(
          `.${fileExtension}`,
          ""
        )}_${uniqueId}.${fileExtension}`;

        const uploadParams = {
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: `user-uploads/${newFileName}`,
          ContentType: meta.type,
        };

        const command = new PutObjectCommand(uploadParams);
        const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
        //console.log("Generated presigned URL:", url);

        return {
          name: newFileName,
          presignedUrl: url,
          publicUrl: `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/user-uploads/${newFileName}`,
        };
      })
    );

    return { success: true, presignedUrls };
  } catch (error) {
    console.error(
      "Error generating presigned URLs:",
      error.message,
      error.stack
    );
    return { error: error.message, details: error.stack };
  }
}
