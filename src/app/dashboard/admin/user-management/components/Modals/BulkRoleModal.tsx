// src/app/dashboard/admin/user-management/Modals/BulkRoleModal.tsx
import React from "react";
import { Button } from "@/components/ui/button";
import ModalShell from "../ModalShell";

interface Props {
  open: boolean;
  onClose: () => void;
  selectedCount: number;
  value: string;
  setValue: (v: string) => void;
  onApply: () => Promise<void>;
}

export default function BulkRoleModal({ open, onClose, selectedCount, value, setValue, onApply }: Props) {
  if (!open) return null;
  return (
    <ModalShell
      title="Set role for selected users"
      onClose={onClose}
      footer={
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={onApply}>Apply</Button>
        </div>
      }
    >
      <div className="space-y-3">
        <p className="text-sm text-muted-foreground">{selectedCount} users selected</p>
        <select className="rounded-md border px-3 py-2 w-full" value={value} onChange={(e) => setValue(e.target.value)}>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
      </div>
    </ModalShell>
  );
}
