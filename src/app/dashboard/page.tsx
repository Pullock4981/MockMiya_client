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
  Edit3,
} from 'lucide-react';
import PrivateRoute from '../Routes/PrivateRoute';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from 'recharts';

// 👇 Avoids "unknown" type issues with Recharts props
type SafePieLabelRenderProps = {
  cx?: number | string;
  cy?: number | string;
  midAngle?: number | string;
  innerRadius?: number | string;
  outerRadius?: number | string;
  percent?: number | string;
};

interface OverviewProps {
  // Keeping this prop, assuming it's used in the full file (Quick Actions section)
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
      bgColor: 'bg-blue-500/10',
    },
    {
      title: 'Interviews Practiced',
      value: '12',
      change: '+4 this week',
      icon: MessageSquare,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
    },
    {
      title: 'Profile Completion',
      value: '85%',
      change: '+15% this month',
      icon: User,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
    },
    {
      title: 'Success Score',
      value: '92',
      change: '+8 points',
      icon: Award,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-500/10',
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

  // Recent Activities
  const recentActivities = [
    {
      type: 'resume',
      action: 'Updated Software Engineer Resume',
      time: '2 hours ago',
      icon: Edit3,
      status: 'completed',
      color: 'text-blue-500',
    },
    {
      type: 'interview',
      action: 'Completed Technical Interview',
      time: '1 day ago',
      icon: MessageSquare,
      status: 'completed',
      color: 'text-green-500',
    },
    {
      type: 'profile',
      action: 'Added new skill: React',
      time: '3 days ago',
      icon: User,
      status: 'completed',
      color: 'text-purple-500',
    },
    {
      type: 'coding',
      action: 'Solved 5 coding challenges',
      time: '1 week ago',
      icon: CheckCircle2,
      status: 'completed',
      color: 'text-yellow-500',
    },
    {
      type: 'interview',
      action: 'Behavioral Interview Practice',
      time: 'Just now',
      icon: PlayCircle,
      status: 'in-progress',
      color: 'text-orange-500',
    },
  ];

  // Custom label for Pie chart
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
  }: SafePieLabelRenderProps) => {
    const cxNum = Number(cx) || 0;
    const cyNum = Number(cy) || 0;
    const midAngleNum = Number(midAngle) || 0;
    const innerRadiusNum = Number(innerRadius) || 0;
    const outerRadiusNum = Number(outerRadius) || 0;
    const percentNum = Number(percent) || 0;

    if (!percentNum) return null;

    const RADIAN = Math.PI / 180;
    const radius = innerRadiusNum + (outerRadiusNum - innerRadiusNum) * 0.5;
    const x = cxNum + radius * Math.cos(-midAngleNum * RADIAN);
    const y = cyNum + radius * Math.sin(-midAngleNum * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="#fff"
        textAnchor={x > cxNum ? 'start' : 'end'}
        dominantBaseline="central"
        style={{ fontSize: '12px', fontWeight: 600 }}
      >
        {`${(percentNum * 100).toFixed(0)}%`}
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
            Here&apos;s what&apos;s happening with your career preparation today
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <Card
              key={stat.title}
              className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300"
            >
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

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pie Chart */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center text-gray-800">
                <Target className="h-5 w-5 mr-2 text-green-500" />
                Activity Distribution
              </CardTitle>
              <CardDescription>How you&apos;re spending your practice time</CardDescription>
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
                      // FIX: Removed 'as any' to resolve the Type Error
                      label={renderCustomizedLabel} 
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {activityData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => [`${value}%`, 'Percentage']} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Weekly Progress */}
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

        {/* Recent Activity (Note: Quick Actions section from original code is missing in provided content) */}
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
                  <div
                    className={`p-2 rounded-full ${
                      activity.status === 'in-progress' ? 'bg-orange-100' : 'bg-green-100'
                    }`}
                  >
                    <activity.icon
                      className={`h-4 w-4 ${
                        activity.status === 'in-progress' ? 'text-orange-500' : activity.color
                      }`}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-800 truncate">{activity.action}</p>
                    <p className="text-sm text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </PrivateRoute>
  );
};

export default Dashboard;