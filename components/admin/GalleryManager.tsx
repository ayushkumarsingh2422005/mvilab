"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import {
  HiOutlineChevronDown,
  HiOutlineChevronUp,
  HiOutlineFolderOpen,
  HiOutlinePencilSquare,
  HiOutlinePhoto,
  HiOutlinePlus,
  HiOutlineTrash,
} from "react-icons/hi2";
import { AssetImagePicker } from "@/components/admin/AssetImagePicker";
import { Modal, ModalActions, ModalAlert } from "@/components/ui/Modal";
import type { AssetDirectoryListing } from "@/lib/assets/list";
import type { GallerySectionItem } from "@/lib/gallery";

type GalleryFormState = {
  title: string;
  slug: string;
  description: string;
  sortOrder: number;
  isPublished: boolean;
};

const inputClassName =
  "w-full rounded-lg border border-[#d8d8d8] px-3 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15";

function emptyForm(): GalleryFormState {
  return {
    title: "",
    slug: "",
    description: "",
    sortOrder: 0,
    isPublished: false,
  };
}

function formFromSection(section: GallerySectionItem): GalleryFormState {
  return {
    title: section.title,
    slug: section.slug,
    description: section.description ?? "",
    sortOrder: section.sortOrder,
    isPublished: section.isPublished,
  };
}

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

type GalleryManagerProps = {
  initialSections: GallerySectionItem[];
};

export function GalleryManager({ initialSections }: GalleryManagerProps) {
  const [sections, setSections] = useState(initialSections);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<GalleryFormState>(emptyForm);
  const [slugTouched, setSlugTouched] = useState(false);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploadingSectionId, setUploadingSectionId] = useState<string | null>(null);
  const [assetPickerSectionId, setAssetPickerSectionId] = useState<string | null>(null);
  const [assetPickerListing, setAssetPickerListing] = useState<AssetDirectoryListing | null>(null);
  const [assetPickerLoading, setAssetPickerLoading] = useState(false);
  const [assetPickerKey, setAssetPickerKey] = useState(0);
  const uploadInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(""), 4000);
    return () => window.clearTimeout(timer);
  }, [toast]);

  async function refreshSections() {
    const response = await fetch("/api/admin/gallery");
    const data = await response.json();
    if (response.ok) {
      setSections(data.sections ?? []);
    }
  }

  function openCreate() {
    setEditingId(null);
    setForm(emptyForm());
    setSlugTouched(false);
    setError("");
    setOpen(true);
  }

  function openEdit(section: GallerySectionItem) {
    setEditingId(section.id);
    setForm(formFromSection(section));
    setSlugTouched(true);
    setError("");
    setOpen(true);
  }

  function closeModal() {
    setOpen(false);
    setEditingId(null);
    setError("");
  }

  function handleTitleChange(title: string) {
    setForm((current) => ({
      ...current,
      title,
      slug: slugTouched ? current.slug : slugify(title),
    }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(editingId ? `/api/admin/gallery/${editingId}` : "/api/admin/gallery", {
        method: editingId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await response.json();

      if (!response.ok) {
        setError(data.error ?? "Unable to save gallery section.");
        return;
      }

      closeModal();
      setToast(editingId ? "Gallery section updated." : "Gallery section created.");
      if (!editingId && data.section?.id) {
        setSections((current) => [...current, data.section]);
        setExpandedId(data.section.id);
      } else {
        await refreshSections();
      }
    } catch {
      setError("Unable to save gallery section right now.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteSection(section: GallerySectionItem) {
    const confirmed = window.confirm(
      `Delete "${section.title}" and all ${section.photos.length} photos?\n\nThis cannot be undone.`,
    );
    if (!confirmed) return;

    const response = await fetch(`/api/admin/gallery/${section.id}`, { method: "DELETE" });
    const data = await response.json();
    if (!response.ok) {
      setToast(data.error ?? "Unable to delete gallery section.");
      return;
    }

    setToast("Gallery section deleted.");
    if (expandedId === section.id) setExpandedId(null);
    await refreshSections();
  }

  async function handleUploadPhotos(sectionId: string, files: File[]) {
    if (files.length === 0) return;

    setUploadingSectionId(sectionId);
    setError("");

    try {
      const formData = new FormData();
      for (const file of files) {
        formData.append("photos", file);
      }

      const response = await fetch(`/api/admin/gallery/${sectionId}/photos`, {
        method: "POST",
        body: formData,
      });
      const data = await response.json();

      if (!response.ok) {
        setToast(data.error ?? "Upload failed.");
        return;
      }

      setSections((current) =>
        current.map((section) => (section.id === sectionId ? data.section : section)),
      );

      const addedCount = data.addedCount ?? files.length;
      if (data.errors?.length) {
        setToast(
          addedCount === 1
            ? "1 photo added. Some files could not be uploaded."
            : `${addedCount} photos added. Some files could not be uploaded.`,
        );
      } else {
        setToast(addedCount === 1 ? "Photo added." : `${addedCount} photos added.`);
      }
    } catch {
      setToast("Upload failed.");
    } finally {
      setUploadingSectionId(null);
    }
  }

  async function openAssetPicker(sectionId: string) {
    setAssetPickerSectionId(sectionId);
    setAssetPickerLoading(true);

    try {
      const listing = await fetchAssetListing();
      setAssetPickerListing(listing);
      setAssetPickerKey((value) => value + 1);
    } catch (uploadError) {
      setToast(uploadError instanceof Error ? uploadError.message : "Unable to open asset library.");
      setAssetPickerSectionId(null);
    } finally {
      setAssetPickerLoading(false);
    }
  }

  async function fetchAssetListing() {
    const response = await fetch("/api/admin/assets?path=gallery");
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error ?? "Unable to load asset library.");
    }
    return data.listing as AssetDirectoryListing;
  }

  async function handleAssetSelect(publicPaths: string[]) {
    if (!assetPickerSectionId) return;

    if (publicPaths.length === 0) return;

    const response = await fetch(`/api/admin/gallery/${assetPickerSectionId}/photos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(publicPaths.length === 1 ? { assetPath: publicPaths[0] } : { assetPaths: publicPaths }),
    });
    const data = await response.json();

    if (!response.ok) {
      setToast(data.error ?? "Unable to add photo from assets.");
      return;
    }

    setSections((current) =>
      current.map((section) => (section.id === assetPickerSectionId ? data.section : section)),
    );

    const addedCount = data.addedCount ?? publicPaths.length;
    if (data.errors?.length) {
      setToast(
        addedCount === 1
          ? "1 photo added from assets. Some selections could not be added."
          : `${addedCount} photos added from assets. Some selections could not be added.`,
      );
    } else {
      setToast(addedCount === 1 ? "Photo added from assets." : `${addedCount} photos added from assets.`);
    }
    setAssetPickerSectionId(null);
  }

  async function handleDeletePhoto(sectionId: string, photoId: string) {
    const confirmed = window.confirm("Remove this photo from the gallery section?");
    if (!confirmed) return;

    const response = await fetch(`/api/admin/gallery/${sectionId}/photos/${photoId}`, {
      method: "DELETE",
    });
    const data = await response.json();

    if (!response.ok) {
      setToast(data.error ?? "Unable to delete photo.");
      return;
    }

    setSections((current) =>
      current.map((section) => (section.id === sectionId ? data.section : section)),
    );
    setToast("Photo removed.");
  }

  return (
    <>
      <section className="rounded-2xl border border-[#e0eaed] bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#ececec] px-6 py-5">
          <div>
            <h2 className="m-0 text-lg font-bold text-primary-dark">Gallery</h2>
            <p className="mt-1 mb-0 text-sm text-[#667]">{sections.length} sections</p>
          </div>
          <button
            type="button"
            onClick={openCreate}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:brightness-105"
          >
            <HiOutlinePlus size={18} aria-hidden />
            Add section
          </button>
        </div>

        {toast ? (
          <div className="border-b border-[#ececec] px-6 py-3">
            <p className="m-0 text-sm font-medium text-primary-dark" role="status">
              {toast}
            </p>
          </div>
        ) : null}

        {sections.length === 0 ? (
          <p className="px-6 py-8 text-sm text-[#667]">
            No gallery sections yet. Create a section (for example &quot;Lab events&quot; or &quot;Facilities&quot;), then add photos to it.
          </p>
        ) : (
          <ul className="m-0 list-none p-0">
            {sections.map((section) => {
              const expanded = expandedId === section.id;

              return (
                <li key={section.id} className="border-b border-[#ececec] last:border-b-0">
                  <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4">
                    <button
                      type="button"
                      onClick={() => setExpandedId(expanded ? null : section.id)}
                      className="flex min-w-0 flex-1 cursor-pointer items-center gap-3 border-0 bg-transparent p-0 text-left"
                    >
                      {expanded ? (
                        <HiOutlineChevronUp size={18} className="shrink-0 text-primary" aria-hidden />
                      ) : (
                        <HiOutlineChevronDown size={18} className="shrink-0 text-[#667]" aria-hidden />
                      )}
                      <span className="min-w-0">
                        <span className="block truncate text-base font-semibold text-primary-dark">{section.title}</span>
                        <span className="mt-0.5 block text-xs text-[#667]">
                          {section.photos.length} photos · order {section.sortOrder}
                        </span>
                      </span>
                    </button>

                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                          section.isPublished
                            ? "bg-primary-light text-primary-dark"
                            : "bg-[#f0f0f0] text-[#667]"
                        }`}
                      >
                        {section.isPublished ? "Published" : "Draft"}
                      </span>
                      <button
                        type="button"
                        onClick={() => openEdit(section)}
                        className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
                      >
                        <HiOutlinePencilSquare size={16} aria-hidden />
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => void handleDeleteSection(section)}
                        className="inline-flex items-center gap-1 text-sm font-semibold text-red-700 hover:underline"
                      >
                        <HiOutlineTrash size={16} aria-hidden />
                        Delete
                      </button>
                    </div>
                  </div>

                  {expanded ? (
                    <div className="border-t border-[#f0f0f0] bg-[#f9fbfc] px-6 py-5">
                      {section.description ? (
                        <p className="mt-0 mb-4 text-sm leading-relaxed text-[#555]">{section.description}</p>
                      ) : null}

                      <div className="mb-4 flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => uploadInputRefs.current[section.id]?.click()}
                          disabled={uploadingSectionId === section.id}
                          className="rounded-xl border border-primary/25 px-4 py-2 text-sm font-semibold text-primary-dark transition hover:bg-primary-light disabled:opacity-60"
                        >
                          {uploadingSectionId === section.id ? "Uploading…" : "Upload photos"}
                        </button>
                        <button
                          type="button"
                          onClick={() => void openAssetPicker(section.id)}
                          disabled={assetPickerLoading}
                          className="inline-flex items-center gap-2 rounded-xl border border-primary/25 px-4 py-2 text-sm font-semibold text-primary-dark transition hover:bg-primary-light disabled:opacity-60"
                        >
                          <HiOutlineFolderOpen size={16} aria-hidden />
                          Choose from assets
                        </button>
                        <input
                          ref={(node) => {
                            uploadInputRefs.current[section.id] = node;
                          }}
                          type="file"
                          accept="image/jpeg,image/png,image/webp"
                          multiple
                          className="hidden"
                          onChange={(event) => {
                            const files = event.target.files ? Array.from(event.target.files) : [];
                            if (files.length > 0) void handleUploadPhotos(section.id, files);
                            event.target.value = "";
                          }}
                        />
                      </div>

                      {section.photos.length === 0 ? (
                        <p className="m-0 flex items-center gap-2 text-sm text-[#667]">
                          <HiOutlinePhoto size={16} aria-hidden />
                          No photos in this section yet.
                        </p>
                      ) : (
                        <ul className="m-0 grid list-none gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                          {section.photos.map((photo) => (
                            <li
                              key={photo.id}
                              className="overflow-hidden rounded-xl border border-[#e0eaed] bg-white shadow-sm"
                            >
                              <div className="relative aspect-[4/3] w-full bg-[#f7fbfc]">
                                <Image
                                  src={photo.imageUrl}
                                  alt={photo.caption ?? section.title}
                                  fill
                                  className="object-cover"
                                  sizes="(max-width: 640px) 50vw, 240px"
                                  unoptimized
                                />
                              </div>
                              <div className="flex items-center justify-between gap-2 px-3 py-2">
                                <p className="m-0 min-w-0 truncate text-xs text-[#667]">
                                  {photo.caption || "No caption"}
                                </p>
                                <button
                                  type="button"
                                  onClick={() => void handleDeletePhoto(section.id, photo.id)}
                                  className="shrink-0 text-xs font-semibold text-red-700 hover:underline"
                                >
                                  Remove
                                </button>
                              </div>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ) : null}
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <Modal
        open={open}
        onClose={closeModal}
        title={editingId ? "Edit gallery section" : "Create gallery section"}
        description="Each section has a title and can hold multiple photos. Publish sections to show them on the public gallery page."
        panelClassName="max-w-xl"
      >
        <form onSubmit={handleSubmit}>
          {error ? <ModalAlert message={error} tone="error" /> : null}

          <div className="grid gap-4">
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-[#444]">Title</span>
              <input
                type="text"
                required
                value={form.title}
                onChange={(event) => handleTitleChange(event.target.value)}
                className={inputClassName}
              />
            </label>

            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-[#444]">Slug</span>
              <input
                type="text"
                required
                value={form.slug}
                onChange={(event) => {
                  setSlugTouched(true);
                  setForm((current) => ({ ...current, slug: event.target.value }));
                }}
                className={inputClassName}
              />
            </label>

            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-[#444]">Description (optional)</span>
              <textarea
                rows={3}
                value={form.description}
                onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
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
              <p className="mt-1.5 mb-0 text-xs text-[#667]">Lower numbers appear first on the gallery page.</p>
            </label>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={form.isPublished}
                onChange={(event) => setForm((current) => ({ ...current, isPublished: event.target.checked }))}
              />
              <span className="text-sm text-[#444]">Published on public gallery page</span>
            </label>
          </div>

          <ModalActions
            onCancel={closeModal}
            submitLabel={editingId ? "Save section" : "Create section"}
            loading={loading}
            loadingLabel="Saving…"
          />
        </form>
      </Modal>

      <AssetImagePicker
        key={assetPickerKey}
        open={assetPickerSectionId !== null}
        initialListing={assetPickerListing}
        multiple
        onClose={() => setAssetPickerSectionId(null)}
        onSelect={handleAssetSelect}
      />
    </>
  );
}
