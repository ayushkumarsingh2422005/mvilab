"use client";

import type { MediaManagerProps } from "@chaibuilder/sdk";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { HiOutlineCloudArrowUp, HiOutlineFolderOpen, HiOutlinePhoto } from "react-icons/hi2";
import type { AssetDirectoryListing, AssetEntry } from "@/lib/assets/list";

const DEFAULT_FOLDER = "news";

function toChaiAsset(publicPath: string) {
  return {
    url: publicPath,
    id: publicPath,
    thumbnailUrl: publicPath,
  };
}

export function ChaiUploadMediaManager({ close, onSelect, mode = "image" }: MediaManagerProps) {
  const [listing, setListing] = useState<AssetDirectoryListing | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [selectedPath, setSelectedPath] = useState("");
  const uploadInputRef = useRef<HTMLInputElement>(null);

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
      setSelectedPath("");
    } catch {
      setError("Unable to load folder right now.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadDirectory(DEFAULT_FOLDER);
  }, [loadDirectory]);

  function pickImage(publicPath: string) {
    onSelect(toChaiAsset(publicPath));
  }

  function handleEntryClick(entry: AssetEntry) {
    if (entry.kind === "folder") {
      void loadDirectory(entry.path);
      return;
    }

    if (!entry.isImage) return;
    setSelectedPath(entry.publicPath);
  }

  function handleEntryDoubleClick(entry: AssetEntry) {
    if (entry.kind !== "file" || !entry.isImage) return;
    pickImage(entry.publicPath);
  }

  async function handleUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const files = event.target.files;
    if (!files?.length || !listing) return;

    setUploading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("path", listing.path);
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

      if (data.errors?.length) {
        setError(data.errors.join(" "));
      }

      await loadDirectory(listing.path);

      const uploaded = data.files?.[0] as { publicPath?: string } | undefined;
      if (uploaded?.publicPath) {
        setSelectedPath(uploaded.publicPath);
      }
    } catch {
      setError("Upload failed.");
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  }

  if (mode !== "image") {
    return (
      <div className="flex max-w-md flex-col gap-4 p-6 text-sm">
        <p className="m-0 text-muted-foreground">
          The MVI Lab media library supports images stored under <code>/uploads/</code>.
        </p>
        <button
          type="button"
          onClick={close}
          className="self-start rounded-md border border-border px-4 py-2 text-sm font-medium transition hover:bg-secondary"
        >
          Close
        </button>
      </div>
    );
  }

  const entries =
    listing?.entries.filter((entry) => entry.kind === "folder" || entry.isImage) ?? [];

  return (
    <div className="flex h-[min(80vh,720px)] w-[min(100vw-2rem,56rem)] flex-col">
      <div className="border-b border-border px-4 py-3">
        <p className="m-0 text-base font-semibold text-foreground">MVI Lab media library</p>
        <p className="mt-1 mb-0 text-sm text-muted-foreground">
          Browse or upload images from <code className="text-xs">/uploads/</code>. Files saved here are served on the site.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-3">
        {listing ? (
          <nav aria-label="Asset folders" className="flex min-w-0 flex-wrap items-center gap-1 text-sm">
            {listing.breadcrumbs.map((crumb, index) => {
              const isLast = index === listing.breadcrumbs.length - 1;
              return (
                <span key={crumb.path || "root"} className="inline-flex items-center gap-1">
                  {index > 0 ? <span className="text-muted-foreground">/</span> : null}
                  {isLast ? (
                    <span className="font-semibold text-foreground">{crumb.label}</span>
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
        ) : (
          <span className="text-sm text-muted-foreground">Loading folders…</span>
        )}

        {listing?.writable ? (
          <>
            <button
              type="button"
              onClick={() => uploadInputRef.current?.click()}
              disabled={uploading}
              className="inline-flex shrink-0 items-center gap-2 rounded-md bg-secondary px-3 py-2 text-sm font-semibold text-secondary-foreground transition hover:bg-secondary/80 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <HiOutlineCloudArrowUp size={16} aria-hidden />
              {uploading ? "Uploading…" : "Upload image"}
            </button>
            <input
              ref={uploadInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
              multiple
              className="hidden"
              onChange={(event) => void handleUpload(event)}
            />
          </>
        ) : null}
      </div>

      {error ? (
        <p className="mx-4 mt-3 mb-0 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      ) : null}

      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
        {loading ? (
          <p className="m-0 py-8 text-center text-sm text-muted-foreground">Loading…</p>
        ) : entries.length === 0 ? (
          <p className="m-0 py-8 text-center text-sm text-muted-foreground">
            No images in this folder yet. Upload one to use it in the editor.
          </p>
        ) : (
          <ul className="m-0 grid list-none gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {entries.map((entry) => {
              const isSelected = entry.kind === "file" && entry.publicPath === selectedPath;

              return (
                <li key={entry.path}>
                  <button
                    type="button"
                    onClick={() => handleEntryClick(entry)}
                    onDoubleClick={() => handleEntryDoubleClick(entry)}
                    className={[
                      "flex w-full cursor-pointer flex-col overflow-hidden rounded-lg border bg-background text-left transition",
                      isSelected
                        ? "border-primary ring-2 ring-primary/20"
                        : "border-border hover:border-primary/30 hover:shadow-sm",
                    ].join(" ")}
                  >
                    <div className="relative aspect-video w-full bg-muted/40">
                      {entry.kind === "folder" ? (
                        <span className="flex h-full w-full items-center justify-center text-primary">
                          <HiOutlineFolderOpen size={28} aria-hidden />
                        </span>
                      ) : (
                        <Image
                          src={entry.publicPath}
                          alt=""
                          fill
                          className="object-cover"
                          sizes="(max-width: 640px) 50vw, 220px"
                          unoptimized
                        />
                      )}
                    </div>
                    <div className="px-3 py-2">
                      <p className="m-0 truncate text-sm font-semibold text-foreground">{entry.name}</p>
                      {entry.kind === "folder" && entry.description ? (
                        <p className="mt-1 mb-0 line-clamp-2 text-xs text-muted-foreground">{entry.description}</p>
                      ) : (
                        <p className="mt-1 mb-0 truncate font-mono text-[0.68rem] text-muted-foreground">
                          {entry.publicPath}
                        </p>
                      )}
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border px-4 py-3">
        {selectedPath ? (
          <p className="m-0 min-w-0 truncate text-sm text-muted-foreground">
            Selected: <code className="text-xs text-foreground">{selectedPath}</code>
          </p>
        ) : (
          <p className="m-0 flex items-center gap-2 text-sm text-muted-foreground">
            <HiOutlinePhoto size={16} aria-hidden />
            Open a folder or select an image. Double-click to insert quickly.
          </p>
        )}

        <div className="flex shrink-0 flex-wrap gap-2">
          <button
            type="button"
            onClick={close}
            className="rounded-md border border-border px-4 py-2 text-sm font-semibold text-foreground transition hover:bg-secondary"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => selectedPath && pickImage(selectedPath)}
            disabled={!selectedPath}
            className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Use image
          </button>
        </div>
      </div>
    </div>
  );
}
