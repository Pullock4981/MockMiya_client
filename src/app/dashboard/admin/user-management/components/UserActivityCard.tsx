"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

type Activity = {
  action: string;
  time?: string;
};

type UserActivityCardProps = {
  activities: Activity[];
  loading: boolean;
};

const SkeletonBlock = ({ height = 28 }: { height?: number }) => (
  <div className="w-full rounded-xl animate-pulse bg-slate-200 dark:bg-slate-700" style={{ height }} />
);

const UserActivityCard: React.FC<UserActivityCardProps> = ({ activities, loading }) => {
  return (
    <Card className="card-glass">
      <CardHeader>
        <CardTitle>User Activity</CardTitle>
        <CardDescription>Recent user activities and system events</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {loading ? (
            Array(5).fill(0).map((_, i) => <SkeletonBlock key={i} />)
          ) : activities.length === 0 ? (
            <div className="text-sm text-muted-foreground">No recent activity</div>
          ) : (
            activities.slice(0, 8).map((act, i) => (
              <div key={i} className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-400 rounded-full" />
                <div className="flex-1">
                  <p className="text-sm font-medium">{act.action}</p>
                  <p className="text-xs text-muted-foreground">{act.time ? new Date(act.time).toLocaleString() : ""}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default UserActivityCard;
