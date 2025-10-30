"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import axios, { AxiosProgressEvent } from "axios";
import { v4 as uuidv4 } from "uuid";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Edit3, Printer, CloudUpload, X } from "lucide-react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext/AuthContext";
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
   - Professional, accessible, cancelable upload with live progress
----------------------- */
const UploadBanner: React.FC<{
  onFileUpload: (file: File, onProgress: (percent: number) => void, setCancel: (fn: (() => void) | null) => void) => Promise<void>;
  uploading: boolean;
}> = ({ onFileUpload, uploading }) => {
  const [dragOver, setDragOver] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentFileName, setCurrentFileName] = useState<string | null>(null);
  const [cancelFn, setCancelFn] = useState<(() => void) | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const prettyBytes = (n: number) => {
    if (n < 1024) return `${n} B`;
    if (n < 1024 * 1024) return `${Math.round(n / 1024)} KB`;
    return `${(n / (1024 * 1024)).toFixed(2)} MB`;
  };

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    const maxSizeBytes = 10 * 1024 * 1024; // 10MB

    if (!allowedTypes.includes(file.type)) {
      await MySwal.fire("Invalid file", "Only PDF or Word documents are allowed.", "warning");
      return;
    }
    if (file.size > maxSizeBytes) {
      await MySwal.fire("File too large", "Please upload a file smaller than 10MB.", "warning");
      return;
    }

    setCurrentFileName(`${file.name} • ${prettyBytes(file.size)}`);
    setProgress(0);

    try {
      await onFileUpload(file, (percent: number) => setProgress(percent), (fn) => setCancelFn(() => fn));
    } finally {
      // reset UI after a small delay to allow UX smoothness
      setTimeout(() => {
        setCurrentFileName(null);
        setProgress(0);
        setCancelFn(null);
      }, 700);
    }
  };

  return (
    <div
      onClick={() => fileInputRef.current?.click()}
      onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
      onDragEnter={(e) => { e.preventDefault(); setDragOver(true); }}
      onDragLeave={(e) => { e.preventDefault(); setDragOver(false); }}
      onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFiles(e.dataTransfer.files); }}
      role="button"
      aria-label="Upload resume"
      tabIndex={0}
      className={`w-full border-2 transition-colors rounded-xl p-6 cursor-pointer flex flex-col md:flex-row items-center justify-between gap-6 ${dragOver ? "border-blue-500 bg-blue-50" : "border-dashed border-gray-300"}`}
    >
      <div className="flex items-center justify-center md:justify-start gap-4 w-full">
        <div className="p-3 rounded-lg bg-gradient-to-r from-blue-100 to-blue-200 flex items-center justify-center">
          <CloudUpload className="h-7 w-7 text-blue-600" />
        </div>
        <div className="text-left hidden md:block">
          <p className="font-semibold text-lg">Upload or Drag & Drop your resume</p>
          <p className="text-sm text-muted-foreground mt-1 max-w-md">We accept PDF, DOC and DOCX files. Max 10MB. We’ll auto-fill your resume — you can edit after upload.</p>
          <div className="mt-2">
            {uploading && currentFileName ? (
              <div className="space-y-1">
                <div className="text-xs text-muted-foreground">Uploading: <span className="font-medium">{currentFileName}</span></div>
                <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div style={{ width: `${progress}%` }} className="h-2 bg-gradient-to-r from-blue-600 to-blue-500 transition-all" />
                </div>
                <div className="flex items-center justify-between mt-1">
                  <div className="text-xs text-muted-foreground">{progress}%</div>
                  <div>
                    {cancelFn && (
                      <button className="text-xs px-2 py-1 bg-red-600 text-white rounded-md hover:bg-red-700" onClick={(e) => { e.stopPropagation(); cancelFn(); }}>
                        <X className="inline-block mr-1" /> Cancel
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-xs text-muted-foreground mt-2">Click or drop a file here to upload.</div>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden md:block text-sm text-muted-foreground">Accept: PDF, DOC, DOCX</div>
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.doc,.docx"
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
        <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()} disabled={uploading}>Choose file</Button>
      </div>
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
    <div className="fixed inset-0 bg-black/80 z-50 flex justify-center items-center">
      <iframe id="resume-iframe" src={pdfUrl} className="w-[90%] h-[95%] border-none bg-white" />
      <button onClick={onClose} className="fixed top-6 right-6 bg-muted/30 px-3 py-2 rounded-md text-white shadow-md hover:bg-muted/50 transition">Close</button>
    </div>
  );
};

/* -----------------------
   DashboardResume Component
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
    } catch (err) {
      setResumes([]);
    } finally { setLoading(false); }
  }, [userEmail]);

  useEffect(() => { fetchResumes(); }, [fetchResumes]);

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
    } catch (err) {
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
    } catch (err) {
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
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to open PDF preview";
      await MySwal.fire("Error", message, "error");
    }
  };

  // Upload file with progress + cancel support


const handleFileUpload = useCallback(
  async (file: File, onProgress: (percent: number) => void): Promise<void> => {
    if (!userEmail) {
      await Swal.fire("Not signed in", "Please sign in to upload files.", "warning");
      return;
    }
    setUploading(true);

    try {
      const form = new FormData();
      form.append("pdf", file);
      form.append("userEmail", userEmail);
      form.append("title", file.name);

      const res = await axios.post("/resume/api/pdf/upload-pdf", form, {
        headers: { "Content-Type": "multipart/form-data" },
        timeout: 120000,
        onUploadProgress: (progressEvent: AxiosProgressEvent) => {
          if (progressEvent.total) {
            const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            onProgress(percent);
          }
        },
      });

      if (res.data?.success && res.data?.resumeId) {
        const newResumeId = res.data.resumeId as string;
        localStorage.setItem("resume_draft_id", newResumeId);
        localStorage.setItem("resumeCurrentStep", "0");

        await Swal.fire("Uploaded", "Resume created from uploaded file.", "success");
        fetchResumes();
        router.push(`/resume/${newResumeId}`);
      } else {
        throw new Error(res.data?.message ?? "Upload failed");
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Could not upload file";
      await Swal.fire("Upload failed", message, "error");
    } finally {
      setUploading(false);
    }
  },
  [userEmail, fetchResumes, router]
);

  const filteredResumes = resumes
    .filter(r => filter === "all" ? true : (r.resumeStatus ?? "draft") === filter)
    .filter(r => query ? (r.title ?? r.id).toLowerCase().includes(query.toLowerCase()) : true)
    .sort((a, b) => sort === "updatedAt_desc" ? (b.updatedAt ?? "").localeCompare(a.updatedAt ?? "") : (a.updatedAt ?? "").localeCompare(b.updatedAt ?? ""));

  return (
    <PrivateRoute>
      <div className="p-4 sm:p-6 space-y-6">

        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Your Resumes</h1>
            <p className="text-sm text-muted-foreground">Manage, upload, and create resumes quickly.</p>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <Input placeholder="Search..." value={query} onChange={e => setQuery(e.target.value)} className="w-48 sm:w-64" />

            <select value={filter} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFilter(e.target.value as "all" | "draft" | "complete")} className="border rounded px-3 py-2 text-sm">
              <option value="all">All</option>
              <option value="draft">Draft</option>
              <option value="complete">Complete</option>
            </select>

            <select value={sort} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSort(e.target.value as "updatedAt_desc" | "updatedAt_asc")} className="border rounded px-3 py-2 text-sm">
              <option value="updatedAt_desc">Newest</option>
              <option value="updatedAt_asc">Oldest</option>
            </select>
          </div>
        </div>

        {/* Upload Banner */}
        <Card className="p-4">
          <UploadBanner onFileUpload={handleFileUpload} uploading={uploading} />
        </Card>

        {/* Create Resume */}
        <Card className="p-4 flex flex-col md:flex-row items-center justify-between gap-4 rounded-xl">
          <div>
            <h2 className="font-semibold text-lg">Start a New Resume</h2>
            <p className="text-sm text-muted-foreground">Create a resume from scratch using templates and our editor.</p>
          </div>
          <Button size="lg" onClick={handleCreateResume} disabled={creating} className="flex items-center gap-2">
            <Plus className="h-4 w-4" /> {creating ? "Creating..." : "Create Resume"}
          </Button>
        </Card>

        {/* Resume List */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="animate-pulse border rounded-2xl overflow-hidden shadow-md">
                <div className="bg-gray-200 h-40 w-full"></div>
                <div className="p-4">
                  <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2 mb-1"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredResumes.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <p className="mb-4">No resumes found.</p>
            <Button onClick={handleCreateResume} className="flex items-center gap-2">
              <Plus className="h-4 w-4" /> Create your first resume
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredResumes.map((r) => (
              <div key={r.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300 border rounded-2xl">
                <div className="relative h-40 bg-gray-100">
                  <Image
                    src={r.thumbnailUrl || "/assets/default-thumbnail.jpg"}
                    alt={r.title || r.id}
                    width={800}
                    height={400}
                    className="w-full h-full object-cover"
                  />
                  <Badge className={`absolute top-3 left-3 ${r.resumeStatus === "complete" ? "bg-green-600" : "bg-blue-600"} text-white`}>
                    {r.resumeStatus || "draft"}
                  </Badge>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg truncate">{r.title}</h3>
                  <p className="text-xs text-muted-foreground">Updated: {r.updatedAt ? new Date(r.updatedAt).toLocaleString() : "-"}</p>
                  <p className="text-xs text-muted-foreground mt-1">Template: {r.template?.name || "Default"}</p>
                  <div className="flex justify-end gap-1 mt-3">
                    <Button variant="ghost" size="sm" onClick={() => router.push(`/resume/${r.id}`)} title="Edit">
                      <Edit3 className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handlePdfPreview(r.id)} title="Preview">
                      <Printer className="h-4 w-4" />
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(r.id)} title="Delete">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* PDF Overlay */}
        {pdfUrl && <ResumePrintOverlay pdfUrl={pdfUrl} onClose={() => { URL.revokeObjectURL(pdfUrl); setPdfUrl(null); }} />}

      </div>
    </PrivateRoute>
  );
}












// "use client";

// import React, {
//   useCallback,
//   useEffect,
//   useMemo,
//   useRef,
//   useState,
// } from "react";
// import { useRouter } from "next/navigation";
// import { v4 as uuidv4 } from "uuid";
// import { Button } from "@/components/ui/button";
// import { Card } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Badge } from "@/components/ui/badge";
// import {
//   Plus,
//   Trash2,
//   Edit3,
//   Printer,
//   CloudUpload,
//   X,
// } from "lucide-react";
// import Swal from "sweetalert2";
// import withReactContent from "sweetalert2-react-content";
// import Image from "next/image";
// import { useAuth } from "@/context/AuthContext/AuthContext";
// import PrivateRoute from "@/app/Routes/PrivateRoute";

// const MySwal = withReactContent(Swal);

// /* -----------------------
//    Types
// ----------------------- */
// interface ResumeTemplate {
//   id?: string;
//   name?: string;
//   layout?: string;
//   sections?: string[];
// }
// interface ResumeTheme {
//   id?: string;
//   name?: string;
//   primaryColor?: string;
//   accentColor?: string;
//   textColor?: string;
//   backgroundColor?: string;
//   fontFamily?: string;
// }
// interface ResumeItem {
//   id: string;
//   userEmail: string;
//   title?: string;
//   resumeStatus?: "draft" | "complete";
//   updatedAt?: string;
//   createdAt?: string;
//   template?: ResumeTemplate;
//   theme?: ResumeTheme;
//   thumbnailUrl?: string;
// }
// interface ApiListResponse {
//   success: boolean;
//   resumes: ResumeItem[];
// }
// interface UploadResult {
//   success: boolean;
//   resumeId?: string;
//   message?: string;
// }

// /* -----------------------
//    Helpers
// ----------------------- */
// function prettyBytes(n: number): string {
//   if (n < 1024) return `${n} B`;
//   if (n < 1024 * 1024) return `${Math.round(n / 1024)} KB`;
//   return `${(n / (1024 * 1024)).toFixed(2)} MB`;
// }

// function debounce<T extends (...args: unknown[]) => void>(
//   fn: T,
//   ms = 250
// ): (...args: Parameters<T>) => void {
//   let t = 0;
//   return (...args: Parameters<T>) => {
//     window.clearTimeout(t);
//     // @ts-expect-error setTimeout return type
//     t = window.setTimeout(() => fn(...args), ms);
//   };
// }

// /* -----------------------
//    UploadBanner
// ----------------------- */
// type OnUploadProgress = (percent: number) => void;
// type SetCancelFn = (fn: (() => void) | null) => void;
// type UploadHandler = (
//   file: File,
//   onProgress: OnUploadProgress,
//   setCancel: SetCancelFn
// ) => Promise<UploadResult>;

// function UploadBanner(props: {
//   onUpload: UploadHandler;
//   uploading: boolean;
// } ) {
//   const { onUpload, uploading } = props;
//   const fileRef = useRef<HTMLInputElement | null>(null);
//   const [drag, setDrag] = useState<boolean>(false);
//   const [progress, setProgress] = useState<number>(0);
//   const [fileLabel, setFileLabel] = useState<string | null>(null);
//   const [cancelFn, setCancelFn] = useState<(() => void) | null>(null);

//   const handleFiles = useCallback(
//     async (files: FileList | null) => {
//       if (!files || files.length === 0) return;
//       const file = files[0];
//       const allowed = [
//         "application/pdf",
//         "application/msword",
//         "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
//       ];
//       const maxSize = 10 * 1024 * 1024;
//       if (!allowed.includes(file.type)) {
//         await MySwal.fire("Invalid file", "Only PDF or Word files allowed.", "warning");
//         return;
//       }
//       if (file.size > maxSize) {
//         await MySwal.fire("File too large", "Max 10MB.", "warning");
//         return;
//       }

//       setFileLabel(`${file.name} • ${prettyBytes(file.size)}`);
//       setProgress(0);

//       try {
//         const res = await onUpload(
//           file,
//           (p) => setProgress(p),
//           (fn) => setCancelFn(() => fn)
//         );
//         if (!res.success) {
//           await MySwal.fire("Upload failed", res.message ?? "Unknown error", "error");
//         }
//       } catch (err) {
//         await MySwal.fire("Upload failed", "Unexpected error", "error");
//       } finally {
//         setTimeout(() => {
//           setFileLabel(null);
//           setProgress(0);
//           setCancelFn(null);
//         }, 600);
//       }
//     },
//     [onUpload]
//   );

//   return (
//     <div
//       role="button"
//       tabIndex={0}
//       aria-label="Upload resume"
//       className={`w-full border-2 rounded-xl p-6 cursor-pointer flex flex-col md:flex-row items-center justify-between gap-6 transition-colors ${
//         drag ? "border-blue-500 bg-blue-50" : "border-dashed border-gray-300"
//       }`}
//       onClick={() => fileRef.current?.click()}
//       onDragOver={(e: React.DragEvent<HTMLDivElement>) => {
//         e.preventDefault();
//         setDrag(true);
//       }}
//       onDragEnter={(e: React.DragEvent<HTMLDivElement>) => {
//         e.preventDefault();
//         setDrag(true);
//       }}
//       onDragLeave={(e: React.DragEvent<HTMLDivElement>) => {
//         e.preventDefault();
//         setDrag(false);
//       }}
//       onDrop={(e: React.DragEvent<HTMLDivElement>) => {
//         e.preventDefault();
//         setDrag(false);
//         handleFiles(e.dataTransfer.files);
//       }}
//     >
//       <div className="flex items-center gap-4 w-full md:w-auto">
//         <div className="p-3 rounded-lg bg-gradient-to-r from-blue-100 to-blue-200 flex items-center justify-center">
//           <CloudUpload className="h-7 w-7 text-blue-600" />
//         </div>
//         <div className="text-left flex-1">
//           <p className="font-semibold text-lg">Upload or Drag & Drop</p>
//           <p className="text-sm text-muted-foreground mt-1 max-w-md">
//             PDF, DOC, DOCX • Max 10MB. We’ll auto-fill your resume — edit after upload.
//           </p>

//           <div className="mt-3">
//             {uploading && fileLabel ? (
//               <>
//                 <div className="text-xs text-muted-foreground">
//                   Uploading: <span className="font-medium">{fileLabel}</span>
//                 </div>
//                 <div className="w-full bg-gray-200 rounded-full h-2 mt-2 overflow-hidden">
//                   <div style={{ width: `${progress}%` }} className="h-2 bg-gradient-to-r from-blue-600 to-blue-500 transition-all" />
//                 </div>
//                 <div className="flex items-center justify-between mt-1">
//                   <div className="text-xs text-muted-foreground">{progress}%</div>
//                   <div>
//                     {cancelFn && (
//                       <button
//                         className="text-xs px-2 py-1 bg-red-600 text-white rounded-md hover:bg-red-700"
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           cancelFn();
//                           setCancelFn(null);
//                         }}
//                       >
//                         <X className="inline-block mr-1" /> Cancel
//                       </button>
//                     )}
//                   </div>
//                 </div>
//               </>
//             ) : (
//               <div className="text-xs text-muted-foreground">Click or drop a file here to upload.</div>
//             )}
//           </div>
//         </div>
//       </div>

//       <div className="flex items-center gap-3">
//         <div className="hidden md:block text-sm text-muted-foreground">Accept: PDF, DOC, DOCX</div>
//         <input
//           ref={fileRef}
//           type="file"
//           accept=".pdf,.doc,.docx"
//           className="hidden"
//           onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFiles(e.target.files)}
//         />
//         <Button variant="outline" size="sm" onClick={() => fileRef.current?.click()} disabled={uploading}>
//           Choose file
//         </Button>
//       </div>
//     </div>
//   );
// }

// /* -----------------------
//    ResumePrintOverlay
// ----------------------- */
// function ResumePrintOverlay(props: { pdfUrl: string; onClose: () => void }) {
//   const { pdfUrl, onClose } = props;
//   useEffect(() => {
//     function onKey(e: KeyboardEvent) {
//       if (e.key === "Escape") onClose();
//     }
//     document.addEventListener("keydown", onKey);
//     const timer = window.setTimeout(() => {
//       const iframe = document.getElementById("resume-iframe") as HTMLIFrameElement | null;
//       iframe?.contentWindow?.focus();
//       iframe?.contentWindow?.print();
//     }, 500);
//     return () => {
//       document.removeEventListener("keydown", onKey);
//       clearTimeout(timer);
//     };
//   }, [onClose]);

//   return (
//     <div className="fixed inset-0 bg-black/80 z-50 flex justify-center items-center">
//       <iframe id="resume-iframe" src={pdfUrl} title="Resume Preview" className="w-[90%] h-[95%] border-none bg-white" />
//       <button onClick={onClose} className="fixed top-6 right-6 bg-muted/30 px-3 py-2 rounded-md text-white shadow-md hover:bg-muted/50 transition">Close</button>
//     </div>
//   );
// }

// /* -----------------------
//    Main DashboardResume page (full)
// ----------------------- */
// export default function DashboardResumePage() {
//   const router = useRouter();
//   const { user } = useAuth();
//   const userEmail = user?.email ?? "";

//   const [resumes, setResumes] = useState<ResumeItem[]>([]);
//   const [loading, setLoading] = useState<boolean>(false);
//   const [creating, setCreating] = useState<boolean>(false);
//   const [uploading, setUploading] = useState<boolean>(false);
//   const [query, setQuery] = useState<string>("");
//   const [filter, setFilter] = useState<"all" | "draft" | "complete">("all");
//   const [sort, setSort] = useState<"updatedAt_desc" | "updatedAt_asc">("updatedAt_desc");
//   const [pdfUrl, setPdfUrl] = useState<string | null>(null);

//   const mountedRef = useRef<boolean>(false);

//   const loadResumes = useCallback(async () => {
//     if (!userEmail) return;
//     setLoading(true);
//     try {
//       const r = await fetch(`/resume/api/list?userEmail=${encodeURIComponent(userEmail)}`);
//       const json = (await r.json()) as ApiListResponse;
//       setResumes(json.success ? json.resumes : []);
//     } catch (e) {
//       setResumes([]);
//     } finally {
//       setLoading(false);
//     }
//   }, [userEmail]);

//   useEffect(() => {
//     // initial load
//     if (!mountedRef.current) {
//       mountedRef.current = true;
//       loadResumes();
//     }
//   }, [loadResumes]);

//   const createResume = useCallback(async () => {
//     if (!userEmail) {
//       await MySwal.fire("Not signed in", "Please sign in first.", "warning");
//       return;
//     }
//     setCreating(true);
//     const newId = uuidv4();
//     const payload: ResumeItem = {
//       id: newId,
//       userEmail,
//       resumeStatus: "draft",
//       createdAt: new Date().toISOString(),
//       updatedAt: new Date().toISOString(),
//       title: "Untitled Resume",
//       template: { id: "default", name: "Classic", layout: "classic", sections: [] },
//       theme: { id: "default", name: "Default", primaryColor: "#2563eb", accentColor: "#9333ea", textColor: "#111827", backgroundColor: "#ffffff", fontFamily: "Inter" },
//     };
//     try {
//       await fetch("/resume/api/saveResume", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });
//       localStorage.setItem("resume_draft_id", newId);
//       localStorage.setItem("resumeCurrentStep", "0");
//       router.push(`/resume/${newId}`);
//     } catch (e) {
//       const msg = e instanceof Error ? e.message : "Could not create resume";
//       await MySwal.fire("Error", msg, "error");
//     } finally {
//       setCreating(false);
//     }
//   }, [router, userEmail]);

//   const deleteResume = useCallback(async (id: string) => {
//     const res = await MySwal.fire({
//       title: "Delete resume?",
//       text: "This cannot be undone.",
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonText: "Delete",
//     });
//     if (!res.isConfirmed) return;
//     try {
//       await fetch(`/resume/api/delete?id=${encodeURIComponent(id)}&userEmail=${encodeURIComponent(userEmail)}`, { method: "DELETE" });
//       setResumes((prev) => prev.filter((p) => p.id !== id));
//       await MySwal.fire("Deleted", "Resume removed.", "success");
//     } catch (e) {
//       const msg = e instanceof Error ? e.message : "Failed to delete";
//       await MySwal.fire("Error", msg, "error");
//     }
//   }, [userEmail]);

//   const previewPdf = useCallback(async (id: string) => {
//     try {
//       const r = await fetch(`/resume/api/pdf/view-pdf?resumeId=${id}`);
//       if (!r.ok) throw new Error("Failed to fetch PDF");
//       const blob = await r.blob();
//       const url = URL.createObjectURL(blob);
//       setPdfUrl(url);
//     } catch (e) {
//       const msg = e instanceof Error ? e.message : "Failed to open PDF preview";
//       await MySwal.fire("Error", msg, "error");
//     }
//   }, []);

//   // Upload via XMLHttpRequest to handle progress + cancel
//   const uploadHandler = useCallback<UploadHandler>(
//     (file, onProgress, setCancel) =>
//       new Promise<UploadResult>((resolve) => {
//         if (!userEmail) {
//           MySwal.fire("Not signed in", "Please sign in to upload files.", "warning");
//           resolve({ success: false, message: "Not signed in" });
//           return;
//         }

//         setUploading(true);
//         const xhr = new XMLHttpRequest();
//         const form = new FormData();
//         form.append("pdf", file);
//         form.append("userEmail", userEmail);
//         form.append("title", file.name);

//         xhr.open("POST", "/resume/api/pdf/upload-pdf");
//         xhr.timeout = 120_000;

//         xhr.upload.onprogress = (e: ProgressEvent<EventTarget>) => {
//           if (e.lengthComputable) {
//             const pct = Math.round((e.loaded * 100) / e.total);
//             onProgress(pct);
//           }
//         };

//         xhr.onload = async () => {
//           setUploading(false);
//           try {
//             const json = JSON.parse(xhr.responseText) as UploadResult;
//             if (json.success && json.resumeId) {
//               localStorage.setItem("resume_draft_id", json.resumeId);
//               localStorage.setItem("resumeCurrentStep", "0");
//               await MySwal.fire("Uploaded", "Resume created from uploaded file.", "success");
//               await loadResumes();
//               // navigate after short delay to allow UI settle
//               window.setTimeout(() => void router.push(`/resume/${json.resumeId}`), 100);
//               resolve(json);
//             } else {
//               resolve(json);
//             }
//           } catch (e) {
//             resolve({ success: false, message: "Invalid server response" });
//           }
//         };

//         xhr.onerror = () => {
//           setUploading(false);
//           resolve({ success: false, message: "Network error" });
//         };

//         xhr.ontimeout = () => {
//           setUploading(false);
//           resolve({ success: false, message: "Upload timed out" });
//         };

//         // cancel handler
//         setCancel(() => () => {
//           xhr.abort();
//           setUploading(false);
//           // show canceled alert
//           void MySwal.fire("Cancelled", "Upload cancelled.", "info");
//           resolve({ success: false, message: "Cancelled" });
//         });

//         xhr.send(form);
//       }),
//     [userEmail, loadResumes, router]
//   );

//   // search + filter memoization
//   const filtered = useMemo(() => {
//     const q = query.trim().toLowerCase();
//     const list = resumes
//       .filter((r) => (filter === "all" ? true : (r.resumeStatus ?? "draft") === filter))
//       .filter((r) => (q ? (r.title ?? r.id).toLowerCase().includes(q) : true))
//       .sort((a, b) => (sort === "updatedAt_desc" ? (b.updatedAt ?? "").localeCompare(a.updatedAt ?? "") : (a.updatedAt ?? "").localeCompare(b.updatedAt ?? "")));
//     return list;
//   }, [resumes, filter, sort, query]);

//   // debounced input update
//   const setQueryDebounced = useMemo(() => debounce((v: string) => setQuery(v), 180), []);

//   return (
//     <PrivateRoute>
//       <div className="p-4 sm:p-6 space-y-6">
//         <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
//           <div>
//             <h1 className="text-2xl md:text-3xl font-bold">Your Resumes</h1>
//             <p className="text-sm text-muted-foreground">Manage, upload, and create resumes quickly.</p>
//           </div>

//           <div className="flex items-center gap-3 flex-wrap">
//             <Input placeholder="Search..." onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQueryDebounced(e.target.value)} className="w-48 sm:w-64" />
//             <select value={filter} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFilter(e.target.value as "all" | "draft" | "complete")} className="border rounded px-3 py-2 text-sm">
//               <option value="all">All</option>
//               <option value="draft">Draft</option>
//               <option value="complete">Complete</option>
//             </select>
//             <select value={sort} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSort(e.target.value as "updatedAt_desc" | "updatedAt_asc")} className="border rounded px-3 py-2 text-sm">
//               <option value="updatedAt_desc">Newest</option>
//               <option value="updatedAt_asc">Oldest</option>
//             </select>
//           </div>
//         </div>

//         <Card className="p-4">
//           <UploadBanner onUpload={uploadHandler} uploading={uploading} />
//         </Card>

//         <Card className="p-4 flex flex-col md:flex-row items-center justify-between gap-4 rounded-xl">
//           <div>
//             <h2 className="font-semibold text-lg">Start a New Resume</h2>
//             <p className="text-sm text-muted-foreground">Create a resume from scratch using templates and our editor.</p>
//           </div>
//           <Button size="lg" onClick={createResume} disabled={creating} className="flex items-center gap-2">
//             <Plus className="h-4 w-4" /> {creating ? "Creating..." : "Create Resume"}
//           </Button>
//         </Card>

//         {loading ? (
//           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
//             {Array.from({ length: 8 }).map((_, i) => (
//               <div key={i} className="animate-pulse border rounded-2xl overflow-hidden shadow-md">
//                 <div className="bg-gray-200 h-40 w-full" />
//                 <div className="p-4">
//                   <div className="h-5 bg-gray-200 rounded w-3/4 mb-2" />
//                   <div className="h-3 bg-gray-200 rounded w-1/2 mb-1" />
//                   <div className="h-3 bg-gray-200 rounded w-1/3" />
//                 </div>
//               </div>
//             ))}
//           </div>
//         ) : filtered.length === 0 ? (
//           <div className="text-center py-20 text-muted-foreground">
//             <p className="mb-4">No resumes found.</p>
//             <Button onClick={createResume} className="flex items-center gap-2">
//               <Plus className="h-4 w-4" /> Create your first resume
//             </Button>
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
//             {filtered.map((r) => (
//               <Card key={r.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300 border rounded-2xl">
//                 <div className="relative h-40 bg-gray-100">
//                   <Image src={r.thumbnailUrl ?? "/assets/default-thumbnail.jpg"} alt={r.title ?? r.id} width={800} height={400} className="w-full h-full object-cover" />
//                   <Badge className={`absolute top-3 left-3 ${r.resumeStatus === "complete" ? "bg-green-600" : "bg-blue-600"} text-white`}>
//                     {r.resumeStatus ?? "draft"}
//                   </Badge>
//                 </div>

//                 <div className="p-4">
//                   <h3 className="font-semibold text-lg truncate">{r.title}</h3>
//                   <p className="text-xs text-muted-foreground">Updated: {r.updatedAt ? new Date(r.updatedAt).toLocaleString() : "-"}</p>
//                   <p className="text-xs text-muted-foreground mt-1">Template: {r.template?.name ?? "Default"}</p>

//                   <div className="flex justify-end gap-1 mt-3">
//                     <Button variant="ghost" size="sm" onClick={() => router.push(`/resume/${r.id}`)} title="Edit">
//                       <Edit3 className="h-4 w-4" />
//                     </Button>
//                     <Button variant="ghost" size="sm" onClick={() => previewPdf(r.id)} title="Preview">
//                       <Printer className="h-4 w-4" />
//                     </Button>
//                     <Button variant="destructive" size="sm" onClick={() => deleteResume(r.id)} title="Delete">
//                       <Trash2 className="h-4 w-4" />
//                     </Button>
//                   </div>
//                 </div>
//               </Card>
//             ))}
//           </div>
//         )}

//         {pdfUrl && <ResumePrintOverlay pdfUrl={pdfUrl} onClose={() => { URL.revokeObjectURL(pdfUrl); setPdfUrl(null); }} />}
//       </div>
//     </PrivateRoute>
//   );
// }
