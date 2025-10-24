'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/uis/tabs';
import { 
  User, Mail, Phone, MapPin, Briefcase, GraduationCap, 
  Edit, Save, Upload, Award, Calendar, LogOut,
  Github, Linkedin, Globe, Twitter, Shield
} from 'lucide-react';

interface UserProfile {
  displayName: string;
  email: string;
  phone?: string;
  location?: string;
  jobTitle?: string;
  company?: string;
  bio?: string;
  skills: string[];
  education?: Education[];
  experience?: Experience[];
  socialLinks?: SocialLinks;
  photoURL?: string;
}

interface Education {
  id: string;
  school: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  current: boolean;
}

interface Experience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

interface SocialLinks {
  github?: string;
  linkedin?: string;
  twitter?: string;
  portfolio?: string;
}

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<UserProfile>({
    displayName: '',
    email: '',
    phone: '',
    location: '',
    jobTitle: '',
    company: '',
    bio: '',
    skills: [],
    socialLinks: {
      github: '',
      linkedin: '',
      twitter: '',
      portfolio: ''
    }
  });

  const [newSkill, setNewSkill] = useState('');

  const handleInputChange = (field: string, value: string) => {
    setProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSocialLinkChange = (platform: keyof SocialLinks, value: string) => {
    setProfile(prev => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [platform]: value
      }
    }));
  };

  const handleAddSkill = () => {
    if (newSkill.trim() && !profile.skills.includes(newSkill.trim())) {
      setProfile(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }));
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setProfile(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  const handleSave = () => {
    // Add your save logic here
    console.log('Saving profile:', profile);
    setIsEditing(false);
  };

  const handleCancel = () => {
    // Add cancel logic or reset form
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">Profile</h1>
          <p className="text-muted-foreground mt-2">
            Manage your personal information and career details
          </p>
        </div>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <Button 
                onClick={handleSave}
                className="flex items-center gap-2"
              >
                <Save className="h-4 w-4" />
                Save Changes
              </Button>
              <Button 
                variant="outline"
                onClick={handleCancel}
              >
                Cancel
              </Button>
            </>
          ) : (
            <Button 
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2"
            >
              <Edit className="h-4 w-4" />
              Edit Profile
            </Button>
          )}
          <Button 
            variant="outline" 
            className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>

      <Tabs defaultValue="personal" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="personal">Personal Info</TabsTrigger>
          <TabsTrigger value="professional">Professional</TabsTrigger>
          <TabsTrigger value="social">Social Links</TabsTrigger>
        </TabsList>

        {/* Personal Information Tab */}
        <TabsContent value="personal" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Profile Picture */}
            <Card>
              <CardHeader>
                <CardTitle>Profile Picture</CardTitle>
                <CardDescription>
                  Update your profile photo
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col items-center space-y-4">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={profile.photoURL} />
                    <AvatarFallback className="text-lg">
                      <User />
                    </AvatarFallback>
                  </Avatar>
                  {isEditing && (
                    <div className="space-y-2">
                      <Input
                        type="file"
                        accept="image/*"
                        className="w-full"
                        onChange={(e) => {
                          // Handle file upload logic here
                          console.log('File selected:', e.target.files?.[0]);
                        }}
                      />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Basic Information */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>
                  Your personal details and contact information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="displayName">Full Name</Label>
                    <Input
                      id="displayName"
                      value={profile.displayName || "No Data Here"}
                      placeholder="Your full name"
                      onChange={(e) => handleInputChange('displayName', e.target.value)}
                      readOnly={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profile.email || "No Data Here"}
                      className="bg-muted"
                      readOnly
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={profile.phone || "No Data Here"}
                      placeholder="+1 (555) 123-4567"
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      readOnly={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={profile.location || "No Data Here"}
                      placeholder="City, Country"
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      readOnly={!isEditing}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={profile.bio || "No Data Here"}
                    placeholder="Tell us about yourself..."
                    rows={4}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    readOnly={!isEditing}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Professional Information Tab */}
        <TabsContent value="professional" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Job Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5" />
                  Current Position
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="jobTitle">Job Title</Label>
                  <Input
                    id="jobTitle"
                    value={profile.jobTitle || "No Data Here"}
                    placeholder="Software Engineer"
                    onChange={(e) => handleInputChange('jobTitle', e.target.value)}
                    readOnly={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company">Company</Label>
                  <Input
                    id="company"
                    value={profile.company || "No Data Here"}
                    placeholder="Company Name"
                    onChange={(e) => handleInputChange('company', e.target.value)}
                    readOnly={!isEditing}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Skills */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Skills
                </CardTitle>
                <CardDescription>
                  Add your technical and professional skills
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {isEditing && (
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add a skill"
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          handleAddSkill();
                        }
                      }}
                    />
                    <Button variant="outline" onClick={handleAddSkill}>
                      Add
                    </Button>
                  </div>
                )}
                <div className="flex flex-wrap gap-2">
                  {profile.skills.length > 0 ? (
                    profile.skills.map((skill, index) => (
                      <Badge key={index} variant="secondary" className="px-3 py-1">
                        {skill}
                        {isEditing && (
                          <button
                            onClick={() => handleRemoveSkill(skill)}
                            className="ml-2 text-xs text-red-500 hover:text-red-700"
                          >
                            ×
                          </button>
                        )}
                      </Badge>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">No skills added yet</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Social Links Tab */}
        <TabsContent value="social" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Social Links</CardTitle>
              <CardDescription>
                Add your professional social media profiles
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="github" className="flex items-center gap-2">
                    <Github className="h-4 w-4" />
                    GitHub
                  </Label>
                  <Input
                    id="github"
                    value={profile.socialLinks?.github || "No Data Here"}
                    placeholder="https://github.com/username"
                    onChange={(e) => handleSocialLinkChange('github', e.target.value)}
                    readOnly={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="linkedin" className="flex items-center gap-2">
                    <Linkedin className="h-4 w-4" />
                    LinkedIn
                  </Label>
                  <Input
                    id="linkedin"
                    value={profile.socialLinks?.linkedin || "No Data Here"}
                    placeholder="https://linkedin.com/in/username"
                    onChange={(e) => handleSocialLinkChange('linkedin', e.target.value)}
                    readOnly={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="twitter" className="flex items-center gap-2">
                    <Twitter className="h-4 w-4" />
                    Twitter
                  </Label>
                  <Input
                    id="twitter"
                    value={profile.socialLinks?.twitter || "No Data Here"}
                    placeholder="https://twitter.com/username"
                    onChange={(e) => handleSocialLinkChange('twitter', e.target.value)}
                    readOnly={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="portfolio" className="flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    Portfolio
                  </Label>
                  <Input
                    id="portfolio"
                    value={profile.socialLinks?.portfolio || "No Data Here"}
                    placeholder="https://yourportfolio.com"
                    onChange={(e) => handleSocialLinkChange('portfolio', e.target.value)}
                    readOnly={!isEditing}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}