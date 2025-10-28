// src/app/dashboard/admin/user-management/UserCard.tsx
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Shield, UserPlus, Mail } from "lucide-react";
import { Stats } from "@/types/APIUser";

export default function UserCard({ stats, loading }: { stats: Stats | null; loading?: boolean; }) {
  const showSkeleton = Boolean(loading || stats === null);

  if (showSkeleton) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {Array(4).fill(0).map((_, i) => (
          <div key={i} className="h-24 bg-slate-200 dark:bg-slate-700 rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  // now stats is non-null (or you intentionally want to show zeros if counts are zero)
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
      <Card className="card-glass">
        <CardContent className="p-6 flex justify-between items-center">
          <div>
            <p className="text-sm text-muted-foreground">Total Users</p>
            <p className="text-3xl font-bold">{stats!.total}</p>
            <p className="text-xs text-green-600">+{stats!.newLast30Days} new (30d)</p>
          </div>
          <Users className="h-8 w-8 text-blue-400" />
        </CardContent>
      </Card>

      <Card className="card-glass">
        <CardContent className="p-6 flex justify-between items-center">
          <div>
            <p className="text-sm text-muted-foreground">Active Users</p>
            <p className="text-3xl font-bold">{stats!.activeUsers}</p>
            <p className="text-xs text-blue-400">Currently Active</p>
          </div>
          <Shield className="h-8 w-8 text-green-500" />
        </CardContent>
      </Card>

      <Card className="card-glass">
        <CardContent className="p-6 flex justify-between items-center">
          <div>
            <p className="text-sm text-muted-foreground">Premium Users</p>
            <p className="text-3xl font-bold">{stats!.premiumUsers}</p>
            <p className="text-xs text-purple-400">Conversion</p>
          </div>
          <UserPlus className="h-8 w-8 text-purple-400" />
        </CardContent>
      </Card>

      <Card className="card-glass">
        <CardContent className="p-6 flex justify-between items-center">
          <div>
            <p className="text-sm text-muted-foreground">New This Month</p>
            <p className="text-3xl font-bold">{stats!.newLast30Days}</p>
            <p className="text-xs text-yellow-400">vs last month</p>
          </div>
          <Mail className="h-8 w-8 text-yellow-400" />
        </CardContent>
      </Card>
    </div>
  );
}
