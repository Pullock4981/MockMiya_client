import { Search, Target, TrendingUp, FileText, AlertCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import PrivateRoute from "@/app/Routes/PrivateRoute";

const JobAnalyzer = () => {
    return (
        <PrivateRoute>
            <div className="space-y-8">
                <div>
                    <h1 className="text-3xl font-bold">Job Analyzer</h1>
                    <p className="text-muted-foreground mt-2">
                        Analyze job descriptions and get AI-powered insights to optimize your applications
                    </p>
                </div>

                {/* Job Analysis Input */}
                <Card className="card-glass">
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <Search className="h-5 w-5 mr-2" />
                            Analyze Job Description
                        </CardTitle>
                        <CardDescription>
                            Paste a job description to get detailed analysis and recommendations
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex gap-4">
                            <Input
                                placeholder="Paste job posting URL or description..."
                                className="flex-1"
                            />
                            <Button className="btn-hero">
                                <Target className="h-4 w-4 mr-2" />
                                Analyze
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Analysis Results */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card className="card-glass">
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <TrendingUp className="h-5 w-5 mr-2" />
                                Match Score
                            </CardTitle>
                            <CardDescription>How well your profile matches this role</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="text-center space-y-4">
                                <div className="text-4xl font-bold text-green-primary">87%</div>
                                <p className="text-sm text-muted-foreground">Strong match for this position</p>

                                <div className="grid grid-cols-2 gap-4 mt-6">
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-blue-400">12/15</div>
                                        <p className="text-xs text-muted-foreground">Skills Match</p>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-purple-400">4/5</div>
                                        <p className="text-xs text-muted-foreground">Experience Level</p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="card-glass">
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <AlertCircle className="h-5 w-5 mr-2" />
                                Key Requirements
                            </CardTitle>
                            <CardDescription>Critical skills and qualifications</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm">React.js</span>
                                    <Badge variant="default" className="bg-green-primary">✓ Have</Badge>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm">TypeScript</span>
                                    <Badge variant="default" className="bg-green-primary">✓ Have</Badge>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm">Node.js</span>
                                    <Badge variant="secondary">○ Learning</Badge>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm">AWS</span>
                                    <Badge variant="destructive">✗ Missing</Badge>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm">5+ years experience</span>
                                    <Badge variant="default" className="bg-green-primary">✓ Have</Badge>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Recommendations */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="card-glass">
                        <CardHeader>
                            <CardTitle className="text-lg">Resume Optimization</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                <div className="p-3 bg-muted/50 rounded-lg">
                                    <p className="text-sm font-medium">Add AWS experience</p>
                                    <p className="text-xs text-muted-foreground">Highlight any cloud projects or certifications</p>
                                </div>
                                <div className="p-3 bg-muted/50 rounded-lg">
                                    <p className="text-sm font-medium">Emphasize leadership</p>
                                    <p className="text-xs text-muted-foreground">This role values team leadership skills</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="card-glass">
                        <CardHeader>
                            <CardTitle className="text-lg">Cover Letter Tips</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                <div className="p-3 bg-muted/50 rounded-lg">
                                    <p className="text-sm font-medium">Mention scalability</p>
                                    <p className="text-xs text-muted-foreground">Company emphasizes building scalable systems</p>
                                </div>
                                <div className="p-3 bg-muted/50 rounded-lg">
                                    <p className="text-sm font-medium">Company culture fit</p>
                                    <p className="text-xs text-muted-foreground">Highlight collaborative work style</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="card-glass">
                        <CardHeader>
                            <CardTitle className="text-lg">Interview Prep</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                <div className="p-3 bg-muted/50 rounded-lg">
                                    <p className="text-sm font-medium">System design questions</p>
                                    <p className="text-xs text-muted-foreground">Prepare for architecture discussions</p>
                                </div>
                                <div className="p-3 bg-muted/50 rounded-lg">
                                    <p className="text-sm font-medium">Behavioral questions</p>
                                    <p className="text-xs text-muted-foreground">Focus on leadership and mentoring examples</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Recent Analyses */}
                <Card className="card-glass">
                    <CardHeader>
                        <CardTitle>Recent Job Analyses</CardTitle>
                        <CardDescription>Your analyzed job postings</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {[
                                { company: "TechCorp", role: "Senior Software Engineer", match: "87%", date: "2 hours ago" },
                                { company: "StartupXYZ", role: "Full Stack Developer", match: "92%", date: "1 day ago" },
                                { company: "BigTech Inc", role: "Frontend Architect", match: "76%", date: "3 days ago" },
                            ].map((analysis, index) => (
                                <div key={index} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                                    <div className="flex items-center space-x-4">
                                        <FileText className="h-5 w-5 text-muted-foreground" />
                                        <div>
                                            <p className="font-medium">{analysis.role} at {analysis.company}</p>
                                            <p className="text-sm text-muted-foreground">{analysis.date}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <Badge variant="outline" className="text-green-primary border-green-primary">
                                            {analysis.match} match
                                        </Badge>
                                        <Button size="sm" variant="ghost">View</Button>
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

export default JobAnalyzer;