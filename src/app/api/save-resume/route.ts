// app/api/save-resume/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Resume from '@/models/Resume';

export async function POST(request: NextRequest) {
  console.log('🚀 API: /api/save-resume - Request received');
  
  try {
    console.log('🔗 API: Connecting to MongoDB...');
    console.log('🔧 API: MONGODB_URI exists:', !!process.env.MONGODB_URI);
    console.log('🔧 API: MONGODB_URI start:', process.env.MONGODB_URI?.substring(0, 50) + '...');
    
    await connectDB();
    console.log('✅ API: MongoDB connected successfully');
    
    const body = await request.json();
    console.log('📥 API: Request body received:', {
      hasResumeData: !!body.resumeData,
      fullName: body.resumeData?.fullName,
      email: body.resumeData?.email,
      template: body.template
    });
    
    // Validate required fields
    if (!body.resumeData?.fullName || !body.resumeData?.email || !body.resumeData?.jobTitle) {
      console.error('❌ API: Validation failed - Missing required fields');
      return NextResponse.json(
        { error: 'Missing required fields: fullName, email, jobTitle' },
        { status: 400 }
      );
    }

    console.log('💾 API: Creating new Resume document...');
    const resumeData = {
      ...body.resumeData,
      template: body.template,
      mode: body.mode,
      design: body.design,
      createdAt: new Date()
    };

    console.log('📤 API: Saving resume to database...');
    const resume = new Resume(resumeData);
    await resume.save();
    
    console.log('✅ API: Resume saved successfully with ID:', resume._id);
    
    return NextResponse.json({ 
      success: true, 
      id: resume._id.toString(),
      message: 'Resume saved successfully'
    });
    
  } catch (error: any) {
    console.error('❌ API: Error saving resume:', {
      name: error.name,
      message: error.message,
      code: error.code,
      stack: error.stack
    });
    
    return NextResponse.json(
      { error: `Database error: ${error.message}` },
      { status: 500 }
    );
  }
}