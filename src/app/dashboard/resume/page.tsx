"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Download, Plus, Trash2, Edit3, Printer } from "lucide-react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";

// PDF Overlay Component (reusable from ResumeControls)
const ResumePrintOverlay = ({
  pdfUrl,
  onClose,
}: {
  pdfUrl: string;
  onClose: () => void;
}) => {
  React.useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEsc);

    const timer = setTimeout(() => {
      const iframe = document.getElementById("resume-iframe") as HTMLIFrameElement;
      iframe?.contentWindow?.focus();
      iframe?.contentWindow?.print();
    }, 500);

    return () => {
      document.removeEventListener("keydown", handleEsc);
      clearTimeout(timer);
    };
  }, [onClose]);

  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      backgroundColor: "rgba(0,0,0,0.8)",
      zIndex: 9999,
      display: "flex",
      justifyContent: "center",
      alignItems: "center"
    }}>
      <iframe
        id="resume-iframe"
        src={pdfUrl}
        style={{ width: "90%", height: "95%", border: "none", backgroundColor: "#fff" }}
      />
      <button
        onClick={onClose}
        className="fixed top-25 right-25 bg-muted/30 px-3 py-2 rounded-md cursor-pointer z-[10000] shadow-md hover:bg-muted/50 transition"
      >
        Close
      </button>
    </div>
  );
};

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

const MySwal = withReactContent(Swal);

export default function DashboardResume() {
  const router = useRouter();
  const { user } = useAuth();
  const userEmail = user?.email ?? "";

  const [resumes, setResumes] = useState<ResumeItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "draft" | "complete">("all");
  const [sort, setSort] = useState<"updatedAt_desc" | "updatedAt_asc">("updatedAt_desc");

  const [pdfUrl, setPdfUrl] = useState<string | null>(null); // PDF Overlay state

  const fetchResumes = useCallback(async () => {
    if (!userEmail) return;
    setLoading(true);
    try {
      const res = await axios.get<ApiResponse>(`/resume/api/list?userEmail=${encodeURIComponent(userEmail)}`);
      if (res.data.success) setResumes(res.data.resumes);
      else setResumes([]);
    } catch (err) {
      console.error("❌ Failed to fetch resumes:", err);
      setResumes([]);
    } finally { setLoading(false); }
  }, [userEmail]);

  useEffect(() => { fetchResumes(); }, [fetchResumes, filter, sort]);

  const handleCreateResume = useCallback(async () => {
    if (!userEmail) return await MySwal.fire("Not signed in", "Please sign in first.", "warning");

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
      console.error("❌ Failed to create resume:", err);
      await MySwal.fire("Error", "Could not create resume.", "error");
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
      console.error("❌ Failed to delete resume:", err);
      await MySwal.fire("Error", "Failed to delete.", "error");
    }
  }, [userEmail]);

  // Handle PDF Preview
  const handlePdfPreview = async (id: string) => {
    try {
      const response = await fetch(`/resume/api/pdf/view-pdf?resumeId=${id}`);
      if (!response.ok) throw new Error("Failed to fetch PDF");

      const pdfBlob = await response.blob();
      const url = URL.createObjectURL(pdfBlob);
      setPdfUrl(url);
    } catch (err) {
      console.error(err);
      alert("Failed to open PDF preview");
    }
  };

  const filteredResumes = resumes
    .filter(r => filter === "all" ? true : (r.resumeStatus ?? "draft") === filter)
    .filter(r => query ? (r.title ?? r.id).toLowerCase().includes(query.toLowerCase()) : true)
    .sort((a, b) => sort === "updatedAt_desc" ? (b.updatedAt ?? "").localeCompare(a.updatedAt ?? "") : (a.updatedAt ?? "").localeCompare(b.updatedAt ?? ""));

  return (
    <div className="p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold">Your Resumes</h1>
          <p className="text-sm text-muted-foreground">Manage, edit, and create your resumes easily.</p>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <Input placeholder="Search..." value={query} onChange={e => setQuery(e.target.value)} className="w-48 sm:w-64" />
          <select value={filter} onChange={e => setFilter(e.target.value as "all" | "draft" | "complete")} className="border rounded px-3 py-2 text-sm">
            <option value="all">All</option>
            <option value="draft">Draft</option>
            <option value="complete">Complete</option>
          </select>
          <select value={sort} onChange={e => setSort(e.target.value as "updatedAt_desc" | "updatedAt_asc")} className="border rounded px-3 py-2 text-sm">
            <option value="updatedAt_desc">Newest</option>
            <option value="updatedAt_asc">Oldest</option>
          </select>
          <Button onClick={handleCreateResume} disabled={creating}><Plus className="h-4 w-4 mr-1" /> Create Resume</Button>
        </div>
      </div>

      {loading ? <div className="text-center py-20 text-muted-foreground">Loading resumes...</div>
        : filteredResumes.length === 0
          ? <div className="text-center py-20 text-muted-foreground">
            <p className="mb-4">No resumes found.</p>
            <Button onClick={handleCreateResume}><Plus className="h-4 w-4 mr-1" /> Create your first resume</Button>
          </div>
          : <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredResumes.map(r => (
              <Card key={r.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300 border rounded-2xl">
                <div className="relative h-40 bg-gray-100">
                  <Image src={r.thumbnailUrl || "/assets/default-thumbnail.jpg"} alt={r.title || r.id} width={800} height={400} className="w-full h-full object-cover" />
                  <Badge className={`absolute top-3 left-3 ${r.resumeStatus === "complete" ? "bg-green-600" : "bg-blue-600"} text-white`}>{r.resumeStatus || "draft"}</Badge>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg truncate">{r.title}</h3>
                  <p className="text-xs text-muted-foreground">Updated: {r.updatedAt ? new Date(r.updatedAt).toLocaleString() : "-"}</p>
                  <p className="text-xs text-muted-foreground mt-1">Template: {r.template?.name || "Default"}</p>
                  <div className="flex justify-end gap-1 mt-3">
                    <Button variant="ghost" size="sm" onClick={() => router.push(`/resume/${r.id}`)} title="Edit"><Edit3 className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="sm" onClick={() => handlePdfPreview(r.id)} title="Preview"><Printer className="h-4 w-4" /></Button>
                     <Button variant="destructive" size="sm" onClick={() => handleDelete(r.id)} title="Delete"><Trash2 className="h-4 w-4" /></Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
      }

      {/* PDF Overlay */}
      {pdfUrl && <ResumePrintOverlay pdfUrl={pdfUrl} onClose={() => { URL.revokeObjectURL(pdfUrl); setPdfUrl(null); }} />}
    </div>
  );
}
