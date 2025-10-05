import { ResumeData } from '@/types/resume';

export default function Template3({ resumeData }: { resumeData: ResumeData }) {
  // Safe skills handling
  const skillsArray = Array.isArray(resumeData.skills) 
    ? resumeData.skills 
    : typeof resumeData.skills === 'string' 
      ? resumeData.skills.split(',').map(skill => skill.trim()).filter(skill => skill)
      : [];

  return (
    <div className="w-full max-w-4xl mx-auto bg-white shadow-2xl rounded-lg overflow-hidden min-h-[800px]">
      {/* Header */}
      <div className="bg-green-600 text-white p-8 text-center">
        <h1 className="text-4xl font-bold mb-2">{resumeData.fullName}</h1>
        <p className="text-xl text-green-100">{resumeData.jobTitle}</p>
        <div className="flex justify-center space-x-6 mt-4 text-sm">
          <span>📧 {resumeData.email}</span>
          <span>📱 {resumeData.phone}</span>
        </div>
      </div>
      
      {/* Content */}
      <div className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                PROFESSIONAL SUMMARY
              </h2>
              <p className="text-gray-700 leading-relaxed">{resumeData.summary}</p>
            </div>
            
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                WORK EXPERIENCE
              </h2>
              <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {Array.isArray(resumeData.experience) 
                  ? resumeData.experience.join('\n')
                  : resumeData.experience
                }
              </div>
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-3">SKILLS</h3>
              <div className="space-y-2">
                {skillsArray.map((skill, index) => (
                  <div key={index} className="bg-white px-3 py-2 rounded border-l-4 border-green-500">
                    {skill}
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-3">EDUCATION</h3>
              <p className="text-gray-700">
                {Array.isArray(resumeData.education) 
                  ? resumeData.education.join('\n')
                  : resumeData.education
                }
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}