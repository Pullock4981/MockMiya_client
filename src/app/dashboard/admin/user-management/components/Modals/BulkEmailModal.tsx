// src/app/dashboard/admin/user-management/Modals/BulkEmailModal.tsx
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ModalShell from "../ModalShell";

interface Props {
  open: boolean;
  onClose: () => void;
  selectedCount: number;
  value: { subject: string; body: string };
  setValue: (v: { subject: string; body: string }) => void;
  onSend: () => Promise<void>;
}

export default function BulkEmailModal({ open, onClose, selectedCount, value, setValue, onSend }: Props) {
  if (!open) return null;
  return (
    <ModalShell
      title="Send bulk email"
      onClose={onClose}
      footer={
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={onSend}>Send</Button>
        </div>
      }
    >
      <div className="space-y-3">
        <p className="text-sm text-muted-foreground">{selectedCount} users selected</p>
        <label className="text-sm">Subject</label>
        <Input value={value.subject} onChange={(e) => setValue({ ...value, subject: e.target.value })} />
        <label className="text-sm">Body (HTML allowed)</label>
        <textarea className="w-full rounded-md border p-2 min-h-[120px]" value={value.body} onChange={(e) => setValue({ ...value, body: e.target.value })} />
      </div>
    </ModalShell>
  );
}
