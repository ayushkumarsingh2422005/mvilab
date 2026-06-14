"use client";

import { useEffect } from "react";
import { HiOutlineXMark } from "react-icons/hi2";

type ModalProps = {
  open: boolean;
  title: string;
  description?: string;
  onClose: () => void;
  children: React.ReactNode;
};

export function Modal({ open, title, description, onClose, children }: ModalProps) {
  useEffect(() => {
    if (!open) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 cursor-default bg-black/45"
        aria-label="Close dialog"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className="relative z-[1] w-full max-w-lg rounded-2xl border border-[#e0eaed] bg-white shadow-[0_20px_50px_rgba(13,124,140,0.18)]"
      >
        <div className="flex items-start justify-between gap-4 border-b border-[#ececec] px-6 py-5">
          <div>
            <h2 id="modal-title" className="m-0 text-lg font-bold text-primary-dark">
              {title}
            </h2>
            {description ? <p className="mt-1 mb-0 text-sm text-[#667]">{description}</p> : null}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-[#666] transition hover:bg-[#f3f7f8] hover:text-primary-dark"
            aria-label="Close"
          >
            <HiOutlineXMark size={20} />
          </button>
        </div>
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  );
}

const inputClassName =
  "w-full rounded-lg border border-[#d8d8d8] px-3 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15";

export function ModalField({
  label,
  type = "text",
  value,
  onChange,
  required = true,
}: {
  label: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-[#444]">{label}</span>
      <input
        type={type}
        required={required}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={inputClassName}
      />
    </label>
  );
}

export function ModalActions({
  onCancel,
  submitLabel,
  loading,
  loadingLabel,
}: {
  onCancel: () => void;
  submitLabel: string;
  loading?: boolean;
  loadingLabel?: string;
}) {
  return (
    <div className="mt-6 flex flex-wrap justify-end gap-3">
      <button
        type="button"
        onClick={onCancel}
        className="rounded-xl border border-[#d8d8d8] px-4 py-2.5 text-sm font-semibold text-[#444] transition hover:bg-[#f7f7f7]"
      >
        Cancel
      </button>
      <button
        type="submit"
        disabled={loading}
        className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? (loadingLabel ?? "Saving…") : submitLabel}
      </button>
    </div>
  );
}

export function ModalAlert({
  message,
  tone = "error",
}: {
  message: string;
  tone?: "error" | "success";
}) {
  const className =
    tone === "error"
      ? "m-0 mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
      : "m-0 mb-4 rounded-lg border border-primary/20 bg-primary-light px-3 py-2 text-sm text-primary-dark";

  return (
    <p className={className} role={tone === "error" ? "alert" : "status"}>
      {message}
    </p>
  );
}
