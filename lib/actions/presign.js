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
    const files = formData.getAll("file");
    const quantity = parseInt(formData.get("quantity") || "1");

    if (!files || files.length === 0) {
      throw new Error("No files provided");
    }

    if (files.length > quantity) {
      throw new Error(`Cannot upload more than ${quantity} files`);
    }

    const presignedUrls = await Promise.all(
      files.map(async (file) => {
        const uniqueId = randomUUID().replace(/-/g, "").slice(0, 6);
        const fileExtension = file.name.split(".").pop().toLowerCase();
        const newFileName = `${file.name.replace(
          `.${fileExtension}`,
          ""
        )}_${uniqueId}.${fileExtension}`;

        const uploadParams = {
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: `user-uploads/${newFileName}`,
          ContentType: file.type,
        };

        const command = new PutObjectCommand(uploadParams);
        const url = await getSignedUrl(s3, command, { expiresIn: 3600 });

        return {
          name: newFileName,
          presignedUrl: url,
          publicUrl: `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/user-uploads/${newFileName}`,
        };
      })
    );
    console.log(presignedUrls, "presignedUrls");

    return { success: true, presignedUrls };
  } catch (error) {
    console.error("Error generating presigned URLs:", error);
    return { error: error.message };
  }
}
