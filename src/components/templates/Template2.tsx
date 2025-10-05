import { ResumeData } from '@/types/resume';

export default function Template2({ resumeData }: { resumeData: ResumeData }) {
  // Safe skills handling
  const skillsArray = Array.isArray(resumeData.skills) 
    ? resumeData.skills 
    : typeof resumeData.skills === 'string' 
      ? resumeData.skills.split(',').map(skill => skill.trim()).filter(skill => skill)
      : [];

  return (
    <div className="w-full max-w-4xl mx-auto bg-purple-50 shadow-2xl rounded-xl overflow-hidden min-h-[800px]">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
        {/* Left Column */}
        <div className="space-y-8">
          <div className="text-center">
            {resumeData.profileImage && (
              <img 
                src={resumeData.profileImage} 
                alt="Profile" 
                className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-white shadow-lg"
              />
            )}
            <h1 className="text-3xl font-bold text-gray-800 mb-2">{resumeData.fullName}</h1>
            <p className="text-purple-600 font-semibold">{resumeData.jobTitle}</p>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-md">
            <h3 className="text-lg font-bold text-purple-700 mb-3">ABOUT ME</h3>
            <p className="text-gray-700 text-sm">{resumeData.summary}</p>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-md">
            <h3 className="text-lg font-bold text-purple-700 mb-3">EDUCATION</h3>
            <p className="text-gray-700 text-sm">
              {Array.isArray(resumeData.education) 
                ? resumeData.education.join('\n')
                : resumeData.education
              }
            </p>
          </div>
        </div>
        
        {/* Right Column */}
        <div className="space-y-8">
          <div className="bg-white rounded-lg p-6 shadow-md">
            <h3 className="text-lg font-bold text-purple-700 mb-4 border-b border-purple-200 pb-2">EXPERIENCE</h3>
            <div className="text-gray-700 text-sm whitespace-pre-wrap">
              {Array.isArray(resumeData.experience) 
                ? resumeData.experience.join('\n')
                : resumeData.experience
              }
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-md">
            <h3 className="text-lg font-bold text-purple-700 mb-3">SKILLS</h3>
            <div className="grid grid-cols-2 gap-2">
              {skillsArray.map((skill, index) => (
                <div key={index} className="flex items-center">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                  <span className="text-gray-700 text-sm">{skill}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}