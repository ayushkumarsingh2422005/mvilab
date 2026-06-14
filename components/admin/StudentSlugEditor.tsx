"use client";

import { useState } from "react";
import { HiOutlinePencilSquare } from "react-icons/hi2";
import { Modal, ModalActions, ModalAlert } from "@/components/ui/Modal";

const inputClassName =
  "w-full rounded-lg border border-[#d8d8d8] px-3 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15";

type StudentSlugEditorProps = {
  studentId: string;
  studentName?: string;
  slug?: string;
  onUpdated: (slug: string) => void;
  onError: (message: string) => void;
};

export function StudentSlugEditor({
  studentId,
  studentName,
  slug,
  onUpdated,
  onError,
}: StudentSlugEditorProps) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(slug ?? "");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function openModal() {
    setValue(slug ?? "");
    setError("");
    setOpen(true);
  }

  function closeModal() {
    setOpen(false);
    setError("");
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(`/api/admin/students/${studentId}/slug`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug: value }),
      });

      const data = await response.json();
      if (!response.ok) {
        setError(data.error ?? "Unable to update slug.");
        return;
      }

      onUpdated(data.student.slug);
      closeModal();
    } catch {
      setError("Unable to update slug right now.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="flex flex-wrap items-center gap-2">
        {slug ? (
          <a
            href={`/student/${slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-primary hover:underline"
          >
            {slug}
          </a>
        ) : (
          <span className="text-[#667]">Not set</span>
        )}
        <button
          type="button"
          onClick={openModal}
          className="inline-flex items-center gap-1 text-xs font-semibold text-primary-dark hover:text-primary hover:underline"
        >
          <HiOutlinePencilSquare size={14} aria-hidden />
          Edit
        </button>
      </div>

      <Modal
        open={open}
        onClose={closeModal}
        title="Edit public slug"
        description={
          studentName
            ? `Update the public profile URL for ${studentName}.`
            : "Update this student's public profile URL."
        }
      >
        <form onSubmit={handleSubmit}>
          {error ? <ModalAlert message={error} tone="error" /> : null}

          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-[#444]">Public profile slug</span>
            <input
              type="text"
              required
              value={value}
              onChange={(event) => setValue(event.target.value.toLowerCase())}
              placeholder="e.g. jane-doe"
              pattern="[a-z0-9]+(?:-[a-z0-9]+)*"
              className={inputClassName}
            />
            <span className="mt-1.5 block text-xs text-[#667]">
              Profile URL: /student/{value || "your-slug"}
            </span>
          </label>

          <ModalActions
            onCancel={closeModal}
            submitLabel="Save slug"
            loading={loading}
            loadingLabel="Saving…"
          />
        </form>
      </Modal>
    </>
  );
}
