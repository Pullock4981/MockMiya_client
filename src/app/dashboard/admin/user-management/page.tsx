'use client';

import { useState, useEffect } from 'react';
import { 
  Users, Search, MoreHorizontal, UserPlus, Mail, Shield, 
  Edit, Trash2, Eye, Download, RefreshCw, AlertCircle, CheckCircle,
  Ban, Crown, UserCheck, UserX, Calendar, Clock, Sparkles, Zap,
  TrendingUp, Star, Rocket, Target
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from 'react-hot-toast';
import AdminRoute from "@/app/Routes/AdminRoute";

// Updated User Interface with proper profile structure
interface UserProfile {
  title?: string;
  company?: string;
  location?: string;
  avatar?: string;
  phone?: string;
  bio?: string;
  skills?: string[];
}

interface UserStats {
  interviews: number;
  resumes: number;
  practiceTime: number;
}

interface User {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'premium' | 'admin';
  status: 'active' | 'inactive' | 'suspended' | 'banned';
  isVerified: boolean;
  membershipType: string;
  createdAt: string;
  updatedAt: string;
  lastLogin?: string;
  profile?: UserProfile;
  stats?: UserStats;
}

const UserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isUserDialogOpen, setIsUserDialogOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Fetch users from API with better error handling
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log("🔄 Fetching users from API...");
      
      const response = await fetch('/api/admin/users');
      
      if (!response.ok) {
        const errorData = response.status === 404 ? { error: 'Admin User List API Not Found (404)' } : await response.json();
        const errorMessage = errorData.error || `HTTP error! status: ${response.status}`;
        
        throw new Error(errorMessage);
      }
      
      const data = await response.json();
      console.log("✅ Users fetched successfully:", data.users.length);
      setUsers(data.users);
      
    } catch (err) {
      console.error('❌ Error fetching users:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to load users';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Filter users based on search and filters
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    
    return matchesSearch && matchesStatus && matchesRole;
  });

  // User statistics
  const userStats = {
    total: users.length,
    active: users.filter(u => u.status === 'active').length,
    premium: users.filter(u => u.role === 'premium').length,
    newThisMonth: users.filter(u => {
      const joinDate = new Date(u.createdAt);
      const monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      return joinDate > monthAgo;
    }).length,
  };

  // Handle user actions
  const handleUserAction = async (userId: string, action: string) => {
    setActionLoading(userId);
    
    try {
      console.log(`🔄 Performing ${action} on user ${userId}`);
      
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Action failed with status: ${response.status}`);
      }

      const result = await response.json();
      
      // Update local state
      setUsers(prev => prev.map(user => 
        user._id === userId ? { ...user, ...result.user } : user
      ));
      
      toast.success(`User ${action} successfully`);
      console.log(`✅ User ${action} successfully`);
      
    } catch (err) {
      console.error(`❌ Error performing ${action}:`, err);
      const errorMessage = err instanceof Error ? err.message : 'Action failed';
      toast.error(`Failed to ${action} user: ${errorMessage}`);
    } finally {
      setActionLoading(null);
    }
  };

  // View user details
  const handleViewUser = (user: User) => {
    setSelectedUser(user);
    setIsUserDialogOpen(true);
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Get status badge variant with colors
  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'active': return 'default';
      case 'inactive': return 'secondary';
      case 'suspended': return 'destructive';
      case 'banned': return 'destructive';
      default: return 'secondary';
    }
  };

  // Get status color for avatar with gradients
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-gradient-to-br from-green-400 to-green-600 shadow-lg shadow-green-500/30';
      case 'inactive': return 'bg-gradient-to-br from-gray-400 to-gray-600 shadow-lg shadow-gray-500/30';
      case 'suspended': return 'bg-gradient-to-br from-yellow-400 to-yellow-600 shadow-lg shadow-yellow-500/30';
      case 'banned': return 'bg-gradient-to-br from-red-400 to-red-600 shadow-lg shadow-red-500/30';
      default: return 'bg-gradient-to-br from-gray-400 to-gray-600 shadow-lg shadow-gray-500/30';
    }
  };

  // Get role badge with colorful variants
  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin': 
        return <Badge variant="default" className="bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/30">
          <Sparkles className="h-3 w-3 mr-1" />
          Admin
        </Badge>;
      case 'premium':
        return <Badge variant="default" className="bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/30">
          <Crown className="h-3 w-3 mr-1" />
          Premium
        </Badge>;
      default:
        return <Badge variant="outline" className="border-blue-300 text-blue-600 bg-blue-50">
          <UserCheck className="h-3 w-3 mr-1" />
          Free User
        </Badge>;
    }
  };

  // Get user initials for avatar fallback
  const getUserInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  if (loading) {
    return (
      <AdminRoute>
        <div className="space-y-8">
          <div className="flex flex-col items-center justify-center min-h-96 space-y-6">
            <div className="relative">
              <RefreshCw className="h-12 w-12 animate-spin text-gradient-to-r from-green-400 to-blue-500" />
              <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-blue-500 rounded-full blur-sm opacity-30 animate-pulse"></div>
            </div>
            <div className="text-center space-y-2">
              <p className="text-xl font-semibold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                Loading User Data
              </p>
              <p className="text-gray-500">Fetching the latest user information...</p>
            </div>
          </div>
        </div>
      </AdminRoute>
    );
  }

  if (error) {
    return (
      <AdminRoute>
        <div className="space-y-8">
          <div className="flex flex-col items-center justify-center min-h-96 space-y-6">
            <div className="relative">
              <AlertCircle className="h-16 w-16 text-red-500" />
              <div className="absolute inset-0 bg-red-500 rounded-full blur-lg opacity-20"></div>
            </div>
            <div className="text-center space-y-3">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
                Failed to Load Users
              </h3>
              <p className="text-gray-600 max-w-md text-lg">{error}</p>
            </div>
            <div className="flex gap-3">
              <Button 
                onClick={fetchUsers} 
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg shadow-green-500/30"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
              <Button 
                variant="outline" 
                onClick={() => window.location.reload()}
                className="border-orange-300 text-orange-600 hover:bg-orange-50"
              >
                Reload Page
              </Button>
            </div>
          </div>
        </div>
      </AdminRoute>
    );
  }

  return (
    <AdminRoute>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              User Management
            </h1>
            <p className="text-muted-foreground mt-3 text-lg">
              Manage <span className="font-semibold text-blue-600">{userStats.total}</span> user accounts with powerful tools
            </p>
          </div>
          <Button 
            onClick={fetchUsers} 
            className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg shadow-green-500/30"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh Data
          </Button>
        </div>

        {/* User Statistics with Colorful Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border-0 shadow-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white transform hover:scale-105 transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-100">Total Users</p>
                  <p className="text-4xl font-bold">{userStats.total}</p>
                  <p className="text-xs text-blue-200 mt-2">All registered users</p>
                </div>
                <Users className="h-10 w-10 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-xl bg-gradient-to-br from-green-500 to-emerald-600 text-white transform hover:scale-105 transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-100">Active Users</p>
                  <p className="text-4xl font-bold">{userStats.active}</p>
                  <p className="text-xs text-green-200 mt-2">
                    {userStats.total > 0 ? Math.round((userStats.active / userStats.total) * 100) : 0}% active rate
                  </p>
                </div>
                <UserCheck className="h-10 w-10 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-xl bg-gradient-to-br from-amber-500 to-orange-500 text-white transform hover:scale-105 transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-amber-100">Premium Users</p>
                  <p className="text-4xl font-bold">{userStats.premium}</p>
                  <p className="text-xs text-amber-200 mt-2">
                    {userStats.total > 0 ? Math.round((userStats.premium / userStats.total) * 100) : 0}% conversion
                  </p>
                </div>
                <Crown className="h-10 w-10 text-amber-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-xl bg-gradient-to-br from-purple-500 to-pink-500 text-white transform hover:scale-105 transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-100">New This Month</p>
                  <p className="text-4xl font-bold">{userStats.newThisMonth}</p>
                  <p className="text-xs text-purple-200 mt-2">Recent signups</p>
                </div>
                <Rocket className="h-10 w-10 text-purple-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* User Management Tools */}
        <Card className="border-0 shadow-2xl bg-white/80 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-gray-50 to-blue-50/50 border-b">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div>
                <CardTitle className="text-2xl bg-gradient-to-r from-gray-800 to-blue-800 bg-clip-text text-transparent">
                  User Directory
                </CardTitle>
                <CardDescription className="text-lg mt-2">
                  Search, filter, and manage <span className="font-semibold text-blue-600">{filteredUsers.length}</span> user accounts
                </CardDescription>
              </div>
              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  onClick={() => {setStatusFilter('all'); setRoleFilter('all'); setSearchTerm('');}}
                  className="border-orange-300 text-orange-600 hover:bg-orange-50"
                >
                  Clear Filters
                </Button>
                <Button className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg shadow-green-500/30">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add User
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            {/* Search and Filter */}
            <div className="flex flex-col lg:flex-row gap-4 mb-8 p-4 bg-gradient-to-r from-blue-50/50 to-purple-50/50 rounded-xl border">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-blue-500" />
                <Input
                  placeholder="Search users by name, email..."
                  className="pl-12 py-3 border-blue-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-200"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex gap-3">
                <select 
                  className="px-4 py-3 border border-blue-200 rounded-lg text-sm focus:border-blue-400 focus:ring-2 focus:ring-blue-200 bg-white"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="suspended">Suspended</option>
                  <option value="banned">Banned</option>
                </select>
                <select 
                  className="px-4 py-3 border border-purple-200 rounded-lg text-sm focus:border-purple-400 focus:ring-2 focus:ring-purple-200 bg-white"
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                >
                  <option value="all">All Roles</option>
                  <option value="user">Free User</option>
                  <option value="premium">Premium</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>

            {/* User List */}
            <div className="space-y-4">
              {filteredUsers.length === 0 ? (
                <div className="text-center py-16 text-gray-500 bg-gradient-to-br from-gray-50 to-blue-50/30 rounded-2xl border-2 border-dashed border-gray-200">
                  <Users className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-xl font-semibold text-gray-400">No users found</p>
                  <p className="text-sm text-gray-500 mt-2">Try adjusting your search or filters</p>
                </div>
              ) : (
                filteredUsers.map((user) => (
                  <div 
                    key={user._id} 
                    className="flex items-center justify-between p-6 bg-gradient-to-r from-white to-blue-50/30 rounded-2xl border border-blue-100 hover:border-blue-300 hover:shadow-lg transition-all duration-300 group"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        <Avatar className="h-14 w-14 ring-2 ring-white shadow-lg">
                          <AvatarImage src={user.profile?.avatar} alt={user.name} />
                          <AvatarFallback className={`${getStatusColor(user.status)} text-white font-bold`}>
                            {getUserInitials(user.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                          user.status === 'active' ? 'bg-green-400' :
                          user.status === 'inactive' ? 'bg-gray-400' :
                          user.status === 'suspended' ? 'bg-yellow-400' : 'bg-red-400'
                        }`} />
                      </div>
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <p className="font-semibold text-lg text-gray-800 group-hover:text-blue-700 transition-colors">
                            {user.name}
                          </p>
                          {getRoleBadge(user.role)}
                          <Badge variant={getStatusVariant(user.status)} className="shadow-sm">
                            {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                          </Badge>
                          {user.isVerified && (
                            <Badge variant="outline" className="text-green-600 border-green-300 bg-green-50 shadow-sm">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Verified
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{user.email}</p>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span className="flex items-center bg-blue-50 px-2 py-1 rounded-full">
                            <Calendar className="h-3 w-3 mr-1 text-blue-500" />
                            Joined: {formatDate(user.createdAt)}
                          </span>
                          {user.lastLogin && (
                            <span className="flex items-center bg-green-50 px-2 py-1 rounded-full">
                              <Clock className="h-3 w-3 mr-1 text-green-500" />
                              Last active: {formatDate(user.lastLogin)}
                            </span>
                          )}
                          {user.profile?.title && (
                            <span className="bg-purple-50 px-2 py-1 rounded-full text-purple-600">
                              {user.profile.title}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      {/* User Stats */}
                      <div className="flex items-center gap-8 text-center">
                        <div className="bg-blue-50/50 p-3 rounded-xl min-w-16">
                          <div className="text-lg font-bold text-blue-600">{user.stats?.interviews || 0}</div>
                          <div className="text-xs text-blue-500 font-medium">Interviews</div>
                        </div>
                        <div className="bg-green-50/50 p-3 rounded-xl min-w-16">
                          <div className="text-lg font-bold text-green-600">{user.stats?.resumes || 0}</div>
                          <div className="text-xs text-green-500 font-medium">Resumes</div>
                        </div>
                      </div>

                      {/* Actions Dropdown */}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            disabled={actionLoading === user._id}
                            className="h-9 w-9 rounded-full bg-gradient-to-r from-gray-100 to-blue-100 hover:from-blue-100 hover:to-purple-100 border shadow-sm"
                          >
                            {actionLoading === user._id ? (
                              <RefreshCw className="h-4 w-4 animate-spin text-blue-500" />
                            ) : (
                              <MoreHorizontal className="h-4 w-4 text-gray-600" />
                            )}
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48 shadow-xl border">
                          <DropdownMenuItem 
                            onClick={() => handleViewUser(user)}
                            className="cursor-pointer text-blue-600 hover:bg-blue-50"
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer text-purple-600 hover:bg-purple-50">
                            <Edit className="h-4 w-4 mr-2" />
                            Edit User
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          
                          {user.status === 'active' ? (
                            <DropdownMenuItem 
                              onClick={() => handleUserAction(user._id, 'suspend')}
                              className="cursor-pointer text-amber-600 hover:bg-amber-50"
                            >
                              <Ban className="h-4 w-4 mr-2" />
                              Suspend User
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem 
                              onClick={() => handleUserAction(user._id, 'activate')}
                              className="cursor-pointer text-green-600 hover:bg-green-50"
                            >
                              <UserCheck className="h-4 w-4 mr-2" />
                              Activate User
                            </DropdownMenuItem>
                          )}
                          
                          {user.role === 'premium' ? (
                            <DropdownMenuItem 
                              onClick={() => handleUserAction(user._id, 'downgrade')}
                              className="cursor-pointer text-orange-600 hover:bg-orange-50"
                            >
                              <UserX className="h-4 w-4 mr-2" />
                              Remove Premium
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem 
                              onClick={() => handleUserAction(user._id, 'upgrade')}
                              className="cursor-pointer text-amber-600 hover:bg-amber-50"
                            >
                              <Crown className="h-4 w-4 mr-2" />
                              Make Premium
                            </DropdownMenuItem>
                          )}
                          
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            className="cursor-pointer text-red-600 hover:bg-red-50 font-medium"
                            onClick={() => handleUserAction(user._id, 'delete')}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete User
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Bulk Actions & Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Bulk Actions */}
          <Card className="border-0 shadow-xl bg-gradient-to-br from-orange-50 to-amber-50/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-orange-800">
                <Zap className="h-5 w-5" />
                Bulk Operations
              </CardTitle>
              <CardDescription className="text-orange-600">
                Perform actions on multiple users simultaneously
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start border-orange-200 text-orange-600 hover:bg-orange-50 hover:border-orange-300">
                  <Mail className="h-4 w-4 mr-2" />
                  Send Email to Selected Users
                </Button>
                <Button variant="outline" className="w-full justify-start border-purple-200 text-purple-600 hover:bg-purple-50 hover:border-purple-300">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Update User Roles in Bulk
                </Button>
                <Button variant="outline" className="w-full justify-start border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300">
                  <Shield className="h-4 w-4 mr-2" />
                  Modify Permissions
                </Button>
                <Button variant="outline" className="w-full justify-start border-green-200 text-green-600 hover:bg-green-50 hover:border-green-300">
                  <Download className="h-4 w-4 mr-2" />
                  Export User Data (CSV)
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* System Activity */}
          <Card className="border-0 shadow-xl bg-gradient-to-br from-purple-50 to-pink-50/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-purple-800">
                <TrendingUp className="h-5 w-5" />
                System Activity
              </CardTitle>
              <CardDescription className="text-purple-600">
                Recent user activities and system events
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { action: "New user registration", user: "charlie@example.com", time: "5 minutes ago", type: "success" },
                  { action: "Premium subscription activated", user: "jane@example.com", time: "1 hour ago", type: "success" },
                  { action: "Password reset requested", user: "bob@example.com", time: "2 hours ago", type: "info" },
                  { action: "Account suspended", user: "spam@example.com", time: "3 hours ago", type: "warning" },
                  { action: "Profile updated", user: "alice@example.com", time: "4 hours ago", type: "info" },
                ].map((activity, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-white/50 rounded-lg border border-purple-100">
                    <div className={`w-3 h-3 rounded-full ${
                      activity.type === 'success' ? 'bg-green-400 shadow-lg shadow-green-400/50' :
                      activity.type === 'warning' ? 'bg-yellow-400 shadow-lg shadow-yellow-400/50' : 
                      'bg-blue-400 shadow-lg shadow-blue-400/50'
                    }`} />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-800">{activity.action}</p>
                      <p className="text-xs text-gray-600">{activity.user} • <span className="text-purple-500">{activity.time}</span></p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* User Details Dialog */}
        <Dialog open={isUserDialogOpen} onOpenChange={setIsUserDialogOpen}>
          <DialogContent className="max-w-4xl bg-gradient-to-br from-white to-blue-50/30 border-0 shadow-2xl">
            {selectedUser && (
              <>
                <DialogHeader className="bg-gradient-to-r from-blue-50 to-purple-50/50 p-6 rounded-t-lg border-b">
                  <DialogTitle className="text-2xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    User Details
                  </DialogTitle>
                  <DialogDescription className="text-lg text-gray-600">
                    Complete information for <span className="font-semibold text-blue-600">{selectedUser.name}</span>
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-8 p-6">
                  {/* Basic Info */}
                  <div className="flex items-center space-x-6 p-6 bg-white rounded-2xl border border-blue-100 shadow-sm">
                    <Avatar className="h-20 w-20 ring-4 ring-white shadow-xl">
                      <AvatarImage src={selectedUser.profile?.avatar} alt={selectedUser.name} />
                      <AvatarFallback className={`${getStatusColor(selectedUser.status)} text-white font-bold text-xl`}>
                        {getUserInitials(selectedUser.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-800">{selectedUser.name}</h3>
                      <p className="text-gray-600 text-lg mt-1">{selectedUser.email}</p>
                      <div className="flex gap-3 mt-4">
                        {getRoleBadge(selectedUser.role)}
                        <Badge variant={getStatusVariant(selectedUser.status)} className="text-sm px-3 py-1">
                          {selectedUser.status}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Profile Information */}
                  <div className="grid grid-cols-2 gap-6">
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50/30 p-4 rounded-xl border border-green-100">
                      <label className="text-sm font-medium text-green-700">Member Since</label>
                      <p className="text-sm text-green-800 font-semibold">{formatDate(selectedUser.createdAt)}</p>
                    </div>
                    <div className="bg-gradient-to-br from-blue-50 to-cyan-50/30 p-4 rounded-xl border border-blue-100">
                      <label className="text-sm font-medium text-blue-700">Last Updated</label>
                      <p className="text-sm text-blue-800 font-semibold">{formatDate(selectedUser.updatedAt)}</p>
                    </div>
                    {selectedUser.profile?.title && (
                      <div className="bg-gradient-to-br from-purple-50 to-pink-50/30 p-4 rounded-xl border border-purple-100">
                        <label className="text-sm font-medium text-purple-700">Job Title</label>
                        <p className="text-sm text-purple-800 font-semibold">{selectedUser.profile.title}</p>
                      </div>
                    )}
                    {selectedUser.profile?.company && (
                      <div className="bg-gradient-to-br from-amber-50 to-orange-50/30 p-4 rounded-xl border border-amber-100">
                        <label className="text-sm font-medium text-amber-700">Company</label>
                        <p className="text-sm text-amber-800 font-semibold">{selectedUser.profile.company}</p>
                      </div>
                    )}
                    {selectedUser.profile?.location && (
                      <div className="bg-gradient-to-br from-cyan-50 to-blue-50/30 p-4 rounded-xl border border-cyan-100">
                        <label className="text-sm font-medium text-cyan-700">Location</label>
                        <p className="text-sm text-cyan-800 font-semibold">{selectedUser.profile.location}</p>
                      </div>
                    )}
                    {selectedUser.membershipType && (
                      <div className="bg-gradient-to-br from-gray-50 to-blue-50/30 p-4 rounded-xl border border-gray-100">
                        <label className="text-sm font-medium text-gray-700">Membership</label>
                        <p className="text-sm text-gray-800 font-semibold capitalize">{selectedUser.membershipType}</p>
                      </div>
                    )}
                  </div>

                  {/* Statistics */}
                  <div className="bg-gradient-to-br from-white to-gray-50/50 p-6 rounded-2xl border border-gray-100">
                    <h4 className="font-bold text-lg mb-4 bg-gradient-to-r from-gray-800 to-blue-800 bg-clip-text text-transparent">
                      Activity Statistics
                    </h4>
                    <div className="grid grid-cols-3 gap-6 text-center">
                      <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200 shadow-sm">
                        <div className="text-2xl font-bold text-blue-600">{selectedUser.stats?.interviews || 0}</div>
                        <div className="text-sm text-blue-600 font-medium">Interviews</div>
                      </div>
                      <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200 shadow-sm">
                        <div className="text-2xl font-bold text-green-600">{selectedUser.stats?.resumes || 0}</div>
                        <div className="text-sm text-green-600 font-medium">Resumes</div>
                      </div>
                      <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-200 shadow-sm">
                        <div className="text-2xl font-bold text-purple-600">{selectedUser.stats?.practiceTime || 0}h</div>
                        <div className="text-sm text-purple-600 font-medium">Practice Time</div>
                      </div>
                    </div>
                  </div>
                </div>

                <DialogFooter className="p-6 bg-gradient-to-r from-gray-50 to-blue-50/50 border-t rounded-b-lg">
                  <Button 
                    variant="outline" 
                    onClick={() => setIsUserDialogOpen(false)}
                    className="border-gray-300 text-gray-600 hover:bg-gray-50"
                  >
                    Close
                  </Button>
                  <Button className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg shadow-green-500/30">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit User
                  </Button>
                </DialogFooter>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminRoute>
  );
};

export default UserManagement;