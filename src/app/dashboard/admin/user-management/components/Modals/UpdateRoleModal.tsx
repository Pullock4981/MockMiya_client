// src/app/dashboard/admin/user-management/Modals/UpdateRoleModal.tsx
import React from "react";
import { Button } from "@/components/ui/button";
import ModalShell from "../ModalShell";

interface Props {
  open: boolean;
  onClose: () => void;
  userId?: string | null;
  value: string;
  setValue: (v: string) => void;
  onUpdate: (id?: string | null) => Promise<void>;
}

export default function UpdateRoleModal({ open, onClose, userId, value, setValue, onUpdate }: Props) {
  if (!open) return null;
  return (
    <ModalShell
      title="Set role"
      onClose={onClose}
      footer={
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={() => onUpdate(userId)}>Update</Button>
        </div>
      }
    >
      <div className="space-y-3">
        <select className="rounded-md border px-3 py-2 w-full" value={value} onChange={(e) => setValue(e.target.value)}>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
      </div>
    </ModalShell>
  );
}
