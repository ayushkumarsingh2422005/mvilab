export type CropRect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type HeroCropVariant = "desktop" | "mobile";

export const HERO_CROP_ASPECT: Record<HeroCropVariant, number> = {
  desktop: 2,
  mobile: 4 / 3,
};

export const HERO_CROP_EXPORT: Record<HeroCropVariant, { width: number; height: number }> = {
  desktop: { width: 2400, height: 1200 },
  mobile: { width: 1600, height: 1200 },
};

export function aspectRatioMatches(
  width: number,
  height: number,
  targetAspect: number,
  tolerance = 0.02,
) {
  if (width <= 0 || height <= 0) return false;
  const imageAspect = width / height;
  return Math.abs(imageAspect - targetAspect) / targetAspect <= tolerance;
}

export function loadImageElement(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Unable to load image for cropping."));
    image.src = src;
  });
}

export async function exportCroppedImageFile(
  imageSrc: string,
  crop: CropRect,
  variant: HeroCropVariant,
  fileName = "hero-image.jpg",
) {
  const image = await loadImageElement(imageSrc);
  const output = HERO_CROP_EXPORT[variant];
  const canvas = document.createElement("canvas");
  canvas.width = output.width;
  canvas.height = output.height;

  const context = canvas.getContext("2d");
  if (!context) {
    throw new Error("Unable to prepare image crop.");
  }

  context.drawImage(
    image,
    crop.x,
    crop.y,
    crop.width,
    crop.height,
    0,
    0,
    output.width,
    output.height,
  );

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (result) => {
        if (!result) {
          reject(new Error("Unable to export cropped image."));
          return;
        }
        resolve(result);
      },
      "image/jpeg",
      0.92,
    );
  });

  return new File([blob], fileName.replace(/\.\w+$/, ".jpg"), { type: "image/jpeg" });
}
