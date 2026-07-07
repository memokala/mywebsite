/**
 * Utility functions for client-side image manipulation using the HTML5 Canvas API.
 */

/**
 * Loads a File into an HTMLImageElement.
 */
function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error("Failed to load image"));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
}

/**
 * Compresses an image file by adjusting its quality and optionally scaling down.
 * @param quality Compression quality from 0.1 to 1.0
 */
export async function compressImage(file: File, quality: number = 0.8): Promise<Blob> {
  const img = await loadImage(file);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not get canvas context");

  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  ctx.drawImage(img, 0, 0);

  // We compress to JPEG for standard quality tuning, or PNG if JPEG is not desired
  const format = file.type === "image/png" ? "image/jpeg" : file.type; // Compress PNGs to JPEGs for size reduction
  const targetFormat = format.startsWith("image/") ? format : "image/jpeg";

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error("Canvas compression failed"));
      },
      targetFormat,
      quality
    );
  });
}

/**
 * Resizes an image to the target dimensions.
 */
export async function resizeImage(
  file: File,
  width: number,
  height: number,
  maintainAspectRatio: boolean = true
): Promise<Blob> {
  const img = await loadImage(file);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not get canvas context");

  let targetWidth = width;
  let targetHeight = height;

  if (maintainAspectRatio) {
    const aspectRatio = img.naturalWidth / img.naturalHeight;
    if (width / height > aspectRatio) {
      targetWidth = height * aspectRatio;
    } else {
      targetHeight = width / aspectRatio;
    }
  }

  canvas.width = targetWidth;
  canvas.height = targetHeight;
  ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error("Canvas resizing failed"));
    }, file.type);
  });
}

/**
 * Crops an image file based on X, Y, width, and height.
 */
export async function cropImage(
  file: File,
  x: number,
  y: number,
  width: number,
  height: number
): Promise<Blob> {
  const img = await loadImage(file);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not get canvas context");

  canvas.width = width;
  canvas.height = height;
  ctx.drawImage(img, x, y, width, height, 0, 0, width, height);

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error("Canvas cropping failed"));
    }, file.type);
  });
}

/**
 * Rotates an image by 90, 180, or 270 degrees.
 * @param angleDegrees Angle to rotate: 90, 180, or 270
 */
export async function rotateImage(file: File, angleDegrees: number): Promise<Blob> {
  const img = await loadImage(file);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not get canvas context");

  const angleRad = (angleDegrees * Math.PI) / 180;
  const is90or270 = angleDegrees === 90 || angleDegrees === 270;

  canvas.width = is90or270 ? img.naturalHeight : img.naturalWidth;
  canvas.height = is90or270 ? img.naturalWidth : img.naturalHeight;

  ctx.translate(canvas.width / 2, canvas.height / 2);
  ctx.rotate(angleRad);
  ctx.drawImage(img, -img.naturalWidth / 2, -img.naturalHeight / 2);

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error("Canvas rotation failed"));
    }, file.type);
  });
}

/**
 * Converts an image file to a different MIME type format (e.g. image/png, image/jpeg, image/webp).
 */
export async function convertImage(file: File, targetFormat: string): Promise<Blob> {
  const img = await loadImage(file);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not get canvas context");

  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  
  // Fill white background for JPEGs (to handle transparent PNG conversion cleanly)
  if (targetFormat === "image/jpeg") {
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  ctx.drawImage(img, 0, 0);

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error("Canvas format conversion failed"));
    }, targetFormat);
  });
}

/**
 * Helper to download Blob files.
 */
export function downloadBlob(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

