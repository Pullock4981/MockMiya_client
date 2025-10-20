import { TrendingUp, BarChart3, Calendar, Target, Award, Clock } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const Analytics = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Track your progress and identify areas for improvement
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="card-glass">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Overall Score</p>
                <p className="text-3xl font-bold">87%</p>
                <p className="text-xs text-green-primary">+5% this month</p>
              </div>
              <Award className="h-8 w-8 text-yellow-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="card-glass">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Practice Hours</p>
                <p className="text-3xl font-bold">24.5</p>
                <p className="text-xs text-blue-400">This month</p>
              </div>
              <Clock className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="card-glass">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Interviews</p>
                <p className="text-3xl font-bold">18</p>
                <p className="text-xs text-purple-400">Completed</p>
              </div>
              <Target className="h-8 w-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="card-glass">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Success Rate</p>
                <p className="text-3xl font-bold">92%</p>
                <p className="text-xs text-green-primary">+3% vs last month</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progress Over Time */}
      <Card className="card-glass">
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart3 className="h-5 w-5 mr-2" />
            Performance Trends
          </CardTitle>
          <CardDescription>Your improvement over the last 30 days</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="h-64 bg-muted/30 rounded-lg flex items-center justify-center">
              <div className="text-center space-y-2">
                <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Interactive chart showing performance trends</p>
                <p className="text-xs text-muted-foreground">Technical interviews, behavioral scores, and overall progress</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Skill Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="card-glass">
          <CardHeader>
            <CardTitle>Skills Assessment</CardTitle>
            <CardDescription>Strengths and areas for improvement</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { skill: "Technical Communication", score: 92, trend: "up" },
                { skill: "Problem Solving", score: 88, trend: "up" },
                { skill: "System Design", score: 85, trend: "stable" },
                { skill: "Behavioral Responses", score: 90, trend: "up" },
                { skill: "Code Quality", score: 87, trend: "stable" },
                { skill: "Time Management", score: 83, trend: "down" },
              ].map((skill, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-sm">{skill.skill}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{skill.score}%</span>
                      <div className={`w-3 h-3 rounded-full ${
                        skill.trend === "up" ? "bg-green-primary" :
                        skill.trend === "down" ? "bg-red-400" : "bg-yellow-400"
                      }`} />
                    </div>
                  </div>
                  <Progress value={skill.score} className="w-full" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="card-glass">
          <CardHeader>
            <CardTitle>Activity Breakdown</CardTitle>
            <CardDescription>Time spent on different activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Resume Building</span>
                  <span className="text-sm font-medium">18%</span>
                </div>
                <Progress value={18} className="w-full" />
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Interview Practice</span>
                  <span className="text-sm font-medium">45%</span>
                </div>
                <Progress value={45} className="w-full" />
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Coding Challenges</span>
                  <span className="text-sm font-medium">28%</span>
                </div>
                <Progress value={28} className="w-full" />
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Job Analysis</span>
                  <span className="text-sm font-medium">9%</span>
                </div>
                <Progress value={9} className="w-full" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Summary */}
      <Card className="card-glass">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="h-5 w-5 mr-2" />
            Weekly Summary
          </CardTitle>
          <CardDescription>Your activity and achievements this week</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-4">
              <h4 className="font-semibold">Goals Achieved</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-green-primary/10 rounded-lg border border-green-primary/20">
                  <span className="text-sm">Complete 5 interviews</span>
                  <span className="text-xs text-green-primary">✓ 6/5</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-green-primary/10 rounded-lg border border-green-primary/20">
                  <span className="text-sm">Practice 10 coding problems</span>
                  <span className="text-xs text-green-primary">✓ 12/10</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-yellow-400/10 rounded-lg border border-yellow-400/20">
                  <span className="text-sm">Update resume</span>
                  <span className="text-xs text-yellow-400">○ In progress</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold">Top Achievements</h4>
              <div className="space-y-3">
                <div className="p-3 bg-muted/30 rounded-lg">
                  <p className="text-sm font-medium">Perfect Interview Score</p>
                  <p className="text-xs text-muted-foreground">Scored 100% on behavioral interview</p>
                </div>
                <div className="p-3 bg-muted/30 rounded-lg">
                  <p className="text-sm font-medium">Coding Streak</p>
                  <p className="text-xs text-muted-foreground">12-day problem solving streak</p>
                </div>
                <div className="p-3 bg-muted/30 rounded-lg">
                  <p className="text-sm font-medium">Skill Improvement</p>
                  <p className="text-xs text-muted-foreground">+15% in system design</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold">Next Week Focus</h4>
              <div className="space-y-3">
                <div className="p-3 bg-muted/30 rounded-lg">
                  <p className="text-sm font-medium">Video Interview Practice</p>
                  <p className="text-xs text-muted-foreground">Improve body language and eye contact</p>
                </div>
                <div className="p-3 bg-muted/30 rounded-lg">
                  <p className="text-sm font-medium">Dynamic Programming</p>
                  <p className="text-xs text-muted-foreground">Master DP patterns and optimization</p>
                </div>
                <div className="p-3 bg-muted/30 rounded-lg">
                  <p className="text-sm font-medium">Cover Letter Writing</p>
                  <p className="text-xs text-muted-foreground">Create templates for different roles</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Card className="card-glass">
        <CardHeader>
          <CardTitle>AI Recommendations</CardTitle>
          <CardDescription>Personalized suggestions based on your performance data</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-semibold text-green-primary">Strengths to Leverage</h4>
              <div className="space-y-3">
                <div className="p-4 bg-green-primary/10 rounded-lg border border-green-primary/20">
                  <p className="font-medium text-sm">Technical Communication</p>
                  <p className="text-xs text-muted-foreground">You excel at explaining complex concepts. Highlight this in interviews for senior roles.</p>
                </div>
                <div className="p-4 bg-green-primary/10 rounded-lg border border-green-primary/20">
                  <p className="font-medium text-sm">Problem-Solving Approach</p>
                  <p className="text-xs text-muted-foreground">Your systematic approach to coding problems is impressive. Share your methodology.</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold text-yellow-400">Areas for Improvement</h4>
              <div className="space-y-3">
                <div className="p-4 bg-yellow-400/10 rounded-lg border border-yellow-400/20">
                  <p className="font-medium text-sm">Time Management</p>
                  <p className="text-xs text-muted-foreground">Practice time-boxed coding challenges to improve efficiency under pressure.</p>
                </div>
                <div className="p-4 bg-yellow-400/10 rounded-lg border border-yellow-400/20">
                  <p className="font-medium text-sm">System Design Depth</p>
                  <p className="text-xs text-muted-foreground">Dive deeper into scalability and trade-offs in your system design discussions.</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Analytics;