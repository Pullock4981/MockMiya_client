'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useSession } from 'next-auth/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { 
  User, Mail, Phone, MapPin, Briefcase, GraduationCap, Save, Edit3,
  Shield, Calendar, CheckCircle2, Loader2, Eye, EyeOff, Crown
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import toast from 'react-hot-toast';

// Form validation schema
const profileFormSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  phone: z.string().optional(),
  location: z.string().optional(),
  title: z.string().min(2, { message: 'Title must be at least 2 characters.' }),
  company: z.string().optional(),
  education: z.string().optional(),
  experience: z.string().optional(),
  bio: z.string().max(500, { message: 'Bio must not exceed 500 characters.' }).optional(),
  skills: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export default function Profile() {
  const { data: session, status, update } = useSession();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showEmail, setShowEmail] = useState(false);
  const [userData, setUserData] = useState<any>(null);

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      if (status === 'authenticated' && session?.user?.email) {
        try {
          const response = await fetch(`/api/user/profile?email=${encodeURIComponent(session.user.email)}`);
          if (response.ok) {
            const data = await response.json();
            setUserData(data);
          } else {
            console.error('Failed to fetch user data');
            toast.error('Failed to load profile data');
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          toast.error('Failed to load profile data');
        }
      }
    };

    fetchUserData();
  }, [session, status]);

  // Default form values
  const defaultValues: Partial<ProfileFormValues> = {
    name: userData?.name || session?.user?.name || '',
    phone: userData?.profile?.phone || '',
    location: userData?.profile?.location || '',
    title: userData?.profile?.title || '',
    company: userData?.profile?.company || '',
    education: userData?.profile?.education || '',
    experience: userData?.profile?.experience || '',
    bio: userData?.profile?.bio || '',
    skills: userData?.profile?.skills?.join(', ') || '',
  };

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues,
    mode: 'onChange',
  });

  // Reset form when user data changes
  useEffect(() => {
    if (userData) {
      form.reset({
        name: userData.name || '',
        phone: userData.profile?.phone || '',
        location: userData.profile?.location || '',
        title: userData.profile?.title || '',
        company: userData.profile?.company || '',
        education: userData.profile?.education || '',
        experience: userData.profile?.experience || '',
        bio: userData.profile?.bio || '',
        skills: userData.profile?.skills?.join(', ') || '',
      });
    }
  }, [userData, form]);

  const onSubmit = async (data: ProfileFormValues) => {
    if (!session?.user?.email) {
      toast.error('No session found');
      return;
    }
    
    setIsSaving(true);
    
    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: session.user.email,
          name: data.name,
          profile: {
            phone: data.phone,
            location: data.location,
            title: data.title,
            company: data.company,
            education: data.education,
            experience: data.experience,
            bio: data.bio,
            skills: data.skills ? data.skills.split(',').map((skill: string) => skill.trim()).filter(Boolean) : [],
          }
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update profile');
      }

      const updatedUser = await response.json();
      setUserData(updatedUser);
      
      // Update session
      await update({
        ...session,
        user: {
          ...session.user,
          name: data.name,
        }
      });

      setIsEditing(false);
      toast.success('Profile updated successfully! 🎉');
      
    } catch (error: any) {
      console.error('Failed to update profile:', error);
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    form.reset(defaultValues);
    setIsEditing(false);
    toast('Changes discarded', { 
      icon: '↶',
      style: {
        background: '#fef3c7',
        color: '#92400e',
      }
    });
  };

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-green-500" />
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <p className="text-muted-foreground">Please log in to view your profile.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-green-800">Professional Profile</h1>
          <p className="text-muted-foreground mt-2">
            Manage your professional identity and career information
          </p>
        </div>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={handleCancel} disabled={isSaving}>
                Cancel
              </Button>
              <Button 
                onClick={form.handleSubmit(onSubmit)} 
                disabled={isSaving || !form.formState.isValid}
                className="bg-green-600 hover:bg-green-700"
              >
                {isSaving ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                )}
                {isSaving ? 'Saving...' : 'Save Changes'}
              </Button>
            </>
          ) : (
            <Button 
              onClick={() => setIsEditing(true)}
              className="bg-green-600 hover:bg-green-700"
            >
              <Edit3 className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          )}
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Profile Overview Card */}
          <Card className="border-green-200">
            <CardHeader className="bg-green-50">
              <CardTitle className="flex items-center text-green-800">
                <User className="h-5 w-5 mr-2" />
                Profile Overview
              </CardTitle>
              <CardDescription>
                Your professional identity and contact information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              {/* Avatar & Basic Info */}
              <div className="flex flex-col sm:flex-row items-start gap-6">
                <div className="flex flex-col items-center gap-4">
                  <Avatar className="h-24 w-24 border-4 border-green-100 shadow-lg">
                    <AvatarImage src={userData?.profile?.avatar} />
                    <AvatarFallback className="text-xl bg-gradient-to-br from-green-500 to-green-600 text-white">
                      {userData?.name?.split(' ').map((n: string) => n[0]).join('') || session.user?.name?.[0] || session.user?.email?.[0].toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </div>
                
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field  }) => (
                      <FormItem>
                        <FormLabel className="flex items-center text-sm font-semibold">
                          <User className="h-4 w-4 mr-2 text-green-600" />
                          Full Name *
                        </FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="John Doe" 
                            {...field} 
                            disabled={!isEditing}
                            className="border-green-200 focus:border-green-500"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Email Field - Read Only */}
                  <FormItem>
                    <FormLabel className="flex items-center text-sm font-semibold">
                      <Mail className="h-4 w-4 mr-2 text-green-600" />
                      Email Address
                    </FormLabel>
                    <div className="relative">
                      <Input 
                        type={showEmail ? "text" : "password"}
                        value={session.user?.email || ''}
                        disabled
                        className="pr-10 font-mono text-sm border-green-200"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-green-600"
                        onClick={() => setShowEmail(!showEmail)}
                      >
                        {showEmail ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    <FormDescription className="text-xs">
                      Email cannot be changed for security reasons
                    </FormDescription>
                  </FormItem>

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center text-sm font-semibold">
                          <Phone className="h-4 w-4 mr-2 text-green-600" />
                          Phone Number
                        </FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="+1 (555) 123-4567" 
                            {...field} 
                            disabled={!isEditing}
                            className="border-green-200 focus:border-green-500"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center text-sm font-semibold">
                          <MapPin className="h-4 w-4 mr-2 text-green-600" />
                          Location
                        </FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="San Francisco, CA" 
                            {...field} 
                            disabled={!isEditing}
                            className="border-green-200 focus:border-green-500"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Professional Details */}
          <Card className="border-green-200">
            <CardHeader className="bg-green-50">
              <CardTitle className="flex items-center text-green-800">
                <Briefcase className="h-5 w-5 mr-2" />
                Professional Details
              </CardTitle>
              <CardDescription>
                Your career information and professional background
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold">Job Title *</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Senior Software Engineer" 
                          {...field} 
                          disabled={!isEditing}
                          className="border-green-200 focus:border-green-500"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="company"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold">Company</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Tech Corporation Inc." 
                          {...field} 
                          disabled={!isEditing}
                          className="border-green-200 focus:border-green-500"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="education"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center text-sm font-semibold">
                        <GraduationCap className="h-4 w-4 mr-2 text-green-600" />
                        Education
                      </FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Bachelor of Science in Computer Science" 
                          {...field} 
                          disabled={!isEditing}
                          className="border-green-200 focus:border-green-500"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="experience"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center text-sm font-semibold">
                        <Calendar className="h-4 w-4 mr-2 text-green-600" />
                        Experience
                      </FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="5+ years in software development" 
                          {...field} 
                          disabled={!isEditing}
                          className="border-green-200 focus:border-green-500"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold">Professional Bio</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe your professional background, skills, and career aspirations..."
                        className="min-h-32 resize-none border-green-200 focus:border-green-500"
                        {...field}
                        disabled={!isEditing}
                      />
                    </FormControl>
                    <FormDescription>
                      {field.value?.length || 0}/500 characters
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="skills"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold">Skills & Technologies</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="JavaScript, React, Node.js, TypeScript, Python, AWS, Docker..."
                        className="border-green-200 focus:border-green-500"
                        {...field}
                        disabled={!isEditing}
                      />
                    </FormControl>
                    <FormDescription>
                      Separate skills with commas
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Account Information */}
          <Card className="border-green-200">
            <CardHeader className="bg-green-50">
              <CardTitle className="flex items-center text-green-800">
                <Shield className="h-5 w-5 mr-2" />
                Account Information
              </CardTitle>
              <CardDescription>
                Your account details and security settings
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-green-50 rounded-lg">
                <div className="space-y-2">
                  <label className="text-sm font-semibold flex items-center">
                    <User className="h-4 w-4 mr-2 text-green-600" />
                    User ID
                  </label>
                  <Input value={userData?._id || userData?.id || 'N/A'} disabled className="font-mono text-xs border-green-200" />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-semibold">Account Role</label>
                  <Input value={userData?.role || 'user'} disabled className="capitalize border-green-200" />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-semibold flex items-center">
                    <Crown className="h-4 w-4 mr-2 text-green-600" />
                    Membership Type
                  </label>
                  <Input value={userData?.membershipType || "Free Tier"} disabled className="capitalize border-green-200" />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-semibold">Verification Status</label>
                  <Input 
                    value={userData?.isVerified ? "Verified" : "Pending Verification"} 
                    disabled 
                    className="border-green-200"
                  />
                </div>
              </div>

              <Separator className="my-6" />

              <div className="flex flex-col sm:flex-row gap-4">
                <Button variant="outline" className="flex-1 border-green-200 text-green-700 hover:bg-green-50">
                  Change Password
                </Button>
                <Button variant="outline" className="flex-1 border-green-200 text-green-700 hover:bg-green-50">
                  Two-Factor Authentication
                </Button>
                <Button variant="outline" className="flex-1 text-red-600 border-red-200 hover:text-red-700 hover:bg-red-50">
                  Delete Account
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </Form>
    </div>
  );
}