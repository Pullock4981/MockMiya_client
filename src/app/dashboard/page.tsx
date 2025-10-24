'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { 
  Award, 
  FileText, 
  MessageSquare, 
  Target, 
  TrendingUp, 
  User,
  Clock,
  CheckCircle2,
  PlayCircle,
  Edit3
} from 'lucide-react';
import PrivateRoute from '../Routes/PrivateRoute';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';

interface OverviewProps {
  setActiveTab: (tab: string) => void;
}

const Dashboard = ({ setActiveTab }: OverviewProps) => {
  // Stats data
  const stats = [
    {
      title: 'Resumes Created',
      value: '3',
      change: '+1 this week',
      icon: FileText,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10'
    },
    {
      title: 'Interviews Practiced',
      value: '12',
      change: '+4 this week',
      icon: MessageSquare,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10'
    },
    {
      title: 'Profile Completion',
      value: '85%',
      change: '+15% this month',
      icon: User,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10'
    },
    {
      title: 'Success Score',
      value: '92',
      change: '+8 points',
      icon: Award,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-500/10'
    },
  ];

  // Pie Chart Data - Activity Distribution
  const activityData = [
    { name: 'Interviews', value: 45, color: '#10B981' },
    { name: 'Resume Edits', value: 25, color: '#3B82F6' },
    { name: 'Coding Practice', value: 20, color: '#8B5CF6' },
    { name: 'Profile Updates', value: 10, color: '#F59E0B' },
  ];

  // Weekly Progress Data
  const weeklyData = [
    { day: 'Mon', interviews: 2, resumes: 1, practice: 3 },
    { day: 'Tue', interviews: 3, resumes: 0, practice: 2 },
    { day: 'Wed', interviews: 1, resumes: 2, practice: 4 },
    { day: 'Thu', interviews: 4, resumes: 1, practice: 3 },
    { day: 'Fri', interviews: 2, resumes: 1, practice: 2 },
    { day: 'Sat', interviews: 1, resumes: 0, practice: 5 },
    { day: 'Sun', interviews: 0, resumes: 1, practice: 2 },
  ];

  // Recent Activities with icons and status
  const recentActivities = [
    { 
      type: 'resume', 
      action: 'Updated Software Engineer Resume', 
      time: '2 hours ago',
      icon: Edit3,
      status: 'completed',
      color: 'text-blue-500'
    },
    { 
      type: 'interview', 
      action: 'Completed Technical Interview', 
      time: '1 day ago',
      icon: MessageSquare,
      status: 'completed',
      color: 'text-green-500'
    },
    { 
      type: 'profile', 
      action: 'Added new skill: React', 
      time: '3 days ago',
      icon: User,
      status: 'completed',
      color: 'text-purple-500'
    },
    { 
      type: 'coding', 
      action: 'Solved 5 coding challenges', 
      time: '1 week ago',
      icon: CheckCircle2,
      status: 'completed',
      color: 'text-yellow-500'
    },
    { 
      type: 'interview', 
      action: 'Behavioral Interview Practice', 
      time: 'Just now',
      icon: PlayCircle,
      status: 'in-progress',
      color: 'text-orange-500'
    },
  ];

  // Custom label for pie chart
  const renderCustomizedLabel = ({
    cx, cy, midAngle, innerRadius, outerRadius, percent
  }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        className="text-xs font-bold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <PrivateRoute>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Welcome back, John! 👋</h1>
          <p className="text-gray-600 mt-2">
            Here's what's happening with your career preparation today
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={stat.title} className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-800 mt-1">{stat.value}</p>
                    <p className="text-xs text-green-500 font-medium mt-1">{stat.change}</p>
                  </div>
                  <div className={`p-3 rounded-full ${stat.bgColor}`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Activity Distribution Pie Chart */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center text-gray-800">
                <Target className="h-5 w-5 mr-2 text-green-500" />
                Activity Distribution
              </CardTitle>
              <CardDescription>How you're spending your practice time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={activityData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={renderCustomizedLabel}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {activityData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value) => [`${value}%`, 'Percentage']}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-4">
                {activityData.map((item, index) => (
                  <div key={item.name} className="flex items-center space-x-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-sm text-gray-600">{item.name}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Weekly Progress Bar Chart */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center text-gray-800">
                <TrendingUp className="h-5 w-5 mr-2 text-blue-500" />
                Weekly Progress
              </CardTitle>
              <CardDescription>Your activity throughout the week</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyData}>
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="interviews" name="Interviews" fill="#10B981" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="resumes" name="Resumes" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="practice" name="Practice" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions & Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Actions */}
          <div className="lg:col-span-1">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-gray-800">Quick Actions</CardTitle>
                <CardDescription>Jump back into your tasks</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button 
                  className="w-full justify-start bg-blue-500 hover:bg-blue-600 text-white"
                  onClick={() => setActiveTab('resume')}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Resume Builder
                </Button>
                <Button 
                  className="w-full justify-start bg-green-500 hover:bg-green-600 text-white"
                  onClick={() => setActiveTab('text-interview')}
                >
                  <Target className="h-4 w-4 mr-2" />
                  Practice Interviews
                </Button>
                <Button 
                  className="w-full justify-start bg-purple-500 hover:bg-purple-600 text-white"
                  onClick={() => setActiveTab('analytics')}
                >
                  <TrendingUp className="h-4 w-4 mr-2" />
                  View Analytics
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center text-gray-800">
                  <Clock className="h-5 w-5 mr-2 text-orange-500" />
                  Recent Activity
                </CardTitle>
                <CardDescription>Your latest career preparation activities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivities.map((activity, index) => (
                    <div 
                      key={index} 
                      className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                    >
                      <div className={`p-2 rounded-full ${activity.status === 'in-progress' ? 'bg-orange-100' : 'bg-green-100'}`}>
                        <activity.icon className={`h-4 w-4 ${activity.status === 'in-progress' ? 'text-orange-500' : activity.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-800 truncate">{activity.action}</p>
                        <p className="text-sm text-gray-500">{activity.time}</p>
                      </div>
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                        activity.status === 'in-progress' 
                          ? 'bg-orange-100 text-orange-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {activity.status === 'in-progress' ? 'In Progress' : 'Completed'}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Performance Metrics */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-gray-800">Performance Metrics</CardTitle>
            <CardDescription>Track your improvement over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">85%</div>
                <div className="text-sm text-blue-600 font-medium">Interview Success Rate</div>
                <div className="text-xs text-gray-500 mt-1">+10% from last month</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">92/100</div>
                <div className="text-sm text-green-600 font-medium">Resume Score</div>
                <div className="text-xs text-gray-500 mt-1">AI Optimized</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">15 hrs</div>
                <div className="text-sm text-purple-600 font-medium">Practice Time</div>
                <div className="text-xs text-gray-500 mt-1">This week</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PrivateRoute>
  );
};

export default Dashboard;