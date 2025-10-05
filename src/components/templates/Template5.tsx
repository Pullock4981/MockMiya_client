import { ResumeData } from '@/types/resume';

export default function Template5({ resumeData }: { resumeData: ResumeData }) {
  // Safe skills handling with proper type checking
  const getSkillsArray = (): string[] => {
    if (Array.isArray(resumeData.skills)) {
      return resumeData.skills;
    }
    if (typeof resumeData.skills === 'string') {
      return resumeData.skills.split(',').map(skill => skill.trim()).filter(skill => skill);
    }
    return [];
  };

  const skillsArray = getSkillsArray();

  return (
    <div className="w-full max-w-4xl mx-auto bg-white shadow-2xl rounded-lg overflow-hidden min-h-[800px]">
      <div className="flex">
        {/* Narrow Sidebar */}
        <div className="w-1/5 bg-red-600 text-white p-6">
          {resumeData.profileImage && (
            <img 
              src={resumeData.profileImage} 
              alt="Profile" 
              className="w-20 h-20 rounded-full mx-auto mb-6 border-2 border-white"
            />
          )}
          <div className="space-y-6">
            <div>
              <h4 className="font-bold text-sm mb-2">CONTACT</h4>
              <p className="text-xs">{resumeData.email}</p>
              <p className="text-xs">{resumeData.phone}</p>
            </div>
            <div>
              <h4 className="font-bold text-sm mb-2">SKILLS</h4>
              <div className="space-y-1">
                {skillsArray.slice(0, 5).map((skill, index) => (
                  <p key={index} className="text-xs">{skill}</p>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="w-4/5 p-8">
          <div className="border-b-4 border-red-600 pb-4 mb-6">
            <h1 className="text-4xl font-black text-gray-900 uppercase tracking-tight">{resumeData.fullName}</h1>
            <p className="text-xl text-red-600 font-bold">{resumeData.jobTitle}</p>
          </div>
          
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-3 border-l-4 border-red-600 pl-3">PROFILE</h2>
              <p className="text-gray-700">{resumeData.summary}</p>
            </div>
            
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-3 border-l-4 border-red-600 pl-3">EXPERIENCE</h2>
              <div className="text-gray-700 whitespace-pre-wrap">
                {Array.isArray(resumeData.experience) 
                  ? resumeData.experience.join('\n')
                  : resumeData.experience
                }
              </div>
            </div>
            
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-3 border-l-4 border-red-600 pl-3">EDUCATION</h2>
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