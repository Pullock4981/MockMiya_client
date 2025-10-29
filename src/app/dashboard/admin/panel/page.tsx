"use client";

import { useEffect, useState, useRef } from "react";
import axios, { CancelTokenSource } from "axios";
import {
  Shield,
  Users,
  BarChart3,
  Database,
  Play,
  Pause,
  RefreshCw,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import AdminRoute from "@/app/Routes/AdminRoute";

type Activity = { action: string; time: string; type?: string; page?: string };

type StatsData = {
  totalUsers: number;
  verifiedUsers: number;
  newUsersLast30Days: number;
  activeSessions: number;
  recentActivities: Activity[];
  activitiesByPage?: { page: string; count: number }[];
  performanceMetrics: {
    avgResponseTime: number;
    successRate: number;
    monthlyRequests: number;
    dataProcessedGB: number;
  };
  systemHealth: {
    uptimePercent: number;
    status: string;
    securityScore: string;
  };
  totalResumes?: number;
  draftResumes?: number;
  completedResumes?: number;
  codingSubmissionsCount?: number;
};

const CustomSkeleton = ({ height = 64 }: { height?: number }) => (
  <div
    className="w-full rounded-xl animate-pulse bg-slate-200 dark:bg-slate-700"
    style={{ height }}
  />
);

const AdminPanel = () => {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);

  const intervalRef = useRef<number | null>(null);
  const cancelTokenRef = useRef<CancelTokenSource | null>(null);

  const fetchStats = async (showSkeleton = false) => {
    if (showSkeleton) setLoading(true);
    if (cancelTokenRef.current) cancelTokenRef.current.cancel("Cancelled previous request");
    cancelTokenRef.current = axios.CancelToken.source();

    try {
      const { data } = await axios.get<StatsData>("/dashboard/admin/api/stats", {
        cancelToken: cancelTokenRef.current.token,
      });
      setStats(data);
    } catch (err: unknown) {
      if (!axios.isCancel(err)) {
        if (err instanceof Error) {
          console.error("❌ Error fetching stats:", err.message);
        } else {
          console.error("❌ Error fetching stats:", err);
        }
      }
    } finally {
      if (showSkeleton) setLoading(false);
    }

  };

  // Initial load
  useEffect(() => {
    fetchStats(true);
    return () => cancelTokenRef.current?.cancel();
  }, []);

  // Auto-refresh every 30s
  useEffect(() => {
    if (intervalRef.current !== null) clearInterval(intervalRef.current);

    if (autoRefresh) {
      intervalRef.current = window.setInterval(() => {
        fetchStats(); // silent refresh
      }, 30000);
    }

    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [autoRefresh]);

  const handleManualRefresh = () => fetchStats(true);

  return (
    <AdminRoute>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground mt-2">
              Administrative overview and system management
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              onClick={() => setAutoRefresh(v => !v)}
              title={autoRefresh ? "Pause auto-refresh" : "Start auto-refresh"}
            >
              {autoRefresh ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              <span className="ml-2 text-sm">{autoRefresh ? "Auto: On" : "Auto: Off"}</span>
            </Button>
            <Button onClick={handleManualRefresh} variant="outline">
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Top Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Total Users */}
          <Card className="card-glass">
            <CardContent className="p-6 flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground">Total Users</p>
                {loading || !stats ? (
                  <CustomSkeleton height={32} />
                ) : (
                  <p className="text-3xl font-bold">{stats.totalUsers}</p>
                )}
                {!loading && stats && (
                  <p className="text-xs text-green-primary">
                    +{stats.newUsersLast30Days} new (30d)
                  </p>
                )}
              </div>
              <Users className="h-8 w-8 text-blue-400" />
            </CardContent>
          </Card>

          {/* Active Sessions */}
          <Card className="card-glass">
            <CardContent className="p-6 flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground">Active Sessions</p>
                {loading || !stats ? (
                  <CustomSkeleton height={32} />
                ) : (
                  <p className="text-3xl font-bold">{stats.activeSessions}</p>
                )}
                {!loading && stats && <p className="text-xs text-blue-400">Currently online</p>}
              </div>
              <BarChart3 className="h-8 w-8 text-green-primary" />
            </CardContent>
          </Card>

          {/* System Health */}
          <Card className="card-glass">
            <CardContent className="p-6 flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground">System Health</p>
                {loading || !stats ? (
                  <CustomSkeleton height={32} />
                ) : (
                  <p className="text-3xl font-bold">{stats.systemHealth.uptimePercent}%</p>
                )}
                {!loading && stats && (
                  <p className="text-xs text-green-primary">{stats.systemHealth.status}</p>
                )}
              </div>
              <Database className="h-8 w-8 text-purple-400" />
            </CardContent>
          </Card>

          {/* Security Score */}
          <Card className="card-glass">
            <CardContent className="p-6 flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground">Security Score</p>
                {loading || !stats ? (
                  <CustomSkeleton height={32} />
                ) : (
                  <p className="text-3xl font-bold">{stats.systemHealth.securityScore}</p>
                )}
                {!loading && stats && <p className="text-xs text-green-primary">Excellent</p>}
              </div>
              <Shield className="h-8 w-8 text-yellow-400" />
            </CardContent>
          </Card>
        </div>

        {/* System Status + Recent Activities */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* System Status */}
          <Card className="card-glass">
            <CardHeader>
              <CardTitle>System Status</CardTitle>
              <CardDescription>Real-time system monitoring</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {loading
                  ? Array(6).fill(0).map((_, i) => <CustomSkeleton key={i} height={24} />)
                  : [
                    { label: "API Server", status: "Healthy" },
                    { label: "Database", status: "Connected" },
                    { label: "AI Services", status: "Running" },
                    { label: "File Storage", status: "Available" },
                    { label: "Email Service", status: "Degraded" },
                    { label: "Background Jobs", status: "Processing" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between text-sm">
                      <span>{item.label}</span>
                      <Badge
                        className={
                          ["Healthy", "Connected", "Running", "Available", "Processing"].includes(item.status)
                            ? "bg-green-primary"
                            : "bg-yellow-400"
                        }
                      >
                        {item.status}
                      </Badge>
                    </div>
                  ))
                }
              </div>
            </CardContent>
          </Card>

          {/* Recent Activities */}
          <Card className="card-glass">
            <CardHeader>
              <CardTitle>Recent Activities</CardTitle>
              <CardDescription>Latest admin actions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {loading
                ? Array(5).fill(0).map((_, i) => <CustomSkeleton key={i} height={24} />)
                : stats?.recentActivities?.map((act, i) => (
                  <div key={i} className="flex items-center space-x-3">
                    <div
                      className={`w-2 h-2 rounded-full ${act.type === "success"
                          ? "bg-green-primary"
                          : act.type === "warning"
                            ? "bg-yellow-400"
                            : act.type === "error"
                              ? "bg-red-400"
                              : "bg-blue-400"
                        }`}
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{act.action}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(act.time).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))
              }
            </CardContent>
          </Card>
        </div>

        {/* Performance Metrics */}
        <Card className="card-glass">
          <CardHeader>
            <CardTitle>Performance Metrics</CardTitle>
            <CardDescription>System usage & performance statistics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
              {/* Avg Response Time */}
              <div>
                {loading || !stats ? <CustomSkeleton height={32} /> : (
                  <p className="text-2xl font-bold text-blue-400">{stats.performanceMetrics.avgResponseTime}s</p>
                )}
                <p className="text-sm text-muted-foreground">Avg Response Time</p>
              </div>

              {/* Success Rate */}
              <div>
                {loading || !stats ? <CustomSkeleton height={32} /> : (
                  <p className="text-2xl font-bold text-green-primary">{stats.performanceMetrics.successRate}%</p>
                )}
                <p className="text-sm text-muted-foreground">Success Rate</p>
              </div>

              {/* Monthly Requests */}
              <div>
                {loading || !stats ? <CustomSkeleton height={32} /> : (
                  <p className="text-2xl font-bold text-purple-400">{stats.performanceMetrics.monthlyRequests.toLocaleString()}+</p>
                )}
                <p className="text-sm text-muted-foreground">Monthly Requests</p>
              </div>

              {/* Data Processed */}
              <div>
                {loading || !stats ? <CustomSkeleton height={32} /> : (
                  <p className="text-2xl font-bold text-yellow-400">{stats.performanceMetrics.dataProcessedGB}GB</p>
                )}
                <p className="text-sm text-muted-foreground">Data Processed</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminRoute>
  );
};

export default AdminPanel;
