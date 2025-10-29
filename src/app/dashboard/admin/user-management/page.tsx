// // src/app/dashboard/admin/UserManagement.tsx
// "use client";

// import React, { useEffect, useMemo, useRef, useState } from "react";
// import axios, { CancelTokenSource } from "axios";
// import Swal from "sweetalert2";
// import "sweetalert2/dist/sweetalert2.min.css";
// import {
//   Users,
//   Search,
//   Filter,
//   UserPlus,
//   Mail,
//   Shield,
//   Delete,
// } from "lucide-react";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Badge } from "@/components/ui/badge";
// import { Avatar, AvatarFallback } from "@/components/ui/avatar";
// import AdminRoute from "@/app/Routes/AdminRoute";

// // ----------------- Types -----------------
// type APIUser = {
//   id: string | null;
//   name?: string | null;
//   email?: string | null;
//   role?: string | null;
//   status?: string | null;
//   membershipType?: string | null;
//   createdAt?: string | null;
//   updatedAt?: string | null;
// };

// type RecentActivity = {
//   action: string;
//   time?: string;
//   type?: string;
//   page?: string;
// };

// type Stats = {
//   total: number;
//   activeUsers: number;
//   premiumUsers: number;
//   verifiedUsers: number;
//   newLast30Days: number;
//   usersByRole: { role: string; count: number }[];
// };

// // ----------------- Small components -----------------
// const SkeletonBlock = ({ height = 40 }: { height?: number }) => (
//   <div
//     className="w-full rounded-xl animate-pulse bg-slate-200 dark:bg-slate-700"
//     style={{ height }}
//     aria-hidden
//   />
// );

// // Accept null/undefined safely
// const badgeForStatus = (s?: string | null) => {
//   if (s === "Active") return "bg-green-500 text-white";
//   if (s === "Not-Active") return "bg-red-500 text-white";
//   if (s === "Suspended") return "bg-yellow-400 text-black";
//   return "bg-gray-200 text-gray-800";
// };

// const badgeForMembership = (m?: string | null) => {
//   if (!m) return "bg-gray-200 text-gray-800";
//   if (m.toLowerCase().includes("free")) return "bg-slate-200 text-slate-800";
//   if (m.toLowerCase().includes("premium") || m.toLowerCase().includes("pro")) return "bg-green-500 text-white";
//   if (m.toLowerCase().includes("enterprise")) return "bg-purple-500 text-white";
//   return "bg-gray-200 text-gray-800";
// };

// // ----------------- ModalShell -----------------
// function ModalShell({ title, children, onClose, footer }: { title: string; children: React.ReactNode; onClose: () => void; footer?: React.ReactNode; }) {
//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
//       <div className="fixed inset-0 bg-black/40" onClick={onClose} />
//       <div role="dialog" aria-modal="true" className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-lg shadow-lg overflow-hidden">
//         <div className="p-4 border-b dark:border-slate-800 flex items-center justify-between">
//           <h3 className="text-lg font-semibold">{title}</h3>
//           <button aria-label="Close modal" onClick={onClose} className="text-slate-500 hover:text-slate-700">✕</button>
//         </div>
//         <div className="p-4">{children}</div>
//         {footer && <div className="p-4 border-t dark:border-slate-800">{footer}</div>}
//       </div>
//     </div>
//   );
// }

// // ----------------- Main component -----------------
// const UserManagement: React.FC = () => {
//   // data + UI state
//   const [users, setUsers] = useState<APIUser[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [stats, setStats] = useState<Stats | null>(null);
//   const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
//   const [page, setPage] = useState(1);
//   const [perPage, setPerPage] = useState(20);
//   const [total, setTotal] = useState(0);

//   const [search, setSearch] = useState("");
//   const [debouncedSearch, setDebouncedSearch] = useState("");
//   const [roleFilter, setRoleFilter] = useState("");
//   const [statusFilter, setStatusFilter] = useState("");

//   const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
//   const [adding, setAdding] = useState(false);

//   // modals
//   const [openAddModal, setOpenAddModal] = useState(false);
//   const [openBulkRoleModal, setOpenBulkRoleModal] = useState(false);
//   const [openBulkEmailModal, setOpenBulkEmailModal] = useState(false);
//   const [openChangeMembershipModal, setOpenChangeMembershipModal] = useState<{ open: boolean; id?: string | null }>({ open: false });
//   const [openUpdateRoleModal, setOpenUpdateRoleModal] = useState<{ open: boolean; id?: string | null }>({ open: false });

//   const cancelTokenRef = useRef<CancelTokenSource | null>(null);
//   const debounceRef = useRef<number | null>(null);
//   const visibilityRef = useRef<boolean>(true);

//   // ----------------- Helpers -----------------
//   const maxPage = useMemo(() => Math.max(1, Math.ceil(total / perPage || 1)), [perPage, total]);

//   const clearSelection = () => setSelectedIds(new Set());

//   // unify confirm dialog (keep Swal)
//   const confirmDialog = async (title: string, text?: string) => {
//     const result = await Swal.fire({
//       title,
//       text,
//       icon: "question",
//       showCancelButton: true,
//       confirmButtonText: "Yes",
//       cancelButtonText: "No",
//     });
//     return result.isConfirmed;
//   };

//   // ----------------- Fetch users -----------------
//   const fetchUsers = async (opts?: { showSkeleton?: boolean }) => {
//     if (opts?.showSkeleton) setLoading(true);
//     try {
//       if (cancelTokenRef.current) cancelTokenRef.current.cancel("cancel previous");
//     } catch (_) {}
//     cancelTokenRef.current = axios.CancelToken.source();

//     try {
//       const params: any = {
//         page,
//         perPage,
//         search: debouncedSearch || undefined,
//         role: roleFilter || undefined,
//         status: statusFilter || undefined,
//       };

//       const res = await axios.get("/dashboard/admin/api/user-management", {
//         params,
//         cancelToken: cancelTokenRef.current.token,
//       });

//       const payload = res.data ?? {};
//       setUsers((payload.users ?? []) as APIUser[]);
//       setTotal(payload.meta?.total ?? 0);

//       // map stats defensively
//       const s = payload.stats ?? null;
//       if (s) {
//         const totalUsers = s.total ?? s.totalUsers ?? 0;
//         const newLast30Days = s.newLast30Days ?? s.newUsersLast30Days ?? 0;
//         setStats({
//           total: totalUsers,
//           activeUsers: s.activeUsers ?? 0,
//           premiumUsers: s.premiumUsers ?? 0,
//           verifiedUsers: s.verifiedUsers ?? 0,
//           newLast30Days,
//           usersByRole: s.usersByRole ?? [],
//         });
//       } else {
//         setStats(null);
//       }

//       setRecentActivities(payload.recentActivities ?? []);
//     } catch (err: any) {
//       if (!axios.isCancel(err)) {
//         console.error("Error fetching users:", err);
//       }
//     } finally {
//       if (opts?.showSkeleton) setLoading(false);
//     }
//   };

//   // Debounce search input
//   useEffect(() => {
//     if (debounceRef.current) window.clearTimeout(debounceRef.current);
//     debounceRef.current = window.setTimeout(() => {
//       setDebouncedSearch(search);
//       setPage(1);
//     }, 500);
//     return () => {
//       if (debounceRef.current) window.clearTimeout(debounceRef.current);
//     };
//   }, [search]);

//   // initial load + polling (pause when hidden)
//   useEffect(() => {
//     visibilityRef.current = !document.hidden;
//     const onVisibility = () => {
//       visibilityRef.current = !document.hidden;
//     };
//     document.addEventListener("visibilitychange", onVisibility);

//     // initial
//     fetchUsers({ showSkeleton: true });
//     const interval = window.setInterval(() => {
//       if (visibilityRef.current) fetchUsers();
//     }, 30000);

//     return () => {
//       document.removeEventListener("visibilitychange", onVisibility);
//       clearInterval(interval);
//       try {
//         cancelTokenRef.current?.cancel();
//       } catch (_) {}
//     };
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   // refetch when filters / page / perPage / debouncedSearch changes
//   useEffect(() => {
//     // clamp page <= maxPage
//     setPage((p) => Math.min(p, Math.max(1, Math.ceil(total / perPage || 1))));
//     fetchUsers({ showSkeleton: true });
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [page, perPage, roleFilter, statusFilter, debouncedSearch]);

//   // ----------------- Selection helpers -----------------
//   const toggleSelect = (id?: string | null) => {
//     if (!id) return;
//     setSelectedIds((prev) => {
//       const n = new Set(prev);
//       if (n.has(id)) n.delete(id);
//       else n.add(id);
//       return n;
//     });
//   };

//   const selectAllOnPage = () => {
//     const ids = users.map((u) => u.id).filter(Boolean) as string[];
//     setSelectedIds((prev) => {
//       const n = new Set(prev);
//       for (const id of ids) n.add(id);
//       return n;
//     });
//   };

//   // ----------------- Actions -----------------
//   const handleBan = async (id?: string | null) => {
//     if (!id) return;
//     const ok = await confirmDialog("Ban this user?", "This will set status to Not-Active.");
//     if (!ok) return;
//     try {
//       await axios.patch("/dashboard/admin/api/user-management", { action: "ban", id });
//       Swal.fire("Banned", "User has been banned", "success");
//       await fetchUsers();
//     } catch (e) {
//       console.error(e);
//       Swal.fire("Error", "Failed to ban user", "error");
//     }
//   };

//   const handleUnban = async (id?: string | null) => {
//     if (!id) return;
//     try {
//       await axios.patch("/dashboard/admin/api/user-management", { action: "unban", id });
//       Swal.fire("Unbanned", "User has been unbanned", "success");
//       await fetchUsers();
//     } catch (e) {
//       console.error(e);
//       Swal.fire("Error", "Failed to unban user", "error");
//     }
//   };

//   const handleDelete = async (id?: string | null) => {
//     if (!id) return;
//     const ok = await confirmDialog("Delete this user permanently?", "This action cannot be undone.");
//     if (!ok) return;
//     try {
//       await axios.delete("/dashboard/admin/api/user-management", { data: { id } });
//       Swal.fire("Deleted", "User removed", "success");
//       setSelectedIds((prev) => {
//         const n = new Set(prev);
//         n.delete(id);
//         return n;
//       });
//       await fetchUsers();
//     } catch (e) {
//       console.error(e);
//       Swal.fire("Error", "Failed to delete user", "error");
//     }
//   };

//   // ----------------- Custom modal: Add User -----------------
//   const [addForm, setAddForm] = useState({ name: "", email: "", password: "", role: "user", membershipType: "Free" });
//   const submitAddUser = async () => {
//     if (!addForm.name || !addForm.email || !addForm.password) return Swal.fire("Validation", "All fields required", "warning");
//     setAdding(true);
//     try {
//       const res = await axios.post("/dashboard/admin/api/user-management", {
//         name: addForm.name,
//         email: addForm.email,
//         password: addForm.password,
//         role: addForm.role,
//         membershipType: addForm.membershipType,
//       });
//       Swal.fire("Created", res.data?.message ?? "User created", "success");
//       setOpenAddModal(false);
//       setAddForm({ name: "", email: "", password: "", role: "user", membershipType: "Free" });
//       await fetchUsers({ showSkeleton: true });
//     } catch (err: any) {
//       console.error(err);
//       Swal.fire("Error", err?.response?.data?.error ?? "Failed to add user", "error");
//     } finally {
//       setAdding(false);
//     }
//   };

//   // ----------------- Custom modal: Bulk Role Update -----------------
//   const [bulkRoleValue, setBulkRoleValue] = useState("user");
//   const submitBulkRoleUpdate = async () => {
//     if (selectedIds.size === 0) return Swal.fire("Select users first", "Please select at least one user", "info");
//     const ids = Array.from(selectedIds);
//     try {
//       await axios.patch("/dashboard/admin/api/user-management", { action: "bulkRoleUpdate", ids, payload: { role: bulkRoleValue } });
//       Swal.fire("Updated", "Bulk role update done", "success");
//       setOpenBulkRoleModal(false);
//       clearSelection();
//       await fetchUsers();
//     } catch (e) {
//       console.error(e);
//       Swal.fire("Error", "Bulk role update failed", "error");
//     }
//   };

//   // ----------------- Custom modal: Bulk Email -----------------
//   const [bulkEmailForm, setBulkEmailForm] = useState({ subject: "", body: "" });
//   const submitBulkEmail = async () => {
//     if (selectedIds.size === 0) return Swal.fire("Select users first", "Please select at least one user", "info");
//     if (!bulkEmailForm.subject || !bulkEmailForm.body) return Swal.fire("Validation", "Subject and body required", "warning");
//     const ids = Array.from(selectedIds);
//     try {
//       const res = await axios.patch("/dashboard/admin/api/user-management", { action: "sendEmailBulk", ids, payload: { subject: bulkEmailForm.subject, body: bulkEmailForm.body } });
//       Swal.fire("Attempted", res.data?.message ?? "Bulk email attempted", "success");
//       setOpenBulkEmailModal(false);
//       setBulkEmailForm({ subject: "", body: "" });
//       clearSelection();
//       await fetchUsers();
//     } catch (e) {
//       console.error(e);
//       Swal.fire("Error", "Failed to send bulk email", "error");
//     }
//   };

//   // ----------------- Custom modal: Change Membership -----------------
//   const [membershipValue, setMembershipValue] = useState("Free");
//   const submitChangeMembership = async (id?: string | null) => {
//     if (!id) return;
//     try {
//       await axios.patch("/dashboard/admin/api/user-management", { action: "changeMembership", id, payload: { membershipType: membershipValue } });
//       Swal.fire("Updated", "Membership updated", "success");
//       setOpenChangeMembershipModal({ open: false });
//       await fetchUsers();
//     } catch (e) {
//       console.error(e);
//       Swal.fire("Error", "Failed to change membership", "error");
//     }
//   };

//   // ----------------- Custom modal: Update Role -----------------
//   const [roleValue, setRoleValue] = useState("user");
//   const submitUpdateRole = async (id?: string | null) => {
//     if (!id) return;
//     try {
//       await axios.patch("/dashboard/admin/api/user-management", { action: "updatePermissions", id, payload: { role: roleValue } });
//       Swal.fire("Updated", "Role updated", "success");
//       setOpenUpdateRoleModal({ open: false });
//       await fetchUsers();
//     } catch (e) {
//       console.error(e);
//       Swal.fire("Error", "Failed to update role", "error");
//     }
//   };

//   // ----------------- Export CSV -----------------
//   const handleExportCsv = async () => {
//     const ids = selectedIds.size ? Array.from(selectedIds) : undefined;
//     try {
//       const res = await axios.patch("/dashboard/admin/api/user-management", { action: "exportCsv", payload: { ids } }, { responseType: "blob" });
//       const blob = new Blob([res.data], { type: "text/csv;charset=utf-8;" });
//       const url = window.URL.createObjectURL(blob);
//       const a = document.createElement("a");
//       a.href = url;
//       a.download = `users-export-${Date.now()}.csv`;
//       document.body.appendChild(a);
//       a.click();
//       document.body.removeChild(a);
//       window.URL.revokeObjectURL(url);
//       Swal.fire("Exported", "CSV exported successfully", "success");
//     } catch (e) {
//       console.error(e);
//       Swal.fire("Error", "Export failed", "error");
//     }
//   };

//   // ----------------- Helpers for display -----------------
//   // accept null/undefined name
//   const initials = (name?: string | null) => {
//     if (!name) return "U";
//     return name.split(" ").map((p) => p?.[0] ?? "").slice(0, 2).join("").toUpperCase() || "U";
//   };

//   // ----------------- Render -----------------
//   return (
//     <AdminRoute>
//       <div className="space-y-8">
//         <div>
//           <h1 className="text-3xl font-bold">User Management</h1>
//           <p className="text-muted-foreground mt-2">Manage user accounts, permissions, and access controls</p>
//         </div>

//         {/* Top stat cards */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
//           {loading ? (
//             <>
//               <SkeletonBlock height={96} />
//               <SkeletonBlock height={96} />
//               <SkeletonBlock height={96} />
//               <SkeletonBlock height={96} />
//             </>
//           ) : (
//             <>
//               <Card className="card-glass">
//                 <CardContent className="p-6 flex justify-between items-center">
//                   <div>
//                     <p className="text-sm text-muted-foreground">Total Users</p>
//                     <p className="text-3xl font-bold">{stats?.total ?? 0}</p>
//                     <p className="text-xs text-green-600">+{stats?.newLast30Days ?? 0} new (30d)</p>
//                   </div>
//                   <Users className="h-8 w-8 text-blue-400" />
//                 </CardContent>
//               </Card>

//               <Card className="card-glass">
//                 <CardContent className="p-6 flex justify-between items-center">
//                   <div>
//                     <p className="text-sm text-muted-foreground">Active Users</p>
//                     <p className="text-3xl font-bold">{stats?.activeUsers ?? 0}</p>
//                     <p className="text-xs text-blue-400">Currently Active</p>
//                   </div>
//                   <Shield className="h-8 w-8 text-green-500" />
//                 </CardContent>
//               </Card>

//               <Card className="card-glass">
//                 <CardContent className="p-6 flex justify-between items-center">
//                   <div>
//                     <p className="text-sm text-muted-foreground">Premium Users</p>
//                     <p className="text-3xl font-bold">{stats?.premiumUsers ?? 0}</p>
//                     <p className="text-xs text-purple-400">Conversion</p>
//                   </div>
//                   <UserPlus className="h-8 w-8 text-purple-400" />
//                 </CardContent>
//               </Card>

//               <Card className="card-glass">
//                 <CardContent className="p-6 flex justify-between items-center">
//                   <div>
//                     <p className="text-sm text-muted-foreground">New This Month</p>
//                     <p className="text-3xl font-bold">{stats?.newLast30Days ?? 0}</p>
//                     <p className="text-xs text-yellow-400">vs last month</p>
//                   </div>
//                   <Mail className="h-8 w-8 text-yellow-400" />
//                 </CardContent>
//               </Card>
//             </>
//           )}
//         </div>

//         {/* Tools */}
//         <Card className="card-glass">
//           <CardHeader>
//             <div className="flex items-center justify-between">
//               <div>
//                 <CardTitle>User Directory</CardTitle>
//                 <CardDescription>Search, filter, and manage user accounts</CardDescription>
//               </div>

//               <div className="flex items-center space-x-2">
//                 <Button className="btn-hero" onClick={() => setOpenAddModal(true)} disabled={adding}>
//                   <UserPlus className="h-4 w-4 mr-2" />
//                   Add User
//                 </Button>
//               </div>
//             </div>
//           </CardHeader>

//           <CardContent>
//             {/* Search & filter */}
//             <div className="flex flex-col md:flex-row gap-4 mb-6">
//               <div className="flex-1 relative">
//                 <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//                 <Input
//                   placeholder="Search users by name, email, or ID..."
//                   className="pl-10"
//                   value={search}
//                   onChange={(e) => setSearch(e.target.value)}
//                   onKeyDown={(e) => {
//                     if (e.key === "Enter") {
//                       setDebouncedSearch(e.currentTarget.value);
//                       setPage(1);
//                     }
//                   }}
//                 />
//               </div>

//               <div className="flex gap-2">
//                 <select className="rounded-md border px-3 py-2" value={roleFilter} onChange={(e) => { setRoleFilter(e.target.value); setPage(1); }}>
//                   <option value="">All roles</option>
//                   <option value="user">User</option>
//                   <option value="admin">Admin</option>
//                 </select>

//                 <select className="rounded-md border px-3 py-2" value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}>
//                   <option value="">All status</option>
//                   <option value="Active">Active</option>
//                   <option value="Not-Active">Not-Active</option>
//                   <option value="Suspended">Suspended</option>
//                 </select>

//                 <select className="rounded-md border px-3 py-2" value={perPage} onChange={(e) => { setPerPage(Number(e.target.value)); setPage(1); }}>
//                   <option value={10}>10 / page</option>
//                   <option value={20}>20 / page</option>
//                   <option value={50}>50 / page</option>
//                   <option value={100}>100 / page</option>
//                 </select>

//                 <Button variant="outline" onClick={() => { setPage(1); fetchUsers({ showSkeleton: true }); }}>
//                   <Filter className="h-4 w-4 mr-2" /> Filter
//                 </Button>
//               </div>
//             </div>

//             {/* Controls for selection/bulk actions */}
//             <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4 gap-3">
//               <div className="flex flex-wrap items-center gap-2">
//                 <Button variant="outline" onClick={selectAllOnPage}>Select all on page</Button>
//                 <Button variant="outline" onClick={clearSelection}>Clear selection</Button>
//                 <span className="text-sm text-muted-foreground">{selectedIds.size} selected</span>
//               </div>

//               <div className="flex flex-wrap items-center gap-2">
//                 <Button variant="outline" onClick={() => setOpenBulkRoleModal(true)} disabled={selectedIds.size === 0}>Bulk role update</Button>
//                 <Button variant="outline" onClick={() => setOpenBulkEmailModal(true)} disabled={selectedIds.size === 0}>Send email</Button>
//                 <Button variant="outline" onClick={handleExportCsv} disabled={selectedIds.size === 0}>Export CSV</Button>
//               </div>
//             </div>

//             {/* User List */}
//             <div className="space-y-4">
//               {loading ? (
//                 Array(5).fill(0).map((_, i) => <SkeletonBlock key={i} height={72} />)
//               ) : users.length === 0 ? (
//                 <div className="p-4 text-sm text-muted-foreground">No users found.</div>
//               ) : (
//                 users.map((user, index) => (
//                   <div key={user.id ?? user.email ?? index} className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 bg-muted/30 rounded-lg gap-4">
//                     <div className="flex items-start md:items-center gap-4 w-full md:w-auto">
//                       <input
//                         type="checkbox"
//                         checked={user.id ? selectedIds.has(user.id) : false}
//                         onChange={() => toggleSelect(user.id)}
//                         aria-label={`Select ${user.name ?? user.email ?? "user"}`}
//                       />
//                       <Avatar>
//                         <AvatarFallback className="bg-green-600 text-white">{initials(user.name)}</AvatarFallback>
//                       </Avatar>

//                       <div>
//                         <div className="flex items-center gap-2">
//                           <p className="font-medium">{user.name}</p>
//                           <Badge className={badgeForStatus(user.status)}>{user.status ?? "Active"}</Badge>
//                         </div>
//                         <p className="text-sm text-muted-foreground">{user.email}</p>
//                         <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
//                           <span>Role: {user.role}</span>
//                           <span>Joined: {user.createdAt ? new Date(user.createdAt as string).toLocaleDateString() : "—"}</span>
//                           <span className={`px-2 py-0.5 rounded text-xs ${badgeForMembership(user.membershipType)}`}>{user.membershipType ?? "Free"}</span>
//                         </div>
//                       </div>
//                     </div>

//                     <div className="flex items-center gap-4 ml-auto">
//                       <div className="text-center hidden md:block">
//                         <div className="text-sm font-medium">—</div>
//                         <div className="text-xs text-muted-foreground">Interviews</div>
//                       </div>
//                       <div className="text-center hidden md:block">
//                         <div className="text-sm font-medium">—</div>
//                         <div className="text-xs text-muted-foreground">Resumes</div>
//                       </div>

//                       <div className="flex items-center gap-2">
//                         {user.status !== "Not-Active" ? (
//                           <Button variant="ghost" size="sm" onClick={() => handleBan(user.id)}>Ban</Button>
//                         ) : (
//                           <Button variant="ghost" size="sm" onClick={() => handleUnban(user.id)}>Unban</Button>
//                         )}
//                         <Button variant="ghost" size="sm" onClick={() => {
//                           setOpenUpdateRoleModal({ open: true, id: user.id });
//                           setRoleValue(user.role ?? "user");
//                         }}>Role</Button>

//                         <Button variant="ghost" size="sm" onClick={() => {
//                           setOpenChangeMembershipModal({ open: true, id: user.id });
//                           setMembershipValue(user.membershipType ?? "Free");
//                         }}>Membership</Button>

//                         <Button variant="ghost" size="sm" onClick={() => handleDelete(user.id)}>
//                           <Delete className="h-4 w-4" />
//                         </Button>
//                       </div>
//                     </div>
//                   </div>
//                 ))
//               )}
//             </div>

//             {/* pagination */}
//             <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mt-4 gap-2">
//               <div className="text-sm text-muted-foreground">
//                 Showing {users.length === 0 ? 0 : Math.min((page - 1) * perPage + 1, total)} - {Math.min(page * perPage, total)} of {total}
//               </div>
//               <div className="flex items-center gap-2">
//                 <Button variant="outline" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>Prev</Button>
//                 <div className="px-3 py-1 rounded border">{page}</div>
//                 <Button variant="outline" onClick={() => setPage((p) => Math.min(maxPage, p + 1))} disabled={page >= maxPage}>Next</Button>
//               </div>
//             </div>
//           </CardContent>
//         </Card>

//         {/* Bulk Actions + Activity + Roles cards */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//           <Card className="card-glass">
//             <CardHeader>
//               <CardTitle>Bulk Operations</CardTitle>
//               <CardDescription>Perform actions on multiple users simultaneously</CardDescription>
//             </CardHeader>
//             <CardContent>
//               <div className="space-y-3">
//                 <Button variant="outline" className="w-full justify-start" onClick={() => setOpenBulkEmailModal(true)} disabled={selectedIds.size === 0}>
//                   <Mail className="h-4 w-4 mr-2" /> Send Email to Users
//                 </Button>
//                 <Button variant="outline" className="w-full justify-start" onClick={() => setOpenBulkRoleModal(true)} disabled={selectedIds.size === 0}>
//                   <UserPlus className="h-4 w-4 mr-2" /> Update User Roles
//                 </Button>
//                 <Button variant="outline" className="w-full justify-start" 
//                  disabled={selectedIds.size === 0}>
//                   <Shield className="h-4 w-4 mr-2" /> Modify Permissions
//                 </Button>
//                 <Button variant="outline" className="w-full justify-start" onClick={handleExportCsv} disabled={selectedIds.size === 0}>
//                   <Users className="h-4 w-4 mr-2" /> Export User Data
//                 </Button>
//               </div>
//             </CardContent>
//           </Card>

//           <Card className="card-glass">
//             <CardHeader>
//               <CardTitle>User Activity</CardTitle>
//               <CardDescription>Recent user activities and system events</CardDescription>
//             </CardHeader>
//             <CardContent>
//               <div className="space-y-3">
//                 {loading ? (
//                   Array(5).fill(0).map((_, i) => <SkeletonBlock key={i} height={28} />)
//                 ) : recentActivities.length === 0 ? (
//                   <div className="text-sm text-muted-foreground">No recent activity</div>
//                 ) : (
//                   recentActivities.slice(0, 8).map((act, i) => (
//                     <div key={i} className="flex items-center space-x-3">
//                       <div className="w-2 h-2 bg-blue-400 rounded-full" />
//                       <div className="flex-1">
//                         <p className="text-sm font-medium">{act.action}</p>
//                         <p className="text-xs text-muted-foreground">{act.time ? new Date(act.time).toLocaleString() : ""}</p>
//                       </div>
//                     </div>
//                   ))
//                 )}
//               </div>
//             </CardContent>
//           </Card>
//         </div>

//         {/* Role Management (static reference) */}
//         <Card className="card-glass">
//           <CardHeader>
//             <CardTitle>Role & Permission Management</CardTitle>
//             <CardDescription>Configure user roles and their associated permissions</CardDescription>
//           </CardHeader>
//           <CardContent>
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//               <div className="space-y-4">
//                 <h4 className="font-semibold">Free User</h4>
//                 <div className="space-y-2 text-sm">
//                   <div className="flex items-center justify-between"><span>Resume Builder</span><Badge variant="outline" className="text-green-600 border-green-600">Limited</Badge></div>
//                   <div className="flex items-center justify-between"><span>Interview Practice</span><Badge variant="outline" className="text-green-600 border-green-600">3/month</Badge></div>
//                   <div className="flex items-center justify-between"><span>Job Analysis</span><Badge variant="destructive">Disabled</Badge></div>
//                   <div className="flex items-center justify-between"><span>AI Features</span><Badge variant="destructive">Disabled</Badge></div>
//                 </div>
//               </div>

//               <div className="space-y-4">
//                 <h4 className="font-semibold">Premium User</h4>
//                 <div className="space-y-2 text-sm">
//                   <div className="flex items-center justify-between"><span>Resume Builder</span><Badge variant="default" className="bg-green-600">Unlimited</Badge></div>
//                   <div className="flex items-center justify-between"><span>Interview Practice</span><Badge variant="default" className="bg-green-600">Unlimited</Badge></div>
//                   <div className="flex items-center justify-between"><span>Job Analysis</span><Badge variant="default" className="bg-green-600">Enabled</Badge></div>
//                   <div className="flex items-center justify-between"><span>AI Features</span><Badge variant="default" className="bg-green-600">Full Access</Badge></div>
//                 </div>
//               </div>

//               <div className="space-y-4">
//                 <h4 className="font-semibold">Admin</h4>
//                 <div className="space-y-2 text-sm">
//                   <div className="flex items-center justify-between"><span>User Management</span><Badge variant="default" className="bg-purple-400">Full Access</Badge></div>
//                   <div className="flex items-center justify-between"><span>System Settings</span><Badge variant="default" className="bg-purple-400">Full Access</Badge></div>
//                   <div className="flex items-center justify-between"><span>Analytics</span><Badge variant="default" className="bg-purple-400">Full Access</Badge></div>
//                   <div className="flex items-center justify-between"><span>Content Management</span><Badge variant="default" className="bg-purple-400">Full Access</Badge></div>
//                 </div>
//               </div>
//             </div>
//           </CardContent>
//         </Card>
//       </div>

//       {/* ---------- Modals ---------- */}

//       {/* Add User */}
//       {openAddModal && (
//         <ModalShell
//           title="Add New User"
//           onClose={() => setOpenAddModal(false)}
//           footer={
//             <div className="flex justify-end gap-2">
//               <Button variant="outline" onClick={() => setOpenAddModal(false)}>Cancel</Button>
//               <Button onClick={submitAddUser} disabled={adding}>{adding ? "Adding..." : "Add User"}</Button>
//             </div>
//           }
//         >
//           <div className="grid grid-cols-1 gap-3">
//             <label className="text-sm">Name</label>
//             <Input value={addForm.name} onChange={(e) => setAddForm({ ...addForm, name: e.target.value })} />
//             <label className="text-sm">Email</label>
//             <Input value={addForm.email} onChange={(e) => setAddForm({ ...addForm, email: e.target.value })} />
//             <label className="text-sm">Password</label>
//             <Input type="password" value={addForm.password} onChange={(e) => setAddForm({ ...addForm, password: e.target.value })} />
//             <div className="flex gap-2">
//               <select className="rounded-md border px-3 py-2 flex-1" value={addForm.role} onChange={(e) => setAddForm({ ...addForm, role: e.target.value })}>
//                 <option value="user">User</option>
//                 <option value="admin">Admin</option>
//               </select>
//               <select className="rounded-md border px-3 py-2 flex-1" value={addForm.membershipType} onChange={(e) => setAddForm({ ...addForm, membershipType: e.target.value })}>
//                 <option>Free</option>
//                 <option>Premium</option>
//                 <option>Enterprise</option>
//               </select>
//             </div>
//           </div>
//         </ModalShell>
//       )}

//       {/* Bulk Role */}
//       {openBulkRoleModal && (
//         <ModalShell
//           title="Set role for selected users"
//           onClose={() => setOpenBulkRoleModal(false)}
//           footer={
//             <div className="flex justify-end gap-2">
//               <Button variant="outline" onClick={() => setOpenBulkRoleModal(false)}>Cancel</Button>
//               <Button onClick={submitBulkRoleUpdate}>Apply</Button>
//             </div>
//           }
//         >
//           <div className="space-y-3">
//             <p className="text-sm text-muted-foreground">{selectedIds.size} users selected</p>
//             <select className="rounded-md border px-3 py-2 w-full" value={bulkRoleValue} onChange={(e) => setBulkRoleValue(e.target.value)}>
//               <option value="user">User</option>
//               <option value="admin">Admin</option>
//             </select>
//           </div>
//         </ModalShell>
//       )}

//       {/* Bulk Email */}
//       {openBulkEmailModal && (
//         <ModalShell
//           title="Send bulk email"
//           onClose={() => setOpenBulkEmailModal(false)}
//           footer={
//             <div className="flex justify-end gap-2">
//               <Button variant="outline" onClick={() => setOpenBulkEmailModal(false)}>Cancel</Button>
//               <Button onClick={submitBulkEmail}>Send</Button>
//             </div>
//           }
//         >
//           <div className="space-y-3">
//             <p className="text-sm text-muted-foreground">{selectedIds.size} users selected</p>
//             <label className="text-sm">Subject</label>
//             <Input value={bulkEmailForm.subject} onChange={(e) => setBulkEmailForm((s) => ({ ...s, subject: e.target.value }))} />
//             <label className="text-sm">Body (HTML allowed)</label>
//             <textarea className="w-full rounded-md border p-2 min-h-[120px]" value={bulkEmailForm.body} onChange={(e) => setBulkEmailForm((s) => ({ ...s, body: e.target.value }))} />
//           </div>
//         </ModalShell>
//       )}

//       {/* Change Membership */}
//       {openChangeMembershipModal.open && (
//         <ModalShell
//           title="Change membership"
//           onClose={() => setOpenChangeMembershipModal({ open: false })}
//           footer={
//             <div className="flex justify-end gap-2">
//               <Button variant="outline" onClick={() => setOpenChangeMembershipModal({ open: false })}>Cancel</Button>
//               <Button onClick={() => submitChangeMembership(openChangeMembershipModal.id)}>Update</Button>
//             </div>
//           }
//         >
//           <div className="space-y-3">
//             <select className="rounded-md border px-3 py-2 w-full" value={membershipValue} onChange={(e) => setMembershipValue(e.target.value)}>
//               <option>Free</option>
//               <option>Premium</option>
//               <option>Enterprise</option>
//             </select>
//           </div>
//         </ModalShell>
//       )}

//       {/* Update Role */}
//       {openUpdateRoleModal.open && (
//         <ModalShell
//           title="Set role"
//           onClose={() => setOpenUpdateRoleModal({ open: false })}
//           footer={
//             <div className="flex justify-end gap-2">
//               <Button variant="outline" onClick={() => setOpenUpdateRoleModal({ open: false })}>Cancel</Button>
//               <Button onClick={() => submitUpdateRole(openUpdateRoleModal.id)}>Update</Button>
//             </div>
//           }
//         >
//           <div className="space-y-3">
//             <select className="rounded-md border px-3 py-2 w-full" value={roleValue} onChange={(e) => setRoleValue(e.target.value)}>
//               <option value="user">User</option>
//               <option value="admin">Admin</option>
//             </select>
//           </div>
//         </ModalShell>
//       )}
//     </AdminRoute>
//   );
// };

// export default UserManagement;









// src/app/dashboard/admin/user-management/UserManagement.tsx
"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import axios, { CancelTokenSource } from "axios";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import { Search, Filter, UserPlus, Mail, Users } from "lucide-react";

import AdminRoute from "@/app/Routes/AdminRoute";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import UserCard from "./components/UserCard";
import BulkActions from "./components/BulkActions";
import UserList from "./components/UserList";
import UserActivityCard from "./components/UserActivityCard";
import RolePermissionsCard from "./components/RolePermissionsCard";

import AddUserModal from "./components/Modals/AddUserModal";
import BulkRoleModal from "./components/Modals/BulkRoleModal";
import BulkEmailModal from "./components/Modals/BulkEmailModal";
import ChangeMembershipModal from "./components/Modals/ChangeMembershipModal";
import UpdateRoleModal from "./components/Modals/UpdateRoleModal";
import { APIUser, RecentActivity, Stats } from "@/types/APIUser";

const SmallSpinner = () => (
  <div className="ml-2 inline-block align-middle" aria-hidden>
    <div className="h-4 w-4 rounded-full border-2 border-gray-300 border-t-transparent animate-spin" />
  </div>
);

export default function UserManagement() {
  // ----- data + UI state -----
  const [users, setUsers] = useState<APIUser[] | null>(null); // <<--- important: start as null
  const [initialLoading, setInitialLoading] = useState(true);
  const [fetching, setFetching] = useState(false);
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(20);
  const [total, setTotal] = useState(0);

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [adding, setAdding] = useState(false);

  // modals
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openBulkRoleModal, setOpenBulkRoleModal] = useState(false);
  const [openBulkEmailModal, setOpenBulkEmailModal] = useState(false);
  const [openChangeMembershipModal, setOpenChangeMembershipModal] = useState<{ open: boolean; id?: string | null }>({ open: false });
  const [openUpdateRoleModal, setOpenUpdateRoleModal] = useState<{ open: boolean; id?: string | null }>({ open: false });

  const [addForm, setAddForm] = useState({ name: "", email: "", password: "", role: "user", membershipType: "Free" });
  const [bulkRoleValue, setBulkRoleValue] = useState("user");
  const [bulkEmailForm, setBulkEmailForm] = useState({ subject: "", body: "" });
  const [membershipValue, setMembershipValue] = useState("Free");
  const [roleValue, setRoleValue] = useState("user");

  const maxPage = useMemo(() => Math.max(1, Math.ceil(total / perPage || 1)), [perPage, total]);

  const cancelTokenRef = useRef<CancelTokenSource | null>(null);
  const debounceRef = useRef<number | null>(null);
  const visibilityRef = useRef<boolean>(true);
  const firstRenderRef = useRef<boolean>(true);

   // small UI state for mobile filters
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const clearSelection = () => setSelectedIds(new Set());

  const confirmDialog = async (title: string, text?: string): Promise<boolean> => {
    const result = await Swal.fire({
      title,
      text,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
    });
    return result.isConfirmed;
  };

  // ----- fetchUsers -----
  const fetchUsers = async (opts?: { initial?: boolean; skipStats?: boolean }) => {
    if (opts?.initial) setInitialLoading(true);
    else setFetching(true);

    // cancel previous
    try {
      if (cancelTokenRef.current) cancelTokenRef.current.cancel("cancel previous");
    } catch (_) {}

    cancelTokenRef.current = axios.CancelToken.source();

    try {
  const params = {
    page,
    perPage,
    search: debouncedSearch || undefined,
    role: roleFilter || undefined,
    status: statusFilter || undefined,
    ...(opts?.skipStats ? { skipStats: true } : {}),
  };

  const res = await axios.get("/dashboard/admin/api/user-management", {
    params,
    cancelToken: cancelTokenRef.current?.token,
  });

  const payload = res.data ?? {};
  setUsers((payload.users ?? []) as APIUser[]);
  setTotal(payload.meta?.total ?? 0);

  if (!opts?.skipStats) {
    const s = payload.stats ?? null;
    if (s) {
      const totalUsers = s.total ?? s.totalUsers ?? 0;
      const newLast30Days = s.newLast30Days ?? s.newUsersLast30Days ?? 0;
      setStats({
        total: totalUsers,
        activeUsers: s.activeUsers ?? 0,
        premiumUsers: s.premiumUsers ?? 0,
        verifiedUsers: s.verifiedUsers ?? 0,
        newLast30Days,
        usersByRole: s.usersByRole ?? [],
      });
    } else {
      setStats(null);
    }
    setRecentActivities(payload.recentActivities ?? []);
  } else {
    if (payload.recentActivities) setRecentActivities(payload.recentActivities);
  }
} catch (err: unknown) {
  if (!axios.isCancel(err)) {
    if (err instanceof Error) console.error("Error fetching users:", err.message);
    else console.error("Error fetching users:", err);
  }
} finally {
  if (opts?.initial) setInitialLoading(false);
  else setFetching(false);
}

  };

  // ----- debounce search (200ms) -----
  useEffect(() => {
    if (debounceRef.current) window.clearTimeout(debounceRef.current);
    debounceRef.current = window.setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 200); // faster debounce
    return () => {
      if (debounceRef.current) window.clearTimeout(debounceRef.current);
    };
  }, [search]);

  // ----- initial load + polling -----
  useEffect(() => {
    visibilityRef.current = !document.hidden;
    const onVisibility = () => { visibilityRef.current = !document.hidden; };
    document.addEventListener("visibilitychange", onVisibility);

    fetchUsers({ initial: true }).finally(() => {
      firstRenderRef.current = false;
    });

    const interval = window.setInterval(() => {
      if (visibilityRef.current) fetchUsers();
    }, 30000);

    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      clearInterval(interval);
      try { cancelTokenRef.current?.cancel(); } catch {}
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ----- re-fetch on filters/pagination/search (but skip server call for small dataset) -----
  useEffect(() => {
    if (firstRenderRef.current) return;

    setPage((p) => Math.min(p, Math.max(1, Math.ceil(total / perPage || 1))));

    const shouldUseClientFilter = users !== null && (total <= 50 || (users && users.length <= 50));
    const skipStats = Boolean(debouncedSearch?.trim()?.length);

    // If dataset is small and we already have users client-side, avoid server calls for search
    if (shouldUseClientFilter && debouncedSearch.trim().length > 0) {
      // Client-side filtering will be done in UserList (or you can compute filteredUsers here)
      // No server fetch required — return early.
      return;
    }

    // otherwise do server fetch (skip stats when searching)
    fetchUsers({ initial: false, skipStats });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, perPage, roleFilter, statusFilter, debouncedSearch]);

  // ----- selection helpers & actions -----
  const toggleSelect = (id?: string | null) => {
    if (!id) return;
    setSelectedIds((prev) => {
      const n = new Set(prev);
      if (n.has(id)) n.delete(id); else n.add(id);
      return n;
    });
  };

  const selectAllOnPage = () => {
    const ids = (users ?? []).map((u) => u.id).filter(Boolean) as string[];
    setSelectedIds((prev) => {
      const n = new Set(prev);
      for (const id of ids) n.add(id);
      return n;
    });
  };

  const handleBan = async (id?: string | null): Promise<void> => {
    if (!id) return;
    const ok = await confirmDialog("Ban this user?", "This will set status to Not-Active.");
    if (!ok) return;
    try { await axios.patch("/dashboard/admin/api/user-management", { action: "ban", id }); await Swal.fire("Banned", "User has been banned", "success"); await fetchUsers(); }
    catch (e) { console.error(e); await Swal.fire("Error", "Failed to ban user", "error"); }
  };

  const handleUnban = async (id?: string | null): Promise<void> => {
    if (!id) return;
    try { await axios.patch("/dashboard/admin/api/user-management", { action: "unban", id }); await Swal.fire("Unbanned", "User has been unbanned", "success"); await fetchUsers(); }
    catch (e) { console.error(e); await Swal.fire("Error", "Failed to unban user", "error"); }
  };

  const handleDelete = async (id?: string | null): Promise<void> => {
    if (!id) return;
    const ok = await confirmDialog("Delete this user permanently?", "This action cannot be undone.");
    if (!ok) return;
    try {
      await axios.delete("/dashboard/admin/api/user-management", { data: { id } });
      await Swal.fire("Deleted", "User removed", "success");
      setSelectedIds((prev) => { const n = new Set(prev); n.delete(id); return n; });
      await fetchUsers();
    } catch (e) {
      console.error(e);
      await Swal.fire("Error", "Failed to delete user", "error");
    }
  };

  // add / bulk / update functions unchanged (kept same as before)
  const submitAddUser = async (): Promise<void> => {
    if (!addForm.name || !addForm.email || !addForm.password) {
      await Swal.fire("Validation", "All fields required", "warning");
      return;
    }
    setAdding(true);
    try {
  const res = await axios.post("/dashboard/admin/api/user-management", { ...addForm });
  await Swal.fire("Created", res.data?.message ?? "User created", "success");
  setOpenAddModal(false);
  setAddForm({ name: "", email: "", password: "", role: "user", membershipType: "Free" });
  await fetchUsers();
} catch (err: unknown) {
  if (err instanceof Error) {
    console.error(err.message);
    await Swal.fire("Error", err.message, "error");
  } else {
    console.error(err);
    await Swal.fire("Error", "Failed to add user", "error");
  }
} finally {
  setAdding(false);
}

  };

  const submitBulkRoleUpdate = async (): Promise<void> => {
    if (selectedIds.size === 0) { await Swal.fire("Select users first", "Please select at least one user", "info"); return; }
    const ids = Array.from(selectedIds);
    try {
      await axios.patch("/dashboard/admin/api/user-management", { action: "bulkRoleUpdate", ids, payload: { role: bulkRoleValue } });
      await Swal.fire("Updated", "Bulk role update done", "success");
      setOpenBulkRoleModal(false);
      clearSelection();
      await fetchUsers();
    } catch (e) { console.error(e); await Swal.fire("Error", "Bulk role update failed", "error"); }
  };

  const submitBulkEmail = async (): Promise<void> => {
    if (selectedIds.size === 0) { await Swal.fire("Select users first", "Please select at least one user", "info"); return; }
    if (!bulkEmailForm.subject || !bulkEmailForm.body) { await Swal.fire("Validation", "Subject and body required", "warning"); return; }
    const ids = Array.from(selectedIds);
    try {
      const res = await axios.patch("/dashboard/admin/api/user-management", { action: "sendEmailBulk", ids, payload: { subject: bulkEmailForm.subject, body: bulkEmailForm.body } });
      await Swal.fire("Attempted", res.data?.message ?? "Bulk email attempted", "success");
      setOpenBulkEmailModal(false);
      setBulkEmailForm({ subject: "", body: "" });
      clearSelection();
      await fetchUsers();
    } catch (e) { console.error(e); await Swal.fire("Error", "Failed to send bulk email", "error"); }
  };

  const submitChangeMembership = async (id?: string | null): Promise<void> => {
    if (!id) return;
    try {
      await axios.patch("/dashboard/admin/api/user-management", { action: "changeMembership", id, payload: { membershipType: membershipValue } });
      await Swal.fire("Updated", "Membership updated", "success");
      setOpenChangeMembershipModal({ open: false });
      await fetchUsers();
    } catch (e) { console.error(e); await Swal.fire("Error", "Failed to change membership", "error"); }
  };

  const submitUpdateRole = async (id?: string | null): Promise<void> => {
    if (!id) return;
    try {
      await axios.patch("/dashboard/admin/api/user-management", { action: "updatePermissions", id, payload: { role: roleValue } });
      await Swal.fire("Updated", "Role updated", "success");
      setOpenUpdateRoleModal({ open: false });
      await fetchUsers();
    } catch (e) { console.error(e); await Swal.fire("Error", "Failed to update role", "error"); }
  };

  const handleExportCsv = async () => {
    const ids = selectedIds.size ? Array.from(selectedIds) : undefined;
    try {
      const res = await axios.patch("/dashboard/admin/api/user-management", { action: "exportCsv", payload: { ids } }, { responseType: "blob" });
      const blob = new Blob([res.data], { type: "text/csv;charset=utf-8;" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `users-export-${Date.now()}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      await Swal.fire("Exported", "CSV exported successfully", "success");
    } catch (e) {
      console.error(e);
      await Swal.fire("Error", "Export failed", "error");
    }
  };

  // ----- render -----
  return (
    <AdminRoute>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">User Management</h1>
          <p className="text-muted-foreground mt-2">Manage user accounts, permissions, and access controls</p>
        </div>

        <UserCard stats={stats} loading={initialLoading} />

        <Card className="card-glass">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>User Directory</CardTitle>
                <CardDescription>Search, filter, and manage user accounts</CardDescription>
              </div>

              <div className="flex items-center space-x-2">
                <Button className="btn-hero" onClick={() => setOpenAddModal(true)} disabled={adding}>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add User
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            {/* Search & filter */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
  placeholder="Search users by name, email, or ID..."
  className="pl-10 pr-12"
  value={search}
  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
  onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setDebouncedSearch(e.currentTarget.value);
      setPage(1);
    }
  }}
/>

                {!initialLoading && fetching && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <SmallSpinner />
                  </div>
                )}
              </div>

              {/* Desktop filters */}
              <div className="hidden sm:flex gap-2 items-center">
                <select className="rounded-md border px-3 py-2" value={roleFilter} onChange={(e) => { setRoleFilter(e.target.value); setPage(1); }}>
                  <option value="">All roles</option>
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>

                <select className="rounded-md border px-3 py-2" value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}>
                  <option value="">All status</option>
                  <option value="Active">Active</option>
                  <option value="Not-Active">Not-Active</option>
                  <option value="Suspended">Suspended</option>
                </select>

                <select className="rounded-md border px-3 py-2" value={perPage} onChange={(e) => { setPerPage(Number(e.target.value)); setPage(1); }}>
                  <option value={10}>10 / page</option>
                  <option value={20}>20 / page</option>
                  <option value={50}>50 / page</option>
                  <option value={100}>100 / page</option>
                </select>

                <Button variant="outline" onClick={() => { setPage(1); fetchUsers(); }}>
                  <Filter className="h-4 w-4 mr-2" /> Filter
                </Button>
              </div>

              {/* Mobile filter toggle */}
              <div className="sm:hidden flex items-center">
                <div className="relative">
                  <Button variant="outline" onClick={() => setShowMobileFilters((s) => !s)}>
                    <Filter className="h-4 w-4 mr-2" /> Filters
                  </Button>
                  {showMobileFilters && (
                    <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-slate-800 border rounded-lg shadow-lg p-3 z-40">
                      <label className="text-sm">Role</label>
                      <select className="w-full rounded-md border px-3 py-2 mt-1" value={roleFilter} onChange={(e) => { setRoleFilter(e.target.value); setPage(1); }}>
                        <option value="">All roles</option>
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                      </select>

                      <label className="text-sm mt-3">Status</label>
                      <select className="w-full rounded-md border px-3 py-2 mt-1" value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}>
                        <option value="">All status</option>
                        <option value="Active">Active</option>
                        <option value="Not-Active">Not-Active</option>
                        <option value="Suspended">Suspended</option>
                      </select>

                      <label className="text-sm mt-3">Per page</label>
                      <select className="w-full rounded-md border px-3 py-2 mt-1" value={perPage} onChange={(e) => { setPerPage(Number(e.target.value)); setPage(1); }}>
                        <option value={10}>10 / page</option>
                        <option value={20}>20 / page</option>
                        <option value={50}>50 / page</option>
                        <option value={100}>100 / page</option>
                      </select>

                      <div className="flex gap-2 mt-3">
                        <Button className="flex-1" onClick={() => { setShowMobileFilters(false); fetchUsers(); }}>Apply</Button>
                        <Button variant="outline" className="flex-1" onClick={() => { setShowMobileFilters(false); setRoleFilter(""); setStatusFilter(""); setPerPage(20); }}>Reset</Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <BulkActions
              selectedCount={selectedIds.size}
              onSelectAll={selectAllOnPage}
              onClearSelection={clearSelection}
              onBulkRole={() => setOpenBulkRoleModal(true)}
              onBulkEmail={() => setOpenBulkEmailModal(true)}
              onExportCsv={handleExportCsv}
            />

            <div className="overflow-x-auto">
              <UserList
                users={users}
                loading={initialLoading}
                selectedIds={selectedIds}
                toggleSelect={toggleSelect}
                onBan={handleBan}
                onUnban={handleUnban}
                onDelete={handleDelete}
                onOpenUpdateRole={(id, role) => { setOpenUpdateRoleModal({ open: true, id }); setRoleValue(role ?? "user"); }}
                onOpenChangeMembership={(id, membership) => { setOpenChangeMembershipModal({ open: true, id }); setMembershipValue(membership ?? "Free"); }}
                searchTerm={debouncedSearch}
              />
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mt-4 gap-2">
              <div className="text-sm text-muted-foreground">
                {users === null ? "Loading..." : `Showing ${total === 0 ? 0 : Math.min((page - 1) * perPage + 1, total)} - ${Math.min(page * perPage, total)} of ${total}`}
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>Prev</Button>
                <div className="px-3 py-1 rounded border">{page}</div>
                <Button variant="outline" onClick={() => setPage((p) => Math.min(maxPage, p + 1))} disabled={page >= maxPage}>Next</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="card-glass">
            <CardHeader>
              <CardTitle>Bulk Operations</CardTitle>
              <CardDescription>Perform actions on multiple users simultaneously</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start" onClick={() => setOpenBulkEmailModal(true)} disabled={selectedIds.size === 0}>
                  <Mail className="h-4 w-4 mr-2" /> Send Email to Users
                </Button>
                <Button variant="outline" className="w-full justify-start" onClick={() => setOpenBulkRoleModal(true)} disabled={selectedIds.size === 0}>
                  <UserPlus className="h-4 w-4 mr-2" /> Update User Roles
                </Button>
                <Button variant="outline" className="w-full justify-start" disabled={selectedIds.size === 0}>
                  <Users className="h-4 w-4 mr-2" /> Modify Permissions
                </Button>
                <Button variant="outline" className="w-full justify-start" onClick={handleExportCsv} disabled={selectedIds.size === 0}>
                  <Users className="h-4 w-4 mr-2" /> Export User Data
                </Button>
              </div>
            </CardContent>
          </Card>

          <UserActivityCard loading={initialLoading} activities={recentActivities} />
        </div>

        <RolePermissionsCard />
      </div>

      {/* Modals */}
      <AddUserModal
        open={openAddModal}
        onClose={() => setOpenAddModal(false)}
        addForm={addForm}
        setAddForm={setAddForm}
        onSubmit={submitAddUser}
        submitting={adding}
      />

      <BulkRoleModal
        open={openBulkRoleModal}
        onClose={() => setOpenBulkRoleModal(false)}
        selectedCount={selectedIds.size}
        value={bulkRoleValue}
        setValue={setBulkRoleValue}
        onApply={submitBulkRoleUpdate}
      />

      <BulkEmailModal
        open={openBulkEmailModal}
        onClose={() => setOpenBulkEmailModal(false)}
        selectedCount={selectedIds.size}
        value={bulkEmailForm}
        setValue={setBulkEmailForm}
        onSend={submitBulkEmail}
      />

      <ChangeMembershipModal
        open={openChangeMembershipModal.open}
        onClose={() => setOpenChangeMembershipModal({ open: false })}
        userId={openChangeMembershipModal.id}
        value={membershipValue}
        setValue={setMembershipValue}
        onUpdate={submitChangeMembership}
      />

      <UpdateRoleModal
        open={openUpdateRoleModal.open}
        onClose={() => setOpenUpdateRoleModal({ open: false })}
        userId={openUpdateRoleModal.id}
        value={roleValue}
        setValue={setRoleValue}
        onUpdate={submitUpdateRole}
      />
    </AdminRoute>
  );
}