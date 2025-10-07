"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Palette, Download, Layout, Share2, Eye, EyeOff } from "lucide-react";
import { exportResumeHandler } from "@/utils/exportResume";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import TemplateSelector from "@/utils/TemplateSelector";
import { useMeta } from "@/context/ResumeContext/MetaContext";

type ThemeColorOption = {
  name: string;
  colors: [string, string];
};

// Theme color options
const themeColors: ThemeColorOption[] = [
  { name: "Default", colors: ["#ffffff", "#000000"] },
  { name: "Green", colors: ["#ffffff", "#34A853"] },
  { name: "Blue", colors: ["#ffffff", "#1A73E8"] },
  { name: "Orange", colors: ["#ffffff", "#FB8C00"] },
  { name: "Purple", colors: ["#ffffff", "#9C27B0"] },
];

interface ResumeControlsProps {
  showATSDetails: boolean;
  setShowATSDetails: (value: boolean) => void;
  userId: string;
}

const ResumeControls: React.FC<ResumeControlsProps> = ({
  showATSDetails,
  setShowATSDetails,
}) => {
  const { template, updateTemplate, theme, updateTheme, atsScore } = useMeta();
  const [openTemplateSelector, setOpenTemplateSelector] = useState(false);

  // PDF export handler
  const handleExport = async () => {
    try {
      await exportResumeHandler();
    } catch (error) {
      console.error("PDF Export failed:", error);
    }
  };

  // Fallbacks to avoid undefined
  const currentTemplate = template ?? { id: "default", name: "Classic", layout: "classic", sections: [] };
  const currentTheme = theme ?? { id: "default", name: "Default", primaryColor: "#2563eb", accentColor: "#9333ea", textColor: "#111827", backgroundColor: "#ffffff", fontFamily: "Inter" };

  return (
    <div className="flex flex-wrap justify-between items-center gap-4 bg-foreground-muted p-2 rounded-lg">
      {/* ATS Toggle */}
      <div className="flex items-center gap-3">
        {atsScore !== undefined && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowATSDetails(!showATSDetails)}
          >
            {showATSDetails ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
        )}
      </div>

      {/* Controls */}
      <div className="flex items-center gap-2 flex-wrap">
        {/* Template Selector */}
        <Popover open={openTemplateSelector} onOpenChange={setOpenTemplateSelector}>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Layout className="h-4 w-4" /> {currentTemplate.name}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[350px]">
            <TemplateSelector
              selectedTemplate={currentTemplate.name}
              onSelectTemplate={(tpl) => {
                updateTemplate({ 
                  ...currentTemplate, 
                  name: tpl,
                  id: currentTemplate.id || "default",
                  layout: currentTemplate.layout || "classic",
                  sections: currentTemplate.sections || [],
                });
                setOpenTemplateSelector(false);
              }}
            />
          </PopoverContent>
        </Popover>

        {/* Color Palette */}
        <div className="flex items-center gap-2">
          <Palette className="h-4 w-4" />
          <div className="flex gap-1">
            {themeColors.map((t) => (
              <button
                key={t.name}
                onClick={() => updateTheme({ 
                  ...currentTheme, 
                  name: t.name, 
                  id: currentTheme.id || "default",
                  primaryColor: currentTheme.primaryColor || "#2563eb",
                  accentColor: currentTheme.accentColor || "#9333ea",
                  textColor: currentTheme.textColor || "#111827",
                  backgroundColor: currentTheme.backgroundColor || "#ffffff",
                  fontFamily: currentTheme.fontFamily || "Inter",
                })}
                className={`w-6 h-6 rounded-full border border-gray-300 flex overflow-hidden cursor-pointer ${
                  currentTheme.name === t.name ? "ring-2 ring-offset-1 ring-primary" : ""
                }`}
              >
                <div className="w-1/2 h-full" style={{ backgroundColor: t.colors[0] }} />
                <div className="w-1/2 h-full" style={{ backgroundColor: t.colors[1] }} />
              </button>
            ))}
          </div>
        </div>

        {/* Export PDF */}
        <Button variant="outline" size="sm" onClick={handleExport}>
          <Download className="h-4 w-4" /> PDF
        </Button>

        {/* Share Button */}
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <Share2 className="h-4 w-4" /> Share
        </Button>
      </div>
    </div>
  );
};

export default ResumeControls;
