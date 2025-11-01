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
  User, Mail, Phone, MapPin, Edit3,
  CheckCircle2, Loader2, Eye, EyeOff
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import toast from 'react-hot-toast';

// Define proper interfaces
interface UserProfile {
  phone?: string;
  location?: string;
  title?: string;
  company?: string;
  education?: string;
  experience?: string;
  bio?: string;
  skills?: string[];
  avatar?: string;
}

interface UserData {
  _id: string;
  id?: string;
  name: string;
  email: string;
  role: string;
  membershipType: string;
  isVerified: boolean;
  profile?: UserProfile;
  createdAt?: string;
  updatedAt?: string;
}

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
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      if (status === 'authenticated' && session?.user?.email) {
        try {
          setIsLoading(true);
          const response = await fetch(`/api/user/profile?email=${encodeURIComponent(session.user.email)}`);
          
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
          }
          
          const data: UserData = await response.json();
          setUserData(data);
        } catch (error) {
          console.error('Error fetching user data:', error);
          const errorMessage = error instanceof Error ? error.message : 'Failed to load profile data';
          toast.error(errorMessage);
        } finally {
          setIsLoading(false);
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
    if (userData && !isEditing) {
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
  }, [userData, form, isEditing]);

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
            phone: data.phone || '',
            location: data.location || '',
            title: data.title || '',
            company: data.company || '',
            education: data.education || '',
            experience: data.experience || '',
            bio: data.bio || '',
            skills: data.skills ? data.skills.split(',').map((skill: string) => skill.trim()).filter(Boolean) : [],
          }
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to update profile. Status: ${response.status}`);
      }

      const updatedUser: UserData = await response.json();
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
      
    } catch (error: unknown) {
      console.error('Failed to update profile:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to update profile';
      toast.error(errorMessage);
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

  // Get user initials for avatar
  const getUserInitials = (name: string): string => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  if (status === 'loading' || isLoading) {
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
          <h1 className="text-3xl font-bold ">Professional Profile</h1>
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
                className=""
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
              className=""
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
          <Card className="">
            <CardHeader className="">
              <CardTitle className="flex items-center ">
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
                  <Avatar className="h-12 w-12 md:w-24 md:h-24 border-2 shadow-lg">
                    <AvatarImage src={userData?.profile?.avatar} alt={userData?.name || 'User avatar'} />
                    <AvatarFallback className="text-xl bg-primary text-black">
                      {getUserInitials(userData?.name || session.user?.name || session.user?.email || 'U')}
                    </AvatarFallback>
                  </Avatar>
                </div>
                
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center text-sm font-semibold">
                          <User className="h-4 w-4 mr-2 " />
                          Full Name *
                        </FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="John Doe" 
                            {...field} 
                            disabled={!isEditing}
                            className=""
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Email Field - Read Only */}
                  <FormItem>
                    <FormLabel className="flex items-center text-sm font-semibold">
                      <Mail className="h-4 w-4 mr-2" />
                      Email Address
                    </FormLabel>
                    <div className="relative">
                      <Input 
                        type={showEmail ? "text" : "password"}
                        value={session.user?.email || ''}
                        disabled
                        className="pr-10 font-mono text-sm"
                      />
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 cursor-pointer"
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
                          <Phone className="h-4 w-4 mr-2 " />
                          Phone Number
                        </FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="+1 (555) 123-4567" 
                            {...field} 
                            disabled={!isEditing}
                            className=""
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
                          <MapPin className="h-4 w-4 mr-2" />
                          Location
                        </FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="San Francisco, CA" 
                            {...field} 
                            disabled={!isEditing}
                            className=" "
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
          <Card className="">
            <CardHeader className="">
              <CardTitle className="flex items-center ">
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
                          className=""
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
                          className=""
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="education"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold">Education</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Bachelor of Science in Computer Science" 
                        {...field} 
                        disabled={!isEditing}
                        className=""
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
                    <FormLabel className="text-sm font-semibold">Experience</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="5+ years in software development" 
                        {...field} 
                        disabled={!isEditing}
                        className=""
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold">Professional Bio</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe your professional background, skills, and career aspirations..."
                        className="min-h-32 resize-none"
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
                        className=""
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
          <Card className="">
            <CardHeader className="">
              <CardTitle className="flex items-center ">
                Account Information
              </CardTitle>
              <CardDescription>
                Your account details and security settings
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4  rounded-lg">
                <div className="space-y-2">
                  <label className="text-sm font-semibold flex items-center">
                    <User className="h-4 w-4 mr-2 " />
                    User ID
                  </label>
                  <Input value={userData?._id || userData?.id || 'N/A'} disabled className="font-mono text-xs " />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-semibold">Account Role</label>
                  <Input value={userData?.role || 'user'} disabled className="capitalize " />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-semibold">Membership Type</label>
                  <Input value={userData?.membershipType || "Free Tier"} disabled className="capitalize " />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-semibold">Verification Status</label>
                  <Input 
                    value={userData?.isVerified ? "Verified" : "Pending Verification"} 
                    disabled 
                    className=""
                  />
                </div>
              </div>

              <Separator className="my-6" />

              <div className="flex flex-col sm:flex-row gap-4">
                <Button variant="outline" className="flex-1  ">
                  Change Password
                </Button>
                <Button variant="outline" className="flex-1  ">
                  Two-Factor Authentication
                </Button>
                <Button variant="outline" className="flex-1">
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
