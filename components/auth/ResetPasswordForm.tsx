"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import type { AuthPortal } from "@/lib/auth/constants";
import { PasswordField } from "@/components/auth/PasswordField";
import { PORTAL_LOGIN } from "@/lib/auth/constants";

type ResetPasswordFormProps = {
  portal: AuthPortal;
};

export function ResetPasswordForm({ portal }: ResetPasswordFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMessage("");

    if (!token) {
      setError("Reset token is missing.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password, confirmPassword }),
      });

      const data = await response.json();
      if (!response.ok) {
        setError(data.error ?? "Unable to reset password.");
        return;
      }

      setMessage(data.message);
      setTimeout(() => {
        router.push(PORTAL_LOGIN[portal]);
      }, 1200);
    } catch {
      setError("Unable to reset password right now.");
    } finally {
      setLoading(false);
    }
  }

  if (!token) {
    return (
      <p className="m-0 text-sm text-red-700">
        This reset link is invalid.{" "}
        <Link href={PORTAL_LOGIN[portal]} className="font-medium underline">
          Request a new one
        </Link>
        .
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error ? (
        <p className="m-0 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
          {error}
        </p>
      ) : null}
      {message ? (
        <p className="m-0 rounded-lg border border-primary/20 bg-primary-light px-3 py-2 text-sm text-primary-dark" role="status">
          {message}
        </p>
      ) : null}

      <PasswordField
        label="New password"
        value={password}
        onChange={setPassword}
        autoComplete="new-password"
        minLength={8}
        id="new-password"
      />

      <PasswordField
        label="Confirm password"
        value={confirmPassword}
        onChange={setConfirmPassword}
        autoComplete="new-password"
        minLength={8}
        id="confirm-password"
      />

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Updating…" : "Update password"}
      </button>
    </form>
  );
}
