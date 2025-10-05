import { ResumeData } from '@/types/resume';

export default function ATSTemplate({ resumeData }: { resumeData: ResumeData }) {
  // Safe skills handling
  const skillsArray = Array.isArray(resumeData.skills) 
    ? resumeData.skills 
    : typeof resumeData.skills === 'string' 
      ? resumeData.skills.split(',').map(skill => skill.trim()).filter(skill => skill)
      : [];

  return (
    <div className="w-full max-w-4xl mx-auto bg-white p-8 min-h-[800px] font-sans">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{resumeData.fullName}</h1>
        <div className="flex justify-center space-x-4 text-sm text-gray-600 mb-2">
          <span>{resumeData.email}</span>
          <span>•</span>
          <span>{resumeData.phone}</span>
        </div>
        <p className="text-lg text-gray-700">{resumeData.jobTitle}</p>
      </div>
      
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-gray-800 mb-3 border-b border-gray-300 pb-2">PROFESSIONAL SUMMARY</h2>
          <p className="text-gray-700">{resumeData.summary}</p>
        </div>
        
        <div>
          <h2 className="text-xl font-bold text-gray-800 mb-3 border-b border-gray-300 pb-2">WORK EXPERIENCE</h2>
          <div className="text-gray-700 whitespace-pre-wrap">
            {Array.isArray(resumeData.experience) 
              ? resumeData.experience.join('\n')
              : resumeData.experience
            }
          </div>
        </div>
        
        <div>
          <h2 className="text-xl font-bold text-gray-800 mb-3 border-b border-gray-300 pb-2">EDUCATION</h2>
          <p className="text-gray-700">
            {Array.isArray(resumeData.education) 
              ? resumeData.education.join('\n')
              : resumeData.education
            }
          </p>
        </div>
        
        <div>
          <h2 className="text-xl font-bold text-gray-800 mb-3 border-b border-gray-300 pb-2">SKILLS</h2>
          <div className="text-gray-700">
            {skillsArray.map((skill, index) => (
              <span key={index} className="inline-block bg-gray-100 px-3 py-1 rounded mr-2 mb-2 text-sm">
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}