"use client";

import React from "react";
import { usePersonalInfo } from "@/context/ResumeContext/PersonalInfo";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Upload, User } from "lucide-react";

export const PersonalInfoForm: React.FC = () => {
  const { personalInfo, updatePersonalInfo } = usePersonalInfo();

  const handleInputChange = (field: keyof typeof personalInfo, value: string) => {
    updatePersonalInfo({ [field]: value });
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        updatePersonalInfo({ profileImage: imageUrl });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6">
      {/* Profile Image Upload */}
      <Card className="p-4 bg-muted/30 border-border/50">
        <div className="flex items-center space-x-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src={personalInfo.profileImage || ""} alt="Profile" />
            <AvatarFallback className="bg-primary/10 text-primary">
              <User className="h-8 w-8" />
            </AvatarFallback>
          </Avatar>

          <div className="space-y-2">
            <Label htmlFor="profile-image" className="text-sm font-medium">
              Profile Photo (Optional)
            </Label>
            <div className="flex items-center space-x-2">
              <input
                id="profile-image"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => document.getElementById("profile-image")?.click()}
                className="flex items-center gap-2"
              >
                <Upload className="h-4 w-4" />
                Upload Photo
              </Button>
              {personalInfo.profileImage && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => updatePersonalInfo({ profileImage: "" })}
                  className="text-destructive hover:text-destructive"
                >
                  Remove
                </Button>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Recommended: 400x400px, JPG or PNG, max 5MB
            </p>
          </div>
        </div>
      </Card>

      {/* Basic Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName" className="text-sm font-medium">
            First Name <span className="text-destructive">*</span>
          </Label>
          <Input
            id="firstName"
            placeholder="John"
            value={personalInfo.firstName || ""}
            onChange={(e) => handleInputChange("firstName", e.target.value)}
            className="transition-all duration-200 focus:ring-primary/20"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="lastName" className="text-sm font-medium">
            Last Name <span className="text-destructive">*</span>
          </Label>
          <Input
            id="lastName"
            placeholder="Smith"
            value={personalInfo.lastName || ""}
            onChange={(e) => handleInputChange("lastName", e.target.value)}
            className="transition-all duration-200 focus:ring-primary/20"
          />
        </div>
      </div>

      {/* Contact Information */}
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium">
            Email Address <span className="text-destructive">*</span>
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="john.smith@email.com"
            value={personalInfo.email || ""}
            onChange={(e) => handleInputChange("email", e.target.value)}
            className="transition-all duration-200 focus:ring-primary/20"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone" className="text-sm font-medium">
            Phone Number <span className="text-destructive">*</span>
          </Label>
          <Input
            id="phone"
            type="tel"
            placeholder="+1 (555) 123-4567"
            value={personalInfo.phone || ""}
            onChange={(e) => handleInputChange("phone", e.target.value)}
            className="transition-all duration-200 focus:ring-primary/20"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="location" className="text-sm font-medium">
            Location <span className="text-destructive">*</span>
          </Label>
          <Input
            id="location"
            placeholder="New York, NY"
            value={personalInfo.location || ""}
            onChange={(e) => handleInputChange("location", e.target.value)}
            className="transition-all duration-200 focus:ring-primary/20"
          />
          <p className="text-xs text-muted-foreground">
            City, State or City, Country format recommended
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="jobTitle" className="text-sm font-medium">
            Job Title <span className="text-destructive">*</span>
          </Label>
          <Input
            id="jobTitle"
            placeholder="e.g., Full-Stack Developer, Marketing Specialist"
            value={personalInfo.jobTitle || ""}
            onChange={(e) => handleInputChange("jobTitle", e.target.value)}
            className="transition-all duration-200 focus:ring-primary/20"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="tagline" className="text-sm font-medium">
            Short Tagline / Headline (Optional)
          </Label>
          <Input
            id="tagline"
            placeholder="e.g., 5+ Years Experience in Web Development"
            value={personalInfo.tagline || ""}
            onChange={(e) => handleInputChange("tagline", e.target.value)}
            className="transition-all duration-200 focus:ring-primary/20"
          />
          <p className="text-xs text-muted-foreground">
            ATS-friendly headline that summarizes your experience
          </p>
        </div>
      </div>

      {/* Tips Card */}
      <Card className="p-4 bg-primary/5 border-primary/20">
        <h4 className="text-sm font-medium text-primary mb-2">
          💡 Tips for Profile Information
        </h4>
        <ul className="text-xs text-muted-foreground space-y-1">
          <li>• Use a professional profile photo with a clean background</li>
          <li>• Ensure your email sounds professional (avoid nicknames)</li>
          <li>• Include your city and state for local opportunities</li>
          <li>• Add your portfolio website to showcase your work</li>
        </ul>
      </Card>
    </div>
  );
};
