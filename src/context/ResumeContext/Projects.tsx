"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Project } from "@/types/resume";
import { v4 as uuidv4 } from "uuid";

interface ProjectsContextType {
  projects: Project[];
  addProject: (project: Omit<Project, "id">) => void;
  updateProject: (id: string, project: Partial<Project>) => void;
  removeProject: (id: string) => void;
}

const ProjectsContext = createContext<ProjectsContextType | undefined>(undefined);

interface Props {
  children: React.ReactNode;
  initialData?: Project[];
}

export const ProjectsProvider = ({ children, initialData }: Props) => {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    if (initialData) setProjects(initialData);
  }, [initialData]);

  const addProject = (project: Omit<Project, "id">) => {
    setProjects((prev) => [...prev, { id: uuidv4(), ...project }]);
  };

  const updateProject = (id: string, project: Partial<Project>) => {
    setProjects((prev) => prev.map((p) => (p.id === id ? { ...p, ...project } : p)));
  };

  const removeProject = (id: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <ProjectsContext.Provider value={{ projects, addProject, updateProject, removeProject }}>
      {children}
    </ProjectsContext.Provider>
  );
};

export const useProjects = () => {
  const context = useContext(ProjectsContext);
  if (!context) throw new Error("useProjects must be used within ProjectsProvider");
  return context;
};
