import { Shield, Users, BarChart3, Settings, Database, Key } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import AdminRoute from "@/app/Routes/AdminRoute";

const AdminPanel = () => {
  return (
    <AdminRoute>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Administrative overview and system management
          </p>
        </div>

        {/* Admin Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="card-glass">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                  <p className="text-3xl font-bold">1,247</p>
                  <p className="text-xs text-green-primary">+12% this month</p>
                </div>
                <Users className="h-8 w-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="card-glass">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Sessions</p>
                  <p className="text-3xl font-bold">89</p>
                  <p className="text-xs text-blue-400">Currently online</p>
                </div>
                <BarChart3 className="h-8 w-8 text-green-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="card-glass">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">System Health</p>
                  <p className="text-3xl font-bold">99.8%</p>
                  <p className="text-xs text-green-primary">Uptime</p>
                </div>
                <Database className="h-8 w-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="card-glass">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Security Score</p>
                  <p className="text-3xl font-bold">A+</p>
                  <p className="text-xs text-green-primary">Excellent</p>
                </div>
                <Shield className="h-8 w-8 text-yellow-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="card-glass">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common administrative tasks and system management</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
                <Users className="h-6 w-6" />
                <span className="font-medium">User Management</span>
                <span className="text-xs text-muted-foreground">Manage user accounts and permissions</span>
              </Button>
              <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
                <Settings className="h-6 w-6" />
                <span className="font-medium">System Settings</span>
                <span className="text-xs text-muted-foreground">Configure system parameters</span>
              </Button>
              <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
                <BarChart3 className="h-6 w-6" />
                <span className="font-medium">Analytics</span>
                <span className="text-xs text-muted-foreground">View detailed system analytics</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* System Status */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="card-glass">
            <CardHeader>
              <CardTitle>System Status</CardTitle>
              <CardDescription>Real-time system health monitoring</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">API Server</span>
                  <Badge variant="default" className="bg-green-primary">Healthy</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Database</span>
                  <Badge variant="default" className="bg-green-primary">Connected</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">AI Services</span>
                  <Badge variant="default" className="bg-green-primary">Running</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">File Storage</span>
                  <Badge variant="default" className="bg-green-primary">Available</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Email Service</span>
                  <Badge variant="secondary">Degraded</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Background Jobs</span>
                  <Badge variant="default" className="bg-green-primary">Processing</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-glass">
            <CardHeader>
              <CardTitle>Recent Activities</CardTitle>
              <CardDescription>Latest administrative actions and system events</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { action: "User registration spike detected", time: "5 minutes ago", type: "info" },
                  { action: "System backup completed", time: "1 hour ago", type: "success" },
                  { action: "Email service degradation", time: "2 hours ago", type: "warning" },
                  { action: "Security scan completed", time: "4 hours ago", type: "success" },
                  { action: "Database optimization finished", time: "6 hours ago", type: "info" },
                ].map((activity, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <div className={`w-2 h-2 rounded-full ${activity.type === "success" ? "bg-green-primary" :
                        activity.type === "warning" ? "bg-yellow-400" :
                          activity.type === "error" ? "bg-red-400" : "bg-blue-400"
                      }`} />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{activity.action}</p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Access Control */}
        <Card className="card-glass">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Key className="h-5 w-5 mr-2" />
              Access Control
            </CardTitle>
            <CardDescription>Manage admin permissions and security settings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-semibold">Admin Roles</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div>
                      <p className="font-medium text-sm">Super Admin</p>
                      <p className="text-xs text-muted-foreground">Full system access</p>
                    </div>
                    <Badge variant="destructive">Critical</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div>
                      <p className="font-medium text-sm">Content Manager</p>
                      <p className="text-xs text-muted-foreground">Content and user management</p>
                    </div>
                    <Badge variant="secondary">Limited</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div>
                      <p className="font-medium text-sm">Analytics Viewer</p>
                      <p className="text-xs text-muted-foreground">Read-only analytics access</p>
                    </div>
                    <Badge variant="outline">Read-only</Badge>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold">Security Settings</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Two-Factor Authentication</span>
                    <Badge variant="default" className="bg-green-primary">Enabled</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Session Timeout</span>
                    <span className="text-sm text-muted-foreground">30 minutes</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">IP Restrictions</span>
                    <Badge variant="default" className="bg-green-primary">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Audit Logging</span>
                    <Badge variant="default" className="bg-green-primary">Enabled</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Failed Login Lockout</span>
                    <span className="text-sm text-muted-foreground">5 attempts</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Performance Metrics */}
        <Card className="card-glass">
          <CardHeader>
            <CardTitle>Performance Metrics</CardTitle>
            <CardDescription>System performance and usage statistics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center space-y-2">
                <div className="text-2xl font-bold text-blue-400">2.3s</div>
                <p className="text-sm text-muted-foreground">Avg Response Time</p>
              </div>
              <div className="text-center space-y-2">
                <div className="text-2xl font-bold text-green-primary">99.9%</div>
                <p className="text-sm text-muted-foreground">Success Rate</p>
              </div>
              <div className="text-center space-y-2">
                <div className="text-2xl font-bold text-purple-400">1.2M</div>
                <p className="text-sm text-muted-foreground">Monthly Requests</p>
              </div>
              <div className="text-center space-y-2">
                <div className="text-2xl font-bold text-yellow-400">45GB</div>
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