"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const RolePermissionsCard: React.FC = () => {
  return (
    <Card className="card-glass">
      <CardHeader>
        <CardTitle>Role & Permission Management</CardTitle>
        <CardDescription>Configure user roles and their associated permissions</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Free */}
          <div className="space-y-4">
            <h4 className="font-semibold">Free User</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between"><span>Resume Builder</span><Badge variant="outline" className="text-green-600 border-green-600">Limited</Badge></div>
              <div className="flex items-center justify-between"><span>Interview Practice</span><Badge variant="outline" className="text-green-600 border-green-600">3/month</Badge></div>
              <div className="flex items-center justify-between"><span>Job Analysis</span><Badge variant="destructive">Disabled</Badge></div>
              <div className="flex items-center justify-between"><span>AI Features</span><Badge variant="destructive">Disabled</Badge></div>
            </div>
          </div>
          {/* Premium */}
          <div className="space-y-4">
            <h4 className="font-semibold">Premium User</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between"><span>Resume Builder</span><Badge variant="default" className="bg-green-600">Unlimited</Badge></div>
              <div className="flex items-center justify-between"><span>Interview Practice</span><Badge variant="default" className="bg-green-600">Unlimited</Badge></div>
              <div className="flex items-center justify-between"><span>Job Analysis</span><Badge variant="default" className="bg-green-600">Enabled</Badge></div>
              <div className="flex items-center justify-between"><span>AI Features</span><Badge variant="default" className="bg-green-600">Full Access</Badge></div>
            </div>
          </div>
          {/* Admin */}
          <div className="space-y-4">
            <h4 className="font-semibold">Admin</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between"><span>User Management</span><Badge variant="default" className="bg-purple-400">Full Access</Badge></div>
              <div className="flex items-center justify-between"><span>System Settings</span><Badge variant="default" className="bg-purple-400">Full Access</Badge></div>
              <div className="flex items-center justify-between"><span>Analytics</span><Badge variant="default" className="bg-purple-400">Full Access</Badge></div>
              <div className="flex items-center justify-between"><span>Content Management</span><Badge variant="default" className="bg-purple-400">Full Access</Badge></div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RolePermissionsCard;
