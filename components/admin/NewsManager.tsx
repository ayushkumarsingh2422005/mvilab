"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  HiOutlineDocumentText,
  HiOutlineFolderOpen,
  HiOutlinePencilSquare,
  HiOutlinePlus,
  HiOutlineTrash,
} from "react-icons/hi2";
import { AssetImagePicker } from "@/components/admin/AssetImagePicker";
import { Modal, ModalActions, ModalAlert } from "@/components/ui/Modal";
import type { AssetDirectoryListing } from "@/lib/assets/list";
import { NEWS_CATEGORIES, type NewsCategory } from "@/lib/news-categories";
import type { NewsArticleItem } from "@/lib/news";

type NewsFormState = {
  title: string;
  slug: string;
  excerpt: string;
  category: NewsCategory;
  publishedAt: string;
  isPublished: boolean;
  isNew: boolean;
};

const inputClassName =
  "w-full rounded-lg border border-[#d8d8d8] px-3 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15";

function emptyForm(): NewsFormState {
  return {
    title: "",
    slug: "",
    excerpt: "",
    category: "General",
    publishedAt: new Date().toISOString().slice(0, 10),
    isPublished: false,
    isNew: false,
  };
}

function formFromArticle(article: NewsArticleItem): NewsFormState {
  return {
    title: article.title,
    slug: article.slug,
    excerpt: article.excerpt,
    category: article.category,
    publishedAt: article.publishedAt.slice(0, 10),
    isPublished: article.isPublished,
    isNew: article.isNew,
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

type NewsManagerProps = {
  initialArticles: NewsArticleItem[];
};

export function NewsManager({ initialArticles }: NewsManagerProps) {
  const [articles, setArticles] = useState(initialArticles);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<NewsFormState>(emptyForm);
  const [slugTouched, setSlugTouched] = useState(false);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");
  const [loading, setLoading] = useState(false);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState("");
  const [currentThumbnailUrl, setCurrentThumbnailUrl] = useState("");
  const [selectedAssetPath, setSelectedAssetPath] = useState("");
  const [assetPickerOpen, setAssetPickerOpen] = useState(false);
  const [assetPickerListing, setAssetPickerListing] = useState<AssetDirectoryListing | null>(null);
  const [assetPickerLoading, setAssetPickerLoading] = useState(false);
  const [assetPickerKey, setAssetPickerKey] = useState(0);
  const thumbnailInputRef = useRef<HTMLInputElement>(null);

  async function fetchAssetListing(): Promise<AssetDirectoryListing> {
    const response = await fetch("/api/admin/assets?path=news");
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error ?? "Unable to load asset library.");
    }
    return data.listing as AssetDirectoryListing;
  }

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(""), 4000);
    return () => window.clearTimeout(timer);
  }, [toast]);

  function resetThumbnailState() {
    if (thumbnailPreview.startsWith("blob:")) {
      URL.revokeObjectURL(thumbnailPreview);
    }
    setThumbnailFile(null);
    setThumbnailPreview("");
    setCurrentThumbnailUrl("");
    setSelectedAssetPath("");
  }

  async function refreshArticles() {
    const response = await fetch("/api/admin/news");
    const data = await response.json();
    if (response.ok) {
      setArticles(data.articles ?? []);
    }
  }

  function openCreate() {
    setEditingId(null);
    setForm(emptyForm());
    setSlugTouched(false);
    resetThumbnailState();
    setError("");
    setOpen(true);
  }

  function openEdit(article: NewsArticleItem) {
    setEditingId(article.id);
    setForm(formFromArticle(article));
    setSlugTouched(true);
    resetThumbnailState();
    setCurrentThumbnailUrl(article.thumbnailUrl ?? "");
    setError("");
    setOpen(true);
  }

  function closeModal() {
    setOpen(false);
    setEditingId(null);
    setForm(emptyForm());
    resetThumbnailState();
    setError("");
  }

  function handleTitleChange(title: string) {
    setForm((current) => ({
      ...current,
      title,
      slug: slugTouched ? current.slug : slugify(title),
    }));
  }

  async function uploadThumbnail(articleId: string, file: File) {
    const formData = new FormData();
    formData.append("thumbnail", file);

    const response = await fetch(`/api/admin/news/${articleId}/thumbnail`, {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error ?? "Unable to upload thumbnail.");
    }
  }

  async function assignThumbnailFromAsset(articleId: string, assetPath: string) {
    const response = await fetch(`/api/admin/news/${articleId}/thumbnail`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ assetPath }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error ?? "Unable to use selected asset.");
    }
  }

  function handleThumbnailChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    if (thumbnailPreview.startsWith("blob:")) {
      URL.revokeObjectURL(thumbnailPreview);
    }

    setThumbnailFile(file);
    setSelectedAssetPath("");
    setThumbnailPreview(URL.createObjectURL(file));
    event.target.value = "";
  }

  function handleAssetSelect(publicPath: string) {
    if (thumbnailPreview.startsWith("blob:")) {
      URL.revokeObjectURL(thumbnailPreview);
    }

    setThumbnailFile(null);
    setSelectedAssetPath(publicPath);
    setThumbnailPreview("");
  }

  async function openAssetPicker() {
    setAssetPickerLoading(true);
    setError("");

    try {
      const listing = await fetchAssetListing();
      setAssetPickerListing(listing);
      setAssetPickerKey((current) => current + 1);
      setAssetPickerOpen(true);
    } catch (pickerError) {
      setError(pickerError instanceof Error ? pickerError.message : "Unable to open asset library.");
    } finally {
      setAssetPickerLoading(false);
    }
  }

  function thumbnailDisplayUrl() {
    if (thumbnailPreview) return thumbnailPreview;
    if (selectedAssetPath) return selectedAssetPath;
    return currentThumbnailUrl;
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(editingId ? `/api/admin/news/${editingId}` : "/api/admin/news", {
        method: editingId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await response.json();

      if (!response.ok) {
        setError(data.error ?? "Unable to save news article.");
        return;
      }

      const articleId = editingId ?? data.article.id;

      if (thumbnailFile) {
        try {
          await uploadThumbnail(articleId, thumbnailFile);
        } catch (uploadError) {
          setError(uploadError instanceof Error ? uploadError.message : "Article saved, but thumbnail upload failed.");
          await refreshArticles();
          return;
        }
      } else if (selectedAssetPath) {
        try {
          await assignThumbnailFromAsset(articleId, selectedAssetPath);
        } catch (assetError) {
          setError(assetError instanceof Error ? assetError.message : "Article saved, but thumbnail selection failed.");
          await refreshArticles();
          return;
        }
      }

      closeModal();
      setToast(editingId ? "News article updated." : "News article created.");
      await refreshArticles();
    } catch {
      setError("Unable to save news article right now.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(article: NewsArticleItem) {
    const confirmed = window.confirm(`Delete "${article.title}"? This cannot be undone.`);
    if (!confirmed) return;

    const response = await fetch(`/api/admin/news/${article.id}`, { method: "DELETE" });
    const data = await response.json();
    if (!response.ok) {
      setToast(data.error ?? "Unable to delete news article.");
      return;
    }

    setToast("News article deleted.");
    await refreshArticles();
  }

  return (
    <>
      <section className="rounded-2xl border border-[#e0eaed] bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#ececec] px-6 py-5">
          <div>
            <h2 className="m-0 text-lg font-bold text-primary-dark">News</h2>
            <p className="mt-1 mb-0 text-sm text-[#667]">{articles.length} articles</p>
          </div>
          <button
            type="button"
            onClick={openCreate}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:brightness-105"
          >
            <HiOutlinePlus size={18} aria-hidden />
            Add news
          </button>
        </div>

        {toast ? (
          <div className="border-b border-[#ececec] px-6 py-3">
            <p className="m-0 text-sm font-medium text-primary-dark" role="status">
              {toast}
            </p>
          </div>
        ) : null}

        {articles.length === 0 ? (
          <p className="px-6 py-8 text-sm text-[#667]">
            No news articles yet. Create one, then use <strong>Edit page</strong> to design the full article in the visual editor.
          </p>
        ) : (
          <div className="overflow-x-auto px-6 py-4">
            <table className="min-w-full border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-[#ececec] text-[#666]">
                  <th className="py-2 pr-4 font-medium">Thumbnail</th>
                  <th className="py-2 pr-4 font-medium">Title</th>
                  <th className="py-2 pr-4 font-medium">Slug</th>
                  <th className="py-2 pr-4 font-medium">Category</th>
                  <th className="py-2 pr-4 font-medium">Status</th>
                  <th className="py-2 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {articles.map((article) => (
                  <tr key={article.id} className="border-b border-[#f0f0f0] last:border-b-0">
                    <td className="py-3 pr-4">
                      <div className="relative aspect-video w-24 overflow-hidden rounded-lg border border-[#ececec] bg-[#f7fbfc]">
                        {article.thumbnailUrl ? (
                          <Image src={article.thumbnailUrl} alt="" fill className="object-cover" sizes="96px" unoptimized />
                        ) : (
                          <span className="flex h-full w-full items-center justify-center text-[0.65rem] text-[#667]">No image</span>
                        )}
                      </div>
                    </td>
                    <td className="max-w-xs py-3 pr-4">
                      <p className="m-0 font-semibold text-primary-dark">{article.title}</p>
                      <p className="mt-1 mb-0 line-clamp-2 text-xs text-[#667]">{article.excerpt}</p>
                    </td>
                    <td className="py-3 pr-4">
                      <code className="rounded bg-[#f7fbfc] px-2 py-1 text-xs text-[#445]">{article.slug}</code>
                    </td>
                    <td className="py-3 pr-4">{article.category}</td>
                    <td className="py-3 pr-4">
                      <div className="flex flex-wrap gap-1.5">
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                            article.isPublished
                              ? "bg-primary-light text-primary-dark"
                              : "bg-[#f0f0f0] text-[#667]"
                          }`}
                        >
                          {article.isPublished ? "Published" : "Draft"}
                        </span>
                        {article.isNew ? (
                          <span className="rounded-full bg-primary px-2.5 py-0.5 text-xs font-semibold text-white">
                            New
                          </span>
                        ) : null}
                      </div>
                    </td>
                    <td className="py-3">
                      <div className="flex flex-wrap items-center gap-3">
                        <Link
                          href={`/admin/news/${article.id}/editor`}
                          className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
                        >
                          <HiOutlineDocumentText size={16} aria-hidden />
                          Edit page
                        </Link>
                        <button
                          type="button"
                          onClick={() => openEdit(article)}
                          className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
                        >
                          <HiOutlinePencilSquare size={16} aria-hidden />
                          Settings
                        </button>
                        <button
                          type="button"
                          onClick={() => void handleDelete(article)}
                          className="inline-flex items-center gap-1 text-sm font-semibold text-red-700 hover:underline"
                        >
                          <HiOutlineTrash size={16} aria-hidden />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <Modal
        open={open}
        onClose={closeModal}
        title={editingId ? "Edit news settings" : "Create news article"}
        description="Set title, slug, excerpt, and publish options. After saving, use Edit page to design the full article in the visual editor."
        panelClassName="max-w-2xl"
      >
        <form onSubmit={handleSubmit}>
          {error ? <ModalAlert message={error} tone="error" /> : null}

          <div className="grid max-h-[70vh] gap-4 overflow-y-auto pr-1 sm:grid-cols-2">
            <label className="block sm:col-span-2">
              <span className="mb-1.5 block text-sm font-medium text-[#444]">Title</span>
              <input
                type="text"
                required
                value={form.title}
                onChange={(event) => handleTitleChange(event.target.value)}
                className={inputClassName}
              />
            </label>

            <label className="block sm:col-span-2">
              <span className="mb-1.5 block text-sm font-medium text-[#444]">Slug</span>
              <input
                type="text"
                required
                value={form.slug}
                onChange={(event) => {
                  setSlugTouched(true);
                  setForm((current) => ({ ...current, slug: event.target.value }));
                }}
                placeholder="portal-launch"
                className={inputClassName}
              />
              <p className="mt-1.5 mb-0 text-xs text-[#667]">Public URL: /news/{form.slug || "your-slug"}</p>
            </label>

            <label className="block sm:col-span-2">
              <span className="mb-1.5 block text-sm font-medium text-[#444]">Excerpt</span>
              <textarea
                rows={3}
                required
                value={form.excerpt}
                onChange={(event) => setForm((current) => ({ ...current, excerpt: event.target.value }))}
                className={inputClassName}
              />
            </label>

            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-[#444]">Category</span>
              <select
                value={form.category}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    category: event.target.value as NewsCategory,
                  }))
                }
                className={inputClassName}
              >
                {NEWS_CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-[#444]">Publish date</span>
              <input
                type="date"
                value={form.publishedAt}
                onChange={(event) => setForm((current) => ({ ...current, publishedAt: event.target.value }))}
                className={inputClassName}
              />
            </label>

            <div className="block sm:col-span-2">
              <span className="mb-1.5 block text-sm font-medium text-[#444]">Thumbnail image</span>
              <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-start">
                <div className="relative aspect-video w-full max-w-xs overflow-hidden rounded-xl border border-[#ececec] bg-[#f7fbfc]">
                  {thumbnailDisplayUrl() ? (
                    <Image
                      src={thumbnailDisplayUrl()}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="320px"
                      unoptimized
                    />
                  ) : (
                    <span className="flex h-full w-full items-center justify-center px-3 text-center text-xs text-[#667]">
                      Optional thumbnail
                    </span>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <input
                    ref={thumbnailInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                    onChange={handleThumbnailChange}
                  />
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => thumbnailInputRef.current?.click()}
                      className="rounded-xl border border-primary/25 px-4 py-2 text-sm font-semibold text-primary-dark transition hover:bg-primary-light"
                    >
                      Upload new image
                    </button>
                    <button
                      type="button"
                      onClick={() => void openAssetPicker()}
                      disabled={assetPickerLoading}
                      className="inline-flex items-center gap-2 rounded-xl border border-primary/25 px-4 py-2 text-sm font-semibold text-primary-dark transition hover:bg-primary-light disabled:opacity-60"
                    >
                      <HiOutlineFolderOpen size={16} aria-hidden />
                      Choose from assets
                    </button>
                  </div>
                  <p className="mt-2 mb-0 text-xs text-[#667]">
                    Upload a new image or pick one from the asset library (news folder). Displayed at 16:9.
                  </p>
                  {selectedAssetPath ? (
                    <p className="mt-2 mb-0 font-mono text-xs text-primary-dark">{selectedAssetPath}</p>
                  ) : null}
                </div>
              </div>
            </div>

            <label className="flex items-center gap-2 sm:col-span-1">
              <input
                type="checkbox"
                checked={form.isPublished}
                onChange={(event) => setForm((current) => ({ ...current, isPublished: event.target.checked }))}
              />
              <span className="text-sm text-[#444]">Published on public site</span>
            </label>

            <label className="flex items-center gap-2 sm:col-span-1">
              <input
                type="checkbox"
                checked={form.isNew}
                onChange={(event) => setForm((current) => ({ ...current, isNew: event.target.checked }))}
              />
              <span className="text-sm text-[#444]">Highlight as new</span>
            </label>
          </div>

          <ModalActions
            onCancel={closeModal}
            submitLabel={editingId ? "Save settings" : "Create article"}
            loading={loading}
            loadingLabel="Saving…"
          />
        </form>
      </Modal>

      <AssetImagePicker
        key={assetPickerKey}
        open={assetPickerOpen}
        initialListing={assetPickerListing}
        onClose={() => setAssetPickerOpen(false)}
        onSelect={handleAssetSelect}
      />
    </>
  );
}
