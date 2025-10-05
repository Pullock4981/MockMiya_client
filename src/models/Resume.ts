// models/Resume.ts
import mongoose, { Document, Schema } from 'mongoose';

export interface IResume extends Document {
  fullName: string;
  email: string;
  phone: string;
  jobTitle: string;
  role: string;
  summary: string;
  experience: string[]; // Change to array
  education: string[];  // Change to array
  skills: string[];     // Change to array
  profileImage?: string;
  template: string;
  mode: string;
  design: {
    layout: string;
    colors: string;
    includeProfileImage: boolean;
  };
  createdAt: Date;
}

const resumeSchema = new Schema<IResume>({
  fullName: { 
    type: String, 
    required: [true, 'Full name is required'],
    trim: true
  },
  email: { 
    type: String, 
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true
  },
  phone: { 
    type: String, 
    trim: true 
  },
  jobTitle: { 
    type: String, 
    required: [true, 'Job title is required'],
    trim: true
  },
  role: { 
    type: String, 
    trim: true 
  },
  summary: { 
    type: String, 
    trim: true 
  },
  experience: [{ 
    type: String, 
    trim: true 
  }], // Array of strings
  education: [{ 
    type: String, 
    trim: true 
  }], // Array of strings
  skills: [{ 
    type: String, 
    trim: true 
  }], // Array of strings
  profileImage: { 
    type: String 
  },
  template: { 
    type: String, 
    required: [true, 'Template is required'],
    trim: true
  },
  mode: { 
    type: String, 
    required: [true, 'Mode is required'],
    trim: true
  },
  design: {
    layout: { type: String, trim: true },
    colors: { type: String, trim: true },
    includeProfileImage: { type: Boolean, default: false }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const ResumeModel = mongoose.models.Resume || mongoose.model<IResume>('Resume', resumeSchema);
export default ResumeModel;