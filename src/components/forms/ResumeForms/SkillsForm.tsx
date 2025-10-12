"use client";

import React, { useState } from "react";
import { useSkills } from "@/context/ResumeContext/Skills";
import { Skill, SkillLevel, SkillCategory } from "@/types/resume";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Zap, Plus, Trash2 } from "lucide-react";

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

  const addPopularSkill = (skillName: string) => {
    setNewSkill(prev => ({ ...prev, name: skillName }));
  };

  return (
    <div className="space-y-6">
      {/* Add New Skill */}
      <Card className="p-6 border-border/50 bg-muted/20">
        <div className="flex items-center gap-2 mb-4">
          <Zap className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-medium">Add New Skill</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <Input
            placeholder="Skill Name"
            value={newSkill.name}
            onChange={(e) => setNewSkill(prev => ({ ...prev, name: e.target.value }))}
          />

          <Select value={newSkill.level} onValueChange={(val) => setNewSkill(prev => ({ ...prev, level: val as SkillLevel }))}>
            <SelectTrigger>
              <SelectValue placeholder="Select Level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Beginner">Beginner</SelectItem>
              <SelectItem value="Intermediate">Intermediate</SelectItem>
              <SelectItem value="Advanced">Advanced</SelectItem>
              <SelectItem value="Expert">Expert</SelectItem>
            </SelectContent>
          </Select>

          <Select value={newSkill.category} onValueChange={(val) => setNewSkill(prev => ({ ...prev, category: val as SkillCategory }))}>
            <SelectTrigger>
              <SelectValue placeholder="Select Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Technical">Technical</SelectItem>
              <SelectItem value="Soft">Soft</SelectItem>
              <SelectItem value="Language">Language</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button
          onClick={handleAddSkill}
          disabled={!newSkill.name}
          className="w-full flex items-center justify-center gap-2"
        >
          <Plus className="h-4 w-4" /> Add Skill
        </Button>
      </Card>

      {/* Popular Skills */}
      <Card className="p-4 bg-muted/10 border-border/50">
        <h4 className="text-sm font-medium text-muted-foreground mb-2">Popular Skills (Click to add)</h4>
        <div className="flex flex-wrap gap-2">
          {popularSkills.map(skill => (
            <Button
              key={skill}
              variant="outline"
              size="sm"
              onClick={() => addPopularSkill(skill)}
              className="text-xs hover:bg-primary/10 hover:text-primary hover:border-primary/20"
            >
              {skill}
            </Button>
          ))}
        </div>
      </Card>

      {/* Added Skills List */}
      <Card className="p-4 bg-muted/10 border-border/50">
        <h4 className="text-sm font-medium text-muted-foreground mb-2">Added Skills</h4>
        <ul className="space-y-2">
          {skills.map(skill => (
            <li key={skill.id} className="flex justify-between items-center border p-2 rounded-lg">
              <span>{skill.name} - {skill.level} ({skill.category})</span>
              <Button variant="destructive" size="sm" onClick={() => removeSkill(skill.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </li>
          ))}
          {skills.length === 0 && <p className="text-xs text-muted-foreground">No skills added yet.</p>}
        </ul>
      </Card>
    </div>
  );
};
