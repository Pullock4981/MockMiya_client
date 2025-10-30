// 'use client';

// import { Button } from '@/components/ui/button';
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from '@/components/ui/card';
// import { Award, FileText, MessageSquare, Target, TrendingUp, User } from 'lucide-react';
// import PrivateRoute from '../Routes/PrivateRoute';

// interface OverviewProps {
//   setActiveTab: (tab: string) => void;
// }

// const Dashboard = ({ setActiveTab }: OverviewProps) => {

//   const stats = [
//     {
//       title: 'Resumes Created',
//       value: '3',
//       change: '+1 this week',
//       icon: FileText,
//       color: 'text-blue-400',
//     },
//     {
//       title: 'Interviews Practiced',
//       value: '12',
//       change: '+4 this week',
//       icon: MessageSquare,
//       color: 'text-green-primary',
//     },
//     {
//       title: 'Profile Completion',
//       value: '85%',
//       change: '+15% this month',
//       icon: User,
//       color: 'text-purple-400',
//     },
//     {
//       title: 'Success Score',
//       value: '92',
//       change: '+8 points',
//       icon: Award,
//       color: 'text-yellow-400',
//     },
//   ];

//   const recentActivities = [
//     { type: 'resume', action: 'Updated Software Engineer Resume', time: '2 hours ago' },
//     { type: 'interview', action: 'Completed Technical Interview', time: '1 day ago' },
//     { type: 'profile', action: 'Added new skill: React', time: '3 days ago' },
//     { type: 'coding', action: 'Solved 5 coding challenges', time: '1 week ago' },
//   ];

//   return (
//     <PrivateRoute>
//       <div className="space-y-8">
//         {/* Header */}
//         <div>
//           <h1 className="text-3xl font-bold">Welcome back, John!</h1>
//           <p className="text-muted-foreground mt-2">
//             Here what happening with your career preparation
//           </p>
//         </div>

//         {/* Stats Grid */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//           {stats.map((stat) => (
//             <Card key={stat.title} className="card-glass">
//               <CardContent className="p-6">
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
//                     <p className="text-2xl font-bold">{stat.value}</p>
//                     <p className="text-xs text-green-primary">{stat.change}</p>
//                   </div>
//                   <stat.icon className={`h-8 w-8 ${stat.color}`} />
//                 </div>
//               </CardContent>
//             </Card>
//           ))}
//         </div>

//         {/* Quick Actions */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//           <Card className="card-glass">
//             <CardHeader>
//               <CardTitle className="flex items-center">
//                 <FileText className="h-5 w-5 mr-2" />
//                 Resume Builder
//               </CardTitle>
//               <CardDescription>Create and optimize your resume with AI assistance</CardDescription>
//             </CardHeader>
//             <CardContent>
//               <Button className="btn-hero w-full" onClick={() => setActiveTab('resume')}>
//                 Start Building
//               </Button>
//             </CardContent>
//           </Card>

//           <Card className="card-glass">
//             <CardHeader>
//               <CardTitle className="flex items-center">
//                 <Target className="h-5 w-5 mr-2" />
//                 Practice Interviews
//               </CardTitle>
//               <CardDescription>Practice with AI-powered interview scenarios</CardDescription>
//             </CardHeader>
//             <CardContent>
//               <Button className="btn-hero w-full" onClick={() => setActiveTab('text-interview')}>
//                 Start Practicing
//               </Button>
//             </CardContent>
//           </Card>

//           <Card className="card-glass">
//             <CardHeader>
//               <CardTitle className="flex items-center">
//                 <TrendingUp className="h-5 w-5 mr-2" />
//                 View Analytics
//               </CardTitle>
//               <CardDescription>Track your progress and improvement</CardDescription>
//             </CardHeader>
//             <CardContent>
//               <Button className="btn-hero w-full" onClick={() => setActiveTab('analytics')}>
//                 View Insights
//               </Button>
//             </CardContent>
//           </Card>
//         </div>

//         {/* Recent Activity */}
//         <Card className="card-glass">
//           <CardHeader>
//             <CardTitle>Recent Activity</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="space-y-4">
//               {recentActivities.map((activity, index) => (
//                 <div key={index} className="flex items-center space-x-4">
//                   <div className="w-2 h-2 bg-green-primary rounded-full" />
//                   <div className="flex-1">
//                     <p className="font-medium">{activity.action}</p>
//                     <p className="text-sm text-muted-foreground">{activity.time}</p>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//     </PrivateRoute>
//   );
// };

// export default Dashboard;






'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
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
} from 'lucide-react';
import PrivateRoute from '../Routes/PrivateRoute';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Legend,
} from 'recharts';
import { useAuth } from '@/context/AuthContext/AuthContext';
import { LoadingSpinner } from './components/Loading';
<<<<<<< HEAD
=======
import { Skeleton } from '@/components/ui/skeleton';
>>>>>>> ba6680f6a2203a76ec5c8788d965089eaf49ef98

type SafePieLabelRenderProps = {
  cx?: number | string;
  cy?: number | string;
  midAngle?: number | string;
  innerRadius?: number | string;
  outerRadius?: number | string;
  percent?: number | string;
};

interface OverviewProps {
  setActiveTab: (tab: string) => void;
}

type ApiResponse = {
<<<<<<< HEAD
  user: { name?: string | null; email: string; role?: string; profile?: any } | null;
=======
  user: {
    name?: string | null;
    email: string;
    role?: string;
    profile?: {
      avatarUrl?: string | null;
      bio?: string | null;
      location?: string | null;
      social?: {
        github?: string;
        linkedin?: string;
        twitter?: string;
        website?: string;
      };
    } | null;
  } | null;

>>>>>>> ba6680f6a2203a76ec5c8788d965089eaf49ef98
  stats: {
    resumesCreated: number;
    interviewsPracticed: number;
    codingChallengesAttempted: number;
    profileCompletion: number;
    successScore: number;
    codingAvgPercent?: number;
    jobAvgMatch?: number;
  } | null;
<<<<<<< HEAD
  recentActivities?: Array<{ type: string; title: string; timestamp: string | Date; meta?: any }>;
};

=======

  recentActivities?: Array<{
    type: string;
    title: string;
    timestamp: string | Date;
    meta?: {
      accuracy?: number;
      score?: number;
      total?: number;
      duration?: string;
      difficulty?: "easy" | "medium" | "hard";
    };
  }>;
};


>>>>>>> ba6680f6a2203a76ec5c8788d965089eaf49ef98
const Dashboard = ({ setActiveTab }: OverviewProps) => {
  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [apiData, setApiData] = useState<ApiResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
<<<<<<< HEAD
    if (authLoading) return;
    if (!user) {
      setLoading(false);
      setApiData(null);
      return;
    }

=======
  if (authLoading || !user) return;

  if (!apiData) { // 👈 already fetched কিনা চেক
>>>>>>> ba6680f6a2203a76ec5c8788d965089eaf49ef98
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const email = encodeURIComponent(user.email);
        const res = await axios.get<ApiResponse>(`/dashboard/api/overview?email=${email}`);
        setApiData(res.data);
      } catch (err) {
        console.error(err);
        setError('Failed to load dashboard data');
<<<<<<< HEAD
        setApiData(null);
=======
>>>>>>> ba6680f6a2203a76ec5c8788d965089eaf49ef98
      } finally {
        setLoading(false);
      }
    };
<<<<<<< HEAD

    fetchData();
  }, [user, authLoading]);
=======

    fetchData();
  }
}, [user, authLoading]);

>>>>>>> ba6680f6a2203a76ec5c8788d965089eaf49ef98

  const renderCustomizedLabel = ({
    cx, cy, midAngle, innerRadius, outerRadius, percent,
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

  const stats = apiData?.stats ?? {
    resumesCreated: 0,
    interviewsPracticed: 0,
    codingChallengesAttempted: 0,
    profileCompletion: 0,
    successScore: 0,
    codingAvgPercent: 0,
    jobAvgMatch: 0,
  };

  const statsForUI = [
    { title: 'Resumes Created', value: stats.resumesCreated, icon: FileText, color: 'text-blue-500', bgColor: 'bg-blue-500/10' },
    { title: 'Interviews Practiced', value: stats.interviewsPracticed, icon: MessageSquare, color: 'text-green-500', bgColor: 'bg-green-500/10' },
    { title: 'Profile Completion', value: `${stats.profileCompletion}%`, icon: User, color: 'text-purple-500', bgColor: 'bg-purple-500/10' },
    { title: 'Success Score', value: stats.successScore, icon: Award, color: 'text-yellow-500', bgColor: 'bg-yellow-500/10' },
  ];

  const activityData = [
    { name: 'Interviews', value: stats.interviewsPracticed || 0, color: '#10B981' },
    { name: 'Resumes', value: stats.resumesCreated || 0, color: '#3B82F6' },
    { name: 'Coding', value: stats.codingChallengesAttempted || 0, color: '#8B5CF6' },
    { name: 'ProfileRemaining', value: Math.max(0, 100 - (stats.profileCompletion || 0)), color: '#F59E0B' },
  ];

  const formatTs = (t?: string | Date) => {
    try { return new Date(String(t)).toLocaleString(); } catch { return '-'; }
  };

  return (
    <PrivateRoute>
      <div className="space-y-8">
        <div>
<<<<<<< HEAD
          <h1 className="text-3xl font-bold text-gray-800">Welcome back, {apiData?.user?.name ?? user?.name ?? 'User'}! 👋</h1>
          <p className="text-gray-600 mt-2">Here's what's happening with your career preparation today</p>
        </div>

        {loading ? (
          <LoadingSpinner/>
        ) : error ? (
          <div className="p-6 bg-red-50 text-red-700 rounded shadow">{error}</div>
        ) : !apiData ? (
          <div className="p-6 bg-yellow-50 text-yellow-800 rounded shadow">No dashboard data available for this user.</div>
        ) : (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {statsForUI.map(stat => (
                <Card key={stat.title} className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-6 flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                      <p className="text-2xl font-bold text-gray-800 mt-1">{stat.value}</p>
                    </div>
                    <div className={`p-3 rounded-full ${stat.bgColor}`}>
                      <stat.icon className={`h-6 w-6 ${stat.color}`} />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Charts: Pie + Modern Bar */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* PieChart */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center text-gray-800">
                    <Target className="h-5 w-5 mr-2 text-green-500" /> Activity Distribution
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
                          dataKey="value"
                        >
                          {activityData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value:number)=>[value,'Count']} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
=======
          <h1 className="text-3xl font-bold ">Welcome back, {apiData?.user?.name ?? user?.name ?? 'User'}! 👋</h1>
          <p>Here&apos;s what&apos;s happening with your career preparation today</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <Skeleton className="h-4 w-24 mb-2 bg-card/20" />
                      <Skeleton className="h-6 w-16" />
                    </div>
                    <Skeleton className="h-10 w-10 rounded-full" />
                  </div>
                </CardContent>
              </Card>
            ))}

            <Card className="col-span-1 md:col-span-2 lg:col-span-2 border-0 shadow-lg">
              <CardContent className="p-6">
                <Skeleton className="h-80 w-full rounded-xl" />
              </CardContent>
            </Card>

            <Card className="col-span-1 md:col-span-2 lg:col-span-2 border-0 shadow-lg">
              <CardContent className="p-6">
                <Skeleton className="h-80 w-full rounded-xl" />
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg col-span-full">
              <CardContent className="p-6 space-y-3">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-2 w-full rounded-full" />
              </CardContent>
            </Card>
          </div>
        ) : error ? (

          <div className="p-6 bg-red-50 text-red-700 rounded shadow">{error}</div>
        ) : !apiData ? (
          <div className="p-6 bg-yellow-50 text-yellow-800 rounded shadow">No dashboard data available for this user.</div>
        ) : (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {statsForUI.map(stat => (
                <Card key={stat.title} className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-6 flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium ">{stat.title}</p>
                      <p className="text-2xl font-bold  mt-1">{stat.value}</p>
                    </div>
                    <div className={`p-3 rounded-full ${stat.bgColor}`}>
                      <stat.icon className={`h-6 w-6 ${stat.color}`} />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Charts: Pie + Modern Bar */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* PieChart */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center ">
                    <Target className="h-5 w-5 mr-2 text-green-500" /> Activity Distribution
                  </CardTitle>
                  <CardDescription>How you are spending your practice time</CardDescription>
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
                          dataKey="value"
                        >
                          {activityData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value: number) => [value, 'Count']} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
>>>>>>> ba6680f6a2203a76ec5c8788d965089eaf49ef98

              {/* Modern BarChart */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
<<<<<<< HEAD
                  <CardTitle className="flex items-center text-gray-800">
=======
                  <CardTitle className="flex items-center ">
>>>>>>> ba6680f6a2203a76ec5c8788d965089eaf49ef98
                    <TrendingUp className="h-5 w-5 mr-2 text-blue-500" /> Activities Overview
                  </CardTitle>
                  <CardDescription>Counts of Resumes, Interviews and Coding Challenges</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
<<<<<<< HEAD
                      <BarChart data={activityData} margin={{top:20, right:20, left:10, bottom:20}}>
                        <XAxis dataKey="name" tick={{fontSize:12, fill:'#6B7280'}} interval={0} angle={-15} textAnchor="end"/>
                        <YAxis tick={{fontSize:12, fill:'#6B7280'}}/>
                        <Tooltip cursor={{ fill: 'rgba(0,0,0,0.05)' }} formatter={(value:number)=>[value,'Count']} />
                        <Legend wrapperStyle={{ fontSize: 12 }} />
                        {activityData.map((entry,index)=>(
=======
                      <BarChart data={activityData} margin={{ top: 20, right: 20, left: 10, bottom: 20 }}>
                        <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#6B7280' }} interval={0} angle={-15} textAnchor="end" />
                        <YAxis tick={{ fontSize: 12, fill: '#6B7280' }} />
                        <Tooltip cursor={{ fill: 'rgba(0,0,0,0.05)' }} formatter={(value: number) => [value, 'Count']} />
                        <Legend wrapperStyle={{ fontSize: 12 }} />
                        {activityData.map((entry, index) => (
>>>>>>> ba6680f6a2203a76ec5c8788d965089eaf49ef98
                          <Bar
                            key={entry.name}
                            dataKey="value"
                            name={entry.name}
                            fill={entry.color}
                            barSize={24}
<<<<<<< HEAD
                            radius={[6,6,0,0]}
                            background={{ fill:'rgba(0,0,0,0.05)' }}
=======
                            radius={[6, 6, 0, 0]}
                            background={{ fill: 'rgba(0,0,0,0.05)' }}
>>>>>>> ba6680f6a2203a76ec5c8788d965089eaf49ef98
                          />
                        ))}
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Performance Summary */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
<<<<<<< HEAD
                <CardTitle className="flex items-center text-gray-800">
=======
                <CardTitle className="flex items-center ">
>>>>>>> ba6680f6a2203a76ec5c8788d965089eaf49ef98
                  <TrendingUp className="h-5 w-5 mr-2 text-blue-500" /> Performance Summary
                </CardTitle>
                <CardDescription>Quick summary from backend</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
<<<<<<< HEAD
                  <p className="text-sm text-gray-600">Coding average: <strong>{stats.codingAvgPercent}%</strong></p>
                  <p className="text-sm text-gray-600">Job-match average: <strong>{stats.jobAvgMatch}%</strong></p>
                  <p className="text-sm text-gray-600">Success score: <strong>{stats.successScore}</strong></p>
                  <div className="mt-4">
                    <div className="text-xs text-gray-500">Profile completion</div>
                    <div className="h-2 bg-gray-200 rounded-full mt-1 overflow-hidden">
                      <div style={{width:`${stats.profileCompletion}%`}} className="h-full bg-green-500 transition-all duration-500" />
=======
                  <p className="text-sm ">Coding average: <strong>{stats.codingAvgPercent}%</strong></p>
                  <p className="text-sm ">Job-match average: <strong>{stats.jobAvgMatch}%</strong></p>
                  <p className="text-sm ">Success score: <strong>{stats.successScore}</strong></p>
                  <div className="mt-4">
                    <div className="text-xs ">Profile completion</div>
                    <div className="h-2 rounded-full mt-1 overflow-hidden">
                      <div style={{ width: `${stats.profileCompletion}%` }} className="h-full bg-green-500 transition-all duration-500" />
>>>>>>> ba6680f6a2203a76ec5c8788d965089eaf49ef98
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
<<<<<<< HEAD
                <CardTitle className="flex items-center text-gray-800">
=======
                <CardTitle className="flex items-center ">
>>>>>>> ba6680f6a2203a76ec5c8788d965089eaf49ef98
                  <Clock className="h-5 w-5 mr-2 text-orange-500" /> Recent Activity
                </CardTitle>
                <CardDescription>Your latest career preparation activities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {(apiData?.recentActivities?.length ?? 0) === 0 ? (
                    <p className="text-sm text-gray-500">No recent activities found.</p>
                  ) : (
<<<<<<< HEAD
                    apiData.recentActivities!.map((a,i)=>(
                      <div key={i} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                        <div className="p-2 rounded-full bg-gray-100"><Clock className="h-4 w-4 text-gray-600" /></div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-800 truncate">{a.title}</p>
                          <p className="text-sm text-gray-500">{formatTs(a.timestamp)}</p>
                          {a.type==='coding' && a.meta && (
                            <div className="mt-1 text-xs text-gray-500">
                              {a.meta.accuracy!=null ? `Accuracy: ${a.meta.accuracy}%` :
                               a.meta.score!=null && a.meta.total!=null ? `Score: ${a.meta.score}/${a.meta.total}` : null}
=======
                    apiData.recentActivities!.map((a, i) => (
                      <div key={i} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                        <div className="p-2 rounded-full bg-gray-100"><Clock className="h-4 w-4 " /></div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium  truncate">{a.title}</p>
                          <p className="text-sm text-gray-500">{formatTs(a.timestamp)}</p>
                          {a.type === 'coding' && a.meta && (
                            <div className="mt-1 text-xs text-gray-500">
                              {a.meta.accuracy != null ? `Accuracy: ${a.meta.accuracy}%` :
                                a.meta.score != null && a.meta.total != null ? `Score: ${a.meta.score}/${a.meta.total}` : null}
>>>>>>> ba6680f6a2203a76ec5c8788d965089eaf49ef98
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

          </>
        )}
      </div>
    </PrivateRoute>
  );
};

export default Dashboard;
