'use client';

import { FileText, MessageSquare, User, Award, Target, TrendingUp } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface OverviewProps {
  setActiveTab: (tab: string) => void;
}

const Dashboard = ({ setActiveTab }: OverviewProps) => {
  const stats = [
    { title: "Resumes Created", value: "3", change: "+1 this week", icon: FileText, color: "text-blue-400" },
    { title: "Interviews Practiced", value: "12", change: "+4 this week", icon: MessageSquare, color: "text-green-primary" },
    { title: "Profile Completion", value: "85%", change: "+15% this month", icon: User, color: "text-purple-400" },
    { title: "Success Score", value: "92", change: "+8 points", icon: Award, color: "text-yellow-400" },
  ];

  const recentActivities = [
    { type: "resume", action: "Updated Software Engineer Resume", time: "2 hours ago" },
    { type: "interview", action: "Completed Technical Interview", time: "1 day ago" },
    { type: "profile", action: "Added new skill: React", time: "3 days ago" },
    { type: "coding", action: "Solved 5 coding challenges", time: "1 week ago" },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Welcome back, John!</h1>
        <p className="text-muted-foreground mt-2">
          Here's what's happening with your career preparation
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title} className="card-glass">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-xs text-green-primary">{stat.change}</p>
                </div>
                <stat.icon className={`h-8 w-8 ${stat.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="card-glass">
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="h-5 w-5 mr-2" />
              Resume Builder
            </CardTitle>
            <CardDescription>
              Create and optimize your resume with AI assistance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              className="btn-hero w-full"
              onClick={() => setActiveTab("resume")}
            >
              Start Building
            </Button>
          </CardContent>
        </Card>

        <Card className="card-glass">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Target className="h-5 w-5 mr-2" />
              Practice Interviews
            </CardTitle>
            <CardDescription>
              Practice with AI-powered interview scenarios
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              className="btn-hero w-full"
              onClick={() => setActiveTab("text-interview")}
            >
              Start Practicing
            </Button>
          </CardContent>
        </Card>

        <Card className="card-glass">
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2" />
              View Analytics
            </CardTitle>
            <CardDescription>
              Track your progress and improvement
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              className="btn-hero w-full"
              onClick={() => setActiveTab("analytics")}
            >
              View Insights
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="card-glass">
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-green-primary rounded-full" />
                <div className="flex-1">
                  <p className="font-medium">{activity.action}</p>
                  <p className="text-sm text-muted-foreground">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
