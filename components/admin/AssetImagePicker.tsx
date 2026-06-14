"use client";

import Image from "next/image";
import { useState } from "react";
import { HiOutlineFolderOpen, HiOutlinePhoto } from "react-icons/hi2";
import { Modal, ModalAlert } from "@/components/ui/Modal";
import type { AssetDirectoryListing, AssetEntry } from "@/lib/assets/list";

type AssetImagePickerProps = {
  open: boolean;
  initialListing: AssetDirectoryListing | null;
  onClose: () => void;
  onSelect: (publicPath: string) => void;
};

export function AssetImagePicker({ open, initialListing, onClose, onSelect }: AssetImagePickerProps) {
  const [listing, setListing] = useState<AssetDirectoryListing | null>(initialListing);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedPath, setSelectedPath] = useState("");

  async function loadDirectory(path: string) {
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
  }

  function handleSelect(entry: AssetEntry) {
    if (entry.kind === "folder") {
      void loadDirectory(entry.path);
      return;
    }

    if (!entry.isImage) return;
    setSelectedPath(entry.publicPath);
  }

  function confirmSelection() {
    if (!selectedPath) return;
    onSelect(selectedPath);
    onClose();
  }

  const imageEntries =
    listing?.entries.filter((entry) => entry.kind === "folder" || entry.isImage) ?? [];

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Choose from assets"
      description="Browse upload folders and pick an image for the paper thumbnail."
      panelClassName="max-w-3xl"
    >
      {error ? <ModalAlert message={error} tone="error" /> : null}

      {listing ? (
        <>
          <nav aria-label="Asset folders" className="mb-4 flex flex-wrap items-center gap-1 text-sm">
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

          <div className="max-h-[50vh] overflow-y-auto rounded-xl border border-[#ececec]">
            {loading ? (
              <p className="m-0 px-4 py-8 text-center text-sm text-[#667]">Loading…</p>
            ) : imageEntries.length === 0 ? (
              <p className="m-0 px-4 py-8 text-center text-sm text-[#667]">No folders or images here yet.</p>
            ) : (
              <ul className="m-0 grid list-none gap-3 p-4 sm:grid-cols-2 lg:grid-cols-3">
                {imageEntries.map((entry) => {
                  const isSelected = entry.kind === "file" && entry.publicPath === selectedPath;

                  return (
                    <li key={entry.path}>
                      <button
                        type="button"
                        onClick={() => handleSelect(entry)}
                        className={[
                          "flex w-full cursor-pointer flex-col overflow-hidden rounded-xl border bg-white text-left transition",
                          isSelected
                            ? "border-primary ring-2 ring-primary/20"
                            : "border-[#ececec] hover:border-primary/25 hover:shadow-sm",
                        ].join(" ")}
                      >
                        <div className="relative aspect-video w-full bg-[#f7fbfc]">
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
                              sizes="(max-width: 640px) 50vw, 200px"
                              unoptimized
                            />
                          )}
                        </div>
                        <div className="px-3 py-2">
                          <p className="m-0 truncate text-sm font-semibold text-primary-dark">{entry.name}</p>
                          {entry.kind === "folder" && entry.description ? (
                            <p className="mt-1 mb-0 line-clamp-2 text-xs text-[#667]">{entry.description}</p>
                          ) : (
                            <p className="mt-1 mb-0 truncate font-mono text-[0.68rem] text-[#667]">{entry.publicPath}</p>
                          )}
                        </div>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          {selectedPath ? (
            <p className="mt-4 mb-0 text-sm text-[#555]">
              Selected: <code className="rounded bg-[#f7fbfc] px-1.5 py-0.5 text-xs">{selectedPath}</code>
            </p>
          ) : (
            <p className="mt-4 mb-0 flex items-center gap-2 text-sm text-[#667]">
              <HiOutlinePhoto size={16} aria-hidden />
              Open a folder or click an image to select it.
            </p>
          )}

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
              onClick={confirmSelection}
              disabled={!selectedPath}
              className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Use this image
            </button>
          </div>
        </>
      ) : (
        <p className="m-0 text-sm text-[#667]">Loading asset library…</p>
      )}
    </Modal>
  );
}
