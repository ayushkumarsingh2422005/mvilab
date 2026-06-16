"use client";

import Link from "next/link";
import { useState } from "react";
import { HiOutlineEye, HiOutlinePlus, HiOutlineTrash } from "react-icons/hi2";
import { UserActiveToggle } from "@/components/admin/UserActiveToggle";
import { StudentSlugEditor } from "@/components/admin/StudentSlugEditor";
import { Modal, ModalActions, ModalAlert, ModalField } from "@/components/ui/Modal";

type StudentRow = {
  id: string;
  name?: string;
  email: string;
  studentId?: string;
  slug?: string;
  isActive: boolean;
  mustResetPassword: boolean;
  createdAt: string;
};

type StudentManagerProps = {
  initialStudents: StudentRow[];
};

export function StudentManager({ initialStudents }: StudentManagerProps) {
  const [students, setStudents] = useState(initialStudents);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [slug, setSlug] = useState("");
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");
  const [loading, setLoading] = useState(false);

  function updateStudentStatus(id: string, isActive: boolean) {
    setStudents((current) =>
      current.map((student) => (student.id === id ? { ...student, isActive } : student)),
    );
    setToast(isActive ? "Student account activated." : "Student account deactivated.");
  }

  function updateStudentSlug(id: string, slug: string) {
    setStudents((current) => current.map((student) => (student.id === id ? { ...student, slug } : student)));
    setToast("Public profile slug updated.");
  }

  async function refreshStudents() {
    const response = await fetch("/api/admin/students");
    const data = await response.json();
    if (response.ok) {
      setStudents(
        (data.students ?? []).map((student: StudentRow & { _id?: string }) => ({
          id: student.id ?? student._id,
          name: student.name,
          email: student.email,
          studentId: student.studentId,
          slug: student.slug,
          isActive: student.isActive,
          mustResetPassword: student.mustResetPassword,
          createdAt: student.createdAt,
        })),
      );
    }
  }

  function closeModal() {
    setOpen(false);
    setError("");
    setName("");
    setEmail("");
    setSlug("");
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/admin/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, slug }),
      });

      const data = await response.json();
      if (!response.ok) {
        setError(data.error ?? "Unable to create student.");
        return;
      }

      closeModal();
      setToast(`Student ${data.student.studentId} created. Welcome email sent.`);
      await refreshStudents();
    } catch {
      setError("Unable to create student right now.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(student: StudentRow) {
    const label = student.name ?? student.studentId ?? student.email;
    const confirmed = window.confirm(
      `Permanently delete ${label}?\n\n` +
        "If they are linked to research papers with other co-authors, they will be removed from those papers. " +
        "Deletion is blocked if they are the only author on any paper.\n\n" +
        "This cannot be undone.",
    );
    if (!confirmed) return;

    const response = await fetch(`/api/admin/users/${student.id}`, { method: "DELETE" });
    const data = await response.json();
    if (!response.ok) {
      setToast(data.error ?? "Unable to delete student.");
      return;
    }

    setToast("Student deleted.");
    await refreshStudents();
  }

  return (
    <>
      <section className="rounded-2xl border border-[#e0eaed] bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#ececec] px-6 py-5">
          <div>
            <h2 className="m-0 text-lg font-bold text-primary-dark">Students</h2>
            <p className="mt-1 mb-0 text-sm text-[#667]">{students.length} registered</p>
          </div>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:brightness-105"
          >
            <HiOutlinePlus size={18} aria-hidden />
            Add student
          </button>
        </div>

        {toast ? (
          <div className="border-b border-[#ececec] px-6 py-3">
            <p className="m-0 text-sm font-medium text-primary-dark" role="status">
              {toast}
            </p>
          </div>
        ) : null}

        {students.length === 0 ? (
          <p className="px-6 py-8 text-sm text-[#667]">No students yet. Click &quot;Add student&quot; to create one.</p>
        ) : (
          <div className="overflow-x-auto px-6 py-4">
            <table className="min-w-full border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-[#ececec] text-[#666]">
                  <th className="py-2 pr-4 font-medium">Student ID</th>
                  <th className="py-2 pr-4 font-medium">Name</th>
                  <th className="py-2 pr-4 font-medium">Public slug</th>
                  <th className="py-2 pr-4 font-medium">Email</th>
                  <th className="py-2 pr-4 font-medium">Status</th>
                  <th className="py-2 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student.id} className="border-b border-[#f0f0f0] last:border-b-0">
                    <td className="py-3 pr-4 font-semibold text-primary-dark">{student.studentId}</td>
                    <td className="py-3 pr-4">{student.name ?? "—"}</td>
                    <td className="py-3 pr-4">
                      <StudentSlugEditor
                        studentId={student.id}
                        studentName={student.name}
                        slug={student.slug}
                        onUpdated={(slug) => updateStudentSlug(student.id, slug)}
                        onError={setToast}
                      />
                    </td>
                    <td className="py-3 pr-4">{student.email}</td>
                    <td className="py-3 pr-4">
                      <UserActiveToggle
                        userId={student.id}
                        isActive={student.isActive}
                        mustResetPassword={student.mustResetPassword}
                        onChanged={(isActive) => updateStudentStatus(student.id, isActive)}
                        onError={setToast}
                      />
                    </td>
                    <td className="py-3">
                      <div className="flex flex-wrap items-center gap-3">
                        <Link
                          href={`/admin/students/${student.id}`}
                          className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary-dark hover:underline"
                        >
                          <HiOutlineEye size={16} aria-hidden />
                          View
                        </Link>
                        <button
                          type="button"
                          onClick={() => void handleDelete(student)}
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
        title="Create student"
        description="Set a unique public profile slug. A welcome email with the student ID and password setup link will be sent via Brevo."
      >
        <form onSubmit={handleSubmit}>
          {error ? <ModalAlert message={error} tone="error" /> : null}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <ModalField label="Full name" value={name} onChange={setName} />
            <ModalField label="Email" type="email" value={email} onChange={setEmail} />
            <label className="block sm:col-span-2">
              <span className="mb-1.5 block text-sm font-medium text-[#444]">Public profile slug</span>
              <input
                type="text"
                required
                value={slug}
                onChange={(event) => setSlug(event.target.value.toLowerCase())}
                placeholder="e.g. jane-doe"
                pattern="[a-z0-9]+(?:-[a-z0-9]+)*"
                className="w-full rounded-lg border border-[#d8d8d8] px-3 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15"
              />
              <span className="mt-1.5 block text-xs text-[#667]">
                Profile URL: /student/{slug || "your-slug"} — lowercase letters, numbers, and hyphens only.
              </span>
            </label>
          </div>

          <ModalActions
            onCancel={closeModal}
            submitLabel="Create student"
            loading={loading}
            loadingLabel="Creating…"
          />
        </form>
      </Modal>
    </>
  );
}
