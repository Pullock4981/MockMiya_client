"use client";
import React from "react";

type CheckboxProps = {
  label: string;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  error?: string;
};

export default function Checkbox({ label, checked, onChange, onBlur, error }: CheckboxProps) {
  return (
    <div className="flex flex-col">
      <label className="inline-flex items-center space-x-2 cursor-pointer">
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          onBlur={onBlur}
          className="form-checkbox h-4 w-4 text-green-600"
        />
        <span>{label}</span>
      </label>
      {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
    </div>
  );
}
