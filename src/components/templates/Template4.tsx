import { ResumeData } from '@/types/resume';

export default function Template4({ resumeData }: { resumeData: ResumeData }) {
  // Safe skills handling
  const skillsArray = Array.isArray(resumeData.skills) 
    ? resumeData.skills 
    : typeof resumeData.skills === 'string' 
      ? resumeData.skills.split(',').map(skill => skill.trim()).filter(skill => skill)
      : [];

  return (
    <div className="w-full max-w-4xl mx-auto bg-gray-50 p-8 min-h-[800px]">
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-light text-gray-800 mb-2">{resumeData.fullName}</h1>
            <p className="text-gray-500 uppercase tracking-widest text-sm">{resumeData.jobTitle}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <h3 className="text-sm uppercase tracking-widest text-gray-500 mb-3">Contact</h3>
                <p className="text-gray-700">{resumeData.email}</p>
                <p className="text-gray-700">{resumeData.phone}</p>
              </div>
              
              <div>
                <h3 className="text-sm uppercase tracking-widest text-gray-500 mb-3">Skills</h3>
                <div className="space-y-2">
                  {skillsArray.map((skill, index) => (
                    <div key={index} className="border-l-2 border-gray-300 pl-3">
                      <span className="text-gray-700">{skill}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-sm uppercase tracking-widest text-gray-500 mb-3">About</h3>
                <p className="text-gray-700 leading-relaxed">{resumeData.summary}</p>
              </div>
              
              <div>
                <h3 className="text-sm uppercase tracking-widest text-gray-500 mb-3">Experience</h3>
                <div className="text-gray-700 whitespace-pre-wrap text-sm">
                  {Array.isArray(resumeData.experience) 
                    ? resumeData.experience.join('\n')
                    : resumeData.experience
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}