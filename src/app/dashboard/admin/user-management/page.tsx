import { Users, Search, Filter, MoreHorizontal, UserPlus, Mail, Shield } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import AdminRoute from "@/app/Routes/AdminRoute";

const UserManagement = () => {
  const users = [
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      role: "Premium User",
      status: "Active",
      joined: "2024-01-15",
      lastActive: "2 hours ago",
      interviews: 12,
      resumes: 3
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane@example.com",
      role: "Free User",
      status: "Active",
      joined: "2024-01-10",
      lastActive: "1 day ago",
      interviews: 5,
      resumes: 1
    },
    {
      id: 3,
      name: "Bob Johnson",
      email: "bob@example.com",
      role: "Premium User",
      status: "Inactive",
      joined: "2023-12-20",
      lastActive: "2 weeks ago",
      interviews: 25,
      resumes: 8
    },
    {
      id: 4,
      name: "Alice Brown",
      email: "alice@example.com",
      role: "Admin",
      status: "Active",
      joined: "2023-11-05",
      lastActive: "30 minutes ago",
      interviews: 45,
      resumes: 15
    },
    {
      id: 5,
      name: "Charlie Wilson",
      email: "charlie@example.com",
      role: "Free User",
      status: "Suspended",
      joined: "2024-01-12",
      lastActive: "1 week ago",
      interviews: 2,
      resumes: 0
    }
  ];

  return (
    <AdminRoute>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">User Management</h1>
          <p className="text-muted-foreground mt-2">
            Manage user accounts, permissions, and access controls
          </p>
        </div>

        {/* User Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="card-glass">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                  <p className="text-3xl font-bold">1,247</p>
                  <p className="text-xs text-green-primary">+23 this week</p>
                </div>
                <Users className="h-8 w-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="card-glass">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Users</p>
                  <p className="text-3xl font-bold">1,089</p>
                  <p className="text-xs text-green-primary">87% active rate</p>
                </div>
                <Shield className="h-8 w-8 text-green-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="card-glass">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Premium Users</p>
                  <p className="text-3xl font-bold">342</p>
                  <p className="text-xs text-purple-400">27% conversion</p>
                </div>
                <UserPlus className="h-8 w-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="card-glass">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">New This Month</p>
                  <p className="text-3xl font-bold">89</p>
                  <p className="text-xs text-yellow-400">+18% vs last month</p>
                </div>
                <Mail className="h-8 w-8 text-yellow-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* User Management Tools */}
        <Card className="card-glass">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>User Directory</CardTitle>
                <CardDescription>Search, filter, and manage user accounts</CardDescription>
              </div>
              <Button className="btn-hero">
                <UserPlus className="h-4 w-4 mr-2" />
                Add User
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {/* Search and Filter */}
            <div className="flex gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search users by name, email, or ID..."
                  className="pl-10"
                />
              </div>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>

            {/* User List */}
            <div className="space-y-4">
              {users.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <Avatar>
                      <AvatarFallback className="bg-green-primary text-primary-foreground">
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{user.name}</p>
                        <Badge variant={
                          user.status === "Active" ? "default" :
                            user.status === "Inactive" ? "secondary" : "destructive"
                        } className={
                          user.status === "Active" ? "bg-green-primary" : ""
                        }>
                          {user.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                      <div className="flex items-center gap-4 mt-1">
                        <span className="text-xs text-muted-foreground">
                          Role: {user.role}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          Joined: {user.joined}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          Last active: {user.lastActive}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <div className="text-sm font-medium">{user.interviews}</div>
                      <div className="text-xs text-muted-foreground">Interviews</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-medium">{user.resumes}</div>
                      <div className="text-xs text-muted-foreground">Resumes</div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Bulk Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="card-glass">
            <CardHeader>
              <CardTitle>Bulk Operations</CardTitle>
              <CardDescription>
                Perform actions on multiple users simultaneously
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Mail className="h-4 w-4 mr-2" />
                  Send Email to Users
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Update User Roles
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Shield className="h-4 w-4 mr-2" />
                  Modify Permissions
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Users className="h-4 w-4 mr-2" />
                  Export User Data
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="card-glass">
            <CardHeader>
              <CardTitle>User Activity</CardTitle>
              <CardDescription>
                Recent user activities and system events
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { action: "New user registration", user: "charlie@example.com", time: "5 minutes ago" },
                  { action: "Premium subscription activated", user: "jane@example.com", time: "1 hour ago" },
                  { action: "Password reset requested", user: "bob@example.com", time: "2 hours ago" },
                  { action: "Account suspended", user: "spam@example.com", time: "3 hours ago" },
                  { action: "Profile updated", user: "alice@example.com", time: "4 hours ago" },
                ].map((activity, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-400 rounded-full" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{activity.action}</p>
                      <p className="text-xs text-muted-foreground">{activity.user} • {activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Role Management */}
        <Card className="card-glass">
          <CardHeader>
            <CardTitle>Role & Permission Management</CardTitle>
            <CardDescription>
              Configure user roles and their associated permissions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-4">
                <h4 className="font-semibold">Free User</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span>Resume Builder</span>
                    <Badge variant="outline" className="text-green-primary border-green-primary">Limited</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Interview Practice</span>
                    <Badge variant="outline" className="text-green-primary border-green-primary">3/month</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Job Analysis</span>
                    <Badge variant="destructive">Disabled</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>AI Features</span>
                    <Badge variant="destructive">Disabled</Badge>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold">Premium User</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span>Resume Builder</span>
                    <Badge variant="default" className="bg-green-primary">Unlimited</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Interview Practice</span>
                    <Badge variant="default" className="bg-green-primary">Unlimited</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Job Analysis</span>
                    <Badge variant="default" className="bg-green-primary">Enabled</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>AI Features</span>
                    <Badge variant="default" className="bg-green-primary">Full Access</Badge>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold">Admin</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span>User Management</span>
                    <Badge variant="default" className="bg-purple-400">Full Access</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>System Settings</span>
                    <Badge variant="default" className="bg-purple-400">Full Access</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Analytics</span>
                    <Badge variant="default" className="bg-purple-400">Full Access</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Content Management</span>
                    <Badge variant="default" className="bg-purple-400">Full Access</Badge>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminRoute>
  );
};

export default UserManagement;