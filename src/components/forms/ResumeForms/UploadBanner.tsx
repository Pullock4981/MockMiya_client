// src/components/UploadBanner.tsx
'use client';

import React, { useRef, useState } from 'react';
import { CloudUpload } from 'lucide-react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

interface UploadBannerProps {
  onFileUpload: (file: File) => Promise<void>;
  uploading: boolean;
}

const UploadBanner: React.FC<UploadBannerProps> = ({ onFileUpload, uploading }) => {
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ];
    if (!allowedTypes.includes(file.type)) {
      await MySwal.fire("Invalid file", "Only PDF or Word documents are allowed.", "warning");
      return;
    }
    await onFileUpload(file);
  };

  return (
    <div
      onClick={() => fileInputRef.current?.click()}
      onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
      onDragEnter={(e) => { e.preventDefault(); setDragOver(true); }}
      onDragLeave={(e) => { e.preventDefault(); setDragOver(false); }}
      onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFiles(e.dataTransfer.files); }}
      role="button"
      tabIndex={0}
      className={`w-full border-2 transition-colors rounded-xl p-6 cursor-pointer flex flex-col md:flex-row items-center justify-center gap-6 ${dragOver ? "border-blue-500" : "border-dashed border-gray-300"}`}
    >
      <div className="flex flex-col items-center justify-center gap-2 text-center">
        <div className="p-3 rounded-lg bg-gradient-to-r from-blue-100 to-blue-200">
          <CloudUpload className="h-8 w-8 text-blue-600" />
        </div>
        <p className="font-semibold text-lg">Upload or Drag & Drop your resume</p>
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.doc,.docx"
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
    </div>
  );
};

export default UploadBanner;
