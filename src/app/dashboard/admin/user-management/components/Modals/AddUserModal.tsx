// src/app/dashboard/admin/user-management/Modals/AddUserModal.tsx
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ModalShell from "../ModalShell";

interface Props {
  open: boolean;
  onClose: () => void;
  addForm: { name: string; email: string; password: string; role: string; membershipType: string };
  setAddForm: (f: { name: string; email: string; password: string; role: string; membershipType: string }) => void;
  onSubmit: () => Promise<void>;
  submitting: boolean;
}

export default function AddUserModal({ open, onClose, addForm, setAddForm, onSubmit, submitting }: Props) {
  if (!open) return null;
  return (
    <ModalShell
      title="Add New User"
      onClose={onClose}
      footer={
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={onSubmit} disabled={submitting}>{submitting ? "Adding..." : "Add User"}</Button>
        </div>
      }
    >
      <div className="grid grid-cols-1 gap-3">
        <label className="text-sm">Name</label>
        <Input value={addForm.name} onChange={(e) => setAddForm({ ...addForm, name: e.target.value })} />
        <label className="text-sm">Email</label>
        <Input value={addForm.email} onChange={(e) => setAddForm({ ...addForm, email: e.target.value })} />
        <label className="text-sm">Password</label>
        <Input type="password" value={addForm.password} onChange={(e) => setAddForm({ ...addForm, password: e.target.value })} />
        <div className="flex gap-2">
          <select className="rounded-md border px-3 py-2 flex-1" value={addForm.role} onChange={(e) => setAddForm({ ...addForm, role: e.target.value })}>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
          <select className="rounded-md border px-3 py-2 flex-1" value={addForm.membershipType} onChange={(e) => setAddForm({ ...addForm, membershipType: e.target.value })}>
            <option>Free</option>
            <option>Premium</option>
            <option>Enterprise</option>
          </select>
        </div>
      </div>
    </ModalShell>
  );
}
