// components/templates/BasicTemplate.tsx (Fallback)
import { ResumeData } from '@/types/resume';

export default function BasicTemplate({ resumeData }: { resumeData: ResumeData }) {
  return (
    <div className="w-full max-w-4xl mx-auto bg-white p-8 min-h-[800px] font-sans">
      <div className="text-center mb-8 border-b-2 border-gray-300 pb-6">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">{resumeData.fullName}</h1>
        <p className="text-xl text-gray-600 mb-2">{resumeData.jobTitle}</p>
        <div className="flex justify-center space-x-6 text-sm text-gray-500">
          <span>📧 {resumeData.email}</span>
          <span>📱 {resumeData.phone}</span>
        </div>
      </div>
      
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">Professional Summary</h2>
          <p className="text-gray-700 leading-relaxed">{resumeData.summary}</p>
        </div>
        
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">Work Experience</h2>
          <div className="text-gray-700 whitespace-pre-wrap">{resumeData.experience}</div>
        </div>
        
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">Education</h2>
          <p className="text-gray-700">{resumeData.education}</p>
        </div>
        
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">Skills</h2>
          <div className="text-gray-700">
            {resumeData.skills.split(',').map((skill, index) => (
              <span key={index} className="inline-block bg-gray-100 px-3 py-1 rounded mr-2 mb-2 text-sm">
                {skill.trim()}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}