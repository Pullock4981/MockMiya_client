"use client";

import React, { useState } from "react";
import { useSkills } from "@/context/ResumeContext/Skills";
import { Skill, SkillLevel, SkillCategory } from "@/types/resume";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Zap, Plus, Trash2, X } from "lucide-react";

const popularSkills = [
  "JavaScript", "Python", "React", "Node.js", "TypeScript", "AWS",
  "Docker", "Git", "SQL", "MongoDB", "GraphQL", "REST APIs",
  "Leadership", "Communication", "Problem Solving", "Project Management"
];

export const SkillsForm: React.FC = () => {
  const { skills, addSkill, removeSkill } = useSkills();
  const [newSkill, setNewSkill] = useState<Omit<Skill, "id">>({
    name: "",
    level: SkillLevel.Intermediate,
    category: SkillCategory.Technical,
  });

  const handleAddSkill = () => {
    if (!newSkill.name) return;
    addSkill(newSkill);
    setNewSkill({ name: "", level: SkillLevel.Intermediate, category: SkillCategory.Technical });
  };

  const handleAddPopularSkill = (skillName: string) => {
    setNewSkill(prev => ({ ...prev, name: skillName }));
  };

  return (
    <div className="space-y-6">
      {/* Add Skill Card */}
      <Card className="p-6 bg-muted/20 border border-border/50 rounded-lg shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Zap className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold text-gray-800">Add New Skill</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <Input
            placeholder="Skill Name"
            value={newSkill.name}
            onChange={(e) => setNewSkill(prev => ({ ...prev, name: e.target.value }))}
            className="focus:ring-2 focus:ring-primary focus:ring-offset-1"
          />

          <Select value={newSkill.level} onValueChange={(val) => setNewSkill(prev => ({ ...prev, level: val as SkillLevel }))}>
            <SelectTrigger>
              <SelectValue placeholder="Select Level" />
            </SelectTrigger>
            <SelectContent>
              {Object.values(SkillLevel).map(level => (
                <SelectItem key={level} value={level}>{level}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={newSkill.category} onValueChange={(val) => setNewSkill(prev => ({ ...prev, category: val as SkillCategory }))}>
            <SelectTrigger>
              <SelectValue placeholder="Select Category" />
            </SelectTrigger>
            <SelectContent>
              {Object.values(SkillCategory).map(cat => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button
          onClick={handleAddSkill}
          disabled={!newSkill.name}
          className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white"
        >
          <Plus className="h-4 w-4" /> Add Skill
        </Button>
      </Card>

      {/* Popular Skills */}
      <Card className="p-4 bg-muted/10 border border-border/50 rounded-lg shadow-sm">
        <h4 className="text-sm font-medium text-muted-foreground mb-2">Popular Skills</h4>
        <div className="flex flex-wrap gap-2">
          {popularSkills.map(skill => (
            <Button
              key={skill}
              variant="outline"
              size="sm"
              onClick={() => handleAddPopularSkill(skill)}
              className="text-xs hover:bg-primary/10 hover:text-primary transition"
            >
              {skill}
            </Button>
          ))}
        </div>
      </Card>

      {/* Added Skills List */}
      <Card className="p-4 bg-muted/10 border border-border/50 rounded-lg shadow-sm">
        <h4 className="text-sm font-medium text-muted-foreground mb-2">Added Skills</h4>
        <div className="flex flex-col gap-2">
          {skills.length === 0 && <p className="text-xs text-muted-foreground">No skills added yet.</p>}
          {skills.map(skill => (
            <div
              key={skill.id}
              className="flex items-center gap-2 px-3 py-1 rounded-full text-sm hover:bg-primary-light/50 w-fit transition-transform"
            >
              <span>{skill.name} ({skill.level})</span>
              <Trash2
                className="w-4 h-4 cursor-pointer hover:bg-primary/20"
                onClick={() => removeSkill(skill.id)}
              />
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
