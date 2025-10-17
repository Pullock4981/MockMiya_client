"use client";
import React from "react";

export default function Divider() {
  return (
    <div className="flex items-center gap-3">
      <div className="h-px bg-gray-200 flex-1" />
      <div className="text-xs text-gray-400">OR</div>
      <div className="h-px bg-gray-200 flex-1" />
    </div>
  );
}
