import { ResumeData } from '@/types/resume';

export default function Template1({ resumeData }: { resumeData: ResumeData }) {
  // Safe skills handling - handle both string and array
  const skillsArray = Array.isArray(resumeData.skills) 
    ? resumeData.skills 
    : typeof resumeData.skills === 'string' 
      ? resumeData.skills.split(',').map(skill => skill.trim()).filter(skill => skill)
      : [];

  return (
    <div className="w-full max-w-4xl mx-auto bg-white shadow-2xl rounded-lg overflow-hidden min-h-[800px]">
      <div className="flex flex-col md:flex-row">
        {/* Sidebar */}
        <div className="bg-blue-600 text-white p-8 md:w-2/5">
          <div className="text-center mb-8">
            {resumeData.profileImage && (
              <img 
                src={resumeData.profileImage} 
                alt="Profile" 
                className="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-white shadow-lg"
              />
            )}
            <h1 className="text-2xl font-bold mb-2">{resumeData.fullName}</h1>
            <p className="text-blue-100">{resumeData.jobTitle}</p>
          </div>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-3 border-b border-blue-400 pb-2">CONTACT</h3>
              <div className="space-y-2 text-sm">
                <p>📧 {resumeData.email}</p>
                <p>📱 {resumeData.phone}</p>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-3 border-b border-blue-400 pb-2">SKILLS</h3>
              <div className="flex flex-wrap gap-2">
                {skillsArray.map((skill, index) => (
                  <span key={index} className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="p-8 md:w-3/5">
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4 border-b-2 border-blue-600 pb-2">PROFILE</h2>
            <p className="text-gray-700">{resumeData.summary}</p>
          </div>
          
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4 border-b-2 border-blue-600 pb-2">EXPERIENCE</h2>
            <div className="text-gray-700 whitespace-pre-wrap">
              {Array.isArray(resumeData.experience) 
                ? resumeData.experience.join('\n')
                : resumeData.experience
              }
            </div>
          </div>
          
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-4 border-b-2 border-blue-600 pb-2">EDUCATION</h2>
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
  );
}