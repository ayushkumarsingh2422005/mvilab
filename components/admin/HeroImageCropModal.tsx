"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Cropper, { type Area, type Point } from "react-easy-crop";
import "react-easy-crop/react-easy-crop.css";
import { Modal } from "@/components/ui/Modal";
import {
  aspectRatioMatches,
  exportCroppedImageFile,
  HERO_CROP_ASPECT,
  HERO_CROP_EXPORT,
  loadImageElement,
  type HeroCropVariant,
} from "@/lib/images/hero-crop";
import { HERO_ART_SPECS } from "@/lib/hero-images";

type HeroImageCropModalProps = {
  open: boolean;
  imageSrc: string | null;
  variant: HeroCropVariant;
  fileName?: string;
  saving?: boolean;
  onClose: () => void;
  onConfirm: (file: File) => void;
};

export function HeroImageCropModal({
  open,
  imageSrc,
  variant,
  fileName = "hero-image.jpg",
  saving = false,
  onClose,
  onConfirm,
}: HeroImageCropModalProps) {
  const aspect = HERO_CROP_ASPECT[variant];
  const spec = HERO_ART_SPECS[variant];
  const exportSize = HERO_CROP_EXPORT[variant];

  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [naturalSize, setNaturalSize] = useState({ width: 0, height: 0 });
  const [loadError, setLoadError] = useState("");
  const [exporting, setExporting] = useState(false);

  const matchesAspect = useMemo(() => {
    if (!naturalSize.width || !naturalSize.height) return false;
    return aspectRatioMatches(naturalSize.width, naturalSize.height, aspect);
  }, [aspect, naturalSize.height, naturalSize.width]);

  useEffect(() => {
    if (!open || !imageSrc) {
      setCrop({ x: 0, y: 0 });
      setZoom(1);
      setCroppedAreaPixels(null);
      setNaturalSize({ width: 0, height: 0 });
      setLoadError("");
      return;
    }

    let cancelled = false;

    void loadImageElement(imageSrc)
      .then((image) => {
        if (cancelled) return;
        setNaturalSize({ width: image.naturalWidth, height: image.naturalHeight });
        setLoadError("");
      })
      .catch((error) => {
        if (cancelled) return;
        setLoadError(error instanceof Error ? error.message : "Unable to load image.");
      });

    return () => {
      cancelled = true;
    };
  }, [imageSrc, open]);

  const onCropComplete = useCallback((_croppedArea: Area, pixels: Area) => {
    setCroppedAreaPixels(pixels);
  }, []);

  async function handleConfirm() {
    if (!imageSrc || !croppedAreaPixels) return;

    setExporting(true);
    try {
      const file = await exportCroppedImageFile(imageSrc, croppedAreaPixels, variant, fileName);
      onConfirm(file);
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : "Unable to save cropped image.");
    } finally {
      setExporting(false);
    }
  }

  const label = variant === "desktop" ? "Desktop (PC)" : "Mobile (phone)";

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={`Crop ${label} banner`}
      description={`Drag and zoom to fit ${spec.ratio}. Saved size: ${exportSize.width} × ${exportSize.height} px.`}
      panelClassName="max-w-3xl"
    >
      {loadError ? (
        <p className="m-0 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
          {loadError}
        </p>
      ) : null}

      {!loadError && imageSrc ? (
        <>
          <p className="mt-0 mb-4 text-sm text-[#667]">
            {matchesAspect
              ? "This image already matches the recommended ratio. Adjust the crop if needed, then save."
              : "This image does not match the recommended ratio. Drag the image and use zoom to choose the visible area."}
          </p>

          <div className="relative h-[min(60vh,420px)] w-full overflow-hidden rounded-xl border border-[#dce8eb] bg-[#0f172a]">
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={aspect}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
              objectFit="contain"
            />
          </div>

          <label className="mt-5 block">
            <span className="mb-2 block text-sm font-medium text-[#444]">Zoom</span>
            <input
              type="range"
              min={1}
              max={3}
              step={0.05}
              value={zoom}
              onChange={(event) => setZoom(Number(event.target.value))}
              className="w-full accent-primary"
            />
          </label>

          <div className="mt-6 flex flex-wrap justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-[#d8d8d8] px-4 py-2.5 text-sm font-semibold text-[#444] transition hover:bg-[#f7f7f7]"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => void handleConfirm()}
              disabled={exporting || saving || !croppedAreaPixels}
              className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {exporting || saving ? "Saving…" : "Save cropped image"}
            </button>
          </div>
        </>
      ) : !loadError ? (
        <p className="m-0 text-sm text-[#667]">Loading image…</p>
      ) : null}
    </Modal>
  );
}
