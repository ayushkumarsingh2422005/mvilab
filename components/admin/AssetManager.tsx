"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  HiOutlineClipboardDocument,
  HiOutlineFolderOpen,
  HiOutlineFolderPlus,
  HiOutlinePhoto,
  HiOutlinePlus,
  HiOutlineTrash,
} from "react-icons/hi2";
import { Modal, ModalActions, ModalAlert } from "@/components/ui/Modal";
import type { AssetDirectoryListing, AssetEntry } from "@/lib/assets/list";

type AssetManagerProps = {
  initialListing: AssetDirectoryListing;
};

const inputClassName =
  "w-full rounded-lg border border-[#d8d8d8] px-3 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15";

function formatBytes(size?: number) {
  if (size === undefined) return "—";
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(value?: string) {
  if (!value) return "—";
  return new Date(value).toLocaleString();
}

export function AssetManager({ initialListing }: AssetManagerProps) {
  const [listing, setListing] = useState(initialListing);
  const [currentPath, setCurrentPath] = useState(initialListing.path);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");
  const [folderOpen, setFolderOpen] = useState(false);
  const [folderName, setFolderName] = useState("");
  const [folderError, setFolderError] = useState("");
  const [uploading, setUploading] = useState(false);
  const uploadInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(""), 2400);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const loadDirectory = useCallback(async (path: string) => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`/api/admin/assets?path=${encodeURIComponent(path)}`);
      const data = await response.json();

      if (!response.ok) {
        setError(data.error ?? "Unable to load folder.");
        return;
      }

      setListing(data.listing);
      setCurrentPath(data.listing.path);
    } catch {
      setError("Unable to load folder right now.");
    } finally {
      setLoading(false);
    }
  }, []);

  async function copyPath(publicPath: string) {
    try {
      await navigator.clipboard.writeText(publicPath);
      setToast(`Copied ${publicPath}`);
    } catch {
      setToast("Could not copy path.");
    }
  }

  async function handleCreateFolder(event: React.FormEvent) {
    event.preventDefault();
    setFolderError("");

    const response = await fetch("/api/admin/assets/folders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ parentPath: currentPath, name: folderName }),
    });

    const data = await response.json();
    if (!response.ok) {
      setFolderError(data.error ?? "Unable to create folder.");
      return;
    }

    setFolderOpen(false);
    setFolderName("");
    setToast(`Folder ${data.folder.publicPath} created.`);
    await loadDirectory(currentPath);
  }

  async function handleUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const files = event.target.files;
    if (!files?.length) return;

    setUploading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("path", currentPath);
      for (const file of Array.from(files)) {
        formData.append("files", file);
      }

      const response = await fetch("/api/admin/assets/upload", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();

      if (!response.ok) {
        setError(data.error ?? "Upload failed.");
        return;
      }

      const count = data.files?.length ?? 0;
      setToast(count === 1 ? "File uploaded." : `${count} files uploaded.`);
      if (data.errors?.length) {
        setError(data.errors.join(" "));
      }

      await loadDirectory(currentPath);
    } catch {
      setError("Upload failed.");
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  }

  async function handleDelete(entry: AssetEntry) {
    const label = entry.kind === "folder" ? "folder" : "file";
    const confirmed = window.confirm(`Delete this ${label}?\n\n${entry.publicPath}`);
    if (!confirmed) return;

    setError("");

    const response = await fetch("/api/admin/assets/delete", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path: entry.path }),
    });
    const data = await response.json();

    if (!response.ok) {
      setError(data.error ?? "Unable to delete asset.");
      return;
    }

    setToast(`${entry.name} deleted.`);
    await loadDirectory(currentPath);
  }

  function openFolder(entry: AssetEntry) {
    if (entry.kind !== "folder") return;
    void loadDirectory(entry.path);
  }

  return (
    <div className="space-y-5">
      {toast ? (
        <div className="rounded-xl border border-primary/20 bg-primary-light px-4 py-3 text-sm font-medium text-primary-dark">
          {toast}
        </div>
      ) : null}

      {error ? <ModalAlert message={error} tone="error" /> : null}

      <section className="rounded-2xl border border-[#e0eaed] bg-white shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[#ececec] px-6 py-5">
          <div className="min-w-0">
            <p className="m-0 text-xs font-semibold uppercase tracking-wide text-primary">Asset library</p>
            <nav aria-label="Asset folders" className="mt-2 flex flex-wrap items-center gap-1 text-sm">
              {listing.breadcrumbs.map((crumb, index) => {
                const isLast = index === listing.breadcrumbs.length - 1;
                return (
                  <span key={crumb.path || "root"} className="inline-flex items-center gap-1">
                    {index > 0 ? <span className="text-[#999]">/</span> : null}
                    {isLast ? (
                      <span className="font-semibold text-primary-dark">{crumb.label}</span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => void loadDirectory(crumb.path)}
                        className="cursor-pointer border-0 bg-transparent p-0 font-medium text-primary hover:underline"
                      >
                        {crumb.label}
                      </button>
                    )}
                  </span>
                );
              })}
            </nav>
            <p className="mt-2 mb-0 font-mono text-xs text-[#667]">{listing.publicPath}</p>
            {listing.description ? (
              <p className="mt-2 mb-0 max-w-3xl text-sm text-[#667]">{listing.description}</p>
            ) : null}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {listing.writable ? (
              <>
                <button
                  type="button"
                  onClick={() => {
                    setFolderError("");
                    setFolderName("");
                    setFolderOpen(true);
                  }}
                  className="inline-flex items-center gap-2 rounded-xl border border-primary/25 px-4 py-2.5 text-sm font-semibold text-primary-dark transition hover:bg-primary-light"
                >
                  <HiOutlineFolderPlus size={18} aria-hidden />
                  New folder
                </button>
                <button
                  type="button"
                  onClick={() => uploadInputRef.current?.click()}
                  disabled={uploading}
                  className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:brightness-105 disabled:opacity-60"
                >
                  <HiOutlinePlus size={18} aria-hidden />
                  {uploading ? "Uploading…" : "Upload files"}
                </button>
                <input
                  ref={uploadInputRef}
                  type="file"
                  multiple
                  className="hidden"
                  onChange={handleUpload}
                />
              </>
            ) : (
              <span className="rounded-full bg-[#f7fbfc] px-3 py-1 text-xs font-semibold text-[#667]">
                View only
              </span>
            )}
          </div>
        </div>

        <div className="px-6 py-5">
          {loading ? (
            <p className="m-0 text-sm text-[#667]">Loading…</p>
          ) : listing.entries.length === 0 ? (
            <div className="rounded-xl border border-dashed border-[#dce8eb] bg-[#f7fbfc] px-6 py-10 text-center">
              <HiOutlineFolderOpen size={32} className="mx-auto text-primary" aria-hidden />
              <p className="mt-3 mb-0 text-sm font-medium text-primary-dark">This folder is empty</p>
              <p className="mt-1 mb-0 text-sm text-[#667]">
                {listing.writable
                  ? "Create a subfolder or upload files to use them anywhere on the site."
                  : "Student profile photos appear here when uploaded from the portal."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-[#ececec] text-[#666]">
                    <th className="py-2 pr-4 font-medium">Preview</th>
                    <th className="py-2 pr-4 font-medium">Name</th>
                    <th className="py-2 pr-4 font-medium">Public path</th>
                    <th className="py-2 pr-4 font-medium">Size</th>
                    <th className="py-2 pr-4 font-medium">Modified</th>
                    <th className="py-2 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {listing.entries.map((entry) => (
                    <tr key={entry.path} className="border-b border-[#f0f0f0] last:border-b-0">
                      <td className="py-3 pr-4">
                        {entry.kind === "folder" ? (
                          <span className="inline-flex h-14 w-20 items-center justify-center rounded-lg border border-[#ececec] bg-[#f7fbfc] text-primary">
                            <HiOutlineFolderOpen size={24} aria-hidden />
                          </span>
                        ) : entry.isImage ? (
                          <div className="relative aspect-video w-20 overflow-hidden rounded-lg border border-[#ececec] bg-[#f7fbfc]">
                            <Image src={entry.publicPath} alt="" fill className="object-cover" sizes="80px" unoptimized />
                          </div>
                        ) : (
                          <span className="inline-flex h-14 w-20 items-center justify-center rounded-lg border border-[#ececec] bg-[#f7fbfc] text-[#667]">
                            <HiOutlinePhoto size={22} aria-hidden />
                          </span>
                        )}
                      </td>
                      <td className="py-3 pr-4">
                        {entry.kind === "folder" ? (
                          <button
                            type="button"
                            onClick={() => openFolder(entry)}
                            className="cursor-pointer border-0 bg-transparent p-0 text-left font-semibold text-primary-dark hover:text-primary hover:underline"
                          >
                            {entry.name}
                          </button>
                        ) : (
                          <p className="m-0 font-semibold text-primary-dark">{entry.name}</p>
                        )}
                        {entry.description ? (
                          <p className="mt-1 mb-0 text-xs text-[#667]">{entry.description}</p>
                        ) : null}
                      </td>
                      <td className="py-3 pr-4">
                        <code className="rounded bg-[#f7fbfc] px-2 py-1 text-xs text-[#445]">{entry.publicPath}</code>
                      </td>
                      <td className="py-3 pr-4 text-[#667]">{entry.kind === "file" ? formatBytes(entry.size) : "—"}</td>
                      <td className="py-3 pr-4 text-[#667]">{entry.kind === "file" ? formatDate(entry.modifiedAt) : "—"}</td>
                      <td className="py-3">
                        <div className="flex flex-wrap items-center gap-3">
                          <button
                            type="button"
                            onClick={() => void copyPath(entry.publicPath)}
                            className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
                          >
                            <HiOutlineClipboardDocument size={16} aria-hidden />
                            Copy path
                          </button>
                          {entry.kind === "file" ? (
                            <a
                              href={entry.publicPath}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm font-semibold text-primary hover:underline"
                            >
                              Open
                            </a>
                          ) : null}
                          {listing.writable ? (
                            <button
                              type="button"
                              onClick={() => void handleDelete(entry)}
                              className="inline-flex items-center gap-1 text-sm font-semibold text-red-700 hover:underline"
                            >
                              <HiOutlineTrash size={16} aria-hidden />
                              Delete
                            </button>
                          ) : null}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>

      <section className="rounded-2xl border border-[#e0eaed] bg-[#f7fbfc] px-6 py-5">
        <h2 className="m-0 text-sm font-bold text-primary-dark">How paths work</h2>
        <ul className="mt-3 mb-0 space-y-2 pl-5 text-sm leading-relaxed text-[#555]">
          <li>
            Every file lives under <code className="rounded bg-white px-1.5 py-0.5 text-xs">/uploads/</code> and can be
            referenced anywhere on the site with its public path.
          </li>
          <li>
            <strong>avatars</strong> is read-only here — student photos are uploaded from the portal. Browse and copy
            paths, but do not upload or delete in that folder.
          </li>
          <li>
            Use <strong>research</strong> and <strong>news</strong> for paper thumbnails and news images. Upload
            files there, then copy the public path into your content.
          </li>
          <li>Create more custom folders (for example <code className="rounded bg-white px-1.5 py-0.5 text-xs">site/hero</code>) and upload images or documents to use in pages and content.</li>
        </ul>
      </section>

      <Modal
        open={folderOpen}
        onClose={() => setFolderOpen(false)}
        title="Create folder"
        description={`New folder inside ${listing.publicPath}`}
      >
        <form onSubmit={handleCreateFolder}>
          {folderError ? <ModalAlert message={folderError} tone="error" /> : null}
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-[#444]">Folder name</span>
            <input
              type="text"
              required
              value={folderName}
              onChange={(event) => setFolderName(event.target.value)}
              placeholder="site"
              className={inputClassName}
            />
          </label>
          <ModalActions onCancel={() => setFolderOpen(false)} submitLabel="Create folder" />
        </form>
      </Modal>
    </div>
  );
}
