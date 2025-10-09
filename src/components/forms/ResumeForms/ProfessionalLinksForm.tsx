"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useProfessionalLinks } from "@/context/ResumeContext/ProfessionalLinks";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, ExternalLink, Linkedin, Github, Twitter, Globe, Link as LinkIcon } from "lucide-react";
import { SocialLink } from "@/types/resume";

// All possible platforms (stable constant)
const allPlatforms: Platform[] = ["LinkedIn", "GitHub", "Portfolio", "Twitter", "Other"];

type Platform = "LinkedIn" | "GitHub" | "Portfolio" | "Twitter" | "Other";

// Icon mapping for each platform
const platformIcons: Record<Platform, React.ReactNode> = {
  LinkedIn: <Linkedin className="w-4 h-4" />,
  GitHub: <Github className="w-4 h-4" />,
  Portfolio: <Globe className="w-4 h-4" />,
  Twitter: <Twitter className="w-4 h-4" />,
  Other: <LinkIcon className="w-4 h-4" />,
};

export const ProfessionalLinksForm: React.FC = () => {
  const { socialLinks, addLink, removeLink } = useProfessionalLinks();

  // Memoized function to calculate available platforms
  const getAvailablePlatforms = useCallback((): Platform[] => {
    return allPlatforms.filter((p) => !socialLinks.some((link) => link.platform === p));
  }, [socialLinks]);

  const [availablePlatforms, setAvailablePlatforms] = useState<Platform[]>(getAvailablePlatforms());

  const [newLink, setNewLink] = useState<Omit<SocialLink, "id">>({
    platform: availablePlatforms[0] || "LinkedIn",
    url: "",
  });

  // Update available platforms whenever socialLinks or newLink.platform changes
  useEffect(() => {
    const platforms = getAvailablePlatforms();
    setAvailablePlatforms(platforms);

    if (!platforms.includes(newLink.platform)) {
      setNewLink({
        platform: platforms[0] || "LinkedIn",
        url: "",
      });
    }
  }, [socialLinks, newLink.platform, getAvailablePlatforms]);

  // Add new link to context
  const handleAddLink = () => {
    if (!newLink.url) return;

    const linkWithId: SocialLink = {
      id: Math.random().toString(36).substring(2, 9),
      platform: newLink.platform,
      url: newLink.url,
    };

    addLink(linkWithId);
    setNewLink({ ...newLink, url: "" });
  };

  return (
    <div className="space-y-3">
      {/* Existing Links */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {socialLinks.map((link) => (
          <Card key={link.id} className="p-2 flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1">
              {platformIcons[link.platform]}
              <span className="font-medium">{link.platform}</span>
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline flex items-center gap-1"
              >
                <ExternalLink className="w-4 h-4" /> Link
              </a>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeLink(link.id)}
                className="text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Add New Link */}
      {availablePlatforms.length > 0 && (
        <div className="p-2 flex flex-col gap-2">
          <div className="flex items-center gap-4">
            <Select
              value={newLink.platform}
              onValueChange={(value) =>
                setNewLink({ ...newLink, platform: value as Platform })
              }
            >
              <SelectTrigger className="w-36">
                <SelectValue placeholder="Platform" />
              </SelectTrigger>
              <SelectContent>
                {availablePlatforms.map((p) => (
                  <SelectItem key={p} value={p}>
                    <div className="flex items-center gap-2">
                      {platformIcons[p]}
                      <span>{p}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Input
              value={newLink.url}
              onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
              placeholder="https://example.com"
              className="flex-1"
            />
          </div>
          <Button onClick={handleAddLink} className="flex items-center gap-1 px-3">
            <Plus className="w-4 h-4" /> Add
          </Button>
        </div>
      )}
    </div>
  );
};
