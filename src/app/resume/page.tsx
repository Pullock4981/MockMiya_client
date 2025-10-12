// // src/app/resume/page.tsx
// "use client";

// import React, { useState, useEffect } from "react";
// import { ResumeProvider } from "@/context/ResumeContext/ResumeProvider";
// import PrivateRoute from "@/app/Routes/PrivateRoute";

// import { Button } from "@/components/ui/button";
// import { Card } from "@/components/ui/card";
// import { Eye, Edit3, Menu, X, Download } from "lucide-react";
// import { ResumeForm } from "@/components/forms/ResumeForms/ResumeForm";
// import ResumePreview from "@/components/resumePreview/ResumePreview";
// import { exportResumeHandler } from "@/utils/exportResume";
// import { ResumeNavbar } from "@/components/layout/ResumeNavbar";
// import { useRouter } from "next/navigation";

// const ResumePage = () => {
//   const [isMobilePreviewMode, setIsMobilePreviewMode] = useState(false);
//   const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

//   const [draftId, setDraftId] = useState<string | null>(null);
//   const router = useRouter();

//   useEffect(() => {
//     // check localStorage for any draft id
//     if (typeof window !== "undefined") {
//       const stored = localStorage.getItem("resume_draft_id");
//       if (stored) setDraftId(stored);
//     }
//   }, []);

//   const handleContinueDraft = () => {
//     if (!draftId) return;
//     router.push(`/resume/${draftId}`);
//   };

//   const handleStartNew = () => {
//     // clear any draft data in localStorage and reload (start fresh)
//     if (typeof window !== "undefined") {
//       localStorage.removeItem("resume_draft_id");
//       localStorage.removeItem("resume_currentStep");
//     }
//     // Force re-mounting of the provider/form by simply reloading the page to /resume
//     router.replace("/resume");
//   };

//   return (
//     <PrivateRoute>
//       <ResumeProvider>
//         <div className="min-h-screen bg-gradient-to-br from-background to-muted">
//           {/* Mobile Header */}
//           <div className="lg:hidden flex items-center justify-between p-4 bg-card border-b border-border sticky top-0 z-50">
//             <div className="flex items-center gap-3">
//               <Button
//                 variant="ghost"
//                 size="sm"
//                 onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
//               >
//                 {isMobileSidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
//               </Button>
//               <h1 className="text-lg font-semibold text-foreground">Resume Builder</h1>
//             </div>

//             <div className="flex gap-2">
//               <Button
//                 variant={isMobilePreviewMode ? "secondary" : "default"}
//                 size="sm"
//                 onClick={() => setIsMobilePreviewMode(!isMobilePreviewMode)}
//                 className="flex items-center gap-2"
//               >
//                 {isMobilePreviewMode ? (
//                   <>
//                     <Edit3 className="h-4 w-4" /> Edit
//                   </>
//                 ) : (
//                   <>
//                     <Eye className="h-4 w-4" /> Preview
//                   </>
//                 )}
//               </Button>

//               <Button
//                 variant="default"
//                 size="sm"
//                 onClick={exportResumeHandler}
//                 className="flex items-center gap-2"
//               >
//                 <Download className="h-4 w-4" /> Export PDF
//               </Button>
//             </div>
//           </div>

//           {/* Draft Banner (if any) */}
//           {draftId && (
//             <div className="p-4 sticky top-16 z-40 bg-card/95 border-b border-border">
//               <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
//                 <div className="text-sm text-muted-foreground">
//                   You have a draft resume saved. Continue editing or start a new one.
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <Button size="sm" onClick={handleContinueDraft}>
//                     Continue draft
//                   </Button>
//                   <Button variant="ghost" size="sm" onClick={handleStartNew}>
//                     Start new
//                   </Button>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* Main Layout */}
//           <div className="flex flex-col lg:flex-row h-screen">
//             {/* Form Panel */}
//             <div
//               className={`
//                 flex-1 lg:flex-none lg:w-2/5 border-r border-border flex flex-col
//                 ${isMobilePreviewMode ? "hidden" : "flex"}
//                 ${isMobileSidebarOpen ? "flex" : "hidden lg:flex"}
//               `}
//             >
//               <ResumeForm />
//             </div>

//             {/* Preview Panel */}
//             <div
//               className={`
//                 flex-1 lg:flex-none lg:w-3/5 flex flex-col
//                 ${isMobilePreviewMode ? "flex" : "hidden lg:flex"}
//               `}
//             >
//               <Card className="h-full overflow-y-auto border-0 shadow-none lg:rounded-none">
//                 <div className="sticky -top-8 bg-card/95 backdrop-blur-sm p-4 z-10">
//                   <ResumeNavbar />
//                 </div>
//                 <div className="p-6 border m-4 rounded-lg">
//                   <ResumePreview />
//                 </div>
//               </Card>
//             </div>
//           </div>

//           {/* Mobile Backdrop */}
//           {isMobileSidebarOpen && (
//             <div
//               className="lg:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
//               onClick={() => setIsMobileSidebarOpen(false)}
//             />
//           )}
//         </div>
//       </ResumeProvider>
//     </PrivateRoute>
//   );
// };

// export default ResumePage;




// src/app/resume/page.tsx








"use client";

import React, { useState, useEffect } from "react";
import { ResumeProvider } from "@/context/ResumeContext/ResumeProvider";
import PrivateRoute from "@/app/Routes/PrivateRoute";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Eye, Edit3, Menu, X, Download } from "lucide-react";
import { ResumeForm } from "@/components/forms/ResumeForms/ResumeForm";
import ResumePreview from "@/components/resumePreview/ResumePreview";
import { exportResumeHandler } from "@/utils/exportResume";
import { ResumeNavbar } from "@/components/layout/ResumeNavbar";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import axios from "axios";
import { LoadingSpinner } from "../dashboard/components/Loading";

const MySwal = withReactContent(Swal);

const ResumePage = () => {
const [isMobilePreviewMode, setIsMobilePreviewMode] = useState(false);

  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isLoadingDraft, setIsLoadingDraft] = useState(true);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  const router = useRouter();

  // ------------------------------
  // Fetch userEmail (from localStorage or auth)
  // ------------------------------
  useEffect(() => {
    if (typeof window !== "undefined") {
      const email = localStorage.getItem("userEmail");
      setUserEmail(email);
    }
  }, []);

  // ------------------------------
  // Check for existing draft
  // ------------------------------
 useEffect(() => {
  const checkDraft = async () => {
    if (!userEmail) {
      setIsLoadingDraft(false);
      return;
    }

    const localDraftId = localStorage.getItem("resume_draft_id");

    if (localDraftId) {
      setIsLoadingDraft(false);
      MySwal.fire({
        title: "Draft Found!",
        html: "You have a saved draft resume. Do you want to continue editing or start a new one?",
        icon: "info",
        showCancelButton: true,
        confirmButtonText: "Continue Draft",
        cancelButtonText: "Start New",
        reverseButtons: true,
      }).then((result) => {
        if (result.isConfirmed) {
          router.push(`/resume/${localDraftId}`);
        } else {
          localStorage.removeItem("resume_draft_id");
          localStorage.removeItem("resumeCurrentStep");
        }
      });
    } else {
      try {
        const res = await axios.get(`/api/getResume?userEmail=${userEmail}&latestDraft=true`);
        if (res.data?.success && res.data?.resume) {
          const resume = res.data.resume;
          MySwal.fire({
            title: "Resume Draft Found!",
            html: "A saved draft is available from your account. Continue editing?",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Yes, Continue",
            cancelButtonText: "Start New",
            reverseButtons: true,
          }).then((result) => {
            if (result.isConfirmed) {
              localStorage.setItem("resume_draft_id", resume.id);
              router.push(`/resume/${resume.id}`);
            }
          });
        } else {
          
          setIsLoadingDraft(false);
        }
      } catch (err) {
        console.error("❌ Error fetching draft:", err);
        setIsLoadingDraft(false); 
      }
    }
  };

  checkDraft();
}, [userEmail, router]);


  // ------------------------------
  // Mobile sidebar toggle
  // ------------------------------
  const toggleSidebar = () => setIsMobileSidebarOpen((prev) => !prev);

  if (isLoadingDraft) {
    return (
      <div className="flex justify-center items-center h-screen bg-muted/30 text-lg font-medium">
        <LoadingSpinner/>
      </div>
    );
  }

  return (
    <PrivateRoute>
      <ResumeProvider>
        <div className="min-h-screen bg-gradient-to-br from-background to-muted">
          {/* Mobile Header */}
          <div className="lg:hidden flex items-center justify-between p-4 bg-card border-b border-border sticky top-0 z-50">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" onClick={toggleSidebar}>
                {isMobileSidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              </Button>
              <h1 className="text-lg font-semibold text-foreground">Resume Builder</h1>
            </div>

            <div className="flex gap-2">
             <Button
  variant={isMobilePreviewMode ? "secondary" : "default"}
  size="sm"
  onClick={() => {
    setIsMobilePreviewMode(!isMobilePreviewMode);
    setIsMobileSidebarOpen(false); 
  }}
  className="flex items-center gap-2"
>
  {isMobilePreviewMode ? (
    <>
      <Edit3 className="h-4 w-4" /> Edit
    </>
  ) : (
    <>
      <Eye className="h-4 w-4" /> Preview
    </>
  )}
</Button>


              <Button
                variant="default"
                size="sm"
                onClick={exportResumeHandler}
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" /> Export
              </Button>
            </div>
          </div>

          {/* Main Layout */}
          <div className="flex flex-col lg:flex-row h-screen">
            {/* Form Panel */}
<div
  className={`flex-1 lg:flex-none lg:w-2/5 border-r border-border flex flex-col transition-all duration-300
    ${!isMobilePreviewMode ? "flex" : "hidden lg:flex"}`}
>
  <ResumeForm />
</div>



              {/* Preview Panel */}
            <div
              className={`flex-1 lg:flex-none lg:w-3/5 flex flex-col
                ${isMobilePreviewMode ? "flex" : "hidden lg:flex"}`}>
              <Card className="h-full overflow-y-auto border-0 shadow-none lg:rounded-none">
                <div className="sticky -top-8 bg-card/95 backdrop-blur-sm p-4 z-10">
                  <ResumeNavbar />
                </div>
                <div className="p-6 border m-4 rounded-lg">
                  <ResumePreview />
                </div>
              </Card>
            </div>
          </div>


          {/* Mobile Backdrop */}
          {isMobileSidebarOpen && (
            <div
              className="lg:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
              onClick={() => setIsMobileSidebarOpen(false)}
            />
          )}
        </div>
      </ResumeProvider>
    </PrivateRoute>
  );
};

export default ResumePage;
