"use client";

import Link from "next/link";
import { useState } from "react";
import type { AuthPortal } from "@/lib/auth/constants";
import { PORTAL_LOGIN } from "@/lib/auth/constants";

type ForgotPasswordFormProps = {
  portal: AuthPortal;
};

export function ForgotPasswordForm({ portal }: ForgotPasswordFormProps) {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, portal }),
      });

      const data = await response.json();
      if (!response.ok) {
        setError(data.error ?? "Unable to send reset email.");
        return;
      }

      setMessage(data.message);
    } catch {
      setError("Unable to send reset email right now.");
    } finally {
      setLoading(false);
    }
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

      <label className="block">
        <span className="mb-1.5 block text-sm font-medium text-[#444]">Email</span>
        <input
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="w-full rounded-lg border border-[#d8d8d8] px-3 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15"
        />
      </label>

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Sending…" : "Send reset link"}
      </button>

      <p className="m-0 text-center text-sm">
        <Link href={PORTAL_LOGIN[portal]} className="font-medium text-primary hover:text-primary-dark hover:underline">
          Back to sign in
        </Link>
      </p>
    </form>
  );
}
