"use client";

import { useState } from "react";

function statusLabel(isActive: boolean, mustResetPassword: boolean) {
  if (!isActive) return "Inactive";
  if (mustResetPassword) return "Awaiting password setup";
  return "Active";
}

function statusClassName(isActive: boolean, mustResetPassword: boolean) {
  if (!isActive) {
    return "inline-flex rounded-full bg-[#f3f4f4] px-2.5 py-0.5 text-[0.72rem] font-semibold text-[#666]";
  }
  if (mustResetPassword) {
    return "inline-flex rounded-full bg-amber-50 px-2.5 py-0.5 text-[0.72rem] font-semibold text-amber-800";
  }
  return "inline-flex rounded-full bg-primary-light px-2.5 py-0.5 text-[0.72rem] font-semibold text-primary-dark";
}

type UserActiveToggleProps = {
  userId: string;
  isActive: boolean;
  mustResetPassword: boolean;
  disabled?: boolean;
  onChanged: (isActive: boolean) => void;
  onError: (message: string) => void;
};

export function UserActiveToggle({
  userId,
  isActive,
  mustResetPassword,
  disabled,
  onChanged,
  onError,
}: UserActiveToggleProps) {
  const [loading, setLoading] = useState(false);

  async function handleToggle() {
    setLoading(true);

    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !isActive }),
      });

      const data = await response.json();
      if (!response.ok) {
        onError(data.error ?? "Unable to update status.");
        return;
      }

      onChanged(data.user.isActive);
    } catch {
      onError("Unable to update status right now.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className={statusClassName(isActive, mustResetPassword)}>
        {statusLabel(isActive, mustResetPassword)}
      </span>
      <button
        type="button"
        disabled={disabled || loading}
        onClick={handleToggle}
        className={`rounded-lg border px-2.5 py-1 text-[0.78rem] font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${
          isActive
            ? "border-red-200 text-red-700 hover:bg-red-50"
            : "border-primary/25 text-primary-dark hover:bg-primary-light"
        }`}
      >
        {loading ? "Saving…" : isActive ? "Deactivate" : "Activate"}
      </button>
    </div>
  );
}
