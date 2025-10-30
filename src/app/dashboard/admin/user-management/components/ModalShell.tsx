// src/app/dashboard/admin/user-management/ModalShell.tsx
import React from "react";

export default function ModalShell({
  title,
  children,
  onClose,
  footer,
}: {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
  footer?: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="fixed inset-0 bg-black/40" onClick={onClose} />
      <div
        role="dialog"
        aria-modal="true"
        className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-lg shadow-lg overflow-hidden"
      >
        <div className="p-4 border-b dark:border-slate-800 flex items-center justify-between">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button
            aria-label="Close modal"
            onClick={onClose}
            className="text-slate-500 hover:text-slate-700"
          >
            ✕
          </button>
        </div>
        <div className="p-4">{children}</div>
        {footer && <div className="p-4 border-t dark:border-slate-800">{footer}</div>}
      </div>
    </div>
  );
}
