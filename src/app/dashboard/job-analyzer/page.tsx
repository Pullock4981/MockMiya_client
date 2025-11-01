

"use client";
import { useState, useEffect } from "react";
import {
  Search,
  Target,
  TrendingUp,
  FileText,
  AlertCircle,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import PrivateRoute from "@/app/Routes/PrivateRoute";
import { useAuth } from "@/context/AuthContext/AuthContext";
import { Textarea } from "@/components/ui/textarea";


interface AnalysisResult {
  matchScore: number;
  skillsHave: string[];
  skillsMissing: string[];
  recommendations: string[];
  company:string;
  role:string
}

interface HistoryItem {
  _id: string;
  userEmail: string;
  company: string;
  role: string;
  match: string;
  result: AnalysisResult;
  createdAt: string;
}

const JobAnalyzer = () => {
  const [jobText, setJobText] = useState("");
  const [loading, setLoading] = useState(false);
  // const [analysis, setAnalysis] = useState<any>(null);
  // const [history, setHistory] = useState<any[]>([]);

  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const { user } = useAuth();
  const userEmail = user?.email ; // Replace with logged-in user email

  // 🔹 Fetch DB history on page load
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch(`/api/job-analyzer-history?userEmail=${userEmail}`);
        const data = await res.json();
        if (data.success && data.history.length > 0) {
          setHistory(data.history);
          setAnalysis(data.history[0].result); // latest analysis UI e
        }
      } catch (err) {
        console.error("Error fetching analysis history:", err);
      }
    };
    fetchHistory();
  }, [userEmail]);

  // Handle job analysis
  const handleAnalyze = async () => {
    if (!jobText) return alert("Please paste a job description first!");
    setLoading(true);

    const res = await fetch("/api/job-analyzer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jobTextOrUrl: jobText, userEmail }),
    });

    const data = await res.json();
    if (data.success) {
      // Update analysis with new result
      setAnalysis(data.result);
     
    }
    setLoading(false);
  };

  return (
    <PrivateRoute>
      <div className="space-y-8">
        {/* Header */}
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
            <div className="flex flex-col gap-4 items-center justify-between">
              <Textarea
                placeholder="Paste job description..."
                value={jobText}
                className="overflow-y-auto h-36"
                onChange={(e) => setJobText(e.target.value)}
              />
              <Button className="btn-hero" onClick={handleAnalyze} disabled={loading}>
                {loading ? "Analyzing..." : <>
                  <Target className="h-4 w-4 mr-2" /> Analyze
                </>}
              </Button>
            </div>
          </CardContent>
        </Card>

                {/* Analysis Results */}
        {analysis && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Match Score */}
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
                  <div className="text-4xl font-bold text-green-primary">
                    {analysis.matchScore }%
                  </div>
                    <p className="text-sm text-muted-foreground">
                      {analysis.matchScore > 80
                        ? "Strong match"
                        : analysis.matchScore > 60
                        ? "Good match"
                        : "Needs improvement"}
                    </p>

                  <div className="grid grid-cols-2 gap-4 mt-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-400">
                        {analysis.skillsHave?.length || 0}
                      </div>
                      <p className="text-xs text-muted-foreground">Skills Match</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-400">
                        {analysis.skillsMissing?.length || 0}
                      </div>
                      <p className="text-xs text-muted-foreground">Missing Skills</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Key Requirements */}
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
                  {analysis.skillsHave?.map((skill: string, idx: number) => (
                    <div key={idx} className="flex items-center justify-between">
                      <span className="text-sm">{skill}</span>
                      <Badge variant="secondary" className="bg-green-primary">
                        ✓ Have
                      </Badge>
                    </div>
                  ))}
                  {analysis.skillsMissing?.map((skill: string, idx: number) => (
                    <div key={idx} className="flex items-center justify-between">
                      <span className="text-sm">{skill}</span>
                      <Badge variant="destructive">✗ Missing</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}


        {/* Recommendations */}
        {analysis?.recommendations && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {['Resume Optimization', 'Cover Letter Tips', 'Interview Prep'].map((title, i) => (
              <Card key={i} className="card-glass">
                <CardHeader>
                  <CardTitle className="text-lg">{title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {analysis.recommendations.slice(i * 2, i * 2 + 2).map((rec: string, idx: number) => (
                      <div key={idx} className="p-3 bg-muted/50 rounded-lg">
                        <p className="text-sm font-medium">{rec}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

      
        {/* Recent Analyses */}
        <Card className="card-glass">
          <CardHeader>
            <CardTitle>Recent Job Analyses</CardTitle>
            <CardDescription>Your analyzed job postings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {history.length > 0 ? (
                history.map((item, index) => (
                       <div key={index} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                                    <div className="flex items-center space-x-4">
                                        <FileText className="h-5 w-5 text-muted-foreground" />
                                        <div>
                                            <p className="font-medium">{item?.role} at {item.company}</p>
                                            <p className="text-sm text-muted-foreground">{new Date(item.createdAt).toLocaleString()}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <Badge variant="outline" className="text-green-primary border-green-primary">
                                            {item?.match} match
                                        </Badge>
                                        <Button size="sm" variant="ghost">View</Button>
                                    </div>
                                </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No analyses found yet.</p>
              )}

            </div>
          </CardContent>
        </Card>
      </div>
    </PrivateRoute>
  );
};

export default JobAnalyzer;
