"use client";

import React, { useState } from "react";
import { useEducation } from "@/context/ResumeContext/Education";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { GraduationCap, Plus, X } from "lucide-react";
import { Education } from "@/types/resume";

export const EducationForm: React.FC = () => {
  const { education, addEducation, removeEducation } = useEducation();

  const [newEdu, setNewEdu] = useState<Omit<Education, "id">>({
    degree: "",
    institution: "",
    location: "",
    graduationDate: "",
    gpa: "",
    honors: "",
  });

  const handleAddEducation = () => {
    if (!newEdu.degree || !newEdu.institution) return;

    addEducation(newEdu);

    setNewEdu({
      degree: "",
      institution: "",
      location: "",
      graduationDate: "",
      gpa: "",
      honors: "",
    });
  };

  return (
    <div className="space-y-6">
      {/* Existing Education */}
      {education.length > 0 && (
        <Card className="p-4 space-y-4 bg-muted/10 border-border/50">
          <h3 className="text-lg font-medium">Your Education</h3>
          {education.map((edu) => (
            <Card key={edu.id} className="p-4 border-border/50 flex justify-between items-start">
              <div className="space-y-1">
                <h4 className="font-semibold text-foreground">{edu.degree}</h4>
                <p className="text-sm text-muted-foreground">{edu.institution} • {edu.location}</p>
                <p className="text-xs text-muted-foreground">{edu.graduationDate}</p>
                {edu.gpa && <p className="text-xs text-muted-foreground">GPA: {edu.gpa}</p>}
                {edu.honors && <p className="text-xs text-muted-foreground">Honors: {edu.honors}</p>}
              </div>
              <Button variant="destructive" size="sm" onClick={() => removeEducation(edu.id)}>
                <X className="h-4 w-4" />
              </Button>
            </Card>
          ))}
        </Card>
      )}

      {/* Add New Education */}
      <Card className="p-6 border-dashed border-2 border-border/50 bg-muted/20">
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <GraduationCap className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-medium">Add Education</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Degree <span className="text-destructive">*</span></Label>
              <Input
                placeholder="Bachelor of Science in Computer Science"
                value={newEdu.degree}
                onChange={e => setNewEdu(prev => ({ ...prev, degree: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Institution <span className="text-destructive">*</span></Label>
              <Input
                placeholder="University of California, Berkeley"
                value={newEdu.institution}
                onChange={e => setNewEdu(prev => ({ ...prev, institution: e.target.value }))}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Location</Label>
              <Input
                placeholder="Berkeley, CA"
                value={newEdu.location}
                onChange={e => setNewEdu(prev => ({ ...prev, location: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Graduation Date</Label>
              <Input
                type="month"
                value={newEdu.graduationDate}
                onChange={e => setNewEdu(prev => ({ ...prev, graduationDate: e.target.value }))}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>GPA (Optional)</Label>
              <Input
                placeholder="3.8/4.0"
                value={newEdu.gpa}
                onChange={e => setNewEdu(prev => ({ ...prev, gpa: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Honors (Optional)</Label>
              <Input
                placeholder="Magna Cum Laude"
                value={newEdu.honors}
                onChange={e => setNewEdu(prev => ({ ...prev, honors: e.target.value }))}
              />
            </div>
          </div>

          <Button
            onClick={handleAddEducation}
            className="w-full flex items-center justify-center gap-2"
            disabled={!newEdu.degree || !newEdu.institution}
          >
            <Plus className="h-4 w-4" /> Add Education
          </Button>
        </div>
      </Card>
    </div>
  );
};
