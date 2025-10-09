"use client";

import React from "react";
import { Button } from "@/components/ui/button";

interface ThemeSelectorProps {
  selectedTheme?: string;
  onSelectTheme?: (theme: string) => void;
}

const themes = [
  { name: "Light", color: "bg-gray-200" },
  { name: "Dark", color: "bg-gray-800" },
  { name: "Blue", color: "bg-blue-500" },
  { name: "Green", color: "bg-green-500" },
  { name: "Orange", color: "bg-orange-500" },
];

const ThemeSelector: React.FC<ThemeSelectorProps> = ({
  selectedTheme,
  onSelectTheme,
}) => {
  return (
    <div className="flex gap-3 flex-wrap">
      {themes.map((theme) => (
        <Button
          key={theme.name}
          size="sm"
          className={`h-10 w-10 rounded-full ${theme.color}`}
          variant={selectedTheme === theme.name ? "default" : "outline"}
          onClick={() => onSelectTheme?.(theme.name)}
        />
      ))}
    </div>
  );
};

export default ThemeSelector;
