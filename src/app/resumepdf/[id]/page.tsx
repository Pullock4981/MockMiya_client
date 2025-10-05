import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import connectDB from '../../../lib/mongodb';
import Resume, { IResume } from '../../../models/Resume';

// Import all templates
import Template1 from '../../../components/templates/Template1';
import Template2 from '../../../components/templates/Template2';
import Template3 from '../../../components/templates/Template3';
import Template4 from '../../../components/templates/Template4';
import Template5 from '../../../components/templates/Template5';
import ATSTemplate from '../../../components/templates/ATSTemplate';
import PDFDownloadControls from '../PDFDownloadControls';

// Import client component for download controls
// import PDFDownloadControls from './PDFDownloadControls';

interface PageProps {
  params: {
    id: string;
  };
}

const templates: { 
  [key: string]: React.ComponentType<{ resumeData: any }> 
} = {
  'template1': Template1,
  'template2': Template2,
  'template3': Template3,
  'template4': Template4,
  'template5': Template5,
  'ats-template': ATSTemplate
};

export default async function ResumePDF({ params }: PageProps) {
  let resume: IResume | null = null;
  
  try {
    console.log('🔗 ResumePDF: Connecting to database for ID:', params.id);
    await connectDB();
    
    console.log('📥 ResumePDF: Fetching resume data...');
    resume = await Resume.findById(params.id);
    
    if (!resume) {
      console.warn('❌ ResumePDF: Resume not found for ID:', params.id);
      notFound();
    }
    
    console.log('✅ ResumePDF: Resume found:', {
      id: resume._id,
      fullName: resume.fullName,
      template: resume.template
    });
    
  } catch (error) {
    console.error('❌ ResumePDF: Error fetching resume:', error);
    notFound();
  }

  const TemplateComponent = templates[resume.template] || Template1;

  const resumeData = {
    fullName: resume.fullName,
    email: resume.email,
    phone: resume.phone,
    jobTitle: resume.jobTitle,
    role: resume.role,
    summary: resume.summary,
    experience: resume.experience,
    education: resume.education,
    skills: resume.skills,
    profileImage: resume.profileImage
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Download Controls */}
      <PDFDownloadControls />
      
      {/* Resume Content - Optimized for printing with colors */}
      <div className="print:shadow-none print:m-0 print:p-0 print:w-full">
        <TemplateComponent resumeData={resumeData} />
      </div>
      
      {/* Enhanced Print Styles */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @media print {
            body {
              margin: 0 !important;
              padding: 0 !important;
              background: white !important;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            .no-print {
              display: none !important;
            }
            .print-break {
              page-break-after: always !important;
            }
            .print-container {
              box-shadow: none !important;
              margin: 0 !important;
              padding: 0 !important;
              width: 100% !important;
            }
            /* Force colors to print */
            * {
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            /* Ensure background colors print */
            .bg-blue-600, .bg-red-600, .bg-green-600, .bg-purple-600,
            .bg-blue-500, .bg-red-500, .bg-green-500, .bg-purple-500 {
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
          }
          
          @page {
            margin: 0;
            size: A4;
          }
        `
      }} />
      
      {/* External print styles as fallback */}
      <link 
        rel="stylesheet" 
        href="/print-styles.css" 
        media="print" 
      />
    </div>
  );
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  let resume: IResume | null = null;
  
  try {
    console.log('🔗 generateMetadata: Connecting to database...');
    await connectDB();
    
    resume = await Resume.findById(params.id);
    
    if (!resume) {
      console.warn('❌ generateMetadata: Resume not found for ID:', params.id);
      return {
        title: 'Resume Not Found',
        description: 'The requested resume could not be found.'
      };
    }
    
  } catch (error) {
    console.error('❌ generateMetadata: Error fetching resume:', error);
    return {
      title: 'Error - Resume Not Found',
      description: 'There was an error loading the resume.'
    };
  }

  return {
    title: `Resume - ${resume.fullName || 'Professional Resume'}`,
    description: `Professional resume of ${resume.fullName} - ${resume.jobTitle}`,
    openGraph: {
      title: `Resume - ${resume.fullName}`,
      description: `Professional resume of ${resume.fullName}`,
      type: 'website',
    },
  };
}