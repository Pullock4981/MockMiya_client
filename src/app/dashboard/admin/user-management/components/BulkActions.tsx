// src/app/dashboard/admin/user-management/BulkActions.tsx
import React from "react";
import { Button } from "@/components/ui/button";
import { Mail, UserPlus, Shield, Users } from "lucide-react";

export default function BulkActions({
  selectedCount,
  onSelectAll,
  onClearSelection,
  onBulkRole,
  onBulkEmail,
  onExportCsv,
}: {
  selectedCount: number;
  onSelectAll: () => void;
  onClearSelection: () => void;
  onBulkRole: () => void;
  onBulkEmail: () => void;
  onExportCsv: () => void;
}) {
  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4 gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <Button variant="outline" onClick={onSelectAll}>Select all on page</Button>
        <Button variant="outline" onClick={onClearSelection}>Clear selection</Button>
        <span className="text-sm text-muted-foreground">{selectedCount} selected</span>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Button variant="outline" onClick={onBulkRole} disabled={selectedCount === 0}>
          <UserPlus className="h-4 w-4 mr-2" /> Bulk role update
        </Button>
        <Button variant="outline" onClick={onBulkEmail} disabled={selectedCount === 0}>
          <Mail className="h-4 w-4 mr-2" /> Send email
        </Button>
        <Button variant="outline" onClick={onExportCsv} disabled={selectedCount === 0}>
          <Users className="h-4 w-4 mr-2" /> Export CSV
        </Button>
        <Button variant="outline" className="hidden md:inline-flex" disabled={selectedCount === 0}>
          <Shield className="h-4 w-4 mr-2" /> Modify Permissions
        </Button>
      </div>
    </div>
  );
}
