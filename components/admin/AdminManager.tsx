"use client";

import { useState } from "react";
import { HiOutlinePlus, HiOutlineTrash } from "react-icons/hi2";
import { UserActiveToggle } from "@/components/admin/UserActiveToggle";
import { Modal, ModalActions, ModalAlert, ModalField } from "@/components/ui/Modal";

type AdminRow = {
  id: string;
  name?: string;
  email: string;
  isActive: boolean;
  mustResetPassword: boolean;
  createdAt: string;
  isCurrentUser?: boolean;
};

type AdminManagerProps = {
  initialAdmins: AdminRow[];
};

export function AdminManager({ initialAdmins }: AdminManagerProps) {
  const [admins, setAdmins] = useState(initialAdmins);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");
  const [loading, setLoading] = useState(false);

  function updateAdminStatus(id: string, isActive: boolean) {
    setAdmins((current) =>
      current.map((admin) => (admin.id === id ? { ...admin, isActive } : admin)),
    );
    setToast(isActive ? "Admin account activated." : "Admin account deactivated.");
  }

  async function refreshAdmins() {
    const response = await fetch("/api/admin/admins");
    const data = await response.json();
    if (response.ok) {
      setAdmins(data.admins ?? []);
    }
  }

  function closeModal() {
    setOpen(false);
    setError("");
    setName("");
    setEmail("");
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/admin/admins", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email }),
      });

      const data = await response.json();
      if (!response.ok) {
        setError(data.error ?? "Unable to create admin.");
        return;
      }

      closeModal();
      setToast(`Admin ${data.admin.email} created. Setup email sent.`);
      await refreshAdmins();
    } catch {
      setError("Unable to create admin right now.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(admin: AdminRow) {
    if (admin.isCurrentUser) {
      setToast("You cannot delete your own account.");
      return;
    }

    const label = admin.name ?? admin.email;
    const confirmed = window.confirm(
      `Permanently delete admin ${label}?\n\nThey will lose portal access immediately. This cannot be undone.`,
    );
    if (!confirmed) return;

    const response = await fetch(`/api/admin/users/${admin.id}`, { method: "DELETE" });
    const data = await response.json();
    if (!response.ok) {
      setToast(data.error ?? "Unable to delete admin.");
      return;
    }

    setToast("Administrator deleted.");
    await refreshAdmins();
  }

  return (
    <>
      <section className="rounded-2xl border border-[#e0eaed] bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#ececec] px-6 py-5">
          <div>
            <h2 className="m-0 text-lg font-bold text-primary-dark">Administrators</h2>
            <p className="mt-1 mb-0 text-sm text-[#667]">Only existing admins can add new admins</p>
          </div>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:brightness-105"
          >
            <HiOutlinePlus size={18} aria-hidden />
            Add admin
          </button>
        </div>

        {toast ? (
          <div className="border-b border-[#ececec] px-6 py-3">
            <p className="m-0 text-sm font-medium text-primary-dark" role="status">
              {toast}
            </p>
          </div>
        ) : null}

        {admins.length === 0 ? (
          <p className="px-6 py-8 text-sm text-[#667]">No administrators found.</p>
        ) : (
          <div className="overflow-x-auto px-6 py-4">
            <table className="min-w-full border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-[#ececec] text-[#666]">
                  <th className="py-2 pr-4 font-medium">Name</th>
                  <th className="py-2 pr-4 font-medium">Email</th>
                  <th className="py-2 pr-4 font-medium">Status</th>
                  <th className="py-2 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {admins.map((admin) => (
                  <tr key={admin.id} className="border-b border-[#f0f0f0] last:border-b-0">
                    <td className="py-3 pr-4">
                      {admin.name ?? "—"}
                      {admin.isCurrentUser ? (
                        <span className="ml-2 rounded-full bg-primary-light px-2 py-0.5 text-[0.72rem] font-semibold text-primary-dark">
                          You
                        </span>
                      ) : null}
                    </td>
                    <td className="py-3 pr-4">{admin.email}</td>
                    <td className="py-3 pr-4">
                      <UserActiveToggle
                        userId={admin.id}
                        isActive={admin.isActive}
                        mustResetPassword={admin.mustResetPassword}
                        disabled={admin.isCurrentUser && admin.isActive}
                        onChanged={(isActive) => updateAdminStatus(admin.id, isActive)}
                        onError={setToast}
                      />
                    </td>
                    <td className="py-3">
                      {!admin.isCurrentUser ? (
                        <button
                          type="button"
                          onClick={() => void handleDelete(admin)}
                          className="inline-flex items-center gap-1 text-sm font-semibold text-red-700 hover:underline"
                        >
                          <HiOutlineTrash size={16} aria-hidden />
                          Delete
                        </button>
                      ) : (
                        <span className="text-xs text-[#999]">—</span>
                      )}
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
        title="Create admin"
        description="The new admin will receive an email with a link to set their password for the admin portal."
      >
        <form onSubmit={handleSubmit}>
          {error ? <ModalAlert message={error} tone="error" /> : null}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <ModalField label="Full name" value={name} onChange={setName} />
            <ModalField label="Email" type="email" value={email} onChange={setEmail} />
          </div>

          <ModalActions
            onCancel={closeModal}
            submitLabel="Create admin"
            loading={loading}
            loadingLabel="Creating…"
          />
        </form>
      </Modal>
    </>
  );
}
