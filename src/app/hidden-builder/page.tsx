"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Template1 from '../../components/templates/Template1';
import Template2 from '../../components/templates/Template2';
import Template3 from '../../components/templates/Template3';
import Template4 from '../../components/templates/Template4';
// import Template5 from '../../components/templates/Template5';
import ATSTemplate from '../../components/templates/ATSTemplate';
import { ResumeData, Template as TemplateType } from '../../types/resume';
import Template5 from "@/components/templates/Template5";

export default function HiddenResumeBuilder() {
  const [resumeData, setResumeData] = useState<ResumeData>({
    fullName: "",
    email: "",
    phone: "",
    jobTitle: "",
    role: "",
    summary: "",
    experience: "",
    education: "",
    skills: "",
    profileImage: ""
  });

  const [selectedTemplate, setSelectedTemplate] = useState<string>("template1");
  const [mode, setMode] = useState<"ats" | "non-ats">("non-ats");
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const templates: TemplateType[] = [
    {
      id: "template1",
      name: "Modern Sidebar",
      description: "Clean sidebar with profile focus",
      category: "non-ats",
      component: Template1
    },
    {
      id: "template2",
      name: "Creative Split",
      description: "Colorful split layout with cards",
      category: "non-ats",
      component: Template2
    },
    {
      id: "template3",
      name: "Professional Header",
      description: "Bold header with gradient design",
      category: "non-ats",
      component: Template3
    },
    {
      id: "template4",
      name: "Minimalist Card",
      description: "Clean and minimal card layout",
      category: "non-ats",
      component: Template4
    },
    {
      id: "template5",
      name: "Bold Asymmetric",
      description: "Asymmetric layout with bold colors",
      category: "non-ats",
      component: Template5
    },
    {
      id: "ats-template",
      name: "ATS Friendly",
      description: "Simple, clean format for applicant tracking systems",
      category: "ats",
      component: ATSTemplate
    }
  ];

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setResumeData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setResumeData(prev => ({ 
          ...prev, 
          profileImage: event.target?.result as string 
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDownload = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const dataToSave = {
        ...resumeData,
        template: selectedTemplate,
        mode: mode,
        design: {
          layout: templates.find(t => t.id === selectedTemplate)?.name || "Modern Sidebar",
          colors: mode === "ats" ? "professional" : "creative",
          includeProfileImage: !!resumeData.profileImage
        }
      };

      const response = await fetch('/api/save-resume', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSave),
      });

      const result = await response.json();

      if (result.success) {
        router.push(`/resumepdf/${result.id}`);
      } else {
        throw new Error('Failed to save resume');
      }

    } catch (error) {
      console.error('Error:', error);
      alert('Error saving resume. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const CurrentTemplate = templates.find(t => t.id === selectedTemplate)?.component;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Hidden Resume Builder
        </h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Input Form */}
          <div className="lg:col-span-1 bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Resume Data</h2>
            
            <form onSubmit={handleDownload} className="space-y-4">
              {/* Form fields remain the same as before */}
              <div>
                <label className="block text-sm font-medium mb-1">Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  value={resumeData.fullName}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>

              {/* ... other form fields ... */}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                {loading ? "Saving..." : "Save & Generate PDF"}
              </button>
            </form>
          </div>

          {/* Preview */}
          <div className="lg:col-span-2">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-bold mb-4">
                Preview - {templates.find(t => t.id === selectedTemplate)?.name}
              </h2>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 min-h-[800px]">
                {CurrentTemplate && (
                  <CurrentTemplate resumeData={resumeData} />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}