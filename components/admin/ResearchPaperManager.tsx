"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { HiOutlinePencilSquare, HiOutlinePlus, HiOutlineTrash } from "react-icons/hi2";
import { Modal, ModalActions, ModalAlert } from "@/components/ui/Modal";
import type { ResearchPaperItem } from "@/lib/research-papers";

type StudentOption = {
  id: string;
  name?: string;
  studentId?: string;
  email: string;
};

type PaperFormState = {
  title: string;
  year: string;
  venue: string;
  url: string;
  description: string;
  studentIds: string[];
};

const inputClassName =
  "w-full rounded-lg border border-[#d8d8d8] px-3 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15";

function emptyForm(): PaperFormState {
  return {
    title: "",
    year: "",
    venue: "",
    url: "",
    description: "",
    studentIds: [],
  };
}

function formFromPaper(paper: ResearchPaperItem): PaperFormState {
  return {
    title: paper.title,
    year: paper.year?.toString() ?? "",
    venue: paper.venue ?? "",
    url: paper.url ?? "",
    description: paper.description ?? "",
    studentIds: paper.studentIds,
  };
}

type ResearchPaperManagerProps = {
  initialPapers: ResearchPaperItem[];
  initialStudents: StudentOption[];
};

export function ResearchPaperManager({ initialPapers, initialStudents }: ResearchPaperManagerProps) {
  const [papers, setPapers] = useState(initialPapers);
  const [students] = useState(initialStudents);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<PaperFormState>(emptyForm);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");
  const [loading, setLoading] = useState(false);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState("");
  const [currentThumbnailUrl, setCurrentThumbnailUrl] = useState("");
  const thumbnailInputRef = useRef<HTMLInputElement>(null);

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
  }

  function openCreate() {
    setEditingId(null);
    setForm(emptyForm());
    resetThumbnailState();
    setError("");
    setOpen(true);
  }

  function openEdit(paper: ResearchPaperItem) {
    setEditingId(paper.id);
    setForm(formFromPaper(paper));
    resetThumbnailState();
    setCurrentThumbnailUrl(paper.thumbnailUrl ?? "");
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

  function toggleStudent(studentId: string) {
    setForm((current) => ({
      ...current,
      studentIds: current.studentIds.includes(studentId)
        ? current.studentIds.filter((id) => id !== studentId)
        : [...current.studentIds, studentId],
    }));
  }

  async function refreshPapers() {
    const response = await fetch("/api/admin/research-papers");
    const data = await response.json();
    if (response.ok) {
      setPapers(data.papers ?? []);
    }
  }

  async function uploadThumbnail(paperId: string, file: File) {
    const formData = new FormData();
    formData.append("thumbnail", file);

    const response = await fetch(`/api/admin/research-papers/${paperId}/thumbnail`, {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error ?? "Unable to upload thumbnail.");
    }
  }

  function handleThumbnailChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    if (thumbnailPreview.startsWith("blob:")) {
      URL.revokeObjectURL(thumbnailPreview);
    }

    setThumbnailFile(file);
    setThumbnailPreview(URL.createObjectURL(file));
    event.target.value = "";
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    const payload = {
      title: form.title,
      year: form.year ? Number(form.year) : null,
      venue: form.venue,
      url: form.url,
      description: form.description,
      studentIds: form.studentIds,
    };

    try {
      const response = await fetch(
        editingId ? `/api/admin/research-papers/${editingId}` : "/api/admin/research-papers",
        {
          method: editingId ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );

      const data = await response.json();
      if (!response.ok) {
        setError(data.error ?? "Unable to save research paper.");
        return;
      }

      const paperId = editingId ?? data.paper.id;
      if (thumbnailFile) {
        try {
          await uploadThumbnail(paperId, thumbnailFile);
        } catch (uploadError) {
          setError(uploadError instanceof Error ? uploadError.message : "Paper saved, but thumbnail upload failed.");
          await refreshPapers();
          return;
        }
      }

      closeModal();
      setToast(editingId ? "Research paper updated." : "Research paper created.");
      await refreshPapers();
    } catch {
      setError("Unable to save research paper right now.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(paper: ResearchPaperItem) {
    const confirmed = window.confirm(`Delete "${paper.title}"? This cannot be undone.`);
    if (!confirmed) return;

    setToast("");
    try {
      const response = await fetch(`/api/admin/research-papers/${paper.id}`, { method: "DELETE" });
      const data = await response.json();
      if (!response.ok) {
        setToast(data.error ?? "Unable to delete research paper.");
        return;
      }

      setToast("Research paper deleted.");
      await refreshPapers();
    } catch {
      setToast("Unable to delete research paper right now.");
    }
  }

  function studentLabel(student: StudentOption) {
    return [student.name, student.studentId].filter(Boolean).join(" · ") || student.email;
  }

  return (
    <>
      <section className="rounded-2xl border border-[#e0eaed] bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#ececec] px-6 py-5">
          <div>
            <h2 className="m-0 text-lg font-bold text-primary-dark">Research papers</h2>
            <p className="mt-1 mb-0 text-sm text-[#667]">{papers.length} published entries</p>
          </div>
          <button
            type="button"
            onClick={openCreate}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:brightness-105"
          >
            <HiOutlinePlus size={18} aria-hidden />
            Add paper
          </button>
        </div>

        {toast ? (
          <div className="border-b border-[#ececec] px-6 py-3">
            <p className="m-0 text-sm font-medium text-primary-dark" role="status">
              {toast}
            </p>
          </div>
        ) : null}

        {papers.length === 0 ? (
          <p className="px-6 py-8 text-sm text-[#667]">No research papers yet. Click &quot;Add paper&quot; to create one.</p>
        ) : (
          <div className="overflow-x-auto px-6 py-4">
            <table className="min-w-full border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-[#ececec] text-[#666]">
                  <th className="py-2 pr-4 font-medium">Thumbnail</th>
                  <th className="py-2 pr-4 font-medium">Title</th>
                  <th className="py-2 pr-4 font-medium">Authors</th>
                  <th className="py-2 pr-4 font-medium">Year</th>
                  <th className="py-2 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {papers.map((paper) => (
                  <tr key={paper.id} className="border-b border-[#f0f0f0] last:border-b-0">
                    <td className="py-3 pr-4">
                      <div className="relative aspect-video w-24 overflow-hidden rounded-lg border border-[#ececec] bg-[#f7fbfc]">
                        {paper.thumbnailUrl ? (
                          <Image src={paper.thumbnailUrl} alt="" fill className="object-cover" sizes="96px" unoptimized />
                        ) : (
                          <span className="flex h-full w-full items-center justify-center text-[0.65rem] text-[#667]">No image</span>
                        )}
                      </div>
                    </td>
                    <td className="max-w-xs py-3 pr-4">
                      <p className="m-0 font-semibold text-primary-dark">{paper.title}</p>
                      {paper.venue ? <p className="mt-1 mb-0 text-xs text-[#667]">{paper.venue}</p> : null}
                    </td>
                    <td className="py-3 pr-4">{paper.authors || "—"}</td>
                    <td className="py-3 pr-4">{paper.year ?? "—"}</td>
                    <td className="py-3">
                      <div className="flex flex-wrap items-center gap-3">
                        <button
                          type="button"
                          onClick={() => openEdit(paper)}
                          className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
                        >
                          <HiOutlinePencilSquare size={16} aria-hidden />
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(paper)}
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
        title={editingId ? "Edit research paper" : "Add research paper"}
        description="Authors are the students linked to this paper. Select one or more student authors."
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
                onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
                className={inputClassName}
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-[#444]">Year</span>
              <input
                type="number"
                min={1900}
                max={new Date().getFullYear() + 1}
                value={form.year}
                onChange={(event) => setForm((current) => ({ ...current, year: event.target.value }))}
                className={inputClassName}
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-[#444]">Journal / conference</span>
              <input
                type="text"
                value={form.venue}
                onChange={(event) => setForm((current) => ({ ...current, venue: event.target.value }))}
                className={inputClassName}
              />
            </label>
            <label className="block sm:col-span-2">
              <span className="mb-1.5 block text-sm font-medium text-[#444]">Paper URL</span>
              <input
                type="url"
                placeholder="https://"
                value={form.url}
                onChange={(event) => setForm((current) => ({ ...current, url: event.target.value }))}
                className={inputClassName}
              />
            </label>
            <label className="block sm:col-span-2">
              <span className="mb-1.5 block text-sm font-medium text-[#444]">Summary (optional)</span>
              <textarea
                rows={3}
                value={form.description}
                onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
                className={inputClassName}
              />
            </label>

            <div className="block sm:col-span-2">
              <span className="mb-1.5 block text-sm font-medium text-[#444]">Thumbnail image</span>
              <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
                <div className="relative aspect-video w-full max-w-xs overflow-hidden rounded-xl border border-[#ececec] bg-[#f7fbfc]">
                  {thumbnailPreview || currentThumbnailUrl ? (
                    <Image
                      src={thumbnailPreview || currentThumbnailUrl}
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
                <div>
                  <input
                    ref={thumbnailInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                    onChange={handleThumbnailChange}
                  />
                  <button
                    type="button"
                    onClick={() => thumbnailInputRef.current?.click()}
                    className="rounded-xl border border-primary/25 px-4 py-2 text-sm font-semibold text-primary-dark transition hover:bg-primary-light"
                  >
                    {thumbnailPreview || currentThumbnailUrl ? "Change thumbnail" : "Upload thumbnail"}
                  </button>
                  <p className="mt-2 mb-0 text-xs text-[#667]">JPG, PNG, or WebP. Max 3 MB. Displayed at 16:9.</p>
                </div>
              </div>
            </div>

            <fieldset className="block sm:col-span-2">
              <legend className="mb-2 text-sm font-medium text-[#444]">Student authors</legend>
              {students.length === 0 ? (
                <p className="m-0 text-sm text-[#667]">No students available. Create student accounts first.</p>
              ) : (
                <div className="max-h-44 space-y-2 overflow-y-auto rounded-xl border border-[#ececec] p-3">
                  {students.map((student) => (
                    <label key={student.id} className="flex cursor-pointer items-start gap-2 text-sm text-[#444]">
                      <input
                        type="checkbox"
                        checked={form.studentIds.includes(student.id)}
                        onChange={() => toggleStudent(student.id)}
                        className="mt-1"
                      />
                      <span>
                        <span className="font-medium text-primary-dark">{studentLabel(student)}</span>
                        <span className="block text-xs text-[#667]">{student.email}</span>
                      </span>
                    </label>
                  ))}
                </div>
              )}
            </fieldset>
          </div>

          <ModalActions
            onCancel={closeModal}
            submitLabel={editingId ? "Save changes" : "Create paper"}
            loading={loading}
            loadingLabel="Saving…"
          />
        </form>
      </Modal>
    </>
  );
}
