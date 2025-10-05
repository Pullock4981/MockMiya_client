import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const client = await clientPromise;
    const db = client.db('resume_builder');
    
    // Find PDF data
    const pdfsCollection = db.collection('pdfs');
    const pdfData = await pdfsCollection.findOne({ 
      $or: [
        { _id: new ObjectId(id) },
        { downloadUrl: `/api/download-pdf/${id}` }
      ]
    });
    
    if (!pdfData) {
      return NextResponse.json(
        { error: 'PDF not found' },
        { status: 404 }
      );
    }
    
    // Find associated resume data
    const resumesCollection = db.collection('resumes');
    const resumeData = await resumesCollection.findOne({ 
      _id: pdfData.resumeId 
    });
    
    const responseData = {
      id: pdfData._id?.toString(),
      resumeId: pdfData.resumeId.toString(),
      downloadUrl: pdfData.downloadUrl,
      fileName: pdfData.fileName,
      fileSize: pdfData.fileSize,
      generatedAt: pdfData.generatedAt,
      status: pdfData.status,
      resumeData: resumeData ? {
        fullName: resumeData.fullName,
        jobTitle: resumeData.jobTitle,
        email: resumeData.email
      } : undefined
    };
    
    return NextResponse.json(responseData);
    
  } catch (error) {
    console.error('Error fetching PDF data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch PDF data' },
      { status: 500 }
    );
  }
}