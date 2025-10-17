'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import { Award, FileText, MessageSquare, Target, TrendingUp, User } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

interface OverviewProps {
  setActiveTab: (tab: string) => void;
}

// Proper TypeScript interfaces for Recharts
interface ProgressData {
  month: string;
  resumes: number;
  interviews: number;
  score: number;
}

interface SkillData {
  name: string;
  value: number;
}

interface PerformanceData {
  category: string;
  score: number;
}

interface TooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    color: string;
    payload: any;
  }>;
  label?: string;
}

const Dashboard = ({ setActiveTab }: OverviewProps) => {
  const { user, logoutUser } = useAuth();

  const stats = [
    {
      title: 'Resumes Created',
      value: '3',
      change: '+1 this week',
      icon: FileText,
      color: 'text-blue-400',
    },
    {
      title: 'Interviews Practiced',
      value: '12',
      change: '+4 this week',
      icon: MessageSquare,
      color: 'text-green-primary',
    },
    {
      title: 'Profile Completion',
      value: '85%',
      change: '+15% this month',
      icon: User,
      color: 'text-purple-400',
    },
    {
      title: 'Success Score',
      value: '92',
      change: '+8 points',
      icon: Award,
      color: 'text-yellow-400',
    },
  ];

  const recentActivities = [
    { type: 'resume', action: 'Updated Software Engineer Resume', time: '2 hours ago' },
    { type: 'interview', action: 'Completed Technical Interview', time: '1 day ago' },
    { type: 'profile', action: 'Added new skill: React', time: '3 days ago' },
    { type: 'coding', action: 'Solved 5 coding challenges', time: '1 week ago' },
  ];

  // Progress Chart Data
  const progressData: ProgressData[] = [
    { month: 'Jan', resumes: 1, interviews: 2, score: 65 },
    { month: 'Feb', resumes: 2, interviews: 4, score: 72 },
    { month: 'Mar', resumes: 3, interviews: 7, score: 78 },
    { month: 'Apr', resumes: 3, interviews: 9, score: 85 },
    { month: 'May', resumes: 3, interviews: 12, score: 92 },
  ];

  // Skill Distribution Data
  const skillData: SkillData[] = [
    { name: 'Technical', value: 45 },
    { name: 'Soft Skills', value: 30 },
    { name: 'Tools', value: 15 },
    { name: 'Certifications', value: 10 },
  ];

  // Interview Performance Data
  const performanceData: PerformanceData[] = [
    { category: 'Technical', score: 85 },
    { category: 'Behavioral', score: 78 },
    { category: 'System Design', score: 72 },
    { category: 'Problem Solving', score: 90 },
    { category: 'Communication', score: 88 },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  const CustomTooltip = ({ active, payload, label }: TooltipProps) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Welcome back, {user?.displayName}</h1>
        <p className="text-muted-foreground mt-2">
          Here's what's happening with your career preparation
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title} className="card-glass hover:shadow-lg transition-shadow duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold mt-1">{stat.value}</p>
                  <p className="text-xs text-green-primary mt-1">{stat.change}</p>
                </div>
                <stat.icon className={`h-8 w-8 ${stat.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Progress Trend Chart */}
        <Card className="card-glass">
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2" />
              Progress Overview
            </CardTitle>
            <CardDescription>Your monthly progress trend</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={progressData}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="resumes" 
                    stroke="#0088FE" 
                    strokeWidth={2}
                    name="Resumes"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="interviews" 
                    stroke="#00C49F" 
                    strokeWidth={2}
                    name="Interviews"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="score" 
                    stroke="#FF8042" 
                    strokeWidth={2}
                    name="Success Score"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Skill Distribution Chart - Simplified without custom labels */}
        <Card className="card-glass">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Award className="h-5 w-5 mr-2" />
              Skill Distribution
            </CardTitle>
            <CardDescription>Breakdown of your skill categories</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={skillData as any}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${((percent as number) * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {skillData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => [`${value}%`, 'Percentage']} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Interview Performance */}
        <Card className="card-glass">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Target className="h-5 w-5 mr-2" />
              Interview Performance
            </CardTitle>
            <CardDescription>Your scores across different interview categories</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="category" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar 
                    dataKey="score" 
                    fill="#8884d8" 
                    radius={[4, 4, 0, 0]}
                    name="Score"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="card-glass">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Jump back into your career preparation</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              className="btn-hero w-full justify-start h-14" 
              onClick={() => setActiveTab('resume')}
            >
              <FileText className="h-5 w-5 mr-3" />
              <div className="text-left">
                <div className="font-semibold">Resume Builder</div>
                <div className="text-sm font-normal opacity-90">Create and optimize your resume</div>
              </div>
            </Button>

            <Button 
              className="btn-hero w-full justify-start h-14" 
              onClick={() => setActiveTab('text-interview')}
            >
              <Target className="h-5 w-5 mr-3" />
              <div className="text-left">
                <div className="font-semibold">Practice Interviews</div>
                <div className="text-sm font-normal opacity-90">AI-powered interview practice</div>
              </div>
            </Button>

            <Button 
              className="btn-hero w-full justify-start h-14" 
              onClick={() => setActiveTab('analytics')}
            >
              <TrendingUp className="h-5 w-5 mr-3" />
              <div className="text-left">
                <div className="font-semibold">View Analytics</div>
                <div className="text-sm font-normal opacity-90">Detailed progress insights</div>
              </div>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="card-glass">
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Your latest career preparation activities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-center space-x-4 p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors">
                <div className="w-2 h-2 bg-green-primary rounded-full flex-shrink-0" />
                <div className="flex-1">
                  <p className="font-medium">{activity.action}</p>
                  <p className="text-sm text-muted-foreground">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Weekly Summary */}
      <Card className="card-glass">
        <CardHeader>
          <CardTitle>This Week's Summary</CardTitle>
          <CardDescription>Your weekly progress at a glance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">3</div>
              <div className="text-sm text-muted-foreground">Hours Practiced</div>
            </div>
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="text-2xl font-bold text-green-600">12</div>
              <div className="text-sm text-muted-foreground">Questions Solved</div>
            </div>
            <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">2</div>
              <div className="text-sm text-muted-foreground">Resumes Improved</div>
            </div>
            <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">85%</div>
              <div className="text-sm text-muted-foreground">Accuracy Rate</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;