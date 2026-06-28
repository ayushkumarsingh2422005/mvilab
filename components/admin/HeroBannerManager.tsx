"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import {
  HiOutlineComputerDesktop,
  HiOutlineDevicePhoneMobile,
  HiOutlineFolderOpen,
  HiOutlinePencilSquare,
  HiOutlinePlus,
  HiOutlineTrash,
} from "react-icons/hi2";
import { AssetImagePicker } from "@/components/admin/AssetImagePicker";
import { HeroImageCropModal } from "@/components/admin/HeroImageCropModal";
import { Modal, ModalActions, ModalAlert } from "@/components/ui/Modal";
import type { AssetDirectoryListing } from "@/lib/assets/list";
import type { HeroSlideItem } from "@/lib/hero-slides";
import { HERO_ART_SPECS } from "@/lib/hero-images";

type HeroFormState = {
  alt: string;
  sortOrder: number;
};

const inputClassName =
  "w-full rounded-lg border border-[#d8d8d8] px-3 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15";

function emptyForm(): HeroFormState {
  return {
    alt: "",
    sortOrder: 0,
  };
}

function formFromSlide(slide: HeroSlideItem): HeroFormState {
  return {
    alt: slide.alt,
    sortOrder: slide.sortOrder,
  };
}

type AssetPickerTarget = {
  slideId: string;
  variant: "desktop" | "mobile";
};

type CropSession = {
  slideId: string;
  variant: "desktop" | "mobile";
  imageSrc: string;
  fileName: string;
  revokeOnClose: boolean;
};

type HeroBannerManagerProps = {
  initialSlides: HeroSlideItem[];
};

export function HeroBannerManager({ initialSlides }: HeroBannerManagerProps) {
  const [slides, setSlides] = useState(initialSlides);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<HeroFormState>(emptyForm);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploadingKey, setUploadingKey] = useState<string | null>(null);
  const [assetPickerTarget, setAssetPickerTarget] = useState<AssetPickerTarget | null>(null);
  const [assetPickerListing, setAssetPickerListing] = useState<AssetDirectoryListing | null>(null);
  const [assetPickerLoading, setAssetPickerLoading] = useState(false);
  const [assetPickerKey, setAssetPickerKey] = useState(0);
  const [cropSession, setCropSession] = useState<CropSession | null>(null);
  const uploadInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(""), 4000);
    return () => window.clearTimeout(timer);
  }, [toast]);

  async function refreshSlides() {
    const response = await fetch("/api/admin/hero-slides");
    const data = await response.json();
    if (response.ok) {
      setSlides(data.slides ?? []);
    }
  }

  function openCreate() {
    setEditingId(null);
    setForm(emptyForm());
    setError("");
    setOpen(true);
  }

  function openEdit(slide: HeroSlideItem) {
    setEditingId(slide.id);
    setForm(formFromSlide(slide));
    setError("");
    setOpen(true);
  }

  function closeModal() {
    setOpen(false);
    setEditingId(null);
    setError("");
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(editingId ? `/api/admin/hero-slides/${editingId}` : "/api/admin/hero-slides", {
        method: editingId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await response.json();

      if (!response.ok) {
        setError(data.error ?? "Unable to save hero slide.");
        return;
      }

      closeModal();
      setToast(editingId ? "Hero slide updated." : "Hero slide created.");
      await refreshSlides();
    } catch {
      setError("Unable to save hero slide right now.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteSlide(slide: HeroSlideItem) {
    const confirmed = window.confirm(`Delete this hero slide?\n\n"${slide.alt}"\n\nThis cannot be undone.`);
    if (!confirmed) return;

    const response = await fetch(`/api/admin/hero-slides/${slide.id}`, { method: "DELETE" });
    const data = await response.json();

    if (!response.ok) {
      setToast(data.error ?? "Unable to delete hero slide.");
      return;
    }

    setToast("Hero slide deleted.");
    await refreshSlides();
  }

  function closeCropSession() {
    setCropSession((current) => {
      if (current?.revokeOnClose) {
        URL.revokeObjectURL(current.imageSrc);
      }
      return null;
    });
  }

  function openCropForFile(slideId: string, variant: "desktop" | "mobile", file: File) {
    setCropSession({
      slideId,
      variant,
      imageSrc: URL.createObjectURL(file),
      fileName: file.name,
      revokeOnClose: true,
    });
  }

  function openCropForAsset(slideId: string, variant: "desktop" | "mobile", publicPath: string) {
    const fileName = publicPath.split("/").pop() ?? "hero-image.jpg";
    setAssetPickerTarget(null);
    setCropSession({
      slideId,
      variant,
      imageSrc: publicPath,
      fileName,
      revokeOnClose: false,
    });
  }

  function openCropForExisting(slideId: string, variant: "desktop" | "mobile", imageUrl: string) {
    const fileName = imageUrl.split("/").pop() ?? "hero-image.jpg";
    setCropSession({
      slideId,
      variant,
      imageSrc: imageUrl,
      fileName,
      revokeOnClose: false,
    });
  }

  async function handleCroppedImage(file: File) {
    if (!cropSession) return;

    const { slideId, variant } = cropSession;
    closeCropSession();
    await handleUploadImage(slideId, variant, file);
  }

  async function togglePublished(slide: HeroSlideItem) {
    const response = await fetch(`/api/admin/hero-slides/${slide.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        alt: slide.alt,
        sortOrder: slide.sortOrder,
        isPublished: !slide.isPublished,
      }),
    });
    const data = await response.json();

    if (!response.ok) {
      setToast(data.error ?? "Unable to update publish status.");
      return;
    }

    setSlides((current) => current.map((item) => (item.id === slide.id ? data.slide : item)));
    setToast(data.slide.isPublished ? "Slide published." : "Slide unpublished.");
  }

  async function handleUploadImage(slideId: string, variant: "desktop" | "mobile", file: File) {
    const uploadKey = `${slideId}-${variant}`;
    setUploadingKey(uploadKey);

    try {
      const formData = new FormData();
      formData.append("variant", variant);
      formData.append("image", file);

      const response = await fetch(`/api/admin/hero-slides/${slideId}/image`, {
        method: "POST",
        body: formData,
      });
      const data = await response.json();

      if (!response.ok) {
        setToast(data.error ?? "Upload failed.");
        return;
      }

      setSlides((current) => current.map((slide) => (slide.id === slideId ? data.slide : slide)));
      setToast(`${variant === "desktop" ? "Desktop" : "Mobile"} image updated.`);
    } catch {
      setToast("Upload failed.");
    } finally {
      setUploadingKey(null);
    }
  }

  async function openAssetPicker(slideId: string, variant: "desktop" | "mobile") {
    setAssetPickerTarget({ slideId, variant });
    setAssetPickerLoading(true);

    try {
      const response = await fetch("/api/admin/assets?path=hero");
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error ?? "Unable to load asset library.");
      }
      setAssetPickerListing(data.listing);
      setAssetPickerKey((value) => value + 1);
    } catch (uploadError) {
      setToast(uploadError instanceof Error ? uploadError.message : "Unable to open asset library.");
      setAssetPickerTarget(null);
    } finally {
      setAssetPickerLoading(false);
    }
  }

  async function handleAssetSelect(publicPath: string) {
    if (!assetPickerTarget) return;
    openCropForAsset(assetPickerTarget.slideId, assetPickerTarget.variant, publicPath);
  }

  function uploadInputId(slideId: string, variant: "desktop" | "mobile") {
    return `${slideId}-${variant}`;
  }

  return (
    <>
      <section className="rounded-2xl border border-[#e0eaed] bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#ececec] px-6 py-5">
          <div>
            <h2 className="m-0 text-lg font-bold text-primary-dark">Homepage hero banner</h2>
            <p className="mt-1 mb-0 text-sm text-[#667]">{slides.length} slides</p>
          </div>
          <button
            type="button"
            onClick={openCreate}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:brightness-105"
          >
            <HiOutlinePlus size={18} aria-hidden />
            Add slide
          </button>
        </div>

        <div className="border-b border-[#ececec] bg-[#f9fbfc] px-6 py-4">
          <p className="m-0 text-sm leading-relaxed text-[#555]">
            Upload separate images for desktop and phone. If an image is not the right shape, a crop editor opens
            automatically before saving.
          </p>
          <ul className="mt-3 mb-0 grid list-none gap-2 p-0 text-sm text-[#667] sm:grid-cols-2">
            <li className="flex items-center gap-2">
              <HiOutlineComputerDesktop size={18} className="shrink-0 text-primary" aria-hidden />
              Desktop: {HERO_ART_SPECS.desktop.ratio} ratio ({HERO_ART_SPECS.desktop.example})
            </li>
            <li className="flex items-center gap-2">
              <HiOutlineDevicePhoneMobile size={18} className="shrink-0 text-primary" aria-hidden />
              Mobile: {HERO_ART_SPECS.mobile.ratio} ratio ({HERO_ART_SPECS.mobile.example})
            </li>
          </ul>
        </div>

        {toast ? (
          <div className="border-b border-[#ececec] px-6 py-3">
            <p className="m-0 text-sm font-medium text-primary-dark" role="status">
              {toast}
            </p>
          </div>
        ) : null}

        {slides.length === 0 ? (
          <p className="px-6 py-8 text-sm text-[#667]">
            No hero slides yet. Add a slide, upload desktop and mobile images, then publish it to show on the homepage.
          </p>
        ) : (
          <ul className="m-0 list-none p-0">
            {slides.map((slide) => (
              <li key={slide.id} className="border-b border-[#ececec] px-6 py-6 last:border-b-0">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="m-0 text-base font-bold text-primary-dark">{slide.alt}</h3>
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                          slide.isPublished
                            ? "bg-primary-light text-primary-dark"
                            : "bg-[#f0f0f0] text-[#667]"
                        }`}
                      >
                        {slide.isPublished ? "Published" : "Draft"}
                      </span>
                    </div>
                    <p className="mt-1 mb-0 text-xs text-[#667]">Display order {slide.sortOrder}</p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => void togglePublished(slide)}
                      className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
                    >
                      {slide.isPublished ? "Unpublish" : "Publish"}
                    </button>
                    <button
                      type="button"
                      onClick={() => openEdit(slide)}
                      className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
                    >
                      <HiOutlinePencilSquare size={16} aria-hidden />
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => void handleDeleteSlide(slide)}
                      className="inline-flex items-center gap-1 text-sm font-semibold text-red-700 hover:underline"
                    >
                      <HiOutlineTrash size={16} aria-hidden />
                      Delete
                    </button>
                  </div>
                </div>

                <div className="mt-5 grid gap-5 lg:grid-cols-2">
                  {(["desktop", "mobile"] as const).map((variant) => {
                    const imageUrl = variant === "desktop" ? slide.desktopImageUrl : slide.mobileImageUrl;
                    const uploadKey = `${slide.id}-${variant}`;
                    const isUploading = uploadingKey === uploadKey;
                    const aspectClass = variant === "desktop" ? "aspect-[2/1]" : "aspect-[4/3]";
                    const label = variant === "desktop" ? "Desktop (PC)" : "Mobile (phone)";
                    const Icon = variant === "desktop" ? HiOutlineComputerDesktop : HiOutlineDevicePhoneMobile;
                    const spec = HERO_ART_SPECS[variant];

                    return (
                      <div key={variant} className="rounded-xl border border-[#e0eaed] bg-[#f9fbfc] p-4">
                        <div className="mb-3 flex items-center gap-2">
                          <Icon size={18} className="text-primary" aria-hidden />
                          <p className="m-0 text-sm font-semibold text-primary-dark">{label}</p>
                          <span className="text-xs text-[#667]">
                            {spec.ratio} · {spec.example}
                          </span>
                        </div>

                        <div className={`relative mb-4 w-full overflow-hidden rounded-lg border border-[#dce8eb] bg-white ${aspectClass}`}>
                          {imageUrl ? (
                            <Image
                              src={imageUrl}
                              alt=""
                              fill
                              className="object-cover"
                              sizes={variant === "desktop" ? "(max-width: 1024px) 50vw, 480px" : "(max-width: 1024px) 50vw, 360px"}
                              unoptimized
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center px-4 text-center text-sm text-[#667]">
                              No {variant} image yet
                            </div>
                          )}
                        </div>

                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() => uploadInputRefs.current[uploadInputId(slide.id, variant)]?.click()}
                            disabled={isUploading}
                            className="rounded-xl border border-primary/25 px-3 py-2 text-sm font-semibold text-primary-dark transition hover:bg-primary-light disabled:opacity-60"
                          >
                            {isUploading ? "Uploading…" : "Upload"}
                          </button>
                          <button
                            type="button"
                            onClick={() => void openAssetPicker(slide.id, variant)}
                            disabled={assetPickerLoading}
                            className="inline-flex items-center gap-2 rounded-xl border border-primary/25 px-3 py-2 text-sm font-semibold text-primary-dark transition hover:bg-primary-light disabled:opacity-60"
                          >
                            <HiOutlineFolderOpen size={16} aria-hidden />
                            Assets
                          </button>
                          {imageUrl ? (
                            <button
                              type="button"
                              onClick={() => openCropForExisting(slide.id, variant, imageUrl)}
                              className="rounded-xl border border-[#d8d8d8] px-3 py-2 text-sm font-semibold text-[#444] transition hover:bg-[#f7f7f7]"
                            >
                              Crop
                            </button>
                          ) : null}
                          <input
                            ref={(node) => {
                              uploadInputRefs.current[uploadInputId(slide.id, variant)] = node;
                            }}
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            className="hidden"
                            onChange={(event) => {
                              const file = event.target.files?.[0];
                              if (file) void openCropForFile(slide.id, variant, file);
                              event.target.value = "";
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <Modal
        open={open}
        onClose={closeModal}
        title={editingId ? "Edit hero slide" : "Create hero slide"}
        description="Add alt text and display order. Upload desktop and mobile images after creating the slide."
        panelClassName="max-w-xl"
      >
        <form onSubmit={handleSubmit}>
          {error ? <ModalAlert message={error} tone="error" /> : null}

          <div className="grid gap-4">
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-[#444]">Alt text</span>
              <input
                type="text"
                required
                value={form.alt}
                onChange={(event) => setForm((current) => ({ ...current, alt: event.target.value }))}
                className={inputClassName}
              />
            </label>

            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-[#444]">Display order</span>
              <input
                type="number"
                min={0}
                value={form.sortOrder}
                onChange={(event) =>
                  setForm((current) => ({ ...current, sortOrder: Number(event.target.value) || 0 }))
                }
                className={inputClassName}
              />
              <p className="mt-1.5 mb-0 text-xs text-[#667]">Lower numbers appear first in the homepage carousel.</p>
            </label>
          </div>

          <ModalActions
            onCancel={closeModal}
            submitLabel={editingId ? "Save slide" : "Create slide"}
            loading={loading}
            loadingLabel="Saving…"
          />
        </form>
      </Modal>

      <AssetImagePicker
        key={assetPickerKey}
        open={assetPickerTarget !== null}
        initialListing={assetPickerListing}
        onClose={() => setAssetPickerTarget(null)}
        onSelect={handleAssetSelect}
      />

      <HeroImageCropModal
        open={cropSession !== null}
        imageSrc={cropSession?.imageSrc ?? null}
        variant={cropSession?.variant ?? "desktop"}
        fileName={cropSession?.fileName}
        saving={uploadingKey !== null}
        onClose={closeCropSession}
        onConfirm={(file) => void handleCroppedImage(file)}
      />
    </>
  );
}
