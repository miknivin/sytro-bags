export async function uploadMultipartFile(
  file,
  quantity = 1,
  partSize = 2 * 1024 * 1024,
  initiateMultipartUpload,
  completeMultipartUpload,
  abortMultipartUpload
) {
  // Split file into parts
  const parts = [];
  const fileSize = file.size;
  const partCount = Math.ceil(fileSize / partSize);
  console.log(
    `File: ${file.name}, Size: ${fileSize}, Part count: ${partCount}`
  );

  for (let i = 0; i < partCount; i++) {
    const start = i * partSize;
    const end = Math.min(start + partSize, fileSize);
    parts.push(file.slice(start, end));
  }

  // Initiate multipart upload
  const fileMetadata = [{ name: file.name, type: file.type }];
  const formData = new FormData();
  formData.append("files", JSON.stringify(fileMetadata));
  formData.append("quantity", quantity.toString());
  formData.append("partCount", partCount.toString());

  let result;
  try {
    result = await initiateMultipartUpload(formData).unwrap();
    console.log("Initiate result:", JSON.stringify(result, null, 2));
  } catch (error) {
    throw new Error(`Failed to initiate multipart upload: ${error.message}`);
  }

  // Check if response is valid and contains results array
  if (
    !result?.success ||
    !Array.isArray(result.results) ||
    !result.results[0]
  ) {
    throw new Error("Invalid response from initiate multipart upload");
  }

  const { uploadId, fileKey, presignedUrls } = result.results[0];

  // Validate fileKey
  if (!fileKey) {
    throw new Error("Missing fileKey in initiate multipart upload response");
  }

  // Convert presignedUrls object to array
  const presignedUrlsArray = Object.keys(presignedUrls)
    .sort((a, b) => parseInt(a) - parseInt(b))
    .map((key) => presignedUrls[key]);

  if (!presignedUrlsArray.length || presignedUrlsArray.length < partCount) {
    throw new Error("Insufficient or invalid presigned URLs");
  }

  // Upload parts
  const uploadPromises = parts.map(async (part, index) => {
    const url = presignedUrlsArray[index];
    if (!url) {
      throw new Error(`No presigned URL for part ${index + 1}`);
    }

    console.log(`Uploading part ${index + 1} to URL: ${url}`);
    const response = await fetch(url, {
      method: "PUT",
      body: part,
      headers: { "Content-Type": file.type },
    });

    if (!response.ok) {
      throw new Error(
        `Failed to upload part ${index + 1} of ${file.name}: ${
          response.statusText
        }`
      );
    }

    const headers = {};
    response.headers.forEach((value, key) => {
      headers[key] = value;
    });
    console.log(`Part ${index + 1} headers:`, JSON.stringify(headers, null, 2));

    const etag = response.headers.get("ETag");
    if (!etag) {
      throw new Error(`Missing ETag for part ${index + 1} of ${file.name}`);
    }

    // Use lowercase keys to match backend expectations
    return { etag: etag, partNumber: index + 1 };
  });

  let partsUploaded;
  try {
    partsUploaded = await Promise.all(uploadPromises);
    console.log("Parts uploaded:", JSON.stringify(partsUploaded, null, 2));
  } catch (err) {
    // Abort multipart upload on failure
    const abortFormData = new FormData();
    abortFormData.append("fileKey", fileKey);
    abortFormData.append("uploadId", uploadId);
    const abortResult = await abortMultipartUpload(abortFormData);
    console.log("Abort result:", abortResult);
    throw err;
  }

  // Complete multipart upload
  const completeFormData = new FormData();
  completeFormData.append("fileKey", fileKey);
  completeFormData.append("uploadId", uploadId);
  completeFormData.append("parts", JSON.stringify(partsUploaded));

  let completeResult;
  try {
    completeResult = await completeMultipartUpload(completeFormData).unwrap();
    console.log("Complete result:", JSON.stringify(completeResult, null, 2));
  } catch (error) {
    throw new Error(`Failed to complete multipart upload: ${error.message}`);
  }

  if (!completeResult.success) {
    throw new Error("Failed to complete multipart upload");
  }

  return completeResult.finalUrl;
}