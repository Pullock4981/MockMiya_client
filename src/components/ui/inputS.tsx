"use client";
import React from "react";
import { Eye, EyeOff } from "lucide-react";

type InputProps = {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  type?: string;
  showToggle?: boolean;
  toggleState?: boolean;
  onToggle?: () => void;
  error?: string;
};

export default function InputS({
  label,
  value,
  onChange,
  onBlur,
  type = "text",
  showToggle,
  toggleState,
  onToggle,
  error,
}: InputProps) {
  const id = label.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="relative">
      <input
        id={id}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        type={showToggle && toggleState ? "text" : type}
        placeholder=" "
        className={`peer w-full rounded-md border border-gray-300 px-4 py-3 placeholder-transparent text-base shadow-sm focus:outline-none focus:border-green-600 transition-transform text-green-300 ${
          error ? "border-red-500" : ""
        }`}
        aria-invalid={!!error}
      />
      <label
        htmlFor={id}
        className="absolute left-3 -top-3 text-xs text-gray-500 bg-white rounded-xs px-1 transition-all duration-150 peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-focus:-top-3 peer-focus:text-xs cursor-text"
      >
        {label}
      </label>
      {showToggle && (
        <button
          type="button"
          onClick={onToggle}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-green-500"
          aria-label={toggleState ? "Hide" : "Show"}
        >
          {toggleState ? <EyeOff /> : <Eye />}
        </button>
      )}
      {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
    </div>
  );
}
