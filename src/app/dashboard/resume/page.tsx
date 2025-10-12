"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Download, Plus, Trash2, Edit3 } from "lucide-react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";

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
                    <Button variant="ghost" size="sm" title="Download"><Download className="h-4 w-4" /></Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(r.id)} title="Delete"><Trash2 className="h-4 w-4" /></Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
      }
    </div>
  );
}
