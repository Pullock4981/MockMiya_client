import { Terminal, Code, Database, Server, RefreshCw, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import AdminRoute from "@/app/Routes/AdminRoute";

const AdminConsole = () => {
  return (
    <AdminRoute>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Admin Console</h1>
          <p className="text-muted-foreground mt-2">
            Advanced system management and administrative tools
          </p>
        </div>

        {/* System Commands */}
        <Card className="card-glass">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Terminal className="h-5 w-5 mr-2" />
              System Console
            </CardTitle>
            <CardDescription>
              Execute administrative commands and view system logs
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-black/90 rounded-lg p-4 font-mono text-sm">
                <div className="text-green-primary">admin@mockmiya:~$ system status</div>
                <div className="text-white mt-2">
                  ✓ API Gateway: Running (Port 3000)<br />
                  ✓ Database: Connected (MongoDB)<br />
                  ✓ Redis Cache: Active<br />
                  ✓ AI Services: Operational<br />
                  ⚠ Email Queue: 23 pending messages<br />
                  ✓ File Storage: 89% available<br />
                  ✓ Background Workers: 4/4 active
                </div>
                <div className="text-green-primary mt-4">admin@mockmiya:~$ <span className="animate-pulse">|</span></div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh Status
                </Button>
                <Button variant="outline" size="sm">
                  <Database className="h-4 w-4 mr-2" />
                  DB Health Check
                </Button>
                <Button variant="outline" size="sm">
                  <Server className="h-4 w-4 mr-2" />
                  Restart Services
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Database Management */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="card-glass">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Database className="h-5 w-5 mr-2" />
                Database Operations
              </CardTitle>
              <CardDescription>
                Manage database operations and monitoring
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-muted/30 rounded-lg text-center">
                    <div className="text-lg font-bold text-blue-400">1,247</div>
                    <p className="text-xs text-muted-foreground">Users</p>
                  </div>
                  <div className="p-3 bg-muted/30 rounded-lg text-center">
                    <div className="text-lg font-bold text-green-primary">5,832</div>
                    <p className="text-xs text-muted-foreground">Resumes</p>
                  </div>
                  <div className="p-3 bg-muted/30 rounded-lg text-center">
                    <div className="text-lg font-bold text-purple-400">12,456</div>
                    <p className="text-xs text-muted-foreground">Interviews</p>
                  </div>
                  <div className="p-3 bg-muted/30 rounded-lg text-center">
                    <div className="text-lg font-bold text-yellow-400">89.2%</div>
                    <p className="text-xs text-muted-foreground">Storage Used</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start text-sm">
                    <Code className="h-4 w-4 mr-2" />
                    Execute Query
                  </Button>
                  <Button variant="outline" className="w-full justify-start text-sm">
                    <Database className="h-4 w-4 mr-2" />
                    Backup Database
                  </Button>
                  <Button variant="outline" className="w-full justify-start text-sm">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Optimize Indexes
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-glass">
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2" />
                System Alerts
              </CardTitle>
              <CardDescription>
                Critical system notifications and warnings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-red-400/10 rounded-lg border border-red-400/20">
                  <div>
                    <p className="text-sm font-medium">High Memory Usage</p>
                    <p className="text-xs text-muted-foreground">Server reaching 85% capacity</p>
                  </div>
                  <Badge variant="destructive">Critical</Badge>
                </div>

                <div className="flex items-center justify-between p-3 bg-yellow-400/10 rounded-lg border border-yellow-400/20">
                  <div>
                    <p className="text-sm font-medium">Email Queue Backlog</p>
                    <p className="text-xs text-muted-foreground">23 messages pending delivery</p>
                  </div>
                  <Badge variant="secondary">Warning</Badge>
                </div>

                <div className="flex items-center justify-between p-3 bg-blue-400/10 rounded-lg border border-blue-400/20">
                  <div>
                    <p className="text-sm font-medium">Scheduled Maintenance</p>
                    <p className="text-xs text-muted-foreground">Planned for 2:00 AM UTC tomorrow</p>
                  </div>
                  <Badge variant="outline">Info</Badge>
                </div>

                <div className="flex items-center justify-between p-3 bg-green-primary/10 rounded-lg border border-green-primary/20">
                  <div>
                    <p className="text-sm font-medium">Backup Completed</p>
                    <p className="text-xs text-muted-foreground">Daily backup finished successfully</p>
                  </div>
                  <Badge variant="default" className="bg-green-primary">Success</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Advanced Tools */}
        <Card className="card-glass">
          <CardHeader>
            <CardTitle>Advanced Administrative Tools</CardTitle>
            <CardDescription>
              Powerful tools for system administration and troubleshooting
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-4">
                <h4 className="font-semibold">User Management</h4>
                <div className="space-y-2">
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    Bulk User Operations
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    Account Migrations
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    Permission Audit
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    Inactive User Cleanup
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold">System Operations</h4>
                <div className="space-y-2">
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    Cache Management
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    Log Analysis
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    Performance Tuning
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    Security Audit
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold">Data Operations</h4>
                <div className="space-y-2">
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    Data Export
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    Analytics Export
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    Compliance Reports
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    Data Cleanup
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* SQL Query Interface */}
        <Card className="card-glass">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Code className="h-5 w-5 mr-2" />
              Database Query Interface
            </CardTitle>
            <CardDescription>
              Execute custom database queries and view results
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">SQL Query</label>
                <Textarea
                  placeholder="SELECT * FROM users WHERE created_at > '2024-01-01' LIMIT 10;"
                  className="font-mono"
                  rows={4}
                />
              </div>

              <div className="flex gap-2">
                <Button className="btn-hero">
                  <Code className="h-4 w-4 mr-2" />
                  Execute Query
                </Button>
                <Button variant="outline">
                  Explain Plan
                </Button>
                <Button variant="outline">
                  Clear
                </Button>
              </div>

              <div className="bg-muted/30 rounded-lg p-4">
                <div className="text-sm text-muted-foreground mb-2">Query Results (10 rows)</div>
                <div className="bg-black/90 rounded p-3 font-mono text-xs text-white">
                  <div className="text-green-primary">Query executed successfully in 0.23ms</div>
                  <div className="mt-2">
                    id | email | created_at | status<br />
                    ---|-------|------------|-------<br />
                    1  | john@example.com | 2024-01-15 | active<br />
                    2  | jane@example.com | 2024-01-16 | active<br />
                    3  | bob@example.com  | 2024-01-17 | pending<br />
                    ...
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* System Logs */}
        <Card className="card-glass">
          <CardHeader>
            <CardTitle>Live System Logs</CardTitle>
            <CardDescription>
              Real-time system activity and error monitoring
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-black/90 rounded-lg p-4 font-mono text-xs max-h-64 overflow-y-auto">
              <div className="space-y-1">
                <div className="text-gray-400">[2024-01-15 14:23:15] INFO: User authentication successful (user_id: 1247)</div>
                <div className="text-blue-400">[2024-01-15 14:23:14] DEBUG: Database query executed (0.034s)</div>
                <div className="text-green-primary">[2024-01-15 14:23:13] INFO: Resume generation completed (job_id: 8829)</div>
                <div className="text-yellow-400">[2024-01-15 14:23:12] WARN: Email delivery delayed (queue size: 23)</div>
                <div className="text-gray-400">[2024-01-15 14:23:11] INFO: API request processed (/api/interviews)</div>
                <div className="text-red-400">[2024-01-15 14:23:10] ERROR: Redis connection timeout (retrying...)</div>
                <div className="text-blue-400">[2024-01-15 14:23:09] DEBUG: Cache miss for key: user_profile_1247</div>
                <div className="text-gray-400">[2024-01-15 14:23:08] INFO: Background job started (type: data_cleanup)</div>
                <div className="text-green-primary">[2024-01-15 14:23:07] INFO: Health check passed (response_time: 0.12s)</div>
              </div>
            </div>

            <div className="flex gap-2 mt-4">
              <Button size="sm" variant="outline">
                <RefreshCw className="h-3 w-3 mr-1" />
                Auto-refresh
              </Button>
              <Button size="sm" variant="outline">
                Clear Logs
              </Button>
              <Button size="sm" variant="outline">
                Export Logs
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminRoute>
  );
};

export default AdminConsole;