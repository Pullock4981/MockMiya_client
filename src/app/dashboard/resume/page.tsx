"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Edit3, Printer, CloudUpload } from "lucide-react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import PrivateRoute from "@/app/Routes/PrivateRoute";

const MySwal = withReactContent(Swal);

interface ResumeTemplate { id?: string; name?: string; layout?: string; sections?: string[] }
interface ResumeTheme { id?: string; name?: string; primaryColor?: string; accentColor?: string; textColor?: string; backgroundColor?: string; fontFamily?: string }
interface ResumeItem {
  id: string;
  userEmail: string;
  title?: string;
  resumeStatus?: "draft" | "complete";
  updatedAt?: string;
  createdAt?: string;
  template?: ResumeTemplate;
  theme?: ResumeTheme;
  thumbnailUrl?: string;
}
interface ApiResponse { success: boolean; resumes: ResumeItem[] }

/* -----------------------
   UploadBanner Component
   ----------------------- */
const UploadBanner: React.FC<{ onFileUpload: (file: File) => Promise<void>; uploading: boolean; }> = ({ onFileUpload, uploading }) => {
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

/* -----------------------
   ResumePrintOverlay Component
   ----------------------- */
const ResumePrintOverlay: React.FC<{ pdfUrl: string; onClose: () => void }> = ({ pdfUrl, onClose }) => {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handleEsc);

    const timer = setTimeout(() => {
      const iframe = document.getElementById("resume-iframe") as HTMLIFrameElement | null;
      iframe?.contentWindow?.focus();
      iframe?.contentWindow?.print();
    }, 500);

    return () => {
      document.removeEventListener("keydown", handleEsc);
      clearTimeout(timer);
    };
  }, [onClose]);

  return (
    <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", backgroundColor: "rgba(0,0,0,0.8)", zIndex: 9999, display: "flex", justifyContent: "center", alignItems: "center" }}>
      <iframe
        id="resume-iframe"
        src={pdfUrl}
        style={{ width: "90%", height: "95%", border: "none", backgroundColor: "#fff" }}
      />
      <button onClick={onClose} className="fixed top-6 right-6 bg-muted/30 px-3 py-2 rounded-md cursor-pointer z-[10000] shadow-md hover:bg-muted/50 transition text-white">Close</button>
    </div>
  );
};

/* -----------------------
   DashboardResume Page Component
   ----------------------- */
export default function DashboardResume() {
  const router = useRouter();
  const { user } = useAuth();
  const userEmail = user?.email ?? "";

  const [resumes, setResumes] = useState<ResumeItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "draft" | "complete">("all");
  const [sort, setSort] = useState<"updatedAt_desc" | "updatedAt_asc">("updatedAt_desc");
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  const fetchResumes = useCallback(async () => {
    if (!userEmail) return;
    setLoading(true);
    try {
      const res = await axios.get<ApiResponse>(`/resume/api/list?userEmail=${encodeURIComponent(userEmail)}`);
      setResumes(res.data.success ? res.data.resumes : []);
    } catch (err: unknown) {
      console.error("❌ Failed to fetch resumes:", err);
      setResumes([]);
    } finally { setLoading(false); }
  }, [userEmail]);

  useEffect(() => { fetchResumes(); }, [fetchResumes, filter, sort]);

  const handleCreateResume = useCallback(async () => {
    if (!userEmail) { await MySwal.fire("Not signed in", "Please sign in first.", "warning"); return; }
    setCreating(true);
    const newId = uuidv4();
    const payload: ResumeItem = {
      id: newId,
      userEmail,
      resumeStatus: "draft",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      title: "Untitled Resume",
      template: { id: "default", name: "Classic", layout: "classic", sections: [] },
      theme: { id: "default", name: "Default", primaryColor: "#2563eb", accentColor: "#9333ea", textColor: "#111827", backgroundColor: "#ffffff", fontFamily: "Inter" },
    };
    try {
      await axios.post("/resume/api/saveResume", payload);
      localStorage.setItem("resume_draft_id", newId);
      localStorage.setItem("resumeCurrentStep", "0");
      router.push(`/resume/${newId}`);
    } catch (err: unknown) {
      console.error("❌ Failed to create resume:", err);
      const message = err instanceof Error ? err.message : "Could not create resume";
      await MySwal.fire("Error", message, "error");
    } finally { setCreating(false); }
  }, [router, userEmail]);

  const handleDelete = useCallback(async (id: string) => {
    const result = await MySwal.fire({ title: "Delete resume?", text: "This cannot be undone.", icon: "warning", showCancelButton: true, confirmButtonText: "Delete" });
    if (!result.isConfirmed) return;
    try {
      await axios.delete(`/resume/api/delete?id=${encodeURIComponent(id)}&userEmail=${encodeURIComponent(userEmail)}`);
      setResumes(prev => prev.filter(r => r.id !== id));
      await MySwal.fire("Deleted", "Resume removed.", "success");
    } catch (err: unknown) {
      console.error("❌ Failed to delete resume:", err);
      const message = err instanceof Error ? err.message : "Failed to delete";
      await MySwal.fire("Error", message, "error");
    }
  }, [userEmail]);

  const handlePdfPreview = async (id: string) => {
    try {
      const response = await fetch(`/resume/api/pdf/view-pdf?resumeId=${id}`);
      if (!response.ok) throw new Error("Failed to fetch PDF");
      const pdfBlob = await response.blob();
      const url = URL.createObjectURL(pdfBlob);
      setPdfUrl(url);
    } catch (err: unknown) {
      console.error(err);
      const message = err instanceof Error ? err.message : "Failed to open PDF preview";
      await MySwal.fire("Error", message, "error");
    }
  };

  const handleFileUpload = useCallback(async (file: File) => {
    if (!userEmail) { await MySwal.fire("Not signed in", "Please sign in to upload files.", "warning"); return; }
    setUploading(true);
    try {
      const form = new FormData();
      form.append("file", file);
      form.append("userEmail", userEmail);

      const res = await axios.post<{ success: boolean; message?: string }>("/resume/api/upload", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data.success) {
        await MySwal.fire("Uploaded", "File uploaded successfully. A resume has been created.", "success");
        await fetchResumes();
      } else {
        throw new Error(res.data.message ?? "Upload failed");
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Could not upload file";
      console.error("Upload failed:", message);
      await MySwal.fire("Upload failed", message, "error");
    } finally {
      setUploading(false);
    }
  }, [userEmail, fetchResumes]);

  const filteredResumes = resumes
    .filter(r => filter === "all" ? true : (r.resumeStatus ?? "draft") === filter)
    .filter(r => query ? (r.title ?? r.id).toLowerCase().includes(query.toLowerCase()) : true)
    .sort((a, b) => sort === "updatedAt_desc" ? (b.updatedAt ?? "").localeCompare(a.updatedAt ?? "") : (a.updatedAt ?? "").localeCompare(b.updatedAt ?? ""));

  return (
    <PrivateRoute>
      <div className="p-4 sm:p-6 space-y-6">
        {/* UI code remains same */}
      </div>
    </PrivateRoute>
  );
}
