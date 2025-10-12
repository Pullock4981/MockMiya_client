"use client";

import React, { useState } from "react";
import { useWorkExperience } from "@/context/ResumeContext/WorkExperience";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Plus, X, Briefcase } from "lucide-react";
import { WorkExperience } from "@/types/resume";

export const WorkExperienceForm: React.FC = () => {
  const { workExperience, addWork, removeWork } = useWorkExperience();

  const [newExperience, setNewExperience] = useState<Omit<WorkExperience, "id">>({
    jobTitle: "",
    company: "",
    location: "",
    startDate: "",
    endDate: "",
    current: false,
    responsibilities: [""],
    achievements: [""],
  });

  const handleAddExperience = () => {
    if (!newExperience.jobTitle || !newExperience.company) return;

    addWork({
      ...newExperience,
      responsibilities: newExperience.responsibilities.filter(r => r.trim()),
      achievements: newExperience.achievements.filter(a => a.trim()),
    });

    setNewExperience({
      jobTitle: "",
      company: "",
      location: "",
      startDate: "",
      endDate: "",
      current: false,
      responsibilities: [""],
      achievements: [""],
    });
  };

  const addResponsibility = () =>
    setNewExperience(prev => ({ ...prev, responsibilities: [...prev.responsibilities, ""] }));

  const updateResponsibility = (index: number, value: string) =>
    setNewExperience(prev => ({
      ...prev,
      responsibilities: prev.responsibilities.map((r, i) => (i === index ? value : r)),
    }));

  const removeResponsibility = (index: number) =>
    setNewExperience(prev => ({
      ...prev,
      responsibilities: prev.responsibilities.filter((_, i) => i !== index),
    }));

  const addAchievement = () =>
    setNewExperience(prev => ({ ...prev, achievements: [...prev.achievements, ""] }));

  const updateAchievement = (index: number, value: string) =>
    setNewExperience(prev => ({
      ...prev,
      achievements: prev.achievements.map((a, i) => (i === index ? value : a)),
    }));

  const removeAchievement = (index: number) =>
    setNewExperience(prev => ({
      ...prev,
      achievements: prev.achievements.filter((_, i) => i !== index),
    }));

  return (
    <div className="space-y-6">
      {/* Existing Work Experience */}
      {workExperience.length > 0 && (
        <Card className="space-y-4 p-4 border-border/50 bg-muted/10">
          <h3 className="text-lg font-medium">Your Work Experience</h3>
          {workExperience.map(exp => (
            <Card key={exp.id} className="flex justify-between p-4 border-border/50">
              <div className="space-y-1">
                <h4 className="font-semibold text-foreground">{exp.jobTitle}</h4>
                <p className="text-sm text-muted-foreground">{exp.company} • {exp.location}</p>
                <p className="text-xs text-muted-foreground">
                  {exp.startDate} - {exp.current ? "Present" : exp.endDate}
                </p>
              </div>
              <Button variant="destructive" size="sm" onClick={() => removeWork(exp.id)}>
                <X className="h-4 w-4" />
              </Button>
            </Card>
          ))}
        </Card>
      )}

      {/* Add New Work Experience */}
      <Card className="p-6 border-dashed border-2 border-border/50 bg-muted/20">
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Briefcase className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-medium">Add Work Experience</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Job Title <span className="text-destructive">*</span></Label>
              <Input
                placeholder="Software Engineer"
                value={newExperience.jobTitle}
                onChange={e => setNewExperience(prev => ({ ...prev, jobTitle: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Company <span className="text-destructive">*</span></Label>
              <Input
                placeholder="Google"
                value={newExperience.company}
                onChange={e => setNewExperience(prev => ({ ...prev, company: e.target.value }))}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Location</Label>
            <Input
              placeholder="San Francisco, CA"
              value={newExperience.location}
              onChange={e => setNewExperience(prev => ({ ...prev, location: e.target.value }))}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Start Date</Label>
              <Input
                type="month"
                value={newExperience.startDate}
                onChange={e => setNewExperience(prev => ({ ...prev, startDate: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>End Date</Label>
              <Input
                type="month"
                value={newExperience.endDate}
                onChange={e => setNewExperience(prev => ({ ...prev, endDate: e.target.value }))}
                disabled={newExperience.current}
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              checked={newExperience.current}
              onCheckedChange={checked => setNewExperience(prev => ({ ...prev, current: checked }))}
            />
            <Label>I currently work here</Label>
          </div>

          {/* Responsibilities */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Key Responsibilities</Label>
              <Button variant="outline" size="sm" onClick={addResponsibility}>
                <Plus className="h-4 w-4 mr-1" /> Add
              </Button>
            </div>
            {newExperience.responsibilities.map((resp, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <Textarea
                  placeholder="• Developed and maintained web applications"
                  value={resp}
                  onChange={e => updateResponsibility(idx, e.target.value)}
                  className="min-h-16 resize-none"
                />
                {newExperience.responsibilities.length > 1 && (
                  <Button variant="ghost" size="sm" onClick={() => removeResponsibility(idx)}>
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>

          {/* Achievements */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Key Achievements</Label>
              <Button variant="outline" size="sm" onClick={addAchievement}>
                <Plus className="h-4 w-4 mr-1" /> Add
              </Button>
            </div>
            {newExperience.achievements.map((ach, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <Textarea
                  placeholder="• Increased performance by 30%"
                  value={ach}
                  onChange={e => updateAchievement(idx, e.target.value)}
                  className="min-h-16 resize-none"
                />
                {newExperience.achievements.length > 1 && (
                  <Button variant="ghost" size="sm" onClick={() => removeAchievement(idx)}>
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>

          <Button
            onClick={handleAddExperience}
            className="w-full flex items-center justify-center gap-2"
            disabled={!newExperience.jobTitle || !newExperience.company}
          >
            <Plus className="h-4 w-4" /> Add Experience
          </Button>
        </div>
      </Card>
    </div>
  );
};
