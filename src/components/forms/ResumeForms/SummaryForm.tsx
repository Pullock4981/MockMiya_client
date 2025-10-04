"use client";

import React, { useState } from "react";
import { useSummary } from "@/context/ResumeContext/Summary";
import { usePersonalInfo } from "@/context/ResumeContext/PersonalInfo";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Copy, Check } from "lucide-react";

// 🔹 জব টাইটেল অনুযায়ী summary templates
const getSummaryTemplates = (jobTitle: string) => {
  const baseTemplates = [
    {
      title: "Software Developer",
      content:
        "Passionate software developer with 3+ years of experience building scalable applications using React, Node.js, and cloud technologies.",
    },
    {
      title: "Full-Stack Developer",
      content:
        "Versatile full-stack developer with expertise in React, Node.js, and PostgreSQL, delivering end-to-end solutions.",
    },
    {
      title: "Data Analyst",
      content:
        "Detail-oriented data analyst with expertise in SQL, Python, and Tableau, turning complex data into actionable insights.",
    },
    {
      title: "Project Manager",
      content:
        "Certified project manager skilled in Agile methodologies with experience leading cross-functional teams.",
    },
    {
      title: "UX Designer",
      content:
        "Creative UX designer with 3+ years of experience creating intuitive digital experiences using Figma and user research.",
    },
    {
      title: "Marketing Specialist",
      content:
        "Dynamic marketing specialist experienced in SEO, content creation, and social media strategy with proven growth results.",
    },
  ];

  if (!jobTitle) return baseTemplates.slice(0, 5);

  // filter & prioritize relevant templates
  const filtered = baseTemplates.filter((t) =>
    t.title.toLowerCase().includes(jobTitle.toLowerCase()) ||
    jobTitle.toLowerCase().includes(t.title.toLowerCase())
  );

  if (filtered.length > 0) {
    // relevant টেমপ্লেট আগে, তারপর অন্যগুলা থেকে বাকি পূরণ করবে
    return [...filtered, ...baseTemplates.filter((t) => !filtered.includes(t))].slice(0, 5);
  }

  return baseTemplates.slice(0, 5);
};

export const SummaryForm = () => {
  const { summary, updateSummary } = useSummary();
  const { personalInfo } = usePersonalInfo();
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const templates = getSummaryTemplates(personalInfo.jobTitle);

  const handleTemplateUse = (content: string, index: number) => {
    updateSummary(content);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Input Section */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">
          Professional Summary <span className="text-destructive">*</span>
        </Label>
        <Textarea
          value={summary}
          onChange={(e) => updateSummary(e.target.value)}
          placeholder="Write a compelling professional summary..."
          className="min-h-32 resize-none transition-all duration-200 focus:ring-primary/20"
          maxLength={600}
        />
        <p className="text-xs text-muted-foreground">
          Ideal length: 200–300 characters. Max 600 characters.
        </p>
      </div>

      {/* Templates */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Suggested Templates</h3>
        <p className="text-sm text-muted-foreground">
          Based on your job title (<span className="font-semibold">{personalInfo.jobTitle || "Not provided"}</span>)
        </p>
        <div className="grid gap-4">
          {templates.map((template, index) => (
            <Card
              key={index}
              className="p-4 hover:shadow-md transition-all duration-200 border-border/50"
            >
              <div className="flex items-center justify-between mb-2">
                <Badge variant="secondary" className="text-xs">
                  {template.title}
                </Badge>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleTemplateUse(template.content, index)}
                  className="flex items-center gap-2"
                >
                  {copiedIndex === index ? (
                    <>
                      <Check className="h-4 w-4 text-success" />
                      Used
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      Use Template
                    </>
                  )}
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">{template.content}</p>
            </Card>
          ))}
        </div>
      </div>

      {/* Writing Tips */}
      <Card className="p-4 bg-primary/5 border-primary/20">
        <h4 className="text-sm font-medium text-primary mb-2">
          ✍️ Writing Tips
        </h4>
        <ul className="text-xs text-muted-foreground space-y-1">
          <li>• Start with your role and years of experience</li>
          <li>• Mention 2-3 key skills or areas of expertise</li>
          <li>• Add achievements with measurable impact</li>
          <li>• Highlight tools/technologies relevant to your field</li>
        </ul>
      </Card>
    </div>
  );
};
