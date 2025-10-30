"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Delete, Filter } from "lucide-react";
import { APIUser } from "@/types/APIUser";

type Props = {
  users: APIUser[] | null;
  loading: boolean;
  selectedIds: Set<string>;
  toggleSelect: (id?: string | null) => void;
  onBan: (id?: string | null) => void;
  onUnban: (id?: string | null) => void;
  onDelete: (id?: string | null) => void;
  onOpenUpdateRole: (id?: string | null, role?: string | null) => void;
  onOpenChangeMembership: (id?: string | null, membership?: string | null) => void;
  searchTerm?: string;
  onOpenFilters?: () => void;
  onApplyFilters?: (filters: { role?: string; status?: string; perPage?: number }) => void;
  /**
   * If parent already renders a filter button, set this to false to avoid duplicate filter buttons.
   * Default: true
   */
  showFilterButton?: boolean;
};

const badgeForStatus = (s?: string | null) => {
  const base = "px-2 py-0.5 rounded text-xs inline-block";
  if (s === "Active") return `${base} bg-green-500 text-white`;
  if (s === "Not-Active") return `${base} bg-red-500 text-white`;
  if (s === "Suspended") return `${base} bg-yellow-400 text-black`;
  return `${base} bg-gray-200 text-gray-800`;
};

const badgeForMembership = (m?: string | null) => {
  const base = "px-2 py-0.5 rounded text-xs inline-block";
  if (!m) return `${base} bg-gray-200 text-gray-800`;
  if (m.toLowerCase().includes("free")) return `${base} bg-slate-200 text-slate-800`;
  if (m.toLowerCase().includes("premium") || m.toLowerCase().includes("pro")) return `${base} bg-green-500 text-white`;
  if (m.toLowerCase().includes("enterprise")) return `${base} bg-purple-500 text-white`;
  return `${base} bg-gray-200 text-gray-800`;
};

const initials = (name?: string | null) => {
  if (!name) return "U";
  return (
    name
      .split(" ")
      .map((p) => p?.[0] ?? "")
      .slice(0, 2)
      .join("")
      .toUpperCase() || "U"
  );
};

export default function UserList(props: Props) {
  const {
    users,
    loading,
    selectedIds,
    toggleSelect,
    onBan,
    onUnban,
    onDelete,
    onOpenUpdateRole,
    onOpenChangeMembership,
    searchTerm = "",
    onOpenFilters,
    onApplyFilters,
    showFilterButton = true,
  } = props;

  // --------------------
  // Hooks (always declared)
  // --------------------
  const [filterOpen, setFilterOpen] = useState(false);
  const [filterRole, setFilterRole] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<string>("");
  const [filterPerPage, setFilterPerPage] = useState<number>(20);
  const filterRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent | TouchEvent) => {
      if (filterOpen && filterRef.current && !filterRef.current.contains(e.target as Node)) {
        setFilterOpen(false);
      }
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setFilterOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("touchstart", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("touchstart", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [filterOpen]);

  // memoized filtered users (hook placed before any return)
  const filteredUsers = useMemo(() => {
    if (!users) return [];
    if (!searchTerm.trim()) return users;
    const term = searchTerm.toLowerCase();
    return users.filter(
      (u) =>
        u.name?.toLowerCase().includes(term) ||
        u.email?.toLowerCase().includes(term) ||
        u.id?.toLowerCase().includes(term)
    );
  }, [users, searchTerm]);

  // --------------------
  // Helper UI pieces
  // --------------------
  const SkeletonRow = ({ height = 28 }: { height?: number }) => (
    <div className="w-full rounded-xl animate-pulse bg-slate-200 dark:bg-slate-700" style={{ height }} aria-hidden />
  );

  // single filter open handler (keeps parent callback optional)
  const openFilters = () => {
    setFilterOpen(true);
    onOpenFilters?.();
  };

  // --------------------
  // Compose content (no early hook-breaking returns)
  // --------------------
  let content: React.ReactNode;

  if (loading || users === null) {
    content = (
      <div className="space-y-4">
        <div className="hidden sm:block w-full overflow-x-auto rounded-md border border-gray-200">
          <table className="w-full min-w-[700px] table-auto">
            <thead className="bg-gray-50">
              <tr>
                {["#", "Name", "Email", "Role", "Membership", "Actions"].map((h) => (
                  <th key={h} className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y">
              {Array.from({ length: 4 }).map((_, i) => (
                <tr key={i} className="odd:bg-white even:bg-slate-50">
                  {Array.from({ length: 6 }).map((_, j) => (
                    <td key={j} className="px-4 py-3">
                      <SkeletonRow />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="block sm:hidden space-y-3">
          {Array.from({ length: 4 }).map((_, idx) => (
            <div key={idx} className="rounded-xl border p-3 bg-white dark:bg-slate-900">
              <SkeletonRow height={88} />
            </div>
          ))}
        </div>
      </div>
    );
  } else if (filteredUsers.length === 0) {
    // Allow filter button to exist even when no users found
    content = <div className="p-4 text-sm text-muted-foreground">No users found.</div>;
  } else {
    // Desktop table
    const table = (
      <div className="hidden sm:block w-full overflow-x-auto rounded-md border border-accent/20">
        <table className="w-full min-w-[700px] table-auto">
          <thead className="bg-card-secondary">
            <tr>
              {["#", "Name", "Email", "Role", "Membership", "Quick Action"].map((h) => (
                <th key={h} className="px-4 py-2 text-left text-sm font-medium">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y">
            {filteredUsers.map((user, idx) => (
              <tr key={user.id ?? idx} className="odd:bg-card/10 even:bg-card">
                <td className="px-4 py-3 whitespace-nowrap">
                  <input type="checkbox" checked={user.id ? selectedIds.has(user.id) : false} onChange={() => toggleSelect(user.id)} />
                </td>
                <td className="px-4 py-3 whitespace-nowrap flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback className="bg-green-600 text-white">{initials(user.name)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{user.name}</div>
                    <div className="text-xs text-muted-foreground">{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "—"}</div>
                  </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-muted-foreground">{user.email}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm">
                  <div className="flex gap-4 items-center">
                    {user.role}
                    <span className={badgeForStatus(user.status)}>{user.status ?? "Active"}</span>
                  </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span className={badgeForMembership(user.membershipType)}>{user.membershipType ?? "Free"}</span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-right flex gap-2 justify-end">
                  {user.status !== "Not-Active" ? (
                    <Button variant="ghost" size="sm" onClick={() => onBan(user.id)}>
                      Ban
                    </Button>
                  ) : (
                    <Button variant="ghost" size="sm" onClick={() => onUnban(user.id)}>
                      Unban
                    </Button>
                  )}
                  <Button variant="ghost" size="sm" onClick={() => onOpenUpdateRole(user.id, user.role)}>
                    Role
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => onOpenChangeMembership(user.id, user.membershipType)}>
                    Membership
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => onDelete(user.id)}>
                    <Delete className="h-4 w-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );

    // Mobile cards (no extra filter button here)
    const cards = (
      <div className="block sm:hidden space-y-4">
        {filteredUsers.map((user, idx) => (
          <div key={user.id ?? idx} className="border rounded-xl bg-white dark:bg-slate-900 p-4 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <div className={badgeForStatus(user.status)}>{user.status ?? "Active"}</div>
              <input type="checkbox" checked={user.id ? selectedIds.has(user.id) : false} onChange={() => toggleSelect(user.id)} className="h-5 w-5" />
            </div>
            <div className="flex items-center gap-3 mt-3">
              <Avatar>
                <AvatarFallback className="bg-green-600 text-white">{initials(user.name)}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm truncate">{user.name}</div>
                <div className="text-xs text-muted-foreground truncate">{user.email}</div>
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground gap-3">
              <span className={badgeForMembership(user.membershipType)}>{user.membershipType ?? "Free"}</span>
              <span>
                Role: <span className="font-medium">{user.role}</span>
              </span>
            </div>
            <div className="mt-3 flex gap-2 flex-wrap">
              {user.status !== "Not-Active" ? (
                <Button variant="outline" size="sm" onClick={() => onBan(user.id)}>
                  Ban
                </Button>
              ) : (
                <Button variant="outline" size="sm" onClick={() => onUnban(user.id)}>
                  Unban
                </Button>
              )}
              <Button variant="outline" size="sm" onClick={() => onOpenUpdateRole(user.id, user.role)}>
                Role
              </Button>
              <Button variant="outline" size="sm" onClick={() => onOpenChangeMembership(user.id, user.membershipType)}>
                Membership
              </Button>
              <Button variant="destructive" size="sm" onClick={() => onDelete(user.id)}>
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>
    );

    content = (
      <>
        {table}
        {cards}
      </>
    );
  }

  // Filter modal (single place)
  const filterModal = filterOpen && (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" aria-hidden />
      <div ref={filterRef} className="relative z-10 w-[95%] max-w-md rounded-xl bg-white dark:bg-slate-900 p-5 shadow-lg" role="dialog" aria-modal="true">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Filter users</h3>
          <button onClick={() => setFilterOpen(false)} aria-label="Close" className="text-sm text-muted-foreground">
            Close
          </button>
        </div>
        <div className="space-y-3">
          <div>
            <label className="text-sm block mb-1">Role</label>
            <select value={filterRole} onChange={(e) => setFilterRole(e.target.value)} className="w-full border rounded px-2 py-1">
              <option value="">All</option>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div>
            <label className="text-sm block mb-1">Status</label>
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="w-full border rounded px-2 py-1">
              <option value="">All</option>
              <option value="Active">Active</option>
              <option value="Not-Active">Not-Active</option>
              <option value="Suspended">Suspended</option>
            </select>
          </div>
          <div>
            <label className="text-sm block mb-1">Per page</label>
            <select value={String(filterPerPage)} onChange={(e) => setFilterPerPage(Number(e.target.value))} className="w-full border rounded px-2 py-1">
              {[10, 20, 50, 100].map((v) => (
                <option key={v} value={v}>
                  {v} / page
                </option>
              ))}
            </select>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" size="sm" onClick={() => setFilterOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={() => {
                onApplyFilters?.({ role: filterRole || undefined, status: filterStatus || undefined, perPage: filterPerPage });
                setFilterOpen(false);
              }}
            >
              Apply
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  // --------------------
  // Final render: show filter button ONLY on mobile (sm:hidden) + content + modal
  // --------------------
  return (
    <>
      {/* filter button visible only on small screens (mobile) */}
      <div className="mb-4 flex items-center justify-end sm:hidden">
        {showFilterButton && (
          <Button variant="outline" size="sm" onClick={openFilters}>
            <Filter className="mr-2 h-4 w-4" /> Filters
          </Button>
        )}
      </div>

      {content}
      {filterModal}
    </>
  );
}
