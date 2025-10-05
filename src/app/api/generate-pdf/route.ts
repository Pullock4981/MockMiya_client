import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const client = await clientPromise;
    const db = client.db('resume_builder'); // Your database name
    
    // Start a session for transaction
    const session = client.startSession();
    
    try {
      let result;
      
      await session.withTransaction(async () => {
        // 1. Save resume data to MongoDB
        const resumesCollection = db.collection('resumes');
        const resumeData = {
          ...body.resumeData,
          template: body.template,
          mode: body.mode,
          design: body.design,
          status: 'generated' as const,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        
        const resumeResult = await resumesCollection.insertOne(resumeData, { session });
        const resumeId = resumeResult.insertedId;
        
        // 2. Generate PDF (simulate for now - implement your PDF generation logic)
        const generatedId = `resume_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const fileName = `${body.resumeData.fullName.replace(/\s+/g, '_')}_resume_${generatedId}.pdf`;
        
        // 3. Save PDF metadata to MongoDB
        const pdfsCollection = db.collection('pdfs');
        const pdfData = {
          resumeId: resumeId,
          downloadUrl: `/api/download-pdf/${generatedId}`,
          fileName: fileName,
          filePath: `/pdfs/${fileName}`, // Path where PDF is stored
          fileSize: 0, // Will be updated after actual PDF generation
          status: 'completed' as const, // Change to 'processing' if async
          generatedAt: new Date(),
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days expiry
        };
        
        await pdfsCollection.insertOne(pdfData, { session });
        
        result = {
          id: generatedId,
          resumeId: resumeId.toString(),
          message: 'PDF generated and saved successfully',
          status: 'completed'
        };
      });
      
      return NextResponse.json(result);
      
    } finally {
      await session.endSession();
    }
    
  } catch (error) {
    console.error('Error generating PDF:', error);
    return NextResponse.json(
      { error: 'Failed to generate PDF' },
      { status: 500 }
    );
  }
}