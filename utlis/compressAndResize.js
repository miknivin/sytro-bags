import imageCompression from "browser-image-compression";

export const compressAndResizeImage = async (file) => {
  const MAX_SIZE_MB = 6;
  const MAX_DIMENSION = 3500;
  const SCALE_FACTOR = 1.25;
  const fileSizeMB = file.size / (1024 * 1024);

  if (fileSizeMB < MAX_SIZE_MB || !file.type.startsWith("image/")) {
    return file;
  }

  try {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.src = url;

    await new Promise((resolve) => (img.onload = resolve));

    let { width, height } = img;
    let scale = 1;

    if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
      scale = (Math.max(width, height) / MAX_DIMENSION) * SCALE_FACTOR;
    }

    URL.revokeObjectURL(url);

    const options = {
      maxSizeMB: MAX_SIZE_MB,
      maxWidthOrHeight: Math.max(width, height) / scale,
      useWebWorker: true,
      fileType: "image/jpeg",
    };

    const compressedFile = await imageCompression(file, options);
    return new File([compressedFile], file.name, {
      type: "image/jpeg",
      lastModified: Date.now(),
    });
  } catch (error) {
    console.error("Image compression failed:", error);
    return file;
  }
};
