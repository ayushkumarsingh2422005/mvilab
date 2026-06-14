"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import type { StudentProfileResponse } from "@/lib/student-profile";
import { STUDENT_DESIGNATIONS } from "@/lib/student-designations";

const inputClassName =
  "w-full rounded-lg border border-[#d8d8d8] px-3 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15";

const socialFields = [
  { key: "linkedin", label: "LinkedIn" },
  { key: "github", label: "GitHub" },
  { key: "googleScholar", label: "Google Scholar" },
  { key: "orcid", label: "ORCID" },
  { key: "researchGate", label: "ResearchGate" },
  { key: "twitter", label: "X (Twitter)" },
] as const;

function toFormState(profile: StudentProfileResponse) {
  return {
    name: profile.name ?? "",
    bio: profile.profile.bio ?? "",
    phone: profile.profile.phone ?? "",
    designation: profile.profile.designation ?? "",
    department: profile.profile.department ?? "",
    researchInterests: profile.profile.researchInterests ?? "",
    website: profile.profile.website ?? "",
    socialLinks: {
      linkedin: profile.profile.socialLinks.linkedin ?? "",
      twitter: profile.profile.socialLinks.twitter ?? "",
      github: profile.profile.socialLinks.github ?? "",
      googleScholar: profile.profile.socialLinks.googleScholar ?? "",
      orcid: profile.profile.socialLinks.orcid ?? "",
      researchGate: profile.profile.socialLinks.researchGate ?? "",
    },
  };
}

type StudentProfileFormProps = {
  initialProfile: StudentProfileResponse;
};

export function StudentProfileForm({ initialProfile }: StudentProfileFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [avatarUrl, setAvatarUrl] = useState(initialProfile.profile.avatarUrl ?? "");
  const [form, setForm] = useState(() => toFormState(initialProfile));
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  function updateField<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function updateSocial(key: keyof typeof form.socialLinks, value: string) {
    setForm((current) => ({
      ...current,
      socialLinks: { ...current.socialLinks, [key]: value },
    }));
  }

  async function handleAvatarChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setError("");
    setSuccess("");
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("avatar", file);

      const response = await fetch("/api/portal/profile/avatar", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) {
        setError(data.error ?? "Unable to upload photo.");
        return;
      }

      setAvatarUrl(`${data.avatarUrl}?t=${Date.now()}`);
      setSuccess("Profile photo updated.");
    } catch {
      setError("Unable to upload photo right now.");
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess("");
    setSaving(true);

    try {
      const response = await fetch("/api/portal/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await response.json();
      if (!response.ok) {
        setError(data.error ?? "Unable to save profile.");
        return;
      }

      setForm(toFormState(data.profile));
      setSuccess("Profile saved successfully.");
    } catch {
      setError("Unable to save profile right now.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error ? (
        <p className="m-0 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
          {error}
        </p>
      ) : null}
      {success ? (
        <p className="m-0 rounded-lg border border-primary/20 bg-primary-light px-3 py-2 text-sm text-primary-dark" role="status">
          {success}
        </p>
      ) : null}

      <section className="rounded-2xl border border-[#e0eaed] bg-white p-6 shadow-sm">
        <h2 className="m-0 text-lg font-bold text-primary-dark">Profile photo</h2>
        <div className="mt-4 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
          <div className="relative h-28 w-28 overflow-hidden rounded-2xl border border-[#e0eaed] bg-[#f7fbfc]">
            {avatarUrl ? (
              <Image src={avatarUrl} alt="" fill className="object-cover" sizes="112px" unoptimized />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-3xl font-bold text-primary">
                {(form.name || initialProfile.email).charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={handleAvatarChange}
            />
            <button
              type="button"
              disabled={uploading}
              onClick={() => fileInputRef.current?.click()}
              className="rounded-xl border border-primary/25 px-4 py-2 text-sm font-semibold text-primary-dark transition hover:bg-primary-light disabled:opacity-60"
            >
              {uploading ? "Uploading…" : "Upload photo"}
            </button>
            <p className="mt-2 mb-0 text-xs text-[#667]">JPG, PNG, or WebP. Max 2 MB.</p>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-[#e0eaed] bg-white p-6 shadow-sm">
        <h2 className="m-0 text-lg font-bold text-primary-dark">Basic information</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <label className="block sm:col-span-2">
            <span className="mb-1.5 block text-sm font-medium text-[#444]">Full name</span>
            <input
              type="text"
              required
              value={form.name}
              onChange={(event) => updateField("name", event.target.value)}
              className={inputClassName}
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-[#444]">Student ID</span>
            <input type="text" value={initialProfile.studentId ?? "—"} disabled className={`${inputClassName} bg-[#f7f7f7]`} />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-[#444]">Email</span>
            <input type="email" value={initialProfile.email} disabled className={`${inputClassName} bg-[#f7f7f7]`} />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-[#444]">Phone</span>
            <input
              type="tel"
              value={form.phone}
              onChange={(event) => updateField("phone", event.target.value)}
              className={inputClassName}
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-[#444]">Designation</span>
            <select
              value={form.designation}
              onChange={(event) => updateField("designation", event.target.value)}
              className={inputClassName}
            >
              <option value="">Select designation</option>
              {STUDENT_DESIGNATIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-[#444]">Department</span>
            <input
              type="text"
              value={form.department}
              onChange={(event) => updateField("department", event.target.value)}
              className={inputClassName}
            />
          </label>
          <label className="block sm:col-span-2">
            <span className="mb-1.5 block text-sm font-medium text-[#444]">Website</span>
            <input
              type="url"
              placeholder="https://"
              value={form.website}
              onChange={(event) => updateField("website", event.target.value)}
              className={inputClassName}
            />
          </label>
          <label className="block sm:col-span-2">
            <span className="mb-1.5 block text-sm font-medium text-[#444]">About you</span>
            <textarea
              rows={4}
              value={form.bio}
              onChange={(event) => updateField("bio", event.target.value)}
              className={inputClassName}
              placeholder="Brief introduction, background, and current focus."
            />
          </label>
          <label className="block sm:col-span-2">
            <span className="mb-1.5 block text-sm font-medium text-[#444]">Research interests</span>
            <textarea
              rows={3}
              value={form.researchInterests}
              onChange={(event) => updateField("researchInterests", event.target.value)}
              className={inputClassName}
              placeholder="Topics, methods, or areas you work on."
            />
          </label>
        </div>
      </section>

      <section className="rounded-2xl border border-[#e0eaed] bg-white p-6 shadow-sm">
        <h2 className="m-0 text-lg font-bold text-primary-dark">Social & academic links</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {socialFields.map(({ key, label }) => (
            <label key={key} className="block">
              <span className="mb-1.5 block text-sm font-medium text-[#444]">{label}</span>
              <input
                type="url"
                placeholder="https://"
                value={form.socialLinks[key]}
                onChange={(event) => updateSocial(key, event.target.value)}
                className={inputClassName}
              />
            </label>
          ))}
        </div>
      </section>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={saving}
          className="rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-white transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving ? "Saving…" : "Save profile"}
        </button>
      </div>
    </form>
  );
}
