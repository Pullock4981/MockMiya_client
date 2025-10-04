"use client";

import React from "react";
import { Button } from "@/components/ui/button";

interface TemplateSelectorProps {
  selectedTemplate?: string;
  onSelectTemplate?: (template: string) => void;
}

const templates = ["Single Column", "Double Column", "Modern", "Minimal"];

const TemplateSelector: React.FC<TemplateSelectorProps> = ({
  selectedTemplate,
  onSelectTemplate,
}) => {
  return (
    <div className="grid grid-cols-2 gap-3">
      {templates.map((template) => (
        <Button
          key={template}
          size="sm"
          className="h-20 w-28 flex flex-col items-center justify-center"
          variant={selectedTemplate === template ? "default" : "outline"}
          onClick={() => onSelectTemplate?.(template)}
        >
          <span className="text-xs">{template}</span>
        </Button>
      ))}
    </div>
  );
};

export default TemplateSelector;
