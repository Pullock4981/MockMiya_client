"use client";

import React, { useState } from "react";
import { useProfessionalLinks } from "@/context/ResumeContext/ProfessionalLinks";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Trash2, ExternalLink } from "lucide-react";
import { SocialLink } from "@/types/resume";

// Define union type for platforms
type Platform = "LinkedIn" | "GitHub" | "Twitter" | "Portfolio" | "Other";

export const ProfessionalLinksForm: React.FC = () => {
  const { socialLinks, addLink, removeLink } = useProfessionalLinks();

  const [newLink, setNewLink] = useState<Omit<SocialLink, "id">>({
    platform: "LinkedIn",
    url: "",
    username: "",
  });

  const handleAddLink = () => {
    if (!newLink.url) return;
    addLink(newLink);
    setNewLink({ platform: "LinkedIn", url: "", username: "" });
  };

  const handleUpdateLink = (
    id: string,
    field: keyof SocialLink,
    value: string
  ) => {
    const updatedLinks = socialLinks.map((link) =>
      link.id === id ? { ...link, [field]: value } : link
    );
    // Update context state
    // Assuming useProfessionalLinks has a setter or replace add/remove logic
    // For simplicity, remove + add workaround
    removeLink(id);
    addLink(updatedLinks.find((l) => l.id === id)!);
  };

  return (
    <div className="space-y-6">
      {socialLinks.map((link, index) => (
        <Card key={link.id} className="p-4 border-border/50">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium text-foreground">
                Professional Link {index + 1}
              </h4>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeLink(link.id)}
                className="text-destructive hover:text-destructive-foreground hover:bg-destructive/10"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Platform</Label>
                <Select
                  value={link.platform}
                  onValueChange={(value: Platform) =>
                    handleUpdateLink(link.id, "platform", value)
                  }
                >
                  <SelectTrigger className="border-border/50">
                    <SelectValue placeholder="Select platform" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="LinkedIn">LinkedIn</SelectItem>
                    <SelectItem value="GitHub">GitHub</SelectItem>
                    <SelectItem value="Twitter">Twitter</SelectItem>
                    <SelectItem value="Portfolio">Portfolio</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Username</Label>
                <Input
                  type="text"
                  value={link.username || ""}
                  onChange={(e) =>
                    handleUpdateLink(link.id, "username", e.target.value)
                  }
                  placeholder="@username"
                  className="border-border/50 focus:border-primary transition-colors"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Full URL</Label>
              <div className="flex gap-2">
                <Input
                  type="url"
                  value={link.url}
                  onChange={(e) =>
                    handleUpdateLink(link.id, "url", e.target.value)
                  }
                  placeholder="https://linkedin.com/in/username"
                  className="border-border/50 focus:border-primary transition-colors flex-1"
                />
                {link.url && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(link.url, "_blank")}
                    className="px-3"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </Card>
      ))}

      <Card className="p-4 border-dashed border-border/50 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Platform</Label>
            <Select
              value={newLink.platform}
              onValueChange={(value: Platform) =>
                setNewLink({ ...newLink, platform: value })
              }
            >
              <SelectTrigger className="border-border/50">
                <SelectValue placeholder="Select platform" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="LinkedIn">LinkedIn</SelectItem>
                <SelectItem value="GitHub">GitHub</SelectItem>
                <SelectItem value="Twitter">Twitter</SelectItem>
                <SelectItem value="Portfolio">Portfolio</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Username</Label>
            <Input
              value={newLink.username}
              onChange={(e) =>
                setNewLink({ ...newLink, username: e.target.value })
              }
              placeholder="@username"
              className="border-border/50 focus:border-primary transition-colors"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Full URL</Label>
          <Input
            type="url"
            value={newLink.url}
            onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
            placeholder="https://linkedin.com/in/username"
            className="border-border/50 focus:border-primary transition-colors"
          />
        </div>

        <Button
          className="w-full mt-2 bg-gradient-primary hover:shadow-paper transition-all duration-300"
          onClick={handleAddLink}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Professional Link
        </Button>
      </Card>
    </div>
  );
};
