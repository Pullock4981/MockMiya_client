"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus, X, FolderOpen } from "lucide-react";
import { useProjects } from "@/context/ResumeContext/Projects";
import { Project } from "@/types/resume";

export const ProjectsForm: React.FC = () => {
  const { projects, addProject, removeProject } = useProjects();

  const [newProject, setNewProject] = useState<Omit<Project, "id">>({
    name: "",
    description: "",
    technologies: [],
    url: "",
    startDate: "",
    endDate: "",
    highlights: [""],
  });

  const handleAddProject = () => {
    if (!newProject.name) return;
    addProject({
      ...newProject,
      highlights: newProject.highlights.filter(h => h.trim()),
    });
    setNewProject({
      name: "",
      description: "",
      technologies: [],
      url: "",
      startDate: "",
      endDate: "",
      highlights: [""],
    });
  };

  const addHighlight = () =>
    setNewProject(prev => ({ ...prev, highlights: [...prev.highlights, ""] }));

  const updateHighlight = (index: number, value: string) =>
    setNewProject(prev => ({
      ...prev,
      highlights: prev.highlights.map((h, i) => (i === index ? value : h)),
    }));

  const removeHighlight = (index: number) =>
    setNewProject(prev => ({
      ...prev,
      highlights: prev.highlights.filter((_, i) => i !== index),
    }));

  return (
    <div className="space-y-6">
      {/* Add Project Form */}
      <Card className="p-6 border-dashed border-2 border-border/50 bg-muted/20">
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <FolderOpen className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-medium">Add Project</h3>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Project Name <span className="text-destructive">*</span></Label>
              <Input
                placeholder="E-commerce Web Application"
                value={newProject.name}
                onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                placeholder="Describe your project..."
                value={newProject.description}
                onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                className="min-h-20 resize-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Technologies Used (comma separated)</Label>
                <Input
                  placeholder="React, Node.js, MongoDB"
                  value={newProject.technologies.join(", ")}
                  onChange={(e) =>
                    setNewProject({
                      ...newProject,
                      technologies: e.target.value.split(",").map(t => t.trim()),
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Project URL (Optional)</Label>
                <Input
                  placeholder="https://myproject.com"
                  value={newProject.url}
                  onChange={(e) => setNewProject({ ...newProject, url: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Start Date</Label>
                <Input
                  type="month"
                  value={newProject.startDate}
                  onChange={(e) => setNewProject({ ...newProject, startDate: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>End Date (Optional)</Label>
                <Input
                  type="month"
                  value={newProject.endDate}
                  onChange={(e) => setNewProject({ ...newProject, endDate: e.target.value })}
                />
              </div>
            </div>

            {/* Highlights */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Highlights</Label>
                <Button variant="outline" size="sm" onClick={addHighlight}>
                  <Plus className="h-4 w-4 mr-1" /> Add
                </Button>
              </div>
              {newProject.highlights.map((highlight, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <Input
                    placeholder="Implemented user authentication"
                    value={highlight}
                    onChange={(e) => updateHighlight(idx, e.target.value)}
                  />
                  {newProject.highlights.length > 1 && (
                    <Button variant="ghost" size="sm" onClick={() => removeHighlight(idx)}>
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>

            <Button
              className="w-full transition-all duration-300"
              onClick={handleAddProject}
              disabled={!newProject.name}
            >
              <Plus className="h-4 w-4 mr-2" /> Add Project
            </Button>
          </div>
        </div>
      </Card>

      {/* Project List */}
      <div className="space-y-2">
        {projects.map(project => (
          <Card key={project.id} className="p-4 flex justify-between items-start border-dashed border-2 border-border/50">
            <div className="space-y-1">
              <h4 className="font-medium">{project.name}</h4>
              {project.description && <p className="text-sm text-muted-foreground">{project.description}</p>}
              {project.technologies.length > 0 && <p className="text-xs text-muted-foreground">Tech: {project.technologies.join(", ")}</p>}
              {project.url && (
                <a href={project.url} target="_blank" className="text-primary text-xs underline">{project.url}</a>
              )}
              {project.highlights.length > 0 && (
                <ul className="text-xs text-muted-foreground list-disc pl-4">
                  {project.highlights.map((h, idx) => (
                    <li key={idx}>{h}</li>
                  ))}
                </ul>
              )}
            </div>
            <Button variant="destructive" size="sm" onClick={() => removeProject(project.id)}>
              Remove
            </Button>
          </Card>
        ))}
      </div>

      {/* Project Tips */}
      <Card className="p-4 bg-primary/5 border-primary/20">
        <h4 className="text-sm font-medium text-primary mb-2">💡 Project Tips</h4>
        <ul className="text-xs text-muted-foreground space-y-1">
          <li>• Include personal, academic, and professional projects</li>
          <li>• Focus on projects that demonstrate relevant skills</li>
          <li>• Highlight your specific contributions and achievements</li>
          <li>• Include links to live demos or GitHub repositories</li>
        </ul>
      </Card>
    </div>
  );
};
